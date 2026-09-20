"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { useParams, useSearchParams } from "next/navigation";
import { provinceAPI } from "@/lib/api";
import { isLoggedIn, clearAuth, getUser } from "@/lib/auth";
import Dino404 from "@/components/ui/Dino404";
import DinoLoader from "@/components/ui/DinoLoader";
import { getProvinceGuideData } from "@/lib/provinceGuideData";
import GuideArticleModal from "./components/GuideArticleModal";
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
    province.thumbnail_url ||
    guideData.landmarks[0]?.image ||
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80";

  return (
    <div className="mia-page-wrapper">
      <main className="mia-main-container">
        {/* ─── BREADCRUMB (TRANG CHỦ > CẨM NANG > TỈNH THÀNH) ── */}
        <div className="mia-breadcrumb">
          <Link href="/" className="mia-breadcrumb-item">
            Trang chủ
          </Link>
          <ChevronRight size={14} className="mia-breadcrumb-sep" />
          <span className="mia-breadcrumb-item">Cẩm nang du lịch</span>
          <ChevronRight size={14} className="mia-breadcrumb-sep" />
          <span className="mia-breadcrumb-current">{pName}</span>
        </div>

        {/* ─── 3. HERO INTRO 2-COLUMN (ẢNH 1) ────────────────── */}
        <section className="mia-hero-section">
          <div className="mia-hero-left">
            <div className="mia-hero-img-wrap">
              <img
                src={heroImage}
                alt={pName}
                className="mia-hero-img"
              />
            </div>
          </div>
          <div className="mia-hero-right">
            <h1 className="mia-hero-title">{pName}</h1>
            <div className="mia-hero-desc">
              <p>
                {province.description ||
                  `${pName} không chỉ sở hữu cảnh sắc thiên nhiên hùng vĩ mà còn được mệnh danh là điểm đến đáng sống với nhịp sống hiện đại, văn hóa ẩm thực độc đáo và trải nghiệm giải trí "siêu hot hit". Nếu ${pName} đang nằm trong dự định lịch trình du lịch tự túc của bạn thì cùng dừng chân một xíu để lắng nghe những chia sẻ "đắt giá" về Cẩm nang du lịch ${pName} từ A - Z nhé!`}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 4. ĐIỂM THAM QUAN NỔI TIẾNG (ẢNH 1 & 2) ────────── */}
        <section className="mia-section">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Điểm tham quan nổi tiếng</h2>
            <button
              className="mia-see-all-btn"
              onClick={() => setSelectedItem(guideData.landmarks[0])}
            >
              Xem tất cả ({guideData.landmarks.length})
            </button>
          </div>

          <div className="mia-grid-scroll-x">
            {guideData.landmarks.map((l, idx) => (
              <div
                key={l.id || idx}
                className="mia-card-img-large"
                onClick={() => setSelectedItem(l)}
              >
                <img src={l.image} alt={l.name} className="mia-card-bg-img" loading="lazy" />
                <div className="mia-card-gradient" />
                <h3 className="mia-card-title">{l.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. QUÁN ĂN NỔI TIẾNG (ẢNH 2) ─────────────────── */}
        <section className="mia-section">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Quán ăn nổi tiếng</h2>
            <button
              className="mia-see-all-btn"
              onClick={() => setSelectedItem(guideData.culinary.featuredMain)}
            >
              Xem tất cả
            </button>
          </div>

          <div className="mia-culinary-grid">
            {/* Cột trái: bài viết món ngon dạng list (cuộn dọc có giới hạn) */}
            <div className="mia-food-list-col mia-scroll-y-box" style={{ maxHeight: "380px" }}>
              {guideData.culinary.list.map((item) => (
                <div
                  key={item.id}
                  className="mia-food-item"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="mia-food-thumb">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="mia-food-info">
                    <h4 className="mia-food-title">{item.title}</h4>
                    <div className="mia-food-meta">
                      <span>{item.date}</span>
                      <span>{item.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột giữa: 1 Card ảnh lớn món ăn tiêu biểu */}
            <div
              className="mia-food-featured-card"
              onClick={() => setSelectedItem(guideData.culinary.featuredMain)}
            >
              <img
                src={guideData.culinary.featuredMain.image}
                alt={guideData.culinary.featuredMain.title}
                className="mia-card-bg-img"
                loading="lazy"
              />
              <div className="mia-card-gradient" />
              <h3 className="mia-card-title">
                {guideData.culinary.featuredMain.title}
              </h3>
            </div>

            {/* Cột phải: 1 Card ảnh lớn món đặc sản tiêu biểu */}
            <div
              className="mia-food-featured-card"
              onClick={() => setSelectedItem(guideData.culinary.featuredSub)}
            >
              <img
                src={guideData.culinary.featuredSub.image}
                alt={guideData.culinary.featuredSub.title}
                className="mia-card-bg-img"
                loading="lazy"
              />
              <div className="mia-card-gradient" />
              <h3 className="mia-card-title">
                {guideData.culinary.featuredSub.title}
              </h3>
            </div>
          </div>
        </section>

        {/* ─── 6. BỘ 3 CẨM NANG: DI CHUYỂN, LỊCH TRÌNH, KINH NGHIỆM (ẢNH 3) ─ */}
        <section className="mia-section">
          <div className="mia-guides-3col">
            {/* Cột 1: Di chuyển */}
            <div className="mia-guide-column">
              <div
                className="mia-guide-top-img-card"
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
              </div>
              <div className="mia-guide-header">
                <h3 className="mia-guide-col-title">
                  {guideData.guides.transport.title}
                </h3>
                <span className="mia-guide-see-all">({guideData.guides.transport.articles.length} bài)</span>
              </div>
              <ul className="mia-guide-article-list mia-scroll-y-box" style={{ maxHeight: "240px" }}>
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
                    {art.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 2: Gợi ý lịch trình */}
            <div className="mia-guide-column">
              <div
                className="mia-guide-top-img-card"
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
              </div>
              <div className="mia-guide-header">
                <h3 className="mia-guide-col-title">
                  {guideData.guides.itineraries.title}
                </h3>
                <span className="mia-guide-see-all">({guideData.guides.itineraries.articles.length} bài)</span>
              </div>
              <ul className="mia-guide-article-list mia-scroll-y-box" style={{ maxHeight: "240px" }}>
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
                    {art.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 3: Kinh nghiệm đi tự túc */}
            <div className="mia-guide-column">
              <div
                className="mia-guide-top-img-card"
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
              </div>
              <div className="mia-guide-header">
                <h3 className="mia-guide-col-title">
                  {guideData.guides.tips.title}
                </h3>
                <span className="mia-guide-see-all">({guideData.guides.tips.articles.length} bài)</span>
              </div>
              <ul className="mia-guide-article-list mia-scroll-y-box" style={{ maxHeight: "240px" }}>
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
                    {art.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 7. GÓC REVIEW TRẢI NGHIỆM (ẢNH 3 & 4) ─────────── */}
        <section className="mia-section">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Góc review trải nghiệm</h2>
            <button
              className="mia-see-all-btn"
              onClick={() => setSelectedItem(guideData.reviews.featuredMain)}
            >
              Xem tất cả
            </button>
          </div>

          <div className="mia-culinary-grid">
            {/* Cột trái: các bài review dạng list (cuộn dọc) */}
            <div className="mia-food-list-col mia-scroll-y-box" style={{ maxHeight: "380px" }}>
              {guideData.reviews.list.map((item) => (
                <div
                  key={item.id}
                  className="mia-food-item"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="mia-food-thumb">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="mia-food-info">
                    <h4 className="mia-food-title">{item.title}</h4>
                    <div className="mia-food-meta">
                      <span>{item.date}</span>
                      <span>{item.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột giữa: 1 Card ảnh lớn review vui chơi */}
            <div
              className="mia-food-featured-card"
              onClick={() => setSelectedItem(guideData.reviews.featuredMain)}
            >
              <img
                src={guideData.reviews.featuredMain.image}
                alt={guideData.reviews.featuredMain.title}
                className="mia-card-bg-img"
                loading="lazy"
              />
              <div className="mia-card-gradient" />
              <h3 className="mia-card-title">
                {guideData.reviews.featuredMain.title}
              </h3>
            </div>

            {/* Cột phải: 1 Card ảnh lớn review chèo SUP/trải nghiệm */}
            <div
              className="mia-food-featured-card"
              onClick={() => setSelectedItem(guideData.reviews.featuredSub)}
            >
              <img
                src={guideData.reviews.featuredSub.image}
                alt={guideData.reviews.featuredSub.title}
                className="mia-card-bg-img"
                loading="lazy"
              />
              <div className="mia-card-gradient" />
              <h3 className="mia-card-title">
                {guideData.reviews.featuredSub.title}
              </h3>
            </div>
          </div>
        </section>

        {/* ─── 8. LỄ HỘI (ẢNH 4) ────────────────────────────── */}
        <section className="mia-section">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Lễ hội</h2>
            <button
              className="mia-see-all-btn"
              onClick={() => setSelectedItem(guideData.festivals[0])}
            >
              Xem tất cả ({guideData.festivals.length})
            </button>
          </div>

          <div className="mia-grid-scroll-x">
            {guideData.festivals.map((fe, idx) => (
              <div
                key={fe.id || idx}
                className="mia-card-img-large"
                onClick={() => setSelectedItem(fe)}
              >
                <img src={fe.image} alt={fe.title} className="mia-card-bg-img" loading="lazy" />
                <div className="mia-card-gradient" />
                <h3 className="mia-card-title">{fe.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── 9. MODAL XEM CHI TIẾT BÀI VIẾT / ĐỊA DANH ─────── */}
      {selectedItem && (
        <GuideArticleModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
