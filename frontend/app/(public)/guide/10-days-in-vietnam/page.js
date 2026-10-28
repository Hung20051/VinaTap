"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import AffiliateDealBox from "@/components/ui/AffiliateDealBox";
import {
  VUNGTAU_VIETNAM_AFFILIATE_DEALS,
  HANOI_AFFILIATE_DEALS,
  DANANG_HOIAN_AFFILIATE_DEALS,
  NHATRANG_DALAT_AFFILIATE_DEALS,
  HCMC_MEKONG_AFFILIATE_DEALS,
  NORTH_HUE_AFFILIATE_DEALS,
} from "@/lib/affiliateDeals";
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


// ─── 6 DESTINATIONS DATA (10 DAYS IN VIETNAM) ───
const ITINERARY_6_DESTINATIONS = [
  {
    num: 1,
    name: "Ho Chi Minh City",
    nameVi: "TP. Hồ Chí Minh",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/10-day-dest-1-hcmc.jpg",
    thingsToDo:
      "War Remnants Museum, Ben Thanh Market, Saigon Skydeck, Cu Chi Tunnels, Bui Vien Street.",
    thingsToDoVi:
      "Bảo tàng Chứng tích Chiến tranh, Chợ Bến Thành, Saigon Skydeck, Địa đạo Củ Chi, Phố Bùi Viện.",
    nextRoute: "Ho Chi Minh City → Nha Trang",
    nextRouteVi: "TP. Hồ Chí Minh → Nha Trang",
    transport: "Train",
    transportVi: "Tàu hỏa",
    time: "8 hr 30 min",
    timeVi: "8 giờ 30 phút",
    fare: "300,000 VND",
    fareVi: "300.000 VNĐ",
  },
  {
    num: 2,
    name: "Nha Trang",
    nameVi: "Nha Trang",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/10-day-dest-2-nhatrang.jpg",
    thingsToDo:
      "Nha Trang Beach, Hon Tre Island, Po Nagar Cham Towers, Long Son Pagoda.",
    thingsToDoVi:
      "Bãi biển Nha Trang, Đảo Hòn Tre, Tháp Bà Po Nagar, Chùa Long Sơn.",
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
    num: 3,
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/10-day-dest-3-danang.jpg",
    thingsToDo:
      "Ba Na Hills, My Khe Beach, Marble Mountains, Museum of Cham Sculpture.",
    thingsToDoVi:
      "Bà Nà Hills, Bãi biển Mỹ Khê, Ngũ Hành Sơn, Bảo tàng Điêu khắc Chăm.",
    nextRoute: "Da Nang → Hoi An",
    nextRouteVi: "Đà Nẵng → Hội An",
    transport: "Bus (01)",
    transportVi: "Xe buýt (01)",
    time: "45 min",
    timeVi: "45 phút",
    fare: "30,000 VND",
    fareVi: "30.000 VNĐ",
  },
  {
    num: 4,
    name: "Hoi An",
    nameVi: "Hội An",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/10-day-dest-4-hoian.jpg",
    thingsToDo:
      "Hoi An Ancient Town, An Bang Beach, Bay Mau Coconut Forest.",
    thingsToDoVi:
      "Phố cổ Hội An, Biển An Bàng, Rừng dừa Bảy Mẫu.",
    isHoiAnCustomTransit: true,
    transitNote:
      "From Hoi An, you take bus 01 back to Da Nang to fly to Van Don Airport (Quang Ninh).",
    transitNoteVi:
      "Từ Hội An, bạn đi xe buýt số 01 quay lại Đà Nẵng để bay đến Sân bay Vân Đồn (Quảng Ninh).",
    flyingTime: "1 hr 20 min",
    flyingTimeVi: "1 giờ 20 phút",
    airfare: "800,000 – 1,200,000 VND",
    airfareVi: "800.000 – 1.200.000 VNĐ",
  },
  {
    num: 5,
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/10-day-dest-5-halong.jpg",
    hasPreNote: true,
    preNote:
      "You take bus 14A or 14B to get to Ha Long Bay from Van Don Airport (free).",
    preNoteVi:
      "Bạn đi xe buýt 14A hoặc 14B để đến Vịnh Hạ Long từ Sân bay Vân Đồn (miễn phí).",
    thingsToDo:
      "Ha Long Bay, Bai Chay Beach, Tuan Chau Island.",
    thingsToDoVi:
      "Vịnh Hạ Long, Bãi Cháy, Đảo Tuần Châu.",
    nextRoute: "Ha Long Bay → Hanoi",
    nextRouteVi: "Vịnh Hạ Long → Hà Nội",
    transport: "Bus (Trung Thanh Limousine)",
    transportVi: "Xe buýt (Trung Thành Limousine)",
    time: "1 hr 30 min",
    timeVi: "1 giờ 30 phút",
    fare: "260,000 VND",
    fareVi: "260.000 VNĐ",
  },
  {
    num: 6,
    name: "Hanoi",
    nameVi: "Hà Nội",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/10-day-dest-6-hanoi.jpg",
    thingsToDo:
      "Hanoi Old Quarter, Temple of Literature, Hoan Kiem Lake, Dong Xuan Market, Ho Chi Minh Mausoleum, Ta Hien Street.",
    thingsToDoVi:
      "Phố cổ Hà Nội, Văn Miếu – Quốc Tử Giám, Hồ Hoàn Kiếm, Chợ Đồng Xuân, Lăng Chủ tịch Hồ Chí Minh, Phố Tạ Hiện.",
    isHanoiEnd: true,
    endNote:
      "To reach Noi Bai International Airport from Hanoi city center and complete your 10-day itinerary in Vietnam, you can take bus number 86 for a fare of 35,000 VND.",
    endNoteVi:
      "Để đến Sân bay Quốc tế Nội Bài từ trung tâm thành phố Hà Nội và hoàn tất lịch trình 10 ngày tại Việt Nam, bạn có thể đi xe buýt số 86 với giá vé 35.000 VNĐ.",
  },
];

export default function TenDaysInVietnamPage() {
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

      {/* ─── HERO BANNER (SCREENSHOT 1) ─── */}
      <section className="omi-hero">
        <div className="omi-hero__media">
          <img
            src="/guide/vietnam/10-day-vietnam-hero.jpg"
            alt="10 Days in Vietnam - Coastal Train Hai Van Pass"
            className="omi-hero__img"
            priority="true"
          />
          <div className="omi-hero__overlay" />
        </div>

        <div className="omi-hero__content">
          <div className="omi-hero__badges">
            <span className="omi-hero__badge">ITINERARY</span>
            <span className="omi-hero__badge">THINGS TO DO</span>
          </div>

          <h1 className="omi-hero__title">
            {isVi ? "Lịch trình 10 ngày tại Việt Nam" : "10 Days in Vietnam"}
          </h1>

          <div className="omi-hero__byline" style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
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

          <button
            type="button"
            className="omi-hero__cta"
            onClick={() => setAiCompanionOpen(true)}
          >
            <Sparkles size={16} />
            <span>
              {isVi
                ? "Tạo chuyến đi Việt Nam của bạn trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </button>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="omi-container">
        {/* ─── SECTION 2: MAP & INTRO (SCREENSHOT 2 & 3) ─── */}
        <section className="omi-map-section">
          <h2 className="omi-section-title">
            {isVi
              ? "Bản đồ lịch trình 10 ngày tại Việt Nam"
              : "10-day Vietnam itinerary map"}
          </h2>

          <p className="omi-map-intro">
            {isVi
              ? "Chúng tôi rất vui mừng giới thiệu đến bạn lịch trình 10 ngày đưa bạn đến những điểm đến quyến rũ nhất trải dọc khắp ba miền Bắc, Trung, Nam của Việt Nam. Lịch trình này bao gồm tổng cộng sáu điểm đến chính: TP. Hồ Chí Minh → Nha Trang → Đà Nẵng → Hội An → Vịnh Hạ Long → Hà Nội. Lựa chọn hành trình này, bạn sẽ được trải nghiệm trọn vẹn sự đa dạng, giàu bản sắc về văn hóa, lịch sử cùng những cảnh quan thiên nhiên tráng lệ nhất của Việt Nam."
              : "We are excited to offer you a 10-day itinerary that takes you to some of the most alluring destinations across Vietnam's North, Central, and South regions. This itinerary covers a total of six destinations, as outlined below: Ho Chi Minh City → Nha Trang → Da Nang → Hoi An → Ha Long Bay → Hanoi. By following this itinerary, you will get to experience the diverse and captivating culture, history, and landscapes that Vietnam has to offer."}
          </p>

          {/* Interactive Zoom Map Box */}
          <div
            className="omi-map-card"
            onClick={() => setIsMapModalOpen(true)}
            title={isVi ? "Nhấp để xem bản đồ phóng to" : "Click to view full map"}
          >
            <img
              src="/guide/vietnam/10-day-vietnam-itinerary-full-map.jpg"
              alt={
                isVi
                  ? "Bản đồ lịch trình 10 ngày khám phá Việt Nam 6 điểm đến"
                  : "10-day Vietnam itinerary route map"
              }
              className="omi-map-img"
              loading="lazy"
            />
            <div className="omi-map-badge">
              <Maximize2 size={16} />
              <span>{isVi ? "Xem bản đồ phóng to" : "Click to zoom"}</span>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: TRIPION AI PROMPT & PDF DOWNLOAD (SCREENSHOT 3) ─── */}
        <div className="omi-customize-box">
          <h3 className="omi-customize-title">
            {isVi ? "Bạn muốn tùy chỉnh theo ý mình?" : "Want to make it your own?"}
          </h3>

          <p className="omi-customize-text">
            {isVi ? (
              <>
                Mở{" "}
                <a
                  href="https://tripion.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="omi-link"
                >
                  Tripion.ai
                </a>{" "}
                và nhập prompt như: &ldquo;
                <strong>Lên lịch trình 10 ngày du lịch Việt Nam</strong>&rdquo;.
                Tripion sẽ xây dựng lộ trình liên thành phố cá nhân hóa, tối ưu
                tuyến đường và phương tiện, đồng thời điều chỉnh hoàn hảo theo
                phong cách du lịch của bạn.
              </>
            ) : (
              <>
                Open{" "}
                <a
                  href="https://tripion.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="omi-link"
                >
                  Tripion.ai
                </a>{" "}
                and enter a prompt such as &ldquo;
                <strong>Create a 10-day Vietnam itinerary.</strong>&rdquo; Tripion
                will build a personalized multi-city journey, help you optimize
                routes and transportation, and tailor the trip to your travel
                style.
              </>
            )}
          </p>

          <p className="omi-customize-text">
            {isVi
              ? "Khi đã ưng ý với lịch trình, bạn chỉ cần tải bản đồ và kế hoạch chi tiết dưới dạng tệp PDF lưu về máy."
              : "When you're happy with your itinerary, simply download your personalized travel map and detailed itinerary as a PDF."}
          </p>

          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              className="omi-btn-primary"
              onClick={handleDownloadPDF}
            >
              <Download size={18} />
              <span>
                {isVi ? "Tùy chỉnh & Tải về bản PDF" : "Customize & Download PDF"}
              </span>
            </button>
          </div>

          {/* ─── SUMMARY BOX (SCREENSHOT 4) ─── */}
          <div className="omi-summary-card">
            <h4 className="omi-summary-heading">
              {isVi ? "Tóm tắt hành trình" : "Summary"}
            </h4>
            <div className="omi-summary-item">
              <strong>{isVi ? "Số điểm đến: " : "Destinations: "}</strong>
              6
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Thời gian di chuyển (giờ): " : "Travel time (hr): "}
              </strong>
              14+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Chi phí phương tiện (USD): " : "Transportation costs (USD): "}
              </strong>
              110+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng chi phí ước tính (USD): " : "Total cost (USD): "}
              </strong>
              450+
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: ITINERARY DETAILS (SCREENSHOT 4 & 5) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Chi tiết lịch trình" : "Itinerary details"}
        </h2>

        <div className="omi-cards-grid">
          {ITINERARY_6_DESTINATIONS.map((dest) => (
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

                {dest.hasPreNote && (
                  <p style={{ margin: "0 0 10px", fontSize: "13.5px", lineHeight: 1.6, color: "#334155" }}>
                    {isVi ? dest.preNoteVi : dest.preNote}
                  </p>
                )}

                <div className="omi-card__section">
                  <span className="omi-card__label">
                    Things to do:{" "}
                  </span>
                  <span>{isVi && dest.thingsToDoVi ? dest.thingsToDoVi : dest.thingsToDo}</span>
                </div>

                {dest.isHanoiEnd ? (
                  <p style={{ marginTop: "14px", fontSize: "13.5px", lineHeight: 1.6, color: "#334155" }}>
                    {isVi ? dest.endNoteVi : dest.endNote}
                  </p>
                ) : dest.isHoiAnCustomTransit ? (
                  <>
                    <p style={{ marginTop: "12px", marginBottom: "6px", fontSize: "13.5px", lineHeight: 1.6, color: "#334155" }}>
                      {isVi ? dest.transitNoteVi : dest.transitNote}
                    </p>
                    <ul className="omi-card__transit-list">
                      <li>
                        <strong>Flying time: </strong>
                        {isVi ? dest.flyingTimeVi : dest.flyingTime}
                      </li>
                      <li>
                        <strong>Airfare: </strong>
                        {isVi ? dest.airfareVi : dest.airfare}
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="omi-card__transit-title">
                      <strong>{isVi ? dest.nextRouteVi : dest.nextRoute}:</strong>
                    </div>

                    <ul className="omi-card__transit-list">
                      <li>
                        <strong>Transportation: </strong>
                        {isVi && dest.transportVi ? dest.transportVi : dest.transport}
                      </li>
                      <li>
                        <strong>
                          {dest.isFlight ? "Flying time: " : "Travel time: "}
                        </strong>
                        {isVi && dest.timeVi ? dest.timeVi : dest.time}
                      </li>
                      <li>
                        <strong>
                          {dest.isFlight ? "Airfare: " : "Fare: "}
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

        <AffiliateDealBox deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.vietnamDomesticTransport} isVi={isVi} />
        <AffiliateDealBox deal={NORTH_HUE_AFFILIATE_DEALS.halongLuxuryCruise} isVi={isVi} />
        <AffiliateDealBox deal={DANANG_HOIAN_AFFILIATE_DEALS.baNaHills} isVi={isVi} />
        <AffiliateDealBox deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.allVietnamHotels} isVi={isVi} />

        {/* ─── A FEW NOTES ─── */}
        <section className="omi-notes-box">
          <h2 className="omi-section-title">
            {isVi ? "Một số lưu ý quan trọng" : "A few notes"}
          </h2>
          <ul className="omi-notes-list">
            <li>
              {isVi
                ? "Tỷ giá hối đoái từ USD sang VNĐ năm 2024 xấp xỉ 1 USD đổi 25.000 VNĐ."
                : "The exchange rate for USD to VND in 2024 is approximately 1 USD to 25,000 VND."}
            </li>
            <li>
              {isVi
                ? "Xin lưu ý thời gian di chuyển được liệt kê cho mỗi chặng hành trình không bao gồm thời gian làm thủ tục tại sân bay. Chúng tôi khuyên bạn nên đặt vé máy bay trước để có mức giá tốt hơn."
                : "Please note that the travel time listed for each leg of the journey does not include airport check-in time. We recommend booking flights in advance to take advantage of lower prices."}
            </li>
            <li>
              {isVi ? (
                <>
                  Đối với việc đi tàu hỏa, chúng tôi khuyên bạn nên đặt vé qua website chính thức của Tổng công ty Đường sắt Việt Nam tại{" "}
                  <a
                    href="https://dsvn.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#00c2cb", textDecoration: "underline" }}
                  >
                    dsvn.vn
                  </a>
                  . Điều này sẽ đảm bảo bạn nhận được thông tin lịch trình cập nhật nhất và mức giá tốt nhất.
                </>
              ) : (
                <>
                  For train travel, we recommend booking tickets through the official website of the Vietnam Railway Corporation at{" "}
                  <a
                    href="https://dsvn.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#00c2cb", textDecoration: "underline" }}
                  >
                    dsvn.vn
                  </a>
                  . This will ensure that you get the most up-to-date schedule information and the best prices.
                </>
              )}
            </li>
            <li>
              {isVi
                ? "Các đề xuất về tour, khách sạn, nhà xe và hãng hàng không được cung cấp ở trên được lựa chọn dựa trên sự phù hợp với du khách, hoàn toàn không có quảng cáo hay tiếp thị liên kết. Bạn có thể yên tâm rằng những gợi ý này sẽ đáp ứng tốt nhu cầu của bạn."
                : "The recommendations for tours, hotels, bus operators, and airlines provided above are selected based on their suitability for travelers, with no advertising or affiliate marketing. You can rest assured that these suggestions will meet your needs."}
            </li>
            <li>
              {isVi
                ? "Mặc dù mười ngày có thể chưa đủ để khám phá trọn vẹn Việt Nam, chúng tôi đã chọn lọc những địa điểm nổi tiếng nhất đất nước để đảm bảo bạn có một trải nghiệm khó quên."
                : "Although ten days may not be enough to fully explore Vietnam, we have selected the country's most famous places to ensure that you have an unforgettable experience."}
            </li>
          </ul>
        </section>

        {/* ─── 10 DAYS IN VIETNAM COSTS ─── */}
        <section className="omi-costs-box">
          <h2 className="omi-section-title">
            {isVi ? "Chi phí du lịch Việt Nam 10 ngày" : "10 days in Vietnam costs"}
          </h2>
          <p className="omi-costs-intro" style={{ textAlign: "left", marginBottom: "16px" }}>
            {isVi
              ? "Với mức chi tiêu trung bình khoảng 450 USD, nhiều du khách có thể chi trả các chi phí cơ bản cho chuyến đi 10 ngày tại Việt Nam. Dưới đây là một số chi phí cố định ước tính:"
              : "For an average expenditure of $450, many tourists can cover basic expenses for a 10-day trip to Vietnam. Here are some estimated fixed costs:"}
          </p>

          <ul className="omi-notes-list" style={{ marginTop: "12px" }}>
            <li>
              {isVi
                ? "Chi phí di chuyển khoảng 110 USD, tùy thuộc vào loại hình phương tiện sử dụng."
                : "Transportation costs around $110, depending on the types of transportation used."}
            </li>
            <li>
              {isVi
                ? "Chi phí lưu trú tại khách sạn riêng hoặc homestay khoảng 15–20 USD mỗi người một đêm. Du khách đi một mình có thể chọn hostel để tiết kiệm hơn với giá khoảng 5 USD mỗi đêm."
                : "Accommodation in a private hotel or homestay costs about $15-$20 per person per night. Solo travelers may find hostels to be a more economical option at around $5 per night."}
            </li>
            <li>
              {isVi
                ? "Chi phí ăn uống ước tính khoảng 15 USD mỗi người một ngày, có thể thay đổi tùy thuộc vào địa điểm và món bạn ăn."
                : "Food expenses are estimated at around $15 per person per day, though this can vary depending on where and what you eat."}
            </li>
            <li>
              {isVi
                ? "Giá vé tham quan các di tích và điểm du lịch nhìn chung dao động từ 1 đến 5 USD mỗi vé, tùy thuộc vào từng địa điểm cụ thể."
                : "Entrance fees for monuments and tourist attractions are generally between $1 and $5 per ticket, though prices may vary depending on the specific site."}
            </li>
          </ul>
        </section>

        {/* ─── OTHER ITINERARIES ─── */}
        <section className="omi-other-itin-section">
          <h2 className="omi-section-title">
            {isVi ? "Các lịch trình khác" : "Other itineraries"}
          </h2>
          <div className="omi-other-itin-grid">
            <Link
              href="/guide/2-weeks-in-vietnam"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/2-week-vietnam-itinerary-map.jpg"
                  alt="2-week Vietnam itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "2-week Vietnam itinerary" : "2-week Vietnam itinerary"}
              </span>
            </Link>

            <Link
              href="/guide/3-week-vietnam-itinerary"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/3-week-vietnam-itinerary-map.jpg"
                  alt="3-week Vietnam itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "3-week Vietnam itinerary" : "3-week Vietnam itinerary"}
              </span>
            </Link>

            <Link
              href="/guide/1-month-in-vietnam"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/1-month-in-vietnam-itinerary-map.jpg"
                  alt="1-month Vietnam itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "1-month Vietnam itinerary" : "1-month Vietnam itinerary"}
              </span>
            </Link>
          </div>
        </section>

        {/* ─── HORIZONTAL DIVIDER ─── */}
        <hr className="omi-divider" />

        {/* ─── RELATED ARTICLES ─── */}
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
                  src="/guide/nha-trang/Top-8-things-to-do-in-Nha-Trang-Vietnamnomad.jpg"
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
              src="/guide/vietnam/10-day-vietnam-itinerary-full-map.jpg"
              alt="Bản đồ hành trình 10 ngày khám phá Việt Nam 6 điểm đến"
              className="vnn-lightbox-img"
            />
            <p className="vnn-lightbox-caption">
              {isVi
                ? "Bản đồ hành trình 10 ngày khám phá 6 điểm đến nổi tiếng nhất Việt Nam"
                : "10-Day Vietnam Itinerary Map: 6 Signature Destinations from South to North"}
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
