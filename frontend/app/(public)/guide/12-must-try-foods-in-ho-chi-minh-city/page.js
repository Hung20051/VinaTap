"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
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
  Utensils,
  Coffee,
  X,
  CreditCard,
  ArrowRight,
  Info,
  Flame,
  Award,
} from "lucide-react";
import "@/styles/guide-editorial.css";
import "@/styles/home.css";

// ─── DỮ LIỆU: 12 MÓN ĂN NHẤT ĐỊNH PHẢI THỬ Ở TP. HỒ CHÍ MINH ───
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
    subTitle: "Di sản ẩm thực đường phố được vinh danh toàn cầu",
    category: "Bánh Mì & Ăn Nhanh",
    categoryKey: "bread",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Mi.jpg",
    desc: "Bánh mì Việt Nam đã vượt ra khỏi biên giới quốc gia để trở thành một trong những món sandwich ngon nhất hành tinh. Tại Sài Gòn, ổ bánh mì có lớp vỏ mỏng tang vàng ươm giòn rụm, ruột bông xốp nhẹ tênh. Bên trong được quết một lớp bơ trứng béo ngậy, pate gan heo đậm đà, xếp tầng giò lụa, chả bò, thịt xá xíu hoặc heo quay giòn bì. Sự cân bằng đạt đến đỉnh cao nhờ dưa leo giòn mát, ngò rí thơm dịu, đồ chua chua ngọt và vài lát ớt hiểm cay nồng chan chút nước sốt thịt rim sánh mịn.",
    tip: "Nếu bạn không quen ăn cay gắt, hãy nhớ dặn người bán 'Không ớt' hoặc 'Ớt ít' khi gọi món.",
    places: [
      {
        name: "Bánh Mì Huỳnh Hoa",
        address: "26 Lê Thị Riêng, Bến Thành, Quận 1",
        price: "68.000 VNĐ (~$2.6 USD)",
      },
      {
        name: "Bánh Mì Bảy Hổ (Từ 1930)",
        address: "19 Huỳnh Khương Ninh, Đa Kao, Quận 1",
        price: "25.000 - 35.000 VNĐ",
      },
      {
        name: "Bánh Mì Chảo Hòa Mã",
        address: "53 Cao Thắng, Phường 3, Quận 3",
        price: "60.000 - 75.000 VNĐ",
      },
    ],
    cost: "25.000 - 68.000 VNĐ (~$1.0 - $2.6 USD)",
    hours: "Mở cả ngày (Huỳnh Hoa mở từ 11:00 - 21:00)",
    address: "26 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Bánh Mì Huỳnh Hoa Lê Thị Riêng",
  },
  {
    id: 103,
    num: "03",
    title: "Phở Bò & Gà Phong Cách Sài Gòn",
    subTitle: "Nước dùng thanh ngọt thảo mộc ngập tràn rau thơm bản địa",
    category: "Món Sợi & Nước",
    categoryKey: "noodles",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Pho.jpg",
    desc: "Khác biệt với phở Bắc thanh tao chú trọng vị ngọt nguyên bản của xương hầm, phở Nam (phở Sài Gòn) mang nét hào sảng phóng khoáng với nước dùng ngọt đậm đà ninh từ xương bò và hoa hồi, quế, thảo quả. Điểm cuốn hút nhất là đĩa rau thơm tươi tốt đi kèm: ngò gai, húng quế, ngò om và giá đỗ chần. Thực khách tự do nêm nếm tô phở theo khẩu vị cá nhân với tương đen (hoisin), tương ớt cay nồng và vắt miếng chanh tươi mọng nước.",
    tip: "Thử gọi một chén 'tiết hột gà' (lòng đỏ trứng gà trần trong nước béo) để ăn kèm phở theo đúng phong cách sành ăn của dân địa phương.",
    places: [
      {
        name: "Phở Hòa Pasteur",
        address: "260C Pasteur, Phường 8, Quận 3",
        price: "95.000 - 115.000 VNĐ",
      },
      {
        name: "Phở Lệ (Nguyễn Trãi)",
        address: "415 Nguyễn Trãi, Phường 7, Quận 5",
        price: "90.000 - 110.000 VNĐ",
      },
      {
        name: "Phở Phú Vương",
        address: "339 Lê Văn Sỹ, Phường 1, Tân Bình",
        price: "80.000 - 100.000 VNĐ",
      },
    ],
    cost: "75.000 - 115.000 VNĐ (~$3 - $4.5 USD)",
    hours: "06:00 - 23:30 hàng ngày",
    address: "260C Pasteur, Phường 8, Quận 3, TP.HCM",
    mapsQuery: "Phở Hòa Pasteur Quận 3",
  },
  {
    id: 104,
    num: "04",
    title: "Bánh Xèo & Bánh Khọt Giòn Tan Miền Tây",
    subTitle: "Tuyệt đỉnh bánh chiên vàng ruộm cuốn đọt rau rừng xanh mướt",
    category: "Bánh Cuốn & Đồ Chiên",
    categoryKey: "rolls",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Xeo.jpg",
    desc: "Bánh xèo miền Nam gây ấn tượng mạnh bởi kích thước khổng lồ, vỏ bánh vàng óng giòn rụm từ bột gạo pha nước cốt dừa béo ngậy và bột nghệ thơm lừng. Khi đổ bột vào chảo gang nóng rẫy, tiếng 'xèo xèo' vang lên vui tai báo hiệu mẻ bánh giòn tan. Nhân bánh đầy ắp tôm sông ngọt thịt, thịt ba chỉ xắt mỏng, giá đỗ và đậu xanh bùi bùi. Ăn kèm là rổ rau rừng Tây Ninh với hơn 10 loại lá thảo dược, chấm ngập trong chén nước mắm tỏi ớt chua ngọt.",
    tip: "Dùng tay lấy một lá cải bẹ xanh to bản, đặt rau thơm và một miếng bánh xèo lên trên, cuộn tròn chặt tay rồi chấm ngập sốt để cảm nhận trọn vẹn độ giòn và béo.",
    places: [
      {
        name: "Bánh Xèo Ăn Là Ghiền",
        address: "74 Sương Nguyệt Ánh, Bến Thành, Quận 1",
        price: "95.000 - 145.000 VNĐ",
      },
      {
        name: "Bánh Khọt Cô Ba Vũng Tàu",
        address: "102 Cao Thắng, Phường 4, Quận 3",
        price: "85.000 - 120.000 VNĐ",
      },
      {
        name: "Bánh Xèo 46A Đinh Công Tráng",
        address: "46A Đinh Công Tráng, Tân Định, Quận 1",
        price: "110.000 - 180.000 VNĐ",
      },
    ],
    cost: "80.000 - 150.000 VNĐ (~$3.2 - $6 USD)",
    hours: "10:00 - 21:30",
    address: "74 Sương Nguyệt Ánh, Phường Bến Thành, Quận 1, TP.HCM",
    mapsQuery: "Bánh Xèo Ăn Là Ghiền Sương Nguyệt Ánh",
  },
  {
    id: 105,
    num: "05",
    title: "Bò Né Chảo Gang Sôi Xèo Xèo Bữa Sáng",
    subTitle: "Món bò bít tết đường phố kiểu Sài Gòn kèm bánh mì giòn",
    category: "Thịt & Món Nóng",
    categoryKey: "meat",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bo-Ne.jpg",
    desc: "Bò né là món ăn sáng độc đáo và tràn đầy năng lượng của người Sài Gòn. Từng lát thịt bò mềm được tẩm ướp đậm đà, đặt trên chiếc chảo gang hình chú bò được nung nóng rực lửa cùng bơ thực vật thơm lừng. Khi bưng ra bàn, chảo vẫn còn sôi xèo xèo reo vui cùng quả trứng ốp-la lòng đào, viên xíu mại béo ngậy, pate gan và xúc xích. Tên gọi 'né' xuất phát từ việc thực khách phải hơi né người ra để tránh những giọt dầu bơ bắn nhẹ khi chảo vừa hạ cánh xuống bàn.",
    tip: "Dùng bánh mì nóng giòn chấm thẳng vào lòng đỏ trứng ốp-la hòa quyện cùng nước sốt bơ thịt trên mặt chảo gang để tận hưởng hương vị bùng nổ.",
    places: [
      {
        name: "Bò Né Lệ Hồng",
        address: "489/27/29 Huỳnh Văn Bánh, Phường 13, Phú Nhuận",
        price: "75.000 - 95.000 VNĐ",
      },
      {
        name: "Bò Né Cô Long",
        address: "Đầu hẻm 46 Nguyễn Thái Học, Cầu Ông Lãnh, Quận 1",
        price: "50.000 - 70.000 VNĐ",
      },
      {
        name: "Bò Né Ba Ngon",
        address: "18 Đinh Tiên Hoàng, Đa Kao, Quận 1",
        price: "45.000 - 65.000 VNĐ",
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
        name: "Bún Mắm Cô Ba",
        address: "59 Châu Văn Liêm, Phường 14, Quận 5",
        price: "85.000 VNĐ",
      },
      {
        name: "Bún Mắm Bạc Liêu 444",
        address: "375 Huỳnh Tấn Phát, Tân Thuận Đông, Quận 7",
        price: "70.000 - 85.000 VNĐ",
      },
      {
        name: "Bún Mắm 173",
        address: "173 Trang Tử, Phường 14, Quận 5",
        price: "65.000 VNĐ",
      },
    ],
    cost: "60.000 - 90.000 VNĐ (~$2.4 - $3.6 USD)",
    hours: "08:00 - 21:00",
    address: "59 Châu Văn Liêm, Phường 14, Quận 5, TP.HCM",
    mapsQuery: "Bún Mắm Cô Ba Châu Văn Liêm",
  },
  {
    id: 109,
    num: "09",
    title: "Bánh Cuốn Nóng & Chả Lụa Bánh Tôm Sài Gòn",
    subTitle: "Lớp bánh mỏng mềm như lụa với nhân thịt mộc nhĩ thơm nức",
    category: "Bánh Cuốn & Đồ Chiên",
    categoryKey: "rolls",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Cuon.jpg",
    desc: "Mỗi đĩa bánh cuốn nóng là một màn biểu diễn nghệ thuật của người thợ tráng bánh: múc muôi bột gạo tráng thật mỏng trên lớp vải căng trên nồi nước sôi sùng sục, đậy nắp trong chớp mắt rồi dùng thanh tre mỏng khéo léo cuộn lấy lớp bánh mềm mướt bọc nhân thịt nạc băm, mộc nhĩ giòn sần sật. Bánh cuốn Sài Gòn được dọn kèm chả quế thơm lừng, nem chua, lát bánh tôm chiên giòn rụm, giá đỗ chần sơ và rắc ngập hành phi vàng giòn rụm. Chấm cùng chén nước mắm pha ấm ngọt dịu đưa vị.",
    tip: "Thêm một chút tinh dầu cà cuống vào chén nước mắm để dậy lên hương vị cổ truyền hoàng gia xưa.",
    places: [
      {
        name: "Bánh Cuốn Tây Hồ (Từ 1961)",
        address: "127 Đinh Tiên Hoàng, Đa Kao, Quận 1",
        price: "60.000 - 85.000 VNĐ",
      },
      {
        name: "Bánh Cuốn Hải Nam",
        address: "11A Cao Thắng, Phường 2, Quận 3",
        price: "50.000 - 75.000 VNĐ",
      },
      {
        name: "Bánh Cuốn Thiên Hương",
        address: "179 Ba Tháng Hai, Phường 11, Quận 10",
        price: "55.000 - 70.000 VNĐ",
      },
    ],
    cost: "45.000 - 85.000 VNĐ (~$1.8 - $3.4 USD)",
    hours: "06:00 - 22:00",
    address: "127 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM",
    mapsQuery: "Bánh Cuốn Tây Hồ Đinh Tiên Hoàng",
  },
  {
    id: 110,
    num: "10",
    title: "Ốc Sài Gòn & Văn Hóa Nhậu Đêm Vỉa Hè",
    subTitle: "Trải nghiệm ẩm thực đêm sôi động nhất của giới trẻ Sài Gòn",
    category: "Hải Sản & Nhậu Đêm",
    categoryKey: "seafood",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Oc.jpg",
    desc: "Không đi ăn ốc đêm thì coi như chưa biết đến linh hồn thực sự của Sài Gòn về đêm. Tại các con hẻm ốc nức tiếng như hẻm ốc Vĩnh Khánh (Quận 4) hay ốc Đào (Quận 1), hàng chục loại ốc và hải sản tươi sống được bày biện hấp dẫn: ốc hương, ốc móng tay, càng ghẹ, sò điệp, nghêu... Các đầu bếp đường phố biến hóa tài tình với vô vàn phong cách chế biến: sốt trứng muối béo ngậy, rang muối ớt cay nồng, xào me chua ngọt, nướng mỡ hành đậu phộng thơm nức mũi. Dùng kèm bánh mì chấm sốt và vài lon bia mát lạnh.",
    tip: "Món bắt buộc phải gọi: Ốc hương xào bắp bơ cay hoặc sốt trứng muối, gọi thêm bánh mì nóng để quệt sạch nước sốt ngon tuyệt đỉnh.",
    places: [
      {
        name: "Ốc Đào (Nguyễn Trãi)",
        address: "212B/C79 Nguyễn Trãi, Nguyễn Cư Trinh, Quận 1",
        price: "80.000 - 160.000 VNĐ/dĩa",
      },
      {
        name: "Ốc Oanh (Phố Ốc Vĩnh Khánh)",
        address: "534 Vĩnh Khánh, Phường 8, Quận 4",
        price: "90.000 - 180.000 VNĐ/dĩa",
      },
      {
        name: "Ốc Như",
        address: "650/4/29 Điện Biên Phủ, Phường 11, Quận 10",
        price: "60.000 - 130.000 VNĐ/dĩa",
      },
    ],
    cost: "150.000 - 300.000 VNĐ/người (~$6 - $12 USD)",
    hours: "15:00 - 01:00 sáng",
    address: "212B/C79 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM",
    mapsQuery: "Ốc Đào Nguyễn Trãi Quận 1",
  },
  {
    id: 111,
    num: "11",
    title: "Xôi Mặn Thập Cẩm & Xôi Gà Xé Nước Sốt Đậm Vị",
    subTitle: "Bữa ăn chắc dạ, thơm dẻo từ những chõ xôi bốc khói sớm mai",
    category: "Cơm & Món Chính",
    categoryKey: "rice",
    image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Xoi-Man.jpg",
    desc: "Xôi mặn Sài Gòn là món ăn đường phố dân dã nhưng tinh tế bậc nhất. Từng hạt nếp dẻo thơm hạt bóng bẩy được đồ kỹ trong chõ hơi nghi ngút, gói ghém trong chiếc lá chuối xanh mộc mạc. Một gói xôi đầy ắp topping hấp dẫn: lạp xưởng Mai Quế Lộ chiên bóng loáng, chà bông heo tơi xốp, gà xé xào nấm đùi gà, chả lụa xắt sợi, mỡ hành xanh rì và rắc thêm đậu phộng rang giòn rụm. Linh hồn kết nối tất cả là muỗng nước sốt gà rim tương mặn ngọt đậm đà chan ngập xôi.",
    tip: "Nếu ghé Chợ Bà Chiểu lúc xế chiều, hãy ghé quán Xôi Gà Bà Chiểu nức tiếng để thử món xôi gà chiên giòn rụm sốt cay độc nhất vô nhị.",
    places: [
      {
        name: "Xôi Gà Bà Chiểu",
        address: "Chợ Bà Chiểu, Bùi Hữu Nghĩa, Bình Thạnh",
        price: "35.000 - 55.000 VNĐ",
      },
      {
        name: "Xôi Bình Tiên",
        address: "88 Minh Phụng, Phường 5, Quận 6",
        price: "20.000 - 35.000 VNĐ",
      },
      {
        name: "Xôi Mặn Hào Huê",
        address: "166 Ba Tháng Hai, Phường 12, Quận 10",
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

// Danh mục lọc
const FOODS_CATEGORIES = [
  { key: "all", label: "Tất cả 12 món ngon", icon: Flame },
  { key: "rice", label: "Cơm & Xôi", icon: Utensils },
  { key: "bread", label: "Bánh Mì kẹp giòn", icon: Award },
  { key: "noodles", label: "Bún & Hủ Tiếu nước", icon: Sparkles },
  { key: "rolls", label: "Bánh Xèo & Gỏi Cuốn", icon: Compass },
  { key: "meat", label: "Bò Né chảo gang", icon: Award },
  { key: "seafood", label: "Ốc & Nhậu đêm", icon: Sparkles },
  { key: "drinks", label: "Cà Phê Sữa Đá", icon: Coffee },
];

export default function MustTryFoodsInHCMCPage() {
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
      ? HCMC_FOOD_ITEMS
      : HCMC_FOOD_ITEMS.filter((item) => item.categoryKey === activeCategory);

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
                12 món ăn đường phố phải thử
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
            <span>CẨM NANG ẨM THỰC • VINATAP SIGNATURE EDITORIAL</span>
          </div>

          <h1 className="guide-title">
            12 Món Ăn Đường Phố Phải Thử Ở Sài Gòn
          </h1>

          <p className="guide-subtitle">
            Từ đĩa cơm tấm sườn nướng mỡ hành giòn rụm, ổ bánh mì pate thơm nức đến tô bún mắm miền Tây đậm đà và ly cà phê sữa đá vỉa hè — trọn bộ bản đồ ẩm thực giúp bạn cảm nhận hương vị chân thật nhất của Sài Gòn.
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
                <span>12 Tháng 10, 2026</span>
              </span>
              <span className="guide-meta-item">
                <Clock size={14} />
                <span>10 phút đọc</span>
              </span>
              <span className="guide-meta-item">
                <Eye size={14} />
                <span>142.800 lượt xem</span>
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
                      title: "12 Món Ăn Đường Phố Phải Thử ở Sài Gòn - VinaTap",
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

        {/* ─── BANNER LIÊN KẾT NHANH SANG BÀI 10 TRẢI NGHIỆM ─── */}
        <div style={{
          background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
          border: "1px solid #99f6e4",
          borderRadius: "12px",
          padding: "14px 18px",
          margin: "18px 0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Compass size={20} color="#0d9488" />
            <span style={{ fontSize: "14px", color: "#0f766e", fontWeight: 600 }}>
              Bạn muốn khám phá các điểm tham quan biểu tượng ở TP. Hồ Chí Minh?
            </span>
          </div>
          <Link
            href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
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
              textDecoration: "none"
            }}
          >
            <span>10 Trải Nghiệm Tuyệt Nhất</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ─── HERO BANNER ─── */}
        <section className="guide-hero-banner">
          <div className="guide-hero-img-wrap">
            <img
              src="/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg"
              alt="12 món ăn đường phố Sài Gòn"
              className="guide-hero-img"
            />
            <div className="guide-hero-overlay">
              <div className="guide-hero-chips">
                <span className="guide-hero-chip">12 Món Ăn Tuyệt Kỹ</span>
                <span className="guide-hero-chip">Địa chỉ quán gia truyền</span>
                <span className="guide-hero-chip">Giá cả minh bạch</span>
              </div>
              <p className="guide-hero-caption">
                Sài Gòn là thánh địa ẩm thực nơi tụ hội tinh hoa khắp ba miền và quốc tế, sẵn sàng đánh thức mọi giác quan của bạn từ bình minh đến tận đêm khuya.
              </p>
            </div>
          </div>
        </section>

        {/* ─── DẪN NHẬP (LEAD STORY) ─── */}
        <section className="guide-lead-box">
          <p>
            Không có cách nào hiểu một thành phố nhanh hơn là ngồi xuống
            chiếc ghế nhựa con con bên hè phố và thưởng thức những món ăn
            trứ danh. Ẩm thực TP. Hồ Chí Minh phóng khoáng như chính con
            người nơi đây: đậm đà, tươi mới, ngập tràn rau ghém và nước chấm
            phong phú. Dưới đây là{" "}
            <strong>12 món ăn biểu tượng nhất</strong> kèm địa chỉ những
            quán gia truyền lâu năm do VinaTap thẩm định kỹ lưỡng.
          </p>
        </section>

        {/* ─── THANH LỌC DANH MỤC ─── */}
        <section className="guide-quicknav-sticky">
          <div className="guide-quicknav-inner">
            {FOODS_CATEGORIES.map((cat) => {
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

        {/* ─── DANH SÁCH 12 MÓN ĂN ─── */}
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

                      {/* Box Quán Ăn Nổi Tiếng Đề Xuất */}
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
            <Link href="/guide/10-best-things-to-do-in-ho-chi-minh-city" className="guide-related-card">
              <img
                src="/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Reunification-Palace-Vietnamnomad.jpg"
                alt="10 Điều Nên Làm ở TP.HCM"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Trải Nghiệm TP.HCM</div>
                <div className="guide-related-title">
                  10 Điều Tuyệt Nhất Nên Làm &amp; Trải Nghiệm Tại TP. Hồ Chí Minh
                </div>
              </div>
            </Link>

            <Link href="/guide/the-complete-guide-to-vietnam" className="guide-related-card">
              <img
                src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                alt="Cẩm nang du lịch Việt Nam"
                className="guide-related-img"
              />
              <div className="guide-related-content">
                <div className="guide-related-tag">Toàn Diện 34 Tỉnh</div>
                <div className="guide-related-title">
                  Cẩm Nang Toàn Diện Du Lịch Việt Nam 2026: Bản Đồ, Visa &amp; Chi Phí
                </div>
              </div>
            </Link>

            <Link href="/guide/15-best-places-to-visit-in-vietnam-in-2026" className="guide-related-card">
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

      {/* ─── FULL EDITORIAL FOOTER ─── */}
      <PublicFooter lang="vi" />

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
