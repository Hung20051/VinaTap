const { generateWithFallback } = require("../config/gemini");
const db = require("../config/db");

// Bộ nhớ đệm Smart Cache (in-memory) để tiết kiệm quota & phản hồi siêu tốc
const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 giờ

// Bộ nhớ đệm tìm kiếm ảnh thực tế trên Internet
const imageSearchCache = new Map();

// Dọn dẹp cache hết hạn định kỳ
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of responseCache.entries()) {
    if (now - item.timestamp > CACHE_TTL_MS) {
      responseCache.delete(key);
    }
  }
}, 15 * 60 * 1000);

/**
 * Trích xuất thực thể cốt lõi (loại bỏ ngoặc phụ, phụ đề, từ mô tả góc nhìn...)
 */
function extractCoreEntity(keyword) {
  if (!keyword || typeof keyword !== "string") return "";
  let clean = keyword.trim().replace(/^📸\s*/, "");

  // Tách lấy tên chính nếu có mở ngoặc đơn hoặc dấu gạch ngang (Ví dụ: "Cầu Vàng (Sun World Bà Nà Hills)" -> "Cầu Vàng")
  if (clean.includes("(") || clean.includes(" - ")) {
    const mainPart = clean.split(/[(-]/)[0].trim();
    if (mainPart.length >= 3) {
      clean = mainPart;
    }
  }

  clean = clean.replace(/[()[\]]/g, "");
  // Loại bỏ các từ phụ chi tiết gây nhiễu kết quả tìm kiếm
  clean = clean.replace(
    /^(cổng tam quan|cổng chính|khuôn viên|toàn cảnh|bảo tháp|tượng phật|gian chính|góc nhìn|bàn ăn|bát|tô|đĩa|ảnh chụp|hình ảnh|danh thắng|khu du lịch)\s+(của\s+|về\s+)?/i,
    ""
  );
  return clean.trim();
}

/**
 * Kiểm tra xem tiêu đề trang bách khoa có thực sự trùng khớp với từ khóa cốt lõi không
 */
function isTitleRelevant(searchKey, pageTitle) {
  if (!searchKey || !pageTitle) return false;
  const sLower = searchKey.toLowerCase();
  const tLower = pageTitle.toLowerCase();

  // Bỏ qua các bài viết về giải thưởng, phim ảnh, âm nhạc nếu từ khóa không chứa chúng
  const invalidKeywords = [
    "giải thưởng",
    "quả cầu vàng",
    "thời kỳ tam quốc",
    "danh sách",
    "phim",
    "bài hát",
    "album",
    "trận ",
  ];
  for (const inv of invalidKeywords) {
    if (tLower.includes(inv) && !sLower.includes(inv)) {
      return false;
    }
  }

  const sNorm = sLower
    .replace(/^(chùa|đền|di tích|tháp|hồ|núi|bãi biển|cầu|món|phở|bún|bánh|lăng|nhà thờ)\s+/i, "")
    .trim();
  const words = sNorm.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length === 0) return true;

  // Phải khớp đa số từ khóa đặc trưng
  const matchedWords = words.filter((w) => tLower.includes(w));
  return matchedWords.length >= Math.ceil(words.length * 0.6);
}

/**
 * Kiểm tra ảnh có phải là ảnh tải lên thực tế (không phải ảnh placeholder mẫu của Unsplash)
 */
function isAuthenticUploadedImage(url) {
  if (!url || typeof url !== "string") return false;
  if (url.includes("images.unsplash.com") || url.includes("example.com")) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/uploads/");
}

/**
 * Kiểm tra xem trong cơ sở dữ liệu VinaTap đã có sẵn ảnh thực tế tải lên chưa
 */
function findImageInDatabase(keyword, provinceData = {}) {
  if (!keyword || typeof keyword !== "string") return null;
  const k = keyword.toLowerCase().trim();

  // Tìm trong danh sách địa danh (chỉ nhận ảnh thực tế đã upload, không nhận unsplash placeholder)
  if (Array.isArray(provinceData.landmarks)) {
    for (const lm of provinceData.landmarks) {
      if (!isAuthenticUploadedImage(lm.thumbnail_url)) continue;
      const name = (lm.name || "").toLowerCase();
      if (k.includes(name) || name.includes(k)) {
        return lm.thumbnail_url;
      }
    }
  }

  // Tìm trong danh sách món ăn đặc sản
  if (Array.isArray(provinceData.foods)) {
    for (const fd of provinceData.foods) {
      if (!isAuthenticUploadedImage(fd.image_url)) continue;
      const title = (fd.title || "").toLowerCase();
      if (k.includes(title) || title.includes(k)) {
        return fd.image_url;
      }
    }
  }

  return null;
}

/**
 * Tự động tìm kiếm ảnh chụp thực tế chất lượng cao trên Internet (Wikipedia / Wikimedia Commons)
 * với bộ lọc nghiêm ngặt chống gán nhầm ảnh.
 */
async function getRealTravelImage(keyword, provinceName = "") {
  if (!keyword || typeof keyword !== "string") return null;
  const cleanKey = extractCoreEntity(keyword);
  if (cleanKey.length < 2) return null;

  const cacheKey = `${cleanKey.toLowerCase()}_${(provinceName || "").toLowerCase()}`;
  if (imageSearchCache.has(cacheKey)) {
    return imageSearchCache.get(cacheKey);
  }

  const isValidPhoto = (url) => {
    if (!url || typeof url !== "string") return false;
    const lower = url.toLowerCase();
    return (
      !lower.endsWith(".svg") &&
      !lower.includes("location_map") &&
      !lower.includes("map_of") &&
      !lower.includes("icon") &&
      !lower.includes("symbol") &&
      !lower.includes("flag") &&
      !lower.includes("coat_of_arms")
    );
  };

  try {
    // 1. Tìm kiếm trên Wikipedia tiếng Việt với kiểm tra tiêu đề trùng khớp
    const searchTermsVi = [cleanKey, `${cleanKey} ${provinceName}`.trim()];
    for (const term of searchTermsVi) {
      const searchUrl = `https://vi.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrlimit=5&prop=pageimages&pithumbsize=960&format=json`;
      const res = await fetch(searchUrl, { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
      if (res.query && res.query.pages) {
        // Ưu tiên bài viết có title trùng khớp nhất với từ khóa
        const pages = Object.values(res.query.pages);
        pages.sort((a, b) => {
          const aExact = a.title.toLowerCase().includes(cleanKey.toLowerCase()) ? 1 : 0;
          const bExact = b.title.toLowerCase().includes(cleanKey.toLowerCase()) ? 1 : 0;
          return bExact - aExact;
        });

        for (const page of pages) {
          if (
            page &&
            page.title &&
            isTitleRelevant(cleanKey, page.title) &&
            page.thumbnail &&
            page.thumbnail.source &&
            isValidPhoto(page.thumbnail.source)
          ) {
            imageSearchCache.set(cacheKey, page.thumbnail.source);
            return page.thumbnail.source;
          }
        }
      }
    }

    // 2. Tìm kiếm trên kho ảnh Wikimedia Commons
    const commonsTerms = [cleanKey, `${cleanKey} ${provinceName}`.trim()];
    for (const cTerm of commonsTerms) {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(cTerm)}&gsrlimit=4&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`;
      const resCommons = await fetch(commonsUrl, { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
      if (resCommons.query && resCommons.query.pages) {
        for (const page of Object.values(resCommons.query.pages)) {
          if (page.title && isTitleRelevant(cleanKey, page.title) && page.imageinfo && page.imageinfo[0]) {
            const thumbUrl = page.imageinfo[0].thumburl || page.imageinfo[0].url;
            if (isValidPhoto(thumbUrl)) {
              imageSearchCache.set(cacheKey, thumbUrl);
              return thumbUrl;
            }
          }
        }
      }
    }
  } catch (err) {
    // Timeout hoặc lỗi mạng
  }

  // Không tìm thấy ảnh thực tế chuẩn xác -> trả về null để không gắn ảnh sai
  imageSearchCache.set(cacheKey, null);
  return null;
}

/**
 * Quét toàn bộ nội dung AI trả về, tự động tìm và gắn ảnh chụp thực tế trên Internet
 */
async function resolveMarkdownImages(content, provinceData) {
  if (!content || typeof content !== "string") return content;

  const regex = /!\[(.*?)\]\((.*?)\)/g;
  const matches = [...content.matchAll(regex)];

  if (matches.length === 0) return content;

  let resolved = content;
  for (const match of matches) {
    const fullTag = match[0];
    const alt = match[1];
    const rawUrl = match[2];

    // Nếu đã là link ảnh thực tế hợp lệ (từ database hoặc Wikimedia) và KHÔNG PHẢI unsplash placeholder
    if (
      (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) &&
      !rawUrl.includes("example.com") &&
      !rawUrl.includes("images.unsplash.com") &&
      !rawUrl.includes("auto:")
    ) {
      continue;
    }

    const searchKeyword = rawUrl.startsWith("auto:") ? rawUrl.replace(/^auto:/, "") : alt;
    
    // 1. Ưu tiên tìm trong Cơ sở dữ liệu VinaTap trước (ảnh custom upload)
    let realImgUrl = findImageInDatabase(searchKeyword, provinceData);

    // 2. Nếu Database chưa có ảnh upload, tìm kiếm trên Internet với bộ lọc kiểm duyệt chuẩn xác
    if (!realImgUrl) {
      realImgUrl = await getRealTravelImage(searchKeyword, provinceData?.name || "");
    }

    if (realImgUrl) {
      resolved = resolved.replace(fullTag, `![${alt}](${realImgUrl})`);
    } else {
      // Nếu không tìm thấy ảnh thực tế chuẩn xác, xóa tag để tránh ảnh rác / ảnh sai lệch
      resolved = resolved.replace(fullTag, "");
    }
  }

  return resolved;
}

// Xây dựng System Prompt toàn năng, thông thái, cá nhân hóa theo từng người dùng
const buildProvinceSystemPrompt = (provinceData = {}, userInfo = null) => {
  const pName = provinceData.name || "Việt Nam";
  const pRegion = provinceData.region || "Việt Nam";
  const pDesc = provinceData.description || "";
  const pSpecialties = provinceData.specialties || "";

  // Thông tin cá nhân hóa của khách hàng
  const userGreeting = userInfo?.name
    ? `- Tên khách hàng: ${userInfo.name} (Tài khoản: ${userInfo.role === "admin" ? "Quản trị viên VinaTap" : "Thành viên VinaTap"})\n- Lưu ý xưng hô: Khi khách chào hỏi hoặc hỏi về bản thân ("tôi tên gì", "bạn biết tôi là ai không"), hãy gọi tên khách hàng (${userInfo.name}) một cách thân thiết, lịch thiệp và tự nhiên.`
    : `- Khách hàng: Khách vãng lai (Guest - chưa đăng nhập)`;

  // Danh sách địa danh có trong DB (chỉ liệt kê tên, không gán link stock unsplash)
  const landmarkList = Array.isArray(provinceData.landmarks) && provinceData.landmarks.length > 0
    ? provinceData.landmarks
        .map((lm) => `- ${lm.name}: ${lm.description || ""}`)
        .join("\n")
    : "";

  // Danh sách món ăn có trong DB (chỉ liệt kê tên, không gán link stock unsplash)
  const foodList = Array.isArray(provinceData.foods) && provinceData.foods.length > 0
    ? provinceData.foods
        .map((fd) => `- ${fd.title}: ${fd.description || ""}`)
        .join("\n")
    : "";

  return `Bạn là "Trợ Lý Du Lịch Thổ Địa VinaTap" — Chuyên gia cẩm nang bản địa am hiểu sâu sắc, văn minh, lịch thiệp và tin cậy của vùng đất ${pName} (${pRegion}) và 34 tỉnh thành Việt Nam.

👤 THÔNG TIN KHÁCH HÀNG:
${userGreeting}

🏛️ THÔNG TIN THAM KHẢO VỀ ${pName}:
- Vùng miền: ${pRegion}
- Giới thiệu tổng quan: ${pDesc}
- Đặc sản: ${pSpecialties}
${landmarkList ? `\n📍 ĐỊA DANH TIÊU BIỂU CÓ TRONG HỆ THỐNG:\n${landmarkList}` : ""}
${foodList ? `\n🍜 MÓN ĂN TIÊU BIỂU CÓ TRONG HỆ THỐNG:\n${foodList}` : ""}

📜 KIẾN THỨC ĐỊA GIỚI HÀNH CHÍNH 34 TỈNH THÀNH (NGHỊ QUYẾT 202/2025/QH15 - HIỆU LỰC TỪ 01/7/2025):
Việt Nam đã chính thức sắp xếp, sáp nhập từ 63 tỉnh thành thành 34 tỉnh, thành phố (gồm 6 thành phố trực thuộc Trung ương và 28 tỉnh):
- 6 Thành phố trực thuộc TW:
  1. TP. Đà Nẵng: Hợp nhất TP. Đà Nẵng + Tỉnh Quảng Nam (mở rộng kết nối Đà Nẵng và di sản Hội An, Mỹ Sơn).
  2. TP. Hồ Chí Minh: Hợp nhất TP.HCM + Tỉnh Bình Dương + Tỉnh Bà Rịa – Vũng Tàu.
  3. TP. Cần Thơ: Hợp nhất TP. Cần Thơ + Tỉnh Sóc Trăng + Tỉnh Hậu Giang.
  4. TP. Hải Phòng: Hợp nhất TP. Hải Phòng + Tỉnh Hải Dương.
  5. TP. Hà Nội: Giữ nguyên địa giới.
  6. TP. Huế: Giữ nguyên địa giới (Thành phố trực thuộc Trung ương).
- Các tỉnh sáp nhập:
  - Tuyên Quang (Hà Giang + Tuyên Quang), Lào Cai (Yên Bái + Lào Cai), Thái Nguyên (Bắc Kạn + Thái Nguyên), Phú Thọ (Vĩnh Phúc + Hòa Bình + Phú Thọ), Bắc Ninh (Bắc Giang + Bắc Ninh), Hưng Yên (Thái Bình + Hưng Yên), Ninh Bình (Hà Nam + Nam Định + Ninh Bình), Quảng Trị (Quảng Bình + Quảng Trị), Quảng Ngãi (Kon Tum + Quảng Ngãi), Gia Lai (Bình Định + Gia Lai), Khánh Hòa (Ninh Thuận + Khánh Hòa), Lâm Đồng (Đắk Nông + Bình Thuận + Lâm Đồng), Đắk Lắk (Phú Yên + Đắk Lắk), Đồng Nai (Đồng Nai + Bình Phước), Tây Ninh (Tây Ninh + Long An), Vĩnh Long (Bến Tre + Vĩnh Long + Trà Vinh), Đồng Tháp (Tiền Giang + Đồng Tháp), Cà Mau (Bạc Liêu + Cà Mau), An Giang (Kiên Giang + An Giang).
- 9 tỉnh giữ nguyên: Cao Bằng, Lai Châu, Điện Biên, Sơn La, Lạng Sơn, Quảng Ninh, Thanh Hóa, Nghệ An, Hà Tĩnh.
* Khi khách hỏi về sự kiện sáp nhập hoặc địa giới, hãy dẫn chứng rõ ràng theo Nghị quyết 202/2025/QH15 kết hợp với bối cảnh lịch sử và phát triển du lịch kết nối.

✨ NGUYÊN TẮC PHẢN HỒI THÔNG THÁI & ỨNG BIẾN LINH HOẠT:
1. 🧠 XỬ LÝ TÌNH HUỐNG BẤT NGỜ & TRÒ CHUYỆN TỰ NHIÊN:
   - Khi khách hỏi cảm nhận, câu hỏi bất ngờ, thời tiết, giao thông, đường sá ("đường ở đây đẹp không", "người dân ra sao", "có an toàn không", các câu đố/hỏi thăm vui vẻ...): Hãy trả lời chân thực, hóm hỉnh, am hiểu sâu sắc như một người bản địa sống lâu năm tại ${pName}.
   - Trả lời tự nhiên bằng ngôn ngữ văn minh, tinh tế; KHÔNG gượng ép chèn ảnh vào các câu hỏi cảm nhận trừu tượng.

2. 📸 NGUYÊN TẮC CHÈN ẢNH CHỌN LỌC (CHỈ GẮN VỚI ĐỊA DANH CỤ THỂ):
   - CHỈ chèn ảnh khi khách yêu cầu xem ảnh HOẶC khi bạn giới thiệu một địa danh/công trình/món ăn có TÊN RIÊNG CỤ THỂ (như *Cầu Rồng*, *Nhà hát Lớn Hải Phòng*, *Cầu Hoàng Văn Thụ*, *Chùa Trấn Quốc*, *Bánh đa cua*...).
   - TUYỆT ĐỐI KHÔNG chèn ảnh vào các cụm từ trừu tượng hoặc mô tả chung chung (như "Đường xuyên đảo...", "Cung đường biển...", "Con đường rợp bóng...", "Không khí trong lành...").
   - Cú pháp chuẩn khi giới thiệu danh thắng cụ thể: \`![Tên chuẩn](auto:Tên chuẩn)\`. Mỗi địa điểm chỉ tối đa 1 ảnh đại diện.

3. 📍 LINK GOOGLE MAPS TIỆN ÍCH:
   - Khi gợi ý địa điểm cụ thể, kèm link Google Maps chỉ đường:
     📍 [Xem toạ độ & Ảnh thực tế trên Google Maps](https://www.google.com/maps/search/?api=1&query={Tên+Địa+Danh+{Tên+Tỉnh}})

4. 🏛️ NỘI DUNG CHUYÊN NGHIỆP & CUỐN HÚT:
   - Câu từ cô đọng, giàu cảm xúc, có chiều sâu văn hóa bản địa.`;
};

// ─── 1. CHATBOT PUBLIC DÀNH CHO TRANG TỈNH THÀNH (GUEST & USER) ───────────────
// POST /api/chatbot/province-chat
const chatProvince = async (req, res) => {
  try {
    const {
      provinceSlug,
      provinceName,
      message,
      history = [],
      provinceData = {},
      userInfo = null,
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
    }

    const trimmedMsg = message.trim();
    if (trimmedMsg.length > 4000) {
      return res.status(400).json({ message: "Tin nhắn quá dài (tối đa 4.000 ký tự)" });
    }

    // Lấy thêm dữ liệu địa danh và món ăn từ Database nếu có provinceSlug
    let fullProvinceData = { ...provinceData, name: provinceName || provinceData.name };
    if (provinceSlug) {
      try {
        const [provRows] = await db.execute(
          `SELECT id, name, region, description, specialties FROM provinces WHERE slug = ?`,
          [provinceSlug],
        );
        if (provRows.length > 0) {
          const prov = provRows[0];
          fullProvinceData.name = prov.name;
          fullProvinceData.region = prov.region;
          fullProvinceData.description = prov.description || fullProvinceData.description;
          fullProvinceData.specialties = prov.specialties || fullProvinceData.specialties;

          // Lấy landmarks kèm thumbnail
          const [landmarks] = await db.execute(
            `SELECT name, description, thumbnail_url FROM landmarks WHERE province_id = ? AND status = 'active' LIMIT 8`,
            [prov.id],
          );
          fullProvinceData.landmarks = landmarks;

          // Lấy món ăn kèm image_url
          const [foods] = await db.execute(
            `SELECT title, description, image_url FROM province_foods WHERE province_id = ? AND status = 'active' LIMIT 8`,
            [prov.id],
          );
          fullProvinceData.foods = foods;
        }
      } catch (dbErr) {
        console.warn("Could not fetch extra province media from DB:", dbErr.message);
      }
    }

    // Xây dựng System Prompt với đầy đủ kho ảnh thực tế và thông tin người dùng
    const systemPrompt = buildProvinceSystemPrompt(fullProvinceData, userInfo);

    // Định dạng lịch sử hội thoại
    const formattedHistory = (Array.isArray(history) ? history : [])
      .slice(-12)
      .map((msg) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content || msg.text || "" }],
      }))
      .filter((item) => item.parts[0].text.trim().length > 0);

    // Gọi AI với Auto-Fallback
    const { text: rawReply, modelUsed } = await generateWithFallback({
      prompt: trimmedMsg,
      systemInstruction: systemPrompt,
      history: formattedHistory,
    });

    // Tự động tìm kiếm và gắn ảnh chụp thực tế trên Internet
    const reply = await resolveMarkdownImages(rawReply, fullProvinceData);

    res.json({
      reply,
      modelUsed,
      fromCache: false,
    });
  } catch (err) {
    console.error("chatProvince Error:", err);
    res.status(500).json({
      message: err.message || "Trợ lý AI đang bận trong giây lát, bạn vui lòng thử lại nhé!",
    });
  }
};

// ─── 2. TẠO PHIÊN CHAT MỚI (DATABASE SESSION CHO USER) ────────────────────────
// POST /api/chatbot/sessions
const createSession = async (req, res) => {
  try {
    const { album_id } = req.body;

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

// ─── 3. GỬI TIN NHẮN THEO PHIÊN DATABASE ─────────────────────────────────────
// POST /api/chatbot/sessions/:sessionId/messages
const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content } = req.body;

    if (!content?.trim())
      return res
        .status(400)
        .json({ message: "Nội dung tin nhắn không được trống" });

    if (content.length > 5000)
      return res
        .status(400)
        .json({ message: "Nội dung tin nhắn quá dài (tối đa 5.000 ký tự)" });

    const [sessions] = await db.execute(
      `SELECT * FROM chatbot_sessions WHERE id = ? AND user_id = ? AND status = 'active'`,
      [sessionId, req.user.id],
    );
    if (!sessions.length)
      return res.status(404).json({ message: "Không tìm thấy phiên chat" });

    const session = sessions[0];

    const [rawHistory] = await db.execute(
      `SELECT role, content FROM chatbot_messages
       WHERE session_id = ? ORDER BY sent_at DESC LIMIT 20`,
      [sessionId],
    );
    const history = rawHistory.reverse();

    let provinceContext = {};
    if (session.album_id) {
      const [albums] = await db.execute(
        `SELECT a.title, p.name, p.description, p.specialties, p.region, p.id AS province_id
         FROM albums a
         JOIN nfc_cards nc ON nc.id = a.nfc_card_id
         JOIN provinces p  ON p.id  = nc.province_id
         WHERE a.id = ?`,
        [session.album_id],
      );
      if (albums[0]) {
        provinceContext = albums[0];
        const [landmarks] = await db.execute(
          `SELECT name, description, thumbnail_url FROM landmarks WHERE province_id = ? AND status = 'active' LIMIT 6`,
          [provinceContext.province_id],
        );
        provinceContext.landmarks = landmarks;
      }
    }

    const systemPrompt = buildProvinceSystemPrompt(provinceContext);

    const chatHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const { text: rawReply, modelUsed } = await generateWithFallback({
      prompt: content.trim(),
      systemInstruction: systemPrompt,
      history: chatHistory,
    });

    const reply = await resolveMarkdownImages(rawReply, provinceContext);

    await db.execute(
      `INSERT INTO chatbot_messages (session_id, role, content) VALUES (?, 'user', ?)`,
      [sessionId, content],
    );
    await db.execute(
      `INSERT INTO chatbot_messages (session_id, role, content) VALUES (?, 'assistant', ?)`,
      [sessionId, reply],
    );

    res.json({ reply, modelUsed });
  } catch (err) {
    console.error("sendMessage:", err);
    res.status(500).json({ message: "Lỗi server khi phản hồi tin nhắn" });
  }
};

// ─── 4. LẤY LỊCH SỬ PHIÊN CHAT ──────────────────────────────────────────────
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

// ─── 5. LẤY TẤT CẢ PHIÊN CHAT CỦA USER ──────────────────────────────────────
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

// ─── 6. ĐÓNG PHIÊN CHAT ──────────────────────────────────────────────────────
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
  chatProvince,
  createSession,
  sendMessage,
  getSession,
  getMySessions,
  closeSession,
};
