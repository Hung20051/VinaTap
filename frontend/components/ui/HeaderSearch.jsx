"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, Sparkles } from "lucide-react";
import { getLang } from "@/lib/prefs";

// ─── SEARCH INDEX (ARTICLES + DESTINATIONS) ───
const SEARCH_INDEX = [
  {
    id: "ao-dai",
    title: "Ao Dai – Vietnamese Traditional Dress",
    titleVi: "Áo Dài – Quốc phục & Nét đẹp duyên dáng Việt Nam",
    type: "Featured Article",
    typeVi: "Bài viết nổi bật",
    img: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
    link: "/guide/ao-dai-vietnamese-traditional-dress",
    keywords: "ao dai national costume dress fashion culture le mur raglan hue hoi an",
  },
  {
    id: "20-best-things",
    title: "20 Best Things to Do in Vietnam",
    titleVi: "20 trải nghiệm tuyệt vời nhất tại Việt Nam",
    type: "Guide",
    typeVi: "Cẩm nang",
    img: "/guide/megamenu/inspired-4.jpg",
    link: "/guide/20-best-things-to-do-in-vietnam",
    keywords: "20 best things to do activities explore highlights halong sapa hoi an",
  },
  {
    id: "complete-guide",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
    type: "Comprehensive Guide",
    typeVi: "Cẩm nang toàn diện",
    img: "/guide/megamenu/inspired-3.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
    keywords: "complete guide overview travel visa weather transport foods",
  },
  {
    id: "15-best-places",
    title: "15 best places to visit in Vietnam in 2026",
    titleVi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
    type: "Trending",
    typeVi: "Thịnh hành",
    img: "/guide/megamenu/inspired-1.jpg",
    link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
    keywords: "15 best places visit destinations travel 2026 north south central",
  },
  {
    id: "plan-trip",
    title: "Plan Your Vietnam Trip with Just One Prompt",
    titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
    type: "AI Planner",
    typeVi: "Trợ lý AI",
    img: "/guide/megamenu/inspired-2.jpg",
    link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
    keywords: "plan itinerary ai prompt travel schedule budget route",
  },
  {
    id: "hcmc-10-things",
    title: "10 best things to do in Ho Chi Minh City",
    titleVi: "10 điều tuyệt nhất ở TP. Hồ Chí Minh",
    type: "City Guide",
    typeVi: "Cẩm nang thành phố",
    img: "/guide/megamenu/dest-1.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
    keywords: "ho chi minh saigon district 1 ben thanh war remnants bui vien",
  },
  {
    id: "hcmc-food",
    title: "12 Must Try Foods in Ho Chi Minh City",
    titleVi: "12 món ngon nhất định phải thử tại TP. Hồ Chí Minh",
    type: "Food & Drink",
    typeVi: "Ẩm thực",
    img: "/guide/megamenu/eat-4.jpg",
    link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
    keywords: "food cuisine saigon com tam banh mi pho hcmc street food",
  },
  // Key destinations
  {
    id: "dest-hoian",
    title: "Hoi An Ancient Town",
    titleVi: "Phố cổ Hội An",
    type: "Destination",
    typeVi: "Điểm đến",
    img: "/guide/megamenu/dest-3.jpg",
    link: "/province/quang-nam",
    keywords: "hoi an quang nam lanterns tailor river boats heritage",
  },
  {
    id: "dest-halong",
    title: "Ha Long Bay",
    titleVi: "Vịnh Hạ Long",
    type: "Destination",
    typeVi: "Điểm đến",
    img: "/guide/megamenu/dest-2.jpg",
    link: "/province/quang-ninh",
    keywords: "ha long bay quang ninh karst unesco cruise islands",
  },
  {
    id: "dest-danang",
    title: "Da Nang",
    titleVi: "Đà Nẵng",
    type: "Destination",
    typeVi: "Điểm đến",
    img: "/guide/megamenu/dest-4.jpg",
    link: "/province/da-nang",
    keywords: "da nang golden bridge ba na hills my khe beach dragon bridge",
  },
  {
    id: "dest-hanoi",
    title: "Hanoi Capital",
    titleVi: "Thủ đô Hà Nội",
    type: "Destination",
    typeVi: "Điểm đến",
    img: "/guide/megamenu/dest-5.jpg",
    link: "/province/ha-noi",
    keywords: "hanoi old quarter hoan kiem french quarter egg coffee",
  },
  {
    id: "dest-hue",
    title: "Hue Imperial City",
    titleVi: "Cố đô Huế",
    type: "Destination",
    typeVi: "Điểm đến",
    img: "/guide/megamenu/eat-5.jpg",
    link: "/province/thua-thien-hue",
    keywords: "hue citadel imperial tomb perfume river ao dai royal",
  },
  {
    id: "dest-ninhbinh",
    title: "Ninh Binh & Trang An",
    titleVi: "Ninh Bình & Tràng An",
    type: "Destination",
    typeVi: "Điểm đến",
    img: "/guide/megamenu/inspired-2.jpg",
    link: "/province/ninh-binh",
    keywords: "ninh binh trang an tam coc hang mua boats rice fields",
  },
];

const POPULAR_TAGS = [
  { label: "Ao Dai", labelVi: "Áo Dài", link: "/guide/ao-dai-vietnamese-traditional-dress" },
  { label: "20 Best Things", labelVi: "20 trải nghiệm", link: "/guide/20-best-things-to-do-in-vietnam" },
  { label: "15 Best Places", labelVi: "15 điểm đến", link: "/guide/15-best-places-to-visit-in-vietnam-in-2026" },
  { label: "Hoi An", labelVi: "Hội An", link: "/province/quang-nam" },
  { label: "Ha Long Bay", labelVi: "Hạ Long", link: "/province/quang-ninh" },
  { label: "Da Nang", labelVi: "Đà Nẵng", link: "/province/da-nang" },
  { label: "Hanoi", labelVi: "Hà Nội", link: "/province/ha-noi" },
  { label: "Ho Chi Minh City", labelVi: "TP. Hồ Chí Minh", link: "/province/ho-chi-minh" },
];

function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setLang(getLang());
    const onStorage = () => setLang(getLang());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isVi = lang === "vi";

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter items
  const cleanQ = removeVietnameseTones(query.trim());
  const results = cleanQ
    ? SEARCH_INDEX.filter((item) => {
        const titleEn = removeVietnameseTones(item.title);
        const titleVi = removeVietnameseTones(item.titleVi);
        const kw = removeVietnameseTones(item.keywords || "");
        return (
          titleEn.includes(cleanQ) ||
          titleVi.includes(cleanQ) ||
          kw.includes(cleanQ)
        );
      })
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(results[0].link);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="vnn-header-search-wrap" ref={containerRef}>
      {/* Search trigger button on navbar */}
      <button
        type="button"
        className="vnn-search-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isVi ? "Tìm kiếm" : "Search"}
        title={isVi ? "Tìm kiếm" : "Search"}
      >
        <Search size={18} />
      </button>

      {/* Floating search dropdown (matches Image 5) */}
      {isOpen && (
        <div className="vnn-search-dropdown">
          <form onSubmit={handleSearchSubmit} className="vnn-search-dropdown__bar">
            <input
              ref={inputRef}
              type="text"
              className="vnn-search-dropdown__input"
              placeholder={isVi ? "Tìm kiếm..." : "Search..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="vnn-search-dropdown__clear"
                onClick={() => setQuery("")}
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="vnn-search-dropdown__submit">
              <span>{isVi ? "Tìm kiếm" : "Search"}</span>
              <span className="vnn-search-dropdown__arrow">&gt;</span>
            </button>
          </form>

          <div className="vnn-search-dropdown__body">
            {query.trim() ? (
              results.length > 0 ? (
                results.slice(0, 6).map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="vnn-search-dropdown__item"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="vnn-search-dropdown__item-thumb"
                    />
                    <div className="vnn-search-dropdown__item-info">
                      <h5 className="vnn-search-dropdown__item-title">
                        {isVi ? item.titleVi : item.title}
                      </h5>
                      <span className="vnn-search-dropdown__item-meta">
                        {isVi ? item.typeVi : item.type}
                      </span>
                    </div>
                    <ChevronRight size={14} style={{ color: "#9ca3af" }} />
                  </Link>
                ))
              ) : (
                <div className="vnn-search-dropdown__empty">
                  <p>
                    {isVi
                      ? `Không tìm thấy kết quả cho "${query}"`
                      : `No results found for "${query}"`}
                  </p>
                </div>
              )
            ) : (
              <div className="vnn-search-dropdown__quick">
                <span className="vnn-search-dropdown__quick-label">
                  {isVi ? "Tìm kiếm phổ biến:" : "Popular searches:"}
                </span>
                <div className="vnn-search-dropdown__tags">
                  {POPULAR_TAGS.map((tag) => (
                    <Link
                      key={tag.link}
                      href={tag.link}
                      className="vnn-search-dropdown__tag"
                      onClick={() => setIsOpen(false)}
                    >
                      {isVi ? tag.labelVi : tag.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
