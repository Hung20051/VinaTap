const { chatModel } = require("../config/gemini");
const db = require("../config/db");

// System prompt cho chatbot du lịch VinaTap
const SYSTEM_PROMPT = `Bạn là trợ lý du lịch thông minh của VinaTap — ứng dụng bản đồ du lịch NFC Việt Nam.
Nhiệm vụ của bạn:
- Gợi ý địa điểm, món ăn, hoạt động tại các tỉnh thành Việt Nam
- Giúp người dùng viết caption cho ảnh du lịch
- Gợi ý cách tổ chức album kỷ niệm
- Trả lời câu hỏi về văn hóa, phong tục địa phương
Luôn trả lời bằng tiếng Việt, thân thiện, ngắn gọn và hữu ích.`;

// ─── TẠO PHIÊN CHAT MỚI ──────────────────────────────────────
// POST /api/chatbot/sessions
// Body: { album_id } (optional)
const createSession = async (req, res) => {
  try {
    const { album_id } = req.body;

    // Nếu có album_id thì kiểm tra quyền truy cập
    // Trước đây chỉ check album có tồn tại, KHÔNG check user có được xem
    // album đó không -> bất kỳ ai đăng nhập, biết album_id, đều tạo được
    // session và đọc lộ tiêu đề + thông tin tỉnh của album riêng tư người
    // khác qua sendMessage(). Giờ áp dụng đúng luật như albumController.getAlbum:
    // album public HOẶC là chủ HOẶC là cộng tác viên đã được duyệt.
    if (album_id) {
      const [albums] = await db.execute(
        `SELECT a.id
         FROM albums a
         LEFT JOIN album_shares s
           ON s.album_id = a.id AND s.user_id = ? AND s.status = 'approved'
         WHERE a.id = ? AND a.status = 'active'
           AND (a.is_public = 1 OR a.owner_id = ? OR s.id IS NOT NULL)`,
        [req.user.id, album_id, req.user.id],
      );
      if (!albums.length)
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập album này" });
    }

    const [result] = await db.execute(
      `INSERT INTO chatbot_sessions (user_id, album_id, status) VALUES (?, ?, 'active')`,
      [req.user.id, album_id || null],
    );

    res.status(201).json({
      message: "Tạo phiên chat thành công",
      session_id: result.insertId,
    });
  } catch (err) {
    console.error("createSession:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── GỬI TIN NHẮN ────────────────────────────────────────────
// POST /api/chatbot/sessions/:sessionId/messages
// Body: { content }
const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content } = req.body;

    if (!content?.trim())
      return res
        .status(400)
        .json({ message: "Nội dung tin nhắn không được trống" });

    // Kiểm tra session thuộc về user
    const [sessions] = await db.execute(
      `SELECT * FROM chatbot_sessions WHERE id = ? AND user_id = ? AND status = 'active'`,
      [sessionId, req.user.id],
    );
    if (!sessions.length)
      return res.status(404).json({ message: "Không tìm thấy phiên chat" });

    const session = sessions[0];

    // Lấy lịch sử chat để gửi context cho Gemini
    const [history] = await db.execute(
      `SELECT role, content FROM chatbot_messages
       WHERE session_id = ? ORDER BY sent_at ASC`,
      [sessionId],
    );

    // Nếu album gắn với session, lấy thêm context tỉnh
    let contextPrompt = SYSTEM_PROMPT;
    if (session.album_id) {
      const [albums] = await db.execute(
        `SELECT a.title, p.name AS province_name, p.description AS province_desc, p.specialties
         FROM albums a
         JOIN nfc_cards nc ON nc.id = a.nfc_card_id
         JOIN provinces p  ON p.id  = nc.province_id
         WHERE a.id = ?`,
        [session.album_id],
      );
      if (albums[0]) {
        const alb = albums[0];
        contextPrompt += `\n\nNgười dùng đang xem album "${alb.title || alb.province_name}" tại tỉnh ${alb.province_name}.
Thông tin tỉnh: ${alb.province_desc || ""}
Đặc sản / lễ hội: ${alb.specialties || ""}
Hãy ưu tiên tư vấn về tỉnh này khi phù hợp.`;
      }
    }

    // Build lịch sử theo format Gemini
    const chatHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Gửi sang Gemini
    const chat = chatModel.startChat({
      history: chatHistory,
      systemInstruction: contextPrompt,
    });
    const result = await chat.sendMessage(content);
    const reply = result.response.text().trim();

    // Lưu cả 2 tin nhắn vào DB
    await db.execute(
      `INSERT INTO chatbot_messages (session_id, role, content) VALUES (?, 'user', ?)`,
      [sessionId, content],
    );
    await db.execute(
      `INSERT INTO chatbot_messages (session_id, role, content) VALUES (?, 'assistant', ?)`,
      [sessionId, reply],
    );

    res.json({ reply });
  } catch (err) {
    console.error("sendMessage:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── LẤY LỊCH SỬ PHIÊN CHAT ──────────────────────────────────
// GET /api/chatbot/sessions/:sessionId
const getSession = async (req, res) => {
  try {
    const [sessions] = await db.execute(
      `SELECT * FROM chatbot_sessions WHERE id = ? AND user_id = ?`,
      [req.params.sessionId, req.user.id],
    );
    if (!sessions.length)
      return res.status(404).json({ message: "Không tìm thấy phiên chat" });

    const [messages] = await db.execute(
      `SELECT role, content, sent_at FROM chatbot_messages
       WHERE session_id = ? ORDER BY sent_at ASC`,
      [req.params.sessionId],
    );

    res.json({ session: sessions[0], messages });
  } catch (err) {
    console.error("getSession:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── LẤY TẤT CẢ PHIÊN CHAT CỦA USER ─────────────────────────
// GET /api/chatbot/sessions
const getMySessions = async (req, res) => {
  try {
    const [sessions] = await db.execute(
      `SELECT s.*, 
              (SELECT content FROM chatbot_messages WHERE session_id = s.id ORDER BY sent_at DESC LIMIT 1) AS last_message,
              (SELECT COUNT(*) FROM chatbot_messages WHERE session_id = s.id) AS message_count
       FROM chatbot_sessions s
       WHERE s.user_id = ?
       ORDER BY s.updated_at DESC`,
      [req.user.id],
    );
    res.json({ sessions });
  } catch (err) {
    console.error("getMySessions:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ĐÓNG PHIÊN CHAT ─────────────────────────────────────────
// DELETE /api/chatbot/sessions/:sessionId
const closeSession = async (req, res) => {
  try {
    await db.execute(
      `UPDATE chatbot_sessions SET status = 'closed' WHERE id = ? AND user_id = ?`,
      [req.params.sessionId, req.user.id],
    );
    res.json({ message: "Đã đóng phiên chat" });
  } catch (err) {
    console.error("closeSession:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  createSession,
  sendMessage,
  getSession,
  getMySessions,
  closeSession,
};
