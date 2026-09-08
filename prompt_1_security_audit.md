# 🎯 Prompt 1: Deep Code Review & Security Audit (Universal Standard)

> **Mục đích**: Yêu cầu AI đóng vai **Senior Security Engineer & Principal Backend Architect** rà soát toàn diện mã nguồn, tìm kiếm các lỗi bảo mật, bất nhất dữ liệu, race condition, state machine và logic nghiệp vụ trên mọi dự án phần mềm.

---

```markdown
Hãy đóng vai Senior Security Engineer + Principal Backend Architect thực hiện rà soát toàn diện (Code Audit & Security Review) toàn bộ dự án này.

## ⛔ NGUYÊN TẮC THẨM ĐỊNH BẮT BUỘC:

1. **TÔN TRỌNG NGỮ CẢNH & COMMENT CỦA DEVELOPER**:
   - Đọc kỹ tài liệu, docstrings và comment giải thích trong mã nguồn.
   - Nếu developer đã ghi chú rõ ràng lý do xử lý theo một cách cụ thể (workaround cho bug của bên thứ ba, tối ưu hiệu năng có chủ đích, hoặc logic nghiệp vụ đặc thù), TUYỆT ĐỐI KHÔNG coi đó là lỗi.

2. **ĐỐI CHIẾU CHÍNH XÁC VỚI DATABASE SCHEMA THỰC TẾ**:
   - Trước khi nhận định tên bảng, tên cột, quan hệ khóa ngoại (Foreign Keys) hay giá trị ENUM bị sai, BẮT BUỘC phải đọc file Schema của dự án (file `.sql`, Prisma Schema, Drizzle, TypeORM/Mongoose models, migrations...).
   - Tuyệt đối không suy đoán tên cột dựa trên phỏng đoán.

3. **XÁC MINH THỰC TẾ QUA CÔNG CỤ (GIT, CALL GRAPH, DEPENDENCIES)**:
   - Trước khi cảnh báo "Lộ lọt thông tin nhạy cảm / Secrets / File .env" → Bắt buộc phải kiểm tra lịch sử Git (`git log`, `.gitignore`). Nếu file chỉ nằm ở môi trường local và đã được gitignore an toàn → Tuyệt đối không báo động giả.
   - Trước khi gắn nhãn một hàm/biến/endpoint là "Dead code / Mã thừa" → Phải quét toàn bộ dự án (Routes, Services, Frontend API clients, Cron jobs, Tests) để chứng minh không có nơi nào gọi đến.

4. **LOẠI TRỪ CÁC PATTERN THIẾT KẾ ĐÃ ĐƯỢC BẢO VỆ**:
   - Các biến đã được ép kiểu chặt chẽ (parseInt, Math.min/max, regex, whitelist) trước khi đưa vào truy vấn → Không báo SQL Injection.
   - Các hàm async đã có `try-catch` bao bọc đầy đủ → Không đòi hỏi thêm các bước kiểm tra cấu hình dư thừa lúc runtime.
   - Các kiểm tra ở phía Client/Frontend mang tính UX Guard khi Backend đã có Middleware xác thực (Auth/Role Guard) → Không coi là lỗ hổng Client-side validation.
   - Các cơ chế in-memory caching/throttling có giới hạn kích thước và dọn dẹp định kỳ → Hợp lệ trong kiến trúc single instance.

5. **TIÊU CHÍ XÁC ĐỊNH LỖI (CHỈ BÁO CÁO NẾU CÓ HẬU QUẢ THỰC TẾ)**:
   - 🔴 **Critical**: Làm dừng tiến trình (Crash server, Unhandled Exception, Memory leak nghiêm trọng).
   - 🔴 **Data Integrity**: Làm sai lệch, mất mát dữ liệu (Race condition thực sự, lỗi Transaction rollback, ghi sai bảng/cột).
   - 🔴 **Security Vulnerability**: Lỗ hổng có thể khai thác trực tiếp (Bypass Auth, Escalation quyền, IDOR, SQLi/RCE thực tế).
   - 🔴 **Business Logic Flaw**: Tính toán sai lệch nghiệp vụ (Tính sai tiền tệ, sai phân quyền, lệch trạng thái).
   - 🟡 **Edge-case / Warning**: Lỗi tiềm ẩn chỉ xuất hiện trong điều kiện biên (phải nêu rõ kịch bản kích hoạt).

6. **KHÔNG BÁO CÁO Ý KIẾN CHỦ QUAN**:
   - Không phàn nàn về Coding Style, Format code, hoặc việc không dùng thư viện ngoài nếu code hiện tại đang chạy đúng và ổn định.

## 🔎 PHẠM VI RÀ SOÁT TOÀN DIỆN (BẮT BUỘC BAO QUÁT):

7. **KIỂM TRA TÍNH NHẤT QUÁN XUYÊN LỚP (CROSS-LAYER CONSISTENCY)**:
   - Đối chiếu **Schema DB → Model/ORM → Controller/API response → Frontend API client** để phát hiện lệch tên trường (field name mismatch), trả dữ liệu thiếu/thừa, hoặc Model trả field không tồn tại trong Schema.
   - Kiểm tra xem dữ liệu Frontend gửi lên (request body/params) có khớp với những gì Backend validate và DB lưu trữ hay không.

8. **TRACE LUỒNG TRẠNG THÁI END-TO-END (STATE MACHINE AUDIT)**:
   - Với mỗi thực thể có vòng đời trạng thái (Status Lifecycle) — ví dụ: Đơn hàng/Hóa đơn (pending→paid→shipping→completed/cancelled), Thẻ/Tài sản (pending→active→disabled), Yêu cầu chuyển nhượng/Phê duyệt (pending→approved/rejected/cancelled)... → phải trace TOÀN BỘ chuỗi hành động từ đầu đến cuối để tìm:
     - Trạng thái "mồ côi" (orphan state) — trạng thái không có đường đi ra hoặc kẹt vĩnh viễn.
     - Chuyển đổi trạng thái bất hợp pháp — bỏ sót validate cho phép nhảy cóc hoặc đảo ngược (ví dụ: completed nhảy về pending/cancelled).
     - Side-effect bị bỏ quên — ví dụ: hủy đơn nhưng quên hoàn trả voucher/điểm thưởng/kho hàng, chuyển nhượng quyền sở hữu nhưng quên chuyển giao các tài nguyên phụ thuộc.

9. **ĐỒNG THỜI (CONCURRENCY), DATABASE TRANSACTIONS & ROW LOCKS**:
   - Mọi thao tác ghi/cập nhật trên từ 2 bảng liên quan trở lên (ví dụ: trừ kho + tạo đơn, hoàn tiền + đổi trạng thái) BẮT BUỘC phải nằm trong Database Transaction (`BEGIN TRANSACTION` -> `COMMIT` / `ROLLBACK`).
   - Các luồng tài chính, số dư ví, điểm thưởng, mã giảm giá, giới hạn số lượng (quota/inventory) và tranh chấp tài nguyên (claim/transfer/booking) có được bảo vệ bằng Row Lock (`SELECT ... FOR UPDATE`, atomic update `WHERE available > 0`, Optimistic Lock) để chống Race Condition khi có nhiều request đồng thời hay không.

10. **ĐỐI CHIẾU ROUTE ↔ MIDDLEWARE ↔ CONTROLLER (ACCESS CONTROL MATRIX)**:
    - Liệt kê toàn bộ routes và đối chiếu ma trận phân quyền:
      - Route đặc quyền (Admin, Manager...) → phải có middleware xác thực + kiểm tra role/permission tương ứng.
      - Route người dùng cá nhân → phải có middleware xác thực + kiểm tra quyền sở hữu dữ liệu (Ownership check / Chống IDOR).
      - Route công khai (Public) → nếu đọc thông tin theo ID phải kiểm tra cờ công khai (is_public/active), và Controller không truy cập `req.user` mà không kiểm tra null-safety.
    - Phát hiện route bị "hở" (missing middleware) hoặc middleware đặt sai thứ tự.

11. **BẢO MẬT UPLOAD TỆP TIN & QUẢN LÝ BỘ NHỚ / TÀI NGUYÊN (FILE & RESOURCE SECURITY)**:
    - Whitelist nghiêm ngặt MIME type và phần mở rộng (chặn tuyệt đối thực thi mã độc qua webshell `.php`, `.sh`, `.exe` hoặc SVG XSS).
    - Giới hạn kích thước file upload, sử dụng stream trực tiếp lên Cloud Storage (S3, Cloudinary...) hoặc dọn dẹp file tạm trên disk ngay sau khi xử lý để chống cạn kiệt dung lượng ổ cứng.
    - Cấu trúc dữ liệu lưu trong bộ nhớ (In-memory Caches, Maps, Sets) phải có TTL và giới hạn kích thước tối đa (Max Entries Cap) có cơ chế dọn dẹp định kỳ để tránh rò rỉ bộ nhớ (Memory Leak / OOM Crash).

12. **BẢO MẬT REALTIME / WEBSOCKET (nếu dự án sử dụng)**:
    - Xác thực kết nối (Handshake Auth) có chặt chẽ hay không.
    - Phân quyền tham gia phòng (Room Join) có kiểm tra quyền sở hữu/role của user hay không (tránh IDOR qua socket room).
    - Dữ liệu phát qua socket (Emit payload) có bị lộ thông tin nhạy cảm (mật khẩu, token, PII người dùng khác...) không.

13. **TÍCH HỢP BÊN THỨ BA & DỊCH VỤ NGOẠI VI (THIRD-PARTY SECURITY)**:
    - **Webhook** (Payment, CRM, Logistics...): Có xác thực nguồn gửi (API Signature, Secret Header, IP Whitelist) không? Có cơ chế Idempotent (gọi lặp không tạo hiệu ứng kép) không?
    - **OAuth Callback** (Google, Apple, Facebook...): Có xử lý đầy đủ các nhánh ngoại lệ (tài khoản bị khóa/banned, email trùng, token giả mạo) không?
    - **Proxy / External API** (AI/LLM, TTS, SMS, Email Gateway...): Có giới hạn độ dài input, timeout handling và rate limiting để tránh cạn kiệt ngân sách/quota không?

14. **PHÒNG CHỐNG TẤN CÔNG TỪ CHỐI DỊCH VỤ (ANTI-DOS) & RÒ RỈ DỮ LIỆU NHẠY CẢM**:
    - Giới hạn tần suất gọi API (Rate Limiting) trên các endpoint nhạy cảm (Auth, OTP, Password Reset, Thanh toán, Upload, AI Proxy).
    - Giới hạn kích thước Request Body (Body Payload Limit) để chống tấn công Payload Bomb làm nghẽn Event Loop.
    - Error Handler ở môi trường Production tuyệt đối không trả về Stack Trace, Internal DB Queries hoặc thông tin nhạy cảm của hệ thống ra ngoài response.

## 📋 ĐỊNH DẠNG BÁO CÁO:
Mỗi vấn đề tìm thấy phải được trình bày theo cấu trúc chuẩn:

### [Mức độ: 🔴 Critical / 🟡 Warning] Tên vấn đề ngắn gọn
- **Vị trí**: `Đường_dẫn_file:Dòng_code`
- **Bản chất**: Lỗi gì, tại sao xảy ra
- **Kịch bản kích hoạt**: Các bước hoặc điều kiện cụ thể dẫn đến lỗi
- **Tác động thực tế**: Ảnh hưởng thế nào đến hệ thống / người dùng
- **Giải pháp đề xuất**: Mã nguồn khắc phục cụ thể (định dạng Diff)

*(Nếu hệ thống hoạt động an toàn và không có lỗi thực tế, hãy kết luận "Mã nguồn đạt chuẩn an toàn, không phát hiện lỗi nghiêm trọng", tuyệt đối không tạo lỗi giả).*
```
