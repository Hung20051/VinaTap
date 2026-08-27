"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { isLoggedIn } from "@/lib/auth";
import { nfcAPI } from "@/lib/api";
import Dino404 from "@/components/ui/Dino404";
import DinoLoader from "@/components/ui/DinoLoader";

// Tách riêng vì useSearchParams() bắt buộc phải nằm trong Suspense
function AcceptTransferContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMsg("Link chuyển nhượng không hợp lệ hoặc thiếu mã token.");
      return;
    }
    if (!isLoggedIn()) {
      sessionStorage.setItem("pending_transfer_token", token);
      router.push(`/auth?redirect=/transfer/accept?token=${token}`);
    }
  }, [token, router]);

  const handleAccept = async () => {
    setStatus("loading");
    try {
      const res = await nfcAPI.acceptTransfer(token);
      setMsg(res.message);
      setStatus("success");
    } catch (err) {
      setMsg(err.message || "Chấp nhận chuyển thẻ thất bại");
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <DinoLoader
        text="Đang xử lý nhận mảnh ghép NFC..."
        subtext="Vui lòng chờ trong giây lát"
        size={260}
        fullScreen={true}
      />
    );
  }

  if (status === "error") {
    return (
      <Dino404
        title="Liên Kết Chuyển Thẻ Không Hợp Lệ"
        message={msg || "Liên kết tặng thẻ này đã hết hạn, đã được nhận hoặc không tồn tại."}
        backBtnText="Quay Lại"
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
        </div>
      </nav>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1rem",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 20,
            padding: "2.5rem 2rem",
            maxWidth: 440,
            width: "100%",
            textAlign: "center",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {status === "idle" && (
            <>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎁</div>
              <h1
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  marginBottom: ".75rem",
                }}
              >
                Nhận Mảnh Ghép NFC
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "1.5rem",
                  fontSize: ".9rem",
                }}
              >
                Có người muốn tặng bạn một mảnh ghép VinaTap. Bấm xác nhận để
                nhận thẻ về tài khoản của bạn.
              </p>
              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1rem",
                  padding: ".8rem",
                }}
                onClick={handleAccept}
              >
                ✅ Xác Nhận Nhận Thẻ Ngay
              </button>
              <Link
                href="/"
                style={{
                  display: "block",
                  marginTop: "1rem",
                  color: "var(--text-secondary)",
                  fontSize: ".85rem",
                }}
              >
                Từ chối
              </Link>
            </>
          )}

          {status === "success" && (
            <>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
              <h2 style={{ fontWeight: 800, color: "#16a34a", marginBottom: ".5rem" }}>
                Nhận Thẻ Thành Công!
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "1.5rem",
                }}
              >
                {msg}
              </p>
              <Link
                href="/customer/dashboard"
                className="btn btn-primary"
                style={{ justifyContent: "center", width: "100%" }}
              >
                Xem Dashboard Của Tôi
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AcceptTransferPage() {
  return (
    <Suspense
      fallback={
        <DinoLoader
          text="Đang nạp thông tin chuyển thẻ..."
          subtext="Vui lòng chờ trong giây lát"
          size={240}
          fullScreen={true}
        />
      }
    >
      <AcceptTransferContent />
    </Suspense>
  );
}
