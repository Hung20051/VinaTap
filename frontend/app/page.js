"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { provinceAPI } from "../lib/api";
import { isLoggedIn, getUser, clearAuth } from "../lib/auth";
import { useRouter } from "next/navigation";
import "../styles/home.css";

const REGION_LABEL = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam",
  island: "Hải đảo",
};

export default function HomePage() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Slide tự động cho "Tỉnh thành nổi bật"
  const provinceTrackRef = useRef(null);
  const [provinceAutoPaused, setProvinceAutoPaused] = useState(false);

  // Khách đã đăng nhập thì đưa thẳng vào Dashboard — không cho quay lại
  // xem trang landing page nữa (landing page chỉ dành cho khách vãng lai).
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
      return;
    }
    setUser(getUser());
    setCheckingAuth(false);
    provinceAPI
      .getAll()
      .then((d) => setProvinces(d.provinces))
      .catch(console.error)
      .finally(() => setLoading(false));
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
    setUser(null);
  };

  // Đang kiểm tra đăng nhập (và sẽ redirect nếu có) — không render gì để
  // tránh nháy trang landing page trước khi chuyển hướng.
  if (checkingAuth) return null;

  return (
    <div className="home">
      {/* ─── Navbar ─── */}
      <nav className="home-navbar">
        <div className="container home-navbar__inner">
          <Link href="/" className="home-navbar__logo">
            <span className="home-navbar__logo-badge">🗺</span>
            VinaTap
          </Link>

          <div className="home-navbar__links">
            <a href="#home">Trang chủ</a>
            <a href="#about">Giới thiệu</a>
            <a href="#gia">Các gói</a>
            <a href="#provinces">Mới</a>
            <a href="#chinh-sach">Chính sách</a>
          </div>

          <div className="home-navbar__actions">
            {user ? (
              <>
                <Link href="/dashboard" className="home-navbar__dashboard-link">
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
            <div className="home-eyebrow">─ Khám phá Việt Nam</div>
            <h1 className="home-hero__title">
              Mang cả Việt Nam
              <br />
              vào lòng bàn tay bạn
            </h1>
            <p className="home-hero__desc">
              Sưu tầm 34 mảnh ghép NFC theo từng tỉnh thành, ghép thành bản đồ
              treo tường, và lưu giữ kỷ niệm mỗi chuyến đi trong album ảnh có AI
              viết caption giúp bạn.
            </p>
            <div className="home-hero__cta-row">
              <Link href="/activate" className="home-btn-teal">
                Kích hoạt mảnh NFC
              </Link>
              <a href="#provinces" className="home-btn-outline-ink">
                Khám phá tỉnh thành
              </a>
            </div>

            <div className="home-hero__highlight">
              <div className="home-hero__highlight-icon">🧩</div>
              <div>
                <div className="home-hero__highlight-title">34 mảnh ghép</div>
                <div className="home-hero__highlight-sub">
                  Mỗi tỉnh 1 mảnh, sưu tầm trọn bộ bản đồ
                </div>
              </div>
            </div>
          </div>

          {/* Minh họa: điện thoại chạm NFC mở album — vẽ bằng CSS/SVG,
              không dùng ảnh người thật để tránh vấn đề bản quyền */}
          <div className="home-hero__illustration">
            <div className="home-hero__blob" />
            <div className="home-hero__phone">
              <div className="home-hero__phone-screen">
                🗺
                <div className="home-hero__phone-title">Album Đà Nẵng</div>
                <div className="home-hero__phone-sub">12 ảnh · AI caption</div>
              </div>
            </div>
            <div className="home-hero__card home-hero__card--activate">
              <span className="home-hero__card-check">✓</span>
              <div>
                <div className="home-hero__card-title">Kích hoạt NFC</div>
                <div className="home-hero__card-sub">Chạm là mở album</div>
              </div>
            </div>
            <div className="home-hero__card home-hero__card--ai">
              ✨ AI viết caption
            </div>
          </div>
        </div>
      </section>

      {/* ─── About (full-screen) ─── */}
      <section id="about" className="home-about">
        <div className="container home-about__grid">
          <div className="home-about__icons-grid">
            {[
              { icon: "🧩", label: "Vật lý" },
              { icon: "🌐", label: "Web tương tác" },
              { icon: "📸", label: "Album AI" },
              { icon: "🎮", label: "Gamification" },
            ].map((it) => (
              <div key={it.label} className="home-about__icon-tile">
                {it.icon}
                <span className="home-about__icon-label">{it.label}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="home-eyebrow">─ Giới thiệu</div>
            <h2 className="home-about__title">
              Mỗi tỉnh thành là một mảnh ghép, một câu chuyện
            </h2>
            <p className="home-about__desc">
              VinaTap kết hợp một mảnh ghép NFC vật lý với trải nghiệm web tương
              tác: quét NFC để xem thông tin tỉnh, chỉ đường tới địa danh, và mở
              album ảnh cá nhân được AI tự viết caption — biến việc sưu tầm quà
              lưu niệm thành một hành trình khám phá.
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
      </section>

      {/* ─── Pricing / Các gói (full-screen) ─── */}
      <section id="gia" className="home-pricing">
        <div className="container home-section--pad-lg">
          <div className="home-section-head">
            <div className="home-eyebrow">─ Các gói ─</div>
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
                <div className="home-pricing__name">{tier.name}</div>
                <div className="home-pricing__price">{tier.price}</div>
                <p className="home-pricing__desc">{tier.desc}</p>
                <div className="home-pricing__features">
                  {tier.features.map((f) => (
                    <div key={f} className="home-pricing__feature">
                      <span className="home-pricing__feature-check">✓</span>
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
      </section>

      {/* ─── Tỉnh thành nổi bật ─── */}
      <section id="provinces" className="home-provinces">
        <div className="container home-section--pad-sm">
          <div className="home-section-head">
            <div className="home-eyebrow">─ Mới ─</div>
            <h2 className="home-section-title home-section-title--md">
              Tỉnh thành nổi bật
            </h2>
          </div>

          <div className="home-provinces__filters">
            <input
              className="input home-provinces__search"
              placeholder="🔍 Tìm tỉnh thành..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                ‹
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
                            🗺
                          </div>
                        )}
                        <span className="home-provinces__region-badge">
                          {REGION_LABEL[p.region]}
                        </span>
                      </div>
                      <div className="home-provinces__card-body">
                        <h3 className="home-provinces__card-title">{p.name}</h3>
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
                ›
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Chính sách (tóm tắt) ─── */}
      <section id="chinh-sach" className="home-policy">
        <div className="container home-section--pad-sm">
          <div className="home-section-head">
            <div className="home-eyebrow">─ Chính sách ─</div>
            <h2 className="home-section-title home-section-title--sm">
              Cam kết với người dùng
            </h2>
          </div>
          <div className="home-policy__grid">
            {[
              {
                icon: "🔁",
                title: "Kích hoạt trong 1 năm",
                desc: "Serial NFC có hiệu lực kích hoạt 12 tháng kể từ ngày mua.",
              },
              {
                icon: "🔒",
                title: "Quyền riêng tư album",
                desc: "Album mặc định công khai để xem, nhưng chỉ chủ album mới sửa/xóa được.",
              },
              {
                icon: "🛠",
                title: "Bảo hành thẻ vật lý",
                desc: "Đổi mới miễn phí nếu chip NFC lỗi trong 30 ngày đầu.",
              },
            ].map((it) => (
              <div key={it.title} className="home-policy__card">
                <div className="home-policy__icon">{it.icon}</div>
                <div className="home-policy__title">{it.title}</div>
                <p className="home-policy__desc">{it.desc}</p>
              </div>
            ))}
          </div>
          <p className="home-policy__disclaimer">
            * Nội dung chính sách tạm thời, cần đội ngũ pháp lý rà soát trước
            khi ra mắt chính thức.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="home-footer">
        <div className="container home-footer__grid">
          <div>
            <div className="home-footer__brand-name">
              Vina<span>Tap</span> 🗺
            </div>
            <p className="home-footer__brand-desc">
              Bản đồ du lịch NFC Việt Nam — sưu tầm, khám phá, lưu giữ kỷ niệm
              từng chuyến đi.
            </p>
            <div className="home-footer__socials">
              {["Facebook", "TikTok", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="home-footer__social-btn"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Sản phẩm"
            links={[
              { label: "Trang chủ", href: "/" },
              { label: "Kích hoạt NFC", href: "/activate" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Đăng nhập", href: "/auth" },
            ]}
          />
          <FooterCol
            title="Khám phá"
            links={[
              { label: "Các gói", href: "/#gia" },
              { label: "Tỉnh thành", href: "/#provinces" },
              { label: "Giới thiệu", href: "/#about" },
              { label: "Chính sách", href: "/#chinh-sach" },
            ]}
          />
          <FooterCol
            title="Công ty"
            links={[
              { label: "Về VinaTap", href: "#" },
              { label: "Câu hỏi thường gặp", href: "#" },
              { label: "Liên hệ", href: "#" },
              { label: "Điều khoản", href: "#" },
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
