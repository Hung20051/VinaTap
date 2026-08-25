import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
    : "http://localhost:5000");

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const token = localStorage.getItem("token");
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("⚡ Connected to VinaTap Real-time Socket server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected from Socket server:", reason);
    });
  }

  return socket;
};

export const joinAlbumRoom = (albumIdentifier) => {
  const s = getSocket();
  if (s && albumIdentifier) {
    s.emit("join_album", albumIdentifier);
  }
};

export const leaveAlbumRoom = (albumIdentifier) => {
  const s = getSocket();
  if (s && albumIdentifier) {
    s.emit("leave_album", albumIdentifier);
  }
};
