"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import {
  saveAuth,
  isLoggedIn,
  getUser,
  getPostAuthRedirect,
} from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import "@/styles/auth.css";

const RESEND_COOLDOWN_SECONDS = 60;

export default function AuthPage() {
  const router = useRouter();

  const [lang, setLang] = useState("vi");
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  // Đăng ký chia 2 bước: 'form' (nhập thông tin) -> 'otp' (nhập mã xác thực)
  const [registerStep, setRegisterStep] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checkingOAuth, setCheckingOAuth] = useState(true);
  // Hướng trượt của khung nội dung: "right" khi đi login -> register/otp,
  // "left" khi quay lại register -> login/form. Chỉ ảnh hưởng animation,
  // không ảnh hưởng logic.
  const [slideDir, setSlideDir] = useState("right");
  const cooldownRef = useRef(null);

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  // Xử lý redirect từ Google OAuth callback (?token=...) hoặc lỗi (?error=...)
  // và bỏ qua trang này luôn nếu đã đăng nhập sẵn.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const oauthError = params.get("error");

    if (token) {
      // Backend chỉ ký JWT gồm { id, role } — cần gọi /auth/me để lấy đủ thông tin user
      localStorage.setItem("vinatap_token", token);
      authAPI
        .getMe()
        .then((d) => {
          saveAuth(token, d.user);
          router.replace(getPostAuthRedirect(d.user));
        })
        .catch(() => {
          setError("Đăng nhập Google thất bại, vui lòng thử lại");
          setCheckingOAuth(false);
        });
      return;
    }

    if (oauthError) {
      setError(
        oauthError === "account_banned"
          ? "Tài khoản này đã bị khóa. Vui lòng liên hệ hỗ trợ."
          : "Đăng nhập Google thất bại, vui lòng thử lại",
      );
    }

    if (isLoggedIn()) {
      router.replace(getPostAuthRedirect(getUser()));
      return;
    }

    setCheckingOAuth(false);
  }, [router]);

  // Đếm ngược cho nút "Gửi lại mã"
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Bước 1 của đăng ký: gửi thông tin, yêu cầu server gửi OTP về email
  const submitRegisterForm = async () => {
    if (!form.name.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    if (!form.email.trim() || !form.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.requestRegisterOtp(form);
      setInfoMessage(data.message || "Mã OTP đã được gửi đến email của bạn");
      setSlideDir("right");
      setRegisterStep("otp");
      setOtp("");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2 của đăng ký: xác thực OTP, tài khoản chỉ thật sự được tạo ở bước này
  const submitRegisterOtp = async () => {
    if (otp.trim().length !== 6) {
      setError("Vui lòng nhập đủ 6 số của mã OTP");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.verifyRegisterOtp({
        email: form.email,
        otp: otp.trim(),
      });
      saveAuth(data.token, data.user);
      router.push(getPostAuthRedirect(data.user));
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
      const data = await authAPI.requestRegisterOtp(form);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!form.email.trim() || !form.password) {
        setError("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setLoading(true);
      try {
        const data = await authAPI.login({
          email: form.email,
          password: form.password,
        });
        saveAuth(data.token, data.user);
        router.push(getPostAuthRedirect(data.user));
      } catch (err) {
        setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại");
      } finally {
        setLoading(false);
      }
      return;
    }

    // mode === "register"
    if (registerStep === "form") {
      await submitRegisterForm();
    } else {
      await submitRegisterOtp();
    }
  };

  const switchMode = (next) => {
    if (next === mode) return;
    setSlideDir(next === "register" ? "right" : "left");
    setMode(next);
    setRegisterStep("form");
    setOtp("");
    setError("");
    setInfoMessage("");
  };

  const backToRegisterForm = () => {
    setSlideDir("left");
    setRegisterStep("form");
    setOtp("");
    setError("");
    setInfoMessage("");
  };

  if (checkingOAuth) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  const isRegisterOtpStep = mode === "register" && registerStep === "otp";
  // key thay đổi mỗi khi chuyển bước -> React remount .auth-content ->
  // animation CSS (authContentInRight/Left) tự chạy lại mỗi lần trượt.
  const contentKey = `${mode}-${registerStep}`;

  return (
    <div className="auth-page">
      {/* Thanh điều hướng về Homepage + Đổi ngôn ngữ */}
      <nav className="auth-topbar" aria-label="Điều hướng">
        <Link href="/" className="auth-nav-home" title={t(lang, "backToHome")}>
          <ArrowLeft size={18} />
          <span>{t(lang, "backToHome")}</span>
        </Link>
        <LanguageSwitch variant="auth" />
      </nav>

      {/* Branding bên trái */}
      <div className="auth-brand">
        <Logo className="auth-brand__logo" size={65} />
        <h1 className="auth-brand__title">
          {t(lang, "authBrandTitle1")}
          <br />
          {t(lang, "authBrandTitle2")}
        </h1>
        <p className="auth-brand__desc">
          {t(lang, "authBrandDesc1")}
          <br />
          {t(lang, "authBrandDesc2")}
        </p>
      </div>

      {/* Card đăng nhập / đăng ký */}
      <div className="auth-card">
        {/* Tab đăng nhập / đăng ký */}
        {!isRegisterOtpStep && (
          <div className="auth-tabs">
            <div
              className={`auth-tabs__indicator ${mode === "register" ? "is-register" : ""}`}
            />
            {[
              { key: "login", label: t(lang, "authTabLogin") },
              { key: "register", label: t(lang, "authTabRegister") },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => switchMode(item.key)}
                className={`auth-tab ${mode === item.key ? "is-active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Khung nội dung */}
        <div key={contentKey} className={`auth-content dir-${slideDir}`}>
          {isRegisterOtpStep && (
            <button
              type="button"
              onClick={backToRegisterForm}
              className="auth-back-btn"
            >
              {t(lang, "authBack")}
            </button>
          )}

          {isRegisterOtpStep && (
            <>
              <h1 className="auth-otp-title">{t(lang, "authOtpTitle")}</h1>
              <p className="auth-otp-desc">
                {t(lang, "authOtpDesc")} <b>{form.email}</b>. {t(lang, "authOtpExpire")}
              </p>
            </>
          )}

          {infoMessage && !error && (
            <div className="auth-alert auth-alert--info">{infoMessage}</div>
          )}

          {error && <div className="auth-alert auth-alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegisterOtpStep ? (
              <>
                <div className="auth-field">
                  <label className="auth-label">Mã OTP</label>
                  <input
                    className="auth-input auth-input--otp"
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
                  />
                </div>

                <div className="auth-resend">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="auth-resend-btn"
                  >
                    {resendCooldown > 0
                      ? `${t(lang, "authResendOtpIn")} ${resendCooldown}s`
                      : t(lang, "authResendOtp")}
                  </button>
                </div>
              </>
            ) : (
              <>
                {mode === "register" && (
                  <div className="auth-field">
                    <label className="auth-label">{t(lang, "authLabelName")}</label>
                    <input
                      className="auth-input"
                      name="name"
                      placeholder={t(lang, "authPlaceholderName")}
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label className="auth-label">{t(lang, "authLabelEmail")}</label>
                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder={t(lang, "authPlaceholderEmail")}
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">{t(lang, "authLabelPassword")}</label>
                  <div className="auth-password-wrap">
                    <input
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={t(lang, "authPlaceholderPassword")}
                      value={form.password}
                      onChange={handleChange}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="auth-password-toggle"
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {mode === "login" && (
                  <div className="auth-forgot">
                    <Link href="/forgot-password">{t(lang, "authForgotPassword")}</Link>
                  </div>
                )}
              </>
            )}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading && <span className="auth-submit__spinner" />}
              {loading
                ? t(lang, "authProcessing")
                : isRegisterOtpStep
                  ? t(lang, "authBtnConfirm")
                  : mode === "login"
                    ? t(lang, "authBtnLogin")
                    : t(lang, "authBtnSendOtp")}
            </button>
          </form>

          {!isRegisterOtpStep && (
            <>
              {/* Divider */}
              <div className="auth-divider">
                <div className="auth-divider__line" />
                <span className="auth-divider__text">{t(lang, "authOr")}</span>
                <div className="auth-divider__line" />
              </div>

              {/* Google OAuth */}
              <a href={authAPI.googleUrl()} className="auth-google">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.1 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.1 6.1 29.3 4 24 4 15.9 4 8.9 8.6 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.3 0-9.6-3.1-11.3-7.6l-6.5 5C9 39.5 15.9 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C40.8 36 44 30.9 44 24c0-1.4-.1-2.8-.4-3.5z"
                  />
                </svg>
                {t(lang, "authGoogle")}
              </a>

              <p className="auth-switch">
                {mode === "login" ? (
                  <>
                    {t(lang, "authNoAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="auth-switch__btn"
                    >
                      {t(lang, "authRegisterNow")}
                    </button>
                  </>
                ) : (
                  <>
                    {t(lang, "authHasAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="auth-switch__btn"
                    >
                      {t(lang, "authLoginNow")}
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
