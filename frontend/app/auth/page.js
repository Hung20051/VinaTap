"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "../../lib/api";
import { saveAuth, isLoggedIn } from "../../lib/auth";

const RESEND_COOLDOWN_SECONDS = 60;

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  // Đăng ký chia 2 bước: 'form' (nhập thông tin) -> 'otp' (nhập mã xác thực)
  const [registerStep, setRegisterStep] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checkingOAuth, setCheckingOAuth] = useState(true);
  const cooldownRef = useRef(null);

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
          router.replace("/dashboard");
        })
        .catch(() => {
          setError("Đăng nhập Google thất bại, vui lòng thử lại");
          setCheckingOAuth(false);
        });
      return;
    }

    if (oauthError) {
      setError("Đăng nhập Google thất bại, vui lòng thử lại");
    }

    if (isLoggedIn()) {
      router.replace("/dashboard");
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
      router.push("/dashboard");
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
        router.push("/dashboard");
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
    setMode(next);
    setRegisterStep("form");
    setOtp("");
    setError("");
    setInfoMessage("");
  };

  const backToRegisterForm = () => {
    setRegisterStep("form");
    setOtp("");
    setError("");
    setInfoMessage("");
  };

  if (checkingOAuth) {
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

  const isRegisterOtpStep = mode === "register" && registerStep === "otp";

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

      {/* Branding bên trái, giống ảnh mẫu — logo + tagline + mô tả ngắn */}
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
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            color: "#fff",
            fontWeight: 800,
            fontSize: "1.4rem",
            textShadow: "0 2px 6px rgba(0,0,0,.35)",
            marginBottom: "1.5rem",
          }}
        >
          VinaTap 🗺
        </Link>
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

      {/* Card đăng nhập / đăng ký — hiệu ứng kính mờ nổi trên nền ảnh */}
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
        {/* Tab đăng nhập / đăng ký — ẩn khi đang ở bước nhập OTP để tránh
            người dùng bấm nhầm mất tiến trình */}
        {!isRegisterOtpStep && (
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,.25)",
              borderRadius: 999,
              padding: 4,
              marginBottom: "1.5rem",
            }}
          >
            {[
              { key: "login", label: "Đăng nhập" },
              { key: "register", label: "Đăng ký" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => switchMode(t.key)}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  display: "flex",
                  padding: ".55rem 0",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: ".88rem",
                  background: mode === t.key ? "#fff" : "transparent",
                  color: mode === t.key ? "#0f172a" : "#fff",
                  boxShadow:
                    mode === t.key ? "0 4px 14px rgba(0,0,0,.15)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {isRegisterOtpStep && (
          <button
            type="button"
            onClick={backToRegisterForm}
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

        {isRegisterOtpStep && (
          <>
            <h1
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,.3)",
                marginBottom: ".4rem",
              }}
            >
              Nhập mã xác thực
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,.9)",
                fontSize: ".85rem",
                textShadow: "0 1px 2px rgba(0,0,0,.25)",
                marginBottom: "1.25rem",
              }}
            >
              Mã gồm 6 số vừa được gửi tới <b>{form.email}</b>. Mã có hiệu lực
              trong 10 phút.
            </p>
          </>
        )}

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
          {isRegisterOtpStep ? (
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
              {mode === "register" && (
                <div>
                  <label style={labelStyle}>Họ tên</label>
                  <input
                    style={inputStyle}
                    name="name"
                    placeholder="Nhập họ tên của bạn"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div>
                <label style={labelStyle}>Mật khẩu</label>
                <input
                  style={inputStyle}
                  type="password"
                  name="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </div>

              {mode === "login" && (
                <div style={{ textAlign: "right", marginTop: "-.5rem" }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: ".82rem",
                      color: "#fff",
                      textDecoration: "underline",
                      textShadow: "0 1px 2px rgba(0,0,0,.25)",
                    }}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              )}
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
              : isRegisterOtpStep
                ? "Xác nhận"
                : mode === "login"
                  ? "Đăng nhập"
                  : "Gửi mã xác thực"}
          </button>
        </form>

        {!isRegisterOtpStep && (
          <>
            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                margin: "1.4rem 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,.4)",
                }}
              />
              <span
                style={{
                  fontSize: ".8rem",
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,.25)",
                }}
              >
                hoặc
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,.4)",
                }}
              />
            </div>

            {/* Google OAuth */}
            <a
              href={authAPI.googleUrl()}
              style={{
                width: "100%",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: ".6rem",
                padding: ".85rem",
                borderRadius: 12,
                background: "rgba(255,255,255,.9)",
                fontWeight: 600,
                fontSize: ".9rem",
                color: "#0f172a",
              }}
            >
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
              Tiếp tục với Google
            </a>

            <p
              style={{
                textAlign: "center",
                fontSize: ".85rem",
                color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,.25)",
                marginTop: "1.5rem",
              }}
            >
              {mode === "login" ? (
                <>
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      textDecoration: "underline",
                    }}
                  >
                    Đăng ký ngay
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      textDecoration: "underline",
                    }}
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
