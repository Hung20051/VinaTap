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
} from "lucide-react";
import { provinceAPI } from "@/lib/api";
import { isLoggedIn, getUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useReveal } from "@/hooks/useReveal";
import { getLang } from "@/lib/prefs";
import { t, getProvinceName, getProvinceDesc } from "@/lib/i18n";
import { getProvinceCover } from "@/lib/provinceGuideData";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import "@/styles/home.css";

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
            sessionStorage.setItem("vinatap_cached_provinces", JSON.stringify(list));
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
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
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
      (item) => item.q.toLowerCase() === qLower || qLower.includes(item.q.toLowerCase()),
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
    if (/mua|đặt hàng|order|cửa hàng|shop|ở đâu|làm sao để mua|làm thế nào để mua|buy|purchase|where to buy/i.test(qLower)) {
      return isVi
        ? "Để đặt mua thẻ VinaTap, bạn làm theo 3 bước cực kỳ đơn giản:\n1. Bấm vào mục 'Sản phẩm' trên thanh điều hướng phía trên.\n2. Chọn thẻ tỉnh thành hoặc các gói Combo 3 thẻ (139k), Combo 5 thẻ (239k) bạn yêu thích rồi bấm 'Mua ngay'.\n3. Điền địa chỉ nhận hàng và chọn thanh toán qua mã QR PayOS hoặc thanh toán tiền mặt khi nhận hàng (COD) là hoàn tất ạ!"
        : "To buy VinaTap cards, follow 3 easy steps:\n1. Click 'Shop' in the navigation bar.\n2. Select your desired province cards or 3-card (139k) / 5-card (239k) combos and click 'Buy Now'.\n3. Enter your delivery address and choose payment via PayOS QR or Cash on Delivery (COD)!";
    }

    // Chủ đề: Thanh toán / Chuyển khoản / PayOS / COD
    if (/thanh toán|chuyển khoản|payos|cod|tiền mặt|ngân hàng|atm|quét mã|ví|payment|pay/i.test(qLower)) {
      return isVi
        ? "VinaTap hỗ trợ 2 hình thức thanh toán an toàn và tiện lợi:\n1. Chuyển khoản trực tuyến PayOS: Quét mã VietQR tự động xác nhận ngay tức thì, tương thích với mọi app ngân hàng và ví điện tử.\n2. Thanh toán khi nhận hàng (COD): Nhận hàng tận tay, kiểm tra thẻ rồi mới thanh toán tiền mặt cho bưu tá."
        : "VinaTap supports 2 secure payment methods:\n1. Online QR Transfer via PayOS: Scan VietQR for instant automatic confirmation with all banks and e-wallets.\n2. Cash on Delivery (COD): Receive and inspect your physical cards before paying cash.";
    }

    // Chủ đề: Phí vận chuyển / Giao hàng / Freeship / Mất bao lâu
    if (/ship|vận chuyển|giao hàng|phí ship|freeship|miễn phí ship|bao lâu|mấy ngày|delivery|shipping/i.test(qLower)) {
      return isVi
        ? "Chính sách giao hàng của VinaTap:\n• Phí vận chuyển tiêu chuẩn toàn quốc: 30.000đ.\n• Miễn phí vận chuyển (Freeship): Tự động áp dụng cho đơn hàng từ 500.000đ trở lên.\n• Thời gian giao hàng: Khoảng 2 - 4 ngày làm việc trên toàn quốc."
        : "VinaTap Delivery Policy:\n• Standard nationwide shipping: 30,000 VND.\n• Free Shipping: Automatically applied for orders from 500,000 VND.\n• Delivery time: Usually 2 - 4 business days nationwide.";
    }

    // Chủ đề: Công nghệ NFC / Cách hoạt động / Có cần tải app không
    if (/nfc|hoạt động|như thế nào|ra sao|cách dùng|sử dụng|cài app|tải app|quét mã|chạm thẻ|how it works/i.test(qLower)) {
      return isVi
        ? "Thẻ VinaTap sử dụng chip NFC chuẩn ISO NXP thông minh:\n• Bạn chỉ cần chạm nhẹ mặt sau điện thoại vào thẻ, album du lịch của tỉnh thành đó sẽ tự động mở ngay trên trình duyệt web điện thoại.\n• Hoàn toàn không cần tải app, không cần quét mã QR."
        : "VinaTap uses smart ISO-certified NXP NFC chips:\n• Simply tap the back of your phone to the physical tile, and that province's travel album opens instantly in your mobile web browser.\n• No app download required and no QR scanning needed.";
    }

    // Chủ đề: Điện thoại tương thích / iPhone / Android / Máy không có NFC
    if (/điện thoại|iphone|android|samsung|thiết bị|máy nào|hỗ trợ|không có nfc|tương thích|phone|device|compatible/i.test(qLower)) {
      return isVi
        ? "Hầu hết smartphone hiện nay đều tương thích hoàn hảo:\n• iPhone: Từ iPhone 7 trở lên (đặc biệt từ iPhone Xr/Xs trở lên tự động nhận thẻ ngay mà không cần thao tác gì thêm).\n• Android: Mọi điện thoại có trang bị NFC (Samsung, Xiaomi, Oppo, Pixel...).\n• Nếu máy không có NFC: Mỗi thẻ đều có mã Serial dự phòng in kèm — bạn chỉ cần nhập mã trên web là mở album bình thường!"
        : "Most modern smartphones are fully compatible:\n• iPhone: iPhone 7 and above (iPhone Xr/Xs and newer read automatically in background).\n• Android: Any smartphone with NFC enabled (Samsung, Xiaomi, Oppo, etc.).\n• Phones without NFC: Every card includes a printed backup Serial Code so you can open the album on the web anytime!";
    }

    // Chủ đề: Kích hoạt thẻ / Tạo album / Đăng ảnh / Quản lý
    if (/kích hoạt|activate|tạo album|up ảnh|đăng ảnh|lưu ảnh|tải ảnh|video|album|serial|nhập serial/i.test(qLower)) {
      return isVi
        ? "Quy trình kích hoạt và tạo album rất nhanh chóng:\n1. Chạm thẻ vào điện thoại lần đầu (hoặc nhập mã Serial in trên thẻ tại trang 'Kích hoạt').\n2. Đăng nhập để xác nhận quyền sở hữu thẻ.\n3. Bạn có thể tự do đặt tên album, tải lên các bức ảnh/video đẹp nhất, viết nhật ký hành trình để lưu giữ kỷ niệm du lịch trọn đời!"
        : "Activating and creating an album takes under a minute:\n1. Tap the card to your phone for the first time (or enter the backup serial code on the 'Activate' page).\n2. Sign in to confirm ownership.\n3. Name your album, upload your travel photos/videos, write memories, and keep them alive forever on your map!";
    }

    // Chủ đề: Quyền riêng tư / Bảo mật / Ai xem được
    if (/riêng tư|bảo mật|ai xem|công khai|lộ ảnh|private|public|privacy|security/i.test(qLower)) {
      return isVi
        ? "Bạn nắm toàn quyền kiểm soát album của mình:\n• Chế độ Riêng tư (mặc định): Chỉ bạn và những người được bạn cấp quyền mới xem được ảnh & video.\n• Chế độ Công khai: Bất kỳ ai chạm thẻ cũng có thể chiêm ngưỡng album của bạn.\nDữ liệu được mã hóa và lưu trữ an toàn trên nền tảng đám mây."
        : "You have 100% control over your albums:\n• Private mode (default): Only you and authorized guests can view your media.\n• Public mode: Anyone tapping the physical card can see your travel stories.\nAll photos are securely encrypted and stored on cloud servers.";
    }

    // Chủ đề: Chuyển nhượng / Tặng thẻ
    if (/chuyển nhượng|tặng|cho người khác|đổi chủ|sang tên|bán lại|transfer|gift/i.test(qLower)) {
      return isVi
        ? "Bạn hoàn toàn có thể tặng hoặc chuyển nhượng thẻ cho bạn bè:\n• Vào mục quản lý thẻ trong Dashboard, chọn 'Chuyển nhượng'.\n• Nhập email người nhận. Hệ thống sẽ gửi email xác nhận cho họ.\n• Khi người nhận bấm xác nhận, quyền sở hữu thẻ và album sẽ được chuyển sang tài khoản mới một cách an toàn."
        : "You can easily gift or transfer card ownership:\n• Go to your card dashboard and click 'Transfer'.\n• Enter the recipient's email address.\n• Once they confirm via the email link, full card ownership and album access transfer securely to their account.";
    }

    // Chủ đề: Bảo hành / Đổi trả / Hỏng chip
    if (/bảo hành|đổi trả|hỏng|lỗi|chip hỏng|1 đổi 1|chống nước|30 ngày|warranty|guarantee|defect/i.test(qLower)) {
      return isVi
        ? "Chính sách bảo hành chính hãng của VinaTap:\n• Đổi mới 1-1 miễn phí trong 30 ngày đầu nếu chip NFC gặp lỗi kỹ thuật từ nhà sản xuất.\n• Thẻ được chế tạo với vật liệu chống nước, chống xước cao cấp.\n• Mã serial dự phòng in trên thẻ đảm bảo bạn không bao giờ mất dữ liệu album dù thẻ có bị thất lạc."
        : "Official VinaTap Warranty Policy:\n• Free 1-to-1 replacement within 30 days for any technical chip defect.\n• Waterproof and scratch-resistant build quality.\n• Backup serial codes guarantee your memories are never lost.";
    }

    // Chủ đề: Dự án VinaTap là gì / Ý nghĩa / Giới thiệu
    if (/vinatap|dự án|là gì|giới thiệu|ý nghĩa|ý tưởng|sứ mệnh|mục đích|about|what is/i.test(qLower)) {
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
    const keywords = qLower.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 1);
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
        {/* ─── Navbar ─── */}
        <nav className={`home-navbar ${scrolled ? "is-scrolled" : ""}`}>
          <div className="container home-navbar__inner">
            <Logo className="home-navbar__logo" size={40} />

            <div className="home-navbar__links">
              <a href="#home" onClick={scrollToSection("home")}>
                {t(lang, "homeNavHome")}
              </a>
              <a href="#about" onClick={scrollToSection("about")}>
                {t(lang, "homeNavAbout")}
              </a>
              <Link
                href="/shop"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {t(lang, "homeNavProducts")}
              </Link>
              <a href="#provinces" onClick={scrollToSection("provinces")}>
                {t(lang, "homeNavHandbook")}
              </a>
              <a href="#faq" onClick={scrollToSection("faq")}>
                {t(lang, "homeNavFaq")}
              </a>
            </div>

            <div className="home-navbar__actions">
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
                        <span>
                          {user.role === "admin"
                            ? t(lang, "adminPortal")
                            : t(lang, "myCollection")}
                        </span>
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
        </nav>

        {/* ─── Hero (full-screen) ─── */}
        <section id="home" className="home-hero">
          <div className="container home-hero__grid">
            <div>
              <div className="home-eyebrow">
                <span className="home-eyebrow__dash" />
                {t(lang, "heroEyebrow")}
              </div>
              <h1 className="home-hero__title">
                <span className="home-hero__title-line">
                  {t(lang, "heroTitleLine1")}
                </span>
                <span className="home-hero__title-accent">
                  {t(lang, "heroTitleAccent")}
                </span>
              </h1>
              <p className="home-hero__desc">
                {t(lang, "heroDesc")}
              </p>
              <div className="home-hero__cta-row">
                <button
                  type="button"
                  className="home-btn-teal"
                  onClick={(e) => e.preventDefault()}
                >
                  {t(lang, "heroBtnActivate")}
                </button>
                <a
                  href="#provinces"
                  onClick={scrollToSection("provinces")}
                  className="home-btn-outline-ink"
                >
                  {t(lang, "heroBtnExplore")}
                </a>
              </div>

              <div className="home-hero__highlight">
                <div className="home-hero__highlight-icon">
                  <Puzzle size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="home-hero__highlight-title">{t(lang, "heroHighlightTitle")}</div>
                  <div className="home-hero__highlight-sub">
                    {t(lang, "heroHighlightSub")}
                  </div>
                </div>
              </div>
            </div>

            {/* Minh họa: điện thoại chạm thẻ NFC mở ứng dụng VinaTap */}
            <div className="home-hero__illustration">
              <div className="home-hero__blob" />
              <div className="home-hero__aura-ring" />

              {/* Polaroid Photo góc trên phải */}
              <div className="home-hero__polaroid">
                <div className="home-hero__polaroid-pin" />
                <div className="home-hero__polaroid-img-wrap">
                  <img
                    src="/lao-cai-fansipan.jpg"
                    alt="Hà Giang"
                    className="home-hero__polaroid-img"
                  />
                </div>
                <div className="home-hero__polaroid-caption">Hà Giang ♡</div>
              </div>

              {/* Điện thoại thông minh hiển thị giao diện VinaTap */}
              <div className="home-hero__phone">
                {/* Dynamic Island / Notch */}
                <div className="home-hero__phone-notch">
                  <span className="home-hero__notch-camera" />
                </div>

                {/* Status Bar */}
                <div className="home-hero__phone-statusbar">
                  <span className="home-hero__phone-time">09:41</span>
                  <div className="home-hero__phone-status-icons">
                    <Wifi size={11} strokeWidth={2.4} />
                    <span className="home-hero__phone-battery">
                      <span className="home-hero__phone-battery-level" />
                    </span>
                  </div>
                </div>

                {/* Màn hình App VinaTap */}
                <div className="home-hero__phone-screen">
                  {/* App Header */}
                  <div className="home-hero__app-header">
                    <div className="home-hero__app-logo">
                      <img src="/logo.png" alt="VinaTap" />
                    </div>
                    <Menu size={14} strokeWidth={2.2} className="home-hero__app-menu" />
                  </div>

                  {/* App Hero Banner */}
                  <div className="home-hero__app-banner">
                    <div className="home-hero__app-banner-overlay" />
                    <div className="home-hero__app-banner-content">
                      <div className="home-hero__app-banner-title">
                        {t(lang, "heroPhoneTitle")}
                      </div>
                      <div className="home-hero__app-banner-sub">
                        {t(lang, "heroPhoneSub")}
                      </div>
                    </div>
                  </div>

                  {/* App Search Bar */}
                  <div className="home-hero__app-search">
                    <Search size={11} strokeWidth={2.4} />
                    <span>{isVi ? "Tìm tỉnh thành, địa danh..." : "Search destination..."}</span>
                  </div>

                  {/* Filter Pills */}
                  <div className="home-hero__app-pills">
                    <span className="home-hero__app-pill is-active">{isVi ? "Tất cả" : "All"}</span>
                    <span className="home-hero__app-pill">{isVi ? "Miền Bắc" : "North"}</span>
                    <span className="home-hero__app-pill">{isVi ? "Miền Trung" : "Central"}</span>
                    <span className="home-hero__app-pill">{isVi ? "Miền Nam" : "South"}</span>
                  </div>

                  {/* Featured Section */}
                  <div className="home-hero__app-section">
                    <div className="home-hero__app-section-header">
                      <span>{isVi ? "Tỉnh thành nổi bật" : "Featured Destinations"}</span>
                      <ArrowRight size={11} />
                    </div>

                    <div className="home-hero__app-cards">
                      <div className="home-hero__app-card">
                        <div
                          className="home-hero__app-card-thumb"
                          style={{ backgroundImage: `url('/hue-cau-truong-tien.jpg')` }}
                        />
                        <div className="home-hero__app-card-info">
                          <div className="home-hero__app-card-name">Đà Nẵng</div>
                          <div className="home-hero__app-card-region">{isVi ? "Miền Trung" : "Central"}</div>
                        </div>
                      </div>

                      <div className="home-hero__app-card">
                        <div
                          className="home-hero__app-card-thumb"
                          style={{ backgroundImage: `url('/bac-ninh-quan-ho.jpg')` }}
                        />
                        <div className="home-hero__app-card-info">
                          <div className="home-hero__app-card-name">Hà Nội</div>
                          <div className="home-hero__app-card-region">{isVi ? "Miền Bắc" : "North"}</div>
                        </div>
                      </div>

                      <div className="home-hero__app-card">
                        <div
                          className="home-hero__app-card-thumb"
                          style={{ backgroundImage: `url('/auth-bg.jpg')` }}
                        />
                        <div className="home-hero__app-card-info">
                          <div className="home-hero__app-card-name">TP. Hồ Chí Minh</div>
                          <div className="home-hero__app-card-region">{isVi ? "Miền Nam" : "South"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* App Bottom Nav */}
                  <div className="home-hero__app-nav">
                    <div className="home-hero__app-nav-item is-active">
                      <Map size={12} />
                      <span>{isVi ? "Trang chủ" : "Home"}</span>
                    </div>
                    <div className="home-hero__app-nav-item">
                      <Globe size={12} />
                      <span>{isVi ? "Bản đồ" : "Map"}</span>
                    </div>
                    <div className="home-hero__app-nav-item">
                      <Camera size={12} />
                      <span>{isVi ? "Album" : "Album"}</span>
                    </div>
                    <div className="home-hero__app-nav-item">
                      <User size={12} />
                      <span>{isVi ? "Tài khoản" : "Account"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thẻ NFC đang chạm vào điện thoại */}
              <div className="home-hero__nfc-card">
                <div className="home-hero__nfc-card-glare" />
                <div className="home-hero__nfc-card-body">
                  <div className="home-hero__nfc-card-logo">
                    <img src="/logo.png" alt="VinaTap" />
                  </div>
                  <div className="home-hero__nfc-card-center">
                    <div className="home-hero__nfc-card-badge">
                      <span className="home-hero__nfc-card-badge-vn">VIỆT NAM</span>
                      <span className="home-hero__nfc-card-badge-sub">34 TỈNH THÀNH</span>
                      <span className="home-hero__nfc-card-badge-line">1 HÀNH TRÌNH</span>
                    </div>
                  </div>
                  <div className="home-hero__nfc-card-bottom">
                    <Radio size={15} strokeWidth={2.4} className="home-hero__nfc-icon" />
                  </div>
                </div>

                {/* Sóng NFC chạm lan tỏa */}
                <div className="home-hero__nfc-waves">
                  <span className="home-hero__nfc-wave home-hero__nfc-wave--1" />
                  <span className="home-hero__nfc-wave home-hero__nfc-wave--2" />
                  <span className="home-hero__nfc-wave home-hero__nfc-wave--3" />
                </div>
              </div>

              {/* Floating Feature Badges lấy từ Hình 2 */}
              <div className="home-hero__badge home-hero__badge--tap">
                <div className="home-hero__badge-icon home-hero__badge-icon--teal">
                  <Radio size={15} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="home-hero__badge-title">{t(lang, "heroCardActivate")}</div>
                  <div className="home-hero__badge-desc">{t(lang, "heroCardTapOpen")}</div>
                </div>
              </div>

              <div className="home-hero__badge home-hero__badge--ai">
                <div className="home-hero__badge-icon home-hero__badge-icon--orange">
                  <Sparkles size={15} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="home-hero__badge-title">{t(lang, "heroCardAiCaption")}</div>
                  <div className="home-hero__badge-desc">{t(lang, "heroCardAiDesc")}</div>
                </div>
              </div>

              <div className="home-hero__badge home-hero__badge--memory">
                <div className="home-hero__badge-icon home-hero__badge-icon--blue">
                  <Camera size={15} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="home-hero__badge-title">{t(lang, "heroCardMemories")}</div>
                  <div className="home-hero__badge-desc">{t(lang, "heroCardMemoriesDesc")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dải tính năng nhanh */}
          <div className="home-feature-strip">
            <div className="container home-feature-strip__inner">
              {[
                { icon: Smartphone, label: t(lang, "featNoApp") },
                { icon: Globe, label: t(lang, "featAllPhones") },
                { icon: ShieldCheck, label: t(lang, "featPrivacy") },
                { icon: Puzzle, label: t(lang, "featCollect34") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="home-feature-strip__item">
                  <span className="home-feature-strip__icon">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About (full-screen) ─── */}
        <RevealSection id="about" className="home-about">
          <div className="container home-about__grid">
            <div className="home-about__icons-grid">
              {[
                { icon: Puzzle, label: t(lang, "aboutIconPhysical") },
                { icon: Globe, label: t(lang, "aboutIconWeb") },
                { icon: Camera, label: t(lang, "aboutIconAi") },
                { icon: Gamepad2, label: t(lang, "aboutIconGamification") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="home-about__icon-tile">
                  <Icon size={26} strokeWidth={2} />
                  <span className="home-about__icon-label">{label}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="home-eyebrow">
                <span className="home-eyebrow__dash" />
                {t(lang, "aboutEyebrow")}
              </div>
              <h2 className="home-about__title">
                {t(lang, "aboutHeading")}
              </h2>
              <p className="home-about__desc">
                {t(lang, "aboutDescription")}
              </p>
              <div className="home-about__stats">
                <div>
                  <div className="home-about__stat-value">34+</div>
                  <div className="home-about__stat-label">{t(lang, "aboutStatProvinces")}</div>
                </div>
                <div>
                  <div className="home-about__stat-value">3</div>
                  <div className="home-about__stat-label">{t(lang, "aboutStatLayers")}</div>
                </div>
                <div>
                  <div className="home-about__stat-value">2026</div>
                  <div className="home-about__stat-label">{t(lang, "aboutStatYear")}</div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ─── Pricing / Các gói (full-screen) ─── */}
        <RevealSection id="gia" className="home-pricing">
          <div className="container home-section--pad-lg">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "pricingEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title">{t(lang, "pricingTitle")}</h2>
            </div>

            <div className="home-pricing__grid">
              {[
                {
                  name: t(lang, "pricingTier1Name"),
                  price: "49.000đ",
                  desc: t(lang, "pricingTier1Desc"),
                  features: [
                    t(lang, "pricingTier1F1"),
                    t(lang, "pricingTier1F2"),
                    t(lang, "pricingTier1F3"),
                  ],
                  badge: null,
                },
                {
                  name: t(lang, "pricingTier2Name"),
                  price: "139.000đ",
                  desc: t(lang, "pricingTier2Desc"),
                  features: [
                    t(lang, "pricingTier2F1"),
                    t(lang, "pricingTier2F2"),
                    t(lang, "pricingTier2F3"),
                  ],
                  badge: t(lang, "pricingTier2Badge"),
                },
                {
                  name: t(lang, "pricingTier3Name"),
                  price: "239.000đ",
                  desc: t(lang, "pricingTier3Desc"),
                  features: [
                    t(lang, "pricingTier3F1"),
                    t(lang, "pricingTier3F2"),
                    t(lang, "pricingTier3F3"),
                  ],
                  badge: null,
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className="home-pricing__card"
                >
                  {tier.badge && (
                    <span className="home-pricing__badge">{tier.badge}</span>
                  )}
                  <div className="home-pricing__name">{tier.name}</div>
                  <div className="home-pricing__price">{tier.price}</div>
                  <p className="home-pricing__desc">{tier.desc}</p>
                  <div className="home-pricing__features">
                    {tier.features.map((f) => (
                      <div key={f} className="home-pricing__feature">
                        <CheckCircle2
                          size={16}
                          strokeWidth={2.4}
                          className="home-pricing__feature-check"
                        />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/shop" className="home-pricing__cta">
                    {t(lang, "pricingChooseBtn")}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ─── Tỉnh thành nổi bật ─── */}
        <RevealSection id="provinces" className="home-provinces">
          <div className="container home-section--pad-sm">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "provEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--md">
                {t(lang, "provTitle")}
              </h2>
            </div>

            <div className="home-provinces__filters">
              <div className="home-provinces__search-wrap">
                <Search
                  size={16}
                  strokeWidth={2.2}
                  className="home-provinces__search-icon"
                />
                <input
                  className="input home-provinces__search"
                  placeholder={t(lang, "provSearchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {["all", "north", "central", "south", "island"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`home-provinces__region-btn ${region === r ? "is-active" : ""}`}
                >
                  {
                    {
                      all: t(lang, "provFilterAll"),
                      north: t(lang, "provFilterNorth"),
                      central: t(lang, "provFilterCentral"),
                      south: t(lang, "provFilterSouth"),
                      island: t(lang, "provFilterIsland"),
                    }[r]
                  }
                </button>
              ))}
            </div>

            {loading ? (
              <div className="home-provinces__loading">
                <div className="spinner" />
              </div>
            ) : provinceError && !provinces.length ? (
              <div
                className="home-provinces__empty"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "2.5rem 1rem",
                }}
              >
                <p style={{ color: "var(--color-text-secondary, #666)", margin: 0, fontSize: "1rem" }}>
                  {lang === "vi"
                    ? "Không thể kết nối đến máy chủ Backend để tải danh sách tỉnh thành."
                    : "Unable to connect to Backend server to load provinces."}
                </p>
                <button
                  type="button"
                  onClick={loadProvincesData}
                  className="home-provinces__region-btn is-active"
                  style={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 1.25rem",
                  }}
                >
                  <RefreshCw size={15} />
                  {lang === "vi" ? "Thử lại kết nối" : "Retry connection"}
                </button>
              </div>
            ) : !filtered.length ? (
              <p className="home-provinces__empty">
                {t(lang, "provEmpty")}
              </p>
            ) : (
              <div
                className="home-provinces__carousel"
                onMouseEnter={() => setProvinceAutoPaused(true)}
                onMouseLeave={() => setProvinceAutoPaused(false)}
              >
                {/* Nút lùi */}
                <button
                  aria-label="Previous"
                  onClick={() => scrollProvinceTrack(-1)}
                  className="home-provinces__nav-btn home-provinces__nav-btn--prev"
                >
                  <ChevronLeft size={18} strokeWidth={2.4} />
                </button>

                {/* Track cuộn ngang, tự trượt */}
                <div
                  ref={provinceTrackRef}
                  className="no-scrollbar home-provinces__track"
                >
                  {filtered.map((p) => {
                    const displayName = getProvinceName(p, lang);
                    const displayDesc = getProvinceDesc(p, lang);
                    return (
                      <Link
                        key={p.id}
                        href={`/province/${p.slug}`}
                        className="home-provinces__card-link"
                      >
                        <div className="home-provinces__card">
                          <div className="home-provinces__card-thumb">
                            {(getProvinceCover(p) || p.thumbnail_url) ? (
                              <img
                                src={getProvinceCover(p) || p.thumbnail_url}
                                alt={displayName}
                                loading="lazy"
                              />
                            ) : (
                              <div className="home-provinces__card-thumb-placeholder">
                                <Map size={30} strokeWidth={1.8} />
                              </div>
                            )}
                            <span className="home-provinces__region-badge">
                              {REGION_LABEL[lang]?.[p.region] || REGION_LABEL.vi[p.region]}
                            </span>
                          </div>
                          <div className="home-provinces__card-body">
                            <h3 className="home-provinces__card-title">
                              {displayName}
                            </h3>
                            <p className="home-provinces__card-desc">
                              {displayDesc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Nút tiến */}
                <button
                  aria-label="Next"
                  onClick={() => scrollProvinceTrack(1)}
                  className="home-provinces__nav-btn home-provinces__nav-btn--next"
                >
                  <ChevronRight size={18} strokeWidth={2.4} />
                </button>
              </div>
            )}
          </div>
        </RevealSection>

        {/* ─── Chính sách (tóm tắt) ─── */}
        <RevealSection id="chinh-sach" className="home-policy">
          <div className="container home-section--pad-sm">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "policyEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--sm">
                {t(lang, "policyTitle")}
              </h2>
            </div>
            <div className="home-policy__grid">
              {[
                {
                  icon: ShieldCheck,
                  title: t(lang, "policy1Title"),
                  desc: t(lang, "policy1Desc"),
                },
                {
                  icon: Lock,
                  title: t(lang, "policy2Title"),
                  desc: t(lang, "policy2Desc"),
                },
                {
                  icon: Truck,
                  title: t(lang, "policy3Title"),
                  desc: t(lang, "policy3Desc"),
                },
                {
                  icon: Gift,
                  title: t(lang, "policy4Title"),
                  desc: t(lang, "policy4Desc"),
                },
                {
                  icon: CreditCard,
                  title: t(lang, "policy5Title"),
                  desc: t(lang, "policy5Desc"),
                },
                {
                  icon: Sparkles,
                  title: t(lang, "policy6Title"),
                  desc: t(lang, "policy6Desc"),
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="home-policy__card">
                  <div className="home-policy__icon">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div className="home-policy__title">{title}</div>
                  <p className="home-policy__desc">{desc}</p>
                </div>
              ))}
            </div>
            <p className="home-policy__disclaimer">
              {t(lang, "policyDisclaimer")}
            </p>
            <div className="home-policy__action">
              <Link href="/policy" className="home-policy__action-link">
                <span>{lang === "vi" ? "Xem toàn bộ chính sách chi tiết" : "View full detailed policies"}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </RevealSection>

        {/* ─── Hỏi đáp ─── */}
        <RevealSection id="faq" className="home-faq">
          <div className="container home-section--pad-lg">
            <div className="home-section-head">
              <div className="home-eyebrow home-eyebrow--center">
                <span className="home-eyebrow__dash" />
                {t(lang, "faqEyebrow")}
                <span className="home-eyebrow__dash" />
              </div>
              <h2 className="home-section-title home-section-title--md">
                {t(lang, "faqTitle")}
              </h2>
            </div>

            <div className="home-faq-chat">
              <div className="home-faq-chat__header">
                <span className="home-faq-chat__avatar">
                  <Bot size={20} />
                </span>
                <div>
                  <strong>{t(lang, "faqBotName")}</strong>
                  <p>{t(lang, "faqBotStatus")}</p>
                </div>
              </div>

              <div
                className="home-faq-chat__messages"
                ref={faqChatContainerRef}
                aria-live="polite"
              >
                {faqMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`home-faq-chat__message is-${message.role}`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>

              <div className="home-faq-chat__suggestions">
                {(FAQ_DATA[lang] || FAQ_DATA.vi).map((item) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => sendFaqQuestion(item.q)}
                  >
                    {item.q}
                  </button>
                ))}
              </div>

              <form className="home-faq-chat__form" onSubmit={handleFaqSubmit}>
                <input
                  value={faqInput}
                  onChange={(e) => setFaqInput(e.target.value)}
                  placeholder={t(lang, "faqPlaceholder")}
                  aria-label="FAQ Question"
                />
                <button
                  type="submit"
                  disabled={!faqInput.trim()}
                  aria-label="Send"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </RevealSection>

        {/* ─── Footer ─── */}
        <footer className="home-footer">
          <div className="container home-footer__grid">
            <div>
              <Logo
                className="home-footer__brand-name"
                size={38}
                onClick={scrollToSection("home")}
              />
              <p className="home-footer__brand-desc">
                {t(lang, "footerDesc")}
              </p>
              <div className="home-footer__socials">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Facebook"
                  className="home-footer__social-btn"
                >
                  <Facebook size={15} strokeWidth={2.2} />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="TikTok"
                  className="home-footer__social-btn"
                >
                  <Music2 size={15} strokeWidth={2.2} />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="YouTube"
                  className="home-footer__social-btn"
                >
                  <Youtube size={15} strokeWidth={2.2} />
                </a>
              </div>
            </div>

            <FooterCol
              title={t(lang, "footerProductCol")}
              links={[
                { label: t(lang, "homeNavHome"), href: "/" },
                { label: t(lang, "heroBtnActivate"), href: "#" },
                { label: t(lang, "dashboard"), href: "/customer/dashboard" },
                { label: t(lang, "signIn"), href: "/auth" },
              ]}
            />
            <FooterCol
              title={t(lang, "footerExploreCol")}
              links={[
                { label: t(lang, "pricingEyebrow"), href: "/#gia" },
                { label: t(lang, "provTitle"), href: "/#provinces" },
                { label: t(lang, "aboutEyebrow"), href: "/#about" },
                { label: t(lang, "faqEyebrow"), href: "/#faq" },
              ]}
            />
            <FooterCol
              title={t(lang, "footerCompanyCol")}
              links={[
                { label: t(lang, "footerAbout"), href: "/#about" },
                { label: t(lang, "footerContact"), href: "/policy#support" },
                { label: t(lang, "footerTerms"), href: "/terms" },
                { label: t(lang, "footerPolicy"), href: "/policy" },
              ]}
            />
          </div>
          <div className="home-footer__bottom">
            <div className="container home-footer__bottom-inner">
              {t(lang, "footerCopyright")}
            </div>
          </div>
        </footer>
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
