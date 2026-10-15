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
  HelpCircle,
  Waves,
  Sun,
  Bus,
  Plane,
  Utensils,
  ChevronDown,
  ChevronUp,
  Check,
  Shield,
  Anchor,
  Ship,
  Mountain,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/guide-editorial.css";
import "@/styles/ha-long-guide.css";

// ─── RELATED ARTICLES ON VINATAP ───
const RELATED_ARTICLES = [
  {
    slug: "the-complete-guide-to-vietnam",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm Nang Toàn Diện Du Lịch Việt Nam",
    badge: "ESSENTIAL GUIDE",
    badgeVi: "CẨM NANG TOÀN DIỆN",
    excerpt:
      "A complete overview of Vietnam travel essentials, cultural etiquette, regional itineraries, and insider tips.",
    excerptVi:
      "Tổng quan tất cả thông tin quan trọng từ thủ tục, tiền tệ, văn hóa đến lịch trình các miền cho du khách.",
    img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
  },
  {
    slug: "15-best-places-to-visit-in-vietnam-in-2026",
    title: "15 Best Places to Visit in Vietnam in 2026",
    titleVi: "15 Địa Điểm Du Lịch Đẹp Nhất Việt Nam 2026",
    badge: "MUST VISIT",
    badgeVi: "ĐIỂM ĐẾN HÀNG ĐẦU",
    excerpt:
      "Discover the ultimate bucket-list destinations across Vietnam, from Ha Long Bay to Sapa and Hoi An.",
    excerptVi:
      "Khám phá danh sách các điểm đến hàng đầu tại Việt Nam không thể bỏ qua, dẫn đầu bởi Vịnh Hạ Long kỳ vĩ.",
    img: "/guide/15-best-places/place-6-ha-long.jpg",
  },
  {
    slug: "20-best-things-to-do-in-vietnam",
    title: "20 Best Things to Do in Vietnam",
    titleVi: "20 Trải Nghiệm Tuyệt Nhất Tại Việt Nam",
    badge: "EXPERIENCES",
    badgeVi: "TRẢI NGHIỆM ĐỈNH CAO",
    excerpt:
      "From cruising emerald limestone karsts to tasting street food, these are the finest experiences in Vietnam.",
    excerptVi:
      "Từ du thuyền qua đêm trên vịnh Hạ Long đến ẩm thực đường phố, tổng hợp những trải nghiệm tinh hoa nhất.",
    img: "/guide/20-best-things/3-ha-long-bay.jpg",
  },
  {
    slug: "ninh-binh",
    title: "Ninh Binh Travel Guide: Ha Long Bay on Land",
    titleVi: "Cẩm Nang Du Lịch Ninh Bình: Hạ Long Trên Cạn",
    badge: "NEARBY GEM",
    badgeVi: "KỲ QUAN LIÊN KẾT",
    excerpt:
      "Just 3 hours from Ha Long, explore Trang An and Tam Coc karst towers rising above emerald rice fields.",
    excerptVi:
      "Chỉ cách Hạ Long 3 giờ xe, khám phá quần thể di sản Tràng An và Tam Cốc non nước hữu tình.",
    img: "/guide/ninh-binh/hero.jpg",
  },
];

export default function HaLongPage() {
  const [lang, setLang] = useState("vi");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const currentLang = getLang();
    setLang(currentLang || "vi");

    const handleLangChange = () => {
      setLang(getLang() || "vi");
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const isVi = lang === "vi";

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const navPills = [
    { id: "overview", label: isVi ? "Tổng quan" : "Overview" },
    { id: "bays", label: isVi ? "3 Vịnh biển" : "The 3 Bays" },
    { id: "caves-islands", label: isVi ? "Hang động & Đảo" : "Caves & Islands" },
    { id: "experiences", label: isVi ? "Trải nghiệm đỉnh cao" : "Top Experiences" },
    { id: "routes", label: isVi ? "Tuyến tàu tham quan" : "Cruise Routes" },
    { id: "food", label: isVi ? "Ẩm thực hải sản" : "Local Delicacies" },
    { id: "weather", label: isVi ? "Thời điểm lý tưởng" : "Best Time" },
    { id: "transport", label: isVi ? "Di chuyển" : "How to Get There" },
    { id: "itinerary", label: isVi ? "Lịch trình gợi ý" : "Itineraries" },
    { id: "faq", label: isVi ? "Hỏi đáp & Lưu ý" : "Tips & FAQs" },
  ];

  return (
    <div className="halong-page min-h-screen">
      <PublicHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-cyan-600 transition-colors">
            {isVi ? "Trang chủ" : "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href="/destinations"
            className="hover:text-cyan-600 transition-colors"
          >
            {isVi ? "Điểm đến" : "Destinations"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {isVi ? "Vịnh Hạ Long" : "Ha Long Bay"}
          </span>
        </nav>

        {/* Hero Header */}
        <header className="mb-8 md:mb-12">
          <div className="hl-hero-badge">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>
              {isVi
                ? "Di sản Thiên nhiên Thế giới UNESCO • Cẩm nang bản địa 2026"
                : "UNESCO World Natural Heritage • Local Guide 2026"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4 font-serif">
            {isVi
              ? "Cẩm Nang Du Lịch Vịnh Hạ Long: Kỳ Quan Đá Vôi Giữa Biển Ngọc"
              : "A Local's Guide to Ha Long Bay, Vietnam: The Emerald Karst Wonder"}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl mb-6">
            {isVi
              ? "Được vinh danh 2 lần là Di sản Thiên nhiên Thế giới của nhân loại, Vịnh Hạ Long làm say đắm hàng triệu du khách với gần 2.000 hòn đảo đá vôi kỳ vĩ nhô lên từ làn nước xanh ngọc bích, những hang động lung linh hàng triệu năm tuổi và ẩm thực biển nức tiếng."
              : "Ha Long Bay is best known for its magnificent natural limestone formations rising out of emerald waters. Home to an extensive network of prehistoric caves, untouched islets, floating fishing communities, and world-class luxury cruises."}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-500">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Compass className="w-4 h-4 text-cyan-600" />
                VinaTap Travel Editorial
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {isVi ? "Cập nhật Mùa Du Lịch 2026" : "Updated for 2026 Season"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {isVi ? "10 phút đọc chi tiết" : "10 min in-depth read"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
                <Anchor className="w-3.5 h-3.5" />
                {isVi ? "1.969 Hòn Đảo & Vịnh" : "1,969 Islands & Karsts"}
              </span>
            </div>
          </div>
        </header>

        {/* Hero Featured Image */}
        <div className="hl-hero-img-wrap">
          <img
            src="/guide/ha-long/hero-halong.jpg"
            alt={isVi ? "Toàn cảnh Vịnh Hạ Long nhìn từ đảo Ti Tốp" : "Panoramic view of Ha Long Bay from Ti Top Island"}
            className="hl-hero-img"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 text-white pointer-events-none">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/80 backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-2">
              {isVi ? "Góc Nhìn Biểu Tượng" : "Iconic Vantage Point"}
            </span>
            <p className="text-sm md:text-base text-slate-200 font-medium max-w-2xl">
              {isVi
                ? "Toàn cảnh Vịnh Hạ Long ngập tràn sắc ngọc bích với hàng trăm đảo đá và du thuyền buồm lướt êm đềm."
                : "The emerald panorama of Ha Long Bay with karst towers and traditional wooden junks gliding peacefully."}
            </p>
          </div>
        </div>

        {/* Quick Snapshot Box */}
        <div className="hl-snapshot-box">
          <div className="hl-snapshot-title">
            <Anchor className="w-5 h-5 text-cyan-600" />
            <span>
              {isVi ? "Thông Tin Cốt Lõi Vịnh Hạ Long" : "Ha Long Bay At A Glance"}
            </span>
          </div>
          <div className="hl-snapshot-grid">
            <div className="hl-snapshot-item">
              <MapPin className="hl-snapshot-icon w-5 h-5" />
              <div>
                <strong>{isVi ? "Vị trí địa lý:" : "Geographic Location:"}</strong>
                <p>
                  {isVi
                    ? "Tỉnh Quảng Ninh, miền Bắc Việt Nam, cách trung tâm Thủ đô Hà Nội 155km (khoảng 2.5 giờ cao tốc)."
                    : "Quang Ninh Province, North Vietnam, located 155km east of Hanoi (approx. 2.5 hours via expressway)."}
                </p>
              </div>
            </div>
            <div className="hl-snapshot-item">
              <Mountain className="hl-snapshot-icon w-5 h-5" />
              <div>
                <strong>{isVi ? "Quy mô kỳ quan:" : "Natural Scale:"}</strong>
                <p>
                  {isVi
                    ? "Tổng cộng 1.969 hòn đảo đá vôi, vùng lõi di sản 434 km² với 775 đảo được bảo vệ nghiêm ngặt."
                    : "1,969 limestone islets, with a protected UNESCO core zone of 434 km² hosting 775 islands."}
                </p>
              </div>
            </div>
            <div className="hl-snapshot-item">
              <Sun className="hl-snapshot-icon w-5 h-5" />
              <div>
                <strong>{isVi ? "Thời điểm vàng:" : "Best Seasons:"}</strong>
                <p>
                  {isVi
                    ? "Tháng 9 – 11 (Thu mát mẻ, trời trong) và Tháng 3 – 5 (Xuân ấm áp, biển êm, hoa nở rộ)."
                    : "Sept – Nov (crisp clear skies, calm sea) & March – May (mild warmth, prime kayaking)."}
                </p>
              </div>
            </div>
            <div className="hl-snapshot-item">
              <Ship className="hl-snapshot-icon w-5 h-5" />
              <div>
                <strong>{isVi ? "Cách trải nghiệm chuẩn:" : "Best Way to Explore:"}</strong>
                <p>
                  {isVi
                    ? "Du thuyền qua đêm 2N1Đ hoặc 3N2Đ kết hợp chèo kayak Hang Luồn và ngắm bình minh trên vịnh."
                    : "Overnight cruise (2D1N or 3D2N) paired with Luon Cave kayaking and sunrise Tai Chi on sundeck."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Nav Pills */}
        <div className="hl-nav-pills-wrap">
          <div className="hl-nav-pills">
            {navPills.map((pill) => (
              <a
                key={pill.id}
                href={`#${pill.id}`}
                className={`hl-nav-pill ${activeSection === pill.id ? "active" : ""}`}
                onClick={() => setActiveSection(pill.id)}
              >
                {pill.label}
              </a>
            ))}
          </div>
        </div>

        {/* SECTION 1: OVERVIEW & GEOGRAPHY */}
        <section id="overview" className="hl-section">
          <h2 className="hl-section-title">
            <Compass className="w-6 h-6 text-cyan-600" />
            {isVi ? "1. Tổng Quan & Nguồn Gốc Tên Gọi Hạ Long" : "1. Overview & The Legend of the Descending Dragon"}
          </h2>
          <div className="hl-section-desc">
            <p className="mb-4">
              {isVi
                ? "Theo truyền thuyết dân gian nghìn đời, tên gọi 'Hạ Long' mang ý nghĩa thiêng liêng là 'Nơi Rồng đáp xuống'. Khi đất nước mới dựng xây bị giặc ngoại xâm phương Bắc đe dọa, Ngọc Hoàng đã phái Rồng Mẹ mang theo đàn Rồng Con giáng trần cứu giúp. Rồng đã phun ra vô số viên ngọc châu báu, khi chạm mặt biển liền hóa thành ngàn vạn hòn đảo đá xanh sừng sững như bức tường thành vững chãi đánh tan thuyền giặc, giữ yên bờ cõi non sông."
                : "In Vietnamese folklore, 'Ha Long' translates poetically to 'Where the Dragon Descends into the Sea.' Legend tells that when the ancient Vietnamese kingdom was invaded from the north, the Jade Emperor sent a mother dragon and her divine children to assist. They spat out jewels and jade that transformed into thousands of limestone towers, forming an impenetrable maritime fortress against enemy naval fleets."}
            </p>
            <p className="mb-4">
              {isVi
                ? "Về mặt địa chất học, Vịnh Hạ Long là kết quả của hơn 500 triệu năm kiến tạo địa chất và tiến hóa Karst nhiệt đới. Nơi đây trải qua các chu kỳ biển tiến thoái liên tiếp tạo nên cảnh quan Karst đá vôi kỳ vĩ nhất thế giới, được UNESCO công nhận là Di sản Thiên nhiên Thế giới năm 1994 về giá trị thẩm mỹ và năm 2000 về giá trị địa chất địa mạo. Đến năm 2023, ranh giới di sản được mở rộng bao gồm cả Quần đảo Cát Bà (Hải Phòng), tạo nên quần thể di sản thiên nhiên liên tỉnh đầu tiên tại Việt Nam."
                : "Geologically, Ha Long Bay represents over 500 million years of plate tectonic shifts and tropical karst landscape evolution. Repeated marine transgressions and regressions sculpted this magnificent karst towers seascape—recognized by UNESCO in 1994 for outstanding aesthetic beauty and in 2000 for geomorphology. In 2023, UNESCO officially expanded the heritage site to encompass the adjoining Cat Ba Archipelago, cementing its status as Vietnam's premier natural wonder."}
            </p>
          </div>

          <div className="hl-callout">
            <Shield className="hl-callout-icon w-6 h-6" />
            <div>
              <strong>{isVi ? "Chính sách du lịch bền vững tại Vịnh Hạ Long:" : "Eco-Tourism Policy & Single-Use Plastic Ban:"}</strong>
              <p className="mt-1">
                {isVi
                  ? "Từ năm 2019, Ban Quản lý Vịnh Hạ Long đã áp dụng nghiêm ngặt lệnh cấm du khách mang rác thải nhựa dùng một lần (như túi ni lông, chai nước nhựa dùng 1 lần) xuống tàu du lịch. Du khách vui lòng chuẩn bị bình nước cá nhân để cùng chung tay bảo vệ môi trường biển ngọc nguyên sơ."
                  : "Since 2019, the Ha Long Bay Management Board has strictly enforced a zero single-use plastic policy for all tour and cruise vessels. Single-use plastic bottles, straws, and plastic bags are banned onboard. Travelers are encouraged to bring reusable water tumblers."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE 3 BAYS */}
        <section id="bays" className="hl-section">
          <h2 className="hl-section-title">
            <Waves className="w-6 h-6 text-cyan-600" />
            {isVi ? "2. Ba Vịnh Biển Kỳ Vĩ: Hạ Long, Bái Tử Long & Lan Hạ" : "2. The Three Bays: Ha Long, Bai Tu Long & Lan Ha"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Đa số du khách quốc tế thường chỉ biết đến cái tên 'Hạ Long', nhưng trên thực tế vịnh biển này gồm 3 khu vực liền kề với đặc trưng địa hình và trải nghiệm rất khác nhau. Tùy thuộc vào thời gian và gu du lịch, bạn có thể lựa chọn hành trình phù hợp nhất:"
                : "While most international travelers know 'Ha Long', the broader Gulf of Tonkin seascape comprises three interconnected bays, each offering distinct vibes, cruising routes, and crowd density:"}
            </p>
          </div>

          <div className="hl-bays-grid">
            {/* Bay 1 */}
            <div className="hl-bay-card">
              <div className="hl-bay-header">
                <span className="hl-bay-badge">{isVi ? "Trọng Tâm Di Sản" : "Core Heritage"}</span>
                <h3 className="hl-bay-title">{isVi ? "Vịnh Hạ Long (Vùng Lõi)" : "Ha Long Bay (Core Zone)"}</h3>
              </div>
              <div className="hl-bay-body">
                <p className="hl-bay-desc">
                  {isVi
                    ? "Nơi tập trung những hang động tráng lệ nhất và các hòn đảo mang tính biểu tượng lịch sử quốc tế như Hang Sửng Sốt, đảo Ti Tốp, Động Thiên Cung và Hòn Trống Mái."
                    : "The world-famous heartland featuring the biggest limestone caverns and legendary landmarks such as Sung Sot Cave, Ti Top Island, and the iconic Fighting Cocks Islet."}
                </p>
                <ul className="hl-bay-highlights">
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Mật độ đảo đá vôi dày đặc nhất" : "Highest density of karst pillars"}</li>
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Phù hợp cả tour trong ngày lẫn qua đêm" : "Ideal for both day cruises & overnight trips"}</li>
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Nhiều dịch vụ tiện ích, tàu du thuyền đa dạng" : "Vast selection of 3-star to 5-star vessels"}</li>
                </ul>
              </div>
            </div>

            {/* Bay 2 */}
            <div className="hl-bay-card">
              <div className="hl-bay-header">
                <span className="hl-bay-badge">{isVi ? "Yên Bình & Nguyên Sơ" : "Pristine & Quiet"}</span>
                <h3 className="hl-bay-title">{isVi ? "Vịnh Bái Tử Long" : "Bai Tu Long Bay"}</h3>
              </div>
              <div className="hl-bay-body">
                <p className="hl-bay-desc">
                  {isVi
                    ? "Nằm ở phía đông bắc Vịnh Hạ Long, Bái Tử Long mang vẻ đẹp thanh bình tĩnh lặng, ít tàu bè đông đúc hơn, lý tưởng cho những ai thích hòa mình vào thiên nhiên khoáng đạt."
                    : "Located to the northeast of Ha Long, Bai Tu Long is secluded and noticeably less crowded, preserving unspoiled limestone islands and authentic floating hamlets."}
                </p>
                <ul className="hl-bay-highlights">
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Làng chài nổi Vung Viêng cổ kính" : "Ancient Vung Vieng floating village"}</li>
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Hang Thiên Cảnh Sơn hoang sơ" : "Pristine Thien Canh Son Cave"}</li>
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Không gian yên tĩnh tuyệt đối về đêm" : "Complete tranquility under star-lit skies"}</li>
                </ul>
              </div>
            </div>

            {/* Bay 3 */}
            <div className="hl-bay-card">
              <div className="hl-bay-header">
                <span className="hl-bay-badge">{isVi ? "Thiên Đường Chèo Kayak" : "Kayaking Paradise"}</span>
                <h3 className="hl-bay-title">{isVi ? "Vịnh Lan Hạ (Cát Bà)" : "Lan Ha Bay (Cat Ba)"}</h3>
              </div>
              <div className="hl-bay-body">
                <p className="hl-bay-desc">
                  {isVi
                    ? "Nằm phía nam vịnh Hạ Long giáp ranh đảo Cát Bà, Lan Hạ sở hữu hơn 139 bãi cát vàng tự nhiên nhỏ nép mình dưới chân vách đá, cực kỳ lý tưởng để chèo kayak và tắm biển."
                    : "Situated south of Ha Long bordering Cat Ba Island, Lan Ha boasts 139 secluded white sandy beaches at the foot of karst cliffs, making it the supreme kayaking zone."}
                </p>
                <ul className="hl-bay-highlights">
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Hang Sáng Tối (Dark & Bright Cave)" : "Dark & Bright Cave kayak lagoon"}</li>
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "Làng Việt Hải & Vườn quốc gia Cát Bà" : "Viet Hai village & Cat Ba National Park"}</li>
                  <li><Check className="w-4 h-4 text-cyan-600" /> {isVi ? "139 bãi tắm nhỏ hoang sơ tự nhiên" : "Over 130 natural cove beaches"}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CAVES & ISLANDS */}
        <section id="caves-islands" className="hl-section">
          <h2 className="hl-section-title">
            <Mountain className="w-6 h-6 text-cyan-600" />
            {isVi ? "3. Những Hang Động & Hòn Đảo Biểu Tượng" : "3. Iconic Caves, Grottoes & Scenic Islands"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Bên trong các vách núi đá vôi đồ sộ giữa lòng vịnh là cả một thế giới thạch nhũ lung linh huyền ảo được hình thành qua hàng triệu năm giọt nước tích tụ. Dưới đây là những điểm dừng chân đắt giá nhất bạn không nên bỏ lỡ:"
                : "Beneath the soaring limestone towers lie mesmerizing underground caverns sculpted by dripping mineral-rich waters over geological epochs. Here are Ha Long Bay's most celebrated caves and islands:"}
            </p>
          </div>

          <div className="hl-cards-grid">
            {/* Sung Sot Cave */}
            <div className="hl-card">
              <div className="hl-card-img-wrap">
                <img
                  src="/guide/ha-long/sung-sot-cave.jpg"
                  alt={isVi ? "Hang Sửng Sốt Vịnh Hạ Long" : "Sung Sot Surprise Cave Ha Long Bay"}
                  className="hl-card-img"
                  loading="lazy"
                />
                <span className="hl-card-tag">{isVi ? "Hang Lớn Nhất" : "Largest Cave"}</span>
              </div>
              <div className="hl-card-body">
                <h3 className="hl-card-title">{isVi ? "Hang Sửng Sốt (Surprise Cave)" : "Sung Sot Cave (Surprise Cave)"}</h3>
                <p className="hl-card-desc">
                  {isVi
                    ? "Tọa lạc trên đảo Bồ Hòn, đây là hang động rộng lớn và lộng lẫy bậc nhất Vịnh Hạ Long. Lối vào dốc quanh co dưới vòm cây rừng rậm rạp dẫn tới 2 gian phòng rộng thênh thang hàng nghìn mét vuông với vô số măng đá nhũ đá sống động khiến người Pháp thời xưa phải thốt lên 'Grotte des Surprises'."
                    : "Located on Bo Hon Island, this is the grandest and most spectacular cavern in Ha Long Bay. Visitors climb stone steps shaded by jungle canopy into two immense chambers illuminated by soft ambient lighting, showcasing towering stalagmite pillars."}
                </p>
                <div className="hl-card-meta">
                  <span>📍 {isVi ? "Đảo Bồ Hòn" : "Bo Hon Island"}</span>
                  <span>⭐ {isVi ? "Tuyến tàu số 2" : "Route 2 Cruise"}</span>
                </div>
              </div>
            </div>

            {/* Ti Top Island */}
            <div className="hl-card">
              <div className="hl-card-img-wrap">
                <img
                  src="/guide/ha-long/ti-top-island.jpg"
                  alt={isVi ? "Đảo Ti Tốp Vịnh Hạ Long" : "Ti Top Island Ha Long Bay"}
                  className="hl-card-img"
                  loading="lazy"
                />
                <span className="hl-card-tag">{isVi ? "Góc Nhìn 360°" : "Panoramic View"}</span>
              </div>
              <div className="hl-card-body">
                <h3 className="hl-card-title">{isVi ? "Đảo Ti Tốp (Ti Top Island & Beach)" : "Ti Top Island & Crescent Beach"}</h3>
                <p className="hl-card-desc">
                  {isVi
                    ? "Được Bác Hồ và nhà du hành vũ trụ Liên Xô Gherman Titov ghé thăm năm 1962. Hòn đảo nổi tiếng với bãi tắm cát trắng mịn hình vầng trăng khuyết và đài quan sát trên đỉnh núi (leo hơn 400 bậc thang đá) cho góc nhìn 360 độ toàn cảnh vịnh Hạ Long hùng vĩ."
                    : "Named in 1962 to honor Soviet astronaut Gherman Titov during his visit with President Ho Chi Minh. It features a crescent-shaped white sand beach and a 400-step stone stairway leading to a summit gazebo with the most famous 360-degree vista of the bay."}
                </p>
                <div className="hl-card-meta">
                  <span>🏖️ {isVi ? "Tắm biển & Leo núi" : "Beach & Hiking"}</span>
                  <span>⭐ {isVi ? "Tuyến tàu số 2" : "Route 2 Cruise"}</span>
                </div>
              </div>
            </div>

            {/* Luon Cave Kayaking */}
            <div className="hl-card">
              <div className="hl-card-img-wrap">
                <img
                  src="/guide/ha-long/kayak-luon-cave.jpg"
                  alt={isVi ? "Chèo thuyền Kayak Hang Luồn" : "Luon Cave Kayaking Ha Long Bay"}
                  className="hl-card-img"
                  loading="lazy"
                />
                <span className="hl-card-tag">{isVi ? "Chèo Kayak" : "Kayaking Hub"}</span>
              </div>
              <div className="hl-card-body">
                <h3 className="hl-card-title">{isVi ? "Hang Luồn (Luon Cave Lagoon)" : "Luon Cave & Emerald Lagoon"}</h3>
                <p className="hl-card-desc">
                  {isVi
                    ? "Hang Luồn là một vòm hang đá vôi sát mép nước dài khoảng 60m. Đi qua vòm hang bằng thuyền nan hoặc kayak, bạn sẽ bước vào một hồ nước tròn tĩnh lặng phẳng như gương, bao bọc bởi vách đá dựng đứng nơi đàn khỉ vàng tự nhiên sinh sống trên cành cây."
                    : "A water-level limestone archway 60m long leading into a completely enclosed circular lagoon surrounded by steep cliffs. Accessible only by kayak or traditional bamboo sampan rowed by local fishermen, where wild monkeys swing from cliffside branches."}
                </p>
                <div className="hl-card-meta">
                  <span>🛶 {isVi ? "Kayak / Thuyền nan" : "Kayak / Sampan"}</span>
                  <span>🐒 {isVi ? "Khỉ vàng hoang dã" : "Wild Monkeys"}</span>
                </div>
              </div>
            </div>

            {/* Thien Cung Cave */}
            <div className="hl-card">
              <div className="hl-card-img-wrap">
                <img
                  src="/guide/ha-long/limestone-karsts.jpg"
                  alt={isVi ? "Động Thiên Cung Hạ Long" : "Thien Cung Heavenly Palace Cave"}
                  className="hl-card-img"
                  loading="lazy"
                />
                <span className="hl-card-tag">{isVi ? "Cung Điện Nhà Trời" : "Heavenly Palace"}</span>
              </div>
              <div className="hl-card-body">
                <h3 className="hl-card-title">{isVi ? "Động Thiên Cung (Heavenly Palace Cave)" : "Thien Cung Cave (Heavenly Palace)"}</h3>
                <p className="hl-card-desc">
                  {isVi
                    ? "Nằm trên đảo Đầu Gỗ, động Thiên Cung được ví như cung điện lộng lẫy dưới lòng đất với truyền thuyết đám cưới của Vua Rồng. Các dải thạch nhũ buông rủ tạo thành những bức rèm đá, cột chống trời khổng lồ và hình tượng linh vật sống động."
                    : "Located on Dau Go Island, Thien Cung cave is celebrated for its ethereal curtain-like stalactite formations and the legend of the Dragon King's wedding. Excellent walking paths and multi-colored lighting illuminate mystical geological sculptures."}
                </p>
                <div className="hl-card-meta">
                  <span>📍 {isVi ? "Đảo Đầu Gỗ" : "Dau Go Island"}</span>
                  <span>⭐ {isVi ? "Tuyến tàu số 1" : "Route 1 Cruise"}</span>
                </div>
              </div>
            </div>

            {/* Dau Go Cave */}
            <div className="hl-card">
              <div className="hl-card-img-wrap">
                <img
                  src="/guide/ha-long/cruise-bay.jpg"
                  alt={isVi ? "Hang Đầu Gỗ Lịch Sử" : "Dau Go Cave of Wonders"}
                  className="hl-card-img"
                  loading="lazy"
                />
                <span className="hl-card-tag">{isVi ? "Di Tích Lịch Sử" : "Historic Cave"}</span>
              </div>
              <div className="hl-card-body">
                <h3 className="hl-card-title">{isVi ? "Hang Đầu Gỗ (Cave of Wonders)" : "Dau Go Cave (Cave of Wooden Stakes)"}</h3>
                <p className="hl-card-desc">
                  {isVi
                    ? "Gắn liền với chiến tích đánh tan giặc Nguyên Mông trên sông Bạch Đằng năm 1288 của Quốc công Tiết chế Trần Hưng Đạo. Nơi đây từng là nơi cất giấu những cây cọc gỗ lim bịt sắt trước khi cắm xuống lòng sông lập nên chiến thắng hiển hách."
                    : "Steeped in 13th-century military history, this cave is associated with National Hero Tran Hung Dao, who concealed iron-tipped wooden stakes here before deploying them into the Bach Dang River to crush the invading Mongol naval fleet in 1288."}
                </p>
                <div className="hl-card-meta">
                  <span>⚔️ {isVi ? "Thế kỷ XIII" : "13th Century"}</span>
                  <span>⭐ {isVi ? "Tuyến tàu số 1" : "Route 1 Cruise"}</span>
                </div>
              </div>
            </div>

            {/* Hon Trong Mai */}
            <div className="hl-card">
              <div className="hl-card-img-wrap">
                <img
                  src="/guide/vietnam/dest-6-halong.jpg"
                  alt={isVi ? "Hòn Trống Mái Hòn Gà Chọi" : "Fighting Cocks Islet Trong Mai"}
                  className="hl-card-img"
                  loading="lazy"
                />
                <span className="hl-card-tag">{isVi ? "Biểu Tượng Du Lịch" : "National Symbol"}</span>
              </div>
              <div className="hl-card-body">
                <h3 className="hl-card-title">{isVi ? "Hòn Trống Mái (Hòn Gà Chọi)" : "Fighting Cocks Islet (Hon Trong Mai)"}</h3>
                <p className="hl-card-desc">
                  {isVi
                    ? "Biểu tượng bất hủ của du lịch Vịnh Hạ Long và Việt Nam. Hai phiến đá cao chừng 12 mét có hình thù như đôi gà chọi đang đứng đối mặt chụm mỏ giữa biển khơi bao la, đứng vững trước bao sóng gió ngàn năm."
                    : "The quintessential trademark silhouette of Ha Long Bay and Vietnam tourism. Two limestone pinnacles rising 12 meters above sea level resembling a rooster and a hen facing each other with affectionate defiance against open waves."}
                </p>
                <div className="hl-card-meta">
                  <span>📷 {isVi ? "Điểm check-in kinh điển" : "Classic Photo Stop"}</span>
                  <span>⭐ {isVi ? "Cả Tuyến 1 & 2" : "Routes 1 & 2"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: TOP EXPERIENCES */}
        <section id="experiences" className="hl-section">
          <h2 className="hl-section-title">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            {isVi ? "4. Những Trải Nghiệm Đỉnh Cao Không Thể Bỏ Lỡ" : "4. Unforgettable Experiences on the Bay"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Đến với Vịnh Hạ Long, vẻ đẹp không chỉ nằm ở việc ngắm nhìn từ xa, mà chính là cảm giác sống trọn vẹn từng khoảnh khắc giữa lòng di sản:"
                : "Visiting Ha Long is not merely sightseeing from afar; it is immersing your senses into the rhythm of the emerald tides:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Ship className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {isVi ? "Du Thuyền Nghỉ Đêm 5 Sao (Overnight Cruise)" : "5-Star Luxury Overnight Cruising"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? "Trải nghiệm được du khách quốc tế đánh giá cao nhất. Thưởng thức bữa tối hải sản dưới ánh nến, ngắm hoàng hôn dát vàng trên vịnh, ngủ đêm giữa làn nước phẳng lặng và thức dậy đón sương sớm trên sundeck."
                    : "Ranked as the quintessential Vietnam experience. Savor gourmet dining, watch flaming sunsets over limestone silhouettes, sleep anchored in serene bays, and wake up to misty mornings."}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {isVi ? "Tự Tay Chèo Thuyền Kayak Giữa Khe Núi" : "Self-Guided Kayaking into Hidden Lagoons"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? "Chỉ có chiếc kayak nhỏ bé mới giúp bạn luồn lách qua các vòm hang hàm ếch thấp, chạm tay vào vách đá phủ rêu phong hàng triệu năm và tiến vào những vịnh kín không một bóng tàu lớn."
                    : "Only a small kayak can navigate underneath low limestone grottoes to access hidden lagoons untouched by larger motor vessels, letting you touch millenia-old karst stone walls."}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {isVi ? "Bay Thủy Phi Cơ Hải Âu Ngắm Vịnh Từ Trên Cao" : "Scenic Seaplane Flights (Hai Au Aviation)"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? "Chuyến bay ngắm cảnh 25 phút cất cánh và hạ cánh ngay trên mặt nước tại cảng Tuần Châu, mang lại góc nhìn ngoạn mục như tranh thủy mặc từ độ cao 300 mét."
                    : "A thrilling 25-minute scenic flight taking off and landing directly on water at Tuan Chau Marina, offering cinematic bird's-eye views of 2,000 karst peaks from 300 meters above."}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {isVi ? "Tập Thái Cực Quyền & Câu Mực Đêm" : "Morning Tai Chi & Night Squid Fishing"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? "Bắt đầu ngày mới bằng bài tập Thái Cực Quyền (Tai Chi) thanh tịnh khi mặt trời vừa ló rạng trên boong tàu; buổi tối trải nghiệm buông cần câu mực lấp lánh dưới ánh đèn đêm."
                    : "Begin the morning with peaceful Tai Chi exercises on the sundeck as the dawn mist clears, and test your luck at night jigging for live cuttlefish under deck floodlights."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CRUISE ROUTES & PORTS */}
        <section id="routes" className="hl-section">
          <h2 className="hl-section-title">
            <Anchor className="w-6 h-6 text-cyan-600" />
            {isVi ? "5. Các Tuyến Tàu Tham Quan & Cảng Quốc Tế" : "5. Sightseeing Routes & Departure Ports"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Tàu tham quan vịnh trong ngày và du thuyền ngủ đêm xuất bến chủ yếu từ 2 cảng biển quốc tế hiện đại bậc nhất Việt Nam: Cảng Tàu Khách Quốc Tế Tuần Châu (Tuan Chau Marina) và Cảng Tàu Khách Quốc Tế Hạ Long (Hạ Long Sun Group Port ngay trung tâm Bãi Cháy)."
                : "Sightseeing day boats and overnight luxury cruises depart from two world-class maritime ports: Tuan Chau International Marina and Ha Long International Cruise Port (situated right by Bai Chay beach center)."}
            </p>
          </div>

          <div className="hl-routes-grid">
            {/* Route 1 */}
            <div className="hl-route-card">
              <span className="hl-route-badge">{isVi ? "Tuyến 4 Tiếng Trong Ngày" : "4-Hour Day Trip"}</span>
              <h3 className="hl-route-title">{isVi ? "Tuyến 1: Thiên Cung – Đầu Gỗ – Trống Mái" : "Route 1: Thien Cung – Dau Go – Fighting Cocks"}</h3>
              <div className="hl-route-time">
                <Clock className="w-4 h-4 text-cyan-600" />
                <span>{isVi ? "Thời gian: 3.5 – 4 giờ • Khởi hành sáng/chiều" : "Duration: 3.5 – 4 hours • Morning/Afternoon"}</span>
              </div>
              <ul className="hl-route-stops">
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Khám phá Động Thiên Cung lung linh" : "Tour Thien Cung (Heavenly Palace) Cave"}</li>
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Tham quan Hang Đầu Gỗ lịch sử thế kỷ XIII" : "Visit historical Dau Go Cave"}</li>
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Chiêm ngưỡng Hòn Chó Đá, Hòn Đỉnh Hương (in trên tờ tiền 200.000đ)" : "Admire Stone Dog & Dinh Huong Islet (on the 200k VND note)"}</li>
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Check-in Hòn Trống Mái biểu tượng" : "Photo stop at iconic Fighting Cocks Islet"}</li>
              </ul>
              <div className="text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                {isVi ? "💡 Phù hợp du khách ít thời gian hoặc đi cùng người cao tuổi, trẻ nhỏ." : "💡 Ideal for travelers with tight schedules or families with toddlers."}
              </div>
            </div>

            {/* Route 2 */}
            <div className="hl-route-card popular">
              <span className="hl-route-badge">{isVi ? "Tuyến Kinh Điển 6H & Qua Đêm" : "Popular 6-Hour & Overnight"}</span>
              <h3 className="hl-route-title">{isVi ? "Tuyến 2: Sửng Sốt – Ti Tốp – Hang Luồn" : "Route 2: Sung Sot – Ti Top – Luon Cave"}</h3>
              <div className="hl-route-time">
                <Clock className="w-4 h-4 text-cyan-600" />
                <span>{isVi ? "Thời gian: 6 giờ (trong ngày) hoặc 2N1Đ / 3N2Đ" : "Duration: 6 hours (day) or 2D1N / 3D2N Cruise"}</span>
              </div>
              <ul className="hl-route-stops">
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Thám hiểm Hang Sửng Sốt – hang lớn nhất vịnh" : "Trek through magnificent Sung Sot (Surprise) Cave"}</li>
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Leo đỉnh Ti Tốp ngắm toàn cảnh 360 độ và tắm biển" : "Hike Ti Top peak for 360° panoramic view & swim at beach"}</li>
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Chèo thuyền Kayak hoặc thuyền nan vào Hang Luồn" : "Kayak or row bamboo boat into serene Luon Cave lagoon"}</li>
                <li><Check className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" /> {isVi ? "Ngắm Hang Bồ Nâu và vùng lõi di sản sâu" : "Sail past Bo Nau Cave and deep karst valleys"}</li>
              </ul>
              <div className="text-xs text-cyan-700 dark:text-cyan-300 font-medium border-t border-cyan-100 dark:border-cyan-900 pt-3">
                {isVi ? "⭐ Tuyến tham quan đẹp nhất và được 90% du khách lựa chọn." : "⭐ The most complete route chosen by 90% of international visitors."}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: LOCAL FOOD */}
        <section id="food" className="hl-section">
          <h2 className="hl-section-title">
            <Utensils className="w-6 h-6 text-cyan-600" />
            {isVi ? "6. Ẩm Thực Biển Hạ Long Phải Thử" : "6. Ha Long Culinary Delights: Fresh From The Sea"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Quảng Ninh được thiên nhiên ban tặng vùng biển nước lợ phong phú, tạo nên những sản vật hải sản có độ ngọt bùi đậm đà khác biệt với bất kỳ vùng biển nào khác trên dải đất chữ S:"
                : "Thanks to the nutrient-rich brackish waters of the Gulf of Tonkin, Ha Long seafood boasts an unmatched natural sweetness and firmness celebrated across Vietnam:"}
            </p>
          </div>

          <div className="hl-food-grid">
            {/* Food 1 */}
            <div className="hl-food-card">
              <div className="hl-food-img-wrap">
                <img
                  src="/guide/ha-long/cha-muc-halong.jpg"
                  alt={isVi ? "Chả mực giã tay Hạ Long" : "Ha Long Hand-Pounded Squid Cakes"}
                  className="hl-food-img"
                  loading="lazy"
                />
              </div>
              <div className="hl-food-body">
                <h3 className="hl-food-title">{isVi ? "Chả Mực Giã Tay Hạ Long" : "Hand-Pounded Squid Cakes (Chả Mực)"}</h3>
                <p className="hl-food-desc">
                  {isVi
                    ? "Món đặc sản quốc hồn quốc túy đứng top ẩm thực châu Á. Mực nang tươi rói đánh bắt trong vịnh được giã hoàn toàn bằng tay trong cối đá để giữ nguyên độ giòn sần sật, chiên vàng ươm thơm nức mũi, ăn kèm bánh cuốn hoặc xôi trắng."
                    : "The undisputed culinary icon of Ha Long. Fresh thick-fleshed cuttlefish is pounded by hand in stone mortars to preserve crunchy texture, seasoned with crushed pepper, then fried into golden patties served with steamed rice rolls."}
                </p>
                <span className="hl-food-spots">{isVi ? "📍 Bánh cuốn chả mực bà Ngân, Chợ Hạ Long 1" : "📍 Ba Ngan Banh Cuon, Ha Long 1 Market"}</span>
              </div>
            </div>

            {/* Food 2 */}
            <div className="hl-food-card">
              <div className="hl-food-img-wrap">
                <img
                  src="/guide/ha-long/hero-halong.jpg"
                  alt={isVi ? "Bún Bề Bề Hạ Long" : "Mantis Shrimp Noodle Soup"}
                  className="hl-food-img"
                  loading="lazy"
                />
              </div>
              <div className="hl-food-body">
                <h3 className="hl-food-title">{isVi ? "Bún Bề Bề (Tôm Tít)" : "Mantis Shrimp Noodle Soup (Bún Bề Bề)"}</h3>
                <p className="hl-food-desc">
                  {isVi
                    ? "Bát bún nóng hổi với nước dùng nấu từ ghẹ biển, tôm và bề bề tươi rói ngọt lịm tự nhiên, kèm thịt bề bề bóc nõn trắng phao, chả cá mực và rau cải xanh tươi mát."
                    : "A fragrant noodle bowl featuring rich broth simmered from crabs and whole mantis shrimps, topped with succulent peeled mantis shrimp meat, fried squid cake slices, and fresh greens."}
                </p>
                <span className="hl-food-spots">{isVi ? "📍 Bún bề bề Loan Thúy Bãi Cháy, Đông Bắc" : "📍 Loan Thuy Mantis Shrimp, Bai Chay"}</span>
              </div>
            </div>

            {/* Food 3 */}
            <div className="hl-food-card">
              <div className="hl-food-img-wrap">
                <img
                  src="/guide/ha-long/cruise-bay.jpg"
                  alt={isVi ? "Sá Sùng Quan Lạn" : "Sa Sung Peanut Worms"}
                  className="hl-food-img"
                  loading="lazy"
                />
              </div>
              <div className="hl-food-body">
                <h3 className="hl-food-title">{isVi ? "Sá Sùng Quan Lạn" : "Peanut Worms (Sá Sùng)"}</h3>
                <p className="hl-food-desc">
                  {isVi
                    ? "Đặc sản 'đắt như vàng ròng' của vùng biển Vân Đồn và đảo Quan Lạn. Sá sùng tươi xào tỏi giòn ngọt, hoặc sá sùng khô rang vàng giòn rụm làm mồi nhắm thượng hạng và là bí quyết nấu nước dùng phở truyền thống."
                    : "Regarded as 'coastal gold', this rare delicacy from Quan Lan Island yields intense natural umami. Fresh sa sung is stir-fried with wild garlic, while dried sa sung is roasted crispy as a luxury delicacy."}
                </p>
                <span className="hl-food-spots">{isVi ? "📍 Nhà hàng Cua Vàng Bãi Cháy, Hồng Hạnh" : "📍 Cua Vang Luxury Seafood, Hong Hanh"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: WEATHER & BEST TIME */}
        <section id="weather" className="hl-section">
          <h2 className="hl-section-title">
            <Sun className="w-6 h-6 text-cyan-600" />
            {isVi ? "7. Thời Điểm Du Lịch Đẹp Nhất Trong Năm" : "7. Best Time to Visit Ha Long Bay"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Vịnh Hạ Long có khí hậu 4 mùa rõ rệt của miền Bắc. Mỗi mùa mang một nét quyến rũ riêng, nhưng nếu muốn săn được những bức ảnh vịnh biển trong trẻo nhất:"
                : "Northern Vietnam experiences four distinct seasons. While Ha Long Bay is an all-year destination, weather patterns greatly influence cruising visibility and kayaking conditions:"}
            </p>
          </div>

          <div className="hl-season-grid">
            <div className="hl-season-card best">
              <span className="hl-season-badge">{isVi ? "Thời Điểm Vàng" : "Peak Golden Season"}</span>
              <h3 className="hl-season-months">{isVi ? "Tháng 9 – Tháng 11 (Mùa Thu)" : "Sept – Nov (Autumn)"}</h3>
              <p className="hl-season-desc">
                {isVi
                  ? "Thời tiết lý tưởng nhất trong năm. Trời trong xanh, nắng vàng dịu, biển êm đềm phẳng lặng và độ ẩm thấp. Hoàn hảo tuyệt đối cho du thuyền và chèo kayak."
                  : "The undisputed prime season. Crystal clear skies, mild gentle sunshine, virtually no rain, and calm waters provide postcard-perfect photography and pleasant outdoor temps."}
              </p>
            </div>

            <div className="hl-season-card best">
              <span className="hl-season-badge">{isVi ? "Mùa Xuân Dịu Êm" : "Pleasant Spring"}</span>
              <h3 className="hl-season-months">{isVi ? "Tháng 3 – Tháng 5 (Mùa Xuân)" : "March – May (Spring)"}</h3>
              <p className="hl-season-desc">
                {isVi
                  ? "Thời tiết mát mẻ dễ chịu (20 - 26°C), ít mưa bão, làn nước trong xanh trở lại sau mùa đông sương mờ. Rất thích hợp để trekking đảo Ti Tốp và tắm biển."
                  : "Warm pleasant temperatures (20-26°C), blooming flora, minimal storm risk, and clearing seas make spring a wonderful time for hiking Ti Top and cruising."}
              </p>
            </div>

            <div className="hl-season-card">
              <span className="hl-season-badge">{isVi ? "Sôi Động Mùa Hè" : "Sunny Summer"}</span>
              <h3 className="hl-season-months">{isVi ? "Tháng 6 – Tháng 8 (Mùa Hè)" : "June – August (Summer)"}</h3>
              <p className="hl-season-desc">
                {isVi
                  ? "Nắng rực rỡ, nước biển xanh ngắt thích hợp tắm biển và các môn thể thao nước. Tuy nhiên đây là mùa cao điểm khách nội địa và đôi khi có mưa dông/bão nhiệt đới."
                  : "Brilliant sunshine and maximum water warmth ideal for swimming. High domestic holiday season; note that occasional tropical typhoons can temporarily delay cruise departures."}
              </p>
            </div>

            <div className="hl-season-card">
              <span className="hl-season-badge">{isVi ? "Huyền Ảo Mờ Sương" : "Mystical Winter"}</span>
              <h3 className="hl-season-months">{isVi ? "Tháng 12 – Tháng 2 (Mùa Đông)" : "Dec – Feb (Winter)"}</h3>
              <p className="hl-season-desc">
                {isVi
                  ? "Tiết trời se lạnh (15 - 19°C), sương mù bảng lảng bao phủ các đỉnh núi đá vôi tạo nên khung cảnh huyền bí như tranh thủy mặc Á Đông cổ điển."
                  : "Cooler weather (15-19°C) with ethereal low-lying mists cloaking limestone peaks, creating a moody, atmospheric landscape reminiscent of traditional oriental watercolor paintings."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 8: HOW TO GET THERE */}
        <section id="transport" className="hl-section">
          <h2 className="hl-section-title">
            <Bus className="w-6 h-6 text-cyan-600" />
            {isVi ? "8. Hướng Dẫn Di Chuyển Đến Hạ Long" : "8. Getting to Ha Long Bay from Hanoi & Airports"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Nhờ tuyến cao tốc Hà Nội – Hải Phòng – Hạ Long hiện đại, thời gian di chuyển từ Thủ đô đến vịnh di sản đã được rút ngắn kỷ lục từ 4 tiếng trước đây xuống chỉ còn khoảng 2 đến 2.5 giờ:"
                : "Thanks to the modern Hanoi – Hai Phong – Ha Long Expressway, travel time from the capital has been dramatically reduced from 4 hours down to just 2 to 2.5 hours:"}
            </p>
          </div>

          <div className="hl-transport-grid">
            <div className="hl-transport-card">
              <div className="hl-transport-icon">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="hl-transport-title">{isVi ? "Xe Limousine VIP Đưa Đón Tận Nơi" : "Luxury Limousine D-Car"}</h3>
              <p className="hl-transport-desc">
                {isVi
                  ? "Phương án phổ biến và tiện nghi nhất. Xe 9 - 11 chỗ ghế massage đón trả tận khách sạn Phố Cổ Hà Nội đến cảng Tuần Châu hoặc Bãi Cháy. Giá vé khoảng 220.000đ – 280.000đ/lượt ($9 - $12 USD)."
                  : "The most recommended choice for travelers. 9 to 11-seat luxury vans with reclining leather massage seats picking you up directly from Hanoi Old Quarter hotels to Ha Long marinas. Fare: $9 – $12 USD."}
              </p>
            </div>

            <div className="hl-transport-card">
              <div className="hl-transport-icon">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="hl-transport-title">{isVi ? "Xe Đưa Đón Theo Tàu Du Thuyền" : "Cruise Operator Shuttle"}</h3>
              <p className="hl-transport-desc">
                {isVi
                  ? "Hầu hết các hãng du thuyền 4 - 5 sao (như Paradise, Ambassador, Indochina Sails, Capella) đều cung cấp dịch vụ xe buýt hạng sang khứ hồi trọn gói Hà Nội – Hạ Long đón lúc 8:00 sáng."
                  : "Nearly all premium overnight cruise lines offer round-trip transfer packages in plush executive buses departing Hanoi Old Quarter around 8:00 AM directly to private cruise lounges."}
              </p>
            </div>

            <div className="hl-transport-card">
              <div className="hl-transport-icon">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="hl-transport-title">{isVi ? "Sân Bay Vân Đồn (VDO) & Cát Bi (HPH)" : "Van Don & Cat Bi Airports"}</h3>
              <p className="hl-transport-desc">
                {isVi
                  ? "Du khách từ miền Nam (TP.HCM, Đà Nẵng, Cần Thơ) có thể bay thẳng đến Sân bay Quốc tế Vân Đồn (cách Hạ Long 50km cao tốc) hoặc Sân bay Cát Bi Hải Phòng (cách Hạ Long 45km)."
                  : "Flyers from Southern Vietnam (Ho Chi Minh City, Da Nang, Can Tho) can land at Van Don Int'l Airport (VDO, 45 min drive) or Cat Bi Int'l Airport in Hai Phong (HPH, 40 min drive)."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 9: ITINERARIES */}
        <section id="itinerary" className="hl-section">
          <h2 className="hl-section-title">
            <Clock className="w-6 h-6 text-cyan-600" />
            {isVi ? "9. Lịch Trình Gợi Ý Chuẩn Bản Địa" : "9. Recommended Itineraries: Day Trip vs Overnight"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Dưới đây là khung lịch trình 2 Ngày 1 Đêm trên du thuyền – phương án cân bằng hoàn hảo nhất giữa thư giãn, thưởng ngoạn thiên nhiên và chi phí:"
                : "Here is the classic 2 Days 1 Night cruise schedule—the gold standard balance of scenery, relaxation, and cultural immersion:"}
            </p>
          </div>

          <div className="hl-timeline">
            {/* Timeline Day 1 */}
            <div className="hl-timeline-item">
              <div className="hl-timeline-dot" />
              <div className="hl-timeline-box">
                <span className="hl-timeline-time">{isVi ? "NGÀY 1 • 08:30 – 12:00" : "DAY 1 • 08:30 – 12:00"}</span>
                <h3 className="hl-timeline-heading">{isVi ? "Hà Nội Khởi Hành – Lên Du Thuyền – Ăn Trưa" : "Hanoi Departure – Check-in Cruise – Gourmet Lunch"}</h3>
                <p className="hl-timeline-text">
                  {isVi
                    ? "Xe Limousine đón tại Hà Nội đi cao tốc đến Cảng Quốc tế Tuần Châu. 12:00 làm thủ tục lên tàu, nhận phòng và thưởng thức đồ uống chào mừng trong khi du thuyền bắt đầu rẽ sóng ra vùng lõi vịnh."
                    : "Pick up from Hanoi via express highway to Tuan Chau Marina. Board cruise, check into sea-view balcony cabin, and savor multi-course fresh seafood buffet as the vessel glides into the bay."}
                </p>
              </div>
            </div>

            <div className="hl-timeline-item">
              <div className="hl-timeline-dot" />
              <div className="hl-timeline-box">
                <span className="hl-timeline-time">{isVi ? "NGÀY 1 • 14:30 – 17:30" : "DAY 1 • 14:30 – 17:30"}</span>
                <h3 className="hl-timeline-heading">{isVi ? "Thám Hiểm Hang Sửng Sốt – Tắm Biển & Leo Đỉnh Ti Tốp" : "Explore Sung Sot Cave & Hike Ti Top Peak"}</h3>
                <p className="hl-timeline-text">
                  {isVi
                    ? "Tàu trung chuyển đưa du khách lên đảo Bồ Hòn chiêm ngưỡng Hang Sửng Sốt; sau đó sang Đảo Ti Tốp tắm biển cát trắng hoặc chinh phục 400 bậc đá ngắm hoàng hôn buông xuống vịnh."
                    : "Transfer to Bo Hon Island to marvel at the massive caverns of Sung Sot Cave, followed by beach swimming and summit hiking at Ti Top Island to watch sunset over countless karsts."}
                </p>
              </div>
            </div>

            <div className="hl-timeline-item">
              <div className="hl-timeline-dot" />
              <div className="hl-timeline-box">
                <span className="hl-timeline-time">{isVi ? "NGÀY 1 • 18:00 – 22:00" : "DAY 1 • 18:00 – 22:00"}</span>
                <h3 className="hl-timeline-heading">{isVi ? "Tiệc Hoàng Hôn (Sunset Party) – Bữa Tối – Câu Mực Đêm" : "Sunset Party on Sundeck – Dinner – Squid Fishing"}</h3>
                <p className="hl-timeline-text">
                  {isVi
                    ? "Thưởng thức cocktail ngắm hoàng hôn, lớp học cuốn nem truyền thống, dùng bữa tối lãng mạn và thử vận may câu mực đêm cùng thủy thủ đoàn."
                    : "Enjoy complimentary sunset cocktails on the sundeck, a Vietnamese spring roll cooking class, sumptuous dinner, and evening squid fishing under the stars."}
                </p>
              </div>
            </div>

            {/* Timeline Day 2 */}
            <div className="hl-timeline-item">
              <div className="hl-timeline-dot" />
              <div className="hl-timeline-box">
                <span className="hl-timeline-time">{isVi ? "NGÀY 2 • 06:30 – 11:30" : "DAY 2 • 06:30 – 11:30"}</span>
                <h3 className="hl-timeline-heading">{isVi ? "Thái Cực Quyền Bình Minh – Chèo Kayak Hang Luồn – Cập Cảng" : "Sunrise Tai Chi – Luon Cave Kayak – Disembark"}</h3>
                <p className="hl-timeline-text">
                  {isVi
                    ? "Đón bình minh trong lành với bài tập Tai Chi trên boong tàu. Chèo thuyền kayak khám phá Hang Luồn yên ả, trở về du thuyền ăn bữa trưa nhẹ (brunch) trong khi tàu thong thả quay về bến."
                    : "Early morning Tai Chi session on sundeck as the sun breaks through sea mist. Paddle kayak through Luon Cave tunnel, enjoy farewell brunch onboard while sailing back to port."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: FAQS & EXPERT TIPS */}
        <section id="faq" className="hl-section">
          <h2 className="hl-section-title">
            <HelpCircle className="w-6 h-6 text-cyan-600" />
            {isVi ? "10. Câu Hỏi Thường Gặp & Mẹo Du Lịch Hữu Ích" : "10. Frequently Asked Questions & Expert Travel Tips"}
          </h2>
          <div className="hl-section-desc">
            <p>
              {isVi
                ? "Những thắc mắc phổ biến nhất của du khách trước khi khởi hành đến Vịnh Hạ Long:"
                : "Key questions asked by travelers when planning their Ha Long excursion:"}
            </p>
          </div>

          <div className="hl-faq-list">
            {/* FAQ 1 */}
            <div className="hl-faq-item">
              <button
                type="button"
                className="hl-faq-trigger"
                onClick={() => toggleFaq(1)}
              >
                <span>{isVi ? "Nên chọn đi tour Hạ Long trong ngày hay ngủ đêm trên du thuyền?" : "Should I take a 1-day trip or an overnight cruise?"}</span>
                {activeFaq === 1 ? (
                  <ChevronUp className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {activeFaq === 1 && (
                <div className="hl-faq-answer">
                  {isVi
                    ? "Nếu thời gian eo hẹp, tour tàu tiếng trong ngày (4 tiếng hoặc 6 tiếng) vẫn giúp bạn chiêm ngưỡng các điểm chính. Tuy nhiên, nếu có điều kiện, tour ngủ đêm 2N1Đ hoặc 3N2Đ là trải nghiệm đắt giá nhất: bạn sẽ được tận hưởng khoảnh khắc vịnh biển lúc hoàng hôn buông xuống và bình minh sớm khi không còn các đoàn khách trong ngày ồn ào."
                    : "If you only have one day, a 6-hour day boat still covers major highlights. However, an overnight cruise (2D1N) is widely considered the ultimate experience—giving you the tranquil magic of sunset, star-lit anchoring, and serene sunrise when all day-trippers have left."}
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="hl-faq-item">
              <button
                type="button"
                className="hl-faq-trigger"
                onClick={() => toggleFaq(2)}
              >
                <span>{isVi ? "Đi thuyền trên Vịnh Hạ Long có bị say sóng không?" : "Is seasickness an issue on Ha Long Bay cruises?"}</span>
                {activeFaq === 2 ? (
                  <ChevronUp className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {activeFaq === 2 && (
                <div className="hl-faq-answer">
                  {isVi
                    ? "Vịnh Hạ Long được che chắn bởi gần 2.000 hòn đảo đá vôi khổng lồ nên sóng biển ở đây rất êm đềm, phẳng lặng như mặt hồ trong hầu hết các ngày trong năm. Các du thuyền hiện đại đều có kích thước lớn và hệ thống cân bằng tốt, nên ngay cả những người dễ say xe cũng hiếm khi cảm thấy say sóng."
                    : "Because the bay is sheltered by thousands of natural limestone islands, the sea here is remarkably calm, resembling an immense placid lake rather than open ocean. Large modern cruise vessels glide with minimal motion, so seasickness is rarely a problem."}
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="hl-faq-item">
              <button
                type="button"
                className="hl-faq-trigger"
                onClick={() => toggleFaq(3)}
              >
                <span>{isVi ? "Cần chuẩn bị trang phục gì khi đi tham quan các hang động?" : "What should I pack for cave excursions and Ti Top hiking?"}</span>
                {activeFaq === 3 ? (
                  <ChevronUp className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {activeFaq === 3 && (
                <div className="hl-faq-answer">
                  {isVi
                    ? "Các hang động như Sửng Sốt, Thiên Cung hay đỉnh núi Ti Tốp có nhiều bậc thang đá ẩm ướt và dốc. Bạn nên mang giày thể thao có độ bám tốt, quần áo nhẹ thoáng khí, đồ bơi, kính râm, kem chống nắng và tuyệt đối không mang túi ni-lông dùng một lần theo quy định của ban quản lý."
                    : "Caves like Sung Sot and the stairway up Ti Top peak feature damp, steep stone steps. Bring comfortable walking shoes with good tread, light breathable attire, swimwear, sunscreen, sunglasses, and a reusable water bottle (single-use plastics are forbidden)."}
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="hl-faq-item">
              <button
                type="button"
                className="hl-faq-trigger"
                onClick={() => toggleFaq(4)}
              >
                <span>{isVi ? "Nếu gặp thời tiết xấu hoặc bão thì quy trình xử lý thế nào?" : "What happens if a tropical storm or severe weather occurs?"}</span>
                {activeFaq === 4 ? (
                  <ChevronUp className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {activeFaq === 4 && (
                <div className="hl-faq-answer">
                  {isVi
                    ? "Cảng vụ Hàng hải Quảng Ninh quyết định lệnh cấm biển dựa trên dự báo khí tượng để đảm bảo tuyệt đối an toàn cho du khách. Nếu lệnh cấm biển ban hành trước khi tàu khởi hành, các hãng tàu sẽ hoàn 100% tiền hoặc hỗ trợ đổi ngày; nếu cấm khi tàu đang trên vịnh, thuyền trưởng sẽ đưa tàu về vị trí neo đậu an toàn hoặc bến cảng theo hướng dẫn."
                    : "The Port Authority makes cruise departure calls based on certified meteorological forecasts to safeguard lives. If a voyage is cancelled due to storm warnings before boarding, operators provide a 100% refund or free date rescheduling."}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RELATED ARTICLES */}
        <section className="hl-section">
          <h2 className="hl-section-title">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            {isVi ? "Cẩm Nang Du Lịch Liên Quan Trên VinaTap" : "Explore More Guides on VinaTap"}
          </h2>
          <div className="hl-related-grid">
            {RELATED_ARTICLES.map((art) => (
              <Link
                key={art.slug}
                href={art.slug.startsWith("the-") || art.slug.startsWith("15-") || art.slug.startsWith("20-") ? `/guide/${art.slug}` : `/province/${art.slug}`}
                className="hl-related-card"
              >
                <div className="hl-related-img-wrap">
                  <img
                    src={art.img}
                    alt={isVi ? art.titleVi : art.title}
                    className="hl-related-img"
                    loading="lazy"
                  />
                </div>
                <div className="hl-related-body">
                  <span className="hl-related-badge">{isVi ? art.badgeVi : art.badge}</span>
                  <h3 className="hl-related-title">{isVi ? art.titleVi : art.title}</h3>
                  <p className="hl-related-excerpt">{isVi ? art.excerptVi : art.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* AI Assistant for Ha Long Bay */}
      <ProvinceChatbot
        provinceName={isVi ? "Vịnh Hạ Long" : "Ha Long Bay"}
        provinceSlug="ha-long"
      />

      <PublicFooter />
    </div>
  );
}
