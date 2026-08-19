"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getUser, requireAdmin, clearAuth } from "@/lib/auth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!requireAdmin(router)) return;
    setUser(getUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleUserUpdated = (e) => setUser(e.detail);
    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    return () =>
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  return (
    <div className="app-shell-vertical">
      <Header
        isDrawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
      />
      <AdminSidebar
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
      <main className="app-main-content">{children}</main>
    </div>
  );
}
