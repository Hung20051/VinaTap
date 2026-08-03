"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings/account");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="spinner" />
    </div>
  );
}
