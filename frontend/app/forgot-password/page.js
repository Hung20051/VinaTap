"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";
import { authAPI } from "../../lib/api";
import { saveAuth, isLoggedIn } from "../../lib/auth";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const router = useRouter();

  // 'email'    -> nhập email để nhận OTP
  // 'otp'      -> chỉ nhập & xác thực OTP
  // 'password' -> nhập mật khẩu mới (đã xác thực OTP xong, không còn phụ
  //               thuộc hạn 10 phút của OTP nữa — dùng resetToken riêng)
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checking, setChecking] = useState(true);
  const cooldownRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/customer/dashboard");
      return;
    }
    setChecking(false);
  }, [router]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      clearInterval(cooldownRef.current);
      return;
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [resendCooldown > 0]);

  const requestOtp = async () => {
    setError("");
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.requestForgotPasswordOtp({
        email: email.trim(),
      });
      setInfoMessage(
        data.message ||
          "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi đến hộp thư của bạn",
      );
      setStep("otp");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      const data = await authAPI.requestForgotPasswordOtp({
        email: email.trim(),
      });
      setInfoMessage(
        data.message || "Mã OTP mới đã được gửi đến email của bạn",
      );
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: chỉ xác thực OTP. OTP chỉ cần đúng 1 lần ở đây — sau khi xác
  // thực xong, mã OTP coi như đã "dùng" (backend consume luôn), và ta nhận
  // về resetToken riêng để bước nhập mật khẩu mới không còn bị ràng buộc
  // bởi hạn 10 phút của OTP nữa.
  const verifyOtp = async () => {
    setError("");
    if (otp.trim().length !== 6) {
      setError("Vui lòng nhập đủ 6 số của mã OTP");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.verifyForgotPasswordOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      setResetToken(data.resetToken);
      setInfoMessage("");
      setStep("password");
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: đặt mật khẩu mới bằng resetToken — người dùng có thể suy nghĩ
  // mật khẩu bao lâu tuỳ ý mà không lo OTP hết hạn.
  const submitNewPassword = async () => {
    setError("");
    if (newPassword.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.resetPassword({
        resetToken,
        newPassword,
      });
      saveAuth(data.token, data.user);
      router.push("/customer/dashboard");
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === "email") {
      await requestOtp();
    } else if (step === "otp") {
      await verifyOtp();
    } else {
      await submitNewPassword();
    }
  };

  const backToEmailStep = () => {
    setStep("email");
    setOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setInfoMessage("");
  };

  // Từ bước nhập mật khẩu quay lại bước OTP (ví dụ nhập nhầm/muốn xin mã
  // mới) — resetToken cũ sẽ không dùng được nữa vì phải xác thực lại OTP.
  const backToOtpStep = () => {
    setStep("otp");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage: "url('/auth-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "0.9rem 1rem",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.5)",
    background: "rgba(255,255,255,.85)",
    color: "#0f172a",
    fontSize: ".95rem",
    outline: "none",
  };

  const otpInputStyle = {
    ...inputStyle,
    textAlign: "center",
    fontSize: "1.4rem",
    fontWeight: 700,
    letterSpacing: "0.5rem",
    padding: "0.9rem 0.5rem",
  };

  const labelStyle = {
    fontSize: ".85rem",
    fontWeight: 600,
    display: "block",
    marginBottom: ".4rem",
    color: "#fff",
    textShadow: "0 1px 2px rgba(0,0,0,.25)",
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "2rem 8vw 2rem 2rem",
        backgroundColor: "#ffffff",
        backgroundImage: "url('/auth-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay để chữ/branding phía bên trái dễ đọc trên nền ảnh */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, rgba(15,23,42,.55) 0%, rgba(15,23,42,.15) 45%, rgba(15,23,42,0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Branding bên trái — đồng bộ với trang đăng nhập */}
      <div
        style={{
          position: "absolute",
          left: "4rem",
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 560,
          zIndex: 1,
        }}
      >
        <Logo
          className="auth-brand__logo"
          size={22}
          style={{ marginBottom: "1.5rem" }}
        />
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,.35)",
            margin: 0,
          }}
        >
          Khám phá
          <br />
          Việt Nam
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,.92)",
            fontSize: "1.05rem",
            marginTop: "1.25rem",
            textShadow: "0 1px 4px rgba(0,0,0,.35)",
          }}
        >
          Nơi mỗi tỉnh thành là một kỷ niệm.
          <br />
          Sưu tầm, khám phá và lưu giữ hành trình của bạn.
        </p>
      </div>

      {/* Card quên mật khẩu — hiệu ứng kính mờ đồng bộ trang đăng nhập */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 400,
          background: "rgba(255,255,255,.18)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,.35)",
          borderRadius: 24,
          padding: "2.25rem",
          boxShadow: "0 25px 60px rgba(0,0,0,.25)",
        }}
      >
        {(step === "otp" || step === "password") && (
          <button
            type="button"
            onClick={step === "otp" ? backToEmailStep : backToOtpStep}
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".35rem",
              color: "#fff",
              fontSize: ".85rem",
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,.25)",
              marginBottom: "1.1rem",
            }}
          >
            ← Quay lại
          </button>
        )}

        <h1
          style={{
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 1px 3px rgba(0,0,0,.3)",
            marginBottom: ".4rem",
          }}
        >
          {step === "email"
            ? "Quên mật khẩu"
            : step === "otp"
              ? "Nhập mã xác thực"
              : "Đặt lại mật khẩu"}
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,.9)",
            fontSize: ".85rem",
            textShadow: "0 1px 2px rgba(0,0,0,.25)",
            marginBottom: "1.25rem",
          }}
        >
          {step === "email" ? (
            "Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để bạn đặt lại mật khẩu."
          ) : step === "otp" ? (
            <>
              Mã gồm 6 số vừa được gửi tới <b>{email}</b>. Mã có hiệu lực trong
              10 phút.
            </>
          ) : (
            "Xác thực thành công. Hãy nhập mật khẩu mới cho tài khoản của bạn."
          )}
        </p>

        {infoMessage && !error && (
          <div
            style={{
              background: "rgba(224,242,254,.95)",
              color: "#0369a1",
              padding: "0.65rem 1rem",
              borderRadius: 12,
              fontSize: ".82rem",
              marginBottom: "1rem",
            }}
          >
            {infoMessage}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "rgba(254,226,226,.95)",
              color: "#b91c1c",
              padding: "0.65rem 1rem",
              borderRadius: 12,
              fontSize: ".85rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          {step === "email" ? (
            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={inputStyle}
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
              />
            </div>
          ) : step === "otp" ? (
            <>
              <div>
                <label style={labelStyle}>Mã OTP</label>
                <input
                  style={otpInputStyle}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    if (error) setError("");
                  }}
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>

              <div style={{ textAlign: "center", marginTop: "-.4rem" }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  style={{
                    fontSize: ".82rem",
                    color: "#fff",
                    textShadow: "0 1px 2px rgba(0,0,0,.25)",
                    textDecoration: resendCooldown > 0 ? "none" : "underline",
                    opacity: resendCooldown > 0 ? 0.6 : 1,
                  }}
                >
                  {resendCooldown > 0
                    ? `Gửi lại mã sau ${resendCooldown}s`
                    : "Gửi lại mã"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={labelStyle}>Mật khẩu mới</label>
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="new-password"
                  autoFocus
                />
              </div>

              <div>
                <label style={labelStyle}>Nhập lại mật khẩu mới</label>
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="new-password"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              justifyContent: "center",
              display: "flex",
              padding: ".9rem",
              borderRadius: 12,
              border: "none",
              fontWeight: 700,
              fontSize: ".95rem",
              color: "#fff",
              background: "#0d9488",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading
              ? "Đang xử lý..."
              : step === "email"
                ? "Gửi mã xác thực"
                : step === "otp"
                  ? "Xác nhận mã"
                  : "Đặt lại mật khẩu"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: ".85rem",
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,.25)",
            marginTop: "1.5rem",
          }}
        >
          Đã nhớ mật khẩu?{" "}
          <Link
            href="/auth"
            style={{
              color: "#fff",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
