"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SettingsSidebar from "../../components/SettingsSidebar";
import { getUser, requireAuth } from "../../lib/auth";

export default function SettingsLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    requireAuth(router);
    setUser(getUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleUserUpdated = (e) => setUser(e.detail);
    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    return () =>
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
  }, []);

  return (
    <div className="app-shell">
      <SettingsSidebar user={user} />
      <div className="admin-content">{children}</div>
    </div>
  );
}
