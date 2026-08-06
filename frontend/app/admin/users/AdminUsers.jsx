"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  Ban,
  ShieldOff,
  CheckCircle2,
  Eye,
  Phone,
} from "lucide-react";
import { userAPI } from "../../../lib/api";
import { getUser } from "../../../lib/auth";
import UserDetailModal from "./components/UserDetailModal";
import "./AdminUsers.css";

const PAGE_SIZE = 20;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // {type, user} | null
  const [selectedUserId, setSelectedUserId] = useState(null);

  const currentUser = getUser();

  // Unified single effect with debounced search/role filter handling
  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await userAPI.getAll({
          search: search.trim(),
          role: roleFilter,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });
        if (!isCancelled) {
          setUsers(res.users || []);
          setTotal(res.total || 0);
        }
      } catch (err) {
        if (!isCancelled) {
          showToast(err.message || "Lỗi tải danh sách người dùng", "error");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [search, roleFilter, page]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val) => {
    setRoleFilter(val);
    setPage(1);
  };

  const reloadData = async () => {
    try {
      const res = await userAPI.getAll({
        search: search.trim(),
        role: roleFilter,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      setUsers(res.users || []);
      setTotal(res.total || 0);
    } catch (err) {
      showToast(err.message || "Lỗi tải danh sách người dùng", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const requestConfirm = (type, user) => setConfirmAction({ type, user });

  const runConfirmedAction = async () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;
    try {
      if (type === "ban") {
        await userAPI.setStatus(user.id, "banned");
        showToast(`Đã khóa tài khoản ${user.name}`);
      } else if (type === "unban") {
        await userAPI.setStatus(user.id, "active");
        showToast(`Đã mở khóa tài khoản ${user.name}`);
      } else if (type === "promote") {
        await userAPI.setRole(user.id, "admin");
        showToast(`Đã nâng ${user.name} thành admin`);
      } else if (type === "demote") {
        await userAPI.setRole(user.id, "customer");
        showToast(`Đã hạ ${user.name} về customer`);
      }
      setConfirmAction(null);
      reloadData();
    } catch (err) {
      showToast(err.message || "Lỗi cập nhật", "error");
      setConfirmAction(null);
    }
  };

  const confirmMessages = {
    ban: (u) =>
      `Khóa tài khoản "${u.name}"? Người này sẽ không đăng nhập được nữa.`,
    unban: (u) => `Mở khóa tài khoản "${u.name}"?`,
    promote: (u) =>
      `Nâng "${u.name}" lên quyền Admin? Người này sẽ truy cập được toàn bộ trang quản trị.`,
    demote: (u) =>
      `Hạ "${u.name}" xuống quyền Customer? Người này sẽ mất quyền truy cập trang quản trị.`,
  };

  return (
    <div>
      <div className="admin-users-sticky-header">
        <h1 className="admin-dash-title">👥 Người dùng</h1>
        <p className="admin-dash-subtitle">
          Danh sách tài khoản đã đăng ký qua web
        </p>

        <div className="admin-users-filters">
          <div className="admin-users-search">
            <Search size={16} className="admin-users-search__icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="admin-users-search__input"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="admin-users-role-filter"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-dash-loading">
          <div className="spinner" />
        </div>
      ) : users.length === 0 ? (
        <div className="card admin-users-empty">
          {search ? "Không tìm thấy user nào khớp" : "Chưa có người dùng nào"}
        </div>
      ) : (
        <div className="card admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Liên hệ</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thẻ NFC</th>
                <th>Album</th>
                <th>Ngày đăng ký</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-users-identity">
                        <span className="admin-users-avatar">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" />
                          ) : (
                            u.name.trim().charAt(0).toUpperCase()
                          )}
                        </span>
                        <div>
                          <p className="admin-users-name">
                            {u.name}{" "}
                            {isSelf && (
                              <span className="admin-users-you-tag">(bạn)</span>
                            )}
                          </p>
                          <p className="admin-users-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-users-contact-cell">
                        {u.phone ? (
                          <span className="admin-users-phone">
                            <Phone size={12} /> {u.phone}
                          </span>
                        ) : (
                          <span className="admin-users-no-phone">Chưa có SĐT</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${u.role === "admin" ? "badge-primary" : ""}`}
                      >
                        {u.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-users-status admin-users-status--${u.status === "banned" ? "banned" : "active"}`}
                      >
                        {u.status === "banned" ? "Đã khóa" : "Hoạt động"}
                      </span>
                    </td>
                    <td>{u.nfc_count}</td>
                    <td>{u.album_count}</td>
                    <td>
                      {new Date(u.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <div className="admin-users-actions">
                        <button
                          type="button"
                          onClick={() => setSelectedUserId(u.id)}
                          className="admin-users-action-btn"
                          title="Xem chi tiết hồ sơ, Thẻ NFC & Album"
                        >
                          <Eye size={15} />
                        </button>

                        {u.role === "admin" ? (
                          <button
                            disabled={isSelf}
                            onClick={() => requestConfirm("demote", u)}
                            className="admin-users-action-btn"
                            title={
                              isSelf
                                ? "Không thể tự đổi quyền chính mình"
                                : "Hạ về Customer"
                            }
                          >
                            <ShieldOff size={15} />
                          </button>
                        ) : (
                          <button
                            disabled={isSelf}
                            onClick={() => requestConfirm("promote", u)}
                            className="admin-users-action-btn"
                            title="Nâng lên Admin"
                          >
                            <ShieldCheck size={15} />
                          </button>
                        )}

                        {u.status === "banned" ? (
                          <button
                            disabled={isSelf}
                            onClick={() => requestConfirm("unban", u)}
                            className="admin-users-action-btn admin-users-action-btn--success"
                            title="Mở khóa"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        ) : (
                          <button
                            disabled={isSelf}
                            onClick={() => requestConfirm("ban", u)}
                            className="admin-users-action-btn admin-users-action-btn--danger"
                            title={
                              isSelf
                                ? "Không thể tự khóa tài khoản đang đăng nhập"
                                : "Khóa tài khoản"
                            }
                          >
                            <Ban size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="admin-users-pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-ghost"
          >
            ← Trang trước
          </button>
          <span className="admin-users-pagination__info">
            Trang {page} / {Math.max(1, Math.ceil(total / PAGE_SIZE))} — tổng {total} người dùng
          </span>
          <button
            onClick={() => setPage((p) => (p * PAGE_SIZE < total ? p + 1 : p))}
            disabled={page * PAGE_SIZE >= total}
            className="btn btn-ghost"
          >
            Trang sau →
          </button>
        </div>
      )}

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          showToast={showToast}
        />
      )}

      {confirmAction && (
        <div
          className="admin-users-modal-backdrop"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="card admin-users-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="admin-users-confirm-text">
              {confirmMessages[confirmAction.type](confirmAction.user)}
            </p>
            <div className="admin-users-confirm-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmAction(null)}
              >
                Hủy
              </button>
              <button
                className={`btn ${confirmAction.type === "ban" || confirmAction.type === "demote" ? "btn-danger" : "btn-primary"}`}
                onClick={runConfirmedAction}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-users-toast admin-users-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
