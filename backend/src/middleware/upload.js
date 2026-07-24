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

// Wrap multer thành promise để dùng async/await
const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (err) => (err ? reject(err) : resolve()));
  });

module.exports = { uploadSingle, uploadMultiple, runMiddleware };
