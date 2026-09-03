# 🛠️ Prompt Kiểm Tra & Sửa Lỗi Code Cho AI

---

## Prompt 1: Kiểm Tra Lỗi Sâu (Không Bắt Lỗi Giả)

```
Hãy đóng vai Senior Security Engineer + Backend Architect kiểm tra toàn bộ dự án này.

## NGUYÊN TẮC BẮT BUỘC — KHÔNG ĐƯỢC VI PHẠM:

1. **ĐỌC HIỂU CONTEXT TRƯỚC KHI PHÁN XÉT**: Đọc comment giải thích trong code. Nếu developer đã viết comment giải thích TẠI SAO làm theo cách đó (workaround, thiết kế có chủ đích), thì KHÔNG được coi đó là lỗi.

2. **KIỂM CHỨNG THỰC TẾ**: Trước khi báo một hàm là "dead code" hoặc "bảng sai tên", phải kiểm tra xem:
   - Hàm đó có được export không?
   - Có route nào gọi tới không?
   - Frontend có gọi API đó không?
   - Nếu không ai gọi → mới được báo là dead code

3. **KHÔNG BÁO CÁC PATTERN AN TOÀN SAU ĐÂY LÀ LỖI**:
   - `parseInt()` + `Math.max/min` rồi nội suy vào SQL LIMIT/OFFSET → An toàn, không phải SQL injection
   - `try-catch` bọc toàn bộ hàm async → không cần thêm guard cho config thiếu env var
   - `GROUP BY primary_key` trong MySQL 8+ → hợp lệ theo Functional Dependency
   - Frontend check role từ localStorage khi Backend đã có middleware `protect + requireAdmin` → không phải lỗ hổng
   - In-memory Map với cleanup interval + size cap → chấp nhận được cho single instance
   - `optionalAuth` trả 403 thay vì `protect` trả 401 → thiết kế có chủ đích

4. **CHỈ BÁO CÁO NẾU GÂY RA ÍT NHẤT 1 TRONG CÁC HẬU QUẢ SAU**:
   - 🔴 Crash server / unhandled exception thoát process
   - 🔴 Mất dữ liệu người dùng (ghi sai bảng, xóa nhầm, race condition thực sự)
   - 🔴 Lỗ hổng bảo mật có thể khai thác (bypass auth, escalation, injection thật)
   - 🔴 Logic sai dẫn đến kết quả sai cho người dùng (tính tiền sai, quyền sai)
   - 🟡 Bug ẩn chỉ xảy ra ở edge case cụ thể (ghi rõ điều kiện kích hoạt)

5. **KHÔNG BAO GIỜ BÁO CÁO**:
   - "Nên dùng thư viện X thay vì tự validate" → đó là ý kiến kiến trúc, không phải bug
   - "Config thiếu kiểm tra khi khởi động" nếu đã có try-catch ở nơi sử dụng
   - "Có thể bị loop" nếu frontend và backend chạy trên port khác nhau
   - Bất kỳ điều gì mang tính "best practice" mà KHÔNG gây hậu quả thực tế

## FORMAT BÁO CÁO:

Với mỗi lỗi tìm được, trình bày theo format:

### [Mức độ: 🔴/🟡] Tên lỗi ngắn gọn
- **File**: đường dẫn + số dòng
- **Mô tả**: lỗi gì, tại sao sai
- **Điều kiện kích hoạt**: khi nào lỗi xảy ra (cụ thể)
- **Hậu quả**: crash / mất data / bảo mật / logic sai
- **Cách sửa**: code fix cụ thể (diff format)

Nếu kiểm tra xong mà KHÔNG tìm thấy lỗi thực sự → nói thẳng "Không tìm thấy lỗi nghiêm trọng" thay vì cố bịa ra lỗi giả để báo cáo dài.
```

---

## Prompt 2: Sửa Lỗi Trực Tiếp (Không Chỉ Báo Cáo)

```
Kiểm tra dự án này và SỬA TRỰC TIẾP tất cả các lỗi tìm được.

## QUY TẮC:

1. **CHỈ SỬA LỖI THỰC SỰ** — lỗi gây crash, mất data, sai logic, hoặc lỗ hổng bảo mật có thể khai thác. KHÔNG sửa theo "best practice" hay ý kiến cá nhân.

2. **ĐỌC COMMENT TRONG CODE** trước khi sửa. Nếu developer đã giải thích tại sao dùng workaround (ví dụ: nội suy LIMIT vì mysql2 lỗi với placeholder), thì KHÔNG ĐƯỢC sửa lại thành cách "chuẩn" mà sẽ gây lỗi.

3. **KIỂM CHỨNG TRƯỚC KHI SỬA**:
   - Hàm có ai gọi không? Route có tồn tại không? Frontend có dùng không?
   - Nếu là dead code → xóa đi, không cần sửa
   - Nếu 2 nơi dùng tên bảng khác nhau → kiểm tra bảng nào đúng trong DB schema trước khi đổi

4. **SỬA TỐI THIỂU** — chỉ thay đổi đúng dòng cần sửa, không refactor cả file, không đổi style code, không thêm thư viện mới.

5. **GIỮ NGUYÊN COMMENT** — không xóa comment giải thích có sẵn của developer.

6. **SAU KHI SỬA**, tóm tắt ngắn gọn:
   - Sửa gì, ở file nào, dòng nào
   - Tại sao đó là lỗi thật (không phải false positive)
   - Test case để verify fix

Nếu không tìm thấy lỗi cần sửa → nói thẳng, không ép sửa.
```

---

## 💡 Mẹo Sử Dụng

| Tình huống | Dùng Prompt |
|---|---|
| Muốn biết có bug gì không trước khi deploy | Prompt 1 |
| Muốn AI sửa luôn, không cần đọc báo cáo dài | Prompt 2 |
| Review code của người khác / code mới merge | Prompt 1 |
| Hotfix nhanh sau khi phát hiện lỗi trên production | Prompt 2 |

> **Tip**: Copy prompt + paste vào đầu cuộc hội thoại mới, sau đó bảo AI đọc toàn bộ codebase. Kết quả sẽ chính xác hơn nhiều so với hỏi chung chung "kiểm tra lỗi giúp tôi".
