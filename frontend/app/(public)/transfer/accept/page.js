"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { isLoggedIn } from "@/lib/auth";
import { nfcAPI } from "@/lib/api";

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
      setMsg("Link không hợp lệ — thiếu token.");
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
      setMsg(err.message || "Chấp nhận thất bại");
      setStatus("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
        </div>
      </nav>

      <div style={{ maxWidth: 440, margin: "4rem auto", padding: "0 1rem" }}>
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          {status === "idle" && (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
              <h1
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  marginBottom: ".75rem",
                }}
              >
                Nhận mảnh ghép NFC
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
                ✅ Xác nhận nhận thẻ
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

          {status === "loading" && (
            <>
              <div className="spinner" style={{ margin: "2rem auto" }} />
              <p style={{ color: "var(--text-secondary)" }}>Đang xử lý...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
              <h2 style={{ fontWeight: 700, marginBottom: ".5rem" }}>
                Nhận thẻ thành công!
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
                Xem Dashboard
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
              <h2 style={{ fontWeight: 700, marginBottom: ".5rem" }}>
                Không thể nhận thẻ
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
                href="/"
                className="btn btn-outline"
                style={{ justifyContent: "center" }}
              >
                Về trang chủ
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
      }
    >
      <AcceptTransferContent />
    </Suspense>
  );
}
