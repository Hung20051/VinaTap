require("dotenv").config();
// VinaTap Backend Server
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("./config/passport"); // khởi tạo strategy

const app = express();

// --- Middleware ---
// helmet set sẵn các security header cơ bản (X-Content-Type-Options,
// X-Frame-Options, Strip X-Powered-By,...). API thuần JSON (không tự
// render HTML) nên tắt content-security-policy mặc định của helmet để
// tránh chặn nhầm response — CSP nên cấu hình ở tầng frontend/CDN thay vì
// ở đây.
app.use(helmet({ contentSecurityPolicy: false }));

// Danh sách domain được phép gọi API (whitelist)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (server-to-server webhook, curl, mobile app) hoặc đang chạy môi trường dev
      if (!origin || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
    exposedHeaders: ["x-new-token"],
  }),
);

// Giới hạn body payload an toàn ở mức 2MB (chống DoS / tràn bộ nhớ)
// Riêng file upload ảnh/video dung lượng lớn được xử lý riêng bằng Multer
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(passport.initialize()); // không dùng session

// --- Global Rate Limiter ---
const { globalLimiter } = require("./middleware/rateLimit");
app.use("/api", globalLimiter);

// --- Maintenance check ---
app.use("/api", require("./middleware/maintenance"));

// --- Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/provinces", require("./routes/provinces"));
app.use("/api/nfc", require("./routes/nfc"));
app.use("/api/albums", require("./routes/albums"));
app.use("/api/media", require("./routes/media"));
app.use("/api/stickers", require("./routes/stickers"));
app.use("/api/chatbot", require("./routes/chatbot"));
app.use("/api/products", require("./routes/products"));
app.use("/api/manual-sales", require("./routes/manualSales"));
app.use("/api/admin-stats", require("./routes/adminStats"));
app.use("/api/users", require("./routes/users"));
app.use("/api/system-settings", require("./routes/systemSettings"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/vouchers", require("./routes/vouchers"));
app.use("/api/shipping", require("./routes/shipping"));

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error("[ErrorHandler]", err.stack || err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

const http = require("http");
const { initSocket } = require("./config/socket");

const server = http.createServer(app);
initSocket(server);

// Cron: tự động hủy đơn VietQR pending quá 24h & hoàn trả voucher (mỗi 10 phút)
const Order = require("./models/Order");
Order.autoCancelExpiredOrders(); // chạy 1 lần ngay khi start
setInterval(() => Order.autoCancelExpiredOrders(), 10 * 60 * 1000);

server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

