"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import {
  Compass,
  Calendar,
  Eye,
  Clock,
  Bookmark,
  Share2,
  ChevronRight,
  MapPin,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Camera,
  Utensils,
  Landmark,
  Music,
  Coffee,
  X,
  CreditCard,
  ArrowRight,
  Info,
  Ticket,
  Zap,
} from "lucide-react";
import "@/styles/guide-editorial.css";

// ─── DỮ LIỆU: 10 ĐIỀU TUYỆT NHẤT NÊN LÀM Ở TP. HỒ CHÍ MINH ───
const HCMC_GUIDE_ITEMS = [
  {
    id: 1,
    num: "01",
    title: "Khám Phá Dinh Độc Lập (Hội Trường Thống Nhất)",
    subTitle: "Dấu ấn lịch sử vang dội giữa lòng Sài Gòn",
    category: "Lịch sử & Di sản",
    categoryKey: "history",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Reunification-Palace-Vietnamnomad.jpg",
    desc: "Được thiết kế bởi kiến trúc sư tài ba Ngô Viết Thụ, Dinh Độc Lập là tuyệt tác kết hợp hài hòa giữa kiến trúc hiện đại phương Tây và triết lý phong thủy phương Đông. Từng là cơ quan đầu não của chính quyền Sài Gòn, nơi đây ghi dấu thời khắc lịch sử trưa ngày 30/4/1975 khi chiếc xe tăng 390 húc đổ cổng chính. Du khách sẽ được chiêm ngưỡng phòng khánh tiết lộng lẫy, phòng họp nội các, sân bay trực thăng tầng thượng và mạng lưới hầm chỉ huy kiên cố dưới lòng đất với bản đồ tác chiến nguyên bản.",
    tip: "Nên thuê máy thuyết minh tự động (audio guide đa ngôn ngữ) tại quầy vé để được dẫn dắt qua từng câu chuyện lịch sử sống động của mỗi căn phòng.",
    cost: "40.000 VNĐ (~$1.6 USD)",
    hours: "08:00 - 16:30 (Mở cửa cả tuần)",
    address: "135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Dinh Độc Lập Hồ Chí Minh",
    affiliate: {
      url: "https://shorten.asia/rhvFkFyD",
      partner: "Klook",
      badge: "Vé Điện Tử Chính Hãng",
      title: "Vé Tham Quan Dinh Độc Lập (Hội Trường Thống Nhất)",
      note: "Xác nhận tức thì • Quét mã QR vào cổng không cần xếp hàng mua vé giấy",
      ctaText: "Đặt vé Dinh Độc Lập online",
    },
  },
  {
    id: 2,
    num: "02",
    title: "Ngắm Toàn Cảnh Sài Gòn Từ Đài Quan Sát Landmark 81 & Bitexco",
    subTitle: "Bắt trọn đường chân trời tráng lệ của đô thị năng động bậc nhất",
    category: "Ngắm cảnh & Trải nghiệm",
    categoryKey: "sightseeing",
    image: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
    desc: "Tòa tháp Landmark 81 sừng sững cao 461,3m (tòa nhà cao nhất Việt Nam) sở hữu đài quan sát SkyView trên 3 tầng cao nhất (tầng 79, 80 và 81). Từ độ cao gần 400m qua lớp kính viền vô cực trong suốt, bạn sẽ thu trọn vào tầm mắt khúc quanh mềm mại của sông Sài Gòn và sự chuyển mình rực rỡ của thành phố khi hoàng hôn buông xuống. Nếu muốn trải nghiệm phong vị Sài Gòn kinh điển hơn, Saigon Skydeck tại tháp Bitexco Financial Tower hình búp sen ngay trung tâm Quận 1 cũng là góc ngắm phố phường mãn nhãn.",
    tip: "Thời điểm lý tưởng nhất để lên đài quan sát là từ 17:15 đến 18:30 chiều — bạn sẽ chiêm ngưỡng trọn vẹn cả hoàng hôn ráng vàng lẫn thành phố lung linh ánh đèn đêm.",
    cost: "Landmark 81 SkyView: từ 300.000 VNĐ | Bitexco Skydeck: từ 200.000 VNĐ",
    hours: "09:30 - 22:00 hàng ngày",
    address: "720A Điện Biên Phủ, Phường 22, Bình Thạnh (Landmark 81)",
    mapsQuery: "Landmark 81 SkyView Bình Thạnh",
    affiliate: {
      url: "https://shorten.asia/ZfZ4B5UM",
      partner: "Klook",
      badge: "View Triệu Đô",
      title: "Vé Đài Quan Sát Landmark 81 SkyView & Saigon Skydeck Bitexco",
      note: "Ưu đãi giá tốt độc quyền • Chiêm ngưỡng toàn cảnh thành phố từ độ cao gần 400m",
      ctaText: "Đặt vé Landmark 81 / Bitexco",
    },
  },
  {
    id: 3,
    num: "03",
    title: "Khám Phá Chợ Bến Thành & Thưởng Thức Thiên Đường Ẩm Thực Chợ",
    subTitle: "Biểu tượng giao thương hơn một thế kỷ của Hòn Ngọc Viễn Đông",
    category: "Ẩm thực & Mua sắm",
    categoryKey: "food",
    image: "/guide/hcmc/hcmc-12-attractions-ben-thanh.jpg",
    desc: "Được khánh thành từ năm 1914 với tháp đồng hồ 4 mặt huyền thoại, Chợ Bến Thành không chỉ là trung tâm buôn bán tấp nập mà còn là biểu tượng văn hóa bất biến của Sài Gòn. Bên trong nhà lồng chợ là hơn 1.400 sạp hàng bày bán vải lụa, đồ thủ công mỹ nghệ, hạt điều rang củi và cà phê phin. Khu ẩm thực ở Cửa Nam là nơi quy tụ mọi món ngon ba miền: bún mắm đậm đà, bánh bèo chén tôm cháy, chè sương sa hạt lựu cốt dừa béo ngậy và gỏi cuốn tôm thịt chấm tương đen ngào ngạt.",
    tip: "Khi mua quà lưu niệm hay vải vóc, bạn nên trả giá nhẹ nhàng xuống khoảng 20-30%. Khu ẩm thực niêm yết giá rõ ràng trên bảng hiệu từng quầy.",
    cost: "Vào cửa tự do | Các món ăn từ 35.000 - 85.000 VNĐ",
    hours: "Chợ ngày: 06:00 - 18:00 | Chợ đêm quanh cổng: 18:00 - 23:00",
    address: "Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Chợ Bến Thành Quận 1",
    affiliate: {
      url: "https://shorten.asia/yXvC4bfU",
      partner: "Klook",
      badge: "Food Tour Bản Địa",
      title: "Tour Khám Phá Chợ Bến Thành & Trải Nghiệm Ẩm Thực Sài Gòn",
      note: "Hướng dẫn viên bản địa • Thưởng thức các món đặc sản trứ danh ba miền",
      ctaText: "Xem tour ẩm thực Bến Thành",
    },
  },
  {
    id: 4,
    num: "04",
    title: "Du Hành Quá Khứ Tại Hệ Thống Địa Đạo Củ Chi",
    subTitle: "Kỳ quan công sự ngầm huyền thoại trong lịch sử quân sự thế giới",
    category: "Lịch sử & Di sản",
    categoryKey: "history",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Cu-Chi-Tunnels-Vietnamnomad.jpg",
    desc: "Cách trung tâm TP.HCM khoảng 60km về phía Tây Bắc, Địa đạo Củ Chi là hệ thống đường hầm bí mật dài hơn 250km được đào hoàn toàn bằng tay và dụng cụ thô sơ qua nhiều thập kỷ chiến tranh. Mạng lưới hầm ngầm ba tầng sâu hút lòng đất bao gồm phòng hội họp, bếp Hoàng Cầm không khói, kho vũ khí, bệnh xá dã chiến và hệ thống hầm chông thông minh. Trải nghiệm khom mình bò qua đoạn hầm hẹp và thưởng thức củ mì luộc chấm muối mè bên cánh rừng bạt ngàn sẽ để lại ấn tượng khó phai.",
    tip: "Khu Bến Dược giữ được nét nguyên bản hơn, còn khu Bến Đình được mở rộng lòng hầm phù hợp hơn cho du khách phương Tây. Hãy mang giày thể thao thoải mái.",
    cost: "Vé tham quan: 35.000 VNĐ (Việt Nam) / 125.000 VNĐ (Quốc tế)",
    hours: "07:30 - 17:00 hàng ngày",
    address: "Ấp Phú Hiệp, Xã Phú Mỹ Hưng, Huyện Củ Chi, TP.HCM",
    mapsQuery: "Địa đạo Củ Chi Bến Dược",
    affiliate: {
      url: "https://shorten.asia/p993NUTn",
      partner: "Klook",
      badge: "Tour Bán Chạy Nhất",
      title: "Tour Trọn Gói Khám Phá Địa Đạo Củ Chi (Nửa Ngày / 1 Ngày)",
      note: "Đưa đón tận nơi tại trung tâm Quận 1 • Bao gồm vé vào cổng & HDV giàu kinh nghiệm",
      ctaText: "Đặt tour Địa đạo Củ Chi",
    },
  },
  {
    id: 5,
    num: "05",
    title: "Ngắm Sài Gòn Lên Đèn Bằng Du Thuyền Sông & Waterbus",
    subTitle:
      "Hành trình lãng mạn lướt sóng ngắm nhìn đô thị hiện đại bên sông",
    category: "Ngắm cảnh & Trải nghiệm",
    categoryKey: "sightseeing",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Bach-Dang-Bus-Station-Vietnamnomad.jpg",
    desc: "Sông Sài Gòn là cái nôi nuôi dưỡng đô thị phương Nam từ thuở lập làng đến nay. Cách tuyệt vời và tiết kiệm nhất để ngắm thành phố từ mặt nước là đi Saigon Waterbus xuất phát từ Bến Bạch Đằng đến Bến Bình An/Linh Đông. Những cơn gió lộng xua tan cái nóng nhiệt đới, mở ra khung cảnh ngoạn mục của cầu Ba Son (Thủ Thiêm 2), bến cảng Ba Son cũ và cụm cao ốc bừng sáng phản chiếu lung linh xuống mặt nước.",
    tip: "Đặt vé Waterbus trước qua website vào khung giờ 17:30 chiều để ngắm hoàng hôn, hoặc đặt tour du thuyền ăn tối cao cấp nếu đi cùng người thương.",
    cost: "Saigon Waterbus: 15.000 VNĐ/lượt | Du thuyền ăn tối: 450.000 - 1.200.000 VNĐ",
    hours: "Waterbus chạy từ 07:00 - 20:00 (chuyến cách 30-45 phút)",
    address:
      "Ga Tàu Thủy Bạch Đằng, Số 10B Tôn Đức Thắng, Phường Bến Nghé, Quận 1",
    mapsQuery: "Ga tàu thủy Bạch Đằng Bến Nghé Quận 1",
    affiliate: {
      url: "https://shorten.asia/WNKx7pX8",
      partner: "Klook",
      badge: "Trải Nghiệm Lãng Mạn",
      title: "Vé Saigon Waterbus & Du Thuyền Ăn Tối Ngắm Sông Sài Gòn",
      note: "Ngắm thành phố lên đèn lộng lẫy • Đặt trước giữ chỗ đẹp ngắm hoàng hôn",
      ctaText: "Đặt vé Du thuyền / Waterbus",
    },
  },
  {
    id: 6,
    num: "06",
    title: "Thấu Cảm Lịch Sử Tại Bảo Tàng Chứng Tích Chiến Tranh",
    subTitle: "Bảo tàng được du khách quốc tế ghé thăm nhiều nhất Việt Nam",
    category: "Lịch sử & Di sản",
    categoryKey: "history",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-War-Remnants-Museum-Vietnamnomad.jpg",
    desc: "Bảo tàng Chứng tích Chiến tranh là điểm đến đem lại nhiều xúc cảm lắng đọng sâu sắc nhất cho bất kỳ du khách nào. Với hơn 20.000 tài liệu, hiện vật và những bức ảnh tư liệu đắt giá của các phóng viên chiến trường quốc tế, bảo tàng phơi bày chân thực sự tàn khốc của chiến tranh và hậu quả của chất độc da cam. Sân ngoài trưng bày các khí tài quân sự đồ sộ như máy bay tiêm kích UH-1 Huey, xe tăng M48 Patton và bom điều khiển.",
    tip: "Khu vực tầng 2 trưng bày phòng tranh 'Hồi niệm' (Requiem) của cố phóng viên Tim Page và Horst Faas mang giá trị nhân văn và nhiếp ảnh vô cùng cao quý.",
    cost: "40.000 VNĐ (~$1.6 USD)",
    hours: "07:30 - 17:30 (Mở cửa cả ngày lễ)",
    address: "28 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM",
    mapsQuery: "Bảo tàng Chứng tích Chiến tranh Quận 3",
    affiliate: {
      url: "https://shorten.asia/gXcAwua3",
      partner: "Klook",
      badge: "Di Sản Lịch Sử",
      title: "Vé Tham Quan & City Tour Bảo Tàng Chứng Tích Chiến Tranh",
      note: "Vé điện tử tiện lợi • Tùy chọn xe Hop-on Hop-off tham quan trọn gói các điểm",
      ctaText: "Đặt vé / Tour bảo tàng",
    },
  },
  {
    id: 7,
    num: "07",
    title: "Thưởng Thức Văn Hóa Cà Phê Vợt & Cà Phê Bệt Sài Gòn",
    subTitle: "Thức uống đánh thức mọi giác quan và nếp sống hào sảng mộc mạc",
    category: "Văn hóa & Đời sống",
    categoryKey: "culture",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Ca-Phe-Sua-Da-Vietnamnomad.jpg",
    desc: "Người Sài Gòn không chỉ 'uống cà phê' — họ sống cùng cà phê. Từ những quán cà phê vợt khói bốc nghi ngút tồn tại ngót nghét gần một thế kỷ ở hẻm Cheo Leo hay quán Ba Lù ở chợ Phùng Hưng, cà phê được ủ bằng ấm đất nung trên bếp than củi thơm lừng mùi bơ thảo mộc. Đến chiều mát, khu công viên 30/4 trước Nhà thờ Đức Bà lại rộn rã những góc 'cà phê bệt' trên tờ báo giấy, râm ran câu chuyện rôm rả của các thế hệ học sinh, sinh viên và nghệ sĩ.",
    tip: "Hãy gọi một ly 'Cà phê sữa đá vợt' ít đường nhiều sữa đặc và thêm một dĩa bánh tiêu hoặc giò cháo quẩy để chấm kèm theo đúng lối ăn người Hoa xưa.",
    cost: "15.000 - 30.000 VNĐ (~$0.6 - $1.2 USD)",
    hours: "Cà phê Vợt Cheo Leo: 05:15 - 18:45 | Cà phê Bệt: Cả ngày",
    address: "109/36 Nguyễn Thiện Thuật, Phường 2, Quận 3 (Cà phê Cheo Leo)",
    mapsQuery: "Cà phê vợt Cheo Leo Quận 3",
    affiliate: {
      url: "https://shorten.asia/F4u2CkPX",
      partner: "Klook",
      badge: "Văn Hóa Bản Địa",
      title: "Walking Tour Khám Phá Văn Hóa Cà Phê Vợt & Ngõ Hẻm Sài Gòn",
      note: "Thưởng thức cà phê sữa đá vợt truyền thống • Cảm nhận nhịp sống chậm xưa cũ",
      ctaText: "Đặt tour cà phê Sài Gòn",
    },
  },
  {
    id: 8,
    num: "08",
    title: "Hòa Mình Vào Nhịp Sống Về Đêm Tại Phố Đi Bộ Bùi Viện & Nguyễn Huệ",
    subTitle: "Bản hòa ca của ánh sáng, âm nhạc và sự náo nhiệt không ngủ",
    category: "Cuộc sống Về đêm",
    categoryKey: "nightlife",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Bui-Vien-Street-Vietnamnomad.jpg",
    desc: "Sài Gòn thực sự 'sống' trọn vẹn nhất khi màn đêm buông xuống. Phố đi bộ Nguyễn Huệ rộng thênh thang lát đá granite là nơi các bạn trẻ tụ họp xem biểu diễn nhạc nước, hòa vào âm nhạc acoustic đường phố và ngắm chung cư cà phê 42 Nguyễn Huệ lên đèn rực rỡ. Ngược lại, nếu bạn tìm kiếm sự sôi động và cuồng nhiệt, 'Phố Tây' Bùi Viện sẽ làm bạn choáng ngợp với dàn loa công suất lớn, ánh đèn neon, màn múa lửa nghệ thuật và những ly bia mát lạnh cùng bạn bè quốc tế.",
    tip: "Muốn ngắm trọn vẹn phố đi bộ Nguyễn Huệ từ trên cao, hãy ghé một quán cà phê nhỏ tại chung cư 42 Nguyễn Huệ (% Arabica hoặc The Letter Cafe) vào khoảng 19:30 tối.",
    cost: "Vào cổng miễn phí | Đồ uống từ 35.000 - 80.000 VNĐ",
    hours:
      "Phố đi bộ Nguyễn Huệ: 24/7 | Bùi Viện: Sôi động nhất từ 19:00 - 02:00 sáng",
    address:
      "Đường Nguyễn Huệ, Quận 1 & Đường Bùi Viện, Phường Phạm Ngũ Lão, Quận 1",
    mapsQuery: "Phố đi bộ Nguyễn Huệ Hồ Chí Minh",
    affiliate: {
      url: "https://shorten.asia/XrHC2SBm",
      partner: "Klook",
      badge: "Night Tour Sôi Động",
      title: "Tour Xe Máy Trải Nghiệm Sài Gòn Về Đêm & Phố Bùi Viện",
      note: "Tài xế bản địa đưa đón tận nơi • Thưởng thức món ngon đường phố & ngắm phố đêm",
      ctaText: "Đặt tour Sài Gòn về đêm",
    },
  },
  {
    id: 9,
    num: "09",
    title: "Lạc Bước Vào Khu Phố Người Hoa Chợ Lớn & Thăm Chùa Bà Thiên Hậu",
    subTitle:
      "Di sản văn hóa hơn 300 năm với kiến trúc cổ kính và ẩm thực phong phú",
    category: "Văn hóa & Đời sống",
    categoryKey: "culture",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Chinatown-Vietnamnomad.jpg",
    desc: "Chợ Lớn (trải dài qua Quận 5, Quận 6 và Quận 11) là một trong những khu phố người Hoa lâu đời nhất thế giới. Điểm nhấn linh thiêng nhất tại đây là Chùa Bà Thiên Hậu (Tuệ Thành Hội Quán) xây dựng từ năm 1760. Ngôi chùa nổi bật với những bức phù điêu gốm sứ tinh xảo trên mái ngói và những vòng nhang trầm khổng lồ treo lơ lửng trên giếng trời, mang theo ước nguyện bình an của khách thập phương. Dạo quanh khu phố, bạn sẽ bắt gặp các tiệm thuốc bắc ngào ngạt hương thảo mộc và những tiệm dimsum, sủi cảo gia truyền nức tiếng.",
    tip: "Mua một khoanh nhang treo ghi tên gia đình mình để cầu bình an. Sau khi viếng chùa, hãy ghé thưởng thức chè nhà đèn cột điện hoặc sủi cảo gia truyền đường Hà Tôn Quyền.",
    cost: "Miễn phí vé vào cửa Chùa Bà Thiên Hậu",
    hours: "06:30 - 16:30 hàng ngày",
    address: "710 Nguyễn Trãi, Phường 11, Quận 5, TP.HCM",
    mapsQuery: "Chùa Bà Thiên Hậu Nguyễn Trãi Quận 5",
    affiliate: null,
  },
  {
    id: 10,
    num: "10",
    title: "Chiêm Ngưỡng Nhà Thờ Tân Định Màu Hồng & Thưởng Thức À Ố Show",
    subTitle: "Nét duyên dáng kiến trúc phương Tây và tinh hoa xiếc tre Việt",
    category: "Nghệ thuật & Kiến trúc",
    categoryKey: "arts",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Tan-Dinh-Church-Vietnamnomad.jpg",
    desc: "Nhà thờ Tân Định khoác lên mình màu hồng pastel nổi bật rực rỡ, là một trong những công trình tôn giáo cổ nhất thành phố mang phong cách kiến trúc Gothic kết hợp Roman và Baroque. Cách đó không xa, Nhà hát Lớn TP.HCM (Saigon Opera House) là công trình biểu tượng tuyệt mỹ mang phong cách Tân cổ điển Pháp khánh thành năm 1900, nơi diễn ra vở diễn xiếc tre lừng danh quốc tế 'À Ố Show'.",
    tip: "Chụp ảnh Nhà thờ Tân Định đẹp nhất từ phía quán cà phê Cộng đối diện để lấy trọn đỉnh tháp chuông vươn cao trên nền trời xanh.",
    cost: "Tham quan ngoài miễn phí | Vé À Ố Show: 800.000 - 1.600.000 VNĐ",
    hours: "Nhà thờ: 08:00 - 17:00 | Nhà hát: Theo lịch biểu diễn",
    address:
      "289 Hai Bà Trưng, Phường 8, Quận 3 & 07 Công Trường Lam Sơn, Quận 1",
    mapsQuery: "Nhà thờ Tân Định Quận 3",
    affiliate: {
      url: "https://shorten.asia/8VqrNzdz",
      partner: "Klook",
      badge: "Show Diễn Đỉnh Cao",
      title: "Vé Vở Diễn Nghệ Thuật Xiếc Tre À Ố Show (Nhà Hát Lớn Sài Gòn)",
      note: "Đặt sớm giữ vị trí ghế trung tâm • Thưởng thức kiệt tác nghệ thuật sân khấu tre Việt",
      ctaText: "Đặt vé À Ố Show online",
    },
  },
];

// Danh mục lọc
const THINGS_CATEGORIES = [
  { key: "all", label: "Tất cả 10 điều", icon: Compass },
  { key: "history", label: "Lịch sử & Di sản", icon: Landmark },
  { key: "sightseeing", label: "Ngắm cảnh & View đỉnh", icon: Camera },
  { key: "food", label: "Ẩm thực bản địa", icon: Utensils },
  { key: "culture", label: "Văn hóa & Đời sống", icon: Coffee },
  { key: "nightlife", label: "Cuộc sống về đêm", icon: Music },
  { key: "arts", label: "Nghệ thuật sân khấu", icon: Sparkles },
];

export default function ThingsToDoInHCMCPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vinatap_guide_bookmarks");
      if (saved) setBookmarkedIds(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  };

  const toggleBookmark = (id) => {
    let next;
    if (bookmarkedIds.includes(id)) {
      next = bookmarkedIds.filter((item) => item !== id);
      showToast("Đã bỏ lưu khỏi Sổ tay VinaTap");
    } else {
      next = [...bookmarkedIds, id];
      showToast("Đã lưu vào Sổ tay hành trình VinaTap! ✨");
    }
    setBookmarkedIds(next);
    try {
      localStorage.setItem("vinatap_guide_bookmarks", JSON.stringify(next));
    } catch (e) {}
  };

  const copyAddress = (address) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      showToast("Đã sao chép địa chỉ vào bộ nhớ tạm! 📋");
    }
  };

  const filteredItems =
    activeCategory === "all"
      ? HCMC_GUIDE_ITEMS
      : HCMC_GUIDE_ITEMS.filter((item) => item.categoryKey === activeCategory);

  return (
    <div className="guide-page-wrapper">
      {/* ─── THANH TIẾN TRÌNH ĐỌC ─── */}
      <div
        className="guide-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ─── TOP NAVBAR ─── */}
      <nav className="guide-nav" aria-label="Điều hướng cẩm nang">
        <div className="guide-nav__inner">
          <div className="guide-nav__left">
            <Logo size={28} />
            <div className="guide-breadcrumb">
              <Link href="/">Trang chủ</Link>
              <ChevronRight size={13} />
              <Link href="/#destinations">Điểm đến</Link>
              <ChevronRight size={13} />
              <Link href="/province/ho-chi-minh">TP. Hồ Chí Minh</Link>
              <ChevronRight size={13} />
              <span className="guide-breadcrumb__curr">
                10 điều tuyệt nhất nên làm
              </span>
            </div>
          </div>
          <div className="guide-nav__right" />
        </div>
      </nav>

      {/* ─── NỘI DUNG CHÍNH ─── */}
      <main className="guide-container">
        {/* TIÊU ĐỀ & METADATA */}
        <header className="guide-header">
          <div className="guide-badge-pill">
            <Compass size={14} />
            <span>CẨM NANG ĐẶC BIỆT • VINATAP SIGNATURE EDITORIAL</span>
          </div>

          <h1 className="guide-title">
            10 Điều Tuyệt Nhất Nên Làm &amp; Trải Nghiệm Tại TP. Hồ Chí Minh
          </h1>

          <p className="guide-subtitle">
            Từ di sản lịch sử hào hùng, những góc cà phê bệt hoài niệm đến các
            tòa cao ốc chọc trời và hẻm ẩm thực đêm rực rỡ — cẩm nang chọn lọc
            giúp bạn chạm vào trọn vẹn linh hồn của “Hòn ngọc Viễn Đông”.
          </p>

          <div className="guide-meta-bar">
            <div className="guide-author-box">
              <div className="guide-author-avatar">VT</div>
              <div>
                <div className="guide-author-name">
                  <span>Ban Biên Tập VinaTap</span>
                  <Sparkles size={14} className="guide-verified-badge" />
                </div>
                <div className="guide-author-role">
                  Chuyên trang Văn hóa &amp; Du lịch Bản địa Việt Nam
                </div>
              </div>
            </div>

            <div className="guide-meta-stats">
              <span className="guide-meta-item">
                <Calendar size={14} />
                <span>28 Tháng 9, 2026</span>
              </span>
              <span className="guide-meta-item">
                <Clock size={14} />
                <span>8 phút đọc</span>
              </span>
              <span className="guide-meta-item">
                <Eye size={14} />
                <span>128.450 lượt xem</span>
              </span>
            </div>

            <div className="guide-header-actions">
              <button
                type="button"
                className={`guide-action-btn ${
                  bookmarkedIds.length > 0 ? "active" : ""
                }`}
                onClick={() =>
                  showToast(
                    `Bạn đã lưu ${bookmarkedIds.length} địa điểm trong Sổ tay VinaTap`,
                  )
                }
              >
                <Bookmark size={14} />
                <span>Đã lưu ({bookmarkedIds.length})</span>
              </button>
              <button
                type="button"
                className="guide-action-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "10 Điều Tuyệt Nhất Nên Làm ở TP.HCM - VinaTap",
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    showToast("Đã sao chép link bài viết! 🔗");
                  }
                }}
              >
                <Share2 size={14} />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </header>

        {/* ─── BANNER LIÊN KẾT NHANH SANG BÀI ẨM THỰC ─── */}
        <div
          style={{
            background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
            border: "1px solid #99f6e4",
            borderRadius: "12px",
            padding: "14px 18px",
            margin: "18px 0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Utensils size={20} color="#0d9488" />
            <span
              style={{ fontSize: "14px", color: "#0f766e", fontWeight: 600 }}
            >
              Khám phá thêm: Bạn đang tìm kiếm những món ăn đường phố ngon nhất
              Sài Gòn?
            </span>
          </div>
          <Link
            href="/guide/12-must-try-foods-in-ho-chi-minh-city"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: "#0d9488",
              color: "#ffffff",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <span>12 Món Ăn Đường Phố Phải Thử</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ─── HERO BANNER ─── */}
        <section className="guide-hero-banner">
          <div className="guide-hero-img-wrap">
            <img
              src="/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Reunification-Palace-Vietnamnomad.jpg"
              alt="Khám phá TP. Hồ Chí Minh"
              className="guide-hero-img"
            />
            <div className="guide-hero-overlay">
              <div className="guide-hero-chips">
                <span className="guide-hero-chip">Top 10 Trải Nghiệm</span>
                <span className="guide-hero-chip">
                  Địa chỉ thật &amp; Giá chuẩn
                </span>
                <span className="guide-hero-chip">
                  Hỗ trợ dẫn đường Google Maps
                </span>
              </div>
              <p className="guide-hero-caption">
                TP. Hồ Chí Minh – Nơi giao thoa ngoạn mục giữa dòng chảy lịch sử
                trăm năm và nhịp đập đô thị hiện đại không bao giờ ngủ.
              </p>
            </div>
          </div>
        </section>

        {/* ─── DẪN NHẬP (LEAD STORY) ─── */}
        <section className="guide-lead-box">
          <p>
            <strong>Thành phố Hồ Chí Minh</strong> có một nguồn năng lượng sống
            mãnh liệt mà bạn khó tìm thấy ở bất cứ nơi nào khác. Đó là âm thanh
            rộn rã của tiếng xe cộ buổi sớm, là hương thơm nồng nàn từ những xe
            đẩy bánh mì góc phố, là sự kiêu hãnh của những tòa tháp kính bên
            cạnh những công trình thuộc địa cổ kính. Dù bạn chỉ có 24 giờ quá
            cảnh hay một tuần thảnh thơi,{" "}
            <strong>10 trải nghiệm đặc sắc</strong> dưới đây giúp bạn cảm nhận
            sâu sắc nhất từng nhịp thở của thành phố.
          </p>
        </section>

        {/* ─── THANH LỌC DANH MỤC ─── */}
        <section className="guide-quicknav-sticky">
          <div className="guide-quicknav-inner">
            {THINGS_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  className={`guide-filter-pill ${isActive ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── DANH SÁCH 10 TRẢI NGHIỆM ─── */}
        <section className="guide-cards-list">
          {filteredItems.map((item) => {
            const isSaved = bookmarkedIds.includes(item.id);
            return (
              <article
                key={item.id}
                id={`item-${item.id}`}
                className="guide-card"
              >
                <div className="guide-card__grid">
                  {/* Cột ảnh */}
                  <div
                    className="guide-card__media"
                    onClick={() => setLightboxItem(item)}
                    style={{ cursor: "pointer" }}
                    title="Nhấp để xem ảnh phóng to"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="guide-card__img"
                    />
                    <div className="guide-card__number-badge">#{item.num}</div>
                    <div className="guide-card__category-badge">
                      <Sparkles size={12} color="#00c2cb" />
                      <span>{item.category}</span>
                    </div>
                  </div>

                  {/* Cột nội dung */}
                  <div className="guide-card__body">
                    <div>
                      <h2 className="guide-card__title">
                        {item.num}. {item.title}
                      </h2>
                      <div className="guide-card__subtitle">
                        {item.subTitle}
                      </div>
                      <p className="guide-card__desc">{item.desc}</p>

                      {/* Box Mẹo bản địa */}
                      <div className="guide-tip-box">
                        <Info size={17} className="guide-tip-icon" />
                        <div className="guide-tip-text">
                          <strong>Mẹo VinaTap:</strong> {item.tip}
                        </div>
                      </div>

                      {/* Bảng thông tin nhanh */}
                      <div className="guide-card__facts">
                        <div className="guide-fact-item">
                          <CreditCard size={15} />
                          <div>
                            <div>Chi phí tham khảo:</div>
                            <span className="guide-fact-val">{item.cost}</span>
                          </div>
                        </div>
                        <div className="guide-fact-item">
                          <Clock size={15} />
                          <div>
                            <div>Thời gian hoạt động:</div>
                            <span className="guide-fact-val">{item.hours}</span>
                          </div>
                        </div>
                        <div
                          className="guide-fact-item"
                          style={{ gridColumn: "1 / -1" }}
                        >
                          <MapPin size={15} />
                          <div>
                            <div>Địa chỉ gợi ý:</div>
                            <span className="guide-fact-val">
                              {item.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Khung ưu đãi đặt vé / tour trực tuyến (Affiliate) */}
                      {item.affiliate && (
                        <div className="guide-affiliate-deal">
                          <div className="guide-affiliate-deal__content">
                            <div className="guide-affiliate-deal__top">
                              <span className="guide-affiliate-deal__badge">
                                <Ticket size={12} />
                                <span>
                                  {item.affiliate.badge || "Ưu đãi trực tuyến"}
                                </span>
                              </span>
                              <span className="guide-affiliate-deal__partner">
                                Đối tác tin cậy:{" "}
                                <strong>
                                  {item.affiliate.partner || "Klook"}
                                </strong>
                              </span>
                            </div>
                            <div className="guide-affiliate-deal__title">
                              {item.affiliate.title}
                            </div>
                            <div className="guide-affiliate-deal__note">
                              <Zap size={13} color="#ff5722" />
                              <span>{item.affiliate.note}</span>
                            </div>
                          </div>
                          <a
                            href={item.affiliate.url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="guide-affiliate-deal__cta"
                          >
                            <span>
                              {item.affiliate.ctaText || "Đặt vé online ngay"}
                            </span>
                            <ArrowRight size={15} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Footer hàng nút hành động */}
                    <div className="guide-card__footer">
                      <div className="guide-card__address-group">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            item.mapsQuery || item.address,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="guide-btn-action"
                        >
                          <ExternalLink size={14} />
                          <span>Mở Google Maps</span>
                        </a>

                        <button
                          type="button"
                          className="guide-btn-copy"
                          onClick={() => copyAddress(item.address)}
                          title="Sao chép địa chỉ"
                        >
                          <Copy size={13} />
                          <span>Copy địa chỉ</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        className={`guide-card__save-btn ${isSaved ? "saved" : ""}`}
                        onClick={() => toggleBookmark(item.id)}
                      >
                        <Bookmark size={14} />
                        <span>{isSaved ? "Đã lưu" : "Lưu vào sổ tay"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* ─── LIÊN KẾT BÀI VIẾT LIÊN QUAN ─── */}
        <footer className="guide-article-footer">
          <div>
            <div className="guide-badge-pill">
              <Compass size={13} />
              <span>KHÁM PHÁ TIẾP TỤC CÙNG VINATAP</span>
            </div>
            <h3
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                margin: "0.5rem 0 1rem",
              }}
            >
              Cẩm Nang Du Lịch Các Tỉnh Thành Nổi Bật Khác
            </h3>
          </div>

          <div className="guide-related-grid">
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="guide-related-card"
            >
              <img
                src="/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg"
                alt="12 món ăn đường phố Sài Gòn"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Ẩm Thực Sài Gòn</div>
                <div className="guide-related-title">
                  12 Món Ăn Đường Phố Phải Thử Ở Sài Gòn Kèm Địa Chỉ Quán Ngon
                </div>
              </div>
            </Link>

            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="guide-related-card"
            >
              <img
                src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                alt="Cẩm nang du lịch Việt Nam"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Toàn Diện 34 Tỉnh</div>
                <div className="guide-related-title">
                  Cẩm Nang Toàn Diện Du Lịch Việt Nam 2026: Bản Đồ, Visa &amp;
                  Chi Phí
                </div>
              </div>
            </Link>

            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="guide-related-card"
            >
              <img
                src="/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg"
                alt="15 Điểm Đến Tuyệt Nhất Việt Nam"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Bình Chọn 2026</div>
                <div className="guide-related-title">
                  15 Điểm Đến Tuyệt Nhất Việt Nam Năm 2026 Theo Du Khách
                </div>
              </div>
            </Link>
          </div>
        </footer>
      </main>

      {/* ─── TOAST THÔNG BÁO ─── */}
      <div className={`guide-toast ${toastVisible ? "show" : ""}`}>
        <Check size={18} color="#00c2cb" />
        <span>{toastMessage}</span>
      </div>

      {/* ─── LIGHTBOX MODAL ─── */}
      {lightboxItem && (
        <div
          className="guide-lightbox open"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="guide-lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="guide-lightbox__close"
              onClick={() => setLightboxItem(null)}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              className="guide-lightbox__img"
            />
            <div className="guide-lightbox__meta">
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                #{lightboxItem.num}. {lightboxItem.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                {lightboxItem.address}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* ─── AI TRAVEL COMPANION (CHATBOT) ─── */}
      <ProvinceChatbot
        province={{ name: "TP. Hồ Chí Minh", slug: "ho-chi-minh" }}
      />
    </div>
  );
}
