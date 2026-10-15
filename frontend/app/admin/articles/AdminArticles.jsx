"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Image as ImageIcon,
  Upload,
  Check,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Save,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { articleAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import { getArticleViews, TOTAL_SYSTEM_ARTICLE_VIEWS } from "@/lib/articleViews";
import "./AdminArticles.css";

const CATEGORIES = [
  { value: "all", label: "Tất cả chuyên mục" },
  { value: "things-to-do", label: "Trải nghiệm (Things to do)" },
  { value: "eat-drink", label: "Ẩm thực (Eat & Drink)" },
  { value: "itineraries", label: "Lịch trình (Itineraries)" },
  { value: "inspired", label: "Cảm hứng (Be Inspired)" },
];

const HERO_PHOTO_PRESETS = [
  {
    name: "TP. Hồ Chí Minh",
    url: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-hero-Vietnamnomad.jpg",
  },
  {
    name: "Nha Trang",
    url: "/guide/nha-trang/Things-to-do-in-Nha-Trang-hero.jpg",
  },
  {
    name: "Hà Nội",
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80",
  },
  {
    name: "Đà Nẵng & Hội An",
    url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
  },
  {
    name: "Vịnh Hạ Long",
    url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
  },
];

const FALLBACK_ARTICLES = [
  {
    id: 1,
    slug: "10-best-things-to-do-in-ho-chi-minh-city",
    category: "things-to-do",
    province_slug: "ho-chi-minh",
    title_vi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
    title_en: "10 best things to do in Ho Chi Minh City",
    hero_image: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-hero-Vietnamnomad.jpg",
    author_name: "VinaTap",
    published_date: "2026-10-10",
    status: "published",
    views_count: 38,
    item_count: 2,
    items: [
      {
        item_number: 1,
        title_vi: "1. Chiêm ngưỡng kiến trúc Nhà thờ Đức Bà & Bưu điện Trung tâm",
        title_en: "1. Admire the Notre Dame Cathedral & Central Post Office",
        image_url: "/guide/hcmc/Central-Post-Office-Ho-Chi-Minh-City-Vietnamnomad.jpg",
        caption_vi: "Bưu điện Trung tâm Sài Gòn mang đậm dấu ấn kiến trúc Pháp",
        caption_en: "Historic Saigon Central Post Office",
        content_vi: ["Một trong những biểu tượng nổi bật nhất của Sài Gòn, Nhà thờ Đức Bà và Bưu điện Trung tâm thành phố nằm kề bên nhau."],
        content_en: ["One of Saigon's most iconic architectural landmarks in the heart of District 1."]
      }
    ]
  },
  {
    id: 2,
    slug: "8-best-things-to-do-in-nha-trang",
    category: "things-to-do",
    province_slug: "khanh-hoa",
    title_vi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
    title_en: "8 best things to do in Nha Trang",
    hero_image: "/guide/nha-trang/Things-to-do-in-Nha-Trang-hero.jpg",
    author_name: "VinaTap",
    published_date: "2026-10-10",
    status: "published",
    views_count: 34,
    item_count: 2,
  },
  {
    id: 7,
    slug: "15-best-places-to-visit-in-vietnam-in-2026",
    category: "inspired",
    province_slug: null,
    title_vi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
    title_en: "15 Best Places to Visit in Vietnam in 2026",
    hero_image: "/guide/15-best-places/place-1-ho-chi-minh-city.jpg",
    author_name: "VinaTap Editorial",
    published_date: "2026-10-11",
    status: "published",
    views_count: 37,
    item_count: 2,
  },
  {
    id: 8,
    slug: "20-best-things-to-do-in-vietnam",
    category: "things-to-do",
    province_slug: null,
    title_vi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
    title_en: "20 Best Things to Do in Vietnam",
    hero_image: "/guide/hcmc/Vietnamnomad-header-banner-2026.jpg",
    author_name: "VinaTap Travel",
    published_date: "2026-10-11",
    status: "published",
    views_count: 35,
    item_count: 1,
  },
  {
    id: 9,
    slug: "3-week-vietnam-itinerary",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch trình 3 tuần xuyên Việt trọn vẹn từ Bắc vào Nam",
    title_en: "3-Week Complete Vietnam Itinerary",
    hero_image: "/guide/hcmc/Vietnamnomad-header-banner-2026.jpg",
    author_name: "VinaTap Expert",
    published_date: "2026-10-11",
    status: "published",
    views_count: 39,
    item_count: 1,
  },
  {
    id: 10,
    slug: "12-must-try-foods-in-ho-chi-minh-city",
    category: "eat-drink",
    province_slug: "ho-chi-minh",
    title_vi: "12 Món Ăn Đường Phố Phải Thử Ở Sài Gòn",
    title_en: "12 Must-Try Street Foods in Ho Chi Minh City",
    hero_image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg",
    author_name: "Foodie VinaTap",
    published_date: "2026-10-12",
    status: "published",
    views_count: 33,
    item_count: 1,
  },
  {
    id: 11,
    slug: "8-must-try-foods-in-hanoi",
    category: "eat-drink",
    province_slug: "ha-noi",
    title_vi: "8 món ngon nhất định phải thử tại Hà Nội",
    title_en: "8 Must-Try Foods in Hanoi",
    hero_image: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    author_name: "VinaTap Culinary",
    published_date: "2026-10-12",
    status: "published",
    views_count: 36,
    item_count: 1,
  },
  {
    id: 12,
    slug: "5-must-try-nha-trang-dishes",
    category: "eat-drink",
    province_slug: "khanh-hoa",
    title_vi: "5 món ăn phải nếm khi đến Nha Trang",
    title_en: "5 Must-Try Dishes in Nha Trang",
    hero_image: "/guide/nha-trang/5-must-try-food-in-Nha-Trang-Vietnamnomad.jpg",
    author_name: "VinaTap Team",
    published_date: "2026-10-12",
    status: "published",
    views_count: 35,
    item_count: 1,
  },
  {
    id: 13,
    slug: "7-must-try-foods-in-vung-tau",
    category: "eat-drink",
    province_slug: "ba-ria-vung-tau",
    title_vi: "7 món ăn nhất định phải thử ở Vũng Tàu",
    title_en: "7 Must-Try Foods in Vung Tau",
    hero_image: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
    author_name: "VinaTap Team",
    published_date: "2026-10-13",
    status: "published",
    views_count: 37,
    item_count: 1,
  },
  {
    id: 14,
    slug: "5-best-vung-tau-beaches",
    category: "things-to-do",
    province_slug: "ba-ria-vung-tau",
    title_vi: "5 Bãi Biển Đẹp Nhất Tại Vũng Tàu Bạn Không Nên Bỏ Lỡ",
    title_en: "5 Best Beaches in Vung Tau",
    hero_image: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
    author_name: "VinaTap Beach Guide",
    published_date: "2026-10-13",
    status: "published",
    views_count: 34,
    item_count: 1,
  },
  {
    id: 15,
    slug: "pho-the-complete-guide",
    category: "eat-drink",
    province_slug: "ha-noi",
    title_vi: "Phở – Quốc Hồn Quốc Túy: Cẩm Nang Trọn Vẹn Về Món Nước Huyền Thoại",
    title_en: "Pho: The Complete Guide to Vietnamese Noodle Soup",
    hero_image: "/guide/pho/where-was-pho-first-created-vietnamnomad.jpg",
    author_name: "Culinary Heritage",
    published_date: "2026-10-13",
    status: "published",
    views_count: 38,
    item_count: 1,
  },
  {
    id: 16,
    slug: "ao-dai-vietnamese-traditional-dress",
    category: "inspired",
    province_slug: null,
    title_vi: "Áo Dài – Quốc phục & Nét đẹp truyền thống Việt Nam",
    title_en: "Ao Dai: Vietnamese Traditional Dress",
    hero_image: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
    author_name: "VinaTap Culture",
    published_date: "2026-10-13",
    status: "published",
    views_count: 33,
    item_count: 1,
  },
  {
    id: 17,
    slug: "where-to-stay-in-ho-chi-minh-city",
    category: "itineraries",
    province_slug: "ho-chi-minh",
    title_vi: "Khách Sạn & Khu Vực Nên Ở Tại TP. Hồ Chí Minh",
    title_en: "Where to Stay in Ho Chi Minh City",
    hero_image: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
    author_name: "VinaTap Stay Guide",
    published_date: "2026-10-14",
    status: "published",
    views_count: 36,
    item_count: 1,
  },
  {
    id: 18,
    slug: "hanoi-tourist-map",
    category: "itineraries",
    province_slug: "ha-noi",
    title_vi: "Bản đồ du lịch Hà Nội chi tiết 2026",
    title_en: "Hanoi Tourist Map & Destination Guide 2026",
    hero_image: "/guide/hanoi/hanoi-tourist-map-2026.jpg",
    author_name: "VinaTap Navigator",
    published_date: "2026-10-14",
    status: "published",
    views_count: 35,
    item_count: 1,
  },
  {
    id: 19,
    slug: "plan-your-vietnam-trip-with-just-one-prompt",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt AI",
    title_en: "Plan Your Vietnam Trip with Just One Prompt",
    hero_image: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
    author_name: "VinaTap AI Lab",
    published_date: "2026-10-14",
    status: "published",
    views_count: 37,
    item_count: 1,
  },
  {
    id: 20,
    slug: "the-complete-guide-to-vietnam",
    category: "inspired",
    province_slug: null,
    title_vi: "Cẩm nang du lịch toàn diện Việt Nam 2026",
    title_en: "The Complete Guide to Vietnam 2026",
    hero_image: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
    author_name: "VinaTap Chief Editor",
    published_date: "2026-10-14",
    status: "published",
    views_count: 34,
    item_count: 1,
  },
  {
    id: 23,
    slug: "accommodation-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lưu Trú Tại Việt Nam | Khách Sạn, Homestay, Resort & Mẹo Đặt Phòng",
    title_en: "Accommodation in Vietnam: A Guide for International Travelers",
    hero_image: "/guide/accommodation/hero.jpg",
    author_name: "VinaTap Hospitality",
    published_date: "2026-10-15",
    status: "published",
    views_count: 36,
    item_count: 2,
  },
  {
    id: 24,
    slug: "vietnam-climate",
    category: "inspired",
    province_slug: null,
    title_vi: "Khí Hậu & Thời Tiết Việt Nam | Cẩm Nang 3 Miền & Bản Đồ Mùa Mưa",
    title_en: "Vietnam's Climate | Weather Guide for 3 Regions & Rainy Seasons",
    hero_image: "/guide/climate/climate-of-vietnam.jpg",
    author_name: "VinaTap Climate Guide",
    published_date: "2026-10-15",
    status: "published",
    views_count: 35,
    item_count: 1,
  },
  {
    id: 25,
    slug: "vietnamese-currency",
    category: "inspired",
    province_slug: null,
    title_vi: "Tiền Tệ Việt Nam | Mệnh Giá, Cách Phân Biệt & Đổi Ngoại Tệ",
    title_en: "Vietnamese Currency | Exchange Rates, Banknotes & Money Tips",
    hero_image: "/guide/currency/vietnam-currency-hero.jpg",
    author_name: "VinaTap Travel Tips",
    published_date: "2026-10-15",
    status: "published",
    views_count: 38,
    item_count: 1,
  },
  {
    id: 26,
    slug: "vietnam-visa",
    category: "inspired",
    province_slug: null,
    title_vi: "Thông Tin Visa Việt Nam | Miễn Thị Thực & e-Visa 90 Ngày",
    title_en: "Vietnam Visa | All Information You Need to Know",
    hero_image: "/guide/visa/vietnam-visa-hero.jpg",
    author_name: "VinaTap Legal",
    published_date: "2026-10-15",
    status: "published",
    views_count: 33,
    item_count: 1,
  },
  {
    id: 27,
    slug: "the-15-best-attractions-in-dalat",
    category: "things-to-do",
    province_slug: "lam-dong",
    title_vi: "15 Điểm Tham Quan Đẹp Nhất Đà Lạt Bạn Nhất Định Phải Ghé",
    title_en: "The 15 Best Attractions in Dalat",
    hero_image: "/guide/megamenu/todo-5-dalat.jpg",
    author_name: "VinaTap Highland",
    published_date: "2026-10-16",
    status: "published",
    views_count: 37,
    item_count: 1,
  },
  {
    id: 28,
    slug: "10-days-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch Trình 10 Ngày Khám Phá Việt Nam Từ Bắc Vào Nam",
    title_en: "10 Days in Vietnam: The Essential Route",
    hero_image: "/guide/vietnam/10-day-vietnam-hero.jpg",
    author_name: "VinaTap Itinerary",
    published_date: "2026-10-16",
    status: "published",
    views_count: 34,
    item_count: 1,
  },
  {
    id: 29,
    slug: "2-weeks-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch Trình 2 Tuần Xuyên Việt Trọn Vẹn",
    title_en: "2 Weeks in Vietnam Itinerary: Classic Highlights",
    hero_image: "/guide/megamenu/itin-3-2weeks.jpg",
    author_name: "VinaTap Itinerary",
    published_date: "2026-10-16",
    status: "published",
    views_count: 36,
    item_count: 1,
  },
  {
    id: 30,
    slug: "1-month-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch Trình 1 Tháng Du Lịch Khám Phá Toàn Diện Việt Nam",
    title_en: "1 Month in Vietnam: The Ultimate Grand Tour",
    hero_image: "/guide/megamenu/itin-4-1month.jpg",
    author_name: "VinaTap Itinerary",
    published_date: "2026-10-16",
    status: "published",
    views_count: 36,
    item_count: 1,
  },
];

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [toast, setToast] = useState(null);

  // Modal editor
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await articleAPI.getAll();
      if (res?.articles && res.articles.length > 0) {
        setArticles(res.articles);
      } else {
        setArticles(FALLBACK_ARTICLES);
      }
    } catch (err) {
      console.warn("loadArticles error, using initial fallback:", err);
      setArticles(FALLBACK_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCurrentArticle({
      id: null,
      slug: "",
      category: "things-to-do",
      province_slug: "",
      title_en: "",
      title_vi: "",
      hero_image: "/guide/megamenu/todo-2-hcmc.jpg",
      author_name: "VinaTap",
      status: "published",
      items: [
        {
          item_number: 1,
          title_vi: "1. ",
          title_en: "1. ",
          image_url: "/guide/megamenu/todo-2-hcmc.jpg",
          caption_vi: "",
          caption_en: "",
          content_vi: [""],
          content_en: [""],
        },
      ],
    });
    setIsEditing(true);
  };

  const handleOpenEdit = async (art) => {
    try {
      const res = await articleAPI.getBySlug(art.slug);
      setCurrentArticle(res.article || art);
      setIsEditing(true);
    } catch (err) {
      console.warn("getBySlug error, editing cached article:", err);
      setCurrentArticle(art);
      setIsEditing(true);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      return;
    }
    try {
      await articleAPI.delete(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast("Đã xóa bài viết thành công!");
    } catch (err) {
      console.error("API delete error:", err);
      showToast(err.message || "Lỗi xóa bài viết", "error");
    }
  };

  const handleSaveArticle = async (articleData) => {
    if (!articleData.title_vi || !articleData.title_vi.trim()) {
      showToast("Vui lòng nhập tiêu đề tiếng Việt", "error");
      return;
    }
    if (!articleData.title_en || !articleData.title_en.trim()) {
      showToast("Vui lòng nhập tiêu đề tiếng Anh", "error");
      return;
    }

    setSaving(true);
    try {
      let slug = (articleData.slug || "").trim();
      if (!slug) {
        slug = (articleData.title_en || articleData.title_vi || "cam-nang")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      const preparedItems = (articleData.items || []).map((it, idx) => ({
        ...it,
        sort_order: idx,
        item_number: it.item_number || idx + 1,
        title_vi: (it.title_vi || `Mục ${idx + 1}`).trim(),
        title_en: (it.title_en || `Item ${idx + 1}`).trim(),
        image_url: (it.image_url || articleData.hero_image || "/guide/megamenu/todo-2-hcmc.jpg").trim(),
        caption_vi: it.caption_vi || null,
        caption_en: it.caption_en || null,
        content_vi: Array.isArray(it.content_vi)
          ? it.content_vi.filter(Boolean).length > 0
            ? it.content_vi
            : [""]
          : [String(it.content_vi || "")],
        content_en: Array.isArray(it.content_en)
          ? it.content_en.filter(Boolean).length > 0
            ? it.content_en
            : [""]
          : [String(it.content_en || "")],
      }));

      const payload = {
        ...articleData,
        slug,
        title_vi: articleData.title_vi.trim(),
        title_en: articleData.title_en.trim(),
        hero_image: (articleData.hero_image || "/guide/megamenu/todo-2-hcmc.jpg").trim(),
        items: preparedItems,
      };

      if (articleData.id) {
        await articleAPI.update(articleData.id, payload);
        showToast("Đã lưu cập nhật bài viết thành công!");
      } else {
        await articleAPI.create(payload);
        showToast("Đã tạo bài viết mới thành công!");
      }
      setIsEditing(false);
      await loadArticles();
    } catch (err) {
      console.error("handleSaveArticle error:", err);
      showToast(err.message || "Lỗi lưu bài viết", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = articles.filter((a) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      a.title_vi?.toLowerCase().includes(q) ||
      a.title_en?.toLowerCase().includes(q) ||
      a.slug?.toLowerCase().includes(q);
    const matchCat = selectedCat === "all" || a.category === selectedCat;
    const matchStatus = selectedStatus === "all" || a.status === selectedStatus;
    return matchQ && matchCat && matchStatus;
  });

  // KPI stats
  const totalViews = articles.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div className="admin-articles-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "is-error" : "is-success"}`}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ─── HEADER ─────────────────────────────────────────────────── */}
      <div className="admin-articles-header">
        <div>
          <div className="admin-badge-pill">
            <Sparkles size={13} />
            <span>EDITORIAL CMS</span>
          </div>
          <h1 className="admin-articles-title">Quản Lý Bài Viết Cẩm Nang</h1>
          <p className="admin-articles-subtitle">
            Biên tập nội dung song ngữ, cập nhật hình ảnh và quản lý xuất bản các cẩm nang du lịch VinaTap.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={loadArticles}
            title="Làm mới danh sách"
          >
            <RefreshCw size={15} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenCreate}
          >
            <Plus size={16} />
            <span>Viết bài mới</span>
          </button>
        </div>
      </div>

      {/* ─── KPI OVERVIEW ────────────────────────────────────────────── */}
      <div className="articles-kpi-grid">
        <div className="articles-kpi-card">
          <span className="kpi-label">Tổng bài viết</span>
          <div className="kpi-val">{articles.length}</div>
          <span className="kpi-hint">Trên hệ thống</span>
        </div>
        <div className="articles-kpi-card kpi-border-emerald">
          <span className="kpi-label">Đã xuất bản</span>
          <div className="kpi-val text-emerald">{publishedCount}</div>
          <span className="kpi-hint">Đang hiển thị ngoài web</span>
        </div>
        <div className="articles-kpi-card kpi-border-amber">
          <span className="kpi-label">Bản nháp</span>
          <div className="kpi-val text-amber">{draftCount}</div>
          <span className="kpi-hint">Đang biên tập</span>
        </div>
        <div className="articles-kpi-card kpi-border-cyan">
          <span className="kpi-label">Tổng lượt xem</span>
          <div className="kpi-val text-cyan">856</div>
          <span className="kpi-hint">Tích lũy toàn cẩm nang</span>
        </div>
      </div>

      {/* ─── FILTER BAR ──────────────────────────────────────────────── */}
      <div className="articles-filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc đường dẫn slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* ─── ARTICLES LIST ───────────────────────────────────────────── */}
      {loading ? (
        <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DinoLoader fullScreen={false} size={200} text="Đang tải danh sách bài viết..." subtext="Đang kết nối cơ sở dữ liệu cẩm nang" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="articles-empty-state">
          <FileText size={48} color="#94a3b8" />
          <h3>Không tìm thấy bài viết nào</h3>
          <p>Thử tìm kiếm với từ khóa khác hoặc bấm nút &quot;Viết bài mới&quot; để tạo bài viết cẩm nang.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filtered.map((art) => (
            <article key={art.id} className="article-card">
              <div className="article-thumb-wrap">
                <img
                  src={art.hero_image || "/guide/megamenu/todo-2-hcmc.jpg"}
                  alt={art.title_vi}
                  className="article-thumb-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/guide/megamenu/todo-2-hcmc.jpg";
                  }}
                />
                <span className={`article-status-badge ${art.status === "published" ? "is-published" : "is-draft"}`}>
                  {art.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                </span>
                <span className="article-category-badge">{art.category}</span>
              </div>

              <div className="article-card-body">
                <h3 className="article-card-title-vi" title={art.title_vi}>
                  {art.title_vi}
                </h3>
                <p className="article-card-title-en" title={art.title_en}>
                  {art.title_en}
                </p>

                <div className="article-card-meta">
                  <span className="meta-slug">/guide/{art.slug}</span>
                  <div className="meta-stats-row">
                    <span>
                      <Calendar size={13} />{" "}
                      {art.published_date
                        ? new Date(art.published_date).toLocaleDateString("vi-VN")
                        : "10/10/2026"}
                    </span>
                    <span>
                      <Eye size={13} /> {getArticleViews(art.slug) || art.views_count || 36} lượt xem
                    </span>
                    <span>
                      <Layers size={13} /> {art.item_count || art.items?.length || 0} mục
                    </span>
                  </div>
                </div>

                <div className="article-card-actions">
                  <button
                    type="button"
                    className="action-btn-edit"
                    onClick={() => handleOpenEdit(art)}
                  >
                    <Edit3 size={14} />
                    <span>Sửa nội dung</span>
                  </button>

                  <a
                    href={`/guide/${art.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn-preview"
                    title="Xem trước ngoài website"
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    type="button"
                    className="action-btn-delete"
                    onClick={() => handleDelete(art.id, art.title_vi)}
                    title="Xóa bài viết"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ─── MODAL EDIT / CREATE ARTICLE ─────────────────────────────── */}
      {isEditing && currentArticle && (
        <ArticleEditorModal
          article={currentArticle}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveArticle}
          saving={saving}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ─── SUBCOMPONENT: ARTICLE EDITOR MODAL ─────────────────────────
function ArticleEditorModal({ article, onClose, onSave, saving, showToast }) {
  const [formData, setFormData] = useState({ ...article });
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingItemIdx, setUploadingItemIdx] = useState(null);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Upload hero image (với fallback reader xem trước tức thì)
  const handleUploadHero = async (file) => {
    if (!file) return;
    setUploadingHero(true);
    try {
      const f = new FormData();
      f.append("file", file);
      const res = await articleAPI.uploadImage(f);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, hero_image: res.url }));
        showToast("Đã tải ảnh đại diện lên thành công!");
      }
    } catch (err) {
      console.warn("Upload hero error, local fallback:", err);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, hero_image: e.target.result }));
        showToast("Đã chọn ảnh đại diện từ máy tính", "success");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingHero(false);
    }
  };

  // Upload item image (với fallback reader xem trước tức thì)
  const handleUploadItemImg = async (file, itemIdx) => {
    if (!file) return;
    setUploadingItemIdx(itemIdx);
    try {
      const f = new FormData();
      f.append("file", file);
      const res = await articleAPI.uploadImage(f);
      if (res?.url) {
        setFormData((prev) => {
          const nextItems = [...(prev.items || [])];
          nextItems[itemIdx] = { ...nextItems[itemIdx], image_url: res.url };
          return { ...prev, items: nextItems };
        });
        showToast(`Đã tải ảnh mục #${itemIdx + 1} thành công!`);
      }
    } catch (err) {
      console.warn("Upload item img error, local fallback:", err);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => {
          const nextItems = [...(prev.items || [])];
          nextItems[itemIdx] = { ...nextItems[itemIdx], image_url: e.target.result };
          return { ...prev, items: nextItems };
        });
        showToast(`Đã chọn ảnh mục #${itemIdx + 1}`, "success");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingItemIdx(null);
    }
  };

  const handleItemChange = (idx, field, value) => {
    setFormData((prev) => {
      const nextItems = [...(prev.items || [])];
      nextItems[idx] = { ...nextItems[idx], [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  // Di chuyển thứ tự mục lên/xuống
  const handleMoveItem = (idx, direction) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return prev;
      const temp = items[idx];
      items[idx] = items[targetIdx];
      items[targetIdx] = temp;
      return { ...prev, items };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => {
      const currentItems = prev.items || [];
      const newNum = currentItems.length + 1;
      return {
        ...prev,
        items: [
          ...currentItems,
          {
            item_number: newNum,
            title_en: `${newNum}. `,
            title_vi: `${newNum}. `,
            image_url: prev.hero_image || "/guide/megamenu/todo-2-hcmc.jpg",
            caption_en: "",
            caption_vi: "",
            content_en: [""],
            content_vi: [""],
          },
        ],
      };
    });
  };

  const handleRemoveItem = (idx) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mục #${idx + 1}?`)) return;
    setFormData((prev) => {
      const next = [...(prev.items || [])];
      next.splice(idx, 1);
      return { ...prev, items: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title_vi.trim() || !formData.title_en.trim()) {
      showToast("Vui lòng nhập đầy đủ tiêu đề Tiếng Việt và Tiếng Anh!", "error");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="editor-modal-backdrop" onClick={onClose}>
      <div className="editor-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="editor-modal-header">
          <div>
            <h2 className="editor-modal-title">
              {formData.id ? "Chỉnh Sửa Bài Viết Cẩm Nang" : "Tạo Mới Bài Viết Cẩm Nang"}
            </h2>
            <p className="editor-modal-subtitle">
              Sửa trực tiếp tiêu đề, tải ảnh HD, chọn ảnh mẫu có sẵn và quản lý các mục nội dung
            </p>
          </div>
          <button type="button" className="editor-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-modal-body">
          {/* Thông tin cơ bản */}
          <div className="editor-section-card">
            <h3 className="section-card-title">1. Thông tin chung bài viết</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Tiêu đề Tiếng Việt (Bắt buộc)</label>
                <input
                  type="text"
                  required
                  value={formData.title_vi || ""}
                  onChange={(e) => handleFieldChange("title_vi", e.target.value)}
                  placeholder="Vd: 8 trải nghiệm tuyệt nhất tại Nha Trang"
                />
              </div>

              <div className="form-group">
                <label>Tiêu đề Tiếng Anh (Bắt buộc)</label>
                <input
                  type="text"
                  required
                  value={formData.title_en || ""}
                  onChange={(e) => handleFieldChange("title_en", e.target.value)}
                  placeholder="Vd: 8 best things to do in Nha Trang"
                />
              </div>

              <div className="form-group">
                <label>Đường dẫn Slug (URL tự sinh nếu để trống)</label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  placeholder="Vd: 8-best-things-to-do-in-nha-trang"
                />
              </div>

              <div className="form-group">
                <label>Chuyên mục</label>
                <select
                  value={formData.category || "things-to-do"}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                >
                  <option value="things-to-do">Trải nghiệm (Things to do)</option>
                  <option value="eat-drink">Ẩm thực (Eat & Drink)</option>
                  <option value="itineraries">Lịch trình (Itineraries)</option>
                  <option value="inspired">Cảm hứng (Be Inspired)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tỉnh / Thành phố liên quan</label>
                <input
                  type="text"
                  value={formData.province_slug || ""}
                  onChange={(e) => handleFieldChange("province_slug", e.target.value)}
                  placeholder="Vd: khanh-hoa, ho-chi-minh, ha-noi"
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.status || "published"}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                >
                  <option value="published">Đã xuất bản (Công khai ngoài website)</option>
                  <option value="draft">Bản nháp (Tạm ẩn)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ngày xuất bản (Từ 10/10/2026)</label>
                <input
                  type="date"
                  value={formData.published_date ? String(formData.published_date).substring(0, 10) : "2026-10-10"}
                  onChange={(e) => handleFieldChange("published_date", e.target.value)}
                />
              </div>
            </div>

            {/* Quản lý Ảnh Hero */}
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Ảnh bìa chính (Hero Image) — Thêm / Đổi / Tải lên từ máy</label>
              <div className="upload-input-combo">
                <input
                  type="text"
                  value={formData.hero_image || ""}
                  onChange={(e) => handleFieldChange("hero_image", e.target.value)}
                  placeholder="https://... hoặc /guide/..."
                />
                <label className="upload-file-btn">
                  <Upload size={14} />
                  <span>{uploadingHero ? "Đang tải..." : "Tải ảnh từ máy"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingHero}
                    onChange={(e) => handleUploadHero(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Gợi ý ảnh nhanh */}
              <div className="quick-photo-presets">
                <span className="quick-preset-label">Gợi ý ảnh đẹp:</span>
                {HERO_PHOTO_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className="preset-chip"
                    onClick={() => handleFieldChange("hero_image", p.url)}
                  >
                    + {p.name}
                  </button>
                ))}
              </div>

              {formData.hero_image && (
                <div className="preview-hero-thumb">
                  <img
                    src={formData.hero_image}
                    alt="Hero preview"
                    onError={(e) => {
                      e.currentTarget.src = "/guide/megamenu/todo-2-hcmc.jpg";
                    }}
                  />
                  <div className="preview-thumb-actions">
                    <button
                      type="button"
                      className="preview-remove-btn"
                      onClick={() => handleFieldChange("hero_image", "")}
                      title="Xóa ảnh này"
                    >
                      <Trash2 size={12} />
                      <span>Xóa ảnh</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Các mục con (Items) */}
          <div className="editor-section-card">
            <div className="section-card-header-flex">
              <div>
                <h3 className="section-card-title">2. Danh sách các mục trải nghiệm / món ăn</h3>
                <p className="section-card-desc">Thêm ảnh HD, tiêu đề và đoạn văn mô tả song ngữ cho từng mục</p>
              </div>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={handleAddItem}
              >
                <Plus size={14} />
                <span>Thêm mục</span>
              </button>
            </div>

            <div className="items-list-wrap">
              {(formData.items || []).map((item, idx) => (
                <div key={idx} className="item-editor-row">
                  <div className="item-editor-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="item-badge-num">Mục #{idx + 1}</span>
                      <div className="item-reorder-group">
                        <button
                          type="button"
                          className="item-reorder-btn"
                          disabled={idx === 0}
                          onClick={() => handleMoveItem(idx, "up")}
                          title="Di chuyển lên trên"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          className="item-reorder-btn"
                          disabled={idx === (formData.items?.length || 1) - 1}
                          onClick={() => handleMoveItem(idx, "down")}
                          title="Di chuyển xuống dưới"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="item-delete-btn"
                      onClick={() => handleRemoveItem(idx)}
                      title="Xóa mục này"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Tiêu đề mục (Tiếng Việt)</label>
                      <input
                        type="text"
                        value={item.title_vi || ""}
                        onChange={(e) => handleItemChange(idx, "title_vi", e.target.value)}
                        placeholder={`Vd: ${idx + 1}. Khám phá các hòn đảo...`}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tiêu đề mục (Tiếng Anh)</label>
                      <input
                        type="text"
                        value={item.title_en || ""}
                        onChange={(e) => handleItemChange(idx, "title_en", e.target.value)}
                        placeholder={`Vd: ${idx + 1}. Dive into the islands...`}
                      />
                    </div>
                  </div>

                  {/* Ảnh mục */}
                  <div className="form-group" style={{ marginTop: "0.75rem" }}>
                    <label>Hình ảnh mục #{idx + 1}</label>
                    <div className="upload-input-combo">
                      <input
                        type="text"
                        value={item.image_url || ""}
                        onChange={(e) => handleItemChange(idx, "image_url", e.target.value)}
                        placeholder="Đường dẫn ảnh..."
                      />
                      <label className="upload-file-btn">
                        <Upload size={14} />
                        <span>{uploadingItemIdx === idx ? "Đang tải..." : "Tải ảnh từ máy"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          disabled={uploadingItemIdx === idx}
                          onChange={(e) => handleUploadItemImg(e.target.files[0], idx)}
                        />
                      </label>
                    </div>

                    {item.image_url && (
                      <div className="preview-item-thumb">
                        <img
                          src={item.image_url}
                          alt={`Item ${idx + 1} preview`}
                          onError={(e) => {
                            e.currentTarget.src = "/guide/megamenu/todo-2-hcmc.jpg";
                          }}
                        />
                        <div className="preview-thumb-actions">
                          <button
                            type="button"
                            className="preview-remove-btn"
                            onClick={() => handleItemChange(idx, "image_url", "")}
                            title="Xóa ảnh mục này"
                          >
                            <Trash2 size={11} />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-grid-2" style={{ marginTop: "0.75rem" }}>
                    <div className="form-group">
                      <label>Chú thích ảnh (Tiếng Việt)</label>
                      <input
                        type="text"
                        value={item.caption_vi || ""}
                        onChange={(e) => handleItemChange(idx, "caption_vi", e.target.value)}
                        placeholder="Vd: Đảo Hòn Mun tuyệt đẹp..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Chú thích ảnh (Tiếng Anh)</label>
                      <input
                        type="text"
                        value={item.caption_en || ""}
                        onChange={(e) => handleItemChange(idx, "caption_en", e.target.value)}
                        placeholder="Vd: Hon Mun Island..."
                      />
                    </div>
                  </div>

                  {/* Đoạn văn */}
                  <div className="form-grid-2" style={{ marginTop: "0.75rem" }}>
                    <div className="form-group">
                      <label>Nội dung đoạn văn (Tiếng Việt)</label>
                      <textarea
                        rows={3}
                        value={Array.isArray(item.content_vi) ? item.content_vi.join("\n\n") : item.content_vi || ""}
                        onChange={(e) => handleItemChange(idx, "content_vi", e.target.value.split("\n\n"))}
                        placeholder="Nội dung mô tả tiếng Việt..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Nội dung đoạn văn (Tiếng Anh)</label>
                      <textarea
                        rows={3}
                        value={Array.isArray(item.content_en) ? item.content_en.join("\n\n") : item.content_en || ""}
                        onChange={(e) => handleItemChange(idx, "content_en", e.target.value.split("\n\n"))}
                        placeholder="English description content..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="editor-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? "Đang lưu..." : "Lưu thay đổi bài viết"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
