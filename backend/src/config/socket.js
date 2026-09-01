const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { getAllowedOrigins } = require("../utils/corsOrigins");
const Album = require("../models/Album");

let io = null;

const initSocket = (server) => {
  const allowedOrigins = getAllowedOrigins();

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
    // Client tham gia phòng Album để nhận real-time sync (Bảo vệ quyền riêng tư album private)
    socket.on("join_album", async (albumIdentifier) => {
      if (!albumIdentifier) return;
      try {
        const album = await Album.findById(albumIdentifier);
        if (!album) return;

        // 1. Album Public -> Cho phép mọi người (kể cả Guest) tham gia
        if (album.is_public) {
          return socket.join(`album_${albumIdentifier}`);
        }

        // 2. Album Private -> Bắt buộc phải đăng nhập và là Owner, Admin, hoặc Collaborator
        if (!socket.user) return;
        const userId = Number(socket.user.id);

        if (album.owner_id === userId || socket.user.role === "admin") {
          return socket.join(`album_${albumIdentifier}`);
        }

        const canEdit = await Album.canEdit(album.id, userId);
        if (canEdit) {
          return socket.join(`album_${albumIdentifier}`);
        }
      } catch (err) {
        console.error("Socket join_album auth error:", err.message);
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
