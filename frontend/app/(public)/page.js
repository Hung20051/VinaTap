"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import {
  Map,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Puzzle,
  Globe,
  Camera,
  Gamepad2,
  RefreshCw,
  Lock,
  Wrench,
  Search,
  ChevronLeft,
  ChevronRight,
  Bot,
  Send,
  CheckCircle2,
  Facebook,
  Youtube,
  Music2,
  Truck,
  Gift,
  CreditCard,
  ArrowRight,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ShoppingBag,
  Package,
  Menu,
  Radio,
  Wifi,
  Compass,
  Calendar,
  Eye,
  Clock,
  X,
  Play,
  Instagram,
} from "lucide-react";
import { provinceAPI } from "@/lib/api";
import { isLoggedIn, getUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useReveal } from "@/hooks/useReveal";
import { getLang } from "@/lib/prefs";
import { t, getProvinceName, getProvinceDesc } from "@/lib/i18n";
import { getProvinceCover } from "@/lib/provinceGuideData";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import Interactive3DCardShowcase from "@/components/ui/Interactive3DCardShowcase";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import "@/styles/home.css";

// ─── 5 BÀI VIẾT TIÊU ĐIỂM (VIETNAMNOMAD EDITORIAL HERO GRID) ───
const TRENDING_HERO_STORIES = [
  {
    id: "15-places",
    badge: "#TRENDING",
    title: "15 best places to visit in Vietnam in 2026",
    titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
    meta: "Welcome To Vietnam - June 16, 2026",
    metaVi: "Welcome To Vietnam • 16 Tháng 6, 2026",
    img: "/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg",
  },
  {
    id: "plan-trip",
    badge: "#TRENDING",
    title: "Plan Your Vietnam Trip with Just One Prompt",
    titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một câu lệnh AI",
    link: "/province/ninh-binh",
    meta: "AI Travel Assistant",
    metaVi: "Trợ lý du lịch Thổ Địa AI",
    img: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
  },
  {
    id: "complete-guide",
    badge: "#TRENDING",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
    meta: "Heritage & Travel Guide",
    metaVi: "Di sản & Thẻ sưu tập NFC",
    img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
  },
  {
    id: "things-to-do",
    badge: "#TRENDING",
    title: "20 Best Things to Do in Vietnam",
    titleVi: "20 trải nghiệm nhất định phải thử khi đến Việt Nam",
    link: "/province/ha-noi",
    meta: "Top Highlights",
    metaVi: "Điểm nhấn khám phá",
    img: "/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg",
  },
  {
    id: "ao-dai",
    badge: "FEATURED ARTICLES",
    title: "Ao Dai – Vietnamese Traditional Dress",
    titleVi: "Áo Dài – Quốc phục & Nét đẹp duyên dáng văn hóa Việt",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
    meta: "Culture & Living",
    metaVi: "Văn hóa & Đời sống",
    img: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
  },
];

// ─── BE INSPIRED STORIES (SCREENSHOT 2) ───
const BE_INSPIRED_FEATURED = {
  title: "3-week Vietnam Itinerary",
  titleVi: "Lịch trình 3 tuần khám phá trọn vẹn Việt Nam",
  meta: "Welcome To Vietnam - July 20, 2025",
  metaVi: "Welcome To Vietnam • 20 Tháng 7, 2025",
  desc: "Discover our 3-week Vietnam itinerary, featuring 7 must-visit destinations. This guide includes detailed maps, routes, and cost breakdowns to help you plan your trip.",
  descVi: "Khám phá lịch trình du lịch Việt Nam 3 tuần hoàn hảo qua 7 điểm đến không thể bỏ lỡ. Bao gồm bản đồ chi tiết, tuyến đường di chuyển tối ưu và dự toán chi phí cụ thể.",
  img: "/guide/hcmc/3-week-vietnam-itinerary.jpg",
  link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
};

const BE_INSPIRED_COMPACT = [
  {
    title: "8 must-try foods in Hanoi",
    titleVi: "8 món ăn nhất định phải thử tại Hà Nội",
    date: "May 19, 2025",
    dateVi: "19 Tháng 5, 2025",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    link: "/province/ha-noi",
  },
  {
    title: "10 best things to do in Ho Chi Minh City",
    titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
    date: "May 5, 2025",
    dateVi: "5 Tháng 5, 2025",
    img: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
  },
  {
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 món ăn đường phố phải nếm ở Sài Gòn",
    date: "April 25, 2025",
    dateVi: "25 Tháng 4, 2025",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods",
  },
  {
    title: "12 best attractions in Ho Chi Minh City",
    titleVi: "12 điểm tham quan nổi tiếng tại TP. Hồ Chí Minh",
    date: "April 18, 2025",
    dateVi: "18 Tháng 4, 2025",
    img: "/guide/hcmc/hcmc-12-attractions-sunset.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    title: "5 best Vung Tau beaches",
    titleVi: "5 bãi biển đẹp nhất tại Vũng Tàu",
    date: "April 9, 2025",
    dateVi: "9 Tháng 4, 2025",
    img: "/guide/hcmc/vung-tau-beaches-peninsula.jpg",
    link: "/province/hai-phong",
  },
];

// ─── TOP DESTINATIONS (SCREENSHOT 3) ───
const TOP_DESTINATIONS_DATA = [
  {
    id: "hcmc",
    name: "Ho Chi Minh City",
    nameVi: "TP. Hồ Chí Minh",
    img: "/guide/hcmc/top-dest-hcmc.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    id: "danang",
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    img: "/guide/hcmc/top-dest-danang.jpg",
    link: "/province/da-nang",
  },
  {
    id: "hanoi",
    name: "Hanoi",
    nameVi: "Hà Nội",
    img: "/guide/hcmc/top-dest-hanoi.jpg",
    link: "/province/ha-noi",
  },
  {
    id: "hoian",
    name: "Hoi An",
    nameVi: "Hội An",
    img: "/guide/hcmc/top-dest-hoian.jpg",
    link: "/province/da-nang",
  },
];

// ─── REGIONAL DESTINATIONS 3 COLUMNS (SCREENSHOT 4) ───
const REGIONAL_DESTINATIONS_DATA = [
  {
    regionId: "north",
    regionName: "NORTHERN VIETNAM",
    regionNameVi: "MIỀN BẮC VIỆT NAM",
    barColorClass: "vnn-section-head__bar--purple",
    featured: {
      title: "Hanoi",
      titleVi: "Thủ Đô Hà Nội",
      desc: "Follow this guide and you will understand why Hanoi is a perfect coming together of the timeless cultural value of the old and the dynamic and colorful vibes of the new.",
      descVi: "Khám phá nét đẹp nghìn năm văn hiến giao thoa cùng nhịp sống hiện đại, năng động và đầy màu sắc của Thủ đô Hà Nội.",
      img: "/guide/hcmc/region-north-hanoi.jpg",
      link: "/province/ha-noi",
    },
    minis: [
      {
        title: "Hanoi Tourist Map",
        titleVi: "Bản đồ du lịch Hà Nội",
        img: "/guide/hcmc/region-north-map.jpg",
        link: "/province/ha-noi",
      },
      {
        title: "Ha Giang",
        titleVi: "Hà Giang - Kỳ vĩ đá",
        img: "/guide/hcmc/region-north-hagiang.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  {
    regionId: "central",
    regionName: "CENTRAL VIETNAM",
    regionNameVi: "MIỀN TRUNG VIỆT NAM",
    barColorClass: "vnn-section-head__bar--orange",
    featured: {
      title: "Da Nang",
      titleVi: "Đà Nẵng",
      desc: "This is an all-in-one Da Nang travel guide. Learn about the most necessary information about Da Nang tourism such as attractions, dishes, hotels, restaurants, and more.",
      descVi: "Cẩm nang toàn diện về thành phố biển đáng sống nhất Việt Nam: Cầu Rồng, Ngũ Hành Sơn, Bà Nà Hills và ẩm thực miền Trung độc đáo.",
      img: "/guide/hcmc/region-central-danang.jpg",
      link: "/province/da-nang",
    },
    minis: [
      {
        title: "The 10 best attractions in Da Nang",
        titleVi: "10 điểm đến đẹp nhất Đà Nẵng",
        img: "/guide/hcmc/region-central-10things.jpg",
        link: "/province/da-nang",
      },
      {
        title: "Nha Trang",
        titleVi: "Nha Trang - Vịnh biển xanh",
        img: "/guide/hcmc/region-central-nhatrang.jpg",
        link: "/province/da-nang",
      },
    ],
  },
  {
    regionId: "south",
    regionName: "SOUTHERN VIETNAM",
    regionNameVi: "MIỀN NAM VIỆT NAM",
    barColorClass: "vnn-section-head__bar--cyan",
    featured: {
      title: "Ho Chi Minh City",
      titleVi: "TP. Hồ Chí Minh",
      desc: "Ho Chi Minh City, or as it is often called intimately by the locals as Saigon, is one of the sought-after destinations while travelling in Vietnam. Saigon of the modern times attracts people not for the spectacular natural landscapes but for its dynamic lifestyle – where endless options of activities are going to tie your heart.",
      descVi: "TP. Hồ Chí Minh (Sài Gòn hoa lệ) hấp dẫn du khách bằng nhịp sống không ngủ, chiều sâu lịch sử Dinh Độc Lập, ẩm thực đa dạng và tình người ấm áp.",
      img: "/guide/hcmc/region-south-hcmc.jpg",
      link: "/province/ho-chi-minh",
    },
    minis: [
      {
        title: "Ho Chi Minh City Tourist Map",
        titleVi: "Bản đồ du lịch TP.HCM (Sài Gòn)",
        img: "/guide/hcmc/region-south-map.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        title: "12 best attractions in Ho Chi Minh City",
        titleVi: "12 điểm tham quan nổi tiếng tại TP.HCM",
        img: "/guide/hcmc/region-south-12attractions.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
    ],
  },
];

// ─── VIDEO TRAVEL GUIDES (SCREENSHOT 5) ───
const VIDEO_PLAYLIST_ITEMS = [
  {
    id: "video-1",
    youtubeId: "e2X1MIR1KBo",
    title: "Vietnam Travel Guide: Climate, Visas, Destinations, Cuisine & Tips",
    titleVi: "Cẩm nang du lịch Việt Nam: Khí hậu, Visa, Điểm đến, Ẩm thực & Mẹo",
    duration: "21:35",
    img: "/guide/hcmc/video-player-sapa-cover.jpg",
  },
  {
    id: "video-2",
    youtubeId: "h33e14kY2xM",
    title: "10 Best Places to Visit in Vietnam (Voted by 7,050 Travelers)",
    titleVi: "10 Điểm đến tuyệt nhất Việt Nam (Bình chọn bởi 7.050 du khách)",
    duration: "09:53",
    img: "/guide/hcmc/video-card-best10.jpg",
  },
  {
    id: "video-3",
    youtubeId: "95X2pU0S5tM",
    title: "Hoi An: A Guide to Visiting the Most Beautiful Ancient Town in",
    titleVi: "Hội An: Cẩm nang khám phá phố cổ đèn lồng đẹp nhất Việt Nam",
    duration: "14:23",
    img: "/guide/hcmc/video-card-hoian.jpg",
  },
  {
    id: "video-4",
    youtubeId: "bUf7n1aG74k",
    title: "Da Nang: A Guide to Visiting the Most Livable City in Vietnam",
    titleVi: "Đà Nẵng: Hành trình khám phá thành phố đáng sống nhất Việt Nam",
    duration: "12:41",
    img: "/guide/hcmc/region-central-danang.jpg",
  },
  {
    id: "video-5",
    youtubeId: "5C7yW6G3H1I",
    title: "Hue: A Guide to Visiting the Ancient Capital of Vietnam",
    titleVi: "Huế: Cẩm nang du ngoạn Cố Đô và Sông Hương trầm mặc",
    duration: "13:14",
    img: "/guide/hcmc/video-card-hue.jpg",
  },
  {
    id: "video-6",
    youtubeId: "qL0n8QZ8wY0",
    title: "Ho Chi Minh City: A Guide to Visit Vietnam's Largest City",
    titleVi: "TP. Hồ Chí Minh: Trải nghiệm Sài Gòn phồn hoa và năng động",
    duration: "16:02",
    img: "/guide/hcmc/region-south-hcmc.jpg",
  },
];

const VIDEO_BOTTOM_CARDS = [
  {
    title: "[Video] Vietnam Travel Guide: Climate, Visas, Destinations, Cuisine & Tips",
    duration: "00:21:35",
    img: "/guide/hcmc/video-card-vietnam.jpg",
    youtubeId: "e2X1MIR1KBo",
  },
  {
    title: "[Video] Hue: A Guide to Visiting the Ancient Capital of Vietnam",
    duration: "00:13:14",
    img: "/guide/hcmc/video-card-hue.jpg",
    youtubeId: "5C7yW6G3H1I",
  },
  {
    title: "[Video] 10 Best Places to Visit in Vietnam Voted by 7,050 Travelers",
    duration: "00:09:53",
    img: "/guide/hcmc/video-card-best10.jpg",
    youtubeId: "h33e14kY2xM",
  },
  {
    title: "[Video] Hoi An: A Guide to Visiting the Most Beautiful Ancient Town in Vietnam",
    duration: "00:14:23",
    img: "/guide/hcmc/video-card-hoian.jpg",
    youtubeId: "95X2pU0S5tM",
  },
];

// ─── FOODS TO TRY (SCREENSHOT 2 OF PART 2) ───
const FOODS_TO_TRY_ITEMS = [
  {
    title: "8 must-try foods in Hanoi",
    titleVi: "8 món ăn nhất định phải thử tại Hà Nội",
    desc: "Discover 8 must-try dishes in Hanoi, where tradition, care, and handmade cooking define a vibrant and authentic food culture.",
    descVi: "Khám phá 8 món ăn tinh hoa ẩm thực phố cổ Hà Nội, nơi truyền thống và sự chăm chút tạo nên hương vị khó quên.",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    link: "/province/ha-noi",
  },
  {
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
    desc: "Ho Chi Minh City is a paradise for food lovers, where every street corner offers a delicious surprise. Here's a guide to 12 signature dishes you absolutely must try to get the full experience.",
    descVi: "Sài Gòn là thiên đường của những tín đồ ẩm thực. Cẩm nang 12 món ăn đường phố đặc trưng nhất định phải nếm thử.",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods",
  },
  {
    title: "Pho",
    titleVi: "Phở – Quốc hồn quốc túy",
    desc: "Pho in the heart of Vietnamese people is more than just a universal dish but a cultural monument that we take pride in, a reminder of how rich and unique our heritage is, and an intimate image that we hold on to as a piece of our soul.",
    descVi: "Phở không chỉ là món ăn quốc hồn quốc túy mà còn là niềm tự hào văn hóa gắn liền với ký ức và tâm hồn người Việt.",
    img: "/guide/hcmc/Top-Hanoi-foods-Pho-Vietnamnomad.jpg",
    link: "/province/ha-noi",
  },
  {
    title: "7 must-try foods in Vung Tau",
    titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
    desc: "Vung Tau is a favorite destination for both domestic and international travelers, not only for its convenient location but also for its incredibly diverse and unique cuisine. Here are seven must-try local dishes to enjoy during your visit.",
    descVi: "Vũng Tàu không chỉ hấp dẫn bởi biển xanh mà còn bởi ẩm thực hải sản và bánh khọt trứ danh.",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Xeo.jpg",
    link: "/province/hai-phong",
  },
  {
    title: "5 must-try Nha Trang dishes",
    titleVi: "5 món ăn phải nếm khi đến Nha Trang",
    desc: "From aromatic broths to grilled delights, Nha Trang's food is a perfect celebration of coastal flavors and fresh local catches.",
    descVi: "Nem nướng, bún chả cá, bánh căn và hải sản tươi rói tôn vinh nét đậm đà ẩm thực vịnh biển miền Trung.",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Thit-Nuong.jpg",
    link: "/province/da-nang",
  },
];

// ─── THINGS TO DO (SCREENSHOT 2 OF PART 2) ───
const THINGS_TO_DO_ITEMS = [
  {
    title: "The 10 best attractions in Da Nang",
    titleVi: "10 điểm đến đẹp nhất Đà Nẵng",
    desc: "Da Nang is the most famous coastal city in Vietnam as it is endowed with stunning natural assets and has invested in modern infrastructures. Here are the 10 best attractions in Da Nang.",
    descVi: "Khám phá thành phố biển đáng sống nhất Việt Nam: Cầu Rồng, Ngũ Hành Sơn, Bà Nà Hills và bãi biển Mỹ Khê tuyệt đẹp.",
    img: "/landmarks/hang-mua-dinh-ngoa-long.jpg",
    link: "/province/da-nang",
  },
  {
    title: "20 Best Things to Do in Vietnam",
    titleVi: "20 trải nghiệm nhất định phải thử ở Việt Nam",
    desc: "Here are 20 things to do in Vietnam to make the most out of your time and still guarantee the best experience about the landscapes, people and cuisine.",
    descVi: "20 trải nghiệm tuyệt vời nhất giúp bạn tận hưởng trọn vẹn cảnh sắc thiên nhiên, văn hóa và con người Việt Nam.",
    img: "/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg",
    link: "/province/ha-noi",
  },
];

// ─── 4 TRAVEL PILLARS (SCREENSHOT 3 OF PART 2) ───
const TRAVEL_PILLARS = [
  {
    title: "Vietnam Travel Maps",
    titleVi: "Bản Đồ Du Lịch Việt Nam",
    img: "/guide/hcmc/vietnam-travel-maps-3d.jpg",
    link: "/province/ha-noi",
  },
  {
    title: "Vietnam Visa",
    titleVi: "Thông Tin Visa Việt Nam",
    img: "/guide/hcmc/3-week-vietnam-itinerary.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
  },
  {
    title: "Climate of Vietnam",
    titleVi: "Khí Hậu & Thời Tiết",
    img: "/guide/hcmc/climate-of-vietnam.jpg",
    link: "/province/ninh-binh",
  },
  {
    title: "Vietnamese Currency",
    titleVi: "Tiền Tệ & Đổi Tiền",
    img: "/guide/hcmc/da-nang-dragon-bridge.jpg",
    link: "/shop",
  },
];

// ─── LATEST ARTICLES (SCREENSHOT 4 OF PART 2) ───
const LATEST_ARTICLES_ITEMS = [
  {
    badge: "#TRENDING",
    title: "15 best places to visit in Vietnam in 2026",
    titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
    meta: "Welcome To Vietnam - June 16, 2026",
    metaVi: "Welcome To Vietnam • 16 Tháng 6, 2026",
    img: "/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
  },
  {
    badge: "#TRENDING",
    title: "Plan Your Vietnam Trip with Just One Prompt",
    titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một câu lệnh AI",
    meta: "Welcome To Vietnam - April 1, 2026",
    metaVi: "Welcome To Vietnam • 1 Tháng 4, 2026",
    img: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
    link: "/province/ninh-binh",
  },
  {
    badge: "#TRENDING",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam",
    meta: "Welcome To Vietnam - January 9, 2026",
    metaVi: "Welcome To Vietnam • 9 Tháng 1, 2026",
    img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
  },
  {
    badge: "MEMBERSHIP",
    title: "Accommodation in Vietnam",
    titleVi: "Khách sạn & Nơi lưu trú tại Việt Nam",
    meta: "Welcome To Vietnam - December 16, 2025",
    metaVi: "Welcome To Vietnam • 16 Tháng 12, 2025",
    img: "/guide/hcmc/accommodation-in-vietnam.jpg",
    link: "/province/da-nang",
  },
  {
    badge: "HO CHI MINH CITY",
    title: "Where to Stay in Ho Chi Minh City",
    titleVi: "Khách sạn & Khu vực nên ở tại TP. Hồ Chí Minh",
    meta: "Welcome To Vietnam - November 26, 2025",
    metaVi: "Welcome To Vietnam • 26 Tháng 11, 2025",
    img: "/reviews/landmark-81-ve-dem.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    badge: "WEATHER",
    title: "Vietnam Weather Map for September",
    titleVi: "Bản đồ dự báo thời tiết du lịch Việt Nam",
    meta: "Welcome To Vietnam - November 12, 2025",
    metaVi: "Welcome To Vietnam • 12 Tháng 11, 2025",
    img: "/guide/hcmc/vietnam-weather-map.jpg",
    link: "/province/ha-noi",
  },
];

// ─── POPULAR POSTS (SCREENSHOT 4 OF PART 2) ───
const POPULAR_POSTS_ITEMS = [
  {
    title: "Ho Chi Minh City",
    titleVi: "TP. Hồ Chí Minh",
    img: "/reviews/landmark-81-ve-dem.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    title: "Da Nang",
    titleVi: "Đà Nẵng",
    img: "/guide/hcmc/da-nang-dragon-bridge.jpg",
    link: "/province/da-nang",
  },
  {
    title: "Hanoi",
    titleVi: "Hà Nội",
    img: "/reviews/ca-phe-duong-tau-ha-noi.jpg",
    link: "/province/ha-noi",
  },
  {
    title: "Vietnam Travel Maps",
    titleVi: "Bản đồ du lịch Việt Nam",
    img: "/guide/hcmc/vietnam-travel-maps-3d.jpg",
    link: "/province/ha-noi",
  },
  {
    title: "15 Must-Try Vietnamese Dishes",
    titleVi: "15 món ăn Việt Nam nhất định phải thử",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods",
  },
];


const REGION_LABEL = {
  vi: {
    north: "Miền Bắc",
    central: "Miền Trung",
    south: "Miền Nam",
    island: "Hải đảo",
  },
  en: {
    north: "Northern",
    central: "Central",
    south: "Southern",
    island: "Islands",
  },
};

// Tạm thời chỉ hiển thị 5 tỉnh thành theo yêu cầu (Hà Nội, Hồ Chí Minh, Hải Phòng, Đà Nẵng, Ninh Bình)
const ALLOWED_PROVINCE_SLUGS = [
  "ha-noi",
  "ho-chi-minh",
  "hai-phong",
  "da-nang",
  "ninh-binh",
];

const FAQ_DATA = {
  vi: [
    {
      q: "Giá thẻ và các gói combo bao nhiêu?",
      category: "pricing",
      a: "Bảng giá chính thức của thẻ NFC VinaTap:\n• 1 thẻ lẻ (tỉnh thành bất kỳ): 49.000đ / thẻ.\n• Combo 3 thẻ tự chọn: 139.000đ (tiết kiệm so với mua lẻ, rất được yêu thích).\n• Combo 5 thẻ (bộ 5 tỉnh): 239.000đ (ưu đãi theo gói).\n• Trọn bộ 34 thẻ toàn quốc: 1.400.000đ (kèm hộp quà kỷ niệm cao cấp).\nMỗi thẻ đều có quyền kích hoạt và lưu trữ album ảnh AI trọn đời. Bạn có thể ghé mục 'Sản phẩm' trên thanh menu để đặt mua ngay nhé!",
    },
    {
      q: "Cách thức đặt mua và thanh toán ra sao?",
      category: "order",
      a: "Bạn chỉ cần vào mục 'Sản phẩm' trên thanh menu, chọn thẻ lẻ tỉnh thành hoặc combo mong muốn rồi bấm 'Mua ngay'.\nVinaTap hỗ trợ 2 hình thức thanh toán an toàn:\n1. Quét mã QR PayOS tự động qua tài khoản ngân hàng / ví điện tử.\n2. Thanh toán tiền mặt khi nhận hàng (COD).",
    },
    {
      q: "Phí ship và chính sách Freeship như thế nào?",
      category: "shipping",
      a: "Chính sách giao hàng của VinaTap:\n• Phí vận chuyển tiêu chuẩn toàn quốc: 30.000đ.\n• Miễn phí vận chuyển (Freeship): Tự động áp dụng cho đơn hàng từ 500.000đ trở lên.\nThời gian giao hàng từ 2 - 4 ngày làm việc trên toàn quốc.",
    },
    {
      q: "Thẻ NFC hoạt động ra sao, có cần tải app không?",
      category: "nfc",
      a: "Mỗi thẻ NFC có gắn 1 chip thông minh NXP chuẩn ISO bên trong. Chỉ cần chạm nhẹ mặt sau điện thoại vào thẻ NFC, album ảnh của tỉnh đó sẽ mở ngay trên trình duyệt web.\n• Hoàn toàn không cần tải app.\n• Không cần quét mã QR.",
    },
    {
      q: "Điện thoại nào có thể sử dụng được thẻ NFC?",
      category: "device",
      a: "Hầu hết smartphone hiện đại đều hỗ trợ:\n• iPhone: Từ iPhone 7 trở lên (đặc biệt iPhone Xr/Xs trở lên tự động nhận thẻ ngay).\n• Android: Mọi dòng máy Samsung, Xiaomi, Oppo, Pixel... có hỗ trợ NFC.\n• Nếu điện thoại không có NFC: Mỗi thẻ đều có mã Serial dự phòng in kèm để bạn nhập trên web và xem album bình thường.",
    },
    {
      q: "Ai là người tạo album và kích hoạt thẻ?",
      category: "album",
      a: "Người đầu tiên chạm thẻ (hoặc nhập mã serial dự phòng) sẽ trở thành chủ nhân của thẻ NFC. Bạn có thể tự đặt tên album, tải lên ảnh, video kỷ niệm và viết nhật ký chuyến đi ngay sau khi kích hoạt.",
    },
    {
      q: "Nội dung album ảnh có riêng tư không?",
      category: "privacy",
      a: "Bạn tự quyết định hoàn toàn:\n• Chế độ Riêng tư (mặc định): Chỉ bạn (và những người được bạn cấp quyền) mới có thể xem ảnh và video.\n• Chế độ Công khai: Bất kỳ ai chạm vào thẻ cũng có thể chiêm ngưỡng album hành trình của bạn.",
    },
    {
      q: "Tôi có thể tặng hoặc chuyển nhượng thẻ không?",
      category: "transfer",
      a: "Có ạ! Trong trang quản lý thẻ, bạn chỉ cần chọn 'Chuyển nhượng', nhập email người nhận. Khi họ xác nhận qua email, toàn bộ quyền sở hữu thẻ và album kỷ niệm sẽ được chuyển sang tài khoản của họ an toàn.",
    },
    {
      q: "Chính sách bảo hành và đổi trả thế nào?",
      category: "warranty",
      a: "VinaTap bảo hành chip chính hãng:\n• Đổi mới 1-1 miễn phí trong 30 ngày nếu chip NFC gặp lỗi kỹ thuật từ nhà sản xuất.\n• Thẻ được phủ lớp chống xước và chống nước bền bỉ.\n• Luôn có mã serial dự phòng in trên thẻ đảm bảo bạn không bao giờ mất quyền truy cập.",
    },
    {
      q: "Dự án VinaTap là gì và có ý nghĩa gì?",
      category: "about",
      a: "VinaTap là dự án tiên phong số hóa di sản du lịch Việt Nam, kết hợp giữa thẻ NFC 3D vật lý và nền tảng bản đồ du lịch số 34 tỉnh thành. VinaTap giúp bạn lưu giữ kỷ niệm thực tế của từng chuyến đi và truyền cảm hứng khám phá vẻ đẹp đất nước.",
    },
  ],
  en: [
    {
      q: "How much do the NFC cards and combos cost?",
      category: "pricing",
      a: "Official VinaTap Pricing:\n• Single Card (any province): 49,000 VND.\n• Combo 3 Cards: 139,000 VND (popular choice, saves compared to single).\n• Combo 5 Cards: 239,000 VND (package savings).\n• Full 34-Province Set: 1,400,000 VND (includes premium gift box).\nEach card includes lifetime AI album activation. Visit the 'Shop' section to order yours!",
    },
    {
      q: "How can I order and what payment methods are accepted?",
      category: "order",
      a: "Go to 'Shop' in the navigation bar, choose your favorite province cards or combos, and click 'Buy Now'.\nWe accept:\n1. Instant QR transfer via PayOS (all banks & e-wallets).\n2. Cash on Delivery (COD).",
    },
    {
      q: "What are the shipping fees and Freeship policy?",
      category: "shipping",
      a: "VinaTap Shipping Policy:\n• Standard nationwide delivery fee: 30,000 VND.\n• Free Shipping (Freeship): Automatically applied for orders from 500,000 VND.\nDelivery time is typically 2-4 business days across Vietnam.",
    },
    {
      q: "How does the NFC card work? Is an app required?",
      category: "nfc",
      a: "Each card embeds an ISO standard NXP smart NFC chip. Just tap the back of your smartphone to the card, and the province album opens directly in your mobile browser.\n• No app download required.\n• No QR scan needed.",
    },
    {
      q: "Which smartphones are compatible with VinaTap NFC?",
      category: "device",
      a: "Most modern smartphones work seamlessly:\n• iPhone: iPhone 7 and above (iPhone Xr/Xs and newer read automatically without opening any app).\n• Android: Any Samsung, Xiaomi, Oppo, Pixel with NFC.\n• If your phone doesn't have NFC: Every card has a printed backup Serial Code to access your album on the web anytime.",
    },
    {
      q: "Who activates and creates the photo album?",
      category: "album",
      a: "The first person to tap the card or enter the backup serial becomes the verified owner. You can name your album, upload photos/videos, and write travel memories immediately after activation.",
    },
    {
      q: "Is album content kept private?",
      category: "privacy",
      a: "You have 100% control:\n• Private mode (default): Only you and people you invite can view media.\n• Public mode: Anyone tapping the card can see your travel stories.\nAll photos are encrypted and securely stored in cloud servers.",
    },
    {
      q: "Can I gift or transfer card ownership to someone else?",
      category: "transfer",
      a: "Yes! In your card dashboard, select 'Transfer', enter the recipient's email address. Once they confirm via email, full card ownership and album access transfer safely to them.",
    },
    {
      q: "What is the warranty and return policy?",
      category: "warranty",
      a: "VinaTap provides an official warranty:\n• Free 1-to-1 replacement within 30 days for any NFC chip manufacturing defect.\n• Scratch-resistant and waterproof physical cards.\n• Backup serial codes guarantee you never lose access.",
    },
    {
      q: "What is the VinaTap project?",
      category: "about",
      a: "VinaTap is an innovative travel-tech project bridging physical NFC collection tiles with a digital travel heritage map across Vietnam's 34 provinces. It helps travelers preserve real trip memories and celebrate Vietnamese culture.",
    },
  ],
};

export default function HomePage() {
  const [lang, setLang] = useState("vi");
  const isVi = lang === "vi";
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provinceError, setProvinceError] = useState(false);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [faqInput, setFaqInput] = useState("");
  const [faqMessages, setFaqMessages] = useState([]);
  const faqChatContainerRef = useRef(null);
  const router = useRouter();

  // VietnamNomad Magazine Hero states
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(VIDEO_PLAYLIST_ITEMS[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const topDestTrackRef = useRef(null);

  const scrollDestTrack = (dir) => {
    if (topDestTrackRef.current) {
      topDestTrackRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  // Tự động xoay vòng tin bài #Trending trên thanh ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTrendingIndex((prev) => (prev + 1) % TRENDING_HERO_STORIES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const loadProvincesData = useCallback(() => {
    setLoading(true);
    setProvinceError(false);
    provinceAPI
      .getAll()
      .then((d) => {
        const rawList = d?.provinces || [];
        const list = rawList
          .filter((p) => ALLOWED_PROVINCE_SLUGS.includes(p.slug))
          .map((p) => ({
            ...p,
            thumbnail_url: getProvinceCover(p) || p.thumbnail_url,
          }));
        setProvinces(list);
        if (list.length > 0) {
          try {
            sessionStorage.setItem(
              "vinatap_cached_provinces",
              JSON.stringify(list),
            );
          } catch {}
        }
      })
      .catch((err) => {
        console.error("Lỗi tải tỉnh thành:", err);
        try {
          const cached = sessionStorage.getItem("vinatap_cached_provinces");
          if (cached) {
            const list = JSON.parse(cached)
              .filter((p) => ALLOWED_PROVINCE_SLUGS.includes(p.slug))
              .map((p) => ({
                ...p,
                thumbnail_url: getProvinceCover(p) || p.thumbnail_url,
              }));
            setProvinces(list);
            return;
          }
        } catch {}
        setProvinceError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (faqMessages.length > 1 && faqChatContainerRef.current) {
      faqChatContainerRef.current.scrollTo({
        top: faqChatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [faqMessages]);

  useEffect(() => {
    const current = getLang();
    setLang(current);
    setFaqMessages([
      {
        role: "assistant",
        content: t(current, "faqBotGreeting"),
      },
    ]);

    const handleLangUpdated = (e) => {
      const nextLang = e.detail;
      setLang(nextLang);
      setFaqMessages((prev) => {
        if (prev.length <= 1) {
          return [
            {
              role: "assistant",
              content: t(nextLang, "faqBotGreeting"),
            },
          ];
        }
        return prev;
      });
    };

    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () =>
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  // Slide tự động cho "Tỉnh thành nổi bật"
  const provinceTrackRef = useRef(null);
  const [provinceAutoPaused, setProvinceAutoPaused] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setCheckingAuth(false);
    loadProvincesData();

    const handleUserUpdated = (e) => setUser(e.detail);
    window.addEventListener("vinatap:user-updated", handleUserUpdated);

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đổi diện mạo navbar (nền mờ + đổ bóng) khi cuộn xuống — chỉ là
  // hiệu ứng nhỏ, không ảnh hưởng logic.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = provinces
    .filter((p) => ALLOWED_PROVINCE_SLUGS.includes(p.slug))
    .filter((p) => {
      const q = search.toLowerCase().trim();
      const pNameEn = getProvinceName(p, "en");
      const pDescEn = getProvinceDesc(p, "en");
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        pNameEn.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (pDescEn && pDescEn.toLowerCase().includes(q));
      const matchRegion = region === "all" || p.region === region;
      return matchSearch && matchRegion;
    });

  // Tự động trượt slide tỉnh thành mỗi 3s — dừng khi hover/chạm hoặc khi
  // danh sách quá ngắn (không cần cuộn). Cuộn hết thì quay lại đầu.
  useEffect(() => {
    if (loading || provinceAutoPaused || filtered.length < 2) return;
    const track = provinceTrackRef.current;
    if (!track) return;

    const timer = setInterval(() => {
      if (!track) return;
      const cardStep = 264; // 240px thẻ + 24px khoảng cách (1.5rem)
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardStep, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [loading, provinceAutoPaused, filtered.length]);

  const scrollProvinceTrack = (dir) => {
    const track = provinceTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 264, behavior: "smooth" });
  };

  // Slide cho "Chính sách" (Policy carousel)
  const policyTrackRef = useRef(null);
  const [policyActiveIndex, setPolicyActiveIndex] = useState(0);

  const scrollPolicyTrack = (dir) => {
    const track = policyTrackRef.current;
    if (!track) return;
    const cardStep = track.firstElementChild?.offsetWidth
      ? track.firstElementChild.offsetWidth + 24
      : 300;
    track.scrollBy({ left: dir * cardStep, behavior: "smooth" });
  };

  const handlePolicyScroll = () => {
    const track = policyTrackRef.current;
    if (!track) return;
    const cardStep = track.firstElementChild?.offsetWidth
      ? track.firstElementChild.offsetWidth + 24
      : 300;
    const index = Math.round(track.scrollLeft / cardStep);
    setPolicyActiveIndex(Math.max(0, Math.min(index, 5)));
  };

  const handleLogout = () => {
    clearAuth();
    // Hard reload thay vì chỉ setUser(null) tại chỗ — đảm bảo Next.js
    // Router Cache không còn giữ bản render/prefetch cũ của các trang
    // khác (vd /auth) từ lúc còn đăng nhập, tránh việc bấm "Đăng nhập"
    // ngay sau đó bị đưa nhầm lại vào dashboard của phiên vừa thoát.
    window.location.href = "/";
  };

  // Cuộn mượt tới 1 section trong trang bằng JS + history.replaceState,
  // thay vì để trình duyệt tự pushState theo <a href="#..."> mặc định.
  // Nếu dùng href thường, mỗi lần bấm menu sẽ đẩy thêm 1 mục vào lịch
  // sử trình duyệt — bấm nhiều menu rồi rời trang, nút "quay lại" phải
  // bấm lại đúng bấy nhiêu lần mới thoát được trang, rất khó chịu.
  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const answerFaqQuestion = (question) => {
    const isVi = lang === "vi";
    const qLower = question.toLowerCase().trim();

    // 1. Kiểm tra trùng khớp câu hỏi mẫu trong FAQ_DATA
    const list = FAQ_DATA[lang] || FAQ_DATA.vi;
    const exactMatch = list.find(
      (item) =>
        item.q.toLowerCase() === qLower ||
        qLower.includes(item.q.toLowerCase()),
    );
    if (exactMatch) return exactMatch.a;

    // 2. Nhận diện ý định theo các chủ đề chính của dự án VinaTap (Intent Recognition)

    // Chủ đề: Giá cả / Các gói combo / Chi phí
    if (
      /giá|bao nhiêu|nhiêu tiền|bao tiền|bảng giá|chi phí|combo|mua bao nhiêu|đắt|rẻ|tiền lẻ|price|pricing|cost|how much|tier|package/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Bảng giá chính thức của thẻ NFC VinaTap:\n• 1 thẻ lẻ (tỉnh thành bất kỳ): 49.000đ / thẻ.\n• Combo 3 thẻ tự chọn: 139.000đ (tiết kiệm so với mua lẻ, rất được yêu thích).\n• Combo 5 thẻ (bộ 5 tỉnh): 239.000đ (ưu đãi theo gói).\n• Trọn bộ 34 thẻ toàn quốc: 1.400.000đ (kèm hộp quà kỷ niệm cao cấp).\nMỗi thẻ đều có quyền kích hoạt và lưu trữ album ảnh AI trọn đời. Bạn có thể ghé mục 'Sản phẩm' trên thanh menu để chọn thẻ và đặt mua ngay nhé!"
        : "Here is the official VinaTap NFC card pricing:\n• Single Card (any province): 49,000 VND.\n• Combo 3 Cards: 139,000 VND (popular choice, saves compared to single).\n• Combo 5 Cards: 239,000 VND (package discount).\n• Complete 34-Province Set: 1,400,000 VND (includes premium gift box).\nAll cards come with lifetime AI album activation. You can visit the 'Shop' section in the menu to order now!";
    }

    // Chủ đề: Cách đặt mua / Shop / Mua ở đâu
    if (
      /mua|đặt hàng|order|cửa hàng|shop|ở đâu|làm sao để mua|làm thế nào để mua|buy|purchase|where to buy/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Để đặt mua thẻ VinaTap, bạn làm theo 3 bước cực kỳ đơn giản:\n1. Bấm vào mục 'Sản phẩm' trên thanh điều hướng phía trên.\n2. Chọn thẻ tỉnh thành hoặc các gói Combo 3 thẻ (139k), Combo 5 thẻ (239k) bạn yêu thích rồi bấm 'Mua ngay'.\n3. Điền địa chỉ nhận hàng và chọn thanh toán qua mã QR PayOS hoặc thanh toán tiền mặt khi nhận hàng (COD) là hoàn tất ạ!"
        : "To buy VinaTap cards, follow 3 easy steps:\n1. Click 'Shop' in the navigation bar.\n2. Select your desired province cards or 3-card (139k) / 5-card (239k) combos and click 'Buy Now'.\n3. Enter your delivery address and choose payment via PayOS QR or Cash on Delivery (COD)!";
    }

    // Chủ đề: Thanh toán / Chuyển khoản / PayOS / COD
    if (
      /thanh toán|chuyển khoản|payos|cod|tiền mặt|ngân hàng|atm|quét mã|ví|payment|pay/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "VinaTap hỗ trợ 2 hình thức thanh toán an toàn và tiện lợi:\n1. Chuyển khoản trực tuyến PayOS: Quét mã VietQR tự động xác nhận ngay tức thì, tương thích với mọi app ngân hàng và ví điện tử.\n2. Thanh toán khi nhận hàng (COD): Nhận hàng tận tay, kiểm tra thẻ rồi mới thanh toán tiền mặt cho bưu tá."
        : "VinaTap supports 2 secure payment methods:\n1. Online QR Transfer via PayOS: Scan VietQR for instant automatic confirmation with all banks and e-wallets.\n2. Cash on Delivery (COD): Receive and inspect your physical cards before paying cash.";
    }

    // Chủ đề: Phí vận chuyển / Giao hàng / Freeship / Mất bao lâu
    if (
      /ship|vận chuyển|giao hàng|phí ship|freeship|miễn phí ship|bao lâu|mấy ngày|delivery|shipping/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Chính sách giao hàng của VinaTap:\n• Phí vận chuyển tiêu chuẩn toàn quốc: 30.000đ.\n• Miễn phí vận chuyển (Freeship): Tự động áp dụng cho đơn hàng từ 500.000đ trở lên.\n• Thời gian giao hàng: Khoảng 2 - 4 ngày làm việc trên toàn quốc."
        : "VinaTap Delivery Policy:\n• Standard nationwide shipping: 30,000 VND.\n• Free Shipping: Automatically applied for orders from 500,000 VND.\n• Delivery time: Usually 2 - 4 business days nationwide.";
    }

    // Chủ đề: Công nghệ NFC / Cách hoạt động / Có cần tải app không
    if (
      /nfc|hoạt động|như thế nào|ra sao|cách dùng|sử dụng|cài app|tải app|quét mã|chạm thẻ|how it works/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Thẻ VinaTap sử dụng chip NFC chuẩn ISO NXP thông minh:\n• Bạn chỉ cần chạm nhẹ mặt sau điện thoại vào thẻ, album du lịch của tỉnh thành đó sẽ tự động mở ngay trên trình duyệt web điện thoại.\n• Hoàn toàn không cần tải app, không cần quét mã QR."
        : "VinaTap uses smart ISO-certified NXP NFC chips:\n• Simply tap the back of your phone to the physical tile, and that province's travel album opens instantly in your mobile web browser.\n• No app download required and no QR scanning needed.";
    }

    // Chủ đề: Điện thoại tương thích / iPhone / Android / Máy không có NFC
    if (
      /điện thoại|iphone|android|samsung|thiết bị|máy nào|hỗ trợ|không có nfc|tương thích|phone|device|compatible/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Hầu hết smartphone hiện nay đều tương thích hoàn hảo:\n• iPhone: Từ iPhone 7 trở lên (đặc biệt từ iPhone Xr/Xs trở lên tự động nhận thẻ ngay mà không cần thao tác gì thêm).\n• Android: Mọi điện thoại có trang bị NFC (Samsung, Xiaomi, Oppo, Pixel...).\n• Nếu máy không có NFC: Mỗi thẻ đều có mã Serial dự phòng in kèm — bạn chỉ cần nhập mã trên web là mở album bình thường!"
        : "Most modern smartphones are fully compatible:\n• iPhone: iPhone 7 and above (iPhone Xr/Xs and newer read automatically in background).\n• Android: Any smartphone with NFC enabled (Samsung, Xiaomi, Oppo, etc.).\n• Phones without NFC: Every card includes a printed backup Serial Code so you can open the album on the web anytime!";
    }

    // Chủ đề: Kích hoạt thẻ / Tạo album / Đăng ảnh / Quản lý
    if (
      /kích hoạt|activate|tạo album|up ảnh|đăng ảnh|lưu ảnh|tải ảnh|video|album|serial|nhập serial/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Quy trình kích hoạt và tạo album rất nhanh chóng:\n1. Chạm thẻ vào điện thoại lần đầu (hoặc nhập mã Serial in trên thẻ tại trang 'Kích hoạt').\n2. Đăng nhập để xác nhận quyền sở hữu thẻ.\n3. Bạn có thể tự do đặt tên album, tải lên các bức ảnh/video đẹp nhất, viết nhật ký hành trình để lưu giữ kỷ niệm du lịch trọn đời!"
        : "Activating and creating an album takes under a minute:\n1. Tap the card to your phone for the first time (or enter the backup serial code on the 'Activate' page).\n2. Sign in to confirm ownership.\n3. Name your album, upload your travel photos/videos, write memories, and keep them alive forever on your map!";
    }

    // Chủ đề: Quyền riêng tư / Bảo mật / Ai xem được
    if (
      /riêng tư|bảo mật|ai xem|công khai|lộ ảnh|private|public|privacy|security/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Bạn nắm toàn quyền kiểm soát album của mình:\n• Chế độ Riêng tư (mặc định): Chỉ bạn và những người được bạn cấp quyền mới xem được ảnh & video.\n• Chế độ Công khai: Bất kỳ ai chạm thẻ cũng có thể chiêm ngưỡng album của bạn.\nDữ liệu được mã hóa và lưu trữ an toàn trên nền tảng đám mây."
        : "You have 100% control over your albums:\n• Private mode (default): Only you and authorized guests can view your media.\n• Public mode: Anyone tapping the physical card can see your travel stories.\nAll photos are securely encrypted and stored on cloud servers.";
    }

    // Chủ đề: Chuyển nhượng / Tặng thẻ
    if (
      /chuyển nhượng|tặng|cho người khác|đổi chủ|sang tên|bán lại|transfer|gift/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Bạn hoàn toàn có thể tặng hoặc chuyển nhượng thẻ cho bạn bè:\n• Vào mục quản lý thẻ trong Dashboard, chọn 'Chuyển nhượng'.\n• Nhập email người nhận. Hệ thống sẽ gửi email xác nhận cho họ.\n• Khi người nhận bấm xác nhận, quyền sở hữu thẻ và album sẽ được chuyển sang tài khoản mới một cách an toàn."
        : "You can easily gift or transfer card ownership:\n• Go to your card dashboard and click 'Transfer'.\n• Enter the recipient's email address.\n• Once they confirm via the email link, full card ownership and album access transfer securely to their account.";
    }

    // Chủ đề: Bảo hành / Đổi trả / Hỏng chip
    if (
      /bảo hành|đổi trả|hỏng|lỗi|chip hỏng|1 đổi 1|chống nước|30 ngày|warranty|guarantee|defect/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Chính sách bảo hành chính hãng của VinaTap:\n• Đổi mới 1-1 miễn phí trong 30 ngày đầu nếu chip NFC gặp lỗi kỹ thuật từ nhà sản xuất.\n• Thẻ được chế tạo với vật liệu chống nước, chống xước cao cấp.\n• Mã serial dự phòng in trên thẻ đảm bảo bạn không bao giờ mất dữ liệu album dù thẻ có bị thất lạc."
        : "Official VinaTap Warranty Policy:\n• Free 1-to-1 replacement within 30 days for any technical chip defect.\n• Waterproof and scratch-resistant build quality.\n• Backup serial codes guarantee your memories are never lost.";
    }

    // Chủ đề: Dự án VinaTap là gì / Ý nghĩa / Giới thiệu
    if (
      /vinatap|dự án|là gì|giới thiệu|ý nghĩa|ý tưởng|sứ mệnh|mục đích|about|what is/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "VinaTap là dự án công nghệ du lịch kết hợp giữa thẻ NFC vật lý thông minh và nền tảng bản đồ số hóa 34 tỉnh thành Việt Nam.\nMục tiêu của VinaTap là giúp mọi người lưu giữ kỷ niệm du lịch thực tế, biến hành trình khám phá đất nước thành bộ sưu tập di sản sống động và gắn kết bạn bè, gia đình."
        : "VinaTap is an innovative travel-tech project that connects physical smart NFC tiles with an interactive digital travel map across Vietnam's 34 provinces.\nOur mission is to help travelers preserve authentic journey memories and celebrate the heritage and beauty of Vietnam.";
    }

    // Chủ đề: Chào hỏi
    if (/chào|hi|hello|alo|ơi|bạn ơi|bot|hey/i.test(qLower)) {
      return isVi
        ? "Chào bạn! Mình là Trợ lý ảo của VinaTap. Mình có thể hỗ trợ bạn thông tin về giá thẻ (1 thẻ 49k, combo 3 thẻ 139k, 5 thẻ 239k), cách thức đặt mua, công nghệ chạm NFC hay chính sách bảo hành. Bạn cần mình giải đáp điều gì cứ nhắn nhé!"
        : "Hello! I am VinaTap Assistant. I can help you with pricing (1 card 49k, combo 3 cards 139k, 5 cards 239k), ordering, NFC technology, or warranty. How can I help you today?";
    }

    // 3. Nếu không trúng intent cụ thể, tính điểm từ khóa khớp tốt nhất trong FAQ_DATA
    const keywords = qLower
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 1);
    const scoredList = list
      .map((item) => ({
        item,
        score: keywords.reduce(
          (total, word) =>
            total +
            (item.q.toLowerCase().includes(word) ? 3 : 0) +
            (item.a.toLowerCase().includes(word) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score);

    if (scoredList[0]?.score >= 2) {
      return scoredList[0].item.a;
    }

    // 4. Phản hồi gợi ý thông minh nếu chưa rõ câu hỏi
    return t(lang, "faqNoAnswer");
  };

  const sendFaqQuestion = (question) => {
    const text = question.trim();
    if (!text) return;
    setFaqMessages((messages) => [
      ...messages,
      { role: "user", content: text },
      { role: "assistant", content: answerFaqQuestion(text) },
    ]);
    setFaqInput("");
  };

  const handleFaqSubmit = (e) => {
    e.preventDefault();
    sendFaqQuestion(faqInput);
  };

  // Đang kiểm tra đăng nhập (và sẽ redirect nếu có) — không render gì để
  // tránh nháy trang landing page trước khi chuyển hướng.
  if (checkingAuth) return null;

  return (
    <>
      <link rel="prefetch" as="image" href="/auth-bg.jpg" />
      <div className="home home--guest">
        {/* ─── 1. TOP PANORAMIC COLLAGE BANNER (IMAGE 2) ─── */}
        <div
          className="vnn-top-banner"
          onClick={() => setAiCompanionOpen(true)}
          role="button"
          tabIndex={0}
          title="FREE AI TRAVEL ASSISTANT • AI COMPANION"
        >
          <div className="vnn-top-banner__inner">
            <img
              src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
              alt="Welcome to Vietnam AI Travel Assistant - AI Companion"
              className="vnn-top-banner__img"
            />
          </div>
        </div>

        {/* ─── 2. EDITORIAL NAVBAR (IMAGE 2) ─── */}
        <header className="vnn-navbar">
          <div className="vnn-navbar__inner">
            <Link href="/" className="vnn-navbar__brand">
              <img
                src="/guide/hcmc/Vietnamnomad-logo-by-Welcome-to-Vietnam-official.png"
                alt="Welcome to Vietnam"
                className="vnn-navbar__brand-logo"
              />
              <div className="vnn-navbar__brand-divider" />
              <div className="vnn-navbar__brand-vinatap">
                <Logo size={28} showText={false} noLink href={null} as="span" />
                <span>VinaTap</span>
                <span className="vnn-navbar__brand-badge">NFC</span>
              </div>
            </Link>

            <ul className="vnn-navbar__menu">
              {/* BE INSPIRED */}
              <li className="vnn-navbar__item">
                <button type="button" className="vnn-navbar__link">
                  <span>{lang === "vi" ? "Cảm Hứng" : "BE INSPIRED"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
                <div className="vnn-dropdown">
                  <Link href="/guide/10-best-things-to-do-in-ho-chi-minh-city" className="vnn-dropdown__item">
                    <Sparkles size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "15 Điểm đến đẹp nhất 2026" : "15 Best Places to Visit 2026"}</span>
                  </Link>
                  <Link href="/guide/10-best-things-to-do-in-ho-chi-minh-city" className="vnn-dropdown__item">
                    <Sparkles size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "Áo Dài – Quốc Phục Việt Nam" : "Ao Dai Traditional Dress"}</span>
                  </Link>
                  <a href="#provinces" onClick={scrollToSection("provinces")} className="vnn-dropdown__item">
                    <Compass size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "Lên Kế Hoạch Với AI Prompt" : "Plan Trip With AI Prompt"}</span>
                  </a>
                </div>
              </li>

              {/* DESTINATIONS */}
              <li className="vnn-navbar__item">
                <button type="button" className="vnn-navbar__link">
                  <span>{lang === "vi" ? "Điểm Đến" : "DESTINATIONS"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
                <div className="vnn-dropdown" style={{ minWidth: "290px" }}>
                  <Link href="/province/ha-noi" className="vnn-dropdown__item">
                    <Map size={16} className="vnn-dropdown__item-icon" />
                    <span>Thủ Đô Hà Nội (Nghìn Năm Văn Hiến)</span>
                  </Link>
                  <Link href="/province/ho-chi-minh" className="vnn-dropdown__item">
                    <Map size={16} className="vnn-dropdown__item-icon" />
                    <span>TP. Hồ Chí Minh (Sài Gòn Hoa Lệ)</span>
                  </Link>
                  <Link href="/province/da-nang" className="vnn-dropdown__item">
                    <Map size={16} className="vnn-dropdown__item-icon" />
                    <span>Đà Nẵng (Thành Phố Đáng Sống)</span>
                  </Link>
                  <Link href="/province/ninh-binh" className="vnn-dropdown__item">
                    <Map size={16} className="vnn-dropdown__item-icon" />
                    <span>Ninh Bình (Tràng An - Tam Cốc)</span>
                  </Link>
                  <Link href="/province/hai-phong" className="vnn-dropdown__item">
                    <Map size={16} className="vnn-dropdown__item-icon" />
                    <span>Hải Phòng (Đảo Ngọc Cát Bà)</span>
                  </Link>
                  <a href="#provinces" onClick={scrollToSection("provinces")} className="vnn-dropdown__item" style={{ borderTop: "1px solid #f3f4f6", color: "#00c2cb", fontWeight: 700 }}>
                    <ArrowRight size={15} />
                    <span>{lang === "vi" ? "Tất cả 34 Tỉnh Thành →" : "View All 34 Destinations →"}</span>
                  </a>
                </div>
              </li>

              {/* THINGS TO DO */}
              <li className="vnn-navbar__item">
                <button type="button" className="vnn-navbar__link">
                  <span>{lang === "vi" ? "Trải Nghiệm" : "THINGS TO DO"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
                <div className="vnn-dropdown">
                  <Link href="/guide/10-best-things-to-do-in-ho-chi-minh-city" className="vnn-dropdown__item">
                    <Compass size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "10 Điều Tuyệt Nhất Ở Sài Gòn" : "10 Best Things in HCMC"}</span>
                  </Link>
                  <Link href="/shop" className="vnn-dropdown__item">
                    <CreditCard size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "Chạm Thẻ NFC Lưu Album Kỷ Niệm" : "Tap NFC Cards Experience"}</span>
                  </Link>
                  <a href="#about" onClick={scrollToSection("about")} className="vnn-dropdown__item">
                    <Sparkles size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "Trải Nghiệm Thẻ 3D Tương Tác" : "Interactive 3D Cards"}</span>
                  </a>
                </div>
              </li>

              {/* EAT & DRINK */}
              <li className="vnn-navbar__item">
                <button type="button" className="vnn-navbar__link">
                  <span>{lang === "vi" ? "Ẩm Thực" : "EAT & DRINK"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
                <div className="vnn-dropdown">
                  <Link href="/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods" className="vnn-dropdown__item">
                    <Sparkles size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "12 Món Ăn Phải Thử ở Sài Gòn" : "12 Must-Try Foods in HCMC"}</span>
                  </Link>
                  <Link href="/province/ha-noi" className="vnn-dropdown__item">
                    <Sparkles size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "Ẩm Thực Phố Cổ Hà Nội (Phở, Bún Chả)" : "Hanoi Old Quarter Street Food"}</span>
                  </Link>
                </div>
              </li>

              {/* ITINERARIES */}
              <li className="vnn-navbar__item">
                <button type="button" className="vnn-navbar__link">
                  <span>{lang === "vi" ? "Lịch Trình" : "ITINERARIES"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
                <div className="vnn-dropdown">
                  <Link href="/province/ha-noi" className="vnn-dropdown__item">
                    <Clock size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "Hà Nội - Ninh Bình 3 Ngày 2 Đêm" : "Hanoi - Ninh Binh 3D2N"}</span>
                  </Link>
                  <Link href="/province/ho-chi-minh" className="vnn-dropdown__item">
                    <Clock size={16} className="vnn-dropdown__item-icon" />
                    <span>{lang === "vi" ? "Khám Phá Sài Gòn 2 Ngày 1 Đêm" : "Saigon Explorer 2D1N"}</span>
                  </Link>
                </div>
              </li>

              {/* THẺ NFC STORE */}
              <li className="vnn-navbar__item">
                <Link href="/shop" className="vnn-navbar__link" style={{ color: "#00c2cb" }}>
                  <ShoppingBag size={15} />
                  <span>{lang === "vi" ? "Thẻ NFC" : "NFC SHOP"}</span>
                </Link>
              </li>
            </ul>

            <div className="vnn-navbar__actions">
              <button
                type="button"
                className="vnn-search-btn"
                onClick={() => setSearchModalOpen(true)}
                aria-label="Tìm kiếm nhanh điểm đến"
                title="Tìm kiếm nhanh điểm đến"
              >
                <Search size={18} />
              </button>

              <LanguageSwitch variant="navbar" />

              {user ? (
                <div className="home-navbar__user-wrap" ref={userMenuRef}>
                  <button
                    type="button"
                    className="home-navbar__user-badge-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="User menu"
                  >
                    <div className="home-navbar__avatar">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} />
                      ) : (
                        <span>{user.name?.[0]?.toUpperCase() || "U"}</span>
                      )}
                    </div>
                    <span className="home-navbar__user-name">{user.name}</span>
                    <ChevronDown
                      size={14}
                      className={`home-navbar__chevron ${userDropdownOpen ? "is-open" : ""}`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="home-navbar__user-dropdown">
                      <div className="home-navbar__dropdown-info">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <div className="home-navbar__dropdown-divider" />
                      <Link
                        href={user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
                        className="home-navbar__dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>{user.role === "admin" ? t(lang, "adminPortal") : t(lang, "myCollection")}</span>
                      </Link>
                      {user.role !== "admin" && (
                        <>
                          <Link
                            href="/customer/orders"
                            className="home-navbar__dropdown-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Package size={16} />
                            <span>{t(lang, "myOrders")}</span>
                          </Link>
                          <Link
                            href="/shop"
                            className="home-navbar__dropdown-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <ShoppingBag size={16} />
                            <span>{t(lang, "nfcStore")}</span>
                          </Link>
                          <Link
                            href="/settings/account"
                            className="home-navbar__dropdown-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Settings size={16} />
                            <span>{t(lang, "accountSettings")}</span>
                          </Link>
                        </>
                      )}
                      <div className="home-navbar__dropdown-divider" />
                      <button
                        type="button"
                        className="home-navbar__dropdown-item text-danger"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut size={16} />
                        <span>{t(lang, "logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth" className="home-navbar__login-btn">
                  {t(lang, "signIn")}
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* ─── 3. TRENDING TICKER STRIP (IMAGE 2) ─── */}
        <section className="vnn-ticker-section">
          <div className="vnn-ticker">
            <div className="vnn-ticker__left">
              <span className="vnn-ticker__badge">#TRENDING</span>
              <Link
                href={TRENDING_HERO_STORIES[trendingIndex].link}
                className="vnn-ticker__text"
              >
                {lang === "vi"
                  ? TRENDING_HERO_STORIES[trendingIndex].titleVi
                  : TRENDING_HERO_STORIES[trendingIndex].title}
              </Link>
            </div>
            <div className="vnn-ticker__controls">
              <button
                type="button"
                className="vnn-ticker__btn"
                onClick={() =>
                  setTrendingIndex((prev) =>
                    prev === 0 ? TRENDING_HERO_STORIES.length - 1 : prev - 1
                  )
                }
                aria-label="Previous trending article"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="vnn-ticker__btn"
                onClick={() =>
                  setTrendingIndex((prev) =>
                    (prev + 1) % TRENDING_HERO_STORIES.length
                  )
                }
                aria-label="Next trending article"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ─── 4. MAGAZINE HERO 5-CARD GRID (IMAGE 2 REPLICA) ─── */}
        <section id="home" className="vnn-hero-grid-section">
          <div className="vnn-hero-grid-container">
            {/* BIG CARD BÊN TRÁI (Ha Long Bay) */}
            <Link
              href={TRENDING_HERO_STORIES[0].link}
              className="vnn-card-main"
            >
              <img
                src={TRENDING_HERO_STORIES[0].img}
                alt={TRENDING_HERO_STORIES[0].title}
                className="vnn-card-main__img"
              />
              <div className="vnn-card-main__overlay" />
              <div className="vnn-card-main__body">
                <span className="vnn-card-badge">{TRENDING_HERO_STORIES[0].badge}</span>
                <h2 className="vnn-card-main__title">
                  {lang === "vi"
                    ? TRENDING_HERO_STORIES[0].titleVi
                    : TRENDING_HERO_STORIES[0].title}
                </h2>
                <div className="vnn-card-main__meta">
                  {lang === "vi"
                    ? TRENDING_HERO_STORIES[0].metaVi
                    : TRENDING_HERO_STORIES[0].meta}
                </div>
              </div>
            </Link>

            {/* 4 CARDS BÊN PHẢI (2x2 Grid) */}
            <div className="vnn-sub-grid">
              {/* Card 1: Plan Your Vietnam Trip with Just One Prompt */}
              <Link
                href={TRENDING_HERO_STORIES[1].link}
                className="vnn-card-sub"
              >
                <img
                  src={TRENDING_HERO_STORIES[1].img}
                  alt={TRENDING_HERO_STORIES[1].title}
                  className="vnn-card-sub__img"
                />
                <div className="vnn-card-sub__overlay" />
                <div className="vnn-card-sub__body">
                  <span className="vnn-card-badge">{TRENDING_HERO_STORIES[1].badge}</span>
                  <h3 className="vnn-card-sub__title">
                    {lang === "vi"
                      ? TRENDING_HERO_STORIES[1].titleVi
                      : TRENDING_HERO_STORIES[1].title}
                  </h3>
                </div>
              </Link>

              {/* Card 2: The Complete Guide to Vietnam */}
              <Link
                href={TRENDING_HERO_STORIES[2].link}
                className="vnn-card-sub"
              >
                <img
                  src={TRENDING_HERO_STORIES[2].img}
                  alt={TRENDING_HERO_STORIES[2].title}
                  className="vnn-card-sub__img"
                />
                <div className="vnn-card-sub__overlay" />
                <div className="vnn-card-sub__body">
                  <span className="vnn-card-badge">{TRENDING_HERO_STORIES[2].badge}</span>
                  <h3 className="vnn-card-sub__title">
                    {lang === "vi"
                      ? TRENDING_HERO_STORIES[2].titleVi
                      : TRENDING_HERO_STORIES[2].title}
                  </h3>
                </div>
              </Link>

              {/* Card 3: 20 Best Things to Do in Vietnam */}
              <Link
                href={TRENDING_HERO_STORIES[3].link}
                className="vnn-card-sub"
              >
                <img
                  src={TRENDING_HERO_STORIES[3].img}
                  alt={TRENDING_HERO_STORIES[3].title}
                  className="vnn-card-sub__img"
                />
                <div className="vnn-card-sub__overlay" />
                <div className="vnn-card-sub__body">
                  <span className="vnn-card-badge">{TRENDING_HERO_STORIES[3].badge}</span>
                  <h3 className="vnn-card-sub__title">
                    {lang === "vi"
                      ? TRENDING_HERO_STORIES[3].titleVi
                      : TRENDING_HERO_STORIES[3].title}
                  </h3>
                </div>
              </Link>

              {/* Card 4: Ao Dai – Vietnamese Traditional Dress */}
              <Link
                href={TRENDING_HERO_STORIES[4].link}
                className="vnn-card-sub"
              >
                <img
                  src={TRENDING_HERO_STORIES[4].img}
                  alt={TRENDING_HERO_STORIES[4].title}
                  className="vnn-card-sub__img"
                />
                <div className="vnn-card-sub__overlay" />
                <div className="vnn-card-sub__body">
                  <span className="vnn-card-badge vnn-card-badge--featured">
                    {TRENDING_HERO_STORIES[4].badge}
                  </span>
                  <h3 className="vnn-card-sub__title">
                    {lang === "vi"
                      ? TRENDING_HERO_STORIES[4].titleVi
                      : TRENDING_HERO_STORIES[4].title}
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 5. BE INSPIRED & CONNECT WITH US (SCREENSHOT 2) ─── */}
        <section id="be-inspired" className="vnn-inspired-section">
          <div className="vnn-inspired-container">
            {/* Cột trái: BE INSPIRED */}
            <div className="vnn-inspired-left-col">
              <div className="vnn-section-head">
                <h3 className="vnn-section-head__title">
                  {lang === "vi" ? "BE INSPIRED" : "BE INSPIRED"}
                </h3>
                <span className="vnn-section-head__bar vnn-section-head__bar--red" />
              </div>

              <div className="vnn-inspired-left-grid">
                {/* Bài viết tiêu điểm (Bên trái) */}
                <Link
                  href={BE_INSPIRED_FEATURED.link}
                  className="vnn-featured-article"
                >
                  <div className="vnn-featured-article__img-wrap">
                    <img
                      src={BE_INSPIRED_FEATURED.img}
                      alt={BE_INSPIRED_FEATURED.title}
                      className="vnn-featured-article__img"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="vnn-featured-article__title">
                    {lang === "vi"
                      ? BE_INSPIRED_FEATURED.titleVi
                      : BE_INSPIRED_FEATURED.title}
                  </h4>
                  <div className="vnn-featured-article__meta">
                    {lang === "vi"
                      ? BE_INSPIRED_FEATURED.metaVi
                      : BE_INSPIRED_FEATURED.meta}
                  </div>
                  <p className="vnn-featured-article__desc">
                    {lang === "vi"
                      ? BE_INSPIRED_FEATURED.descVi
                      : BE_INSPIRED_FEATURED.desc}
                  </p>
                </Link>

                {/* Danh sách 5 bài compact (Bên phải) */}
                <div className="vnn-compact-list">
                  {BE_INSPIRED_COMPACT.map((story) => (
                    <Link
                      key={story.title}
                      href={story.link}
                      className="vnn-compact-item"
                    >
                      <img
                        src={story.img}
                        alt={story.title}
                        className="vnn-compact-item__thumb"
                        loading="lazy"
                      />
                      <div className="vnn-compact-item__body">
                        <h5 className="vnn-compact-item__title">
                          {lang === "vi" ? story.titleVi : story.title}
                        </h5>
                        <div className="vnn-compact-item__date">
                          {lang === "vi" ? story.dateVi : story.date}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải: CONNECT WITH US */}
            <div className="vnn-connect-col">
              <div className="vnn-section-head">
                <h3 className="vnn-section-head__title">
                  {lang === "vi" ? "CONNECT WITH US" : "CONNECT WITH US"}
                </h3>
                <span className="vnn-section-head__bar vnn-section-head__bar--green" />
              </div>

              {/* 3 Thẻ thống kê mạng xã hội */}
              <div className="vnn-social-stats">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vnn-social-stat-card"
                >
                  <Facebook size={22} className="vnn-social-icon vnn-social-icon--fb" />
                  <span className="vnn-social-num">550,562</span>
                  <span className="vnn-social-label">Fans</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vnn-social-stat-card"
                >
                  <Instagram size={22} className="vnn-social-icon vnn-social-icon--ig" />
                  <span className="vnn-social-num">18,220</span>
                  <span className="vnn-social-label">Followers</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vnn-social-stat-card"
                >
                  <Youtube size={22} className="vnn-social-icon vnn-social-icon--yt" />
                  <span className="vnn-social-num">5,530</span>
                  <span className="vnn-social-label">Subscribers</span>
                </a>
              </div>

              {/* Banner AI Companion quảng bá */}
              <div
                className="vnn-ai-sidebar-banner"
                onClick={() => setAiCompanionOpen(true)}
                role="button"
                tabIndex={0}
                title="TRAVEL SMARTER WITH AI-COMPANION"
              >
                <img
                  src="/guide/hcmc/ai-companion-sidebar-banner.jpg"
                  alt="Travel Smarter With AI-Companion"
                  className="vnn-ai-sidebar-banner__img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. TOP DESTINATIONS (SCREENSHOT 3) ─── */}
        <section id="top-destinations" className="vnn-destinations-section">
          <div className="vnn-destinations-container">
            <div className="vnn-section-head">
              <h3 className="vnn-section-head__title">
                {lang === "vi" ? "TOP DESTINATIONS" : "TOP DESTINATIONS"}
              </h3>
              <span className="vnn-section-head__bar vnn-section-head__bar--cyan" />
            </div>

            <div className="vnn-destinations-grid" ref={topDestTrackRef}>
              {TOP_DESTINATIONS_DATA.map((dest) => (
                <Link
                  key={dest.id}
                  href={dest.link}
                  className="vnn-dest-card"
                >
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="vnn-dest-card__img"
                    loading="lazy"
                  />
                  <div className="vnn-dest-card__overlay" />
                  <h4 className="vnn-dest-card__name">
                    {lang === "vi" ? dest.nameVi : dest.name}
                  </h4>
                </Link>
              ))}
            </div>

            <div className="vnn-carousel-ctrls">
              <button
                type="button"
                className="vnn-carousel-ctrl-btn"
                onClick={() => scrollDestTrack(-1)}
                aria-label="Previous destination"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="vnn-carousel-ctrl-btn"
                onClick={() => scrollDestTrack(1)}
                aria-label="Next destination"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ─── 7. REGIONAL DESTINATIONS 3 COLUMNS (SCREENSHOT 4) ─── */}
        <section id="regions" className="vnn-regions-section">
          <div className="vnn-regions-container">
            {REGIONAL_DESTINATIONS_DATA.map((reg) => (
              <div key={reg.regionId} className="vnn-region-col">
                <div className="vnn-section-head">
                  <h3 className="vnn-section-head__title">
                    {lang === "vi" ? reg.regionNameVi : reg.regionName}
                  </h3>
                  <span className={`vnn-section-head__bar ${reg.barColorClass}`} />
                </div>

                <Link
                  href={reg.featured.link}
                  className="vnn-region-main"
                >
                  <div className="vnn-region-main__img-wrap">
                    <img
                      src={reg.featured.img}
                      alt={reg.featured.title}
                      className="vnn-region-main__img"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="vnn-region-main__title">
                    {lang === "vi" ? reg.featured.titleVi : reg.featured.title}
                  </h4>
                  <p className="vnn-region-main__desc">
                    {lang === "vi" ? reg.featured.descVi : reg.featured.desc}
                  </p>
                </Link>

                <div className="vnn-region-minis">
                  {reg.minis.map((mini) => (
                    <Link
                      key={mini.title}
                      href={mini.link}
                      className="vnn-region-mini-item"
                    >
                      <img
                        src={mini.img}
                        alt={mini.title}
                        className="vnn-region-mini-item__thumb"
                        loading="lazy"
                      />
                      <span className="vnn-region-mini-item__title">
                        {lang === "vi" ? mini.titleVi : mini.title}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="vnn-carousel-ctrls">
                  <button
                    type="button"
                    className="vnn-carousel-ctrl-btn"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="vnn-carousel-ctrl-btn"
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 8. VIDEO TRAVEL GUIDES (SCREENSHOT 5) ─── */}
        <section id="videos" className="vnn-video-section">
          <div className="vnn-video-container">
            {/* Top Video Grid: Player on Left, Playlist on Right */}
            <div className="vnn-video-top-grid">
              {/* Featured Video Player */}
              <div className="vnn-video-player-wrap">
                {isVideoPlaying ? (
                  <iframe
                    className="vnn-video-player-iframe"
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="vnn-video-player-cover"
                    style={{ backgroundImage: `url(${activeVideo.img})` }}
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <button
                      type="button"
                      className="vnn-video-player-center-btn"
                      aria-label="Play Video"
                    >
                      <Play size={24} fill="#ffffff" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Playlist */}
              <div className="vnn-video-playlist">
                <div className="vnn-video-playlist-head">
                  <span className="vnn-video-playlist-head-title">
                    {lang === "vi" ? activeVideo.titleVi : activeVideo.title}
                  </span>
                  <span className="vnn-video-playlist-head-time">
                    {activeVideo.duration}
                  </span>
                </div>

                <div className="vnn-video-playlist-items">
                  {VIDEO_PLAYLIST_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className={`vnn-video-playlist-item ${activeVideo.id === item.id ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveVideo(item);
                        setIsVideoPlaying(true);
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="vnn-video-playlist-item__thumb"
                      />
                      <div className="vnn-video-playlist-item__info">
                        <div className="vnn-video-playlist-item__title">
                          {lang === "vi" ? item.titleVi : item.title}
                        </div>
                        <span className="vnn-video-playlist-item__duration">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom 4 Video Cards */}
            <div className="vnn-video-bottom-cards">
              {VIDEO_BOTTOM_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="vnn-video-card"
                  onClick={() => {
                    const match = VIDEO_PLAYLIST_ITEMS.find((v) => v.youtubeId === card.youtubeId);
                    if (match) setActiveVideo(match);
                    setIsVideoPlaying(true);
                    const el = document.getElementById("videos");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="vnn-video-card__thumb-wrap">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="vnn-video-card__img"
                      loading="lazy"
                    />
                    <div className="vnn-video-card__play-icon">
                      <Play size={16} fill="#ffffff" />
                    </div>
                    <span className="vnn-video-card__duration">
                      {card.duration}
                    </span>
                  </div>
                  <h4 className="vnn-video-card__title">
                    {card.title}
                  </h4>
                </div>
              ))}
            </div>

            <div className="vnn-carousel-ctrls" style={{ marginTop: "16px" }}>
              <button
                type="button"
                className="vnn-carousel-ctrl-btn"
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="vnn-carousel-ctrl-btn"
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ─── 9. FOODS TO TRY & THINGS TO DO (SCREENSHOT 2 OF PART 2) ─── */}
        <section className="vnn-foods-things-section">
          <div className="vnn-foods-things-container">
            {/* Left: FOODS TO TRY (Yellow bar) */}
            <div className="vnn-foods-col">
              <div className="vnn-section-head">
                <h3 className="vnn-section-head__title">
                  {lang === "vi" ? "MÓN ĂN NÊN THỬ" : "FOODS TO TRY"}
                </h3>
                <span className="vnn-section-head__bar vnn-section-head__bar--yellow" />
              </div>

              <div className="vnn-foods-list">
                {FOODS_TO_TRY_ITEMS.map((item) => (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="vnn-food-item"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="vnn-food-item__thumb"
                      loading="lazy"
                    />
                    <div className="vnn-food-item__body">
                      <h4 className="vnn-food-item__title">
                        {lang === "vi" ? item.titleVi : item.title}
                      </h4>
                      <p className="vnn-food-item__desc">
                        {lang === "vi" ? item.descVi : item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: THINGS TO DO (Pink bar) */}
            <div className="vnn-things-col">
              <div className="vnn-section-head">
                <h3 className="vnn-section-head__title">
                  {lang === "vi" ? "TRẢI NGHIỆM ĐÁNG THỬ" : "THINGS TO DO"}
                </h3>
                <span className="vnn-section-head__bar vnn-section-head__bar--pink" />
              </div>

              <div className="vnn-things-list">
                {THINGS_TO_DO_ITEMS.map((item) => (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="vnn-thing-card"
                  >
                    <div className="vnn-thing-card__img-wrap">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="vnn-thing-card__img"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="vnn-thing-card__title">
                      {lang === "vi" ? item.titleVi : item.title}
                    </h4>
                    <p className="vnn-thing-card__desc">
                      {lang === "vi" ? item.descVi : item.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="vnn-carousel-ctrls" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 10. 4 TRAVEL PILLARS (SCREENSHOT 3 OF PART 2) ─── */}
        <section className="vnn-pillars-section">
          <div className="vnn-pillars-container">
            {TRAVEL_PILLARS.map((p) => (
              <Link key={p.title} href={p.link} className="vnn-pillar-card">
                <img
                  src={p.img}
                  alt={p.title}
                  className="vnn-pillar-card__img"
                  loading="lazy"
                />
                <div className="vnn-pillar-card__overlay" />
                <h4 className="vnn-pillar-card__title">
                  {lang === "vi" ? p.titleVi : p.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── 11. LATEST ARTICLES & POPULAR POSTS (SCREENSHOT 4 OF PART 2) ─── */}
        <section className="vnn-articles-popular-section">
          <div className="vnn-articles-popular-container">
            {/* Left Column: LATEST ARTICLES (Cyan bar) */}
            <div className="vnn-latest-col">
              <div className="vnn-section-head">
                <h3 className="vnn-section-head__title">
                  {lang === "vi" ? "BÀI VIẾT MỚI NHẤT" : "LATEST ARTICLES"}
                </h3>
                <span className="vnn-section-head__bar vnn-section-head__bar--cyan" />
              </div>

              <div className="vnn-latest-grid">
                {LATEST_ARTICLES_ITEMS.map((item) => (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="vnn-latest-card"
                  >
                    <div className="vnn-latest-card__img-wrap">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="vnn-latest-card__img"
                        loading="lazy"
                      />
                    </div>
                    <span className="vnn-latest-card__badge">{item.badge}</span>
                    <h4 className="vnn-latest-card__title">
                      {lang === "vi" ? item.titleVi : item.title}
                    </h4>
                    <div className="vnn-latest-card__meta">
                      {lang === "vi" ? item.metaVi : item.meta}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="vnn-carousel-ctrls">
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Column: POPULAR POSTS (Blue bar) */}
            <div className="vnn-popular-col">
              <div className="vnn-section-head">
                <h3 className="vnn-section-head__title">
                  {lang === "vi" ? "BÀI ĐƯỢC ĐỌC NHIỀU" : "POPULAR POSTS"}
                </h3>
                <span className="vnn-section-head__bar vnn-section-head__bar--blue" />
              </div>

              <div className="vnn-popular-list">
                {POPULAR_POSTS_ITEMS.map((item) => (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="vnn-popular-item"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="vnn-popular-item__thumb"
                      loading="lazy"
                    />
                    <h4 className="vnn-popular-item__title">
                      {lang === "vi" ? item.titleVi : item.title}
                    </h4>
                  </Link>
                ))}
              </div>

              <div className="vnn-carousel-ctrls">
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 12. CLEAN EDITORIAL FOOTER (SCREENSHOT 5 OF PART 2) ─── */}
        <footer className="vnn-clean-footer">
          <div className="vnn-clean-footer__container">
            <div className="vnn-clean-footer__logo-wrap">
              <Link href="/">
                <img
                  src="/guide/hcmc/Vietnamnomad-logo-by-Welcome-to-Vietnam-official.png"
                  alt="Welcome to Vietnam"
                  className="vnn-clean-footer__logo"
                />
              </Link>
            </div>

            {/* Social Icons */}
            <div className="vnn-clean-footer__socials">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="vnn-clean-footer__social-link"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="vnn-clean-footer__social-link"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="vnn-clean-footer__social-link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="vnn-clean-footer__social-link"
              >
                <Youtube size={19} />
              </a>
            </div>

            {/* 4 Navigation Columns */}
            <div className="vnn-clean-footer__grid">
              <div className="vnn-clean-footer__col">
                <div className="vnn-clean-footer__col-title">
                  {lang === "vi" ? "Điểm đến hàng đầu" : "Top Destinations"}
                </div>
                <div className="vnn-clean-footer__col-links">
                  <Link
                    href="/province/ho-chi-minh"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
                  </Link>
                  <Link
                    href="/province/ha-noi"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Hà Nội" : "Hanoi"}
                  </Link>
                  <Link
                    href="/province/da-nang"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Đà Nẵng" : "Da Nang"}
                  </Link>
                  <Link
                    href="/province/hai-phong"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Hội An / Hải Phòng" : "Hoi An"}
                  </Link>
                </div>
              </div>

              <div className="vnn-clean-footer__col">
                <div className="vnn-clean-footer__col-title">
                  {lang === "vi" ? "Cẩm nang du lịch" : "Travel Guide"}
                </div>
                <div className="vnn-clean-footer__col-links">
                  <Link
                    href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Điểm đến tuyệt nhất" : "Best places"}
                  </Link>
                  <Link
                    href="/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Món ăn ngon nhất" : "Best dishes"}
                  </Link>
                  <Link
                    href="/province/ha-noi"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Trải nghiệm nên thử" : "Things to do"}
                  </Link>
                  <Link
                    href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Visa du lịch Việt Nam" : "Vietnam visa"}
                  </Link>
                </div>
              </div>

              <div className="vnn-clean-footer__col">
                <div className="vnn-clean-footer__col-title">
                  {lang === "vi" ? "Tài nguyên hữu ích" : "Helpful Resources"}
                </div>
                <div className="vnn-clean-footer__col-links">
                  <Link
                    href="/province/ha-noi"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Bản đồ Việt Nam" : "Map of Vietnam"}
                  </Link>
                  <Link
                    href="/province/da-nang"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Khách sạn lưu trú" : "Accommodation"}
                  </Link>
                  <Link href="/shop" className="vnn-clean-footer__link">
                    {lang === "vi" ? "Hội viên VinaTap" : "Membership"}
                  </Link>
                  <Link
                    href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Sách cẩm nang điện tử" : "eBook"}
                  </Link>
                </div>
              </div>

              <div className="vnn-clean-footer__col">
                <div className="vnn-clean-footer__col-title">
                  {lang === "vi" ? "Về chúng tôi" : "About Us"}
                </div>
                <div className="vnn-clean-footer__col-links">
                  <Link href="/#about" className="vnn-clean-footer__link">
                    {lang === "vi" ? "Về chúng tôi" : "About us"}
                  </Link>
                  <Link href="/policy" className="vnn-clean-footer__link">
                    {lang === "vi" ? "Chính sách bảo mật" : "Privacy policy"}
                  </Link>
                  <Link href="/#faq" className="vnn-clean-footer__link">
                    {lang === "vi" ? "Cộng đồng xê dịch" : "Our community"}
                  </Link>
                  <Link href="/policy#support" className="vnn-clean-footer__link">
                    {lang === "vi" ? "Hợp tác đồng hành" : "Partner with us"}
                  </Link>
                </div>
              </div>
            </div>

            {/* Copyright Line */}
            <div className="vnn-clean-footer__bottom">
              © 2026 Welcome to Vietnam. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Modal tìm kiếm toàn trang khi bấm biểu tượng kính lúp trên Navbar */}
        {searchModalOpen && (
          <div
            className="vnn-search-modal-backdrop"
            onClick={() => setSearchModalOpen(false)}
          >
            <div
              className="vnn-search-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="vnn-search-modal__head">
                <Search size={20} className="vnn-search-modal__icon" />
                <input
                  type="text"
                  autoFocus
                  placeholder={
                    isVi
                      ? "Tìm kiếm điểm đến, bài viết, di sản 34 tỉnh thành..."
                      : "Search destinations, articles, 34 provinces heritage..."
                  }
                  value={searchModalText}
                  onChange={(e) => setSearchModalText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchModalText.trim()) {
                      const match = provinces.find((p) =>
                        p.name
                          .toLowerCase()
                          .includes(searchModalText.toLowerCase().trim())
                      );
                      if (match) {
                        router.push(`/province/${match.slug}`);
                        setSearchModalOpen(false);
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="vnn-search-modal__close"
                  onClick={() => setSearchModalOpen(false)}
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="vnn-search-modal__results">
                {searchModalText.trim() ? (
                  provinces
                    .filter(
                      (p) =>
                        p.name
                          .toLowerCase()
                          .includes(searchModalText.toLowerCase().trim()) ||
                        p.slug
                          .toLowerCase()
                          .includes(searchModalText.toLowerCase().trim())
                    )
                    .slice(0, 6)
                    .map((p) => (
                      <Link
                        key={p.slug}
                        href={`/province/${p.slug}`}
                        className="vnn-search-modal__item"
                        onClick={() => setSearchModalOpen(false)}
                      >
                        <span className="vnn-search-modal__item-name">
                          {p.name}
                        </span>
                        <span className="vnn-search-modal__item-desc">
                          {p.region || "Việt Nam"}
                        </span>
                      </Link>
                    ))
                ) : (
                  <div className="vnn-search-modal__quick">
                    <span className="vnn-search-modal__quick-label">
                      {isVi ? "Điểm đến phổ biến:" : "Popular destinations:"}
                    </span>
                    {provinces.slice(0, 6).map((p) => (
                      <Link
                        key={p.slug}
                        href={`/province/${p.slug}`}
                        className="vnn-search-modal__tag"
                        onClick={() => setSearchModalOpen(false)}
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nút Trợ lý AI Du lịch Floating Widget (giống góc phải dưới hình 2) */}
        <div className="vnn-floating-widget">
          <button
            type="button"
            className="vnn-floating-widget__btn"
            onClick={() => setAiCompanionOpen((prev) => !prev)}
            aria-label="Open AI Travel Companion"
          >
            <span className="vnn-floating-widget__pill">Tripion AI</span>
            <span className="vnn-floating-widget__avatar">
              <img
                src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
                alt="AI Companion"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="vnn-floating-widget__pulse" />
            </span>
          </button>
        </div>

        {/* Hộp chat Trợ lý Du lịch Thông minh VinaTap AI */}
        <ProvinceChatbot
          province={{ name: isVi ? "Việt Nam" : "Vietnam", slug: "viet-nam" }}
          isOpen={aiCompanionOpen}
          onToggleOpen={setAiCompanionOpen}
        />
      </div>
    </>
  );
}

// Bọc 1 section bằng hiệu ứng "hiện dần khi cuộn tới" — dùng chung cho
// tất cả section trừ Hero (Hero luôn hiện ngay khi tải trang, không cần
// hiệu ứng chờ cuộn).
function RevealSection({ children, className = "", id }) {
  const [ref, visible] = useReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="home-footer__col-title">{title}</div>
      <div className="home-footer__col-links">
        {links.map((l) => (
          <Link key={l.label} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
