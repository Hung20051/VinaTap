# 🔒 BÁO CÁO KIỂM TRA BẢO MẬT & KIẾN TRÚC — VinaTap

**Ngày kiểm tra:** 2026-09-03  
**Vai trò:** Senior Security Engineer + Backend Architect  
**Phạm vi:** Toàn bộ backend (controllers, models, middleware, routes, config, utils)

---

## TỔNG QUAN

Dự án VinaTap có kiến trúc tương đối chắc chắn với nhiều biện pháp bảo mật đã được triển khai có chủ đích:

- ✅ Auth middleware `protect` query lại DB mỗi request (chặn tài khoản bị ban ngay cả khi token còn hạn)
- ✅ OTP được hash bằng bcrypt trước khi lưu DB (giống password)
- ✅ Reset password dùng JWT secret riêng biệt (`JWT_SECRET + "_reset_pwd"`)
- ✅ NFC claim xử lý race condition bằng `WHERE owner_user_id IS NULL` + kiểm tra `affectedRows`
- ✅ Transfer thẻ NFC sử dụng `SELECT ... FOR UPDATE` + transaction
- ✅ Order tính giá 100% từ DB (zero client trust), voucher validate + apply trong transaction
- ✅ Rate limit đầy đủ cho các endpoint nhạy cảm (OTP, login, order, chatbot)
- ✅ Socket.io kiểm tra quyền truy cập album private và room notification cá nhân
- ✅ Webhook xác thực bằng secret key, chặn nếu thiếu trên production
- ✅ LIMIT/OFFSET sử dụng `parseInt()` + `Math.max/min` rồi chèn vào SQL — an toàn, không phải injection
- ✅ In-memory Map có cleanup interval + size cap — chấp nhận được cho single instance (đã comment rõ)
- ✅ `optionalAuth` trả 403 thay vì `protect` trả 401 cho `checkOrderStatus` — thiết kế có chủ đích

Dưới đây là **các lỗi thực sự** tìm được:

---

## CÁC LỖI TÌM ĐƯỢC

---

### [Mức độ: 🔴] IDOR — Admin `updateOrderStatus` không validate giá trị `status` đầu vào trước khi gọi `Order.updateStatus`

- **File**: [orderController.js](file:///e:/VinaTap/backend/src/controllers/orderController.js#L104-L108) → dòng 106-108
- **Mô tả**: `updateOrderStatus` controller nhận `status` từ `req.body` và truyền thẳng vào `Order.updateStatus(id, status)`. Mặc dù model `Order.updateStatus` có whitelist `validStatuses` kiểm tra, nhưng controller còn có logic riêng phía dưới (dòng 112-161) gửi notification khi `status === "paid"`. Vấn đề thực sự là tham số `id` từ `req.params.id` **không được validate là số nguyên**. Nếu attacker gửi `id` là string đặc biệt, MySQL sẽ tự ép kiểu nhưng có thể gây ra hành vi không mong đợi.
  
  **Tuy nhiên**, sau khi kiểm tra kỹ hơn, `db.execute` sử dụng prepared statement nên `id` được escape an toàn. Model cũng validate `status` whitelist. → **Đây thực ra KHÔNG phải lỗi nghiêm trọng, hạ xuống quan sát.**

---

### [Mức độ: 🟡] Race condition khi validate voucher — `validateOrderVoucherOnly` kiểm tra `usage_limit` NGOÀI transaction

- **File**: [Voucher.js](file:///e:/VinaTap/backend/src/models/Voucher.js#L243-L245) → dòng 243-245 và [Order.js](file:///e:/VinaTap/backend/src/models/Order.js#L93-L107) → dòng 93-107
- **Mô tả**: `Order.create()` gọi `Voucher.validateOrderVoucherOnly()` **TRƯỚC** khi mở transaction (dòng 99). Hàm này kiểm tra `v.used_count >= v.usage_limit` bằng SELECT thường (không lock). Sau đó, bên trong transaction mới `UPDATE vouchers SET used_count = used_count + 1`. 
  
  Nếu 2 request đồng thời cùng dùng voucher có `usage_limit = 1`, cả 2 đều đọc `used_count = 0` → cả 2 đều pass validate → cả 2 đều tăng `used_count` → voucher bị dùng **2 lần** dù giới hạn chỉ 1 lần.
  
- **Điều kiện kích hoạt**: Hai user khác nhau (hoặc cùng 1 user trên 2 tab) đặt hàng COD gần như đồng thời với cùng voucher có `usage_limit` nhỏ (1-2). Xác suất không cao trong thực tế nhưng có thể exploit cố ý.
- **Hậu quả**: Voucher bị sử dụng vượt quá giới hạn `usage_limit`. Mất tiền discount.
- **Cách sửa**:

```diff
 // Trong Order.create(), chuyển validate voucher VÀO TRONG transaction:
 const conn = await db.getConnection();
 try {
   await conn.beginTransaction();
   
+  // Validate voucher BÊN TRONG transaction với SELECT FOR UPDATE
+  let discountAmount = 0;
+  let isFreeshipVoucher = false;
+  let voucherForApply = null;
+  if (voucherCode && voucherCode.trim()) {
+    const cleanCode = voucherCode.trim().toUpperCase();
+    const [vRows] = await conn.execute(
+      `SELECT * FROM vouchers WHERE UPPER(code) = ? LIMIT 1 FOR UPDATE`,
+      [cleanCode]
+    );
+    // ... validate logic tương tự validateOrderVoucherOnly nhưng dùng conn ...
+  }
-  // Nếu tạo đơn VietQR mới, tự động hủy...
```

---

### [Mức độ: 🟡] Google OAuth callback không kiểm tra status tài khoản khi user đã link Google trước đó

- **File**: [authController.js](file:///e:/VinaTap/backend/src/controllers/authController.js#L414-L444) → dòng 414-442
- **Mô tả**: Khi user đã có `google_id` (đã link Google trước đó), hàm `googleCallback` chạy nhánh `user = await User.findByGoogleId(google_id)` (dòng 414). Hàm `findByGoogleId` (User.js dòng 38-43) có filter `AND status = 'active'`, nên tài khoản bị ban sẽ return `null`.

  Khi `user = null`, flow rơi xuống nhánh `if (!user)` → tìm theo email → nhánh `byEmail`. Nếu tài khoản đã bị ban nhưng `google_id` đã được set trước đó, `findByGoogleId` trả `null` (vì filter active), rồi `findByEmailAny` sẽ tìm thấy tài khoản (không filter status). Code đã xử lý case `byEmail.status !== 'active'` ở dòng 422-428 → redirect tới `?error=account_banned`. **Vậy flow này AN TOÀN.**

  **Tuy nhiên**, có 1 edge case: Nếu admin ban 1 tài khoản rồi **xóa google_id** khỏi DB (reset link Google), và user đăng nhập lại bằng Google → `findByGoogleId` trả null → `findByEmailAny` tìm thấy → status check chặn đúng. OK.

  → **Sau kiểm tra kỹ: flow này đã xử lý đúng.** Hạ mức.

---

### [Mức độ: 🟡] `checkOrderStatus` cho phép user không đăng nhập nhìn thấy lỗi 403 xác nhận đơn hàng tồn tại (Information Disclosure nhỏ)

- **File**: [orderController.js](file:///e:/VinaTap/backend/src/controllers/orderController.js#L174-L208) → dòng 174-208, [orders.js](file:///e:/VinaTap/backend/src/routes/orders.js#L15) → dòng 15
- **Mô tả**: Route `GET /api/orders/check-status/:orderCode` sử dụng `optionalAuth` (không bắt buộc login). Khi **không đăng nhập** (req.user = undefined), `isOwner` sẽ luôn `false` → response 403 "Bạn không có quyền xem trạng thái đơn hàng này". Điều này vô tình **xác nhận rằng mã đơn hàng đó tồn tại** (khác với 404 khi mã không tồn tại).
  
  Một attacker có thể dò xem mã đơn nào hợp lệ bằng cách phân biệt 404 vs 403.
  
- **Điều kiện kích hoạt**: Attacker gửi hàng loạt request thử mã đơn (VNTxxxxxxxx) mà không đăng nhập. Phân biệt 404 (không tồn tại) và 403 (tồn tại nhưng không có quyền).
- **Hậu quả**: Rò rỉ thông tin đơn hàng nào tồn tại trên hệ thống. Mức độ nghiêm trọng thấp vì mã đơn random 8 byte hex, rất khó brute-force. Thêm `orderCheckLimiter` (60 req/phút) cũng đã giảm thiểu.
- **Cách sửa**: Trả cùng 1 response cho cả 2 trường hợp không có quyền:

```diff
-    if (!isOwner) {
-      return res
-        .status(403)
-        .json({ message: "Bạn không có quyền xem trạng thái đơn hàng này" });
+    if (!isOwner) {
+      return res
+        .status(404)
+        .json({ message: "Không tìm thấy đơn hàng" });
     }
```

---

### [Mức độ: 🟡] `acceptTransfer` không catch lỗi rollback trong catch block

- **File**: [nfcController.js](file:///e:/VinaTap/backend/src/controllers/nfcController.js#L447-L453) → dòng 447-453
- **Mô tả**: Trong hàm `acceptTransfer`, block `catch` ở dòng 447 gọi `await conn.rollback()` trực tiếp **không bọc try-catch**. Nếu connection đã bị đóng/lỗi mạng tại thời điểm rollback, `conn.rollback()` sẽ throw exception, che mất lỗi gốc ban đầu và có thể crash nếu không có error handler bắt kịp.
  
  So sánh với `initiateTransfer` (dòng 323-328) đã bọc rollback trong try-catch riêng — **thiếu nhất quán**.

- **Điều kiện kích hoạt**: Connection pool bị exhaust hoặc DB mất kết nối đúng lúc xảy ra lỗi trong transaction.
- **Hậu quả**: Unhandled exception có thể crash hoặc leak connection (finally vẫn chạy `conn.release()` nên connection không bị leak, nhưng lỗi gốc bị che mất khiến khó debug).
- **Cách sửa**:

```diff
   } catch (err) {
-    await conn.rollback();
+    try { await conn.rollback(); } catch (rbErr) { console.error("Rollback error:", rbErr); }
     console.error("acceptTransfer:", err);
     res.status(500).json({ message: "Lỗi server khi tiếp nhận thẻ" });
   } finally {
```

---

### [Mức độ: 🟡] `vinatapLocal.sql` được git track dù `.gitignore` có rule `*.sql`

- **File**: [.gitignore](file:///e:/VinaTap/.gitignore#L31-L32) → dòng 31-32, [vinatapLocal.sql](file:///e:/VinaTap/vinatapLocal.sql)
- **Mô tả**: `.gitignore` có rule `*.sql` và `vinatapLocal.sql`, nhưng file `vinatapLocal.sql` **vẫn tồn tại trong repo** (32KB). Nếu file này đã được `git add` trước khi thêm rule vào `.gitignore`, nó sẽ vẫn được track. File SQL dump có thể chứa cấu trúc bảng, dữ liệu mẫu, hoặc thông tin nhạy cảm.
- **Điều kiện kích hoạt**: File đã được commit vào git history trước khi có rule ignore.
- **Hậu quả**: Lộ cấu trúc database, có thể chứa dữ liệu test nhạy cảm.
- **Cách sửa**:

```bash
git rm --cached vinatapLocal.sql
git commit -m "Remove tracked SQL dump file"
```

---

### [Mức độ: 🟡] `createBatch` tìm province bằng `LIKE` có thể match sai province

- **File**: [nfcController.js](file:///e:/VinaTap/backend/src/controllers/nfcController.js#L491-L494) → dòng 491-494
- **Mô tả**: Khi truyền `product_id` thay vì `province_id`, code tìm province bằng:
  ```sql
  SELECT id FROM provinces WHERE name LIKE ? OR ? LIKE CONCAT('%', name, '%') LIMIT 1
  ```
  Với params `[`%${prod.name}%`, prod.name]`. Điều kiện `OR ? LIKE CONCAT('%', name, '%')` rất lỏng — ví dụ product tên "Mảnh ghép NFC 3D Đà Nẵng - Bến Hàn" sẽ match province "Đà Nẵng" **nhưng cũng có thể match** province "Hà Nội" nếu name chứa substring trùng. `LIMIT 1` chỉ lấy kết quả đầu tiên (không xác định thứ tự) → có thể gán sai province.

- **Điều kiện kích hoạt**: Admin tạo batch NFC bằng `product_id` thay vì `province_id` trực tiếp, và tên sản phẩm chứa substring trùng với nhiều province.
- **Hậu quả**: NFC cards bị gán sai tỉnh thành → hiển thị sai thông tin cho khách hàng.
- **Cách sửa**: Thêm cột `province_id` trực tiếp vào bảng `products`, hoặc ít nhất log warning khi LIKE match nhiều kết quả:

```diff
  const [provRows] = await db.execute(
-   `SELECT id FROM provinces WHERE name LIKE ? OR ? LIKE CONCAT('%', name, '%') LIMIT 1`,
-   [`%${prod.name}%`, prod.name],
+   `SELECT id FROM provinces WHERE name LIKE ? LIMIT 1`,
+   [`%${prod.name}%`],
  );
+ if (provRows.length === 0) {
+   // Fallback: thử match ngược
+   // Nhưng log warning
+ }
```

---

## KHÔNG TÌM THẤY LỖI Ở CÁC KHU VỰC SAU

Những pattern dưới đây đã được kiểm tra kỹ và **KHÔNG có lỗi**:

| Khu vực | Kết luận |
|---------|----------|
| SQL Injection toàn bộ project | ✅ An toàn — tất cả query dùng `db.execute` với parameterized `?`. LIMIT/OFFSET dùng `parseInt + Math.max/min` rồi chèn thẳng — an toàn. |
| Auth bypass | ✅ An toàn — tất cả admin route đều có `protect + requireAdmin/requireRole("admin")`. Role check lại từ DB mỗi request. |
| NFC claim race condition | ✅ Đã fix — `WHERE owner_user_id IS NULL` + check `affectedRows`. |
| NFC transfer race condition | ✅ Đã fix — `SELECT FOR UPDATE` trong transaction. |
| Order pricing manipulation | ✅ An toàn — giá 100% query từ DB, không trust client. |
| Webhook spoofing | ✅ An toàn — verify secret key qua header, chặn nếu thiếu key trên production. |
| Upload file type bypass | ✅ An toàn — multer `fileFilter` check mimetype, có filter riêng cho image-only. |
| OTP brute-force | ✅ An toàn — rate limit + max attempts per OTP + OTP hashed. |
| Password hash | ✅ bcrypt cost 12, đủ an toàn. |
| Socket.io room hijacking | ✅ An toàn — kiểm tra quyền khi join album private và room notification cá nhân. |
| Maintenance mode bypass | ✅ An toàn — admin check JWT trực tiếp + query DB, whitelist đúng routes cần thiết. |
| CORS config | ✅ An toàn — whitelist origins, cho phép no-origin (server-to-server), dev mode bypass hợp lý. |
| Email enumeration | ✅ An toàn — forgot-password trả response giống nhau dù email có hay không. |
| Self-lock/self-demote | ✅ Đã chặn — admin không thể ban/đổi role chính mình. |
| Voucher refund khi hủy đơn | ✅ Logic chính xác — chỉ refund khi đơn thực sự đã tiêu voucher. |
| CSV injection | ✅ An toàn — `escapeCsvCell` escape đúng chuẩn CSV. |

---

## TÓM TẮT

| Mức độ | Số lượng | Mô tả |
|--------|----------|-------|
| 🔴 Nghiêm trọng | **0** | Không tìm thấy lỗi crash/mất dữ liệu/bypass auth nghiêm trọng |
| 🟡 Edge case | **5** | Voucher race condition, information disclosure nhỏ, rollback inconsistency, SQL dump tracked, province LIKE match sai |

> **Nhận xét chung**: Codebase được viết cẩn thận với nhiều comment giải thích thiết kế. Các lỗ hổng phổ biến (SQL injection, auth bypass, IDOR) đã được xử lý tốt. Các lỗi tìm được chủ yếu là edge case với xác suất xảy ra thấp trong thực tế. Lỗi đáng chú ý nhất là **voucher race condition** — nên cân nhắc chuyển validate voucher vào trong transaction.
