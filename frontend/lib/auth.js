"use client";

const TOKEN_KEY = "vinatap_token";
const USER_KEY = "vinatap_user";

// Lưu token + user sau khi login/register
export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Xóa khi logout
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Lấy token
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Lấy user từ localStorage
export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Đồng bộ lại cache localStorage với dữ liệu user mới nhất (thường là kết
// quả trả về từ authAPI.updateMe()/getMe() sau khi đã lưu thật vào DB qua
// PATCH /api/auth/me). Bản thân hàm này KHÔNG gọi API — chỉ update cache
// phía client để UI đọc lại nhanh mà không cần gọi lại getMe().
export const updateUser = (patch) => {
  const current = getUser() || {};
  const next = { ...current, ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(next));
  return next;
};

// Kiểm tra đã đăng nhập chưa
export const isLoggedIn = () => !!getToken();

// Kiểm tra là admin không
export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};

// Redirect nếu chưa đăng nhập (dùng trong page)
export const requireAuth = (router) => {
  if (!isLoggedIn()) {
    router.push("/auth");
    return false;
  }
  return true;
};

// Redirect nếu không phải admin
export const requireAdmin = (router) => {
  if (!isAdmin()) {
    router.push("/");
    return false;
  }
  return true;
};
