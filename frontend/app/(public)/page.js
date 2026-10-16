"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import HeaderSearch from "@/components/ui/HeaderSearch";
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
  Instagram,
} from "lucide-react";
import { provinceAPI, articleAPI } from "@/lib/api";
import { isLoggedIn, getUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useReveal } from "@/hooks/useReveal";
import { getLang } from "@/lib/prefs";
import { t, getProvinceName, getProvinceDesc } from "@/lib/i18n";
import { getProvinceCover } from "@/lib/provinceGuideData";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import NavbarAuthButton from "@/components/ui/NavbarAuthButton";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import "@/styles/home.css";

// ─── 5 BÀI VIẾT TIÊU ĐIỂM (VIETNAMNOMAD EDITORIAL HERO GRID) ───
const TRENDING_HERO_STORIES = [
  {
    id: "15-places",
    badge: "#TRENDING",
    badgeVi: "#XU HƯỚNG",
    title: "15 best places to visit in Vietnam in 2026",
    titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
    link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
    meta: "VinaTap - October 11, 2026",
    metaVi: "VinaTap • 11 Tháng 10, 2026",
    img: "/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg",
  },
  {
    id: "plan-trip",
    badge: "#TRENDING",
    badgeVi: "#XU HƯỚNG",
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
    badgeVi: "#XU HƯỚNG",
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
    badgeVi: "#XU HƯỚNG",
    title: "20 Best Things to Do in Vietnam",
    titleVi: "20 trải nghiệm nhất định phải thử khi đến Việt Nam",
    link: "/guide/20-best-things-to-do-in-vietnam",
    meta: "Top Highlights",
    metaVi: "Điểm nhấn khám phá",
    img: "/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg",
  },
  {
    id: "casa-blanca-dalat",
    badge: "VINATAP PARTNER",
    badgeVi: "ĐỐI TÁC VINATAP",
    title: "Casa Blanca Homestay: Rustic Wooden Cabin in Dalat",
    titleVi: "Casa Blanca Đà Lạt: Ngôi nhà gỗ mộc ẩn mình giữa vườn thông xanh",
    link: "/stay/casa-blanca-da-lat",
    meta: "Dalat Homestay • 70/5 Pasteur",
    metaVi: "Homestay Đà Lạt • 70/5 Pasteur",
    img: "/stay/casa-blanca/toan_canh.jpg",
  },
];

// ─── BE INSPIRED STORIES (SCREENSHOT 1) ───
const BE_INSPIRED_FEATURED = {
  title: "3-week Vietnam Itinerary",
  titleVi: "Lịch trình 3 tuần xuyên Việt hoàn hảo",
  meta: "VinaTap - October 11, 2026",
  metaVi: "VinaTap • 12 Tháng 10, 2026",
  desc: "Discover our 3-week Vietnam itinerary, featuring 7 must-visit destinations. This guide includes detailed maps, routes, and cost breakdowns to help you plan your trip.",
  descVi:
    "Khám phá lịch trình 3 tuần xuyên Việt trọn vẹn qua 7 điểm đến hàng đầu. Cẩm nang bao gồm bản đồ lộ trình chi tiết và bảng dự toán chi phí du lịch.",
  img: "/guide/hcmc/3-week-vietnam-itinerary.jpg",
  link: "/guide/3-week-vietnam-itinerary",
};

const BE_INSPIRED_COMPACT = [
  {
    title: "8 must-try foods in Hanoi",
    titleVi: "8 món ngon nhất định phải thử tại Hà Nội",
    date: "October 12, 2026",
    dateVi: "12 Tháng 10, 2026",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    link: "/guide/8-must-try-foods-in-hanoi",
  },
  {
    title: "10 best things to do in Ho Chi Minh City",
    titleVi: "10 trải nghiệm tuyệt nhất ở TP. Hồ Chí Minh",
    date: "October 12, 2026",
    dateVi: "12 Tháng 10, 2026",
    img: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
  },
  {
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 món ăn đường phố phải thử ở Sài Gòn",
    date: "October 12, 2026",
    dateVi: "12 Tháng 10, 2026",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
    link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
  },
  {
    title: "12 best attractions in Ho Chi Minh City",
    titleVi: "12 điểm tham quan nổi tiếng ở TP. Hồ Chí Minh",
    date: "October 13, 2026",
    dateVi: "13 Tháng 10, 2026",
    img: "/guide/hcmc/hcmc-12-attractions-sunset.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    title: "5 best Vung Tau beaches",
    titleVi: "5 bãi biển đẹp nhất tại Vũng Tàu",
    date: "October 13, 2026",
    dateVi: "13 Tháng 10, 2026",
    img: "/guide/hcmc/vung-tau-beaches-peninsula.jpg",
    link: "/guide/5-best-vung-tau-beaches",
  },
];

// ─── TOP DESTINATIONS (SCREENSHOT 2 & ALL PROVINCES) ───
const TOP_DESTINATIONS_DATA = [
  // Trang 1: 4 điểm đến trọng điểm quốc tế
  {
    id: "ho-chi-minh",
    name: "Ho Chi Minh City",
    nameVi: "TP. Hồ Chí Minh",
    img: "/guide/hcmc/top-dest-hcmc.jpg",
    link: "/province/ho-chi-minh",
  },
  {
    id: "da-nang",
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    img: "/guide/hcmc/top-dest-danang.jpg",
    link: "/province/da-nang",
  },
  {
    id: "ha-noi",
    name: "Hanoi",
    nameVi: "Hà Nội",
    img: "/guide/hcmc/top-dest-hanoi.jpg",
    link: "/province/ha-noi",
  },
  {
    id: "hoi-an",
    name: "Hoi An",
    nameVi: "Hội An",
    img: "/guide/hcmc/top-dest-hoian.jpg",
    link: "/province/hoi-an",
  },
  // Trang 2: Di sản & Biển đảo nổi tiếng
  {
    id: "ninh-binh",
    name: "Ninh Binh",
    nameVi: "Ninh Bình",
    img: "/guide/ninh-binh/hero.jpg",
    link: "/province/ninh-binh",
  },
  {
    id: "ha-long",
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long",
    img: "/guide/ha-long/hero-halong.jpg",
    link: "/province/ha-long",
  },
  {
    id: "nha-trang",
    name: "Nha Trang (Khanh Hoa)",
    nameVi: "Nha Trang (Khánh Hòa)",
    img: "/guide/nha-trang/nhatrang-hero-hd.jpg",
    link: "/province/nha-trang",
  },
  {
    id: "dalat",
    name: "Da Lat (Lam Dong)",
    nameVi: "Đà Lạt (Lâm Đồng)",
    img: "/guide/dalat/dalat-hero-hd.jpg",
    link: "/province/dalat",
  },
  // Trang 3: Cố đô & Vùng cao Tây Bắc - Đông Bắc
  {
    id: "hue",
    name: "Hue Imperial City",
    nameVi: "Thừa Thiên Huế",
    img: "/guide/hue/hue-hero-official.jpg",
    link: "/province/hue",
  },
  {
    id: "sapa",
    name: "Sapa",
    nameVi: "Sa Pa",
    img: "/guide/sapa/hero-sapa.jpg",
    link: "/province/sapa",
  },
  {
    id: "hai-phong",
    name: "Hai Phong (Cat Ba)",
    nameVi: "Hải Phòng (Cát Bà)",
    img: "/provinces/hai-phong.jpg",
    link: "/province/hai-phong",
  },
  {
    id: "ha-giang",
    name: "Ha Giang",
    nameVi: "Hà Giang",
    img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
    link: "/province/ha-giang",
  },
  // Trang 4: Miền Tây sông nước & Đất Mũi
  {
    id: "can-tho",
    name: "Can Tho (Floating Market)",
    nameVi: "Cần Thơ (Chợ Nổi)",
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80",
    link: "/province/can-tho",
  },
  {
    id: "an-giang",
    name: "An Giang (Tra Su Forest)",
    nameVi: "An Giang (Trà Sư)",
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=60",
    link: "/province/an-giang",
  },
  {
    id: "ca-mau",
    name: "Ca Mau (Cape)",
    nameVi: "Cà Mau (Đất Mũi)",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    link: "/province/ca-mau",
  },
  {
    id: "phu-tho",
    name: "Phu Tho (Hung King Temple)",
    nameVi: "Phú Thọ (Đền Hùng)",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    link: "/province/phu-tho",
  },
  // Trang 5: Hùng vĩ Tây Bắc - Đông Bắc
  {
    id: "cao-bang",
    name: "Cao Bang (Ban Gioc Waterfall)",
    nameVi: "Cao Bằng (Bản Giốc)",
    img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
    link: "/province/cao-bang",
  },
  {
    id: "dien-bien",
    name: "Dien Bien",
    nameVi: "Điện Biên",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    link: "/province/dien-bien",
  },
  {
    id: "lai-chau",
    name: "Lai Chau (O Quy Ho Pass)",
    nameVi: "Lai Châu (Ô Quy Hồ)",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    link: "/province/lai-chau",
  },
  {
    id: "son-la",
    name: "Son La (Moc Chau)",
    nameVi: "Sơn La (Mộc Châu)",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    link: "/province/son-la",
  },
  // Trang 6: Đại ngàn Tây Nguyên & Đông Nam Bộ
  {
    id: "dak-lak",
    name: "Dak Lak (Buon Ma Thuot)",
    nameVi: "Đắk Lắk (Buôn Ma Thuột)",
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop&q=80",
    link: "/province/dak-lak",
  },
  {
    id: "gia-lai",
    name: "Gia Lai (Pleiku)",
    nameVi: "Gia Lai (Biển Hồ)",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    link: "/province/gia-lai",
  },
  {
    id: "tay-ninh",
    name: "Tay Ninh (Ba Den Mountain)",
    nameVi: "Tây Ninh (Núi Bà Đen)",
    img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    link: "/province/tay-ninh",
  },
  {
    id: "dong-nai",
    name: "Dong Nai (Cat Tien)",
    nameVi: "Đồng Nai (Nam Cát Tiên)",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    link: "/province/dong-nai",
  },
  // Trang 7: Duyên hải Miền Trung hào khí
  {
    id: "nghe-an",
    name: "Nghe An (Cua Lo)",
    nameVi: "Nghệ An (Cửa Lò)",
    img: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop&q=80",
    link: "/province/nghe-an",
  },
  {
    id: "ha-tinh",
    name: "Ha Tinh",
    nameVi: "Hà Tĩnh",
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop&q=80",
    link: "/province/ha-tinh",
  },
  {
    id: "quang-tri",
    name: "Quang Tri",
    nameVi: "Quảng Trị",
    img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    link: "/province/quang-tri",
  },
  {
    id: "quang-ngai",
    name: "Quang Ngai (Ly Son)",
    nameVi: "Quảng Ngãi (Lý Sơn)",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    link: "/province/quang-ngai",
  },
  // Trang 8: Vùng đồng bằng & văn hóa Bắc Bộ
  {
    id: "thanh-hoa",
    name: "Thanh Hoa (Pu Luong)",
    nameVi: "Thanh Hóa (Pù Luông)",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    link: "/province/thanh-hoa",
  },
  {
    id: "bac-ninh",
    name: "Bac Ninh (Quan Ho)",
    nameVi: "Bắc Ninh (Quan Họ)",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
    link: "/province/bac-ninh",
  },
  {
    id: "hung-yen",
    name: "Hung Yen (Pho Hien)",
    nameVi: "Hưng Yên (Phố Hiến)",
    img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    link: "/province/hung-yen",
  },
  {
    id: "thai-nguyen",
    name: "Thai Nguyen (Tea Hills)",
    nameVi: "Thái Nguyên (Đồi Chè)",
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop&q=80",
    link: "/province/thai-nguyen",
  },
  // Trang 9: Miền biên cương & Đồng bằng Nam Bộ
  {
    id: "lang-son",
    name: "Lang Son (Mau Son)",
    nameVi: "Lạng Sơn (Mẫu Sơn)",
    img: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&auto=format&fit=crop&q=80",
    link: "/province/lang-son",
  },
  {
    id: "tuyen-quang",
    name: "Tuyen Quang (Na Hang Lake)",
    nameVi: "Tuyên Quang (Na Hang)",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    link: "/province/tuyen-quang",
  },
  {
    id: "dong-thap",
    name: "Dong Thap (Sa Dec Flower)",
    nameVi: "Đồng Tháp (Sa Đéc)",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    link: "/province/dong-thap",
  },
  {
    id: "vinh-long",
    name: "Vinh Long (Orchards)",
    nameVi: "Vĩnh Long (Miệt Vườn)",
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80",
    link: "/province/vinh-long",
  },
];

// ─── REGIONAL DESTINATIONS 3 COLUMNS (SCREENSHOT 3) ───
const REGIONAL_DESTINATIONS_DATA = [
  {
    regionId: "north",
    regionName: "NORTHERN VIETNAM",
    regionNameVi: "MIỀN BẮC VIỆT NAM",
    barColorClass: "vnn-section-head__bar--purple",
    pages: [
      {
        featured: {
          title: "Hanoi",
          titleVi: "Hà Nội",
          desc: "Follow this guide and you will understand why Hanoi is a perfect coming together of the timeless cultural value of the old and the dynamic and colorful vibes of the new.",
          descVi:
            "Theo chân cẩm nang này bạn sẽ hiểu vì sao Hà Nội là sự hòa quyện hoàn hảo giữa nét văn hóa cổ kính ngàn năm và nhịp sống trẻ trung, hiện đại.",
          img: "/guide/hcmc/region-north-hanoi.jpg",
          link: "/province/ha-noi",
        },
        minis: [
          {
            title: "Hanoi Tourist Map",
            titleVi: "Bản đồ du lịch Hà Nội",
            img: "/guide/hcmc/region-north-map.jpg",
            link: "/guide/hanoi-tourist-map",
          },
          {
            title: "Ha Giang",
            titleVi: "Hà Giang - Cao nguyên đá",
            img: "/guide/hcmc/region-north-hagiang.jpg",
            link: "/province/ha-giang",
          },
        ],
      },
      {
        featured: {
          title: "Ha Giang",
          titleVi: "Hà Giang",
          desc: "Dong Van Karst Plateau Geopark, Ma Pi Leng Pass, and peaceful ethnic villages offer breathtaking mountain scenery in northernmost Vietnam.",
          descVi:
            "Vùng đất địa đầu Tổ quốc nổi bật với Cao nguyên đá Đồng Văn hùng vĩ, hẻm vực Tu Sản sâu nhất Đông Nam Á và những bản làng bình yên.",
          img: "/guide/hagiang/hagiang-hero.jpg",
          link: "/province/ha-giang",
        },
        minis: [
          {
            title: "Ma Pi Leng Pass & Tu San Canyon",
            titleVi: "Đèo Mã Pí Lèng & Hẻm Tu Sản",
            img: "/guide/hagiang/hagiang-ma-pi-leng-pass.jpg",
            link: "/province/ha-giang",
          },
          {
            title: "Ninh Binh - Trang An Scenic",
            titleVi: "Ninh Bình - Non nước Tràng An",
            img: "/guide/ninh-binh/trang-an.jpg",
            link: "/province/ninh-binh",
          },
        ],
      },
      {
        featured: {
          title: "Ninh Binh",
          titleVi: "Ninh Bình",
          desc: "Marvel at UNESCO World Heritage Trang An scenic complex, historic temples of Hoa Lu, and dramatic limestone peaks rising from emerald waters.",
          descVi:
            "Được mệnh danh 'Hạ Long trên cạn' với quần thể Tràng An di sản thế giới, Cố đô Hoa Lư lịch sử và Tam Cốc Bích Động sơn thủy hữu tình.",
          img: "/guide/ninh-binh/hero.jpg",
          link: "/province/ninh-binh",
        },
        minis: [
          {
            title: "Hai Phong Harbor City",
            titleVi: "Hải Phòng - Thành phố Hoa phượng đỏ",
            img: "/guide/hcmc/top-dest-danang.jpg",
            link: "/province/hai-phong",
          },
          {
            title: "8 Must-Try Foods in Hanoi",
            titleVi: "8 món ngon nhất định phải thử tại Hà Nội",
            img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
            link: "/guide/8-must-try-foods-in-hanoi",
          },
        ],
      },
    ],
  },
  {
    regionId: "central",
    regionName: "CENTRAL VIETNAM",
    regionNameVi: "MIỀN TRUNG VIỆT NAM",
    barColorClass: "vnn-section-head__bar--orange",
    pages: [
      {
        featured: {
          title: "Da Nang",
          titleVi: "Đà Nẵng",
          desc: "This is an all-in-one Da Nang travel guide. Learn about the most necessary information about Da Nang tourism such as attractions, dishes, hotels, restaurants, and more.",
          descVi:
            "Cẩm nang toàn diện về du lịch Đà Nẵng: đầy đủ thông tin điểm đến, món ngon đặc sản, khách sạn và các trải nghiệm khó quên.",
          img: "/guide/hcmc/region-central-danang.jpg",
          link: "/province/da-nang",
        },
        minis: [
          {
            title: "The 10 best attractions in Da Nang",
            titleVi: "10 điểm tham quan đẹp nhất Đà Nẵng",
            img: "/guide/danang/danang-10-best-attractions-hd.jpg",
            link: "/guide/the-10-best-attractions-in-da-nang",
          },
          {
            title: "Nha Trang",
            titleVi: "Nha Trang - Vịnh biển ngọc",
            img: "/guide/hcmc/region-central-nhatrang.jpg",
            link: "/province/nha-trang",
          },
        ],
      },
      {
        featured: {
          title: "Dalat",
          titleVi: "Đà Lạt",
          desc: "Nestled in the Central Highlands, Dalat charms with crisp mountain air, pine forests, French villas, blooming flowers, and tranquil lakes.",
          descVi:
            "Xứ sở sương mù và ngàn hoa khoe sắc trên cao nguyên Lâm Viên. Nổi tiếng với khí hậu mát lạnh, hồ Tuyền Lâm và những quán cà phê view đồi thông cực chill.",
          img: "/guide/dalat/dalat-hero-hd.jpg",
          link: "/province/dalat",
        },
        minis: [
          {
            title: "15 Best Attractions in Dalat",
            titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
            img: "/guide/dalat/dalat-15-attractions-hd.jpg",
            link: "/guide/15-best-attractions-in-dalat",
          },
          {
            title: "Casa Blanca Homestay Dalat",
            titleVi: "Casa Blanca Homestay Đà Lạt",
            img: "/stay/casa-blanca/toan_canh.jpg",
            link: "/stay/casa-blanca-da-lat",
          },
        ],
      },
      {
        featured: {
          title: "Hoi An",
          titleVi: "Hội An",
          desc: "Step into an evocative UNESCO-listed trading port adorned with yellow timber houses, lantern-filled riverfronts, and celebrated regional food.",
          descVi:
            "Đô thị cổ bên dòng sông Hoài thơ mộng, nổi bật với kiến trúc truyền thống mái ngói rêu phong, ánh đèn lồng rực rỡ và nền ẩm thực cao lầu trứ danh.",
          img: "/guide/hoian/hoian-hero-hd.jpg",
          link: "/province/hoi-an",
        },
        minis: [
          {
            title: "Nha Trang Coastal Bay",
            titleVi: "Nha Trang - Vịnh biển ngọc",
            img: "/guide/hcmc/region-central-nhatrang.jpg",
            link: "/province/nha-trang",
          },
          {
            title: "5 Must-Try Nha Trang Dishes",
            titleVi: "5 món đặc sản phải nếm ở Nha Trang",
            img: "/guide/nha-trang/5-must-try-food-in-Nha-Trang-Vietnamnomad.jpg",
            link: "/guide/5-must-try-nha-trang-dishes",
          },
        ],
      },
      {
        featured: {
          title: "Hue Imperial City",
          titleVi: "Cố Đô Huế",
          desc: "Vietnam's ancient royal capital, home to UNESCO World Heritage monuments, magnificent royal tombs, the poetic Perfume River, and sophisticated royal gastronomy.",
          descVi:
            "Kinh đô triều Nguyễn cổ kính bên dòng sông Hương thơ mộng. Nơi hội tụ Quần thể Di tích Cố đô Huế được UNESCO vinh danh, các lăng tẩm hoàng gia uy nghiêm và nền ẩm thực cung đình tinh túy.",
          img: "/guide/hue/hue-hero-official.jpg",
          link: "/province/hue",
        },
        minis: [
          {
            title: "Imperial Citadel of Hue",
            titleVi: "Đại Nội Huế & Cổng Ngọ Môn",
            img: "/guide/hue/hue-ngo-mon-gate.jpg",
            link: "/province/hue",
          },
          {
            title: "Must-Try Hue Dishes",
            titleVi: "Ẩm thực cố đô: Bún bò & Cơm hến",
            img: "/guide/hue/hue-food-bun-bo.jpg",
            link: "/province/hue",
          },
        ],
      },
    ],
  },
  {
    regionId: "south",
    regionName: "SOUTHERN VIETNAM",
    regionNameVi: "MIỀN NAM VIỆT NAM",
    barColorClass: "vnn-section-head__bar--cyan",
    pages: [
      {
        featured: {
          title: "Ho Chi Minh City",
          titleVi: "TP. Hồ Chí Minh",
          desc: "Ho Chi Minh City, or as it is often called intimately by the locals as Saigon, is one of the sought-after destinations while travelling in Vietnam. Saigon of the modern times attracts people not for the spectacular natural landscapes but for its dynamic lifestyle – where endless options of activities are going to tie your heart.",
          descVi:
            "TP. Hồ Chí Minh (Sài Gòn) luôn là điểm đến hấp dẫn du khách bởi lối sống năng động, ẩm thực phong phú và nhịp sống phồn hoa cả ngày lẫn đêm.",
          img: "/guide/hcmc/region-south-hcmc.jpg",
          link: "/province/ho-chi-minh",
        },
        minis: [
          {
            title: "Ho Chi Minh City Tourist Map",
            titleVi: "Bản đồ du lịch TP.HCM",
            img: "/guide/hcmc/region-south-map.jpg",
            link: "/province/ho-chi-minh",
          },
          {
            title: "12 best attractions in Ho Chi Minh City",
            titleVi: "12 điểm tham quan ở Sài Gòn",
            img: "/guide/hcmc/region-south-12attractions.jpg",
            link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
          },
        ],
      },
      {
        featured: {
          title: "Vung Tau",
          titleVi: "Vũng Tàu",
          desc: "A picturesque coastal city embraced by ocean waves, scenic coastal mountain trails, the iconic Jesus Statue, and freshest seafood markets.",
          descVi:
            "Thành phố biển xinh đẹp với bãi biển Thùy Vân lộng gió, đường bờ biển Bãi Trước uốn lượn, tượng Chúa Kito Vua và các chợ hải sản nhộn nhịp.",
          img: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
          link: "/guide/5-best-vung-tau-beaches",
        },
        minis: [
          {
            title: "5 Best Vung Tau Beaches",
            titleVi: "5 bãi biển đẹp nhất Vũng Tàu",
            img: "/guide/vung-tau/beach-1-bai-truoc.jpg",
            link: "/guide/5-best-vung-tau-beaches",
          },
          {
            title: "7 Must-Try Foods in Vung Tau",
            titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
            img: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
            link: "/guide/7-must-try-foods-in-vung-tau",
          },
        ],
      },
      {
        featured: {
          title: "Saigon Stay & Lifestyle",
          titleVi: "Sài Gòn - Nơi ở & Trải nghiệm",
          desc: "Explore top hotel accommodations across vibrant districts, rooftop cocktail lounges, historic coffee alleys, and hidden riverside gems.",
          descVi:
            "Cẩm nang chọn khách sạn và khu vực lưu trú lý tưởng tại Sài Gòn, kết hợp trải nghiệm ẩm thực hẻm đêm và nhịp sống về đêm sôi động.",
          img: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
          link: "/guide/where-to-stay-in-ho-chi-minh-city",
        },
        minis: [
          {
            title: "Where to Stay in Ho Chi Minh City",
            titleVi: "Khách sạn & Nơi lưu trú tại Sài Gòn",
            img: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
            link: "/guide/where-to-stay-in-ho-chi-minh-city",
          },
          {
            title: "10 Best Things to Do in HCMC",
            titleVi: "10 trải nghiệm tuyệt nhất tại TP.HCM",
            img: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
            link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
          },
        ],
      },
    ],
  },
];




// ─── FOODS TO TRY (SCREENSHOT 2 OF PART 2) ───
const FOODS_TO_TRY_ITEMS = [
  {
    title: "8 must-try foods in Hanoi",
    titleVi: "8 món ăn nhất định phải thử tại Hà Nội",
    desc: "Discover 8 must-try dishes in Hanoi, where tradition, care, and handmade cooking define a vibrant and authentic food culture.",
    descVi:
      "Khám phá 8 món ăn tinh hoa ẩm thực phố cổ Hà Nội, nơi truyền thống và sự chăm chút tạo nên hương vị khó quên.",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    link: "/guide/8-must-try-foods-in-hanoi",
  },
  {
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
    desc: "Ho Chi Minh City is a paradise for food lovers, where every street corner offers a delicious surprise. Here's a guide to 12 signature dishes you absolutely must try to get the full experience.",
    descVi:
      "Sài Gòn là thiên đường của những tín đồ ẩm thực. Cẩm nang 12 món ăn đường phố đặc trưng nhất định phải nếm thử.",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
    link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
  },
  {
    title: "Pho",
    titleVi: "Phở – Quốc hồn quốc túy",
    desc: "Pho in the heart of Vietnamese people is more than just a universal dish but a cultural monument that we take pride in, a reminder of how rich and unique our heritage is, and an intimate image that we hold on to as a piece of our soul.",
    descVi:
      "Phở không chỉ là món ăn quốc hồn quốc túy mà còn là niềm tự hào văn hóa gắn liền với ký ức và tâm hồn người Việt.",
    img: "/guide/hcmc/Top-Hanoi-foods-Pho-Vietnamnomad.jpg",
    link: "/guide/pho-the-complete-guide",
  },
  {
    title: "7 must-try foods in Vung Tau",
    titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
    desc: "Vung Tau is a favorite destination for both domestic and international travelers, not only for its convenient location but also for its incredibly diverse and unique cuisine. Here are seven must-try local dishes to enjoy during your visit.",
    descVi:
      "Vũng Tàu không chỉ hấp dẫn bởi biển xanh mà còn bởi ẩm thực hải sản và bánh khọt trứ danh.",
    img: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
    link: "/guide/7-must-try-foods-in-vung-tau",
  },
  {
    title: "5 must-try Nha Trang dishes",
    titleVi: "5 món ăn phải nếm khi đến Nha Trang",
    desc: "From aromatic broths to grilled delights, Nha Trang's food is a perfect celebration of coastal flavors and fresh local catches.",
    descVi:
      "Nem nướng, bún chả cá, bánh căn và hải sản tươi rói tôn vinh nét đậm đà ẩm thực vịnh biển miền Trung.",
    img: "/guide/nha-trang/5-must-try-food-in-Nha-Trang-Vietnamnomad.jpg",
    link: "/guide/5-must-try-nha-trang-dishes",
  },
];

// ─── THINGS TO DO (SCREENSHOT 2 OF PART 2) ───
const THINGS_TO_DO_PAGES = [
  // Page 1: Đà Nẵng & 20 Best Things To Do
  [
    {
      title: "The 10 best attractions in Da Nang",
      titleVi: "10 điểm đến đẹp nhất Đà Nẵng",
      desc: "Da Nang is the most famous coastal city in Vietnam as it is endowed with stunning natural assets and has invested in modern infrastructures. Here are the 10 best attractions in Da Nang.",
      descVi:
        "Khám phá thành phố biển đáng sống nhất Việt Nam: Cầu Rồng, Ngũ Hành Sơn, Bà Nà Hills và bãi biển Mỹ Khê tuyệt đẹp.",
      img: "/guide/danang/danang-10-best-attractions-hd.jpg",
      link: "/guide/the-10-best-attractions-in-da-nang",
    },
    {
      title: "20 Best Things to Do in Vietnam",
      titleVi: "20 trải nghiệm nhất định phải thử ở Việt Nam",
      desc: "Here are 20 things to do in Vietnam to make the most out of your time and still guarantee the best experience about the landscapes, people and cuisine.",
      descVi:
        "20 trải nghiệm tuyệt vời nhất giúp bạn tận hưởng trọn vẹn cảnh sắc thiên nhiên, văn hóa và con người Việt Nam.",
      img: "/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg",
      link: "/guide/20-best-things-to-do-in-vietnam",
    },
  ],
  // Page 2: Đà Lạt & Nha Trang
  [
    {
      title: "15 Best Attractions in Dalat",
      titleVi: "15 điểm tham quan hấp dẫn nhất Đà Lạt",
      desc: "Immerse yourself in Dalat's romantic spots: Valley of Love, Datanla Falls, historic French train station, and flower gardens.",
      descVi:
        "Chinh phục đồi thông xanh mát, Thác Datanla, ga xe lửa cổ kính và các vườn hoa rực rỡ sắc màu giữa xứ sở sương mù.",
      img: "/guide/dalat/dalat-15-attractions-hd.jpg",
      link: "/guide/15-best-attractions-in-dalat",
    },
    {
      title: "8 Best Things to Do in Nha Trang",
      titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
      desc: "From snorkeling crystal-clear island bays to rejuvenating mud baths and vibrant night markets, Nha Trang offers non-stop coastal excitement.",
      descVi:
        "Lặn biển ngắm san hô tại vịnh ngọc, trải nghiệm tắm bùn khoáng Tháp Bà, cáp treo VinWonders và thưởng thức ẩm thực miền biển.",
      img: "/guide/hcmc/region-central-nhatrang.jpg",
      link: "/guide/8-best-things-to-do-in-nha-trang",
    },
  ],
  // Page 3: Sài Gòn & Hà Giang
  [
    {
      title: "10 Best Things to Do in Ho Chi Minh City",
      titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
      desc: "Discover Saigon's pulse from iconic colonial landmarks and panoramic skydecks to bustling nighttime street food alleys.",
      descVi:
        "Khám phá Nhà hát Thành phố, Dinh Độc Lập, ngắm toàn cảnh Sài Gòn hoa lệ từ trên cao và lạc bước vào những con hẻm ẩm thực đêm bất tận.",
      img: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
      link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
    },
    {
      title: "Conquer Ha Giang Karst Plateau & Ma Pi Leng",
      titleVi: "Chinh phục Cao nguyên đá Hà Giang & Mã Pí Lèng",
      desc: "Embark on an epic road trip through winding mountain passes, emerald Nho Que River canyons, and vibrant highland markets.",
      descVi:
        "Hành trình phượt đỉnh cao qua những cung đèo ngoạn mục, xuôi thuyền trên dòng Nho Quế xanh biếc và khám phá phiên chợ vùng cao sắc màu.",
      img: "/guide/hagiang/hagiang-ma-pi-leng-pass.jpg",
      link: "/province/ha-giang",
    },
  ],
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
    img: "/guide/visa/vietnam-visa-hero.jpg",
    link: "/guide/vietnam-visa",
  },
  {
    title: "Climate of Vietnam",
    titleVi: "Khí Hậu & Thời Tiết",
    img: "/guide/climate/climate-of-vietnam.jpg",
    link: "/guide/vietnam-climate",
  },
  {
    title: "Vietnamese Currency",
    titleVi: "Tiền Tệ & Đổi Tiền",
    img: "/guide/currency/vietnam-currency-hero.jpg",
    link: "/guide/vietnamese-currency",
  },
];

// ─── LATEST ARTICLES (SCREENSHOT 4 OF PART 2) ───
const LATEST_ARTICLES_PAGES = [
  // Page 1
  [
    {
      badge: "#TRENDING",
      badgeVi: "#XU HƯỚNG",
      title: "15 best places to visit in Vietnam in 2026",
      titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
      meta: "VinaTap - October 11, 2026",
      metaVi: "VinaTap • 11 Tháng 10, 2026",
      img: "/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg",
      link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
    },
    {
      badge: "#TRENDING",
      badgeVi: "#XU HƯỚNG",
      title: "Plan Your Vietnam Trip with Just One Prompt",
      titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một câu lệnh AI",
      meta: "VinaTap - October 11, 2026",
      metaVi: "VinaTap • 11 Tháng 10, 2026",
      img: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
      link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
    },
    {
      badge: "#TRENDING",
      badgeVi: "#XU HƯỚNG",
      title: "The Complete Guide to Vietnam",
      titleVi: "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam",
      meta: "VinaTap - October 12, 2026",
      metaVi: "VinaTap • 12 Tháng 10, 2026",
      img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
      link: "/guide/the-complete-guide-to-vietnam",
    },
    {
      badge: "MEMBERSHIP",
      badgeVi: "LƯU TRÚ",
      title: "Accommodation in Vietnam",
      titleVi: "Khách sạn & Nơi lưu trú tại Việt Nam",
      meta: "VinaTap - October 11, 2026",
      metaVi: "VinaTap • 12 Tháng 10, 2026",
      img: "/guide/hcmc/accommodation-in-vietnam.jpg",
      link: "/guide/accommodation-in-vietnam",
    },
    {
      badge: "HO CHI MINH CITY",
      badgeVi: "TP. HỒ CHÍ MINH",
      title: "Where to Stay in Ho Chi Minh City",
      titleVi: "Khách sạn & Khu vực nên ở tại TP. Hồ Chí Minh",
      meta: "VinaTap - October 12, 2026",
      metaVi: "VinaTap • 12 Tháng 10, 2026",
      img: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
      link: "/guide/where-to-stay-in-ho-chi-minh-city",
    },
    {
      badge: "WEATHER",
      badgeVi: "THỜI TIẾT",
      title: "Vietnam Weather Map for September",
      titleVi: "Bản đồ dự báo thời tiết du lịch Việt Nam",
      meta: "VinaTap - October 13, 2026",
      metaVi: "VinaTap • 13 Tháng 10, 2026",
      img: "/guide/hcmc/vietnam-weather-map.jpg",
      link: "/province/ha-noi",
    },
  ],
  // Page 2
  [
    {
      badge: "ITINERARY",
      badgeVi: "LỊCH TRÌNH",
      title: "10 Days in Vietnam: The Essential Route",
      titleVi: "Lịch trình 10 ngày khám phá tinh hoa Việt Nam",
      meta: "VinaTap - October 13, 2026",
      metaVi: "VinaTap • 13 Tháng 10, 2026",
      img: "/guide/megamenu/itin-2-10days.jpg",
      link: "/guide/10-days-in-vietnam",
    },
    {
      badge: "ITINERARY",
      badgeVi: "LỊCH TRÌNH",
      title: "2 Weeks in Vietnam: North to South",
      titleVi: "Lịch trình 2 tuần xuyên Việt trọn vẹn",
      meta: "VinaTap - October 13, 2026",
      metaVi: "VinaTap • 13 Tháng 10, 2026",
      img: "/guide/megamenu/itin-3-2weeks.jpg",
      link: "/guide/2-weeks-in-vietnam",
    },
    {
      badge: "DALAT",
      badgeVi: "ĐÀ LẠT",
      title: "15 Best Attractions in Dalat City",
      titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
      meta: "VinaTap - October 13, 2026",
      metaVi: "VinaTap • 13 Tháng 10, 2026",
      img: "/guide/dalat/dalat-15-attractions-hd.jpg",
      link: "/guide/15-best-attractions-in-dalat",
    },
    {
      badge: "NHA TRANG",
      badgeVi: "NHA TRANG",
      title: "8 Best Things to Do in Nha Trang Bay",
      titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
      meta: "VinaTap - October 10, 2026",
      metaVi: "VinaTap • 10 Tháng 10, 2026",
      img: "/guide/megamenu/todo-3-nhatrang.jpg",
      link: "/guide/8-best-things-to-do-in-nha-trang",
    },
    {
      badge: "FOOD & DRINK",
      badgeVi: "ẨM THỰC",
      title: "7 Must-Try Foods in Vung Tau Coast",
      titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
      meta: "VinaTap - October 12, 2026",
      metaVi: "VinaTap • 12 Tháng 10, 2026",
      img: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
      link: "/guide/7-must-try-foods-in-vung-tau",
    },
    {
      badge: "CULTURE",
      badgeVi: "VĂN HÓA",
      title: "Ao Dai – Vietnamese Traditional Dress",
      titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
      meta: "VinaTap - October 13, 2026",
      metaVi: "VinaTap • 13 Tháng 10, 2026",
      img: "/guide/megamenu/inspired-5.jpg",
      link: "/guide/ao-dai-vietnamese-traditional-dress",
    },
  ],
];

// ─── POPULAR POSTS (SCREENSHOT 4 OF PART 2) ───
const POPULAR_POSTS_PAGES = [
  // Page 1
  [
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
      link: "/guide/the-complete-guide-to-vietnam",
    },
    {
      title: "8 Must-Try Foods in Hanoi",
      titleVi: "8 món ngon nhất định phải thử tại Hà Nội",
      img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
      link: "/guide/8-must-try-foods-in-hanoi",
    },
  ],
  // Page 2: Đà Lạt, Nha Trang, Hội An, Hà Giang, Vũng Tàu
  [
    {
      title: "Dalat - City of Eternal Spring",
      titleVi: "Đà Lạt - Xứ sở sương mù",
      img: "/guide/dalat/dalat-hero-hd.jpg",
      link: "/province/dalat",
    },
    {
      title: "Nha Trang Coastal Bay",
      titleVi: "Nha Trang - Vịnh biển ngọc",
      img: "/guide/hcmc/region-central-nhatrang.jpg",
      link: "/province/nha-trang",
    },
    {
      title: "Hoi An Ancient Town",
      titleVi: "Phố cổ Hội An",
      img: "/guide/hoian/hoian-hero-hd.jpg",
      link: "/province/hoi-an",
    },
    {
      title: "Ha Giang - Lung Cu Flagpole",
      titleVi: "Hà Giang - Cột cờ Lũng Cú",
      img: "/guide/hagiang/hagiang-lung-cu-flagpole.jpg",
      link: "/province/ha-giang",
    },
    {
      title: "5 Best Vung Tau Beaches",
      titleVi: "5 bãi biển đẹp nhất Vũng Tàu",
      img: "/guide/hcmc/vung-tau-beaches-peninsula.jpg",
      link: "/guide/5-best-vung-tau-beaches",
    },
  ],
  // Page 3: Lịch trình 3 tuần, Áo dài, Món ngon Sài Gòn, AI Trip Planner, Ninh Bình
  [
    {
      title: "3-Week Vietnam Itinerary",
      titleVi: "Lịch trình 3 tuần xuyên Việt",
      img: "/guide/hcmc/3-week-vietnam-itinerary.jpg",
      link: "/guide/3-week-vietnam-itinerary",
    },
    {
      title: "Ao Dai - Traditional Vietnamese Dress",
      titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
      img: "/guide/megamenu/inspired-5.jpg",
      link: "/guide/ao-dai-vietnamese-traditional-dress",
    },
    {
      title: "12 Street Foods in Ho Chi Minh City",
      titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
      img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
      link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
    },
    {
      title: "Plan Vietnam Trip with Just One Prompt",
      titleVi: "Lên kế hoạch du lịch bằng Trợ lý AI",
      img: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
      link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
    },
    {
      title: "Ninh Binh Heritage & Trang An",
      titleVi: "Ninh Bình - Non nước hữu tình Tràng An",
      img: "/guide/ninh-binh/hero.jpg",
      link: "/province/ninh-binh",
    },
  ],
];

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
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Featured Articles",
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
        titleVi: "Thành phố Hồ Chí Minh",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Central Vietnam",
        img: "/guide/dalat/dalat-hero-hd.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
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
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "todo-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 hoạt động không thể bỏ qua ở Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
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
        titleVi: "8 món ngon nhất định phải thử ở Hà Nội",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho",
        titleVi: "Phở truyền thống",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-5-nhatrang.jpg",
        link: "/guide/5-must-try-nha-trang-dishes",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 11, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

const getBadgeLabel = (badge, isVi) => {
  if (!isVi || !badge) return badge;
  const b = badge.toLowerCase();
  if (b.includes("trending")) return "#Xu hướng";
  if (b.includes("destinations") || b.includes("destination")) return "Điểm đến";
  if (b.includes("featured")) return "Bài viết nổi bật";
  if (b.includes("article")) return "Bài viết";
  if (b.includes("central")) return "Miền Trung";
  if (b.includes("itinerary")) return "Lịch trình";
  if (b.includes("eat") || b.includes("drink")) return "Ẩm thực";
  if (b.includes("hanoi")) return "Hà Nội";
  if (b.includes("membership") || b.includes("accommodation")) return "Lưu trú";
  if (b.includes("weather")) return "Thời tiết";
  return badge;
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

  // Danh sách bài viết cẩm nang động được tạo từ trang Quản trị (Admin CMS)
  const [dynamicArticles, setDynamicArticles] = useState([]);

  useEffect(() => {
    articleAPI
      .getAll({ status: "published", limit: 8 })
      .then((d) => {
        if (d?.articles && Array.isArray(d.articles)) {
          setDynamicArticles(d.articles);
        }
      })
      .catch((err) => console.warn("Lỗi tải bài viết động trang chủ:", err));
  }, []);

  // Danh sách bài cần ẩn khỏi danh sách nhỏ vì đã có bài lớn nổi bật bên cạnh hoặc đã có trên landing page
  const EXCLUDED_INSPIRED_SLUGS = [
    "3-week-vietnam-itinerary",
    "20-best-things-to-do-in-vietnam",
    "15-best-places-to-visit-in-vietnam-in-2026",
  ];

  const filteredDynamicArticles = dynamicArticles.filter(
    (art) => !EXCLUDED_INSPIRED_SLUGS.includes(art.slug),
  );

  const inspiredCompactList = [
    ...filteredDynamicArticles.map((art) => ({
      title: art.title_en,
      titleVi: art.title_vi,
      date: art.published_date || "2026",
      dateVi: art.published_date || "Năm 2026",
      img: art.hero_image || "/guide/megamenu/todo-2-hcmc.jpg",
      link: `/guide/${art.slug}`,
    })),
    ...BE_INSPIRED_COMPACT.filter(
      (s) =>
        !EXCLUDED_INSPIRED_SLUGS.some((slug) => s.link.includes(slug)) &&
        !filteredDynamicArticles.some((d) => `/guide/${d.slug}` === s.link),
    ),
  ].slice(0, 5);

  // VietnamNomad Magazine Hero states
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [topDestPage, setTopDestPage] = useState(0);
  const destTouchStartX = useRef(0);

  // Carousel & Pagination states for landing page sections
  const [regionPageMap, setRegionPageMap] = useState({
    north: 0,
    central: 0,
    south: 0,
  });
  const [thingsPage, setThingsPage] = useState(0);
  const [popularPage, setPopularPage] = useState(0);
  const [latestPage, setLatestPage] = useState(0);

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

  // Kết hợp toàn bộ tỉnh thành có trong hệ thống (API backend + danh sách chuẩn), loại trừ Hoàng Sa & Trường Sa khỏi mục Điểm đến
  const allTopDestinations = useMemo(() => {
    const isExcluded = (item) => {
      if (!item) return false;
      const slug = (item.slug || item.id || "").toLowerCase().trim();
      const name = (item.name || "").toLowerCase().trim();
      const nameVi = (item.nameVi || "").toLowerCase().trim();
      return (
        slug.includes("hoang-sa") ||
        slug.includes("truong-sa") ||
        name.includes("hoang sa") ||
        name.includes("truong sa") ||
        nameVi.includes("hoàng sa") ||
        nameVi.includes("trường sa")
      );
    };

    const cleanBaseData = TOP_DESTINATIONS_DATA.filter((d) => !isExcluded(d));
    if (!provinces || provinces.length === 0) return cleanBaseData;

    const seen = {};
    const result = [];
    // Ưu tiên danh sách chuẩn với ảnh đẹp & tên chuẩn hóa
    cleanBaseData.forEach((d) => {
      const key = d.id || d.slug;
      if (!seen[key]) {
        seen[key] = true;
        result.push(d);
      }
    });
    // Bổ sung thêm bất kỳ tỉnh thành nào từ backend nếu chưa có (loại trừ Hoàng Sa, Trường Sa)
    provinces.forEach((p) => {
      const slug = p.slug;
      if (!isExcluded(p) && !seen[slug]) {
        seen[slug] = true;
        result.push({
          id: slug,
          name: getProvinceName(p, "en") || p.name,
          nameVi: p.name,
          img: getProvinceCover(p) || p.thumbnail_url || "/guide/hcmc/top-dest-hcmc.jpg",
          link: `/province/${slug}`,
        });
      }
    });
    return result;
  }, [provinces]);

  const DEST_PAGE_SIZE = 4;
  const totalDestPages = Math.max(1, Math.ceil(allTopDestinations.length / DEST_PAGE_SIZE));
  const currentTopDests = allTopDestinations.slice(
    topDestPage * DEST_PAGE_SIZE,
    (topDestPage + 1) * DEST_PAGE_SIZE
  );

  const handlePrevDest = () => {
    setTopDestPage((prev) => (prev === 0 ? totalDestPages - 1 : prev - 1));
  };

  const handleNextDest = () => {
    setTopDestPage((prev) => (prev + 1) % totalDestPages);
  };

  const handleDestTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      destTouchStartX.current = e.touches[0].clientX;
    }
  };

  const handleDestTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const diff = destTouchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) handleNextDest();
        else handlePrevDest();
      }
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
    if (
      /lên kế hoạch|lịch trình|kế hoạch|gợi ý|plan|itinerary|schedule/i.test(
        qLower,
      )
    ) {
      return isVi
        ? "Để lên kế hoạch du lịch với AI Prompt:\n1. Nhập câu lệnh mong muốn (ví dụ: 'Lên lịch trình 3 ngày 2 đêm ở Đà Nẵng').\n2. AI sẽ tự động đề xuất lịch trình theo từng buổi, kèm địa điểm tham quan và quán ăn nổi tiếng nhất!"
        : "To plan a trip with AI Prompt:\n1. Type your request (e.g., 'Plan a 3-day itinerary in Da Nang').\n2. The AI will instantly generate a tailored daily schedule with top sights and local eateries!";
    }

    if (
      /điểm đến|tỉnh thành|nơi nào|chơi ở đâu|tham quan|destination|places/i.test(
        qLower,
      )
    ) {
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
        <header
          className="vnn-navbar"
          onMouseLeave={handleMenuLeave}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 9999,
            background: "#ffffff",
            width: "100%",
          }}
        >
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
              <HeaderSearch />
              <LanguageSwitch variant="navbar" />
              <NavbarAuthButton />
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
                        <span className="vnn-megamenu__badge">
                          {getBadgeLabel(item.badge, lang === "vi")}
                        </span>
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
                      aria-label="Previous menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        const keys = ["inspired", "destinations", "things", "eat", "itineraries"];
                        const curIdx = keys.indexOf(activeMegaMenu);
                        const prevIdx = curIdx <= 0 ? keys.length - 1 : curIdx - 1;
                        setActiveMegaMenu(keys[prevIdx]);
                      }}
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      type="button"
                      className="vnn-megamenu__nav-btn"
                      aria-label="Next menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        const keys = ["inspired", "destinations", "things", "eat", "itineraries"];
                        const curIdx = keys.indexOf(activeMegaMenu);
                        const nextIdx = (curIdx + 1) % keys.length;
                        setActiveMegaMenu(keys[nextIdx]);
                      }}
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
              <span className="vnn-ticker__badge">
                {lang === "vi" ? "#XU HƯỚNG" : "#TRENDING"}
              </span>
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
                    prev === 0 ? TRENDING_HERO_STORIES.length - 1 : prev - 1,
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
                  setTrendingIndex(
                    (prev) => (prev + 1) % TRENDING_HERO_STORIES.length,
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
                <span className="vnn-card-badge">
                  {lang === "vi"
                    ? (TRENDING_HERO_STORIES[0].badgeVi || TRENDING_HERO_STORIES[0].badge)
                    : TRENDING_HERO_STORIES[0].badge}
                </span>
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
                  <span className="vnn-card-badge">
                    {lang === "vi"
                      ? (TRENDING_HERO_STORIES[1].badgeVi || TRENDING_HERO_STORIES[1].badge)
                      : TRENDING_HERO_STORIES[1].badge}
                  </span>
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
                  <span className="vnn-card-badge">
                    {lang === "vi"
                      ? (TRENDING_HERO_STORIES[2].badgeVi || TRENDING_HERO_STORIES[2].badge)
                      : TRENDING_HERO_STORIES[2].badge}
                  </span>
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
                  <span className="vnn-card-badge">
                    {lang === "vi"
                      ? (TRENDING_HERO_STORIES[3].badgeVi || TRENDING_HERO_STORIES[3].badge)
                      : TRENDING_HERO_STORIES[3].badge}
                  </span>
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
                    {lang === "vi"
                      ? (TRENDING_HERO_STORIES[4].badgeVi || TRENDING_HERO_STORIES[4].badge)
                      : TRENDING_HERO_STORIES[4].badge}
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
                  {lang === "vi" ? "GỢI Ý CẢM HỨNG" : "BE INSPIRED"}
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

                {/* Danh sách bài viết cẩm nang (Bao gồm bài mới tạo từ Admin CMS) */}
                <div className="vnn-compact-list">
                  {inspiredCompactList.map((story) => (
                    <Link
                      key={story.link || story.title}
                      href={story.link}
                      className="vnn-compact-item"
                    >
                      <img
                        src={story.img}
                        alt={story.title}
                        className="vnn-compact-item__thumb"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/guide/hcmc/top-dest-hcmc.jpg";
                        }}
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
                  {lang === "vi" ? "KẾT NỐI VỚI CHÚNG TÔI" : "CONNECT WITH US"}
                </h3>
                <span className="vnn-section-head__bar vnn-section-head__bar--green" />
              </div>

              {/* Chỉ hiển thị icon Facebook theo yêu cầu — Kéo ra giữa đẹp mắt */}
              <div className="vnn-social-stats" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
                <a
                  href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vnn-social-stat-card vnn-social-stat-card--fb"
                  aria-label="Facebook Fanpage"
                  title="Facebook VinaTap"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "12px 28px",
                    width: "auto",
                    minWidth: "150px",
                    borderRadius: "10px",
                    border: "1.5px solid #1877f2",
                    background: "#f0f6ff",
                    color: "#1877f2",
                    fontWeight: 600,
                    fontSize: "14px",
                    boxShadow: "0 2px 8px rgba(24, 119, 242, 0.12)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Facebook
                    size={22}
                    className="vnn-social-icon vnn-social-icon--fb"
                  />
                  <span>Facebook</span>
                </a>
              </div>

              {/* Banner AI Companion quảng bá */}
              <div
                className="vnn-ai-sidebar-banner"
                onClick={() => setAiCompanionOpen(true)}
                role="button"
                tabIndex={0}
                title={lang === "vi" ? "DU LỊCH THÔNG MINH VỚI TRỢ LÝ ẢO AI" : "TRAVEL SMARTER WITH AI-COMPANION"}
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
                {lang === "vi" ? "ĐIỂM ĐẾN HÀNG ĐẦU" : "TOP DESTINATIONS"}
              </h3>
              <span className="vnn-section-head__bar vnn-section-head__bar--cyan" />
            </div>

            <div
              key={`dest-page-${topDestPage}`}
              className="vnn-destinations-grid vnn-fade-in"
              onTouchStart={handleDestTouchStart}
              onTouchEnd={handleDestTouchEnd}
            >
              {currentTopDests.map((dest) => (
                <Link key={dest.id || dest.slug} href={dest.link} className="vnn-dest-card">
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
                onClick={handlePrevDest}
                aria-label="Previous destination"
                title={lang === "vi" ? "Trang trước" : "Previous page"}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="vnn-carousel-ctrl-btn"
                onClick={handleNextDest}
                aria-label="Next destination"
                title={lang === "vi" ? "Trang kế tiếp" : "Next page"}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ─── 7. REGIONAL DESTINATIONS 3 COLUMNS (SCREENSHOT 4) ─── */}
        <section id="regions" className="vnn-regions-section">
          <div className="vnn-regions-container">
            {REGIONAL_DESTINATIONS_DATA.map((reg) => {
              const pages = reg.pages || [];
              const curPageIdx = regionPageMap[reg.regionId] || 0;
              const curPage = pages[curPageIdx] || pages[0];
              const totalPages = pages.length;

              const handlePrev = () => {
                setRegionPageMap((prev) => ({
                  ...prev,
                  [reg.regionId]: curPageIdx === 0 ? totalPages - 1 : curPageIdx - 1,
                }));
              };

              const handleNext = () => {
                setRegionPageMap((prev) => ({
                  ...prev,
                  [reg.regionId]: (curPageIdx + 1) % totalPages,
                }));
              };

              return (
                <div key={reg.regionId} className="vnn-region-col">
                  <div className="vnn-section-head">
                    <h3 className="vnn-section-head__title">
                      {lang === "vi" ? reg.regionNameVi : reg.regionName}
                    </h3>
                    <span
                      className={`vnn-section-head__bar ${reg.barColorClass}`}
                    />
                  </div>

                  <div key={`${reg.regionId}-${curPageIdx}`} className="vnn-fade-in">
                    <Link href={curPage.featured.link} className="vnn-region-main">
                      <div className="vnn-region-main__img-wrap">
                        <img
                          src={curPage.featured.img}
                          alt={curPage.featured.title}
                          className="vnn-region-main__img"
                          loading="lazy"
                        />
                      </div>
                      <h4
                        className={`vnn-region-main__title vnn-region-main__title--${reg.regionId}`}
                      >
                        {lang === "vi" ? curPage.featured.titleVi : curPage.featured.title}
                      </h4>
                      <p className="vnn-region-main__desc">
                        {lang === "vi" ? curPage.featured.descVi : curPage.featured.desc}
                      </p>
                    </Link>

                    <div className="vnn-region-minis">
                      {curPage.minis.map((mini) => (
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
                  </div>

                  <div className="vnn-carousel-ctrls">
                    <button
                      type="button"
                      className="vnn-carousel-ctrl-btn"
                      onClick={handlePrev}
                      aria-label="Previous destination page"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      className="vnn-carousel-ctrl-btn"
                      onClick={handleNext}
                      aria-label="Next destination page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
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

              <div key={`things-${thingsPage}`} className="vnn-things-list vnn-fade-in">
                {THINGS_TO_DO_PAGES[thingsPage].map((item) => (
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
                  onClick={() =>
                    setThingsPage((prev) =>
                      prev === 0 ? THINGS_TO_DO_PAGES.length - 1 : prev - 1,
                    )
                  }
                  aria-label="Previous experiences"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  onClick={() =>
                    setThingsPage((prev) => (prev + 1) % THINGS_TO_DO_PAGES.length)
                  }
                  aria-label="Next experiences"
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

              <div key={`latest-${latestPage}`} className="vnn-latest-grid vnn-fade-in">
                {LATEST_ARTICLES_PAGES[latestPage].map((item) => (
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
                    <span className="vnn-latest-card__badge">
                      {lang === "vi" ? (item.badgeVi || item.badge) : item.badge}
                    </span>
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
                  onClick={() =>
                    setLatestPage((prev) =>
                      prev === 0 ? LATEST_ARTICLES_PAGES.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous articles"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  onClick={() =>
                    setLatestPage((prev) => (prev + 1) % LATEST_ARTICLES_PAGES.length)
                  }
                  aria-label="Next articles"
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

              <div key={`popular-${popularPage}`} className="vnn-popular-list vnn-fade-in">
                {POPULAR_POSTS_PAGES[popularPage].map((item) => (
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
                  onClick={() =>
                    setPopularPage((prev) =>
                      prev === 0 ? POPULAR_POSTS_PAGES.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous popular posts"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-carousel-ctrl-btn"
                  onClick={() =>
                    setPopularPage((prev) => (prev + 1) % POPULAR_POSTS_PAGES.length)
                  }
                  aria-label="Next popular posts"
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

            {/* Social Icons — Chỉ hiển thị Facebook */}
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
                    href="/guide/12-must-try-foods-in-ho-chi-minh-city"
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
                    href="/guide/vietnam-visa"
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
                    href="/guide/the-complete-guide-to-vietnam"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Bản đồ Việt Nam" : "Map of Vietnam"}
                  </Link>
                  <Link
                    href="/guide/accommodation-in-vietnam"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Khách sạn lưu trú" : "Accommodation"}
                  </Link>
                  <Link
                    href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Kinh nghiệm du lịch" : "Travel Tips"}
                  </Link>
                  <Link
                    href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
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
                  <Link
                    href="/policy#support"
                    className="vnn-clean-footer__link"
                  >
                    {lang === "vi" ? "Hợp tác đồng hành" : "Partner with us"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="vnn-clean-footer__bottom">
              {lang === "vi"
                ? "© 2026 VinaTap. Đã đăng ký bản quyền."
                : "© 2026 VinaTap. All rights reserved."}
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
                          .includes(searchModalText.toLowerCase().trim()),
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
                          .includes(searchModalText.toLowerCase().trim()),
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
                src="/logo.png"
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
