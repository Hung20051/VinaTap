"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { getUser, requireAuth, clearAuth } from "@/lib/auth";
import {
  User as UserIcon,
  KeyRound,
  Palette,
  LifeBuoy,
  FileText,
  Info,
} from "lucide-react";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "@/styles/settings-shell.css";

export default function SettingsLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("vi");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!requireAuth(router)) return;
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
      href: "/settings/account",
      icon: <UserIcon size={20} />,
      label: t(lang, "account"),
    },
    {
      href: "/settings/password",
      icon: <KeyRound size={20} />,
      label: t(lang, "password"),
    },
    {
      href: "/settings/appearance",
      icon: <Palette size={20} />,
      label: t(lang, "appearance"),
    },
    {
      href: "/settings/support",
      icon: <LifeBuoy size={20} />,
      label: t(lang, "support"),
    },
    {
      href: "/settings/legal",
      icon: <FileText size={20} />,
      label: t(lang, "legal"),
    },
    {
      href: "/settings/about",
      icon: <Info size={20} />,
      label: t(lang, "about"),
    },
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
        roleLabel={t(lang, "settings") || "Cài Đặt"}
        onLogout={handleLogout}
      />
      <main className="app-main-content">
        <div className="settings-page">{children}</div>
      </main>
    </div>
  );
}
