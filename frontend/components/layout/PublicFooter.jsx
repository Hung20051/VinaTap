"use client";

import Link from "next/link";
import { Facebook } from "lucide-react";
import Logo from "./Logo";

export default function PublicFooter({ lang = "vi" }) {
  const isVi = lang === "vi";

  return (
    <footer className="vnn-clean-footer" style={{ marginTop: "60px" }}>
      <div className="vnn-clean-footer__container">
        <div className="vnn-clean-footer__logo-wrap">
          <Link href="/" className="vnn-clean-footer__brand-link">
            <Logo size={32} showText={false} noLink href={null} as="span" />
            <span>VinaTap</span>
          </Link>
        </div>

        {/* Social Icons — Mạng xã hội chỉ hiển thị duy nhất Facebook */}
        <div className="vnn-clean-footer__socials">
          <a
            href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="vnn-clean-footer__social-link"
            title="Facebook VinaTap"
          >
            <Facebook size={18} />
          </a>
        </div>

        {/* 4 Navigation Columns */}
        <div className="vnn-clean-footer__grid">
          <div className="vnn-clean-footer__col">
            <div className="vnn-clean-footer__col-title">
              {isVi ? "Điểm đến hàng đầu" : "Top Destinations"}
            </div>
            <div className="vnn-clean-footer__col-links">
              <Link href="/province/ho-chi-minh" className="vnn-clean-footer__link">
                {isVi ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
              </Link>
              <Link href="/province/ha-noi" className="vnn-clean-footer__link">
                {isVi ? "Hà Nội" : "Hanoi"}
              </Link>
              <Link href="/province/da-nang" className="vnn-clean-footer__link">
                {isVi ? "Đà Nẵng" : "Da Nang"}
              </Link>
              <Link href="/province/hoi-an" className="vnn-clean-footer__link">
                {isVi ? "Hội An" : "Hoi An"}
              </Link>
            </div>
          </div>

          <div className="vnn-clean-footer__col">
            <div className="vnn-clean-footer__col-title">
              {isVi ? "Cẩm nang du lịch" : "Travel Guide"}
            </div>
            <div className="vnn-clean-footer__col-links">
              <Link href="/guide/15-best-places-to-visit-in-vietnam-in-2026" className="vnn-clean-footer__link">
                {isVi ? "15 Điểm đến đẹp nhất 2026" : "15 Best Places to Visit 2026"}
              </Link>
              <Link href="/guide/20-best-things-to-do-in-vietnam" className="vnn-clean-footer__link">
                {isVi ? "20 Trải nghiệm tuyệt nhất" : "20 Best Things to Do"}
              </Link>
              <Link href="/guide/3-week-vietnam-itinerary" className="vnn-clean-footer__link">
                {isVi ? "Lịch trình 3 tuần xuyên Việt" : "3-Week Vietnam Itinerary"}
              </Link>
              <Link href="/guide/the-complete-guide-to-vietnam" className="vnn-clean-footer__link">
                {isVi ? "Cẩm nang toàn diện Việt Nam" : "Complete Guide to Vietnam"}
              </Link>
            </div>
          </div>

          <div className="vnn-clean-footer__col">
            <div className="vnn-clean-footer__col-title">
              {isVi ? "Tài nguyên hữu ích" : "Helpful Resources"}
            </div>
            <div className="vnn-clean-footer__col-links">
              <Link href="/guide/hanoi-tourist-map" className="vnn-clean-footer__link">
                {isVi ? "Bản đồ du lịch Hà Nội" : "Hanoi Tourist Map"}
              </Link>
              <Link href="/guide/where-to-stay-in-ho-chi-minh-city" className="vnn-clean-footer__link">
                {isVi ? "Khách sạn & Nơi lưu trú" : "Where to Stay"}
              </Link>
              <Link href="/guide/pho-the-complete-guide" className="vnn-clean-footer__link">
                {isVi ? "Văn hóa ẩm thực Phở" : "Pho: Culinary Heritage"}
              </Link>
              <Link href="/guide/ao-dai-vietnamese-traditional-dress" className="vnn-clean-footer__link">
                {isVi ? "Áo Dài truyền thống" : "Traditional Ao Dai"}
              </Link>
            </div>
          </div>

          <div className="vnn-clean-footer__col">
            <div className="vnn-clean-footer__col-title">
              {isVi ? "Về chúng tôi" : "About Us"}
            </div>
            <div className="vnn-clean-footer__col-links">
              <Link href="/#about" className="vnn-clean-footer__link">
                {isVi ? "Về chúng tôi" : "About us"}
              </Link>
              <Link href="/policy" className="vnn-clean-footer__link">
                {isVi ? "Chính sách bảo mật" : "Privacy policy"}
              </Link>
              <Link href="/terms" className="vnn-clean-footer__link">
                {isVi ? "Điều khoản dịch vụ" : "Terms of service"}
              </Link>
              <Link href="/policy#support" className="vnn-clean-footer__link">
                {isVi ? "Hợp tác đồng hành" : "Partner with us"}
              </Link>
            </div>
          </div>
        </div>

        <div className="vnn-clean-footer__bottom">
          {isVi
            ? "© 2026 VinaTap. Đã đăng ký bản quyền. Cẩm nang du lịch 34 tỉnh thành Việt Nam."
            : "© 2026 VinaTap. All rights reserved. Vietnam Travel Guide."}
        </div>
      </div>
    </footer>
  );
}
