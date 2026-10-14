"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  Sparkles,
  Maximize2,
  X,
  Download,
  Check,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/one-month-itinerary.css";


// ─── 8 DESTINATIONS DATA (2 WEEKS IN VIETNAM) ───
const ITINERARY_8_DESTINATIONS = [
  {
    num: 1,
    name: "Ho Chi Minh City",
    nameVi: "TP. Hồ Chí Minh",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/dest-1-hcmc.jpg",
    subNote: "From Tan Son Nhat International Airport, you can take bus 109 to get to the center (District 1).",
    subNoteVi: "Từ Sân bay Quốc tế Tân Sơn Nhất, bạn có thể bắt tuyến xe buýt 109 để vào trung tâm (Quận 1).",
    thingsToDo:
      "War Remnants Museum, Ben Thanh Market, Saigon Skydeck, Bui Vien Street, Cu Chi Tunnels.",
    thingsToDoVi:
      "Bảo tàng Chứng tích Chiến tranh, Chợ Bến Thành, Saigon Skydeck, Phố Bùi Viện, Địa đạo Củ Chi.",
    nextRoute: "Ho Chi Minh City → Dalat",
    nextRouteVi: "TP. Hồ Chí Minh → Đà Lạt",
    transport: "Bus (Thanh Buoi, Phuong Trang)",
    transportVi: "Xe khách (Thành Bưởi, Phương Trang)",
    time: "7 hr",
    timeVi: "7 giờ",
    fare: "290,000 VND",
    fareVi: "290.000 VNĐ",
  },
  {
    num: 2,
    name: "Dalat",
    nameVi: "Đà Lạt",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/dest-2-dalat.jpg",
    subNote: "All buses offer free shuttle service to your hotel.",
    subNoteVi: "Tất cả các nhà xe đều có xe trung chuyển miễn phí đưa đón về khách sạn của bạn.",
    thingsToDo:
      "Xuan Huong Lake area, Dalat Railway Station, Chicken Church, Linh Phuoc Pagoda.",
    thingsToDoVi:
      "Khu vực Hồ Xuân Hương, Ga Đà Lạt, Nhà thờ Con Gà, Chùa Linh Phước.",
    nextRoute: "Dalat → Nha Trang",
    nextRouteVi: "Đà Lạt → Nha Trang",
    transport: "Bus (Phuong Trang, The Sinh Bus)",
    transportVi: "Xe khách (Phương Trang, The Sinh Bus)",
    time: "3 hr",
    timeVi: "3 giờ",
    fare: "250,000 VND",
    fareVi: "250.000 VNĐ",
  },
  {
    num: 3,
    name: "Nha Trang",
    nameVi: "Nha Trang",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/dest-3-nhatrang.jpg",
    subNote: "All buses offer free shuttle service to your hotel.",
    subNoteVi: "Tất cả các nhà xe đều có xe trung chuyển miễn phí đưa đón về khách sạn của bạn.",
    thingsToDo:
      "Nha Trang Beach, Vinpearl Land, Po Nagar Cham Towers, Dam Market.",
    thingsToDoVi:
      "Bãi biển Nha Trang, Vinpearl Land, Tháp Bà Po Nagar, Chợ Đầm.",
    nextRoute: "Nha Trang → Da Nang",
    nextRouteVi: "Nha Trang → Đà Nẵng",
    transport: "Plane (Vietnam Airlines, Vietjet Air, Pacific Airlines, and Bamboo Airways)",
    transportVi: "Máy bay (Vietnam Airlines, Vietjet Air, Pacific Airlines và Bamboo Airways)",
    time: "1 hr 5 min",
    timeVi: "1 giờ 5 phút",
    fare: "800,000 – 1,200,000 VND",
    fareVi: "800.000 – 1.200.000 VNĐ",
    isFlight: true,
  },
  {
    num: 4,
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/dest-4-danang.jpg",
    subNote: "Da Nang Airport is about 3 km from the city center and 6 km from My Khe Beach. Beachfront accommodation is a great option.",
    subNoteVi: "Sân bay Đà Nẵng cách trung tâm thành phố khoảng 3 km và cách bãi biển Mỹ Khê 6 km. Khách sạn ven biển là một lựa chọn tuyệt vời.",
    thingsToDo:
      "My Khe Beach, Ba Na Hills, Marble Mountains, Museum of Cham Sculpture.",
    thingsToDoVi:
      "Bãi biển Mỹ Khê, Bà Nà Hills, Ngũ Hành Sơn, Bảo tàng Điêu khắc Chăm.",
    nextRoute: "Da Nang → Hoi An",
    nextRouteVi: "Đà Nẵng → Hội An",
    transport: "Bus (01)",
    transportVi: "Tuyến xe buýt (01)",
    time: "45 min",
    timeVi: "45 phút",
    fare: "30,000 VND",
    fareVi: "30.000 VNĐ",
  },
  {
    num: 5,
    name: "Hoi An",
    nameVi: "Hội An",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/dest-5-hoian.jpg",
    subNote: "Bus stops near the Ancient Town of Hoi An; choose a place to stay in the ancient town's heart to feel the rhythm of life here.",
    subNoteVi: "Xe buýt dừng gần Phố cổ Hội An; hãy chọn nơi lưu trú ngay trung tâm phố cổ để cảm nhận trọn vẹn nhịp sống nơi đây.",
    thingsToDo:
      "An Bang Beach, the ancient town, Bay Mau Coconut Forest.",
    thingsToDoVi:
      "Biển An Bàng, Phố cổ Hội An, Rừng dừa Bảy Mẫu.",
    isHoiAnTransit: true,
    transitIntro:
      "To get to Van Don Airport from Hoi An, take bus 01 to Da Nang, where you can catch flights with Vietnam Airlines, Vietjet Air, or Bamboo Airways.",
    transitIntroVi:
      "Để đến Sân bay Vân Đồn từ Hội An, bạn bắt xe buýt 01 đến Đà Nẵng, nơi bạn có thể bay cùng Vietnam Airlines, Vietjet Air hoặc Bamboo Airways.",
    time: "1 hr 20 min",
    timeVi: "1 giờ 20 phút",
    fare: "800,000 – 1,200,000 VND",
    fareVi: "800.000 – 1.200.000 VNĐ",
    isFlight: true,
  },
  {
    num: 6,
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/dest-6-halong.jpg",
    subNote: "From Van Don Airport, you take bus 14A or 14B to get to Ha Long Bay (free).",
    subNoteVi: "Từ Sân bay Vân Đồn, bạn đi xe buýt 14A hoặc 14B để đến Vịnh Hạ Long (miễn phí).",
    thingsToDo:
      "Ha Long Bay, Tuan Chau Island.",
    thingsToDoVi:
      "Vịnh Hạ Long, Đảo Tuần Châu.",
    nextRoute: "Ha Long Bay → Ninh Binh",
    nextRouteVi: "Vịnh Hạ Long → Ninh Bình",
    transport: "Bus (The Long Bus)",
    transportVi: "Xe khách (The Long Bus)",
    time: "5 hr",
    timeVi: "5 giờ",
    fare: "300,000 VND",
    fareVi: "300.000 VNĐ",
  },
  {
    num: 7,
    name: "Ninh Binh",
    nameVi: "Ninh Bình",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/dest-7-ninhbinh.jpg",
    subNote: "The bus stops in Tam Coc, one of the most attractive tourist destinations in Ninh Binh.",
    subNoteVi: "Xe dừng tại Tam Cốc, một trong những điểm du lịch hấp dẫn nhất ở Ninh Bình.",
    thingsToDo:
      "Tam Coc – Bich Dong, Mua Cave, Trang An Landscape Complex, Bai Dinh Pagoda.",
    thingsToDoVi:
      "Tam Cốc – Bích Động, Hang Múa, Quần thể danh thắng Tràng An, Chùa Bái Đính.",
    nextRoute: "Ninh Binh → Hanoi",
    nextRouteVi: "Ninh Bình → Hà Nội",
    transport: "Bus (Trang An Limousine)",
    transportVi: "Xe khách (Tràng An Limousine)",
    time: "2 hr",
    timeVi: "2 giờ",
    fare: "170,000 VND",
    fareVi: "170.000 VNĐ",
  },
  {
    num: 8,
    name: "Hanoi",
    nameVi: "Hà Nội",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/dest-8-hanoi.jpg",
    subNote: "The last destination in the itinerary is Hanoi – the capital.",
    subNoteVi: "Điểm đến cuối cùng trong hành trình là Hà Nội – thủ đô ngàn năm văn hiến.",
    thingsToDo:
      "Hoan Kiem Lake, Hanoi Old Quarter, Temple of Literature, Dong Xuan Market, Ho Chi Minh Mausoleum.",
    thingsToDoVi:
      "Hồ Hoàn Kiếm, Phố cổ Hà Nội, Văn Miếu, Chợ Đồng Xuân, Lăng Chủ tịch Hồ Chí Minh.",
    isHanoiEnd: true,
    endNote:
      "You can take bus number 86 (35,000 VND) to Noi Bai International Airport from Hanoi city center, ending your 2-week itinerary in Vietnam.",
    endNoteVi:
      "Bạn có thể đi xe buýt số 86 (35.000 VNĐ) ra Sân bay Quốc tế Nội Bài từ trung tâm thành phố Hà Nội, kết thúc chuyến hành trình 2 tuần tại Việt Nam.",
  },
];

export default function TwoWeeksInVietnamPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setLang(getLang());
    const handleStorage = () => setLang(getLang());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isVi = lang === "vi";

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="omi-page">
      {/* ─── STANDARDIZED NAVBAR ─── */}
      <PublicHeader />

      {/* ─── HERO SECTION (SCREENSHOT 1) ─── */}
      <section className="omi-hero">
        <img
          src="/guide/megamenu/itin-3-2weeks.jpg"
          alt="2 Weeks in Vietnam - Hai Van Pass Train Viaduct"
          className="omi-hero__bg"
        />
        <div className="omi-hero__overlay" />

        <div className="omi-hero__content">
          <div className="omi-hero__badges">
            <span className="omi-hero__badge">
              {isVi ? "LỊCH TRÌNH" : "ITINERARY"}
            </span>
            <span className="omi-hero__badge">
              {isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}
            </span>
          </div>

          <h1 className="omi-hero__title">
            {isVi
              ? "Lịch trình 2 tuần xuyên Việt hoàn hảo"
              : "2 Weeks in Vietnam"}
          </h1>

          <div className="omi-hero__byline">
            {isVi
              ? "Biên tập bởi VinaTap Editorial • 14 Tháng 10, 2026"
              : "By Welcome to Vietnam • May 20, 2024"}
          </div>
        </div>
      </section>

      {/* ─── CTA PILL BUTTON (SCREENSHOT 1) ─── */}
      <div className="omi-cta-bar">
        <button
          type="button"
          className="omi-cta-pill"
          onClick={() => setAiCompanionOpen(true)}
        >
          <Sparkles size={16} />
          <span>
            {isVi
              ? "Tạo chuyến đi Việt Nam trong vài giây với AI"
              : "Create your Vietnam trip in seconds"}
          </span>
        </button>
      </div>

      {/* ─── MAIN ARTICLE BODY ─── */}
      <main className="omi-container">
        {/* ─── SECTION 1: MAP (SCREENSHOT 2 & 3) ─── */}
        <h2 className="omi-section-title">
          {isVi
            ? "Bản đồ lịch trình 2 tuần xuyên Việt"
            : "2-week Vietnam itinerary map"}
        </h2>

        <p className="omi-intro-text">
          {isVi
            ? "Khám phá những điểm đến quyến rũ bậc nhất trải dài khắp ba miền Bắc, Trung, Nam của Việt Nam với lịch trình 2 tuần được tuyển chọn kỹ lưỡng qua 8 điểm đến: TP. Hồ Chí Minh, Đà Lạt, Nha Trang, Đà Nẵng, Hội An, Vịnh Hạ Long, Ninh Bình và Hà Nội."
            : "Discover the most alluring destinations across Vietnam's North, Central, and South regions with our 2-week itinerary. This carefully crafted itinerary covers a total of six must-visit destinations, including Ho Chi Minh City, Dalat, Nha Trang, Da Nang, Hoi An, Ha Long Bay, Ninh Binh, and Hanoi."}
        </p>

        <div className="omi-map-wrap">
          <img
            src="/guide/vietnam/2-week-vietnam-itinerary-full-map.jpg"
            alt="2-week Vietnam itinerary map with 8 destinations"
            className="omi-map-img"
            onClick={() => setIsMapModalOpen(true)}
            title={isVi ? "Nhấp để xem phóng to độ nét cao" : "Click to view full size"}
          />
          <div className="omi-map-hint">
            <Maximize2 size={13} />
            <span>
              {isVi
                ? "Nhấp vào bản đồ để phóng to chi tiết độ phân giải cao"
                : "Click map to expand high-resolution view"}
            </span>
          </div>
        </div>

        {/* ─── SECTION 2: WANT TO MAKE IT YOUR OWN? (SCREENSHOT 4) ─── */}
        <div className="omi-custom-box">
          <h3>
            {isVi ? "Bạn muốn tùy chỉnh lịch trình theo ý mình?" : "Want to make it your own?"}
          </h3>
          <p>
            {isVi
              ? 'Mở Trợ lý Du lịch Ảo VinaTap AI và nhập một câu lệnh như: "Tạo lịch trình 2 tuần du lịch Việt Nam". Trợ lý AI sẽ tự động phân tích tuyến đường, tối ưu phương tiện di chuyển và cá nhân hóa lịch trình theo sở thích.'
              : 'Open Tripion.ai and enter a prompt such as "Create a 2-week Vietnam itinerary." Tripion will build a personalized multi-city journey, help you optimize routes and transportation, and tailor the trip to your travel style.'}
          </p>
          <p>
            {isVi
              ? "Khi bạn hài lòng với hành trình, dễ dàng tải về bản đồ du lịch cùng lịch trình chi tiết dưới dạng tệp PDF hoàn chỉnh."
              : "When you're happy with your itinerary, simply download your personalized travel map and detailed itinerary as a PDF."}
          </p>

          <button
            type="button"
            className="omi-custom-btn"
            onClick={handleDownloadPDF}
          >
            <Download size={16} />
            <span>
              {isVi
                ? "Tùy chỉnh & Tải về bản PDF"
                : "Customize & Download PDF"}
            </span>
          </button>
        </div>

        {/* ─── SECTION 3: SUMMARY (SCREENSHOT 4) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Tổng quan hành trình" : "Summary"}
        </h2>

        <div className="omi-summary-card">
          <div className="omi-summary-list">
            <div className="omi-summary-item">
              <strong>{isVi ? "Số điểm đến: " : "Destinations: "}</strong>8
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng thời gian di chuyển (giờ): " : "Travel time (hr): "}
              </strong>
              22+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Chi phí phương tiện (USD): " : "Transportation costs (USD): "}
              </strong>
              125+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng chi phí ước tính (USD): " : "Total cost (USD): "}
              </strong>
              550+
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: ITINERARY DETAILS (SCREENSHOT 5) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Chi tiết lịch trình" : "Itinerary details"}
        </h2>

        <div className="omi-cards-grid">
          {ITINERARY_8_DESTINATIONS.map((dest) => (
            <article key={dest.num} className="omi-card">
              <div className="omi-card__img-wrap">
                <img
                  src={dest.image}
                  alt={isVi ? dest.nameVi : dest.name}
                  className="omi-card__img"
                  loading="lazy"
                />
              </div>

              <div className="omi-card__body">
                <h3 className="omi-card__title">
                  {isVi && dest.nameVi ? dest.nameVi : dest.name}
                </h3>
                <div className="omi-card__days">
                  ({isVi && dest.daysVi ? dest.daysVi : dest.days})
                </div>

                {dest.subNote && (
                  <p className="omi-card__airport-note" style={{ margin: "0 0 10px", fontSize: "13px", color: "#64748b" }}>
                    {isVi && dest.subNoteVi ? dest.subNoteVi : dest.subNote}
                  </p>
                )}

                <div className="omi-card__section">
                  <span className="omi-card__label">
                    {isVi ? "Things to do: " : "Things to do: "}
                  </span>
                  <span>{isVi && dest.thingsToDoVi ? dest.thingsToDoVi : dest.thingsToDo}</span>
                </div>

                {dest.isHoiAnTransit ? (
                  <>
                    <p style={{ marginTop: "14px", marginBottom: "8px", fontSize: "14px", lineHeight: 1.6, color: "#334155" }}>
                      {isVi ? dest.transitIntroVi : dest.transitIntro}
                    </p>
                    <ul className="omi-card__transit-list">
                      <li>
                        <strong>{isVi ? "Flying time: " : "Flying time: "}</strong>
                        {isVi && dest.timeVi ? dest.timeVi : dest.time}
                      </li>
                      <li>
                        <strong>{isVi ? "Airfare: " : "Airfare: "}</strong>
                        {isVi && dest.fareVi ? dest.fareVi : dest.fare}
                      </li>
                    </ul>
                  </>
                ) : dest.isHanoiEnd ? (
                  <p style={{ marginTop: "14px", fontSize: "14px", lineHeight: 1.6, color: "#334155" }}>
                    {isVi ? dest.endNoteVi : dest.endNote}
                  </p>
                ) : (
                  <>
                    <div className="omi-card__transit-title">
                      <strong>{isVi ? dest.nextRouteVi : dest.nextRoute}:</strong>
                    </div>

                    <ul className="omi-card__transit-list">
                      <li>
                        <strong>{isVi ? "Transportation: " : "Transportation: "}</strong>
                        {isVi && dest.transportVi ? dest.transportVi : dest.transport}
                      </li>
                      <li>
                        <strong>
                          {dest.isFlight
                            ? (isVi ? "Flying time: " : "Flying time: ")
                            : (isVi ? "Travel time: " : "Travel time: ")}
                        </strong>
                        {isVi && dest.timeVi ? dest.timeVi : dest.time}
                      </li>
                      <li>
                        <strong>
                          {dest.isFlight
                            ? (isVi ? "Airfare: " : "Airfare: ")
                            : (isVi ? "Fare: " : "Fare: ")}
                        </strong>
                        {isVi && dest.fareVi ? dest.fareVi : dest.fare}
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* ─── A FEW NOTES (SCREENSHOT 3 & 4) ─── */}
        <section className="omi-notes-box">
          <h2 className="omi-section-title">
            {isVi ? "Một số lưu ý quan trọng" : "A few notes"}
          </h2>
          <ul className="omi-notes-list">
            <li>
              {isVi
                ? "Tính đến năm 2024, tỷ giá hối đoái xấp xỉ từ USD sang VNĐ là 1 USD ≈ 25.000 VNĐ."
                : "As of 2024, the approximate exchange rate for USD to VND is 1 USD ≈ 25,000 VND."}
            </li>
            <li>
              {isVi
                ? "Thời gian di chuyển được đề cập cho từng phần của lịch trình không bao gồm thời gian cần thiết để làm thủ tục tại sân bay."
                : "The travel time mentioned for each part of the itinerary does not include the time required for airport check-in."}
            </li>
            <li>
              {isVi
                ? "Hai tuần là không đủ để khám phá toàn bộ Việt Nam, vì vậy chúng tôi ưu tiên lựa chọn những điểm đến nổi tiếng nhất dành cho du khách quốc tế."
                : "Two weeks is not enough to explore Vietnam, so we prioritize selecting the most popular destinations for international tourists."}
            </li>
            <li>
              {isVi
                ? "Các khuyến nghị trên về khách sạn, đơn vị vận chuyển và hãng hàng không được lựa chọn dựa trên sự phù hợp, hoàn toàn không có quảng cáo hay tiếp thị liên kết, vì vậy bạn có thể hoàn toàn tin tưởng vào những gợi ý này."
                : "The above recommendations for hotels, bus operators, and airlines were selected based on suitability and without any advertising or affiliate marketing, so you can trust these suggestions."}
            </li>
            <li>
              {isVi
                ? "Nếu bạn khởi hành từ Hà Nội hoặc các tỉnh phía Bắc, bạn có thể đi ngược lại lịch trình này."
                : "If you are departing from Hanoi or the northern provinces, you can reverse the itinerary."}
            </li>
          </ul>
        </section>

        {/* ─── 2 WEEKS IN VIETNAM COSTS (SCREENSHOT 4) ─── */}
        <section className="omi-costs-box">
          <h2 className="omi-section-title">
            {isVi ? "Chi phí du lịch Việt Nam 2 tuần" : "2 weeks in Vietnam costs"}
          </h2>
          <p className="omi-costs-intro" style={{ textAlign: "left", marginBottom: "16px" }}>
            {isVi
              ? "Nhiều du khách có thể dự trù chi tiêu khoảng 550 USD cho chuyến du lịch 2 tuần tại Việt Nam. Dưới đây là một số chi phí cố định ước tính giúp bạn lên kế hoạch ngân sách:"
              : "Many tourists can expect to spend around $550 for a two-week trip to Vietnam. Here are some estimated fixed costs to help with your budget planning:"}
          </p>

          <ul className="omi-notes-list" style={{ marginTop: "12px" }}>
            <li>
              {isVi
                ? "Chi phí di chuyển khoảng 125 USD. Đặt vé máy bay trước có thể giúp bạn có được mức giá thấp hơn."
                : "Transportation costs are approximately $125. Booking flights in advance can help you secure lower prices."}
            </li>
            <li>
              {isVi ? (
                <>
                  Khách sạn riêng và homestay có giá khoảng 15–20 USD mỗi đêm. Du khách đi một mình có thể cân nhắc các hostel, một lựa chọn tiết kiệm hơn với giá khoảng 5 USD mỗi đêm. Tìm hiểu thêm về các lựa chọn{" "}
                  <Link href="/guide/where-to-stay-in-ho-chi-minh-city" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                    chỗ ở
                  </Link>{" "}
                  tại Việt Nam.
                </>
              ) : (
                <>
                  Private hotels and homestays cost around $15–$20 per night. Solo travelers can consider hostels, which are a more economical option at around $5 per night. Learn more about{" "}
                  <Link href="/guide/where-to-stay-in-ho-chi-minh-city" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                    accommodation
                  </Link>{" "}
                  options in Vietnam.
                </>
              )}
            </li>
            <li>
              {isVi
                ? "Chi phí ăn uống ước tính khoảng 15 USD mỗi người mỗi ngày."
                : "Food expenses are estimated at $15 per person per day."}
            </li>
            <li>
              {isVi
                ? "Giá vé tham quan các di tích, viện bảo tàng và điểm du lịch thường dao động từ 1 đến 5 USD."
                : "Admission fees for monuments, museums, and attractions typically range from $1 to $5."}
            </li>
          </ul>
        </section>

        {/* ─── OTHER ITINERARIES (SCREENSHOT 4 & 5) ─── */}
        <section className="omi-other-itin-section">
          <h2 className="omi-section-title">
            {isVi ? "Các lịch trình khác" : "Other itineraries"}
          </h2>
          <div className="omi-other-itin-grid">
            <Link
              href="/guide/10-days-in-vietnam"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/10-day-vietnam-itinerary-map.jpg"
                  alt="10-day Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 10 ngày tại Việt Nam" : "10-day Vietnam Itinerary"}
              </span>
            </Link>

            <Link
              href="/guide/3-week-vietnam-itinerary"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/3-week-vietnam-itinerary-map.jpg"
                  alt="3-week Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 3 tuần tại Việt Nam" : "3-week Vietnam Itinerary"}
              </span>
            </Link>

            <Link
              href="/guide/1-month-in-vietnam"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/1-month-in-vietnam-itinerary-map.jpg"
                  alt="1-month Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 1 tháng tại Việt Nam" : "1-month Vietnam Itinerary"}
              </span>
            </Link>
          </div>
        </section>

        {/* ─── HORIZONTAL DIVIDER ─── */}
        <hr className="omi-divider" />

        {/* ─── RELATED ARTICLES (SCREENSHOT 5) ─── */}
        <section className="omi-related-section">
          <h2 className="omi-related-title">
            {isVi ? "Bài viết liên quan" : "Related Articles"}
          </h2>
          <div className="omi-related-grid">
            <Link
              href="/guide/3-week-vietnam-itinerary"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/hcmc/3-week-vietnam-itinerary.jpg"
                  alt="3-week Vietnam Itinerary"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi ? "Lịch trình 3 tuần xuyên Việt" : "3-week Vietnam Itinerary"}
              </h3>
            </Link>

            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/hcmc/hcmc-10-things-bitexco.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi
                  ? "10 trải nghiệm tuyệt nhất ở TP. Hồ Chí Minh"
                  : "10 best things to do in Ho Chi Minh City"}
              </h3>
            </Link>

            <Link
              href="/guide/8-best-things-to-do-in-nha-trang"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/hcmc/Top-8-things-to-do-in-Nha-Trang-Vietnamnomad.jpg"
                  alt="8 best things to do in Nha Trang"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi
                  ? "8 trải nghiệm tuyệt nhất tại Nha Trang"
                  : "8 best things to do in Nha Trang"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── LIGHTBOX MODAL BẢN ĐỒ ─── */}
      {isMapModalOpen && (
        <div
          className="vnn-lightbox-overlay"
          onClick={() => setIsMapModalOpen(false)}
        >
          <div
            className="vnn-lightbox-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "880px" }}
          >
            <button
              type="button"
              className="vnn-lightbox-close"
              onClick={() => setIsMapModalOpen(false)}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            <img
              src="/guide/vietnam/2-week-vietnam-itinerary-full-map.jpg"
              alt="Bản đồ hành trình 2 tuần xuyên Việt 8 điểm đến"
              className="vnn-lightbox-img"
            />
            <p className="vnn-lightbox-caption">
              {isVi
                ? "Bản đồ hành trình 2 tuần khám phá 8 điểm đến nổi tiếng nhất Việt Nam"
                : "2-Week Vietnam Itinerary Map: 8 Signature Destinations from South to North"}
            </p>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="vnn-toast" role="status">
          <Check size={18} color="#00c2cb" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── PUBLIC FOOTER (CHUẨN HOMEPAGE) ─── */}
      <PublicFooter lang={lang} />

      {/* ─── AI TRAVEL COMPANION FLOATING CHATBOT ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        province={{
          name: isVi ? "Việt Nam" : "Vietnam",
          slug: "viet-nam",
        }}
      />
    </div>
  );
}
