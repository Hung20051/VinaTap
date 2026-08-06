const multer = require("multer");

// Dùng memoryStorage — file giữ trong RAM rồi đẩy thẳng lên Cloudinary
// Không lưu file xuống disk server
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/quicktime",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Chỉ chấp nhận ảnh (jpg, png, webp, gif) hoặc video (mp4, mov)",
      ),
      false,
    );
  }
};

// ⚠️ CHỈ ẢNH — dùng riêng cho những nơi KHÔNG bao giờ được nhận video:
// sticker theme, avatar... (khác với album media, nơi video hợp lệ).
// Trước đây stickerController.createSticker tái dùng chung fileFilter ở
// trên (cho lọt cả video/mp4, video/quicktime) dù form ghi rõ "chỉ nhận
// PNG" — admin lỡ chọn nhầm 1 file video thì Cloudinary nhận rồi báo lỗi
// khó hiểu thay vì bị chặn ngay từ đầu với thông báo rõ ràng.
const imageFileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, webp, gif)"), false);
  }
};

// Upload 1 file
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).single("file");

// Upload nhiều file cùng lúc (tối đa 10)
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
}).array("files", 10);

// Upload 1 ảnh (chỉ ảnh, giới hạn nhỏ hơn — dùng cho sticker/avatar)
const uploadImageOnly = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — ảnh sticker/avatar không cần lớn như media
}).single("file");

// Upload nhiều ảnh cùng lúc (chỉ ảnh, không video) — dùng cho bulk sticker
const uploadImagesOnly = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("files", 10);

// Wrap multer thành promise để dùng async/await
const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (err) => (err ? reject(err) : resolve()));
  });

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadImageOnly,
  uploadImagesOnly,
  runMiddleware,
};
