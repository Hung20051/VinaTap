const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

const initSocket = (server) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        process.env.FRONTEND_URL,
      ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || process.env.NODE_ENV !== "production") {
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization &&
        socket.handshake.headers.authorization.split(" ")[1]);

    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
      } catch (err) {
        // Token không hợp lệ thì vẫn cho kết nối dạng guest
        socket.user = null;
      }
    } else {
      socket.user = null;
    }
    next();
  });

  io.on("connection", (socket) => {
    // Client tham gia phòng Album để nhận real-time sync
    socket.on("join_album", (albumIdentifier) => {
      if (albumIdentifier) {
        const roomName = `album_${albumIdentifier}`;
        socket.join(roomName);
      }
    });

    // Client rời phòng Album
    socket.on("leave_album", (albumIdentifier) => {
      if (albumIdentifier) {
        const roomName = `album_${albumIdentifier}`;
        socket.leave(roomName);
      }
    });

    // Client đăng ký nhận thông báo cá nhân theo userId (Bảo vệ chống nghe lén)
    socket.on("join_user", (userId) => {
      if (!userId) return;
      const targetUserId = Number(userId);
      // Chỉ cho phép user join room thông báo của chính mình hoặc admin
      if (
        socket.user &&
        (socket.user.id === targetUserId || socket.user.role === "admin")
      ) {
        socket.join(`user_${targetUserId}`);
      } else {
        console.warn(
          `[Socket.io Security] Từ chối join_user(${targetUserId}) do không khớp xác thực.`,
        );
      }
    });
  });

  console.log("⚡ Socket.io initialized successfully");
  return io;
};

const getIO = () => {
  return io;
};

// Tiện ích phát sự kiện tới tất cả người đang mở Album
const emitToAlbum = (albumId, shareCode, event, data) => {
  if (!io) return;
  if (albumId) io.to(`album_${albumId}`).emit(event, data);
  if (shareCode && shareCode !== albumId)
    io.to(`album_${shareCode}`).emit(event, data);
};

// Tiện ích phát sự kiện tới 1 User cụ thể
const emitToUser = (userId, event, data) => {
  if (!io || !userId) return;
  io.to(`user_${userId}`).emit(event, data);
};

module.exports = {
  initSocket,
  getIO,
  emitToAlbum,
  emitToUser,
};
