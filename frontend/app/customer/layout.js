"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { getUser, requireAuth, isAdmin, clearAuth } from "../../lib/auth";
import { LayoutDashboard, ShieldCheck, ShoppingBag } from "lucide-react";
import { t } from "../../lib/i18n";
import { getLang } from "../../lib/prefs";

export default function CustomerLayout({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") return getUser();
    return null;
  });

  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") return getLang();
    return "vi";
  });

  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!requireAuth(router)) return;
    if (isAdmin()) {
      router.replace("/admin");
      return;
    }
    setUser(getUser());
    setLang(getLang());
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
    ...(mounted && isAdmin()
      ? [
          {
            href: "/admin",
            icon: <ShieldCheck size={20} />,
            label: t(lang, "admin"),
          },
        ]
      : []),
  ];

  return (
    <div className="app-shell-vertical">
      <Header
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
