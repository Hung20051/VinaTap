"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  User,
  LogIn,
  LogOut,
  Settings,
  ShieldCheck,
  ChevronDown,
  BarChart3,
  FileText,
  Package,
} from "lucide-react";
import { getUser, isAdmin, clearAuth } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import "./NavbarAuthButton.css";

export default function NavbarAuthButton() {
  const [user, setUser] = useState(null);
  const [userAdmin, setUserAdmin] = useState(false);
  const [lang, setLang] = useState("en");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
    setUserAdmin(isAdmin());
    setLang(getLang());

    const handleUserUpdated = (e) => {
      setUser(e.detail);
      setUserAdmin(isAdmin());
    };

    const handleLangUpdated = (e) => {
      setLang(e.detail);
    };

    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    window.addEventListener("storage", handleUserUpdated);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
      window.removeEventListener("storage", handleUserUpdated);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setUserAdmin(false);
    setDropdownOpen(false);
    window.location.href = "/";
  };

  const isVi = lang === "vi";

  // 1. Trường hợp CHƯA ĐĂNG NHẬP
  if (!user) {
    return (
      <Link
        href="/auth"
        className="vnn-nav-auth-login-btn"
        title={isVi ? "Đăng nhập / Đăng ký" : "Login / Register"}
      >
        <LogIn size={14} className="vnn-nav-auth-icon" />
        <span>{isVi ? "Đăng nhập" : "Login"}</span>
      </Link>
    );
  }

  // 2. Trường hợp ĐÃ ĐĂNG NHẬP (Hiển thị avatar + dropdown menu)
  return (
    <div className="vnn-nav-auth-wrapper" ref={menuRef}>
      <button
        type="button"
        className="vnn-nav-auth-user-btn"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={user.name || user.email}
      >
        <div className="vnn-nav-auth-avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name || "User"} />
          ) : (
            <span>{(user.name || user.email || "U")[0].toUpperCase()}</span>
          )}
        </div>
        <span className="vnn-nav-auth-username">
          {userAdmin ? "Admin" : user.name || "Tài khoản"}
        </span>
        <ChevronDown size={13} className={`vnn-nav-auth-chevron ${dropdownOpen ? "is-open" : ""}`} />
      </button>

      {dropdownOpen && (
        <div className="vnn-nav-auth-dropdown">
          <div className="vnn-nav-auth-dropdown-header">
            <div className="vnn-nav-auth-dropdown-name-row">
              <strong>{user.name || "Người dùng VinaTap"}</strong>
              {userAdmin && <span className="vnn-nav-auth-admin-badge">ADMIN</span>}
            </div>
            <span className="vnn-nav-auth-dropdown-email">{user.email}</span>
          </div>

          <div className="vnn-nav-auth-dropdown-divider" />

          {/* Menu dành cho Quản trị viên */}
          {userAdmin ? (
            <Link
              href="/admin/dashboard"
              className="vnn-nav-auth-dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <ShieldCheck size={15} color="#00c2cb" />
              <span>{isVi ? "Bảng Điều Khiển Admin" : "Admin Dashboard"}</span>
            </Link>
          ) : (
            /* Menu dành cho Khách hàng */
            <>
              <Link
                href="/customer/dashboard"
                className="vnn-nav-auth-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <User size={15} color="#00c2cb" />
                <span>{isVi ? "Bộ sưu tập của tôi" : "My Collection"}</span>
              </Link>
              <Link
                href="/customer/orders"
                className="vnn-nav-auth-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <Package size={15} color="#2563eb" />
                <span>{isVi ? "Đơn hàng của tôi" : "My Orders"}</span>
              </Link>
            </>
          )}

          <Link
            href="/settings/account"
            className="vnn-nav-auth-dropdown-item"
            onClick={() => setDropdownOpen(false)}
          >
            <Settings size={15} color="#64748b" />
            <span>{isVi ? "Cài đặt tài khoản" : "Account Settings"}</span>
          </Link>

          <div className="vnn-nav-auth-dropdown-divider" />

          <button
            type="button"
            className="vnn-nav-auth-dropdown-item is-logout"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            <span>{isVi ? "Đăng xuất" : "Logout"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
