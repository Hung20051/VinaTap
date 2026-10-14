"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import { ChevronDown, Share2, ArrowLeft, Waves, Sun, Compass } from "lucide-react";
import "@/styles/home.css";
import "./vung-tau-beaches.css";


// ─── 5 BÃI BIỂN ĐẸP NHẤT VŨNG TÀU (THEO NGUYÊN BẢN VIETNAMNOMAD) ───
const VUNG_TAU_BEACHES = [
  {
    num: "1",
    titleVi: "1. Bãi Trước (Front Beach)",
    titleEn: "1. Bai Truoc (Front Beach)",
    image: "/guide/vung-tau/beach-1-bai-truoc.jpg",
    descVi:
      "Bãi Trước là bãi biển được đông đảo người dân địa phương và các gia đình yêu thích. Nơi đây nổi tiếng với làn nước êm ả, là địa điểm lý tưởng cho những ai muốn thư giãn và bơi lội an toàn. Mặt biển thường rất phẳng lặng cùng các biện pháp an toàn như phao chắn và đội ngũ cứu hộ thường trực, giúp du khách an tâm khi ngâm mình dưới làn nước mát lành.",
    descVi2:
      "Vào dịp cuối tuần, bãi biển khá đông đúc nhộn nhịp nhưng vẫn giữ trọn vẻ quyến rũ với tuyến đường dạo bộ ven biển rộng rãi và rợp mát bóng dừa. Bạn có thể thuê một chiếc thuyền SUP vào khoảng 17:00, chèo ra xa để hòa mình vào khoảnh khắc hoàng hôn dát vàng trên mặt biển. Bờ kè đá ven biển cũng là nơi hoàn hảo để tản bộ thong dong, ngắm nhìn bờ vịnh cong mềm mại và quan sát nếp sinh hoạt đời thường mộc mạc của người dân phố biển.",
    descVi3:
      "Dù bạn muốn tắm biển nhẹ nhàng, dạo bước ven mép nước, đón từng làn gió biển mát rượi hay ngắm dòng người qua lại, Bãi Trước luôn toát lên bầu không khí thân thiện, sôi nổi và đậm đà phong vị bản địa.",
    descEn:
      "Bai Truoc is a local favorite, especially popular with families and residents. The beach is known for its calm waters, making it an ideal spot for those looking to relax and swim safely. It’s particularly great for swimming laps, as the water is generally calm, with safety measures including floating barriers and beach guards.",
    descEn2:
      "On weekends, this beach can get quite crowded with locals, but it still retains its charm with a beautiful, wide promenade. Hop on a rental SUP at around 5 p.m., paddle out, and immerse yourself in the golden hour. The beach’s seawall is perfect for a leisurely stroll, offering stunning views of the coastline and a glimpse into the locals’ ways of hanging out.",
    descEn3:
      "Whether you’re in for a worry-free dip, walking along the water’s edge, enjoying the breeze, or people-watching, Bai Truoc has a friendly, lively atmosphere that’s perfect for those looking to experience the local vibe.",
    tipVi:
      "Nên thuê ván chèo SUP lúc 17:00 để chiêm ngưỡng trọn vẹn cảnh hoàng hôn rực rỡ buông xuống đường chân trời.",
    tipEn:
      "Rent a SUP board around 5:00 PM to paddle out into the ocean right as the golden hour lights up the sky.",
    highlightsVi: ["Biển êm sóng lặng", "Chèo SUP ngắm hoàng hôn", "Công viên Bãi Trước thoáng đãng"],
    highlightsEn: ["Calm Waters", "Sunset SUP Paddling", "Scenic Coastal Promenade"],
  },
  {
    num: "2",
    titleVi: "2. Bãi Sau (Back Beach)",
    titleEn: "2. Bai Sau (Back Beach)",
    image: "/guide/vung-tau/beach-2-bai-sau.jpg",
    descVi:
      "Đối với những ai tìm kiếm trải nghiệm sôi động và mạo hiểm hơn, Bãi Sau (bãi Thùy Vân) là điểm đến hàng đầu với những con sóng lớn dạt dào. Đây là thánh địa quen thuộc của những tín đồ thể thao dưới nước, đặc biệt là lướt sóng (surfing) và lướt ván diều (kitesurfing). Sóng ở đây khá mạnh, vì vậy nếu đi tắm biển, hãy lưu ý bơi gần bờ hoặc trang bị phao an toàn.",
    descVi2:
      "Bãi Sau trải dài tít tắp với bãi cát thoai thoải và không gian rộng thênh thang. Bạn có thể thuê ghế bố và dù che ven biển với mức giá trung bình từ 80.000 – 120.000 VNĐ ($3.5 – $5). Hãy hỏi giá và thỏa thuận trước để có vị trí ngả lưng ngắm biển thoải mái nhất.",
    descVi3:
      "Khu vực Bãi Sau còn có quảng trường Cột Cờ rộng lớn—nơi diễn ra các hoạt động biểu diễn nghệ thuật đường phố, lễ hội âm nhạc và các quầy ẩm thực về đêm. Hiện bãi biển đang được quy hoạch và nâng cấp toàn diện các công trình cảnh quan công cộng để trở thành không gian du lịch biển hiện đại, đẳng cấp.",
    descEn:
      "For those seeking adventure, Bai Sau offers a more exciting experience with larger waves. This beach is the go-to spot for water sports enthusiasts, especially surfers and kite surfers. The waves here can get quite strong, so if you’re here for a swim, make sure to stay close to the shore or use a safety device—like a single airbag buoy, for example.",
    descEn2:
      "Bai Sau is a long stretch of sandy shoreline with plenty of space to relax on one of the many beach chairs scattered along the coast. The average price for a lounge chair is around 80,000–120,000 VND ($3.5–$5). It’s a good idea to ask around and haggle a bit before paying.",
    descEn3:
      "Bai Sau is also home to a spacious square where visitors can enjoy street performances, sample local snacks, or simply watch the sunset. At the time of writing, Bai Sau is undergoing major renovations, with plans to improve its amenities and facilities—making it a more multifunctional public space and an even more attractive tourist destination in the near future.",
    tipVi:
      "Giá thuê ghế dù trung bình khoảng 80.000 – 120.000 VNĐ/ghế. Hãy chú ý cờ báo hiệu bãi tắm an toàn trước khi xuống nước.",
    tipEn:
      "Lounge chairs cost about 80,000–120,000 VND ($3.5–$5). Always check the lifeguard flags for safe swimming zones.",
    highlightsVi: ["Sóng lớn thể thao biển", "Bãi cát dài tít tắp", "Quảng trường Cột Cờ sôi động"],
    highlightsEn: ["Big Waves & Surfing", "Long Sandy Shoreline", "Vibrant Public Square"],
  },
  {
    num: "3",
    titleVi: "3. Bãi Dâu (Strawberry Beach)",
    titleEn: "3. Bai Dau (Strawberry Beach)",
    image: "/guide/vung-tau/beach-3-bai-dau.jpg",
    descVi:
      "Nếu bạn là một người say mê khung cảnh hoàng hôn tráng lệ, Bãi Dâu nhất định phải nằm trong danh sách ghé thăm của bạn. Bãi biển này được ca ngợi là nơi chiêm ngưỡng hoàng hôn ngoạn mục và thơ mộng bậc nhất tại Vũng Tàu. Với tầm nhìn khoáng đạt không bị che khuất, bạn có thể ngắm mặt trời đỏ rực từ từ lặn xuống biển, nhuộm cả bầu trời trong những gam màu vàng cam kỳ ảo. Xa xa là hình ảnh những con tàu chở hàng và thuyền buồm lướt nhẹ trên mặt nước càng tô điểm thêm vẻ thanh bình cho nơi đây.",
    descVi2:
      "Bên cạnh cảnh sắc thiên nhiên tuyệt mỹ, Bãi Dâu còn là nơi tọa lạc của nhiều công trình tâm linh nổi tiếng. Tượng Đức Mẹ Bãi Dâu, Chùa Quán Thế Âm Bồ Tát (Nam Hải) và Đền Thờ Hưng Thắng Tự là những điểm đến tâm linh thu hút du khách tìm kiếm sự bình yên trong tâm hồn. Cả ba địa danh đều nằm trên sườn đồi với những bậc thang cao dẫn lối, mở ra tầm nhìn bao quát biển trời bao la—một trải nghiệm không thể bỏ qua cho cả người yêu biển lẫn văn hóa lịch sử.",
    descEn:
      "If you’re a fan of breathtaking sunsets, Bai Dau should be on your must-visit list. This beach is renowned for offering the most picturesque sunset views in Vung Tau. With unobstructed views of the horizon, you can watch the sun dip below the sea, casting golden hues across the sky. The sight of ships and boats sailing by in the distance adds to the charm of this serene location.",
    descEn2:
      "Apart from its stunning views, Bai Dau is also home to some notable spiritual landmarks. The Quan Am Nam Hai (Lady Buddha of the Sea) Pagoda, the Duc Me Bai Dau Church, and the Hung Thang Tu Temple are significant cultural and spiritual sites that attract visitors seeking a peaceful retreat or a spiritual journey. All three sites are located on a hilltop, with tall staircases offering an elevated view of the surrounding area, making it a must-see for both beachgoers and history enthusiasts.",
    tipVi:
      "Kết hợp tham quan Đền Thánh Đức Mẹ Bãi Dâu và Chùa Quán Thế Âm trên sườn núi trước khi xuống bãi ngắm hoàng hôn lúc 17:30.",
    tipEn:
      "Combine your beach trip with a visit to the Duc Me Bai Dau shrine and the hilltop Quan Am pagoda before catching the sunset around 5:30 PM.",
    highlightsVi: ["Hoàng hôn đẹp nhất Vũng Tàu", "Đền Thánh Đức Mẹ Bãi Dâu", "Không gian tĩnh lặng"],
    highlightsEn: ["Best Sunset in Town", "Historic Hilltop Shrines", "Peaceful & Scenic"],
  },
  {
    num: "4",
    titleVi: "4. Bãi Dứa (Pineapple Beach)",
    titleEn: "4. Bai Dua (Pineapple Beach)",
    image: "/guide/vung-tau/beach-4-bai-dua.jpg",
    descVi:
      "Bãi Dứa là một trong những bãi biển ít người biết đến hơn tại Vũng Tàu, mang lại không gian thư giãn yên tĩnh và biệt lập. Cát ở đây mềm mại và sạch sẽ, tạo cảm giác khoan khoái khi ngả lưng tận hưởng cảnh biển. Điểm làm nên sự khác biệt của bãi biển này chính là vô số phiến đá lớn nhấp nhô rải rác dọc theo bờ cát. Khi thủy triều rút xuống, Bãi Dứa biến thành thiên đường chụp ảnh nghệ thuật với những mỏm đá tạo hình độc đáo tương phản cùng trời xanh và sóng biếc.",
    descVi2:
      "Tuy nhiên, du khách nên cẩn trọng khi tắm biển tại đây, đặc biệt là lúc thủy triều lên cao. Những tảng đá ngầm dưới mặt nước có thể gây nguy hiểm cho người bơi, vì vậy tốt nhất nên bơi gần bờ hoặc chỉ tắm khi biển êm. Bãi Dứa cũng có góc nhìn ngoạn mục hướng thẳng về Mũi Nghinh Phong—mũi đất biểu tượng của Vũng Tàu—làm cho nơi đây trở thành địa điểm lý tưởng để thư giãn và săn những bức ảnh phong cảnh tuyệt đẹp.",
    descEn:
      "Bai Dua is one of Vung Tau’s lesser-known beaches, offering a more peaceful and secluded escape. The sand here is soft and clean, making it a pleasant spot to lay back and enjoy the scenery. What sets this beach apart is the abundance of large rocks scattered along the shore. When the tide is low, the beach transforms into a photographer’s paradise, with the rocks creating dramatic shapes against the backdrop of the sky and sea.",
    descEn2:
      "However, visitors should be cautious when swimming here, especially when the tide is high. The submerged rocks can pose a danger to swimmers, so it’s best to stick to the shore when the water is rising. The beach also provides a fantastic view of Nghinh Phong Cape, a famous cape in Vung Tau, making it an excellent spot for both relaxation and scenic photography.",
    tipVi:
      "Cảnh quan ghềnh đá chụp ảnh đẹp nhất khi thủy triều rút. Hãy cẩn thận đá ngầm trơn trượt khi bước xuống nước.",
    tipEn:
      "Visit during low tide for the most dramatic rock formations and photo opportunities. Watch your footing on the submerged rocky patches.",
    highlightsVi: ["Ghềnh đá chụp ảnh nghệ thuật", "Biệt lập thanh bình", "View Mũi Nghinh Phong"],
    highlightsEn: ["Dramatic Rock Formations", "Secluded Atmosphere", "Views of Nghinh Phong Cape"],
  },
  {
    num: "5",
    titleVi: "5. Bãi Vọng Nguyệt (Moon Gazing Beach)",
    titleEn: "5. Bai Vong Nguyet (Moon Gazing Beach)",
    image: "/guide/vung-tau/beach-5-bai-vong-nguyet.jpg",
    descVi:
      "Nếu bạn đang tìm kiếm một 'viên ngọc ẩn giấu' thực sự, Bãi Vọng Nguyệt (Bãi Ngắm Trăng) chắc chắn là nơi phải đưa vào hành trình khám phá! Đây có lẽ là bãi biển quyến rũ và hoang sơ nhất tại Vũng Tàu. Dù nằm ngay cạnh cung đường biển Trần Phú - Hạ Long tấp nập, chỉ cách Bãi Sau một quãng ngắn, Bãi Vọng Nguyệt lại tựa như một góc nhỏ bị thế giới lãng quên. Đó là dải cát vàng mềm mại hình trăng khuyết nép mình dưới chân Mũi Nghinh Phong và tượng Chúa Kitô Vua cao vút.",
    descVi2:
      "Người dân địa phương thường đến đây câu cá hoặc thả lưới mỗi sớm mai. Vào những ngày sóng lớn, bạn có thể bắt gặp những chú cua nhỏ dạt vào bờ cát rồi nhanh thoăn thoắt bò ngược về biển. Nước biển ở đây trong vắt và sạch hơn hẳn so với những bãi tắm khác. Nếu may mắn đến vào lúc thủy triều rút, bạn gần như sẽ sở hữu trọn vẹn cả bãi biển cho riêng mình.",
    descVi3:
      "Khi thủy triều dâng cao, hãy ghé một trong hai quán cà phê nhỏ ven triền dốc bờ biển (ở đây chỉ có hai quán, bạn sẽ thấy ngay) và đón từng làn gió biển lồng lộng trong lúc ngắm từng đợt sóng vỗ bờ tung bọt trắng xóa tại góc nhỏ hoang sơ này.",
    descEn:
      "If you’re looking for a hidden gem, Bai Vong Nguyet is definitely one to add to your bucket list! This is probably the most enchanting and least-known beach in Vung Tau. Although it’s located right on the busy coastal road, just a stone’s throw from the crowded Back Beach, Bai Vong Nguyet feels like it’s been forgotten by the chaos of the world. It’s a small, peaceful stretch of soft golden sand, dotted with rocks of all shapes and sizes. Tucked away at the foot of the iconic Nghinh Phong Cape, the beach boasts a stunning crescent-shaped shoreline that’s perfect for a chill escape.",
    descEn2:
      "Locals often come here to fish or throw out their nets. On days with big waves, you might spot little crabs washed ashore and scrambling back to the water. The water here is noticeably cleaner and clearer than at other beaches, and if you’re lucky enough to visit when the tide’s out, you’ll basically have the entire beach to yourself.",
    descEn3:
      "When the tide rises high, grab a seat at one of the two local cafes by the shore (there are only two, you can’t miss them) and enjoy the refreshing breeze while watching the waves roll in at this secluded spot.",
    tipVi:
      "Nước biển ở đây trong vắt và bãi biển hình trăng khuyết cực kỳ riêng tư. Hãy ghé vào buổi chiều mát mẻ khi thủy triều rút.",
    tipEn:
      "The crystal-clear water and crescent cove feel wonderfully untouched. Visit in the cool late afternoon during low tide for total serenity.",
    highlightsVi: ["Viên ngọc hoang sơ ẩn mình", "Đường bờ biển trăng khuyết", "Nước biển trong xanh"],
    highlightsEn: ["Hidden Pristine Gem", "Crescent-Shaped Cove", "Crystal-Clear Ocean"],
  },
];

export default function BestVungTauBeachesPage() {
  const [lang, setLang] = useState("vi");
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const menuTimerRef = useRef(null);

  const isVi = lang === "vi";

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => {
      setLang(e.detail || getLang());
    };
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
    };
  }, []);

  useEffect(() => {
    document.title =
      lang === "vi"
        ? "5 Bãi Biển Đẹp Nhất Tại Vũng Tàu Bạn Không Nên Bỏ Lỡ | VinaTap"
        : "5 Stunning Vung Tau Beaches You Shouldn’t Miss | VinaTap";
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title:
          lang === "vi"
            ? "5 Bãi Biển Đẹp Nhất Tại Vũng Tàu - VinaTap"
            : "5 Stunning Vung Tau Beaches You Shouldn’t Miss - VinaTap",
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(lang === "vi" ? "Đã sao chép liên kết bài viết!" : "Article link copied!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    }
  };

  return (
    <div className="vnn-article-page">
      <PublicHeader />

      {/* ── Main Editorial Container ── */}
      <main className="vnn-container">
        {/* Article Header */}
        <div className="vnn-post-header">
          <h1 className="vnn-post-title">
            {lang === "vi"
              ? "5 Bãi Biển Đẹp Nhất Tại Vũng Tàu Bạn Không Nên Bỏ Lỡ"
              : "5 Stunning Vung Tau Beaches You Shouldn’t Miss"}
          </h1>
          <div className="vnn-post-meta">
            <div className="vnn-author-wrap">
              <span className="vnn-author-avatar">VT</span>
              <span className="vnn-author-name">
                {lang === "vi" ? "VinaTap" : "VinaTap"}
              </span>
            </div>
            <span className="vnn-meta-dot">•</span>
            <span>{lang === "vi" ? "9 Tháng 4, 2026" : "April 9, 2026"}</span>
            <span className="vnn-meta-dot">•</span>
            <span>{lang === "vi" ? "5 phút đọc" : "5 min read"}</span>

            <button type="button" className="vnn-share-btn" onClick={handleShare}>
              <Share2 size={13} />
              <span>{lang === "vi" ? "Chia sẻ" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="vnn-featured-image-wrap">
          <img
            src="/guide/vung-tau/hero-vung-tau-beaches.jpg"
            alt="5 Stunning Vung Tau Beaches"
            className="vnn-featured-image"
          />
        </div>

        {/* Lead Intro Paragraph */}
        <div className="vnn-intro-paragraph">
          {lang === "vi" ? (
            <p>
              Vũng Tàu – viên ngọc biển tại miền Nam Việt Nam – sở hữu hàng loạt bãi biển tuyệt đẹp đáp ứng mọi sở thích, từ làn nước phẳng lặng lý tưởng để thư giãn, bơi lội an toàn cho cả gia đình đến những con sóng mạnh mẽ cuốn hút cho các môn thể thao dưới nước mạo hiểm. Dù bạn là người yêu biển, thích lướt sóng hay đơn giản muốn tìm kiếm không gian thanh bình ngắm cảnh hoàng hôn buông lơi, Vũng Tàu luôn có một bờ biển tuyệt vời dành riêng cho bạn. Dưới đây là <strong>cẩm nang 5 bãi biển đẹp và nổi bật nhất</strong> tại Vũng Tàu cùng những nét cuốn hút độc đáo tại mỗi nơi.
            </p>
          ) : (
            <p>
              Vung Tau, a coastal gem in Southern Vietnam, offers an array of beautiful beaches that cater to different tastes, from calm waters perfect for a peaceful swim to more adventurous waves for water sports. Whether you’re a beach lover, a thrill-seeker, or someone who appreciates scenic beauty and tranquility, Vung Tau has a beach for you. Here’s a guide to the <strong>best 5 beaches in the area</strong>, each offering its unique charm and attractions.
            </p>
          )}
        </div>

        {/* ── 5 Beaches in 2-Column VietnamNomad Layout ── */}
        <div className="vnn-beaches-wrapper">
          {VUNG_TAU_BEACHES.map((beach) => (
            <article key={beach.num} className="vnn-beach-section" id={`beach-${beach.num}`}>
              {/* Beach Title */}
              <h2 className="vnn-beach-heading">
                {lang === "vi" ? beach.titleVi : beach.titleEn}
              </h2>

              {/* 2-Column Row: Left Image (~38%), Right Content (~62%) */}
              <div className="vnn-beach-columns">
                <div className="vnn-column-image">
                  <figure className="vnn-figure">
                    <img
                      src={beach.image}
                      alt={lang === "vi" ? beach.titleVi : beach.titleEn}
                      className="vnn-beach-img"
                      loading="lazy"
                    />
                  </figure>
                </div>

                <div className="vnn-column-text">
                  <p className="vnn-paragraph">
                    {lang === "vi" ? beach.descVi : beach.descEn}
                  </p>
                  <p className="vnn-paragraph">
                    {lang === "vi" ? beach.descVi2 : beach.descEn2}
                  </p>
                  {(beach.descVi3 || beach.descEn3) && (
                    <p className="vnn-paragraph">
                      {lang === "vi" ? beach.descVi3 : beach.descEn3}
                    </p>
                  )}

                  {/* Tip */}
                  <div className="vnn-tip-box">
                    <strong>{lang === "vi" ? "Mẹo VinaTap:" : "Insider Tip:"}</strong>{" "}
                    {lang === "vi" ? beach.tipVi : beach.tipEn}
                  </div>

                  {/* Highlights / Badges */}
                  <div className="vnn-highlights-wrap">
                    {(lang === "vi" ? beach.highlightsVi : beach.highlightsEn).map((tag, idx) => (
                      <span key={idx} className="vnn-highlight-chip">
                        <Waves size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Related Articles Section (Matching screenshot) ── */}
        <hr className="vnn-related-divider" />
        <section className="vnn-related-section">
          <h2 className="vnn-related-title">
            {lang === "vi" ? "Bài viết liên quan" : "Related Articles"}
          </h2>
          <div className="vnn-related-grid">
            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="vnn-related-card"
            >
              <div className="vnn-related-img-wrap">
                <img
                  src="/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg"
                  alt="15 best places to visit in Vietnam in 2026"
                  className="vnn-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="vnn-related-card-title">
                {lang === "vi"
                  ? "15 điểm đến tuyệt nhất Việt Nam năm 2026"
                  : "15 best places to visit in Vietnam in 2026"}
              </h3>
            </Link>

            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="vnn-related-card"
            >
              <div className="vnn-related-img-wrap">
                <img
                  src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                  alt="The Complete Guide to Vietnam"
                  className="vnn-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="vnn-related-card-title">
                {lang === "vi"
                  ? "Cẩm nang du lịch toàn diện Việt Nam"
                  : "The Complete Guide to Vietnam"}
              </h3>
            </Link>

            <Link
              href="/guide/20-best-things-to-do-in-vietnam"
              className="vnn-related-card"
            >
              <div className="vnn-related-img-wrap">
                <img
                  src="/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg"
                  alt="20 Best Things to Do in Vietnam"
                  className="vnn-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="vnn-related-card-title">
                {lang === "vi"
                  ? "20 trải nghiệm tuyệt nhất tại Việt Nam"
                  : "20 Best Things to Do in Vietnam"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FULL EDITORIAL FOOTER ─── */}
      <PublicFooter lang={lang} />

      {/* ─── AI TRAVEL COMPANION (CHATBOT) ─── */}
      <ProvinceChatbot
        province={{
          name: lang === "vi" ? "Bà Rịa - Vũng Tàu" : "Ba Ria - Vung Tau",
          slug: "ba-ria-vung-tau",
        }}
      />

      {/* Toast */}
      {toastVisible && <div className="vnn-toast">{toastMessage}</div>}
    </div>
  );
}
