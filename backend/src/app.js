require("dotenv").config();
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
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // không dùng session

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
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
