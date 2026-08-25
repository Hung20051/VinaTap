"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DinoLoader from "@/components/ui/DinoLoader";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
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
      <DinoLoader fullScreen={false} size={220} text="Đang chuyển hướng vào Bảng Quản Trị..." subtext="Vui lòng chờ trong giây lát" />
    </div>
  );
}
