"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  MapPin,
  Compass,
  Sparkles,
  Mountain,
  Utensils,
  Sun,
  Bus,
  CheckCircle,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/destination-hagiang.css";

// ─── 9 MUST-VISIT ATTRACTIONS DATA ───
const HA_GIANG_9_ATTRACTIONS = [
  {
    id: "lung-cu-flagpole",
    index: 1,
    title: "1. Lung Cu Flagpole",
    titleVi: "1. Cột cờ Lũng Cú",
    img: "/guide/hagiang/hagiang-lung-cu-flagpole.jpg",
    alt: "Lung Cu Flagpole Ha Giang",
    location: "Lung Cu Commune, Dong Van District",
    locationVi: "Xã Lũng Cú, Huyện Đồng Văn",
    desc: (
      <>
        <p>
          Perhaps no tourist visits Ha Giang without standing at the top of the Lung Cu Flagpole. Rising proudly atop Dragon Mountain (Nui Rong) at an altitude of approximately 1,470 meters above sea level, this sacred monument marks the northernmost sovereign territory of Vietnam. The giant national flag spans exactly 54 square meters, representing the unity and solidarity of the 54 ethnic groups living across Vietnam.
        </p>
        <p>
          To reach the top of the flagpole tower, visitors climb 839 stone steps divided into three tiers. From the observatory terrace, you are rewarded with awe-inspiring panoramic vistas of the surrounding villages, peaceful Lo Lo Chai ethnic settlement below, and two pristine freshwater lakes known as the &ldquo;Dragon Eyes&rdquo; (Mat Rong) that never run dry.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Có lẽ không một du khách nào đặt chân đến Hà Giang lại bỏ qua hành trình chạm tay vào Cột cờ Quốc gia Lũng Cú. Tọa lạc sừng sững trên đỉnh núi Rồng ở độ cao gần 1.470 m so với mực nước biển, công trình thiêng liêng này đánh dấu điểm cực Bắc địa đầu của Tổ quốc. Lá cờ đỏ sao vàng rộng đúng 54 m², tượng trưng cho khối đại đoàn kết keo sơn của 54 dân tộc anh em trên khắp mọi miền đất nước.
        </p>
        <p>
          Để lên đến chân cột cờ, du khách sẽ chinh phục 839 bậc thang đá uốn lượn qua ba tầng vách núi. Đứng từ đài quan sát lộng gió, tầm mắt bạn sẽ mở ra khung cảnh kỳ vĩ của núi non trùng điệp, thung lũng bản Lô Lô Chải thanh bình nép mình dưới chân núi và hai hồ nước trong vắt được ví như &ldquo;Mắt Rồng&rdquo; quanh năm không bao giờ cạn.
        </p>
      </>
    ),
    tip: "Visit around late afternoon for spectacular golden hour light over the Lo Lo Chai valley.",
    tipVi: "Nên ghé thăm vào buổi chiều tà để chiêm ngưỡng ánh hoàng hôn nhuộm vàng thung lũng Lô Lô Chải.",
  },
  {
    id: "ma-pi-leng-pass",
    index: 2,
    title: "2. Ma Pi Leng Pass",
    titleVi: "2. Đèo Mã Pí Lèng",
    img: "/guide/hagiang/hagiang-ma-pi-leng-pass.jpg",
    alt: "Ma Pi Leng Pass Ha Giang",
    location: "Happiness Road (QL4C), Dong Van - Meo Vac",
    locationVi: "Con đường Hạnh Phúc (QL4C), nối Đồng Văn - Mèo Vạc",
    desc: (
      <>
        <p>
          Revered as the &ldquo;King of Vietnam&apos;s Great Mountain Passes&rdquo;, Ma Pi Leng stretches approximately 20 kilometers along the iconic Happiness Road (Con duong Hanh Phuc). Carved directly into sheer limestone cliffs by thousands of young volunteer workers and local ethnic minorities between 1959 and 1965, this breathtaking engineering marvel winds through dramatic chasms and towering rock faces.
        </p>
        <p>
          Stopping at the Ma Pi Leng viewpoint, travelers gaze thousands of meters down into the emerald-green ribbon of the Nho Que River snaking through the deepest karst canyon in Southeast Asia. The raw grandeur of jagged limestone peaks piercing through ethereal mountain mist makes this an unforgettable highlight of the Ha Giang Loop.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Được mệnh danh là &ldquo;Vua của tứ đại đỉnh đèo&rdquo; miền Bắc, Đèo Mã Pí Lèng trải dài khoảng 20 km uốn lượn trên cung đường Hạnh Phúc huyền thoại nối liền hai thị trấn Đồng Văn và Mèo Vạc. Con đường kỳ tích này được đục đẽo hoàn toàn bằng sức người của hàng vạn thanh niên xung phong và đồng bào 16 dân tộc vùng cao trong suốt giai đoạn 1959 – 1965.
        </p>
        <p>
          Dừng chân tại điểm dừng chân Mã Pí Lèng, du khách sẽ choáng ngợp trước dòng sông Nho Quế xanh như ngọc bích lững lờ trôi dưới đáy vực sâu thẳm nhất Đông Nam Á. Khung cảnh những vách đá dựng đứng chọc thủng màng sương mờ ảo tạo nên bức tranh thiên nhiên hùng tráng và đầy kiêu hãnh của vùng cao nguyên đá.
        </p>
      </>
    ),
    tip: "Ride carefully, maintain low gear on steep descents, and stop at the designated glass-bottom skywalk or cafe rest stops for photos.",
    tipVi: "Cần vững tay lái, về số thấp khi đổ đèo và dừng chân tại các trạm dừng vọng cảnh để ngắm trọn vẹn vực Tu Sản.",
  },
  {
    id: "dong-van-karst-plateau",
    index: 3,
    title: "3. Dong Van Karst Plateau Geopark",
    titleVi: "3. Công viên Địa chất Toàn cầu Cao nguyên đá Đồng Văn",
    img: "/guide/hagiang/hagiang-dong-van-karst-plateau.jpg",
    alt: "Dong Van Karst Plateau Geopark Ha Giang",
    location: "Quan Ba, Yen Minh, Dong Van, Meo Vac Districts",
    locationVi: "Trải rộng trên 4 huyện Quản Bạ, Yên Minh, Đồng Văn, Mèo Vạc",
    desc: (
      <>
        <p>
          Recognized by UNESCO in 2010 as Vietnam&apos;s first Global Geopark, Dong Van Karst Plateau spans over 2,350 square kilometers across four northern mountainous districts. Situated at an average altitude of 1,000 to 1,600 meters, about 80% of the surface consists of stark limestone formations sculpted over 400 to 600 million years of geological evolution.
        </p>
        <p>
          Beyond its astonishing geological marvels, Dong Van is a living museum of cultural heritage, home to 17 ethnic groups such as the H&apos;Mong, Dao, Tay, and Giay. Here, stone permeates every facet of life: from dry-stone terrace walls and ancient earthen houses with yin-yang roofs to vibrant traditional textile markets.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Được UNESCO chính thức công nhận vào năm 2010 là Công viên Địa chất Toàn cầu đầu tiên của Việt Nam, Cao nguyên đá Đồng Văn trải rộng hơn 2.350 km² trên địa bàn bốn huyện vùng cao phía Bắc. Nằm ở độ cao trung bình từ 1.000 đến 1.600 m, có tới 80% diện tích nơi đây là đá vôi lộ đầu qua quá trình kiến tạo địa chất kéo dài từ 400 đến 600 triệu năm.
        </p>
        <p>
          Không chỉ sở hữu giá trị địa chất vô giá, cao nguyên đá còn là bảo tàng sống về văn hóa nhân loại với 17 dân tộc thiểu số cùng sinh sống. Đá hiện diện trong từng hơi thở đời sống: từ những hàng rào đá kiên cố xếp khan không cần vữa, những ngôi nhà trình tường mái ngói âm dương cổ kính đến những bộ trang phục thổ cẩm rực rỡ sắc màu.
        </p>
      </>
    ),
    tip: "Bring a warm fleece or windbreaker even in summertime, as plateau nights can get chilly.",
    tipVi: "Nên chuẩn bị áo ấm hoặc áo gió mỏng ngay cả vào mùa hè vì đêm trên cao nguyên đá nhiệt độ hạ xuống khá thấp.",
  },
  {
    id: "tham-ma-slope",
    index: 4,
    title: "4. Tham Ma Slope",
    titleVi: "4. Dốc Thẩm Mã",
    img: "/guide/hagiang/hagiang-tham-ma-slope.jpg",
    alt: "Tham Ma Slope Ha Giang",
    location: "QL4C between Yen Minh and Pho Bang",
    locationVi: "Đoạn QL4C nối Yên Minh và Phố Bảng",
    desc: (
      <>
        <p>
          Tham Ma Slope is a famous serpentine mountain pass on Highway 4C connecting Yen Minh district with Dong Van. Featuring 9 intense S-shaped hairpin bends nestled between towering cliffs, the slope derives its historical name from the ancient practice of testing horses (&ldquo;Tham Ma&rdquo;). Pack horses carrying heavy goods were driven up the steep ascent; those that reached the crest healthy and strong were kept, while weak horses were retired.
        </p>
        <p>
          Today, Tham Ma Slope is a favorite photo destination for road-trippers and motorbikers. From the observation pavilion at the top, you can marvel at the winding asphalt curves snaking gracefully down into the lush green valley below, often greeted by ethnic children carrying vibrant wicker baskets of wildflowers.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Dốc Thẩm Mã là cung đường đèo 9 khúc uốn lượn ngoạn mục trên Quốc lộ 4C nối huyện Yên Minh lên ngã ba Phó Bảng. Tên gọi &ldquo;Thẩm Mã&rdquo; bắt nguồn từ tục thẩm định sức ngựa thời xưa: người dân cho ngựa thồ hàng nặng leo từ chân lên đỉnh dốc, chú ngựa nào vượt qua dốc cao mà vẫn khỏe mạnh sẽ được giữ lại nuôi dưỡng, còn ngựa yếu sức sẽ bị loại.
        </p>
        <p>
          Ngày nay, đỉnh dốc Thẩm Mã là điểm dừng chân chụp ảnh check-in nức tiếng của các phượt thủ. Từ điểm vọng cảnh trên đỉnh, bạn có thể chiêm ngưỡng toàn cảnh những khúc cua chữ S mềm mại như dải lụa ôm trọn sườn núi đá vôi, nơi các em bé vùng cao thường đeo giỏ hoa rừng tươi tắn chào đón du khách.
        </p>
      </>
    ),
    tip: "Stop at the top parking area for the best wide-angle photography perspective of all 9 bends.",
    tipVi: "Hãy dừng xe ở khu vực ngắm cảnh trên đỉnh dốc để chụp được góc rộng trọn vẹn cả 9 khúc cua quanh co.",
  },
  {
    id: "dong-van-old-quarter",
    index: 5,
    title: "5. Dong Van Old Quarter",
    titleVi: "5. Phố Cổ Đồng Văn",
    img: "/guide/hagiang/hagiang-dong-van-old-quarter.jpg",
    alt: "Dong Van Old Quarter Ha Giang",
    location: "Dong Van Town, Dong Van District",
    locationVi: "Thị trấn Đồng Văn, Huyện Đồng Văn",
    desc: (
      <>
        <p>
          Tucked inside a tranquil mountain valley encircled by sheer limestone karsts, Dong Van Old Quarter was established in the early 20th century. Originally inhabited by several Tay and H&apos;Mong families, it later saw Chinese and French settlers shaping its distinctive architecture. The historic quarter comprises about 40 two-story houses constructed with thick compacted-earth walls (nha trinh tuong), dark wooden pillars, and traditional double yin-yang terracotta roof tiles.
        </p>
        <p>
          On weekends, the old quarter comes alive with lantern-lit evening markets, ethnic music performances, and mouth-watering street food stalls serving Thang Den, roasted chestnuts, and buckwheat cakes. The old French central market building now houses charming vintage coffee shops where you can sip rich Vietnamese drip coffee while soaking in the nostalgic atmosphere.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Lọt thỏm giữa thung lũng đá vôi bao bọc bốn bề, Phố Cổ Đồng Văn được hình thành từ đầu thế kỷ 20 với nét giao thoa văn hóa độc đáo giữa người Kinh, Tày, Mông và Hoa. Khu phố cổ quy tụ khoảng 40 nếp nhà hai tầng cổ kính mang đậm kiến trúc tường trình đất nện dày dặn, cột gỗ lim chắc chắn và mái lợp ngói âm dương rêu phong cổ kính.
        </p>
        <p>
          Về đêm, đặc biệt là vào dịp cuối tuần, con phố lung linh trong ánh đèn lồng đỏ ấm áp, rộn rã tiếng khèn Mông và thơm nức mùi quà bánh vùng cao như thắng dền nóng hổi, ngô nướng, bánh tam giác mạch. Khu chợ cổ kiến trúc Pháp nay đã trở thành những quán cà phê phố cổ đầy phong vị hoài niệm.
        </p>
      </>
    ),
    tip: "Try the Cafe Pho Co situated in a 100-year-old courtyard house for a cozy coffee break.",
    tipVi: "Đừng quên ghé Cà Phê Phố Cổ trong căn nhà cổ gần 100 năm tuổi để nhâm nhi tách cà phê ấm giữa tiết trời se lạnh.",
  },
  {
    id: "vuong-palace",
    index: 6,
    title: "6. Vuong Palace (H'Mong King's Palace)",
    titleVi: "6. Dinh Thự Vua Mèo (Dinh Họ Vương)",
    img: "/guide/hagiang/hagiang-vuong-palace.jpg",
    alt: "Vuong Palace H'Mong King Ha Giang",
    location: "Sa Phin Valley, Dong Van District",
    locationVi: "Thung lũng Sà Phìn, Huyện Đồng Văn",
    desc: (
      <>
        <p>
          Situated in Sa Phin valley surrounded by protective pine trees, Vuong Palace was the fortified residence of Vuong Chinh Duc, the influential ruler recognized as the &ldquo;King of the H&apos;Mong&rdquo; (Vua Meo) who governed the autonomous borderland during the late 19th and early 20th centuries. Built over 8 years from 1898 to 1907 at a massive cost of 150,000 silver Indochina piastres, the estate incorporates sophisticated Chinese Qing Dynasty aesthetics, French colonial stone fortification, and indigenous H&apos;Mong woodwork.
        </p>
        <p>
          The complex features 64 rooms across two levels, stone bulletproof watchtowers, massive wooden poppy-pod decorative pillars, and thick defensive perimeter walls. Touring the palace provides fascinating insights into the geopolitical history, opium trade, and highland royalty of northern Vietnam.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Tọa lạc giữa thung lũng Sà Phìn thoai thoải rợp bóng thông sa mộc cổ thụ, Dinh Thự Họ Vương là pháo đài bề thế của Vua Mèo Vương Chính Đức – thủ lĩnh tối cao quyền uy cai quản vùng đất Đồng Văn đầu thế kỷ 20. Khởi công năm 1898 và mất tới 8 năm hoàn thành với chi phí tương đương 150.000 đồng bạc trắng Đông Dương, dinh thự kết hợp đỉnh cao kiến trúc ba trường phái: nghệ thuật nhà Thanh (Trung Hoa), pháo đài đá kiểu Pháp và nét mộc mạc tinh xảo của văn hóa người Mông.
        </p>
        <p>
          Quần thể gồm 64 phòng ốc hai tầng, hệ thống tường đá phòng thủ kiên cố, tháp canh đạn bắn không xuyên và những chân cột đá hình hoa thuốc phiện được đánh bóng công phu bằng đồng bạc trắng. Nơi đây lưu giữ nhiều hiện vật quý báu giúp du khách hiểu sâu sắc hơn về lịch sử và văn hóa cao nguyên.
        </p>
      </>
    ),
    tip: "Entrance ticket is approximately 25,000 VND ($1.05). Local guides in traditional attire are available at the entrance.",
    tipVi: "Vé tham quan khoảng 25.000 VNĐ/người. Có hướng dẫn viên địa phương thuyết minh chi tiết về dòng họ Vương.",
  },
  {
    id: "sung-la-valley",
    index: 7,
    title: "7. Sung La Valley (Pao's House)",
    titleVi: "7. Thung Lũng Sủng Là & Nhà Của Pao",
    img: "/guide/hagiang/hagiang-sung-la-valley.jpg",
    alt: "Sung La Valley Paos House Ha Giang",
    location: "Sung La Commune, Dong Van District",
    locationVi: "Xã Sủng Là, Huyện Đồng Văn",
    desc: (
      <>
        <p>
          Often hailed by travelers as &ldquo;The place where rocks blossom&rdquo; (Noi da no hoa), Sung La Valley lies peacefully beneath Highway 4C. Blessed with fertile soil, the valley bursts into breathtaking kaleidoscopic colors throughout the year: white plum flowers in spring, purple-pink buckwheat petals in autumn, and bright yellow mustard blossoms in winter.
        </p>
        <p>
          At the heart of Sung La in Lung Cam village stands &ldquo;Pao&apos;s House&rdquo; (Nha cua Pao), an iconic traditional H&apos;Mong earthen courtyard homestead that served as the primary filming location for the acclaimed Vietnamese movie &ldquo;The Story of Pao&rdquo;. Entering through the weathered wooden gate beneath blooming plum trees feels like stepping into a romantic bygone era.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Được ca ngợi như &ldquo;Ốc đảo thanh bình nơi đá nở hoa&rdquo;, Thung Lũng Sủng Là nằm trọn dưới sườn đèo dốc uốn khúc trên Quốc lộ 4C. Nhờ thổ nhưỡng trù phú, nơi đây quanh năm khoác lên mình những thảm hoa rực rỡ: sắc trắng hoa mận hoa lê vào mùa xuân, sắc hồng tím phớt hoa tam giác mạch vào mùa thu và bạt ngàn hoa cải vàng nở rộ giữa mùa đông.
        </p>
        <p>
          Điểm nhấn nổi bật tại làng văn hóa Lũng Cẩm chính là &ldquo;Nhà của Pao&rdquo; – ngôi nhà cổ trình tường của người Mông từng là bối cảnh chính trong bộ phim điện ảnh đoạt giải Cánh Diều Vàng &ldquo;Chuyện của Pao&rdquo;. Cổng gỗ bạc màu thời gian dưới rặng mận trắng xóa mang đến cảm giác mộc mạc, bình yên khó tả.
        </p>
      </>
    ),
    tip: "A small entrance fee of 10,000 VND applies to visit Pao's House. Please ask respectfully before photographing local residents.",
    tipVi: "Vé vào cổng Nhà của Pao là 10.000 VNĐ. Hãy xin phép lịch sự khi chụp ảnh bà con dân bản và các em nhỏ.",
  },
  {
    id: "tu-san-alley",
    index: 8,
    title: "8. Tu San Canyon & Nho Que River Boat Cruise",
    titleVi: "8. Hẻm Vực Tu Sản & Du Thuyền Sông Nho Quế",
    img: "/guide/hagiang/hagiang-tu-san-alley.jpg",
    alt: "Tu San Alley Nho Que River Ha Giang",
    location: "Foot of Ma Pi Leng, Meo Vac District",
    locationVi: "Dưới chân đèo Mã Pí Lèng, Huyện Mèo Vạc",
    desc: (
      <>
        <p>
          With vertical cliff walls towering 700 to 800 meters into the sky, a canyon length of 1.7 kilometers, and a depth reaching nearly 1,000 meters, Tu San Canyon is celebrated as the deepest and most majestic geological canyon in Southeast Asia. Nestled directly beneath the formidable curves of Ma Pi Leng Pass, the chasm is mirrored in the emerald green waters of the Nho Que River.
        </p>
        <p>
          Taking an eco-boat or kayak cruise along the river through Tu San Canyon is an absolute highlight of any journey to Ha Giang. Looking straight upward from water level between the sheer colossal limestone monoliths provides an overwhelming sense of nature&apos;s timeless power and serenity.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Với chiều cao vách đá dựng đứng từ 700 đến 800 m, chiều dài 1,7 km và độ sâu hẻm vực xấp xỉ 1.000 m, Hẻm Vực Tu Sản được vinh danh là hẻm vực kiến tạo địa chất kỳ vĩ và sâu nhất vùng Đông Nam Á. Nằm nép mình ngay dưới chân đèo Mã Pí Lèng hiểm trở, hẻm vực soi bóng xuống mặt nước trong xanh màu ngọc bích của dòng sông Nho Quế.
        </p>
        <p>
          Trải nghiệm ngồi thuyền máy hoặc tự tay chèo thuyền kayak lướt nhẹ trên dòng Nho Quế luồn qua hẻm Tu Sản là khoảnh khắc đắt giá nhất trong chuyến hành trình. Ngước nhìn những bức tường thành đá vôi sừng sững cao vút ngút ngàn, bạn sẽ cảm nhận trọn vẹn sự nhỏ bé của con người trước vẻ đẹp vô song của tạo hóa.
        </p>
      </>
    ),
    tip: "Boat tour tickets cost around 100,000 - 120,000 VND ($4.2 - $5) per passenger. Motorbike taxis (xe om) can ferry you down the steep access road to the boat wharf for about 100,000 VND round trip.",
    tipVi: "Giá vé du thuyền khoảng 100.000 – 120.000 VNĐ/người. Đường xuống bến thuyền khá dốc, du khách có thể thuê xe ôm khứ hồi khoảng 100.000 VNĐ.",
  },
  {
    id: "pho-bang-town",
    index: 9,
    title: "9. Pho Bang Town (The Forgotten Town)",
    titleVi: "9. Thị Trấn Phó Bảng (Thị Trấn Ngủ Quên)",
    img: "/guide/hagiang/hagiang-pho-bang-town.jpg",
    alt: "Pho Bang Town Ha Giang",
    location: "Dong Van District, near China Border",
    locationVi: "Huyện Đồng Văn, sát biên giới Việt - Trung",
    desc: (
      <>
        <p>
          Hidden away from the main tourist highway behind massive karst crags, Pho Bang is affectionately known as Ha Giang&apos;s &ldquo;forgotten town&rdquo;. Once the bustling administrative center of Dong Van district before the seat moved, Pho Bang now rests in idyllic tranquility, preserving timeless earthen mud-brick homes with mossy tiled roofs, wooden window shutters, and vibrant red paper couplets.
        </p>
        <p>
          A stroll through Pho Bang feels like stepping back centuries into an ancient border settlement. Rose gardens bloom vibrantly against the weathered adobe walls, and village elders chat leisurely on wooden doorsteps, creating an atmosphere of sublime peace rarely found elsewhere.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Nằm ẩn mình sau những dãy núi đá tai mèo sừng sững cách xa trục quốc lộ tấp nập, Thị Trấn Phó Bảng được du khách ví như &ldquo;thị trấn ngủ quên giữa lòng cao nguyên đá&rdquo;. Từng là thủ phủ sầm uất của huyện Đồng Văn trước khi trung tâm hành chính chuyển dời, Phó Bảng nay giữ trọn vẻ đẹp hoài cổ, tĩnh lặng với những ngôi nhà tường trình đất nâu vàng, mái ngói âm dương phủ đầy rêu phong và câu đối đỏ dán trước hiên.
        </p>
        <p>
          Tản bộ qua từng con ngõ nhỏ Phó Bảng, bạn sẽ ngỡ như đang lạc vào một thước phim cổ trang biên thùy. Những vườn hoa hồng thơm ngát nở rộ ven vách đất, những cụ già ngồi sưởi nắng thảnh thơi trò chuyện mang đến cảm giác an yên đến lắng đọng tâm hồn.
        </p>
      </>
    ),
    tip: "Visit on the weekly rotating market day (Cho Lui Pho Bang) every 6 days for a truly authentic local encounter.",
    tipVi: "Nếu có dịp, hãy ghé thăm đúng ngày chợ lùi Phó Bảng (6 ngày họp một phiên) để hòa mình vào nhịp sống chân chất của đồng bào.",
  },
];

// ─── 7 MUST-TRY DISHES DATA ───
const HA_GIANG_7_DISHES = [
  {
    id: "thang-co",
    index: 1,
    title: "1. Thang Co (Traditional Horse Meat Stew)",
    titleVi: "1. Thắng Cố",
    img: "/guide/hagiang/hagiang-thang-co.jpg",
    alt: "Thang Co Ha Giang",
    desc: (
      <>
        <p>
          Thang Co is the quintessential traditional specialty of the H&apos;Mong people that has become famous across the Northwest highlands. Simmered in massive cast-iron cauldrons over wood fires at highland markets, the dish combines horse meat, bones, and organs slow-cooked with 12 aromatic mountain spices including cardamom, star anise, lemongrass, grilled ginger, and wild cinnamon bark.
        </p>
        <p>
          Best enjoyed steaming hot on chilly plateau mornings, diners dip spoonfuls into roasted chili salt, paired with a piping hot glass of spicy corn wine (ruou ngo Men La). It offers a rich, deep, and authentically rugged taste of highland hospitality.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Thắng cố là món ăn truyền thống trứ danh của đồng bào người Mông, gắn liền với nhịp sống và các phiên chợ vùng cao Tây Bắc. Được ninh trong những chiếc chảo gang khổng lồ đỏ lửa giữa chợ phiên, món ăn là sự hòa quyện của thịt, xương và nội tạng ngựa kết hợp cùng 12 vị thảo quả rừng Tây Bắc như hoa hồi, quế chi, thảo quả, sả, gừng nướng và hạt dổi.
        </p>
        <p>
          Thưởng thức bát thắng cố bốc khói nghi ngút giữa cái lạnh cắt da của cao nguyên đá, chấm cùng muối ớt tiêu rừng và nhấp ngụm rượu ngô men lá cay nồng là trải nghiệm ẩm thực chân thực khó quên của mọi hành trình.
        </p>
      </>
    ),
  },
  {
    id: "xoi-ngu-sac",
    index: 2,
    title: "2. Five-Colored Sticky Rice (Xoi Ngu Sac)",
    titleVi: "2. Xôi Ngũ Sắc",
    img: "/guide/hagiang/hagiang-xoi-ngu-sac.jpg",
    alt: "Xoi Ngu Sac Ha Giang",
    desc: (
      <>
        <p>
          Xoi Ngu Sac is a culinary masterpiece of the Tay and Dao ethnic groups, showcasing fragrant glutinous mountain rice dyed naturally into five vibrant hues: red, yellow, green, purple, and white. Each color is extracted purely from forest plants: red and purple from magenta leaves (la cam), yellow from turmeric or ginger bark, and green from ginger leaves or pandan.
        </p>
        <p>
          The five colors symbolize the Five Elements of the cosmos (Metal, Wood, Water, Fire, Earth) as well as wishes for prosperity, fertility, and family harmony. The rice is delightfully chewy, fragrant, and often sprinkled with roasted sesame salt.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Xôi ngũ sắc là tuyệt tác ẩm thực tinh tế của đồng bào Tày, Dao trên miền sơn cước, được đồ từ hạt nếp nương thơm dẻo với 5 màu sắc rực rỡ: đỏ, vàng, xanh, tím và trắng. Điều kỳ diệu là tất cả các màu sắc đều được nhuộm hoàn toàn bằng nước lá cây rừng tự nhiên như lá cẩm, nghệ tươi và lá gừng.
        </p>
        <p>
          Năm màu xôi tượng trưng cho thuyết Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ), gửi gắm khát vọng về sự may mắn, mùa màng bội thu và gia đình hòa thuận. Từng hạt xôi bóng bẩy, dẻo thơm ngậy ăn kèm chút muối vừng thơm lừng.
        </p>
      </>
    ),
  },
  {
    id: "men-men",
    index: 3,
    title: "3. Men Men (Steamed Cornmeal)",
    titleVi: "3. Mèn Mén",
    img: "/guide/hagiang/hagiang-men-men.jpg",
    alt: "Men Men Ha Giang",
    desc: (
      <>
        <p>
          Because fertile rice paddies are scarce among the rocky limestone peaks, the H&apos;Mong cultivate hardy maize on cliffside crevices. Men Men is their cherished daily staple, prepared through an intricate process: local yellow corn kernels are stripped, stone-ground by hand into fine meal, moistened with water, and steamed twice in a traditional wooden steamer.
        </p>
        <p>
          The resulting steamed cornmeal is fluffy, nutty, and subtly sweet. It is customarily served with a comforting bowl of mustard green soup (canh cai meo) or added directly to bowls of hot pho and broth.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Bởi cao nguyên đá khan hiếm ruộng lúa nước, ngô vàng trồng trên những hốc đá tai mèo đã trở thành nguồn lương thực quý báu của đồng bào Mông. Mèn mén là món ăn chính được chế biến vô cùng kỳ công: hạt ngô tẻ già được xay nhỏ bằng cối đá thủ công, sàng sảy kỹ lưỡng, vẩy nước nhào đều rồi đồ chín tới hai lần trong chõ gỗ.
        </p>
        <p>
          Bát mèn mén tơi xốp, bùi bùi và ngọt dịu vị ngô vùng cao. Người Mông thường thưởng thức mèn mén cùng một bát canh rau cải mèo ngọt thanh hoặc thả vào bát phở nóng hổi đậm đà.
        </p>
      </>
    ),
  },
  {
    id: "buckwheat-cake",
    index: 4,
    title: "4. Buckwheat Cake (Banh Tam Giac Mach)",
    titleVi: "4. Bánh Tam Giác Mạch",
    img: "/guide/hagiang/hagiang-buckwheat-cake.jpg",
    alt: "Buckwheat Cake Ha Giang",
    desc: (
      <>
        <p>
          Buckwheat (Tam Giac Mach) is celebrated not only for painting the plateau in fairytale purple and pink blossoms each autumn, but also for its nutritious seeds. After harvesting, the triangular seeds are dried, ground into soft flour, kneaded with water, molded into palm-sized circular flatbreads, steamed, and then grilled over hot charcoal braziers.
        </p>
        <p>
          Fresh off the grill, the cakes feature a golden-brown crispy crust with a soft, warm, and subtly sweet, nutty interior with a hint of wild mountain herbs. They make the perfect snack while strolling through Dong Van and Meo Vac weekend markets.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Hoa tam giác mạch không chỉ dệt nên bức tranh thơ mộng cho cao nguyên mỗi độ thu về mà hạt của loài hoa này còn là nguyên liệu làm nên món bánh đặc sản nức tiếng. Hạt tam giác mạch sau thu hoạch được phơi khô, xay mịn thành bột, nhào nặn thành từng chiếc bánh tròn dày bản, hấp chín rồi nướng vàng ruộm trên bếp than hồng.
        </p>
        <p>
          Chiếc bánh nóng hổi vừa nướng xong có lớp vỏ giòn thơm, ruột mềm dẻo, vị ngọt bùi tự nhiên phảng phất hương vị thảo mộc của núi rừng. Thưởng thức miếng bánh tam giác mạch giữa phiên chợ Đồng Văn rộn rã là niềm vui giản dị của mọi du khách.
        </p>
      </>
    ),
  },
  {
    id: "aconite-root-congee",
    index: 5,
    title: "5. Aconite Root Congee (Chao Au Tau)",
    titleVi: "5. Cháo Ấu Tẩu",
    img: "/guide/hagiang/hagiang-aconite-root-congee.jpg",
    alt: "Chao Au Tau Ha Giang",
    desc: (
      <>
        <p>
          Chao Au Tau is a famous highland congee made from the tuberous roots of the aconite plant (au tau), which grows on high rocky summits. Although raw aconite is naturally toxic, highland chefs possess ancestral knowledge to detoxify it through soaking in rice water and simmering continuously for 12 to 14 hours until it turns into a soft, safe, and creamy paste.
        </p>
        <p>
          The congee is cooked with upland sticky rice, pork trotter broth, minced pork, and topped with scallions, perilla leaves, and a raw egg yolk. First-time tasters notice a gentle bitter note followed by a sweet, rich aftertaste. In traditional medicine, it is renowned for curing colds, soothing joints, and promoting deep sleep.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Cháo ấu tẩu là món cháo đêm đặc sản độc đáo được nấu từ củ ấu tẩu mọc hoang dã trên các mỏm núi đá cao. Dù củ ấu tẩu sống có độc tính, nhưng qua bàn tay bí truyền của người dân bản địa, củ được ngâm kỹ trong nước vo gạo đặc và ninh nhừ suốt 12 đến 14 tiếng để khử sạch độc tố, chuyển hóa thành vị thuốc bùi ngậy.
        </p>
        <p>
          Nồi cháo được nấu cùng gạo nếp nương, nước hầm chân giò béo ngậy, thịt băm nhuyễn, thêm hành hoa, lá tía tô và quả trứng gà béo ngậy. Vị đắng nhẹ đầu lưỡi nhanh chóng tan biến để lại hậu vị ngọt bùi sâu lắng, có tác dụng giải cảm, giảm nhức mỏi và hồi phục thể lực tuyệt vời.
        </p>
      </>
    ),
  },
  {
    id: "bac-me-com-lam",
    index: 6,
    title: "6. Bac Me Bamboo Tube Rice (Com Lam Bac Me)",
    titleVi: "6. Cơm Lam Bắc Mê",
    img: "/guide/hagiang/hagiang-bac-me-com-lam.jpg",
    alt: "Com Lam Bac Me Ha Giang",
    desc: (
      <>
        <p>
          Hailing from Bac Me district along the Gam River, Com Lam is fragrant mountain sticky rice packed into freshly cut young bamboo or neohouzeaua tubes (ong nua). Water from mountain streams and a pinch of salt are added, then the tube is plugged with banana leaves and gently turned over glowing embers until the bamboo husk chars.
        </p>
        <p>
          When peeled, the bamboo reveals a pure white cylinder encased in a delicate inner bamboo film. The rice absorbs the sweet scent of bamboo smoke and mountain water, and is best savored with grilled mountain pork or sesame salt.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Bắt nguồn từ vùng đất Bắc Mê bên dòng sông Gâm hiền hòa, Cơm lam Bắc Mê được chế biến từ những hạt nếp nương hạt mẩy, ngâm kỹ rồi cho vào ống nứa hoặc ống tre non còn đượm mùi hương rừng. Ống cơm được bịt kín bằng lá chuối rừng và nướng xoay đều trên bếp than hồng rực rỡ.
        </p>
        <p>
          Khi tước bỏ lớp vỏ tre cháy xém, cây cơm lam lộ ra lớp màng lụa mỏng trắng ngần bao bọc từng hạt cơm dẻo quánh. Vị ngọt thơm của gạo quyện cùng hương thơm thanh khiết của ống tre non ăn cùng muối vừng hoặc thịt lợn bản nướng thơm lừng tạo nên sức hấp dẫn khó cưỡng.
        </p>
      </>
    ),
  },
  {
    id: "thang-den",
    index: 7,
    title: "7. Thang Den (Ginger Glutinous Dumplings)",
    titleVi: "7. Thắng Dền",
    img: "/guide/hagiang/hagiang-thang-den.jpg",
    alt: "Thang Den Ha Giang",
    desc: (
      <>
        <p>
          Thang Den is a beloved winter dessert resembling floating rice dumplings (Banh Troi Nuoc). Skilled local cooks mold small, marble-sized balls from fragrant Yen Minh glutinous rice dough, some colored with beetroot or magenta leaves. The dumplings are boiled until they float to the surface, then ladled into warm bowls of ginger-infused cane sugar syrup.
        </p>
        <p>
          Garnished with toasted peanuts, roasted white sesame seeds, and shredded coconut, a hot bowl of Thang Den provides immediate warmth against the brisk highland winter breeze.
        </p>
      </>
    ),
    descVi: (
      <>
        <p>
          Thắng dền là thức quà vặt ngọt ngào sưởi ấm những đêm đông buốt giá trên cao nguyên đá. Bánh được nặn từ bột gạo nếp Yên Minh dẻo thơm thành những viên tròn nhỏ nhắn cỡ ngón tay cái, luộc trong nồi nước sôi sùng sục cho đến khi bánh nổi lên trắng muốt rồi vớt ra chan ngập nước đường phèn nấu gừng già cay ấm.
        </p>
        <p>
          Rắc thêm chút lạc rang giã giập, mè trắng bùi ngậy và vài sợi dừa tươi nạo sợi, bát thắng dền thơm lừng vị gừng, ngọt thanh của mật mía xua tan hoàn toàn cái lạnh tê tái của đêm phố cổ Đồng Văn.
        </p>
      </>
    ),
  },
];

export default function HaGiangDestinationPage() {
  const [lang, setLang] = useState("en");
  const isVi = lang === "vi";

  useEffect(() => {
    setLang(getLang());
    const handleStorage = () => setLang(getLang());
    const handleLang = (e) => setLang(e?.detail || getLang());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("vinatap:lang-updated", handleLang);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("vinatap:lang-updated", handleLang);
    };
  }, []);

  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [activeToc, setActiveToc] = useState("ha-giang-at-a-glance");

  // Track active section for TOC
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "ha-giang-at-a-glance",
        "ha-giang-tourist-map",
        "ha-giang-weather",
        "how-to-go-from-hanoi-to-ha-giang",
        "where-to-stay-in-ha-giang",
        "top-9-must-visit-attractions",
        "top-7-must-try-dishes",
        "cultural-markets",
      ];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveToc(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="vnn-hagiang-page">
      {/* ── Standard PublicHeader (Progress bar, Companion trigger, No login button) ── */}
      <PublicHeader onBannerClick={() => setAiCompanionOpen(true)} />

      {/* ── Hero Section ── */}
      <header
        className="vnn-hagiang-hero"
        style={{
          backgroundImage: "url('/guide/hagiang/hagiang-hero.jpg')",
        }}
      >
        <div className="vnn-hagiang-hero__overlay" />
        <div className="vnn-hagiang-hero__content">
          <div className="vnn-hagiang-hero__badges">
            <span className="vnn-hagiang-hero__badge">
              {isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}
            </span>
            <span className="vnn-hagiang-hero__badge">
              {isVi ? "MIỀN BẮC" : "NORTHERN VIETNAM"}
            </span>
            <span className="vnn-hagiang-hero__badge">
              {isVi ? "HÀ GIANG" : "HA GIANG"}
            </span>
          </div>

          <h1 className="vnn-hagiang-hero__title">
            {isVi ? "Hà Giang" : "Ha Giang"}
          </h1>

          <div className="vnn-hagiang-hero__meta">
            <span>By VinaTap</span>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="vnn-hagiang-layout">
        {/* Left Column: Full Editorial Content */}
        <main className="vnn-hagiang-article">

          {/* Intro lead */}
          <p className="vnn-hagiang-lead">
            {isVi ? (
              <>
                <strong>Hà Giang</strong> là viên ngọc quý nguyên sơ nằm ở cực Bắc của Tổ quốc, nơi những ngọn núi đá vôi hùng vĩ chạm tới mây trời, những cung đường đèo uốn lượn ngoạn mục và những bản làng mộc mạc lưu giữ bản sắc ngàn đời của đồng bào dân tộc thiểu số. Không có những khu nghỉ dưỡng xa hoa, Hà Giang chinh phục trái tim người lữ hành bằng vẻ đẹp thiên nhiên kỳ vĩ đến nghẹt thở và sự nồng hậu, chân thành của con người vùng cao.
              </>
            ) : (
              <>
                <strong>Ha Giang</strong> is a hidden gem for those seeking an unforgettable adventure along the less-traveled road. Nestled in the mountainous region of the far North, Ha Giang is home to towering limestone karsts, heart-racing mountain passes, and vibrant hill tribes. Raw, authentic, and awe-inspiring, Ha Giang wins every traveler&apos;s heart with jaw-dropping vistas and heartwarming cultural interactions.
              </>
            )}
          </p>

          {/* ── SECTION 1: HA GIANG AT A GLANCE ── */}
          <section id="ha-giang-at-a-glance">
            <h2 className="vnn-hagiang-sec-title">
              <Compass size={24} color="#00c2cb" />
              {isVi ? "Hà Giang nhìn từ tổng quan" : "Ha Giang at a glance"}
            </h2>

            <div className="vnn-hagiang-img-box">
              <img
                src="/guide/hagiang/hagiang-overview.jpg"
                alt="Ha Giang Overview Landscape"
                loading="lazy"
              />
              <div className="vnn-hagiang-img-caption">
                {isVi
                  ? "Cảnh sắc thiên nhiên kỳ vĩ trên Cao nguyên đá Hà Giang"
                  : "Majestic limestone landscape across the Ha Giang Plateau"}
              </div>
            </div>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Hà Giang là tỉnh miền núi địa đầu cực Bắc Việt Nam, có đường biên giới giáp Trung Quốc dài hơn 277 km. Tỉnh giáp với Cao Bằng ở phía đông, Yên Bái và Lào Cai ở phía tây, Tuyên Quang ở phía nam. Trung tâm hành chính là Thành phố Hà Giang, cách thủ đô Hà Nội khoảng 300 km theo Quốc lộ 2.
                </>
              ) : (
                <>
                  Ha Giang is the northernmost province of Vietnam, sharing a 277-km border with China to the north. It borders Cao Bang in the east, Yen Bai and Lao Cai in the west, and Tuyen Quang in the south. The provincial center is Ha Giang City, situated approximately 300 km north of Hanoi via National Highway 2.
                </>
              )}
            </p>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Địa hình Hà Giang mang tính phân hóa sâu sắc với hệ thống núi non trùng điệp, thung lũng sâu thẳm và cao nguyên đá vôi hiểm trở. Nơi đây là mái nhà chung của hơn 22 dân tộc anh em như H&apos;Mông, Tày, Dao, Giáy, Lô Lô, Pà Thẻn..., mỗi dân tộc gìn giữ những phong tục tập quán, kiến trúc nhà trình tường và trang phục thổ cẩm độc đáo.
                </>
              ) : (
                <>
                  The terrain is dominated by rugged limestone mountains, dramatic canyons, and high plateaus. Ha Giang is home to over 22 distinct ethnic minority groups including the H&apos;Mong, Tay, Dao, Giay, and Lo Lo, each preserving their centuries-old traditions, earthen architecture, and vibrant festive costumes.
                </>
              )}
            </p>

            <div className="vnn-hagiang-infobox">
              <strong>{isVi ? "Điểm nổi bật nhất:" : "Key Highlights:"}</strong>{" "}
              {isVi
                ? "Công viên Địa chất Toàn cầu Cao nguyên đá Đồng Văn (UNESCO), Đèo Mã Pí Lèng, Cột cờ Lũng Cú, Hẻm vực Tu Sản & Sông Nho Quế, Dinh thự Vua Mèo, Thung lũng Sủng Là."
                : "Dong Van Karst Plateau UNESCO Global Geopark, Ma Pi Leng Pass, Lung Cu National Flagpole, Tu San Canyon on Nho Que River, Vuong Palace, and Sung La Valley."}
            </div>
          </section>

          {/* ── SECTION 2: TOURIST MAP ── */}
          <section id="ha-giang-tourist-map">
            <h2 className="vnn-hagiang-sec-title">
              <MapPin size={24} color="#00c2cb" />
              {isVi ? "Bản đồ du lịch Hà Giang" : "Ha Giang tourist map"}
            </h2>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Để chinh phục Hà Giang thuận lợi nhất, du khách thường theo cung đường &ldquo;Ha Giang Loop&rdquo; kinh điển kéo dài từ 3 đến 5 ngày: khởi hành từ TP. Hà Giang qua Quản Bạ (Cổng Trời, Núi Đôi Cô Tiên), rừng thông Yên Minh, phố cổ Đồng Văn, đèo Mã Pí Lèng sang Mèo Vạc, rồi trở về qua Du Già hoang sơ.
                </>
              ) : (
                <>
                  To explore Ha Giang seamlessly, travelers typically follow the legendary 3-to-5-day &ldquo;Ha Giang Loop&rdquo; itinerary: beginning in Ha Giang City, traversing Quan Ba Heaven Gate and Fairy Hills, the pine forests of Yen Minh, Dong Van Old Quarter, Ma Pi Leng Pass to Meo Vac, and looping back through the pristine waterfalls of Du Gia.
                </>
              )}
            </p>

            <div className="vnn-hagiang-img-box">
              <img
                src="/guide/hagiang/hagiang-tourist-map.jpg"
                alt="Ha Giang Detailed Tourist Map"
                loading="lazy"
              />
              <div className="vnn-hagiang-img-caption">
                {isVi
                  ? "Bản đồ các điểm du lịch trọng điểm trên cung đường Hà Giang"
                  : "Detailed tourist map showing key destinations on the Ha Giang Loop"}
              </div>
            </div>
          </section>

          {/* ── SECTION 3: WEATHER ── */}
          <section id="ha-giang-weather">
            <h2 className="vnn-hagiang-sec-title">
              <Sun size={24} color="#00c2cb" />
              {isVi ? "Thời tiết & Mùa đẹp nhất tại Hà Giang" : "Ha Giang weather"}
            </h2>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Hà Giang đẹp bốn mùa, mỗi thời điểm trong năm lại mang một vẻ đẹp quyến rũ riêng biệt. Tùy thuộc vào sở thích ngắm hoa, săn mây hay chiêm ngưỡng ruộng bậc thang mùa lúa chín, bạn có thể lựa chọn thời điểm lý tưởng cho chuyến đi của mình:
                </>
              ) : (
                <>
                  Ha Giang is stunning all year round, with each season offering distinct scenery and experiences. Depending on whether you wish to see blooming flowers, chase ethereal clouds, or admire golden terraced rice fields, here is what each season brings:
                </>
              )}
            </p>

            <div className="vnn-hagiang-season-grid">
              <div className="vnn-hagiang-season-card">
                <div className="vnn-hagiang-season-card__header">
                  <span className="vnn-hagiang-season-card__title">
                    {isVi ? "Mùa Xuân (Tháng 1 - 3)" : "Spring (Jan - Mar)"}
                  </span>
                  <span className="vnn-hagiang-season-card__badge">
                    {isVi ? "Mùa hoa xuân" : "Flower Blossoms"}
                  </span>
                </div>
                <p className="vnn-hagiang-season-card__desc">
                  {isVi
                    ? "Sắc đào phai, hoa lê và hoa mận trắng muốt bung nở khắp các sườn đồi, tạo nên không gian thơ mộng rực rỡ bên những ngôi nhà trình tường cổ kính."
                    : "Pink peach blossoms, white plum, and pear flowers carpet mountain slopes, creating a fairytale atmosphere around rustic earthen homes."}
                </p>
              </div>

              <div className="vnn-hagiang-season-card">
                <div className="vnn-hagiang-season-card__header">
                  <span className="vnn-hagiang-season-card__title">
                    {isVi ? "Mùa Hè (Tháng 4 - 6)" : "Summer (Apr - Jun)"}
                  </span>
                  <span className="vnn-hagiang-season-card__badge">
                    {isVi ? "Mùa nước đổ" : "Watering Season"}
                  </span>
                </div>
                <p className="vnn-hagiang-season-card__desc">
                  {isVi
                    ? "Mùa nước đổ lấp lánh như gương trên ruộng bậc thang Hoàng Su Phì. Đặc biệt, ngày 27/3 âm lịch diễn ra Chợ tình Khâu Vai trăm năm nổi tiếng."
                    : "Water fills terraced fields in Hoang Su Phi like giant cascading mirrors. The legendary Khau Vai Love Market takes place on the 27th of the 3rd lunar month."}
                </p>
              </div>

              <div className="vnn-hagiang-season-card">
                <div className="vnn-hagiang-season-card__header">
                  <span className="vnn-hagiang-season-card__title">
                    {isVi ? "Mùa Thu (Tháng 9 - 10)" : "Autumn (Sep - Oct)"}
                  </span>
                  <span className="vnn-hagiang-season-card__badge">
                    {isVi ? "Mùa lúa chín vàng" : "Golden Harvest"}
                  </span>
                </div>
                <p className="vnn-hagiang-season-card__desc">
                  {isVi
                    ? "Thời điểm vàng để chiêm ngưỡng những tầng ruộng bậc thang Hoàng Su Phì ngả vàng óng ả, thời tiết thu mát mẻ, trời trong xanh cực kỳ lý tưởng."
                    : "Peak season to admire golden cascading rice terraces in Hoang Su Phi. Cool, pleasant autumn breezes and crystal clear skies make travel idyllic."}
                </p>
              </div>

              <div className="vnn-hagiang-season-card">
                <div className="vnn-hagiang-season-card__header">
                  <span className="vnn-hagiang-season-card__title">
                    {isVi ? "Mùa Đông (Tháng 10 - 12)" : "Winter (Oct - Dec)"}
                  </span>
                  <span className="vnn-hagiang-season-card__badge">
                    {isVi ? "Hoa tam giác mạch" : "Buckwheat Flowers"}
                  </span>
                </div>
                <p className="vnn-hagiang-season-card__desc">
                  {isVi
                    ? "Mùa hoa tam giác mạch hồng tím nở rộ bạt ngàn khắp các thung lũng Đồng Văn, Mèo Vạc. Cuối đông có hoa cải vàng và không khí sương lạnh kỳ ảo."
                    : "Iconic buckwheat flowers blanket the valleys in pink and violet hues, followed by yellow mustard blooms and crisp mountain mists."}
                </p>
              </div>
            </div>

            <div className="vnn-hagiang-img-box">
              <img
                src="/guide/hagiang/hagiang-weather.jpg"
                alt="Ha Giang Weather and Roads"
                loading="lazy"
              />
              <div className="vnn-hagiang-img-caption">
                {isVi
                  ? "Cung đường đèo uốn lượn giữa mây trời và núi non hùng vĩ"
                  : "Winding highland road cutting through ethereal mountain clouds"}
              </div>
            </div>
          </section>

          {/* ── SECTION 4: HOW TO GO FROM HANOI TO HA GIANG ── */}
          <section id="how-to-go-from-hanoi-to-ha-giang">
            <h2 className="vnn-hagiang-sec-title">
              <Bus size={24} color="#00c2cb" />
              {isVi ? "Cách di chuyển từ Hà Nội đi Hà Giang" : "How to go from Hanoi to Ha Giang?"}
            </h2>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Hà Giang cách trung tâm Hà Nội khoảng 300 km. Tuyến đường thuận tiện và an toàn nhất hiện nay là đi theo cao tốc Hà Nội – Lào Cai (rẽ tại nút IC9 thị xã Phú Thọ) hoặc theo Quốc lộ 2 qua Tuyên Quang. Thời gian di chuyển dao động từ 6 đến 7 tiếng đồng hồ.
                </>
              ) : (
                <>
                  Ha Giang is about 300 km from central Hanoi. The most modern and popular route follows the Hanoi - Lao Cai Highway (exiting at IC9 Phu Tho) or National Highway 2 via Tuyen Quang. Total travel time is approximately 6 to 7 hours.
                </>
              )}
            </p>

            <div className="vnn-hagiang-transport-grid">
              <div className="vnn-hagiang-transport-card">
                <div className="vnn-hagiang-transport-icon">
                  <Bus size={22} />
                </div>
                <h4 className="vnn-hagiang-transport-title">
                  {isVi ? "Xe khách & Limousine" : "Sleeper & VIP Limousine"}
                </h4>
                <p className="vnn-hagiang-transport-desc">
                  {isVi
                    ? "Xe giường nằm hoặc cabin cung điện xuất phát từ bến xe Mỹ Đình/Gia Lâm lúc 21h-22h, đến TP. Hà Giang vào sáng sớm. Giá vé từ 250.000 – 350.000 VNĐ."
                    : "Overnight cabin buses depart My Dinh / Gia Lam at 9-10 PM and arrive at dawn. Comfortable and affordable (250,000 - 350,000 VND / $11 - $15)."}
                </p>
              </div>

              <div className="vnn-hagiang-transport-card">
                <div className="vnn-hagiang-transport-icon">
                  <Compass size={22} />
                </div>
                <h4 className="vnn-hagiang-transport-title">
                  {isVi ? "Phượt xe máy" : "Motorbike Adventure"}
                </h4>
                <p className="vnn-hagiang-transport-desc">
                  {isVi
                    ? "Dành cho những tay lái giàu kinh nghiệm. Bạn cũng có thể đi xe khách lên TP. Hà Giang rồi thuê xe máy (150.000 – 200.000 VNĐ/ngày) để trải nghiệm Loop."
                    : "For seasoned riders. Alternatively, take a bus to Ha Giang City and rent a semi-automatic or manual motorbike (150,000 - 200,000 VND/day) for the Loop."}
                </p>
              </div>

              <div className="vnn-hagiang-transport-card">
                <div className="vnn-hagiang-transport-icon">
                  <Mountain size={22} />
                </div>
                <h4 className="vnn-hagiang-transport-title">
                  {isVi ? "Tour trọn gói có tài xế" : "Easy Rider / Private Tour"}
                </h4>
                <p className="vnn-hagiang-transport-desc">
                  {isVi
                    ? "Lựa chọn lý tưởng nhất cho du khách quốc tế: ngồi sau xe máy cùng tài xế người bản địa (Easy Rider) hoặc thuê ô tô riêng có tài xế am hiểu cung đường."
                    : "The most popular choice for travelers: sit behind an experienced local 'Easy Rider' guide or hire a private vehicle to enjoy the views safely."}
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 5: WHERE TO STAY ── */}
          <section id="where-to-stay-in-ha-giang">
            <h2 className="vnn-hagiang-sec-title">
              <Mountain size={24} color="#00c2cb" />
              {isVi ? "Nơi lưu trú ở Hà Giang" : "Where to stay in Ha Giang?"}
            </h2>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Dọc theo cung đường khám phá Hà Giang, dịch vụ lưu trú ngày càng phát triển đa dạng từ khách sạn tiện nghi đến các homestay văn hóa đậm chất vùng cao:
                </>
              ) : (
                <>
                  Along the Ha Giang Loop, accommodation options range from comfortable modern hotels in major towns to authentic ethnic cultural homestays nestled among the mountains:
                </>
              )}
            </p>

            <ul style={{ paddingLeft: "24px", lineHeight: 1.9, fontSize: "15px", color: "#334155" }}>
              <li>
                <strong>{isVi ? "TP. Hà Giang:" : "Ha Giang City:"}</strong>{" "}
                {isVi
                  ? "Phoenix Hotel (khách sạn 4 sao), Ha Giang Historic House, Jasmine Hostel."
                  : "Phoenix Hotel (4-star), Ha Giang Historic House, Jasmine Hostel."}
              </li>
              <li>
                <strong>{isVi ? "Đồng Văn:" : "Dong Van Town:"}</strong>{" "}
                {isVi
                  ? "Hoa Cuong Hotel, Dong Van B&B, H&apos;Mong Homestay, Nhà Cổ Homestay."
                  : "Hoa Cuong Hotel, Dong Van B&B, H&apos;Mong Homestay, Nha Co Homestay."}
              </li>
              <li>
                <strong>{isVi ? "Mèo Vạc:" : "Meo Vac:"}</strong>{" "}
                {isVi
                  ? "Làng văn hóa du lịch cộng đồng dân tộc Mông Pả Vi (tập trung hàng chục homestay xinh đẹp như Auberge de Meo Vac, Meo Vac Clay House, Pa Vi Homestay)."
                  : "Pa Vi H'Mong Community Cultural Tourism Village (featuring dozens of scenic lodges like Auberge de Meo Vac, Meo Vac Clay House, Pa Vi Homestay)."}
              </li>
              <li>
                <strong>{isVi ? "Du Già & Yên Minh:" : "Du Gia & Yen Minh:"}</strong>{" "}
                {isVi
                  ? "Du Gia Homestay, Du Gia Panorama, Tom&apos;s Du Gia Homestay bên suối nước mát lành."
                  : "Du Gia Homestay, Du Gia Panorama, Tom's Du Gia Homestay beside refreshing waterfalls and rivers."}
              </li>
            </ul>

            <div className="vnn-hagiang-img-box">
              <img
                src="/guide/hagiang/hagiang-accommodations.jpg"
                alt="Ha Giang Accommodations and Lodges"
                loading="lazy"
              />
              <div className="vnn-hagiang-img-caption">
                {isVi
                  ? "Khu homestay nghỉ dưỡng truyền thống tại Làng văn hóa Pả Vi, Mèo Vạc"
                  : "Traditional eco-lodge architecture at Pa Vi Cultural Village, Meo Vac"}
              </div>
            </div>
          </section>

          {/* ── SECTION 6: TOP 9 ATTRACTIONS ── */}
          <section id="top-9-must-visit-attractions">
            <h2 className="vnn-hagiang-sec-title">
              <CheckCircle size={24} color="#00c2cb" />
              {isVi ? "9 điểm tham quan không thể bỏ qua ở Hà Giang" : "Top 9 must-visit attractions in Ha Giang"}
            </h2>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Có thể bạn đã từng chiêm ngưỡng nhiều bức ảnh tuyệt mỹ về Hà Giang, nhưng không từ ngữ nào có thể diễn tả hết vẻ đẹp kỳ vĩ cho đến khi bạn tự mình tận mắt chứng kiến. Dưới đây là 9 địa danh mang tính biểu tượng nhất định phải ghé thăm:
                </>
              ) : (
                <>
                  You may have seen countless photographs of Ha Giang, but words fail to capture its true majesty until you witness it with your own eyes. Here are the top 9 iconic attractions you cannot miss:
                </>
              )}
            </p>

            {HA_GIANG_9_ATTRACTIONS.map((item) => (
              <article key={item.id} id={item.id} className="vnn-hagiang-item-card">
                <h3 className="vnn-hagiang-item-title">
                  {isVi ? item.titleVi : item.title}
                </h3>

                <div className="vnn-hagiang-img-box">
                  <img src={item.img} alt={item.alt} loading="lazy" />
                  <div className="vnn-hagiang-img-caption">
                    {isVi ? item.titleVi : item.title} - Ha Giang
                  </div>
                </div>

                <div className="vnn-hagiang-text">
                  {isVi ? item.descVi : item.desc}
                </div>

                {item.tip && (
                  <div className="vnn-hagiang-infobox">
                    <strong>{isVi ? "Mẹo du lịch:" : "Traveler Tip:"}</strong>{" "}
                    {isVi ? item.tipVi : item.tip}
                  </div>
                )}

                <div className="vnn-hagiang-item-meta">
                  <span>
                    <MapPin size={15} color="#00c2cb" />
                    {isVi ? item.locationVi : item.location}
                  </span>
                </div>
              </article>
            ))}
          </section>

          {/* ── SECTION 7: TOP 7 DISHES ── */}
          <section id="top-7-must-try-dishes">
            <h2 className="vnn-hagiang-sec-title">
              <Utensils size={24} color="#00c2cb" />
              {isVi ? "Top 7 món ngon đặc sản nhất định phải thử" : "Top 7 must-try dishes in Ha Giang"}
            </h2>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Hành trình du lịch Hà Giang không chỉ là chiêm ngưỡng non nước cao nguyên đá mà còn là dịp để bạn khám phá thế giới ẩm thực phong phú, độc đáo đậm đà phong vị bản địa:
                </>
              ) : (
                <>
                  Traveling to Ha Giang is not only about taking in the natural wonders of the rocky plateau, but also about discovering a rich, rustic cuisine shaped by the indigenous mountain culture:
                </>
              )}
            </p>

            {HA_GIANG_7_DISHES.map((dish) => (
              <article key={dish.id} id={dish.id} className="vnn-hagiang-item-card">
                <h3 className="vnn-hagiang-item-title">
                  {isVi ? dish.titleVi : dish.title}
                </h3>

                <div className="vnn-hagiang-img-box">
                  <img src={dish.img} alt={dish.alt} loading="lazy" />
                  <div className="vnn-hagiang-img-caption">
                    {isVi ? dish.titleVi : dish.title} - Ha Giang Specialty
                  </div>
                </div>

                <div className="vnn-hagiang-text">
                  {isVi ? dish.descVi : dish.desc}
                </div>
              </article>
            ))}
          </section>

          {/* ── SECTION 8: CULTURAL MARKETS ── */}
          <section id="cultural-markets">
            <h2 className="vnn-hagiang-sec-title">
              <Sparkles size={24} color="#00c2cb" />
              {isVi ? "Các phiên chợ vùng cao độc đáo ở Hà Giang" : "The unique cultural markets in Ha Giang"}
            </h2>

            <div className="vnn-hagiang-img-box">
              <img
                src="/guide/hagiang/hagiang-cultural-markets.jpg"
                alt="Ha Giang Cultural Market"
                loading="lazy"
              />
              <div className="vnn-hagiang-img-caption">
                {isVi
                  ? "Sắc màu rực rỡ tại phiên chợ vùng cao Đồng Văn"
                  : "Vibrant colors and lively atmosphere at Dong Van Sunday Market"}
              </div>
            </div>

            <p className="vnn-hagiang-text">
              {isVi ? (
                <>
                  Cũng như các tỉnh miền núi Tây Bắc, chợ phiên là nét sinh hoạt văn hóa đặc sắc và sống động nhất tại Hà Giang. Đây không chỉ đơn thuần là nơi trao đổi, mua bán gia súc, nông sản, vải vóc thổ cẩm hay nông cụ, mà còn là ngày hội ngộ của các chàng trai cô gái, các gia đình đồng bào dân tộc trong những bộ trang phục đẹp nhất.
                </>
              ) : (
                <>
                  Like other provinces across northern Vietnam, highland markets (cho phien) are the most vibrant cultural pulse of Ha Giang. They are not merely commercial venues for trading livestock, mountain herbs, textiles, and tools, but joyful social festivals where hill-tribe families and youths gather dressed in their finest handmade attire.
                </>
              )}
            </p>

            <ul style={{ paddingLeft: "24px", lineHeight: 1.9, fontSize: "15px", color: "#334155" }}>
              <li>
                <strong>{isVi ? "Chợ phiên Đồng Văn & Mèo Vạc:" : "Dong Van & Meo Vac Markets:"}</strong>{" "}
                {isVi
                  ? "Họp vào sáng Chủ Nhật hàng tuần. Quy mô lớn nhất, quy tụ đông đảo người Mông, Dao, Giáy, Tày với các khu vực bán thắng cố, rượu ngô, thổ cẩm và gia súc nhộn nhịp."
                  : "Held every Sunday morning. The largest and most famous markets, packed with traders selling Thang Co, corn wine, intricate textiles, and livestock."}
              </li>
              <li>
                <strong>{isVi ? "Chợ tình Khâu Vai:" : "Khau Vai Love Market:"}</strong>{" "}
                {isVi
                  ? "Chỉ họp duy nhất một lần trong năm vào ngày 27 tháng 3 âm lịch tại xã Khâu Vai, huyện Mèo Vạc. Phiên chợ huyền thoại nơi những người từng yêu nhau nhưng không đến được với nhau tìm về gặp lại, hàn huyên ôn kỷ niệm xưa trong sự tôn trọng của vợ chồng."
                  : "Held only once a year on the 27th of the 3rd lunar month in Meo Vac. A legendary centuried-old market where separated lovers reunite for one night with mutual respect from their spouses."}
              </li>
              <li>
                <strong>{isVi ? "Các phiên chợ lùi (6 ngày họp 1 lần):" : "Rotating 'Backward' Markets (Cho Lui):"}</strong>{" "}
                {isVi
                  ? "Chợ Lũng Phìn (ngày Dần, Thân), chợ Sà Phìn (ngày Tỵ, Hợi), chợ Phố Cáo (ngày Thìn, Tuất), chợ Phố Bảng (ngày Tý, Ngọ). Mỗi tuần phiên chợ lại lùi lại một ngày so với tuần trước theo can chi cổ truyền."
                  : "Lung Phin, Sa Phin, Pho Cao, and Pho Bang markets rotate every 6 days based on the lunar zodiac calendar, preserving timeless tribal customs."}
              </li>
            </ul>
          </section>

          {/* ── Related Guides ── */}
          <section style={{ marginTop: "48px", paddingTop: "32px", borderTop: "2px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px", color: "#0f172a" }}>
              {isVi ? "Bài viết du lịch liên quan" : "Related Travel Guides"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <Link href="/guide/hanoi-tourist-map" style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img src="/guide/hanoi/hanoi-tourist-map-hd.jpg" alt="Hanoi Tourist Map" style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                  <div style={{ padding: "12px" }}>
                    <h5 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: "#0f172a" }}>Hanoi Tourist Map</h5>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Essential Sights & Routes</span>
                  </div>
                </div>
              </Link>

              <Link href="/guide/the-15-best-attractions-in-dalat" style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img src="/guide/dalat/dalat-15-attractions-hd.jpg" alt="Dalat Attractions" style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                  <div style={{ padding: "12px" }}>
                    <h5 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: "#0f172a" }}>The 15 Best Attractions in Dalat</h5>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>City of Eternal Spring</span>
                  </div>
                </div>
              </Link>

              <Link href="/guide/20-best-things-to-do-in-vietnam" style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img src="/guide/megamenu/inspired-4.jpg" alt="20 Best Things to Do in Vietnam" style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                  <div style={{ padding: "12px" }}>
                    <h5 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: "#0f172a" }}>20 Best Things to Do in Vietnam</h5>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Ultimate Bucket List</span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </main>

        {/* Right Column: Sticky Sidebar with TOC & Quick Facts */}
        <aside className="vnn-hagiang-sidebar">
          {/* Table of Contents Widget */}
          <div className="vnn-hagiang-widget">
            <h3 className="vnn-hagiang-widget__title">
              <BookOpen size={18} color="#00c2cb" />
              {isVi ? "Mục lục bài viết" : "Contents"}
            </h3>
            <ul className="vnn-hagiang-toc-list">
              <li>
                <a
                  href="#ha-giang-at-a-glance"
                  className={`vnn-hagiang-toc-link ${activeToc === "ha-giang-at-a-glance" ? "active" : ""}`}
                >
                  {isVi ? "1. Hà Giang nhìn từ tổng quan" : "1. Ha Giang at a glance"}
                </a>
              </li>
              <li>
                <a
                  href="#ha-giang-tourist-map"
                  className={`vnn-hagiang-toc-link ${activeToc === "ha-giang-tourist-map" ? "active" : ""}`}
                >
                  {isVi ? "2. Bản đồ du lịch Hà Giang" : "2. Ha Giang tourist map"}
                </a>
              </li>
              <li>
                <a
                  href="#ha-giang-weather"
                  className={`vnn-hagiang-toc-link ${activeToc === "ha-giang-weather" ? "active" : ""}`}
                >
                  {isVi ? "3. Thời tiết & Mùa đẹp nhất" : "3. Ha Giang weather"}
                </a>
              </li>
              <li>
                <a
                  href="#how-to-go-from-hanoi-to-ha-giang"
                  className={`vnn-hagiang-toc-link ${activeToc === "how-to-go-from-hanoi-to-ha-giang" ? "active" : ""}`}
                >
                  {isVi ? "4. Cách di chuyển từ Hà Nội" : "4. How to go from Hanoi"}
                </a>
              </li>
              <li>
                <a
                  href="#where-to-stay-in-ha-giang"
                  className={`vnn-hagiang-toc-link ${activeToc === "where-to-stay-in-ha-giang" ? "active" : ""}`}
                >
                  {isVi ? "5. Nơi lưu trú ở Hà Giang" : "5. Where to stay in Ha Giang"}
                </a>
              </li>
              <li>
                <a
                  href="#top-9-must-visit-attractions"
                  className={`vnn-hagiang-toc-link ${activeToc === "top-9-must-visit-attractions" ? "active" : ""}`}
                >
                  {isVi ? "6. 9 điểm tham quan hàng đầu" : "6. Top 9 must-visit attractions"}
                </a>
              </li>
              <li>
                <a
                  href="#top-7-must-try-dishes"
                  className={`vnn-hagiang-toc-link ${activeToc === "top-7-must-try-dishes" ? "active" : ""}`}
                >
                  {isVi ? "7. 7 món ngon đặc sản" : "7. Top 7 must-try dishes"}
                </a>
              </li>
              <li>
                <a
                  href="#cultural-markets"
                  className={`vnn-hagiang-toc-link ${activeToc === "cultural-markets" ? "active" : ""}`}
                >
                  {isVi ? "8. Chợ phiên vùng cao độc đáo" : "8. Unique cultural markets"}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Facts Widget */}
          <div className="vnn-hagiang-widget">
            <h3 className="vnn-hagiang-widget__title">
              <Compass size={18} color="#00c2cb" />
              {isVi ? "Thông tin nhanh" : "Fast Facts"}
            </h3>
            <ul className="vnn-hagiang-facts-list">
              <li className="vnn-hagiang-fact-item">
                <span className="vnn-hagiang-fact-label">{isVi ? "Khu vực" : "Region"}</span>
                <span className="vnn-hagiang-fact-value">{isVi ? "Đông Bắc Bộ" : "Northeast Vietnam"}</span>
              </li>
              <li className="vnn-hagiang-fact-item">
                <span className="vnn-hagiang-fact-label">{isVi ? "Khoảng cách từ Hà Nội" : "Distance from Hanoi"}</span>
                <span className="vnn-hagiang-fact-value">~300 km (6 - 7 hrs)</span>
              </li>
              <li className="vnn-hagiang-fact-item">
                <span className="vnn-hagiang-fact-label">{isVi ? "Độ cao trung bình" : "Avg Elevation"}</span>
                <span className="vnn-hagiang-fact-value">1,000 - 1,600 m</span>
              </li>
              <li className="vnn-hagiang-fact-item">
                <span className="vnn-hagiang-fact-label">{isVi ? "Thời gian lý tưởng" : "Best Season"}</span>
                <span className="vnn-hagiang-fact-value">{isVi ? "Tháng 9 - Tháng 4" : "Sep to Apr"}</span>
              </li>
              <li className="vnn-hagiang-fact-item">
                <span className="vnn-hagiang-fact-label">{isVi ? "Dân tộc thiểu số" : "Ethnic Groups"}</span>
                <span className="vnn-hagiang-fact-value">22 ({isVi ? "H'Mông, Tày, Dao..." : "H'Mong, Tay, Dao..."})</span>
              </li>
              <li className="vnn-hagiang-fact-item">
                <span className="vnn-hagiang-fact-label">{isVi ? "Cung đường nổi tiếng" : "Iconic Route"}</span>
                <span className="vnn-hagiang-fact-value">Ha Giang Loop (350 km)</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Public Footer ── */}
      <PublicFooter />

      {/* ── Floating Province AI Chatbot ── */}
      <ProvinceChatbot
        provinceName={isVi ? "Hà Giang" : "Ha Giang"}
        provinceSlug="ha-giang"
        isOpenExternal={aiCompanionOpen}
        onCloseExternal={() => setAiCompanionOpen(false)}
      />
    </div>
  );
}
