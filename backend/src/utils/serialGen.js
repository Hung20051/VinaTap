const crypto = require("crypto");

// ─── SERIAL CODE (Bảo mật cao, Không thể đoán, Dễ đọc) ──────
// Dùng cho: in tem/thẻ backup, hỗ trợ khách hàng, cào tem kích hoạt
// Sử dụng bộ ký tự an toàn không nhầm lẫn (bỏ 0, O, 1, I) + sinh ngẫu nhiên mã hóa
// Ví dụ: DN-2026-X8K9-M4P7
const CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const generateSerial = (prefix = "VN") => {
  const year = new Date().getFullYear();
  const bytes = crypto.randomBytes(8);
  let chunk1 = "";
  let chunk2 = "";
  for (let i = 0; i < 4; i++) {
    chunk1 += CHARS[bytes[i] % CHARS.length];
    chunk2 += CHARS[bytes[i + 4] % CHARS.length];
  }
  return `${prefix.toUpperCase()}-${year}-${chunk1}-${chunk2}`;
};

const generateBatch = (prefix, count) => {
  const serials = new Set();
  while (serials.size < count) {
    serials.add(generateSerial(prefix));
  }
  return Array.from(serials);
};

// ─── NFC TOKEN (an toàn, nhúng vào chip URL) ─────────────────
// Dùng cho: URL trong chip NFC → vinatap.com/t/{nfc_token}
// KHÔNG dùng serial_code cho URL chip vì serial có pattern dễ đoán
// 24 byte = 48 ký tự hex — không thể brute-force
const generateNfcToken = () => crypto.randomBytes(24).toString("hex");

module.exports = { generateSerial, generateBatch, generateNfcToken };
