"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  Share2,
  MapPin,
  Lightbulb,
  CheckCircle,
  Sparkles,
  Maximize2,
  X,
} from "lucide-react";
import "@/styles/home.css";
import "./nha-trang-food.css";

// ─── MEGAMENUS DATA (STANDARDIZED VNN EDITORIAL NAVBAR 2026) ───
const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
        date: "June 16, 2026",
        dateVi: "16 Tháng 6, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-1.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
      {
        id: "insp-2",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        date: "April 1, 2026",
        dateVi: "1 Tháng 4, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "January 9, 2026",
        dateVi: "9 Tháng 1, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "insp-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "September 18, 2026",
        dateVi: "18 Tháng 9, 2026",
        badge: "Featured Articles",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/guide/ao-dai-vietnamese-traditional-dress",
      },
    ],
  },
  destinations: {
    items: [
      {
        id: "dest-1",
        title: "Ho Chi Minh City",
        titleVi: "TP. Hồ Chí Minh",
        date: "October 5, 2026",
        dateVi: "5 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "September 25, 2026",
        dateVi: "25 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "September 22, 2026",
        dateVi: "22 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Nha Trang (Khanh Hoa)",
        titleVi: "Nha Trang (Khánh Hòa)",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "September 10, 2026",
        dateVi: "10 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  thingsToDo: {
    items: [
      {
        id: "todo-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 5, 2026",
        dateVi: "5 Tháng 10, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "todo-2",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "March 1, 2026",
        dateVi: "1 Tháng 3, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "todo-3",
        title: "10 Best Things to Do in HCMC",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP.HCM",
        date: "January 15, 2026",
        dateVi: "15 Tháng 1, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
        title: "5 Best Vung Tau Beaches",
        titleVi: "5 bãi biển đẹp nhất tại Vũng Tàu",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Things to Do",
        img: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
        link: "/guide/5-best-vung-tau-beaches",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món ăn phải nếm khi đến Nha Trang",
        date: "February 17, 2026",
        dateVi: "17 Tháng 2, 2026",
        badge: "Eat & Drink",
        img: "/guide/nha-trang/5-must-try-food-in-Nha-Trang-Vietnamnomad.jpg",
        link: "/guide/5-must-try-nha-trang-dishes",
      },
      {
        id: "eat-2",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
        date: "April 25, 2026",
        dateVi: "25 Tháng 4, 2026",
        badge: "Eat & Drink",
        img: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
      {
        id: "eat-3",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ăn phải thử tại Hà Nội",
        date: "October 2, 2026",
        dateVi: "2 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-4",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "September 8, 2026",
        dateVi: "8 Tháng 8, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-5",
        title: "8 must-try foods in Dalat",
        titleVi: "8 món ăn phải thử tại Đà Lạt",
        date: "September 23, 2026",
        dateVi: "23 Tháng 9, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 5, 2026",
        dateVi: "5 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam: The Best Route",
        titleVi: "10 ngày tại Việt Nam: Lộ trình hoàn hảo",
        date: "May 14, 2026",
        dateVi: "14 Tháng 5, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam: North to South",
        titleVi: "2 tuần tại Việt Nam: Xuyên Việt từ Bắc vào Nam",
        date: "April 20, 2026",
        dateVi: "20 Tháng 4, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam: The Ultimate Journey",
        titleVi: "1 tháng tại Việt Nam: Hành trình trọn vẹn",
        date: "March 10, 2026",
        dateVi: "10 Tháng 3, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
    ],
  },
};

// ─── 5 DISHES DATA (AUTHENTIC NHA TRANG LOCAL SPECIALTIES) ───
const DISHES_DATA = [
  {
    id: "bun-ca",
    index: 1,
    name: "Bun Ca (Fish Noodle Soup)",
    nameVi: "Bún chả cá Nha Trang (Fish Noodle Soup)",
    tag: "Nước dùng thanh trong",
    tagEn: "Signature coastal broth",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Bun-Cha-Ca-Vietnamnomad.jpg",
    caption:
      "Tô bún chả cá Nha Trang với nước dùng thanh ngọt nấu từ xương cá biển, cà chua và dứa",
    captionEn:
      "Nha Trang fish cake noodle soup served in a naturally sweet and tangy seafood broth",
    desc:
      "Bun Ca is a beloved dish that showcases the abundant seafood of this coastal region. The broth is gently simmered with fresh fish bones, ripe tomatoes, and pineapple, creating a beautiful balance of sweet and tangy flavors without being heavy or oily. The dish is served in a steaming bowl with rice noodles and generous slices of golden fried fish cakes, steamed fish cakes, tuna or mackerel fillets, garnished with fresh scallions and dill. The fish cakes are crafted from fresh mackerel puree beaten vigorously with local herbs and peppercorn until bouncy and chewy. It is the absolute favorite choice for breakfast or lunch across Nha Trang.",
    descVi:
      "Bún chả cá là món ăn mang tính biểu tượng, tôn vinh nguồn hải sản dồi dào của vịnh biển Nha Trang. Khác với bún cá nhiều nơi ninh từ xương heo, nước dùng bún cá Nha Trang được ninh hoàn toàn từ xương cá thu, cá cờ biển tươi cùng cà chua và dứa (thơm), tạo nên vị thanh ngọt tự nhiên, không hề váng mỡ. Điểm nhấn làm nên linh hồn bát bún chính là những miếng chả cá thu chiên vàng ruộm và chả cá hấp trắng mịn. Thịt cá được quết nhuyễn tay cùng thì là, tiêu sọ cay nồng tạo độ dai giòn sần sật khó quên. Bát bún nghi ngút khói, ăn kèm rau sống thái nhỏ, thêm chút ớt hiểm và mắm tôm tạo nên trải nghiệm ấm lòng cả sáng lẫn trưa.",
    tip:
      "Go for Bun Cha Ca if you’re keen on chewy fish cakes, or Bun Ca if you prefer whole fresh fish fillets. You can also opt for Banh Canh Cha Ca, which features thick, bouncy round tapioca noodles in the same luscious broth.",
    tipVi:
      "Nếu thích độ dai giòn thơm ngậy hãy gọi Bún Chả Cá, hoặc chọn Bún Cá nếu thích thịt cá thu phi lê nguyên miếng. Ngoài bún sợi nhỏ, bạn có thể thử Bánh Canh Chả Cá với sợi bột gạo/lọc dẻo dai đặc trưng.",
    places: [
      {
        name: "Bún Chả Cá Hạnh Nhiên",
        address: "32C Lê Đại Hành, P. Tân Lập, Nha Trang",
        price: "35,000 VND – 55,000 VND (~$1.4 – $2.2)",
      },
      {
        name: "Bún Cá Nguyên Loan",
        address: "123 Ngô Gia Tự, P. Tân Lập, Nha Trang",
        price: "45,000 VND (~$1.8)",
      },
      {
        name: "Bún Cá Mịn",
        address: "170 Bạch Đằng, P. Tân Lập, Nha Trang",
        price: "40,000 VND – 50,000 VND (~$1.6 – $2.0)",
      },
    ],
  },
  {
    id: "bun-sua",
    index: 2,
    name: "Bun Sua (Jellyfish Noodle Soup)",
    nameVi: "Bún sứa Nha Trang (Jellyfish Noodle Soup)",
    tag: "Đặc sản biển thanh mát",
    tagEn: "Crunchy coastal delicacy",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Bun-Sua-by-Vietnamnomad.jpg",
    caption:
      "Những miếng sứa biển trắng trong giòn sần sật hòa cùng chả cá thu trong tô bún thanh mát",
    captionEn:
      "Crisp, translucent offshore jellyfish paired with savoury fish cakes in a light seafood broth",
    desc:
      "Another traditional seafood noodle dish, but this time with a delightful coastal twist. Bun Sua is essentially an extension of the iconic Bun Ca, but loaded with bite-sized chunks of translucent jellyfish caught far offshore in the deep sea. Unlike seasonal stinging jellyfish, this edible type is small, thick-walled, and incredibly crisp. The crunchiness of the chilled jellyfish contrasts magnificently against the soft warmth of the rice noodles and the chewy fish cake. A squeeze of fresh lime juice and a spoonful of fried chili paste elevate the broth into an explosion of umami that lingers long on the palate.",
    descVi:
      "Bún sứa là khúc biến tấu độc đáo bậc nhất của ẩm thực miền biển Khánh Hòa. Người Nha Trang sử dụng loại sứa nhỏ bằng ngón tay cái, màu trắng đục, mình dày được đánh bắt tận ngoài khơi xa. Sứa được ngâm nước lá ổi hoặc phèn trong vắt để giữ trọn độ giòn tan, thanh mát mà không hề tanh. Khi thưởng thức, từng miếng sứa sần sật mọng nước tan đều trong miệng, tương phản hoàn hảo với sợi bún mềm mại và miếng chả cá đậm đà. Nước dùng nấu từ cá liệt biển ngọt lịm, vắt thêm lát chanh tươi và thìa ớt sa tế cay nồng là chuẩn phong vị sảng khoái ngày nắng biển.",
    tip:
      "Diners can order 'Bun Ca Sua' to enjoy both savory fish cakes and crunchy jellyfish in one bowl. The same crunchy jellyfish is also widely used in delicious local appetizers like Goi Sua (jellyfish mango salad).",
    tipVi:
      "Hãy gọi ngay một tô 'Bún Cá Sứa' để thưởng thức trọn vẹn cả chả cá thu dai bùi và sứa biển giòn sần sật. Sứa biển giòn ngon này cũng là nguyên liệu chính của món Gỏi sứa bắp chuối trứ danh.",
    places: [
      {
        name: "Bún Cá Nguyên Loan",
        address: "123 Ngô Gia Tự, P. Tân Lập, Nha Trang",
        price: "45,000 VND (~$1.8)",
      },
      {
        name: "Bún Sứa Cô Ba",
        address: "105 Hoàng Hoa Thám, P. Lộc Thọ, Nha Trang",
        price: "48,000 VND (~$1.9)",
      },
      {
        name: "Bún Sứa Năm Beo",
        address: "Chung cư B2 Phan Bội Châu, Nha Trang",
        price: "40,000 VND – 50,000 VND (~$1.6 – $2.0)",
      },
    ],
  },
  {
    id: "banh-can",
    index: 3,
    name: "Banh Can (Crispy Mini Rice Pancakes)",
    nameVi: "Bánh căn Nha Trang (Crispy Terracotta Mini Pancakes)",
    tag: "Đồ ăn vặt số 1",
    tagEn: "Top all-day street snack",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Banh-Can-Vietnamnomad.jpg",
    caption:
      "Bánh căn đúc nóng hổi trong khuôn gốm nung than củi cùng mực cơm, tôm tươi và trứng cút",
    captionEn:
      "Golden crispy mini rice pancakes freshly baked in terracotta clay molds over charcoal",
    desc:
      "Banh Can are small, savory rice flour pancakes that stand as a favorite all-day snack in Nha Trang. Cooked in unglazed earthen clay moulds directly over glowing charcoal fires, they form an irresistible crispy base while maintaining a soft, fluffy interior. The toppings highlight Nha Trang's coastal abundance: tiny baby squids that burst with natural sweetness, fresh prawns, quail eggs, and seasoned minced beef or pork. The magic of Banh Can lies in its warm dipping sauce, enriched with green onion oil (mo hanh), roasted chili, and served alongside tender xiu mai (pork meatballs) or cha bo wrapped in banana leaves.",
    descVi:
      "Bánh căn là món ăn đường phố mà bất kỳ du khách nào ghé Nha Trang cũng đem lòng say đắm. Những chiếc bánh nhỏ tròn xoe được đổ trong khuôn đất nung không tráng dầu, đặt trên lò than hồng rực lửa. Nhiệt độ của gốm nung giúp vỏ bánh nở giòn rụm bên dưới nhưng ruột bánh vẫn mềm xốp thơm bùi mùi gạo nếp. Phía trên là topping ngập tràn: mực cơm tươi rói cắn ngập chân răng, tôm biển, trứng cút lòng đào hoặc thịt băm. Nước chấm bánh căn Nha Trang rất đa dạng: mắm nêm đậm đà thơm mùi dứa hoặc nước mắm pha mỡ hành thơm nức, dầm cùng xíu mại thịt viên béo ngậy và xoài xanh băm nhỏ.",
    tip:
      "When ordering, look for 'thap cam' or 'day du' on the menu—both mean 'with a bit of everything', allowing you to sample squid, shrimp, quail egg, and beef in a single plate.",
    tipVi:
      "Khi gọi món, hãy chọn đĩa 'thập cẩm' hoặc 'đầy đủ' để thưởng thức trọn vẹn cả mực sữa, tôm, trứng cút và thịt băm trong cùng một mẹt bánh nóng giòn.",
    places: [
      {
        name: "Bánh Xèo & Bánh Căn 134",
        address: "134 Trần Quý Cáp, P. Phương Sài, Nha Trang",
        price: "30,000 VND – 50,000 VND (~$1.2 – $2.0)",
      },
      {
        name: "Bánh Căn Út Năm",
        address: "19 Ngô Đến, P. Vĩnh Phước, Nha Trang",
        price: "25,000 VND – 60,000 VND (~$1.0 – $2.4)",
      },
      {
        name: "Bánh Căn 51",
        address: "51 Tô Hiến Thành, P. Tân Lập, Nha Trang",
        price: "40,000 VND – 80,000 VND (~$1.6 – $3.2)",
      },
    ],
  },
  {
    id: "xoi-ca",
    index: 4,
    name: "Xoi Ca (Caramelized Fish Sticky Rice)",
    nameVi: "Xôi cá cơm kho đậm đà (Caramelized Fish Sticky Rice)",
    tag: "Đặc sản độc bản",
    tagEn: "Unique coastal breakfast",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Xoi-Ca-Vietnamnomad.jpg",
    caption:
      "Hạt xôi dẻo ngậy cốt dừa kết hợp cá cơm mờm kho kẹo cay mặn ngọt bùi béo khó quên",
    captionEn:
      "Fragrant sticky rice served with slow-braised caramelized anchovies and golden fried shallots",
    desc:
      "Xoi Ca is a true culinary staple of Nha Trang City that is rarely encountered anywhere else in Vietnam. It is a deceptively simple yet deeply comforting breakfast that brings together the aromatic fragrance of the rice fields and the savory depth of the open ocean. The sticky glutinous rice is steamed with a touch of rich coconut milk. The undisputed champion of the dish is the caramelized fish—typically fresh anchovies (ca com) or scad (ca nuc)—slow-simmered in earthen pots until the bones turn completely tender and melt into sweet, salty, and chili-spiced caramel perfection.",
    descVi:
      "Xôi cá là món ngon 'độc bản' của riêng phố biển Nha Trang mà bạn hiếm khi tìm thấy ở bất kỳ vùng miền nào khác. Sự kết hợp giữa hạt nếp dẻo thơm của đồng bằng và cá biển tươi mặn mòi tạo nên nét dung dị mà gây thương nhớ khôn nguôi. Gạo nếp cái hoa vàng được đồ cùng chút nước cốt dừa béo thoang thoảng. Điểm nhấn là phần cá cơm hoặc cá nục được kho liu riu trong nồi đất suốt nhiều giờ liền, gia giảm ớt cay, đường thốt nốt và nước mắm nhỉ cho đến khi thịt cá săn lại, xương mềm rục có thể nhai tan. Rưới thêm muỗng nước kho kẹo quánh và rắc chút hành phi giòn tan, ăn vào buổi sáng bên bờ biển thật không gì sánh bằng.",
    tip:
      "Xoi Ca is primarily a morning street takeaway food. Grab a warm banana-leaf-wrapped box to enjoy with hot Vietnamese milk coffee right by the breezy Nha Trang coastline.",
    tipVi:
      "Xôi cá chủ yếu được bán vào buổi sáng mang đi. Bạn nên mua một gói xôi bọc lá chuối ấm nóng rồi ghé quán cà phê ven biển Trần Phú vừa ngắm bình minh vừa thưởng thức.",
    places: [
      {
        name: "Quán Xôi Sáu Khải",
        address: "1 Phật Học, P. Phương Sơn, Nha Trang",
        price: "30,000 VND (~$1.2)",
      },
      {
        name: "Xôi Cá Cơm Ngô Sĩ Liên",
        address: "9 Ngô Sĩ Liên, P. Vạn Thắng, Nha Trang",
        price: "20,000 VND – 25,000 VND (~$0.8 – $1.0)",
      },
    ],
  },
  {
    id: "nem-nuong",
    index: 5,
    name: "Nem Nuong (Nha Trang Grilled Pork Platter)",
    nameVi: "Nem nướng Ninh Hòa – Nha Trang (Grilled Pork Rolls)",
    tag: "Quốc hồn ẩm thực",
    tagEn: "Culinary royal icon",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Nem-Nuong-Vietnamnomad.jpg",
    caption:
      "Mẹt nem nướng than hoa thơm lừng cuộn cùng ram chiên giòn, xoài xanh và nước sốt tương tôm nếp sánh mịn",
    captionEn:
      "Grilled pork skewers served with crispy rice paper rolls, pickled green mango, and warm dipping puree",
    desc:
      "Nem Nuong is the undisputed king of Nha Trang gastronomy that no traveler should ever miss. Prime cuts of pork are finely minced, seasoned with garlic, shallots, and fish sauce, skewered onto bamboo sticks or fragrant lemongrass stalks, and grilled over charcoal embers until sizzled and smoky. A standard platter is a colorful feast: glistening grilled pork, crunchy golden fried rice paper rolls (ram), cucumber, crisp green mango shreds, starfruit, and fragrant herbs. Rolled tightly in chewy rice paper and dipped into the legendary warm, velvety orange sauce brewed from glutinous rice, minced pork, and shrimp paste, it delivers pure culinary bliss.",
    descVi:
      "Nem nướng Ninh Hòa chính là 'ngôi sao sáng nhất' trên bản đồ ẩm thực Nha Trang. Thịt heo nạc đùi tươi nóng hổi được quết nhuyễn cùng mỡ hạt lựu, tỏi, đường và nước mắm cốt, ghim vào que tre nướng trên than hoa đỏ rực cho đến khi xém vàng óng ánh và thơm nức mũi. Một mẹt nem nướng dọn ra như bức tranh rực rỡ sắc màu: nem que nóng hổi, ram chiên giòn tan (bánh tráng cuốn nhỏ chiên ngập dầu), dưa leo, xoài xanh bào sợi chua thanh, chuối chát, khế cùng đĩa rau thơm phong phú. Linh hồn quyết định của món ăn nằm ở chén nước chấm sền sệt màu vàng cam đặc trưng nấu từ nếp xay nhuyễn, gan heo băm, tôm biển và đậu phộng bùi ngậy, ngon đến mê mẩn.",
    tip:
      "The signature dipping sauce contains pureed shrimp; if you have a seafood allergy, request regular peanut sauce or chili fish sauce. If you prefer not wrapping with your bare hands, ask for 'Bun Nem Nuong' served convenient in a bowl.",
    tipVi:
      "Nước chấm nem nướng truyền thống có thành phần tôm xay nhuyễn; nếu bạn dị ứng hải sản hãy báo quán đổi sang nước tương hoặc nước mắm chua ngọt. Ngoài ra, bạn có thể gọi tô 'Bún Nem Nướng' để thưởng thức nhanh gọn.",
    places: [
      {
        name: "Nem Nướng Đặng Văn Quyên",
        address: "16A Lãn Ông / 02-04 Phan Bội Châu, Nha Trang",
        price: "52,000 VND (~$2.1)",
      },
      {
        name: "Nem Nướng Ninh Hòa – Tố Hữu",
        address: "80 Tố Hữu, P. Phước Hải, Nha Trang",
        price: "39,000 VND (~$1.6)",
      },
      {
        name: "Nem Nướng Vũ Thành An",
        address: "15 Lê Lợi, P. Xương Huân, Nha Trang",
        price: "45,000 VND (~$1.8)",
      },
    ],
  },
];

// ─── RELATED ARTICLES (STANDARDIZED TO 2026) ───
const RELATED_ARTICLES = [
  {
    title: "8 best things to do in Nha Trang",
    titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
    date: "March 1, 2026",
    dateVi: "1 Tháng 3, 2026",
    badge: "Things to Do",
    badgeVi: "Trải nghiệm",
    img: "/guide/megamenu/todo-3-nhatrang.jpg",
    link: "/guide/8-best-things-to-do-in-nha-trang",
  },
  {
    title: "7 must-try foods in Vung Tau",
    titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
    date: "April 25, 2026",
    dateVi: "25 Tháng 4, 2026",
    badge: "Eat & Drink",
    badgeVi: "Ẩm thực",
    img: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
    link: "/guide/7-must-try-foods-in-vung-tau",
  },
  {
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
    date: "September 8, 2026",
    dateVi: "8 Tháng 9, 2026",
    badge: "Eat & Drink",
    badgeVi: "Ẩm thực",
    img: "/guide/megamenu/eat-2-hcmc.jpg",
    link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
  },
];

export default function NhaTrangFoodGuidePage() {
  const [lang, setLang] = useState("vi");
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const menuTimerRef = useRef(null);

  // Sync language with global VinaTap prefs
  useEffect(() => {
    setLang(getLang() || "vi");

    const handleLangUpdated = (e) => {
      if (e.detail) setLang(e.detail);
    };

    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    const onStorage = (e) => {
      if (e.key === "vinatap_lang" && e.newValue) setLang(e.newValue);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Safe Scroll Progress indicator (RAF-throttled)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          if (totalScroll > 0) {
            setScrollProgress(
              Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100))
            );
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleMenuEnter = (menuKey) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(menuKey);
  };

  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleMegaMouseEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage(
        lang === "vi"
          ? "Đã sao chép liên kết vào bộ nhớ tạm!"
          : "Article link copied to clipboard!"
      );
    }
  };

  const handleCopyAddress = (address) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setToastMessage(
        lang === "vi"
          ? `Đã sao chép địa chỉ: ${address}`
          : `Copied address: ${address}`
      );
    }
  };

  return (
    <div className="vnn-article-page">
      {/* ── Reading Progress Bar ── */}
      <div
        className="vnn-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── Top Companion Banner ── */}
      <div className="vnn-top-banner">
        <div className="vnn-top-banner__container">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="vnn-top-banner__link"
          >
            <img
              src="/guide/top-banner-companion.png"
              alt="Vietnam Travel Companion 2026"
              className="vnn-top-banner__img"
            />
          </a>
        </div>
      </div>

      {/* ── Sticky Editorial Header Navbar ── */}
      <header className="vnn-navbar" onMouseLeave={handleMenuLeave}>
        <div className="vnn-navbar__inner">
          <Link href="/" className="vnn-navbar__brand">
            <div className="vnn-navbar__brand-vinatap">
              <Logo size={32} showText={false} noLink href={null} as="span" />
              <span>VinaTap</span>
            </div>
          </Link>

          <ul className="vnn-navbar__menu">
            {/* BE INSPIRED */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "inspired" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* DESTINATIONS */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "destinations" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* THINGS TO DO */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("thingsToDo")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "thingsToDo" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* EAT & DRINK */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "eat" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* ITINERARIES */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "itineraries" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <HeaderSearch />
            <LanguageSwitch variant="navbar" />
          </div>
        </div>

        {/* ─── HOVER MEGAMENU CONTAINER ─── */}
        {activeMenu && (
          <div
            className="vnn-megamenu"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="vnn-megamenu__grid">
              {(MEGA_MENUS_DATA[activeMenu]?.items || []).map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="vnn-megamenu__card"
                  onClick={() => setActiveMenu(null)}
                >
                  <div className="vnn-megamenu__thumb">
                    <img
                      src={item.img}
                      alt={lang === "vi" && item.titleVi ? item.titleVi : item.title}
                      className="vnn-megamenu__img"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="vnn-megamenu__badge">{item.badge}</span>
                    )}
                  </div>
                  <h4 className="vnn-megamenu__title">
                    {lang === "vi" && item.titleVi ? item.titleVi : item.title}
                  </h4>
                  <span className="vnn-megamenu__date">
                    {lang === "vi" && item.dateVi ? item.dateVi : item.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── FULL-BLEED HERO BANNER (ẢNH TO CẢ 1 HÀNG NGANG KHÔNG CÁCH) ── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag vnn-fullbleed-hero__tag--primary">
              {lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}
            </span>
            <span className="vnn-fullbleed-hero__tag">NHA TRANG</span>
            <span className="vnn-fullbleed-hero__tag">
              {lang === "vi" ? "CẨM NANG 2026" : "2026 GUIDE"}
            </span>
          </div>

          <h1 className="vnn-fullbleed-hero__title">
            {lang === "vi"
              ? "5 món ăn phải nếm khi đến Nha Trang"
              : "5 Must-Try Dishes in Nha Trang & Where to Find Them"}
          </h1>

          <div className="vnn-fullbleed-hero__meta">
            <span className="vnn-fullbleed-hero__author">VinaTap Editorial</span>
            <span className="vnn-fullbleed-hero__dot">•</span>
            <span>{lang === "vi" ? "17 Tháng 2, 2026" : "February 17, 2026"}</span>
            <span className="vnn-fullbleed-hero__dot">•</span>
            <span>{lang === "vi" ? "5 phút đọc" : "5 mins read"}</span>
            <span className="vnn-fullbleed-hero__dot">•</span>
            <button
              type="button"
              onClick={handleShare}
              className="vnn-meta-share-btn"
              title="Share article"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "13.5px",
              }}
            >
              <Share2 size={15} />
              <span>{lang === "vi" ? "Chia sẻ" : "Share"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Editorial Content Section ── */}
      <main className="vnn-container">
        {/* Breadcrumb Navigation */}
        <nav className="vnn-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">{lang === "vi" ? "Trang chủ" : "Home"}</Link>
          <span className="vnn-breadcrumb-separator">/</span>
          <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city">
            {lang === "vi" ? "Ẩm thực" : "Eat & Drink"}
          </Link>
          <span className="vnn-breadcrumb-separator">/</span>
          <Link href="/province/khanh-hoa">Nha Trang</Link>
          <span className="vnn-breadcrumb-separator">/</span>
          <span className="vnn-breadcrumb-current">
            {lang === "vi"
              ? "5 món ăn phải nếm khi đến Nha Trang"
              : "5 Must-Try Nha Trang Dishes"}
          </span>
        </nav>

        {/* Primary CTA Button to Tripion.ai */}
        <div className="vnn-pill-cta-wrap">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="vnn-pill-cta-btn"
          >
            <Sparkles size={18} />
            <span>
              {lang === "vi"
                ? "Lên kế hoạch du lịch Nha Trang chỉ trong 30 giây"
                : "Create your Nha Trang trip in seconds with AI"}
            </span>
          </a>
        </div>

        {/* Lead Introduction */}
        <div className="vnn-article-lead">
          {lang === "vi" ? (
            <p>
              Ẩm thực <strong>Nha Trang</strong> là sự kết hợp hoàn hảo giữa nguồn
              nguyên liệu hải sản tươi rói từ vịnh biển và hương vị đậm đà, tinh tế
              của dải đất miền Trung. Từ những bát nước dùng thanh ngọt nấu từ cá
              biển, từng đĩa bánh căn gốm nung nóng hổi trên than hồng cho đến mẹt nem
              nướng nức tiếng, cùng <strong>VinaTap</strong> khám phá ngay{" "}
              <strong>5 món ăn tinh hoa phải nếm</strong> cùng danh sách những quán
              ăn chuẩn vị người bản địa nhất!
            </p>
          ) : (
            <p>
              <strong>Nha Trang’s food</strong> is a perfect blend of fresh coastal
              ingredients and bold, memorable flavors. From naturally sweet broths
              simmered with oceanic fish and fragrant clay-mould pancakes to smoky
              chargrilled pork platters, let’s dive into the diverse food scene of
              this coastal gem with <strong>5 must-try Nha Trang dishes</strong> that
              will take your taste buds on an unforgettable journey.
            </p>
          )}
        </div>

        {/* ── 5 Dish Breakdown Sections ── */}
        <div className="vnn-dishes-wrapper">
          {DISHES_DATA.map((dish) => (
            <article key={dish.id} id={dish.id} className="vnn-dish-card">
              <div className="vnn-dish-header">
                <h2 className="vnn-dish-title">
                  {dish.index}. {lang === "vi" ? dish.nameVi : dish.name}
                </h2>
                <div className="vnn-dish-badges">
                  <span className="vnn-dish-badge vnn-dish-badge--sea">
                    {lang === "vi" ? dish.tag : dish.tagEn}
                  </span>
                  <span className="vnn-dish-badge">Nha Trang 2026</span>
                </div>
              </div>

              <div className="vnn-dish-columns">
                {/* Left Column: Image with Lightbox Zoom */}
                <div>
                  <div
                    className="vnn-dish-image-wrap"
                    onClick={() =>
                      setLightboxImg({
                        src: dish.img,
                        caption:
                          lang === "vi" ? dish.caption : dish.captionEn,
                      })
                    }
                  >
                    <img
                      src={dish.img}
                      alt={lang === "vi" ? dish.nameVi : dish.name}
                      className="vnn-dish-img"
                      loading="lazy"
                    />
                    <div className="vnn-dish-img-overlay">
                      <Maximize2 size={16} />
                      <span>{lang === "vi" ? "Xem ảnh lớn" : "Zoom photo"}</span>
                    </div>
                  </div>
                  <p className="vnn-dish-caption">
                    {lang === "vi" ? dish.caption : dish.captionEn}
                  </p>
                </div>

                {/* Right Column: Description, Tip, and Places to Try */}
                <div className="vnn-dish-body">
                  <p className="vnn-dish-desc">
                    {lang === "vi" ? dish.descVi : dish.desc}
                  </p>

                  {/* Local Tip Box */}
                  <div className="vnn-tip-box">
                    <Lightbulb size={20} className="flex-shrink-0" />
                    <div>
                      <strong>
                        {lang === "vi" ? "Mẹo thưởng thức: " : "Tip: "}
                      </strong>
                      <span>{lang === "vi" ? dish.tipVi : dish.tip}</span>
                    </div>
                  </div>

                  {/* Places to Try Box */}
                  <div className="vnn-places-box">
                    <h4 className="vnn-places-title">
                      <MapPin size={16} color="#00c2cb" />
                      <span>
                        {lang === "vi" ? "Địa chỉ nên thử" : "Where to try"}
                      </span>
                    </h4>
                    <ul className="vnn-places-list">
                      {dish.places.map((place, idx) => (
                        <li key={idx} className="vnn-place-item">
                          <div className="vnn-place-info">
                            <span className="vnn-place-name">{place.name}</span>
                            <span
                              className="vnn-place-address"
                              onClick={() => handleCopyAddress(place.address)}
                              title={
                                lang === "vi"
                                  ? "Nhấn để sao chép địa chỉ"
                                  : "Click to copy address"
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <MapPin size={12} />
                              <span>{place.address}</span>
                            </span>
                          </div>
                          <span className="vnn-place-price">{place.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Note Disclaimer */}
        <div style={{ marginTop: "20px", marginBottom: "30px", textAlign: "center" }}>
          <small style={{ color: "#888888", fontStyle: "italic", fontSize: "13px" }}>
            {lang === "vi"
              ? "* Lưu ý: Giá cả và giờ mở cửa có thể thay đổi nhẹ tùy theo từng thời điểm trong năm."
              : "* Note: Recommendations are based on local reviews; prices may vary slightly over time."}
          </small>
        </div>

        {/* Article Tags */}
        <div className="vnn-tags-section">
          <span style={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>
            {lang === "vi" ? "Thẻ:" : "Tags:"}
          </span>
          <Link href="/province/khanh-hoa" className="vnn-tag-pill">
            {lang === "vi" ? "Ẩm thực Nha Trang" : "Nha Trang Food"}
          </Link>
          <Link href="/province/khanh-hoa" className="vnn-tag-pill">
            {lang === "vi" ? "Đặc sản Khánh Hòa" : "Khanh Hoa Specialties"}
          </Link>
          <Link href="/guide/8-best-things-to-do-in-nha-trang" className="vnn-tag-pill">
            {lang === "vi" ? "Du lịch Nha Trang 2026" : "Nha Trang Travel 2026"}
          </Link>
          <Link href="/province/khanh-hoa" className="vnn-tag-pill">
            {lang === "vi" ? "Khánh Hòa" : "Khanh Hoa"}
          </Link>
          <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="vnn-tag-pill">
            {lang === "vi" ? "Ẩm thực đường phố Việt Nam" : "Vietnamese Street Food"}
          </Link>
        </div>

        {/* ── RELATED ARTICLES (LOWEST CONTENT POINT - NO FOOTER AS REQUESTED) ── */}
        <section className="vnn-related-section">
          <div className="vnn-related-header">
            <h3 className="vnn-related-title">
              {lang === "vi" ? "BÀI VIẾT LIÊN QUAN" : "RELATED ARTICLES"}
            </h3>
            <span className="vnn-related-bar" />
          </div>

          <div className="vnn-related-grid">
            {RELATED_ARTICLES.map((article, idx) => (
              <Link
                key={idx}
                href={article.link}
                className="vnn-related-card"
              >
                <div className="vnn-related-img-wrap">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="vnn-related-img"
                    loading="lazy"
                  />
                  <span className="vnn-related-badge">
                    {lang === "vi" ? (article.badgeVi || article.badge) : article.badge}
                  </span>
                </div>
                <div className="vnn-related-body">
                  <h4 className="vnn-related-card-title">
                    {lang === "vi" ? article.titleVi : article.title}
                  </h4>
                  <span className="vnn-related-date">
                    {lang === "vi" ? article.dateVi : article.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ── Lightbox Modal ── */}
      {lightboxImg && (
        <div
          className="vnn-lightbox-overlay"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="vnn-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vnn-lightbox-close"
              onClick={() => setLightboxImg(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <img
              src={lightboxImg.src}
              alt="Zoomed"
              className="vnn-lightbox-img"
            />
            {lightboxImg.caption && (
              <p className="vnn-lightbox-caption">{lightboxImg.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="vnn-toast" role="status">
          <CheckCircle size={18} color="#00c2cb" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Floating Province Chatbot (Nha Trang / Khánh Hòa with Teal Theme) ── */}
      <ProvinceChatbot
        province={{
          name: lang === "vi" ? "Khánh Hòa" : "Khanh Hoa",
          slug: "khanh-hoa",
        }}
      />
    </div>
  );
}
