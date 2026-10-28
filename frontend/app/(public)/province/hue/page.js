"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import AffiliateDealBox from "@/components/ui/AffiliateDealBox";
import { NORTH_HUE_AFFILIATE_DEALS } from "@/lib/affiliateDeals";
import { getLang } from "@/lib/prefs";
import {
  Compass,
  Calendar,
  Clock,
  Bookmark,
  Share2,
  ChevronRight,
  MapPin,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  Waves,
  Sun,
  Bus,
  Train,
  Plane,
  Bed,
  Utensils,
  ChevronDown,
  ChevronUp,
  Download,
  Camera,
  Check,
  Award,
  Crown,
  Landmark,
  Shield,
  Eye,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/guide-editorial.css";
import "@/styles/hue-guide.css";

// ─── BÀI VIẾT LIÊN QUAN TRÊN VINATAP ───
const RELATED_ARTICLES = [
  {
    slug: "the-10-best-attractions-in-da-nang",
    title: "The 10 Best Attractions in Da Nang",
    titleVi: "10 Điểm Tham Quan Đẹp Nhất Đà Nẵng",
    badge: "CENTRAL HUB",
    badgeVi: "CỬA NGÕ MIỀN TRUNG",
    excerpt:
      "Explore the golden sands of My Khe, the iconic Dragon Bridge, Ba Na Hills, and the Marble Mountains just 2 hours from Hue.",
    excerptVi:
      "Khám phá bãi biển Mỹ Khê, Cầu Rồng, Bà Nà Hills và Ngũ Hành Sơn – chỉ cách Huế 2 giờ di chuyển qua Đèo Hải Vân hùng vĩ.",
    img: "/guide/danang/danang-10-best-attractions-hd.jpg",
  },
  {
    slug: "hoi-an",
    title: "Hoi An Ancient Town Travel Guide",
    titleVi: "Cẩm Nang Du Lịch Đô Thị Cổ Hội An",
    badge: "HERITAGE TRAIL",
    badgeVi: "CON ĐƯỜNG DI SẢN",
    excerpt:
      "A complete guide to Hoi An UNESCO World Heritage site, famous for moss-roofed yellow houses, glowing lanterns, and river culture.",
    excerptVi:
      "Đô thị cổ Hội An lung linh sắc đèn lồng bên dòng sông Hoài, nối tiếp hành trình di sản miền Trung từ Cố đô Huế.",
    img: "/guide/hoian/hoian-hero-hd.jpg",
  },
  {
    slug: "15-best-places-to-visit-in-vietnam-in-2026",
    title: "15 Best Places to Visit in Vietnam in 2026",
    titleVi: "15 Điểm Đến Đẹp Nhất Việt Nam Năm 2026",
    badge: "TRENDING",
    badgeVi: "XU HƯỚNG 2026",
    excerpt:
      "Discover Vietnam's top scenic landscapes, from UNESCO-listed Hue Imperial City and Trang An to misty mountain peaks.",
    excerptVi:
      "Danh sách chọn lọc các danh thắng ngoạn mục nhất từ Quần thể Di tích Cố đô Huế đến Tràng An, Fansipan và Hạ Long.",
    img: "/guide/megamenu/inspired-1.jpg",
  },
  {
    slug: "3-week-vietnam-itinerary",
    title: "3-Week Vietnam Itinerary: The Ultimate Route",
    titleVi: "Lịch Trình Du Lịch Việt Nam 3 Tuần Lý Tưởng",
    badge: "ITINERARY",
    badgeVi: "LỊCH TRÌNH 3 TUẦN",
    excerpt:
      "Our recommended 3-week route connecting Saigon, Nha Trang, Da Nang, Hoi An, Hue, Ninh Binh, and Hanoi.",
    excerptVi:
      "Lộ trình tối ưu xuyên Việt qua các điểm đến di sản: Sài Gòn → Nha Trang → Đà Nẵng → Hội An → Cố Đô Huế → Ninh Bình → Hà Nội.",
    img: "/guide/megamenu/itin-1-3week.jpg",
  },
];

export default function HueDestinationPage() {
  const [lang, setLang] = useState("vi");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setLang(getLang());
    const onLangChange = (e) => setLang(e.detail);
    window.addEventListener("vinatap_lang_changed", onLangChange);
    return () => window.removeEventListener("vinatap_lang_changed", onLangChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(
      isBookmarked
        ? lang === "vi"
          ? "Đã bỏ lưu cẩm nang Huế"
          : "Removed Hue Guide from bookmarks"
        : lang === "vi"
        ? "Đã lưu cẩm nang Cố Đô Huế vào danh sách yêu thích!"
        : "Saved Hue Guide to your bookmarks!"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title:
          lang === "vi"
            ? "Cẩm Nang Du Lịch Huế Toàn Diện | VinaTap"
            : "Hue Travel Guide: Detailed Guide | VinaTap",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        lang === "vi"
          ? "Đã sao chép liên kết cẩm nang vào bộ nhớ tạm!"
          : "Guide link copied to clipboard!"
      );
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isVi = lang === "vi";

  return (
    <div className="hue-page">
      {/* Scroll Indicator */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: "3px",
          backgroundColor: "#7e22ce",
          zIndex: 99999,
          transition: "width 0.1s ease",
        }}
      />

      <PublicHeader />

      <main style={{ paddingBottom: "4rem" }}>
        {/* Breadcrumbs */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.25rem 1.25rem 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.85rem",
              color: "#6b7280",
            }}
          >
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              {isVi ? "Trang chủ" : "Home"}
            </Link>
            <ChevronRight size={14} />
            <Link href="/category/destinations" style={{ color: "inherit", textDecoration: "none" }}>
              {isVi ? "Điểm đến" : "Destinations"}
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: "#7e22ce", fontWeight: 600 }}>
              {isVi ? "Thừa Thiên Huế" : "Hue Imperial City"}
            </span>
          </div>
        </div>

        {/* Hero Article Header */}
        <article style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 1.25rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span className="hue-hero-badge">
              <Crown size={14} style={{ marginRight: 4 }} />
              {isVi ? "DI SẢN THẾ GIỚI UNESCO • CỐ ĐÔ TRIỀU NGUYỄN" : "UNESCO WORLD HERITAGE • ANCIENT ROYAL CAPITAL"}
            </span>
            <h1
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "var(--guide-text-main, #142129)",
                margin: "0 0 1rem",
                fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)',
              }}
            >
              {isVi
                ? "Cẩm Nang Du Lịch Huế Toàn Diện: Khám Phá Cố Đô Triều Nguyễn & Di Sản Sông Hương"
                : "Hue Travel | Detailed Travel Guide for Hue Ancient Capital"}
            </h1>
            <p
              style={{
                fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
                lineHeight: 1.65,
                color: "#4b5563",
                maxWidth: "880px",
                margin: "0 auto 1.5rem",
              }}
            >
              {isVi
                ? "Cùng với Đà Nẵng và Hội An, Huế là một trong ba điểm đến hấp dẫn và giàu bản sắc nhất dải đất miền Trung Việt Nam. Nơi lưu giữ trọn vẹn Quần thể Di tích Cố đô, 7 lăng tẩm hoàng gia uy nghiêm, dòng sông Hương thơ mộng và nền ẩm thực cung đình nức tiếng."
                : "Along with Da Nang and Hoi An, Hue is one of the three most attractive destinations in central Vietnam. This is an all-in-one guide covering the Imperial Citadel, royal tombs, Thien Mu Pagoda, Perfume River, and royal culinary heritage."}
            </p>

            {/* Meta bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                fontSize: "0.85rem",
                color: "#6b7280",
                padding: "0.85rem 0",
                borderTop: "1px solid #e5e7eb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={15} color="#7e22ce" />
                <span>{isVi ? "Cập nhật: 15/10/2026" : "Updated: Oct 15, 2026"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={15} color="#7e22ce" />
                <span>{isVi ? "Thời gian đọc: 15 phút" : "Reading time: 15 mins"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Award size={15} color="#b45309" />
                <span>{isVi ? "Chuyên trang: VinaTap Travel" : "By VinaTap Travel Editorial"}</span>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                <button
                  onClick={handleBookmark}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    background: isBookmarked ? "#faf5ff" : "#ffffff",
                    color: isBookmarked ? "#7e22ce" : "#374151",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title={isVi ? "Lưu bài viết" : "Bookmark this guide"}
                >
                  <Bookmark size={14} fill={isBookmarked ? "#7e22ce" : "none"} />
                  <span>{isBookmarked ? (isVi ? "Đã lưu" : "Saved") : isVi ? "Lưu" : "Save"}</span>
                </button>

                <button
                  onClick={handleShare}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title={isVi ? "Chia sẻ cẩm nang" : "Share guide"}
                >
                  <Share2 size={14} />
                  <span>{isVi ? "Chia sẻ" : "Share"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hero Cover Image (Ảnh to đầu tiên từ trang gốc) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 12px 35px rgba(0, 0, 0, 0.1)",
              marginBottom: "1rem",
              aspectRatio: "16 / 10",
              backgroundColor: "#f3f4f6",
            }}
          >
            <img
              src="/guide/hue/hue-hero-official.jpg"
              alt="Hue Vietnam Travel Guide Official by Vietnamnomad"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1rem 1.5rem",
                background: "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.75) 100%)",
                color: "#ffffff",
                fontSize: "0.88rem",
              }}
            >
              {isVi
                ? "Quần thể Di tích Cố đô Huế – Kỳ quan kiến trúc hoàng gia triều Nguyễn được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993."
                : "The Complex of Hue Monuments – Masterpiece of Nguyen Dynasty royal architecture recognized as a UNESCO World Heritage site in 1993."}
            </div>
          </div>

          {/* Quick Snapshot Box */}
          <div className="hue-snapshot-box">
            <div className="hue-snapshot-title">
              <Sparkles size={20} />
              <span>{isVi ? "Thông Tin Cần Biết Về Du Lịch Huế" : "Hue Travel at a Glance"}</span>
            </div>
            <div className="hue-snapshot-grid">
              <div className="hue-snapshot-item">
                <MapPin className="hue-snapshot-icon" size={18} />
                <div>
                  <strong>{isVi ? "Vị trí địa lý:" : "Location:"}</strong>{" "}
                  {isVi
                    ? "Duyên hải Bắc Trung Bộ, cách Đà Nẵng 100km qua Đèo Hải Vân"
                    : "Central Vietnam, 100km north of Da Nang via Hai Van Pass"}
                </div>
              </div>
              <div className="hue-snapshot-item">
                <Crown className="hue-snapshot-icon" size={18} />
                <div>
                  <strong>{isVi ? "Di sản thế giới:" : "Heritage status:"}</strong>{" "}
                  {isVi
                    ? "Di tích Cố đô Huế (1993) & Nhã nhạc Cung đình (2003)"
                    : "Complex of Hue Monuments (1993) & Royal Court Music (2003)"}
                </div>
              </div>
              <div className="hue-snapshot-item">
                <Sun className="hue-snapshot-icon" size={18} />
                <div>
                  <strong>{isVi ? "Mùa đẹp nhất:" : "Best time to visit:"}</strong>{" "}
                  {isVi
                    ? "Tháng 1 - Tháng 4 (dịu mát, hoa nở) & Tháng 5 - Tháng 6 (Lễ hội Festival)"
                    : "January to April (pleasant, mild) & May to June (Hue Festival)"}
                </div>
              </div>
              <div className="hue-snapshot-item">
                <Plane className="hue-snapshot-icon" size={18} />
                <div>
                  <strong>{isVi ? "Phương tiện chính:" : "Getting there:"}</strong>{" "}
                  {isVi
                    ? "Sân bay Phú Bài (HUI), Tàu hỏa Bắc - Nam, Tuyến đường sắt du lịch Huế - Đà Nẵng"
                    : "Phu Bai Airport (HUI), North-South Railway, Hue-Da Nang Heritage Train"}
                </div>
              </div>
              <div className="hue-snapshot-item">
                <Utensils className="hue-snapshot-icon" size={18} />
                <div>
                  <strong>{isVi ? "Đặc sản trứ danh:" : "Signature food:"}</strong>{" "}
                  {isVi
                    ? "Bún bò Huế, Cơm hến Cồn Hến, Bánh bèo - nậm - lọc, Chè bột lọc heo quay"
                    : "Bun Bo Hue, Com Hen, Banh Beo - Nam - Loc, Che Bot Loc Heo Quay"}
                </div>
              </div>
              <div className="hue-snapshot-item">
                <Bed className="hue-snapshot-icon" size={18} />
                <div>
                  <strong>{isVi ? "Khu vực lưu trú:" : "Where to stay:"}</strong>{" "}
                  {isVi
                    ? "Đường Lê Lợi ven sông Hương, Phố Tây Chu Văn An, Resort biển Lăng Cô"
                    : "Le Loi riverside street, Chu Van An walking area, Lang Co beach resorts"}
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents Box */}
          <div className="hue-toc-box">
            <div className="hue-toc-title">
              <Compass size={18} />
              <span>{isVi ? "Mục Lục Cẩm Nang Du Lịch Huế" : "Table of Contents"}</span>
            </div>
            <ul className="hue-toc-list">
              <li>
                <a href="#tong-quan" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>1. {isVi ? "Tổng quan về Cố đô Huế" : "Hue at a glance"}</span>
                </a>
              </li>
              <li>
                <a href="#ban-do" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>2. {isVi ? "Bản đồ du lịch thành phố Huế" : "Hue tourist map"}</span>
                </a>
              </li>
              <li>
                <a href="#thoi-tiet" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>3. {isVi ? "Thời tiết & Mùa lý tưởng" : "Hue weather & Best seasons"}</span>
                </a>
              </li>
              <li>
                <a href="#di-chuyen" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>4. {isVi ? "Cách di chuyển đến & Đi lại tại Huế" : "How to get to Hue & around"}</span>
                </a>
              </li>
              <li>
                <a href="#luu-tru" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>5. {isVi ? "Khách sạn & Nơi lưu trú tốt nhất" : "Where to stay in Hue"}</span>
                </a>
              </li>
              <li>
                <a href="#dai-noi" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>6. {isVi ? "Đại Nội Huế & Các di tích Hoàng Thành" : "The Imperial Citadel of Hue"}</span>
                </a>
              </li>
              <li>
                <a href="#danh-thang" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>7. {isVi ? "Các danh thắng hàng đầu (Lăng tẩm, Chùa Thiên Mụ)" : "Top Attractions & Royal Tombs"}</span>
                </a>
              </li>
              <li>
                <a href="#am-thuc" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>8. {isVi ? "Món ngon phải thử (Bún bò, Cơm hến, Bánh Huế)" : "Must-try dishes in Hue"}</span>
                </a>
              </li>
              <li>
                <a href="#le-hoi" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>9. {isVi ? "Lễ hội & Trải nghiệm văn hóa Cố đô" : "Festivals & Cultural experiences"}</span>
                </a>
              </li>
              <li>
                <a href="#lich-trinh" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>10. {isVi ? "Gợi ý lịch trình du lịch Huế (2N1Đ - 3N2Đ)" : "Suggested Hue itineraries"}</span>
                </a>
              </li>
              <li>
                <a href="#hoi-dap" className="hue-toc-link">
                  <ChevronRight size={14} color="#7e22ce" />
                  <span>11. {isVi ? "Câu hỏi thường gặp (FAQs)" : "Frequently asked questions"}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ──────────────── SECTION 1: HUE AT A GLANCE ──────────────── */}
          <section id="tong-quan" className="hue-section">
            <h2 className="hue-section-title">
              <Landmark size={24} color="#7e22ce" />
              <span>{isVi ? "1. Tổng Quan Về Cố Đô Huế" : "1. Hue at a Glance"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Tọa lạc tại dải đất miền Trung đầy nắng gió, Cố đô Huế từng là kinh đô của triều đại phong kiến cuối cùng tại Việt Nam – triều Nguyễn (1802 – 1945). Trải qua hơn 143 năm dưới sự trị vì của 13 vị hoàng đế, Huế không chỉ là trung tâm quyền lực chính trị mà còn là cái nôi kết tinh tinh hoa văn hóa, kiến trúc cung đình, triết lý phương Đông và nghệ thuật ẩm thực đỉnh cao của dân tộc."
                  : "Located centrally along the narrow strip of Central Vietnam, Hue was the imperial capital of the Nguyen Dynasty – Vietnam's last royal feudal regime (1802 – 1945). Through 143 years and 13 successive emperors, Hue served not only as the political heart of the nation but also as the cradle of refined court culture, philosophical aesthetics, grand palace architecture, and sophisticated royal gastronomy."}
              </p>
              <p>
                {isVi
                  ? "Năm 1993, Quần thể Di tích Cố đô Huế chính thức được UNESCO vinh danh là Di sản Văn hóa Thế giới đầu tiên của Việt Nam. Tiếp đó vào năm 2003, Nhã nhạc Cung đình Huế tiếp tục được công nhận là Kiệt tác Di sản Phi vật thể và Truyền khẩu của Nhân loại. Với dòng sông Hương êm đềm uốn lượn ôm trọn Hoàng thành, cùng nhịp sống chậm rãi, trầm mặc và thi vị, Huế mang một sức hút ma mị rất riêng mà không nơi nào có được."
                  : "In 1993, the Complex of Hue Monuments became Vietnam's very first UNESCO World Heritage Site. A decade later in 2003, Nha Nhac (Vietnamese Court Music) was inscribed as an Intangible Cultural Heritage of Humanity. Flowing gently through the heart of the city, the poetic Perfume River wraps around the ancient citadel, creating a timeless romantic charm that captivates every visitor."}
              </p>

              <div className="hue-quote-box">
                {isVi
                  ? "«Huế không vội vã. Huế là sự giao hòa giữa vẻ tôn nghiêm của lầu son gác tía với nét bình dị của tà áo dài tím thướt tha, của tiếng chuông chùa Thiên Mụ ngân nga bên dòng sông Hương lúc chiều tà.»"
                  : "\"Hue never rushes. Hue is the serene harmony between royal majesty and gentle everyday life – a quiet rhythm where purple Ao Dai dresses flutter, and the distant bells of Thien Mu Pagoda echo over the calm Perfume River at dusk.\""}
              </div>
            </div>
          </section>

          {/* ──────────────── SECTION 2: HUE TOURIST MAP ──────────────── */}
          <section id="ban-do" className="hue-section">
            <h2 className="hue-section-title">
              <Compass size={24} color="#7e22ce" />
              <span>{isVi ? "2. Bản Đồ Du Lịch Thành Phố Huế" : "2. Hue Tourist Map"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Địa hình du lịch Huế được phân chia rất rõ ràng theo dòng sông Hương. Phía bắc sông Hương là khu vực Thành nội lịch sử với Hoàng Thành (Đại Nội), Kỳ Đài và chợ Đông Ba. Phía nam bờ sông Hương là khu phố mới hiện đại, tập trung các khách sạn, phố đi bộ Tây, ga xe lửa và các con đường rợp bóng cây xanh như Lê Lợi. Đi xa hơn về phía nam khoảng 7 – 15km là cụm các lăng tẩm hoàng gia hòa mình giữa thiên nhiên đồi thông."
                  : "Hue's tourist geography is naturally defined by the tranquil Perfume River. North of the river lies the historic Citadel quarter containing the Imperial Palace, Flag Tower, and Dong Ba Market. South of the river is the vibrant modern quarter home to boutique hotels, riverside parks along Le Loi Street, and bustling walking streets. Further south in the pine-covered hills lie the grandiose royal tombs."}
              </p>

              <div className="hue-map-container">
                <img
                  src="/guide/hue/hue-tourist-map.jpg"
                  alt="Hue City Tourist Map Vietnamnomad"
                  className="hue-map-img"
                />
                <div className="hue-map-caption">
                  {isVi
                    ? "Bản đồ phân bổ các điểm tham quan trọng điểm tại thành phố Huế: Đại Nội, chùa Thiên Mụ, sông Hương và cụm lăng tẩm hoàng gia."
                    : "Tourist layout map of key attractions in Hue: The Imperial Citadel, Thien Mu Pagoda, Perfume River, and royal mausoleums."}
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────── SECTION 3: HUE WEATHER ──────────────── */}
          <section id="thoi-tiet" className="hue-section">
            <h2 className="hue-section-title">
              <Sun size={24} color="#7e22ce" />
              <span>{isVi ? "3. Thời Tiết & Thời Điểm Du Lịch Huế Lý Tưởng" : "3. Hue Weather & Best Time to Visit"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Khác với miền Bắc có 4 mùa rõ rệt hay miền Nam chỉ có hai mùa mưa nắng, Huế có khí hậu chuyển tiếp đặc trưng với mùa mưa kéo dài và mùa khô rực nắng. Nắm rõ thời tiết sẽ giúp bạn có chuyến du ngoạn Cố đô trọn vẹn nhất."
                  : "Positioned in Central Vietnam's transitional climate zone, Hue experiences two distinct weather patterns: a dry sunny season and a cool wet season. Understanding Hue's seasonal rhythm ensures the most comfortable sightseeing experience."}
              </p>

              <div className="hue-weather-grid">
                <div className="hue-weather-card recommended">
                  <div className="hue-weather-head">
                    <Sparkles size={20} color="#7e22ce" />
                    <span className="hue-weather-title">
                      {isVi ? "Tháng 1 – Tháng 4: Thời Điểm Vàng (Lý Tưởng)" : "January to April: The Golden Season"}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#4b5563" }}>
                    {isVi
                      ? "Nhiệt độ dao động từ 20°C – 25°C, không khí mát mẻ, khô ráo, nắng xuân chan hòa. Đây là khoảng thời gian lý tưởng nhất để tản bộ quanh Đại Nội, đạp xe qua các lăng tẩm và chụp ảnh cổ phục trong Hoàng thành."
                      : "Temperatures range from 20°C to 25°C with pleasant sunshine and clear skies. Perfect conditions for exploring the massive Citadel on foot, cycling to peaceful royal tombs, and photography in traditional Ao Dai."}
                  </p>
                </div>

                <div className="hue-weather-card">
                  <div className="hue-weather-head">
                    <Sun size={20} color="#b45309" />
                    <span className="hue-weather-title">
                      {isVi ? "Tháng 5 – Tháng 8: Mùa Hè Rực Rỡ & Lễ Hội" : "May to August: Summer Sun & Beaches"}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#4b5563" }}>
                    {isVi
                      ? "Thời tiết nắng nóng, nhiệt độ từ 33°C – 38°C. Rất thích hợp để kết hợp tham quan di tích vào sáng sớm và thư giãn tại vịnh Lăng Cô, biển Thuận An hoặc ngắm hoàng hôn phá Tam Giang vào buổi chiều."
                      : "Hot and dry with highs between 33°C and 38°C. Ideal for visiting monuments in the early morning followed by afternoon dips at Lang Co Beach, Thuan An, or sunset boat trips on Tam Giang Lagoon."}
                  </p>
                </div>

                <div className="hue-weather-card">
                  <div className="hue-weather-head">
                    <Waves size={20} color="#0284c7" />
                    <span className="hue-weather-title">
                      {isVi ? "Tháng 9 – Tháng 12: Mùa Mưa Xứ Huế" : "September to December: Romantic Rains"}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#4b5563" }}>
                    {isVi
                      ? "Mưa dầm xứ Huế nức tiếng thi ca. Thành phố khoác lên mình vẻ trầm mặc, hoài niệm sâu lắng. Nếu ghé Huế mùa này, hãy chuẩn bị ô dù và tận hưởng cảm giác nhâm nhi tách trà cung đình ấm áp bên sông Hương."
                      : "Hue's legendary persistent drizzle covers the city in nostalgic romanticism. Cooler temperatures (18°C – 22°C). Carry rain gear and enjoy hot bowls of Bun Bo Hue or herbal royal tea by the misty river."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────── SECTION 4: HOW TO GET TO HUE ──────────────── */}
          <section id="di-chuyen" className="hue-section">
            <h2 className="hue-section-title">
              <Bus size={24} color="#7e22ce" />
              <span>{isVi ? "4. Cách Di Chuyển Đến Huế & Đi Lại Trong Thành Phố" : "4. How to Get to Hue & Around"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Huế là đầu mối giao thông trọng yếu của miền Trung với hệ thống hàng không, đường sắt và đường bộ cực kỳ thuận tiện:"
                  : "Hue is easily accessible from all major hubs in Vietnam by air, scenic railway, or comfortable road transit:"}
              </p>

              <div className="hue-trans-grid">
                <div className="hue-trans-card">
                  <div className="hue-trans-header">
                    <Plane size={20} />
                    <span>{isVi ? "Đường Hàng Không (Máy Bay)" : "By Flight (Phu Bai Airport)"}</span>
                  </div>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#4b5563" }}>
                    {isVi
                      ? "Sân bay Quốc tế Phú Bài (HUI) vừa khánh thành nhà ga T2 hiện đại, cách trung tâm Huế 15km. Các chuyến bay thẳng từ Hà Nội và TP.HCM chỉ mất khoảng 1 giờ 15 phút. Taxi từ sân bay về trung tâm có giá khoảng 180.000 – 220.000 VNĐ."
                      : "Phu Bai International Airport (HUI), equipped with its modern Terminal 2, lies just 15km south of the city center. Daily nonstop flights connect from Hanoi (70 mins) and Ho Chi Minh City (75 mins). Taxi to downtown costs roughly $8-$10 USD."}
                  </p>
                </div>

                <div className="hue-trans-card">
                  <div className="hue-trans-header">
                    <Train size={20} />
                    <span>{isVi ? "Tàu Hỏa Ngắm Đèo Hải Vân" : "By Heritage Train (Hai Van Pass)"}</span>
                  </div>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#4b5563" }}>
                    {isVi
                      ? "Tuyến tàu hỏa du lịch 'Kết nối di sản miền Trung' giữa Đà Nẵng và Huế (khoảng 3 giờ) đưa du khách chiêm ngưỡng một trong những cung đường ven biển đẹp nhất thế giới qua Đèo Hải Vân, với khoang ngắm cảnh và phục vụ ẩm thực Huế."
                      : "The daily heritage train route between Da Nang and Hue (approx. 3 hours) winds through the breathtaking cliffs of Hai Van Pass with panoramic ocean views, air-conditioned carriages, and onboard folk music."}
                  </p>
                </div>

                <div className="hue-trans-card">
                  <div className="hue-trans-header">
                    <Bus size={20} />
                    <span>{isVi ? "Phương Tiện Đi Lại Tại Huế" : "Getting Around Hue City"}</span>
                  </div>
                  <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#4b5563" }}>
                    {isVi
                      ? "Tại Huế, bạn có thể thuê xe máy (120k – 150k/ngày) để tự do đi các lăng tẩm; trải nghiệm ngồi xích lô dạo mát quanh Hoàng thành; hoặc đi thuyền rồng ngắm hoàng hôn trên sông Hương và nghe ca Huế."
                      : "Renting a motorbike ($5-$7/day) offers ultimate flexibility for visiting distant tombs. For Citadel exploration, traditional cyclos provide a leisurely pace. Don't miss dragon boat rides along the Perfume River."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────── SECTION 5: WHERE TO STAY ──────────────── */}
          <section id="luu-tru" className="hue-section">
            <h2 className="hue-section-title">
              <Bed size={24} color="#7e22ce" />
              <span>{isVi ? "5. Nơi Lưu Trú & Khách Sạn Tốt Nhất Tại Huế" : "5. Where to Stay in Hue"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Tùy thuộc vào ngân sách và phong cách chuyến đi, Huế mang đến nhiều lựa chọn lưu trú đa dạng từ khách sạn di sản ven sông Hương đến homestay boutique ấm cúng:"
                  : "Hue offers charming accommodations across every budget level, from historic riverfront French colonial hotels to trendy boutique homestays:"}
              </p>

              <div className="hue-cards-grid">
                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-beer-street.jpg"
                      alt="Phố Tây Chu Văn An Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "SÔI ĐỘNG" : "LIVELY"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "Khu Phố Tây Chu Văn An – Võ Thị Sáu" : "Chu Van An Walking District"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Khu phố đi bộ đêm nhộn nhịp nhất Huế với hàng trăm quán bar, cà phê, nhà hàng và khách sạn tầm trung 2 – 4 sao. Rất thuận tiện để giao lưu, ăn uống đêm và tiếp cận các tour du lịch."
                        : "Hue's lively nightlife hub filled with craft beer bars, fusion bistros, and budget-friendly boutique hotels ($20 - $50/night). Highly walkable and packed with dining choices."}
                    </p>
                    <div className="hue-card-meta">
                      <span className="hue-card-tag">{isVi ? "Hợp với: Giới trẻ, du lịch tự túc" : "Best for: Solo & young travelers"}</span>
                    </div>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-trang-tien-bridge.jpg"
                      alt="Khách sạn ven sông Hương đường Lê Lợi"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "SANG TRỌNG" : "LUXURY"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "Dọc Tuyến Đường Lê Lợi Ven Sông Hương" : "Le Loi Riverside Boulevard"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Đại lộ xanh mát tập trung các khách sạn và resort cao cấp mang phong cách kiến trúc Pháp cổ như Azerai La Residence, Silk Path Grand Hue, Saigon Morin và Century Riverside với view ôm trọn sông Hương thơ mộng."
                        : "Graceful tree-lined avenue fronting the Perfume River, boasting luxury properties like Azerai La Residence (Art Deco mansion), Silk Path, and historic Saigon Morin ($70 - $250+/night)."}
                    </p>
                    <div className="hue-card-meta">
                      <span className="hue-card-tag">{isVi ? "Hợp với: Cặp đôi, gia đình, nghỉ dưỡng" : "Best for: Couples & luxury escapes"}</span>
                    </div>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-lang-co-beach.jpg"
                      alt="Resort nghỉ dưỡng biển Lăng Cô"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "BIỂN ĐẢO" : "COASTAL"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "Khu Vực Vịnh Biển Lăng Cô & Bạch Mã" : "Lang Co Beach & Laguna Lăng Cô"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Cách trung tâm Huế 60km về phía nam, vịnh Lăng Cô là thiên đường nghỉ dưỡng biệt lập với các khu resort 5 sao quốc tế như Banyan Tree Lăng Cô và Angsana Lăng Cô cạnh bãi cát trắng trải dài."
                        : "Located 60km south of Hue at the foot of Hai Van Pass, Lang Co is an idyllic seaside escape featuring world-class luxury golf resorts like Banyan Tree & Angsana Laguna."}
                    </p>
                    <div className="hue-card-meta">
                      <span className="hue-card-tag">{isVi ? "Hợp với: Nghỉ dưỡng đẳng cấp" : "Best for: Beach retreats"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────── SECTION 6: THE IMPERIAL CITADEL ──────────────── */}
          <section id="dai-noi" className="hue-section">
            <h2 className="hue-section-title">
              <Crown size={24} color="#7e22ce" />
              <span>{isVi ? "6. Đại Nội Huế – Trái Tim Hoàng Thành Triều Nguyễn" : "6. The Imperial Citadel of Hue"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Đại Nội Huế là cụm di tích đồ sộ và quan trọng nhất trong Quần thể Di tích Cố đô. Được khởi công xây dựng từ năm 1804 dưới triều vua Gia Long và hoàn thành vào thời vua Minh Mạng năm 1833, Đại Nội bao gồm Hoàng Thành (nơi vua thiết triều) và Tử Cấm Thành (nơi sinh hoạt riêng tư của hoàng gia). Quần thể được bao bọc bởi hào nước sâu và bờ thành kiên cố chu vi gần 10km."
                  : "The Imperial Citadel (Dai Noi) is the supreme centerpiece of Hue's heritage complex. Constructed in 1804 by Emperor Gia Long and expanded by Emperor Minh Mang in 1833, the Citadel encloses the Imperial City and the Forbidden Purple City, fortified by massive stone ramparts and protective moats stretching nearly 10 kilometers."}
              </p>

              {/* Feature Banner: Ngọ Môn Gate & Kỳ Đài */}
              <div className="hue-feature-banner">
                <div className="hue-feature-img-wrap">
                  <img
                    src="/guide/hue/hue-ngo-mon-gate.jpg"
                    alt="Cổng Ngọ Môn Đại Nội Huế"
                    className="hue-feature-img"
                  />
                </div>
                <div className="hue-feature-content">
                  <span className="hue-feature-tag">{isVi ? "CỔNG CHÍNH HOÀNG GIA" : "ROYAL ENTRANCE"}</span>
                  <h3 className="hue-feature-heading">{isVi ? "Cổng Ngọ Môn & Lầu Ngũ Phụng" : "Ngo Mon Gate & Five Phoenix Pavilion"}</h3>
                  <p className="hue-feature-text">
                    {isVi
                      ? "Cổng Ngọ Môn là lối vào chính diện hướng về phía nam của Hoàng thành. Bên trên là Lầu Ngũ Phụng tráng lệ được lợp ngói hoàng lưu ly vàng óng và thanh lưu ly xanh biếc, nơi từng diễn ra lễ thoái vị lịch sử của vua Bảo Đại năm 1945."
                      : "Built in 1833, Ngo Mon is the grand southern portal reserved exclusively for the Emperor. Crowning the stone base is the Five Phoenix Pavilion (Lau Ngu Phung), adorned with yellow glazed imperial tiles, where King Bao Dai officially abdicated in August 1945."}
                  </p>
                  <ul className="hue-feature-points">
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Cửa giữa (Ngọ Môn) ngày xưa chỉ dành riêng cho Hoàng đế" : "Central passageway historically restricted to the Emperor"}</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Tầng trên lầu Ngũ Phụng có tầm nhìn ngắm toàn cảnh Kỳ Đài" : "Upper pavilion offers prime panorama of the Flag Tower"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Grid 4 di tích thành phần */}
              <div className="hue-cards-grid">
                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-flag-tower.jpg"
                      alt="Kỳ Đài Huế Cột Cờ Thành Nội"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "BIỂU TƯỢNG" : "ICONIC"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "1. Kỳ Đài Huế (Cột Cờ)" : "1. The Flag Tower (Ky Dai)"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Được xây dựng năm 1807 trên mặt tiền thành lũy phía nam, Kỳ Đài gồm đài cờ 3 tầng bằng gạch cao 17,5m và cột cờ cao 37m. Đây là biểu tượng lịch sử kiêu hãnh của xứ Huế."
                        : "Constructed in 1807, the Flag Tower consists of a three-tiered masonry base 17.5m tall topped by a 37m mast, standing prominently as Hue's historic civic focal point."}
                    </p>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-thai-hoa-palace.jpg"
                      alt="Điện Thái Hòa Hoàng Thành Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "TRUNG TÂM" : "THRONE ROOM"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "2. Điện Thái Hòa" : "2. Thai Hoa Palace"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Công trình quyền lực tối cao nơi đặt ngai vàng của vua triều Nguyễn, nơi tổ chức các lễ đăng quang, sinh nhật vua và các buổi thiết đại triều trang nghiêm mỗi tháng hai lần."
                        : "The supreme hall of state housing the golden imperial throne, where enthronement rites, royal birthdays, and major bi-monthly imperial audiences were conducted."}
                    </p>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-the-mieu.jpg"
                      alt="Thế Tổ Miếu và Cửu Đỉnh Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "BẢO VẬT" : "NATIONAL TREASURE"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "3. Thế Tổ Miếu & Cửu Đỉnh" : "3. The Mieu & Nine Dynastic Urns"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Nơi thờ cúng các vị vua triều Nguyễn. Phía trước sân là Cửu Đỉnh – chín đỉnh đồng khổng lồ đúc năm 1835 khắc họa hình ảnh non sông gấm vóc và sự trường tồn của Đại Nam."
                        : "The ancestral temple honoring Nguyen Dynasty monarchs. In the front courtyard stand the Nine Dynastic Urns cast in bronze in 1835, engraved with Vietnamese landscapes and rivers."}
                    </p>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-hung-mieu.jpg"
                      alt="Hưng Miếu Hoàng Thành Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "KIẾN TRÚC GỖ" : "TIMBER MASTERPIECE"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "4. Hưng Miếu & Các Di Tích Khác" : "4. Hung Mieu & Inner Sanctuaries"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Nơi thờ thân phụ thân mẫu vua Gia Long với kết cấu gỗ lim sơn son thếp vàng tinh mỹ. Cùng các cung điện mới phục dựng rực rỡ như Điện Kiến Trung, Cung Diên Thọ và Duyệt Thị Đường."
                        : "Dedicated to the parents of Emperor Gia Long, displaying masterfully carved gilded woodwork alongside freshly restored landmarks like Kien Trung Palace and Dien Tho Residence."}
                    </p>
                  </div>
                </div>
              </div>
              <AffiliateDealBox deal={NORTH_HUE_AFFILIATE_DEALS.hueImperialAndDragonBoat} isVi={isVi} />
            </div>
          </section>

          {/* ──────────────── SECTION 7: TOP ATTRACTIONS ──────────────── */}
          <section id="danh-thang" className="hue-section">
            <h2 className="hue-section-title">
              <Sparkles size={24} color="#7e22ce" />
              <span>{isVi ? "7. Danh Thắng Hàng Đầu Xứ Huế (Chùa, Lăng Tẩm & Sông Hương)" : "7. Top Attractions, Royal Tombs & Perfume River"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Bên cạnh Đại Nội, linh hồn của du lịch Huế còn nằm ở những ngôi cổ tự thanh tịnh, các lăng tẩm hoàng gia hòa quyện tuyệt vời với thiên nhiên phong thủy và dòng sông Hương êm đềm:"
                  : "Beyond the Citadel walls, the soul of Hue reveals itself in tranquil Buddhist sanctuaries, romantic royal mausoleums set into forested valleys, and the gentle waters of the Perfume River:"}
              </p>

              {/* Feature: Chùa Thiên Mụ */}
              <div className="hue-feature-banner">
                <div className="hue-feature-img-wrap">
                  <img
                    src="/guide/hue/hue-thien-mu-pagoda.jpg"
                    alt="Chùa Thiên Mụ Huế Tháp Phước Duyên"
                    className="hue-feature-img"
                  />
                </div>
                <div className="hue-feature-content">
                  <span className="hue-feature-tag">{isVi ? "ĐỆ NHẤT QUỐC TỰ" : "HISTORIC SANCTUARY"}</span>
                  <h3 className="hue-feature-heading">{isVi ? "Chùa Thiên Mụ (Linh Mụ) & Tháp Phước Duyên" : "Thien Mu Pagoda & Phuoc Duyen Tower"}</h3>
                  <p className="hue-feature-text">
                    {isVi
                      ? "Ngôi chùa cổ kính nhất xứ Huế được chúa Nguyễn Hoàng khởi lập năm 1601 trên đồi Hà Khê hướng mặt ra dòng sông Hương. Biểu tượng của chùa là tháp Phước Duyên hình bát giác cao 21m gồm 7 tầng, mỗi tầng thờ một đức Phật."
                      : "Founded in 1601 by Lord Nguyen Hoang, Thien Mu sits gracefully on Ha Khe hill overlooking the river. Its octagonal seven-tiered Phuoc Duyen Tower (21m) is Hue's defining religious symbol."}
                  </p>
                  <ul className="hue-feature-points">
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Đến chùa bằng thuyền rồng từ bến Tòa Khâm để ngắm cảnh sông nước" : "Arrive by dragon boat along the Perfume River for idyllic views"}</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Tham quan chiếc xe hơi Austin lịch sử của Bồ Tát Thích Quảng Đức" : "Houses the vintage Austin car connected to Venerable Thich Quang Duc"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature: Lăng Khải Định */}
              <div className="hue-feature-banner" style={{ marginTop: "2rem" }}>
                <div className="hue-feature-img-wrap">
                  <img
                    src="/guide/hue/hue-khai-dinh-tomb.jpg"
                    alt="Lăng Khải Định Ứng Lăng Huế"
                    className="hue-feature-img"
                  />
                </div>
                <div className="hue-feature-content">
                  <span className="hue-feature-tag">{isVi ? "KIẾT TÁC KHẢM SÀNH SỨ" : "MOSAIC MASTERPIECE"}</span>
                  <h3 className="hue-feature-heading">{isVi ? "Lăng Khải Định (Ứng Lăng)" : "Khai Dinh Tomb (Ung Lang)"}</h3>
                  <p className="hue-feature-text">
                    {isVi
                      ? "Công trình lăng tẩm lộng lẫy và độc đáo nhất, kết hợp tinh tế giữa nghệ thuật kiến trúc cổ điển phương Đông và phong cách Gothic phương Tây. Cung Thiên Định bên trong là kiệt tác khảm ghép sành sứ, thủy tinh và bức bích họa 'Cửu Long Ẩn Vân' trên trần nhà."
                      : "The most opulent royal tomb, blending European Gothic, Baroque, and traditional Vietnamese motifs on Chau Chu mountain. The interior of Thien Dinh Palace is breathtaking with intricate mosaics of porcelain and glass."}
                  </p>
                  <ul className="hue-feature-points">
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Pho tượng đồng mạ vàng vua Khải Định đúc tại Pháp năm 1920" : "Gilded bronze effigy of Emperor Khai Dinh cast in Paris in 1920"}</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Hàng tượng quan văn võ, voi ngựa uy nghiêm trên sân Bái Đính" : "Imposing courtyard populated by stone courtiers, elephants, and steeds"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Danh sách các danh thắng tiếp theo */}
              <div className="hue-cards-grid" style={{ marginTop: "2rem" }}>
                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-trang-tien-bridge.jpg"
                      alt="Cầu Tràng Tiền bắc qua Sông Hương Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "BIỂU TƯỢNG CỐ ĐÔ" : "RIVER ICON"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "Cầu Tràng Tiền & Sông Hương" : "Trang Tien Bridge & Perfume River"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Cây cầu thép lịch sử do công ty Gustave Eiffel thiết kế bắc qua sông Hương. Về đêm, cầu đổi màu lung linh hòa cùng tiếng đàn ca Huế trôi bềnh bồng trên mặt nước."
                        : "Designed by Gustave Eiffel's workshop in the late 19th century, this six-span steel bridge links the Citadel with the modern quarter. Illuminates with colorful LEDs at night."}
                    </p>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-dong-ba-market.jpg"
                      alt="Chợ Đông Ba trăm tuổi Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "ẨM THỰC BÌNH DÂN" : "MARKET LIFE"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "Chợ Đông Ba Lịch Sử" : "Dong Ba Historic Market"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Khu chợ truyền thống sầm uất hơn 120 năm tuổi, nơi du khách thỏa sức khám phá các món bánh Huế, bún bò, kẹo mè xửng, mắm tôm chua và nón lá bài thơ duyên dáng."
                        : "The oldest and most vibrant trading bazaar in Hue, operating since 1899. A feast for the senses offering regional street food, conical hats, and royal herbal sweets."}
                    </p>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-tam-giang-lagoon.jpg"
                      alt="Phá Tam Giang Đầm Phá Nước Lợ Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "HOÀNG HÔN TUYỆT SẮC" : "LAGOON SUNSET"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "Phá Tam Giang & Đầm Lập An" : "Tam Giang Lagoon & Lap An"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Hệ đầm phá nước lợ lớn nhất Đông Nam Á trải dài hơn 22.000 hecta. Nơi lý tưởng để ngồi thuyền chèo, ngắm cảnh ngư dân quăng chài lúc hoàng hôn và thưởng thức cá tôm đầm phá."
                        : "The largest brackish water lagoon system in Southeast Asia, spanning over 22,000 hectares. Renowned for spectacular flaming sunsets and fresh lagoon seafood feasts."}
                    </p>
                  </div>
                </div>

                <div className="hue-card">
                  <div className="hue-card-thumb-wrap">
                    <img
                      src="/guide/hue/hue-ho-thuy-tien.jpg"
                      alt="Công viên bỏ hoang Hồ Thủy Tiên Huế"
                      className="hue-card-thumb"
                    />
                    <span className="hue-card-badge">{isVi ? "CHECK-IN ĐỘC ĐÁO" : "MYSTERIOUS"}</span>
                  </div>
                  <div className="hue-card-body">
                    <h3 className="hue-card-title">{isVi ? "Công Viên Bỏ Hoang Hồ Thủy Tiên" : "Ho Thuy Tien Abandoned Water Park"}</h3>
                    <p className="hue-card-desc">
                      {isVi
                        ? "Từng gây sốt trên truyền thông quốc tế với bức tượng rồng khổng lồ rêu phong vươn lên giữa lòng hồ, mang vẻ đẹp ma mị và đầy cuốn hút cho các tín đồ mê nhiếp ảnh."
                        : "Featured in international media as an enigmatic surreal curiosity, known for its crumbling giant concrete dragon coiled across an abandoned lake."}
                    </p>
                  </div>
                </div>
              </div>
              <AffiliateDealBox deal={NORTH_HUE_AFFILIATE_DEALS.hueImperialAndDragonBoat} isVi={isVi} />
            </div>
          </section>

          {/* ──────────────── SECTION 8: MUST-TRY FOOD ──────────────── */}
          <section id="am-thuc" className="hue-section">
            <h2 className="hue-section-title">
              <Utensils size={24} color="#7e22ce" />
              <span>{isVi ? "8. Tinh Hoa Ẩm Thực Xứ Huế (Các Món Ngon Phải Thử)" : "8. Must-Try Dishes in Hue"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Ẩm thực Huế là sự kết hợp kỳ diệu giữa hai thái cực: Ẩm thực Cung đình tinh tế, cầu kỳ từng chi tiết và Ẩm thực Dân dã đậm đà vị cay nồng của sả ớt, vị ngọt thanh của đầm phá và mắm ruốc truyền thống:"
                  : "Hue gastronomy presents a remarkable duality: sophisticated royal court cuisine crafted with exquisite artistic presentation, balanced by fiery street food celebrating bold lemongrass, chili, and fermented shrimp paste:"}
              </p>

              <div className="hue-food-grid">
                <div className="hue-food-card">
                  <div className="hue-food-img-wrap">
                    <img
                      src="/guide/hue/hue-food-bun-bo.jpg"
                      alt="Bún Bò Huế chính gốc"
                      className="hue-food-img"
                    />
                  </div>
                  <div className="hue-food-body">
                    <h3 className="hue-food-name">{isVi ? "1. Bún Bò Huế" : "1. Bun Bo Hue (Spicy Beef Noodles)"}</h3>
                    <p className="hue-food-desc">
                      {isVi
                        ? "Món ăn quốc hồn quốc túy với nước dùng ninh từ xương bò và sả thơm lừng, điểm chút mắm ruốc dậy mùi, ăn kèm bắp bò hoa, tiết luộc, chả cua giòn sần sật và bắp chuối thái mỏng."
                        : "Vietnam's beloved noodle soup, featuring thick rice vermicelli in a rich, spicy broth infused with lemongrass and fermented shrimp paste, topped with beef shank and crab patties."}
                    </p>
                    <div className="hue-food-spot">
                      <MapPin size={14} />
                      <span>{isVi ? "Gợi ý: Bún bò Mụ Rơi, Bún bò Bà Tuyết (Nguyễn Công Trứ)" : "Top spots: Mu Roi, Ba Tuyet, Cam"}</span>
                    </div>
                  </div>
                </div>

                <div className="hue-food-card">
                  <div className="hue-food-img-wrap">
                    <img
                      src="/guide/hue/hue-food-com-hen.jpg"
                      alt="Cơm Hến và Bún Hến Huế"
                      className="hue-food-img"
                    />
                  </div>
                  <div className="hue-food-body">
                    <h3 className="hue-food-name">{isVi ? "2. Cơm Hến & Bún Hến" : "2. Com Hen (Baby Clam Rice)"}</h3>
                    <p className="hue-food-desc">
                      {isVi
                        ? "Món ăn mộc mạc đặc trưng từ Cồn Hến. Cơm nguội trộn cùng thịt hến xào thơm, tóp mỡ chiên giòn, đậu phộng rang, hoa chuối, ớt cay xé lưỡi và chan nước luộc hến thanh ngọt."
                        : "An earthy Hue invention blending cold rice with stir-fried baby river clams, crispy pork crackling, roasted peanuts, herbs, and spicy chili, served with hot clam broth."}
                    </p>
                    <div className="hue-food-spot">
                      <MapPin size={14} />
                      <span>{isVi ? "Gợi ý: Cơm hến Hoa Đông (Cồn Hến), Quán Đập Đá" : "Top spots: Hoa Dong (Hen Islet), Han Mac Tu St."}</span>
                    </div>
                  </div>
                </div>

                <div className="hue-food-card">
                  <div className="hue-food-img-wrap">
                    <img
                      src="/guide/hue/hue-food-banh-hue.jpg"
                      alt="Bánh bèo nậm lọc Huế"
                      className="hue-food-img"
                    />
                  </div>
                  <div className="hue-food-body">
                    <h3 className="hue-food-name">{isVi ? "3. Bánh Bèo, Nậm, Lọc, Ram Ít" : "3. Hue Cakes (Banh Beo, Nam, Loc)"}</h3>
                    <p className="hue-food-desc">
                      {isVi
                        ? "Mâm bánh Huế nức tiếng với bánh bèo mềm mướt rắc tôm chấy, bánh nậm gói lá chuối thơm nức, bánh bột lọc trong veo dai dai nhân tôm thịt và bánh ram ít giòn rụm bên dưới."
                        : "A colorful platter of delicate steamed rice cakes: Banh Beo in tiny ceramic saucers, Banh Nam in banana leaves, and translucent chewy tapioca Banh Loc with shrimp."}
                    </p>
                    <div className="hue-food-spot">
                      <MapPin size={14} />
                      <span>{isVi ? "Gợi ý: Quán Hạnh (Phó Đức Chính), Quán Bà Đỏ" : "Top spots: Hanh Restaurant, Ba Do, Chi Oanh"}</span>
                    </div>
                  </div>
                </div>

                <div className="hue-food-card">
                  <div className="hue-food-img-wrap">
                    <img
                      src="/guide/hue/hue-food-banh-canh.jpg"
                      alt="Bánh Canh Nam Phổ Huế"
                      className="hue-food-img"
                    />
                  </div>
                  <div className="hue-food-body">
                    <h3 className="hue-food-name">{isVi ? "4. Bánh Canh Nam Phổ" : "4. Banh Canh Nam Pho"}</h3>
                    <p className="hue-food-desc">
                      {isVi
                        ? "Món bánh canh gia truyền từ làng Nam Phổ cổ với sợi bột gạo mềm mại, nước dùng sền sệt sánh màu đỏ cam từ gạch cua và tôm biển tươi rói, thơm lừng vị hành ngò."
                        : "A village specialty featuring handmade rice noodles in a rich, thick soup colored with crab roe and shrimp paste, served piping hot with fresh chili fish sauce."}
                    </p>
                    <div className="hue-food-spot">
                      <MapPin size={14} />
                      <span>{isVi ? "Gợi ý: Quán Thúy (Phạm Hồng Thái), Quán O Thu" : "Top spots: Thuy (Pham Hong Thai), O Thu"}</span>
                    </div>
                  </div>
                </div>

                <div className="hue-food-card">
                  <div className="hue-food-img-wrap">
                    <img
                      src="/guide/hue/hue-food-che-hue.jpg"
                      alt="Chè Cung Đình và Chè Hẻm Huế"
                      className="hue-food-img"
                    />
                  </div>
                  <div className="hue-food-body">
                    <h3 className="hue-food-name">{isVi ? "5. Chè Cung Đình & Chè Hẻm" : "5. Che Hue (Sweet Dessert Soups)"}</h3>
                    <p className="hue-food-desc">
                      {isVi
                        ? "Huế có tới hơn 36 món chè khác nhau. Nổi bật nhất là chè hạt sen long nhãn thanh tao và chè bột lọc bọc heo quay – món tráng miệng độc nhất vô nhị kết hợp vị ngọt mặn béo giòn."
                        : "With over 36 distinct recipes, Hue sweet soups range from delicate lotus seed soup to the world-famous Che Bot Loc Heo Quay (crispy roasted pork dumplings in ginger syrup)."}
                    </p>
                    <div className="hue-food-spot">
                      <MapPin size={14} />
                      <span>{isVi ? "Gợi ý: Chè Hẻm Hùng Vương, Chè Mợ Tôn Đích" : "Top spots: Che Hem Hung Vuong, Mo Ton Dich"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────── SECTION 9: FESTIVALS & EXPERIENCES ──────────────── */}
          <section id="le-hoi" className="hue-section">
            <h2 className="hue-section-title">
              <Award size={24} color="#7e22ce" />
              <span>{isVi ? "9. Lễ Hội & Trải Nghiệm Văn Hóa Không Thể Bỏ Lỡ" : "9. Festivals & Cultural Experiences"}</span>
            </h2>
            <div className="hue-prose">
              <p>
                {isVi
                  ? "Đến Huế không chỉ để ngắm nhìn những đền đài rêu phong, mà là để đắm chìm vào không gian văn hóa sống động ngàn năm:"
                  : "Visiting Hue is not just about observing quiet stone monuments, but immersing yourself in living cultural traditions:"}
              </p>

              <div className="hue-feature-banner">
                <div className="hue-feature-img-wrap">
                  <img
                    src="/guide/hue/hue-festival.jpg"
                    alt="Festival Huế Lễ Hội Văn Hóa Quốc Tế"
                    className="hue-feature-img"
                  />
                </div>
                <div className="hue-feature-content">
                  <span className="hue-feature-tag">{isVi ? "SỰ KIỆN QUỐC TẾ" : "SIGNATURE EVENT"}</span>
                  <h3 className="hue-feature-heading">{isVi ? "Festival Huế & Festival Bốn Mùa" : "Hue International Festival"}</h3>
                  <p className="hue-feature-text">
                    {isVi
                      ? "Được tổ chức định kỳ và chuyển đổi thành đề án Festival bốn mùa, Huế trở thành sân khấu nghệ thuật khổng lồ quy tụ hàng chục đoàn nghệ thuật quốc tế biểu diễn âm nhạc, trang phục truyền thống, lễ hội ánh sáng và tái hiện các nghi thức cung đình xưa."
                      : "Transformed into a four-season celebration, the Hue Festival gathers hundreds of international artists and domestic troupes for illuminated palace ceremonies, carnival parades, and classical court dances."}
                  </p>
                  <ul className="hue-feature-points">
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Trải nghiệm nghe Ca Huế trên thuyền rồng và thả hoa đăng trên sông Hương" : "Nightly dragon boat cruise with live Ca Hue folk chamber music"}</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Thuê Cổ phục Việt Nam (Áo Nhật Bình, Áo Tấc) chụp ảnh tại Đại Nội" : "Dress in royal Nguyen Dynasty costume (Nhat Binh / Ao Tac) for photography"}</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span>{isVi ? "Tham quan làng làm hương trầm Thủy Xuân rực rỡ sắc màu" : "Visit Thuy Xuan incense village adorned with colorful fan-shaped bouquets"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────── SECTION 10: ITINERARIES ──────────────── */}
          <section id="lich-trinh" className="hue-section">
            <h2 className="hue-section-title">
              <Calendar size={24} color="#7e22ce" />
              <span>{isVi ? "10. Gợi Ý Lịch Trình Du Lịch Huế Tối Ưu" : "10. Suggested Hue Itineraries"}</span>
            </h2>
            <div className="hue-prose">
              {/* Lịch trình 2N1Đ */}
              <div className="hue-itin-card">
                <span className="hue-itin-badge">{isVi ? "LỊCH TRÌNH 2 NGÀY 1 ĐÊM" : "2 DAYS / 1 NIGHT ITINERARY"}</span>
                <h3 className="hue-itin-title">
                  {isVi ? "Hành Trình Tinh Hoa Cố Đô (Dành Cho Chuyến Đi Ngắn Ngày)" : "Classic Imperial Highlights"}
                </h3>
                <div className="hue-timeline">
                  <div className="hue-timeline-step">
                    <div className="hue-timeline-dot" />
                    <div className="hue-timeline-time">{isVi ? "Ngày 1: Đại Nội – Chùa Thiên Mụ – Ca Huế Sông Hương" : "Day 1: Citadel – Thien Mu – River Cruise"}</div>
                    <div className="hue-timeline-content">
                      {isVi
                        ? "Sáng: Khởi động với tô bún bò Huế, tham quan Cổng Ngọ Môn, Điện Thái Hòa, Cung Kiến Trung tại Đại Nội. Chiều: Đón hoàng hôn tại Chùa Thiên Mụ, ghé chợ Đông Ba. Tối: Thưởng thức cơm hến, dạo cầu Tràng Tiền và nghe ca Huế trên sông Hương."
                        : "Morning: Start with spicy Bun Bo Hue, explore the Imperial Citadel, Ngo Mon, and Kien Trung Palace. Afternoon: Sunset at Thien Mu Pagoda and street food at Dong Ba. Evening: Dragon boat cruise with Ca Hue music."}
                    </div>
                  </div>
                  <div className="hue-timeline-step">
                    <div className="hue-timeline-dot" />
                    <div className="hue-timeline-time">{isVi ? "Ngày 2: Lăng Khải Định – Lăng Tự Đức – Làng Hương Thủy Xuân" : "Day 2: Royal Tombs & Incense Village"}</div>
                    <div className="hue-timeline-content">
                      {isVi
                        ? "Sáng: Chiêm ngưỡng vẻ tráng lệ của Lăng Khải Định và nét thơ mộng của Lăng Tự Đức. Trưa: Thưởng thức bánh bèo, nậm, lọc. Chiều: Check-in làng hương Thủy Xuân, mua mè xửng và trà cung đình làm quà trước khi rời Huế."
                        : "Morning: Marvel at Khai Dinh Tomb's mosaics and Tu Duc Tomb's poetic gardens. Afternoon: Check-in at colorful Thuy Xuan incense village and shop for sweet Me Xung gifts."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lịch trình 3N2Đ */}
              <div className="hue-itin-card">
                <span className="hue-itin-badge" style={{ background: "#b45309" }}>
                  {isVi ? "LỊCH TRÌNH 3 NGÀY 2 ĐÊM (KHUYÊN DÙNG)" : "3 DAYS / 2 NIGHTS (RECOMMENDED)"}
                </span>
                <h3 className="hue-itin-title">
                  {isVi ? "Khám Phá Toàn Diện Di Sản, Ẩm Thực & Thiên Nhiên" : "Complete Heritage, Food & Nature Route"}
                </h3>
                <div className="hue-timeline">
                  <div className="hue-timeline-step">
                    <div className="hue-timeline-dot" />
                    <div className="hue-timeline-time">{isVi ? "Ngày 1: Trái Tim Cố Đô & Ẩm Thực Đường Phố" : "Day 1: Heart of the Citadel & Street Food"}</div>
                    <div className="hue-timeline-content">
                      {isVi
                        ? "Khám phá trọn vẹn Hoàng Thành Huế, mặc cổ phục chụp ảnh, tản bộ phố đi bộ Chu Văn An và thưởng thức chè hẻm."
                        : "Full exploration of the Imperial Palace with royal costume rental, evening walk around Chu Van An street, and Che dessert trail."}
                    </div>
                  </div>
                  <div className="hue-timeline-step">
                    <div className="hue-timeline-dot" />
                    <div className="hue-timeline-time">{isVi ? "Ngày 2: Quần Thể Lăng Tẩm & Hoàng Hôn Phá Tam Giang" : "Day 2: Royal Mausoleums & Tam Giang Lagoon"}</div>
                    <div className="hue-timeline-content">
                      {isVi
                        ? "Sáng: Thăm Lăng Minh Mạng, Lăng Khải Định, Đồi Vọng Cảnh. Chiều: Trải nghiệm chèo sup ngắm hoàng hôn rực lửa trên Phá Tam Giang, thưởng thức hải sản đầm phá tươi sống."
                        : "Morning: Minh Mang and Khai Dinh tombs, panoramic Vong Canh Hill. Afternoon: Sunset boat excursion across Tam Giang Lagoon with fresh seafood."}
                    </div>
                  </div>
                  <div className="hue-timeline-step">
                    <div className="hue-timeline-dot" />
                    <div className="hue-timeline-time">{isVi ? "Ngày 3: Đầm Lập An & Vịnh Biển Lăng Cô" : "Day 3: Lap An Lagoon & Lang Co Bay"}</div>
                    <div className="hue-timeline-content">
                      {isVi
                        ? "Xuôi về phía nam thưởng ngoạn vẻ đẹp sơn thủy hữu tình của Đầm Lập An, tắm biển vịnh Lăng Cô và vượt Đèo Hải Vân tiếp tục hành trình tới Đà Nẵng – Hội An."
                        : "Head south along misty Lap An lagoon, relax at Lang Co Bay's pristine beaches, and traverse Hai Van Pass onward to Da Nang or Hoi An."}
                    </div>
                  </div>
                </div>
              </div>
              <AffiliateDealBox deal={NORTH_HUE_AFFILIATE_DEALS.hueHotelsAndHaGiang} isVi={isVi} />
              <AffiliateDealBox deal={NORTH_HUE_AFFILIATE_DEALS.hueImperialAndDragonBoat} isVi={isVi} />
            </div>
          </section>

          {/* ──────────────── SECTION 11: FAQS ──────────────── */}
          <section id="hoi-dap" className="hue-section">
            <h2 className="hue-section-title">
              <HelpCircle size={24} color="#7e22ce" />
              <span>{isVi ? "11. Những Câu Hỏi Thường Gặp Khi Du Lịch Huế (FAQs)" : "11. Frequently Asked Questions"}</span>
            </h2>
            <div className="hue-prose">
              {[
                {
                  qVi: "Giá vé tham quan Đại Nội Huế và các lăng tẩm bao nhiêu? Có vé combo không?",
                  qEn: "How much are entrance tickets to the Citadel and tombs? Is there a combo pass?",
                  aVi: "Vé vào cổng Đại Nội Huế hiện là 200.000 VNĐ/người lớn. Vé vào mỗi lăng tẩm chính (Khải Định, Tự Đức, Minh Mạng) là 150.000 VNĐ. Để tiết kiệm chi phí, bạn nên mua vé Combo Tuyến 3 điểm (Đại Nội + Khải Định + Minh Mạng: 420.000 VNĐ) hoặc Tuyến 4 điểm (Đại Nội + 3 lăng: 530.000 VNĐ), có giá trị sử dụng trong 2 ngày.",
                  aEn: "Citadel admission is 200,000 VND ($8 USD). Individual tickets to major tombs (Khai Dinh, Tu Duc, Minh Mang) cost 150,000 VND each. It is highly recommended to buy a 3-site combo (Citadel + Khai Dinh + Minh Mang for 420,000 VND) or 4-site combo (530,000 VND), valid for 2 consecutive days.",
                },
                {
                  qVi: "Nên đi du lịch Huế vào tháng mấy là đẹp nhất?",
                  qEn: "What is the best month to visit Hue?",
                  aVi: "Khoảng thời gian từ tháng 1 đến tháng 4 là lý tưởng nhất: tiết trời mùa xuân dịu mát, nắng nhẹ, không oi ả như mùa hè và không mưa dầm như mùa thu đông. Nếu muốn hòa mình vào không khí lễ hội sôi động, tháng 4 hoặc tháng 6 mùa Festival Huế cũng là lựa chọn tuyệt vời.",
                  aEn: "January to April is universally considered the best period, bringing comfortable 20°C - 25°C temperatures, blooming flowers, and gentle breezes without extreme heat or heavy rains. May to June is fantastic for the Hue Festival.",
                },
                {
                  qVi: "Thời gian tham quan Đại Nội Huế mất khoảng bao lâu?",
                  qEn: "How much time is needed to explore the Imperial Citadel?",
                  aVi: "Khuôn viên Đại Nội rất rộng lớn với diện tích hàng chục hecta. Du khách nên dành tối thiểu từ 2,5 đến 3,5 tiếng để tham quan các công trình chính như Ngọ Môn, Điện Thái Hòa, Thế Miếu, Điện Kiến Trung và Cung Diên Thọ. Nên mang giày đi bộ thoải mái, nón mũ và nước uống.",
                  aEn: "Due to its vast scale across dozens of hectares, allocate at least 2.5 to 3.5 hours to properly see the main palaces, temples, and gardens. Comfortable walking shoes and sun protection are essential.",
                },
                {
                  qVi: "Cách kết hợp du lịch Huế với Đà Nẵng và Hội An tối ưu nhất?",
                  qEn: "How best to combine Hue with Da Nang and Hoi An?",
                  aVi: "Lộ trình phổ biến nhất là 4 - 5 ngày: Dành 2 ngày trọn vẹn tại Cố đô Huế, sau đó đi tàu hỏa di sản hoặc xe máy qua Đèo Hải Vân đến Đà Nẵng (1-2 ngày), và kết thúc hành trình bằng 1-2 đêm tại đô thị cổ Hội An.",
                  aEn: "A 4-to-5-day central heritage itinerary is ideal: Spend 2 full days in Hue, take the scenic Hai Van Pass train to Da Nang (1-2 days), and conclude with 1-2 atmospheric nights in Hoi An Ancient Town.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="hue-faq-item">
                  <button
                    className="hue-faq-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={openFaq === idx}
                  >
                    <span>{isVi ? faq.qVi : faq.qEn}</span>
                    {openFaq === idx ? (
                      <ChevronUp size={18} color="#7e22ce" style={{ flexShrink: 0 }} />
                    ) : (
                      <ChevronDown size={18} color="#6b7280" style={{ flexShrink: 0 }} />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="hue-faq-content">
                      <p style={{ margin: 0 }}>{isVi ? faq.aVi : faq.aEn}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ──────────────── SECTION 12: RELATED ARTICLES ──────────────── */}
          <section className="hue-section" style={{ marginTop: "4rem" }}>
            <h2 className="hue-section-title">
              <Compass size={24} color="#7e22ce" />
              <span>{isVi ? "Khám Phá Các Điểm Đến Liên Quan" : "Related Destination Guides"}</span>
            </h2>
            <div className="hue-cards-grid">
              {RELATED_ARTICLES.map((article, index) => (
                <Link
                  key={index}
                  href={`/guide/${article.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="hue-card" style={{ height: "100%" }}>
                    <div className="hue-card-thumb-wrap">
                      <img
                        src={article.img}
                        alt={isVi ? article.titleVi : article.title}
                        className="hue-card-thumb"
                      />
                      <span className="hue-card-badge">
                        {isVi ? article.badgeVi : article.badge}
                      </span>
                    </div>
                    <div className="hue-card-body">
                      <h3 className="hue-card-title">
                        {isVi ? article.titleVi : article.title}
                      </h3>
                      <p className="hue-card-desc">
                        {isVi ? article.excerptVi : article.excerpt}
                      </p>
                      <div className="hue-card-meta">
                        <span className="hue-card-tag" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          {isVi ? "Xem chi tiết" : "Read guide"}
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      {/* Floating Province AI Chatbot */}
      <ProvinceChatbot
        province={{
          name: isVi ? "Thừa Thiên Huế" : "Hue Imperial City",
          slug: "hue",
          description: isVi
            ? "Cố đô triều Nguyễn, Di sản Văn hóa Thế giới UNESCO với Đại Nội, lăng tẩm hoàng gia và dòng sông Hương thơ mộng."
            : "Ancient imperial capital of Vietnam, UNESCO World Heritage site known for palaces, royal tombs, and the Perfume River.",
        }}
      />

      <PublicFooter />

      {/* Toast Notification */}
      {toastVisible && (
        <div className="hue-toast">
          <Check size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
