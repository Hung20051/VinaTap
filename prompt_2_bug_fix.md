# ⚡ Prompt 2: Safe Bug Fix & Verification (Universal Standard)

> **Mục đích**: Yêu cầu AI đóng vai **Senior Full-stack Engineer** tiến hành kiểm tra và sửa trực tiếp các lỗi tồn tại trong mã nguồn theo các nguyên tắc an toàn phần mềm, không phá vỡ kiến trúc, không làm vỡ API contract và đảm bảo build 100% pass.

---

```markdown
Hãy đóng vai Senior Full-stack Engineer tiến hành KIỂM TRA và SỬA TRỰC TIẾP các lỗi tồn tại trong mã nguồn theo các nguyên tắc an toàn phần mềm:

## 🛠️ NGUYÊN TẮC SỬA MÃ NGUỒN BẮT BUỘC:

1. **CHỈ SỬA LỖI THỰC TẾ (ZERO UNNECESSARY REFACTOR)**:
   - Chỉ can thiệp vào các đoạn mã gây crash, lỗi logic, sai lệch database, race condition hoặc lỗ hổng bảo mật đã được xác thực.
   - Không tự ý refactor cấu trúc, không đổi thư viện, không thay đổi phong cách viết code (coding style/formatting) của dự án.

2. **BẢO TOÀN HỢP ĐỒNG GIAO TIẾP (API CONTRACT & BACKWARD COMPATIBILITY)**:
   - Giữ nguyên cấu trúc dữ liệu JSON phản hồi (Response Schema) giữa Backend và Frontend trừ khi có yêu cầu thay đổi cả hai phía.
   - Đảm bảo tính tương thích ngược cho các module, mobile app hoặc client đang tiêu thụ API.

3. **KHỚP 100% VỚI DATABASE SCHEMA THỰC TẾ**:
   - Mọi câu lệnh thao tác dữ liệu (ORM, Query Builder, Raw SQL) phải khớp chính xác với định nghĩa bảng, tên cột và kiểu dữ liệu trong Schema/Migrations (`.sql`, Prisma, Drizzle...).
   - Tuyệt đối không phỏng đoán tên cột hoặc giả định trường dữ liệu không có trong schema.

4. **PHÒNG CHỐNG HỎNG CHÉO (REGRESSION PREVENTION & CALL GRAPH CHECK)**:
   - Trước khi sửa một hàm, method hoặc component, phải quét tất cả các nơi đang gọi (Usage Sites / Call Graph) để đảm bảo thay đổi không làm gãy các tính năng phụ thuộc khác.

5. **ĐẢM BẢO TÍNH NGUYÊN TỬ (TRANSACTION & CONCURRENCY SAFETY)**:
   - Nếu bản sửa lỗi liên quan đến cập nhật nhiều bảng DB hoặc trừ tồn kho/số dư/voucher, bắt buộc phải bọc trong Transaction (`BEGIN` -> `COMMIT` / `ROLLBACK`) và khóa dòng (`FOR UPDATE`) để chống Race Condition.

6. **BẢO VỆ CẤU HÌNH & KHÔNG HARDCODE SECRETS**:
   - Tuyệt đối không hardcode API keys, mật khẩu, URL cứng vào mã nguồn khi sửa lỗi; luôn sử dụng biến môi trường (Environment Variables) hoặc file cấu hình chuẩn của dự án.

7. **CAN THIỆP TỐI THIỂU & BẢO TỒN COMMENT CỦA DEVELOPER**:
   - Chỉ thay đổi chính xác những dòng cần sửa (Minimal footprint diff).
   - Giữ nguyên toàn bộ comment giải thích nghiệp vụ, docstrings có sẵn trong code.

8. **KIỂM TRA TÍNH TOÀN VẸN TRƯỚC KHI BÀN GIAO (SYNTAX & BUILD CHECK)**:
   - Kiểm tra lỗi cú pháp (Syntax Check), biên dịch (Build/Compile) và chạy thử nghiệm (Tests/Lints nếu có) để đảm bảo không phát sinh lỗi biên dịch sau khi sửa.

## 📋 ĐỊNH DẠNG TỔNG KẾT BÀN GIAO:
Sau khi sửa xong, liệt kê rõ ràng:
- **Tệp đã sửa**: `Đường_dẫn_file:Dòng_sửa`
- **Nguyên nhân gốc rễ (Root Cause)**: Tại sao lỗi xảy ra
- **Giải pháp áp dụng (Fix Description)**: Đã sửa như thế nào (kèm Diff)
- **Kiểm chứng an toàn (Regression Check)**: Xác nhận các hàm liên quan không bị ảnh hưởng
- **Kết quả kiểm tra (Verification)**: Kết quả chạy syntax check / build / test
```
