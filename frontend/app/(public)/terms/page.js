"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { getLang } from "@/lib/prefs";
import {
  ArrowLeft,
  FileText,
  UserCheck,
  CreditCard,
  Camera,
  ShieldAlert,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import "@/styles/legal.css";

export default function TermsPage() {
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    setLang(getLang());
    const handleLang = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLang);
    return () => window.removeEventListener("vinatap:lang-updated", handleLang);
  }, []);

  const isVi = lang === "vi";

  return (
    <div className="legal-page-shell">
      {/* ─── NAVBAR ────────────────────────────────────────── */}
      <header className="legal-navbar">
        <div className="legal-navbar-container">
          <div className="legal-navbar-left">
            <Logo />
            <Link href="/" className="legal-nav-back-link">
              <ArrowLeft size={16} />
              <span>{isVi ? "Trang chủ" : "Home"}</span>
            </Link>
          </div>
          <div className="legal-navbar-actions">
            <LanguageSwitch />
          </div>
        </div>
      </header>

      {/* ─── HERO HEADER ───────────────────────────────────── */}
      <section className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-badge">
            <Sparkles size={14} />
            <span>{isVi ? "VinaTap Legal Center" : "VinaTap Legal Center"}</span>
          </div>
          <h1 className="legal-hero-title">
            {isVi ? "Điều Khoản Sử Dụng" : "Terms of Service"}
          </h1>
          <p className="legal-hero-desc">
            {isVi
              ? "Quy định quyền, trách nhiệm và nghĩa vụ pháp lý giữa người dùng và nền tảng bản đồ du lịch di sản VinaTap."
              : "Defines rights, responsibilities, and legal obligations between users and the VinaTap heritage travel platform."}
          </p>
          <div className="legal-hero-meta">
            <Clock size={14} />
            <span>{isVi ? "Cập nhật lần cuối: Tháng 03/2026" : "Last updated: March 2026"}</span>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ──────────────────────────────────── */}
      <main className="legal-content-wrap">
        <div className="legal-card">
          {/* Mục 1 */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <FileText size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "1. Chấp thuận và Phạm vi áp dụng" : "1. Acceptance & Scope of Terms"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Chào mừng bạn đến với VinaTap. Khi truy cập website vinatap.vn, kích hoạt thẻ vật lý NFC, tạo album ảnh hoặc thực hiện bất kỳ giao dịch mua sắm nào, bạn đồng ý tuân thủ toàn bộ các điều khoản được quy định dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ của chúng tôi."
                : "Welcome to VinaTap. By accessing vinatap.vn, activating physical NFC cards, creating photo albums, or making any purchases, you agree to comply with all terms stated herein. If you do not agree with any part, please cease using our services."}
            </p>
            <div className="legal-callout">
              <p>
                <strong>{isVi ? "Lưu ý quan trọng:" : "Important note:"}</strong>{" "}
                {isVi
                  ? "VinaTap có quyền sửa đổi, bổ sung điều khoản này bất kỳ lúc nào để phù hợp với quy định pháp luật và hoạt động dịch vụ. Phiên bản cập nhật sẽ có hiệu lực ngay khi được công bố."
                  : "VinaTap reserves the right to amend these terms at any time in compliance with applicable law and platform operations. Updated versions take effect upon publication."}
              </p>
            </div>
          </div>

          {/* Mục 2 */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <UserCheck size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "2. Tài khoản và Bảo mật người dùng" : "2. User Accounts & Security"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Để quản lý thẻ NFC và tạo album kỷ niệm cá nhân, bạn cần tạo tài khoản VinaTap thông qua email hoặc đăng nhập Google OAuth:"
                : "To manage NFC cards and create personalized travel albums, you must create a VinaTap account via email or Google OAuth:"}
            </p>
            <ul className="legal-list">
              <li>
                <strong>{isVi ? "Thông tin chính xác:" : "Accurate Information:"}</strong>{" "}
                {isVi
                  ? "Người dùng cam kết cung cấp thông tin liên hệ chính xác để phục vụ nhận thẻ vật lý và hỗ trợ tài khoản."
                  : "Users commit to providing accurate contact information for physical delivery and account support."}
              </li>
              <li>
                <strong>{isVi ? "Bảo mật thông tin đăng nhập:" : "Account Security:"}</strong>{" "}
                {isVi
                  ? "Bạn chịu hoàn toàn trách nhiệm bảo mật mật khẩu và các hoạt động phát sinh dưới tài khoản của mình."
                  : "You are solely responsible for maintaining password security and all activities occurring under your account."}
              </li>
              <li>
                <strong>{isVi ? "Thông báo kịp thời:" : "Prompt Notification:"}</strong>{" "}
                {isVi
                  ? "Nếu phát hiện truy cập trái phép, vui lòng liên hệ ngay với ban quản trị VinaTap để được hỗ trợ khóa và bảo vệ dữ liệu."
                  : "If unauthorized access is detected, please notify VinaTap immediately for account protection."}
              </li>
            </ul>
          </div>

          {/* Mục 3 */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <Camera size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "3. Quyền sở hữu thẻ NFC và Album kỷ niệm" : "3. Card Ownership & Memory Albums"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Mỗi thẻ NFC vật lý VinaTap đại diện cho một dấu ấn hành trình di sản Việt Nam với các quyền lợi đi kèm:"
                : "Each physical VinaTap NFC card represents a Vietnamese heritage travel destination with associated benefits:"}
            </p>
            <ul className="legal-list">
              <li>
                <strong>{isVi ? "Kích hoạt vĩnh viễn:" : "Lifetime Activation:"}</strong>{" "}
                {isVi
                  ? "Người đầu tiên kích hoạt thẻ sẽ trở thành chủ sở hữu hợp pháp của album tương ứng. Quyền lưu trữ kỷ niệm được duy trì trọn đời."
                  : "The first person to activate a tile becomes the legitimate owner of the album. Memory storage privileges are lifetime."}
              </li>
              <li>
                <strong>{isVi ? "Quyền riêng tư:" : "Privacy Control:"}</strong>{" "}
                {isVi
                  ? "Người dùng có thể chuyển đổi giữa chế độ Riêng tư (chỉ chủ sở hữu xem) hoặc Công khai (cho phép người khác chạm thẻ để chiêm ngưỡng album)."
                  : "Users can switch between Private mode (owner only) or Public mode (allows visitors tapping the card to view media)."}
              </li>
              <li>
                <strong>{isVi ? "Chuyển nhượng thẻ:" : "Card Transfer:"}</strong>{" "}
                {isVi
                  ? "Bạn có toàn quyền chuyển nhượng thẻ và toàn bộ album cho người khác thông qua tính năng Chuyển nhượng xác nhận qua email trong Dashboard."
                  : "You maintain full authority to transfer card and album ownership via secure email verification in the Dashboard."}
              </li>
            </ul>
          </div>

          {/* Mục 4 */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <CreditCard size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "4. Bảng giá, Giao dịch và Thanh toán" : "4. Pricing, Orders & Payment"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Bảng giá niêm yết chính thức áp dụng trên toàn hệ thống VinaTap từ năm 2026:"
                : "Official published prices applicable across VinaTap platform from 2026:"}
            </p>
            <ul className="legal-list">
              <li>
                <strong>{isVi ? "1 thẻ lẻ tỉnh thành:" : "Single province tile:"}</strong> 49.000đ / {isVi ? "thẻ" : "card"}.
              </li>
              <li>
                <strong>{isVi ? "Combo 3 thẻ tự chọn:" : "Combo 3 custom tiles:"}</strong> 139.000đ / {isVi ? "combo" : "pack"}.
              </li>
              <li>
                <strong>{isVi ? "Combo 5 thẻ (bộ 5 tỉnh):" : "Combo 5 tiles (regional set):"}</strong> 239.000đ / {isVi ? "combo" : "pack"}.
              </li>
              <li>
                <strong>{isVi ? "Trọn bộ 34 thẻ toàn quốc:" : "Complete 34-province set:"}</strong> 1.400.000đ / {isVi ? "bộ kèm hộp quà" : "set with gift box"}.
              </li>
              <li>
                <strong>{isVi ? "Phí vận chuyển:" : "Shipping Fee:"}</strong>{" "}
                {isVi
                  ? "30.000đ toàn quốc. Miễn phí vận chuyển cho đơn hàng từ 500.000đ."
                  : "30,000 VND nationwide. Free shipping applied automatically for orders from 500,000 VND."}
              </li>
              <li>
                <strong>{isVi ? "Phương thức thanh toán:" : "Payment Methods:"}</strong>{" "}
                {isVi
                  ? "Chuyển khoản trực tuyến quét mã VietQR tự động qua PayOS hoặc Thanh toán tiền mặt khi nhận hàng (COD)."
                  : "Instant VietQR transfer via PayOS gateway or Cash on Delivery (COD)."}
              </li>
            </ul>
          </div>

          {/* Mục 5 */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <ShieldAlert size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "5. Quy định nội dung và Hành vi nghiêm cấm" : "5. Content Standards & Prohibited Conduct"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Để giữ gìn môi trường văn hóa du lịch văn minh, người dùng cam kết tuân thủ các quy tắc sau khi tải ảnh/video lên album:"
                : "To maintain a civilized travel culture platform, users agree not to upload any media containing:"}
            </p>
            <ul className="legal-list">
              <li>
                {isVi
                  ? "Không đăng tải nội dung đồi trụy, khiêu dâm, bạo lực hoặc vi phạm thuần phong mỹ tục Việt Nam."
                  : "No sexually explicit, pornographic, violent, or culturally offensive materials."}
              </li>
              <li>
                {isVi
                  ? "Không đăng tải thông tin xuyên tạc lịch sử, chủ quyền lãnh thổ, chính trị hoặc kích động thù địch."
                  : "No distortions of national history, territorial integrity, sovereignty, or hate speech."}
              </li>
              <li>
                {isVi
                  ? "Không xâm phạm quyền sở hữu trí tuệ, bản quyền hoặc hình ảnh cá nhân của người khác khi chưa được phép."
                  : "No infringement on copyrights, trademarks, or personal privacy of others without consent."}
              </li>
              <li>
                {isVi
                  ? "VinaTap có quyền xóa bỏ nội dung vi phạm hoặc khóa quyền truy cập thẻ nếu phát hiện hành vi cố tình vi phạm."
                  : "VinaTap reserves the authority to take down offending content or suspend accounts upon deliberate violations."}
              </li>
            </ul>
          </div>

          {/* Mục 6 */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <HelpCircle size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "6. Thông tin liên hệ hỗ trợ pháp lý" : "6. Legal & Support Inquiries"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Mọi thắc mắc, phản ánh vi phạm hoặc yêu cầu hỗ trợ liên quan đến điều khoản dịch vụ, xin vui lòng liên hệ:"
                : "For questions, dispute resolution, or legal feedback regarding these terms, please contact us:"}
            </p>
            <div className="legal-contact-box">
              <div className="legal-contact-item">
                <Send size={18} />
                <div>
                  <div className="legal-contact-label">{isVi ? "Email hỗ trợ" : "Support Email"}</div>
                  <div className="legal-contact-val">contact@vinatap.vn</div>
                </div>
              </div>
              <div className="legal-contact-item">
                <CheckCircle size={18} />
                <div>
                  <div className="legal-contact-label">{isVi ? "Dự án" : "Project"}</div>
                  <div className="legal-contact-val">VinaTap — Thẻ Du Lịch Di Sản NFC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <footer className="legal-footer">
        <p>© 2026 VinaTap. {isVi ? "Tất cả quyền được bảo lưu." : "All rights reserved."}</p>
        <p style={{ marginTop: "0.4rem" }}>
          <Link href="/terms">{isVi ? "Điều khoản dịch vụ" : "Terms of Service"}</Link>
          {" • "}
          <Link href="/policy">{isVi ? "Chính sách bảo mật" : "Privacy Policy"}</Link>
        </p>
      </footer>
    </div>
  );
}
