"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Send,
  Camera,
  Waves,
  Mountain,
  Bookmark,
  Share2,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/guide-editorial.css";
import "@/styles/danang-10-attractions.css";

// ─── 10 BEST ATTRACTIONS IN DA NANG DATA ───
const DANANG_ATTRACTIONS = [
  {
    id: "my-khe-beach",
    num: 1,
    titleEn: "1. My Khe Beach",
    titleVi: "1. Bãi biển Mỹ Khê",
    img: "/guide/danang/danang-my-khe-beach-hd.jpg",
    captionEn: "My Khe Beach – Ranked among Forbes' Most Attractive Beaches on Earth",
    captionVi: "Bãi biển Mỹ Khê – Một trong những bãi biển quyến rũ nhất hành tinh do Forbes vinh danh",
    paragraphsEn: [
      "Recognized as one of the most attractive beaches on the planet by Forbes and voted one of the best coastal stretches in Vietnam by global travelers, My Khe Beach should definitely be your premier stop when visiting Da Nang.",
      "Located just 3 kilometers from the bustling city center, the beach stretches over 900 meters with powdery white sand and three designated safe swimming zones. My Khe is blessed with warm, clear blue waters and gentle rolling waves year-round, backed by scenic rows of coconut palms. It offers an incredible venue for sunbathing, morning jogging, surfing, jet-skiing, or simply savoring fresh seafood at seaside shacks.",
    ],
    paragraphsVi: [
      "Được tạp chí Forbes bình chọn là một trong những bãi biển quyến rũ nhất hành tinh và được cộng đồng du lịch quốc tế đánh giá cao bậc nhất Việt Nam, Bãi biển Mỹ Khê chắc chắn là điểm dừng chân đầu tiên không thể bỏ lỡ khi bạn đặt chân tới Đà Nẵng.",
      "Chỉ cách trung tâm thành phố khoảng 3km, bờ biển Mỹ Khê uốn lượn hình vòng cung dài hơn 900 mét với dải cát trắng mịn màng và 3 bãi tắm công cộng quy hoạch hiện đại. Nước biển tại đây trong vắt, ấm áp quanh năm và sóng biển êm dịu, được bao bọc bởi những rặng dừa xanh ngút ngàn. Đây là thiên đường để đắm mình tắm biển, chạy bộ đón bình minh, chèo SUP, lướt sóng hoặc thưởng thức hải sản tươi rói ngay tại các quán sát bờ biển.",
    ],
    tipEn: "Best swimming hours are 05:30–08:30 in the morning and 16:30–18:30 in the late afternoon. Free public shower booths and lifeguards are stationed along Vo Nguyen Giap coastal road.",
    tipVi: "Thời gian tắm biển đẹp nhất là từ 05:30 – 08:30 sáng và 16:30 – 18:30 chiều. Dọc đường Võ Nguyên Giáp có sẵn các khu tắm tráng nước ngọt công cộng và đội ngũ cứu hộ túc trực thường xuyên.",
  },
  {
    id: "ba-na-hills",
    num: 2,
    titleEn: "2. Sun World Ba Na Hills",
    titleVi: "2. Khu du lịch Sun World Bà Nà Hills",
    img: "/guide/danang/danang-ba-na-hills-hd.jpg",
    captionEn: "The iconic Golden Bridge supported by gigantic mossy hands at Ba Na Hills",
    captionVi: "Cầu Vàng (Golden Bridge) vươn giữa mây trời được nâng đỡ bởi đôi bàn tay khổng lồ",
    paragraphsEn: [
      "Perched atop Mount Chua at an altitude of 1,487 meters above sea level on the Truong Son Range, Ba Na Hills is widely celebrated as one of Vietnam's most spectacular hill resort and entertainment complexes.",
      "The resort enjoys a cool, spring-like climate where visitors can vividly feel four seasons within a single day. The world-famous Golden Bridge (Cau Vang) has mesmerized travelers across the globe with its 150-meter golden walkway delicately cradled by two colossal stone-carved hands emerging from the cliffside. Beyond the bridge, explore the romantic French Village with Gothic stone castles, Debay Wine Cellar built deep into the mountain in 1923, Linh Ung Pagoda, and Fantasy Park—one of Southeast Asia's premier indoor theme parks.",
    ],
    paragraphsVi: [
      "Tọa lạc trên đỉnh núi Chúa thuộc dãy Trường Sơn ở độ cao 1.487m so với mực nước biển, Sun World Bà Nà Hills được mệnh danh là 'chốn bồng lai tiên cảnh' và là quần thể nghỉ dưỡng – vui chơi giải trí hàng đầu Việt Nam.",
      "Nơi đây sở hữu khí hậu mát lành quanh năm với nét độc đáo trải nghiệm thời tiết 4 mùa luân chuyển chỉ trong một ngày. Tâm điểm thu hút truyền thông toàn cầu chính là Cầu Vàng (Golden Bridge) – cây cầu bộ hành dài 150m uốn lượn mềm mại được nâng đỡ bởi đôi bàn tay khổng lồ phủ rêu phong vươn ra từ vách đá. Bên cạnh Cầu Vàng, du khách còn được khám phá Làng Pháp cổ kính với các lâu đài Gothic, hầm rượu cổ Debay đào xuyên lòng núi từ năm 1923, Chùa Linh Ứng Bà Nà và công viên trò chơi trong nhà Fantasy Park đẳng cấp.",
    ],
    tipEn: "Take the cable car before 08:30 AM to beat peak tour groups at the Golden Bridge. Wear comfortable walking shoes and bring a light jacket as temperatures at the mountain summit can drop below 18°C.",
    tipVi: "Nên lên tuyến cáp treo trước 08:30 sáng để chụp ảnh Cầu Vàng lúc vắng người và bắt trọn khoảnh khắc mây vờn. Hãy mang giày thể thao êm chân và một chiếc áo khoác nhẹ vì nhiệt độ trên đỉnh núi có thể xuống dưới 18°C.",
  },
  {
    id: "son-tra-peninsula",
    num: 3,
    titleEn: "3. Son Tra Peninsula & Linh Ung Pagoda",
    titleVi: "3. Bán đảo Sơn Trà & Chùa Linh Ứng Bãi Bụt",
    img: "/guide/danang/danang-son-tra-peninsula-hd.jpg",
    captionEn: "Panoramic overlook of Da Nang bay from Son Tra Peninsula and Linh Ung Pagoda",
    captionVi: "Toàn cảnh vịnh Đà Nẵng xanh biếc nhìn từ Bán đảo Sơn Trà và Chùa Linh Ứng",
    paragraphsEn: [
      "Acting as a gigantic natural green shield protecting Da Nang from oceanic typhoons, Son Tra Peninsula is an exceptional tropical forest reserve jutting dramatically into the East Sea.",
      "The peninsula's spiritual crown jewel is Linh Ung Pagoda at Bai But, home to the tallest Lady Buddha (Guan Yin) statue in Vietnam standing at an imposing 67 meters (equivalent to a 30-story building). The statue gently gazes out over the bay, extending peace and safe voyages to local fishermen. Son Tra is also the pristine habitat of the endangered Red-shanked Douc Langur—widely dubbed the 'Queen of Primates' for its strikingly colorful five-colored coat. Don't miss Ban Co Peak (Chessboard Peak) with its celestial sage statue and the centuries-old Thousand-Year Banyan Tree.",
    ],
    paragraphsVi: [
      "Đóng vai trò như một 'bức bình phong' khổng lồ che chắn gió bão và là 'lá phổi xanh' điều hòa khí hậu cho thành phố, Bán đảo Sơn Trà là khu bảo tồn thiên nhiên nhiệt đới nguyên sinh độc đáo nhô mình ra biển Đông.",
      "Điểm nhấn tâm linh nổi bật nhất trên bán đảo là Chùa Linh Ứng Bãi Bụt, nơi ngự trị bức đại tượng Phật Bà Quan Thế Âm cao 67m (tương đương tòa nhà 30 tầng) tựa lưng vào núi và hướng mắt bao dung ra biển cả để che chở cho tàu thuyền ngư dân. Sơn Trà còn là vương quốc sinh sống của loài Voọc chà vá chân nâu quý hiếm – sinh vật được mệnh danh là 'nữ hoàng linh trưởng' với bộ lông 5 màu lộng lẫy. Du khách còn có thể chinh phục Đỉnh Bàn Cờ ngắm trọn vẹn toàn cảnh thành phố từ độ cao gần 700m và ghé thăm Cây Đa ngàn năm tuổi kỳ vĩ.",
    ],
    tipEn: "Manual motorbikes or hired private cars are recommended. Automatic scooters are strictly restricted on steep sections toward Ban Co Peak for passenger safety. Bring binoculars to spot langurs in tree canopies.",
    tipVi: "Khuyến khích sử dụng xe máy số hoặc ô tô có người lái; xe tay ga tự động bị hạn chế trên các cung đường dốc hướng lên Đỉnh Bàn Cờ vì lý do an toàn. Hãy mang theo ống nhòm để quan sát các đàn Voọc chuyền cành trên tán cây rừng.",
  },
  {
    id: "marble-mountains",
    num: 4,
    titleEn: "4. Marble Mountains (Ngu Hanh Son)",
    titleVi: "4. Danh thắng Ngũ Hành Sơn & Động Huyền Không",
    img: "/guide/danang/danang-marble-mountains-hd.jpg",
    captionEn: "Ethereal sunbeams illuminating mystical Huyen Khong Cave in Marble Mountains",
    captionVi: "Những luồng thiên sáng huyền ảo rọi xuống Động Huyền Không giữa lòng Ngũ Hành Sơn",
    paragraphsEn: [
      "Rising strikingly from the coastal plain just 8 kilometers south of downtown Da Nang, Marble Mountains (Ngu Hanh Son) is a cluster of six limestone and marble peaks named after the five cosmological elements: Kim (Metal), Moc (Wood), Thuy (Water), Hoa (Fire - two twin peaks), and Tho (Earth).",
      "Steeped in ancient Cham spiritual lore and Vietnamese royal history, the largest mountain, Thuy Son (Water Mountain), features an intricate network of sacred natural caves, grottoes, and historic Buddhist sanctuaries. The absolute highlight is Huyen Khong Cave, where daylight streams dramatically through cavern ceiling openings, illuminating serene altars and swirling incense smoke. After trekking down, explore Non Nuoc Stone Carving Village at the foot of the hills, renowned for over 300 years of artisan stone sculpture.",
    ],
    paragraphsVi: [
      "Nằm cách trung tâm thành phố khoảng 8km về phía Đông Nam, quần thể danh thắng Ngũ Hành Sơn là kiệt tác non bộ thiên nhiên gồm 6 ngọn núi đá vôi sừng sững bên bờ biển, đặt tên theo thuyết Ngũ hành: Kim Sơn, Mộc Sơn, Thủy Sơn, Hỏa Sơn (gồm Dương Hỏa và Âm Hỏa) và Thổ Sơn.",
      "Mang trong mình chiều sâu tâm linh giao thoa giữa văn hóa Chăm cổ và Phật giáo Đại thừa, ngọn Thủy Sơn lớn nhất ẩn chứa hệ thống hang động thạch nhũ huyền bí và các cổ tự ngàn năm như Chùa Tam Thai, Chùa Linh Ứng Ngũ Hành Sơn. Tuyệt mỹ nhất là Động Huyền Không – nơi vòm hang lộ thiên đón những luồng ánh sáng mặt trời chiếu rọi thẳng xuống tượng Phật Thích Ca trang nghiêm. Dưới chân núi là Làng đá mỹ nghệ Non Nước với lịch sử hơn 300 năm chế tác đá tinh xảo.",
    ],
    tipEn: "Wear sturdy shoes with good grip as cave staircases can be slippery. A modern glass elevator is available for 15,000 VND to reach Linh Ung Pagoda quickly if you want to skip the initial steep climb.",
    tipVi: "Nên mang giày thể thao có độ bám tốt vì các bậc thang đá trong hang động khá trơn. Du khách có thể sử dụng hệ thống thang máy kính ngoài trời (vé 15.000 VNĐ/lượt) để lên thẳng lưng chừng núi Thủy Sơn.",
  },
  {
    id: "asia-park",
    num: 5,
    titleEn: "5. Asia Park – Sun World Danang Wonders",
    titleVi: "5. Công viên Châu Á – Sun World Danang Wonders",
    img: "/guide/danang/danang-asia-park-hd.jpg",
    captionEn: "The Sun Wheel – Top 10 highest Ferris wheels globally lighting up Da Nang at dusk",
    captionVi: "Vòng quay Mặt Trời (Sun Wheel) rực sáng soi bóng xuống sông Hàn khi màn đêm buông xuống",
    paragraphsEn: [
      "If you're seeking evening thrills and vibrant entertainment right in the heart of Da Nang, Asia Park (Sun World Danang Wonders) on the western bank of the Han River delivers an exhilarating experience for all ages.",
      "The theme park creatively showcases the cultural heritages, iconic architectural wonders, and cuisine of 10 Asian nations—including Japan, South Korea, India, Singapore, Thailand, China, and Vietnam. The undisputed centerpiece is the colossal Sun Wheel, standing 115 meters tall (ranking among the top 10 highest Ferris wheels on Earth), treating riders to sweeping 360-degree panoramic vistas of the illuminated Han River bridges. Thrill-seekers can brave the Queen Cobra—Vietnam's largest suspended roller coaster—alongside carnival rides, dragon boat cruises, and vibrant food bazaars.",
    ],
    paragraphsVi: [
      "Nếu bạn muốn tìm kiếm những trải nghiệm vui chơi giải trí sôi động ngay trong lòng thành phố về đêm, Công viên Châu Á (Sun World Danang Wonders) tọa lạc bên bờ Tây sông Hàn chính là điểm hẹn hoàn hảo cho gia đình và giới trẻ.",
      "Công viên tái hiện sinh động không gian văn hóa, kiến trúc biểu tượng và lễ hội đặc sắc của 10 quốc gia châu Á (Nhật Bản, Hàn Quốc, Ấn Độ, Singapore, Thái Lan, Trung Quốc, Việt Nam...). Biểu tượng tự hào tại đây là Vòng quay Mặt Trời (Sun Wheel) cao tới 115m (top 10 vòng quay lớn nhất hành tinh), mang đến cho bạn tầm nhìn 360 độ ngoạn mục ngắm trọn vẹn thành phố lung linh ánh đèn. Những tín đồ cảm giác mạnh không thể bỏ qua tàu lượn Queen Cobra dài nhất Việt Nam cùng hàng loạt trò chơi giải trí đa dạng.",
    ],
    tipEn: "Open daily from 15:00 to 22:00. Arrive around 17:30 to catch the sunset from the Sun Wheel and admire the illuminated pagoda gates as evening falls.",
    tipVi: "Công viên mở cửa từ 15:00 đến 22:00 hàng ngày. Thời điểm lý tưởng nhất để vào cổng là khoảng 17:30 để kịp ngắm hoàng hôn rực rỡ từ trên vòng quay Sun Wheel và thưởng ngoạn không gian đèn lồng đêm.",
  },
  {
    id: "dragon-bridge",
    num: 6,
    titleEn: "6. Dragon Bridge (Cau Rong)",
    titleVi: "6. Cầu Rồng Đà Nẵng – Biểu tượng phun lửa & nước",
    img: "/guide/danang/danang-dragon-bridge-hd.jpg",
    captionEn: "Dragon Bridge breathing fire over the shimmering Han River on weekend evenings",
    captionVi: "Màn trình diễn phun lửa ngoạn mục của Cầu Rồng thu hút đông đảo du khách mỗi dịp cuối tuần",
    paragraphsEn: [
      "Spanning the scenic Han River, the Dragon Bridge (Cau Rong) has cemented its status as modern Da Nang's proudest architectural symbol and an engineering marvel.",
      "Measuring 666 meters in length, the bridge is modeled after the golden flying dragon of the Ly Dynasty, crafted from nearly 9,000 tons of structural steel and illuminated by more than 15,000 color-changing LED bulbs. What captivates thousands of spectators every weekend is the fiery show: at exactly 21:00 on Saturdays, Sundays, and major national holidays, the dragon's head breathes impressive bursts of fire followed by gentle sprays of cooling water into the night air.",
    ],
    paragraphsVi: [
      "Bắc qua dòng sông Hàn thơ mộng, Cầu Rồng đã trở thành niềm kiêu hãnh và là biểu tượng thịnh vượng đầy sức sống của một đô thị hiện đại và năng động bậc nhất Việt Nam.",
      "Với chiều dài 666m và trọng lượng thép gần 9.000 tấn, cây cầu mô phỏng hình dáng con rồng thời Lý dũng mãnh vươn mình ra biển lớn. Cầu được trang bị hệ thống hơn 15.000 bóng đèn LED đổi màu lung linh trên sông Hàn. Điểm hấp dẫn đặc biệt thu hút hàng nghìn người dân và du khách là màn trình diễn phun lửa 2 đợt (mỗi đợt 9 lần) và phun nước 3 đợt vô cùng kỳ thú vào đúng 21:00 mỗi tối Thứ Bảy, Chủ Nhật và các ngày đại lễ.",
    ],
    tipEn: "The fire-and-water show begins precisely at 21:00 and lasts 15 minutes. Stand near Tran Hung Dao street or on the adjacent pedestrian Nguyen Van Troi Bridge to get the best unobstructed views without getting soaked by water sprays.",
    tipVi: "Màn trình diễn bắt đầu chính xác lúc 21:00 và kéo dài khoảng 15 phút. Bạn nên chọn vị trí đứng dọc đường Trần Hưng Đạo hoặc đi bộ lên Cầu Nguyễn Văn Trỗi kề bên để vừa có góc nhìn toàn cảnh đẹp vừa không bị nước tạt vào người.",
  },
  {
    id: "con-market",
    num: 7,
    titleEn: "7. Con Market (Cho Con)",
    titleVi: "7. Chợ Cồn – Thiên đường ẩm thực & đặc sản Đà Nẵng",
    img: "/guide/danang/danang-con-market-hd.jpg",
    captionEn: "Bustling food stalls with colorful local dishes inside Da Nang's iconic Con Market",
    captionVi: "Khu ẩm thực nhộn nhịp ngập tràn hương vị đậm đà bản địa bên trong Chợ Cồn",
    paragraphsEn: [
      "Much like Ben Thanh Market in Saigon or Dong Xuan Market in Hanoi, Con Market (Cho Con) has served as Da Nang's beating commercial heart since the early 1940s and stands as an unmissable sensory feast.",
      "Housing over 2,000 stalls, the market is broadly divided into three exciting areas: the indoor street food court, the open-air food pavilion, and the dried specialty section. Con Market is universally revered as Central Vietnam's culinary capital. Here you can savor steaming bowls of Mi Quang (turmeric noodles with quail eggs and pork), Banh Trang Cuon Thit Heo (rice paper rolls with sliced two-head pork and spicy anchovy sauce), crispy Banh Xeo, Banh Beo, spicy snails, and refreshing Che Sau (durian dessert).",
    ],
    paragraphsVi: [
      "Tương tự như Chợ Bến Thành của Sài Gòn hay Chợ Đồng Xuân của Hà Nội, Chợ Cồn (Trung tâm Thương mại Đà Nẵng) là chứng nhân lịch sử có từ những năm 1940 và là 'kinh đô ẩm thực' bình dân nức tiếng miền Trung.",
      "Khu chợ quy tụ hơn 2.000 hộ kinh doanh với 3 khu vực chính: khu ẩm thực trong nhà (khu ăn vặt), khu ẩm thực ngoài trời và khu đặc sản đồ khô làm quà. Đến Chợ Cồn, bạn sẽ được thưởng thức trọn vẹn tinh hoa ẩm thực bản địa: Mì Quảng ếch/tôm thịt, bánh tráng cuốn thịt heo chấm mắm nêm đậm đà, bánh xèo vàng ươm, bánh bèo chén, ốc hút cay nồng xả ớt và chè sầu Liên ngọt lịm.",
    ],
    tipEn: "Head to the outdoor food area between 15:30 and 18:30 when snack vendors are in full swing. Keep small VND cash bills on hand as most traditional stalls do not accept card payments.",
    tipVi: "Hãy ghé khu ẩm thực ngoài trời từ 15:30 đến 18:30 khi các quầy ăn vặt bắt đầu mở bán nhộn nhịp nhất. Nên chuẩn bị sẵn tiền mặt mệnh giá nhỏ để thanh toán tiện lợi tại các sạp hàng truyền thống.",
  },
  {
    id: "hai-van-pass",
    num: 8,
    titleEn: "8. Hai Van Pass (Deo Hai Van)",
    titleVi: "8. Đèo Hải Vân – Thiên hạ đệ nhất hùng quan",
    img: "/guide/danang/danang-hai-van-pass-hd.jpg",
    captionEn: "Dramatic coastal mountain hairpin turns climbing above the clouds on Hai Van Pass",
    captionVi: "Cung đèo hiểm trở ôm sát bờ biển xanh ngắt nối liền Đà Nẵng và Cố đô Huế",
    paragraphsEn: [
      "Immortalized by King Le Thanh Tong in the 15th century as 'The Most Monumental Pass Under Heaven', Hai Van Pass (The Sea Clouds Pass) is hailed among the world's most scenic coastal road trips.",
      "Stretching 21 kilometers across the Bach Ma range and cresting at 500 meters above sea level, the pass forms the natural geographic and climatic boundary between Da Nang and Thua Thien Hue province. Driving along the winding tarmac, you are treated to jaw-dropping vistas: mist-shrouded green peaks on one side and the sparkling turquoise waters of Da Nang Bay and Lang Co Lagoon on the other. At the summit, visit the restored Hai Van Gate (Hai Van Quan), a 19th-century Nguyen Dynasty defensive fortress.",
    ],
    paragraphsVi: [
      "Từng được Vua Lê Thánh Tông ban tặng danh hiệu 'Thiên hạ đệ nhất hùng quan' vào thế kỷ 15, Đèo Hải Vân là một trong những cung đường ven biển ngoạn mục và tráng lệ nhất thế giới được du khách quốc tế mê đắm.",
      "Với chiều dài 21km vắt qua dãy Bạch Mã và đỉnh đèo cao 500m so với mực nước biển, nơi đây là ranh giới địa lý và khí hậu tự nhiên giữa Đà Nẵng và Thừa Thiên Huế. Lái xe trên cung đường uốn lượn, bạn sẽ được chiêm ngưỡng bức tranh thiên nhiên kỳ vĩ: một bên là vách núi sừng sững ẩn hiện trong mây, một bên là bờ biển xanh ngắt trải dài tới vịnh Lăng Cô. Trên đỉnh đèo là di tích lịch sử Hải Vân Quan vừa được trùng tu nguyên trạng thời Nguyễn.",
    ],
    tipEn: "Avoid traveling during foggy or rainy weather. If riding a motorbike, inspect your brakes thoroughly and honk when approaching blind corners. Stop by the historic summit bunkers for Vietnamese iced coffee with panoramic views.",
    tipVi: "Tránh đi đèo vào những ngày mưa bão hoặc sương mù dày đặc. Nếu đi xe máy, hãy kiểm tra phanh kỹ lưỡng và bóp còi trước các khúc cua khuất tầm nhìn. Đừng quên dừng chân uống cà phê ngắm cảnh trên đỉnh đèo.",
  },
  {
    id: "phong-nam-village",
    num: 9,
    titleEn: "9. Phong Nam Ancient Village",
    titleVi: "9. Làng cổ Phong Nam – Hồn quê thanh bình giữa phố thị",
    img: "/guide/danang/danang-phong-nam-village-hd.jpg",
    captionEn: "Centuries-old mossy brick gates and serene banyan trees in Phong Nam Ancient Village",
    captionVi: "Cổng làng rêu phong và giếng nước cổ kính gợi nhớ không gian làng quê Việt Nam xưa",
    paragraphsEn: [
      "While Da Nang is celebrated for its futuristic skylines, few international travelers know that just 10 kilometers southwest lies Phong Nam Ancient Village—a peaceful pocket preserving traditional Vietnamese rural life for more than 700 years.",
      "Dating back to the Champa era and developed further during the Tran Dynasty, Phong Nam charms visitors with weathered red-brick village gates, ancient banyan trees, quiet lotus ponds, communal wells, and ornate ancestral houses (Nha Ruong). Strolling down shady bamboo paths far away from urban noise, you'll experience timeless pastoral serenity and the warm hospitality of elderly village folk.",
    ],
    paragraphsVi: [
      "Trong khi Đà Nẵng nổi tiếng với những cây cầu hiện đại và các tòa cao ốc lấp lánh, ít ai biết rằng chỉ cách trung tâm thành phố 10km về phía Tây Nam có một Làng cổ Phong Nam hơn 700 năm tuổi vẫn giữ vẹn nguyên hồn cốt làng quê xưa.",
      "Hình thành từ thời Chămpa và phát triển rực rỡ từ thời nhà Trần, làng Phong Nam đưa du khách bước vào không gian mộc mạc với cây đa, bến nước, sân đình, những cổng làng rêu phong và các nếp nhà rường bằng gỗ quý trăm tuổi. Dạo bước dưới bóng mát của những lũy tre làng, lắng nghe tiếng chim hót bên đồng lúa thanh bình và trò chuyện cùng những cụ già hiền hậu sẽ mang lại cho bạn những phút giây thư thái hiếm có.",
    ],
    tipEn: "Combine your morning visit to Phong Nam with a cycling trip through the surrounding rice paddies. Dress respectfully when stepping inside communal temples and family shrines.",
    tipVi: "Bạn có thể kết hợp đạp xe buổi sáng quanh các cánh đồng lúa thanh bình bao quanh làng. Hãy mặc trang phục lịch sự, kín đáo khi ghé thăm đình làng và các nhà thờ tộc họ.",
  },
  {
    id: "han-river-bridge",
    num: 10,
    titleEn: "10. Han River Swing Bridge (Cau Song Han)",
    titleVi: "10. Cầu quay Sông Hàn – Dấu ấn độc bản của người Đà Nẵng",
    img: "/guide/danang/danang-han-river-bridge-hd.jpg",
    captionEn: "The Han River Bridge rotating on its axis at midnight to let shipping vessels pass",
    captionVi: "Cầu Sông Hàn quay 90 độ quanh trục giữa đêm khuya – công trình biểu tượng của thành phố",
    paragraphsEn: [
      "Before the Dragon Bridge captured global headlines, the Han River Bridge (Cau Song Han) earned a special place in the hearts of Da Nang citizens as Vietnam's first and only swing bridge.",
      "Inaugurated in 2000, this remarkable infrastructure was designed and constructed entirely by Vietnamese engineers and workers, built with generous financial donations from the local population. At midnight on weekends, the middle section of the 487-meter bridge slowly rotates 90 degrees horizontally on its axis to allow large ships to navigate between the river and the sea. Watching the bridge rotate against the backdrop of glittering riverside promenades remains an iconic Da Nang night ritual.",
    ],
    paragraphsVi: [
      "Trước khi Cầu Rồng trở thành hiện tượng quốc tế, Cầu Sông Hàn đã chiếm trọn trái tim người dân Đà Nẵng như một tượng đài về ý chí và sự chung sức đồng lòng của nhân dân thành phố.",
      "Khánh thành vào năm 2000, đây là cây cầu quay đầu tiên và duy nhất tại Việt Nam do chính các kỹ sư và công nhân trong nước thiết kế, thi công với sự đóng góp tiền bạc tự nguyện của người dân địa phương. Vào ban đêm cuối tuần, phần nhịp giữa của cây cầu dài 487m sẽ từ từ xoay ngang một góc 90 độ để khơi thông luồng lạch cho tàu thuyền lớn qua lại. Trải nghiệm ngắm cầu quay giữa không gian lộng gió sông Hàn là một kỷ niệm khó phai trong chuyến du lịch Đà Nẵng.",
    ],
    tipEn: "The bridge currently rotates from 23:00 to 24:00 on Saturdays and Sundays. Booking a night river cruise gives you the best unobstructed vantage point to observe the swing mechanism in action.",
    tipVi: "Lịch quay hiện tại của cầu là từ 23:00 đến 24:00 vào các ngày Thứ Bảy và Chủ Nhật. Đặt một chuyến du thuyền đêm trên sông Hàn sẽ giúp bạn có tầm nhìn trực diện đẹp nhất khi cầu chuyển động xoay.",
  },
];

// ─── VERIFIED RELATED ARTICLES ON VINATAP ───
const RELATED_GUIDES = [
  {
    slug: "10-best-things-to-do-in-ho-chi-minh-city",
    title: "10 Best Things to Do in Ho Chi Minh City",
    titleVi: "10 Trải Nghiệm Tuyệt Nhất Tại TP. Hồ Chí Minh",
    desc: "From historic landmarks and rooftop skydecks to bustling food alleys, explore Vietnam's southern metropolis.",
    descVi: "Khám phá Dinh Độc Lập, Nhà thờ Đức Bà, ẩm thực đường phố và nhịp sống sôi động tại Sài Gòn.",
    img: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
  },
  {
    slug: "the-15-best-attractions-in-dalat",
    title: "The 15 Best Attractions in Dalat",
    titleVi: "15 Điểm Tham Quan Đẹp Nhất Đà Lạt",
    desc: "Pine-clad hills, cascading waterfalls, flower gardens, and French colonial architecture in the Central Highlands.",
    descVi: "Cao nguyên ngàn hoa với Thác Datanla, Hồ Tuyền Lâm, đồi chè Cầu Đất và ga xe lửa cổ kính.",
    img: "/guide/dalat/dalat-15-attractions-hd.jpg",
  },
  {
    slug: "8-best-things-to-do-in-nha-trang",
    title: "8 Best Things to Do in Nha Trang",
    titleVi: "8 Trải Nghiệm Tuyệt Nhất Tại Nha Trang",
    desc: "Crystal-clear bays, mineral mud baths, offshore islands, and fresh seafood markets along Vietnam's coast.",
    descVi: "Thiên đường biển đảo với vịnh ngọc ngắm san hô, tắm bùn khoáng Tháp Bà và cáp treo VinWonders.",
    img: "/guide/hcmc/region-central-nhatrang.jpg",
  },
  {
    slug: "20-best-things-to-do-in-vietnam",
    title: "20 Best Things to Do in Vietnam",
    titleVi: "20 Trải Nghiệm Nhất Định Phải Thử Ở Việt Nam",
    desc: "Comprehensive bucket-list experiences spanning northern mountains, central coastlines, and the Mekong Delta.",
    descVi: "Danh sách 20 trải nghiệm hàng đầu từ vịnh Hạ Long, cố đô Huế đến chợ nổi miền Tây.",
    img: "/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg",
  },
  {
    slug: "3-week-vietnam-itinerary",
    title: "3-Week Vietnam Itinerary: The Ultimate Route",
    titleVi: "Lịch Trình Du Lịch Việt Nam 3 Tuần Lý Tưởng",
    desc: "The recommended 3-week route connecting Saigon, Nha Trang, Da Nang, Hoi An, Hanoi, and Ha Long.",
    descVi: "Lộ trình hoàn hảo kết nối 7 điểm đến kinh điển xuyên Việt cho du khách quốc tế và tự túc.",
    img: "/guide/megamenu/itin-1-3week.jpg",
  },
  {
    slug: "the-complete-guide-to-vietnam",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm Nang Toàn Diện Du Lịch Việt Nam",
    desc: "All essentials on visas, currency, weather seasons, transportation, and culture for your Vietnam trip.",
    descVi: "Tổng hợp tất cả kiến thức cần biết về visa, tiền tệ, thời tiết, di chuyển và văn hóa du lịch.",
    img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
  },
];

export default function DaNangAttractionsPage() {
  const [lang, setLang] = useState("vi");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setLang(getLang());
    const handleLangChange = () => setLang(getLang());
    window.addEventListener("languageChange", handleLangChange);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("languageChange", handleLangChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isVi = lang === "vi";

  return (
    <div className="danang-page-wrap">
      {/* Scroll Progress Bar */}
      <div
        className="danang-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Official VinaTap Public Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section
        className="danang-hero"
        style={{
          backgroundImage: `url('/guide/danang/danang-10-best-attractions-hd.jpg')`,
        }}
      >
        <div className="danang-hero__overlay" />
        <div className="danang-hero__content">
          <div className="danang-hero__badges">
            <span className="danang-badge danang-badge--accent">
              <Compass size={13} />
              {isVi ? "CẨM NANG ĐÀ NẴNG" : "DA NANG GUIDE"}
            </span>
            <span className="danang-badge">
              <Sparkles size={13} />
              {isVi ? "TOP 10 ĐIỂM ĐẾN" : "TOP 10 ATTRACTIONS"}
            </span>
            <span className="danang-badge">
              <MapPin size={13} />
              {isVi ? "MIỀN TRUNG VIỆT NAM" : "CENTRAL VIETNAM"}
            </span>
          </div>

          <h1 className="danang-hero__title">
            {isVi
              ? "10 Điểm Tham Quan Đẹp Nhất Đà Nẵng"
              : "The 10 Best Attractions in Da Nang"}
          </h1>

          <div className="danang-hero__meta">
            <span className="danang-hero__meta-item">
              <Calendar size={15} />
              {isVi ? "Cập nhật: Tháng 10, 2026" : "Updated: October 2026"}
            </span>
            <span className="danang-hero__meta-item">
              <Clock size={15} />
              {isVi ? "Thời gian đọc: 10 phút" : "Read time: 10 mins"}
            </span>
            <span className="danang-hero__meta-item">
              <ShieldCheck size={15} />
              {isVi ? "Biên tập bởi VinaTap Editorial" : "By VinaTap Editorial"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Editorial Container */}
      <main className="danang-container">
        {/* Call to action & quick plan buttons */}
        <div className="danang-action-wrap">
          <Link
            href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
            className="danang-btn-primary"
          >
            <Sparkles size={17} />
            <span>
              {isVi
                ? "Lên kế hoạch du lịch Đà Nẵng với AI"
                : "Plan Da Nang Trip with AI Assistant"}
            </span>
            <ArrowRight size={15} />
          </Link>
          <Link href="/province/da-nang" className="danang-btn-secondary">
            <MapPin size={16} />
            <span>
              {isVi ? "Xem tổng quan TP. Đà Nẵng" : "Explore Da Nang Hub"}
            </span>
          </Link>
        </div>

        {/* Quick Stats Bar */}
        <div className="danang-stats-bar">
          <div className="danang-stat-item">
            <span className="danang-stat-label">
              {isVi ? "Số điểm nổi bật" : "Attractions"}
            </span>
            <span className="danang-stat-val">
              {isVi ? "10 Danh thắng hàng đầu" : "10 Curated Highlights"}
            </span>
          </div>
          <div className="danang-stat-item">
            <span className="danang-stat-label">
              {isVi ? "Thời điểm lý tưởng" : "Best Time"}
            </span>
            <span className="danang-stat-val">
              {isVi ? "Tháng 3 – Tháng 9 (Mùa khô)" : "March – September"}
            </span>
          </div>
          <div className="danang-stat-item">
            <span className="danang-stat-label">
              {isVi ? "Phương tiện di chuyển" : "Transport"}
            </span>
            <span className="danang-stat-val">
              {isVi ? "Xe máy, Taxi, Ô tô du lịch" : "Scooter, Taxi & Car"}
            </span>
          </div>
          <div className="danang-stat-item">
            <span className="danang-stat-label">
              {isVi ? "Thời lượng chuyến đi" : "Suggested Stay"}
            </span>
            <span className="danang-stat-val">
              {isVi ? "3 – 4 Ngày (kết hợp Hội An)" : "3 – 4 Days"}
            </span>
          </div>
        </div>

        {/* Editorial Introduction */}
        <div className="danang-intro">
          <p>
            {isVi
              ? "Được thiên nhiên ưu ái ban tặng bờ biển thơ mộng, bán đảo nguyên sinh cùng hệ thống núi đá vôi kỳ vĩ, Đà Nẵng từ lâu đã được mệnh danh là 'thành phố đáng sống nhất Việt Nam'. Không chỉ sở hữu hạ tầng giao thông hiện đại bậc nhất cả nước, thành phố biển miền Trung này còn là giao điểm vàng kết nối 3 Di sản Văn hóa Thế giới: Cố đô Huế, Phố cổ Hội An và Thánh địa Mỹ Sơn."
              : "Da Nang is widely celebrated as the most liveable coastal city in Vietnam, blessed with breathtaking natural assets ranging from sapphire oceans to ancient karst mountains, complemented by state-of-the-art urban infrastructure. Positioned strategically in Central Vietnam, Da Nang serves as the premier gateway connecting three renowned UNESCO World Heritage sites: the Imperial City of Hue, Hoi An Ancient Town, and My Son Sanctuary."}
          </p>
          <p>
            {isVi
              ? "Dưới đây là danh sách tuyển chọn 10 điểm tham quan đẹp nhất tại Đà Nẵng được tổng hợp chi tiết từ danh thắng thiên nhiên, công trình biểu tượng cho tới các điểm dừng chân văn hóa và ẩm thực đặc sắc không thể bỏ qua."
              : "Here is our carefully curated guide to the 10 best attractions in Da Nang, featuring world-famous beaches, sky-high architectural feats, sacred caves, cultural villages, and culinary landmarks to ensure an unforgettable journey."}
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="danang-toc">
          <h2 className="danang-toc__title">
            <Compass size={18} />
            <span>
              {isVi ? "Mục lục 10 danh thắng Đà Nẵng" : "Top 10 Attractions Directory"}
            </span>
          </h2>
          <ul className="danang-toc__grid">
            {DANANG_ATTRACTIONS.map((att) => (
              <li key={att.id}>
                <a href={`#${att.id}`} className="danang-toc__link">
                  <ChevronRight size={15} style={{ color: "#00c2cb" }} />
                  <span>{isVi ? att.titleVi : att.titleEn}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 10 Attractions Editorial List */}
        <div className="danang-list">
          {DANANG_ATTRACTIONS.map((att) => (
            <article key={att.id} id={att.id} className="danang-item">
              <h2 className="danang-item__title">
                <span className="danang-item__num">{att.num}</span>
                <span>{isVi ? att.titleVi : att.titleEn}</span>
              </h2>

              <div className="danang-item__layout">
                {/* Left Column: Media & Caption */}
                <div className="danang-item__media">
                  <div className="danang-item__img-wrap">
                    <img
                      src={att.img}
                      alt={isVi ? att.titleVi : att.titleEn}
                      className="danang-item__img"
                      loading="lazy"
                    />
                  </div>
                  <span className="danang-item__caption">
                    {isVi ? att.captionVi : att.captionEn}
                  </span>
                </div>

                {/* Right Column: Paragraphs & Practical Tip */}
                <div className="danang-item__body">
                  {(isVi ? att.paragraphsVi : att.paragraphsEn).map(
                    (p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    )
                  )}

                  {/* Tip Box */}
                  <div className="danang-item__tip-box">
                    <strong>{isVi ? "Mẹo du lịch VinaTap: " : "Travel Tip: "}</strong>
                    <span>{isVi ? att.tipVi : att.tipEn}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Closing Note & Summary Box */}
        <section className="danang-closing-wrap">
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#0f766e",
              margin: "0 0 12px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={20} />
            <span>
              {isVi
                ? "Gợi ý lịch trình khám phá Đà Nẵng trọn vẹn"
                : "Suggested Da Nang Exploration Route"}
            </span>
          </h3>
          <p className="danang-closing-text">
            {isVi
              ? "Với khoảng cách di chuyển thuận tiện giữa các điểm danh thắng, chuyến du lịch Đà Nẵng 3 ngày 2 đêm hoặc 4 ngày 3 đêm là lý tưởng nhất để bạn kết hợp: tắm biển Mỹ Khê vào sáng sớm, dành 1 ngày trọn vẹn tại Bà Nà Hills, buổi chiều khám phá Bán đảo Sơn Trà & Ngũ Hành Sơn, và dành các buổi tối dạo bờ sông Hàn xem Cầu Rồng phun lửa hay thưởng thức hải sản tại Chợ Cồn. Đừng quên kết hợp một buổi chiều tối ghé thăm Phố cổ Hội An (chỉ cách Đà Nẵng 30km) để ngắm đèn lồng lung linh."
              : "Thanks to compact travel distances, a 3-to-4-day itinerary is ideal for experiencing Da Nang's premier highlights: morning dips at My Khe Beach, a full day at Ba Na Hills and the Golden Bridge, an afternoon conquering Son Tra and Marble Mountains, followed by vibrant evenings sampling street food at Con Market and witnessing Dragon Bridge breathe fire. Consider combining your trip with an evening in neighboring Hoi An Ancient Town (just 30km south) for an unforgettable Central Vietnam holiday."}
          </p>
        </section>

        {/* Editorial Tags Row */}
        <div className="danang-tags-wrap">
          <span className="danang-tag-badge">
            {isVi ? "CHỦ ĐỀ LIÊN QUAN" : "TAGS"}
          </span>
          <Link href="/province/da-nang" className="danang-tag-pill">
            {isVi ? "Đà Nẵng" : "Da Nang"}
          </Link>
          <Link href="/province/da-nang" className="danang-tag-pill">
            {isVi ? "Điểm tham quan Đà Nẵng" : "Attractions in Da Nang"}
          </Link>
          <Link href="/province/da-nang" className="danang-tag-pill">
            {isVi ? "Bãi biển Mỹ Khê" : "My Khe Beach"}
          </Link>
          <Link href="/province/da-nang" className="danang-tag-pill">
            {isVi ? "Bà Nà Hills" : "Ba Na Hills"}
          </Link>
          <Link href="/province/da-nang" className="danang-tag-pill">
            {isVi ? "Cầu Rồng" : "Dragon Bridge"}
          </Link>
          <Link href="/province/da-nang" className="danang-tag-pill">
            {isVi ? "Ngũ Hành Sơn" : "Marble Mountains"}
          </Link>
        </div>

        {/* Related Articles Section */}
        <section className="danang-related-section">
          <h2 className="danang-related-title">
            {isVi ? "Cẩm nang du lịch liên quan" : "Related Travel Guides"}
          </h2>

          <div className="danang-related-grid">
            {RELATED_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="danang-related-card"
              >
                <div className="danang-related-thumb">
                  <img
                    src={guide.img}
                    alt={isVi ? guide.titleVi : guide.title}
                    className="danang-related-img"
                    loading="lazy"
                  />
                </div>
                <div className="danang-related-body">
                  <h3 className="danang-related-card-title">
                    {isVi ? guide.titleVi : guide.title}
                  </h3>
                  <p className="danang-related-card-desc">
                    {isVi ? guide.descVi : guide.desc}
                  </p>
                  <span className="danang-related-link">
                    <span>{isVi ? "Xem chi tiết" : "Read Guide"}</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Chatbot Assistant */}
      <ProvinceChatbot />

      {/* Global Public Footer */}
      <PublicFooter />
    </div>
  );
}
