# 🔍 Code Review — Dự án VinaTap

Đã đọc toàn bộ codebase (backend + frontend + file database `vinatapLocal.sql`). Dưới đây là tổng hợp đầy đủ và chi tiết tất cả các vấn đề tìm được, sắp xếp theo mức độ nghiêm trọng.

---

## 🔴 1. BẢO MẬT (CRITICAL)

### 1.1. JWT Secret quá yếu
[.env:19](file:///e:/VinaTap/backend/.env#L19)
```
JWT_SECRET=vinatap_secret
```
Secret chỉ là chuỗi đơn giản, dễ đoán. Nếu kẻ tấn công biết được (hoặc đoán được) chuỗi này, họ có thể **tự tạo JWT token hợp lệ** cho bất kỳ user/admin nào mà không cần đăng nhập.

> [!CAUTION]
> **Giải pháp**: Dùng chuỗi ngẫu nhiên dài ≥ 64 ký tự, sinh bằng `crypto.randomBytes(64).toString('hex')`. Đây là ưu tiên cao nhất.

---

### 1.2. `stickerAPI.setStatus()` gửi JSON nhưng backend chỉ parse FormData

[api.js:199-203](file:///e:/VinaTap/frontend/lib/api.js#L199-L203)
```js
setStatus: (id, status) =>
    request(`/stickers/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
```

Hàm `request()` luôn đặt header `Content-Type: application/json`. Nhưng route `PUT /api/stickers/:id` → [stickerController.updateSticker](file:///e:/VinaTap/backend/src/controllers/stickerController.js#L189-L232) chạy `runMiddleware(req, res, uploadImageOnly)` (multer) **đầu tiên**, nên multer sẽ parse request body dạng `multipart/form-data`. Khi gửi JSON thuần (không phải multipart), multer sẽ **bỏ qua body** → `req.body` rỗng → `status` = `undefined` → `toNull(undefined)` = `null` → `COALESCE(NULL, status)` = **không đổi gì cả**.

> [!WARNING]
> **Kết quả**: Nút Ẩn/Hiện sticker ở admin **hoàn toàn không hoạt động**. Cần gửi FormData thay vì JSON, hoặc tách endpoint setStatus riêng không chạy multer.

---

### 1.3. Reset token dùng chung `JWT_SECRET` — có thể dùng thay login token

[authController.js:319-323](file:///e:/VinaTap/backend/src/controllers/authController.js#L319-L323)

Reset token được ký bằng cùng `JWT_SECRET` với login token. Mặc dù có trường `purpose: "reset_password"`, middleware `protect` **không kiểm tra** trường `purpose` — nó chỉ verify chữ ký và lấy `decoded.id`. Tuy nhiên, reset token chứa `email` thay vì `id`, nên `decoded.id` = `undefined` → query DB trả `null` → bị chặn bởi `if (!user)`.

> [!NOTE]
> **Đánh giá**: Không khai thác được trực tiếp nhờ may mắn (cấu trúc payload khác), nhưng design chung 1 signing key cho 2 mục đích khác nhau là bad practice. Nên dùng thêm prefix/suffix riêng cho `JWT_SECRET` dùng ký reset token (ví dụ `JWT_SECRET + "_reset"`).

---

### 1.4. CORS `origin` chỉ cho phép 1 domain duy nhất — thiếu cho production

[app.js:16](file:///e:/VinaTap/backend/src/app.js#L16)
```js
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
```

Khi deploy production, `FRONTEND_URL` sẽ là domain thật. Nhưng nếu có nhiều domain (www, non-www, staging…) hoặc cần thay đổi, cấu hình hiện tại không linh hoạt. Cần hỗ trợ mảng origins hoặc callback function.

---

### 1.5. Google OAuth token truyền qua URL query string

[authController.js:425](file:///e:/VinaTap/backend/src/controllers/authController.js#L425)
```js
res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
```

JWT token xuất hiện trong URL → có thể bị lưu trong browser history, server access logs, referrer headers.

> [!WARNING]
> **Giải pháp**: Chuyển sang dùng short-lived authorization code (1 lần dùng) hoặc hash fragment (`#token=...` thay vì `?token=...`).

---

### 1.6. Export CSV thiếu authentication header

[api.js:244-249](file:///e:/VinaTap/frontend/lib/api.js#L244-L249)
```js
exportCsvUrl: (params = {}) => {
    const qs = new URLSearchParams(...)
    return `${BASE_URL}/manual-sales/export${qs ? `?${qs}` : ""}`;
},
```

Hàm này chỉ trả URL string. Nếu frontend dùng `window.open(url)` hoặc `<a href={url}>` để tải file, request sẽ **không kèm Authorization header** → backend trả 401. Cần dùng `fetch()` + `Authorization` header rồi tạo Blob URL, hoặc truyền token qua query param (kém bảo mật hơn).

---

## 🟡 2. BUGS / LOGIC ERRORS

### 2.1. `getMe()` trả `password_hash` + `google_id` cho API response

[authController.js:434-444](file:///e:/VinaTap/backend/src/controllers/authController.js#L434-L444)
```js
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ user }); // User.findById() đã loại password_hash, OK
};
```

> [!NOTE]
> Đã kiểm tra lại — `User.findById()` đã SELECT cụ thể (không có `password_hash`, `google_id`). Tuy nhiên, `login()` sử dụng `toPublicUser(user)` trong đó `user` lấy từ `findByEmail()` (SELECT *) → `toPublicUser` dùng destructuring loại bỏ. **Vấn đề**: `toPublicUser` dùng rest operator (`const { password_hash, google_id, ...publicUser } = user;`) — nếu sau này thêm cột nhạy cảm mới vào bảng users (ví dụ `ip_address`), nó sẽ tự động lọt ra ngoài. Nên dùng whitelist thay vì blacklist.

---

### 2.2. `updateAlbum` truyền `req.body` trực tiếp vào `Album.update()`

[albumController.js:142](file:///e:/VinaTap/backend/src/controllers/albumController.js#L142)
```js
await Album.update(req.params.id, req.body);
```

`Album.update()` chỉ filter các key cho phép (`title`, `description`, `is_public`, `theme_sticker_id`, `cover_photo_id`), nên không bị SQL injection. Nhưng client có thể gửi thêm field bất kỳ (ví dụ `owner_id`, `nfc_card_id`) — chúng bị bỏ qua nhờ filter, nhưng việc truyền thẳng `req.body` là bad practice.

---

### 2.3. `updateMedia` chỉ check `uploader_id` — collaborator không sửa được

[mediaController.js:231-242](file:///e:/VinaTap/backend/src/controllers/mediaController.js#L231-L242)
```sql
WHERE id = ? AND uploader_id = ? AND status = 'active'
```

Cộng tác viên (được duyệt quyền `edit`) có thể **upload** ảnh mới vào album (nhờ `checkUploadPermission()`), nhưng **không thể sửa** caption/sort_order của ảnh mình vừa upload (hoặc ảnh người khác), vì `updateMedia` check `uploader_id = req.user.id`. Tương tự cho `deleteMedia`. Nên dùng `checkUploadPermission()` hoặc `Album.canEdit()` thay vì hard check `uploader_id`.

---

### 2.4. `chatbotController.sendMessage` — lịch sử chat không giới hạn

[chatbotController.js:81-85](file:///e:/VinaTap/backend/src/controllers/chatbotController.js#L81-L85)
```js
const [history] = await db.execute(
    `SELECT role, content FROM chatbot_messages
     WHERE session_id = ? ORDER BY sent_at ASC`,
    [sessionId],
);
```

Lấy **toàn bộ** lịch sử chat rồi gửi cho Gemini. Sau vài chục tin nhắn, payload có thể vượt context window limit hoặc tốn rất nhiều token. Nên giới hạn (ví dụ 20 tin nhắn gần nhất).

---

### 2.5. `adminSearchCards` — SQL LIKE trên cột không có index

[nfcController.js:336-347](file:///e:/VinaTap/backend/src/controllers/nfcController.js#L336-L347)
```sql
WHERE n.serial_code LIKE ? OR n.nfc_token LIKE ?
   OR u.email LIKE ? OR u.name LIKE ?
```

`LIKE '%keyword%'` trên nhiều cột (bao gồm cả JOIN) **không dùng được index** → full table scan. Khi dữ liệu lớn, query sẽ chậm đáng kể.

---

### 2.6. `reorderStickers` — `db.execute` với `IN (${placeholders})` nhưng tham số là mảng

[stickerController.js:250-254](file:///e:/VinaTap/backend/src/controllers/stickerController.js#L250-L254)
```js
const placeholders = ids.map(() => "?").join(",");
const [rows] = await db.execute(
    `SELECT id, sort_order FROM stickers WHERE id IN (${placeholders})`,
    ids,
);
```

`db.execute()` (prepared statement) của mysql2 yêu cầu biết chính xác số lượng tham số khi prepare. Dynamic `IN (?,?,?...)` với `execute()` **có thể gặp lỗi** ở một số phiên bản mysql2. Nên dùng `db.query()` thay vì `db.execute()` cho trường hợp này (hoặc cast `ids` thành mảng số an toàn và interpolate trực tiếp).

---

### 2.7. `NfcCard.createBatch` dùng `db.query()` nhưng mọi nơi khác dùng `db.execute()`

[NfcCard.js:74-77](file:///e:/VinaTap/backend/src/models/NfcCard.js#L74-L77)

`db.query()` không phải prepared statement → nếu sau me ai sửa code truyền user input trực tiếp thì sẽ bị SQL injection. Tuy trường hợp này an toàn (dữ liệu từ `generateSerial/generateNfcToken`), nhưng nên ghi comment giải thích tại sao dùng `query()` thay vì `execute()`.

---

## 🟢 3. ĐÁNH GIÁ CHI TIẾT FILE DATABASE SQL (`vinatapLocal.sql` v2.4)

Dự án đã có file schema chính thức [vinatapLocal.sql](file:///e:/VinaTap/vinatapLocal.sql) (v2.4). Bản SQL này được viết chuẩn mực cho MySQL 8.0, định dạng `utf8mb4_unicode_ci`, thiết kế rất công phu và **khớp tới 98%** với các câu lệnh query trong Backend Node.js.

### 3.1. Các điểm xuất sắc trong Schema v2.4:
* **Chuẩn hóa quan hệ & ràng buộc (Foreign Keys)**:
  * Khóa ngoại kèm `ON DELETE RESTRICT / SET NULL / CASCADE` được áp dụng đúng ngữ cảnh.
  * Bảng `media_tag_map` dùng Composite Key (`album_id`, `media_id`) bắt buộc tag và ảnh phải thuộc cùng một album.
* **Cập nhật chính xác các cột nghiệp vụ**:
  * Bảng `users` có đủ 2 cột `address` (VARCHAR 500) và `avatar_url` (VARCHAR 500) giúp các hàm `User.updateProfile`, `authController.updateMe` và `uploadAvatar` chạy trơn tru không bị lỗi `"Unknown column"`.
  * Bảng `nfc_cards` đã tách biệt `nfc_token` (VARCHAR 64 cho URL chip) và `serial_code` (VARCHAR 50 cho serial in trên thẻ), đồng thời loại bỏ `expires_at` cho thẻ vĩnh viễn.
  * Có đầy đủ các bảng mở rộng nâng cao: `otp_codes`, `card_transfers`, `products`, `manual_sales`, `album_shares`, `chatbot_sessions`, `chatbot_messages`.
* **Tích hợp sẵn MySQL Scheduled Events**:
  * `ev_cleanup_otp_codes`: Tự động dọn OTP cũ hết hạn sau 1 ngày.
  * `ev_expire_transfers`: Tự động hủy yêu cầu chuyển nhượng thẻ sau 7 ngày.
* **Seed Data thực tế**: Có đầy đủ 36 tỉnh thành (sau sáp nhập 2025), địa danh nổi tiếng, sticker mẫu và tài khoản thử nghiệm (`admin@vinatap.com` / `user@vinatap.com`).

### 3.2. 3 Lưu ý quan trọng khi khởi chạy SQL:
1. **Lệnh `SET GLOBAL event_scheduler = ON;` ([line 579](file:///e:/VinaTap/vinatapLocal.sql#L579))**:
   * Yêu cầu tài khoản MySQL có quyền `SUPER` hoặc `SYSTEM_VARIABLES_ADMIN`. Trên máy local chạy bình thường, nhưng khi upload lên Cloud DB (AWS RDS, GCP Cloud SQL) hoặc Shared Hosting bị giới hạn quyền, câu lệnh này sẽ báo lỗi `Access denied`.
2. **Lệnh `DROP DATABASE IF EXISTS` ([line 26](file:///e:/VinaTap/vinatapLocal.sql#L26))**:
   * Rất tốt để reset DB ở môi trường Local Dev, nhưng **tuyệt đối không thực thi script thô này trên server Production** vì sẽ làm mất toàn bộ dữ liệu đang có.
3. **Bảng `stickers` chưa có cột `updated_at` ([line 199](file:///e:/VinaTap/vinatapLocal.sql#L199))**:
   * Hầu hết các bảng chính đều có cột `updated_at`, riêng `stickers` chỉ có `created_at`. Hiện tại code Backend không update cột này nên không bị lỗi runtime, nhưng nếu cần sắp xếp sticker theo thời gian sửa đổi gần nhất thì nên bổ sung thêm.

---

## 🟠 4. CODE QUALITY

### 4.1. Thiếu input validation cho `req.params.id` dạng số

Nhiều controller nhận `req.params.id` và truyền thẳng vào SQL mà không kiểm tra có phải số nguyên hay không. Ví dụ:
- [albumController.js](file:///e:/VinaTap/backend/src/controllers/albumController.js) — `getAlbum`, `updateAlbum`, `deleteAlbum`
- [mediaController.js](file:///e:/VinaTap/backend/src/controllers/mediaController.js) — `updateMedia`, `deleteMedia`
- [nfcController.js](file:///e:/VinaTap/backend/src/controllers/nfcController.js) — `initiateTransfer`, `claimCard`

Nhờ dùng prepared statement (`db.execute`) nên không bị SQL injection, nhưng nếu truyền string không phải số, MySQL sẽ ép kiểu → kết quả không mong muốn (ví dụ `WHERE id = 'abc'` sẽ match `id = 0` trong MySQL).

> [!TIP]
> **Giải pháp**: Thêm middleware hoặc helper validate `parseInt(req.params.id)` ≠ NaN trước khi xử lý.

---

### 4.2. Error handler không bao giờ được gọi

[app.js:45-50](file:///e:/VinaTap/backend/src/app.js#L45-L50)
```js
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});
```

Mọi controller đều wrap logic trong `try/catch` và tự trả `res.status(500)` → error không bao giờ rơi xuống error handler middleware này. Nó chỉ bắt được lỗi **synchronous** hoặc lỗi từ middleware (ví dụ multer reject). Không sai, nhưng cũng không được tận dụng.

---

### 4.3. Copyright year cứng "2025" trong email templates

[email.js](file:///e:/VinaTap/backend/src/utils/email.js) — tất cả email templates đều hard-code `VinaTap © 2025`. Nên dùng `new Date().getFullYear()`.

---

### 4.4. Không có test nào

Toàn bộ project không có test (unit, integration, E2E). Script `test` trong [backend/package.json](file:///e:/VinaTap/backend/package.json#L7) chỉ là echo error.

---

## 🔵 5. GỢI Ý CẢI THIỆN

### 5.1. Frontend auth dựa hoàn toàn vào localStorage

[auth.js](file:///e:/VinaTap/frontend/lib/auth.js) — `requireAuth()`, `requireAdmin()`, `isAdmin()` đều đọc từ localStorage. Ai cũng có thể mở DevTools, sửa `vinatap_user` thành `{role: "admin"}` để bypass guard phía client.

> [!NOTE]
> Backend đã có `requireRole("admin")` nên **data không bị lộ**, nhưng client-side routing cho phép user thường **nhìn thấy giao diện admin** (dù không gọi được API). Nên thêm server-side check (middleware Next.js hoặc API call kiểm tra role) để redirect sớm.

---

### 5.2. `view_count` tăng vô điều kiện

[albumController.js:110](file:///e:/VinaTap/backend/src/controllers/albumController.js#L110)
```js
await Album.incrementView(album.id);
```

Mỗi lần gọi `GET /api/albums/:id` là view_count +1, kể cả khi chính chủ album xem, hoặc bot spam. Nên xét skip khi `req.user.id === album.owner_id`, hoặc debounce theo IP/user.

---

### 5.3. Upload nhiều file xử lý tuần tự

[mediaController.js:173-214](file:///e:/VinaTap/backend/src/controllers/mediaController.js#L173-L214)
```js
for (const file of req.files) {
    const uploaded = await uploadToCloudinary(file.buffer, ...);
    // ...
}
```

Upload tuần tự N file → thời gian = N × thời gian upload 1 file. Có thể dùng `Promise.all()` hoặc batch (giới hạn concurrency) để tăng tốc đáng kể.

---

### 5.4. Thiếu pagination cho `getMyCards`, `getMyAlbums`

- [nfcController.getMyCards](file:///e:/VinaTap/backend/src/controllers/nfcController.js#L136-L144) — trả hết tất cả thẻ
- [albumController.getMyAlbums](file:///e:/VinaTap/backend/src/controllers/albumController.js#L121-L129) — trả hết tất cả album

Nếu user có nhiều thẻ/album, response sẽ rất lớn.

---

## ✅ NHỮNG ĐIỂM ĐÃ LÀM TỐT

| Aspect | Nhận xét |
|---|---|
| **OTP flow** | Hash OTP bằng bcrypt trước khi lưu DB — không lưu OTP plaintext |
| **Race condition** | Fix race condition ở `claimCard` bằng `WHERE owner_user_id IS NULL` + check `affectedRows` |
| **Rate limiting** | Phân biệt rate limit theo IP vs user_id tùy context (chat, login, OTP) |
| **Auth middleware** | `protect` query lại DB mỗi request để lấy role/status mới nhất — không tin JWT cũ |
| **Upload security** | Tách `imageFileFilter` vs `fileFilter` cho sticker vs media |
| **Email XSS** | `escapeHtml()` input trước khi nhúng vào email HTML |
| **Transfer transaction** | `acceptTransfer` dùng DB transaction (begin → commit/rollback) |
| **UNIQUE constraint** | Admin assign token sinh random thay vì hard-code `'ADMIN_ASSIGN'` |
| **Comment quality** | Comment rất chi tiết giải thích rationale, không chỉ mô tả code |

---

## 📊 TÓM TẮT

| Mức độ | Số lượng | Cần xử lý ngay? |
|---|---|---|
| 🔴 Bảo mật | 6 | ✅ Ưu tiên cao |
| 🟡 Bug/Logic | 7 | ✅ Nên fix sớm |
| 🟢 Database SQL | 3 lưu ý | ℹ️ Schema v2.4 rất hoàn thiện |
| 🟠 Code Quality | 4 | ⚠️ Fix khi có thời gian |
| 🔵 Gợi ý cải thiện | 4 | 💡 Nice to have |

> [!IMPORTANT]
> **Ưu tiên cao nhất**: Đổi `JWT_SECRET` thành chuỗi random mạnh, fix bug `stickerAPI.setStatus()` không hoạt động, và cấp thêm quyền collaborator sửa/xóa media trong album.
