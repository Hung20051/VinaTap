"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Navigation,
  Sparkles,
  Utensils,
  Coffee,
  CheckCircle,
  Share2,
} from "lucide-react";
import "@/styles/home.css";
import "./banh-mi-long-hoi.css";

// ─── MENU ITEMS DATA ───
const LONG_HOI_MENU = [
  {
    id: "bm-tinh-yeu",
    name: "Bánh mì Tình Yêu (Signature)",
    nameEn: "Love Banh Mi (Signature)",
    price: "90,000₫",
    img: "/guide/banh-mi-long-hoi/banh-mi-tinh-yeu.png",
    tag: "Bán chạy nhất",
    tagEn: "Bestseller",
    desc: "Phiên bản đỉnh cao nhất của Long Hội với lượng topping dồi dào gấp đôi: thịt xíu mềm mọng, pate gan ngậy béo, chả lụa, dăm bông hảo hạng quyện sốt bơ trứng vàng sóng sánh.",
    descEn:
      "The ultimate signature creation loaded with double toppings: savory char siu pork, rich homemade liver pate, premium cold cuts, and golden egg-butter sauce.",
  },
  {
    id: "bm-truyen-thong",
    name: "Bánh mì Truyền Thống",
    nameEn: "Traditional Hoi An Banh Mi",
    price: "60,000₫",
    img: "/guide/banh-mi-long-hoi/banh-mi-truyen-thong.png",
    tag: "Chuẩn vị xứ Hội",
    tagEn: "Classic",
    desc: "Đại diện kinh điển cho hương vị phố cổ Hội An: vỏ bánh mỏng giòn tan, nhân thịt xíu gia truyền đậm đà, pate thơm nức, đồ chua giòn ngọt và rau ngò Trà Quế thơm cay dịu.",
    descEn:
      "The classic Hoi An recipe featuring thin crispy crust, tender marinated char siu, savory pate, crunchy pickles, and aromatic fresh Tra Que herbs.",
  },
  {
    id: "bm-an-lac",
    name: "Bánh mì An Lạc (Thuần Chay)",
    nameEn: "An Lac Vegetarian Banh Mi",
    price: "50,000₫",
    img: "/guide/banh-mi-long-hoi/banh-mi-an-lac.png",
    tag: "Vegetarian Friendly",
    tagEn: "Vegetarian",
    desc: "Lựa chọn thanh tịnh được đông đảo du khách quốc tế và tín đồ ẩm thực chay yêu thích. Nhân nấm và đạm thực vật tẩm ướp đậm vị, kết hợp sốt chay thanh tao không hề ngấy.",
    descEn:
      "A beloved plant-based specialty favored by international travelers, packed with savory seasoned mushrooms, vegan proteins, fresh herbs, and light homemade sauce.",
  },
  {
    id: "bm-nu-cuoi",
    name: "Bánh mì Nụ Cười",
    nameEn: "Smile Banh Mi (Sunny Egg)",
    price: "60,000₫",
    img: "/guide/banh-mi-long-hoi/banh-mi-nu-cuoi.png",
    tag: "Bữa sáng trọn vẹn",
    tagEn: "Breakfast Favorite",
    desc: "Bánh mì kẹp trứng ốp la lòng đào vàng ươm béo ngậy, phủ sốt bơ thơm lừng, dưa leo tươi mát và tiêu xay nồng nàn. Nạp trọn năng lượng hứng khởi cho ngày dạo phố cổ.",
    descEn:
      "Crispy baguette filled with sunny-side-up eggs, creamy butter spread, fresh cucumber, and aromatic pepper. A comforting and satisfying energy booster.",
  },
  {
    id: "bm-ca-ngu",
    name: "Bánh mì Tự Do (Cá Ngừ)",
    nameEn: "Freedom Banh Mi (Tuna)",
    price: "70,000₫",
    img: "/guide/banh-mi-long-hoi/banh-mi-ca-ngu.png",
    tag: "Hương vị mới lạ",
    tagEn: "Seafood Twist",
    desc: "Sự kết hợp độc đáo giữa cá ngừ đại dương ngọt bùi, sốt đặc chế béo chua nhẹ và xà lách tươi giòn, mang lại trải nghiệm ẩm thực hiện đại mà vẫn giữ chất mộc mạc.",
    descEn:
      "A modern twist combining savory ocean tuna, creamy tangy sauce, and fresh greens inside a crusty baguette for a refreshing culinary balance.",
  },
];

const LONG_HOI_DRINKS = [
  {
    name: "Trà quất mật ong",
    nameEn: "Kumquat Honey Iced Tea",
    price: "20,000₫",
    img: "/guide/banh-mi-long-hoi/tra-quat-mat-ong.png",
    desc: "Thức uống giải nhiệt thanh ngọt tự nhiên, vị chua thanh của quất hòa cùng mật ong rừng.",
    descEn: "Refreshing iced tea balanced with natural forest honey and fragrant calamansi juice.",
  },
  {
    name: "Sâm bí đao hạt chia",
    nameEn: "Winter Melon Herbal Tea with Chia Seeds",
    price: "20,000₫",
    img: "/guide/banh-mi-long-hoi/sam-bi-dao.png",
    desc: "Nấu từ cốt bí đao thanh mát kết hợp hạt chia bổ dưỡng, ngọt thanh dễ chịu.",
    descEn: "Cooling herbal brew made from roasted winter melon and nutritious chia seeds.",
  },
];

export default function BanhMiLongHoiPage() {
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    const saved = getLang();
    if (saved) setLang(saved);
  }, []);

  return (
    <div className="vnn-article-page longhoi-page">
      <PublicHeader />

      {/* ── HERO BANNER ── */}
      <section className="longhoi-hero">
        <div className="longhoi-hero__overlay" />
        <div className="longhoi-hero__content">
          <div className="longhoi-hero__badge">
            <Sparkles size={14} />
            <span>
              {lang === "vi"
                ? "TIÊU ĐIỂM ẨM THỰC PHỐ CỔ • ĐỐI TÁC CHÍNH THỨC"
                : "HANOI CULINARY SPOTLIGHT • OFFICIAL PARTNER"}
            </span>
          </div>
          <h1 className="longhoi-hero__title">
            {lang === "vi"
              ? "Bánh Mì Long Hội – Tinh Hoa Xứ Hội Giữa Lòng Phố Cổ Hà Nội"
              : "Long Hoi Banh Mi – The Soul of Hoi An in Hanoi's Old Quarter"}
          </h1>
          <p className="longhoi-hero__subtitle">
            {lang === "vi"
              ? "Trải nghiệm ổ bánh mì vỏ mỏng giòn tan, pate gia truyền béo ngậy và sốt bơ nức tiếng tại số 7 Hàng Quạt, Hoàn Kiếm."
              : "Experience the thin crispy crust, rich homemade pate, and secret butter sauce at 7 Hang Quat, Hoan Kiem District."}
          </p>

          <div className="longhoi-hero__meta">
            <span>📍 Số 7 Hàng Quạt, Hoàn Kiếm, Hà Nội</span>
            <span>•</span>
            <span>⏰ 10:00 – 22:30</span>
            <span>•</span>
            <span>📞 083 511 68 66</span>
          </div>

          <div className="longhoi-hero__actions">
            <a
              href="https://maps.google.com/?q=B%C3%A1nh+m%C3%AC+Long+H%E1%BB%99i,+7+H%C3%A0ng+Qu%E1%BA%A1t,+H%C3%A0+N%E1%BB%99i"
              target="_blank"
              rel="noopener noreferrer"
              className="longhoi-btn longhoi-btn--primary"
            >
              <Navigation size={16} />
              <span>{lang === "vi" ? "Chỉ đường Google Maps" : "Get Directions"}</span>
            </a>
            <a href="tel:0835116866" className="longhoi-btn longhoi-btn--secondary">
              <Phone size={16} />
              <span>{lang === "vi" ? "Gọi đặt bánh ngay" : "Call to Order"}</span>
            </a>
            <a
              href="https://banhmilonghoi.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="longhoi-btn longhoi-btn--outline"
            >
              <ExternalLink size={16} />
              <span>{lang === "vi" ? "Website chính thức" : "Visit Website"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── MAIN ARTICLE CONTAINER ── */}
      <main className="longhoi-container">
        {/* Story Intro */}
        <section className="longhoi-intro-card">
          <div className="longhoi-intro-grid">
            <div className="longhoi-intro-img-col">
              <img
                src="/guide/banh-mi-long-hoi/intro.jpg"
                alt="Tiệm Bánh Mì Long Hội 7 Hàng Quạt"
                className="longhoi-intro-img"
              />
              <p className="longhoi-caption">
                {lang === "vi"
                  ? "Bao bì giấy kraft vàng nghệ đặc trưng của Bánh Mì Long Hội tại số 7 Hàng Quạt"
                  : "Signature yellow kraft packaging of Long Hoi Banh Mi at 7 Hang Quat"}
              </p>
            </div>
            <div className="longhoi-intro-text-col">
              <span className="longhoi-subheading">
                {lang === "vi" ? "LỜI NGỎ VỀ THƯƠNG HIỆU" : "BRAND STORY"}
              </span>
              <h2>
                {lang === "vi"
                  ? "Cơn sốt bánh mì Hội An giữa lòng thủ đô ngàn năm"
                  : "The sensation of authentic Hoi An flavor in the heart of Hanoi"}
              </h2>
              <p>
                {lang === "vi" ? (
                  <>
                    Nhiều thực khách từng ngạc nhiên khi biết ngay giữa trung tâm thủ đô Hà Nội, có một tiệm bánh mì được bán với mức giá từ <strong>50.000₫ – 90.000₫</strong> nhưng từ sáng, trưa, chiều đến tối lúc nào cũng tấp nập thực khách ra vào. Những giờ cao điểm, nhiều người vẫn sẵn lòng xếp hàng để cầm trên tay ổ bánh mì nóng hổi, thơm phức.
                  </>
                ) : (
                  <>
                    Many food lovers are surprised to find a banh mi shop right in the center of Hanoi where loaves range from <strong>50,000₫ to 90,000₫</strong>, yet the place is bustling from morning till late night. During peak hours, locals and international travelers patiently queue up to savor these freshly baked, crispy baguettes.
                  </>
                )}
              </p>
              <p>
                {lang === "vi" ? (
                  <>
                    Sau khi bánh mì Việt Nam tạo nên cơn sốt ẩm thực toàn cầu, các chuỗi bánh mì tại Hà Nội mọc lên rất nhiều. Nhưng nổi bật nhất và được giới sành ăn cũng như dân văn phòng phố cổ truyền tai nhau chính là <strong>Bánh Mì Long Hội tại số 7 Hàng Quạt</strong> – nơi mang trọn vẹn hơi thở và phong vị hoài niệm của vùng đất di sản sông Hoài ra giữa lòng thủ đô.
                  </>
                ) : (
                  <>
                    Among Hanoi&apos;s myriad sandwich spots, <strong>Long Hoi Banh Mi at 7 Hang Quat</strong> stands out for faithfully carrying the heritage flavor of Hoi An ancient town into Hanoi Old Quarter, winning over both discerning foodies and world travelers.
                  </>
                )}
              </p>

              <div className="longhoi-highlights">
                <div className="longhoi-highlight-item">
                  <CheckCircle size={18} className="longhoi-check-icon" />
                  <span>{lang === "vi" ? "Vỏ bánh mỏng giòn xốp, không vụn nát" : "Thin crispy crust that stays flaky"}</span>
                </div>
                <div className="longhoi-highlight-item">
                  <CheckCircle size={18} className="longhoi-check-icon" />
                  <span>{lang === "vi" ? "Pate gan gia truyền béo bùi, sốt bơ trứng vàng sóng sánh" : "Rich homemade liver pate & egg-butter glaze"}</span>
                </div>
                <div className="longhoi-highlight-item">
                  <CheckCircle size={18} className="longhoi-check-icon" />
                  <span>{lang === "vi" ? "Đầy đủ lựa chọn thuần chay (Bánh mì An Lạc)" : "Vegetarian-friendly options available"}</span>
                </div>
                <div className="longhoi-highlight-item">
                  <CheckCircle size={18} className="longhoi-check-icon" />
                  <span>{lang === "vi" ? "Vị trí đắc địa: cách Hồ Hoàn Kiếm chỉ 2 phút đi bộ" : "Prime location: 2 minutes walk from Hoan Kiem Lake"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SIGNATURE MENU SECTION ── */}
        <section className="longhoi-menu-section">
          <div className="longhoi-section-header">
            <span className="longhoi-subheading">
              {lang === "vi" ? "THỰC ĐƠN ĐẶC SẮC" : "SIGNATURE MENU"}
            </span>
            <h2>
              {lang === "vi"
                ? "Những ổ bánh mì làm nên thương hiệu Long Hội"
                : "Handcrafted Banh Mi Creations"}
            </h2>
            <p>
              {lang === "vi"
                ? "Mỗi ổ bánh tại Long Hội là một tác phẩm được chăm chút tỉ mỉ từ nhân thịt xíu gia truyền, rau thơm tươi sạch đến nước sốt bí truyền."
                : "Every loaf is meticulously prepared with traditional char siu, farm-fresh herbs, and secret house-made dressings."}
            </p>
          </div>

          <div className="longhoi-menu-grid">
            {LONG_HOI_MENU.map((item) => (
              <div key={item.id} className="longhoi-product-card">
                <div className="longhoi-product-img-wrap">
                  <img src={item.img} alt={item.name} className="longhoi-product-img" />
                  <span className="longhoi-product-tag">
                    {lang === "vi" ? item.tag : item.tagEn}
                  </span>
                </div>
                <div className="longhoi-product-body">
                  <div className="longhoi-product-header">
                    <h3 className="longhoi-product-title">
                      {lang === "vi" ? item.name : item.nameEn}
                    </h3>
                    <span className="longhoi-product-price">{item.price}</span>
                  </div>
                  <p className="longhoi-product-desc">
                    {lang === "vi" ? item.desc : item.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DRINKS SECTION ── */}
        <section className="longhoi-drinks-section">
          <div className="longhoi-section-header">
            <span className="longhoi-subheading">
              {lang === "vi" ? "THỨC UỐNG THANH MÁT" : "REFRESHING BEVERAGES"}
            </span>
            <h2>
              {lang === "vi" ? "Bộ đôi thức uống kết hợp hoàn hảo" : "The Perfect Pairings"}
            </h2>
          </div>

          <div className="longhoi-drinks-grid">
            {LONG_HOI_DRINKS.map((drink, idx) => (
              <div key={idx} className="longhoi-drink-card">
                <img src={drink.img} alt={drink.name} className="longhoi-drink-img" />
                <div className="longhoi-drink-info">
                  <div className="longhoi-drink-head">
                    <h4>{lang === "vi" ? drink.name : drink.nameEn}</h4>
                    <span className="longhoi-drink-price">{drink.price}</span>
                  </div>
                  <p>{lang === "vi" ? drink.desc : drink.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── LOCATION & ORDER CARD ── */}
        <section className="longhoi-location-card">
          <div className="longhoi-location-grid">
            <div className="longhoi-location-info">
              <span className="longhoi-subheading">
                {lang === "vi" ? "THÔNG TIN ĐỊA ĐIỂM & ĐẶT MÓN" : "LOCATION & CONTACT"}
              </span>
              <h2>Bánh Mì Long Hội – Cơ Sở 7 Hàng Quạt</h2>

              <ul className="longhoi-info-list">
                <li>
                  <MapPin className="longhoi-info-icon" />
                  <div>
                    <strong>{lang === "vi" ? "Địa chỉ:" : "Address:"}</strong>
                    <span>Số 7 Hàng Quạt, P. Hàng Gai, Q. Hoàn Kiếm, Hà Nội</span>
                  </div>
                </li>
                <li>
                  <Clock className="longhoi-info-icon" />
                  <div>
                    <strong>{lang === "vi" ? "Giờ mở cửa:" : "Hours:"}</strong>
                    <span>10:00 – 22:30 (Mở cửa tất cả các ngày trong tuần)</span>
                  </div>
                </li>
                <li>
                  <Phone className="longhoi-info-icon" />
                  <div>
                    <strong>Hotline / Đặt hàng:</strong>
                    <a href="tel:0835116866" style={{ color: "#d97706", fontWeight: "700" }}>
                      083 511 68 66
                    </a>
                  </div>
                </li>
              </ul>

              <div className="longhoi-location-actions">
                <a
                  href="https://maps.google.com/?q=B%C3%A1nh+m%C3%AC+Long+H%E1%BB%99i,+7+H%C3%A0ng+Qu%E1%BA%A1t,+H%C3%A0+N%E1%BB%99i"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="longhoi-btn longhoi-btn--primary"
                >
                  <Navigation size={16} />
                  <span>{lang === "vi" ? "Mở Google Maps chỉ đường" : "Open in Google Maps"}</span>
                </a>
                <a href="tel:0835116866" className="longhoi-btn longhoi-btn--secondary">
                  <Phone size={16} />
                  <span>{lang === "vi" ? "Gọi 083 511 68 66" : "Call Now"}</span>
                </a>
              </div>
            </div>

            <div className="longhoi-map-frame">
              <iframe
                title="Bản đồ Bánh Mì Long Hội 7 Hàng Quạt"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14896.058251279437!2d105.85397!3d21.0321033!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abbfb67d00af%3A0xf878acf22b0f18eb!2zQsOhbmggbcOsIExvbmcgSOG7mWk!5e0!3m2!1svi!2s!4v1731294787008!5m2!1svi!2s"
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: "14px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* ── RELATED TRAVEL GUIDES ── */}
        <section className="longhoi-related">
          <h3>{lang === "vi" ? "Cẩm nang ẩm thực liên quan" : "Related Culinary Guides"}</h3>
          <div className="longhoi-related-grid">
            <Link href="/guide/8-must-try-foods-in-hanoi" className="longhoi-related-card">
              <img
                src="/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg"
                alt="8 món ăn phải thử tại Hà Nội"
              />
              <div className="longhoi-related-content">
                <span className="longhoi-related-tag">Hà Nội</span>
                <h4>
                  {lang === "vi"
                    ? "8 món ăn nhất định phải thử tại Hà Nội"
                    : "8 Must-Try Foods in Hanoi"}
                </h4>
              </div>
            </Link>

            <Link href="/province/ha-noi" className="longhoi-related-card">
              <img src="/guide/hanoi/hanoi-banner-hd.jpg" alt="Cẩm nang du lịch Hà Nội" />
              <div className="longhoi-related-content">
                <span className="longhoi-related-tag">Điểm đến</span>
                <h4>
                  {lang === "vi"
                    ? "Cẩm nang du lịch Hà Nội từ A – Z"
                    : "The Ultimate Hanoi Travel Guide"}
                </h4>
              </div>
            </Link>

            <Link href="/province/hoi-an" className="longhoi-related-card">
              <img src="/guide/hoi-an/hero-hoi-an-lanterns.jpg" alt="Khám phá phố cổ Hội An" />
              <div className="longhoi-related-content">
                <span className="longhoi-related-tag">Hội An</span>
                <h4>
                  {lang === "vi"
                    ? "Khám phá vẻ đẹp di sản Phố Cổ Hội An"
                    : "Explore the Ancient Charm of Hoi An"}
                </h4>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <ProvinceChatbot />
      <PublicFooter />
    </div>
  );
}
