"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { isLoggedIn } from "@/lib/auth";
import { nfcAPI } from "@/lib/api";
import "./TransferAccept.css";

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
    <div className="transfer-page-wrapper">
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
        </div>
      </nav>

      <div className="transfer-content-box">
        <div className="transfer-card">
          {status === "idle" && (
            <>
              <div className="transfer-icon">🎁</div>
              <h1 className="transfer-title">Nhận Mảnh Ghép NFC</h1>
              <p className="transfer-desc">
                Có người muốn tặng bạn một mảnh ghép VinaTap. Bấm xác nhận để
                nhận thẻ về tài khoản của bạn.
              </p>
              <button
                className="transfer-btn-primary"
                onClick={handleAccept}
              >
                ✅ Xác Nhận Nhận Thẻ Ngay
              </button>
              <Link href="/" className="transfer-link-reject">
                Từ chối và quay lại
              </Link>
            </>
          )}

          {status === "loading" && (
            <div className="transfer-spinner-box">
              <div className="spinner" />
              <p className="transfer-desc" style={{ marginTop: "1rem" }}>
                Đang xử lý nhận thẻ...
              </p>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="transfer-icon">🎉</div>
              <h2 className="transfer-title" style={{ color: "#16a34a" }}>
                Nhận Thẻ Thành Công!
              </h2>
              <p className="transfer-desc">{msg}</p>
              <Link
                href="/customer/dashboard"
                className="transfer-btn-primary"
              >
                Xem Bộ Sưu Tập Tại Dashboard
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="transfer-icon">❌</div>
              <h2 className="transfer-title" style={{ color: "#dc2626" }}>
                Không Thể Nhận Thẻ
              </h2>
              <p className="transfer-desc">{msg}</p>
              <Link href="/" className="transfer-btn-primary">
                Về Trang Chủ
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
        <div className="transfer-page-wrapper" style={{ alignItems: "center", justifyContent: "center" }}>
          <div className="spinner" />
        </div>
      }
    >
      <AcceptTransferContent />
    </Suspense>
  );
}
