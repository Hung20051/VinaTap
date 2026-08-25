"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getUser, isAdmin, clearAuth } from "@/lib/auth";
import DinoLoader from "@/components/ui/DinoLoader";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.replace("/auth");
    } else {
      setUser(getUser());
      setAuthorized(true);
    }
  }, [router]);

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

  if (!authorized) {
    return (
      <div className="app-shell-vertical">
        <AdminHeader
          isDrawerOpen={false}
          onToggleDrawer={() => {}}
        />
        <main
          className="app-main-content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
          }}
        >
          <DinoLoader fullScreen={false} size={220} text="Đang xác thực quyền Quản trị viên..." subtext="Vui lòng chờ trong giây lát" />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell-vertical">
      <AdminHeader
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
