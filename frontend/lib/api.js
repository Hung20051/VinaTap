export const getBaseUrl = () => {
  // Ưu tiên env var — trên Vercel/production, set NEXT_PUBLIC_API_URL để trỏ
  // tới backend thật (vd Railway). Không hardcode URL production trong source.
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Khi chạy local (localhost, 127.0.0.1 hoặc IP mạng LAN)
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".local")
    ) {
      return `http://${host}:5000/api`;
    }
  }

  // Trên production SSR (server-side), thiếu env var sẽ fail — cảnh báo sớm
  if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️ [VinaTap] NEXT_PUBLIC_API_URL chưa được set! API calls server-side sẽ fail trên production.",
    );
  }

  return "http://localhost:5000/api";
};

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("vinatap_token");
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const baseUrl = getBaseUrl();
  let res;
  try {
    res = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
  } catch (netErr) {
    console.error(`Fetch error at ${baseUrl}${endpoint}:`, netErr);
    throw new Error(
      `Không thể kết nối đến máy chủ Backend (${baseUrl}). Vui lòng đảm bảo Backend đang chạy.`,
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = {
      message: res.statusText || "Lỗi máy chủ phản hồi không đúng định dạng",
    };
  }

  if (!res.ok) throw new Error(data.message || "Lỗi không xác định");
  return data;
};

const upload = async (endpoint, formData) => {
  const token = getToken();
  const baseUrl = getBaseUrl();
  let res;
  try {
    res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  } catch (netErr) {
    console.error(`Upload fetch error at ${baseUrl}${endpoint}:`, netErr);
    throw new Error(`Không thể kết nối đến máy chủ Backend (${baseUrl}).`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: res.statusText || "Lỗi upload" };
  }

  if (!res.ok) throw new Error(data.message || "Lỗi upload");
  return data;
};

// Giống upload() nhưng dùng PUT — cần cho các API sửa (vd đổi ảnh
// sticker) vừa nhận file vừa nhận field text trong cùng 1 request.
const uploadPut = async (endpoint, formData) => {
  const token = getToken();
  const baseUrl = getBaseUrl();
  let res;
  try {
    res = await fetch(`${baseUrl}${endpoint}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  } catch (netErr) {
    console.error(`Upload PUT fetch error at ${baseUrl}${endpoint}:`, netErr);
    throw new Error(`Không thể kết nối đến máy chủ Backend (${baseUrl}).`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: res.statusText || "Lỗi upload" };
  }
  if (!res.ok) throw new Error(data.message || "Lỗi upload");
  return data;
};

// ─── AUTH ─────────────────────────────────────────────────────
export const authAPI = {
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),
  updateMe: (body) =>
    request("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),
  changePassword: (body) =>
    request("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  uploadAvatar: (formData) => upload("/auth/me/avatar", formData),
  googleUrl: () => `${getBaseUrl()}/auth/google`,

  // OTP register
  requestRegisterOtp: (body) =>
    request("/auth/register/request-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyRegisterOtp: (body) =>
    request("/auth/register/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // OTP forgot password
  requestForgotPasswordOtp: (body) =>
    request("/auth/forgot-password/request-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyForgotPasswordOtp: (body) =>
    request("/auth/forgot-password/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  resetPassword: (body) =>
    request("/auth/forgot-password/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ─── PROVINCES ────────────────────────────────────────────────
export const provinceAPI = {
  getAll: (includeInactive = false) =>
    request(`/provinces${includeInactive ? "?include_inactive=true" : ""}`),
  getOne: (slug) => request(`/provinces/${slug}`),
  getBySlug: (slug) => request(`/provinces/${slug}`),
  create: (data) =>
    request("/provinces", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/provinces/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => request(`/provinces/${id}`, { method: "DELETE" }),
  // Landmarks
  createLandmark: (provinceId, data) =>
    request(`/provinces/${provinceId}/landmarks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateLandmark: (landmarkId, data) =>
    request(`/provinces/landmarks/${landmarkId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteLandmark: (landmarkId) =>
    request(`/provinces/landmarks/${landmarkId}`, { method: "DELETE" }),
  uploadFile: (formData) => upload("/provinces/upload", formData),
};

// ─── NFC ──────────────────────────────────────────────────────
export const nfcAPI = {
  tap: (token) => request(`/nfc/t/${token}`),
  claim: (token) => request(`/nfc/t/${token}/claim`, { method: "POST" }),
  activate: (serial_code) =>
    request("/nfc/activate", {
      method: "POST",
      body: JSON.stringify({ serial_code }),
    }),
  myCards: () => request("/nfc/my-cards"),

  // Chuyển nhượng & Nhận quà
  getPendingTransfers: () => request("/nfc/transfers/pending"),
  initiateTransfer: (cardId, body) =>
    request(`/nfc/${cardId}/transfer`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  cancelTransfer: (cardId) =>
    request(`/nfc/${cardId}/transfer`, { method: "DELETE" }),
  acceptTransfer: (data) =>
    request("/nfc/transfer/accept", {
      method: "POST",
      body: JSON.stringify(typeof data === "string" ? { token: data } : data),
    }),
  rejectTransfer: (data) =>
    request("/nfc/transfers/reject", {
      method: "POST",
      body: JSON.stringify(typeof data === "number" || typeof data === "string" ? { transfer_id: data } : data),
    }),

  // Admin
  adminSearch: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return request(`/nfc/admin/search${qs ? `?${qs}` : ""}`);
  },
  adminAssignCard: (body) =>
    request("/nfc/admin/assign", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  provisionCard: (body) =>
    request("/nfc/admin/provision", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createBatch: (body) =>
    request("/nfc/batch", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getByProvince: (provinceId) => request(`/nfc/province/${provinceId}`),
};

// ─── ALBUMS ───────────────────────────────────────────────────
export const albumAPI = {
  create: (body) =>
    request("/albums", { method: "POST", body: JSON.stringify(body) }),
  getOne: (id) => request(`/albums/${id}`),
  getMy: () => request("/albums/my"),
  update: (id, body) =>
    request(`/albums/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/albums/${id}`, { method: "DELETE" }),
  createTag: (id, body) =>
    request(`/albums/${id}/tags`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteTag: (id, tagId) =>
    request(`/albums/${id}/tags/${tagId}`, { method: "DELETE" }),

  requestCollaborator: (id) =>
    request(`/albums/${id}/share/request`, { method: "POST" }),
  getCollaborators: (id) => request(`/albums/${id}/share`),
  reviewCollaborator: (id, shareId, status) =>
    request(`/albums/${id}/share/${shareId}`, {
      method: "PUT",
      body: JSON.stringify({ action: status }),
    }),
  revokeCollaborator: (id, shareId) =>
    request(`/albums/${id}/share/${shareId}`, { method: "DELETE" }),

  // Báo cáo vi phạm
  report: (id, body) =>
    request(`/albums/${id}/report`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Admin
  getAdminStats: () => request("/albums/admin/stats"),
  getAdminList: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return request(`/albums/admin/list${qs ? `?${qs}` : ""}`);
  },
  getAdminReports: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return request(`/albums/admin/reports${qs ? `?${qs}` : ""}`);
  },
  resolveReport: (id, body) =>
    request(`/albums/admin/reports/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateAdminStatus: (id, body) =>
    request(`/albums/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

// ─── NOTIFICATIONS ────────────────────────────────────────────
export const notificationAPI = {
  getMy: () => request("/notifications/my"),
  markAsRead: (notificationId) =>
    request("/notifications/read", {
      method: "POST",
      body: JSON.stringify({ notificationId }),
    }),
  sendAdmin: (body) =>
    request("/notifications/admin/send", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAdminSentHistory: () => request("/notifications/admin/sent"),
  deleteAdmin: (id) =>
    request(`/notifications/admin/${id}`, { method: "DELETE" }),
};

// ─── MEDIA ────────────────────────────────────────────────────
export const mediaAPI = {
  upload: (formData) => upload("/media/upload", formData),
  uploadMultiple: (formData) => upload("/media/upload-multiple", formData),
  update: (id, body) =>
    request(`/media/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  updateCaption: (id, caption_user) =>
    request(`/media/${id}`, {
      method: "PUT",
      body: JSON.stringify({ caption_user }),
    }),
  delete: (id) => request(`/media/${id}`, { method: "DELETE" }),
  addSticker: (id, body) =>
    request(`/media/${id}/stickers`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateSticker: (overlayId, body) =>
    request(`/media/stickers/${overlayId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteSticker: (overlayId) =>
    request(`/media/stickers/${overlayId}`, { method: "DELETE" }),
  addTag: (id, tag_id) =>
    request(`/media/${id}/tags`, {
      method: "POST",
      body: JSON.stringify({ tag_id }),
    }),
  removeTag: (id, tagId) =>
    request(`/media/${id}/tags/${tagId}`, { method: "DELETE" }),
};

// ─── STICKERS ─────────────────────────────────────────────────
export const stickerAPI = {
  getAll: (category) =>
    request(`/stickers${category ? `?category=${category}` : ""}`),
  getCategories: () => request("/stickers/categories"),

  // Admin — xem cả sticker đã ẩn + số lượt dùng
  getAllAdmin: () => request("/stickers/admin"),

  // Admin — tạo/sửa đều gửi FormData (có thể kèm file ảnh hoặc không,
  // updateSticker phía backend chấp nhận cả 2 trường hợp)
  create: (formData) => upload("/stickers", formData),
  bulkCreate: (formData) => upload("/stickers/bulk", formData),
  update: (id, formData) => uploadPut(`/stickers/${id}`, formData),
  reorder: (ids) =>
    request("/stickers/reorder", {
      method: "PUT",
      body: JSON.stringify({ ids }),
    }),
  setStatus: (id, status) => {
    const formData = new FormData();
    formData.append("status", status);
    return uploadPut(`/stickers/${id}`, formData);
  },
  delete: (id) => request(`/stickers/${id}`, { method: "DELETE" }),
};

// ─── PRODUCTS (admin — sản phẩm cho dropdown tạo đơn thủ công) ─
export const productAPI = {
  getPublic: () => request("/products/public"),
  getAll: (includeInactive) =>
    request(`/products${includeInactive ? "?includeInactive=1" : ""}`),
  create: (body) =>
    request("/products", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  setActive: (id, is_active) =>
    request(`/products/${id}/active`, {
      method: "PATCH",
      body: JSON.stringify({ is_active }),
    }),
  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

// ─── SHIPPING RULES (admin — phí giao hàng & freeship) ───────────
export const shippingAPI = {
  getPublic: () => request("/shipping/public"),
  get: () => request("/shipping"),
  update: (body) =>
    request("/shipping", { method: "PUT", body: JSON.stringify(body) }),
};

// ─── MANUAL SALES (admin — đơn bán thủ công cho đại lý/khách lẻ) ─
export const manualSaleAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return request(`/manual-sales${qs ? `?${qs}` : ""}`);
  },
  create: (body) =>
    request("/manual-sales", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/manual-sales/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id) => request(`/manual-sales/${id}`, { method: "DELETE" }),
  getSummary: () => request("/manual-sales/summary"),
  getDailyRevenue: (days = 30) =>
    request(`/manual-sales/daily-revenue?days=${days}`),
  // Không dùng hàm request() chung — đây là tải file (text/csv), không
  // phải JSON, nên gọi fetch trực tiếp và trả về Blob cho nơi gọi tự tạo
  // link tải xuống.
  exportCsvUrl: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return `${getBaseUrl()}/manual-sales/export${qs ? `?${qs}` : ""}`;
  },
};

// ─── ADMIN STATS (tổng quan — KHÔNG phải doanh thu, xem manualSaleAPI) ─
export const adminStatsAPI = {
  getOverview: () => request("/admin-stats/overview"),
};

// ─── USERS (admin — quản lý tài khoản) ─────────────────────────
export const userAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return request(`/users${qs ? `?${qs}` : ""}`);
  },
  getDetail: (id) => request(`/users/${id}/detail`),
  setStatus: (id, status) =>
    request(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  setRole: (id, role) =>
    request(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};

// ─── CHATBOT ──────────────────────────────────────────────────
export const chatbotAPI = {
  createSession: (album_id) =>
    request("/chatbot/sessions", {
      method: "POST",
      body: JSON.stringify({ album_id }),
    }),
  getSessions: () => request("/chatbot/sessions"),
  getSession: (id) => request(`/chatbot/sessions/${id}`),
  sendMessage: (sessionId, content) =>
    request(`/chatbot/sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  closeSession: (id) =>
    request(`/chatbot/sessions/${id}`, { method: "DELETE" }),
};

// ─── SYSTEM SETTINGS (admin — cài đặt hệ thống) ───────────────
export const systemSettingAPI = {
  get: () => request("/system-settings"),
  update: (body) =>
    request("/system-settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

// ─── ANALYTICS (admin & public traffic tracking) ──────────────
export const analyticsAPI = {
  track: (pagePath, provinceSlug) =>
    request("/analytics/track", {
      method: "POST",
      body: JSON.stringify({ page_path: pagePath, province_slug: provinceSlug }),
    }),
  getStats: (timeframe = "7days") =>
    request(`/analytics/stats?timeframe=${timeframe}`),
};

// ─── ORDERS & E-COMMERCE CHECKOUT ──────────────────────────────
export const orderAPI = {
  create: (body) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMyOrders: () => request("/orders/my"),
  getAdminOrders: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return request(`/orders/admin/all${qs ? `?${qs}` : ""}`);
  },
  updateStatus: (id, status) =>
    request(`/orders/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  checkStatus: (orderCode) => request(`/orders/check-status/${orderCode}`),
};

// ─── VOUCHERS & PROMOTIONS ─────────────────────────────────────
export const voucherAPI = {
  getMyWallet: () => request("/vouchers/my-wallet"),
  redeemCode: (code) =>
    request("/vouchers/redeem", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  getAdminList: () => request("/vouchers"),
  createAdmin: (body) =>
    request("/vouchers", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  sendToUsers: (body) =>
    request("/vouchers/send", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteAdmin: (id) =>
    request(`/vouchers/${id}`, {
      method: "DELETE",
    }),
};
