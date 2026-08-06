"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import { getUser, requireAdmin, clearAuth } from "../../lib/auth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

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
    <div className="app-shell">
      <AdminSidebar user={user} onLogout={handleLogout} />
      <div className="admin-content">{children}</div>
    </div>
  );
}
