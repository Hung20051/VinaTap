"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  Compass,
  Calendar,
  Clock,
  ChevronRight,
  MapPin,
  Sparkles,
  Sun,
  Bus,
  Train,
  Car,
  Utensils,
  Mountain,
  Flame,
  CloudSun,
  Flag,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/sapa-guide.css";

// ─── RELATED ARTICLES ON VINATAP (EXACTLY 3 ARTICLES IN 1 ROW) ───
const RELATED_ARTICLES = [
  {
    slug: "ha-noi",
    path: "/province/ha-noi",
    title: "Hanoi Capital Travel Guide",
    titleVi: "Cẩm Nang Du Lịch Thủ Đô Hà Nội",
    badge: "NORTHERN VIETNAM",
    badgeVi: "MIỀN BẮC VIỆT NAM",
    excerpt:
      "Explore the 36 ancient streets, serene lakes, world-famous egg coffee, and French colonial heritage of Hanoi.",
    excerptVi:
      "Khám phá 36 phố phường nghìn năm văn hiến, cà phê trứng trứ danh và các công trình di sản đậm chất Pháp.",
    img: "/guide/hanoi/hanoi-hero-hd.jpg",
  },
  {
    slug: "ha-giang",
    path: "/province/ha-giang",
    title: "Ha Giang Epic Loop Guide",
    titleVi: "Cẩm Nang Chinh Phục Cung Đường Hà Giang",
    badge: "ADVENTURE",
    badgeVi: "KHÁM PHÁ TÂY BẮC",
    excerpt:
      "Conquer the majestic Dong Van Karst Plateau, the legendary Ma Pi Leng Pass, and deep Nho Que river canyon.",
    excerptVi:
      "Chinh phục cao nguyên đá Đồng Văn hùng vĩ, hẻm vực Tu Sản sâu thẳm và dòng sông Nho Quế ngọc bích.",
    img: "/guide/hagiang/hagiang-hero.jpg",
  },
  {
    slug: "ha-long",
    path: "/province/ha-long",
    title: "Ha Long Bay Travel Guide",
    titleVi: "Cẩm Nang Du Lịch Vịnh Hạ Long",
    badge: "UNESCO HERITAGE",
    badgeVi: "KỲ QUAN THIÊN NHIÊN",
    excerpt:
      "Complete guide to cruising among thousands of emerald limestone karsts, mystical caves, and tranquil bays.",
    excerptVi:
      "Trải nghiệm du thuyền qua đêm giữa hàng nghìn hòn đảo đá vôi kỳ vĩ và những hang động thạch nhũ huyền bí.",
    img: "/guide/ha-long/hero-halong.jpg",
  },
];

export default function SapaPage() {
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    const currentLang = getLang();
    setLang(currentLang || "vi");

    const handleLangChange = () => {
      setLang(getLang() || "vi");
    };

    window.addEventListener("languageChange", handleLangChange);
    window.addEventListener("vinatap:lang-updated", handleLangChange);
    return () => {
      window.removeEventListener("languageChange", handleLangChange);
      window.removeEventListener("vinatap:lang-updated", handleLangChange);
    };
  }, []);

  const isVi = lang === "vi";

  return (
    <div className="sapa-page">
      <PublicHeader />

      {/* Fullwidth Hero Banner (VietnamNomad Style) */}
      <div className="sp-fullwidth-hero">
        <img
          src="/guide/sapa/hero-sapa.jpg"
          alt={isVi ? "Thị xã Sa Pa - Thị xã trong mây" : "Sapa Vietnam - Town in the Clouds"}
          className="sp-fullwidth-hero-bg"
          loading="eager"
        />
        <div className="sp-fullwidth-hero-overlay" />
        <div className="sp-fullwidth-hero-content">
          <div className="sp-hero-pills">
            <span className="sp-hero-pill-item">{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
            <span className="sp-hero-pill-item">{isVi ? "MIỀN BẮC VIỆT NAM" : "NORTHERN VIETNAM"}</span>
            <span className="sp-hero-pill-item">{isVi ? "SA PA" : "SAPA"}</span>
          </div>
          <h1 className="sp-fullwidth-hero-title">
            {isVi ? "Sa Pa" : "Sapa"}
          </h1>
          <div className="sp-hero-byline">
            <span>{isVi ? "Bởi VinaTap Travel" : "By VinaTap Travel"}</span>
            <span>•</span>
            <span>{isVi ? "18 phút đọc" : "18 min read"}</span>
          </div>
          <a href="#overview" className="sp-hero-cta-btn">
            <Compass size={18} />
            <span>{isVi ? "Khám Phá Cẩm Nang Sa Pa" : "Explore Sapa Guide"}</span>
          </a>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="sp-container">

        {/* Lead Paragraph */}
        <div className="sp-lead-box" id="overview">
          <p className="sp-lead-text">
            {isVi
              ? "Nằm ở vùng Tây Bắc Việt Nam, Sa Pa chứa đựng vô vàn điều kỳ diệu của cảnh sắc thiên nhiên và con người. Được mệnh danh là \"thị xã trong mây\", Sa Pa thu hút du khách khắp bốn phương bởi cảnh sắc núi non trùng điệp, những thửa ruộng bậc thang kỳ vĩ và nhiều trải nghiệm độc đáo khám phá đời sống văn hóa giàu bản sắc của đồng bào các dân tộc thiểu số."
              : "Located in the Northwest of Vietnam, Sapa contains many wonders of natural scenery and cultural heritage. Known as the \"town in the clouds\", Sapa attracts visitors from around the globe with its majestic mountain vistas, cascading golden rice terraces, and authentic encounters with colorful ethnic minority communities."}
          </p>
        </div>

        {/* Table of Contents (Mục Lục) */}
        <div className="sp-toc-box">
          <h2 className="sp-toc-title">
            <Sparkles size={20} color="#00c2cb" />
            <span>{isVi ? "Mục Lục Cẩm Nang" : "Contents"}</span>
          </h2>
          <ul className="sp-toc-list">
            <li>
              <a href="#sapa-at-a-glance" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "1. Tổng quan Sa Pa" : "1. Sapa at a glance"}</span>
              </a>
            </li>
            <li>
              <a href="#sapa-tourist-map" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "2. Bản đồ du lịch Sa Pa" : "2. Sapa tourist map"}</span>
              </a>
            </li>
            <li>
              <a href="#how-to-get-to-sapa" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "3. Cách di chuyển đến Sa Pa" : "3. How to get to Sapa"}</span>
              </a>
            </li>
            <li>
              <a href="#where-to-stay-in-sapa" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "4. Địa điểm lưu trú tại Sa Pa" : "4. Where to stay in Sapa"}</span>
              </a>
            </li>
            <li>
              <a href="#the-most-attractive-destinations-in-sapa" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "5. Điểm tham quan hấp dẫn nhất" : "5. Most attractive destinations"}</span>
              </a>
            </li>
            <li>
              <a href="#top-7-must-try-dishes-in-sapa" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "6. Top 7 món ngon đặc sản Sa Pa" : "6. Top 7 must-try dishes"}</span>
              </a>
            </li>
            <li>
              <a href="#festivals-in-sapa" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "7. Lễ hội truyền thống đặc sắc" : "7. Festivals in Sapa"}</span>
              </a>
            </li>
            <li>
              <a href="#related-articles" className="sp-toc-link">
                <span className="sp-toc-dot" />
                <span>{isVi ? "8. Cẩm nang du lịch liên quan" : "8. Related articles"}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* ─── 1. SAPA AT A GLANCE ─── */}
        <section className="sp-section" id="sapa-at-a-glance">
          <div className="sp-section-head">
            <span className="sp-section-tag">{isVi ? "TỔNG QUAN" : "OVERVIEW"}</span>
            <h2 className="sp-section-title">
              {isVi ? "Tổng quan Sa Pa" : "Sapa at a glance"}
            </h2>
            <p className="sp-section-desc">
              {isVi
                ? "Nằm tại vị trí giao thoa giữa mây trời và đỉnh núi Hoàng Liên Sơn hùng vĩ, Sa Pa là điểm đến nghỉ dưỡng vùng cao hàng đầu Đông Nam Á."
                : "Nestled high in the Hoang Lien Son mountain range, Sapa is a premier highland getaway celebrated for its temperate climate and stunning alpine scenery."}
            </p>
          </div>

          <h3 className="sp-subsection-title">
            <MapPin size={20} color="#00c2cb" />
            <span>{isVi ? "VỊ TRÍ ĐỊA LÝ" : "LOCATION"}</span>
          </h3>
          <p>
            {isVi ? (
              <>
                Nằm ở phía Tây Bắc Việt Nam, thị xã Sa Pa cách trung tâm thành phố Lào Cai 38 km và cách{" "}
                <Link href="/province/ha-noi" className="sp-breadcrumb-link" style={{ color: "#00aab2", fontWeight: 600 }}>
                  Hà Nội
                </Link>{" "}
                khoảng 376 km. Bên cạnh trục đường chính nối từ thành phố Lào Cai, Sa Pa còn kết nối với Quốc lộ 4D chạy qua Bình Lư, Tam Đường thuộc tỉnh Lai Châu. Dù cư dân phần đông là đồng bào các dân tộc thiểu số như H&apos;Mông, Dao Đỏ, Tày, Giáy, khu vực trung tâm thị xã cũng tập trung đông đảo người Kinh sinh sống và phát triển dịch vụ du lịch chuyên nghiệp.
              </>
            ) : (
              <>
                Located in the Northwest of Vietnam, Sapa is 38 km from the center of Lao Cai City and 376 km from{" "}
                <Link href="/province/ha-noi" className="sp-breadcrumb-link" style={{ color: "#00aab2", fontWeight: 600 }}>
                  Hanoi
                </Link>
                . Besides the main arterial road from Lao Cai City, another scenic route to Sapa is National Highway 4D connecting from Binh Lu, Tam Duong, and Lai Chau province. While the surrounding valleys are inhabited by diverse ethnic minority groups, the lively town center is home to local entrepreneurs catering to international tourism.
              </>
            )}
          </p>

          <h3 className="sp-subsection-title">
            <CloudSun size={20} color="#00c2cb" />
            <span>{isVi ? "THỜI TIẾT SA PA" : "SAPA WEATHER"}</span>
          </h3>
          <p>
            {isVi
              ? "Được thiên nhiên ưu đãi khí hậu mát mẻ quanh năm, Sa Pa nằm ở độ cao trung bình từ 1.500m đến 1.800m so với mực nước biển, mang đậm sắc thái khí hậu ôn đới với nền nhiệt độ bình quân 15°C – 18°C. Mùa hè từ tháng 5 đến tháng 8 thường có những cơn mưa rào tưới mát ruộng đồng. Đến mùa đông cuối năm, nhiệt độ Sa Pa có thể hạ xuống dưới 0°C và đôi lúc xuất hiện hiện tượng băng giá, tuyết rơi trắng xóa phủ lên các đỉnh núi."
              : "Blessed with a refreshing cool climate year-round, Sapa sits at an average altitude of 1,500m – 1,800m above sea level, enjoying temperate weather with an average temperature of 15°C to 18°C. From May to August, rain showers nourish the mountain valleys. In late winter, temperatures can drop below freezing, occasionally blanketing mountain peaks with rare snowfall."}
          </p>

          <h3 className="sp-subsection-title">
            <Calendar size={20} color="#00c2cb" />
            <span>{isVi ? "THỜI ĐIỂM LÝ TƯỞNG DU LỊCH SA PA" : "THE BEST TIME TO TRAVEL TO SAPA"}</span>
          </h3>
          <p>
            {isVi
              ? "Du khách có thể ghé thăm Sa Pa vào bất cứ mùa nào trong năm, nhưng hai khoảng thời gian đẹp nhất để tận hưởng trọn vẹn cảnh sắc là từ tháng 3 đến tháng 5 hoặc từ tháng 9 đến tháng 11. Lúc này thời tiết tương đối ôn hòa, ngày nắng dịu mát và đêm se lạnh dễ chịu."
              : "While Sapa is alluring throughout the year, the two best seasons to visit are from March to May and September to November, when weather conditions are pleasantly mild with sunny days and crisp, cool evenings."}
          </p>

          <div className="sp-grid-cards">
            <div className="sp-info-card">
              <span className="sp-info-card-badge">{isVi ? "THÁNG 3 – THÁNG 5" : "MARCH – MAY"}</span>
              <h4 className="sp-info-card-title">{isVi ? "Mùa Hoa Rừng Rực Rỡ" : "Blooming Flowers Season"}</h4>
              <p className="sp-info-card-desc">
                {isVi
                  ? "Hàng nghìn loài hoa đào, hoa mận, hoa ban và đỗ quyên nở rộ khắp các triền đồi, lưng chừng sườn núi và các nẻo đường thị xã tạo nên bức tranh xuân căng tràn sức sống."
                  : "Thousands of native peach blossoms, wild plum flowers, and rhododendrons burst into full bloom across hillsides and mountain passes, painting a vibrant tapestry of colors."}
              </p>
            </div>
            <div className="sp-info-card">
              <span className="sp-info-card-badge">{isVi ? "THÁNG 9 – THÁNG 11" : "SEPTEMBER – NOVEMBER"}</span>
              <h4 className="sp-info-card-title">{isVi ? "Mùa Lúa Chín Vàng Óng" : "Golden Rice Harvest Season"}</h4>
              <p className="sp-info-card-desc">
                {isVi
                  ? "Thời điểm lúa trên các thung lũng Mường Hoa, Tả Van chuyển sắc vàng ươm rực rỡ ôm trọn sườn đồi Tây Bắc. Tháng 10 – 11 cũng là lúc sương mây lãng đãng bắt đầu xuất hiện."
                  : "Rice terraces across Muong Hoa Valley ripen into waves of brilliant gold cascading down mountainsides. October to November also ushers in romantic mists and sea-of-clouds hunting."}
              </p>
            </div>
            <div className="sp-info-card">
              <span className="sp-info-card-badge">{isVi ? "THÁNG 12 – THÁNG 2" : "DECEMBER – FEBRUARY"}</span>
              <h4 className="sp-info-card-title">{isVi ? "Mùa Đông & Săn Tuyết Trắng" : "Winter & Snow Hunting"}</h4>
              <p className="sp-info-card-desc">
                {isVi
                  ? "Sa Pa bước vào mùa lạnh nhất với biển mây bồng bềnh và cơ hội chiêm ngưỡng tuyết rơi kỳ thú trên đỉnh Fansipan. Thưởng thức đồ nướng bên bếp than hồng là trải nghiệm khó quên."
                  : "Sapa transforms into a winter wonderland with swirling mists and occasional snow flurries atop Fansipan. Enjoying steaming hotpot by glowing charcoal embers is truly magical."}
              </p>
            </div>
          </div>

          <figure className="sp-media-figure">
            <img
              src="/guide/sapa/sapa-season.jpg"
              alt={isVi ? "Ruộng bậc thang Sa Pa mùa lúa chín vàng óng" : "The best time to visit Sapa when rice fields turn golden yellow"}
              className="sp-media-img"
              loading="lazy"
            />
            <figcaption className="sp-media-caption">
              {isVi
                ? "Thời điểm lý tưởng nhất đến Sa Pa là từ tháng 9 đến tháng 11 khi các thửa ruộng bậc thang nhuộm sắc vàng óng ả."
                : "The best time to come to Sapa is from September to November when terraced rice fields are dyed in breathtaking golden yellow."}
            </figcaption>
          </figure>
        </section>

        {/* ─── 2. SAPA TOURIST MAP ─── */}
        <section className="sp-section" id="sapa-tourist-map">
          <div className="sp-section-head">
            <span className="sp-section-tag">{isVi ? "BẢN ĐỒ DU LỊCH" : "EXPLORATION MAP"}</span>
            <h2 className="sp-section-title">
              {isVi ? "Bản đồ du lịch Sa Pa" : "Sapa tourist map"}
            </h2>
            <p className="sp-section-desc">
              {isVi
                ? "Sa Pa là vùng đất rộng lớn với nhiều danh thắng trải dài từ khu trung tâm thị xã đến các bản làng sâu trong thung lũng. Hãy tham khảo bản đồ dưới đây để lên lịch trình khoa học nhất."
                : "Sapa encompasses diverse attractions stretching from the bustling town center to remote tribal hamlets tucked within deep valleys. Use this travel map to optimize your daily itinerary."}
            </p>
          </div>

          <figure className="sp-media-figure">
            <img
              src="/guide/sapa/sapa-map.jpg"
              alt={isVi ? "Bản đồ du lịch thị xã Sa Pa chi tiết" : "Sapa Vietnam tourist map"}
              className="sp-media-img"
              loading="lazy"
            />
            <figcaption className="sp-media-caption">
              {isVi
                ? "Bản đồ phân bổ các cung đường và điểm tham quan trọng điểm tại Sa Pa."
                : "Tourist map illustrating key roads and prominent attractions across Sapa."}
            </figcaption>
          </figure>
        </section>

        {/* ─── 3. HOW TO GET TO SAPA ─── */}
        <section className="sp-section" id="how-to-get-to-sapa">
          <div className="sp-section-head">
            <span className="sp-section-tag">{isVi ? "CẨM NANG DI CHUYỂN" : "TRANSPORTATION"}</span>
            <h2 className="sp-section-title">
              {isVi ? "Cách di chuyển đến Sa Pa" : "How to get to Sapa"}
            </h2>
            <p className="sp-section-desc">
              {isVi ? (
                <>
                  Là một trong những điểm du lịch nổi tiếng nhất miền Bắc, việc di chuyển từ{" "}
                  <Link href="/province/ha-noi" className="sp-breadcrumb-link" style={{ color: "#00aab2", fontWeight: 600 }}>
                    Hà Nội
                  </Link>{" "}
                  đến Sa Pa vô cùng thuận tiện với nhiều phương tiện như xe bus giường nằm, limousine cao cấp và tàu hỏa hỏa xa.
                </>
              ) : (
                <>
                  As one of northern Vietnam&apos;s most beloved mountain retreats, traveling from{" "}
                  <Link href="/province/ha-noi" className="sp-breadcrumb-link" style={{ color: "#00aab2", fontWeight: 600 }}>
                    Hanoi
                  </Link>{" "}
                  to Sapa is seamless, offering flexible choices including sleeper buses, luxury limousines, and classic overnight trains.
                </>
              )}
            </p>
          </div>

          <h3 className="sp-subsection-title">
            <Bus size={20} color="#00c2cb" />
            <span>{isVi ? "TỪ HÀ NỘI ĐI SA PA" : "FROM HANOI TO SAPA"}</span>
          </h3>

          <div className="sp-transport-list">
            <div className="sp-transport-card">
              <div className="sp-transport-icon-wrap">
                <Bus size={24} />
              </div>
              <div className="sp-transport-info">
                <h4 className="sp-transport-title">{isVi ? "1. Xe khách giường nằm (Bus)" : "1. By Sleeper Bus"}</h4>
                <p className="sp-transport-desc">
                  {isVi
                    ? "Nhiều hãng xe chất lượng cao chạy tuyến Hà Nội – Sa Pa liên tục mỗi ngày với mức giá hợp lý khoảng 180.000 – 250.000 VNĐ/vé/chiều. Hai khung giờ khởi hành phổ biến nhất là sáng sớm (6:30) hoặc tối muộn (22:00) để bạn ngủ đêm trên xe và thức dậy tại Sa Pa vào sớm mai."
                    : "Numerous reputable bus companies run daily between Hanoi and Sapa with fares ranging from 180,000 to 250,000 VND per person. Common departure times include early morning (around 6:30 AM) and overnight sleepers (around 10:00 PM), arriving refreshed in Sapa by sunrise."}
                </p>
              </div>
            </div>

            <div className="sp-transport-card">
              <div className="sp-transport-icon-wrap">
                <Train size={24} />
              </div>
              <div className="sp-transport-info">
                <h4 className="sp-transport-title">{isVi ? "2. Tàu hỏa (Train)" : "2. By Overnight Train"}</h4>
                <p className="sp-transport-desc">
                  {isVi
                    ? "Khởi hành từ ga Trần Quý Cáp (Hà Nội) lúc 21:00 hoặc 22:00 và đến ga Lào Cai vào khoảng 5:30 sáng hôm sau. Giá vé dao động từ 200.000 đến 600.000 VNĐ tùy theo loại ghế mềm hay giường nằm điều hòa. Từ ga Lào Cai, bạn chỉ cần bắt xe bus địa phương hoặc xe trung chuyển (khoảng 40.000 – 50.000 VNĐ) để vượt 38km đèo lên Sa Pa."
                    : "Departing from Tran Quy Cap station in Hanoi at 9:00 PM or 10:00 PM, the train reaches Lao Cai railway station early the next morning. Fares vary between 200,000 and 600,000 VND depending on cabin class. From Lao Cai station, local buses and shuttle vans transfer passengers up the 38 km winding mountain road to Sapa town."}
                </p>
              </div>
            </div>

            <div className="sp-transport-card">
              <div className="sp-transport-icon-wrap">
                <Car size={24} />
              </div>
              <div className="sp-transport-info">
                <h4 className="sp-transport-title">{isVi ? "3. Xe Limousine VIP 9 chỗ" : "3. By Luxury Limousine"}</h4>
                <p className="sp-transport-desc">
                  {isVi
                    ? "Phương tiện êm ái và nhanh chóng nhất với ghế massage bọc da rộng rãi, wifi, cổng sạc. Giá vé dao động từ 350.000 đến 500.000 VNĐ/ghế tùy hãng và vị trí ghế. Nhờ chạy toàn tuyến cao tốc Nội Bài – Lào Cai, thời gian di chuyển rút ngắn chỉ còn khoảng 4 – 5 tiếng."
                    : "The most comfortable and rapid option, featuring spacious leather reclining massage seats, Wi-Fi, and USB charging. Tickets range from 350,000 to 500,000 VND per seat. Traveling via the modern Hanoi – Lao Cai Expressway takes only 4 to 5 hours door-to-door."}
                </p>
              </div>
            </div>
          </div>

          <h3 className="sp-subsection-title">
            <Compass size={20} color="#00c2cb" />
            <span>{isVi ? "PHƯƠNG TIỆN ĐI LẠI TẠI SA PA" : "GETTING AROUND SAPA"}</span>
          </h3>

          <div className="sp-editorial-list">
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">01</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Thuê xe máy tự lái" : "Rent a Motorcycle"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Với mức giá khoảng 120.000 – 180.000 VNĐ/ngày, bạn hoàn toàn chủ động vi vu qua các cung đèo ngắm cảnh. Hãy kiểm tra kỹ phanh, lốp và đổ đầy bình xăng trước khi xuống thung lũng."
                    : "Renting a scooter costs roughly 120,000 – 180,000 VND per day, granting full freedom to explore scenic mountain passes. Ensure brakes and tires are in top condition before embarking on steep descents."}
                </p>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">02</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Thuê xe ôm bản địa" : "Hire a Local Motorbike Driver"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Với những du khách đi một mình hoặc không quen lái xe đèo dốc, thuê tài xế xe ôm người địa phương là giải pháp an toàn và thú vị. Chi phí khoảng 100.000 – 150.000 VNĐ cho hành trình tham quan 4 – 5 điểm gần nhau."
                    : "For solo travelers or those unaccustomed to steep curves, hiring an experienced local driver is both safe and insightful. Expect to pay around 100,000 – 150,000 VND for a curated circuit covering 4–5 neighboring landmarks."}
                </p>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">03</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Đi lại bằng Taxi" : "Take a Taxi"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Phù hợp cho gia đình có người lớn tuổi hoặc trẻ nhỏ khi di chuyển giữa các điểm tham quan trung tâm. Tuy nhiên, đường vào các bản sâu như Tả Van, Sín Chải khá hẹp, nên cân nhắc kết hợp đi bộ ngắm cảnh."
                    : "Convenient for families and groups traveling between central attractions. Note that access roads leading deep into rural villages like Ta Van and Sin Chai are narrow, making walking or biking preferable."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. WHERE TO STAY IN SAPA ─── */}
        <section className="sp-section" id="where-to-stay-in-sapa">
          <div className="sp-section-head">
            <span className="sp-section-tag">{isVi ? "NƠI LƯU TRÚ" : "ACCOMMODATION"}</span>
            <h2 className="sp-section-title">
              {isVi ? "Địa điểm lưu trú tại Sa Pa" : "Where to stay in Sapa"}
            </h2>
            <p className="sp-section-desc">
              {isVi
                ? "Là điểm du lịch phát triển hàng đầu Tây Bắc, Sa Pa mang đến hệ sinh thái lưu trú phong phú từ khách sạn bình dân, homestay mộc mạc nhìn ra ruộng bậc thang đến các khu nghỉ dưỡng boutique xa hoa bậc nhất thế giới."
                : "As Vietnam's premier mountain resort hub, Sapa offers an expansive spectrum of accommodations, spanning budget central hotels, authentic rural homestays, and world-class luxury eco-resorts."}
            </p>
          </div>

          <div className="sp-grid-cards">
            <div className="sp-info-card">
              <span className="sp-info-card-badge">{isVi ? "TIẾT KIỆM & TIỆN LỢI" : "BUDGET & CENTRAL"}</span>
              <h4 className="sp-info-card-title">{isVi ? "Khách Sạn Khu Trung Tâm" : "Town Center Hotels"}</h4>
              <p className="sp-info-card-desc">
                {isVi
                  ? "Tập trung dọc các tuyến phố Xuân Viên, Fansipan, Cầu Mây với giá từ 250.000 – 500.000 VNĐ/đêm/phòng đôi. Rất thuận tiện để đi bộ ra nhà thờ đá, dạo chợ đêm và thưởng thức ẩm thực."
                  : "Concentrated along Xuan Vien, Fansipan, and Cau May streets with rates around 250,000 – 500,000 VND per night for a double room, steps from Sapa Stone Church and lively night markets."}
              </p>
            </div>
            <div className="sp-info-card">
              <span className="sp-info-card-badge">{isVi ? "GẦN GŨI THIÊN NHIÊN" : "NATURE HOMESTAY"}</span>
              <h4 className="sp-info-card-title">{isVi ? "Homestay Các Bản Làng" : "Village Homestays"}</h4>
              <p className="sp-info-card-desc">
                {isVi
                  ? "Tại các bản Tả Van, Lao Chải, Tả Phìn, Bản Hồ. Không gian yên bình, view thẳng ra thung lũng Mường Hoa, cơ hội cùng người bản địa nấu cơm, thưởng thức trà thảo mộc vùng cao."
                  : "Located in Ta Van, Lao Chai, Ta Phin, and Ban Ho villages. Enjoy peaceful mornings overlooking misty terraces, homecooked meals, and authentic cultural exchanges with ethnic hosts."}
              </p>
            </div>
            <div className="sp-info-card">
              <span className="sp-info-card-badge">{isVi ? "NGHỈ DƯỠNG ĐẲNG CẤP" : "LUXURY RESORTS"}</span>
              <h4 className="sp-info-card-title">{isVi ? "Resort Boutique Cao Cấp" : "Luxury Boutique Resorts"}</h4>
              <p className="sp-info-card-desc">
                {isVi
                  ? "Topas Ecolodge (resort sinh thái hàng đầu thế giới với bể bơi vô cực trên đỉnh đồi), Hotel de la Coupole - MGallery (lâu đài phong cách Pháp nguy nga giữa trung tâm), Silk Path Grand Sapa..."
                  : "Topas Ecolodge (world-renowned eco-resort with dramatic hilltop infinity pools), Hotel de la Coupole - MGallery (opulent French-Indochine castle), and Silk Path Grand Resort."}
              </p>
            </div>
          </div>

          <figure className="sp-media-figure">
            <img
              src="/guide/sapa/stay-in-sapa.jpg"
              alt={isVi ? "Khu nghỉ dưỡng và khách sạn tại Sa Pa" : "Recommended places to stay in Sapa"}
              className="sp-media-img"
              loading="lazy"
            />
            <figcaption className="sp-media-caption">
              {isVi
                ? "Gợi ý các phân khúc lưu trú và khách sạn lý tưởng tại Sa Pa trích từ cẩm nang du lịch VinaTap."
                : "Curated accommodation options in Sapa from VinaTap Travel Guide."}
            </figcaption>
          </figure>
        </section>

        {/* ─── 5. THE MOST ATTRACTIVE DESTINATIONS IN SAPA ─── */}
        <section className="sp-section" id="the-most-attractive-destinations-in-sapa">
          <div className="sp-section-head">
            <span className="sp-section-tag">{isVi ? "ĐIỂM ĐẾN NỔI BẬT" : "MUST-SEE ATTRACTIONS"}</span>
            <h2 className="sp-section-title">
              {isVi ? "Những điểm đến hấp dẫn nhất tại Sa Pa" : "The most attractive destinations in Sapa"}
            </h2>
            <p className="sp-section-desc">
              {isVi
                ? "Sa Pa nổi tiếng với những đỉnh núi kỳ vĩ, thung lũng uốn lượn và những thửa ruộng bậc thang tuyệt mỹ. Dưới đây là những địa danh không thể bỏ lỡ trong hành trình của bạn."
                : "Renowned for dramatic peaks, winding rivers, and emerald terraces, Sapa boasts timeless landmarks you simply cannot miss."}
            </p>
          </div>

          <h3 className="sp-subsection-title">
            <MapPin size={20} color="#00c2cb" />
            <span>{isVi ? "ĐIỂM ĐẾN KHU VỰC TRUNG TÂM THỊ XÃ" : "DESTINATIONS IN THE SAPA CENTER"}</span>
          </h3>

          <figure className="sp-media-figure">
            <img
              src="/guide/sapa/sapa-center.jpg"
              alt={isVi ? "Quảng trường trung tâm thị xã Sa Pa và Sun Plaza" : "Sapa town center and Sun Plaza"}
              className="sp-media-img"
              loading="lazy"
            />
            <figcaption className="sp-media-caption">
              {isVi
                ? "Một góc trung tâm thị xã Sa Pa với tổ hợp Sun Plaza và kiến trúc châu Âu tráng lệ."
                : "A vibrant corner of Sapa town center featuring Sun Plaza and European-inspired architecture."}
            </figcaption>
          </figure>

          <div className="sp-editorial-list">
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">01</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Nhà thờ đá Sa Pa" : "Sapa Stone Church"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Được xây dựng vào năm 1895 từ thời Pháp thuộc, nhà thờ đá mang đậm phong cách kiến trúc Gothic La Mã cổ kính với tháp chuông, mái vòm và những khối đá đẽo gọt tỉ mỉ. Tọa lạc ngay quảng trường trung tâm, đây là biểu tượng văn hóa lịch sử gắn liền với đời sống thị xã Sa Pa."
                    : "Constructed in 1895 during the French colonial era, Sapa Stone Church showcases distinct Roman Gothic architecture with a soaring bell tower and carved stone facade. Standing proudly in the town square, it remains the quintessential spiritual symbol of Sapa."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Trung tâm thị xã Sa Pa" : "Central Square, Sapa"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">02</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Núi Hàm Rồng" : "Ham Rong Mountain"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Nằm ngay phía sau nhà thờ đá, đỉnh Hàm Rồng mở ra tầm nhìn toàn cảnh ngoạn mục xuống thị xã Sa Pa, thung lũng Mường Hoa và đỉnh Fansipan trong làn sương mây lãng đãng. Đường lên núi uốn lượn qua vườn lan rực rỡ, cổng trời và sân mây tựa chốn bồng lai tiên cảnh."
                    : "Rising directly behind the Stone Church, Ham Rong Mountain commands breathtaking 360-degree vistas over Sapa town and the undulating valleys below. Walking trails weave through orchid sanctuaries, stone labyrinths, and the Heaven's Gate cloud observatory."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Sát trung tâm thị xã (sau nhà thờ đá)" : "Adjacent to town center"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">03</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Bản Cát Cát" : "Cat Cat Village"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Cách trung tâm thị xã khoảng 2km về hướng núi Fansipan, bản Cát Cát là nơi định cư lâu đời của người H'Mông. Ngôi làng níu chân du khách bởi những guồng nước khổng lồ bằng gỗ, dòng thác Tiên Sa róc rách, những căn nhà sàn mộc mạc và nghề dệt thổ cẩm, rèn bạc truyền thống tinh xảo."
                    : "Located just 2 km from town towards Fansipan, Cat Cat is an ancient H'mong settlement nestled at the foot of Hoang Lien Son. The village charms visitors with giant wooden water wheels, sparkling Tien Sa Waterfall, traditional wooden stilt cottages, and intricate hemp weaving crafts."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Cách trung tâm khoảng 2 km" : "Approx. 2 km from center"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">04</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Bản Tả Van" : "Ta Van Village"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Men theo thung lũng Mường Hoa về hướng Đông Nam khoảng 8km, Tả Van là nơi giao thoa văn hóa giữa người Giáy và người H'Mông. Con đường dẫn vào bản uốn lượn giữa những thửa ruộng bậc thang màu mỡ, những nếp nhà gỗ bình dị và dòng suối hiền hòa chảy quanh năm."
                    : "Following Muong Hoa Valley southeast for 8 km brings you to Ta Van Giay village. Framed by fertile terraced fields and crystal-clear mountain streams, this tranquil settlement offers deep insights into Giay hospitality and pastoral highland life."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Cách trung tâm khoảng 8 km" : "Approx. 8 km from center"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">05</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Bản Sín Chải" : "Sin Chai Village"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Tọa lạc tại xã San Sả Hồ dưới chân dãy Hoàng Liên Sơn hùng vĩ, Sín Chải là bản làng người Mông Đen vẫn giữ nguyên vẹn nét hoang sơ, mộc mạc không bị thương mại hóa. Ngoài trồng lúa nương, dân bản còn canh tác thảo quả trên các sườn núi cao, mang lại hương thơm thảo mộc dịu nhẹ khắp thung lũng."
                    : "Nestled in San Sa Ho commune beneath the towering Hoang Lien peaks, Sin Chai remains remarkably uncommercialized. Home to the Black H'mong community, villagers cultivate hillside rice and aromatic black cardamom beneath dense alpine canopies."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Cách trung tâm khoảng 5 km" : "Approx. 5 km from center"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">06</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Thung lũng Mường Hoa & Bãi đá cổ Sa Pa" : "Muong Hoa Valley & Ancient Rock Field"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Điểm nhấn đặc biệt của thung lũng là quần thể bãi đá cổ Sa Pa với gần 200 phiến đá sa thạch khắc hình học, con người và ký tự bí ẩn chưa được giải mã trọn vẹn, đã được công nhận là Di tích Quốc gia. Dòng suối Hoa thơ mộng dài 15km uốn lượn qua các xã Lao Chải, Tả Van, Hầu Thào trước khi đổ về Bản Hồ."
                    : "Muong Hoa Valley is famed for its prehistoric Ancient Rock Field featuring nearly 200 sandstone boulders intricately carved with enigmatic drawings and glyphs. Flowing gently through the valley is the 15 km Hoa Stream, meandering through Lao Chai and Ta Van down to Ban Ho."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Xã Hầu Thào, cách trung tâm 8 km" : "Hau Thao Commune, 8 km south of Sapa"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="sp-subsection-title">
            <Mountain size={20} color="#00c2cb" />
            <span>{isVi ? "ĐIỂM ĐẾN NGOẠI THÀNH & XA TRUNG TÂM" : "DESTINATIONS FAR FROM THE CENTER OF SAPA"}</span>
          </h3>

          <figure className="sp-media-figure">
            <img
              src="/guide/sapa/sapa-villages.jpg"
              alt={isVi ? "Thung lũng và các bản làng ngoại thành Sa Pa" : "Sapa surrounding valleys and ethnic minority villages"}
              className="sp-media-img"
              loading="lazy"
            />
            <figcaption className="sp-media-caption">
              {isVi
                ? "Bên cạnh khu vực trung tâm, Sa Pa còn cuốn hút bởi các bản làng hoang sơ và thung lũng đại ngàn."
                : "Beyond the town center, Sapa is celebrated for its serene terraced valleys and untouched tribal villages."}
            </figcaption>
          </figure>

          <div className="sp-editorial-list">
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">01</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Đèo Ô Quy Hồ" : "O Quy Ho Mountain Pass"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Được mệnh danh là một trong \"Tứ đại đỉnh đèo\" của núi rừng Tây Bắc, đèo Ô Quy Hồ dài gần 50km nằm ở độ cao trên 2.000m trên Quốc lộ 4D vắt qua dãy Hoàng Liên Sơn, nối liền hai tỉnh Lào Cai và Lai Châu. Đỉnh đèo là điểm ngắm hoàng hôn rực rỡ và săn biển mây ngoạn mục bậc nhất miền Bắc."
                    : "Celebrated as one of the 'Four Great Mountain Passes' of Vietnam, O Quy Ho stretches nearly 50 km along National Highway 4D across the Hoang Lien Son range at altitudes exceeding 2,000 meters. The pass crest marks the border between Lao Cai and Lai Chau, offering legendary sunset panoramas."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Cách trung tâm thị xã khoảng 15 km" : "Approx. 15 km west of Sapa"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">02</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Thác Bạc và Thác Tình Yêu" : "Silver Waterfall & Love Waterfall"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Từ thị xã đi theo hướng Lai Châu 11km, bạn sẽ bắt gặp Thác Bạc đổ ào ạt từ độ cao hơn 100m xuống thung lũng Ô Quy Hồ tạo âm vang hào sảng của núi rừng. Đi thêm 3km tới Trạm Tôn, bạn có thể tản bộ qua rừng nguyên sinh thuộc Vườn Quốc gia Hoàng Liên để chiêm ngưỡng Thác Tình Yêu lãng mạn gắn với truyền thuyết nàng Tiên trời."
                    : "Heading 11 km west from Sapa, Silver Waterfall cascades dramatically from a height of over 100m into the rocky valley below. Further along at Tram Ton ranger station, a pleasant forest trail through Hoang Lien National Park leads to Love Waterfall, steeped in romantic ethnic folklore."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Cách trung tâm 11 – 14 km về phía Tây" : "11 – 14 km west of Sapa"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">03</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Bản Tả Phìn" : "Ta Phin Village"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Nằm cách thị xã 15km, Tả Phìn là quê hương của đồng bào người Dao Đỏ nức tiếng với bài thuốc tắm lá thảo mộc gia truyền giúp phục hồi sức khỏe tuyệt vời. Cạnh bản là Động Tả Phìn với hệ thống thạch nhũ đá vôi kỳ thú mang nhiều hình thù thần tiên huyền ảo."
                    : "Located 15 km northeast of town, Ta Phin is home to the Red Dao people, celebrated nationwide for their rejuvenating medicinal herbal baths. Nearby Ta Phin Cave features intricate stalactites resembling mythical forest creatures and cascading rice fields."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Cách trung tâm khoảng 15 km" : "Approx. 15 km from center"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">04</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Đỉnh Fansipan – Nóc Nhà Đông Dương" : "Fansipan Peak – Roof of Indochina"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Trải nghiệm đỉnh cao khi đến Sa Pa là chạm tay vào cột mốc Fansipan ở độ cao 3.143m, đỉnh núi cao nhất bán đảo Đông Dương. Du khách có thể leo núi trekking hoặc lựa chọn tuyến cáp treo 3 dây hiện đại đạt 2 kỷ lục Guinness thế giới để lên đỉnh chỉ trong 15 phút, chiêm bái Đại tượng Phật A Di Đà bằng đồng và quần thể tâm linh sừng sững giữa ngàn mây."
                    : "The quintessential Sapa journey culminates at the Fansipan landmark standing at 3,143m, the highest summit in Indochina. Travelers can undertake a multi-day trek or ride the Guinness-record-holding 3-cable gondola in just 15 minutes to admire sacred Buddhist sanctuaries towering above sea-of-clouds."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Quần thể Sun World Fansipan Legend (9 km Tây Nam)" : "Sun World Fansipan Legend (9 km southwest)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <figure className="sp-media-figure">
            <img
              src="/guide/sapa/fansipan-peak.jpg"
              alt={isVi ? "Đỉnh Fansipan - Nóc nhà Đông Dương sừng sững giữa ngàn mây" : "Fansipan peak - the highest mountain in Vietnam and Indochina"}
              className="sp-media-img"
              loading="lazy"
            />
            <figcaption className="sp-media-caption">
              {isVi
                ? "Đỉnh Fansipan cao 3.143m – Nóc nhà Đông Dương sừng sững giữa biển mây bồng bềnh."
                : "Fansipan Peak at 3,143m – The Roof of Indochina soaring proudly amidst an ethereal ocean of clouds."}
            </figcaption>
          </figure>

          <div className="sp-editorial-list">
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">05</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Động Tiên (Bắc Hà)" : "Tien Cave (Bac Ha District)"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Ngược dòng sông Cháy 6km từ xã Bảo Nhai (huyện Bắc Hà), thuyền sẽ đưa bạn luồn lách giữa hai vách đá dựng đứng kỳ vĩ để vào Động Tiên. Nơi đây được ví như một vịnh Hạ Long thu nhỏ trên cạn, gắn với sự tích đền Ba Cô linh thiêng giữa làn nước trong xanh ngọc bích."
                    : "Cruising 6 km upstream on Chay River from Bao Nhai commune, boats glide through soaring limestone canyons to reach Tien Cave. Often described as a miniature inland Ha Long Bay, it is steeped in sacred local legends and emerald waters."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Xã Bảo Nhai, huyện Bắc Hà" : "Bao Nhai Commune, Bac Ha District"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">06</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Quần thể thác Cốc San" : "Coc San Waterfall Complex"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Tọa lạc tại xã Cốc San (huyện Bát Xát), Cốc San là một quần thể thác nước và hang động hoang sơ kỳ thú. Dòng suối đổ qua nhiều bậc thác đá tạo nên những hồ nước tự nhiên mát lạnh, bao bọc bởi thảm thực vật nhiệt đới xanh tươi."
                    : "Located in Bat Xat district, Coc San is a pristine cascading waterfall and cave complex. Streams tumble over stepped limestone shelves into clear plunge pools surrounded by tranquil alpine foliage."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Huyện Bát Xát (cách TP. Lào Cai 7 km)" : "Bat Xat District (7 km from Lao Cai City)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">07</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Dinh Hoàng A Tưởng (Dinh Vua Mèo Bắc Hà)" : "Hoang A Tuong Palace"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Được xây dựng từ năm 1914 đến 1921, dinh thự mang phong cách kiến trúc Á – Âu độc đáo do kiến trúc sư người Pháp và Trung Quốc thiết kế. Tòa nhà hình chữ nhật khép kín với các vọng gác kiên cố như một pháo đài bề thế giữa cao nguyên Bắc Hà trắng sắc hoa mận."
                    : "Constructed between 1914 and 1921, this fortress mansion harmoniously blends French and Asian neoclassical architecture. Featuring enclosed courtyards and fortified watchtowers, it stands as an enduring architectural monument of the Bac Ha plateau."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Trung tâm thị trấn Bắc Hà" : "Bac Ha Town Center"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-editorial-item">
              <div className="sp-editorial-num">08</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Chợ phiên Bắc Hà" : "Bac Ha Sunday Fair Market"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Là phiên chợ vùng cao lớn và rực rỡ sắc màu nhất Tây Bắc họp định kỳ vào sáng Chủ nhật hàng tuần. Đây là nơi hội tụ của đồng bào Mông Hoa, Tày, Nùng trong những bộ váy áo thổ cẩm lộng lẫy, trao đổi ngựa, trâu, thắng cố bốc khói nghi ngút và rượu ngô nồng ấm."
                    : "The largest and most colorful highland bazaar in northern Vietnam, convening every Sunday morning. Flower H'mong, Tay, and Nung ethnic groups dress in brilliant handwoven garments to trade livestock, local textiles, steaming thang co, and fragrant corn wine."}
                </p>
                <div className="sp-editorial-meta">
                  <span className="sp-editorial-loc">
                    <MapPin size={14} />
                    {isVi ? "Huyện Bắc Hà (họp sáng Chủ nhật)" : "Bac Ha District (Sundays only)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. TOP 7 MUST-TRY DISHES IN SAPA ─── */}
        <section className="sp-section" id="top-7-must-try-dishes-in-sapa">
          <div className="sp-section-head">
            <span className="sp-section-tag">{isVi ? "ẨM THỰC ĐẶC SẢN" : "LOCAL GASTRONOMY"}</span>
            <h2 className="sp-section-title">
              {isVi ? "Top 7 món ngon đặc sản Sa Pa nhất định phải thử" : "Top 7 must-try dishes in Sapa"}
            </h2>
            <p className="sp-section-desc">
              {isVi
                ? "Không chỉ nổi tiếng bởi cảnh sắc thiên nhiên kỳ vĩ, Sa Pa còn níu chân lữ khách bởi văn hóa ẩm thực độc đáo đậm đà hương vị núi rừng Tây Bắc."
                : "Beyond scenic splendour, Sapa delights travelers with bold, smoky highland culinary traditions infused with indigenous forest spices."}
            </p>
          </div>

          <div className="sp-editorial-list">
            {/* Dish 1 */}
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">01</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Cơm lam ống tre" : "1. Bamboo-Tube Rice (Com Lam)"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Gạo nếp nương thơm dẻo được vo sạch, ngâm nước suối trong rồi cho vào ống nứa bánh tẻ cùng chút nước cốt dừa, nút lá chuối và nướng đều tay trên than hồng. Khi chín, bóc tách lớp cùi nứa trắng ngần bên trong, chấm cùng muối vừng thơm bùi đậm vị."
                    : "Highland glutinous rice is soaked in fresh mountain stream water, packed tightly into tender bamboo tubes, and roasted over glowing charcoal. Peeling away the burnt bamboo reveals a thin fragrant inner membrane, savored dipped in crushed sesame peanut salt."}
                </p>
                <ul className="sp-address-list">
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Địa chỉ: Dọc tuyến phố Cầu Mây và Chợ đêm Sa Pa" : "Address: Along Cau May Street and Sapa Night Market"}</span>
                  </li>
                </ul>
              </div>
            </div>

            <figure className="sp-media-figure">
              <img
                src="/guide/sapa/food-bamboo-rice.jpg"
                alt={isVi ? "Cơm lam nướng ống tre Sa Pa thơm dẻo" : "Bamboo-tube rice - Sapa Vietnam Food"}
                className="sp-media-img"
                loading="lazy"
              />
              <figcaption className="sp-media-caption">
                {isVi
                  ? "Cơm lam ống tre nướng than hồng thơm dẻo vị nếp nương Tây Bắc."
                  : "Bamboo-tube rice roasted on charcoal embers, infused with fragrant forest bamboo."}
              </figcaption>
            </figure>

            {/* Dish 2 */}
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">02</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Đồ nướng than hoa Sa Pa" : "2. Sapa Charcoal Barbecue"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Trong tiết trời se lạnh của thị xã sương mù, sà vào những quán nướng vỉa hè nghi ngút khói là trải nghiệm tuyệt vời nhất. Các khay nướng đa dạng sắc màu: thịt ba chỉ lợn bản xiên que, bò cuộn nấm kim châm, bò cuộn cải mèo, dạ dày, cánh gà, trứng gà nướng chấm gia vị chẩm chéo cay nồng."
                    : "In Sapa's chilly evening mist, cozying up next to a glowing grill table is an unforgettable treat. Choose skewers of marinated pork belly, beef wrapped around crisp mustard greens, wild mushrooms, chicken wings, and grilled sweet corn with tangy dipping sauces."}
                </p>
                <ul className="sp-address-list">
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Phố nướng Cầu Mây & phố nướng hồ Mắt Ngọc" : "Cau May BBQ Street & Mat Ngoc Lake area"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Quán Hoàng Lực Xôi Nướng – Đường Ngũ Chỉ Sơn" : "Hoang Luc Xoi BBQ – Ngu Chi Son Road"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Quán nướng Bà Lý – Số 1 đường Fansipan" : "Ba Ly Restaurant – 1 Fansipan Street"}</span>
                  </li>
                </ul>
              </div>
            </div>

            <figure className="sp-media-figure">
              <img
                src="/guide/sapa/food-bbq.jpg"
                alt={isVi ? "Đồ nướng than hoa Sa Pa đa dạng món ngon" : "Barbecue skewers Sapa Vietnam"}
                className="sp-media-img"
                loading="lazy"
              />
              <figcaption className="sp-media-caption">
                {isVi
                  ? "Xiên que đồ nướng than hoa phong phú sưởi ấm đêm sương mù Sa Pa."
                  : "Assorted highland barbecue skewers sizzling over aromatic charcoal."}
              </figcaption>
            </figure>

            {/* Dish 3 */}
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">03</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Lẩu cá hồi & cá tầm Sa Pa" : "3. Sapa Salmon & Sturgeon Hotpot"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Được nuôi dưỡng trong dòng nước lạnh tinh khiết bắt nguồn từ đỉnh Hoàng Liên Sơn, cá hồi và cá tầm Sa Pa có thớ thịt chắc ngọt, ít mỡ và không tanh. Nồi lẩu nóng hổi nấu cùng măng chua, cà chua, búp chuối rừng và đọt su su giòn ngọt mang đến bữa ăn ấm cúng trọn vị."
                    : "Raised in crisp cold streams originating from Mount Fansipan, Sapa salmon and sturgeon feature firm, sweet, non-fishy flesh. A bubbling pot infused with sour bamboo shoots, wild banana blossoms, and crisp chayote greens is the ultimate cold-weather feast."}
                </p>
                <ul className="sp-address-list">
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Nhà hàng A Phủ – 15 Fansipan" : "A Phu Restaurant – 15 Fansipan Street"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Nhà hàng Hoa Đào – 48 Lê Văn Tám" : "Hoa Dao Restaurant – 48 Le Van Tam Street"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Nhà hàng Thác Bạc – Khu du lịch Thác Bạc" : "Thac Bac Restaurant – Silver Waterfall Area"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Dish 4 */}
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">04</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Thịt trâu gác bếp" : "4. Smoked Dried Buffalo Meat"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Món quà quý của đồng bào Mông làm từ những tảng thịt bắp trâu tươi ngon, tẩm ướp hạt mắc khén, hạt dổi rừng, ớt gừng rồi xâu lạt hun khói ròng rã trên gác bếp củi. Khi thưởng thức, xé nhỏ từng thớ thịt đỏ hồng đượm mùi khói bếp, chấm cùng tương ớt Mường Khương cay nồng."
                    : "A prized specialty of the Black H'mong, prime cuts of buffalo are marinated with wild mac khen peppercorns, forest seeds, and chili before hanging above open hearth smoke for months. Tear into fragrant fibers and dip in fiery Muong Khuong chili paste."}
                </p>
                <ul className="sp-address-list">
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Cửa hàng Viet's Farm – 26 Đồng Lợi" : "Viet's Farm – 26 Dong Loi Street"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Chợ đêm Sa Pa – Đường Điện Biên Phủ" : "Sapa Night Market – Dien Bien Phu Street"}</span>
                  </li>
                </ul>
              </div>
            </div>

            <figure className="sp-media-figure">
              <img
                src="/guide/sapa/food-dried-meat.jpg"
                alt={isVi ? "Thịt trâu gác bếp đặc sản Sa Pa Tây Bắc" : "Dried meat - Sapa Food Vietnamnomad"}
                className="sp-media-img"
                loading="lazy"
              />
              <figcaption className="sp-media-caption">
                {isVi
                  ? "Thịt trâu gác bếp đỏ au đậm đà hương vị mắc khén và khói củi Tây Bắc."
                  : "Traditional wood-smoked dried meat infused with indigenous mountain spices."}
              </figcaption>
            </figure>

            {/* Dish 5 */}
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">05</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Lợn cắp nách Sa Pa" : "5. Lon Cap Nach (Free-Range Pig)"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Giống lợn bản địa của người Mông được thả rông tự nhiên trên triền đồi, chỉ ăn rau củ và ngô khoai rừng nên thịt rất săn chắc, bì mỏng giòn và hầu như không có mỡ. Lợn chỉ nặng chừng 10 – 15kg, người dân có thể cắp vào nách mang ra chợ bán, thường được chế biến quay nguyên con da giòn rụm hoặc hấp lá móc mật."
                    : "An indigenous highland miniature pig raised free-range on steep slopes, feeding on forest roots. Weighing only 10 to 15 kg, farmers traditionally carry them tucked under their armpits to market. Roasted whole with crisp crackling skin or steamed with wild mac mat leaves."}
                </p>
                <ul className="sp-address-list">
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Nhà hàng Dũng Trâu – 85 Xuân Viên" : "Dung Trau Restaurant – 85 Xuan Vien Street"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Nhà hàng Gerbera – 29 Cầu Mây" : "Gerbera Restaurant – 29 Cau May Street"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Nhà hàng A Phủ – 15 Fansipan" : "A Phu Restaurant – 15 Fansipan Street"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Dish 6 */}
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">06</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Thắng cố ngựa truyền thống" : "6. Traditional Thang Co"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Món ẩm thực di sản lâu đời của người Mông được ninh nhừ trong chảo gang lớn từ thịt, xương và nội tạng ngựa cùng 12 vị thảo mộc núi rừng như quế chi, hoa hồi, thảo quả, sả gừng. Thắng cố bốc khói nghi ngút, chấm muối ớt mắt chim và nhấp cùng chén rượu ngô Bản Phố ấm nồng."
                    : "The quintessential centuries-old culinary signature of the H'mong, slow-simmered in large iron woks using horse meat, marrow, and 12 aromatic forest herbs including cinnamon, star anise, and cardamom. Traditionally enjoyed steaming hot with fragrant corn wine."}
                </p>
                <ul className="sp-address-list">
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Quán A Quỳnh – 15 Thạch Sơn" : "A Quynh Restaurant – 15 Thach Son Street"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Thắng cố A Phủ – 15 Fansipan" : "Thang Co A Phu – 15 Fansipan Street"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Dish 7 */}
            <div className="sp-editorial-item">
              <div className="sp-editorial-num">07</div>
              <div className="sp-editorial-body">
                <h4 className="sp-editorial-name">{isVi ? "Cá suối nướng Sa Pa" : "7. Sapa Stream Fish"}</h4>
                <p className="sp-editorial-desc">
                  {isVi
                    ? "Những mẻ cá suối tự nhiên nhỏ bằng ngón tay bắt từ các khe đá suối Mường Hoa, thịt cá bùi ngậy, thơm ngọt và xương mềm giòn tan. Cá được kẹp thanh tre nướng than hoa hoặc chiên vàng ruộm, chấm mắm chanh tỏi ớt ăn kèm rau sống vùng cao."
                    : "Fresh wild stream fish caught from the rock beds of Muong Hoa Stream are small, sweet, and wonderfully tender. Skewered on split bamboo sticks over wood embers or flash-fried until crispy, they are devoured whole with tangy dipping sauce."}
                </p>
                <ul className="sp-address-list">
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Quán Cá Suối Nướng – 15 Fansipan" : "Grilled Stream Fish Restaurant – 15 Fansipan Street"}</span>
                  </li>
                  <li className="sp-address-item">
                    <MapPin size={14} className="sp-address-icon" />
                    <span>{isVi ? "Nhà hàng Chapa – 40 Cầu Mây" : "Chapa Restaurant – 40 Cau May Street"}</span>
                  </li>
                </ul>
              </div>
            </div>

            <figure className="sp-media-figure">
              <img
                src="/guide/sapa/food-stream-fish.jpg"
                alt={isVi ? "Cá suối nướng than hoa Sa Pa giòn rụm" : "Grilled stream fish - Sapa Food Vietnamnomad"}
                className="sp-media-img"
                loading="lazy"
              />
              <figcaption className="sp-media-caption">
                {isVi
                  ? "Cá suối nướng kẹp que tre giòn rụm ngọt thơm đặc sản các dòng suối Sa Pa."
                  : "Crispy grilled stream fish skewered on bamboo sticks, a local highland delicacy."}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ─── 7. FESTIVALS IN SAPA ─── */}
        <section className="sp-section" id="festivals-in-sapa">
          <div className="sp-section-head">
            <span className="sp-section-tag">{isVi ? "LỄ HỘI VÙNG CAO" : "TRADITIONAL FESTIVALS"}</span>
            <h2 className="sp-section-title">
              {isVi ? "Lễ hội truyền thống đặc sắc tại Sa Pa" : "Festivals in Sapa"}
            </h2>
            <p className="sp-section-desc">
              {isVi
                ? "Sa Pa là ngôi nhà chung của 6 dân tộc anh em: Kinh, H'Mông, Dao Đỏ, Tày, Giáy và Xá Phó. Mỗi dân tộc đều lưu giữ những phong tục và ngày hội thiêng liêng rực rỡ sắc màu."
                : "Sapa is home to six ethnic communities: Kinh, H'mong, Red Dao, Tay, Giay, and Xa Pho, each celebrating rich heritage through centuries-old spiritual festivals."}
            </p>
          </div>

          <div className="sp-fest-grid">
            <div className="sp-fest-card">
              <span className="sp-fest-time">{isVi ? "THÁNG GIÊNG ÂM LỊCH" : "1ST LUNAR MONTH"}</span>
              <h4 className="sp-fest-name">{isVi ? "1. Lễ hội Roóng Poọc (Người Giáy)" : "1. Roong Pooc Festival"}</h4>
              <p className="sp-fest-desc">
                {isVi
                  ? "Tổ chức tại bản Tả Van cầu mùa màng bội thu, mưa thuận gió hòa. Ngày hội rộn ràng với các nghi lễ tạ ơn thần linh và trò chơi dân gian ném còn, kéo co, thổi kèn púa độc đáo."
                  : "Celebrated in Ta Van by the Giay people to pray for abundant harvests. The festival features solemn agricultural rituals, con ball-throwing, and lively gong drum performances."}
              </p>
            </div>

            <div className="sp-fest-card">
              <span className="sp-fest-time">{isVi ? "THÁNG 6 ÂM LỊCH" : "6TH LUNAR MONTH"}</span>
              <h4 className="sp-fest-name">{isVi ? "2. Lễ hội Nào Cống" : "2. Nao Cong Festival"}</h4>
              <p className="sp-fest-desc">
                {isVi
                  ? "Đồng bào các dân tộc Mông, Dao, Giáy cùng tề tựu tại miếu thờ Tả Van để dâng lễ tạ ơn thần sông, thần núi, đồng thời thống nhất các quy ước bảo vệ rừng và giữ gìn trật tự bản thôn."
                  : "H'mong, Dao, and Giay communities gather at Ta Van shrine to thank river and mountain deities while reaffirming community forestry charters and mutual harmony."}
              </p>
            </div>

            <div className="sp-fest-card">
              <span className="sp-fest-time">{isVi ? "MÙNG 1 – 2 TẾT NGUYÊN ĐÁN" : "TET HOLIDAYS"}</span>
              <h4 className="sp-fest-name">{isVi ? "3. Lễ hội Tết Nhảy (Người Dao Đỏ)" : "3. Tet Dances Festival"}</h4>
              <p className="sp-fest-desc">
                {isVi
                  ? "Nghi lễ thiêng liêng và công phu của người Dao Tả Phìn, Tả Van diễn ra trong những ngày đầu năm mới với 14 điệu múa truyền thống đặc sắc cầu chúc sức khỏe, an khang và xua đuổi điều dữ."
                  : "An elaborate New Year ritual performed by the Red Dao in Ta Van and Ta Phin, featuring 14 sacred ancestral dance sequences blessing families with peace and vitality."}
              </p>
            </div>

            <div className="sp-fest-card">
              <span className="sp-fest-time">{isVi ? "THÁNG 2 ÂM LỊCH" : "2ND LUNAR MONTH"}</span>
              <h4 className="sp-fest-name">{isVi ? "4. Lễ quét làng (Người Xá Phó)" : "4. Village Sweeping Ceremony"}</h4>
              <p className="sp-fest-desc">
                {isVi
                  ? "Lễ hội độc đáo của người Xá Phó nhằm xua đuổi ma đói và tà khí đầu năm. Dân bản vẽ mặt trang nghiêm, nhảy múa quanh đống lửa cầu cho vật nuôi sinh sôi, lúa thóc đầy bồ."
                  : "A distinctive cleansing rite of the Xa Pho people to ward off misfortunes. Villagers paint symbolic face markings and dance around bonfires to invite harmony."}
              </p>
            </div>

            <div className="sp-fest-card">
              <span className="sp-fest-time">{isVi ? "ĐẦU XUÂN NĂM MỚI" : "EARLY SPRING"}</span>
              <h4 className="sp-fest-name">{isVi ? "5. Lễ hội Gầu Tào (Người Mông)" : "5. Gau Tao Festival"}</h4>
              <p className="sp-fest-desc">
                {isVi
                  ? "Lễ hội lớn nhất của người Mông trên sườn núi để tạ ơn trời đất và cầu mong đường con cái hoặc sức khỏe cho dòng họ, rộn rã tiếng khèn Mông và các cuộc thi bắn nỏ, đẩy gậy hào hứng."
                  : "The largest spiritual gathering of the H'mong community to give thanks and seek blessings for health and children, vibrant with khen flute melodies and crossbow contests."}
              </p>
            </div>

            <div className="sp-fest-card">
              <span className="sp-fest-time">{isVi ? "MÙNG 8 TẾT HÀNG NĂM" : "8TH DAY OF TET"}</span>
              <h4 className="sp-fest-name">{isVi ? "6. Lễ hội Xuống đồng Bản Hồ" : "6. Xuong Dong Festival (Ban Ho)"}</h4>
              <p className="sp-fest-desc">
                {isVi
                  ? "Ngày hội tưng bừng của người Tày và Dao tại xã Bản Hồ với nghi thức rước đất, rước nước cầu mùa, mở đầu bằng các điệu múa xòe duyên dáng và trò chơi dân gian rộn vang thung lũng."
                  : "The joyous spring planting festival of the Tay and Dao in Ban Ho commune, opening with soil and water procession rituals, graceful xoe dances, and tug-of-war."}
              </p>
            </div>
          </div>

          {/* Sapa Love Market Feature Box */}
          <div className="sp-callout">
            <Flame size={24} className="sp-callout-icon" style={{ color: "#d97706" }} />
            <div>
              <h4 className="sp-fest-name" style={{ margin: "0 0 6px 0", color: "#b45309" }}>
                {isVi ? "7. Chợ Tình Sa Pa – Nét Đẹp Văn Hóa Hẹn Hò Vùng Cao" : "7. Sapa Love Market – Highland Courting Tradition"}
              </h4>
              <p className="sp-callout-text" style={{ color: "#92400e" }}>
                {isVi
                  ? "Diễn ra đều đặn vào mỗi tối thứ Bảy hàng tuần bên thềm Nhà thờ đá cổ, Chợ tình Sa Pa là nơi hẹn hò, giao lưu tình cảm của các nam thanh nữ tú trong khắp các bản làng Tây Bắc. Du khách sẽ được đắm chìm trong tiếng khèn lá véo von, những điệu múa ô thổ cẩm xao xuyến lòng người."
                  : "Taking place every Saturday night in the courtyard of the historic Stone Church, Sapa Love Market is a romantic dating tradition for young men and women from surrounding highland hamlets, singing poetic folk songs accompanied by melodic khen panpipes."}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 8. RELATED ARTICLES (EXACTLY 3 ARTICLES IN 1 ROW) ─── */}
        <section className="sp-related-wrap" id="related-articles">
          <h3 className="sp-related-title">
            {isVi ? "Cẩm Nang Du Lịch Liên Quan" : "Related Travel Guides"}
          </h3>
          <div className="sp-related-grid">
            {RELATED_ARTICLES.map((art) => (
              <Link key={art.slug} href={art.path} className="sp-related-card">
                <div className="sp-related-img-wrap">
                  <img
                    src={art.img}
                    alt={isVi ? art.titleVi : art.title}
                    className="sp-related-img"
                    loading="lazy"
                  />
                  <span className="sp-related-badge">{isVi ? art.badgeVi : art.badge}</span>
                </div>
                <div className="sp-related-body">
                  <h4 className="sp-related-heading">{isVi ? art.titleVi : art.title}</h4>
                  <p className="sp-related-desc">{isVi ? art.excerptVi : art.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ProvinceChatbot provinceName="Sa Pa" />
      <PublicFooter />
    </div>
  );
}
