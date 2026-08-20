"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerHeader from "@/components/layout/CustomerHeader";
import Sidebar from "@/components/layout/Sidebar";
import { getUser, getToken, saveAuth, requireAuth, isAdmin, clearAuth } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { LayoutDashboard, ShoppingBag } from "lucide-react";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/prefs";

export default function CustomerLayout({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("vi");
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!requireAuth(router)) return;
    if (isAdmin()) {
      router.replace("/admin/dashboard");
      return;
    }
    setUser(getUser());
    setLang(getLang());

    // Verify token còn hợp lệ & sync dữ liệu user mới nhất từ server
    authAPI.getMe()
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
          saveAuth(getToken(), res.user);
        }
      })
      .catch(() => {
        // Token hết hạn hoặc user bị ban → đăng xuất
        clearAuth();
        router.push("/auth");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleUserUpdated = (e) => setUser(e.detail);
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  const navItems = [
    {
      href: "/customer/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: t(lang, "collection"),
    },
    {
      href: "/customer/orders",
      icon: <ShoppingBag size={20} />,
      label: "Đơn Hàng Của Tôi",
    },
    {
      href: "/shop",
      icon: <ShoppingBag size={20} />,
      label: "Cửa Hàng Thẻ NFC",
    },
  ];

  if (mounted && isAdmin()) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="app-shell-vertical">
      <CustomerHeader
        isDrawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
      />
      <Sidebar
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        user={user}
        lang={lang}
        roleLabel={mounted && isAdmin() ? t(lang, "admin") : t(lang, "account")}
        onLogout={handleLogout}
      />
      <main className="app-main-content">{children}</main>
    </div>
  );
}
