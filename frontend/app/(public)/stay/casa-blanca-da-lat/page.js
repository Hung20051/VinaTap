"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { getLang } from "@/lib/prefs";
import {
  MapPin,
  Phone,
  Instagram,
  Facebook,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Users,
  Bed,
  Sparkles,
  Coffee,
  Trees,
  Flame,
  Bike,
  Camera,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  MessageCircle,
} from "lucide-react";
import "@/styles/casa-blanca.css";

// ─── 7 ROOMS DATA FOR CASA BLANCA ĐÀ LẠT ───
const ROOMS_DATA = [
  {
    id: "hien-nang",
    title: "Căn Hiên Nắng",
    titleEn: "Hien Nang Suite",
    subtitle: "Phòng đơn VIP có sân hiên riêng",
    subtitleEn: "VIP double room with private terrace",
    category: "couple",
    badge: "VIP BAN CÔNG",
    badgeEn: "VIP TERRACE",
    capacity: "1 giường đôi (Tối đa 2 khách)",
    capacityEn: "1 double bed (Max 2 guests)",
    oldPrice: "950.000đ",
    currentPrice: "650.000đ",
    priceNum: 650000,
    desc: "Căn phòng VIP sở hữu sân hiên riêng biệt ngập tràn ánh nắng sớm mai. Không gian trang trí mộc mạc với rèm ren cổ điển, đèn ngủ ấm cúng và cửa kính mở rộng ôm trọn khuôn viên hoa lá.",
    descEn:
      "A VIP double suite featuring a private sun-drenched terrace. Styled with vintage lace curtains, warm wooden textures, and glass doors looking onto lush gardens.",
    amenities: [
      "Sân hiên riêng",
      "WC khép kín",
      "Nước nóng 24/7",
      "Bàn trà vintage",
    ],
    images: [
      "/stay/casa-blanca/hiennang/hn1.jpg",
      "/stay/casa-blanca/hiennang/hn2.jpg",
      "/stay/casa-blanca/hiennang/hn3.jpg",
      "/stay/casa-blanca/hiennang/hn4.jpg",
      "/stay/casa-blanca/hiennang/hn5.jpg",
      "/stay/casa-blanca/hiennang/hn6.jpg",
      "/stay/casa-blanca/hiennang/hn7.jpg",
      "/stay/casa-blanca/hiennang/hn8.jpg",
      "/stay/casa-blanca/hiennang/hn9.jpg",
      "/stay/casa-blanca/hiennang/hn10.jpg",
    ],
  },
  {
    id: "mui-go",
    title: "Căn Mùi Gỗ",
    titleEn: "Mui Go Standard",
    subtitle: "Phòng đơn tiêu chuẩn ốp gỗ mộc",
    subtitleEn: "Standard double room in rustic wood",
    category: "couple",
    badge: "ẤM ÁP",
    badgeEn: "COZY WOOD",
    capacity: "1 giường đôi (Tối đa 2 khách)",
    capacityEn: "1 double bed (Max 2 guests)",
    oldPrice: "800.000đ",
    currentPrice: "500.000đ",
    priceNum: 500000,
    desc: "Không gian ốp gỗ thông tự nhiên tỏa hương thơm nhẹ nhàng. Căn phòng tĩnh lặng, ánh đèn vàng dịu mắt mang đến giấc ngủ sâu trọn vẹn trong khí trời se lạnh của Đà Lạt.",
    descEn:
      "Paneled in natural pine with a subtle wood fragrance. Warm amber lighting and peaceful garden views provide deep restful nights in Dalat's cool climate.",
    amenities: [
      "Nội thất gỗ mộc",
      "WC khép kín",
      "Nước nóng 24/7",
      "Cửa sổ thoáng",
    ],
    images: [
      "/stay/casa-blanca/muigo/1.jpg",
      "/stay/casa-blanca/muigo/2.jpg",
      "/stay/casa-blanca/muigo/3.jpg",
      "/stay/casa-blanca/muigo/4.jpg",
      "/stay/casa-blanca/muigo/5.jpg",
      "/stay/casa-blanca/muigo/6.jpg",
    ],
  },
  {
    id: "mui-thong",
    title: "Căn Mùi Thông",
    titleEn: "Mui Thong Standard",
    subtitle: "Phòng đơn tiêu chuẩn, thoang thoảng hương thông",
    subtitleEn: "Standard double room with pine breeze",
    category: "couple",
    badge: "THƯ THÁI",
    badgeEn: "REFRESHING",
    capacity: "1 giường đôi (Tối đa 2 khách)",
    capacityEn: "1 double bed (Max 2 guests)",
    oldPrice: "800.000đ",
    currentPrice: "500.000đ",
    priceNum: 500000,
    desc: "Căn phòng đón gió cao nguyên trong lành và tiếng reo của những rặng thông già. Thiết kế gọn gàng, mộc mạc và tiện nghi khép kín đem lại sự riêng tư tuyệt đối.",
    descEn:
      "Invigorating highlands breeze and gentle pine tree murmurs. Minimalist, clean wooden decor with ensuite bathroom for total privacy.",
    amenities: [
      "Gió thông tự nhiên",
      "WC khép kín",
      "Nước nóng 24/7",
      "Tủ nứa vintage",
    ],
    images: [
      "/stay/casa-blanca/muithong/1.jpg",
      "/stay/casa-blanca/muithong/2.jpg",
      "/stay/casa-blanca/muithong/3.jpg",
      "/stay/casa-blanca/muithong/4.jpg",
      "/stay/casa-blanca/muithong/5.jpg",
      "/stay/casa-blanca/muithong/6.jpg",
      "/stay/casa-blanca/muithong/7.jpg",
    ],
  },
  {
    id: "nep-nha",
    title: "Căn Nếp Nhà",
    titleEn: "Nep Nha Family Suite",
    subtitle: "Phòng 2 giường, hương vị 'nhà' thân thương",
    subtitleEn: "2-bed room with cozy home vibes",
    category: "group",
    badge: "CHO GIA ĐÌNH",
    badgeEn: "FAMILY & FRIENDS",
    capacity: "2 giường đôi (Tối đa 4 khách)",
    capacityEn: "2 double beds (Max 4 guests)",
    oldPrice: "1.050.000đ",
    currentPrice: "750.000đ",
    priceNum: 750000,
    desc: "Mang trọn hương vị ấm áp của gia đình với 2 giường nệm rộng rãi. Không gian lý tưởng để nhóm bạn thân hoặc cả gia đình quây quần bên nhau trò chuyện thâu đêm.",
    descEn:
      "Rich with the heartwarming comfort of home, equipped with 2 large double beds. Perfect for small families or close friends traveling together.",
    amenities: [
      "2 giường đôi lớn",
      "WC khép kín",
      "Nước nóng 24/7",
      "Khuôn viên rộng",
    ],
    images: [
      "/stay/casa-blanca/nepnha/1.jpg",
      "/stay/casa-blanca/nepnha/2.jpg",
      "/stay/casa-blanca/nepnha/3.jpg",
      "/stay/casa-blanca/nepnha/4.jpg",
      "/stay/casa-blanca/nepnha/5.jpg",
      "/stay/casa-blanca/nepnha/6.jpg",
    ],
  },
  {
    id: "duoi-tan-hong",
    title: "Căn Dưới Tán Hồng",
    titleEn: "Duoi Tan Hong Attic",
    subtitle: "Gác mái mộng mơ, kệ sách lớn",
    subtitleEn: "Dreamy attic room with large bookshelf",
    category: "group",
    badge: "CHILL SÁCH",
    badgeEn: "BOOK CORNER",
    capacity: "2 giường đôi (Tối đa 4 khách)",
    capacityEn: "2 double beds (Max 4 guests)",
    oldPrice: "1.050.000đ",
    currentPrice: "750.000đ",
    priceNum: 750000,
    desc: "Nằm dưới gác mái ấm cúng với trần gỗ xiên và một kệ sách phong phú. Nơi bạn có thể cuộn mình trong chăn ấm đọc cuốn sách yêu thích và lắng nghe tiếng mưa rơi trên mái tôn cũ.",
    descEn:
      "A cozy attic sanctuary under sloped wooden eaves with a well-stocked bookshelf. Curl up with a good book and listen to the rain drumming peacefully overhead.",
    amenities: [
      "Gác mái trần gỗ",
      "Kệ sách phong phú",
      "WC khép kín",
      "2 giường đôi",
    ],
    images: [
      "/stay/casa-blanca/duoitanhong/1.jpg",
      "/stay/casa-blanca/duoitanhong/2.jpg",
      "/stay/casa-blanca/duoitanhong/3.jpg",
      "/stay/casa-blanca/duoitanhong/4.jpg",
      "/stay/casa-blanca/duoitanhong/5.jpg",
      "/stay/casa-blanca/duoitanhong/6.jpg",
      "/stay/casa-blanca/duoitanhong/7.jpg",
    ],
  },
  {
    id: "gac-bep",
    title: "Căn Gác Bếp",
    titleEn: "Gac Bep Attic & Bath",
    subtitle: "Gác mái, có bồn tắm vintage chill",
    subtitleEn: "Attic suite with vintage freestanding bathtub",
    category: "group",
    badge: "BỒN TẮM CHILL",
    badgeEn: "SOAKING TUB",
    capacity: "2 giường đôi (Tối đa 4 khách)",
    capacityEn: "2 double beds (Max 4 guests)",
    oldPrice: "1.050.000đ",
    currentPrice: "750.000đ",
    priceNum: 750000,
    desc: "Điểm nhấn đắt giá là bồn tắm ngâm mình phong cách vintage giữa không gian gạch bông và cây trầu bà lá xẻ. Thư thả ngâm bồn nước ấm ngắm đèn vàng sau ngày dài khám phá đồi dốc Đà Lạt.",
    descEn:
      "Highlights a stunning freestanding clawfoot-style bathtub surrounded by patterned tiles and lush monstera leaves. Soak in hot water under soft pendant lights.",
    amenities: [
      "Bồn tắm độc lập cực nghệ",
      "Gác mái ấm",
      "WC khép kín",
      "2 giường đôi",
    ],
    images: [
      "/stay/casa-blanca/gacbep/1.jpg",
      "/stay/casa-blanca/gacbep/2.jpg",
      "/stay/casa-blanca/gacbep/3.jpg",
      "/stay/casa-blanca/gacbep/4.jpg",
      "/stay/casa-blanca/gacbep/5.jpg",
      "/stay/casa-blanca/gacbep/6.jpg",
      "/stay/casa-blanca/gacbep/7.jpg",
    ],
  },
  {
    id: "ben-tan-thong",
    title: "Căn Bên Tán Thông",
    titleEn: "Ben Tan Thong VIP Attic",
    subtitle: "Gác mái VIP, có sân hiên riêng ngắm thông reo",
    subtitleEn: "VIP attic with private balcony facing pine hills",
    category: "group",
    badge: "VIP GÁC MÁI",
    badgeEn: "VIP BALCONY",
    capacity: "2 giường đôi (Tối đa 4 khách)",
    capacityEn: "2 double beds (Max 4 guests)",
    oldPrice: "1.150.000đ",
    currentPrice: "850.000đ",
    priceNum: 850000,
    desc: "Căn phòng gác mái cao cấp nhất sở hữu ban công hiên riêng nhìn thẳng ra đồi thông ngút ngàn. Buổi sáng thức giấc ngắm sương mù giăng mắc và nhâm nhi tách cà phê thơm ngào ngạt.",
    descEn:
      "The premier attic suite with a private outdoor balcony facing lush pine hills. Wake up to misty morning skies and sip hot coffee above the trees.",
    amenities: [
      "Ban công hiên ngắm thông",
      "Gác mái cao cấp",
      "WC khép kín",
      "2 giường đôi",
    ],
    images: [
      "/stay/casa-blanca/bentanthong/1.jpg",
      "/stay/casa-blanca/bentanthong/2.jpg",
      "/stay/casa-blanca/bentanthong/3.jpg",
      "/stay/casa-blanca/bentanthong/4.jpg",
      "/stay/casa-blanca/bentanthong/5.jpg",
      "/stay/casa-blanca/bentanthong/6.jpg",
      "/stay/casa-blanca/bentanthong/7.jpg",
      "/stay/casa-blanca/bentanthong/8.jpg",
    ],
  },
];

export default function CasaBlancaShowcasePage() {
  const [lang, setLang] = useState("vi");
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");
  const [lightboxCaption, setLightboxCaption] = useState("");

  useEffect(() => {
    setLang(getLang());
    const handleStorage = () => setLang(getLang());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isVi = lang === "vi";

  // Filter rooms
  const filteredRooms = ROOMS_DATA.filter((room) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "couple") return room.category === "couple";
    if (activeFilter === "group") return room.category === "group";
    return true;
  });

  const openPhotoModal = (imgUrl, caption) => {
    setLightboxImg(imgUrl);
    setLightboxCaption(caption || "");
    setLightboxOpen(true);
  };

  const hotline = "0948-015-569";
  const hotlineNum = "0948015569";
  const zaloLink = `https://zalo.me/${hotlineNum}`;
  const mapLink = "https://maps.app.goo.gl/vkG4apW3JPV5kBEv7";
  const igLink = "https://www.instagram.com/casa.blancahomestay/";
  const fbLink = "https://www.facebook.com/casablancahomestay";

  return (
    <div className="cb-page-wrap">
      {/* ── Public Header ── */}
      <PublicHeader />

      {/* ── Breadcrumb Bar ── */}
      <div className="cb-breadcrumb-bar">
        <div className="cb-breadcrumb-inner">
          <Link href="/">{isVi ? "Trang chủ" : "Home"}</Link>
          <span className="cb-breadcrumb-sep">/</span>
          <Link href="/province/dalat">{isVi ? "Đà Lạt" : "Dalat"}</Link>
          <span className="cb-breadcrumb-sep">/</span>
          <span className="cb-breadcrumb-current">
            Casa Blanca Đà Lạt Homestay
          </span>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <section
        className="cb-hero"
        style={{ backgroundImage: "url('/stay/casa-blanca/toan_canh.jpg')" }}
      >
        <div className="cb-hero-content">
          <div className="cb-hero-badge-row">
            <span className="cb-badge-partner">
              <Sparkles size={14} />
              {isVi ? "ĐỐI TÁC VINATAP" : "VINATAP PARTNER"}
            </span>
            <span className="cb-badge-tag">
              {isVi ? "HOMESTAY NHÀ GỖ MỘC" : "RUSTIC WOODEN STAY"}
            </span>
            <span className="cb-badge-tag">
              {isVi ? "70/5 PASTEUR, ĐÀ LẠT" : "PASTEUR, DALAT"}
            </span>
          </div>

          <div className="cb-hero-header-flex">
            <img
              src="/stay/casa-blanca/logo_casa.jpg"
              alt="Casa Blanca Da Lat Logo"
              className="cb-hero-logo"
            />
            <div className="cb-hero-title-box">
              <h1>Casa Blanca Đà Lạt Homestay</h1>
              <p className="cb-hero-tagline">
                {isVi
                  ? "“Homestay nhà gỗ ẩn mình trong mảnh sân vườn xanh mát giữa lòng thành phố”"
                  : "“A rustic wooden sanctuary hidden in a green garden right in the heart of Dalat”"}
              </p>
            </div>
          </div>

          <div className="cb-hero-meta-row">
            <div className="cb-hero-meta-item">
              <MapPin size={16} color="#d97706" />
              <a href={mapLink} target="_blank" rel="noopener noreferrer">
                70/5 Pasteur, Phường Xuân Hương, TP. Đà Lạt
              </a>
            </div>
            <div className="cb-hero-meta-item">
              <Phone size={16} color="#d97706" />
              <a href={`tel:${hotlineNum}`}>{hotline}</a>
            </div>
            <div className="cb-hero-meta-item">
              <Heart size={16} color="#ef4444" fill="#ef4444" />
              <span>
                {isVi
                  ? "7 phòng ngủ khép kín hoặc thuê nguyên căn"
                  : "7 ensuite rooms or whole villa rental"}
              </span>
            </div>
          </div>

          <div className="cb-hero-actions">
            <a href="#rooms-section" className="cb-btn-primary">
              <Bed size={16} />
              {isVi ? "Xem 7 Căn Phòng & Giá" : "View 7 Rooms & Rates"}
            </a>
            <a
              href="#whole-house"
              className="cb-btn-primary"
              style={{
                background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
              }}
            >
              <Users size={16} />
              {isVi ? "Thuê Nguyên Căn" : "Rent Entire House"}
            </a>
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cb-btn-zalo"
            >
              <MessageCircle size={16} />
              {isVi ? "Nhắn Zalo Tư Vấn" : "Chat on Zalo"}
            </a>
            <a
              href={fbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cb-btn-social"
              title="Facebook Casa Blanca Homestay"
            >
              <Facebook size={18} />
            </a>
            <a
              href={igLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cb-btn-social"
              title="Instagram @casa.blancahomestay"
            >
              <Instagram size={18} />
            </a>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cb-btn-social"
              title="Google Maps"
            >
              <MapPin size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="cb-main-content">
        {/* ── Highlights Grid ── */}
        <section className="cb-highlights-grid">
          <div className="cb-highlight-card">
            <div className="cb-highlight-icon-box">
              <Trees size={22} />
            </div>
            <div>
              <h3 className="cb-highlight-title">
                {isVi ? "Vườn Xanh Giữa Phố" : "Lush City Garden"}
              </h3>
              <p className="cb-highlight-desc">
                {isVi
                  ? "Sân vườn rộng trồng rau xanh, hoa cỏ và lối đi lát đá tĩnh lặng."
                  : "Expansive green garden with organic vegetables and blooming flowers."}
              </p>
            </div>
          </div>

          <div className="cb-highlight-card">
            <div className="cb-highlight-icon-box">
              <Bed size={22} />
            </div>
            <div>
              <h3 className="cb-highlight-title">
                {isVi ? "7 Căn Biệt Lập Khép Kín" : "7 Private Ensuite Rooms"}
              </h3>
              <p className="cb-highlight-desc">
                {isVi
                  ? "100% phòng có nhà vệ sinh riêng, bảo đảm sự riêng tư và tiện nghi."
                  : "All rooms feature private ensuite bathrooms for maximum comfort."}
              </p>
            </div>
          </div>

          <div className="cb-highlight-card">
            <div className="cb-highlight-icon-box">
              <Flame size={22} />
            </div>
            <div>
              <h3 className="cb-highlight-title">
                {isVi ? "Tiệc Nướng BBQ & Bếp" : "BBQ Campfire & Kitchen"}
              </h3>
              <p className="cb-highlight-desc">
                {isVi
                  ? "Căn bếp ấm cúng tự do sinh hoạt và khoảng sân nướng khoai, tiệc tối."
                  : "Cozy shared kitchen for dining and outdoor campfire for chilly evenings."}
              </p>
            </div>
          </div>

          <div className="cb-highlight-card">
            <div className="cb-highlight-icon-box">
              <Bike size={22} />
            </div>
            <div>
              <h3 className="cb-highlight-title">
                {isVi ? "Thuê Xe Máy & Sống Ảo" : "Motorbike & Photo Gear"}
              </h3>
              <p className="cb-highlight-desc">
                {isVi
                  ? "Dàn xe cực ngầu (Honda CB223S, Yamaha PG-1) và cho thuê máy ảnh."
                  : "Vintage bikes (Honda CB223S, PG-1) and camera rentals on spot."}
              </p>
            </div>
          </div>
        </section>

        {/* ── Photo Gallery Section ── */}
        <section style={{ marginBottom: "60px" }}>
          <div className="cb-section-header">
            <span className="cb-section-pill">
              {isVi ? "KHÔNG GIAN NGHỈ DƯỠNG" : "ATMOSPHERE"}
            </span>
            <h2 className="cb-section-title">
              {isVi
                ? "Khoảnh Khắc Thơ Mộng Tại Casa Blanca"
                : "Moments of Peace at Casa Blanca"}
            </h2>
            <p className="cb-section-subtitle">
              {isVi
                ? "Từng góc nhỏ đều nhuốm màu thời gian với chất gỗ mộc, mùi thông reo và tách trà nóng giữa khí trời se se lạnh của Đà Lạt."
                : "Every rustic wooden corner invites you to slow down, breathe fresh mountain air, and savor Dalat's peaceful charm."}
            </p>
          </div>

          <div className="cb-gallery-grid">
            <div
              className="cb-gallery-item span-2-row"
              onClick={() =>
                openPhotoModal(
                  "/stay/casa-blanca/toan_canh.jpg",
                  "Toàn cảnh nhà gỗ và sân hoa rực rỡ dưới nắng",
                )
              }
            >
              <img
                src="/stay/casa-blanca/toan_canh.jpg"
                alt="Toàn cảnh nhà gỗ Casa Blanca"
                className="cb-gallery-img"
              />
              <div className="cb-gallery-overlay">
                <span>
                  {isVi
                    ? "Toàn cảnh nhà gỗ và vườn hoa ban ngày"
                    : "Panoramic daytime view"}
                </span>
              </div>
            </div>

            <div
              className="cb-gallery-item"
              onClick={() =>
                openPhotoModal(
                  "/stay/casa-blanca/phong_canh_dem.jpg",
                  "Không gian sân vườn lên đèn lãng mạn ban đêm",
                )
              }
            >
              <img
                src="/stay/casa-blanca/phong_canh_dem.jpg"
                alt="Sân vườn Casa Blanca ban đêm"
                className="cb-gallery-img"
              />
              <div className="cb-gallery-overlay">
                <span>
                  {isVi
                    ? "Sân vườn lên đèn lãng mạn ban đêm"
                    : "Cozy garden with fairy lights"}
                </span>
              </div>
            </div>

            <div
              className="cb-gallery-item"
              onClick={() =>
                openPhotoModal(
                  "/stay/casa-blanca/xe_may.jpg",
                  "Dàn xe máy phượt cổ điển tại sân homestay",
                )
              }
            >
              <img
                src="/stay/casa-blanca/xe_may.jpg"
                alt="Dàn xe máy phượt Casa Blanca"
                className="cb-gallery-img"
              />
              <div className="cb-gallery-overlay">
                <span>
                  {isVi
                    ? "Dàn xe máy phượt cổ điển (Honda CB223S, PG-1)"
                    : "Vintage motorbikes available for rent"}
                </span>
              </div>
            </div>

            <div
              className="cb-gallery-item"
              onClick={() =>
                openPhotoModal(
                  "/stay/casa-blanca/phong_canh1.jpg",
                  "Hiên gỗ và luống hoa cúc rực rỡ",
                )
              }
            >
              <img
                src="/stay/casa-blanca/phong_canh1.jpg"
                alt="Khuôn viên nhà gỗ Casa Blanca"
                className="cb-gallery-img"
              />
              <div className="cb-gallery-overlay">
                <span>
                  {isVi
                    ? "Hiên gỗ và giàn hoa trước phòng"
                    : "Wooden porch & blooming flowers"}
                </span>
              </div>
            </div>

            <div
              className="cb-gallery-item"
              onClick={() =>
                openPhotoModal(
                  "/stay/casa-blanca/rau.jpg",
                  "Mảnh sân vườn rau xanh mướt được chủ nhà chăm chút",
                )
              }
            >
              <img
                src="/stay/casa-blanca/rau.jpg"
                alt="Vườn rau Casa Blanca"
                className="cb-gallery-img"
              />
              <div className="cb-gallery-overlay">
                <span>
                  {isVi
                    ? "Mảnh vườn rau xanh mướt tự nhiên"
                    : "Organic green vegetable garden"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7 Signature Rooms Section ── */}
        <section id="rooms-section" style={{ marginBottom: "60px" }}>
          <div className="cb-section-header">
            <span className="cb-section-pill">
              {isVi ? "BẢNG GIÁ & HẠNG PHÒNG" : "ROOM COLLECTION"}
            </span>
            <h2 className="cb-section-title">
              {isVi
                ? "7 Căn Phòng Biệt Lập Độc Bản"
                : "7 Handcrafted Wooden Rooms"}
            </h2>
            <p className="cb-section-subtitle">
              {isVi
                ? "Tất cả các phòng đều có nhà vệ sinh riêng khép kín, bài trí mộc mạc và mang tên những nét đẹp đặc trưng của phố núi."
                : "Each room features private ensuite amenities, rich wooden finishes, and uniquely poetic Dalat character."}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="cb-room-filter-row">
            <button
              type="button"
              className={`cb-filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              {isVi ? "Tất Cả (7 Phòng)" : "All (7 Rooms)"}
            </button>
            <button
              type="button"
              className={`cb-filter-btn ${activeFilter === "couple" ? "active" : ""}`}
              onClick={() => setActiveFilter("couple")}
            >
              {isVi ? "Phòng Đôi 2 Khách (3 Căn)" : "Double Rooms 2 Guests (3)"}
            </button>
            <button
              type="button"
              className={`cb-filter-btn ${activeFilter === "group" ? "active" : ""}`}
              onClick={() => setActiveFilter("group")}
            >
              {isVi
                ? "Phòng 4 Khách & Gác Mái (4 Căn)"
                : "4-Guest & Attic Rooms (4)"}
            </button>
          </div>

          {/* Rooms Grid */}
          <div className="cb-rooms-grid">
            {filteredRooms.map((room) => (
              <article key={room.id} className="cb-room-card">
                <div className="cb-room-media">
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="cb-room-img"
                    loading="lazy"
                  />
                  <span
                    className={`cb-room-badge ${room.id === "hien-nang" || room.id === "ben-tan-thong" ? "badge-vip" : ""}`}
                  >
                    {isVi ? room.badge : room.badgeEn}
                  </span>
                  <div
                    className="cb-room-photos-count"
                    onClick={() =>
                      openPhotoModal(
                        room.images[0],
                        `${room.title} - ${isVi ? room.subtitle : room.subtitleEn}`,
                      )
                    }
                  >
                    <Camera size={13} />
                    <span>
                      {room.images.length} {isVi ? "ảnh" : "photos"}
                    </span>
                  </div>
                </div>

                <div className="cb-room-body">
                  <h3 className="cb-room-title">
                    {isVi ? room.title : room.titleEn}
                  </h3>
                  <div className="cb-room-subtitle">
                    {isVi ? room.subtitle : room.subtitleEn}
                  </div>

                  <div className="cb-room-specs">
                    <span className="cb-room-spec-item">
                      <Bed size={15} color="#a67c52" />
                      <span>{isVi ? room.capacity : room.capacityEn}</span>
                    </span>
                  </div>

                  <p className="cb-room-desc">
                    {isVi ? room.desc : room.descEn}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "18px",
                    }}
                  >
                    {room.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "11.5px",
                          background: "#f5ece4",
                          color: "#4a3424",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontWeight: 500,
                        }}
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>

                  <div className="cb-room-pricing-row">
                    <div>
                      <div className="cb-price-old">{room.oldPrice}</div>
                      <div className="cb-price-now">
                        {room.currentPrice}
                        <span className="cb-price-unit">
                          /{isVi ? "đêm" : "night"}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://zalo.me/${hotlineNum}?text=${encodeURIComponent(`Chào Casa Blanca Homestay, em muốn đặt ${room.title} (${room.currentPrice}/đêm). Nhờ bên mình tư vấn giúp em nhé!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cb-room-book-btn"
                    >
                      <MessageCircle size={14} />
                      {isVi ? "Đặt phòng này" : "Book room"}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHOLE HOUSE RENTAL (SCREENSHOT 5) ── */}
        <section id="whole-house" className="cb-wholehouse-box">
          <div className="cb-wholehouse-inner">
            <div className="cb-wholehouse-info">
              <span
                className="cb-section-pill"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "#fef3c7",
                }}
              >
                {isVi ? "ĐỘC QUYỀN KHUÔN VIÊN" : "EXCLUSIVE BUYOUT"}
              </span>
              <h3>
                {isVi
                  ? "Thuê Nguyên Căn Trọn Vẹn 7 Phòng Ngủ"
                  : "Rent Entire 7-Bedroom Villa"}
              </h3>
              <p>
                {isVi
                  ? "Bao trọn khuôn viên sân vườn xanh mát và toàn bộ 7 phòng ngủ biệt lập khép kín dành cho đoàn gia đình, hội nhóm bạn bè từ 14 đến 20 khách. Tận hưởng sự riêng tư tuyệt đối, không gian yên bình và tự do sinh hoạt."
                  : "Take over the whole private compound including 7 ensuite bedrooms for groups or families of 14-20 guests. Complete privacy, shared kitchen, and garden BBQ facilities."}
              </p>

              <ul className="cb-wholehouse-benefits">
                <li className="cb-wholehouse-benefit-item">
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>
                    {isVi
                      ? "7 phòng ngủ khép kín với đầy đủ tiện nghi"
                      : "7 fully private ensuite bedrooms"}
                  </span>
                </li>
                <li className="cb-wholehouse-benefit-item">
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>
                    {isVi
                      ? "Tự do sử dụng căn bếp xinh xắn nấu nướng chung"
                      : "Full access to cozy cooking kitchen"}
                  </span>
                </li>
                <li className="cb-wholehouse-benefit-item">
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>
                    {isVi
                      ? "Khoảng sân vườn rộng rãi tổ chức tiệc BBQ ngoài trời"
                      : "Spacious garden patio for outdoor BBQ gatherings"}
                  </span>
                </li>
                <li className="cb-wholehouse-benefit-item">
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>
                    {isVi
                      ? "Hỗ trợ chuẩn bị lò than nướng BBQ và dụng cụ tiệc"
                      : "Complimentary BBQ grill setup and party utensils"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="cb-wholehouse-rates">
              <div className="cb-rate-row">
                <div className="cb-rate-label">
                  {isVi
                    ? "Thứ 2 – Thứ 6 (Ngày thường)"
                    : "Monday – Friday (Weekdays)"}
                </div>
                <div>
                  <span className="cb-rate-old">6.150.000đ</span>
                  <span className="cb-rate-val">4.250.000đ</span>
                  <span style={{ fontSize: "12px", color: "#d1c5b8" }}>
                    /{isVi ? "đêm" : "night"}
                  </span>
                </div>
              </div>

              <div className="cb-rate-row">
                <div className="cb-rate-label">
                  {isVi
                    ? "Thứ 7 & Chủ Nhật (Cuối tuần)"
                    : "Saturday & Sunday (Weekend)"}
                </div>
                <div>
                  <span className="cb-rate-old">6.850.000đ</span>
                  <span className="cb-rate-val">4.950.000đ</span>
                  <span style={{ fontSize: "12px", color: "#d1c5b8" }}>
                    /{isVi ? "đêm" : "night"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <a
                  href={`https://zalo.me/${hotlineNum}?text=${encodeURIComponent("Dạ chào Casa Blanca, đoàn mình muốn hỏi thuê nguyên căn trọn gói 7 phòng ngủ. Nhờ bạn tư vấn ngày trống và ưu đãi giúp mình nhé!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cb-btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <MessageCircle size={16} />
                  {isVi ? "Giữ Chỗ Thuê Nguyên Căn" : "Reserve Entire House"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Motorbikes & Camera Rental ── */}
        <section className="cb-services-box">
          <div className="cb-services-grid">
            <div className="cb-services-img-col">
              <img
                src="/stay/casa-blanca/xe_may.jpg"
                alt="Dàn xe máy phượt Casa Blanca Đà Lạt"
                className="cb-services-img"
              />
            </div>
            <div>
              <span className="cb-section-pill">
                {isVi ? "TIỆN ÍCH ĐẶC BIỆT" : "ON-SITE MOBILITY"}
              </span>
              <h3
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "var(--cb-wood-dark)",
                  margin: "0 0 12px 0",
                }}
              >
                {isVi
                  ? "Dịch Vụ Thuê Xe Máy & Sống Ảo"
                  : "Motorbike & Camera Rental"}
              </h3>
              <p
                style={{
                  fontSize: "14.5px",
                  color: "var(--cb-text-muted)",
                  lineHeight: 1.6,
                  margin: "0 0 16px 0",
                }}
              >
                {isVi
                  ? "Casa Blanca hỗ trợ liên kết các dòng xe máy đời mới, chất lượng cao ngay tại chỗ để du khách thuận tiện vi vu khắp các con đồi, dốc đứng và săn mây Đà Lạt."
                  : "Convenient on-site motorbike rentals to explore Dalat's scenic slopes, pine forests, and cloud-hunting spots."}
              </p>

              <div className="cb-bikes-list">
                <div className="cb-bike-item">
                  <span className="cb-bike-name">
                    🏍️ Mô tô cổ điển Honda CB223S
                  </span>
                  <span className="cb-bike-price">
                    200.000đ/{isVi ? "ngày" : "day"}
                  </span>
                </div>
                <div className="cb-bike-item">
                  <span className="cb-bike-name">
                    🛵 Xe số Yamaha PG-1 đen cá tính
                  </span>
                  <span className="cb-bike-price">
                    140.000đ/{isVi ? "ngày" : "day"}
                  </span>
                </div>
                <div className="cb-bike-item">
                  <span className="cb-bike-name">
                    🛵 Xe tay ga Air Blade đời mới
                  </span>
                  <span className="cb-bike-price">
                    140.000đ/{isVi ? "ngày" : "day"}
                  </span>
                </div>
                <div className="cb-bike-item">
                  <span className="cb-bike-name">
                    🛵 Xe tay ga Honda Vision êm ái
                  </span>
                  <span className="cb-bike-price">
                    120.000đ/{isVi ? "ngày" : "day"}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: "#8c7e70",
                  marginTop: "12px",
                  fontStyle: "italic",
                }}
              >
                *{" "}
                {isVi
                  ? "Nếu cần thuê xe máy hoặc máy ảnh, bạn vui lòng báo trước để home chuẩn bị chu đáo nhé!"
                  : "Please notify the host in advance if you wish to reserve motorbikes or camera equipment."}
              </p>
            </div>
          </div>
        </section>

        {/* ── Policies & Host Notes (Screenshot 3, 5) ── */}
        <section className="cb-policies-grid">
          <div className="cb-policy-card">
            <h4>
              <Clock size={20} color="#d97706" />
              {isVi ? "Quy Định Lưu Trú" : "Stay Policies"}
            </h4>
            <ul>
              <li>
                <strong>Check-in:</strong> 14:00 | <strong>Check-out:</strong>{" "}
                12:00.
              </li>
              <li>
                <strong>
                  {isVi ? "Phụ thu cuối tuần:" : "Weekend surcharge:"}
                </strong>{" "}
                {isVi
                  ? "Thứ 6 & Thứ 7 phụ thu 100.000đ/phòng/đêm."
                  : "Fri & Sat +100,000 VND/room/night."}
              </li>
              <li>
                <strong>
                  {isVi ? "Booking cuối tuần:" : "Weekend booking:"}
                </strong>{" "}
                {isVi
                  ? "Tối thiểu 2 đêm liên tiếp (T6–T7 hoặc T7–CN)."
                  : "Minimum 2 consecutive nights (Fri-Sat or Sat-Sun)."}
              </li>
              <li>
                <strong>{isVi ? "Trẻ em:" : "Children:"}</strong>{" "}
                {isVi
                  ? "Bé dưới 6 tuổi ở cùng bố mẹ hoàn toàn miễn phí."
                  : "Children under 6 stay free with parents."}
              </li>
            </ul>
          </div>

          <div className="cb-policy-card">
            <h4>
              <Heart size={20} color="#ef4444" />
              {isVi ? "Lời Nhắn Từ Casa Blanca" : "Host Notes"}
            </h4>
            <ul>
              <li>
                {isVi
                  ? "Home không bao gồm vệ sinh phòng hằng ngày như khách sạn để giữ không gian riêng tư tự nhiên cho khách."
                  : "Daily housekeeping is not included to preserve your natural, private home-like peace."}
              </li>
              <li>
                {isVi
                  ? "Home hỗ trợ dọn dẹp vệ sinh miễn phí 1 lần/tuần cho khách lưu trú dài ngày."
                  : "Complimentary cleaning is supported once a week for long-term stays."}
              </li>
              <li>
                {isVi
                  ? "Không gian sân vườn nhiều cây cỏ hoa lá, khuyến khích quý khách tận hưởng không khí trong lành và giữ gìn môi trường chung."
                  : "Lush gardens and flowers surround the cabins; please enjoy nature responsibly."}
              </li>
            </ul>
          </div>
        </section>

        {/* ── Location & Map Box ── */}
        <section className="cb-location-box">
          <div>
            <span className="cb-section-pill">
              {isVi ? "VỊ TRÍ ĐẮC ĐỊA" : "LOCATION"}
            </span>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--cb-wood-dark)",
                margin: "0 0 10px 0",
              }}
            >
              70/5 Pasteur, Phường Xuân Hương, TP. Đà Lạt
            </h3>
            <p
              style={{
                fontSize: "14.5px",
                color: "var(--cb-text-muted)",
                lineHeight: 1.6,
                margin: "0 0 18px 0",
              }}
            >
              {isVi
                ? "Tọa lạc tại con dốc Pasteur yên tĩnh rợp bóng cây, cách trung tâm chợ Đà Lạt và Hồ Xuân Hương chỉ khoảng 5-7 phút đi xe. Nơi đây đủ gần để bạn khám phá mọi điểm vui chơi, nhưng đủ tách biệt để tận hưởng sự yên ả tuyệt đối."
                : "Nestled on peaceful Pasteur slope, only 5-7 minutes drive from Dalat Market and Xuan Huong Lake. Close to the city's pulse yet secluded in peaceful nature."}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cb-btn-primary"
              >
                <MapPin size={16} />
                {isVi ? "Mở Google Maps chỉ đường" : "Open in Google Maps"}
              </a>
              <a
                href={`tel:${hotlineNum}`}
                className="cb-btn-primary"
                style={{ background: "#2c1d11" }}
              >
                <Phone size={16} />
                {hotline}
              </a>
            </div>
          </div>

          <div className="cb-location-map-wrap">
            <iframe
              title="Casa Blanca Dalat Homestay Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.351221568285!2d108.4283838!3d11.9427382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171131c5188f343%3A0x6b63f59048a609d5!2sCasa%20Blanca%20DaLat%20Homestay!5e0!3m2!1svi!2s!4v1728900000000!5m2!1svi!2s"
              loading="lazy"
            />
          </div>
        </section>
      </main>

      {/* ── Floating Contact Bar ── */}
      <aside className="cb-floating-cta-bar">
        <div className="cb-floating-homestay-info">
          <img
            src="/stay/casa-blanca/logo_casa.jpg"
            alt="Logo"
            className="cb-floating-logo"
          />
          <div>
            <div className="cb-floating-name">Casa Blanca Homestay</div>
            <div className="cb-floating-phone">Hotline: {hotline}</div>
          </div>
        </div>

        <div className="cb-floating-actions">
          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cb-btn-zalo"
            style={{ padding: "8px 18px", fontSize: "13px" }}
          >
            <MessageCircle size={15} />
            {isVi ? "Nhắn Zalo Tư Vấn" : "Zalo Chat"}
          </a>
          <a
            href={`tel:${hotlineNum}`}
            className="cb-btn-primary"
            style={{ padding: "8px 18px", fontSize: "13px" }}
          >
            <Phone size={15} />
            {isVi ? "Gọi Đặt Phòng" : "Call Host"}
          </a>
        </div>
      </aside>

      {/* ── Photo Lightbox Modal ── */}
      {lightboxOpen && (
        <div
          className="cb-lightbox-backdrop"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="cb-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cb-lightbox-close"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={26} />
            </button>
            <img
              src={lightboxImg}
              alt="Casa Blanca Preview"
              className="cb-lightbox-img"
            />
            {lightboxCaption && (
              <div className="cb-lightbox-caption">{lightboxCaption}</div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <PublicFooter lang={lang} />
    </div>
  );
}
