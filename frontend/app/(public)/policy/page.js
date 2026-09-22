"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { getLang } from "@/lib/prefs";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Truck,
  RotateCcw,
  CreditCard,
  Sparkles,
  Send,
  HelpCircle,
  Clock,
  CheckCircle,
  FileCheck,
} from "lucide-react";
import "@/styles/legal.css";

export default function PolicyPage() {
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
            <span>{isVi ? "VinaTap Policy Center" : "VinaTap Policy Center"}</span>
          </div>
          <h1 className="legal-hero-title">
            {isVi ? "Chính Sách & Cam Kết Dịch Vụ" : "Policies & Privacy Commitments"}
          </h1>
          <p className="legal-hero-desc">
            {isVi
              ? "Cam kết bảo vệ quyền lợi, bảo mật thông tin và chính sách bảo hành chính hãng dành cho khách hàng VinaTap."
              : "Commitments to customer rights, data protection, shipping, and official hardware warranty."}
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
          {/* Mục 1: Bảo hành */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <RotateCcw size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "1. Chính sách Bảo hành 1-1 trong 30 ngày" : "1. 30-Day 1-to-1 Replacement Warranty"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "VinaTap cam kết chất lượng chuẩn quốc tế cho từng thẻ vật lý trao đến tay bạn:"
                : "VinaTap commits to rigorous quality standards for every physical card delivered:"}
            </p>
            <ul className="legal-list">
              <li>
                <strong>{isVi ? "Đổi mới miễn phí trong 30 ngày:" : "30-Day Free Replacement:"}</strong>{" "}
                {isVi
                  ? "Nếu thẻ NFC gặp lỗi kỹ thuật từ nhà sản xuất (không nhận sóng, lỗi chip khi chạm điện thoại), VinaTap hỗ trợ đổi mới 1-1 hoàn toàn miễn phí."
                  : "If an NFC tile exhibits any manufacturing defect (chip unresponsive on compatible devices), VinaTap replaces it free of charge."}
              </li>
              <li>
                <strong>{isVi ? "Độ bền chống nước & chống xước:" : "Waterproof & Scratch-Resistant:"}</strong>{" "}
                {isVi
                  ? "Thẻ được sản xuất bằng vật liệu cao cấp, kháng nước chuẩn du lịch và hạn chế tối đa trầy xước trong suốt các hành trình dài ngày."
                  : "Constructed with premium durable composite, water-resistant and scratch-resistant for rugged outdoor travel."}
              </li>
              <li>
                <strong>{isVi ? "Mã Serial dự phòng an toàn:" : "Backup Serial Number Guarantee:"}</strong>{" "}
                {isVi
                  ? "Mỗi thẻ đều được in kèm mã Serial riêng biệt. Dù chip có bị hư hại vật lý nặng sau nhiều năm, bạn vẫn có thể nhập mã trên web để truy cập toàn bộ album ảnh kỷ niệm trọn đời."
                  : "Each card bears a unique printed backup serial. Even if the chip is physically damaged, entering the serial on web guarantees lifetime album access."}
              </li>
            </ul>
          </div>

          {/* Mục 2: Bảo mật & Riêng tư */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <Lock size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "2. Chính sách Bảo mật & Quyền riêng tư" : "2. Privacy & Data Protection Policy"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Chúng tôi tôn trọng và bảo vệ tuyệt đối sự riêng tư trong từng khoảnh khắc du lịch của bạn:"
                : "We respect and rigorously protect the privacy of your personal travel memories:"}
            </p>
            <ul className="legal-list">
              <li>
                <strong>{isVi ? "Chủ động kiểm soát quyền xem:" : "Granular Privacy Control:"}</strong>{" "}
                {isVi
                  ? "Mặc định bạn có quyền chọn chế độ 'Riêng tư' (chỉ tài khoản của bạn xem) hoặc 'Công khai' (cho phép bạn bè chạm thẻ cùng chiêm ngưỡng)."
                  : "You can toggle between 'Private' (only you can view) or 'Public' (anyone tapping the card can see your travel stories)."}
              </li>
              <li>
                <strong>{isVi ? "Mã hóa và Lưu trữ an toàn:" : "Encrypted Cloud Storage:"}</strong>{" "}
                {isVi
                  ? "Hình ảnh và video kỷ niệm được lưu trữ trên hạ tầng điện toán đám mây bảo mật chuẩn ngành (Cloudinary/AWS), ngăn chặn rò rỉ dữ liệu."
                  : "Photos and videos are hosted on enterprise cloud infrastructure with SSL encryption, preventing unauthorized access."}
              </li>
              <li>
                <strong>{isVi ? "Không bán dữ liệu người dùng:" : "Zero Data Selling Policy:"}</strong>{" "}
                {isVi
                  ? "VinaTap cam kết không chia sẻ, trao đổi hay bán dữ liệu cá nhân hoặc hình ảnh của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo."
                  : "VinaTap never shares, exchanges, or sells your personal data or photos to third parties for advertising."}
              </li>
            </ul>
          </div>

          {/* Mục 3: Vận chuyển & Giao hàng */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <Truck size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "3. Chính sách Vận chuyển & Giao hàng" : "3. Shipping & Delivery Policy"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Dịch vụ giao hàng tận nơi trên toàn bộ 63 tỉnh thành Việt Nam:"
                : "Nationwide express delivery service across all provinces of Vietnam:"}
            </p>
            <ul className="legal-list">
              <li>
                <strong>{isVi ? "Cước phí tiêu chuẩn:" : "Standard Shipping Fee:"}</strong>{" "}
                {isVi
                  ? "30.000đ / đơn hàng áp dụng đồng giá toàn quốc."
                  : "Flat rate of 30,000 VND nationwide."}
              </li>
              <li>
                <strong>{isVi ? "Miễn phí vận chuyển (Freeship):" : "Free Shipping (Freeship):"}</strong>{" "}
                {isVi
                  ? "Áp dụng tự động cho mọi đơn hàng có giá trị từ 500.000đ trở lên (hoặc khi áp dụng mã voucher freeship)."
                  : "Automatically applied for all orders with a value from 500,000 VND (or via freeship vouchers)."}
              </li>
              <li>
                <strong>{isVi ? "Thời gian giao nhận:" : "Delivery Times:"}</strong>{" "}
                {isVi
                  ? "Từ 1 - 2 ngày tại khu vực nội thành Hà Nội & TP.HCM; từ 2 - 4 ngày làm việc đối với các tỉnh thành khác."
                  : "1-2 days for Hanoi & Ho Chi Minh City metro; 2-4 business days for other regional provinces."}
              </li>
            </ul>
          </div>

          {/* Mục 4: Thanh toán */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <CreditCard size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "4. Chính sách Thanh toán An toàn" : "4. Secure Payment Policy"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Hỗ trợ các phương thức giao dịch minh bạch, thuận tiện:"
                : "Supporting transparent and convenient transaction methods:"}
            </p>
            <ul className="legal-list">
              <li>
                <strong>{isVi ? "Chuyển khoản VietQR qua PayOS:" : "VietQR via PayOS:"}</strong>{" "}
                {isVi
                  ? "Thanh toán quét mã QR tự động xác nhận sau 3 giây, tương thích với hơn 40 ngân hàng Việt Nam và ví điện tử."
                  : "Automated instant QR payment confirmed within 3 seconds, compatible with all Vietnamese banks and e-wallets."}
              </li>
              <li>
                <strong>{isVi ? "Thanh toán khi nhận hàng (COD):" : "Cash on Delivery (COD):"}</strong>{" "}
                {isVi
                  ? "Quý khách được quyền đồng kiểm tra gói hàng bên ngoài trước khi thanh toán tiền mặt cho nhân viên giao vận."
                  : "Customers have the right to inspect external packaging before paying cash to the courier."}
              </li>
            </ul>
          </div>

          {/* Mục 5: Chuyển nhượng */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <FileCheck size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "5. Chính sách Chuyển nhượng & Tặng thẻ" : "5. Card Transfer & Ownership Policy"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Thẻ VinaTap là tài sản vật lý kết hợp kỹ thuật số có thể sang tên chính chủ:"
                : "VinaTap cards are physical-digital hybrid assets with full transferability:"}
            </p>
            <ul className="legal-list">
              <li>
                {isVi
                  ? "Chủ sở hữu có thể chuyển quyền quản lý album và thẻ cho người khác thông qua email tại Dashboard."
                  : "Owners can transfer card management and album rights to any recipient via email in the Dashboard."}
              </li>
              <li>
                {isVi
                  ? "Quá trình chuyển nhượng chỉ hoàn tất khi người nhận xác nhận qua đường dẫn email bảo mật."
                  : "Transfer completes only after the recipient confirms via their secure email verification link."}
              </li>
              <li>
                {isVi
                  ? "Sau khi chuyển nhượng, toàn bộ dữ liệu kỷ niệm thuộc quyền quản lý của chủ sở hữu mới."
                  : "Upon transfer completion, all memory privileges transition safely to the new verified owner."}
              </li>
            </ul>
          </div>

          {/* Mục 6: Liên hệ */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-icon">
                <HelpCircle size={18} />
              </div>
              <h2 className="legal-section-title">
                {isVi ? "6. Hỗ trợ khách hàng & Khiếu nại" : "6. Customer Support & Resolution"}
              </h2>
            </div>
            <p className="legal-text">
              {isVi
                ? "Nếu bạn cần yêu cầu bảo hành, đổi thẻ hoặc cần giải đáp bất kỳ thắc mắc nào, đội ngũ chăm sóc khách hàng VinaTap luôn sẵn sàng hỗ trợ:"
                : "If you need warranty assistance, card replacement, or policy clarifications, our support team is at your service:"}
            </p>
            <div className="legal-contact-box">
              <div className="legal-contact-item">
                <Send size={18} />
                <div>
                  <div className="legal-contact-label">{isVi ? "Hotline / Email" : "Hotline / Email"}</div>
                  <div className="legal-contact-val">contact@vinatap.vn</div>
                </div>
              </div>
              <div className="legal-contact-item">
                <CheckCircle size={18} />
                <div>
                  <div className="legal-contact-label">{isVi ? "Thời gian xử lý" : "Response Time"}</div>
                  <div className="legal-contact-val">{isVi ? "Trong vòng 24 giờ" : "Within 24 hours"}</div>
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
