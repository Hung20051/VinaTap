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
    link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
    meta: "VinaTap - June 16, 2026",
    metaVi: "VinaTap • 16 Tháng 6, 2026",
    img: "/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg",
  },
  {
    id: "plan-trip",
    badge: "#TRENDING",
    title: "Plan Your Vietnam Trip with Just One Prompt",
    titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một câu lệnh AI",
    link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
    meta: "AI Travel Assistant",
    metaVi: "Trợ lý du lịch Thổ Địa AI",
    img: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
  },
  {
    id: "complete-guide",
    badge: "#TRENDING",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam",
    link: "/guide/the-complete-guide-to-vietnam",
    meta: "Heritage & Travel Guide",
    metaVi: "Di sản & Cẩm nang du lịch",
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

// ─── BE INSPIRED STORIES (SCREENSHOT 1) ───
const BE_INSPIRED_FEATURED = {
  title: "3-week Vietnam Itinerary",
  titleVi: "3-week Vietnam Itinerary",
  meta: "VinaTap - July 20, 2025",
  metaVi: "VinaTap • 20 Tháng 7, 2025",
  desc: "Discover our 3-week Vietnam itinerary, featuring 7 must-visit destinations. This guide includes detailed maps, routes, and cost breakdowns to help you plan your trip.",
  descVi: "Discover our 3-week Vietnam itinerary, featuring 7 must-visit destinations. This guide includes detailed maps, routes, and cost breakdowns to help you plan your trip.",
  img: "/guide/hcmc/3-week-vietnam-itinerary.jpg",
  link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
};

const BE_INSPIRED_COMPACT = [
  {
    title: "8 must-try foods in Hanoi",
    titleVi: "8 must-try foods in Hanoi",
    date: "May 19, 2025",
    dateVi: "May 19, 2025",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    link: "/province/ha-noi",
  },
  {
    title: "10 best things to do in Ho Chi Minh City",
    titleVi: "10 best things to do in Ho Chi Minh City",
    date: "May 5, 2025",
    dateVi: "May 5, 2025",
    img: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
  },
  {
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 must-try foods in Ho Chi Minh City",
    date: "April 25, 2025",
    dateVi: "April 25, 2025",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods",
  },
  {
    title: "12 best attractions in Ho Chi Minh City",
    titleVi: "12 best attractions in Ho Chi Minh City",
    date: "April 18, 2025",
    dateVi: "April 18, 2025",
    img: "/guide/hcmc/hcmc-12-attractions-sunset.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    title: "5 best Vung Tau beaches",
    titleVi: "5 best Vung Tau beaches",
    date: "April 9, 2025",
    dateVi: "April 9, 2025",
    img: "/guide/hcmc/vung-tau-beaches-peninsula.jpg",
    link: "/province/hai-phong",
  },
];

// ─── TOP DESTINATIONS (SCREENSHOT 2) ───
const TOP_DESTINATIONS_DATA = [
  {
    id: "hcmc",
    name: "Ho Chi Minh City",
    nameVi: "Ho Chi Minh City",
    img: "/guide/hcmc/top-dest-hcmc.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    id: "danang",
    name: "Da Nang",
    nameVi: "Da Nang",
    img: "/guide/hcmc/top-dest-danang.jpg",
    link: "/province/da-nang",
  },
  {
    id: "hanoi",
    name: "Hanoi",
    nameVi: "Hanoi",
    img: "/guide/hcmc/top-dest-hanoi.jpg",
    link: "/province/ha-noi",
  },
  {
    id: "hoian",
    name: "Hoi An",
    nameVi: "Hoi An",
    img: "/guide/hcmc/top-dest-hoian.jpg",
    link: "/province/da-nang",
  },
];

// ─── REGIONAL DESTINATIONS 3 COLUMNS (SCREENSHOT 3) ───
const REGIONAL_DESTINATIONS_DATA = [
  {
    regionId: "north",
    regionName: "NORTHERN VIETNAM",
    regionNameVi: "NORTHERN VIETNAM",
    barColorClass: "vnn-section-head__bar--purple",
    featured: {
      title: "Hanoi",
      titleVi: "Hanoi",
      desc: "Follow this guide and you will understand why Hanoi is a perfect coming together of the timeless cultural value of the old and the dynamic and colorful vibes of the new.",
      descVi: "Follow this guide and you will understand why Hanoi is a perfect coming together of the timeless cultural value of the old and the dynamic and colorful vibes of the new.",
      img: "/guide/hcmc/region-north-hanoi.jpg",
      link: "/province/ha-noi",
    },
    minis: [
      {
        title: "Hanoi Tourist Map",
        titleVi: "Hanoi Tourist Map",
        img: "/guide/hcmc/region-north-map.jpg",
        link: "/province/ha-noi",
      },
      {
        title: "Ha Giang",
        titleVi: "Ha Giang",
        img: "/guide/hcmc/region-north-hagiang.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  {
    regionId: "central",
    regionName: "CENTRAL VIETNAM",
    regionNameVi: "CENTRAL VIETNAM",
    barColorClass: "vnn-section-head__bar--orange",
    featured: {
      title: "Da Nang",
      titleVi: "Da Nang",
      desc: "This is an all-in-one Da Nang travel guide. Learn about the most necessary information about Da Nang tourism such as attractions, dishes, hotels, restaurants, and more.",
      descVi: "This is an all-in-one Da Nang travel guide. Learn about the most necessary information about Da Nang tourism such as attractions, dishes, hotels, restaurants, and more.",
      img: "/guide/hcmc/region-central-danang.jpg",
      link: "/province/da-nang",
    },
    minis: [
      {
        title: "The 10 best attractions in Da Nang",
        titleVi: "The 10 best attractions in Da Nang",
        img: "/guide/hcmc/region-central-10things.jpg",
        link: "/province/da-nang",
      },
      {
        title: "Nha Trang",
        titleVi: "Nha Trang",
        img: "/guide/hcmc/region-central-nhatrang.jpg",
        link: "/province/da-nang",
      },
    ],
  },
  {
    regionId: "south",
    regionName: "SOUTHERN VIETNAM",
    regionNameVi: "SOUTHERN VIETNAM",
    barColorClass: "vnn-section-head__bar--cyan",
    featured: {
      title: "Ho Chi Minh City",
      titleVi: "Ho Chi Minh City",
      desc: "Ho Chi Minh City, or as it is often called intimately by the locals as Saigon, is one of the sought-after destinations while travelling in Vietnam. Saigon of the modern times attracts people not for the spectacular natural landscapes but for its dynamic lifestyle – where endless options of activities are going to tie your heart.",
      descVi: "Ho Chi Minh City, or as it is often called intimately by the locals as Saigon, is one of the sought-after destinations while travelling in Vietnam. Saigon of the modern times attracts people not for the spectacular natural landscapes but for its dynamic lifestyle – where endless options of activities are going to tie your heart.",
      img: "/guide/hcmc/region-south-hcmc.jpg",
      link: "/province/ho-chi-minh",
    },
    minis: [
      {
        title: "Ho Chi Minh City Tourist Map",
        titleVi: "Ho Chi Minh City Tourist Map",
        img: "/guide/hcmc/region-south-map.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        title: "12 best attractions in Ho Chi Minh City",
        titleVi: "12 best attractions in Ho Chi Minh City",
        img: "/guide/hcmc/region-south-12attractions.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
    ],
  },
];

// ─── VIDEO TRAVEL GUIDES (SCREENSHOT 4) ───
const VIDEO_PLAYLIST_ITEMS = [
  {
    id: "video-1",
    youtubeId: "BvP3G1Xfth8",
    title: "Vietnam Travel Guide: Climate, Visas, Destinations, Cuisine & Tips",
    titleVi: "Vietnam Travel Guide: Climate, Visas, Destinations, Cuisine & Tips",
    duration: "21:35",
    img: "/guide/hcmc/video-player-sapa-cover.jpg",
  },
  {
    id: "video-2",
    youtubeId: "Nm0T5lPAT7U",
    title: "Hoi An: A Guide to Visiting the Most Beautiful Ancient Town in",
    titleVi: "Hoi An: A Guide to Visiting the Most Beautiful Ancient Town in",
    duration: "14:23",
    img: "/guide/hcmc/video-card-hoian.jpg",
  },
  {
    id: "video-3",
    youtubeId: "BvP3G1Xfth8",
    title: "Da Nang: A Guide to Visiting the Most Livable City in Vietnam",
    titleVi: "Da Nang: A Guide to Visiting the Most Livable City in Vietnam",
    duration: "12:41",
    img: "/guide/hcmc/region-central-danang.jpg",
  },
  {
    id: "video-4",
    youtubeId: "1WdDnbnwTcI",
    title: "Hue: A Guide to Visiting the Ancient Capital of Vietnam",
    titleVi: "Hue: A Guide to Visiting the Ancient Capital of Vietnam",
    duration: "13:14",
    img: "/guide/hcmc/video-card-hue.jpg",
  },
  {
    id: "video-5",
    youtubeId: "2QbOPAKrsg4",
    title: "10 Best Places to Visit in Vietnam Voted by 7,050 Travelers",
    titleVi: "10 Best Places to Visit in Vietnam Voted by 7,050 Travelers",
    duration: "09:53",
    img: "/guide/hcmc/video-card-best10.jpg",
  },
  {
    id: "video-6",
    youtubeId: "BvP3G1Xfth8",
    title: "Da Lat: A Guide to Visiting Vietnam's Little Paris",
    titleVi: "Da Lat: A Guide to Visiting Vietnam's Little Paris",
    duration: "11:15",
    img: "/guide/megamenu/dest-2-dalat.jpg",
  },
  {
    id: "video-7",
    youtubeId: "BvP3G1Xfth8",
    title: "Nha Trang: A Guide to Visiting Vietnam's Sea Paradise",
    titleVi: "Nha Trang: A Guide to Visiting Vietnam's Sea Paradise",
    duration: "11:37",
    img: "/guide/hcmc/region-central-nhatrang.jpg",
  },
];

const VIDEO_BOTTOM_CARDS = [
  {
    title: "[Video] Vietnam Travel Guide: Climate, Visas, Destinations, Cuisine & Tips",
    duration: "00:21:35",
    img: "/guide/hcmc/video-card-vietnam.jpg",
    youtubeId: "BvP3G1Xfth8",
  },
  {
    title: "[Video] Hue: A Guide to Visiting the Ancient Capital of Vietnam",
    duration: "00:13:14",
    img: "/guide/hcmc/video-card-hue.jpg",
    youtubeId: "1WdDnbnwTcI",
  },
  {
    title: "[Video] 10 Best Places to Visit in Vietnam Voted by 7,050 Travelers",
    duration: "00:09:53",
    img: "/guide/hcmc/video-card-best10.jpg",
    youtubeId: "2QbOPAKrsg4",
  },
  {
    title: "[Video] Hoi An: A Guide to Visiting the Most Beautiful Ancient Town in Vietnam",
    duration: "00:14:23",
    img: "/guide/hcmc/video-card-hoian.jpg",
    youtubeId: "Nm0T5lPAT7U",
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
    img: "/guide/hcmc/region-central-10things.jpg",
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
    meta: "VinaTap - June 16, 2026",
    metaVi: "VinaTap • 16 Tháng 6, 2026",
    img: "/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg",
    link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
  },
  {
    badge: "#TRENDING",
    title: "Plan Your Vietnam Trip with Just One Prompt",
    titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một câu lệnh AI",
    meta: "VinaTap - April 1, 2026",
    metaVi: "VinaTap • 1 Tháng 4, 2026",
    img: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
    link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
  },
  {
    badge: "#TRENDING",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam",
    meta: "VinaTap - January 9, 2026",
    metaVi: "VinaTap • 9 Tháng 1, 2026",
    img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
  },
  {
    badge: "MEMBERSHIP",
    title: "Accommodation in Vietnam",
    titleVi: "Khách sạn & Nơi lưu trú tại Việt Nam",
    meta: "VinaTap - December 16, 2025",
    metaVi: "VinaTap • 16 Tháng 12, 2025",
    img: "/guide/hcmc/accommodation-in-vietnam.jpg",
    link: "/province/da-nang",
  },
  {
    badge: "HO CHI MINH CITY",
    title: "Where to Stay in Ho Chi Minh City",
    titleVi: "Khách sạn & Khu vực nên ở tại TP. Hồ Chí Minh",
    meta: "VinaTap - November 26, 2025",
    metaVi: "VinaTap • 26 Tháng 11, 2025",
    img: "/guide/hcmc/region-south-hcmc.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    badge: "WEATHER",
    title: "Vietnam Weather Map for September",
    titleVi: "Bản đồ dự báo thời tiết du lịch Việt Nam",
    meta: "VinaTap - November 12, 2025",
    metaVi: "VinaTap • 12 Tháng 11, 2025",
    img: "/guide/hcmc/vietnam-weather-map.jpg",
    link: "/province/ha-noi",
  },
];

// ─── POPULAR POSTS (SCREENSHOT 4 OF PART 2) ───
const POPULAR_POSTS_ITEMS = [
  {
    title: "Ho Chi Minh City",
    titleVi: "TP. Hồ Chí Minh",
    img: "/guide/hcmc/region-south-hcmc.jpg",
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
    img: "/guide/hcmc/region-north-hanoi.jpg",
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

const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
        date: "June 16, 2026",
        dateVi: "16 Tháng 6, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-1.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
      {
        id: "insp-2",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        date: "April 1, 2026",
        dateVi: "1 Tháng 4, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "January 9, 2026",
        dateVi: "9 Tháng 1, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "insp-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "December 31, 2024",
        dateVi: "31 Tháng 12, 2024",
        badge: "Featured Articles",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
    ],
  },
  destinations: {
    items: [
      {
        id: "dest-1",
        title: "Ho Chi Minh City",
        titleVi: "Thành phố Hồ Chí Minh",
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "November 14, 2024",
        dateVi: "14 Tháng 11, 2024",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/lam-dong",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "November 12, 2024",
        dateVi: "12 Tháng 11, 2024",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/quang-nam",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "July 25, 2024",
        dateVi: "25 Tháng 7, 2024",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "June 15, 2022",
        dateVi: "15 Tháng 6, 2022",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  things: {
    items: [
      {
        id: "todo-1",
        title: "3 week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 điều tuyệt nhất ở TP. Hồ Chí Minh",
        date: "May 5, 2025",
        dateVi: "5 Tháng 5, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 hoạt động không thể bỏ qua tại Nha Trang",
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm hàng đầu ở Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan tuyệt nhất Đà Lạt",
        date: "July 21, 2024",
        dateVi: "21 Tháng 7, 2024",
        badge: "Articles",
        img: "/guide/megamenu/todo-5-dalat.jpg",
        link: "/province/lam-dong",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ngon nhất định phải thử ở Hà Nội",
        date: "May 19, 2025",
        dateVi: "19 Tháng 5, 2025",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "April 26, 2025",
        dateVi: "26 Tháng 4, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods",
      },
      {
        id: "eat-3",
        title: "Pho",
        titleVi: "Phở truyền thống",
        date: "April 3, 2025",
        dateVi: "3 Tháng 4, 2025",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn tuyệt vời tại Vũng Tàu",
        date: "April 1, 2025",
        dateVi: "1 Tháng 4, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/hai-phong",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang",
        date: "February 17, 2025",
        dateVi: "17 Tháng 2, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-5-nhatrang.jpg",
        link: "/province/da-nang",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        date: "May 21, 2024",
        dateVi: "21 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "May 20, 2024",
        dateVi: "20 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "May 18, 2024",
        dateVi: "18 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
    ],
  },
};


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
      q: "VinaTap là nền tảng gì?",
      category: "about",
      a: "VinaTap là cổng thông tin cẩm nang du lịch số hiện đại và trợ lý AI thông minh đồng hành cùng bạn khám phá 34 tỉnh thành khắp dải đất hình chữ S Việt Nam.\n• Cung cấp gợi ý điểm đến nổi bật, lịch trình chi tiết và đặc sản ẩm thực từng vùng miền.\n• Tích hợp trợ lý du lịch AI hỗ trợ giải đáp 24/7.",
    },
    {
      q: "Làm thế nào để lên kế hoạch du lịch bằng AI Prompt?",
      category: "ai",
      a: "Bạn chỉ cần gửi 1 câu hỏi hoặc yêu cầu cho Trợ lý ảo AI (ví dụ: 'Lên lịch trình 3 ngày 2 đêm tại Đà Nẵng với ngân sách 3 triệu'). AI sẽ tự động phân tích và tạo lịch trình hoàn chỉnh từ điểm vui chơi, thời gian di chuyển đến địa chỉ ăn uống nổi tiếng.",
    },
    {
      q: "Cẩm nang 34 tỉnh thành cung cấp những thông tin gì?",
      category: "destination",
      a: "Mỗi trang cẩm nang tỉnh thành bao gồm:\n• Giới thiệu tổng quan & nét đặc trưng văn hóa.\n• Danh sách các điểm tham quan biểu tượng kèm bản đồ.\n• Top món ngon đặc sản địa phương phải thử.\n• Gợi ý lịch trình du lịch từ 1 đến 3 ngày tối ưu thời gian.",
    },
    {
      q: "Trợ lý ảo Thổ Địa AI hỗ trợ được những gì?",
      category: "features",
      a: "Thổ Địa AI là người bạn đồng hành bản địa am hiểu sâu sắc về du lịch Việt Nam:\n• Gợi ý quán ăn ngon chuẩn vị bản xứ.\n• Tư vấn thời điểm du lịch đẹp nhất trong năm.\n• Dự báo thời tiết, phương tiện di chuyển và chi phí dự kiến.\n• Hỗ trợ song ngữ cả Tiếng Việt và Tiếng Anh.",
    },
    {
      q: "Nền tảng VinaTap có thu phí sử dụng không?",
      category: "free",
      a: "Toàn bộ cẩm nang du lịch 34 tỉnh thành, các bài viết kinh nghiệm và tính năng trò chuyện với Trợ lý ảo AI trên VinaTap đều hoàn toàn MIỄN PHÍ dành cho cộng đồng du lịch.",
    },
  ],
  en: [
    {
      q: "What is VinaTap?",
      category: "about",
      a: "VinaTap is a premier digital travel guide and AI-powered companion exploring Vietnam's 34 diverse provinces.\n• Provides comprehensive destination guides, curated itineraries, and authentic culinary insights.\n• Features a real-time AI travel assistant available 24/7.",
    },
    {
      q: "How to plan a Vietnam trip with AI Prompt?",
      category: "ai",
      a: "Simply ask our AI Assistant (e.g. 'Plan a 3-day itinerary in Hanoi with a $150 budget'). The AI will generate a tailored schedule covering iconic sights, estimated travel times, and must-try local eateries.",
    },
    {
      q: "What is included in the 34 Province Guides?",
      category: "destination",
      a: "Each province guide features:\n• Cultural overview and key travel highlights.\n• Curated list of iconic attractions with visual guides.\n• Top authentic local dishes you must taste.\n• Practical 1-to-3-day travel itineraries.",
    },
    {
      q: "How does the Thổ Địa AI Assistant work?",
      category: "features",
      a: "Thổ Địa AI acts as your local insider with deep knowledge of Vietnam:\n• Recommends authentic street food spots.\n• Advises best travel seasons and weather forecasts.\n• Suggests transportation tips and budgeting.\n• Fully supports both Vietnamese and English.",
    },
    {
      q: "Is VinaTap free to use?",
      category: "free",
      a: "Yes! All 34 provincial travel guides, editorial articles, and interactive AI chat features on VinaTap are 100% free for travelers worldwide.",
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

  // VietnamNomad Magazine Megamenu states
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);

  const handleMenuEnter = (menuKey) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuKey);
  };

  const handleMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 140);
  };

  const handleMegaMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
  };

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    if (searchModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchModalOpen]);

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

    // 2. Nhận diện ý định theo các chủ đề chính của VinaTap (Intent Recognition)
    if (/lên kế hoạch|lịch trình|kế hoạch|gợi ý|plan|itinerary|schedule/i.test(qLower)) {
      return isVi
        ? "Để lên kế hoạch du lịch với AI Prompt:\n1. Nhập câu lệnh mong muốn (ví dụ: 'Lên lịch trình 3 ngày 2 đêm ở Đà Nẵng').\n2. AI sẽ tự động đề xuất lịch trình theo từng buổi, kèm địa điểm tham quan và quán ăn nổi tiếng nhất!"
        : "To plan a trip with AI Prompt:\n1. Type your request (e.g., 'Plan a 3-day itinerary in Da Nang').\n2. The AI will instantly generate a tailored daily schedule with top sights and local eateries!";
    }

    if (/điểm đến|tỉnh thành|nơi nào|chơi ở đâu|tham quan|destination|places/i.test(qLower)) {
      return isVi
        ? "VinaTap hiện có cẩm nang số chi tiết cho 34 tỉnh thành trọng điểm du lịch Việt Nam (Hà Nội, Sài Gòn, Đà Nẵng, Ninh Bình, Hải Phòng...).\nBạn có thể nhấp vào mục 'Điểm Đến' trên thanh điều hướng để khám phá ngay!"
        : "VinaTap covers comprehensive guides for 34 iconic destinations across Vietnam (Hanoi, Saigon, Da Nang, Ninh Binh, Hai Phong...).\nClick 'Destinations' in the top menu to explore!";
    }

    if (/món ăn|ẩm thực|đặc sản|ăn gì|food|dish|cuisine|eat/i.test(qLower)) {
      return isVi
        ? "Mỗi cẩm nang tỉnh thành đều có tuyển tập món ngon bản xứ (như Phở, Bún Chả tại Hà Nội; Bánh Mì, Cơm Tấm tại Sài Gòn).\nBạn hãy vào mục 'Ẩm Thực' trên menu để xem gợi ý món ăn ngon nhất nhé!"
        : "Each destination guide features curated local specialties (such as Pho and Bun Cha in Hanoi; Banh Mi and Broken Rice in Saigon).\nVisit the 'Eat & Drink' menu to discover the best dishes!";
    }

    if (/ai|thổ địa|trợ lý|bot|assistant/i.test(qLower)) {
      return isVi
        ? "Trợ lý ảo Thổ Địa AI sẵn sàng giải đáp mọi thắc mắc du lịch của bạn 24/7 từ thời tiết, kinh nghiệm ăn chơi đến mẹo tiết kiệm chi phí. Bạn có thể bấm nút 'Hỏi Thổ Địa AI' ở góc dưới màn hình để trò chuyện trực tiếp nhé!"
        : "Our Thổ Địa AI assistant is ready 24/7 to answer all your travel queries regarding weather, local dining, and budgeting tips. Click 'Ask Thổ Địa AI' at the bottom right to start chatting!";
    }

    if (/vinatap|dự án|là gì|giới thiệu|ý nghĩa|about|what is/i.test(qLower)) {
      return isVi
        ? "VinaTap là cổng thông tin cẩm nang du lịch số hiện đại và trợ lý AI thông minh đồng hành cùng bạn khám phá vẻ đẹp, văn hóa và ẩm thực 34 tỉnh thành Việt Nam."
        : "VinaTap is a premier digital travel guide and AI companion dedicated to celebrating the culture, landscapes, and cuisine of Vietnam's 34 provinces.";
    }

    if (/chào|hi|hello|alo|ơi|bạn ơi|hey/i.test(qLower)) {
      return isVi
        ? "Chào bạn! Mình là Trợ lý ảo VinaTap. Mình có thể giúp bạn gợi ý điểm đến, lên lịch trình du lịch hoặc tìm món ngon đặc sản. Bạn cần mình hỗ trợ thông tin gì cứ nhắn nhé!"
        : "Hello! I am your VinaTap Travel Assistant. I can help you find destinations, plan itineraries, or recommend authentic foods. What would you like to explore today?";
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
              alt="VinaTap AI Travel Assistant - AI Companion"
              className="vnn-top-banner__img"
            />
          </div>
        </div>

        {/* ─── 2. EDITORIAL NAVBAR (VIETNAMNOMAD WITH HOVER MEGAMENUS) ─── */}
        <header className="vnn-navbar" onMouseLeave={handleMenuLeave}>
          <div className="vnn-navbar__inner">
            <Link href="/" className="vnn-navbar__brand">
              <div className="vnn-navbar__brand-vinatap">
                <Logo size={32} showText={false} noLink href={null} as="span" />
                <span>VinaTap</span>
              </div>
            </Link>

            <ul className="vnn-navbar__menu">
              {/* BE INSPIRED */}
              <li
                className="vnn-navbar__item"
                onMouseEnter={() => handleMenuEnter("inspired")}
              >
                <button
                  type="button"
                  className={`vnn-navbar__link ${activeMegaMenu === "inspired" ? "is-active" : ""}`}
                >
                  <span>{lang === "vi" ? "Cảm Hứng" : "BE INSPIRED"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
              </li>

              {/* DESTINATIONS */}
              <li
                className="vnn-navbar__item"
                onMouseEnter={() => handleMenuEnter("destinations")}
              >
                <button
                  type="button"
                  className={`vnn-navbar__link ${activeMegaMenu === "destinations" ? "is-active" : ""}`}
                >
                  <span>{lang === "vi" ? "Điểm Đến" : "DESTINATIONS"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
              </li>

              {/* THINGS TO DO */}
              <li
                className="vnn-navbar__item"
                onMouseEnter={() => handleMenuEnter("things")}
              >
                <button
                  type="button"
                  className={`vnn-navbar__link ${activeMegaMenu === "things" ? "is-active" : ""}`}
                >
                  <span>{lang === "vi" ? "Trải Nghiệm" : "THINGS TO DO"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
              </li>

              {/* EAT & DRINK */}
              <li
                className="vnn-navbar__item"
                onMouseEnter={() => handleMenuEnter("eat")}
              >
                <button
                  type="button"
                  className={`vnn-navbar__link ${activeMegaMenu === "eat" ? "is-active" : ""}`}
                >
                  <span>{lang === "vi" ? "Ẩm Thực" : "EAT & DRINK"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
              </li>

              {/* ITINERARIES */}
              <li
                className="vnn-navbar__item"
                onMouseEnter={() => handleMenuEnter("itineraries")}
              >
                <button
                  type="button"
                  className={`vnn-navbar__link ${activeMegaMenu === "itineraries" ? "is-active" : ""}`}
                >
                  <span>{lang === "vi" ? "Lịch Trình" : "ITINERARIES"}</span>
                  <ChevronDown size={14} className="vnn-navbar__chevron" />
                </button>
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
            </div>

            {/* ─── HOVER MEGAMENU POPUP (HÌNH 1 - 5) ─── */}
            {activeMegaMenu && MEGA_MENUS_DATA[activeMegaMenu] && (
              <div
                className="vnn-megamenu"
                onMouseEnter={handleMegaMouseEnter}
                onMouseLeave={handleMenuLeave}
              >
                <div className="vnn-megamenu__grid">
                  {MEGA_MENUS_DATA[activeMegaMenu].items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="vnn-megamenu__card"
                      onClick={() => setActiveMegaMenu(null)}
                    >
                      <div className="vnn-megamenu__thumb">
                        <img src={item.img} alt={item.title} loading="eager" />
                        <span className="vnn-megamenu__badge">{item.badge}</span>
                      </div>
                      <h4 className="vnn-megamenu__title">
                        {lang === "vi" ? item.titleVi : item.title}
                      </h4>
                      <span className="vnn-megamenu__date">
                        {lang === "vi" ? item.dateVi : item.date}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="vnn-megamenu__footer">
                  <div className="vnn-megamenu__nav-btns">
                    <button
                      type="button"
                      className="vnn-megamenu__nav-btn"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      type="button"
                      className="vnn-megamenu__nav-btn"
                      aria-label="Next"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
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

              {/* 3 icon mạng xã hội Facebook, Instagram, Youtube */}
              <div className="vnn-social-stats">
                <a
                  href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vnn-social-stat-card vnn-social-stat-card--fb"
                  aria-label="Facebook Fanpage"
                  title="Facebook"
                >
                  <Facebook size={26} className="vnn-social-icon vnn-social-icon--fb" />
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vnn-social-stat-card vnn-social-stat-card--ig"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram size={26} className="vnn-social-icon vnn-social-icon--ig" />
                </a>

                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vnn-social-stat-card vnn-social-stat-card--yt"
                  aria-label="YouTube Channel"
                  title="YouTube"
                >
                  <Youtube size={26} className="vnn-social-icon vnn-social-icon--yt" />
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
                  <h4 className={`vnn-region-main__title vnn-region-main__title--${reg.regionId}`}>
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
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="vnn-video-player-cover"
                    style={{ backgroundImage: `url(${activeVideo.img})` }}
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="vnn-video-player-header">
                      <div className="vnn-video-player-avatar">
                        <img
                          src="/guide/hcmc/Vietnamnomad-logo-by-Welcome-to-Vietnam-official.png"
                          alt="VinaTap"
                        />
                      </div>
                      <div>
                        <div className="vnn-video-player-title-text">
                          {lang === "vi" ? activeVideo.titleVi : activeVideo.title}
                        </div>
                        <div className="vnn-video-player-author">VinaTap</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="vnn-video-player-center-btn"
                      aria-label="Play Video"
                    >
                      <svg width="68" height="48" viewBox="0 0 68 48">
                        <path
                          d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                          fill="#ff0000"
                        />
                        <polygon points="45,24 27,14 27,34" fill="#ffffff" />
                      </svg>
                    </button>

                    <div className="vnn-video-player-footer">
                      <a
                        href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vnn-video-player-yt-badge"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{lang === "vi" ? "Xem trên YouTube" : "Watch on YouTube"}</span>
                      </a>
                    </div>
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
        <section className="vnn-foods-things-section" id="foods-to-try">
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
              <Link href="/" className="vnn-clean-footer__brand-link">
                <Logo size={32} showText={false} noLink href={null} as="span" />
                <span>VinaTap</span>
              </Link>
            </div>

            {/* Social Icons */}
            <div className="vnn-clean-footer__socials">
              <a
                href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN"
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
                  <Link
                    href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Kinh nghiệm du lịch" : "Travel Tips"}
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
              © 2026 VinaTap. All rights reserved.
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

        {/* Nút Trợ lý AI Du lịch Floating Widget (chuẩn giao diện hình 1) */}
        <div className="vnn-floating-widget">
          <button
            type="button"
            className="vnn-floating-widget__btn"
            onClick={() => setAiCompanionOpen((prev) => !prev)}
            aria-label="Open AI Travel Companion"
            title="AI Travel Companion - Trợ lý Du lịch Thông minh"
          >
            <span className="vnn-floating-widget__halo-outer" />
            <span className="vnn-floating-widget__halo-mid" />
            <span className="vnn-floating-widget__avatar">
              <img
                src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
                alt="AI Companion"
                className="vnn-floating-widget__avatar-img"
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
          hideFab={true}
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
