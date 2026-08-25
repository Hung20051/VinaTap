"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";
import { authAPI } from "@/lib/api";
import { saveAuth, isLoggedIn } from "@/lib/auth";
import "./ForgotPassword.css";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const router = useRouter();

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

  const verifyOtp = async () => {
    setError("");
    if (otp.trim().length !== 6) {
      setError("Mã OTP gồm 6 chữ số");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.verifyForgotPasswordOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      if (!data.resetToken) {
        throw new Error(
          "Không nhận được mã xác thực đặt lại mật khẩu từ hệ thống",
        );
      }
      setResetToken(data.resetToken);
      setInfoMessage(
        data.message ||
          "Xác thực mã OTP thành công. Hãy nhập mật khẩu mới của bạn.",
      );
      setStep("password");
    } catch (err) {
      setError(err.message || "Mã OTP không đúng hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async () => {
    setError("");
    if (!newPassword || newPassword.length < 6) {
      setError("Mật khẩu mới phải từ 6 ký tự trở lên");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!resetToken) {
      setError("Phiên đặt lại mật khẩu không hợp lệ, vui lòng thử lại từ đầu");
      setStep("email");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.resetPasswordWithToken({
        resetToken,
        newPassword,
      });
      if (data.token && data.user) {
        saveAuth(data.token, data.user);
        router.push("/customer/dashboard");
      } else {
        router.push("/auth");
      }
    } catch (err) {
      setError(
        err.message ||
          "Không thể đặt lại mật khẩu. Phiên làm việc có thể đã hết hạn, vui lòng thử lại từ đầu.",
      );
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

  const backToOtpStep = () => {
    setStep("otp");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  if (checking) {
    return (
      <div className="forgot-pwd-page" style={{ justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="forgot-pwd-page">
      <div className="forgot-pwd-brand">
        <Logo
          className="auth-brand__logo"
          size={22}
          style={{ marginBottom: "1.5rem" }}
        />
        <h1 className="forgot-pwd-brand-title">
          Khám phá
          <br />
          Việt Nam
        </h1>
        <p className="forgot-pwd-brand-desc">
          Nơi mỗi tỉnh thành là một kỷ niệm.
          <br />
          Sưu tầm, khám phá và lưu giữ hành trình của bạn.
        </p>
      </div>

      <div className="forgot-pwd-card">
        {(step === "otp" || step === "password") && (
          <button
            type="button"
            onClick={step === "otp" ? backToEmailStep : backToOtpStep}
            className="forgot-pwd-back-btn"
          >
            ← Quay lại
          </button>
        )}

        <h1 className="forgot-pwd-title">
          {step === "email"
            ? "Quên mật khẩu"
            : step === "otp"
              ? "Nhập mã xác thực"
              : "Đặt lại mật khẩu"}
        </h1>
        <p className="forgot-pwd-subtitle">
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
          <div className="forgot-pwd-info-alert">{infoMessage}</div>
        )}

        {error && <div className="forgot-pwd-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-pwd-form">
          {step === "email" ? (
            <div>
              <label className="forgot-pwd-label">Email</label>
              <input
                className="forgot-pwd-input"
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
                <label className="forgot-pwd-label">Mã OTP</label>
                <input
                  className="forgot-pwd-input forgot-pwd-otp-input"
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

              <div className="forgot-pwd-resend-row">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="forgot-pwd-resend-btn"
                  style={{
                    opacity: resendCooldown > 0 ? 0.6 : 1,
                    textDecoration: resendCooldown > 0 ? "none" : "underline",
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
                <label className="forgot-pwd-label">Mật khẩu mới</label>
                <input
                  className="forgot-pwd-input"
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
                <label className="forgot-pwd-label">Nhập lại mật khẩu mới</label>
                <input
                  className="forgot-pwd-input"
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
            className="forgot-pwd-submit-btn"
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

        <p className="forgot-pwd-bottom-link">
          Đã nhớ mật khẩu? <Link href="/auth">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
