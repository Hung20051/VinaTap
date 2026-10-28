"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import NavbarAuthButton from "@/components/ui/NavbarAuthButton";
import HeaderSearch from "@/components/ui/HeaderSearch";
import AffiliateDealBox from "@/components/ui/AffiliateDealBox";
import {
  VUNGTAU_VIETNAM_AFFILIATE_DEALS,
  NORTH_HUE_AFFILIATE_DEALS,
  DANANG_HOIAN_AFFILIATE_DEALS,
  HCMC_MEKONG_AFFILIATE_DEALS,
} from "@/lib/affiliateDeals";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  CloudSun,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  Compass,
  MapPin,
  Calendar,
  HelpCircle,
  Sparkles,
  Info,
  CheckCircle2,
  Luggage,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/vietnam-climate.css";

// ─── MEGAMENUS DATA ───
const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-1.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
      {
        id: "insp-2",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "insp-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/guide/ao-dai-vietnamese-traditional-dress",
      },
    ],
  },
  destinations: {
    items: [
      {
        id: "dest-1",
        title: "Ho Chi Minh City",
        titleVi: "TP. Hồ Chí Minh",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Da Lat",
        titleVi: "Đà Lạt",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  things: {
    items: [
      {
        id: "things-1",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "things-2",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "things-3",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-4-20things.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "things-4",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan tuyệt nhất tại Đà Lạt",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-5-dalat.jpg",
        link: "/guide/the-15-best-attractions-in-dalat",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ngon nhất định phải thử tại Hà Nội",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ngon không thể bỏ lỡ tại TP. Hồ Chí Minh",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Soul of Vietnamese Cuisine",
        titleVi: "Phở – Linh hồn ẩm thực Việt Nam",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon độc đáo tại Vũng Tàu",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-Week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-1-3weeks.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam Itinerary",
        titleVi: "Lịch trình 10 ngày khám phá Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam Itinerary",
        titleVi: "Lịch trình 2 tuần khám phá trọn vẹn",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam Itinerary",
        titleVi: "Lịch trình 1 tháng trải nghiệm Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

// ─── 12-MONTH WEATHER GUIDE DATA ───
const MONTHLY_WEATHER = [
  {
    monthEn: "January",
    monthVi: "Tháng 1",
    northEn: "Cool & dry, 14°C–20°C. Sapa can be cold (<10°C).",
    northVi: "Se lạnh, khô ráo, 14°C–20°C. Sa Pa có thể rất lạnh (<10°C).",
    centralEn: "Mild, end of rainy season, 19°C–24°C.",
    centralVi: "Mát mẻ, cuối mùa mưa, 19°C–24°C.",
    southEn: "Warm & sunny dry season, 24°C–32°C.",
    southVi: "Nắng rực rỡ, mùa khô lý tưởng, 24°C–32°C.",
    bestForEn: "Phu Quoc, HCMC, Mekong Delta, Dalat",
    bestForVi: "Phú Quốc, TP.HCM, Miền Tây, Đà Lạt",
  },
  {
    monthEn: "February",
    monthVi: "Tháng 2",
    northEn: "Cool, occasional drizzle (Tet holiday), 15°C–21°C.",
    northVi: "Mát mẻ, đôi khi có mưa xuân nhẹ, 15°C–21°C.",
    centralEn: "Pleasant sunshine, low rainfall, 21°C–26°C.",
    centralVi: "Nắng ấm dễ chịu, ít mưa, 21°C–26°C.",
    southEn: "Dry & warm, clear blue skies, 25°C–33°C.",
    southVi: "Mùa khô rực rỡ, trời trong xanh, 25°C–33°C.",
    bestForEn: "Nationwide travel, Tet festival, Hoi An",
    bestForVi: "Du lịch xuyên Việt, Lễ hội Tết, Hội An",
  },
  {
    monthEn: "March",
    monthVi: "Tháng 3",
    northEn: "Pleasant spring warming, 18°C–24°C.",
    northVi: "Mùa xuân ấm dần lên, hoa nở rộ, 18°C–24°C.",
    centralEn: "Sunny & dry, warm sea, 23°C–28°C.",
    centralVi: "Nắng đẹp, biển êm, 23°C–28°C.",
    southEn: "Sunny & hot dry season, 26°C–34°C.",
    southVi: "Nắng vàng, nhiệt độ ấm áp, 26°C–34°C.",
    bestForEn: "Ha Long Bay, Ninh Binh, Da Nang, Hue",
    bestForVi: "Vịnh Hạ Long, Ninh Bình, Đà Nẵng, Huế",
  },
  {
    monthEn: "April",
    monthVi: "Tháng 4",
    northEn: "Warm, transition into summer, 22°C–29°C.",
    northVi: "Ấm áp, chuyển giao sang hè, 22°C–29°C.",
    centralEn: "Hot & dry, excellent beach weather, 25°C–31°C.",
    centralVi: "Nắng ấm, biển tuyệt đẹp, 25°C–31°C.",
    southEn: "Hottest month of the year, 28°C–35°C.",
    southVi: "Tháng nóng nhất trong năm, 28°C–35°C.",
    bestForEn: "Nha Trang, Quy Nhon, Da Nang, Hoi An",
    bestForVi: "Nha Trang, Quy Nhơn, Đà Nẵng, Hội An",
  },
  {
    monthEn: "May",
    monthVi: "Tháng 5",
    northEn: "Warm & humid, start of summer rains, 25°C–33°C.",
    northVi: "Đầu hè, bắt đầu có mưa rào, 25°C–33°C.",
    centralEn: "Hot & sunny, low rainfall, 27°C–34°C.",
    centralVi: "Nắng vàng rực rỡ, biển lặng, 27°C–34°C.",
    southEn: "Start of rainy season (short showers), 26°C–33°C.",
    southVi: "Bắt đầu mùa mưa (mưa rào nhanh tạnh), 26°C–33°C.",
    bestForEn: "Central Coast beaches, Phong Nha caves",
    bestForVi: "Bãi biển miền Trung, Hang động Phong Nha",
  },
  {
    monthEn: "June",
    monthVi: "Tháng 6",
    northEn: "Hot summer, peak rainfall, 28°C–36°C.",
    northVi: "Hè nắng nóng, có mưa rào lớn, 28°C–36°C.",
    centralEn: "Sunny & dry, great for beach holidays, 28°C–35°C.",
    centralVi: "Nắng khô ráo, thiên đường nghỉ mát biển, 28°C–35°C.",
    southEn: "Rainy season, afternoon showers, 26°C–32°C.",
    southVi: "Mùa mưa, thường mưa vào buổi chiều, 26°C–32°C.",
    bestForEn: "Da Nang, Hoi An, Nha Trang, Quy Nhon",
    bestForVi: "Đà Nẵng, Hội An, Nha Trang, Quy Nhơn",
  },
  {
    monthEn: "July",
    monthVi: "Tháng 7",
    northEn: "Hot, humid with tropical showers, 28°C–35°C.",
    northVi: "Nóng ẩm, thỉnh thoảng có mưa giông, 28°C–35°C.",
    centralEn: "Sunny & hot, dry, 29°C–35°C.",
    centralVi: "Nắng đẹp, khô ráo, nước biển trong, 29°C–35°C.",
    southEn: "Regular afternoon rains, lush green scenery, 25°C–32°C.",
    southVi: "Mưa chiều đều đặn, thiên nhiên tươi mát, 25°C–32°C.",
    bestForEn: "Central beaches, Dalat highlands escape",
    bestForVi: "Biển miền Trung, Cao nguyên Đà Lạt",
  },
  {
    monthEn: "August",
    monthVi: "Tháng 8",
    northEn: "Hot with rain showers, 27°C–34°C.",
    northVi: "Nhiệt độ cao, cuối hè mưa rào, 27°C–34°C.",
    centralEn: "Warm sunshine, late August showers, 27°C–34°C.",
    centralVi: "Nắng ấm, cuối tháng bắt đầu có mưa, 27°C–34°C.",
    southEn: "Rainy season, high water levels in Delta, 25°C–32°C.",
    southVi: "Mùa mưa, miền Tây đón mùa nước nổi, 25°C–32°C.",
    bestForEn: "Mu Cang Chai terraces, Nha Trang, Con Dao",
    bestForVi: "Ruộng bậc thang Mù Cang Chải, Nha Trang, Côn Đảo",
  },
  {
    monthEn: "September",
    monthVi: "Tháng 9",
    northEn: "Golden autumn, pleasant, cool breezes, 24°C–30°C.",
    northVi: "Mùa thu vàng Hà Nội, mát mẻ, lãng mạn, 24°C–30°C.",
    centralEn: "Beginning of stormy/rainy season, 25°C–31°C.",
    centralVi: "Bắt đầu mùa mưa bão miền Trung, 25°C–31°C.",
    southEn: "Rainy season, floating market season, 25°C–31°C.",
    southVi: "Mùa nước nổi miền Tây, chợ nổi nhộn nhịp, 25°C–31°C.",
    bestForEn: "Hanoi (Autumn), Sapa golden rice terraces",
    bestForVi: "Hà Nội mùa thu, Sa Pa mùa lúa chín",
  },
  {
    monthEn: "October",
    monthVi: "Tháng 10",
    northEn: "Mild autumn, crisp air, low humidity, 21°C–27°C.",
    northVi: "Thu se lạnh, trời trong xanh, ít mưa, 21°C–27°C.",
    centralEn: "Peak rainy & stormy season, 23°C–28°C.",
    centralVi: "Cao điểm mưa bão miền Trung, 23°C–28°C.",
    southEn: "Rain begins tapering off, 24°C–31°C.",
    southVi: "Mưa giảm dần, chuẩn bị sang mùa khô, 24°C–31°C.",
    bestForEn: "Ha Giang loop, Hanoi, Ha Long, Ninh Binh",
    bestForVi: "Hà Giang mùa hoa tam giác mạch, Hà Nội, Hạ Long",
  },
  {
    monthEn: "November",
    monthVi: "Tháng 11",
    northEn: "Cool & dry winter onset, 18°C–24°C.",
    northVi: "Đầu đông se lạnh, khô ráo, 18°C–24°C.",
    centralEn: "Rains decreasing, 22°C–26°C.",
    centralVi: "Mưa giảm dần về cuối tháng, 22°C–26°C.",
    southEn: "Start of glorious dry season, 24°C–31°C.",
    southVi: "Khởi đầu mùa khô đẹp nhất năm, 24°C–31°C.",
    bestForEn: "Phu Quoc island, Ha Giang, Mekong Delta",
    bestForVi: "Đảo ngọc Phú Quốc, Hà Giang, Đồng bằng sông Cửu Long",
  },
  {
    monthEn: "December",
    monthVi: "Tháng 12",
    northEn: "Cold & dry winter, 13°C–19°C. Sapa chilly (<8°C).",
    northVi: "Mùa đông lạnh và khô, 13°C–19°C. Sa Pa rét buốt (<8°C).",
    centralEn: "Cool, occasional clouds, 20°C–24°C.",
    centralVi: "Trời mát mẻ, khô ráo dần, 20°C–24°C.",
    southEn: "Pleasant sunshine, cool breezy evenings, 23°C–31°C.",
    southVi: "Nắng ấm, ban đêm mát mẻ dễ chịu, 23°C–31°C.",
    bestForEn: "Phu Quoc, Ho Chi Minh City, Vung Tau, Dalat",
    bestForVi: "Phú Quốc, TP. Hồ Chí Minh, Vũng Tàu, Đà Lạt",
  },
];

// ─── CLIMATE FAQ DATA ───
const CLIMATE_FAQS = [
  {
    qEn: "When is the overall best time to visit Vietnam?",
    qVi: "Thời điểm nào trong năm là lý tưởng nhất để du lịch Việt Nam?",
    aEn: "Because Vietnam stretches over 1,650 km, weather varies by region. Generally, spring (February to April) and autumn (September to November) offer the most pleasant weather across the country, with moderate temperatures and lower rainfall.",
    aVi: "Do lãnh thổ Việt Nam trải dài hơn 1.650 km nên mỗi miền có một mùa đẹp riêng. Nhìn chung, mùa xuân (tháng 2 đến tháng 4) và mùa thu (tháng 9 đến tháng 11) là thời điểm đẹp nhất để du lịch xuyên Việt với thời tiết ôn hòa, dễ chịu và ít mưa bão.",
  },
  {
    qEn: "When does the typhoon and rainy season hit Central Vietnam?",
    qVi: "Mùa mưa bão ở miền Trung thường diễn ra vào tháng mấy?",
    aEn: "Unlike the North and South, Central Vietnam experiences its rainy and storm season from September to December, peaking in October and November. During this time, cities like Hue, Da Nang, and Hoi An can experience localized flooding and heavy rainfall. Plan beach trips to Central Vietnam between February and August instead.",
    aVi: "Khác biệt với miền Bắc và miền Nam, mùa mưa bão của miền Trung thường rơi vào các tháng cuối năm từ tháng 9 đến tháng 12, với cao điểm là tháng 10 và tháng 11. Các địa danh như Huế, Đà Nẵng, Hội An có thể gặp mưa dầm hoặc ngập úng cục bộ. Du khách muốn đi biển miền Trung nên chọn thời gian từ tháng 2 đến tháng 8.",
  },
  {
    qEn: "Does it snow in Vietnam?",
    qVi: "Việt Nam có tuyết rơi không?",
    aEn: "Yes! In deep winter (typically late December to late January), high mountainous areas in the North such as Mount Fansipan, Sapa (Lao Cai), Mau Son (Lang Son), and Y Ty occasionally receive frost and genuine snow when severe cold fronts arrive from Siberia.",
    aVi: "Có! Vào đợt rét đậm giữa mùa đông (thường vào cuối tháng 12 đến cuối tháng 1), các đỉnh núi cao ở miền Bắc như đỉnh Fansipan, Sa Pa (Lào Cai), Mẫu Sơn (Lạng Sơn) hay Y Tý thường xuyên xuất hiện băng giá và có tuyết rơi trắng xóa khi có các đợt không khí lạnh cực mạnh tràn về.",
  },
  {
    qEn: "What is the rainy season in Southern Vietnam like? Does it rain all day?",
    qVi: "Mùa mưa ở miền Nam như thế nào? Mưa có kéo dài cả ngày không?",
    aEn: "The southern rainy season (May to November) features quick, heavy afternoon tropical downpours that usually last 30 minutes to an hour, after which the skies clear up bright and sunny. It rarely rains continuously all day, so it will not spoil your sightseeing itinerary.",
    aVi: "Mùa mưa ở miền Nam (từ tháng 5 đến tháng 11) thường là những cơn mưa rào nhiệt đới bất chợt vào buổi chiều, chỉ kéo dài từ 30 phút đến 1 tiếng rồi trời lại hửng nắng trong veo. Mưa hiếm khi kéo dài dầm dề cả ngày nên bạn hoàn toàn có thể yên tâm vui chơi và tham quan.",
  },
  {
    qEn: "What should I pack for a trip across Vietnam?",
    qVi: "Tôi nên chuẩn bị trang phục gì khi đi du lịch xuyên Việt?",
    aEn: "Pack light, breathable cotton or linen clothing for the hot south and sunny beaches, along with sun protection (hat, sunglasses, sunscreen). If you are visiting Northern Vietnam or Dalat between November and March, bring a warm jacket, fleece, or layered clothing as winter temperatures can feel remarkably chilly.",
    aVi: "Hãy mang quần áo mỏng nhẹ, thoáng khí chất liệu cotton hoặc linen cùng phụ kiện chống nắng (mũ nón, kính râm, kem chống nắng) cho miền Nam và các bãi biển. Nếu lịch trình có ghé miền Bắc hoặc Đà Lạt vào mùa đông (tháng 11 đến tháng 3), hãy chuẩn bị thêm áo khoác ấm, khăn quàng cổ vì thời tiết sẽ khá rét.",
  },
];

// ─── RELATED ARTICLES ───
const RELATED_ARTICLES = [
  {
    id: "vietnam-visa",
    title: "Vietnam Visa | All Information You Need",
    titleVi: "Thông Tin Visa Việt Nam | Cẩm Nang Toàn Diện",
    img: "/guide/visa/vietnam-visa-hero.jpg",
    link: "/guide/vietnam-visa",
    isMap: false,
  },
  {
    id: "vietnamese-currency",
    title: "Vietnamese Currency | Exchange Rates & Notes",
    titleVi: "Tiền Tệ Việt Nam | Mệnh Giá & Đổi Ngoại Tệ",
    img: "/guide/currency/vietnam-currency-hero.jpg",
    link: "/guide/vietnamese-currency",
    isMap: false,
  },
  {
    id: "the-complete-guide",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm Nang Du Lịch Toàn Diện Việt Nam",
    img: "/guide/megamenu/inspired-3.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
    isMap: false,
  },
  {
    id: "15-best-places",
    title: "15 Best Places to Visit in Vietnam in 2026",
    titleVi: "15 Địa Điểm Tuyệt Nhất Việt Nam Năm 2026",
    img: "/guide/megamenu/inspired-1.jpg",
    link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
    isMap: false,
  },
];

export default function VietnamClimatePage() {
  const [lang, setLangState] = useState("vi");
  const isVi = lang === "vi";

  // Đồng bộ ngôn ngữ với hệ thống VinaTap
  useEffect(() => {
    setLangState(getLang());
    const handleLang = (e) => setLangState(e?.detail || getLang());
    window.addEventListener("vinatap:lang-updated", handleLang);
    window.addEventListener("storage", handleLang);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLang);
      window.removeEventListener("storage", handleLang);
    };
  }, []);

  // State FAQ
  const [openFaq, setOpenFaq] = useState(0);

  // Megamenu state
  const [activeMenu, setActiveMenu] = useState(null);
  const menuTimeoutRef = useRef(null);

  const handleMouseEnter = (menuKey) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 250);
  };

  return (
    <div className="climate-page-wrap">
      {/* ─── STICKY PROMO TOP BANNER ─── */}
      <div className="climate-promo-banner">
        <div className="climate-promo-banner__content">
          <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/guide/hcmc/Vietnamnomad-header-banner-mobile-2026.jpg"
              />
              <img
                src="/guide/top-banner-companion.png"
                alt="Free AI Travel Assistant - AI Companion"
                className="climate-promo-banner__img"
              />
            </picture>
          </Link>
        </div>
      </div>

      {/* ─── EDITORIAL NAVBAR ─── */}
      <header className="vnn-navbar">
        <div className="vnn-navbar__inner">
          <div className="vnn-navbar__brand">
            <Logo size={32} showText={true} />
          </div>

          <ul className="vnn-navbar__menu">
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "inspired" ? "is-active" : ""
                }`}
              >
                <span>{isVi ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "destinations" ? "is-active" : ""
                }`}
              >
                <span>{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("things")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "things" ? "is-active" : ""
                }`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "eat" ? "is-active" : ""
                }`}
              >
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "itineraries" ? "is-active" : ""
                }`}
              >
                <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <HeaderSearch />
            <div className="vnn-navbar__divider" />
            <LanguageSwitch />
            <NavbarAuthButton />
          </div>
        </div>

        {/* ─── MEGAMENU DROPDOWN ─── */}
        {activeMenu && MEGA_MENUS_DATA[activeMenu] && (
          <div
            className="vnn-megamenu"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="vnn-megamenu__container">
              <div className="vnn-megamenu__grid">
                {MEGA_MENUS_DATA[activeMenu].items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="vnn-megamenu__card group"
                    onClick={() => setActiveMenu(null)}
                  >
                    <div className="vnn-megamenu__thumb">
                      <img src={item.img} alt={item.title} loading="lazy" />
                      {item.badge && (
                        <span className="vnn-megamenu__badge">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="vnn-megamenu__info">
                      <span className="vnn-megamenu__date">
                        {isVi ? item.dateVi : item.date}
                      </span>
                      <h4 className="vnn-megamenu__title">
                        {isVi ? item.titleVi : item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION ─── */}
      <section
        className="climate-hero"
        style={{
          backgroundImage: "url('/guide/climate/climate-of-vietnam.jpg')",
        }}
      >
        <div className="climate-hero__overlay" />
        <div className="climate-hero__content">
          <div className="climate-badge-wrap">
            <span className="climate-badge">WIKI • TRAVEL GUIDE</span>
            <span className="climate-badge climate-badge--accent">
              {isVi ? "KHÍ HẬU & THỜI TIẾT" : "CLIMATE & WEATHER"}
            </span>
          </div>
          <h1 className="climate-hero__title">
            {isVi
              ? "Khí Hậu & Thời Tiết Việt Nam: Tổng Quan Theo Từng Vùng Miền"
              : "Vietnam's Climate: An Overview of the Climate in Each Region"}
          </h1>
          <div className="climate-hero__meta" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <Logo
              size={20}
              showText={true}
              noLink
              href={null}
              as="span"
              className="vnn-hero-author-logo"
            />
            <span>•</span>
            <span>{isVi ? "14 Tháng 10, 2026" : "October 14, 2026"}</span>
          </div>
        </div>
      </section>

      {/* ─── FLOATING ACTION BUTTON ─── */}
      <div className="climate-cta-wrap">
        <Link
          href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
          className="climate-cta-btn"
        >
          <Sparkles size={16} className="mr-2" />
          {isVi
            ? "Lên kế hoạch du lịch theo thời tiết với AI"
            : "Plan your weather-smart Vietnam trip with AI"}
        </Link>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="climate-body">
        {/* INTRO PARAGRAPH */}
        <div className="climate-intro-card">
          <p className="climate-intro-text">
            {isVi ? (
              <>
                Việt Nam có tổng diện tích tự nhiên hơn <strong>331.000 km²</strong>,
                trải dài theo chiều dọc từ Bắc vào Nam trên <strong>1.650 km</strong>{" "}
                với đường bờ biển uốn lượn hình chữ S dài hơn <strong>3.260 km</strong>.
                Về mặt địa lý và hành chính, Việt Nam được chia thành 3 miền chính:{" "}
                <strong>Miền Bắc, Miền Trung và Miền Nam</strong>, bao gồm 63 tỉnh
                thành phố. Do sự trải dài trên nhiều vĩ độ và địa hình đồi núi chiếm 3/4
                diện tích, khí hậu Việt Nam có sự phân hóa sâu sắc và đa dạng giữa
                các vùng miền. Dưới đây là bức tranh tổng quan chi tiết về địa hình
                và khí hậu của từng khu vực.
              </>
            ) : (
              <>
                Vietnam covers an area of over <strong>331,000 square kilometers</strong>,
                stretching longitudinally from north to south over <strong>1,650 kilometers</strong>{" "}
                with a coastline of more than <strong>3,260 kilometers</strong>.
                Administratively, Vietnam is divided into three distinct regions:{" "}
                <strong>North, Central, and South</strong>, comprising 63 provinces
                and cities. Because of its elongated S-shape spanning multiple
                latitudes and diverse topography ranging from alpine peaks to tropical
                deltas, the country experiences remarkably varied microclimates.
                Here is a comprehensive overview of the geography and climate of
                each region.
              </>
            )}
          </p>

          {/* QUICK FACTS GRID */}
          <div className="climate-facts-grid">
            <div className="climate-fact-box">
              <span className="climate-fact-label">
                {isVi ? "DIỆN TÍCH" : "TOTAL AREA"}
              </span>
              <span className="climate-fact-val">331,000+ km²</span>
            </div>
            <div className="climate-fact-box">
              <span className="climate-fact-label">
                {isVi ? "ĐƯỜNG BỜ BIỂN" : "COASTLINE"}
              </span>
              <span className="climate-fact-val">3,260+ km</span>
            </div>
            <div className="climate-fact-box">
              <span className="climate-fact-label">
                {isVi ? "SỐ MIỀN KHÍ HẬU" : "CLIMATE ZONES"}
              </span>
              <span className="climate-fact-val text-teal-700 font-bold">
                {isVi ? "3 Miền Rõ Rệt" : "3 Distinct Zones"}
              </span>
            </div>
            <div className="climate-fact-box">
              <span className="climate-fact-label">
                {isVi ? "NHIỆT ĐỘ TB NĂM" : "AVG TEMPERATURE"}
              </span>
              <span className="climate-fact-val text-amber-700">22°C - 27°C</span>
            </div>
          </div>
        </div>

        {/* ─── SECTION: RAINY SEASONS MAP (ORIGINAL ARTICLE IMAGE) ─── */}
        <section className="climate-map-section" id="rainy-seasons-map">
          <div className="climate-section-header">
            <h2 className="climate-section-title">
              {isVi
                ? "BẢN ĐỒ MÙA MƯA TẠI VIỆT NAM"
                : "MAP OF RAINY SEASONS IN VIETNAM"}
            </h2>
            <p className="climate-section-desc">
              {isVi
                ? "Bản đồ minh họa sự khác biệt rõ rệt về thời gian diễn ra mùa mưa giữa 3 miền Bắc, Trung, Nam của Việt Nam."
                : "Illustrated map highlighting the distinct timing of rainy and dry seasons across the North, Central, and South regions of Vietnam."}
            </p>
          </div>

          <div className="climate-map-container">
            <img
              src="/guide/climate/map-rainy-seasons-vietnam.jpg"
              alt={
                isVi
                  ? "Bản đồ mùa mưa tại Việt Nam"
                  : "Map of rainy seasons in Vietnam"
              }
              className="climate-map-img"
              loading="lazy"
            />
          </div>
          <div className="climate-map-caption">
            {isVi
              ? "Bản đồ phân bổ mùa mưa tại các vùng miền Việt Nam (Nguồn: VinaTap Wiki Guide)"
              : "Map of rainy seasons across regions in Vietnam (Source: VinaTap Wiki Guide)"}
          </div>

          {/* 3 HIGHLIGHT CARDS FOR RAINY SEASONS */}
          <div className="climate-seasons-grid">
            <div className="climate-season-card climate-season-card--north">
              <span className="climate-season-tag">
                {isVi ? "VÙNG MIỀN BẮC" : "NORTH REGION"}
              </span>
              <h3 className="climate-season-name">
                {isVi ? "Mùa Mưa Miền Bắc" : "Northern Rainy Season"}
              </h3>
              <div className="climate-season-rain-time">
                <CloudRain size={16} className="inline mr-1" />
                {isVi ? "Tháng 5 – Tháng 10" : "May – October"}
              </div>
              <p className="climate-season-desc">
                {isVi
                  ? "Mưa tập trung vào mùa hè nóng ẩm, cao điểm vào tháng 7 và tháng 8. Mùa đông hanh khô và có mưa phùn vào đầu xuân."
                  : "Rains occur during the hot summer months, peaking in July and August. Winters are cold, dry, and punctuated by light spring drizzle."}
              </p>
            </div>

            <div className="climate-season-card climate-season-card--central">
              <span className="climate-season-tag">
                {isVi ? "VÙNG MIỀN TRUNG" : "CENTRAL REGION"}
              </span>
              <h3 className="climate-season-name">
                {isVi ? "Mùa Mưa Miền Trung" : "Central Rainy Season"}
              </h3>
              <div className="climate-season-rain-time">
                <Wind size={16} className="inline mr-1" />
                {isVi ? "Tháng 9 – Tháng 12" : "September – December"}
              </div>
              <p className="climate-season-desc">
                {isVi
                  ? "Độc đáo và lệch pha với cả nước: Mùa hè khô nóng ít mưa do gió Lào, mưa bão dồn dập vào cuối năm (tháng 10 - 11)."
                  : "Unique timing: Summers are hot and dry due to the Foehn wind, while heavy monsoon rains and typhoons peak late in the year (Oct–Nov)."}
              </p>
            </div>

            <div className="climate-season-card climate-season-card--south">
              <span className="climate-season-tag">
                {isVi ? "VÙNG MIỀN NAM" : "SOUTH REGION"}
              </span>
              <h3 className="climate-season-name">
                {isVi ? "Mùa Mưa Miền Nam" : "Southern Rainy Season"}
              </h3>
              <div className="climate-season-rain-time">
                <CloudSun size={16} className="inline mr-1" />
                {isVi ? "Tháng 5 – Tháng 11" : "May – November"}
              </div>
              <p className="climate-season-desc">
                {isVi
                  ? "Gió mùa Tây Nam mang đến những cơn mưa rào nhanh vào buổi chiều. Trời tạnh ráo ngay sau đó, nắng ấm quanh năm."
                  : "Southwest monsoon brings intense but brief afternoon showers. The sky quickly clears, with pleasant warm sunshine year-round."}
              </p>
            </div>
          </div>
        </section>

        {/* ─── SECTION: 3 REGIONAL CLIMATE BREAKDOWN (CORE TEXT) ─── */}
        <section className="climate-regions-section" id="regions-breakdown">
          <div className="climate-section-header">
            <h2 className="climate-section-title">
              {isVi
                ? "TỔNG QUAN KHÍ HẬU & ĐỊA HÌNH 3 MIỀN BẮC - TRUNG - NAM"
                : "CLIMATE & TERRAIN IN THE NORTH, CENTRAL, AND SOUTH"}
            </h2>
            <p className="climate-section-desc">
              {isVi
                ? "Khám phá chi tiết cấu trúc địa lý, số lượng tỉnh thành và đặc tính thời tiết tiêu biểu của từng khu vực."
                : "Explore the geographic structure, province breakdown, and signature weather patterns of each main region."}
            </p>
          </div>

          <div className="climate-regions-list">
            {/* REGION 1: NORTHERN VIETNAM */}
            <article className="climate-region-card" id="northern-vietnam">
              <div className="climate-region-header">
                <div className="climate-region-title-wrap">
                  <div className="climate-region-icon climate-region-icon--north">
                    <Snowflake size={24} />
                  </div>
                  <div>
                    <h3 className="climate-region-title">
                      {isVi ? "Miền Bắc Việt Nam" : "Northern Vietnam"}
                    </h3>
                    <span className="climate-region-subtitle">
                      {isVi
                        ? "Tây Bắc • Đông Bắc • Đồng bằng Sông Hồng"
                        : "Northwest • Northeast • Red River Delta"}
                    </span>
                  </div>
                </div>
                <span className="climate-region-badge">
                  {isVi ? "25 Tỉnh Thành" : "25 Provinces"}
                </span>
              </div>

              <div className="climate-region-content">
                {isVi ? (
                  <>
                    <p>
                      <strong>Miền Bắc Việt Nam</strong> bao gồm ba tiểu vùng
                      địa lý: Tây Bắc Bộ, Đông Bắc Bộ và Đồng bằng Sông Hồng với
                      tổng cộng 25 tỉnh và thành phố. Địa hình miền Bắc vô cùng đa
                      dạng và phong phú, bao gồm vùng núi cao hiểm trở, trung du đồi
                      lượn sóng, vùng đồng bằng châu thổ màu mỡ, bờ biển và thềm lục
                      địa. Trong đó, vùng Tây Bắc và Đông Bắc chủ yếu là địa hình núi
                      cao (với đỉnh Fansipan cao 3.143m – nóc nhà Đông Dương), trong
                      khi vùng đồng bằng châu thổ rộng lớn nằm trọn trong lưu vực phù
                      sa sông Hồng.
                    </p>
                    <p>
                      Về mặt thời tiết, miền Bắc mang đặc trưng của{" "}
                      <strong>khí hậu cận nhiệt đới ẩm</strong> với 4 mùa rõ rệt
                      (Xuân, Hạ, Thu, Đông). Mùa hè nóng ẩm và mưa nhiều kéo dài từ
                      tháng 4 đến tháng 10. Mùa đông lạnh, khô hanh từ tháng 11 đến
                      tháng 3 năm sau, thường có sương muối ở vùng núi cao và mưa
                      phùn rét buốt vào dịp đầu xuân.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Northern Vietnam</strong> consists of three distinct
                      geographic sub-regions: the Northwest, Northeast, and the Red
                      River Delta, comprising 25 provinces and municipalities. The
                      terrain is remarkably diverse, encompassing rugged mountain
                      ranges, rolling foothills, fertile alluvial plains, a long
                      coastline, and a rich continental shelf. The Northwest and
                      Northeast regions are dominated by spectacular mountains
                      (including Mount Fansipan at 3,143m, the highest peak in
                      Indochina), while the expansive fertile plains lie in the Red
                      River basin.
                    </p>
                    <p>
                      The North experiences a <strong>humid subtropical climate</strong>{" "}
                      with four distinct seasons: hot, humid summers with regular
                      rainfall from April to October, and cool, dry winters from
                      November to March, punctuated by frosty temperatures in the
                      highlands and occasional light drizzle during spring.
                    </p>
                  </>
                )}
              </div>

              <div className="climate-region-meta-grid">
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Kiểu khí hậu" : "Climate Classification"}
                  </span>
                  <span className="climate-region-meta-val">
                    {isVi ? "Cận nhiệt đới ẩm (4 mùa)" : "Humid Subtropical (4 Seasons)"}
                  </span>
                </div>
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Nhiệt độ trung bình" : "Average Temperature"}
                  </span>
                  <span className="climate-region-meta-val">
                    {isVi ? "15°C (Đông) – 34°C (Hè)" : "15°C (Winter) – 34°C (Summer)"}
                  </span>
                </div>
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Thời điểm đẹp nhất" : "Best Time to Visit"}
                  </span>
                  <span className="climate-region-meta-val text-teal-700">
                    {isVi ? "Tháng 9 - 11 & Tháng 3 - 4" : "September - November & March - April"}
                  </span>
                </div>
              </div>
              <AffiliateDealBox deal={NORTH_HUE_AFFILIATE_DEALS.halongLuxuryCruise} isVi={isVi} />
              <AffiliateDealBox deal={NORTH_HUE_AFFILIATE_DEALS.sapaMountainResorts} isVi={isVi} />
            </article>

            {/* REGION 2: CENTRAL VIETNAM */}
            <article className="climate-region-card" id="central-vietnam">
              <div className="climate-region-header">
                <div className="climate-region-title-wrap">
                  <div className="climate-region-icon climate-region-icon--central">
                    <Sun size={24} />
                  </div>
                  <div>
                    <h3 className="climate-region-title">
                      {isVi ? "Miền Trung Việt Nam" : "Central Vietnam"}
                    </h3>
                    <span className="climate-region-subtitle">
                      {isVi
                        ? "Bắc Trung Bộ • Duyên Hải Nam Trung Bộ • Tây Nguyên"
                        : "North Central • South Central Coast • Central Highlands"}
                    </span>
                  </div>
                </div>
                <span className="climate-region-badge">
                  {isVi ? "19 Tỉnh Thành" : "19 Provinces"}
                </span>
              </div>

              <div className="climate-region-content">
                {isVi ? (
                  <>
                    <p>
                      <strong>Miền Trung Việt Nam</strong> được chia thành ba tiểu
                      vùng: Bắc Trung Bộ, Duyên hải Nam Trung Bộ và Tây Nguyên với
                      tổng cộng 19 tỉnh thành. Địa hình miền Trung mang tính chất
                      chuyển tiếp mạnh mẽ: dãy núi Trường Sơn hùng vĩ ở phía Tây giáp
                      Lào, các đồng bằng dải hẹp bị chia cắt bởi các nhánh núi đâm ra
                      biển ở phía Đông, và vùng cao nguyên đất đỏ bazan rộng lớn ở Tây
                      Nguyên.
                    </p>
                    <p>
                      Khí hậu có sự khác biệt rõ rệt giữa Bắc Trung Bộ và Duyên hải
                      Nam Trung Bộ (vùng Nam Trung Bộ như Nha Trang, Phan Thiết khô
                      nhiều nắng hơn).{" "}
                      <strong>Đặc điểm độc đáo nhất của khí hậu miền Trung</strong> là
                      mùa mưa và mùa khô <em>không trùng với hai miền Bắc và Nam</em>.
                      Vào mùa hè, miền Trung ít mưa, nắng nóng gay gắt do hiệu ứng gió
                      phơn tây nam (Gió Lào khô nóng). Ngược lại, vào mùa đông (đặc
                      biệt từ tháng 9 đến tháng 12), miền Trung đón các đợt mưa bão lớn
                      dồn dập do gió mùa Đông Bắc kết hợp với địa hình chắn gió của dãy
                      Trường Sơn. Riêng vùng Tây Nguyên có khí hậu hai mùa tương đồng
                      với miền Nam.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Central Vietnam</strong> is divided into three distinct
                      sub-regions: the North Central Coast, South Central Coast, and
                      the Central Highlands, comprising 19 provinces. The terrain is
                      narrow and rugged, featuring the Truong Son (Annamite) mountain
                      spine bordering Laos to the west, narrow coastal plains divided
                      by mountain spurs to the east, and lush basalt plateaus across
                      the Central Highlands.
                    </p>
                    <p>
                      The climate differs markedly between the North Central and South
                      Central coasts, with the southern section (Nha Trang, Mui Ne)
                      receiving significantly more annual sunshine.{" "}
                      <strong>A distinctive feature of Central Vietnam's climate</strong>{" "}
                      is that its rainy and dry seasons do not coincide with those of
                      the North or South. Generally, Central Vietnam experiences less
                      rain during summer due to hot, dry southwesterly Foehn winds
                      descending the mountains, while heavy monsoonal rainfall and
                      typhoons arrive late in the year (September to December). The
                      Central Highlands share an altitude-tempered tropical climate
                      closely mirroring Southern Vietnam.
                    </p>
                  </>
                )}
              </div>

              <div className="climate-region-meta-grid">
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Kiểu khí hậu" : "Climate Classification"}
                  </span>
                  <span className="climate-region-meta-val">
                    {isVi ? "Nhiệt đới gió mùa ven biển" : "Tropical Coastal Monsoon"}
                  </span>
                </div>
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Mùa mưa đặc thù" : "Distinct Rainy Period"}
                  </span>
                  <span className="climate-region-meta-val text-amber-700">
                    {isVi ? "Tháng 9 – Tháng 12 (Lệch pha)" : "September – December (Shifted)"}
                  </span>
                </div>
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Thời điểm đẹp nhất" : "Best Time to Visit"}
                  </span>
                  <span className="climate-region-meta-val text-teal-700">
                    {isVi ? "Tháng 2 – Tháng 8 (Nắng đẹp)" : "February – August (Beach season)"}
                  </span>
                </div>
              </div>
              <AffiliateDealBox deal={DANANG_HOIAN_AFFILIATE_DEALS.daNangBeachResorts} isVi={isVi} />
              <AffiliateDealBox deal={DANANG_HOIAN_AFFILIATE_DEALS.baNaHills} isVi={isVi} />
            </article>

            {/* REGION 3: SOUTHERN VIETNAM */}
            <article className="climate-region-card" id="southern-vietnam">
              <div className="climate-region-header">
                <div className="climate-region-title-wrap">
                  <div className="climate-region-icon climate-region-icon--south">
                    <CloudSun size={24} />
                  </div>
                  <div>
                    <h3 className="climate-region-title">
                      {isVi ? "Miền Nam Việt Nam" : "Southern Vietnam"}
                    </h3>
                    <span className="climate-region-subtitle">
                      {isVi
                        ? "Đông Nam Bộ • Đồng bằng Sông Cửu Long"
                        : "Southeast • Mekong River Delta"}
                    </span>
                  </div>
                </div>
                <span className="climate-region-badge">
                  {isVi ? "19 Tỉnh Thành" : "19 Provinces"}
                </span>
              </div>

              <div className="climate-region-content">
                {isVi ? (
                  <>
                    <p>
                      <strong>Miền Nam Việt Nam</strong> bao gồm hai tiểu vùng:
                      Đông Nam Bộ (trung tâm kinh tế lớn gồm TP. Hồ Chí Minh, Bình
                      Dương, Đồng Nai, Bà Rịa - Vũng Tàu) và Đồng bằng Sông Cửu Long
                      (vựa lúa miền Tây với 13 tỉnh thành), tổng cộng 19 tỉnh thành.
                      Địa hình miền Nam nhìn chung bằng phẳng, cấu tạo từ các đồng
                      bằng phù sa trù phú hình thành bởi hệ thống sông Đồng Nai và sông
                      Mê Kông. Vùng Đồng bằng sông Cửu Long có địa hình thấp trũng, một
                      số khu vực trũng thấp dưới mực nước biển, thường xuyên đón mùa nước
                      nổi hàng năm mang lại nguồn tôm cá dồi dào.
                    </p>
                    <p>
                      Miền Nam mang đặc trưng thuần chất của{" "}
                      <strong>khí hậu nhiệt đới gió mùa</strong> với nền nhiệt độ cao
                      ổn định quanh năm, trung bình khoảng 27°C, biên độ nhiệt ngày đêm
                      nhỏ. Khí hậu chia thành hai mùa rõ rệt:{" "}
                      <strong>Mùa mưa từ tháng 5 đến tháng 11</strong> và{" "}
                      <strong>Mùa khô từ tháng 12 đến tháng 4 năm sau</strong>. Các cơn
                      mưa mùa hè ở miền Nam thường là những cơn mưa rào bất chợt đến
                      nhanh và tạnh nhanh vào đầu giờ chiều, hiếm khi mưa dầm dề kéo dài
                      cả ngày.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Southern Vietnam</strong> encompasses two economic and
                      agricultural engines: the Southeast (anchored by Ho Chi Minh
                      City, Binh Duong, Dong Nai, and Vung Tau) and the fertile Mekong
                      River Delta, totaling 19 provinces. The landscape is
                      predominantly flat, shaped by expansive alluvial deltas formed
                      by the Dong Nai and Mekong river systems. The Mekong Delta is an
                      interconnected maze of rivers, canals, and low-lying plains,
                      experiencing annual nutrient-rich flooding seasons that sustain
                      vast rice paddies and fruit orchards.
                    </p>
                    <p>
                      The South enjoys a quintessential{" "}
                      <strong>tropical monsoon climate</strong> characterized by
                      year-round warmth with an average temperature of approximately
                      27°C (80°F). The year is divided into two well-defined seasons:{" "}
                      <strong>the rainy season from May to November</strong> and{" "}
                      <strong>the dry season from December to April</strong>. Rain in
                      the south typically arrives as sudden, dramatic afternoon
                      downpours that clear up rapidly, leaving fresh skies and cool
                      evenings.
                    </p>
                  </>
                )}
              </div>

              <div className="climate-region-meta-grid">
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Kiểu khí hậu" : "Climate Classification"}
                  </span>
                  <span className="climate-region-meta-val">
                    {isVi ? "Nhiệt đới gió mùa (2 mùa)" : "Tropical Monsoonal (2 Seasons)"}
                  </span>
                </div>
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Nhiệt độ trung bình" : "Average Temperature"}
                  </span>
                  <span className="climate-region-meta-val">
                    27°C – 34°C ({isVi ? "Nắng ấm quanh năm" : "Warm year-round"})
                  </span>
                </div>
                <div className="climate-region-meta-item">
                  <span className="climate-region-meta-lbl">
                    {isVi ? "Thời điểm đẹp nhất" : "Best Time to Visit"}
                  </span>
                  <span className="climate-region-meta-val text-teal-700">
                    {isVi ? "Tháng 12 – Tháng 4 (Mùa khô)" : "December – April (Dry Season)"}
                  </span>
                </div>
              </div>
              <AffiliateDealBox deal={HCMC_MEKONG_AFFILIATE_DEALS.hcmcCentralHotels} isVi={isVi} />
              <AffiliateDealBox deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.vungTauBeachResorts} isVi={isVi} />
            </article>
          </div>
        </section>

        {/* ─── SECTION: 12-MONTH VIETNAM WEATHER GUIDE TABLE ─── */}
        <section className="climate-monthly-section" id="monthly-guide">
          <div className="climate-section-header">
            <h2 className="climate-section-title">
              {isVi
                ? "CẨM NANG THỜI TIẾT 12 THÁNG TẠI VIỆT NAM"
                : "MONTH-BY-MONTH VIETNAM WEATHER GUIDE"}
            </h2>
            <p className="climate-section-desc">
              {isVi
                ? "Bảng tra cứu nhiệt độ trung bình và gợi ý các điểm đến lý tưởng nhất cho từng tháng trong năm."
                : "Comprehensive month-by-month temperature breakdown and top recommended destinations across the year."}
            </p>
          </div>

          <div className="climate-table-wrap">
            <table className="climate-table">
              <thead>
                <tr>
                  <th>{isVi ? "Tháng" : "Month"}</th>
                  <th>{isVi ? "Miền Bắc (Hà Nội, Sa Pa, Hạ Long)" : "North (Hanoi, Sapa, Ha Long)"}</th>
                  <th>{isVi ? "Miền Trung (Đà Nẵng, Huế, Hội An)" : "Central (Da Nang, Hue, Hoi An)"}</th>
                  <th>{isVi ? "Miền Nam (TP.HCM, Phú Quốc, Miền Tây)" : "South (HCMC, Phu Quoc, Delta)"}</th>
                  <th>{isVi ? "Gợi ý điểm đến đẹp nhất" : "Best Destinations"}</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_WEATHER.map((m, idx) => (
                  <tr key={idx}>
                    <td className="climate-cell-month">
                      {isVi ? m.monthVi : m.monthEn}
                    </td>
                    <td>{isVi ? m.northVi : m.northEn}</td>
                    <td>{isVi ? m.centralVi : m.centralEn}</td>
                    <td>{isVi ? m.southVi : m.southEn}</td>
                    <td className="climate-cell-highlight">
                      {isVi ? m.bestForVi : m.bestForEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── SECTION: PACKING TIPS BY CLIMATE ─── */}
        <section className="climate-tips-section">
          <h3 className="climate-tips-title">
            <Luggage size={22} />
            {isVi
              ? "MẸO CHUẨN BỊ HÀNH LÝ THEO KHÍ HẬU VIỆT NAM"
              : "PACKING TIPS FOR VIETNAM’S CLIMATE"}
          </h3>
          <div className="climate-tips-grid">
            <div className="climate-tip-item">
              <h4 className="climate-tip-item-title">
                {isVi ? "1. Trang phục mùa đông miền Bắc (Tháng 11 - Tháng 3):" : "1. Winter in the North (Nov – Mar):"}
              </h4>
              <p className="climate-tip-item-desc">
                {isVi
                  ? "Đừng quên mang theo áo khoác ấm, áo giữ nhiệt, áo gió chống thấm và khăn choàng cổ nếu bạn có kế hoạch khám phá Sa Pa, Hà Giang hay Hà Nội vào mùa đông vì độ ẩm cao làm cái lạnh buốt sâu."
                  : "Pack a warm insulated jacket, thermal layers, and a windbreaker if traveling to Hanoi, Sapa, or Ha Giang in winter. The high humidity can make 12°C feel significantly colder than in dry climates."}
              </p>
            </div>

            <div className="climate-tip-item">
              <h4 className="climate-tip-item-title">
                {isVi ? "2. Trang phục mùa hè và biển đảo miền Trung - Nam:" : "2. Summer & Beach Destinations:"}
              </h4>
              <p className="climate-tip-item-desc">
                {isVi
                  ? "Chuẩn bị quần áo chất liệu thoáng khí tự nhiên (cotton, đũi, linen), đồ bơi, kính râm, kem chống nắng phổ rộng (SPF 50+) và nón rộng vành để thỏa sức tắm biển Đà Nẵng, Nha Trang, Phú Quốc."
                  : "Bring lightweight cotton and linen clothes, swimwear, UV-protective sunglasses, reef-safe sunscreen (SPF 50+), and wide-brimmed hats for beach hotspots like Da Nang, Nha Trang, and Phu Quoc."}
              </p>
            </div>

            <div className="climate-tip-item">
              <h4 className="climate-tip-item-title">
                {isVi ? "3. Vật dụng mùa mưa nhiệt đới:" : "3. Tropical Rain Essentials:"}
              </h4>
              <p className="climate-tip-item-desc">
                {isVi
                  ? "Luôn chuẩn bị sẵn một chiếc áo mưa giấy hoặc dù gấp gọn, dép sandal quai hậu chống trơn trượt và túi ziploc/túi chống nước để bảo vệ điện thoại, máy ảnh và hộ chiếu khi có mưa rào bất chợt."
                  : "Carry a compact umbrella or lightweight poncho, slip-resistant waterproof sandals, and dry bags/ziploc pouches to safeguard your smartphone and passport from sudden afternoon showers."}
              </p>
            </div>

            <div className="climate-tip-item">
              <h4 className="climate-tip-item-title">
                {isVi ? "4. Khám phá cao nguyên Đà Lạt & Tây Nguyên:" : "4. Highlands & Hill Stations (Dalat):"}
              </h4>
              <p className="climate-tip-item-desc">
                {isVi
                  ? "Đà Lạt nằm ở độ cao 1.500m so với mực nước biển nên quanh năm se lạnh (15°C - 24°C). Bạn nên chuẩn bị áo len mỏng, áo hoodie hoặc áo cardigan để dạo phố đêm và uống sữa đậu nành nóng."
                  : "Perched at 1,500m altitude, Dalat enjoys eternal spring (15°C–24°C). Bring light hoodies, fleece sweaters, or knit cardigans for cool morning strolls and night market wanderings."}
              </p>
            </div>
          </div>
          <AffiliateDealBox deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.vietnamDomesticTransport} isVi={isVi} />
          <AffiliateDealBox deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.allVietnamHotels} isVi={isVi} />
        </section>

        {/* ─── SECTION: FREQUENTLY ASKED QUESTIONS (FAQ) ─── */}
        <section className="climate-faq-section" id="faq">
          <div className="climate-section-header">
            <h2 className="climate-section-title">
              {isVi
                ? "CÂU HỎI THƯỜNG GẶP VỀ KHÍ HẬU & THỜI TIẾT (FAQ)"
                : "FREQUENTLY ASKED QUESTIONS (FAQ)"}
            </h2>
            <p className="climate-section-desc">
              {isVi
                ? "Giải đáp những băn khoăn phổ biến nhất của du khách khi lên lịch trình du lịch tại Việt Nam."
                : "Clear answers to the most common questions travelers ask about Vietnam’s climate and seasons."}
            </p>
          </div>

          <div className="climate-faq-list">
            {CLIMATE_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className={`climate-faq-item ${
                  openFaq === idx ? "is-open" : ""
                }`}
              >
                <button
                  type="button"
                  className="climate-faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span className="climate-faq-q-icon">
                    <HelpCircle size={18} />
                  </span>
                  <span className="climate-faq-q-text">
                    {isVi ? faq.qVi : faq.qEn}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`climate-faq-arrow ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="climate-faq-answer">
                    <p>{isVi ? faq.aVi : faq.aEn}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION: RELATED ARTICLES ─── */}
        <section className="climate-related-section">
          <h2 className="climate-related-title">
            {isVi ? "CẨM NANG HỮU ÍCH KHÁC" : "RELATED TRAVEL GUIDES"}
          </h2>
          <div className="climate-related-grid">
            {RELATED_ARTICLES.map((article) => (
              <Link
                key={article.id}
                href={article.link}
                className="climate-related-card group"
              >
                <div
                  className={`climate-related-thumb ${
                    article.isMap ? "is-map" : ""
                  }`}
                >
                  <img
                    src={article.img}
                    alt={isVi ? article.titleVi : article.title}
                    loading="lazy"
                  />
                </div>
                <h3 className="climate-related-card-title">
                  {isVi ? article.titleVi : article.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ─── AI CHATBOT & FOOTER ─── */}
      <ProvinceChatbot />
      <PublicFooter />
    </div>
  );
}
