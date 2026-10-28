"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import AffiliateDealBox from "@/components/ui/AffiliateDealBox";
import { HANOI_AFFILIATE_DEALS } from "@/lib/affiliateDeals";
import { getLang } from "@/lib/prefs";
import { Sparkles } from "lucide-react";
import "@/styles/home.css";
import "./hanoi-food.css";


// ─── 8 MUST-TRY HANOI FOODS DATA (MATCHING SCREENSHOTS 3, 4, 5) ───
const HANOI_8_DISHES = [
  {
    id: "pho",
    index: 1,
    title: "1. Pho",
    titleVi: "1. Phở",
    img: "/guide/hcmc/Top-Hanoi-foods-Pho-Vietnamnomad.jpg",
    alt: "Pho - Hanoi Traditional Noodle Soup",
    desc: (
      <>
        I live in the South, so trust me when I say{" "}
        <span className="vnn-link-highlight">
          <em>pho</em>
        </span>{" "}
        in Hanoi is amazing—and I&apos;m not biased. Even though you can eat{" "}
        <em>pho</em> anywhere, you&apos;ll regret skipping it in Hanoi.{" "}
        <em>Pho</em> here is all about keeping the ingredients true to their
        original taste. No extra lime, herbs, or sauces like in the South. The
        broth is clear, the noodles are soft, and the beef is plentiful. Your
        taste buds will love the garlic vinegar and spring onions. Eating{" "}
        <em>pho</em> in Hanoi is like drinking coffee in{" "}
        <Link
          href="/province/ho-chi-minh"
          style={{ color: "#00c2cb", textDecoration: "none" }}
        >
          Saigon
        </Link>
        —it&apos;s more than food, it&apos;s a lifestyle. There&apos;s nothing
        more authentic and immersive than eating <em>pho</em> on little plastic
        stools on the sidewalks alongside the locals.
      </>
    ),
    descVi: (
      <>
        Dù bạn có thể ăn phở ở bất kỳ nơi nào trên thế giới, nhưng bỏ lỡ phở tại
        Hà Nội sẽ là điều vô cùng đáng tiếc. Phở Hà Nội chú trọng giữ trọn vẹn
        hương vị nguyên bản của nguyên liệu: không rau thơm dày đặc, không thêm
        tương đen ngọt ngào như miền Nam. Nước dùng trong thanh ngọt từ xương
        hầm, bánh phở mềm mướt và những lát thịt bò tươi ngon. Hương vị bùng nổ
        khi kết hợp cùng chút giấm tỏi và hành hoa. Ăn phở trên những chiếc ghế
        nhựa con ven vỉa hè phố cổ cùng người bản địa là một nét văn hóa sống
        động và chân thực nhất.
      </>
    ),
    tip: "Order a side of fried dough sticks (quay) and dip them in the broth. They soak up the soup and add carbs to your meal, enhancing the overall flavor.",
    tipVi:
      "Gọi thêm một đĩa bánh quẩy giòn và nhúng ngập vào bát nước dùng nóng hổi. Quẩy ngấm nước dùng thanh ngọt sẽ giúp bữa ăn của bạn no tròn và đậm đà hơn.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Pho Thin Bo Ho (61 Dinh Tien Hoang): 60,000 VND ($2.30, 1 USD ~ 26,000 VND)",
      "Pho 10 Ly Quoc Su (10 Ly Quoc Su): 65,000 VND",
    ],
    whereToEatVi: [
      "Phở Thìn Bờ Hồ (61 Đinh Tiên Hoàng): 60.000 VNĐ ($2.30)",
      "Phở 10 Lý Quốc Sư (10 Lý Quốc Sư): 65.000 VNĐ",
    ],
  },
  {
    id: "bun-cha",
    index: 2,
    title: "2. Bun Cha Hanoi",
    titleVi: "2. Bún Chả Hà Nội",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    alt: "Bun Cha Hanoi - Grilled Pork with Vermicelli",
    desc: (
      <>
        The name says it all—this dish is the culinary representative of{" "}
        <Link
          href="/province/ha-noi"
          style={{ color: "#00c2cb", textDecoration: "none" }}
        >
          Hanoi
        </Link>
        . It&apos;s not just{" "}
        <span className="vnn-link-highlight">
          <em>bun cha</em>
        </span>
        , it&apos;s <em>bun cha Hanoi</em>. Maybe because it started here, or
        maybe because nowhere else does it as well. After Anthony Bourdain and
        Barack Obama shared a meal of <em>bun cha</em> in 2016, the dish became
        world-famous. <em>Bun cha</em> is served in a unique way: grilled pork
        belly and meatballs, fresh herbs, cold noodles, and a bowl of
        sweet-and-sour dipping sauce with pickled papaya—all placed on one tray.
        You take some noodles and herbs, dip them into the sauce, bite the juicy
        meat, and enjoy. Every element is served separately, allowing you to mix
        it your way.
      </>
    ),
    descVi: (
      <>
        Cái tên đã nói lên tất cả—món ăn này chính là đại diện ẩm thực của thủ
        đô Hà Nội. Không chỉ đơn thuần là bún chả, mà phải là bún chả Hà Nội. Kể
        từ khi cố đầu bếp Anthony Bourdain và cựu Tổng thống Barack Obama cùng
        nhau thưởng thức bún chả vào năm 2016, món ăn này đã trở nên nổi tiếng
        toàn cầu. Bún chả được dọn theo cách rất riêng: thịt ba chỉ và chả viên
        nướng than hoa thơm nức mũi, rổ rau sống tươi non, đĩa bún sợi nhỏ mát
        lành và một bát nước mắm chua ngọt ấm nóng thả vài lát đu đủ giòn sần
        sật.
      </>
    ),
    tip: (
      <>
        <em>Bun cha</em> is usually eaten at lunch. Try it at a street-side spot
        where puffs of aromatic smoke linger, and don&apos;t forget to get an
        extra{" "}
        <span className="vnn-link-highlight">
          <em>nem ran</em>
        </span>
        —the deep-fried spring rolls that go excellently with the dish.
      </>
    ),
    tipVi:
      "Bún chả thường được ăn vào bữa trưa. Hãy chọn một quán ven đường thoang thoảng làn khói nướng than hoa thơm lừng và đừng quên gọi thêm một chiếc nem rán giòn rụm ăn kèm.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Cha Huong Lien (24 Le Van Huu): 60,000 VND",
      "Bun Cha Hang Quat (74 Hang Quat): 50,000 VND",
    ],
    whereToEatVi: [
      "Bún Chả Hương Liên (24 Lê Văn Hưu): 60.000 VNĐ",
      "Bún Chả Hàng Quạt (74 Hàng Quạt): 50.000 VNĐ",
    ],
  },
  {
    id: "banh-cuon",
    index: 3,
    title: "3. Banh Cuon",
    titleVi: "3. Bánh Cuốn",
    img: "/guide/hcmc/Top-Hanoi-foods-Banh-Cuon-Vietnamnomad.jpg",
    alt: "Banh Cuon - Steamed Rice Rolls Hanoi",
    desc: (
      <>
        <span className="vnn-link-highlight">
          <em>Banh cuon</em>
        </span>{" "}
        (steamed rice rolls) is a light but tasty dish that recently gained
        attention after being mentioned in the Michelin Guide. It&apos;s made of
        thin steamed rice rolls filled with ground pork and wood ear mushrooms.
        The soft wrapper and crunchy filling make a fun combo. Though it&apos;s
        a steamed dish, the flavor is rich thanks to the smoky grilled pork and
        sweet dipping sauce. It&apos;s often served with pork sausage,
        especially the cinnamon-flavored kind. You can eat it any time of the
        day. The skillful steaming process and smooth texture are a big part of
        its charm.
      </>
    ),
    descVi: (
      <>
        Bánh cuốn (bánh gạo tráng hấp) là một món ăn thanh nhã nhưng vô cùng
        thơm ngon gần đây đã thu hút nhiều sự chú ý sau khi được vinh danh trong
        Cẩm nang Michelin Guide. Bánh được làm từ những tấm bột gạo tráng mỏng
        tang cuộn lấy nhân thịt lợn băm và mộc nhĩ giòn sần sật. Lớp vỏ mềm mướt
        kết hợp cùng phần nhân giòn rụm tạo nên sự hòa quyện thú vị. Dù là món
        hấp, hương vị lại đậm đà nhờ chả nướng thơm lừng và chén nước chấm chua
        ngọt ấm áp. Bánh thường được ăn kèm giò chả, đặc biệt là chả quế thơm
        ngậy. Bạn có thể thưởng thức món này vào bất cứ thời điểm nào trong
        ngày. Quy trình tráng bánh điêu luyện và lớp bánh mịn màng chính là điểm
        quyến rũ lớn nhất của món ăn này.
      </>
    ),
    tip: "Order a glass of herbal tea or corn milk — both pair really well with banh cuon.",
    tipVi:
      "Hãy gọi thêm một cốc trà thảo mộc hoặc sữa ngô — cả hai đều kết hợp rất tuyệt vời với bánh cuốn.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Banh Cuon Ba Hoanh (66 To Hien Thanh): 35,000 VND",
      "Banh Cuon Ba Xuan (16 Doc Hoe Nhai): 30,000 VND",
    ],
    whereToEatVi: [
      "Bánh Cuốn Bà Hoành (66 Tô Hiến Thành): 35.000 VNĐ",
      "Bánh Cuốn Bà Xuân (16 Dốc Hòe Nhai): 30.000 VNĐ",
    ],
  },
  {
    id: "bun-thang",
    index: 4,
    title: "4. Bun Thang",
    titleVi: "4. Bún Thang",
    img: "/guide/hcmc/Hanoi-food-Bun-Thang-Vietnamnomad.jpg",
    alt: "Bun Thang - Traditional Hanoi Chicken Noodle Soup",
    desc: (
      <>
        Not many tourists know <em>bun thang</em>, but it&apos;s one of
        Hanoi&apos;s best noodle dishes. &ldquo;Thang&rdquo; means soup, and the
        highlight here is the clear, sweet broth made from bones and vegetables.
        It&apos;s topped with thin slices of egg, pork sausage, chicken,
        mushrooms, and fried onions, all neatly arranged. It looks beautiful and
        tastes light but filling—perfect for breakfast and a great way to start
        a day of exploring. It&apos;s a true showcase of balance, care, and
        flavor, with a touch of elegance in every bowl.
      </>
    ),
    descVi: (
      <>
        Không nhiều du khách biết đến <em>bún thang</em>, nhưng đây là một trong
        những món bún tinh túy nhất của Hà Nội. &ldquo;Thang&rdquo; có nghĩa là
        canh súp, và điểm sáng ở đây chính là nồi nước dùng thanh ngọt trong vắt
        nấu từ xương và rau củ quả. Bát bún được phủ đều những sợi trứng tráng
        mỏng thái chỉ, giò lụa, thịt gà xé, nấm hương và hành phi thơm lừng, tất
        cả xếp gọn gàng đẹp mắt. Món ăn vừa có hình thức bắt mắt vừa mang hương
        vị thanh tao nhưng đầy đặn—hoàn hảo cho bữa sáng khởi đầu ngày khám phá.
        Đây thực sự là minh chứng cho sự hài hòa, chăm chút và hương vị tao nhã
        trong từng bát bún.
      </>
    ),
    tip: "Add a few drops of shrimp paste or a slice of lime for extra depth.",
    tipVi:
      "Thêm vài giọt mắm tôm hoặc một lát chanh tươi để tạo chiều sâu hương vị đậm đà hơn.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Quan Cu Restaurant (31A Phan Dinh Phung): 60,000 VND",
      "Bun Thang Ba Tong (56 Ngo Si Lien): 50,000 VND",
    ],
    whereToEatVi: [
      "Quán Cũ (31A Phan Đình Phùng): 60.000 VNĐ",
      "Bún Thang Bà Tống (56 Ngô Sĩ Liên): 50.000 VNĐ",
    ],
  },
  {
    id: "cha-ca-la-vong",
    index: 5,
    title: "5. Cha Ca La Vong",
    titleVi: "5. Chả Cá Lã Vọng",
    img: "/guide/hcmc/Top-Hanoi-foods-Cha-Ca-Vietnamnomad.jpg",
    alt: "Cha Ca La Vong - Grilled Turmeric Fish with Dill",
    desc: (
      <>
        <em>Cha ca La Vong</em> (La Vong grilled fish) is not only a Hanoi
        treasure but also one of Vietnam&apos;s culinary highlights. The star is{" "}
        <em>ca lang</em> (bagrid catfish)—a freshwater fish known for being
        tender, flavorful, and nutritious. It&apos;s cooked in a way that
        eliminates any fishiness while preserving its juicy texture. When
        served, it&apos;s heated in a pan with lots of dill and spring
        onions—simple ingredients that bring out the best in each other.
        It&apos;s eaten with rice noodles, roasted peanuts, and shrimp paste for
        extra flavor. Locals often add chili and lime juice to the mix for more
        punch. The sizzling sound and aroma as it cooks at the table make the
        meal even better.
      </>
    ),
    descVi: (
      <>
        <em>Chả cá Lã Vọng</em> (chả cá nướng Lã Vọng) không chỉ là bảo vật ẩm
        thực của Hà Nội mà còn là một trong những nét chấm phá đặc sắc nhất của
        Việt Nam. Ngôi sao của món ăn là <em>cá lăng</em>—loài cá nước ngọt nổi
        tiếng với thớ thịt mềm ngọt, đậm đà và giàu dinh dưỡng. Cá được chế biến
        khéo léo để khử sạch mùi tanh mà vẫn giữ được độ ngọt mọng. Khi phục vụ,
        cá được xào nóng trên chảo cùng rất nhiều thì là tươi và hành hoa—những
        nguyên liệu mộc mạc tôn lên hương vị tuyệt hảo của nhau. Món ăn được
        dùng kèm với bún tươi, lạc rang giòn bùi và mắm tôm đậm đà. Người bản
        địa thường thêm ớt tươi và nước cốt chanh vào mắm tôm để dậy vị cay
        nồng. Tiếng xèo xèo vui tai và làn khói thơm phức lan tỏa ngay tại bàn
        khiến bữa ăn càng thêm phần hấp dẫn.
      </>
    ),
    tip: "If shrimp paste is too strong for you, you can use fish sauce instead. Ask for both if you're curious and want to compare.",
    tipVi:
      "Nếu mắm tôm quá nồng đối với bạn, bạn có thể dùng nước mắm thay thế. Hãy xin cả hai loại nếu tò mò muốn so sánh hương vị.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Cha Ca Thang Long (6B Duong Thanh): 120,000 VND",
      "Cha Ca Phan (14 Nguyen Binh Khiem): 135,000 VND",
    ],
    whereToEatVi: [
      "Chả Cá Thăng Long (6B Đường Thành): 120.000 VNĐ",
      "Chả Cá Phan (14 Nguyễn Bỉnh Khiêm): 135.000 VNĐ",
    ],
  },
  {
    id: "pho-cuon",
    index: 6,
    title: "6. Pho Cuon & Pho Ran",
    titleVi: "6. Phở Cuốn & Phở Rán",
    img: "/guide/hcmc/Pho-Cuon-Hanoi-food.jpg",
    alt: "Pho Cuon & Pho Ran - Rolled & Fried Pho Hanoi",
    desc: (
      <>
        To cool down in Hanoi&apos;s summer, locals created dry versions of{" "}
        <em>pho</em>: <em>pho cuon</em> and <em>pho ran</em> (pho rolls and
        deep-fried pho). These dishes still use pho noodles, beef, and herbs.{" "}
        <em>Pho cuon</em> wraps stir-fried beef and herbs in wide rice noodle
        sheets, like a soft spring roll. It&apos;s eaten with a tangy dipping
        sauce and is light and refreshing. <em>Pho ran</em> is different—it
        fries the noodles until crispy, then adds stir-fried beef and veggies.
        There&apos;s also <em>pho chien phong</em>, where noodle squares are
        fried into golden puffs and topped with beef and onions. Each version
        gives you the classic <em>pho</em> flavor in a fun, new way.
      </>
    ),
    descVi: (
      <>
        Để giải nhiệt những ngày hè oi ả ở Hà Nội, người dân địa phương đã sáng
        tạo ra các phiên bản phở khô: <em>phở cuốn</em> và <em>phở rán</em>. Các
        món ăn này vẫn sử dụng bánh phở, thịt bò và rau thơm tươi ngon.{" "}
        <em>Phở cuốn</em> cuộn đều thịt bò xào lăn cùng rau thơm trong tấm bánh
        phở bản rộng mềm mại, tương tự như món gỏi cuốn tươi mát. Bánh được chấm
        cùng nước chấm chua ngọt thanh thanh, rất nhẹ nhàng và dễ chịu.{" "}
        <em>Phở rán</em> lại mang phong cách khác biệt—bánh phở được chiên giòn
        rụm rồi phủ lên trên thịt bò xào rau củ sốt đậm đà. Ngoài ra còn có{" "}
        <em>phở chiên phồng</em>, nơi các miếng bánh phở vuông vắn được chiên
        phồng xốp vàng ươm và phủ thịt bò xào hành tây. Mỗi phiên bản đều mang
        đến hương vị phở kinh điển theo một cách mới lạ đầy thú vị.
      </>
    ),
    tip: "These dishes come in big portions—great for sharing. If eating alone, just pick one.",
    tipVi:
      "Các món ăn này thường được phục vụ theo phần ăn lớn—rất thích hợp để chia sẻ cùng nhau. Nếu đi ăn một mình, bạn chỉ cần chọn một món là vừa đủ no.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Pho Cuon 31 Ngu Xa (31 Ngu Xa): 48,000 VND",
      "Pho Cuon Chinh Thang (7 Mac Dinh Chi): 80,000 VND",
    ],
    whereToEatVi: [
      "Phở Cuốn 31 Ngũ Xã (31 Ngũ Xã): 48.000 VNĐ",
      "Phở Cuốn Chinh Thắng (7 Mạc Đĩnh Chi): 80.000 VNĐ",
    ],
  },
  {
    id: "ngan-chay-toi",
    index: 7,
    title: "7. Ngan Chay Toi",
    titleVi: "7. Ngan Cháy Tỏi",
    img: "/guide/hcmc/Ngan-chay-toi-Hanoi-Vietnamnomad.jpg",
    alt: "Ngan Chay Toi - Garlic Crispy Duck Hanoi",
    desc: (
      <>
        <em>Ngan chay toi</em> is crispy duck fried with garlic. The duck is
        marinated, then fried with lots of garlic until golden and crunchy. You
        get juicy duck with crispy garlic that&apos;s hard to resist. A full
        meal comes with duck (fried or boiled—or both), your choice of noodles
        (rice vermicelli or glass noodles), bamboo shoot soup, fresh herbs, and
        a strong garlic-ginger fish sauce. It&apos;s served on a tray with low
        stools—just like locals eat. This dish is hearty, flavorful, and perfect
        for cooler evenings in Hanoi.
      </>
    ),
    descVi: (
      <>
        <em>Ngan cháy tỏi</em> là món thịt ngan chiên giòn ngập trong tỏi thơm
        lừng. Thịt ngan được tẩm ướp đậm đà, sau đó chiên cùng rất nhiều tỏi cho
        đến khi ngả màu vàng ươm và giòn rụm. Bạn sẽ được thưởng thức từng miếng
        thịt ngan mọng nước bọc ngoài lớp tỏi chiên giòn bùi khó lòng cưỡng lại.
        Một mâm ăn trọn vẹn thường gồm thịt ngan (chiên cháy tỏi hoặc luộc—hoặc
        cả hai loại), bún tươi hoặc miến tùy chọn, bát canh măng tiết nóng hổi,
        rau thơm tươi non và chén nước chấm mắm gừng tỏi ớt thơm nồng. Món ăn
        được dọn trên mâm nhôm đặt trên những chiếc ghế nhựa con—đúng phong cách
        ăn uống vỉa hè của người Hà Nội. Đây là món ăn đầy đặn, đậm đà và đặc
        biệt lý tưởng cho những buổi tối se lạnh tại Hà Nội.
      </>
    ),
    tip: "Get half-fried and half-boiled duck to try both styles. Mix the meat with the noodles and dip for the best balance of taste.",
    tipVi:
      "Hãy gọi nửa phần ngan cháy tỏi và nửa phần ngan luộc để thưởng thức cả hai hương vị. Trộn thịt cùng bún và chấm ngập nước mắm gừng để cảm nhận sự cân bằng vị giác tuyệt vời nhất.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Ngan Chay Toi Thuy Luong (51 Hang Luoc): 230,000 VND",
      "Bun Ngan Hang Thiec Dung Huyen (61 Hang Thiec): 250,000 VND",
    ],
    whereToEatVi: [
      "Ngan Cháy Tỏi Thủy Lương (51 Hàng Lược): 230.000 VNĐ",
      "Bún Ngan Hàng Thiếc Dũng Huyền (61 Hàng Thiếc): 250.000 VNĐ",
    ],
  },
  {
    id: "ca-phe-trung",
    index: 8,
    title: "8. Ca Phe Trung",
    titleVi: "8. Cà Phê Trứng",
    img: "/guide/hcmc/Top-Hanoi-foods-Ca-Phe-Trung-Vietnamnomad.jpg",
    alt: "Ca Phe Trung - Vietnamese Egg Coffee Hanoi",
    desc: (
      <>
        It&apos;s not food, but <em>ca phe trung</em> (egg coffee) is a key part
        of Hanoi&apos;s food scene. This drink stands out because of its unique
        mix: whipped egg yolk and hot black coffee. Some people think it tastes
        like dessert because it&apos;s rich and creamy, like whipped cream.
        It&apos;s simple—just eggs and coffee—but balanced perfectly to create a
        famous Hanoi drink. Many cafes use a hidden recipe that has been passed
        down for generations. It&apos;s sweet, strong, and unlike anything else.
      </>
    ),
    descVi: (
      <>
        Tuy không phải là món ăn, nhưng <em>cà phê trứng</em> chính là một mảnh
        ghép không thể thiếu trong bức tranh ẩm thực Hà Nội. Thức uống này nổi
        bật nhờ sự pha trộn độc đáo: lòng đỏ trứng gà đánh bông mịn và cà phê
        đen nóng đậm đà. Nhiều thực khách cảm nhận nó có vị ngọt béo ngậy tựa
        như một món tráng miệng với lớp kem tươi bông mềm. Thành phần đơn
        giản—chỉ gồm trứng và cà phê—nhưng được cân bằng một cách hoàn hảo để
        tạo nên thức uống trứ danh của Hà Thành. Rất nhiều quán cà phê gìn giữ
        bí quyết pha chế gia truyền qua nhiều thế hệ. Một ly cà phê ngọt thơm,
        đậm vị và mang dấu ấn độc nhất vô nhị.
      </>
    ),
    tip: "Drink it while it's still hot. If it cools down, it can taste a little eggy. For first-timers, stir gently and sip slowly to enjoy the texture.",
    tipVi:
      "Hãy thưởng thức khi cà phê còn nóng hổi. Nếu để nguội, thức uống có thể hơi vương vị tanh của trứng. Với những người lần đầu nếm thử, hãy khuấy thật nhẹ và nhấp từng ngụm chậm rãi để tận hưởng trọn vẹn lớp bọt kem bồng bềnh.",
    whereToEatTitle: "Where to drink:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Cafe Giang (39 Nguyen Huu Huan): 40,000 VND",
      "Cafe Dinh (13 Dinh Tien Hoang): 30,000 VND",
    ],
    whereToEatVi: [
      "Cà Phê Giảng (39 Nguyễn Hữu Huân): 40.000 VNĐ",
      "Cà Phê Đinh (13 Đinh Tiên Hoàng): 30.000 VNĐ",
    ],
  },
];

export default function HanoiFoodGuidePage() {
  const [lang, setLang] = useState("vi");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);

  useEffect(() => {
    setLang(getLang());
    const handleLang = (e) => {
      const newLang =
        typeof e?.detail === "string"
          ? e.detail
          : e?.detail?.lang || getLang();
      if (newLang) setLang(newLang);
    };
    const handleStorage = () => setLang(getLang());

    window.addEventListener("vinatap:lang-updated", handleLang);
    window.addEventListener("languageChange", handleLang);
    window.addEventListener("langchange", handleLang);
    window.addEventListener("vina_language_change", handleLang);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLang);
      window.removeEventListener("languageChange", handleLang);
      window.removeEventListener("langchange", handleLang);
      window.removeEventListener("vina_language_change", handleLang);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isVi = lang === "vi";

  return (
    <div className="vnn-article-page">
      {/* ── Top Companion Banner (Screenshot 3) ── */}
      <PublicHeader onBannerClick={() => setAiCompanionOpen(true)} />

      {/* ── Full-Bleed Hero Banner (Screenshot 3) ── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag">HANOI</span>
            <span className="vnn-fullbleed-hero__tag">ARTICLES</span>
            <span className="vnn-fullbleed-hero__tag">EAT &amp; DRINK</span>
          </div>
          <h1 className="vnn-fullbleed-hero__title">
            {isVi
              ? "8 món ngon nhất định phải thử tại Hà Nội"
              : "8 must-try foods in Hanoi"}
          </h1>
          <div className="vnn-fullbleed-hero__byline">
            <Logo
              size={20}
              showText={true}
              noLink
              href={null}
              as="span"
              className="vnn-hero-author-logo"
            />
            <span>•</span>
            <span>{isVi ? "15 Tháng 10, 2026" : "October 15, 2026"}</span>
          </div>
        </div>
      </section>

      {/* ── Article Content Container ── */}
      <main className="vnn-article-container">
        {/* Pill CTA Button (Screenshot 3 & 4) */}
        <div className="vnn-pill-cta-container">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="vnn-pill-cta-btn"
          >
            <Sparkles size={16} />
            {isVi
              ? "Tạo kế hoạch du lịch Việt Nam chỉ trong vài giây"
              : "Create your Vietnam trip in seconds"}
          </a>
        </div>

        {/* Lead Intro Paragraph (Screenshot 3 & 4) */}
        <p className="vnn-article-lead">
          {isVi ? (
            <>
              Hà Nội là nơi ẩm thực gắn liền với truyền thống và sự tỉ mỉ. Những
              món ăn ở đây càng trở nên đặc sắc nhờ nét cổ kính của mảnh đất
              kinh kỳ và sự kiên định của những người đầu bếp với phương pháp
              nấu nướng thủ công. Họ từ chối các lối tắt nhanh gọn để giữ trọn
              vẹn hương vị xưa cũ. Mỗi bữa ăn ở Hà Nội đều kể một câu chuyện
              riêng, phản ánh bề dày lịch sử, văn hóa và niềm tự hào về bản sắc
              ẩm thực dân tộc. Cùng Vietnamnomad khám phá 8 đặc sản làm nên nét
              cuốn hút đặc biệt của ẩm thực Hà Nội.
            </>
          ) : (
            <>
              Hanoi is where food means tradition and care. Dishes here are made
              better by the city&apos;s old charm and the chefs&apos; loyalty to
              handmade cooking. These chefs refuse shortcuts and prefer to do
              things the traditional way. Every meal in Hanoi tells a story,
              reflecting the city&apos;s history, culture, and pride in its
              culinary identity. Let&apos;s explore 8 specialties that make
              Hanoi&apos;s food scene so special with Vietnamnomad.
            </>
          )}
        </p>

        {/* ── 8 Dishes List (Screenshots 4 & 5) ── */}
        <div className="vnn-dishes-list">
          {HANOI_8_DISHES.map((dish) => (
            <article key={dish.id} className="vnn-dish-item" id={dish.id}>
              <h2 className="vnn-dish-title">
                {isVi ? dish.titleVi : dish.title}
              </h2>
              <div className="vnn-dish-layout">
                {/* Column 1: Crisp Sharp Image (420px) */}
                <div className="vnn-dish-img-col">
                  <img
                    src={dish.img}
                    alt={dish.alt}
                    className="vnn-dish-img"
                    loading="lazy"
                  />
                </div>

                {/* Column 2: Detailed Text Content */}
                <div className="vnn-dish-content-col">
                  <p className="vnn-dish-text">
                    {isVi ? dish.descVi : dish.desc}
                  </p>

                  {/* Tip */}
                  {dish.tip && (
                    <p
                      style={{
                        margin: "14px 0",
                        color: "#334155",
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>Tip:</strong> {isVi ? dish.tipVi : dish.tip}
                    </p>
                  )}

                  {/* Where to eat / Địa chỉ */}
                  <span className="vnn-dish-subhead">
                    {isVi ? dish.whereToEatTitleVi : dish.whereToEatTitle}
                  </span>

                  <ul className="vnn-dish-bullets">
                    {(isVi ? dish.whereToEatVi : dish.whereToEat)?.map(
                      (spot, idx) => (
                        <li key={idx}>{spot}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── SPECIAL SPOTLIGHT: BANH MI LONG HOI (7 HANG QUAT) ── */}
        <section
          style={{
            margin: "44px 0",
            padding: "28px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #ffffff 100%)",
            border: "2px solid #fde68a",
            boxShadow: "0 10px 25px rgba(217, 119, 6, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "14px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #d97706, #b45309)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "4px 12px",
                borderRadius: "9999px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {isVi ? "★ ĐỐI TÁC ẨM THỰC ĐỒNG HÀNH" : "★ FEATURED CULINARY PARTNER"}
            </span>
            <span style={{ fontSize: "12.5px", color: "#b45309", fontWeight: "700" }}>
              📍 {isVi ? "Số 7 Hàng Quạt, Hoàn Kiếm, Hà Nội (Cách Bờ Hồ 200m)" : "No. 7 Hang Quat, Hoan Kiem, Hanoi (Near Lake)"}
            </span>
          </div>

          <div className="vnn-dish-layout" style={{ marginTop: "16px" }}>
            <div className="vnn-dish-img-col">
              <img
                src="/guide/banh-mi-long-hoi/banh-mi-truyen-thong.png"
                alt="Bánh Mì Long Hội 7 Hàng Quạt"
                className="vnn-dish-img"
                style={{ borderRadius: "12px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
              />
            </div>
            <div className="vnn-dish-content-col">
              <h3
                style={{
                  fontSize: "21px",
                  fontWeight: "800",
                  color: "#1e293b",
                  margin: "0 0 10px 0",
                  lineHeight: "1.35",
                }}
              >
                {isVi
                  ? "Trải nghiệm đặc biệt: Bánh Mì Long Hội – Tinh hoa xứ Hội giữa lòng Phố Cổ"
                  : "Special Recommendation: Long Hoi Banh Mi – Taste of Hoi An in Hanoi"}
              </h3>
              <p className="vnn-dish-text">
                {isVi
                  ? "Bên cạnh các món bún phở truyền thống, dạo phố cổ Hà Nội mà không thưởng thức một ổ bánh mì giòn tan sẽ là điều vô cùng thiếu sót. Nằm tại số 7 Hàng Quạt (ngay gần đền Ngọc Sơn & Hồ Hoàn Kiếm), Bánh Mì Long Hội gây ấn tượng mạnh với lớp vỏ bánh giòn xốp không vụn nát, pate gan ngậy béo gia truyền, thịt xíu mềm mọng và rau ngò Trà Quế thơm cay dịu. Tiệm có đầy đủ các lựa chọn từ Bánh mì Tình Yêu (90k signature) đến Bánh mì An Lạc (50k thuần chay rất được du khách quốc tế ưa chuộng)."
                  : "Strolling through Hanoi Old Quarter without savoring a crusty banh mi is an incomplete journey. Located at 7 Hang Quat Street (a short stroll from Hoan Kiem Lake), Long Hoi Banh Mi stands out for bringing authentic Hoi An flavors to Hanoi. Packed with rich homemade pate, tender char siu pork, and fresh Tra Que herbs inside a golden crispy baguette. Options range from the signature Love Banh Mi (90k) to the popular An Lac vegetarian banh mi (50k)."}
              </p>

              <div style={{ marginTop: "18px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <Link
                  href="/guide/banh-mi-long-hoi"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#d97706",
                    color: "#ffffff",
                    padding: "8px 18px",
                    borderRadius: "9999px",
                    fontSize: "13px",
                    fontWeight: "700",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(217, 119, 6, 0.3)",
                  }}
                >
                  {isVi ? "Xem thực đơn & câu chuyện Long Hội →" : "View Long Hoi Menu & Story →"}
                </Link>
                <a
                  href="https://maps.google.com/?q=B%C3%A1nh+m%C3%AC+Long+H%E1%BB%99i,+7+H%C3%A0ng+Qu%E1%BA%A1t,+H%C3%A0+N%E1%BB%99i"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ffffff",
                    color: "#1e293b",
                    border: "1px solid #cbd5e1",
                    padding: "8px 16px",
                    borderRadius: "9999px",
                    fontSize: "13px",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  📍 {isVi ? "Chỉ đường 7 Hàng Quạt" : "Directions to 7 Hang Quat"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing Paragraph ── */}
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#334155",
            margin: "36px 0 24px",
          }}
        >
          {isVi ? (
            <>
              Danh sách trên đây chỉ là một phần nhỏ trong bản đồ ẩm thực của Hà
              Nội. Dẫu vậy, đây là những món ăn đặc sắc nhất thể hiện sự sáng
              tạo và tài hoa của các đầu bếp địa phương. Đừng rời Hà Nội mà chưa
              thử một (hoặc tất cả) những món ăn này.
            </>
          ) : (
            <>
              The list above is just a small part of Hanoi&apos;s food map.
              Still, these are some of the most special dishes that show the
              creativity and skill of local chefs. Don&apos;t leave Hanoi
              without trying one (or all) of them.
            </>
          )}
        </p>

        {/* ── Affiliate Deals: Food Tour, Cooking Class & Old Quarter Hotels ── */}
        <AffiliateDealBox deal={HANOI_AFFILIATE_DEALS.streetFoodTour} lang={lang} />
        <AffiliateDealBox deal={HANOI_AFFILIATE_DEALS.cookingAndCoffeeClass} lang={lang} />
        <AffiliateDealBox deal={HANOI_AFFILIATE_DEALS.oldQuarterHotels} lang={lang} />

        {/* ── Disclaimer Note ── */}
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#334155",
            margin: "0 0 28px",
            fontStyle: "italic",
          }}
        >
          {isVi
            ? "Note: Các gợi ý nhà hàng chỉ dựa trên trải nghiệm của tác giả; giá cả thực tế có thể thay đổi tùy thời điểm."
            : "Note: Restaurant recommendations are based on the authors' experiences; prices may vary."}
        </p>

        {/* ── Tags (Matching Screenshot 1) ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "24px 0 40px",
            flexWrap: "wrap",
          }}
        >
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
            {isVi ? "Ẩm thực Hà Nội" : "Hanoi food"}
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
            {isVi ? "Ẩm thực Việt Nam" : "Vietnamese food"}
          </span>
        </div>

        {/* ── Divider ── */}
        <hr
          style={{
            border: 0,
            height: "1px",
            background: "#e2e8f0",
            margin: "40px 0",
          }}
        />

        {/* ── Related Articles (Matching Screenshot 2) ── */}
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
            {/* Card 1: 3-week Vietnam Itinerary */}
            <Link
              href="/guide/3-week-vietnam-itinerary"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  borderRadius: "8px",
                  background: "#f1f5f9",
                }}
              >
                <img
                  src="/guide/megamenu/todo-1-3week.jpg"
                  alt="3-week Vietnam Itinerary"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginTop: "12px",
                  lineHeight: 1.4,
                }}
              >
                {isVi
                  ? "Lịch trình 3 tuần xuyên Việt"
                  : "3-week Vietnam Itinerary"}
              </h3>
            </Link>

            {/* Card 2: 10 best things to do in Ho Chi Minh City */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  borderRadius: "8px",
                  background: "#f1f5f9",
                }}
              >
                <img
                  src="/guide/megamenu/todo-2-hcmc.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginTop: "12px",
                  lineHeight: 1.4,
                }}
              >
                {isVi
                  ? "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh"
                  : "10 best things to do in Ho Chi Minh City"}
              </h3>
            </Link>

            {/* Card 3: 12 must-try foods in Ho Chi Minh City */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  borderRadius: "8px",
                  background: "#f1f5f9",
                }}
              >
                <img
                  src="/guide/hcmc/hcmc-12-foods-hd.jpg"
                  alt="12 must-try foods in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginTop: "12px",
                  lineHeight: 1.4,
                }}
              >
                {isVi
                  ? "12 món ăn nhất định phải thử tại TP. Hồ Chí Minh"
                  : "12 must-try foods in Ho Chi Minh City"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ── PUBLIC FOOTER FROM HOMEPAGE ── */}
      <PublicFooter lang={lang} />

      {/* ── FLOATING PROVINCE CHATBOT ── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        province={{
          name: isVi ? "Hà Nội" : "Hanoi",
          slug: "ha-noi",
        }}
      />
    </div>
  );
}
