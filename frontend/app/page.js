"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "../components/Logo";
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
  ChevronDown,
  CheckCircle2,
  Facebook,
  Youtube,
  Music2,
} from "lucide-react";
import { provinceAPI } from "../lib/api";
import { isLoggedIn, getUser, clearAuth } from "../lib/auth";
import { useRouter } from "next/navigation";
import { useReveal } from "../lib/useReveal";
import "../styles/home.css";

const REGION_LABEL = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam",
  island: "Hải đảo",
};

const FEATURE_STRIP = [
  { icon: Smartphone, label: "Không cần cài app" },
  { icon: Globe, label: "Hoạt động trên mọi điện thoại" },
  { icon: ShieldCheck, label: "Album riêng tư, tự chọn công khai" },
  { icon: Puzzle, label: "Sưu tầm đủ 34 mảnh ghép" },
];

const ABOUT_ICONS = [
  { icon: Puzzle, label: "Vật lý" },
  { icon: Globe, label: "Web tương tác" },
  { icon: Camera, label: "Album AI" },
  { icon: Gamepad2, label: "Gamification" },
];

const POLICY_ITEMS = [
  {
    icon: RefreshCw,
    title: "Kích hoạt trong 1 năm",
    desc: "Serial NFC có hiệu lực kích hoạt 12 tháng kể từ ngày mua.",
  },
  {
    icon: Lock,
    title: "Quyền riêng tư album",
    desc: "Album mặc định công khai để xem, nhưng chỉ chủ album mới sửa/xóa được.",
  },
  {
    icon: Wrench,
    title: "Bảo hành thẻ vật lý",
    desc: "Đổi mới miễn phí nếu chip NFC lỗi trong 30 ngày đầu.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Mảnh ghép NFC hoạt động ra sao?",
    a: "Mỗi mảnh gỗ có gắn 1 chip NFC nhỏ bên trong, đại diện cho 1 tỉnh thành. Chỉ cần chạm mặt sau điện thoại vào mảnh gỗ, album của tỉnh đó sẽ mở ngay trên trình duyệt — không cần tải app, không cần quét mã.",
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
    a: "Mỗi thẻ đều có serial dự phòng in kèm — bạn vẫn kích hoạt và xem album bình thường bằng cách nhập serial thủ công. Nếu lỗi trong 30 ngày đầu, <VinaTap> đổi mới miễn phí.",
  },
];

export default function HomePage() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const router = useRouter();

  // Slide tự động cho "Tỉnh thành nổi bật"
  const provinceTrackRef = useRef(null);
  const [provinceAutoPaused, setProvinceAutoPaused] = useState(false);

  // Khách đã đăng nhập thì đưa thẳng vào Dashboard — không cho quay lại
  // xem trang landing page nữa (landing page chỉ dành cho khách vãng lai).
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/customer/dashboard");
      return;
    }
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
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
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

  // Đang kiểm tra đăng nhập (và sẽ redirect nếu có) — không render gì để
  // tránh nháy trang landing page trước khi chuyển hướng.
  if (checkingAuth) return null;

  return (
    <>
      {/* Prefetch trước ảnh nền dùng chung ở /auth và /forgot-password —
          đặt ở đây (trang chủ, nơi có nút Đăng nhập/Đăng ký dẫn sang đó).
          Cố tình dùng rel="prefetch" chứ KHÔNG phải rel="preload": preload
          báo cho browser "trang NÀY cần dùng ngay", nên nếu tài nguyên đó
          không được vẽ ra trên chính trang hiện tại (mà chỉ dùng ở trang
          điều hướng tới sau này) thì Chrome luôn cảnh báo "preloaded but
          not used" dù đặt ở đâu đi nữa. prefetch đúng ngữ nghĩa hơn: mức
          ưu tiên thấp, ngầm hiểu là "có thể cần ở trang sau", không cảnh
          báo nếu chưa dùng ngay. */}
      <link rel="prefetch" as="image" href="/auth-bg.jpg" />
      <div className="home">
        {/* ─── Navbar ─── */}
        <nav className={`home-navbar ${scrolled ? "is-scrolled" : ""}`}>
          <div className="container home-navbar__inner">
            <Logo className="home-navbar__logo" size={65} />

            <div className="home-navbar__links">
              <a href="#home" onClick={scrollToSection("home")}>
                Trang chủ
              </a>
              <a href="#about" onClick={scrollToSection("about")}>
                Giới thiệu
              </a>
              <a href="#gia" onClick={scrollToSection("gia")}>
                Các gói
              </a>
              <a href="#provinces" onClick={scrollToSection("provinces")}>
                Mới
              </a>
              <a href="#faq" onClick={scrollToSection("faq")}>
                Hỏi đáp
              </a>
            </div>

            <div className="home-navbar__actions">
              {user ? (
                <>
                  <Link
                    href="/customer/dashboard"
                    className="home-navbar__dashboard-link"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="home-navbar__logout-btn"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link href="/auth" className="home-navbar__login-btn">
                  Đăng nhập
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
                Khám phá Việt Nam
              </div>
              <h1 className="home-hero__title">
                Mang cả Việt Nam
                <br />
                <span className="home-hero__title-accent">
                  vào lòng bàn tay bạn
                </span>
              </h1>
              <p className="home-hero__desc">
                Sưu tầm 34 mảnh ghép NFC theo từng tỉnh thành, ghép thành bản đồ
                treo tường, và lưu giữ kỷ niệm mỗi chuyến đi trong album ảnh có
                AI viết caption giúp bạn.
              </p>
              <div className="home-hero__cta-row">
                <Link href="/activate" className="home-btn-teal">
                  Kích hoạt mảnh NFC
                </Link>
                <a
                  href="#provinces"
                  onClick={scrollToSection("provinces")}
                  className="home-btn-outline-ink"
                >
                  Khám phá tỉnh thành
                </a>
              </div>

              <div className="home-hero__highlight">
                <div className="home-hero__highlight-icon">
                  <Puzzle size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="home-hero__highlight-title">34 mảnh ghép</div>
                  <div className="home-hero__highlight-sub">
                    Mỗi tỉnh 1 mảnh, sưu tầm trọn bộ bản đồ
                  </div>
                </div>
              </div>
            </div>

            {/* Minh họa: điện thoại chạm mảnh NFC mở album — signature
              của trang: hiệu ứng sóng lan tỏa mô phỏng đúng thao tác
              "chạm" (tap), thay vì ảnh người thật hay biểu tượng chung
              chung. Thuần CSS/SVG, không phát sinh vấn đề bản quyền. */}
            <div className="home-hero__illustration">
              <div className="home-hero__blob" />

              <div className="home-hero__phone">
                <div className="home-hero__phone-screen">
                  <Map size={40} strokeWidth={1.6} color="var(--home-teal)" />
                  <div className="home-hero__phone-title">Album Đà Nẵng</div>
                  <div className="home-hero__phone-sub">
                    12 ảnh · AI caption
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
                  <div className="home-hero__card-title">Kích hoạt NFC</div>
                  <div className="home-hero__card-sub">Chạm là mở album</div>
                </div>
              </div>
              <div className="home-hero__card home-hero__card--ai">
                <Sparkles size={14} strokeWidth={2.4} />
                AI viết caption
              </div>
            </div>
          </div>

          {/* Dải tính năng nhanh */}
          <div className="home-feature-strip">
            <div className="container home-feature-strip__inner">
              {FEATURE_STRIP.map(({ icon: Icon, label }) => (
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
              {ABOUT_ICONS.map(({ icon: Icon, label }) => (
                <div key={label} className="home-about__icon-tile">
                  <Icon size={26} strokeWidth={2} />
                  <span className="home-about__icon-label">{label}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="home-eyebrow">
                <span className="home-eyebrow__dash" />
                Giới thiệu
              </div>
              <h2 className="home-about__title">
                Mỗi tỉnh thành là một mảnh ghép, một câu chuyện
              </h2>
              <p className="home-about__desc">
                VinaTap kết hợp một mảnh ghép NFC vật lý với trải nghiệm web
                tương tác: quét NFC để xem thông tin tỉnh, chỉ đường tới địa
                danh, và mở album ảnh cá nhân được AI tự viết caption — biến
                việc sưu tầm quà lưu niệm thành một hành trình khám phá.
              </p>
              <div className="home-about__stats">
                <div>
                  <div className="home-about__stat-value">34+</div>
                  <div className="home-about__stat-label">Tỉnh thành</div>
                </div>
                <div>
                  <div className="home-about__stat-value">3</div>
                  <div className="home-about__stat-label">Lớp trải nghiệm</div>
                </div>
                <div>
                  <div className="home-about__stat-value">2025</div>
                  <div className="home-about__stat-label">Năm ra mắt</div>
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
                Các gói
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title">Chọn gói phù hợp với bạn</h2>
            </div>

            <div className="home-pricing__grid">
              {[
                {
                  name: "Mảnh ghép lẻ",
                  price: "50.000đ",
                  desc: "1 mảnh NFC cho 1 tỉnh thành bất kỳ",
                  features: [
                    "1 mảnh NFC vật lý",
                    "1 album ảnh AI",
                    "Kích hoạt trọn đời",
                  ],
                  highlight: false,
                },
                {
                  name: "Bộ 5 tỉnh",
                  price: "220.000đ",
                  desc: "Khởi đầu hành trình sưu tầm của bạn",
                  features: [
                    "5 mảnh NFC tự chọn",
                    "5 album ảnh AI",
                    "Tiết kiệm so với mua lẻ",
                  ],
                  highlight: true,
                },
                {
                  name: "Bộ đầy đủ 34 tỉnh",
                  price: "1.400.000đ",
                  desc: "Trọn bộ bản đồ Việt Nam treo tường",
                  features: [
                    "34 mảnh NFC toàn quốc",
                    "34 album ảnh AI",
                    "Ưu đãi tốt nhất/mảnh",
                  ],
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`home-pricing__card ${tier.highlight ? "home-pricing__card--highlight" : ""}`}
                >
                  {tier.highlight && (
                    <span className="home-pricing__badge">Phổ biến nhất</span>
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
                    Chọn gói này
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
                Mới
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--md">
                Tỉnh thành nổi bật
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
                  placeholder="Tìm tỉnh thành..."
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
                      all: "Tất cả",
                      north: "Miền Bắc",
                      central: "Miền Trung",
                      south: "Miền Nam",
                      island: "Hải đảo",
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
                Không tìm thấy tỉnh thành nào
              </p>
            ) : (
              <div
                className="home-provinces__carousel"
                onMouseEnter={() => setProvinceAutoPaused(true)}
                onMouseLeave={() => setProvinceAutoPaused(false)}
              >
                {/* Nút lùi */}
                <button
                  aria-label="Trước"
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
                  {filtered.map((p) => (
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
                              alt={p.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="home-provinces__card-thumb-placeholder">
                              <Map size={30} strokeWidth={1.8} />
                            </div>
                          )}
                          <span className="home-provinces__region-badge">
                            {REGION_LABEL[p.region]}
                          </span>
                        </div>
                        <div className="home-provinces__card-body">
                          <h3 className="home-provinces__card-title">
                            {p.name}
                          </h3>
                          <p className="home-provinces__card-desc">
                            {p.description ||
                              "Khám phá địa danh nổi tiếng tại đây"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Nút tiến */}
                <button
                  aria-label="Tiếp"
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
                Chính sách
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--sm">
                Cam kết với người dùng
              </h2>
            </div>
            <div className="home-policy__grid">
              {POLICY_ITEMS.map(({ icon: Icon, title, desc }) => (
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
              * Nội dung chính sách tạm thời, cần đội ngũ pháp lý rà soát trước
              khi ra mắt chính thức.
            </p>
          </div>
        </RevealSection>

        {/* ─── Hỏi đáp ─── */}
        <RevealSection id="faq" className="home-faq">
          <div className="container home-section--pad-lg">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                Hỏi đáp
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--md">
                Những điều bạn cần biết
              </h2>
            </div>

            <div className="home-faq__list">
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={item.q}
                    className={`home-faq__item ${isOpen ? "is-open" : ""}`}
                  >
                    <button
                      className="home-faq__question"
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      {item.q}
                      <ChevronDown
                        size={18}
                        strokeWidth={2.2}
                        className="home-faq__chevron"
                      />
                    </button>
                    <div className="home-faq__answer-wrap">
                      <p className="home-faq__answer">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>

        {/* ─── Footer ─── */}
        <footer className="home-footer">
          <div className="container home-footer__grid">
            <div>
              <Logo
                className="home-footer__brand-name"
                size={65}
                onClick={scrollToSection("home")}
              />
              <p className="home-footer__brand-desc">
                Bản đồ du lịch NFC Việt Nam — sưu tầm, khám phá, lưu giữ kỷ niệm
                từng chuyến đi.
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
              title="Sản phẩm"
              links={[
                { label: "Trang chủ", href: "/" },
                { label: "Kích hoạt NFC", href: "/activate" },
                { label: "Dashboard", href: "/customer/dashboard" },
                { label: "Đăng nhập", href: "/auth" },
              ]}
            />
            <FooterCol
              title="Khám phá"
              links={[
                { label: "Các gói", href: "/#gia" },
                { label: "Tỉnh thành", href: "/#provinces" },
                { label: "Giới thiệu", href: "/#about" },
                { label: "Hỏi đáp", href: "/#faq" },
              ]}
            />
            <FooterCol
              title="Công ty"
              links={[
                { label: "Về VinaTap", href: "#" },
                { label: "Liên hệ", href: "#" },
                { label: "Điều khoản", href: "#" },
                { label: "Chính sách", href: "/#chinh-sach" },
              ]}
            />
          </div>
          <div className="home-footer__bottom">
            <div className="container home-footer__bottom-inner">
              © 2025 VinaTap. Tất cả quyền được bảo lưu.
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
