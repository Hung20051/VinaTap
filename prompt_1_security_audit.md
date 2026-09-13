# 🎯 Prompt: Deep Code Review & Security Audit (Universal Standard v2)

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

5. **⭐ TRUY VẾT ĐA TẦNG BẮT BUỘC — CHỐNG FALSE POSITIVE (MULTI-LAYER DEFENSE TRACING)**:

   Đây là nguyên tắc QUAN TRỌNG NHẤT. Hầu hết false positive trong Code Audit xảy ra do AI phân tích ở MỘT tầng (controller/flow) rồi kết luận, mà KHÔNG đào xuống tầng phía dưới (model/ORM/SQL) nơi chứa lớp phòng thủ thật sự.

   **QUY TRÌNH BẮT BUỘC trước khi báo cáo BẤT KỲ vấn đề nào:**

   a. **Trace xuống Model Layer**: Khi phát hiện dấu hiệu nghi ngờ ở Controller (ví dụ: validate nằm ngoài transaction, thiếu row lock, truyền `req.body` trực tiếp), BẮT BUỘC phải mở file Model/Service tương ứng và đọc hàm thực sự thao tác DB để kiểm tra:
      - Có `WHERE` guard clause trong câu UPDATE/INSERT không? (ví dụ: `WHERE used_count < usage_limit`, `WHERE owner_user_id IS NULL`)
      - Có kiểm tra `affectedRows === 0` sau UPDATE để rollback/reject không?
      - Có whitelist array filter trước khi build SQL không?
      - Có `CASE WHEN` hoặc logic bổ sung bên trong cùng câu SQL không?

   b. **Atomic Operation Awareness**: Trong InnoDB (MySQL) và PostgreSQL, một câu `UPDATE ... SET x = x + 1 WHERE x < limit` bên trong Transaction đã TỰ ĐỘNG chiếm Row Lock (exclusive lock). Không cần `SELECT ... FOR UPDATE` riêng nếu câu UPDATE đã có `WHERE` guard đầy đủ. Đừng báo "thiếu row lock" nếu UPDATE atomic + `affectedRows` check đã đủ bảo vệ.

   c. **Validate ngoài Transaction ≠ Lỗi**: Kiểm tra ở tầng trên (ngoài transaction) rồi kiểm tra LẠI bên trong transaction bằng atomic UPDATE là pattern **fast-fail optimization** hợp lệ. Tầng trên reject nhanh 99% request sai mà không cần mở transaction tốn tài nguyên; tầng dưới (UPDATE + WHERE guard) bảo vệ 1% race condition còn lại. Chỉ báo lỗi nếu tầng dưới THỰC SỰ KHÔNG CÓ kiểm tra gì.

   d. **Đọc TOÀN BỘ hàm được gọi**: Khi hàm A gọi hàm B (ví dụ: `reviewCancelRequest` gọi `updateStatus`), BẮT BUỘC phải đọc nội dung hàm B trước khi kết luận hàm B thiếu xử lý. Đặc biệt chú ý:
      - Câu SQL trong hàm B có thể đã bao gồm logic mà hàm A "tưởng như" chưa xử lý (ví dụ: `CASE WHEN cancel_request_status = 'pending' THEN 'approved' ...` đã cập nhật cancel_request_status bên trong transaction của updateStatus).
      - Code ở hàm A có vẻ "dư thừa" (redundant UPDATE sau khi gọi hàm B) thực chất có thể là safety net vô hại, KHÔNG phải lỗi logic.

6. **⭐ PHÂN BIỆT THIẾT KẾ NGHIỆP VỤ vs. BUG KỸ THUẬT**:

   - Khi phát hiện một luồng xử lý "khác biệt" giữa 2 loại thực thể (ví dụ: đơn VietQR tự động hủy sau 24h nhưng đơn COD thì không), KHÔNG tự động kết luận đó là bug.
   - BẮT BUỘC tự hỏi: "Có lý do nghiệp vụ chính đáng nào giải thích sự khác biệt này không?" Ví dụ:
     - Đơn chuyển khoản (VietQR): khách cần thanh toán ngay → quá 24h không chuyển tiền = bỏ đơn → hủy tự động hợp lý.
     - Đơn COD (trả tiền khi nhận hàng): shop cần thời gian đóng gói + giao shipper → tự động hủy sau 24h sẽ HỦY ĐƠN HỢP LỆ CỦA KHÁCH.
   - Nếu sự khác biệt có giải thích nghiệp vụ hợp lý → KHÔNG báo cáo. Chỉ báo nếu sự khác biệt dẫn đến hậu quả kỹ thuật không thể chấp nhận (crash, data corruption, security breach).

7. **⭐ CHUẨN NGÀNH CHẤP NHẬN ĐƯỢC (INDUSTRY-STANDARD PATTERNS)**:

   Các pattern sau là CHUẨN NGÀNH, KHÔNG phải lỗi. Không lãng phí dung lượng báo cáo vào chúng trừ khi có bằng chứng khai thác cụ thể:
   - OAuth redirect gắn token/code trên query string (chuẩn RFC 6749 cho SPA flow, frontend xử lý ngay và xóa khỏi URL).
   - JWT token lưu localStorage (chuẩn SPA, HttpOnly cookie là tốt hơn nhưng không phải bắt buộc).
   - `helmet()` tắt CSP cho API thuần JSON (CSP cấu hình ở tầng frontend/CDN, API không tự render HTML).
   - `bcrypt` cost factor 10-12 (chuẩn OWASP 2024+).
   - Rate limiter dùng in-memory store cho single instance (chỉ là vấn đề khi horizontal scaling).

8. **KHÔNG BÁO CÁO Ý KIẾN CHỦ QUAN**:
   - Không phàn nàn về Coding Style, Format code, hoặc việc không dùng thư viện ngoài nếu code hiện tại đang chạy đúng và ổn định.

9. **TIÊU CHÍ XÁC ĐỊNH LỖI (CHỈ BÁO CÁO NẾU CÓ HẬU QUẢ THỰC TẾ)**:
   - 🔴 **Critical**: Làm dừng tiến trình (Crash server, Unhandled Exception, Memory leak nghiêm trọng).
   - 🔴 **Data Integrity**: Làm sai lệch, mất mát dữ liệu (Race condition thực sự, lỗi Transaction rollback, ghi sai bảng/cột).
   - 🔴 **Security Vulnerability**: Lỗ hổng có thể khai thác trực tiếp (Bypass Auth, Escalation quyền, IDOR, SQLi/RCE thực tế, Mass Assignment nguy hiểm).
   - 🔴 **Business Logic Flaw**: Tính toán sai lệch nghiệp vụ (Tính sai tiền tệ, sai phân quyền, lệch trạng thái).
   - 🟡 **Edge-case / Warning**: Lỗi tiềm ẩn chỉ xuất hiện trong điều kiện biên (phải nêu rõ kịch bản kích hoạt).

   > ⚠️ **Checkpoint cuối cùng trước khi liệt kê bất kỳ vấn đề nào vào báo cáo**: Tự hỏi 3 câu:
   > 1. "Mình đã đọc HÀM THỰC SỰ THAO TÁC DB chưa, hay mới chỉ đọc hàm gọi nó?"
   > 2. "Có lớp bảo vệ nào ở tầng dưới (Model/SQL) mà mình chưa kiểm tra không?"
   > 3. "Có lý do nghiệp vụ chính đáng nào giải thích hành vi này không?"
   >
   > Nếu trả lời "chưa" ở bất kỳ câu nào → QUAY LẠI ĐỌC CODE trước khi viết vào báo cáo.

## 🔎 PHẠM VI RÀ SOÁT TOÀN DIỆN (BẮT BUỘC BAO QUÁT):

10. **KIỂM TRA TÍNH NHẤT QUÁN XUYÊN LỚP & CHỐNG MASS ASSIGNMENT (CROSS-LAYER & DTO AUDIT)**:
    - Đối chiếu **Schema DB → Model/ORM → Controller/API response → Frontend API client** để phát hiện lệch tên trường (field name mismatch), trả dữ liệu thiếu/thừa, hoặc Model trả field không tồn tại trong Schema.
    - **Chống Mass Assignment**: Rà soát các câu lệnh `Model.create(req.body)` hoặc `Model.update(req.body)` xem có kiểm tra Whitelist / DTO Destructuring hay không — **BẮT BUỘC kiểm tra CẢ trong file Model** (nhiều dự án whitelist ở tầng Model thay vì Controller, cả 2 cách đều hợp lệ). Kẻ tấn công có thể chèn thêm các trường đặc quyền (ví dụ: `role: 'admin'`, `is_verified: true`, `balance`, hoặc ghi đè config hệ thống) nếu KHÔNG có whitelist ở BẤT KỲ tầng nào.

11. **TRACE LUỒNG TRẠNG THÁI END-TO-END (STATE MACHINE AUDIT)**:
    - Với mỗi thực thể có vòng đời trạng thái (Status Lifecycle) — ví dụ: Đơn hàng/Hóa đơn (pending→paid→shipping→completed/cancelled), Thẻ/Tài sản (pending→active→disabled), Yêu cầu chuyển nhượng/Phê duyệt (pending→approved/rejected/cancelled)... → phải trace TOÀN BỘ chuỗi hành động từ đầu đến cuối để tìm:
      - Trạng thái "mồ côi" (orphan state) — trạng thái không có đường đi ra hoặc kẹt vĩnh viễn. **LƯU Ý**: Trước khi báo cáo orphan state, kiểm tra xem đó có phải là thiết kế nghiệp vụ có chủ đích không (xem Nguyên tắc 6).
      - Chuyển đổi trạng thái bất hợp pháp — bỏ sót validate cho phép nhảy cóc hoặc đảo ngược (ví dụ: completed nhảy về pending/cancelled).
      - Side-effect bị bỏ quên — ví dụ: hủy đơn nhưng quên hoàn trả voucher/điểm thưởng/kho hàng, chuyển nhượng quyền sở hữu nhưng quên chuyển giao các tài nguyên phụ thuộc. **LƯU Ý**: Side-effect có thể được xử lý bên trong hàm được gọi (xem Nguyên tắc 5d) — đọc hàm con trước khi kết luận thiếu.

12. **ĐỒNG THỜI (CONCURRENCY), TRANSACTIONS, KHÓA DÒNG & ĐỘ CHÍNH XÁC TÀI CHÍNH**:
    - Mọi thao tác ghi/cập nhật trên từ 2 bảng liên quan trở lên (ví dụ: trừ kho + tạo đơn, hoàn tiền + đổi trạng thái) BẮT BUỘC phải nằm trong Database Transaction (`BEGIN TRANSACTION` -> `COMMIT` / `ROLLBACK`).
    - Các luồng tài chính, số dư ví, điểm thưởng, mã giảm giá, giới hạn số lượng (quota/inventory) và tranh chấp tài nguyên (claim/transfer/booking) có được bảo vệ bằng Row Lock để chống Race Condition khi có nhiều request đồng thời hay không. **LƯU Ý**: Row Lock có thể đạt được bằng nhiều cách hợp lệ (xem Nguyên tắc 5b):
      - `SELECT ... FOR UPDATE` (explicit lock)
      - `UPDATE ... SET x = x + 1 WHERE x < limit` bên trong transaction (implicit exclusive lock qua atomic UPDATE + WHERE guard)
      - `INSERT ... ON DUPLICATE KEY UPDATE` (implicit lock)
      - Check `affectedRows === 0` sau UPDATE để detect và reject request thua cuộc
      - Tất cả các cách trên đều hợp lệ, KHÔNG yêu cầu phải dùng cách nào cụ thể.
    - **Độ chính xác tiền tệ & Múi giờ**: Kiểm tra phép tính nhân/chia tiền tệ có bị sai lệch dấu chấm động (Floating Point Precision) không (bắt buộc làm tròn số nguyên/Decimal). Múi giờ (`UTC` vs `Local Time`) khi lưu trữ và so sánh hạn dùng (expires_at, TTL) có đồng nhất không.

13. **ĐỐI CHIẾU ROUTE ↔ MIDDLEWARE ↔ CONTROLLER (ACCESS CONTROL MATRIX)**:
    - Liệt kê toàn bộ routes và đối chiếu ma trận phân quyền:
      - Route đặc quyền (Admin, Manager...) → phải có middleware xác thực + kiểm tra role/permission tương ứng.
      - Route người dùng cá nhân → phải có middleware xác thực + kiểm tra quyền sở hữu dữ liệu (Ownership check / Chống IDOR).
      - Route công khai (Public) → nếu đọc thông tin theo ID phải kiểm tra cờ công khai (is_public/active), và Controller không truy cập `req.user` mà không kiểm tra null-safety.
    - Phát hiện route bị "hở" (missing middleware) hoặc middleware đặt sai thứ tự.

14. **BẢO MẬT TỆP TIN, LỌC NỘI DUNG (XSS) & BỘ NHỚ HỆ THỐNG**:
    - Whitelist nghiêm ngặt MIME type và phần mở rộng (chặn tuyệt đối thực thi mã độc qua webshell `.php`, `.sh`, `.exe` hoặc SVG XSS).
    - Giới hạn kích thước file upload, sử dụng stream trực tiếp lên Cloud Storage (S3, Cloudinary...) hoặc dọn dẹp file tạm trên disk ngay sau khi xử lý để chống cạn kiệt dung lượng ổ cứng.
    - **Chống Stored XSS**: Rà soát các vị trí Frontend render dữ liệu người dùng nhập bằng `dangerouslySetInnerHTML`, `v-html`, hoặc trình parse Markdown xem có được lọc qua thư viện làm sạch (DOMPurify/Sanitize) hay không.
    - Cấu trúc dữ liệu lưu trong bộ nhớ (In-memory Caches, Maps, Sets) phải có TTL và giới hạn kích thước tối đa (Max Entries Cap) có cơ chế dọn dẹp định kỳ để tránh rò rỉ bộ nhớ (Memory Leak / OOM Crash).

15. **BẢO MẬT REALTIME / WEBSOCKET (nếu dự án sử dụng)**:
    - Xác thực kết nối (Handshake Auth) có chặt chẽ hay không.
    - Phân quyền tham gia phòng (Room Join) có kiểm tra quyền sở hữu/role của user hay không (tránh IDOR qua socket room).
    - Dữ liệu phát qua socket (Emit payload) có bị lộ thông tin nhạy cảm (mật khẩu, token, PII người dùng khác...) không.

16. **TÍCH HỢP BÊN THỨ BA & DỊCH VỤ NGOẠI VI (THIRD-PARTY SECURITY)**:
    - **Webhook** (Payment, CRM, Logistics...): Có xác thực nguồn gửi (API Signature, Secret Header, IP Whitelist) không? Có cơ chế Idempotent (gọi lặp không tạo hiệu ứng kép) không?
    - **OAuth Callback** (Google, Apple, Facebook...): Có xử lý đầy đủ các nhánh ngoại lệ (tài khoản bị khóa/banned, email trùng, token giả mạo) không?
    - **Proxy / External API** (AI/LLM, TTS, SMS, Email Gateway...): Có giới hạn độ dài input, timeout handling và rate limiting để tránh cạn kiệt ngân sách/quota không?

17. **PHÒNG CHỐNG TẤN CÔNG TỪ CHỐI DỊCH VỤ (ANTI-DOS) & RÒ RỈ DỮ LIỆU NHẠY CẢM**:
    - Giới hạn tần suất gọi API (Rate Limiting) trên các endpoint nhạy cảm (Auth, OTP, Password Reset, Thanh toán, Upload, AI Proxy).
    - Giới hạn kích thước Request Body (Body Payload Limit) để chống tấn công Payload Bomb làm nghẽn Event Loop.
    - Error Handler ở môi trường Production tuyệt đối không trả về Stack Trace, Internal DB Queries hoặc thông tin nhạy cảm của hệ thống ra ngoài response.

## 📋 ĐỊNH DẠNG BÁO CÁO:
Mỗi vấn đề tìm thấy phải được trình bày theo cấu trúc chuẩn:

### [Mức độ: 🔴 Critical / 🟡 Warning] Tên vấn đề ngắn gọn
- **Vị trí**: `Đường_dẫn_file:Dòng_code`
- **Bản chất**: Lỗi gì, tại sao xảy ra
- **Đã kiểm tra Multi-layer**: Liệt kê các hàm/file ở tầng dưới đã đọc để xác nhận không có lớp bảo vệ nào bị bỏ sót
- **Kịch bản kích hoạt**: Các bước hoặc điều kiện cụ thể dẫn đến lỗi
- **Tác động thực tế**: Ảnh hưởng thế nào đến hệ thống / người dùng
- **Giải pháp đề xuất**: Mã nguồn khắc phục cụ thể (định dạng Diff)

*(Nếu hệ thống hoạt động an toàn và không có lỗi thực tế, hãy kết luận "Mã nguồn đạt chuẩn an toàn, không phát hiện lỗi nghiêm trọng", tuyệt đối không tạo lỗi giả).*
```
