"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  MapPin,
  Compass,
  Sparkles,
  Waves,
  Utensils,
  Sun,
  Bus,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Anchor,
  Hotel,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/destination-nhatrang.css";

// ─── 8 TOP ATTRACTIONS DATA ───
const NHA_TRANG_ATTRACTIONS = [
  {
    id: "po-nagar-cham-towers",
    title: "1. Po Nagar Cham Towers",
    titleVi: "1. Tháp Bà Ponagar",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Po-Nargar-Cham-Towers.jpg",
    alt: "Po Nagar Cham Towers Nha Trang",
    location: "2 Tháng 4 St, Vinh Phuoc, Nha Trang",
    locationVi: "Đường 2 Tháng 4, Vĩnh Phước, Nha Trang",
    badge: "Heritage",
    badgeVi: "Di tích lịch sử",
    desc: (
      <>
        <p>
          Perched on Cu Lao hill overlooking the peaceful Cai River, the Po Nagar Cham Towers stand as one of the most remarkable archaeological and spiritual monuments of the ancient Champa kingdom in Central Vietnam. Built between the 8th and 13th centuries, this holy temple complex honors Goddess Yan Po Nagar, revered as the sacred mother of the kingdom who taught locals agriculture and weaving.
        </p>
        <p>
          The main tower rises 23 meters high with intricately carved red-brick architecture without mortar, housing a majestic black granite statue of the Goddess. Today, it remains an active place of worship where visitors can witness traditional Cham dance performances, sacred incense ceremonies, and sweeping views of the Nha Trang fishing fleet on the river mouth.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Tọa lạc trên đồi Cù Lao lộng gió hướng nhìn ra dòng sông Cái êm đềm, Tháp Bà Ponagar là quần thể di tích kiến trúc tôn giáo Chăm Pa cổ kính và nguyên vẹn nhất miền Trung. Được xây dựng từ thế kỷ thứ 8 đến thế kỷ 13, khu đền tháp thờ phụng Thiên Y A Na Thánh Mẫu – người mẹ xứ sở đã khai hóa đất đai và truyền dạy nghề nông, dệt vải cho muôn dân.
        </p>
        <p>
          Ngọn tháp chính cao 23 mét bằng gạch nung nung khít không để lộ mạch vữa, bên trong lưu giữ tượng Mẫu bằng đá hoa cương đen uy nghi. Nơi đây hiện vẫn là điểm sinh hoạt tâm linh nhộn nhịp, nơi du khách được thưởng thức điệu múa Chăm uyển chuyển bên tiếng trống Gi-năng và ngắm nhìn thuyền chài rẽ sóng cửa biển.
        </p>
      </>
    ),
  },
  {
    id: "vinwonders-nha-trang",
    title: "2. VinWonders Nha Trang & Hon Tre Island",
    titleVi: "2. VinWonders Nha Trang & Đảo Hòn Tre",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Vinwonders-Nha-Trang.jpg",
    alt: "VinWonders Hon Tre Island Nha Trang",
    location: "Hon Tre Island, Vinh Nguyen, Nha Trang",
    locationVi: "Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang",
    badge: "Entertainment",
    badgeVi: "Giải trí biển",
    desc: (
      <>
        <p>
          Spanning over 50 hectares on Hon Tre Island across Nha Trang Bay, VinWonders is Vietnam&apos;s premier theme park and entertainment paradise. The adventure begins with a scenic ride on one of the world&apos;s longest sea-crossing cable car systems, offering bird&apos;s-eye vistas of the sapphire bay and coral reefs below.
        </p>
        <p>
          The complex features six distinct zones: thrilling roller coasters at Adventure Land, massive water slides and wave pools at Water World, botanical gardens with thousands of rare flowers at World Garden, exotic wildlife at Sea World aquarium, and the legendary multimillion-dollar Tata Show multimedia spectacle every evening.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Trải rộng hơn 50 héc-ta trên đảo Hòn Tre giữa vịnh Nha Trang, VinWonders là thiên đường vui chơi giải trí kỷ lục hàng đầu Việt Nam. Hành trình bắt đầu bằng tuyến cáp treo vượt biển dài ngoạn mục, đưa du khách lơ lửng ngắm nhìn toàn cảnh vịnh biển xanh ngắt và rạn san hô lấp lánh dưới ánh mặt trời.
        </p>
        <p>
          Khu vui chơi quy tụ 6 phân khu đẳng cấp: các trò chơi cảm giác mạnh tại Vùng Đất Phiêu Lưu, công viên nước trên bờ biển với đường trượt kỷ lục, đồi Vạn Hoa rực rỡ kỳ hoa dị thảo khắp 5 châu, thủy cung dưới lòng biển và siêu phẩm thực cảnh đa phương tiện Tata Show triệu đô bùng nổ mỗi tối.
        </p>
      </>
    ),
  },
  {
    id: "museum-of-oceanography",
    title: "3. National Oceanographic Museum",
    titleVi: "3. Viện Hải dương học Nha Trang",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Museum-of-Oceanography.jpg",
    alt: "Museum of Oceanography Nha Trang",
    location: "01 Cau Da, Nha Trang",
    locationVi: "Số 01 Cầu Đá, Nha Trang",
    badge: "Marine Science",
    badgeVi: "Bảo tàng biển",
    desc: (
      <>
        <p>
          Established in 1923 by French oceanographers, the National Oceanographic Museum of Vietnam is one of Southeast Asia&apos;s earliest and largest marine research centers. Housed in colonial-era buildings near Cau Da port, it curates an astonishing repository of over 20,000 marine specimens representing 4,000 tropical sea species.
        </p>
        <p>
          Highlights include a glass tunnel aquarium swimming with reef sharks, giant sea turtles, lionfish, and seahorses, as well as the colossal 26-meter fossilized humpback whale skeleton excavated from the Red River delta, proving an invaluable educational journey for visitors of all ages.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Thành lập từ năm 1923 bởi các nhà khoa học Pháp, Viện Hải dương học Nha Trang là trung tâm nghiên cứu biển lâu đời và quy mô bậc nhất Đông Nam Á. Tọa lạc trong khuôn viên kiến trúc cổ kính gần cảng Cầu Đá, nơi đây lưu giữ kho tàng sinh vật biển đồ sộ với hơn 20.000 mẫu vật của trên 4.000 loài sinh vật nhiệt đới.
        </p>
        <p>
          Điểm nhấn thu hút là hệ thống đường hầm thủy cung với đàn cá mập san hô, rùa biển khổng lồ, cá mao tiên rực rỡ và đặc biệt là bộ xương cá voi lưng gù hóa thạch dài 26 mét nặng gần 10 tấn được khai quật từ đồng bằng châu thổ, mang đến trải nghiệm khám phá đại dương kỳ thú.
        </p>
      </>
    ),
  },
  {
    id: "mud-baths",
    title: "4. Natural Mineral Mud Baths",
    titleVi: "4. Tắm bùn khoáng nóng thiên nhiên",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-mud-baths.jpg",
    alt: "Nha Trang mineral mud bath",
    location: "Thap Ba, I-Resort & 100 Egg Mud Bath",
    locationVi: "Khu du lịch Tháp Bà, I-Resort & Trăm Trứng",
    badge: "Wellness",
    badgeVi: "Chăm sóc sức khỏe",
    desc: (
      <>
        <p>
          No trip to Nha Trang is complete without immersing yourself in soothing mineral-rich mud baths. Naturally filtered through volcanic rocks, this warm mineral mud is packed with therapeutic minerals that detoxify the skin, relieve muscular tension, and rejuvenate tired joints after active days on the beach.
        </p>
        <p>
          Top spots like I-Resort and Thap Ba Hot Springs offer tranquil open-air wooden tubs set amid lush tropical gardens and waterfalls, followed by hydrotherapy showers, hot mineral jacuzzi pools, and soothing body massages.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Trải nghiệm đặc trưng không thể bỏ lỡ khi ghé Nha Trang chính là ngâm mình trong bồn bùn khoáng nóng tự nhiên. Được hình thành và thanh lọc qua các tầng địa chất núi lửa, bùn khoáng giàu vi chất có tác dụng thanh lọc da, thư giãn cơ bắp và phục hồi sinh lực tuyệt vời sau những ngày khám phá biển đảo.
        </p>
        <p>
          Những điểm tắm bùn nổi tiếng như I-Resort, Suối khoáng nóng Tháp Bà hay Khu du lịch Trăm Trứng sở hữu bồn ngâm bằng đá mộc mạc nép mình giữa vườn cây nhiệt đới, kết hợp thủy lực massage bằng tia nước ấm và hồ bơi khoáng vô cực thư thái.
        </p>
      </>
    ),
  },
  {
    id: "co-tien-mountain",
    title: "5. Co Tien Mountain Sunset Trek",
    titleVi: "5. Trekking Núi Cô Tiên săn hoàng hôn",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Co-Tien-Mountain.jpg",
    alt: "Co Tien Mountain Nha Trang Trekking",
    location: "Vinh Hoa, Northern Nha Trang",
    locationVi: "Phường Vĩnh Hòa, Bắc Nha Trang",
    badge: "Adventure",
    badgeVi: "Leo núi mạo hiểm",
    desc: (
      <>
        <p>
          Rising approximately 400 meters in northern Nha Trang, Co Tien (Fairy Mountain) consists of three interconnected peaks that resemble the silhouette of a sleeping maiden. It has quickly become the favorite hiking and sunrise/sunset vantage point for adventurous travelers.
        </p>
        <p>
          The trail takes roughly 45 to 60 minutes to reach peak 1, rewarding hikers with mesmerizing 360-degree vistas of the glittering crescent coast, modern skyline, and the calm turquoise expanse of Nha Trang Bay dotted with offshore islands.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Nằm ở phía bắc thành phố với độ cao gần 400 mét, Núi Cô Tiên gồm ba ngọn núi liền kề uốn lượn tựa dáng hình thiếu nữ xõa tóc ngủ mơ màng bên bờ biển. Đây là cung trekking ngắm bình minh và hoàng hôn được giới trẻ và người mê phượt yêu thích bậc nhất Nha Trang.
        </p>
        <p>
          Đoạn đường leo mất khoảng 45 đến 60 phút để chạm tới đỉnh số 1, mở ra khung cảnh panorama 360 độ ngoạn mục: một bên là dải vịnh biển cong hình lưỡi liềm trong vắt, một bên là nhịp sống phố thị rực rỡ và những cụm đảo xa mờ ảo trong sương.
        </p>
      </>
    ),
  },
  {
    id: "paragliding-watersports",
    title: "6. Watersports & Coastal Paragliding",
    titleVi: "6. Dù lượn & Thể thao biển sôi động",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Paragliding.jpg",
    alt: "Nha Trang paragliding beach sports",
    location: "Tran Phu Beach & Hon Tam Island",
    locationVi: "Bãi biển Trần Phú & Đảo Hòn Tằm",
    badge: "Beach Activities",
    badgeVi: "Hoạt động bãi biển",
    desc: (
      <>
        <p>
          Blessed with calm waves and crystal-clear visibility, Nha Trang is the undisputed watersports capital of Vietnam. Along the public beach of Tran Phu and resort islands, adrenaline seekers can experience parasailing soaring high above the sea, jet skiing, flyboarding, wakeboarding, and scuba diving at Hon Mun Marine Protected Area.
        </p>
        <p>
          For those who prefer a relaxed pace, sea kayaking, paddleboarding (SUP) at daybreak, and glass-bottom boat excursions offer easy encounters with vibrant coral gardens and clownfish colonies.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Được thiên nhiên ưu đãi làn nước trong như pha lê và sóng êm quanh năm, Nha Trang là thủ phủ thể thao biển hàng đầu cả nước. Dọc theo bãi tắm công viên Trần Phú và các đảo du lịch, du khách có thể thử sức với trò bay dù lượn cano kéo ngắm vịnh biển từ trên cao, mô tô nước tốc độ cao, flyboard hay lặn bình khí ngắm san hô tại Khu bảo tồn biển Hòn Mun.
        </p>
        <p>
          Nếu yêu thích sự nhẹ nhàng, bạn có thể thuê ván chèo SUP lúc bình minh, chèo thuyền kayak trong vịnh lặng hay đi tàu đáy kính chiêm ngưỡng vườn san hô sống động cùng đàn cá hề bơi lội.
        </p>
      </>
    ),
  },
  {
    id: "nha-trang-at-night",
    title: "7. Nha Trang at Night & Beach Clubs",
    titleVi: "7. Nha Trang về đêm & Beach Club sôi động",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Nha-Trang-at-Night.jpg",
    alt: "Nha Trang nightlife beach boulevard",
    location: "Tran Phu Boulevard & Sailing Club",
    locationVi: "Đại lộ Trần Phú & Câu lạc bộ Biển",
    badge: "Nightlife",
    badgeVi: "Vui chơi về đêm",
    desc: (
      <>
        <p>
          When dusk descends, Nha Trang transforms into an energetic coastal playground. Glowing lights reflect on the gentle ocean waves, while modern beach clubs like Sailing Club, Louisiane Brewhouse, and Skylight 360 Rooftop Club pulse with world-class DJ sets, fire-dancing performances, and craft beer brewed right on the shoreline.
        </p>
        <p>
          Strolling along the pedestrian seaside promenade, enjoying cool sea breezes, or sipping a fresh tropical cocktail under illuminated palm trees creates an unforgettable coastal nightlife experience.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Khi hoàng hôn buông xuống, Nha Trang khoác lên mình diện mạo rực rỡ và tràn trề năng lượng. Ánh đèn lung linh soi bóng trên mặt vịnh êm đềm, hòa cùng âm nhạc sôi động tại các tụ điểm ven biển biểu tượng như Sailing Club, Louisiane Brewhouse (bia thủ công ven biển) hay Skylight Rooftop ngắm 360 độ toàn cảnh vịnh từ tầng 43.
        </p>
        <p>
          Dạo bộ trên đại lộ Trần Phú rợp bóng dừa, lắng nghe tiếng sóng vỗ rì rào và nhâm nhi một ly cocktail nhiệt đới dưới bầu trời đêm ngàn sao sẽ để lại những kỷ niệm khó quên cho mọi du khách.
        </p>
      </>
    ),
  },
  {
    id: "night-market-local-food",
    title: "8. Night Market & Street Food Safari",
    titleVi: "8. Chợ đêm & Phố ẩm thực hải sản",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Nha-Trang-food.jpg",
    alt: "Nha Trang food night market street eats",
    location: "Tran Phu Night Market & Thap Ba Seafood Street",
    locationVi: "Chợ đêm Trần Phú & Phố hải sản Tháp Bà",
    badge: "Street Eats",
    badgeVi: "Ẩm thực đường phố",
    desc: (
      <>
        <p>
          A culinary adventure in Nha Trang is an exploration of the ocean&apos;s freshest bounties. At the buzzing Tran Phu Night Market and along Thap Ba seafood street, large glass tanks hold live lobsters, mantis shrimp, sweet sea clams, and mud crabs cooked on the spot according to your preference—steamed with lemongrass, grilled with scallion oil, or stir-fried with tamarind sauce.
        </p>
        <p>
          Street food stalls also serve crispy banh can rice cakes, fresh spring rolls, and grilled fish cakes, offering an authentic taste of coastal Vietnam at wallet-friendly prices.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Hành trình ẩm thực Nha Trang là chuyến thám hiểm hương vị hải sản tươi rói vừa cập bến. Tại chợ đêm phố đi bộ Trần Phú và con đường hải sản Tháp Bà nổi tiếng, các bể sục tràn ngập tôm hùm xanh, tôm tít, ốc hương, cua gạch được chế biến ngay tại chỗ theo sở thích: hấp sả, nướng mỡ hành thơm nức mũi hay xào me chua ngọt cay nồng.
        </p>
        <p>
          Các quầy hàng vỉa hè nghi ngút khói còn phục vụ bánh căn giòn rụm, nem lụi nướng than hoa và chả cá rim thơm phức, mang đậm hương vị mặn mòi hào sảng của biển cả miền Trung.
        </p>
      </>
    ),
  },
];

// ─── 5 MUST-TRY DISHES DATA ───
const NHA_TRANG_DISHES = [
  {
    id: "bun-cha-ca",
    title: "1. Bun Cha Ca (Fish Cake Noodle Soup)",
    titleVi: "1. Bún Chả Cá Nha Trang",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Bun-Cha-Ca-Vietnamnomad.jpg",
    alt: "Bun Cha Ca Nha Trang",
    desc: "A quintessential bowl featuring chewy, savory mackerel fish patties in a crystal-clear broth simmered naturally from fresh fish bones, tomatoes, and pineapple.",
    descVi: "Món bún trứ danh với nước dùng trong veo ngọt thanh tự nhiên từ xương cá biển, cà chua và dứa, kết hợp chả cá thu dai giòn thơm nức mũi.",
  },
  {
    id: "nem-nuong",
    title: "2. Nem Nuong Ninh Hoa (Grilled Pork Rolls)",
    titleVi: "2. Nem Nướng Ninh Hòa",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Nem-Nuong-Vietnamnomad.jpg",
    alt: "Nem Nuong Ninh Hoa Nha Trang",
    desc: "Aromatic charcoal-grilled minced pork skewers wrapped in rice paper with crispy fried rolls, fresh green mango, cucumber, herbs, and thick warm peanut-liver dipping sauce.",
    descVi: "Thịt heo tẩm ướp gia vị nướng than hoa vàng ươm, cuốn cùng bánh tráng giòn rụm, xoài xanh, dưa chuột và nước sốt tương nếp sền sệt bí truyền béo ngậy.",
  },
  {
    id: "bun-sua",
    title: "3. Bun Sua (Jellyfish Noodle Soup)",
    titleVi: "3. Bún Sứa Biển Thanh Mát",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Bun-Sua-by-Vietnamnomad.jpg",
    alt: "Bun Sua Nha Trang jellyfish noodles",
    desc: "Crunchy, milky coastal jellyfish served over fine rice vermicelli and fish patties in a piping hot, delicately spiced broth that cools the palate on sunny beach days.",
    descVi: "Từng miếng sứa biển trắng đục giòn sựt sần sật ăn kèm bún tươi, chả cá hấp và nước lèo thanh tao giải nhiệt hoàn hảo sau những giờ tắm biển.",
  },
  {
    id: "banh-can",
    title: "4. Banh Can Nha Trang (Mini Rice Pancakes)",
    titleVi: "4. Bánh Căn Trứng & Hải Sản",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Banh-Can-Vietnamnomad.jpg",
    alt: "Banh Can Nha Trang seafood",
    desc: "Golden-brown rice cakes cooked in unglazed clay pans, crowned with quail eggs, baby squid, or shrimp, dipped into sweet fish sauce with minced pork meatballs and shredded mango.",
    descVi: "Những chiếc bánh bột gạo nướng lò đất nung phồng xốp, phủ ngập trứng cút, mực cơm và tôm tươi, chấm đẫm chén mắm nêm xíu mại hành lá thơm lừng.",
  },
  {
    id: "xoi-ca-com",
    title: "5. Xoi Ca Com (Anchovy Sticky Rice)",
    titleVi: "5. Xôi Cá Cơm Xứ Biển",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Xoi-Ca-Vietnamnomad.jpg",
    alt: "Xoi Ca Com Nha Trang anchovy sticky rice",
    desc: "Steamed fragrant glutinous rice served with sweet and spicy braised fresh anchovies, crispy fried shallots, and savory braising jus—a hearty, authentic local breakfast.",
    descVi: "Xôi nếp dẻo bùi bốc khói nghi ngút ăn cùng cá cơm tươi rim mặn ngọt đậm đà, rắc thêm chút hành phi giòn tan tạo nên bữa sáng dân dã khó quên.",
  },
];

export default function NhaTrangPage() {
  const [lang, setLang] = useState("vi");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [activeToc, setActiveToc] = useState("nha-trang-at-a-glance");

  useEffect(() => {
    setLang(getLang());
    const onLangChange = (e) => setLang(e.detail);
    window.addEventListener("vina_lang_change", onLangChange);
    return () => window.removeEventListener("vina_lang_change", onLangChange);
  }, []);

  const isVi = lang === "vi";

  // Scroll spy for TOC highlights
  useEffect(() => {
    const sectionIds = [
      "nha-trang-at-a-glance",
      "nha-trang-tourist-map",
      "nha-trang-weather",
      "nha-trang-transport",
      "top-attractions",
      "must-try-dishes",
      "where-to-stay",
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveToc(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="vnn-nhatrang-page">
      {/* ── Public Header (Progress Bar, Companion, Search, Logo) ── */}
      <PublicHeader onBannerClick={() => setAiCompanionOpen(true)} />

      {/* ── Hero Section (Matching Da Nang & Ha Giang style) ── */}
      <header
        className="vnn-nhatrang-hero"
        style={{
          backgroundImage: "url('/guide/nha-trang/nhatrang-hero-hd.jpg')",
        }}
      >
        <div className="vnn-nhatrang-hero__overlay" />
        <div className="vnn-nhatrang-hero__content">
          <div className="vnn-nhatrang-hero__badges">
            <span className="vnn-nhatrang-hero__badge">
              {isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}
            </span>
            <span className="vnn-nhatrang-hero__badge">
              {isVi ? "MIỀN TRUNG" : "CENTRAL VIETNAM"}
            </span>
            <span className="vnn-nhatrang-hero__badge">
              NHA TRANG
            </span>
          </div>

          <h1 className="vnn-nhatrang-hero__title">
            Nha Trang
          </h1>

          <div className="vnn-nhatrang-hero__meta">
            <span>By VinaTap</span>
          </div>
        </div>
      </header>

      {/* ── Quick Navigation Pills Bar ── */}
      <div className="vnn-nhatrang-pills-bar">
        <div className="vnn-nhatrang-pills-inner">
          <a
            href="#nha-trang-at-a-glance"
            className={`vnn-nhatrang-nav-pill ${activeToc === "nha-trang-at-a-glance" ? "active" : ""}`}
          >
            <Compass size={14} />
            {isVi ? "Tổng quan" : "Overview"}
          </a>
          <a
            href="#nha-trang-tourist-map"
            className={`vnn-nhatrang-nav-pill ${activeToc === "nha-trang-tourist-map" ? "active" : ""}`}
          >
            <MapPin size={14} />
            {isVi ? "Bản đồ" : "Tourist Map"}
          </a>
          <a
            href="#nha-trang-weather"
            className={`vnn-nhatrang-nav-pill ${activeToc === "nha-trang-weather" ? "active" : ""}`}
          >
            <Sun size={14} />
            {isVi ? "Thời tiết" : "Weather"}
          </a>
          <a
            href="#nha-trang-transport"
            className={`vnn-nhatrang-nav-pill ${activeToc === "nha-trang-transport" ? "active" : ""}`}
          >
            <Bus size={14} />
            {isVi ? "Di chuyển" : "Transport"}
          </a>
          <a
            href="#top-attractions"
            className={`vnn-nhatrang-nav-pill ${activeToc === "top-attractions" ? "active" : ""}`}
          >
            <Sparkles size={14} />
            {isVi ? "8 Điểm đến hàng đầu" : "Attractions"}
          </a>
          <a
            href="#must-try-dishes"
            className={`vnn-nhatrang-nav-pill ${activeToc === "must-try-dishes" ? "active" : ""}`}
          >
            <Utensils size={14} />
            {isVi ? "Ẩm thực đặc sản" : "Food & Dining"}
          </a>
          <a
            href="#where-to-stay"
            className={`vnn-nhatrang-nav-pill ${activeToc === "where-to-stay" ? "active" : ""}`}
          >
            <Hotel size={14} />
            {isVi ? "Nơi lưu trú" : "Where to Stay"}
          </a>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="vnn-nhatrang-layout">
        {/* Left Column: Full Editorial Content */}
        <main className="vnn-nhatrang-article">
          {/* Section 1: Overview */}
          <section id="nha-trang-at-a-glance">
            <p className="vnn-nhatrang-lead">
              {isVi ? (
                <>
                  Được vinh danh là một trong 29 vịnh biển đẹp nhất thế giới, <strong>Nha Trang</strong> tựa như một bức tranh thủy mặc ngập tràn ánh nắng vàng rực rỡ, bãi cát trắng trải dài 6km dọc đại lộ Trần Phú và 19 hòn đảo hoang sơ rải rác ngoài khơi xa. Nơi đây quyến rũ du khách bằng sự hòa quyện tuyệt mỹ giữa nhịp sống phố thị biển hiện đại, các khu nghỉ dưỡng sang trọng, hải sản biển tươi rói và dấu ấn văn hóa Chăm Pa ngàn năm trầm mặc.
                </>
              ) : (
                <>
                  Recognized as one of the world&apos;s most beautiful bays, <strong>Nha Trang</strong> is Vietnam&apos;s quintessential coastal haven, celebrated for its 6-kilometer crescent of powdery white sand, turquoise waters, 19 idyllic offshore islands, and 300 days of sunshine a year. It effortlessly combines a thriving modern beachfront city with tranquil luxury island resorts, rich Cham heritage, and exquisite fresh seafood.
                </>
              )}
            </p>

            <div className="vnn-nhatrang-media">
              <img
                src="/guide/nha-trang/Things-to-do-in-Nha-Trang-Nha-Trang-at-Night.jpg"
                alt="Nha Trang Night Skyline & Beach"
                loading="lazy"
              />
              <div className="vnn-nhatrang-caption">
                {isVi
                  ? "Vịnh biển Nha Trang lung linh huyền ảo về đêm dọc đại lộ Trần Phú"
                  : "Nha Trang&apos;s glittering coastal skyline along Tran Phu Boulevard at night"}
              </div>
            </div>
          </section>

          {/* Section 2: Tourist Map */}
          <section id="nha-trang-tourist-map">
            <h2 className="vnn-nhatrang-sec-title">
              <MapPin size={22} color="#00c2cb" />
              {isVi ? "1. Bản đồ du lịch Nha Trang" : "1. Nha Trang Tourist Map & Geography"}
            </h2>

            <p>
              {isVi
                ? "Nha Trang nằm ở trung tâm tỉnh Khánh Hòa, nép mình bên dãy Trường Sơn hùng vĩ hướng thẳng ra Biển Đông. Địa hình thành phố được bao bọc bởi đồi núi và các hòn đảo chắn sóng tự nhiên, tạo nên vùng vịnh phẳng lặng, ít chịu ảnh hưởng của bão lớn và biển trong xanh tuyệt đẹp."
                : "Situated in Khanh Hoa Province along Vietnam&apos;s South Central Coast, Nha Trang is framed by rolling mountains on the west and protected by an archipelago of 19 offshore islands to the east. This unique geography shields the bay from heavy open-sea swells, providing calm, safe bathing waters nearly year-round."}
            </p>

            <p>
              {isVi
                ? "Thành phố chia làm 3 khu vực chính: Trục trung tâm đường Trần Phú (tập trung bãi tắm chính, nhà hàng, khách sạn và chợ đêm), Phía Bắc qua cầu Trần Phú (khu Tháp Bà Ponagar, núi Cô Tiên, bãi tắm Phạm Văn Đồng và tắm bùn I-Resort), và Phía Nam khu Cầu Đá (Viện Hải dương học, bến tàu du lịch ra các đảo Hòn Mun, Hòn Tằm, Hòn Tre)."
                : "The city spans three main areas: the Central Strip along Tran Phu Boulevard (main beach, shopping, nightlife, and night market), Northern Nha Trang past Tran Phu Bridge (Po Nagar Towers, Co Tien Mountain, mud spas, and seafood streets), and Southern Nha Trang around Cau Da (National Oceanographic Museum and departure pier for island boat tours to Hon Mun and Hon Tam)."}
            </p>

            <div className="vnn-nhatrang-media">
              <img
                src="/guide/nha-trang/Things-to-do-in-Nha-Trang-Paragliding.jpg"
                alt="Nha Trang coastline view"
                loading="lazy"
              />
              <div className="vnn-nhatrang-caption">
                {isVi
                  ? "Bờ biển cong hình trăng khuyết và làn nước ngọc bích của vịnh Nha Trang"
                  : "Crescent-shaped coastline and crystalline waters of Nha Trang Bay"}
              </div>
            </div>
          </section>

          {/* Section 3: Weather */}
          <section id="nha-trang-weather">
            <h2 className="vnn-nhatrang-sec-title">
              <Sun size={22} color="#00c2cb" />
              {isVi ? "2. Thời tiết & Mùa du lịch đẹp nhất" : "2. Nha Trang Weather & Best Season"}
            </h2>

            <p>
              {isVi
                ? "Nha Trang sở hữu khí hậu nhiệt đới xavan với hơn 300 ngày nắng ấm trong năm, nhiệt độ trung bình dao động 26 - 28°C. Nhờ địa thế vịnh kín, thời tiết Nha Trang tương đối ôn hòa, mùa khô kéo dài và mùa mưa ngắn hơn rất nhiều so với các tỉnh miền Trung khác."
                : "Nha Trang enjoys an enviable tropical climate with over 300 days of sunshine annually and mild average temperatures of 26°C to 28°C (79°F - 82°F). Unlike the stormy northern and central provinces, Nha Trang experiences a prolonged dry season and a notably short rainy season."}
            </p>

            <div className="vnn-nhatrang-season-grid">
              <div className="vnn-nhatrang-season-card best">
                <div className="vnn-nhatrang-season-title">
                  <Sun size={18} color="#00c2cb" />
                  {isVi ? "Mùa khô rực rỡ (Tháng 1 - Tháng 8)" : "Dry Season (January – August)"}
                </div>
                <p className="vnn-nhatrang-season-desc">
                  {isVi
                    ? "Thời điểm vàng để du lịch! Bầu trời xanh trong vắt, biển phẳng lặng như gương, độ nhìn dưới nước lên đến 15m – lý tưởng nhất để lặn ngắm san hô Hòn Mun, chèo SUP và trải nghiệm VinWonders."
                    : "The absolute best time to visit! Sunny skies, calm seas, and water visibility reaching 15 meters make this the prime window for scuba diving, island hopping, and outdoor watersports."}
                </p>
              </div>

              <div className="vnn-nhatrang-season-card">
                <div className="vnn-nhatrang-season-title">
                  <Waves size={18} color="#64748b" />
                  {isVi ? "Mùa mưa dịu nhẹ (Tháng 9 - Tháng 12)" : "Wet Season (September – December)"}
                </div>
                <p className="vnn-nhatrang-season-desc">
                  {isVi
                    ? "Các cơn mưa rào biển thường đến nhanh và tan nhanh. Không khí mát mẻ, giá phòng khách sạn và dịch vụ tour rất ưu đãi, thích hợp tắm bùn khoáng nóng và thư giãn tại resort."
                    : "Occasional monsoon showers and choppy seas occur, but rain usually falls in quick bursts. The city is quieter, room rates drop significantly, and it is perfect for pampering mineral mud baths and indoor visits."}
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Transportation */}
          <section id="nha-trang-transport">
            <h2 className="vnn-nhatrang-sec-title">
              <Bus size={22} color="#00c2cb" />
              {isVi ? "3. Cách di chuyển đến & trong Nha Trang" : "3. Transportation in Nha Trang"}
            </h2>

            <p>
              {isVi
                ? "Hệ thống giao thông đến Nha Trang vô cùng thuận tiện với đầy đủ đường hàng không, đường sắt Bắc Nam, đường bộ cao tốc và cảng biển du lịch quốc tế."
                : "As a premier international resort destination, Nha Trang is easily reachable via domestic and international flights, scenic coastal railways, modern expressways, and cruise piers."}
            </p>

            <div className="vnn-nhatrang-transport-grid">
              <div className="vnn-nhatrang-transport-card">
                <h4>
                  <Anchor size={18} color="#00c2cb" />
                  {isVi ? "Máy bay (Sân bay Cam Ranh)" : "By Flight (Cam Ranh Airport)"}
                </h4>
                <p>
                  {isVi
                    ? "Sân bay Quốc tế Cam Ranh (CXR) cách trung tâm Nha Trang 35 km (khoảng 35-40 phút đi taxi hoặc xe buýt Đất Mới số 18). Có các đường bay thẳng hàng ngày từ Hà Nội, TP.HCM, Đà Nẵng, Hàn Quốc, Trung Quốc..."
                    : "Cam Ranh International Airport (CXR) is 35 km south of the city center (~35 mins by taxi or airport shuttle bus #18). Direct flights connect daily with Hanoi, Ho Chi Minh City, Da Nang, Seoul, Busan, and Taipei."}
                </p>
                <span className="vnn-nhatrang-transport-tag">{isVi ? "Nhanh chóng & Thuận tiện" : "Fastest & Convenient"}</span>
              </div>

              <div className="vnn-nhatrang-transport-card">
                <h4>
                  <Bus size={18} color="#00c2cb" />
                  {isVi ? "Tàu hỏa (Ga Nha Trang)" : "By Train (Nha Trang Station)"}
                </h4>
                <p>
                  {isVi
                    ? "Ga Nha Trang ngay trung tâm thành phố đón các chuyến tàu Thống Nhất Bắc - Nam. Cung đường sắt ven biển qua đèo Cù Mông, vịnh Cam Ranh là một trong những chặng đường ngắm cảnh đẹp nhất Việt Nam."
                    : "Nha Trang Railway Station is centrally located. Traveling by express train from Saigon takes 8-9 hours, winding through dramatic coastal cliffs, sand dunes, and tranquil fishing villages."}
                </p>
                <span className="vnn-nhatrang-transport-tag">{isVi ? "Trải nghiệm ngắm cảnh" : "Scenic Coastal Journey"}</span>
              </div>
            </div>

            <div className="vnn-nhatrang-media">
              <img
                src="/guide/nha-trang/nhatrang-station.jpg"
                alt="Nha Trang Train Station"
                loading="lazy"
              />
              <div className="vnn-nhatrang-caption">
                {isVi
                  ? "Ga Nha Trang với kiến trúc Pháp cổ kính ngay tại trung tâm thành phố"
                  : "Nha Trang historic French colonial railway station in downtown"}
              </div>
            </div>
          </section>

          {/* Section 5: Top 8 Attractions */}
          <section id="top-attractions">
            <h2 className="vnn-nhatrang-sec-title">
              <Sparkles size={22} color="#00c2cb" />
              {isVi ? "4. 8 Trải nghiệm & Điểm đến hàng đầu" : "4. Top 8 Must-Visit Attractions"}
            </h2>

            <p>
              {isVi
                ? "Dưới đây là 8 điểm đến đặc sắc nhất làm nên thương hiệu của thành phố biển Nha Trang mà bất kỳ du khách nào cũng nên trải nghiệm ít nhất một lần:"
                : "Here are the 8 quintessential attractions and experiences that define Nha Trang for first-time visitors:"}
            </p>

            <div className="vnn-nhatrang-highlights-grid">
              {NHA_TRANG_ATTRACTIONS.map((att) => (
                <div key={att.id} className="vnn-nhatrang-highlight-card">
                  <div className="vnn-nhatrang-highlight-card__img-wrap">
                    <img src={att.img} alt={att.alt} loading="lazy" />
                  </div>
                  <div className="vnn-nhatrang-highlight-card__body">
                    <span className="vnn-nhatrang-highlight-card__badge">
                      {isVi ? att.badgeVi : att.badge}
                    </span>
                    <h3 className="vnn-nhatrang-highlight-card__title">
                      {isVi ? att.titleVi : att.title}
                    </h3>
                    <div className="vnn-nhatrang-highlight-card__desc">
                      {isVi ? att.descVi : att.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Must-Try Dishes */}
          <section id="must-try-dishes">
            <h2 className="vnn-nhatrang-sec-title">
              <Utensils size={22} color="#00c2cb" />
              {isVi ? "5. 5 Món ngon đặc sản Nha Trang" : "5. Top 5 Must-Try Dishes in Nha Trang"}
            </h2>

            <p>
              {isVi
                ? "Ẩm thực Nha Trang nổi tiếng với vị ngọt thanh tự nhiên của hải sản tươi rói và nghệ thuật pha chế nước chấm độc đáo khó nơi nào sánh được:"
                : "Nha Trang&apos;s culinary heritage is defined by sweet coastal catches, crispy pancakes, fragrant broths, and deeply satisfying homemade dipping sauces:"}
            </p>

            <div className="vnn-nhatrang-highlights-grid">
              {NHA_TRANG_DISHES.map((dish) => (
                <div key={dish.id} className="vnn-nhatrang-highlight-card">
                  <div className="vnn-nhatrang-highlight-card__img-wrap">
                    <img src={dish.img} alt={dish.alt} loading="lazy" />
                  </div>
                  <div className="vnn-nhatrang-highlight-card__body">
                    <h3 className="vnn-nhatrang-highlight-card__title">
                      {isVi ? dish.titleVi : dish.title}
                    </h3>
                    <p className="vnn-nhatrang-highlight-card__desc">
                      {isVi ? dish.descVi : dish.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "20px" }}>
              <Link
                href="/guide/5-must-try-nha-trang-dishes"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#00aab2",
                  fontWeight: 700,
                  fontSize: "14.5px",
                  textDecoration: "none",
                }}
              >
                {isVi ? "Xem chi tiết bài viết 5 món đặc sản Nha Trang" : "Read full guide: 5 must-try Nha Trang dishes"} &rarr;
              </Link>
            </div>
          </section>

          {/* Section 7: Where to Stay */}
          <section id="where-to-stay">
            <h2 className="vnn-nhatrang-sec-title">
              <Hotel size={22} color="#00c2cb" />
              {isVi ? "6. Nơi lưu trú & Khách sạn ở Nha Trang" : "6. Where to Stay in Nha Trang"}
            </h2>

            <p>
              {isVi
                ? "Nha Trang sở hữu chuỗi khách sạn và resort phong phú bậc nhất Việt Nam, từ các căn hộ homestay xinh xắn giá rẻ đến các khu nghỉ dưỡng siêu sang trên đảo biệt lập:"
                : "Accommodations in Nha Trang cater to every travel style and budget, ranging from friendly backpacker hostels in the Western Quarter to world-class private island sanctuaries:"}
            </p>

            <ul style={{ paddingLeft: "20px", color: "#475569", lineHeight: 1.8 }}>
              <li>
                <strong>{isVi ? "Trục đường vàng Trần Phú:" : "Tran Phu Beachfront Boulevard:"}</strong>{" "}
                {isVi
                  ? "Vị trí đắc địa nhất, chỉ vài bước chân qua đường là tới bãi biển. Quy tụ các khách sạn 4-5 sao quốc tế như InterContinental, Sheraton, Novotel, Muong Thanh Luxury."
                  : "The premier strip where hotels face directly onto the sandy beach. Home to top luxury brands like InterContinental, Sheraton, Novotel, and premier oceanfront suites."}
              </li>
              <li>
                <strong>{isVi ? "Resort đảo biệt lập (Hòn Tre, Ninh Vân, Hòn Tằm):" : "Private Island & Bay Sanctuaries:"}</strong>{" "}
                {isVi
                  ? "Dành cho kỳ nghỉ dưỡng riêng tư tuyệt đối: Vinpearl Luxury Nha Trang trên đảo Hòn Tre, Six Senses Ninh Van Bay hoặc An Lam Retreats nép mình giữa vách đá và rừng nhiệt đới."
                  : "Ultimate secluded hideaways: Six Senses Ninh Van Bay, Vinpearl Luxury Hon Tre Island, and Amiana Resort offering overwater villas and pristine private beaches."}
              </li>
              <li>
                <strong>{isVi ? "Khu phố Tây (Hùng Vương, Nguyễn Thiện Thuật):" : "Western Quarter (Hung Vuong, Nguyen Thien Thuat):"}</strong>{" "}
                {isVi
                  ? "Tập trung nhiều khách sạn 2-3 sao, homestay giá bình dân từ 300.000 - 600.000 VNĐ/đêm, xung quanh bạt ngàn quán cà phê, quán bar và tiệm ăn uống nhộn nhịp."
                  : "Vibrant neighborhood filled with boutique hotels, cozy homestays, bars, cafes, and massage parlors, all within a 5-minute stroll to the beach."}
              </li>
            </ul>
          </section>

          {/* ── Related Guides ── */}
          <section style={{ marginTop: "48px", paddingTop: "32px", borderTop: "2px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px", color: "#0f172a" }}>
              {isVi ? "Bài viết du lịch liên quan" : "Related Travel Guides"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <Link href="/guide/8-best-things-to-do-in-nha-trang" style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img src="/guide/nha-trang/Top-8-things-to-do-in-Nha-Trang-Vietnamnomad.jpg" alt="8 Things in Nha Trang" style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                  <div style={{ padding: "12px" }}>
                    <h5 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: "#0f172a" }}>8 Best Things to Do in Nha Trang</h5>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{isVi ? "8 Trải nghiệm tuyệt nhất" : "Top Bucket List"}</span>
                  </div>
                </div>
              </Link>

              <Link href="/guide/5-must-try-nha-trang-dishes" style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img src="/guide/nha-trang/5-must-try-food-in-Nha-Trang-Vietnamnomad.jpg" alt="5 Must-Try Nha Trang Dishes" style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                  <div style={{ padding: "12px" }}>
                    <h5 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: "#0f172a" }}>5 Must-Try Nha Trang Dishes</h5>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{isVi ? "Ẩm thực biển đặc sản" : "Coastal Food Culture"}</span>
                  </div>
                </div>
              </Link>

              <Link href="/province/dalat" style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img src="/guide/dalat/dalat-15-attractions-hd.jpg" alt="Dalat Guide" style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                  <div style={{ padding: "12px" }}>
                    <h5 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: "#0f172a" }}>Dalat Travel Guide</h5>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{isVi ? "Thành phố ngàn hoa" : "City of Eternal Spring"}</span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </main>

        {/* Right Column: Sticky Sidebar with TOC & Quick Facts */}
        <aside className="vnn-nhatrang-sidebar">
          {/* Table of Contents Widget */}
          <div className="vnn-nhatrang-widget">
            <h3 className="vnn-nhatrang-widget__title">
              <BookOpen size={18} color="#00c2cb" />
              {isVi ? "Mục lục cẩm nang" : "Contents"}
            </h3>
            <ul className="vnn-nhatrang-toc-list">
              <li>
                <a
                  href="#nha-trang-at-a-glance"
                  className={`vnn-nhatrang-toc-link ${activeToc === "nha-trang-at-a-glance" ? "active" : ""}`}
                >
                  {isVi ? "1. Nha Trang nhìn từ tổng quan" : "1. Nha Trang at a glance"}
                </a>
              </li>
              <li>
                <a
                  href="#nha-trang-tourist-map"
                  className={`vnn-nhatrang-toc-link ${activeToc === "nha-trang-tourist-map" ? "active" : ""}`}
                >
                  {isVi ? "2. Bản đồ du lịch Nha Trang" : "2. Nha Trang tourist map"}
                </a>
              </li>
              <li>
                <a
                  href="#nha-trang-weather"
                  className={`vnn-nhatrang-toc-link ${activeToc === "nha-trang-weather" ? "active" : ""}`}
                >
                  {isVi ? "3. Thời tiết & Mùa lý tưởng" : "3. Weather & Best Season"}
                </a>
              </li>
              <li>
                <a
                  href="#nha-trang-transport"
                  className={`vnn-nhatrang-toc-link ${activeToc === "nha-trang-transport" ? "active" : ""}`}
                >
                  {isVi ? "4. Cách di chuyển thuận tiện" : "4. Getting to & around"}
                </a>
              </li>
              <li>
                <a
                  href="#top-attractions"
                  className={`vnn-nhatrang-toc-link ${activeToc === "top-attractions" ? "active" : ""}`}
                >
                  {isVi ? "5. 8 Điểm đến & Trải nghiệm" : "5. Top 8 attractions"}
                </a>
              </li>
              <li>
                <a
                  href="#must-try-dishes"
                  className={`vnn-nhatrang-toc-link ${activeToc === "must-try-dishes" ? "active" : ""}`}
                >
                  {isVi ? "6. 5 Món ngon đặc sản" : "6. Must-try local food"}
                </a>
              </li>
              <li>
                <a
                  href="#where-to-stay"
                  className={`vnn-nhatrang-toc-link ${activeToc === "where-to-stay" ? "active" : ""}`}
                >
                  {isVi ? "7. Nơi lưu trú & Resort" : "7. Where to stay"}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Facts Widget */}
          <div className="vnn-nhatrang-widget">
            <h3 className="vnn-nhatrang-widget__title">
              <Compass size={18} color="#00c2cb" />
              {isVi ? "Thông tin nhanh" : "Fast Facts"}
            </h3>
            <ul className="vnn-nhatrang-facts-list">
              <li className="vnn-nhatrang-fact-item">
                <span className="vnn-nhatrang-fact-label">{isVi ? "Vùng miền" : "Region"}</span>
                <span className="vnn-nhatrang-fact-value">{isVi ? "Duyên hải Nam Trung Bộ" : "South Central Coast"}</span>
              </li>
              <li className="vnn-nhatrang-fact-item">
                <span className="vnn-nhatrang-fact-label">{isVi ? "Sân bay gần nhất" : "Nearest Airport"}</span>
                <span className="vnn-nhatrang-fact-value">Cam Ranh (CXR - 35 km)</span>
              </li>
              <li className="vnn-nhatrang-fact-item">
                <span className="vnn-nhatrang-fact-label">{isVi ? "Mùa lý tưởng" : "Best Season"}</span>
                <span className="vnn-nhatrang-fact-value">{isVi ? "Tháng 1 - Tháng 8" : "Jan to Aug"}</span>
              </li>
              <li className="vnn-nhatrang-fact-item">
                <span className="vnn-nhatrang-fact-label">{isVi ? "Nhiệt độ trung bình" : "Avg Temp"}</span>
                <span className="vnn-nhatrang-fact-value">26°C - 28°C (80°F)</span>
              </li>
              <li className="vnn-nhatrang-fact-item">
                <span className="vnn-nhatrang-fact-label">{isVi ? "Bờ biển dài" : "Coastline"}</span>
                <span className="vnn-nhatrang-fact-value">~6 km (Tran Phu Beach)</span>
              </li>
              <li className="vnn-nhatrang-fact-item">
                <span className="vnn-nhatrang-fact-label">{isVi ? "Quần đảo" : "Offshore Islands"}</span>
                <span className="vnn-nhatrang-fact-value">{isVi ? "19 hòn đảo lớn nhỏ" : "19 islands (Hon Mun, Hon Tre...)"}</span>
              </li>
              <li className="vnn-nhatrang-fact-item">
                <span className="vnn-nhatrang-fact-label">{isVi ? "Danh hiệu" : "Recognition"}</span>
                <span className="vnn-nhatrang-fact-value">{isVi ? "Top vịnh đẹp thế giới" : "World&apos;s Most Beautiful Bays"}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Public Footer ── */}
      <PublicFooter />

      {/* ── Floating Province AI Chatbot ── */}
      <ProvinceChatbot
        provinceName="Nha Trang"
        provinceSlug="nha-trang"
        isOpenExternal={aiCompanionOpen}
        onCloseExternal={() => setAiCompanionOpen(false)}
      />
    </div>
  );
}
