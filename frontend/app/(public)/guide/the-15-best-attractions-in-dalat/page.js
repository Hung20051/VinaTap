"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import { Sparkles, MapPin } from "lucide-react";
import "@/styles/home.css";
import "@/styles/hcmc-10-things.css";

// ─── 15 BEST DALAT ATTRACTIONS DATA ───
const DALAT_15_ATTRACTIONS = [
  {
    id: "xuan-huong-lake",
    index: 1,
    title: "1. Xuan Huong Lake",
    titleVi: "1. Hồ Xuân Hương",
    img: "/guide/dalat/dalat-xuan-huong-lake.jpg",
    alt: "Xuan Huong Lake Dalat",
    desc: (
      <>
        You know you are in Dalat city when a view of Xuan Huong Lake is in your sight. This is a man-made crescent lake, built by order of the French Ambassador in Dalat at that time by directing water from the nearby Cam Ly Waterfall. Back then, the lake was named Grand Lac, and not until 1953 was it renamed with a pure Vietnamese name – Xuan Huong. There are a few interpretations of this poetic name. However, our favorite is its direct translation which means &ldquo;The Spring Fragrance.&rdquo; Xuan Huong Lake is not only an ideal spot for sightseeing but also a complex with many iconic cafes and restaurants. We recommend you sit at one of the cafes to appreciate how the still lake reflects its natural surroundings on its glass surface and how the peaceful life of Dalat people revolves around this poetic waterbody. You will also find a boat station at one point of the lake, where you can rent a swan boat and paddle around the lake to enjoy the nice breeze and see the city from a different point of view. The cost of renting a boat ranges from 25,000 VND to 50,000 VND ($1.05 to $2.1) per hour, depending on the size of the boat.
      </>
    ),
    descVi: (
      <>
        Bạn sẽ nhận ra mình đã thực sự đặt chân đến Đà Lạt khi hình ảnh Hồ Xuân Hương hiện ra trước mắt. Đây là một hồ nước nhân tạo hình trăng khuyết, được xây dựng theo chỉ thị của quan chức Pháp thời bấy giờ bằng cách ngăn dòng chảy từ thác Cam Ly gần đó. Thời kỳ đầu, hồ mang tên Grand Lac, mãi đến năm 1953 mới được đổi sang tên thuần Việt – Xuân Hương. Có nhiều cách hiểu về cái tên đầy chất thơ này, nhưng đẹp nhất vẫn là ý nghĩa &ldquo;Hương sắc mùa xuân&rdquo;. Hồ Xuân Hương không chỉ là điểm ngắm cảnh lý tưởng mà còn là quần thể quy tụ nhiều quán cà phê và nhà hàng nổi tiếng. Hãy thử ngồi tại một quán ven hồ để chiêm ngưỡng mặt hồ phẳng lặng như gương phản chiếu mây trời và cảm nhận nhịp sống êm đềm của người dân phố núi. Bạn cũng có thể thuê thuyền đạp vịt dạo quanh hồ với chi phí từ 25.000 đến 50.000 VNĐ/giờ tùy kích cỡ thuyền.
      </>
    ),
    tip: "Best experienced in the early morning mist or at sunset when the lakeside lights reflect on the water.",
    tipVi: "Đẹp nhất vào sáng sớm mờ sương hoặc chiều hoàng hôn khi ánh đèn ven hồ lấp lánh trên mặt nước.",
    address: "City Center, Dalat",
    addressVi: "Trung tâm TP. Đà Lạt",
  },
  {
    id: "domaine-de-marie-church",
    index: 2,
    title: "2. Domaine De Marie Church",
    titleVi: "2. Nhà thờ Domaine De Marie",
    img: "/guide/dalat/dalat-domaine-de-marie.jpg",
    alt: "Domaine De Marie Church Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          The first impression this church will make on you is its vibrant pink color and its unique architecture. Interestingly, the church was built in the 1940s using natural adhesives such as plaster and molasses. Despite its humble campus, Domaine De Marie church boasts a beautiful surrounding with blooming flowers all year round, against the backdrop of the blue sky and green pine trees, which are a delight to the eyes. Visiting this church and enjoying some serene time should be on your to-do list.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          Address: 01 Ngo Quyen St, Ward 6
        </p>
        <p style={{ margin: "0 0 12px 0", fontStyle: "italic", color: "#475569" }}>
          Note: Please note that the ceremony time is 7:15 AM on weekdays and 6:00 AM on weekends, so you can plan your visit accordingly.
        </p>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Ấn tượng đầu tiên mà ngôi nhà thờ này mang lại chính là sắc hồng rực rỡ đặc trưng cùng lối kiến trúc độc đáo. Điều thú vị là nhà thờ được xây dựng từ những năm 1940 bằng các chất kết dính tự nhiên như vôi vữa và mật mía. Dù khuôn viên khiêm tốn, nhà thờ Domaine De Marie lại được bao bọc bởi vườn hoa nở rộ bốn mùa, nổi bật trên nền trời xanh biếc và những hàng thông reo bạt ngàn. Dành chút thời gian ghé thăm và tận hưởng không gian thanh tịnh nơi đây chắc chắn là trải nghiệm không thể bỏ qua.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          Địa chỉ: 01 Ngô Quyền, Phường 6
        </p>
        <p style={{ margin: "0 0 12px 0", fontStyle: "italic", color: "#475569" }}>
          Lưu ý: Giờ làm lễ là 7:15 sáng các ngày trong tuần và 6:00 sáng vào cuối tuần, bạn nên sắp xếp thời gian ghé thăm cho phù hợp.
        </p>
      </>
    ),
  },
  {
    id: "dalat-railway-station",
    index: 3,
    title: "3. Dalat Railway Station",
    titleVi: "3. Ga xe lửa Đà Lạt",
    img: "/guide/dalat/dalat-railway-station.jpg",
    alt: "Dalat Railway Station",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Little did you know that Dalat Railway is the oldest Indochinese station left and also is the highest station in terms of altitude (1,500 meters above sea level) in{" "}
          <span style={{ color: "#00c2cb", fontWeight: 600 }}>Vietnam</span>. The station was built in 1932 following the design of two recognizable French architects at the time, Moncet and Reveron. Due to the high and winding hills of Dalat, engineers had to use a toothed rack rail and locomotive-hauled system at some points along the route, which was one-of-a-kind in Indochina. While the internal design of Dalat Railway Station is believed to be deeply influenced by French archetypes, its appearance is characterized by its three-pointed roofs, which replicate the spectacular Lang Biang Mountain peaks.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          The station is now operated for tourism. A 7-km train ride will take you through beautiful pine forests, serene monasteries, temples, and colorful flower blossoms, making it one of your best train experiences, we promise.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          The station offers more than just architecture; it also provides a range of services including cafes in train carriages, exhibitions of the ancient railway industry, and souvenir shops.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: 01 Quang Trung St, Ward 10</li>
          <li>Opening time: 7:00 AM – 5:00 PM</li>
          <li>Entrance tickets: 5,000 VND ($0.2)</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Có thể bạn chưa biết Ga Đà Lạt là nhà ga cổ nhất Đông Dương còn sót lại và là nhà ga cao nhất về độ cao (1.500 mét so với mực nước biển) tại{" "}
          <span style={{ color: "#00c2cb", fontWeight: 600 }}>Việt Nam</span>. Ga được xây dựng năm 1932 theo thiết kế của hai kiến trúc sư người Pháp lừng danh Moncet và Reveron. Do địa hình đồi núi hiểm trở quanh co, các kỹ sư đã phải sử dụng hệ thống đường ray răng cưa và đầu máy kéo bánh răng đặc biệt trên một số đoạn đường, độc nhất vô nhị ở Đông Dương. Mặt tiền nhà ga nổi bật với ba chóp mái tam giác mô phỏng ba đỉnh núi Lang Biang hùng vĩ.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          Hiện nay nhà ga phục vụ chủ yếu cho du lịch. Tuyến tàu hoài cổ dài 7 km đưa bạn qua những rừng thông thơ mộng, chùa chiền thanh tịnh và muôn sắc hoa rực rỡ, hứa hẹn một trong những trải nghiệm đi tàu ấn tượng nhất.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          Không chỉ có kiến trúc cổ kính, nhà ga còn cung cấp nhiều dịch vụ hấp dẫn như quán cà phê trong toa tàu cổ, khu trưng bày lịch sử ngành đường sắt xưa và các quầy lưu niệm độc đáo.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 01 Quang Trung, Phường 10</li>
          <li>Giờ mở cửa: 7:00 – 17:00 hàng ngày</li>
          <li>Vé tham quan: 5.000 VNĐ ($0.2)</li>
        </ul>
      </>
    ),
  },
  {
    id: "dalat-flower-garden",
    index: 4,
    title: "4. Dalat Flower Garden",
    titleVi: "4. Vườn hoa Thành phố Đà Lạt",
    img: "/guide/dalat/dalat-flower-garden.jpg",
    alt: "Dalat Flower Garden",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          The Flower Garden is an iconic attraction of Dalat and is considered as the national &ldquo;flower sanctuary&rdquo; where it exhibits and preserves more than 200 species of flowers. After a period of abandonment soon after its establishment in 1966, the garden was refurbished and transformed into a lively flower collection as it is seen nowadays.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          Situated on a vast area of 7,000 square meters right in the city center, the Flower Garden is a good start to your trip. You will find stunning figures shaped from countless types of flowers, lovely water fountains, and decorative staircases, which will set a beautiful background for your photos. You can also buy the seeds of your favorite flowers to take home with you. The best time to visit the garden is in the early mornings or around sunset time.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Address: 14B Dong Da St, Ward 3</li>
          <li>Opening hours: 7:00 AM – 6:00 PM on weekdays (7:00 AM – 10 PM on Fridays and Saturdays)</li>
          <li>Tickets: 60,000 VND ($2.5) for adults and 25,000 VND ($1.05) for children</li>
        </ul>
        <p style={{ margin: "0 0 12px 0", fontStyle: "italic", color: "#475569" }}>
          Note: there are some replicas and models set up by private companies which will charge you for taking photos, so make sure to look around for a price list or ask the staff so that you won&apos;t be charged unwantedly.
        </p>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Vườn hoa Thành phố là điểm tham quan mang tính biểu tượng của Đà Lạt và được ví như &ldquo;thánh địa hoa&rdquo; của cả nước, nơi trưng bày và bảo tồn hơn 200 loài hoa rực rỡ. Sau thời gian đầu thành lập năm 1966, vườn hoa đã được cải tạo và nâng cấp toàn diện trở thành bộ sưu tập hoa sống động như ngày nay.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          Tọa lạc trên khuôn viên rộng tới 7.000 m² ngay trung tâm thành phố, Vườn hoa là khởi đầu tuyệt vời cho chuyến du lịch của bạn. Bạn sẽ bắt gặp những mô hình tạo hình tinh xảo từ muôn loài hoa, đài phun nước róc rách và những bậc thang tiểu cảnh tạo phông nền tuyệt đẹp cho các bức ảnh lưu niệm. Du khách cũng có thể mua hạt giống các loài hoa yêu thích mang về. Thời gian lý tưởng nhất để tham quan là sáng sớm hoặc chiều hoàng hôn.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 14B Đống Đa, Phường 3</li>
          <li>Giờ mở cửa: 7:00 – 18:00 các ngày trong tuần (7:00 – 22:00 thứ Sáu và thứ Bảy)</li>
          <li>Vé vào cổng: 60.000 VNĐ ($2.5) người lớn và 25.000 VNĐ ($1.05) trẻ em</li>
        </ul>
        <p style={{ margin: "0 0 12px 0", fontStyle: "italic", color: "#475569" }}>
          Lưu ý: Có một số mô hình tiểu cảnh do các đơn vị tư nhân bố trí có thể thu phí chụp ảnh, bạn nên hỏi kỹ nhân viên hoặc xem bảng giá trước khi chụp.
        </p>
      </>
    ),
  },
  {
    id: "the-three-palaces",
    index: 5,
    title: "5. The three palaces",
    titleVi: "5. Ba dinh Bảo Đại (Dinh I, Dinh II, Dinh III)",
    img: "/guide/dalat/dalat-the-three-palaces.jpg",
    alt: "The three palaces Dalat - Bao Dai Palace",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Bao Dai was the final emperor of the Nguyen Dynasty and is commonly known as the last reigning emperor of Vietnam. His palaces were built in prime locations throughout the country, but with a special affection for these beautiful highlands and a specific historical context at the time, there are three palaces named after Bao Dai that were used for different purposes. They are now known as Palace I, Palace II, and Palace III.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          <strong>Palace I</strong> was the former home of a French officer before being bought and transformed into the headquarters and workplace of Bao Dai&apos;s government. It is said that during the refurbishing process, a secret 4 km underground tunnel was discovered connecting to Palace II, but it was kept secret during Bao Dai&apos;s reign and was not publicly known until the city council decided to exploit the place for tourism.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Address: 01 Tran Quang Dieu St, Ward 10</li>
          <li>Opening hours: 7:00 AM – 7:00 PM</li>
          <li>Tickets: 50,000 VND ($2.1) for adults, 25,000 VND ($1.05) for children</li>
        </ul>
        <p style={{ margin: "0 0 14px 0" }}>
          <strong>Palace II</strong> was used as the office for Jean Decoux, the Governor-General of French Indochina in Vietnam at the time, during the summer, which is why it is also known as the Summer Palace. This grand and magnificent construction was built in 1933 with 25 rooms on a scenic pine hill overlooking Xuan Huong Lake.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Address: 12 Tran Hung Dao St, Ward 10</li>
          <li>Opening hours: 7:30 AM – 5:00 PM</li>
          <li>Tickets: 30,000 VND ($1.25) per person</li>
        </ul>
        <p style={{ margin: "0 0 14px 0" }}>
          <strong>Palace III</strong> was the main residential and workplace of Bao Dai, where he spent most of his time, and is therefore also known as the Bao Dai Palace. Among the three palaces, Palace III most clearly reflects the integration of Vietnamese and French architecture and is the most popular palace among local tourists.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Address: 01 Trieu Viet Vuong St, Ward 4</li>
          <li>Opening hours: 7:00 AM – 5:30 PM</li>
          <li>Tickets: 30,000 VND ($1.25) for adults and children over 1.2 meters tall, free for children under 1.2 meters tall</li>
        </ul>
        <p style={{ margin: "0 0 12px 0", fontStyle: "italic", color: "#475569" }}>
          Note: the three palaces are located at three separate sites, stretching over several kilometers, so it is recommended to have personal transportation or to choose one palace and spend a good amount of time exploring it.
        </p>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Bảo Đại là vị hoàng đế cuối cùng của triều Nguyễn và cũng là vị vua cuối cùng của chế độ phong kiến Việt Nam. Dinh thự của ông được xây dựng tại nhiều vị trí đắc địa trên khắp cả nước, nhưng với niềm yêu mến đặc biệt dành cho cao nguyên ngàn hoa, có tới ba dinh thự mang tên Bảo Đại tại Đà Lạt được dùng cho các mục đích khác nhau, hiện nay được gọi là Dinh I, Dinh II và Dinh III.
        </p>
        <p style={{ margin: "0 0 14px 0" }}>
          <strong>Dinh I</strong> nguyên là biệt thự của một triệu phú người Pháp trước khi được mua lại làm tổng hành dinh và nơi làm việc của Quốc trưởng Bảo Đại. Trong quá trình trùng tu, người ta phát hiện một đường hầm bí mật dài 4 km nối thông sang Dinh II, vốn được giữ bí mật suốt thời kỳ Bảo Đại trị vì và mãi sau này mới được khai thác du lịch.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 01 Trần Quang Diệu, Phường 10</li>
          <li>Giờ mở cửa: 7:00 – 19:00</li>
          <li>Vé tham quan: 50.000 VNĐ ($2.1) người lớn, 25.000 VNĐ ($1.05) trẻ em</li>
        </ul>
        <p style={{ margin: "0 0 14px 0" }}>
          <strong>Dinh II</strong> từng là nơi làm việc mùa hè của Toàn quyền Đông Dương Jean Decoux, vì vậy còn được gọi là Dinh Toàn Quyền. Công trình nguy nga tráng lệ này được xây dựng năm 1933 với 25 phòng nghỉ sang trọng ngự trên ngọn đồi thông thơ mộng nhìn thẳng ra Hồ Xuân Hương.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 12 Trần Hưng Đạo, Phường 10</li>
          <li>Giờ mở cửa: 7:30 – 17:00</li>
          <li>Vé tham quan: 30.000 VNĐ ($1.25)/người</li>
        </ul>
        <p style={{ margin: "0 0 14px 0" }}>
          <strong>Dinh III</strong> là nơi sinh hoạt và làm việc chính của gia đình vua Bảo Đại, nơi ông dành nhiều thời gian nhất và do đó thường được gọi là Dinh Bảo Đại. Trong số ba dinh, Dinh III thể hiện rõ nét nhất sự giao thoa kiến trúc tân cổ điển Việt – Pháp và là điểm đến thu hút nhiều du khách nhất.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 14px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 01 Triệu Việt Vương, Phường 4</li>
          <li>Giờ mở cửa: 7:00 – 17:30</li>
          <li>Vé tham quan: 30.000 VNĐ ($1.25) người lớn & trẻ em trên 1,2m, miễn phí cho trẻ em dưới 1,2m</li>
        </ul>
        <p style={{ margin: "0 0 12px 0", fontStyle: "italic", color: "#475569" }}>
          Lưu ý: Ba dinh thự nằm ở ba địa điểm tách biệt cách nhau vài cây số, do đó bạn nên có phương tiện di chuyển cá nhân hoặc chọn một dinh để khám phá thật kỹ lưỡng.
        </p>
      </>
    ),
  },
  {
    id: "dalat-night-market",
    index: 6,
    title: "6. Dalat Night Market",
    titleVi: "6. Chợ đêm Đà Lạt",
    img: "/guide/dalat/dalat-night-market.jpg",
    alt: "Dalat Night Market",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          An open market where you can find almost everything you can ever imagine: crochet clothes, all Dalat street foods and specialties, souvenirs, and street performances. This is the best place to experience Dalat&apos;s nightlife, feel the excitement of the city&apos;s vibes, and have fun.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: Nguyen Thi Minh Khai St, Ward 1</li>
          <li>Opening hours: 5:00 PM – 2:00 AM daily</li>
          <li>Entrance tickets: Free admission</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Một khu chợ mở nhộn nhịp nơi bạn có thể tìm thấy hầu như mọi thứ: áo len đan thủ công, vô vàn món ăn đường phố và đặc sản trứ danh Đà Lạt, đồ lưu niệm và các màn biểu diễn nghệ thuật đường phố sống động. Đây là địa điểm tuyệt nhất để trải nghiệm nhịp sống về đêm của Đà Lạt, hòa mình vào không khí sôi nổi và tận hưởng trọn vẹn niềm vui.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: Đường Nguyễn Thị Minh Khai, Phường 1</li>
          <li>Giờ mở cửa: 17:00 – 2:00 sáng hôm sau hàng ngày</li>
          <li>Vé tham quan: Miễn phí vào cửa</li>
        </ul>
      </>
    ),
  },
  {
    id: "st-nicholas-cathedral",
    index: 7,
    title: "7. St. Nicholas Cathedral (The Chicken Church)",
    titleVi: "7. Nhà thờ Con Gà (Chính tòa Đà Lạt)",
    img: "/guide/dalat/dalat-chicken-church.jpg",
    alt: "St Nicholas Cathedral Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Perched majestically on Tran Phu Street, St. Nicholas Cathedral is the largest Catholic church in Dalat and one of the most prominent French Romanesque legacies in Vietnam. Built between 1931 and 1942, the church is affectionately called &ldquo;Nha Tho Con Ga&rdquo; due to the distinctive copper rooster perched on top of its 47-meter bell tower, which serves as a weather vane. The interior is illuminated by 70 stained-glass panels crafted in France, casting ethereal hues across the stone nave.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: 15 Tran Phu St, Ward 3</li>
          <li>Opening hours: 5:15 AM – 5:30 PM (visiting outside mass hours recommended)</li>
          <li>Entrance tickets: Free admission</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Tọa lạc uy nghiêm trên đường Trần Phú, Nhà thờ Chính tòa Đà Lạt là ngôi thánh đường Công giáo lớn nhất thành phố và là di sản kiến trúc Roman Pháp tiêu biểu tại Việt Nam. Được khởi công từ năm 1931 và hoàn thành năm 1942, nhà thờ được người dân gọi thân thương là &ldquo;Nhà thờ Con Gà&rdquo; nhờ bức tượng chú gà trống bằng đồng nằm trên đỉnh tháp chuông cao 47 mét. Bên trong thánh đường là 70 tấm kính màu được chế tác tại Pháp, tạo nên hiệu ứng ánh sáng huyền ảo lung linh.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 15 Trần Phú, Phường 3</li>
          <li>Giờ mở cửa: 5:15 – 17:30 (nên tham quan ngoài giờ hành lễ)</li>
          <li>Vé tham quan: Miễn phí vào cửa</li>
        </ul>
      </>
    ),
  },
  {
    id: "linh-phuoc-pagoda",
    index: 8,
    title: "8. Linh Phuoc Pagoda",
    titleVi: "8. Chùa Linh Phước (Chùa Ve Chai)",
    img: "/guide/dalat/dalat-linh-phuoc-pagoda.jpg",
    alt: "Linh Phuoc Pagoda Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Located in Trai Mat, about 8 km from the city center, Linh Phuoc Pagoda is an extraordinary Buddhist temple that has earned multiple national records. Built in 1949 and continuously enriched, the entire complex is encrusted with millions of pieces of broken glazed pottery, porcelain bowls, and colorful glass bottles. Highlights include a 49-meter dragon sculpture crafted from 12,000 beer bottles, an 18-meter statue of Bodhisattva Avalokiteshvara covered in over 600,000 dried immortal flowers, and a 37-meter bell tower housing the heaviest bell in Central Vietnam.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: 120 Tu Phuoc St, Trai Mat</li>
          <li>Opening hours: 7:00 AM – 5:30 PM</li>
          <li>Entrance tickets: Free admission</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Nằm tại Trại Mát, cách trung tâm khoảng 8 km, Chùa Linh Phước là công trình tâm linh độc nhất vô nhị nắm giữ nhiều kỷ lục quốc gia. Ngôi chùa được bao phủ hoàn toàn bởi hàng triệu mảnh sành sứ, chén đĩa vỡ và vỏ chai thủy tinh đầy màu sắc. Điểm nhấn bao gồm con rồng dài 49 mét uốn lượn được tạo nên từ 12.000 vỏ chai bia, tượng Bồ Tát Quán Thế Âm cao 18 mét kết từ hơn 600.000 bông hoa bất tử và tháp chuông 7 tầng cao 37 mét sở hữu Đại Hồng Chung nặng nhất miền Trung.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 120 Tự Phước, Trại Mát</li>
          <li>Giờ mở cửa: 7:00 – 17:30</li>
          <li>Vé tham quan: Miễn phí vào cửa</li>
        </ul>
      </>
    ),
  },
  {
    id: "valley-of-love",
    index: 9,
    title: "9. Valley of Love",
    titleVi: "9. Thung Lũng Tình Yêu",
    img: "/guide/dalat/dalat-valley-of-love.jpg",
    alt: "Valley of Love Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Originally christened Vallée d&apos;Amour by the French in the 1930s, this romantic park is nestled among undulating pine hills approximately 5 km north of downtown Dalat. Spanning hundreds of hectares around Da Thien Lake, the valley boasts romantic heart-shaped floral gardens, pedal boats, panoramic viewing platforms, and labyrinth hedges. It has long been a favored retreat for couples, newlyweds, and families seeking idyllic alpine leisure.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: 03-05-07 Mai Anh Dao St, Ward 8</li>
          <li>Opening hours: 7:30 AM – 5:00 PM</li>
          <li>Entrance tickets: 250,000 VND ($10.5) includes sightseeing train and pedal boat</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Được người Pháp đặt tên là Vallée d&apos;Amour từ thập niên 1930, Thung Lũng Tình Yêu là thắng cảnh lãng mạn bậc nhất nép mình bên những đồi thông trập trùng cách trung tâm khoảng 5 km. Bao quanh Hồ Đa Thiện trong vắt, nơi đây sở hữu những thảm hoa hình trái tim rực rỡ, bến thuyền thiên nga, cầu đáy kính ngắm cảnh và mê cung tình yêu độc đáo. Đây luôn là điểm hẹn ước lý tưởng của các cặp đôi và gia đình khi đến với Đà Lạt.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 03-05-07 Mai Anh Đào, Phường 8</li>
          <li>Giờ mở cửa: 7:30 – 17:00</li>
          <li>Vé trọn gói: 250.000 VNĐ ($10.5) bao gồm tàu điện và đạp vịt hồ</li>
        </ul>
      </>
    ),
  },
  {
    id: "tuyen-lam-lake",
    index: 10,
    title: "10. Tuyen Lam Lake",
    titleVi: "10. Hồ Tuyền Lâm",
    img: "/guide/dalat/dalat-tuyen-lam-lake.jpg",
    alt: "Tuyen Lam Lake Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Covering more than 350 hectares at the foot of Phoenix Mountain, Tuyen Lam Lake is the largest freshwater lake in Dalat and a designated national tourist area. Known as the &ldquo;Paradise Lake,&rdquo; its glassy emerald waters are framed by virgin pine forests, peaceful valleys, and luxury eco-resorts. Visitors can rent motorized boats or kayaks, try stand-up paddleboarding (SUP) at dawn, or embark on a pine forest trek to hidden camping grounds.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: Ward 4, Dalat City (6 km south of downtown)</li>
          <li>Opening hours: Open 24/7 (boat rental services: 7:00 AM – 5:00 PM)</li>
          <li>Entrance tickets: Free entry; boat tours from 300,000 VND – 500,000 VND / boat</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Trải rộng hơn 350 ha dưới chân núi Phụng Hoàng, Hồ Tuyền Lâm là hồ nước ngọt tự nhiên lớn nhất Đà Lạt và là khu du lịch quốc gia trọng điểm. Mặt hồ trong xanh như ngọc bích phẳng lặng in bóng những cánh rừng thông nguyên sinh bạt ngàn. Du khách có thể thuê cano dạo hồ, chèo thuyền SUP đón bình minh trong sương sớm, hay cắm trại dã ngoại bên bờ hồ thơ mộng.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: Phường 4, TP. Đà Lạt (cách trung tâm 6 km về phía nam)</li>
          <li>Giờ mở cửa: Cả ngày (dịch vụ cano: 7:00 – 17:00)</li>
          <li>Vé tham quan: Miễn phí vào cửa; thuê thuyền từ 300.000 – 500.000 VNĐ / chuyến</li>
        </ul>
      </>
    ),
  },
  {
    id: "truc-lam-zen-monastery",
    index: 11,
    title: "11. Truc Lam Zen Monastery",
    titleVi: "11. Thiền Viện Trúc Lâm",
    img: "/guide/dalat/dalat-truc-lam-monastery.jpg",
    alt: "Truc Lam Zen Monastery Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Perched atop Phoenix Mountain overlooking Tuyen Lam Lake, Truc Lam Zen Monastery is the largest Zen Buddhist monastery in Lam Dong Province and one of Vietnam’s foremost spiritual sanctuaries. Built in 1993, the pagoda harmoniously combines traditional Vietnamese curved-tile temple architecture with meticulously manicured gardens boasting rare hydrangeas, purple orchids, and tranquil lotus ponds. Visitors can also reach the monastery via a scenic 2.3-km cable car ride from Robin Hill.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: Truc Lam Yen Tu St, Ward 3</li>
          <li>Opening hours: 5:00 AM – 9:00 PM</li>
          <li>Entrance tickets: Free admission (Cable car round-trip: 120,000 VND / adult)</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Tọa lạc trên đỉnh núi Phụng Hoàng nhìn thẳng ra Hồ Tuyền Lâm, Thiền Viện Trúc Lâm là thiền viện Phật giáo lớn nhất tỉnh Lâm Đồng thuộc phái Trúc Lâm Yên Tử. Khởi công năm 1993, quần thể kiến trúc hài hòa giữa nét chùa cổ truyền thống với vườn hoa bonsai, hồ sen tĩnh mặc và rừng thông vi vu. Du khách có thể trải nghiệm tuyến cáp treo dài 2,3 km từ Đồi Robin để thưởng ngoạn toàn cảnh rừng núi trước khi bước vào chốn thanh tịnh này.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: Đường Trúc Lâm Yên Tử, Phường 3</li>
          <li>Giờ mở cửa: 5:00 – 21:00</li>
          <li>Vé tham quan: Miễn phí vào cửa (Vé cáp treo khứ hồi: 120.000 VNĐ / người lớn)</li>
        </ul>
      </>
    ),
  },
  {
    id: "crazy-house",
    index: 12,
    title: "12. Crazy House (Hang Nga Guesthouse)",
    titleVi: "12. Biệt thự Hằng Nga (Crazy House)",
    img: "/guide/dalat/dalat-crazy-house.jpg",
    alt: "Crazy House Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Listed by international travel magazines as one of the world’s ten most bizarre buildings, Crazy House (designed by Vietnamese architect Dang Viet Nga) is an awe-inspiring labyrinth of surreal expressionist art. Resembling a gargantuan decaying banyan tree, the complex features spiraling concrete bridges, sculpted spiderwebs, tree-trunk tunnels, and themed animal rooms (such as the Tiger, Kangaroo, and Eagle rooms). It&apos;s an imaginative fairy-tale dream brought to life in concrete and stone.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: 03 Huynh Thuc Khang St, Ward 4</li>
          <li>Opening hours: 8:30 AM – 7:00 PM</li>
          <li>Entrance tickets: 60,000 VND ($2.5) for adults, 20,000 VND ($0.85) for children</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Được các tạp chí kiến trúc quốc tế bình chọn là một trong mười ngôi nhà kỳ dị nhất thế giới, Crazy House (do kiến trúc sư Đặng Việt Nga thiết kế) là một mê cung nghệ thuật siêu thực đầy kinh ngạc. Lấy cảm hứng từ gốc cây cổ thụ mục rỗng, công trình sở hữu những cây cầu bê tông uốn lượn giữa không trung, cửa sổ mạng nhện, đường hầm hang đá và các phòng nghỉ theo chủ đề muông thú. Một thế giới cổ tích kỳ ảo được hiện thực hóa giữa lòng Đà Lạt.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: 03 Huỳnh Thúc Kháng, Phường 4</li>
          <li>Giờ mở cửa: 8:30 – 19:00</li>
          <li>Vé tham quan: 60.000 VNĐ ($2.5) người lớn, 20.000 VNĐ ($0.85) trẻ em</li>
        </ul>
      </>
    ),
  },
  {
    id: "datanla-waterfall",
    index: 13,
    title: "13. Datanla Waterfall",
    titleVi: "13. Thác Datanla",
    img: "/guide/dalat/dalat-datanla-falls-hd.jpg",
    alt: "Datanla Waterfall Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Just 5 km south of the city center along Prenn Pass, Datanla is Dalat’s most popular waterfall for thrill-seekers and nature lovers alike. Cascading dramatically over smooth, multi-tiered stone ledges through a lush rainforest canyon, Datanla is legendary for the longest alpine coaster track in Southeast Asia (2,400 meters). Adventurous visitors can also participate in guided canyoning tours, zip-lining, and abseiling down roaring water curtains.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: National Road 20, Prenn Pass, Ward 3</li>
          <li>Opening hours: 7:00 AM – 5:00 PM</li>
          <li>Entrance tickets: 50,000 VND ($2.1) entrance; Alpine coaster round-trip: 200,000 VND ($8.4)</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Nằm cách trung tâm chỉ 5 km trên đèo Prenn, Thác Datanla là con thác nổi tiếng và thu hút nhất Đà Lạt đối với những người yêu thích mạo hiểm. Dòng nước đổ qua các tầng đá ghềnh cuồn cuộn giữa hẻm núi rừng rậm xanh mát. Datanla nổi tiếng với hệ thống xe trượt máng (alpine coaster) dài nhất Đông Nam Á (2.400 mét), cùng các tour canyoning vượt thác đu dây và đu zipline băng qua tán rừng hùng vĩ.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: Quốc lộ 20, Đèo Prenn, Phường 3</li>
          <li>Giờ mở cửa: 7:00 – 17:00</li>
          <li>Vé tham quan: 50.000 VNĐ ($2.1) vào cổng; Máng trượt khứ hồi: 200.000 VNĐ ($8.4)</li>
        </ul>
      </>
    ),
  },
  {
    id: "langbiang-mountain",
    index: 14,
    title: "14. Langbiang Mountain",
    titleVi: "14. Đỉnh Núi Langbiang",
    img: "/guide/dalat/dalat-langbiang-mountain.jpg",
    alt: "Langbiang Mountain Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Often hailed as the &ldquo;Roof of Dalat,&rdquo; Langbiang Mountain towers over 2,167 meters above sea level, approximately 12 km north of the city center in Lac Duong district. The mountain is steeped in the tragic, Romeo-and-Juliet-like folklore of K&apos;Lang and H&apos;Biang, heroes of the local K&apos;Ho ethnic minority. Visitors can ride Russian UAZ open-top military jeeps up the winding mountain road to Radar Peak (1,929m), where observation decks afford 360-degree vistas across the Golden Stream, Silver Stream, and emerald valleys.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: Lac Duong Town, Lam Dong (12 km north of Dalat)</li>
          <li>Opening hours: 7:00 AM – 5:00 PM</li>
          <li>Entrance tickets: 50,000 VND ($2.1) admission; Jeep ride: 120,000 VND ($5.0) per passenger round-trip</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Được ví như &ldquo;Nóc nhà của Đà Lạt&rdquo;, đỉnh núi Langbiang sừng sững ở độ cao 2.167 mét so với mực nước biển, thuộc huyện Lạc Dương cách trung tâm 12 km. Ngọn núi gắn liền với câu chuyện tình sử thi đầy xúc động của chàng K&apos;Lang và nàng H&apos;Biang thuộc bộ tộc người K&apos;Ho. Du khách có thể ngồi xe Jeep UAZ băng qua những cung đường đèo uốn lượn lên Đỉnh Ra-đa (1.929 m) để chiêm ngưỡng toàn cảnh Suối Vàng, Suối Bạc và thung lũng bạt ngàn thông reo.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: Thị trấn Lạc Dương, Tỉnh Lâm Đồng (cách Đà Lạt 12 km)</li>
          <li>Giờ mở cửa: 7:00 – 17:00</li>
          <li>Vé tham quan: 50.000 VNĐ ($2.1) vào cổng; Xe Jeep khứ hồi: 120.000 VNĐ ($5.0)/người</li>
        </ul>
      </>
    ),
  },
  {
    id: "clay-tunnel-elephant-falls",
    index: 15,
    title: "15. Clay Tunnel & Elephant Waterfall",
    titleVi: "15. Đường Hầm Điêu Khắc & Thác Voi",
    img: "/guide/dalat/dalat-clay-tunnel.jpg",
    alt: "Clay Tunnel and Elephant Waterfall Dalat",
    desc: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Meandering for over 1.2 kilometers along the banks of Tuyen Lam Lake, the Clay Tunnel is an open-air architectural museum sculpted entirely from local red basaltic clay mixed with eco-friendly binders. The route chronicles Dalat&apos;s history from its prehistoric wilderness to its French colonial belle époque, featuring clay replicas of the Cathedral, the Railway Station, traditional villas, and airplanes. At the tunnel&apos;s end sits the famous Infinity Lake (Ho Vo Cuc), where two monumental sculptured stone heads face each other across a reflecting pool surrounded by pines. If you have extra time, venture further southwest to explore the untamed grandeur of Elephant Waterfall (Thac Lieng Rowoa) cascading thunderously down basalt stone cliffs.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Address: Ward 4, Dalat City (Clay Tunnel) & Nam Ban Town (Elephant Waterfall)</li>
          <li>Opening hours: 7:30 AM – 5:00 PM</li>
          <li>Entrance tickets: Clay Tunnel 120,000 VND ($5.0) adults, 50,000 VND ($2.1) children</li>
        </ul>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px 0" }}>
          Trải dài hơn 1,2 km uốn lượn ven Hồ Tuyền Lâm, Đường Hầm Điêu Khắc là bảo tàng kiến trúc ngoài trời độc đáo được tạo tác hoàn toàn từ đất đỏ bazan địa phương kết hợp phụ gia thân thiện môi trường. Tuyến đường tái hiện sinh động lịch sử hình thành Đà Lạt từ thuở hoang sơ đến thời kỳ Pháp thuộc với các mô hình Nhà thờ Con Gà, Ga Đà Lạt, biệt thự cổ và máy bay thu nhỏ. Điểm nhấn cuối đường hầm là Hồ Vô Cực trứ danh với hai bức tượng điêu khắc gương mặt nhìn nhau soi bóng giữa rừng thông. Ngoài ra, du khách cũng không nên bỏ lỡ Thác Voi hùng vĩ hoang sơ đổ ầm ầm từ vách đá bazan kỳ vĩ tại thị trấn Nam Ban lân cận.
        </p>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: "0 0 12px 0", lineHeight: 1.8 }}>
          <li>Địa chỉ: Phường 4, TP. Đà Lạt (Đường hầm điêu khắc) & Thị trấn Nam Ban (Thác Voi)</li>
          <li>Giờ mở cửa: 7:30 – 17:00</li>
          <li>Vé tham quan: Đường hầm 120.000 VNĐ ($5.0) người lớn, 50.000 VNĐ ($2.1) trẻ em</li>
        </ul>
      </>
    ),
  },
];

export default function Dalat15AttractionsPage() {
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

  return (
    <div className="hcmc-page-wrap">
      {/* ── Top Shared PublicHeader ── */}
      <PublicHeader onBannerClick={() => setAiCompanionOpen(true)} />

      {/* ─── HERO SECTION (Screenshot 3 & 4) ─── */}
      <section
        className="hcmc-hero"
        style={{
          backgroundImage: "url('/guide/dalat/dalat-15-attractions-hd.jpg')",
          minHeight: "520px",
        }}
      >
        <div className="hcmc-hero__overlay" />
        <div className="hcmc-hero__content">
          <div className="hcmc-hero__badges">
            <span className="hcmc-badge">
              {isVi ? "BÀI VIẾT" : "ARTICLES"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "ĐÀ LẠT" : "DALAT"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}
            </span>
          </div>

          <h1 className="hcmc-hero__title" style={{ fontSize: "52px", letterSpacing: "-0.5px" }}>
            {isVi ? "15 điểm tham quan đẹp nhất Đà Lạt" : "The 15 best attractions in Dalat"}
          </h1>

          <p className="hcmc-hero__meta" style={{ fontSize: "14px", opacity: 0.9 }}>
            By Welcome to Vietnam &nbsp;·&nbsp; July 21, 2024
          </p>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER (Screenshot 5) ─── */}
      <main className="hcmc-container" style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px 60px" }}>
        {/* ACTION BUTTON (Screenshot 3 & 4) */}
        <div className="hcmc-action-wrap" style={{ margin: "36px 0 28px" }}>
          <Link
            href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
            className="hcmc-create-trip-btn"
            style={{
              background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)",
              borderRadius: "9999px",
              padding: "13px 36px",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isVi
                ? "Tạo chuyến du lịch Việt Nam chỉ trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </Link>
        </div>

        {/* INTRO PARAGRAPH (Screenshot 3 & 4) */}
        <p
          className="hcmc-intro"
          style={{
            fontSize: "15.5px",
            lineHeight: 1.76,
            color: "#334155",
            margin: "0 auto 44px",
            textAlign: "left",
          }}
        >
          {isVi
            ? "Đà Lạt là thành phố tuyệt đẹp trên cao nguyên miền Trung Việt Nam, cách TP. Hồ Chí Minh khoảng 300 km. Nơi đây nổi tiếng với khí hậu mát mẻ quanh năm, phong cảnh thiên nhiên ngoạn mục và nhịp sống bình yên, dịu dàng. Cùng khám phá 15 điểm đến hàng đầu tại Đà Lạt năm 2024."
            : "Dalat is a beautiful city in the Central Highlands of Vietnam, about 300 km from Ho Chi Minh City. The city is famous for its year-round cool climate, breathtaking scenery and gentle lifestyle. Check out these top 15 destinations in Dalat in 2024."}
        </p>

        {/* ─── 15 ATTRACTIONS LIST (Screenshot 5) ─── */}
        <div className="hcmc-list" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {DALAT_15_ATTRACTIONS.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="hcmc-item"
              style={{ paddingBottom: "36px", borderBottom: "1px solid #f1f5f9" }}
            >
              <h2
                className="hcmc-item__title"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 16px 0",
                  lineHeight: 1.3,
                }}
              >
                {isVi ? item.titleVi : item.title}
              </h2>

              <div
                className="hcmc-item__layout"
                style={{
                  display: "flex",
                  gap: "28px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {/* Media Image (Crisp HD 4:3 Ratio) */}
                <div
                  className="hcmc-item__media"
                  style={{
                    flex: "0 0 340px",
                    maxWidth: "100%",
                    borderRadius: "6px",
                    overflow: "hidden",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    background: "#f8fafc",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Body Text */}
                <div
                  className="hcmc-item__body"
                  style={{
                    flex: "1 1 400px",
                    fontSize: "15px",
                    lineHeight: 1.76,
                    color: "#334155",
                  }}
                >
                  <div style={{ margin: "0 0 14px 0" }}>
                    {isVi ? item.descVi : item.desc}
                  </div>

                  {item.tip && (
                    <p style={{ margin: "0 0 12px 0", color: "#1e293b" }}>
                      <strong>{isVi ? "Mẹo:" : "Tip:"}</strong>{" "}
                      {isVi ? item.tipVi : item.tip}
                    </p>
                  )}

                  {item.address && (
                    <p
                      style={{
                        margin: "12px 0 0 0",
                        fontSize: "14px",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <MapPin size={15} style={{ color: "#00c2cb", flexShrink: 0 }} />
                      <span>
                        <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong>{" "}
                        {isVi ? item.addressVi : item.address}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Closing Paragraph ── */}
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", margin: "44px 0 24px" }}>
          {isVi ? (
            <>
              Từ những hồ nước tĩnh lặng nép mình giữa rừng thông cho tới những công trình kiến trúc Pháp cổ kính và các điểm vui chơi mạo hiểm, 15 thắng cảnh trên đây chính là những nét vẽ tinh tế nhất khắc họa nên vẻ đẹp mộng mơ của Đà Lạt. Dù là lần đầu đặt chân hay đã nhiều lần trở lại, xứ sở ngàn hoa vẫn luôn mang đến cho bạn những xúc cảm mới lạ và bình yên.
            </>
          ) : (
            <>
              From tranquil mountain lakes framed by misty pines to historic French colonial heritage and thrilling forest adventures, these 15 attractions capture the true poetic soul of Dalat. Whether it&apos;s your first visit or a nostalgic return, the City of Eternal Spring never ceases to amaze and inspire.
            </>
          )}
        </p>

        {/* ── Disclaimer Note ── */}
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#334155", margin: "0 0 28px", fontStyle: "italic" }}>
          {isVi
            ? "Note: Giá vé và thông tin tham quan có thể thay đổi tùy theo mùa vụ và thời điểm thực tế."
            : "Note: Admission fees and operating hours may vary depending on the season and local regulations."}
        </p>

        {/* ── Tags ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "24px 0 40px", flexWrap: "wrap" }}>
          <span
            style={{
              background: "#00c2cb",
              color: "#ffffff",
              padding: "5px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            TAGS
          </span>
          <span
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {isVi ? "Điểm đến Đà Lạt" : "Dalat attractions"}
          </span>
          <span
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {isVi ? "Trải nghiệm" : "Things to do"}
          </span>
        </div>

        {/* ── Divider ── */}
        <hr style={{ border: 0, height: "1px", background: "#e2e8f0", margin: "40px 0" }} />

        {/* ── Related Articles ── */}
        <section style={{ margin: "40px 0 60px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "26px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "32px",
            }}
          >
            {isVi ? "Bài viết liên quan" : "Related Articles"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card 1 */}
            <Link
              href="/guide/3-week-vietnam-itinerary"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/megamenu/todo-1-3week.jpg"
                  alt="3-week Vietnam Itinerary"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "Lịch trình 3 tuần xuyên Việt" : "3-week Vietnam Itinerary"}
              </h3>
            </Link>

            {/* Card 2 */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/megamenu/todo-2-hcmc.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh" : "10 best things to do in Ho Chi Minh City"}
              </h3>
            </Link>

            {/* Card 3 */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/hcmc/hcmc-12-foods-hd.jpg"
                  alt="12 must-try foods in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "12 món ăn nhất định phải thử tại TP. Hồ Chí Minh" : "12 must-try foods in Ho Chi Minh City"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Full Public Footer ── */}
      <PublicFooter lang={lang} />

      {/* ── Floating AI Companion for Dalat ── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        province={{
          name: isVi ? "Đà Lạt" : "Dalat",
          slug: "dalat",
        }}
      />
    </div>
  );
}
