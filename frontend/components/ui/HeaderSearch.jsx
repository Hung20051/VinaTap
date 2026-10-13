"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { getLang } from "@/lib/prefs";

// ─── COMPREHENSIVE SEARCH INDEX MATCHING SCREENSHOT ───
const SEARCH_POSTS = [
  {
    id: "eat-hanoi",
    title: "8 must-try foods in Hanoi",
    titleVi: "8 món ăn phải thử tại Hà Nội",
    date: "October 2, 2026",
    dateVi: "2 Tháng 10, 2026",
    img: "/guide/megamenu/eat-1-hanoi.jpg",
    link: "/province/ha-noi",
    keywords: "8 must try foods in hanoi culinary bun cha pho street food bun dau",
  },
  {
    id: "dest-dalat",
    title: "Dalat",
    titleVi: "Đà Lạt",
    date: "September 25, 2026",
    dateVi: "25 Tháng 9, 2026",
    img: "/guide/dalat/dalat-hero-hd.jpg",
    link: "/province/dalat",
    keywords: "dalat da lat lam dong destination travel guide cam nang du lich thanh pho ngan hoa city of thousands of flowers",
  },
  {
    id: "eat-dalat",
    title: "8 must-try foods in Dalat",
    titleVi: "8 món ăn phải thử tại Đà Lạt",
    date: "September 23, 2026",
    dateVi: "23 Tháng 9, 2026",
    img: "/guide/megamenu/dest-2-dalat.jpg",
    link: "/province/dalat",
    keywords: "8 must try foods in dalat da lat banh trang nuong lau ga la e",
  },
  {
    id: "dest-hoian",
    title: "Hoi An",
    titleVi: "Hội An",
    date: "September 22, 2026",
    dateVi: "22 Tháng 9, 2026",
    img: "/guide/hoian/hoian-hero-hd.jpg",
    link: "/province/hoi-an",
    keywords: "hoi an quang nam pho co hoi an ancient town destination cẩm nang du lịch world cultural heritage",
  },
  {
    id: "eat-hoian",
    title: "8 must-try foods in Hoi An",
    titleVi: "8 món ăn phải thử tại Hội An",
    date: "September 21, 2026",
    dateVi: "21 Tháng 9, 2026",
    img: "/guide/megamenu/dest-3-hoian.jpg",
    link: "/province/hoi-an",
    keywords: "8 must try foods in hoi an cao lau mi quang chicken rice",
  },
  {
    id: "dest-danang",
    title: "Da Nang",
    titleVi: "Đà Nẵng",
    date: "September 15, 2026",
    dateVi: "15 Tháng 9, 2026",
    img: "/guide/danang/danang-hero-hd.jpg",
    link: "/province/da-nang",
    keywords: "da nang danang da nang city destination travel guide cam nang du lich dragon bridge ba na hills son tra my khe",
  },
  {
    id: "eat-danang",
    title: "7 must-try foods in Da Nang",
    titleVi: "7 món ăn nhất định phải thử tại Đà Nẵng",
    date: "September 14, 2026",
    dateVi: "14 Tháng 9, 2026",
    img: "/guide/danang/danang-7-foods-hd.jpg",
    link: "/province/da-nang#danang-food",
    keywords: "7 must try foods in da nang danang mi quang banh xeo bun ca seafood",
  },
  {
    id: "attractions-hue",
    title: "Top 8 Must-Visit Attractions in Hue",
    titleVi: "Top 8 điểm đến phải ghé thăm tại Huế",
    date: "September 9, 2026",
    dateVi: "9 Tháng 9, 2026",
    img: "/guide/15-best-places/place-8-hue.jpg",
    link: "/province/thua-thien-hue",
    keywords: "top 8 must visit attractions in hue citadel thien mu tomb perfume river",
  },
  {
    id: "dest-hcmc",
    title: "Ho Chi Minh City",
    titleVi: "TP. Hồ Chí Minh",
    date: "October 12, 2026",
    dateVi: "12 Tháng 10, 2026",
    img: "/guide/hcmc/hcmc-hero-aerial-hd.jpg",
    link: "/province/ho-chi-minh",
    keywords: "ho chi minh city saigon sai gon destination cẩm nang du lịch tp hcm thanh pho ho chi minh",
  },
  {
    id: "eat-hcmc",
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
    date: "September 24, 2026",
    dateVi: "24 Tháng 9, 2026",
    img: "/guide/megamenu/eat-2-hcmc.jpg",
    link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
    keywords: "12 must try foods in ho chi minh city saigon com tam banh mi pho",
  },
  {
    id: "eat-vungtau",
    title: "7 must-try foods in Vung Tau",
    titleVi: "7 món ăn tuyệt vời tại Vũng Tàu",
    date: "September 30, 2026",
    dateVi: "30 Tháng 9, 2026",
    img: "/guide/megamenu/eat-4-vungtau.jpg",
    link: "/province/ba-ria-vung-tau",
    keywords: "7 must try foods in vung tau banh khot seafood beach",
  },
  {
    id: "ao-dai",
    title: "Ao Dai – Vietnamese Traditional Dress",
    titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
    date: "September 18, 2026",
    dateVi: "18 Tháng 9, 2026",
    img: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
    link: "/guide/ao-dai-vietnamese-traditional-dress",
    keywords: "ao dai vietnamese traditional dress national costume le mur raglan",
  },
  {
    id: "20-best-things",
    title: "20 Best Things to Do in Vietnam",
    titleVi: "20 trải nghiệm tuyệt vời nhất tại Việt Nam",
    date: "January 1, 2025",
    dateVi: "1 Tháng 1, 2025",
    img: "/guide/megamenu/todo-4-vietnam.jpg",
    link: "/guide/20-best-things-to-do-in-vietnam",
    keywords: "20 best things to do in vietnam travel guide explore activities",
  },
  {
    id: "15-best-places",
    title: "15 best places to visit in Vietnam in 2026",
    titleVi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
    date: "June 16, 2026",
    dateVi: "16 Tháng 6, 2026",
    img: "/guide/megamenu/inspired-1.jpg",
    link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
    keywords: "15 best places to visit in vietnam 2026 trending destinations",
  },
  {
    id: "plan-trip",
    title: "Plan Your Vietnam Trip with Just One Prompt",
    titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
    date: "April 1, 2026",
    dateVi: "1 Tháng 4, 2026",
    img: "/guide/megamenu/inspired-2.jpg",
    link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
    keywords: "plan your vietnam trip with just one prompt ai travel assistant",
  },
  {
    id: "complete-guide",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
    date: "January 9, 2026",
    dateVi: "9 Tháng 1, 2026",
    img: "/guide/megamenu/inspired-3.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
    keywords: "the complete guide to vietnam everything you need to know",
  },
  {
    id: "hcmc-10-things",
    title: "10 best things to do in Ho Chi Minh City",
    titleVi: "10 điều tuyệt nhất ở TP. Hồ Chí Minh",
    date: "May 5, 2025",
    dateVi: "5 Tháng 5, 2025",
    img: "/guide/megamenu/todo-2-hcmc.jpg",
    link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
    keywords: "10 best things to do in ho chi minh city saigon ben thanh",
  },
  {
    id: "hcmc-stay",
    title: "Where to Stay in Ho Chi Minh City",
    titleVi: "Khách sạn & Khu vực nên ở tại TP. Hồ Chí Minh",
    date: "October 12, 2026",
    dateVi: "12 Tháng 10, 2026",
    img: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
    link: "/guide/where-to-stay-in-ho-chi-minh-city",
    keywords: "where to stay in ho chi minh city hotel khach san quan 1 quan 3 hostel boutique accommodation tan son nhat airport luxury",
  },
  {
    id: "nhatrang-8-things",
    title: "8 best things to do in Nha Trang",
    titleVi: "8 hoạt động không thể bỏ qua tại Nha Trang",
    date: "March 1, 2025",
    dateVi: "1 Tháng 3, 2025",
    img: "/guide/megamenu/todo-3-nhatrang.jpg",
    link: "/province/khanh-hoa",
    keywords: "8 best things to do in nha trang islands beach vinpearl",
  },
  {
    id: "itinerary-3week",
    title: "3-week Vietnam Itinerary",
    titleVi: "Lịch trình 3 tuần xuyên Việt",
    date: "July 20, 2025",
    dateVi: "20 Tháng 7, 2025",
    img: "/guide/megamenu/todo-1-3week.jpg",
    link: "/guide/3-week-vietnam-itinerary",
    keywords: "3 week vietnam itinerary north south central route",
  },
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
    const onLang = (e) => setLang(e?.detail || getLang());
    window.addEventListener("vinatap:lang-updated", onLang);
    window.addEventListener("storage", onLang);
    return () => {
      window.removeEventListener("vinatap:lang-updated", onLang);
      window.removeEventListener("storage", onLang);
    };
  }, []);

  const isVi = lang === "vi";

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 60);
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

  // Smart multi-token scoring search
  const filteredResults = useMemo(() => {
    const raw = query.trim();
    if (!raw) {
      // Default initial posts (matching screenshot order)
      return SEARCH_POSTS.slice(0, 6);
    }

    const cleanQuery = removeVietnameseTones(raw);
    const tokens = cleanQuery.split(/\s+/).filter(Boolean);

    const scored = SEARCH_POSTS.map((item) => {
      const titleEn = removeVietnameseTones(item.title);
      const titleVi = removeVietnameseTones(item.titleVi);
      const kw = removeVietnameseTones(item.keywords || "");
      const fullText = `${titleEn} ${titleVi} ${kw}`;

      let score = 0;
      let matchedTokens = 0;

      // Exact phrase match bonus
      if (titleEn.includes(cleanQuery) || titleVi.includes(cleanQuery)) {
        score += 50;
      }
      if (titleEn.startsWith(cleanQuery)) {
        score += 30;
      }

      // Check each token
      tokens.forEach((token) => {
        if (titleEn.includes(token) || titleVi.includes(token)) {
          score += 15;
          matchedTokens++;
        } else if (kw.includes(token)) {
          score += 8;
          matchedTokens++;
        }
      });

      // Bonus if all tokens match
      if (matchedTokens === tokens.length) {
        score += 25;
      }

      return { item, score, matchedTokens };
    });

    return scored
      .filter((s) => s.score > 0 && s.matchedTokens > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.item);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      router.push(filteredResults[0].link);
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

      {/* Floating search dropdown (exact layout from screenshot) */}
      {isOpen && (
        <div className="vnn-search-dropdown">
          {/* Top search input line */}
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
                aria-label="Clear input"
              >
                <X size={15} />
              </button>
            )}
            <button type="submit" className="vnn-search-dropdown__submit">
              <span>{isVi ? "Tìm kiếm" : "Search"}</span>
              <span style={{ fontSize: "12px", marginLeft: "2px" }}>&gt;</span>
            </button>
          </form>

          {/* Posts container */}
          <div className="vnn-search-dropdown__body">
            <div className="vnn-search-dropdown__posts-label">
              {isVi ? "Bài viết" : "Posts"}
            </div>

            {filteredResults.length > 0 ? (
              <div className="vnn-search-dropdown__grid">
                {filteredResults.slice(0, 6).map((post) => (
                  <Link
                    key={post.id}
                    href={post.link}
                    className="vnn-search-post-card"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                  >
                    <img
                      src={post.img}
                      alt={post.title}
                      className="vnn-search-post-card__thumb"
                      loading="lazy"
                    />
                    <div className="vnn-search-post-card__info">
                      <h5 className="vnn-search-post-card__title">
                        {isVi ? post.titleVi : post.title}
                      </h5>
                      <p className="vnn-search-post-card__date">
                        {isVi ? post.dateVi : post.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="vnn-search-dropdown__empty">
                <p>
                  {isVi
                    ? `Không tìm thấy bài viết cho "${query}"`
                    : `No posts found for "${query}"`}
                </p>
              </div>
            )}
          </div>

          {/* Bottom View all results */}
          <div className="vnn-search-dropdown__footer">
            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="vnn-search-dropdown__view-all"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
            >
              {isVi ? "Xem tất cả kết quả" : "View all results"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
