"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Filter, ChevronDown, Search, Check } from "lucide-react";

export default function CategorySelect({
  categories = [],
  selectedCategory,
  onSelectCategory,
  totalStickersCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchCat, setSearchCat] = useState("");
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchCat.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, searchCat]);

  const selectedLabel =
    selectedCategory === "all"
      ? `Tất cả danh mục (${categories.length})`
      : selectedCategory;

  return (
    <div className="admin-stickers-cat-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="admin-stickers-cat-dropdown__btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Filter size={16} className="admin-stickers-cat-dropdown__icon" />
        <span className="admin-stickers-cat-dropdown__label">
          {selectedLabel}
        </span>
        <ChevronDown
          size={16}
          className={`admin-stickers-cat-dropdown__chevron ${
            isOpen ? "is-open" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="admin-stickers-cat-dropdown__menu">
          <div className="admin-stickers-cat-dropdown__search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Tìm danh mục..."
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              autoFocus
            />
          </div>

          <div className="admin-stickers-cat-dropdown__list">
            <button
              type="button"
              className={`admin-stickers-cat-dropdown__item ${
                selectedCategory === "all" ? "is-selected" : ""
              }`}
              onClick={() => {
                onSelectCategory("all");
                setIsOpen(false);
              }}
            >
              <span>Tất cả danh mục ({categories.length})</span>
              {selectedCategory === "all" && <Check size={14} />}
            </button>

            {filteredCategories.map((c) => {
              const isSel = selectedCategory === c;
              return (
                <button
                  type="button"
                  key={c}
                  className={`admin-stickers-cat-dropdown__item ${
                    isSel ? "is-selected" : ""
                  }`}
                  onClick={() => {
                    onSelectCategory(c);
                    setIsOpen(false);
                  }}
                >
                  <span>{c}</span>
                  {isSel && <Check size={14} />}
                </button>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="admin-stickers-cat-dropdown__empty">
                Không tìm thấy danh mục
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
