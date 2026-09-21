"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getUser, isAdmin, clearAuth, updateUser } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "@/styles/admin-shell.css";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // Kiểm tra nếu là trang Visual Editor cẩm nang (có thanh công cụ riêng)
  const isVisualEditor = pathname?.includes("/provinces/") && pathname?.endsWith("/edit");

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async () => {
      // 1. Kiểm tra nhanh ở client
      if (!isAdmin()) {
        router.replace("/auth");
        return;
      }

      // 2. Xác thực thực tế với Backend API /auth/me
      try {
        const res = await authAPI.getMe();
        if (isMounted) {
          if (res?.user && res.user.role === "admin") {
            updateUser(res.user);
            setUser(res.user);
            setAuthorized(true);
          } else {
            clearAuth();
            router.replace("/auth");
          }
        }
      } catch (err) {
        if (isMounted) {
          clearAuth();
          router.replace("/auth");
        }
      }
    };

    verifyAdmin();

    return () => {
      isMounted = false;
    };
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
        {!isVisualEditor && (
          <AdminHeader
            isDrawerOpen={false}
            onToggleDrawer={() => {}}
          />
        )}
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

  if (isVisualEditor) {
    return <main className="admin-visual-editor-root">{children}</main>;
  }

  return (
    <div className="app-shell-vertical admin-shell-root">
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
      <main className="app-main-content admin-main-content">{children}</main>
    </div>
  );
}
