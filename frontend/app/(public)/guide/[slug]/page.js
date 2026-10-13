"use client";

import { useState, useEffect, Suspense } from "react";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { articleAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
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
  Shield,
  Coffee,
  Ship,
  X,
  CreditCard,
  ArrowRight,
  Info,
  Flame,
  Award,
} from "lucide-react";
import "@/styles/guide-editorial.css";
import "@/styles/home.css";

// ─── DỮ LIỆU CẨM NANG: 10 ĐIỀU TUYỆT NHẤT NÊN LÀM Ở TP. HỒ CHÍ MINH ───
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
  },
  {
    id: 2,
    num: "02",
    title: "Ngắm Toàn Cảnh Sài Gòn Từ Đài Quan Sát Landmark 81 & Bitexco",
    subTitle: "Bắt trọn đường chân trời tráng lệ của đô thị năng động bậc nhất",
    category: "Ngắm cảnh & Trải nghiệm",
    categoryKey: "sightseeing",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-the-Diamond-Plaza-Vietnamnomad.jpg",
    desc: "Với chiều cao 461.3m, Landmark 81 sừng sững bên bờ sông Sài Gòn tựa bó tre vươn cao, là tòa nhà cao nhất Việt Nam và top đầu Đông Nam Á. Từ đài quan sát SkyView tầng 79-81, bạn có thể phóng tầm mắt bao trọn khúc quanh sông Sài Gòn và những cây cầu lung linh nối đôi bờ. Nếu muốn góc nhìn hoài niệm giữa trung tâm Quận 1, Diamond Plaza và Saigon Skydeck tại tháp Bitexco cũng là điểm ngắm thành phố lý tưởng.",
    tip: "Lên đài quan sát vào khung giờ 17:15 - 17:45 chiều để thưởng trọn khoảnh khắc hoàng hôn buông xuống trước khi thành phố rực sáng muôn ngàn ánh đèn đêm.",
    cost: "200.000 - 450.000 VNĐ (~$8 - $18 USD)",
    hours: "09:30 - 22:00 hàng ngày",
    address:
      "720A Điện Biên Phủ, Phường 22, Bình Thạnh (Landmark 81) & 36 Hồ Tùng Mậu, Quận 1 (Bitexco)",
    mapsQuery: "Landmark 81 SkyView",
  },
  {
    id: 3,
    num: "03",
    title:
      "Thưởng Thức Cà Phê Bệt & Check-in Nhà Thờ Đức Bà - Bưu Điện Trung Tâm",
    subTitle: "Nét văn hóa đời sống bình dị và di sản kiến trúc Pháp cổ kính",
    category: "Văn hóa & Đời sống",
    categoryKey: "culture",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Ca-Phe-Sua-Da-Vietnamnomad.jpg",
    desc: "Không cần ghế êm hay phòng máy lạnh, 'cà phê bệt' công viên 30/4 là nét văn hóa đường phố độc đáo nhất của người Sài Gòn. Chỉ cần một tờ báo trải dưới bóng cây râm mát, nhâm nhi ly cà phê sữa đá đậm đà béo ngậy hay ly trà đào thơm lừng, bạn có thể ngồi trò chuyện rôm rả hàng giờ. Đối diện là Nhà thờ Đức Bà với sắc gạch Marseille đỏ cam và Bưu điện Trung tâm TP.HCM tráng lệ mang dấu ấn bàn tay thiết kế Gustave Eiffel.",
    tip: "Bước vào bên trong Bưu điện Trung tâm để ngắm trần vòm mái hình cánh cung tuyệt mỹ, gửi một tấm bưu thiếp tay viết về cho người thân và chụp ảnh kỷ niệm.",
    cost: "20.000 - 35.000 VNĐ (~$1 USD) cho ly cà phê",
    hours: "Cà phê bệt: 06:30 - 22:00 | Bưu điện: 07:30 - 18:00",
    address: "Công trường Công xã Paris, Phường Bến Nghé, Quận 1, TP.HCM",
    mapsQuery: "Bưu điện Trung tâm Sài Gòn",
  },
  {
    id: 4,
    num: "04",
    title:
      "Khám Phá Thiên Đường Ẩm Thực Đường Phố (Bánh Mì, Cơm Tấm, Hủ Tiếu, Bánh Xèo)",
    subTitle: "Thiên đường ăn vặt với hàng trăm món ngon đậm đà bản sắc",
    category: "Ẩm thực Bản địa",
    categoryKey: "food",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg",
    desc: "Sài Gòn là thánh địa ẩm thực đường phố, nơi hội tụ hương vị khắp ba miền và cộng đồng người Hoa, Khmer. Từ ổ bánh mì giòn rụm pate thơm phức, dĩa cơm tấm sườn bì chả đậm đà mỡ hành, đến tô hủ tiếu Nam Vang thanh ngọt và bánh xèo vàng ươm cuốn rau rừng. Bạn có thể ghé chợ Bến Thành, phố ẩm thực Hồ Thị Kỷ hoặc các con hẻm ăn vặt trứ danh để thưởng thức trọn vẹn tinh hoa này.",
    tip: "Đi cùng một 'chiếc bụng đói' và đổi sẵn tiền mặt lẻ mệnh giá 20k - 50k để dễ dàng mua sắm tại các quầy hàng rong tấp nập.",
    cost: "25.000 - 80.000 VNĐ / món (~$1 - $3 USD)",
    hours: "Chợ Bến Thành: 06:00 - 18:00 | Chợ đêm Hồ Thị Kỷ: 15:00 - 23:00",
    address:
      "Hẻm 52 Hồ Thị Kỷ, Phường 1, Quận 10 & Chợ Bến Thành, Lê Lợi, Quận 1",
    mapsQuery: "Phố ẩm thực Hồ Thị Kỷ",
  },
  {
    id: 5,
    num: "05",
    title: "Thám Hiểm Hệ Thống Địa Đạo Củ Chi Huyền Thoại",
    subTitle:
      "Kỳ tích ngầm hơn 250km được mệnh danh là 'Thành phố trong lòng đất'",
    category: "Lịch sử & Di sản",
    categoryKey: "history",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Cu-Chi-Tunnels-Vietnamnomad.jpg",
    desc: "Nằm cách trung tâm thành phố khoảng 60km, Địa đạo Củ Chi là minh chứng sống động cho ý chí kiên cường và mưu trí của quân dân Việt Nam trong chiến tranh. Hệ thống đường hầm gồm 3 tầng sâu với tổng chiều dài hơn 250km, kết nối đầy đủ trạm y tế, phòng họp, nhà bếp Hoàng Cầm không khói, kho vũ khí và giếng nước ngầm. Trải nghiệm khom người bò thử qua một đoạn hầm nguyên bản sẽ mang đến cho bạn cảm giác chân thực không thể nào quên.",
    tip: "Nên chọn tour nửa ngày di chuyển bằng cano cao tốc trên sông Sài Gòn (vừa ngắm cảnh sông nước thoáng đãng, vừa tránh kẹt xe). Khi kết thúc chuyến đi, nhớ thưởng thức khoai mì luộc chấm muối mè thơm bùi.",
    cost: "35.000 VNĐ (Bến Dược) - 125.000 VNĐ (Bến Đình khách quốc tế)",
    hours: "07:30 - 17:00 hàng ngày",
    address: "Ấp Phú Hiệp, Xã Phú Mỹ Hưng, Huyện Củ Chi, TP.HCM",
    mapsQuery: "Địa đạo Củ Chi Bến Dược",
  },
  {
    id: 6,
    num: "06",
    title:
      "Trải Nghiệm Du Thuyền & Saigon Waterbus Ngắm Hoàng Hôn Sông Sài Gòn",
    subTitle: "Thưởng ngoạn vẻ đẹp đô thị từ góc nhìn sông nước êm ả",
    category: "Ngắm cảnh & Trải nghiệm",
    categoryKey: "sightseeing",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Bach-Dang-Bus-Station-Vietnamnomad.jpg",
    desc: "Sông Sài Gòn uốn lượn ôm trọn lấy thành phố, tạo nên những khung cảnh lãng mạn vô giá. Tuyến buýt đường sông Saigon Waterbus từ bến Bạch Đằng đi Linh Đông là trải nghiệm 'du ngoạn sông nước giá bình dân' được yêu thích nhất. Với giá vé chỉ 15.000 VNĐ, bạn sẽ được đón từng cơn gió mát rượi, lướt qua cảng Ba Son, ngắm cầu Ba Son và Landmark 81 kiêu hãnh. Nếu muốn buổi tối sang trọng hơn, các du thuyền ăn tối tại bến Bạch Đằng sẽ chiêu đãi bạn tiệc ẩm thực cùng âm nhạc du dương.",
    tip: "Đặt vé Saigon Waterbus trước trên website/app cho chuyến xuất phát lúc 16:45 để vừa ngắm hoàng hôn đỏ ửng trên sông, vừa thấy thành phố lên đèn rực rỡ khi thuyền quay đầu về.",
    cost: "15.000 VNĐ / lượt (Waterbus) | 400.000 - 1.200.000 VNĐ (Dinner Cruise)",
    hours: "Chuyến đầu: 07:00 | Chuyến cuối: 19:30",
    address:
      "Ga tàu thủy Bạch Đằng, 10B Tôn Đức Thắng, Phường Bến Nghé, Quận 1",
    mapsQuery: "Bến tàu thủy Bạch Đằng Saigon Waterbus",
  },
  {
    id: 7,
    num: "07",
    title: "Chiêm Ngưỡng Bảo Tàng Chứng Tích Chiến Tranh",
    subTitle: "Điểm đến giáo dục hòa bình được đánh giá cao nhất châu Á",
    category: "Lịch sử & Di sản",
    categoryKey: "history",
    image:
      "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-War-Remnants-Museum-Vietnamnomad.jpg",
    desc: "Liên tục lọt top những bảo tàng được ghé thăm nhiều nhất Đông Nam Á trên TripAdvisor, Bảo tàng Chứng tích Chiến tranh lưu giữ hơn 20.000 tài liệu, hiện vật và thước phim tư liệu quý giá. Tại sân ngoài trời, bạn sẽ bắt gặp các loại máy bay tiêm kích UH-1, trực thăng Chinook, xe tăng M48. Điểm xúc động nhất là phòng trưng bày ảnh 'Hồi niệm' (Requiem) - tập hợp tác phẩm của các phóng viên chiến trường quốc tế đã ngã xuống, gửi gắm thông điệp sâu sắc về khát vọng hòa bình.",
    tip: "Dành khoảng 2 - 3 tiếng và chuẩn bị tâm lý vì một số hình ảnh có tính tác động thị giác mạnh mẽ. Nên bắt đầu tham quan từ tầng 3 rồi đi dần xuống.",
    cost: "40.000 VNĐ (~$1.6 USD)",
    hours: "07:30 - 17:30 (Mở cửa tất cả các ngày trong năm)",
    address: "28 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM",
    mapsQuery: "Bảo tàng Chứng tích Chiến tranh Hồ Chí Minh",
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
    mapsQuery: "Chùa Bà Thiên Hậu Quận 5",
  },
  {
    id: 10,
    num: "10",
    title:
      "Chiêm Ngưỡng Nhà Thờ Tân Định (Nhà Thờ Màu Hồng) & Nhà Hát Thành Phố",
    subTitle:
      "Kiến trúc Gothic diễm lệ và sân khấu nghệ thuật xiếc tre À Ố Show",
    category: "Nghệ thuật & Sân khấu",
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
  },
];

// ─── DỮ LIỆU CẨM NANG: 12 MÓN ĂN NHẤT ĐỊNH PHẢI THỬ Ở TP. HỒ CHÍ MINH ───
const HCMC_FOOD_ITEMS = [
  {
    id: 101,
    num: "01",
    title: "Cơm Tấm Sài Gòn (Sườn Bì Chả Trứng)",
    subTitle: "Linh hồn ẩm thực đường phố của người dân Nam Bộ",
    category: "Cơm & Món Chính",
    categoryKey: "rice",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg",
    desc: "Cơm tấm, món cơm nấu từ hạt gạo tấm vỡ, là nhịp đập của ẩm thực Sài Gòn — món ăn biểu tượng mà bạn nhất định không thể bỏ lỡ khi ghé thăm thành phố. Dù cho bữa sáng sớm, bữa trưa chắc dạ hay cơn đói lúc nửa đêm, đĩa cơm tấm luôn thỏa mãn vị giác trọn vẹn. Combo kinh điển bao gồm sườn heo cốt lết ướp sả mật ong nướng than hoa thơm lừng, bì heo dai giòn, chả trứng chưng bùi béo và một quả trứng ốp-la lòng đào. Tất cả phủ đều mỡ hành óng ả, tóp mỡ giòn rụm, đồ chua và chan thìa nước mắm chua ngọt keo đặc sóng sánh.",
    tip: "Gọi thêm một chén canh khổ qua dồn thịt thanh mát hoặc canh cải chua để trung hòa độ ngậy và thăng hoa vị giác.",
    places: [
      {
        name: "Cơm Tấm Mộc",
        address: "85 Lý Tự Trọng, Bến Thành, Quận 1",
        price: "95.000 VNĐ (~$3.65 USD)",
      },
      {
        name: "Cơm Tấm Chị Hằng",
        address: "28 Đỗ Quang Đẩu, Phạm Ngũ Lão, Quận 1",
        price: "82.000 VNĐ",
      },
      {
        name: "Cơm Tấm Ba Ghiền",
        address: "84 Đặng Văn Ngữ, Phú Nhuận",
        price: "85.000 - 110.000 VNĐ",
      },
    ],
    cost: "45.000 - 95.000 VNĐ (~$1.8 - $3.8 USD)",
    hours: "06:30 - 23:00 (Nhiều quán bán 24/7)",
    address: "85 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Cơm Tấm Mộc 85 Lý Tự Trọng",
  },
  {
    id: 102,
    num: "02",
    title: "Bánh Mì Sài Gòn Giòn Rụm Đủ Vị",
    subTitle: "Tuyệt phẩm kẹp giòn danh tiếng toàn cầu",
    category: "Bánh Mì & Ăn Nhanh",
    categoryKey: "bread",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Mi.jpg",
    desc: "Bánh mì Sài Gòn không đơn thuần là một chiếc sandwich, mà là một sự bùng nổ hương vị gói trọn trong ổ bánh giòn tan. Xuất phát từ thời thuộc địa Pháp, bánh mì đã được người Việt biến hóa thành nét văn hóa đường phố độc nhất vô nhị. Ổ bánh giòn rụm bên ngoài, xốp mềm bên trong, quét đều pate gan béo ngậy, bơ vàng thơm nức, kẹp đầy chả lụa, jambon, xá xíu, xíu mại hoặc thịt heo nướng, ăn cùng dưa leo, ngò rí, đồ chua giòn ngọt và vài lát ớt hiểm cay nồng chan nước sốt bí truyền.",
    tip: "Bánh mì Huỳnh Hoa rất dày nhân và đầy đặn, một ổ có thể đủ cho hai người ăn vừa bụng. Hãy chuẩn bị xếp hàng nhẹ vào giờ tan tầm.",
    places: [
      {
        name: "Bánh Mì Huỳnh Hoa",
        address: "26 Lê Thị Riêng, Bến Thành, Quận 1",
        price: "68.000 VNĐ",
      },
      {
        name: "Bánh Mì Phố Cổ 159",
        address: "31/1 Tôn Thất Tùng, Phạm Ngũ Lão, Quận 1",
        price: "49.000 VNĐ",
      },
      {
        name: "Bánh Mì Bảy Hổ",
        address: "19 Huỳnh Khương Ninh, Đa Kao, Quận 1",
        price: "25.000 - 35.000 VNĐ",
      },
    ],
    cost: "25.000 - 68.000 VNĐ (~$1 - $2.7 USD)",
    hours: "06:00 - 22:30",
    address: "26 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Bánh Mì Huỳnh Hoa Lê Thị Riêng",
  },
  {
    id: 103,
    num: "03",
    title: "Bánh Xèo Giòn Rụm & Rau Rừng Miền Tây",
    subTitle: "Vũ điệu xèo xèo vàng ươm trên chảo gang rực lửa",
    category: "Món Chiên & Cuốn",
    categoryKey: "rolls",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Xeo.jpg",
    desc: "Ngắm người đầu bếp chiên bánh xèo trên những chiếc chảo gang lớn là một trải nghiệm thị giác lẫn thính giác kỳ thú. Bột gạo pha nghệ vàng óng và nước cốt dừa béo thơm đổ xèo xèo vào chảo nóng, láng mỏng tang. Phần nhân gồm tôm đất tươi ngọt, thịt ba rọi béo mềm và giá đỗ được cuộn khéo léo bên trong lớp vỏ mỏng giòn rụm như bánh quế. Khi ăn, xé miếng bánh xèo nóng hổi, cuốn cùng cải bẹ xanh, xà lách và đủ loại rau rừng thơm lừng, chấm ngập trong nước mắm tỏi ớt chua ngọt.",
    tip: "Đừng ngại dùng tay để cuốn bánh xèo và rau sống — đó là cách ăn truyền thống mang lại sự tương tác và ngon miệng nhất!",
    places: [
      {
        name: "Nhà Hàng Hoàng Tâm",
        address: "TK22/1 Nguyễn Cảnh Chân, Cầu Kho, Quận 1",
        price: "179.000 VNĐ (Phần lớn)",
      },
      {
        name: "Bánh Xèo 46A",
        address: "46A Đinh Công Tráng, Tân Định, Quận 1",
        price: "90.000 - 150.000 VNĐ",
      },
      {
        name: "Bánh Xèo Ăn Là Ghiền",
        address: "74 Sương Nguyệt Ánh, Bến Thành, Quận 1",
        price: "75.000 - 140.000 VNĐ",
      },
    ],
    cost: "70.000 - 180.000 VNĐ (~$2.8 - $7.2 USD)",
    hours: "10:00 - 22:00",
    address: "TK22/1 Nguyễn Cảnh Chân, Phường Cầu Kho, Quận 1, TP.HCM",
    mapsQuery: "Bánh Xèo Hoàng Tâm Nguyễn Cảnh Chân",
  },
  {
    id: 104,
    num: "04",
    title: "Gỏi Cuốn & Bò Bía Thanh Mát",
    subTitle: "Món khai vị cuốn giấy gạo tươi chuẩn vị healthy",
    category: "Món Chiên & Cuốn",
    categoryKey: "rolls",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
    desc: "Khi bạn muốn thưởng thức một món ăn nhẹ nhàng, ít calo nhưng ngập tràn độ tươi mát thì gỏi cuốn và bò bía là chân ái. Gỏi cuốn gói ghém tôm đỏ au luộc ngọt thịt, thịt ba chỉ, bún tươi, hẹ xanh trong lớp bánh tráng dẻo dai, chấm cùng tương bơ đậu phộng đặc sánh thơm lừng hoặc mắm nêm đậm đà. Bò bía kiểu người Hoa lại giòn ngọt nhờ củ sắn xào chín, tép khô rang giòn, lạp xưởng chiên thái mỏng và rau thơm, cuộn gọn trong chiếc bánh tráng xinh xắn.",
    tip: "Thích hợp làm món ăn xế chiều từ 15:00 - 17:00 tại các hàng gánh vỉa hè hoặc các khu chợ truyền thống như chợ Bến Thành, chợ Tân Định.",
    places: [
      {
        name: "Gỏi Cuốn Hạnh",
        address: "420A Hai Bà Trưng, Tân Định, Quận 1",
        price: "15.000 VNĐ / cuốn",
      },
      {
        name: "Quầy Gỏi Cuốn Chợ Bến Thành",
        address: "Khu ẩm thực Chợ Bến Thành, Quận 1",
        price: "15.000 - 20.000 VNĐ / cuốn",
      },
      {
        name: "Bò Bía Công Viên Lê Văn Tám",
        address: "Cổng đường Hai Bà Trưng, Quận 3",
        price: "6.000 - 10.000 VNĐ / cuốn",
      },
    ],
    cost: "10.000 - 25.000 VNĐ / cuốn (~$0.4 - $1 USD)",
    hours: "11:00 - 20:00",
    address: "Chợ Bến Thành, Đường Lê Lợi, Phường Bến Thành, Quận 1",
    mapsQuery: "Gỏi Cuốn Chợ Bến Thành",
  },
  {
    id: 105,
    num: "05",
    title: "Bò Né Chảo Gang Sôi Xèo Xèo",
    subTitle: "Bít-tết đường phố Sài Gòn chấm bánh mì nóng giòn",
    category: "Món Thịt & Bít Tết",
    categoryKey: "meat",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bo-Ne.jpg",
    desc: "Bạn thèm steak và trứng phục vụ ngay trên chảo gang nóng rực? Bò né là câu trả lời xuất sắc nhất. Từng lát thịt bò mềm ướp sốt đậm đà, kết hợp cùng trứng ốp-la lòng đào, pate gan béo bùi, xúc xích, phô mai và viên xíu mại. Tên gọi 'bò né' xuất phát từ việc thực khách phải hơi ngả người né những giọt dầu sôi lách tách khi chảo gang hình chú bò được bưng ra bàn. Dùng ổ bánh mì nóng giòn xé từng miếng quẹt sạch phần sốt thơm nức, kèm đĩa salad xà lách dưa leo chua ngọt giải ngấy.",
    tip: "Xịt một chút nước tương Maggi và tương ớt cay nồng lên lòng đỏ trứng, trộn đều với pate để làm sốt chấm bánh mì siêu ngon.",
    places: [
      {
        name: "Bò Né Ba Ngon",
        address: "18 Đinh Tiên Hoàng, Đa Kao, Quận 1",
        price: "68.000 VNĐ",
      },
      {
        name: "Bò Né Bà Nui",
        address: "94 Nguyễn Thái Bình, Nguyễn Thái Bình, Quận 1",
        price: "68.000 VNĐ",
      },
      {
        name: "Bò Né Cô Long",
        address: "Đường Đoàn Văn Bơ, Quận 4",
        price: "55.000 - 70.000 VNĐ",
      },
    ],
    cost: "45.000 - 75.000 VNĐ (~$1.8 - $3 USD)",
    hours: "07:00 - 13:00 & 16:30 - 22:00",
    address: "18 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM",
    mapsQuery: "Bò Né Ba Ngon Đinh Tiên Hoàng",
  },
  {
    id: 106,
    num: "06",
    title: "Hủ Tiếu Sài Gòn (Nam Vang, Sa Đéc, Mỹ Tho)",
    subTitle: "Di sản món nước đa văn hóa với sợi hủ tiếu dai mướt",
    category: "Món Sợi & Nước",
    categoryKey: "noodles",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Hu-Tieu.jpg",
    desc: "Nếu muốn thấu hiểu chiều sâu của văn hóa mì nước phương Nam, hãy bắt đầu bằng một tô hủ tiếu. Sợi hủ tiếu trong suốt, dai sần sật chan trong làn nước lèo ngọt thanh ninh từ xương ống heo, mực nướng và củ cải. Bạn có thể chọn ăn hủ tiếu nước truyền thống hoặc hủ tiếu khô trộn nước sốt tương đen đậm đà kèm chén súp riêng. Topping phong phú gồm tôm tươi bóc vỏ, thịt nạc, thịt băm, gan heo béo bùi, trứng cút và tỏi phi vàng rộm thơm lừng.",
    tip: "Hãy gọi phiên bản 'hủ tiếu khô' — sợi hủ tiếu ngấm đẫm sốt trộn xì dầu và tỏi phi giòn tan, kèm theo một chén nước dùng xí quách ninh nhừ.",
    places: [
      {
        name: "Hủ Tiếu Mỹ Tho Thanh Xuân",
        address: "62 Tôn Thất Thiệp, Bến Nghé, Quận 1",
        price: "75.000 VNĐ",
      },
      {
        name: "Hủ Tiếu Nam Vang Nhân Quán",
        address: "122 Nguyễn Trãi, Phường 3, Quận 5",
        price: "85.000 VNĐ",
      },
      {
        name: "Hủ Tiếu Cả Cần",
        address: "110 Hùng Vương, Phường 9, Quận 5",
        price: "80.000 - 110.000 VNĐ",
      },
    ],
    cost: "50.000 - 95.000 VNĐ (~$2 - $3.8 USD)",
    hours: "06:00 - 23:00",
    address: "62 Tôn Thất Thiệp, Phường Bến Nghé, Quận 1, TP.HCM",
    mapsQuery: "Hủ Tiếu Mỹ Tho Thanh Xuân Tôn Thất Thiệp",
  },
  {
    id: 107,
    num: "07",
    title: "Bún Riêu Cua Đồng & Đậu Hũ Chiên Sốt Cà Chua",
    subTitle: "Bát bún màu sắc quyến rũ với vị chua thanh đượm đà",
    category: "Món Sợi & Nước",
    categoryKey: "noodles",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Rieu.jpg",
    desc: "Bún riêu Sài Gòn là bữa tiệc của màu sắc và vị giác: sắc đỏ rực rỡ của cà chua xào, miếng riêu cua đồng bông xốp thơm lừng nổi bồng bềnh, đậu hũ chiên vàng ươm mọng nước, huyết heo mềm mướt và chả lụa hoặc ốc bươu giòn sần sật. Nước dùng có vị chua thanh mát dịu từ me chín kết hợp với độ ngọt tự nhiên từ cua đồng giã nhuyễn. Dùng kèm dĩa rau muống chẻ xanh mướt, hoa chuối thái sợi, chanh tươi và thìa mắm tôm nguyên chất dậy mùi quyến rũ.",
    tip: "Mắm tôm là linh hồn không thể thiếu: hãy cho nửa thìa mắm tôm cùng vài lát ớt tươi vào tô bún để cảm nhận trọn vẹn hương vị nồng nàn đặc trưng.",
    places: [
      {
        name: "Bún Riêu Gánh Chợ Bến Thành",
        address: "163 Lê Thánh Tôn, Bến Thành, Quận 1",
        price: "65.000 VNĐ",
      },
      {
        name: "Bún Riêu Gốc Nguyễn Cảnh Chân",
        address: "TK18/5 Nguyễn Cảnh Chân, Cầu Kho, Quận 1",
        price: "75.000 VNĐ",
      },
      {
        name: "Bún Riêu Cua Ốc 66",
        address: "66 Nguyễn Thái Bình, Quận 1",
        price: "55.000 - 70.000 VNĐ",
      },
    ],
    cost: "45.000 - 75.000 VNĐ (~$1.8 - $3 USD)",
    hours: "07:00 - 21:00",
    address: "163 Lê Thánh Tôn, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Bún Riêu Gánh Chợ Bến Thành",
  },
  {
    id: 108,
    num: "08",
    title: "Bún Mắm Miền Tây Đậm Hương Sông Nước",
    subTitle: "Đặc sản phương Nam với nước lèo mắm cá linh, cá sặc trứ danh",
    category: "Món Sợi & Nước",
    categoryKey: "noodles",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Mam.jpg",
    desc: "Bún mắm là tuyệt tác ẩm thực phản ánh trù phú của đồng bằng sông Cửu Long. Nước lèo được nấu từ mắm cá linh hoặc cá sặc ủ kỹ, lọc lấy nước cốt trong veo rồi ninh cùng sả đập dập thơm lừng, ớt cay và cà tím ngọt mềm. Một tô bún mắm đầy đặn với tôm sú tươi ngọt, mực ống giòn sần sật, cá lóc phi-lê và những miếng heo quay giòn rụm đậm vị. Điểm độc đáo nhất là dĩa rau 'miệt vườn' ăn kèm phong phú nhất Việt Nam: rau đắng, bông súng, kèo nèo, bắp chuối và giá đỗ tươi.",
    tip: "Nếu là lần đầu ăn mắm, hãy nặn nhiều chanh tươi vào tô nước dùng để làm dịu mùi mắm và làm nổi bật vị ngọt thanh của hải sản.",
    places: [
      {
        name: "Bún Mắm Miền Tây",
        address: "124 Trần Khắc Chân, Tân Định, Quận 1",
        price: "50.000 VNĐ",
      },
      {
        name: "Dì Sáu Miền Tây",
        address: "25/22 Tôn Thất Tùng, Phạm Ngũ Lão, Quận 1",
        price: "59.000 VNĐ",
      },
      {
        name: "Bún Mắm 173",
        address: "173 Cô Giang, Phường Cô Giang, Quận 1",
        price: "60.000 - 80.000 VNĐ",
      },
    ],
    cost: "50.000 - 75.000 VNĐ (~$2 - $3 USD)",
    hours: "08:00 - 21:30",
    address: "124 Trần Khắc Chân, Phường Tân Định, Quận 1, TP.HCM",
    mapsQuery: "Bún Mắm Miền Tây 124 Trần Khắc Chân",
  },
  {
    id: 109,
    num: "09",
    title: "Bún Thịt Nướng Chả Giò Giòn Rụm",
    subTitle: "Món bún trộn khô thơm lừng mùi khói sả và mỡ hành béo ngậy",
    category: "Món Sợi & Nước",
    categoryKey: "noodles",
    image:
      "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Thit-Nuong.jpg",
    desc: "Món bún khô lý tưởng cho những trưa hè nhiệt đới Sài Gòn. Tô bún gồm những dải thịt heo thái mỏng ướp sả cây, mật ong, tiêu sọ được nướng xém cạnh trên than hoa hồng rực tỏa khói thơm ngào ngạt, đặt cạnh cuốn chả giò chiên giòn rụm rôm rốp. Nền bún trắng tươi điểm xuyết xà lách, rau thơm cắt nhỏ, đậu phộng rang giã dập, mỡ hành óng ả và đồ chua cà rốt củ cải. Khi rưới chén nước mắm chua ngọt pha tỏi ớt lên rồi trộn đều, bạn sẽ cảm nhận sự hòa quyện tuyệt vời của mọi giác quan.",
    tip: "Thêm một chút tương ớt rim và đồ chua để tăng độ giòn bùi cho từng đũa bún.",
    places: [
      {
        name: "Bún Thịt Nướng Chả Giò",
        address: "01 Nguyễn Trung Trực, Bến Thành, Quận 1",
        price: "70.000 VNĐ",
      },
      {
        name: "Quán Bún Thịt Nướng Mạc Đĩnh Chi",
        address: "88 Mạc Đĩnh Chi, Đa Kao, Quận 1",
        price: "48.000 VNĐ",
      },
      {
        name: "Bún Thịt Nướng Chị Tuyền",
        address: "175 Cô Giang, Quận 1",
        price: "65.000 - 85.000 VNĐ",
      },
    ],
    cost: "45.000 - 75.000 VNĐ (~$1.8 - $3 USD)",
    hours: "07:30 - 21:00",
    address: "01 Nguyễn Trung Trực, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Bún Thịt Nướng Chả Giò 01 Nguyễn Trung Trực",
  },
  {
    id: 110,
    num: "10",
    title: "Ốc & Hải Sản Đêm Vỉa Hè Sài Gòn",
    subTitle: "Nét văn hóa nhậu đêm sôi nổi bậc nhất của cư dân thành phố",
    category: "Ăn Vặt & Hải Sản",
    categoryKey: "seafood",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Shellfish.jpg",
    desc: "'Đi ăn ốc' ở Sài Gòn không chỉ là ăn uống, mà là cả một phong cách sống giao lưu bè bạn. Đủ loại ốc hương xào bơ tỏi thơm lừng chấm bánh mì, sò lông nướng mỡ hành rắc đậu phộng bùi béo, nghêu hấp sả ớt thái lát cay nồng ấm bụng, sò huyết xào me chua ngọt keo đặc hay càng ghẹ rang muối ớt. Các quán ốc vỉa hè lúc nào cũng rộn rã tiếng cụng ly bia hơi, tiếng cười đùa rôm rả và hương thơm nức mũi lan tỏa khắp các góc phố đêm.",
    tip: "Khu ốc đường Vĩnh Khánh (Quận 4) hoặc hẻm ốc Bàn Cờ (Quận 3) sau 18:30 tối là thiên đường ẩm thực đêm sống động nhất.",
    places: [
      {
        name: "Ốc Oanh",
        address: "534 Vĩnh Khánh, Phường 8, Quận 4",
        price: "80.000 - 150.000 VNĐ / dĩa",
      },
      {
        name: "Ốc Đào",
        address: "Hẻm 212B Nguyễn Trãi, Nguyễn Cư Trinh, Quận 1",
        price: "70.000 - 140.000 VNĐ / dĩa",
      },
      {
        name: "Ốc Như",
        address: "650/4/29 Điện Biên Phủ, Phường 11, Quận 10",
        price: "60.000 - 120.000 VNĐ / dĩa",
      },
    ],
    cost: "60.000 - 160.000 VNĐ / dĩa (~$2.5 - $6.5 USD)",
    hours: "15:00 - 01:00 sáng hôm sau",
    address: "534 Vĩnh Khánh, Phường 8, Quận 4, TP.HCM",
    mapsQuery: "Ốc Oanh Vĩnh Khánh Quận 4",
  },
  {
    id: 111,
    num: "11",
    title: "Xôi Mặn Thập Cẩm Lá Chuối",
    subTitle: "Món ăn ấm bụng no lâu của người đi làm và cú đêm",
    category: "Cơm & Món Chính",
    categoryKey: "rice",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Xoi-Man.jpg",
    desc: "Xôi mặn là món ăn cứu cánh tuyệt vời cho bất kỳ ai đang vội vã buổi sáng hoặc tìm món ấm bụng sau một đêm vui chơi. Hạt nếp dẻo thơm được đồ chín mềm, gói trong lá chuối xanh ngắt giữ nguyên hơi nóng nghi ngút. Bên trên phủ đầy lạp xưởng chiên xắt lát, chà bông heo (ruốc), pate gan mịn màng béo ngậy, thịt gà xé đậm đà, trứng cút chiên vàng, hành phi thơm nức và chan một chút nước sốt tương ngọt ngào. Tiện lợi, đậm đà và ngon lành đến miếng cuối cùng.",
    tip: "Thưởng thức khi xôi còn nóng hổi. Các quầy xôi vỉa hè lâu năm trước cổng chợ Bà Chiểu hoặc góc ngã tư thường có công thức nước sốt ngon nhất.",
    places: [
      {
        name: "Xôi Gà Bà Chiểu",
        address: "Chợ Bà Chiểu, Đường Bùi Hữu Nghĩa, Bình Thạnh",
        price: "30.000 - 45.000 VNĐ",
      },
      {
        name: "Xôi Bát Bửu Chợ Lớn",
        address: "Khu vực Chợ Lớn, Quận 5",
        price: "25.000 - 35.000 VNĐ",
      },
      {
        name: "Xôi Mặn Cô Lan",
        address: "Ngã tư Nguyễn Trãi - Lê Hồng Phong, Quận 5",
        price: "20.000 - 30.000 VNĐ",
      },
    ],
    cost: "15.000 - 45.000 VNĐ (~$0.6 - $1.8 USD)",
    hours: "06:00 - 10:00 & 17:00 - 23:30",
    address: "Chợ Bà Chiểu, Đường Bùi Hữu Nghĩa, Phường 1, Bình Thạnh, TP.HCM",
    mapsQuery: "Xôi Gà Bà Chiểu",
  },
  {
    id: 112,
    num: "12",
    title: "Cà Phê Sữa Đá Sài Gòn Đậm Đà",
    subTitle: "Thức uống đại diện cho linh hồn và nhịp đập thành phố",
    category: "Đồ Uống & Tráng Miệng",
    categoryKey: "drinks",
    image:
      "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Ca-Phe-Sua-Da.jpg",
    desc: "Chúng ta kết lại danh sách với thức uống đã định hình phong cách sống của người Sài Gòn: cà phê sữa đá. Từng giọt cà phê Robusta rang đậm nhỏ giọt tí tách từ phin nhôm xuống lớp sữa đặc ngọt ngào béo ngậy dưới đáy ly thủy tinh. Khi khuấy đều và rót ngập đá bi mát lạnh, vị đắng đậm đà hòa quyện với vị béo ngọt và cảm giác sảng khoái đánh thức tức thì mọi giác quan. Người Sài Gòn nhâm nhi ly cà phê sữa đá ở mọi lúc, mọi nơi — từ chiếc ghế nhựa vỉa hè ngắm phố phường đến quán sân vườn lãng mạn.",
    tip: "Dùng ống hút khuấy thật đều tay cho sữa đặc tan hết và đá bi tan nhẹ một chút để đạt được vị cân bằng thanh mát hoàn hảo.",
    places: [
      {
        name: "Cà Phê Vợt Cheo Leo (Từ năm 1938)",
        address: "109/36 Nguyễn Thiện Thuật, Quận 3",
        price: "20.000 VNĐ",
      },
      {
        name: "Cà Phê Bệt Công Viên 30/4",
        address: "Đường Alexandre de Rhodes, Bến Nghé, Quận 1",
        price: "15.000 - 25.000 VNĐ",
      },
      {
        name: "Cà Phê Vợt Ba Lù Chợ Lớn",
        address: "Chợ Phùng Hưng, Quận 5",
        price: "18.000 - 22.000 VNĐ",
      },
    ],
    cost: "15.000 - 35.000 VNĐ (~$0.6 - $1.4 USD)",
    hours: "06:00 - 22:30 (Cà phê bệt mở cả ngày)",
    address: "109/36 Nguyễn Thiện Thuật, Phường 2, Quận 3, TP.HCM",
    mapsQuery: "Cà phê Cheo Leo Nguyễn Thiện Thuật",
  },
];

// Danh mục lọc cho Tab 10 Điều Nên Làm
const THINGS_CATEGORIES = [
  { key: "all", label: "Tất cả 10 điều", icon: Compass },
  { key: "history", label: "Lịch sử & Di sản", icon: Landmark },
  { key: "sightseeing", label: "Ngắm cảnh & View đỉnh", icon: Camera },
  { key: "food", label: "Ẩm thực bản địa", icon: Utensils },
  { key: "culture", label: "Văn hóa & Đời sống", icon: Coffee },
  { key: "nightlife", label: "Cuộc sống về đêm", icon: Music },
  { key: "arts", label: "Nghệ thuật sân khấu", icon: Sparkles },
];

// Danh mục lọc cho Tab 12 Món Ăn Phải Thử
const FOODS_CATEGORIES = [
  { key: "all", label: "Tất cả 12 món ngon", icon: Flame },
  { key: "rice", label: "Cơm & Xôi", icon: Utensils },
  { key: "bread", label: "Bánh Mì kẹp giòn", icon: Award },
  { key: "noodles", label: "Bún & Hủ Tiếu nước", icon: Sparkles },
  { key: "rolls", label: "Bánh Xèo & Gỏi Cuốn", icon: Compass },
  { key: "meat", label: "Bò Né chảo gang", icon: Landmark },
  { key: "seafood", label: "Ốc & Nhậu đêm", icon: Music },
  { key: "drinks", label: "Cà Phê Sữa Đá", icon: Coffee },
];

function GuideDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Xác định tab mặc định dựa trên slug hoặc query param (?tab=foods)
  const initialTab =
    params?.slug === "12-must-try-foods-in-ho-chi-minh-city" ||
    searchParams?.get("tab") === "foods"
      ? "foods"
      : "things";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (params?.slug?.includes("15-best-places")) {
      window.location.href =
        "/guide/15-best-places-to-visit-in-vietnam-in-2026";
      return;
    }
    if (
      params?.slug === "12-must-try-foods-in-ho-chi-minh-city" ||
      searchParams?.get("tab") === "foods"
    ) {
      window.location.href =
        "/guide/12-must-try-foods-in-ho-chi-minh-city";
      return;
    }
    if (params?.slug === "10-best-things-to-do-in-ho-chi-minh-city") {
      window.location.href =
        "/guide/10-best-things-to-do-in-ho-chi-minh-city";
      return;
    }
  }, [params?.slug, searchParams]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  // Khi chuyển đổi tab, reset bộ lọc danh mục về 'all'
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setActiveCategory("all");
  };

  // Theo dõi thanh tiến trình đọc theo cuộn trang
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

  // Đọc danh sách đã bookmark từ localStorage
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

  const [dbArticle, setDbArticle] = useState(null);
  const [dbLoading, setDbLoading] = useState(false);

  useEffect(() => {
    const slug = params?.slug;
    if (!slug) return;
    if (
      slug === "10-best-things-to-do-in-ho-chi-minh-city" ||
      slug === "12-must-try-foods-in-ho-chi-minh-city" ||
      slug.includes("15-best-places")
    ) {
      return;
    }
    setDbLoading(true);
    articleAPI
      .getBySlug(slug)
      .then((res) => {
        if (res?.article) {
          setDbArticle(res.article);
        }
      })
      .catch((err) => console.warn("Fetch article error:", err))
      .finally(() => setDbLoading(false));
  }, [params?.slug]);

  if (dbLoading) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DinoLoader
          fullScreen={false}
          size={220}
          text="Đang tải cẩm nang du lịch..."
          subtext="Khám phá hành trình tuyệt vời cùng VinaTap"
        />
      </div>
    );
  }

  if (dbArticle) {
    return (
      <div className="guide-page-wrapper">
        <div className="guide-progress-bar" style={{ width: `${scrollProgress}%` }} />
        <nav className="guide-nav" aria-label="Điều hướng cẩm nang">
          <div className="guide-nav__inner">
            <div className="guide-nav__left">
              <Logo size={28} />
              <div className="guide-breadcrumb">
                <Link href="/">Trang chủ</Link>
                <ChevronRight size={13} />
                <Link href="/#be-inspired">Cẩm nang</Link>
                <ChevronRight size={13} />
                <span className="guide-breadcrumb__curr">{dbArticle.title_vi || dbArticle.title_en}</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="guide-container">
          <header className="guide-header">
            <div className="guide-badge-pill">
              <Compass size={14} />
              <span>CẨM NANG DU LỊCH • VINATAP EDITORIAL</span>
            </div>
            <h1 className="guide-title">{dbArticle.title_vi || dbArticle.title_en}</h1>
            {(dbArticle.intro_vi || dbArticle.intro_en) && (
              <p className="guide-subtitle">{dbArticle.intro_vi || dbArticle.intro_en}</p>
            )}
            <div className="guide-meta-bar">
              <div className="guide-author-box">
                <div className="guide-author-avatar">VT</div>
                <div>
                  <div className="guide-author-name">
                    <span>{dbArticle.author_name || "Ban Biên Tập VinaTap"}</span>
                    <Sparkles size={14} className="guide-verified-badge" />
                  </div>
                  <div className="guide-author-role">Chuyên trang Cẩm Nang Du Lịch Bản Địa Việt Nam</div>
                </div>
              </div>
              <div className="guide-meta-stats">
                <span className="guide-meta-item">
                  <Calendar size={14} />
                  <span>{dbArticle.published_date || "2026"}</span>
                </span>
                <span className="guide-meta-item">
                  <Clock size={14} />
                  <span>{Math.max(5, (dbArticle.items?.length || 1) * 2)} phút đọc</span>
                </span>
                <span className="guide-meta-item">
                  <Eye size={14} />
                  <span>{(dbArticle.views_count || 1280).toLocaleString("vi-VN")} lượt xem</span>
                </span>
              </div>
            </div>
          </header>

          {dbArticle.hero_image && (
            <section className="guide-hero-banner" style={{ marginBottom: "2rem" }}>
              <div className="guide-hero-img-wrap">
                <img src={dbArticle.hero_image} alt={dbArticle.title_vi} className="guide-hero-img" />
              </div>
            </section>
          )}

          <section className="guide-cards-list">
            {(dbArticle.items || []).map((item, idx) => (
              <article key={item.id || idx} id={`item-${idx + 1}`} className="guide-card">
                <div className="guide-card__grid">
                  {item.image_url && (
                    <div className="guide-card__media">
                      <img
                        src={item.image_url}
                        alt={item.title_vi || item.title_en}
                        className="guide-card__img"
                        loading="lazy"
                      />
                      <div className="guide-card__number-badge">#{item.item_number || idx + 1}</div>
                    </div>
                  )}
                  <div className="guide-card__body">
                    <h2 className="guide-card__title">
                      {item.item_number || idx + 1}. {item.title_vi || item.title_en}
                    </h2>
                    {Array.isArray(item.paragraphs_vi || item.content_vi) ? (
                      (item.paragraphs_vi || item.content_vi).map((p, pIdx) => (
                        <p key={pIdx} className="guide-card__desc">{p}</p>
                      ))
                    ) : (
                      <p className="guide-card__desc">{item.paragraphs_vi || item.content_vi || ""}</p>
                    )}
                    {(item.tip_vi || item.tip_en) && (
                      <div className="guide-tip-box">
                        <Info size={17} className="guide-tip-icon" />
                        <div className="guide-tip-text">
                          <strong>Mẹo VinaTap:</strong> {item.tip_vi || item.tip_en}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    );
  }

  // Lấy dữ liệu và danh mục tương ứng theo tab đang chọn
  const isFoodsTab = activeTab === "foods";
  const currentItems = isFoodsTab ? HCMC_FOOD_ITEMS : HCMC_GUIDE_ITEMS;
  const currentCategories = isFoodsTab ? FOODS_CATEGORIES : THINGS_CATEGORIES;

  const filteredItems =
    activeCategory === "all"
      ? currentItems
      : currentItems.filter((item) => item.categoryKey === activeCategory);


  return (
    <div className="guide-page-wrapper">
      {/* ─── THANH TIẾN TRÌNH ĐỌC ─────────────────────────────────── */}
      <div
        className="guide-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ─── EDITORIAL TOP NAVBAR ─────────────────────────────────── */}
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
                {isFoodsTab ? "12 món ăn phải thử" : "10 điều nên làm"}
              </span>
            </div>
          </div>

          <div className="guide-nav__right" />
        </div>
      </nav>

      {/* ─── CONTAINER BÀI VIẾT CHÍNH ──────────────────────────────── */}
      <main className="guide-container">
        {/* ─── TIÊU ĐỀ & METADATA BÁO CHÍ ──────────────────────────── */}
        <header className="guide-header">
          <div className="guide-badge-pill">
            <Compass size={14} />
            <span>CẨM NANG ĐẶC BIỆT • VINATAP SIGNATURE EDITORIAL</span>
          </div>

          <h1 className="guide-title">
            {isFoodsTab
              ? "12 Món Ăn Nhất Định Phải Thử Tại TP. Hồ Chí Minh"
              : "10 Điều Tuyệt Nhất Nên Làm & Trải Nghiệm Tại TP. Hồ Chí Minh"}
          </h1>

          <p className="guide-subtitle">
            {isFoodsTab
              ? "Từ đĩa cơm tấm sườn nướng mỡ hành giòn rụm, ổ bánh mì pate thơm nức đến tô bún mắm miền Tây đậm đà và ly cà phê sữa đá vỉa hè — trọn bộ bản đồ ẩm thực giúp bạn cảm nhận hương vị chân thật nhất của Sài Gòn."
              : "Từ di sản lịch sử hào hùng, những góc cà phê bệt hoài niệm đến các tòa cao ốc chọc trời và hẻm ẩm thực đêm rực rỡ — cẩm nang chọn lọc giúp bạn chạm vào trọn vẹn linh hồn của “Hòn ngọc Viễn Đông”."}
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
                <span>Cập nhật tháng 10/2026</span>
              </span>
              <span className="guide-meta-item">
                <Clock size={14} />
                <span>{isFoodsTab ? "10 phút đọc" : "8 phút đọc"}</span>
              </span>
              <span className="guide-meta-item">
                <Eye size={14} />
                <span>{isFoodsTab ? "142.800" : "128.450"} lượt xem</span>
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
                      title: isFoodsTab
                        ? "12 Món Ăn Nhất Định Phải Thử ở TP.HCM - VinaTap"
                        : "10 Điều Tuyệt Nhất Nên Làm ở TP.HCM - VinaTap",
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

        {/* ─── BỘ CHUYỂN ĐỔI 2 GIAO DIỆN / TAB SWITCHER ────────────── */}
        <div className="guide-tabs-container">
          <div className="guide-tabs-switcher">
            <button
              type="button"
              className={`guide-tab-btn ${activeTab === "things" ? "active" : ""}`}
              onClick={() => handleTabChange("things")}
            >
              <Landmark size={17} />
              <span>10 Điều Tuyệt Nhất Nên Làm</span>
              <span className="guide-tab-count">10</span>
            </button>
            <button
              type="button"
              className={`guide-tab-btn food ${activeTab === "foods" ? "active" : ""}`}
              onClick={() => handleTabChange("foods")}
            >
              <Utensils size={17} />
              <span>12 Món Ăn Nhất Định Phải Thử</span>
              <span className="guide-tab-count">12</span>
            </button>
          </div>
        </div>

        {/* ─── HERO BANNER ĐIỆN ẢNH THEO TAB ──────────────────────── */}
        <section className="guide-hero-banner">
          <div className="guide-hero-img-wrap">
            <img
              src={
                isFoodsTab
                  ? "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg"
                  : "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Reunification-Palace-Vietnamnomad.jpg"
              }
              alt={isFoodsTab ? "Ẩm thực Sài Gòn" : "Khám phá TP. Hồ Chí Minh"}
              className="guide-hero-img"
            />
            <div className="guide-hero-overlay">
              <div className="guide-hero-chips">
                <span className="guide-hero-chip">
                  {isFoodsTab ? "12 Món Ăn Tuyệt Kỹ" : "Top 10 Trải Nghiệm"}
                </span>
                <span className="guide-hero-chip">
                  Địa chỉ thật &amp; Giá chuẩn
                </span>
                <span className="guide-hero-chip">
                  Hỗ trợ dẫn đường Google Maps
                </span>
              </div>
              <p className="guide-hero-caption">
                {isFoodsTab
                  ? "Sài Gòn là thánh địa ẩm thực nơi tụ hội tinh hoa ẩm thực khắp ba miền và quốc tế, sẵn sàng đánh thức mọi giác quan của bạn từ bình minh đến tận đêm khuya."
                  : "TP. Hồ Chí Minh – Nơi giao thoa ngoạn mục giữa dòng chảy lịch sử trăm năm và nhịp đập đô thị hiện đại không bao giờ ngủ."}
              </p>
            </div>
          </div>
        </section>

        {/* ─── DẪN NHẬP (LEAD STORY) ──────────────────────────────── */}
        <section className="guide-lead-box">
          <p>
            {isFoodsTab ? (
              <>
                Không có cách nào hiểu một thành phố nhanh hơn là ngồi xuống
                chiếc ghế nhựa con con bên hè phố và thưởng thức những món ăn
                trứ danh. Ẩm thực TP. Hồ Chí Minh phóng khoáng như chính con
                người nơi đây: đậm đà, tươi mới, ngập tràn rau ghém và nước chấm
                phong phú. Dưới đây là{" "}
                <strong>12 món ăn biểu tượng nhất</strong> kèm địa chỉ những
                quán gia truyền lâu năm do VinaTap thẩm định kỹ lưỡng.
              </>
            ) : (
              <>
                <strong>Thành phố Hồ Chí Minh</strong> có một nguồn năng lượng
                sống mãnh liệt mà bạn khó tìm thấy ở bất cứ nơi nào khác. Đó là
                âm thanh rộn rã của tiếng xe cộ buổi sớm, là hương thơm nồng nàn
                từ những xe đẩy bánh mì góc phố, là sự kiêu hãnh của những tòa
                tháp kính bên cạnh những công trình thuộc địa cổ kính. Dù bạn
                chỉ có 24 giờ quá cảnh hay một tuần thảnh thơi,{" "}
                <strong>10 trải nghiệm đặc sắc</strong> dưới đây giúp bạn cảm
                nhận sâu sắc nhất từng nhịp thở của thành phố.
              </>
            )}
          </p>
        </section>

        {/* ─── THANH LỌC DANH MỤC (STICKY QUICK-NAV) ──────────────── */}
        <section className="guide-quicknav-sticky">
          <div className="guide-quicknav-inner">
            {currentCategories.map((cat) => {
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

        {/* ─── DANH SÁCH CÁC MỤC (ITEMS LIST) ─────────────────────── */}
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

                      {/* Box Quán Ăn Nổi Tiếng Đề Xuất (Nếu là tab Ẩm Thực) */}
                      {item.places && item.places.length > 0 && (
                        <div className="guide-places-list">
                          <div className="guide-places-title">
                            <Utensils size={14} />
                            <span>Địa chỉ quán ngon nức tiếng khuyên thử:</span>
                          </div>
                          {item.places.map((place, idx) => (
                            <div key={idx} className="guide-place-row">
                              <span className="guide-place-dot" />
                              <div style={{ flex: 1 }}>
                                <strong>{place.name}</strong> – {place.address}
                                {place.price && (
                                  <span
                                    style={{
                                      color: "#009aa2",
                                      fontWeight: 600,
                                      marginLeft: "6px",
                                    }}
                                  >
                                    ({place.price})
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

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

        {/* ─── LIÊN KẾT BÀI VIẾT LIÊN QUAN & TỔNG KẾT ──────────────── */}
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
            <Link href="/guide/pho-the-complete-guide" className="guide-related-card">
              <img
                src="/guide/hcmc/Top-Hanoi-foods-Pho-Vietnamnomad.jpg"
                alt="Phở Hà Nội"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Ẩm Thực Bản Địa</div>
                <div className="guide-related-title">
                  Phở Việt Nam: Cẩm Nang Toàn Diện Về Món Nước Quốc Hồn Quốc Túy
                </div>
              </div>
            </Link>

            <Link href="/province/da-nang" className="guide-related-card">
              <img
                src="https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80"
                alt="Du lịch Đà Nẵng"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Cẩm Nang Miền Trung</div>
                <div className="guide-related-title">
                  Khám Phá Đà Nẵng: Thành Phố Đáng Sống Nhất Việt Nam
                </div>
              </div>
            </Link>

            <Link href="/guide/8-must-try-foods-in-hanoi" className="guide-related-card">
              <img
                src="/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg"
                alt="Ẩm thực Hà Nội"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Khám Phá Miền Bắc</div>
                <div className="guide-related-title">
                  Top 8 Món Ăn Nhất Định Phải Thử Khi Đến Thủ Đô Hà Nội
                </div>
              </div>
            </Link>
          </div>
        </footer>
      </main>

      {/* ─── FULL EDITORIAL FOOTER ─── */}
      <PublicFooter lang="vi" />

      {/* ─── TOAST THÔNG BÁO TƯƠNG TÁC ─────────────────────────────── */}
      <div className={`guide-toast ${toastVisible ? "show" : ""}`}>
        <Check size={18} color="#00c2cb" />
        <span>{toastMessage}</span>
      </div>

      {/* ─── LIGHTBOX MODAL PHÓNG TO ẢNH ───────────────────────────── */}
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
        province={{ name: "Việt Nam", slug: "viet-nam" }}
      />
    </div>
  );
}

export default function GuideDetailPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "#00c2cb", fontWeight: 700 }}>
            Đang tải cẩm nang VinaTap...
          </div>
        </div>
      }
    >
      <GuideDetailContent />
    </Suspense>
  );
}
