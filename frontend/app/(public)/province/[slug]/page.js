"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { useParams, useSearchParams } from "next/navigation";
import { provinceAPI } from "@/lib/api";
import { isLoggedIn, clearAuth, getUser } from "@/lib/auth";
import Dino404 from "@/components/ui/Dino404";
import DinoLoader from "@/components/ui/DinoLoader";
import { getProvinceGuideData, getProvinceCover } from "@/lib/provinceGuideData";
import GuideArticleModal from "./components/GuideArticleModal";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import {
  ChevronRight,
  MapPin,
  Calendar,
  Eye,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "@/styles/province.css";

export default function ProvincePage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();

  const [province, setProvince] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [foods, setFoods] = useState([]);
  const [articles, setArticles] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState(null);

  // Modal xem bài viết / địa danh
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setUser(getUser());
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const load = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await provinceAPI.getOne(slug);
      setProvince(res.province);
      setLandmarks(res.landmarks || []);
      setFoods(res.foods || []);
      setArticles(res.articles || []);
      setFestivals(res.festivals || []);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <DinoLoader
        text="Đang mở cẩm nang du lịch..."
        subtext="Vui lòng chờ trong giây lát"
        size={280}
        fullScreen={true}
      />
    );
  }

  if (notFound || !province) {
    return (
      <Dino404
        title="Không Tìm Thấy Cẩm Nang Tỉnh Thành"
        message="Tỉnh thành này không nằm trong danh sách cẩm nang hoặc đường dẫn không chính xác."
        backBtnText="Quay Lại Trang Chủ"
      />
    );
  }

  const guideData = getProvinceGuideData(province, landmarks, foods, articles, festivals);
  const pName = province.name || "Việt Nam";

  // Ảnh bìa chính
  const heroImage =
    getProvinceCover(province) ||
    province.thumbnail_url ||
    guideData.landmarks[0]?.image ||
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80";

  // Danh sách món ăn tổng hợp theo cấu trúc Numbered List (lấy cảm hứng từ 8 Must-Try Foods in Hanoi)
  const foodItems = [
    guideData.culinary.featuredMain,
    guideData.culinary.featuredSub && guideData.culinary.featuredSub.id !== guideData.culinary.featuredMain?.id ? guideData.culinary.featuredSub : null,
    ...guideData.culinary.list
  ].filter(Boolean);

  return (
    <div className="vnn-province-page">
      {/* ─── 1. TOP EDITORIAL NAVBAR ───────────────────────── */}
      <nav className="vnn-prov-navbar" aria-label="Điều hướng cẩm nang">
        <div className="vnn-prov-navbar__inner">
          <div className="vnn-prov-navbar__left">
            <Link href="/" className="vnn-prov-navbar__brand" title="Về trang chủ VinaTap">
              <Logo size="small" noLink href={null} as="span" />
            </Link>
            <div className="vnn-prov-breadcrumb">
              <Link href="/" className="vnn-prov-breadcrumb__item">Trang chủ</Link>
              <ChevronRight size={13} className="vnn-prov-breadcrumb__sep" />
              <Link href="/#destinations" className="vnn-prov-breadcrumb__item">Điểm đến</Link>
              <ChevronRight size={13} className="vnn-prov-breadcrumb__sep" />
              <span className="vnn-prov-breadcrumb__current">{pName}</span>
            </div>
          </div>
          <div className="vnn-prov-navbar__actions">
            <Link href="/shop" className="vnn-prov-btn-pill vnn-prov-btn-pill--teal">
              <span>Sưu tầm Thẻ {pName}</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="vnn-article-container">
        {/* ─── 2. ARTICLE HEADER (TIÊU CHUẨN BÁO CHÍ DU LỊCH) ─ */}
        <header className="vnn-article-header">
          <div className="vnn-category-badge">
            <Compass size={13} />
            <span>CẨM NANG DU LỊCH VIỆT NAM</span>
          </div>

          <h1 className="vnn-article-title">
            Khám Phá {pName}: Cẩm Nang Du Lịch, Ẩm Thực &amp; Trải Nghiệm Bản Địa
          </h1>

          <div className="vnn-meta-bar">
            <div className="vnn-author-info">
              <div className="vnn-author-avatar">VT</div>
              <div>
                <span className="vnn-author-name">Ban Biên Tập VinaTap</span>
                <span className="vnn-meta-date">Đã kiểm chứng thực tế</span>
              </div>
            </div>
            <div className="vnn-meta-stats">
              <span className="vnn-read-time">
                <Calendar size={13} />
                <span>Cập nhật 2026</span>
              </span>
              <span className="vnn-read-time">
                <Eye size={13} />
                <span>6 phút đọc</span>
              </span>
            </div>
          </div>
        </header>

        {/* ─── 3. HERO BANNER & CAPTION ────────────────────── */}
        <section className="vnn-hero-banner">
          <div className="vnn-hero-banner__img-wrap">
            <img
              src={heroImage}
              alt={`Vẻ đẹp du lịch ${pName}`}
              className="vnn-hero-banner__img"
            />
          </div>
          <p className="vnn-hero-banner__caption">
            Toàn cảnh vẻ đẹp văn hóa và cảnh quan {pName} qua góc nhìn lữ hành VinaTap.
          </p>
        </section>

        {/* ─── 4. LEAD STORY / TỔNG QUAN ───────────────────── */}
        <section className="vnn-lead-story">
          <p>
            {province.description ||
              `${pName} luôn là một trong những điểm dừng chân quyến rũ trên bản đồ du lịch Việt Nam với thiên nhiên trù phú, trầm tích văn hóa lâu đời và con người nồng hậu. Cho dù bạn lên kế hoạch cho một kỳ nghỉ ngắn ngày hay hành trình khám phá chiều sâu bản địa, cẩm nang dưới đây của VinaTap sẽ đồng hành cùng bạn từ món ngon đường phố đến những tọa độ check-in giàu cảm xúc nhất.`}
          </p>
        </section>

        {/* ─── VINATAP EDITORIAL GUIDE CALLOUT FOR TP.HCM ──── */}
        {(slug === "ho-chi-minh" ||
          slug === "ho-chi-minh-city" ||
          slug === "tp-ho-chi-minh") && (
          <section
            style={{
              background: "linear-gradient(135deg, #0d1f2d 0%, #162b3d 100%)",
              borderRadius: "16px",
              padding: "1.75rem 2rem",
              margin: "0 0 2.5rem 0",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              flexWrap: "wrap",
              border: "1px solid rgba(0, 194, 203, 0.4)",
              boxShadow: "0 10px 30px rgba(0, 194, 203, 0.15)",
            }}
          >
            <div style={{ maxWidth: "600px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#00c2cb",
                  background: "rgba(0, 194, 203, 0.15)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <Sparkles size={13} />
                <span>CẨM NANG ĐẶC BIỆT • VINATAP EDITORIAL</span>
              </div>
              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  marginBottom: "6px",
                  color: "#ffffff",
                }}
              >
                Trọn Bộ Cẩm Nang Du Lịch &amp; Ẩm Thực TP. Hồ Chí Minh
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Khám phá chuyên sâu 10 trải nghiệm di sản biểu tượng &amp; 12 món ăn
                kinh điển kèm địa chỉ quán gia truyền và bản đồ Google Maps.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                href="/guide?tab=things"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#00c2cb",
                  color: "#0d1f2d",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(0, 194, 203, 0.3)",
                }}
              >
                <span>🏛️ 10 Điều Tuyệt Nhất</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/guide?tab=foods"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255, 87, 87, 0.2)",
                  border: "1px solid #ff5757",
                  color: "#ff7b7b",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  textDecoration: "none",
                }}
              >
                <span>🍜 12 Món Ăn Phải Thử</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}


        {/* ─── 5. TOP MÓN ĂN & QUÁN ĂN PHẢI THỬ (NUMBERED LIST) ─ */}
        <section className="vnn-section" id="culinary">
          <div className="vnn-section-heading">
            <div className="vnn-section-heading__badge">ẨM THỰC BẢN ĐỊA</div>
            <h2 className="vnn-section-heading__title">
              Top Món Ngon Phải Thử &amp; Địa Chỉ Thưởng Thức Tại {pName}
            </h2>
            <p className="vnn-section-heading__sub">
              Hương vị đậm đà được lưu truyền qua nhiều thế hệ, tạo nên linh hồn ẩm thực khó quên của vùng đất này.
            </p>
          </div>

          <div className="vnn-food-numbered-list">
            {foodItems.map((item, idx) => {
              const numStr = String(idx + 1).padStart(2, "0");
              return (
                <article
                  key={item.id || idx}
                  className="vnn-food-card"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="vnn-food-card__img-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="vnn-food-card__img"
                    />
                    <div className="vnn-food-card__number">#{numStr}</div>
                  </div>
                  <div className="vnn-food-card__content">
                    <div className="vnn-food-card__category">
                      {item.category || "Đặc sản trứ danh"}
                    </div>
                    <h3 className="vnn-food-card__title">{item.title}</h3>
                    <p className="vnn-food-card__desc">
                      {item.desc || item.excerpt || `Món ăn đại diện cho tinh hoa ẩm thực địa phương ${pName}, mang hương vị tươi ngon và phong cách chế biến đặc sắc.`}
                    </p>
                    <div className="vnn-food-card__footer">
                      {item.address ? (
                        <div className="vnn-food-card__address">
                          <MapPin size={14} />
                          <span>{item.address}</span>
                        </div>
                      ) : (
                        <div className="vnn-food-card__address">
                          <Sparkles size={14} />
                          <span>Hương vị truyền thống</span>
                        </div>
                      )}
                      <button type="button" className="vnn-food-card__cta">
                        <span>Đọc gợi ý</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ─── 6. ĐIỂM THAM QUAN NỔI TIẾNG ──────────────────── */}
        <section className="vnn-section" id="landmarks">
          <div className="vnn-section-heading">
            <div className="vnn-section-heading__badge">ĐIỂM ĐẾN TIÊU BIỂU</div>
            <h2 className="vnn-section-heading__title">
              Những Tọa Độ Check-in Không Thể Bỏ Lỡ Tại {pName}
            </h2>
            <p className="vnn-section-heading__sub">
              Khám phá các di tích lịch sử, danh lam thắng cảnh và không gian văn hóa biểu tượng.
            </p>
          </div>

          <div className="vnn-landmarks-grid">
            {guideData.landmarks.map((l, idx) => (
              <div
                key={l.id || idx}
                className="vnn-landmark-card"
                onClick={() => setSelectedItem(l)}
              >
                <div className="vnn-landmark-card__img-wrap">
                  <img
                    src={l.image}
                    alt={l.name}
                    className="vnn-landmark-card__img"
                    loading="lazy"
                  />
                  <div className="vnn-landmark-card__overlay" />
                  <div className="vnn-landmark-card__content">
                    <div className="vnn-landmark-card__tag">
                      <MapPin size={12} />
                      <span>{pName}</span>
                    </div>
                    <h3 className="vnn-landmark-card__title">{l.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 7. BỘ 3 CẨM NANG BỎ TÚI ─────────────────────── */}
        <section className="vnn-section" id="pocket-guides">
          <div className="vnn-section-heading">
            <div className="vnn-section-heading__badge">KINH NGHIỆM LỮ HÀNH</div>
            <h2 className="vnn-section-heading__title">Cẩm Nang Bỏ Túi Cho Chuyến Đi Hoàn Hảo</h2>
            <p className="vnn-section-heading__sub">
              Tất cả thông tin thiết thực về phương tiện, hành trình và mẹo tiết kiệm chi phí.
            </p>
          </div>

          <div className="vnn-guides-3col">
            {/* Cột 1: Di chuyển */}
            <div className="vnn-guide-col">
              <div
                className="vnn-guide-col__cover"
                onClick={() =>
                  setSelectedItem({
                    title: guideData.guides.transport.articles[0]?.title || "Di chuyển",
                    image: guideData.guides.transport.image,
                    desc: "Cẩm nang các phương tiện di chuyển nhanh chóng, an toàn và thuận tiện nhất.",
                  })
                }
              >
                <img
                  src={guideData.guides.transport.image}
                  alt={guideData.guides.transport.title}
                  loading="lazy"
                />
                <div className="vnn-guide-col__cover-overlay">
                  <span className="vnn-guide-col__badge">Di chuyển</span>
                </div>
              </div>
              <div className="vnn-guide-col__body">
                <h3 className="vnn-guide-col__title">{guideData.guides.transport.title}</h3>
                <ul className="vnn-guide-col__list">
                  {guideData.guides.transport.articles.map((art, i) => (
                    <li
                      key={art.id || i}
                      onClick={() =>
                        setSelectedItem({
                          title: art.title,
                          image: guideData.guides.transport.image,
                          desc: art.desc || "Kinh nghiệm và mẹo di chuyển hữu ích cho chuyến du lịch trọn vẹn.",
                        })
                      }
                    >
                      <ArrowRight size={13} />
                      <span>{art.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cột 2: Gợi ý lịch trình */}
            <div className="vnn-guide-col">
              <div
                className="vnn-guide-col__cover"
                onClick={() =>
                  setSelectedItem({
                    title: guideData.guides.itineraries.articles[0]?.title || "Gợi ý lịch trình",
                    image: guideData.guides.itineraries.image,
                    desc: "Lịch trình du lịch được thiết kế tối ưu thời gian và chi phí cho du khách.",
                  })
                }
              >
                <img
                  src={guideData.guides.itineraries.image}
                  alt={guideData.guides.itineraries.title}
                  loading="lazy"
                />
                <div className="vnn-guide-col__cover-overlay">
                  <span className="vnn-guide-col__badge">Lịch trình</span>
                </div>
              </div>
              <div className="vnn-guide-col__body">
                <h3 className="vnn-guide-col__title">{guideData.guides.itineraries.title}</h3>
                <ul className="vnn-guide-col__list">
                  {guideData.guides.itineraries.articles.map((art, i) => (
                    <li
                      key={art.id || i}
                      onClick={() =>
                        setSelectedItem({
                          title: art.title,
                          image: guideData.guides.itineraries.image,
                          desc: art.desc || "Gợi ý lịch trình du lịch khám phá chi tiết từ sáng đến đêm.",
                        })
                      }
                    >
                      <ArrowRight size={13} />
                      <span>{art.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cột 3: Mẹo du lịch tự túc */}
            <div className="vnn-guide-col">
              <div
                className="vnn-guide-col__cover"
                onClick={() =>
                  setSelectedItem({
                    title: guideData.guides.tips.articles[0]?.title || "Kinh nghiệm đi tự túc",
                    image: guideData.guides.tips.image,
                    desc: "Kinh nghiệm và mẹo du lịch tự túc tiết kiệm, an toàn và đáng nhớ.",
                  })
                }
              >
                <img
                  src={guideData.guides.tips.image}
                  alt={guideData.guides.tips.title}
                  loading="lazy"
                />
                <div className="vnn-guide-col__cover-overlay">
                  <span className="vnn-guide-col__badge">Bí kíp</span>
                </div>
              </div>
              <div className="vnn-guide-col__body">
                <h3 className="vnn-guide-col__title">{guideData.guides.tips.title}</h3>
                <ul className="vnn-guide-col__list">
                  {guideData.guides.tips.articles.map((art, i) => (
                    <li
                      key={art.id || i}
                      onClick={() =>
                        setSelectedItem({
                          title: art.title,
                          image: guideData.guides.tips.image,
                          desc: art.desc || "Tổng hợp những bí kíp bỏ túi không thể bỏ qua khi du lịch.",
                        })
                      }
                    >
                      <ArrowRight size={13} />
                      <span>{art.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. GÓC REVIEW TRẢI NGHIỆM ───────────────────── */}
        <section className="vnn-section" id="reviews">
          <div className="vnn-section-heading">
            <div className="vnn-section-heading__badge">GÓC REVIEW CHÂN THỰC</div>
            <h2 className="vnn-section-heading__title">Cộng Đồng Du Khách Nói Gì Về {pName}</h2>
            <p className="vnn-section-heading__sub">
              Những bài chia sẻ trải nghiệm thực tế giúp bạn có cái nhìn đa chiều trước khi lên đường.
            </p>
          </div>

          <div className="vnn-reviews-grid">
            {/* Bài review chính */}
            {guideData.reviews.featuredMain && (
              <article
                className="vnn-review-card vnn-review-card--featured"
                onClick={() => setSelectedItem(guideData.reviews.featuredMain)}
              >
                <div className="vnn-review-card__img-wrap">
                  <img
                    src={guideData.reviews.featuredMain.image}
                    alt={guideData.reviews.featuredMain.title}
                    loading="lazy"
                    className="vnn-review-card__img"
                  />
                </div>
                <div className="vnn-review-card__body">
                  <div className="vnn-review-card__tag">Trải nghiệm tiêu biểu</div>
                  <h3 className="vnn-review-card__title">
                    {guideData.reviews.featuredMain.title}
                  </h3>
                  <p className="vnn-review-card__excerpt">
                    {guideData.reviews.featuredMain.desc || "Cảm nhận chân thực từ du khách trong chuyến chu du khám phá nhịp sống và con người địa phương."}
                  </p>
                </div>
              </article>
            )}

            {/* Các review khác */}
            {guideData.reviews.list.slice(0, 3).map((item, idx) => (
              <article
                key={item.id || idx}
                className="vnn-review-card"
                onClick={() => setSelectedItem(item)}
              >
                <div className="vnn-review-card__img-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="vnn-review-card__img"
                  />
                </div>
                <div className="vnn-review-card__body">
                  <div className="vnn-review-card__date">{item.date || "Góc nhìn du khách"}</div>
                  <h3 className="vnn-review-card__title">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── 9. LỄ HỘI VÀ SỰ KIỆN ────────────────────────── */}
        {guideData.festivals && guideData.festivals.length > 0 && (
          <section className="vnn-section" id="festivals">
            <div className="vnn-section-heading">
              <div className="vnn-section-heading__badge">VĂN HÓA DÂN GIAN</div>
              <h2 className="vnn-section-heading__title">Lễ Hội Truyền Thống Đặc Sắc</h2>
              <p className="vnn-section-heading__sub">
                Hòa mình vào không khí tưng bừng của những ngày hội dân gian rực rỡ sắc màu.
              </p>
            </div>

            <div className="vnn-festivals-grid">
              {guideData.festivals.map((fe, idx) => (
                <div
                  key={fe.id || idx}
                  className="vnn-festival-card"
                  onClick={() => setSelectedItem(fe)}
                >
                  <img
                    src={fe.image}
                    alt={fe.title}
                    className="vnn-festival-card__img"
                    loading="lazy"
                  />
                  <div className="vnn-festival-card__overlay" />
                  <h3 className="vnn-festival-card__title">{fe.title}</h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ─── 10. MODAL XEM CHI TIẾT BÀI VIẾT / ĐỊA DANH ─────── */}
      {selectedItem && (
        <GuideArticleModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* ─── 11. THỔ ĐỊA AI CHATBOT VÙNG ĐẤT ─────────────────── */}
      <ProvinceChatbot
        province={province}
        spots={landmarks}
        specialties={province?.specialties}
      />
    </div>
  );
}
