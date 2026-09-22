"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import {
  Map,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Puzzle,
  Globe,
  Camera,
  Gamepad2,
  RefreshCw,
  Lock,
  Wrench,
  Search,
  ChevronLeft,
  ChevronRight,
  Bot,
  Send,
  CheckCircle2,
  Facebook,
  Youtube,
  Music2,
} from "lucide-react";
import { provinceAPI } from "@/lib/api";
import { isLoggedIn, getUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useReveal } from "@/hooks/useReveal";
import { getLang } from "@/lib/prefs";
import { t, getProvinceName, getProvinceDesc } from "@/lib/i18n";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import "@/styles/home.css";

const REGION_LABEL = {
  vi: {
    north: "Miền Bắc",
    central: "Miền Trung",
    south: "Miền Nam",
    island: "Hải đảo",
  },
  en: {
    north: "Northern",
    central: "Central",
    south: "Southern",
    island: "Islands",
  },
};

const FAQ_DATA = {
  vi: [
    {
      q: "Mảnh ghép NFC hoạt động ra sao?",
      a: "Mỗi mảnh NFC có gắn 1 chip thông minh bên trong, đại diện cho 1 tỉnh thành. Chỉ cần chạm mặt sau điện thoại vào mảnh NFC, album của tỉnh đó sẽ mở ngay trên trình duyệt — không cần tải app, không cần quét mã.",
    },
    {
      q: "Ai là người tạo album cho mảnh ghép?",
      a: "Người đầu tiên kích hoạt (chạm hoặc nhập serial dự phòng) sẽ trở thành chủ mảnh ghép đó. Bạn có thể tự đặt tên album, viết mô tả và tải ảnh lên ngay sau khi kích hoạt.",
    },
    {
      q: "Nội dung album có riêng tư không?",
      a: "Bạn tự quyết định. Đặt album ở chế độ riêng tư thì chỉ bạn (và người bạn chia sẻ quyền xem) mới truy cập được. Đặt công khai thì bất kỳ ai chạm vào mảnh ghép cũng xem được album.",
    },
    {
      q: "Tôi có thể chuyển mảnh ghép cho người khác không?",
      a: "Có. Vào trang quản lý mảnh ghép, chọn “Chuyển nhượng”, nhập email người nhận — họ xác nhận qua email là quyền sở hữu (và toàn bộ album) sẽ chuyển sang tài khoản của họ.",
    },
    {
      q: "Nếu chip NFC trên thẻ bị lỗi thì sao?",
      a: "Mỗi thẻ đều có serial dự phòng in kèm — bạn vẫn kích hoạt và xem album bình thường bằng cách nhập serial thủ công. Nếu lỗi trong 30 ngày đầu, VinaTap đổi mới miễn phí.",
    },
  ],
  en: [
    {
      q: "How does the NFC tile work?",
      a: "Each NFC tile embeds a smart chip representing a Vietnamese province. Simply tap the back of your smartphone to the tile, and that province album opens instantly in your web browser — no app download, no QR scanning required.",
    },
    {
      q: "Who creates the album for the tile?",
      a: "The first person to activate (via tap or backup serial) becomes the owner of that tile. You can name your album, write notes, and upload photos/videos immediately after activation.",
    },
    {
      q: "Is album content kept private?",
      a: "You have full control. Set your album to private so only you and authorized friends can view it, or public so anyone who taps the tile can enjoy your travel journey.",
    },
    {
      q: "Can I transfer tile ownership to another person?",
      a: "Yes. In card management, select 'Transfer', enter the recipient's email address — once they confirm via email, full ownership and album access transfer to their account.",
    },
    {
      q: "What happens if the NFC chip is damaged or defective?",
      a: "Every card includes a printed backup serial number — you can always activate and view your album by typing it manually. VinaTap provides free replacements for chip defects within the first 30 days.",
    },
  ],
};

export default function HomePage() {
  const [lang, setLang] = useState("vi");
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [faqInput, setFaqInput] = useState("");
  const [faqMessages, setFaqMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const current = getLang();
    setLang(current);
    setFaqMessages([
      {
        role: "assistant",
        content: t(current, "faqBotGreeting"),
      },
    ]);

    const handleLangUpdated = (e) => {
      const nextLang = e.detail;
      setLang(nextLang);
      setFaqMessages((prev) => {
        if (prev.length <= 1) {
          return [
            {
              role: "assistant",
              content: t(nextLang, "faqBotGreeting"),
            },
          ];
        }
        return prev;
      });
    };

    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  // Slide tự động cho "Tỉnh thành nổi bật"
  const provinceTrackRef = useRef(null);
  const [provinceAutoPaused, setProvinceAutoPaused] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setCheckingAuth(false);
    provinceAPI
      .getAll()
      .then((d) => setProvinces(d?.provinces || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Đổi diện mạo navbar (nền mờ + đổ bóng) khi cuộn xuống — chỉ là
  // hiệu ứng nhỏ, không ảnh hưởng logic.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = provinces.filter((p) => {
    const q = search.toLowerCase().trim();
    const pNameEn = getProvinceName(p, "en");
    const pDescEn = getProvinceDesc(p, "en");
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      pNameEn.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (pDescEn && pDescEn.toLowerCase().includes(q));
    const matchRegion = region === "all" || p.region === region;
    return matchSearch && matchRegion;
  });

  // Tự động trượt slide tỉnh thành mỗi 3s — dừng khi hover/chạm hoặc khi
  // danh sách quá ngắn (không cần cuộn). Cuộn hết thì quay lại đầu.
  useEffect(() => {
    if (loading || provinceAutoPaused || filtered.length < 2) return;
    const track = provinceTrackRef.current;
    if (!track) return;

    const timer = setInterval(() => {
      if (!track) return;
      const cardStep = 264; // 240px thẻ + 24px khoảng cách (1.5rem)
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardStep, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [loading, provinceAutoPaused, filtered.length]);

  const scrollProvinceTrack = (dir) => {
    const track = provinceTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 264, behavior: "smooth" });
  };

  const handleLogout = () => {
    clearAuth();
    // Hard reload thay vì chỉ setUser(null) tại chỗ — đảm bảo Next.js
    // Router Cache không còn giữ bản render/prefetch cũ của các trang
    // khác (vd /auth) từ lúc còn đăng nhập, tránh việc bấm "Đăng nhập"
    // ngay sau đó bị đưa nhầm lại vào dashboard của phiên vừa thoát.
    window.location.href = "/";
  };

  // Cuộn mượt tới 1 section trong trang bằng JS + history.replaceState,
  // thay vì để trình duyệt tự pushState theo <a href="#..."> mặc định.
  // Nếu dùng href thường, mỗi lần bấm menu sẽ đẩy thêm 1 mục vào lịch
  // sử trình duyệt — bấm nhiều menu rồi rời trang, nút "quay lại" phải
  // bấm lại đúng bấy nhiêu lần mới thoát được trang, rất khó chịu.
  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const answerFaqQuestion = (question) => {
    const list = FAQ_DATA[lang] || FAQ_DATA.vi;
    const keywords = question
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 1);

    const bestMatch = list
      .map((item) => ({
        item,
        score: keywords.reduce(
          (total, word) =>
            total +
            (item.q.toLowerCase().includes(word) ? 2 : 0) +
            (item.a.toLowerCase().includes(word) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score)[0];

    return bestMatch?.score ? bestMatch.item.a : t(lang, "faqNoAnswer");
  };

  const sendFaqQuestion = (question) => {
    const text = question.trim();
    if (!text) return;
    setFaqMessages((messages) => [
      ...messages,
      { role: "user", content: text },
      { role: "assistant", content: answerFaqQuestion(text) },
    ]);
    setFaqInput("");
  };

  const handleFaqSubmit = (e) => {
    e.preventDefault();
    sendFaqQuestion(faqInput);
  };

  // Đang kiểm tra đăng nhập (và sẽ redirect nếu có) — không render gì để
  // tránh nháy trang landing page trước khi chuyển hướng.
  if (checkingAuth) return null;

  return (
    <>
      <link rel="prefetch" as="image" href="/auth-bg.jpg" />
      <div className="home home--guest">
        {/* ─── Navbar ─── */}
        <nav className={`home-navbar ${scrolled ? "is-scrolled" : ""}`}>
          <div className="container home-navbar__inner">
            <Logo className="home-navbar__logo" size={40} />

            <div className="home-navbar__links">
              <a href="#home" onClick={scrollToSection("home")}>
                {t(lang, "homeNavHome")}
              </a>
              <a href="#about" onClick={scrollToSection("about")}>
                {t(lang, "homeNavAbout")}
              </a>
              <Link
                href="/shop"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {t(lang, "homeNavProducts")}
              </Link>
              <a href="#provinces" onClick={scrollToSection("provinces")}>
                {t(lang, "homeNavHandbook")}
              </a>
              <a href="#faq" onClick={scrollToSection("faq")}>
                {t(lang, "homeNavFaq")}
              </a>
            </div>

            <div className="home-navbar__actions">
              <LanguageSwitch variant="navbar" />
              {user ? (
                <>
                  <Link
                    href={user?.role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
                    className="home-navbar__dashboard-link"
                  >
                    {t(lang, "dashboard")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="home-navbar__logout-btn"
                  >
                    {t(lang, "logout")}
                  </button>
                </>
              ) : (
                <Link href="/auth" className="home-navbar__login-btn">
                  {t(lang, "signIn")}
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* ─── Hero (full-screen) ─── */}
        <section id="home" className="home-hero">
          <div className="container home-hero__grid">
            <div>
              <div className="home-eyebrow">
                <span className="home-eyebrow__dash" />
                {t(lang, "heroEyebrow")}
              </div>
              <h1 className="home-hero__title">
                {t(lang, "heroTitleLine1")}
                <br />
                <span className="home-hero__title-accent">
                  {t(lang, "heroTitleAccent")}
                </span>
              </h1>
              <p className="home-hero__desc">
                {t(lang, "heroDesc")}
              </p>
              <div className="home-hero__cta-row">
                <Link href="/activate" className="home-btn-teal">
                  {t(lang, "heroBtnActivate")}
                </Link>
                <a
                  href="#provinces"
                  onClick={scrollToSection("provinces")}
                  className="home-btn-outline-ink"
                >
                  {t(lang, "heroBtnExplore")}
                </a>
              </div>

              <div className="home-hero__highlight">
                <div className="home-hero__highlight-icon">
                  <Puzzle size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="home-hero__highlight-title">{t(lang, "heroHighlightTitle")}</div>
                  <div className="home-hero__highlight-sub">
                    {t(lang, "heroHighlightSub")}
                  </div>
                </div>
              </div>
            </div>

            {/* Minh họa: điện thoại chạm mảnh NFC mở album */}
            <div className="home-hero__illustration">
              <div className="home-hero__blob" />

              <div className="home-hero__phone">
                <div className="home-hero__phone-screen">
                  <Map size={40} strokeWidth={1.6} color="var(--home-teal)" />
                  <div className="home-hero__phone-title">{t(lang, "heroPhoneTitle")}</div>
                  <div className="home-hero__phone-sub">
                    {t(lang, "heroPhoneSub")}
                  </div>
                </div>
              </div>

              {/* Mảnh ghép NFC + sóng chạm */}
              <div className="home-hero__tap-point">
                <span className="home-hero__tap-ring" />
                <span className="home-hero__tap-ring home-hero__tap-ring--d2" />
                <span className="home-hero__tap-ring home-hero__tap-ring--d3" />
                <span className="home-hero__tap-chip">
                  <Puzzle size={16} strokeWidth={2.4} />
                </span>
              </div>

              <div className="home-hero__card home-hero__card--activate">
                <span className="home-hero__card-check">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2.4}
                    color="var(--home-teal-dark)"
                  />
                </span>
                <div>
                  <div className="home-hero__card-title">{t(lang, "heroCardActivate")}</div>
                  <div className="home-hero__card-sub">{t(lang, "heroCardTapOpen")}</div>
                </div>
              </div>
              <div className="home-hero__card home-hero__card--ai">
                <Sparkles size={14} strokeWidth={2.4} />
                {t(lang, "heroCardAiCaption")}
              </div>
            </div>
          </div>

          {/* Dải tính năng nhanh */}
          <div className="home-feature-strip">
            <div className="container home-feature-strip__inner">
              {[
                { icon: Smartphone, label: t(lang, "featNoApp") },
                { icon: Globe, label: t(lang, "featAllPhones") },
                { icon: ShieldCheck, label: t(lang, "featPrivacy") },
                { icon: Puzzle, label: t(lang, "featCollect34") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="home-feature-strip__item">
                  <span className="home-feature-strip__icon">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About (full-screen) ─── */}
        <RevealSection id="about" className="home-about">
          <div className="container home-about__grid">
            <div className="home-about__icons-grid">
              {[
                { icon: Puzzle, label: t(lang, "aboutIconPhysical") },
                { icon: Globe, label: t(lang, "aboutIconWeb") },
                { icon: Camera, label: t(lang, "aboutIconAi") },
                { icon: Gamepad2, label: t(lang, "aboutIconGamification") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="home-about__icon-tile">
                  <Icon size={26} strokeWidth={2} />
                  <span className="home-about__icon-label">{label}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="home-eyebrow">
                <span className="home-eyebrow__dash" />
                {t(lang, "aboutEyebrow")}
              </div>
              <h2 className="home-about__title">
                {t(lang, "aboutHeading")}
              </h2>
              <p className="home-about__desc">
                {t(lang, "aboutDescription")}
              </p>
              <div className="home-about__stats">
                <div>
                  <div className="home-about__stat-value">34+</div>
                  <div className="home-about__stat-label">{t(lang, "aboutStatProvinces")}</div>
                </div>
                <div>
                  <div className="home-about__stat-value">3</div>
                  <div className="home-about__stat-label">{t(lang, "aboutStatLayers")}</div>
                </div>
                <div>
                  <div className="home-about__stat-value">2025</div>
                  <div className="home-about__stat-label">{t(lang, "aboutStatYear")}</div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ─── Pricing / Các gói (full-screen) ─── */}
        <RevealSection id="gia" className="home-pricing">
          <div className="container home-section--pad-lg">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "pricingEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title">{t(lang, "pricingTitle")}</h2>
            </div>

            <div className="home-pricing__grid">
              {[
                {
                  name: t(lang, "pricingTier1Name"),
                  price: "50.000đ",
                  desc: t(lang, "pricingTier1Desc"),
                  features: [
                    t(lang, "pricingTier1F1"),
                    t(lang, "pricingTier1F2"),
                    t(lang, "pricingTier1F3"),
                  ],
                  highlight: false,
                },
                {
                  name: t(lang, "pricingTier2Name"),
                  price: "220.000đ",
                  desc: t(lang, "pricingTier2Desc"),
                  features: [
                    t(lang, "pricingTier2F1"),
                    t(lang, "pricingTier2F2"),
                    t(lang, "pricingTier2F3"),
                  ],
                  highlight: true,
                },
                {
                  name: t(lang, "pricingTier3Name"),
                  price: "1.400.000đ",
                  desc: t(lang, "pricingTier3Desc"),
                  features: [
                    t(lang, "pricingTier3F1"),
                    t(lang, "pricingTier3F2"),
                    t(lang, "pricingTier3F3"),
                  ],
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`home-pricing__card ${tier.highlight ? "home-pricing__card--highlight" : ""}`}
                >
                  {tier.highlight && (
                    <span className="home-pricing__badge">{t(lang, "pricingTier2Badge")}</span>
                  )}
                  <div className="home-pricing__name">{tier.name}</div>
                  <div className="home-pricing__price">{tier.price}</div>
                  <p className="home-pricing__desc">{tier.desc}</p>
                  <div className="home-pricing__features">
                    {tier.features.map((f) => (
                      <div key={f} className="home-pricing__feature">
                        <CheckCircle2
                          size={16}
                          strokeWidth={2.4}
                          className="home-pricing__feature-check"
                        />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/activate" className="home-pricing__cta">
                    {t(lang, "pricingChooseBtn")}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ─── Tỉnh thành nổi bật ─── */}
        <RevealSection id="provinces" className="home-provinces">
          <div className="container home-section--pad-sm">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "provEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--md">
                {t(lang, "provTitle")}
              </h2>
            </div>

            <div className="home-provinces__filters">
              <div className="home-provinces__search-wrap">
                <Search
                  size={16}
                  strokeWidth={2.2}
                  className="home-provinces__search-icon"
                />
                <input
                  className="input home-provinces__search"
                  placeholder={t(lang, "provSearchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {["all", "north", "central", "south", "island"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`home-provinces__region-btn ${region === r ? "is-active" : ""}`}
                >
                  {
                    {
                      all: t(lang, "provFilterAll"),
                      north: t(lang, "provFilterNorth"),
                      central: t(lang, "provFilterCentral"),
                      south: t(lang, "provFilterSouth"),
                      island: t(lang, "provFilterIsland"),
                    }[r]
                  }
                </button>
              ))}
            </div>

            {loading ? (
              <div className="home-provinces__loading">
                <div className="spinner" />
              </div>
            ) : !filtered.length ? (
              <p className="home-provinces__empty">
                {t(lang, "provEmpty")}
              </p>
            ) : (
              <div
                className="home-provinces__carousel"
                onMouseEnter={() => setProvinceAutoPaused(true)}
                onMouseLeave={() => setProvinceAutoPaused(false)}
              >
                {/* Nút lùi */}
                <button
                  aria-label="Previous"
                  onClick={() => scrollProvinceTrack(-1)}
                  className="home-provinces__nav-btn home-provinces__nav-btn--prev"
                >
                  <ChevronLeft size={18} strokeWidth={2.4} />
                </button>

                {/* Track cuộn ngang, tự trượt */}
                <div
                  ref={provinceTrackRef}
                  className="no-scrollbar home-provinces__track"
                >
                  {filtered.map((p) => {
                    const displayName = getProvinceName(p, lang);
                    const displayDesc = getProvinceDesc(p, lang);
                    return (
                      <Link
                        key={p.id}
                        href={`/province/${p.slug}`}
                        className="home-provinces__card-link"
                      >
                        <div className="home-provinces__card">
                          <div className="home-provinces__card-thumb">
                            {p.thumbnail_url ? (
                              <img
                                src={p.thumbnail_url}
                                alt={displayName}
                                loading="lazy"
                              />
                            ) : (
                              <div className="home-provinces__card-thumb-placeholder">
                                <Map size={30} strokeWidth={1.8} />
                              </div>
                            )}
                            <span className="home-provinces__region-badge">
                              {REGION_LABEL[lang]?.[p.region] || REGION_LABEL.vi[p.region]}
                            </span>
                          </div>
                          <div className="home-provinces__card-body">
                            <h3 className="home-provinces__card-title">
                              {displayName}
                            </h3>
                            <p className="home-provinces__card-desc">
                              {displayDesc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Nút tiến */}
                <button
                  aria-label="Next"
                  onClick={() => scrollProvinceTrack(1)}
                  className="home-provinces__nav-btn home-provinces__nav-btn--next"
                >
                  <ChevronRight size={18} strokeWidth={2.4} />
                </button>
              </div>
            )}
          </div>
        </RevealSection>

        {/* ─── Chính sách (tóm tắt) ─── */}
        <RevealSection id="chinh-sach" className="home-policy">
          <div className="container home-section--pad-sm">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "policyEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--sm">
                {t(lang, "policyTitle")}
              </h2>
            </div>
            <div className="home-policy__grid">
              {[
                {
                  icon: RefreshCw,
                  title: t(lang, "policy1Title"),
                  desc: t(lang, "policy1Desc"),
                },
                {
                  icon: Lock,
                  title: t(lang, "policy2Title"),
                  desc: t(lang, "policy2Desc"),
                },
                {
                  icon: Wrench,
                  title: t(lang, "policy3Title"),
                  desc: t(lang, "policy3Desc"),
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="home-policy__card">
                  <div className="home-policy__icon">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div className="home-policy__title">{title}</div>
                  <p className="home-policy__desc">{desc}</p>
                </div>
              ))}
            </div>
            <p className="home-policy__disclaimer">
              {t(lang, "policyDisclaimer")}
            </p>
          </div>
        </RevealSection>

        {/* ─── Hỏi đáp ─── */}
        <RevealSection id="faq" className="home-faq">
          <div className="container home-section--pad-lg">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "faqEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--md">
                {t(lang, "faqTitle")}
              </h2>
            </div>

            <div className="home-faq-chat">
              <div className="home-faq-chat__header">
                <span className="home-faq-chat__avatar">
                  <Bot size={20} />
                </span>
                <div>
                  <strong>{t(lang, "faqBotName")}</strong>
                  <p>{t(lang, "faqBotStatus")}</p>
                </div>
              </div>

              <div className="home-faq-chat__messages" aria-live="polite">
                {faqMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`home-faq-chat__message is-${message.role}`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>

              <div className="home-faq-chat__suggestions">
                {(FAQ_DATA[lang] || FAQ_DATA.vi).slice(0, 3).map((item) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => sendFaqQuestion(item.q)}
                  >
                    {item.q}
                  </button>
                ))}
              </div>

              <form className="home-faq-chat__form" onSubmit={handleFaqSubmit}>
                <input
                  value={faqInput}
                  onChange={(e) => setFaqInput(e.target.value)}
                  placeholder={t(lang, "faqPlaceholder")}
                  aria-label="FAQ Question"
                />
                <button
                  type="submit"
                  disabled={!faqInput.trim()}
                  aria-label="Send"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </RevealSection>

        {/* ─── Footer ─── */}
        <footer className="home-footer">
          <div className="container home-footer__grid">
            <div>
              <Logo
                className="home-footer__brand-name"
                size={38}
                onClick={scrollToSection("home")}
              />
              <p className="home-footer__brand-desc">
                {t(lang, "footerDesc")}
              </p>
              <div className="home-footer__socials">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Facebook"
                  className="home-footer__social-btn"
                >
                  <Facebook size={15} strokeWidth={2.2} />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="TikTok"
                  className="home-footer__social-btn"
                >
                  <Music2 size={15} strokeWidth={2.2} />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="YouTube"
                  className="home-footer__social-btn"
                >
                  <Youtube size={15} strokeWidth={2.2} />
                </a>
              </div>
            </div>

            <FooterCol
              title={t(lang, "footerProductCol")}
              links={[
                { label: t(lang, "homeNavHome"), href: "/" },
                { label: t(lang, "heroBtnActivate"), href: "/customer/activate" },
                { label: t(lang, "dashboard"), href: "/customer/dashboard" },
                { label: t(lang, "signIn"), href: "/auth" },
              ]}
            />
            <FooterCol
              title={t(lang, "footerExploreCol")}
              links={[
                { label: t(lang, "pricingEyebrow"), href: "/#gia" },
                { label: t(lang, "provTitle"), href: "/#provinces" },
                { label: t(lang, "aboutEyebrow"), href: "/#about" },
                { label: t(lang, "faqEyebrow"), href: "/#faq" },
              ]}
            />
            <FooterCol
              title={t(lang, "footerCompanyCol")}
              links={[
                { label: t(lang, "footerAbout"), href: "#" },
                { label: t(lang, "footerContact"), href: "#" },
                { label: t(lang, "footerTerms"), href: "#" },
                { label: t(lang, "footerPolicy"), href: "/#chinh-sach" },
              ]}
            />
          </div>
          <div className="home-footer__bottom">
            <div className="container home-footer__bottom-inner">
              {t(lang, "footerCopyright")}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Bọc 1 section bằng hiệu ứng "hiện dần khi cuộn tới" — dùng chung cho
// tất cả section trừ Hero (Hero luôn hiện ngay khi tải trang, không cần
// hiệu ứng chờ cuộn).
function RevealSection({ children, className = "", id }) {
  const [ref, visible] = useReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="home-footer__col-title">{title}</div>
      <div className="home-footer__col-links">
        {links.map((l) => (
          <Link key={l.label} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
