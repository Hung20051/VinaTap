"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  MapPin,
  Clock,
  ArrowRight,
  Utensils,
  Sparkles,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/ao-dai-article.css";


// ─── DANH SÁCH QUÁN PHỞ TRỨ DANH (BILINGUAL 100%) ───
const PHO_EATERIES = {
  hanoi: [
    {
      id: "thin-bo-ho",
      nameVi: "Phở Thìn Bờ Hồ",
      nameEn: "Pho Thin Bo Ho (Old Quarter)",
      addressVi: "61 Đinh Tiên Hoàng, Q. Hoàn Kiếm (đối diện Hồ Gươm)",
      addressEn: "61 Dinh Tien Hoang, Hoan Kiem Dist (opposite Sword Lake)",
      hoursVi: "06:00 – 13:00 & 17:30 – 22:00",
      hoursEn: "06:00 AM – 01:00 PM & 05:30 PM – 10:00 PM",
      priceVi: "60.000 – 80.000 VNĐ",
      priceEn: "60,000 – 80,000 VND ($2.4 – $3.2)",
      descVi:
        "Quán phở gia truyền 70 năm sâu trong con ngõ nhỏ. Nước dùng trong veo thanh dịu, gầu giòn sần sật, giữ trọn cốt cách thanh lịch của phở phố cổ.",
      descEn:
        "A 70-year-old family-run stall tucked inside a narrow alley opposite Hoan Kiem Lake. Renowned for crystal-clear broth, delightfully crunchy brisket, and time-honored Old Quarter elegance.",
    },
    {
      id: "bat-dan",
      nameVi: "Phở Gia Truyền Bát Đàn",
      nameEn: "Pho Gia Truyen Bat Dan",
      addressVi: "49 Bát Đàn, Q. Hoàn Kiếm, Hà Nội",
      addressEn: "49 Bat Dan, Hoan Kiem Dist, Hanoi",
      hoursVi: "06:00 – 10:00 & 18:00 – 20:30",
      hoursEn: "06:00 AM – 10:00 AM & 06:00 PM – 08:30 PM",
      priceVi: "55.000 – 75.000 VNĐ",
      priceEn: "55,000 – 75,000 VND ($2.2 – $3.0)",
      descVi:
        "Huyền thoại văn hóa xếp hàng tự bưng bát phở nóng hổi. Thịt bò tái băm dập tay tươi rói, nước dùng xương tủy béo ngậy đậm đà.",
      descEn:
        "A living legend where patrons patiently queue up to carry their own steaming bowls. Features hand-pounded rare steak and an unforgettably rich bone-marrow broth.",
    },
    {
      id: "ly-quoc-su",
      nameVi: "Phở 10 Lý Quốc Sư (Michelin Selected)",
      nameEn: "Pho 10 Ly Quoc Su (Michelin Selected)",
      addressVi: "10 Lý Quốc Sư, Q. Hoàn Kiếm, Hà Nội",
      addressEn: "10 Ly Quoc Su, Hoan Kiem Dist, Hanoi",
      hoursVi: "06:00 – 22:00",
      hoursEn: "06:00 AM – 10:00 PM",
      priceVi: "65.000 – 120.000 VNĐ",
      priceEn: "65,000 – 120,000 VND ($2.6 – $4.8)",
      descVi:
        "Được cẩm nang ẩm thực Michelin vinh danh, không gian máy lạnh sạch sẽ, bát phở bắp bò trần thơm nức mùi gừng nướng và thảo quả.",
      descEn:
        "Recognized by the Michelin Guide with spotless air-conditioned seating. Delivers tender shank beef in an aromatic broth infused with roasted ginger and cardamom.",
    },
    {
      id: "thin-lo-duc",
      nameVi: "Phở Thìn Lò Đúc (Phở Tái Lăn Áp Chảo)",
      nameEn: "Pho Thin Lo Duc (Stir-Fried Beef Pho)",
      addressVi: "13 Lò Đúc, Q. Hai Bà Trưng, Hà Nội",
      addressEn: "13 Lo Duc, Hai Ba Trung Dist, Hanoi",
      hoursVi: "06:00 – 20:30",
      hoursEn: "06:00 AM – 08:30 PM",
      priceVi: "70.000 – 90.000 VNĐ",
      priceEn: "70,000 – 90,000 VND ($2.8 – $3.6)",
      descVi:
        "Thịt bò xào lăn áp chảo trên lửa lớn cùng tỏi gừng thơm lừng, phủ ngập hành hoa xanh biếc béo ngậy độc nhất vô nhị.",
      descEn:
        "Famous for flash-frying marinated beef with garlic over roaring woks before ladling over noodles and blankets of vibrant green scallions.",
    },
  ],
  danang: [
    {
      id: "bac-hai",
      nameVi: "Phở Bắc Hải",
      nameEn: "Pho Bac Hai (Central Da Nang)",
      addressVi: "185 Trần Phú, Q. Hải Châu, TP. Đà Nẵng",
      addressEn: "185 Tran Phu, Hai Chau Dist, Da Nang",
      hoursVi: "06:00 – 23:00",
      hoursEn: "06:00 AM – 11:00 PM",
      priceVi: "50.000 – 70.000 VNĐ",
      priceEn: "50,000 – 70,000 VND ($2.0 – $2.8)",
      descVi:
        "Quán phở Bắc lâu năm giữa lòng Đà Nẵng, nước dùng trong thơm dịu vị quế hồi, thịt bò mềm ngọt và phục vụ chu đáo.",
      descEn:
        "A long-standing Northern-style pho favorite in downtown Da Nang, serving delicate star anise-scented broth and tender beef cuts with attentive service.",
    },
    {
      id: "viet-beo",
      nameVi: "Phở Việt Béo",
      nameEn: "Pho Viet Beo",
      addressVi: "35 Lý Tự Trọng, Q. Hải Châu, TP. Đà Nẵng",
      addressEn: "35 Ly Tu Trong, Hai Chau Dist, Da Nang",
      hoursVi: "06:00 – 21:00",
      hoursEn: "06:00 AM – 09:00 PM",
      priceVi: "50.000 – 65.000 VNĐ",
      priceEn: "50,000 – 65,000 VND ($2.0 – $2.6)",
      descVi:
        "Bát phở đầy đặn, nước dùng ngọt thanh xương hầm, thịt bắp bò giòn sần sật ăn kèm rau húng quế và ớt ngâm chua cay nồng.",
      descEn:
        "Generous portions with naturally sweet marrow broth, crisp beef shank slices, fresh basil, and fiery pickled chilies.",
    },
  ],
  saigon: [
    {
      id: "hoa-pasteur",
      nameVi: "Phở Hòa Pasteur (Michelin Selected)",
      nameEn: "Pho Hoa Pasteur (Michelin Selected)",
      addressVi: "260C Pasteur, Phường 8, Quận 3, TP.HCM",
      addressEn: "260C Pasteur, Ward 8, District 3, HCMC",
      hoursVi: "06:00 – 22:30",
      hoursEn: "06:00 AM – 10:30 PM",
      priceVi: "90.000 – 125.000 VNĐ",
      priceEn: "90,000 – 125,000 VND ($3.6 – $5.0)",
      descVi:
        "Quán phở hơn 50 năm tuổi trên con phố Pasteur trứ danh. Bát phở khổng lồ đầy ắp thịt bò, đĩa rau thơm, ngò gai tươi mởn cùng giò quẩy giòn tan.",
      descEn:
        "Over 50 years of heritage on historic Pasteur Street. Serves massive bowls heaped with premium beef, mountainous herb platters, culantro, and golden fried crullers.",
    },
    {
      id: "le-cholon",
      nameVi: "Phở Lệ (Quận 5 - Chợ Lớn)",
      nameEn: "Pho Le (District 5 - Chinatown)",
      addressVi: "415 Nguyễn Trãi, Phường 7, Quận 5, TP.HCM",
      addressEn: "415 Nguyen Trai, Ward 7, District 5, HCMC",
      hoursVi: "06:00 – 01:00 sáng",
      hoursEn: "06:00 AM – 01:00 AM (Late night)",
      priceVi: "85.000 – 110.000 VNĐ",
      priceEn: "85,000 – 110,000 VND ($3.4 – $4.4)",
      descVi:
        "Bò viên khổng lồ giòn sần sật nức tiếng khắp Chợ Lớn. Nước dùng đậm đà béo ngậy chuẩn gu phở miền Nam, khách ra vào nườm nượp đến tận nửa đêm.",
      descEn:
        "Renowned across Chinatown for enormous crunchy homemade meatballs and rich, sweet-savory Southern broth. Bustles with hungry patrons late into the night.",
    },
    {
      id: "phu-vuong",
      nameVi: "Phở Phú Vương",
      nameEn: "Pho Phu Vuong (District 1 & Tan Binh)",
      addressVi: "120 Nguyễn Thái Bình, Q.1 & 339 Lê Văn Sỹ, Tân Bình, TP.HCM",
      addressEn: "120 Nguyen Thai Binh, Dist 1 & 339 Le Van Sy, Tan Binh Dist, HCMC",
      hoursVi: "06:00 – 23:00",
      hoursEn: "06:00 AM – 11:00 PM",
      priceVi: "70.000 – 100.000 VNĐ",
      priceEn: "70,000 – 100,000 VND ($2.8 – $4.0)",
      descVi:
        "Bò tái mềm tan, nạm gầu thơm lừng, chén tương đen đặc chế cực kỳ cuốn miệng dành cho người sành ăn Sài Gòn.",
      descEn:
        "Silky melt-in-your-mouth rare beef, fragrant flank cuts, and an addictive house-crafted sweet bean dipping sauce beloved by local foodies.",
    },
    {
      id: "hung",
      nameVi: "Phở Hùng (Quận 1)",
      nameEn: "Pho Hung (District 1)",
      addressVi: "243 Nguyễn Trãi, P. Nguyễn Cư Trinh, Quận 1, TP.HCM",
      addressEn: "243 Nguyen Trai, Nguyen Cu Trinh Ward, Dist 1, HCMC",
      hoursVi: "06:00 – 02:00 sáng",
      hoursEn: "06:00 AM – 02:00 AM",
      priceVi: "75.000 – 110.000 VNĐ",
      priceEn: "75,000 – 110,000 VND ($3.0 – $4.4)",
      descVi:
        "Không gian máy lạnh lịch sự, nước súp ngọt tủy xương và phục vụ chuyên nghiệp cho khách du lịch quốc tế.",
      descEn:
        "Spacious air-conditioned dining, naturally sweet bone broth, and friendly multilingual service ideal for international travelers.",
    },
  ],
};

export default function PhoGuidePage() {
  const [lang, setLang] = useState("vi");
  const [activeMenu, setActiveMenu] = useState(null);
  const menuTimerRef = useRef(null);

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => {
      setLang(e.detail);
    };
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
    };
  }, []);

  useEffect(() => {
    document.title =
      lang === "vi"
        ? "Phở – Quốc Hồn Quốc Túy: Cẩm Nang Trọn Vẹn | VinaTap"
        : "Pho: The Complete Guide to the Vietnamese Noodle Soup | VinaTap";
  }, [lang]);

  const handleMenuEnter = (menuKey) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(menuKey);
  };

  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleMegaMouseEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const isVi = lang === "vi";

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* ─── 1. EDITORIAL NAVBAR (CHUẨN 100% NHƯ LANDING PAGE) ─── */}
      <PublicHeader />

      {/* ─── 2. HERO COVER SECTION (CHUẨN BÀI VIẾT QUỐC GIA) ─── */}
      <section
        className="ad-hero"
        style={{
          backgroundImage:
            "url('/guide/pho/pho-the-complete-guide-to-the-vietnamese-noodle-soup-vietnamnomad.jpg')",
        }}
      >
        <div className="ad-hero__overlay" />
        <div className="ad-hero__content">
          <span className="ad-badge">
            {isVi
              ? "ẨM THỰC VIỆT NAM • QUỐC HỒN QUỐC TÚY"
              : "VIETNAMESE CUISINE • NATIONAL ICON"}
          </span>
          <h1 className="ad-hero__title">
            {isVi
              ? "Phở – Quốc Hồn Quốc Túy: Cẩm Nang Trọn Vẹn Về Món Nước Huyền Thoại"
              : "Pho: The Complete Guide to the Vietnamese Noodle Soup"}
          </h1>
          <div className="ad-hero__meta" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <Logo
              size={20}
              showText={true}
              noLink
              href={null}
              as="span"
              className="vnn-hero-author-logo"
            />
            <span>•</span>
            <span>{isVi ? "16 Tháng 10, 2026" : "October 16, 2026"}</span>
          </div>
        </div>
      </section>

      {/* ─── 3. MAIN ARTICLE CONTAINER (ĐỒNG BỘ 100% THEO CHUẨN AO-DAI-ARTICLE) ─── */}
      <article className="ad-article-container">
        {/* Lời tựa (Intro text) */}
        <p className="ad-intro-text">
          {isVi
            ? "Phở trong lòng người Việt Nam không đơn thuần là một món ăn quốc dân mà là cả một đài tưởng niệm văn hóa, một niềm tự hào bất biến gợi nhớ về cội nguồn di sản phong phú, độc đáo và là hình ảnh thân thuộc gắn chặt với tâm hồn của mỗi người con đất Việt. Từ những gánh hàng rong mộc mạc bên bến sông Đáy Nam Định, góc phố cổ Hà Nội mù sương đầu thế kỷ 20 cho đến vị thế đại sứ ẩm thực trên toàn cầu — hãy cùng VinaTap khám phá trọn vẹn hành trình trăm năm của bát phở."
            : "Pho in the heart of Vietnamese people is more than just a universal dish but a cultural monument that we take pride in, a reminder of how rich and unique our heritage is, and an intimate image that we hold on to as a piece of our soul. From humble street carts along Nam Dinh's Day River in the early 20th century to global culinary fame, explore the complete story of Vietnam's iconic soup."}
        </p>

        {/* ══════════════════════════════════════════════════════════
            MỤC 1: LỊCH SỬ HÌNH THÀNH & PHÁT TRIỂN
            ══════════════════════════════════════════════════════════ */}
        <h2 className="ad-section-heading">
          {isVi
            ? "1. Lịch Sử Hình Thành & Hành Trình Của Phở"
            : "1. A Brief History of Pho"}
        </h2>
        <p className="ad-section-intro">
          {isVi
            ? "Dù ngày nay phở hiện diện ở khắp mọi góc phố từ Bắc chí Nam, hành trình ra đời của món ăn này là cả một thiên lịch sử văn hóa đầy sống động."
            : "While pho can be found on every corner today, the dish's origin story is a captivating cultural journey through Vietnamese history."}
        </p>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi ? "1.1 Phở là gì?" : "1.1 What is Pho?"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Năm 1930, từ 'Phở' lần đầu tiên xuất hiện trong từ điển Khai Trí Tiến Đức và được định nghĩa ngắn gọn: 'Món ăn bằng bánh cuốn thái nhỏ nấu với thịt bò'. Trải qua thời gian, từ 'Pho' đã được đưa nguyên bản vào các từ điển danh tiếng như Oxford, Cambridge và Merriam-Webster, trở thành danh từ riêng đại diện cho món súp bánh gạo truyền thống nấu cùng nước dùng hầm xương kỳ công của người Việt."
              : "In 1930, pho was defined for the first time in the Vietnamese dictionary 'Khai Tri Tien Duc' as simply 'a dish of flat rice noodles cooked with beef.' Over decades, pho officially entered Oxford, Cambridge, and Merriam-Webster dictionaries as 'a type of Vietnamese soup made of beef or chicken broth, served with flat rice noodles, sliced meat, and fresh herbs.'"}
          </p>
        </div>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi
              ? "1.2 Nguồn gốc tên gọi 'Phở'"
              : "1.2 Where is the Name 'Pho' Rooted?"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Có nhiều giả thuyết thú vị xoay quanh tên gọi này. Có học giả từng cho rằng chữ phở bắt nguồn từ món súp thịt bò hầm 'pot-au-feu' của người Pháp, hay món 'ngưu nhục phấn' của người Hoa. Tuy nhiên, nhiều nhà ngôn ngữ học khẳng định nguồn gốc gắn bó chặt chẽ với chữ Nôm Việt Nam — cấu thành từ bộ Mễ (gạo), bộ Ngôn (lời nói) và chữ Phổ (phổ biến rộng rãi), mang ý nghĩa món ăn từ hạt gạo thơm lành lan tỏa từ miệng người này sang người khác."
              : "Some scholars suggest pho derived from the French beef stew 'pot-au-feu' (fire pot), while others link it to Cantonese vendors selling 'nguu yuk phan' (beef noodles). However, strong linguistic evidence connects pho to Chu Nom — Vietnam's historical script. The character combines elements meaning 'rice', 'word of mouth', and 'popular', beautifully describing a street food made from rice spread by community reputation."}
          </p>
        </div>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/where-was-pho-first-created-vietnamnomad.jpg"
              alt={
                isVi
                  ? "Bát phở bò truyền thống Việt Nam"
                  : "Traditional Vietnamese beef pho"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Bát phở bò truyền thống nghi ngút khói với thịt bò tươi mềm và nước dùng thanh ngọt."
              : "A steaming bowl of traditional Vietnamese beef pho with rare beef, scallions, and golden broth."}
          </figcaption>
        </figure>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi
              ? "1.3 Phở ra đời ở đâu? (Nam Định & Hà Nội)"
              : "1.3 Where Was Pho First Created? (Nam Dinh & Hanoi)"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Trước cuối thế kỷ 19, trâu bò chỉ dùng kéo cày trong nông nghiệp, người Việt hầu như không giết mổ bò ăn thịt. Món xáo trâu ăn với bún ban đầu chỉ phục vụ phu phen, thợ thuyền bến sông Đáy tại Nam Định. Đến thời Pháp thuộc, nhu cầu ăn thịt bò của người Pháp ở Hà Nội tăng cao dẫn tới lò mổ thịt bò đầu tiên ra đời năm 1885. Những người nấu bếp tài hoa đất Bắc đã tận dụng xương ống, xương vè và vụn bò mang ninh liu riu thâu đêm trên bếp than quả bàng, thay thế nước xáo trâu nguội bằng nước dùng hầm xương bò nóng hổi ăn cùng bánh cuốn thái mỏng — món Phở bò chính thức ra đời từ đó."
              : "Before the late 19th century, water buffalo was the primary source of labor in Vietnamese agriculture, and beef consumption was practically non-existent. Buffalo meat noodles were originally served to manual laborers along the Day River in Nam Dinh province. When French colonial officers and merchants arrived in Hanoi, beef demands soared, giving birth to Hanoi's first butchery in 1885. Local street cooks cleverly utilized leftover marrow bones and beef scraps to brew deeply fragrant broths on constant low charcoal embers — birthing modern hot beef pho."}
          </p>
        </div>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi
              ? "1.4 Phở gà xuất hiện khi nào? (Cột mốc 1939)"
              : "1.4 When Did Pho Ga (Chicken Pho) Emerge? (1939 Milestone)"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Phở gà xuất hiện lần đầu tiên tại Hà Nội vào khoảng năm 1939. Vào thời kỳ đó, các lò mổ bò bị chính quyền bắt buộc đóng cửa 2 ngày mỗi tuần (thứ Hai và thứ Sáu) để tránh cạn kiệt gia súc cày bừa. Không đành lòng để khách quen thiếu phở, các chủ quán đã sáng tạo chuyển sang dùng gà ta thả vườn ninh lấy nước ngọt thanh, điểm xuyết lá chanh thái chỉ mảnh như sợi tóc. Ban đầu bị người sành ăn phản đối, phở gà sau đó nhanh chóng được đón nhận và trở thành một biểu tượng trường tồn."
              : "Pho ga (chicken pho) first appeared in Hanoi around 1939. In the late 1930s, butcher shops were legally mandated to close twice a week (Mondays and Fridays) to preserve livestock. For die-hard pho enthusiasts, two pho-less days were intolerable. Innovative stallholders improvised by simmering free-range chicken bones, adding charred ginger, coriander roots, and sliced lime leaves. It quickly won over the capital and became an enduring classic."}
          </p>
        </div>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/pho-ga-vietnamnomad.jpg"
              alt={
                isVi
                  ? "Phở gà ta da vàng óng ả thái lá chanh"
                  : "Traditional chicken pho (Pho Ga)"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Phở gà ta da vàng óng ánh với lá chanh thái sợi — sự biến tấu tài tình từ năm 1939."
              : "Traditional chicken pho (Pho Ga) with free-range chicken and finely sliced lime leaves."}
          </figcaption>
        </figure>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi
              ? "1.5 Hành trình Nam tiến & Đại sứ ẩm thực toàn cầu"
              : "1.5 The Journey South & Global Stardom"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Sau năm 1954, làn sóng di cư mang theo những gánh phở gia truyền từ Bắc vào Sài Gòn. Tại mảnh đất phương Nam hào sảng, phở tiếp nhận thêm bò viên, ngập tràn rau quế, ngò gai, giá đỗ và tương đen ngọt bùi. Sau năm 1975, phở theo chân kiều bào đến Paris, Little Saigon (California), Melbourne và khắp năm châu. Đến năm 1990, đầu bếp Mỹ Didi Emmons mở tiệm phở đầu tiên tại Massachusetts, đưa phở trở thành một trong những món ăn đường phố được yêu thích nhất hành tinh."
              : "Following the 1954 Geneva Accords, nearly one million Northerners migrated south, carrying family pho recipes to Saigon. In the vibrant southern climate, pho evolved: beef balls were added, herbs like holy basil and culantro flourished, and sweet hoisin sauce complemented the broth. After 1975, Vietnamese immigrants introduced pho to Paris, California's Little Saigon, and Sydney. In 1990, American chef Didi Emmons opened the first US-run pho restaurant in Massachusetts, cementing pho's place on the global culinary stage."}
          </p>
        </div>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/a-brief-history-of-pho-vietnamnomad.jpg"
              alt={
                isVi
                  ? "Hành trình trăm năm của phở Việt"
                  : "A brief history of Vietnamese pho"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Trải qua hơn 100 năm thăng trầm, phở là món ăn đại diện kiêu hãnh cho tinh hoa ẩm thực Việt Nam."
              : "Over a century of evolution, pho stands as the undisputed ambassador of Vietnamese culture."}
          </figcaption>
        </figure>

        {/* ══════════════════════════════════════════════════════════
            MỤC 2: NGUYÊN LIỆU & BÍ QUYẾT NƯỚC DÙNG
            ══════════════════════════════════════════════════════════ */}
        <h2 className="ad-section-heading">
          {isVi
            ? "2. Bí Quyết Nước Dùng & Nguyên Liệu Chuẩn Vị"
            : "2. Pho Ingredients & Broth Secrets"}
        </h2>
        <p className="ad-section-intro">
          {isVi
            ? "Linh hồn của tô phở nằm trọn trong nồi nước dùng thơm nức. Không có công thức phở gói nào có thể thay thế được sự kỳ công ninh xương hàng chục giờ đồng hồ."
            : "The essence of pho lies entirely within its deeply scented broth. Crafting authentic broth demands hours of patient simmering, temperature control, and spice balance."}
        </p>

        <ul className="ad-bullet-list">
          <li className="ad-bullet-item">
            <strong>
              {isVi ? "Nồi nước dùng (Nước súp): " : "The Broth (Nuoc Dung): "}
            </strong>
            {isVi
              ? "Xương ống bò đập vỡ hai đầu lấy tủy, xương đuôi và nạm bò được rửa sạch muối, chần qua nước sôi rồi ninh lửa liu riu từ 8 đến 12 tiếng. Người nấu liên tục vớt bọt để nước trong tựa hổ phách mà không bị đục."
              : "Beef marrow bones, knuckles, and brisket simmered for 8-12 hours on gentle low heat. Continuously skimmed to maintain translucent clarity without cloudiness."}
          </li>
          <li className="ad-bullet-item">
            <strong>
              {isVi
                ? "Thảo mộc sao vàng & Gia vị nướng: "
                : "Charred Aromatics & Spices: "}
            </strong>
            {isVi
              ? "Hoa hồi, quế thanh, thảo quả nướng đập dập, tiểu hồi, hạt mùi và đinh hương được sao thơm rồi bọc vào túi vải; kết hợp cùng gừng nướng xém vỏ và hành tím nướng đập dập thơm lừng."
              : "Star anise, cinnamon sticks, black cardamom pods, fennel seeds, and cloves lightly dry-roasted, combined with charred yellow ginger and shallots."}
          </li>
          <li className="ad-bullet-item">
            <strong>
              {isVi ? "Sợi bánh phở: " : "Rice Noodles (Banh Pho): "}
            </strong>
            {isVi
              ? "Tráng từ bột gạo tẻ ngâm kỹ, thái sợi dẻo dai tự nhiên, mướt mịn mà không bị bở nát. Phở Bắc bản to ngậm nước dùng, phở Nam sợi mảnh dai sần sật."
              : "Steamed from seasoned rice flour slurry, hand-cut into silky strands. Northern pho favors wider flat sheets, while Southern pho uses thinner, firmer noodles."}
          </li>
          <li className="ad-bullet-item">
            <strong>
              {isVi ? "Topping thịt & Rau thơm: " : "Meat Cuts & Herbs: "}
            </strong>
            {isVi
              ? "Thịt bò tái băm đập dập, chín nạm, gầu giòn sần sật, gân bò, bò viên hoặc thịt gà ta xé phay. Điểm xuyết hành hoa chần, rau mùi, húng quế và ớt tươi cay nồng."
              : "Eye-round steak (tai), flank (nam), crunchy brisket (gau), tendon (gan), and meatballs (bo vien). Garnished with scallions, culantro, fresh chili, and pickled garlic."}
          </li>
        </ul>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/pho-ingredients-vietnamnomad.jpg"
              alt={
                isVi
                  ? "Nguyên liệu thảo mộc nấu phở"
                  : "Aromatic herbs and spices for pho"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Hoa hồi, quế, thảo quả và gừng nướng — ngũ vị thảo mộc tạo nên hồn cốt nồi nước dùng phở."
              : "Aromatic herbs and whole spices that give Vietnamese pho broth its signature flavor."}
          </figcaption>
        </figure>

        {/* ══════════════════════════════════════════════════════════
            MỤC 3: PHÂN BIỆT PHỞ 3 MIỀN BẮC – TRUNG – NAM
            ══════════════════════════════════════════════════════════ */}
        <h2 className="ad-section-heading">
          {isVi
            ? "3. Bản Sắc Phở 3 Miền: Bắc – Trung – Nam"
            : "3. Regional Styles: North, Central & South"}
        </h2>
        <p className="ad-section-intro">
          {isVi
            ? "Mỗi vùng miền trên dải đất hình chữ S lại thổi vào bát phở phong vị và phong cách thưởng thức rất riêng."
            : "Every geographical region shapes the broth, noodle shape, accompaniments, and eating etiquette to reflect its unique climate and culture."}
        </p>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi
              ? "3.1 Phở Miền Bắc (Hà Nội & Nam Định) – Tôn Vinh Vị Ngọt Nguyên Bản"
              : "3.1 Northern Pho (Hanoi & Nam Dinh) – Minimalist & Pure"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Người miền Bắc thưởng thức phở với sự kỹ tính và trân trọng vị ngọt tự nhiên nguyên bản từ xương tủy. Nồi nước dùng trong veo, hiếm khi thấy váng mỡ nổi lềnh bềnh. Người sành ăn Hà Nội không bao giờ cho giá đỗ hay tương đen vào bát phở, bởi họ coi đó là làm 'phá vị' công sức ninh hầm chục tiếng của người nấu. Món ăn kèm kinh điển duy nhất là đĩa quẩy giòn tan (bánh quẩy) nhúng đẫm vào nước dùng cùng lát ớt tươi và vài giọt giấm tỏi ngâm."
              : "In Northern Vietnam, diners prioritize the natural, uncluttered sweetness of beef bones. The broth is crystal clear and virtually free of floating grease. True Hanoians do not add bean sprouts or hoisin sauce, viewing excessive sauces as an insult to the chef's hard-earned broth. Fried dough breadsticks (banh quay) dipped directly into the soup are the quintessential companion."}
          </p>
        </div>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/pho-in-northern-vietnam-.jpg"
              alt={
                isVi
                  ? "Phở miền Bắc với bánh quẩy giòn rụm"
                  : "Northern-style pho with banh quay"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Phở Hà Nội đặc trưng với bánh phở bản dẹt, hành hoa ngập bát, nước dùng thanh trong và quẩy giòn."
              : "Northern-style pho with broad flat noodles, clear broth, scallions, and golden fried dough sticks."}
          </figcaption>
        </figure>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi
              ? "3.2 Phở Miền Trung (Đà Nẵng, Huế, Gia Lai) – Đậm Đà & Cay Nồng"
              : "3.2 Central Vietnam Pho (Da Nang, Hue, Gia Lai) – Bold & Vibrant"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Trước thiên nhiên nắng gió miền Trung, người dân chuộng vị đậm đà, mặn mà và cay nồng. Nước dùng phở miền Trung thường có sắc vàng óng ả từ dầu điều (annatto oil), điểm xuyết sa tế cay xé lưỡi và củ hành tím muối chua. Đặc biệt tại vùng cao nguyên Gia Lai, biến thể 'Phở Hai Tô' (Phở Khô Gia Lai) trứ danh phục vụ một tô bánh phở trộn tương hột lên men bùi béo và một tô nước dùng bò thanh ngọt nguyên chất riêng biệt."
              : "Central Vietnamese prefer bold, spicy, and savory profiles. Broths here often feature a warm golden sheen from annatto seed oil and local satay chili. In the Central Highlands (Gia Lai), 'Pho Hai To' (Two-Bowl Pho) features dry chewy noodles tossed in fermented soybean paste paired with a separate bowl of pure beef bone broth."}
          </p>
        </div>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/pho-in-central-vietnam-vietnamnomad.jpg"
              alt={
                isVi
                  ? "Phở miền Trung đậm đà dầu điều"
                  : "Central Vietnam pho with golden annatto broth"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Phở miền Trung với nước dùng đậm màu dầu điều, hành tím ngâm chua và vị cay nồng đặc trưng."
              : "Central Vietnam pho with golden annatto broth and fragrant spicy chili satay."}
          </figcaption>
        </figure>

        <div className="ad-subitem">
          <h3 className="ad-subitem__title">
            {isVi
              ? "3.3 Phở Miền Nam (Sài Gòn) – Hào Sảng, Ngọt Béo & Ngập Tràn Rau Thơm"
              : "3.3 Southern Pho (Saigon) – Rich, Generous & Herb-Lover's Dream"}
          </h3>
          <p className="ad-subitem__p">
            {isVi
              ? "Phở Sài Gòn phản ánh tính cách phóng khoáng và nồng hậu của người phương Nam. Sợi bánh phở nhỏ, dai giòn, nước dùng ninh xương nêm chút đường phèn đậm đà ngọt hậu, bên trên phủ lớp nước béo hành trần bùi ngậy. Đi kèm bát phở là đĩa rau sống khổng lồ: giá đỗ chần, húng quế thơm lừng, ngò gai (mùi tàu), cùng hai hũ gia vị không thể thiếu: tương đen Hoisin ngọt bùi và tương ớt đỏ cay nồng."
              : "Southern pho is as open-minded, warm, and generous as Saigon itself. Thin, springy rice noodles are paired with a rich broth stewed with rock sugar and beef flanks, often topped with 'nuoc beo' (fatty scallion broth). Diners enjoy a lavish plate of blanched bean sprouts, Asian holy basil, culantro, alongside sweet hoisin sauce and fiery chili sauce."}
          </p>
        </div>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/pho-in-southern-vietnam-vietnamnomad.jpg"
              alt={
                isVi
                  ? "Phở miền Nam ngập rau thơm và tương đen"
                  : "Southern Vietnamese pho with fresh herbs"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Phở Sài Gòn với đĩa rau thơm tươi tốt, giá đỗ, tương đen Hoisin và chén nước béo hành trần."
              : "Southern pho served with fresh bean sprouts, Thai basil, lime, culantro, and dark hoisin sauce."}
          </figcaption>
        </figure>

        {/* ══════════════════════════════════════════════════════════
            MỤC 4: VĂN HÓA & NGHỆ THUẬT ĂN PHỞ
            ══════════════════════════════════════════════════════════ */}
        <h2 className="ad-section-heading">
          {isVi
            ? "4. Nghệ Thuật Ăn Phở Chuẩn Sành"
            : "4. The Art of Savoring Pho Like a Local"}
        </h2>
        <p className="ad-section-intro">
          {isVi
            ? "Đừng vội cho tương ớt hay vắt chanh ngay lập tức — hãy tuân theo 4 bước thưởng thức sành điệu sau."
            : "Never drown your soup in sauces immediately — follow these four golden rules to experience pho at its peak."}
        </p>

        <ul className="ad-bullet-list">
          <li className="ad-bullet-item">
            <strong>
              {isVi
                ? "1. Nếm một thìa nước dùng nguyên bản trước: "
                : "1. Taste the pure broth first: "}
            </strong>
            {isVi
              ? "Trước khi vắt chanh hay thêm ớt, hãy múc một thìa nước dùng nguyên bản uống thử. Đó là cách bạn cảm nhận trọn vẹn công sức ninh hầm của người nấu."
              : "Before squeezing lime or adding chili, sip a spoonful of pristine broth directly from the bowl to appreciate the true hours of simmering and spice balance."}
          </li>
          <li className="ad-bullet-item">
            <strong>
              {isVi
                ? "2. Gọi bát 'Phở Đặc Biệt' cho lần đầu: "
                : "2. Order the 'Pho Dac Biet' (Special Combo): "}
            </strong>
            {isVi
              ? "Một bát phở đặc biệt sẽ hội tụ đủ tái, nạm, gầu, gân, bò viên để bạn trải nghiệm đầy đủ độ mềm, giòn, ngậy của từng thớ thịt bò."
              : "If you want the ultimate beef experience, order a special bowl featuring rare steak (tai), cooked flank (chin), crunchy brisket (gau), tendon (gan), and meatballs."}
          </li>
          <li className="ad-bullet-item">
            <strong>
              {isVi
                ? "3. Pha chén nước chấm riêng cho thịt bò: "
                : "3. Create a separate dipping sauce bowl: "}
            </strong>
            {isVi
              ? "Trộn một ít tương đen, tương ớt sa tế cùng vài giọt chanh vào đĩa nhỏ bên cạnh. Dùng đĩa này chấm thịt bò và bò viên để không làm đục nước dùng thơm lành."
              : "Mix hoisin sauce, chili sauce, and a few drops of lime into a small side saucer. Dip beef slices and meatballs here instead of pouring sauces directly into the soup."}
          </li>
          <li className="ad-bullet-item">
            <strong>
              {isVi
                ? "4. Ăn khi khói còn bốc nghi ngút: "
                : "4. Eat while steaming hot: "}
            </strong>
            {isVi
              ? "Phở phải ăn nóng, húp thìa nước bốc khói cùng sợi phở mềm. Không nên để phở nguội vì bánh phở sẽ trương và mỡ bò đông lại mất đi vị ngon."
              : "Pho must be eaten briskly while hot. Savor the aroma, slurp the noodles together with the soup, and never let the noodles sit until cold."}
          </li>
        </ul>

        <figure className="ad-figure">
          <div className="ad-figure__img-wrap">
            <img
              src="/guide/pho/the-eating-culture-of-pho-vietnamnomad.jpg"
              alt={
                isVi
                  ? "Văn hóa thưởng thức phở với đĩa chấm riêng"
                  : "Eating culture of Vietnamese pho"
              }
              className="ad-figure__img"
              loading="lazy"
            />
          </div>
          <figcaption className="ad-figure__caption">
            {isVi
              ? "Chén gia vị chấm riêng biệt giúp thưởng thức trọn vẹn vị thịt bò mà vẫn giữ nguyên vị thanh của nước dùng."
              : "Making a separate dipping saucer with chili and hoisin sauce preserves the purity of the broth."}
          </figcaption>
        </figure>

        {/* ══════════════════════════════════════════════════════════
            MỤC 5: ĐỊA CHỈ NHỮNG QUÁN PHỞ TRỨ DANH (BILINGUAL 100%)
            ══════════════════════════════════════════════════════════ */}
        <h2 className="ad-section-heading">
          {isVi
            ? "5. Bản Đồ Quán Phở Trứ Danh Bắc – Trung – Nam"
            : "5. Iconic Pho Eateries Across Vietnam"}
        </h2>
        <p className="ad-section-intro">
          {isVi
            ? "Những địa chỉ quán phở gia truyền lâu đời được người dân bản địa và thực khách quốc tế đánh giá cao nhất."
            : "Century-old family stalls and Michelin-recognized institutions tested by generations of food lovers."}
        </p>

        {/* ─── HÀ NỘI ─── */}
        <h3
          className="ad-subitem__title--bold"
          style={{ color: "#0d9488", margin: "32px 0 16px" }}
        >
          📍 {isVi ? "Hà Nội – Thủ Phủ Phở Bắc" : "Hanoi – Capital of Northern Pho"}
        </h3>
        <div className="ad-practice-grid">
          {PHO_EATERIES.hanoi.map((item) => (
            <div key={item.id} className="ad-practice-card">
              <h4 className="ad-practice-card__title">
                <Utensils size={16} /> {isVi ? item.nameVi : item.nameEn}
              </h4>
              <p className="ad-practice-card__desc">
                <strong>{isVi ? "📍 Địa chỉ: " : "📍 Address: "}</strong>
                {isVi ? item.addressVi : item.addressEn}
                <br />
                <strong>{isVi ? "⏰ Giờ mở cửa: " : "⏰ Hours: "}</strong>
                {isVi ? item.hoursVi : item.hoursEn} •{" "}
                <strong>{isVi ? "💰 Mức giá: " : "💰 Price: "}</strong>
                {isVi ? item.priceVi : item.priceEn}
                <br />
                {isVi ? item.descVi : item.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* ─── ĐÀ NẴNG ─── */}
        <h3
          className="ad-subitem__title--bold"
          style={{ color: "#d97706", margin: "36px 0 16px" }}
        >
          📍 {isVi ? "Đà Nẵng – Hương Vị Miền Trung" : "Da Nang – Central Vietnam"}
        </h3>
        <div className="ad-practice-grid">
          {PHO_EATERIES.danang.map((item) => (
            <div key={item.id} className="ad-practice-card">
              <h4 className="ad-practice-card__title">
                <Utensils size={16} /> {isVi ? item.nameVi : item.nameEn}
              </h4>
              <p className="ad-practice-card__desc">
                <strong>{isVi ? "📍 Địa chỉ: " : "📍 Address: "}</strong>
                {isVi ? item.addressVi : item.addressEn}
                <br />
                <strong>{isVi ? "⏰ Giờ mở cửa: " : "⏰ Hours: "}</strong>
                {isVi ? item.hoursVi : item.hoursEn} •{" "}
                <strong>{isVi ? "💰 Mức giá: " : "💰 Price: "}</strong>
                {isVi ? item.priceVi : item.priceEn}
                <br />
                {isVi ? item.descVi : item.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* ─── TP. HỒ CHÍ MINH ─── */}
        <h3
          className="ad-subitem__title--bold"
          style={{ color: "#ea580c", margin: "36px 0 16px" }}
        >
          📍{" "}
          {isVi
            ? "TP. Hồ Chí Minh – Phở Nam Bộ Hào Sảng"
            : "Ho Chi Minh City – Southern Style Pho"}
        </h3>
        <div className="ad-practice-grid">
          {PHO_EATERIES.saigon.map((item) => (
            <div key={item.id} className="ad-practice-card">
              <h4 className="ad-practice-card__title">
                <Utensils size={16} /> {isVi ? item.nameVi : item.nameEn}
              </h4>
              <p className="ad-practice-card__desc">
                <strong>{isVi ? "📍 Địa chỉ: " : "📍 Address: "}</strong>
                {isVi ? item.addressVi : item.addressEn}
                <br />
                <strong>{isVi ? "⏰ Giờ mở cửa: " : "⏰ Hours: "}</strong>
                {isVi ? item.hoursVi : item.hoursEn} •{" "}
                <strong>{isVi ? "💰 Mức giá: " : "💰 Price: "}</strong>
                {isVi ? item.priceVi : item.priceEn}
                <br />
                {isVi ? item.descVi : item.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            BÀI VIẾT LIÊN QUAN (EXPLORE MORE)
            ══════════════════════════════════════════════════════════ */}
        <section className="ad-related-section">
          <h3 className="ad-related-title">
            {isVi
              ? "Khám Phá Thêm Cẩm Nang Du Lịch & Ẩm Thực"
              : "Explore More Travel & Food Guides"}
          </h3>
          <div className="ad-related-grid">
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="ad-related-card"
            >
              <div className="ad-related-card__img-wrap">
                <img
                  src="/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg"
                  alt={
                    isVi
                      ? "12 món ngon TP.HCM"
                      : "12 must-try foods in Ho Chi Minh City"
                  }
                  className="ad-related-card__img"
                  loading="lazy"
                />
              </div>
              <h4 className="ad-related-card__title">
                {isVi
                  ? "12 Món Ăn Nhất Định Phải Thử Tại TP. Hồ Chí Minh"
                  : "12 Must-Try Foods in Ho Chi Minh City"}
              </h4>
            </Link>

            <Link href="/province/ha-noi" className="ad-related-card">
              <div className="ad-related-card__img-wrap">
                <img
                  src="/guide/hanoi/hanoi-hoankiem-turtle-tower-hd.jpg"
                  alt={
                    isVi
                      ? "Cẩm nang Hà Nội"
                      : "Hanoi travel guide"
                  }
                  className="ad-related-card__img"
                  loading="lazy"
                />
              </div>
              <h4 className="ad-related-card__title">
                {isVi
                  ? "Hà Nội: Cẩm Nang Du Lịch Thủ Đô Nghìn Năm Văn Hiến"
                  : "Hanoi: The Complete Travel Guide"}
              </h4>
            </Link>

            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="ad-related-card"
            >
              <div className="ad-related-card__img-wrap">
                <img
                  src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                  alt={
                    isVi
                      ? "Cẩm nang du lịch Việt Nam"
                      : "The Complete Guide to Vietnam"
                  }
                  className="ad-related-card__img"
                  loading="lazy"
                />
              </div>
              <h4 className="ad-related-card__title">
                {isVi
                  ? "Cẩm Nang Du Lịch Toàn Diện Việt Nam 2026"
                  : "The Complete Guide to Vietnam 2026"}
              </h4>
            </Link>
          </div>
        </section>
      </article>

      {/* ─── FULL EDITORIAL FOOTER ─── */}
      <PublicFooter lang={isVi ? "vi" : "en"} />

      {/* ─── AI TRAVEL COMPANION (CHATBOT) ─── */}
      <ProvinceChatbot
        province={{
          name: isVi ? "Việt Nam" : "Vietnam",
          slug: "viet-nam",
        }}
      />
    </div>
  );
}
