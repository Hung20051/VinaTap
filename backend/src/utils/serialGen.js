const crypto = require("crypto");

// ─── SERIAL CODE (đẹp, dễ đọc) ──────────────────────────────
// Dùng cho: in backup, hỗ trợ khách hàng, admin tra cứu
// VD: HAN-2025-A3F9C7B1
// 5 byte = 10 ký tự hex (~1.1 nghìn tỷ khả năng) — đủ an toàn cho serial
const generateSerial = (prefix = "VN") => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(5).toString("hex").toUpperCase();
  return `${prefix.toUpperCase()}-${year}-${random}`;
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
