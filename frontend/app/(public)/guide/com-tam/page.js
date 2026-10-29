"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import AffiliateDealBox from "@/components/ui/AffiliateDealBox";
import { HCMC_MEKONG_AFFILIATE_DEALS } from "@/lib/affiliateDeals";
import { getLang } from "@/lib/prefs";
import {
  Sparkles,
  List,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import "@/styles/home.css";
import "./com-tam.css";

export default function ComTamGuidePage() {
  const [lang, setLang] = useState("vi");
  const [tocOpen, setTocOpen] = useState(true);

  useEffect(() => {
    setLang(getLang());
    const handleStorage = () => setLang(getLang());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isVi = lang === "vi";

  const scrollToToc = () => {
    const el = document.getElementById("what-is-com-tam");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="comtam-article-page">
      {/* ── 1. Header with MegaMenu & AI companion ── */}
      <PublicHeader />

      {/* ── 2. Full-bleed Hero Banner ── */}
      <section
        className="comtam-hero"
        style={{
          backgroundImage: "url('/guide/hcmc/com-tam-hero.jpg')",
        }}
      >
        <div className="comtam-hero__overlay" />
        <div className="comtam-hero__inner">
          <span className="comtam-hero__tag">
            {isVi ? "ẨM THỰC • ĂN & UỐNG" : "EAT & DRINK"}
          </span>
          <h1 className="comtam-hero__title">
            {isVi ? "Cơm Tấm" : "Com Tam"}
          </h1>
          <div className="comtam-hero__byline">
            <span>By</span>
            <Logo
              size={18}
              showText={true}
              noLink
              href={null}
              as="span"
              className="comtam-hero-author-logo"
            />
            <span>•</span>
            <span>{isVi ? "29 Tháng 7, 2026" : "July 29, 2026"}</span>
          </div>
        </div>
      </section>

      {/* ── 3. Main Article Content Container ── */}
      <main className="comtam-container">
        {/* Back Link */}
        <Link
          href="/guide/12-must-try-foods-in-ho-chi-minh-city"
          className="comtam-back-link"
        >
          <ArrowLeft size={16} />
          {isVi
            ? "Quay lại danh sách 12 món ăn TP. Hồ Chí Minh"
            : "Back to 12 must-try foods in Ho Chi Minh City"}
        </Link>

        {/* Pill CTA Button (Tripion) */}
        <div className="comtam-pill-cta-container">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="comtam-pill-cta-btn"
          >
            <Sparkles size={16} />
            {isVi
              ? "Tạo kế hoạch du lịch Việt Nam chỉ trong vài giây"
              : "Create your Vietnam trip in seconds"}
          </a>
        </div>

        {/* ── Section: What is com tam? ── */}
        <h2 id="what-is-com-tam" className="comtam-section-title">
          {isVi ? "Cơm tấm là gì?" : "What is com tam?"}
        </h2>

        {/* Table of Contents floating widget */}
        <aside className="comtam-toc-box">
          <div
            className="comtam-toc-header"
            onClick={() => setTocOpen(!tocOpen)}
          >
            <div className="comtam-toc-header-left">
              <List size={16} />
              <span>{isVi ? "Mục lục" : "Contents"}</span>
            </div>
            {tocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {tocOpen && (
            <ol className="comtam-toc-list">
              <li className="comtam-toc-item">
                <a href="#what-is-com-tam" className="comtam-toc-link">
                  {isVi ? "Cơm tấm là gì?" : "What is com tam?"}
                </a>
              </li>
              <li className="comtam-toc-item">
                <a href="#com-tam-ingredients" className="comtam-toc-link">
                  {isVi ? "Nguyên liệu cơm tấm" : "Com tam ingredients"}
                </a>
              </li>
              <li className="comtam-toc-item">
                <a href="#types-of-com-tam" className="comtam-toc-link">
                  {isVi ? "Các biến thể cơm tấm" : "Types of com tam"}
                </a>
              </li>
              <li className="comtam-toc-item">
                <a href="#the-eating-culture-of-com-tam" className="comtam-toc-link">
                  {isVi ? "Văn hóa thưởng thức cơm tấm" : "The eating culture of com tam"}
                </a>
              </li>
              <li className="comtam-toc-item">
                <a href="#where-to-eat-com-tam" className="comtam-toc-link">
                  {isVi ? "Địa chỉ quán cơm tấm ngon?" : "Where to eat com tam?"}
                </a>
              </li>
            </ol>
          )}
        </aside>

        {/* Introductory text */}
        <p className="comtam-body-text">
          {isVi ? (
            <>
              Nhiều người thường nghĩ rằng TP. Hồ Chí Minh (Sài Gòn) không có bề dày lịch sử ẩm thực phong phú như các vùng miền khác ở Việt Nam; thế nhưng đây lại chính là nơi tinh hoa ẩm thực khắp mọi miền hội tụ và thăng hoa rực rỡ nhất. <em>Cơm tấm</em> (broken rice), món ăn được đông đảo thực khách quốc tế yêu mến, là niềm tự hào của người Sài Gòn và là bữa ăn quen thuộc của mọi tầng lớp người dân Việt Nam. Đừng bỏ lỡ trải nghiệm ẩm thực tinh túy này khi ghé thăm Việt Nam. Hãy cùng chúng tôi khám phá lịch sử cùng những điều thú vị xung quanh món ăn biểu tượng này.
            </>
          ) : (
            <>
              People often think that Ho Chi Minh City (Saigon) lacks a rich and diverse culinary history compared to other parts of Vietnam; however, this is where the best of the country&apos;s culinary offerings come together and reach new heights. <em>Com tam</em> (<em>cơm tấm</em> – broken rice), a popular dish among international food lovers, is a source of pride for Saigon people. It is a staple for Vietnamese people from all walks of life. Don&apos;t miss out on this essential food experience when visiting Vietnam. Let us take you through the history and interesting facts of this culinary highlight.
            </>
          )}
        </p>

        {/* Origin section */}
        <h3 className="comtam-subhead">
          {isVi ? "Nguồn gốc của cơm tấm" : "The origin of com tam"}
        </h3>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Tập quán ăn cơm trong các bữa ăn thường nhật bắt nguồn từ nền văn minh lúa nước là nguồn kinh tế trụ cột. Quá trình xay xát lúa gạo sản sinh ra <em>tấm</em> — tức những hạt gạo bị vỡ vụn trong lúc sàng sảy. Thuở trước, tấm chỉ dành cho giới cần lao nghèo khó không đủ tiền mua gạo nguyên hạt. Đã có giai đoạn giá gạo tấm rẻ đến mức chỉ dùng làm thức ăn cho gia súc. Có nhiều dị bản về sự ra đời của cơm tấm, nhưng câu chuyện hợp lý và thú vị nhất bắt nguồn từ những năm 1930.
            </>
          ) : (
            <>
              The practice of eating rice in daily meals is a result of Chinese influence and the fact that wet-rice agriculture is our main source of economy. Rice harvest produces <em>tam</em>, which is broken and fractured rice grains. In the past, <em>tam</em> was consumed by the lower class or underprivileged people who couldn&apos;t afford whole grains. At some point, the price of <em>tam</em> was so low that it was used to feed cattle. There are several versions of the creation of <em>com tam</em>, but we are presenting the one that makes the most sense and is the most interesting in our opinion.
            </>
          )}
        </p>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Vào thập niên 1930, chính quyền thuộc địa Pháp triển khai kế hoạch biến{" "}
              <Link href="/destination/ho-chi-minh" className="comtam-intext-link">
                Sài Gòn
              </Link>{" "}
              thành một trong những thương cảng bận rộn nhất thế giới. Để xây dựng các đại công trình cảng biển và cơ sở hạ tầng, hàng ngàn phu phen lao động được tuyển dụng. Lúc bấy giờ, một người phụ nữ tên Má Hai mở quán bán cơm hấp thịt kho và trứng. Dù đồ ăn chất lượng, Má Hai thường nhận được lời than phiền từ phu bến tàu vì giá cơm quá cao so với tiền công ít ỏi. Điều đó thôi thúc bà tìm cách giảm giá bán cho nhóm khách hàng bình dân này. Bà nảy ra sáng kiến dùng gạo tấm vỡ nấu cùng lá dứa trong xửng hấp. Ban đầu, bà dọn kèm những món bình dân: mỡ hành xanh mướt, tóp mỡ giòn rụm và nước mắm chua ngọt sánh đậm tỏi ớt. Giá rẻ bất ngờ cùng hương vị cuốn hút khiến quán đông nghịt, từ kỹ sư Pháp tới phu bến tàu. Để tri ân khách ủng hộ, bà tặng kèm <em>bì</em> heo thái chỉ. Sau đó, bà sáng chế thêm <em>chả trứng</em> hấp từ thịt xay, nấm mèo và trứng để phục vụ nhu cầu phong phú của thực khách.
            </>
          ) : (
            <>
              In the 1930s, the French colonies had a mission to make{" "}
              <Link href="/destination/ho-chi-minh" className="comtam-intext-link">
                Saigon
              </Link>{" "}
              one of the world&apos;s busiest harbors. To accomplish this, they hired a large number of workers and builders to construct large-scale projects. During this time, a lady named Ma Hai was selling steamed rice with caramelized pork and eggs. Although her food was of good quality, she often received complaints about the high price, which was too expensive for blue-collar workers. This bothered her since these manual workers were her target customers. She then came up with the idea of using broken rice grains instead of whole grains to lower the price. Ma Hai cooked broken rice with pandan leaves and heated it in a steam pot. At first, she used cheap and simple ingredients such as scallion oil, crunchy deep-fried pork fat, and a thick sweet and spicy fish sauce mixed with minced garlic and chili. The affordable price and creative rice combination attracted even more customers, from French engineers to poor manual workers. As a gesture of appreciation for her customers&apos; support, she added <em>bi</em>, shredded pork skin, as a complimentary topping. Later on, to meet the demand of a wider range of customers, she created <em>cha</em>, a steamed combination of egg, minced pork, and other vegetable ingredients.
            </>
          )}
        </p>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Tiếng lành đồn xa đến tai các giới chức Pháp, họ yêu cầu thêm miếng sườn cốt lết nướng than hoa tương tự như món bít-tết phương Tây. Đó chính là cách miếng sườn nướng xuất hiện trên đĩa cơm tấm. Điều này cũng lý giải vì sao người Việt ăn cơm tấm bằng muỗng và nĩa thay vì bằng đũa. Kể từ đó, mỗi khi nhắc tới cơm tấm, điều đầu tiên hiện lên trong tâm trí thực khách luôn là bộ ba huyền thoại <em>&ldquo;sườn – bì – chả&rdquo;</em>, tức đĩa cơm tấm phủ sườn nướng than hoa, bì heo thái chỉ bùi béo và chả trứng hấp mềm mọng.
            </>
          ) : (
            <>
              The reputation of <em>com tam</em> finally reached the French authorities, who requested pork chops that resembled the Western-style steak. This is how the last topping, chargrilled pork chop, was added to the dish. This also explains why we now eat <em>com tam</em> with a spoon and fork, rather than with chopsticks. Since then, whenever <em>com tam</em> is mentioned, the first thing that comes to mind is the combo <em>&ldquo;suon – bi – cha&rdquo;</em>, which is com tam topped with chargrilled pork chops, shredded pork skin, and steamed egg meatloaf.
            </>
          )}
        </p>

        {/* Sharp Image 1 */}
        <figure className="comtam-figure">
          <img
            src="/guide/hcmc/what-is-com-tam.jpg"
            alt={
              isVi
                ? "Đĩa cơm tấm sườn bì chả truyền thống Sài Gòn"
                : "Com tam, or broken rice, is a beloved dish among Vietnamese from all walks of life"
            }
            className="comtam-figure__img"
            loading="lazy"
          />
          <figcaption className="comtam-figure__caption">
            {isVi
              ? "Cơm tấm là món ăn thân thương của người Việt thuộc mọi tầng lớp xã hội và là niềm tự hào của Sài Gòn khi chinh phục trái tim người yêu ẩm thực quốc tế."
              : "Com tam, or broken rice, is a beloved dish among Vietnamese from all walks of life and a source of pride for Saigon as it wins the hearts of international food lovers."}
          </figcaption>
        </figure>

        {/* ── Section: Com tam ingredients (Screenshot 1) ── */}
        <h2 id="com-tam-ingredients" className="comtam-section-title">
          {isVi ? "Nguyên liệu cơm tấm" : "Com tam ingredients"}
        </h2>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Tuy <em>cơm tấm</em> là món ăn bình dân chiều lòng đại chúng cả về hương vị lẫn giá tiền, việc chuẩn bị trọn bộ các món ăn kèm lại đòi hỏi sự kỳ công đáng nể. Bất chấp vô số biến tấu, một đĩa <em>cơm tấm</em> kinh điển bắt buộc phải có những thành phần cốt lõi:
            </>
          ) : (
            <>
              Although <em>com tam</em> is a popular dish that appeals to the general public both in taste and price, assembling all its toppings requires a lot of preparation. Despite countless variations of this dish, a typical <em>com tam</em> plate must have its iconic elements, including:
            </>
          )}
        </p>

        {/* Exact Bullet Points matching Screenshot 1 */}
        <ul className="comtam-bullets">
          <li>
            <em>{isVi ? "Cơm tấm (gạo tấm vỡ):" : "Com tam (broken rice):"}</em>{" "}
            {isVi
              ? "Đây là thành phần cốt lõi của món ăn. Người đầu bếp cẩn thận vo rửa các hạt gạo gãy vỡ để khử mùi cám cũ, sau đó nấu cùng một nhúm muối. Cơm tấm hấp chín tới mềm xốp, khô ráo, không hề bết dính và được ủ nóng hổi trong xửng hấp suốt cả ngày."
              : "This is the primary component of the dish. The chef carefully rinses the fractured grains to eliminate any musty smell and then cooks them with a pinch of salt. The steamed broken rice, after cooking, is soft, dry, and non-sticky, and it is kept warm in a food steamer throughout the day."}
          </li>
          <li>
            <em>{isVi ? "Sườn (sườn cốt lết nướng than hoa):" : "Suon (chargrilled pork chops):"}</em>{" "}
            {isVi
              ? "Miếng sườn heo được tẩm ướp cùng gia vị bản địa mộc mạc. Một miếng sườn ngon chuẩn vị nhất định phải được nướng trực tiếp trên bếp than hồng để tạo màu xém vàng óng, thấm đượm mùi khói đặc trưng mà bên trong vẫn mềm ngọt mọng nước."
              : "The pork chop used for com tam is first marinated with simple local spices and seasonings. A successful piece of pork chop must be grilled over a charcoal fire to develop a golden char with a deeply smoky flavor while still remaining juicy and tender."}
          </li>
          <li>
            <em>{isVi ? "Bì (bì heo thái sợi trộn thính):" : "Bi (shredded pork skin):"}</em>{" "}
            {isVi
              ? "Da heo luộc chín, thái thành những sợi mảnh li ti, để nguội rồi trộn đều cùng thính gạo rang vàng thơm nức. Từng sợi bì mang kết cấu giòn sần sật bùi béo và thoảng hương men thơm đặc trưng."
              : "Boiled pork skin is thinly sliced into fine threads, cooled, and then mixed with roasted rice powder (or thinh, as it is called in Vietnamese). The pork skin threads have a powdery, crunchy texture and a hint of fermented aroma."}
          </li>
          <li>
            <em>{isVi ? "Chả (chả trứng hấp):" : "Cha (steamed egg meatloaf):"}</em>{" "}
            {isVi
              ? "Món ăn kèm tưởng chừng bình thường này thực chất là một tuyệt phẩm. Miếng chả siêu mềm mọng, điểm xuyết độ giòn sần sật của nấm mèo (mộc nhĩ). Mặt trên được quét lớp lòng đỏ trứng gà vàng óng bóng bẩy. Một số nhà hàng còn bổ sung thịt cua hoặc trứng muối giúp hương vị nổi bật hơn hẳn."
              : "This seemingly ordinary side dish is actually a delicacy. The mince is super soft and moist, with crunchy highlights from the wood-ear mushrooms inside. The top is brushed with a shiny golden egg yolk glaze. Some restaurants add their signature ingredients, such as crab meat and salted egg yolks, to their meatloaf, making it stand out from competitors."}
          </li>
          <li>
            <em>{isVi ? "Trứng ốp la (trứng chiên lòng đào):" : "Trung op la (sunny-side-up eggs):"}</em>{" "}
            {isVi
              ? "Khi đã có các kỹ thuật hấp, luộc và nướng, đã đến lúc cần thêm một chút vị ngậy chiên rán. Quả trứng ốp la không chỉ để trang trí bắt mắt mà còn cân bằng hoàn hảo các tầng hương vị trong đĩa cơm."
              : "We already had steaming, boiling, and grilling cooking methods, so it's time for something fried. The addition of a fried egg is not only for decoration but also for balancing the elements in the dish."}
          </li>
          <li>
            <em>{isVi ? "Mỡ hành (hành lá tao dầu):" : "Mo hanh (scallion oil):"}</em>{" "}
            {isVi ? (
              <>
                Loại đồ nêm này xuất hiện trong rất nhiều món ngon Việt Nam, đặc biệt là các món thịt nướng. Thường mỡ hành được trộn chung cùng <em>tóp mỡ</em> chiên giòn rụm. Lớp mỡ hành xanh mướt óng ả không chỉ tạo điểm nhấn sau cùng cho đĩa cơm mà còn mang lại hương thơm ngào ngạt và độ béo ngậy khó cưỡng.
              </>
            ) : (
              <>
                This garnish is used in many{" "}
                <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="comtam-intext-link">
                  Vietnamese dishes
                </Link>
                , especially those with grilled meat. More often, scallion oil is mixed with <em>top mo</em>, which are crispy deep-fried pork fat cubes. The shiny green scallion oil not only adds the final touch to the dish but also creates a nice aroma and texture.
              </>
            )}
          </li>
          <li>
            <em>{isVi ? "Đồ chua (rau dưa & củ quả chua):" : "Do chua (vegetables and pickles):"}</em>{" "}
            {isVi
              ? "Đĩa cơm tấm sẽ mất cân bằng dinh dưỡng nếu thiếu chúng. Cơm luôn được dọn kèm dưa leo và cà chua tươi thái lát. Để giải bớt độ béo ngậy của các món thịt nướng, đồ chua củ cải trắng và cà rốt ngâm giấm đường chua ngọt luôn được bổ sung."
              : "A plate of com tam is not nutritionally balanced without them. It is always served with sliced fresh cucumbers and tomatoes. To ease the richness of the cooked ingredients, pickled red and white carrots are also added."}
          </li>
          <li>
            <em>{isVi ? "Nước chấm (nước mắm kẹo):" : "Nuoc cham (dipping sauce):"}</em>{" "}
            {isVi
              ? "Thứ đồ chấm không thể thiếu, hoàn thiện sự bùng nổ hương vị của cơm tấm. Nước mắm dành cho người Sài Gòn phải sánh đặc kẹo và đậm đà nồng hậu. Nước mắm ngon pha cùng nước, nước cốt chanh, đường và ớt băm nhuyễn. Tùy theo khẩu vị, bạn có thể gia giảm để nước mắm ngọt hay mặn hơn."
              : "This is an indispensable accompaniment to com tam, completing its explosive taste. The com tam made for Saigon people must be thick in texture and intense in flavor. Fish sauce is added with water, lime juice, and sugar, and the mixture is complemented with minced chili. Depending on personal preferences, the fish sauce can be made more salty or sweet."}
          </li>
        </ul>

        {/* Sharp Image 2: Ingredients (Screenshot 2) */}
        <figure className="comtam-figure">
          <img
            src="/guide/hcmc/com-tam-ingredients.jpg"
            alt={
              isVi
                ? "Các món ăn kèm phong phú trên đĩa cơm tấm"
                : "Although com tam is a popular dish made to suit the general public in terms of both the taste and the price, the assembly of all the toppings requires a great deal of preparation."
            }
            className="comtam-figure__img"
            loading="lazy"
          />
          <figcaption className="comtam-figure__caption">
            {isVi
              ? "Tuy cơm tấm là món ăn bình dân chiều lòng đại chúng cả về hương vị lẫn giá cả, việc chuẩn bị trọn bộ các món ăn kèm lại đòi hỏi sự kỳ công đáng nể."
              : "Although com tam is a popular dish made to suit the general public in terms of both the taste and the price, the assembly of all the toppings requires a great deal of preparation."}
          </figcaption>
        </figure>

        {/* ── Section: Types of com tam (Screenshots 2 & 3) ── */}
        <h2 id="types-of-com-tam" className="comtam-section-title">
          {isVi ? "Các biến thể cơm tấm" : "Types of com tam"}
        </h2>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Nhờ tính tiện lợi, <em>cơm tấm</em> ngày nay là lựa chọn hàng đầu cho một bữa ăn vừa nhanh vừa ngon miệng ở bất kỳ thời điểm nào trong ngày. Các quán cơm tấm luôn tấp nập thực khách, bất kể bữa sáng, bữa trưa hay bữa tối. Rất nhiều khách quen ghé quán hầu như mỗi ngày, điều này khiến người đầu bếp không ngừng đa dạng hóa thực đơn với các món mặn thay thế topping truyền thống. Có thể kể đến các phần thịt heo khác như sườn non, sườn cây, ba rọi nướng, cùng tuyển tập hơn mười món mặn nấu chuẩn vị gia đình bao gồm rau xào, canh thanh mát, hải sản kho và cả các món chay.
            </>
          ) : (
            <>
              Due to its convenience, <em>com tam</em> is now a popular choice for an easy and tasty meal throughout the day. Local <em>com tam</em> food stalls are always packed with people, regardless of whether it&apos;s breakfast, lunch, or dinner. Many customers visit their favorite place almost every day, which led the cook to diversify the food choices for them by offering various side dishes to alter the standard <em>com tam</em> toppings. This includes using different types of pork such as back ribs instead of rib chops or butterflied chops, and a selection of over ten home-cooked dishes, including stir-fried vegetables, soups, seafood, and vegetarian options.
            </>
          )}
        </p>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Một biến thể nổi danh nức tiếng là <em>cơm tấm Long Xuyên</em>, mang thương hiệu độc đáo của riêng mình. Long Xuyên là một đô thị êm đềm tại Đồng bằng sông Cửu Long, nổi tiếng với đĩa cơm tấm thanh vị, ít dầu mỡ và bớt &ldquo;cầu kỳ&rdquo; hơn so với Sài Gòn. Ở Long Xuyên, hạt gạo tấm được xay nhuyễn hạt mịn màng hơn; điểm khác biệt rõ nét nhất là quả trứng vịt kho nước dừa thấm đẫm vị béo bùi thay vì trứng ốp la hay chả trứng hấp. Thịt khìa và trứng kho được xắt sợi que diêm nhỏ khi dọn, tạo nên món cơm trộn hài hòa tương tự cơm trộn. Món ăn còn được kèm đồ chua rau muống ngâm giòn tan và cà rốt bào.
            </>
          ) : (
            <>
              One notable version of <em>com tam</em> is <em>com tam Long Xuyen</em>, which has gained its own reputation. Long Xuyen is a quiet town in the Mekong Delta and is known for its less greasy and &ldquo;complex&rdquo; version of <em>com tam</em> compared to Saigon. In Long Xuyen, even small rice fragments are used, and the most noticeable difference is that whole eggs are caramelized and braised in coconut water instead of a sunny-side-up egg or steamed egg meatloaf. The braised eggs and grilled pork are chopped into matchstick size when serving, creating a mixable dish similar to a mixed rice dish. Pickled carrots and pickled morning glory are also added.
            </>
          )}
        </p>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Với người ăn chay, hoàn toàn có thể tìm thấy phiên bản cơm tấm không thịt hoặc thậm chí là thuần chay (vegan). Sườn heo và bì được thay thế bằng đạm đậu nành thái lát và bún tàu thơm thính; các loại gia vị cũng được thay đổi phù hợp như dùng dầu hào chay và nước mắm chay. Tuy nhiên, hãy lưu ý khi gọi món vì một số nơi vẫn dùng trứng trong chả hấp. Khi đó, món <em>chả chay</em> làm từ đậu hũ non và tàu hũ ky sẽ là lựa chọn tuyệt vời, đảm bảo độ mềm mọng bùi béo chẳng kém phiên bản truyền thống.
            </>
          ) : (
            <>
              For vegetarians, it is possible to find a meat-free or even{" "}
              <span className="comtam-intext-link">vegan version</span> of <em>com tam</em>. Pork chops and pork skin are replaced with textured soybean slices and glass noodles, and the seasonings are altered to accommodate a vegetarian diet, such as using vegan oyster sauce and fish sauce. However, be mindful when ordering as some places still use eggs in their steamed egg meatloaf. In this case, vegan <em>cha</em> is a great option, using young tofu and tofu skin to replace eggs and meat, ensuring a soft and moist texture not far from the original version.
            </>
          )}
        </p>

        {/* Sharp Image 3: Vegetarian Com Tam (Screenshots 3 & 4) */}
        <figure className="comtam-figure">
          <img
            src="/guide/hcmc/vegetarian-com-tam.jpg"
            alt={
              isVi
                ? "Cơm tấm chay thanh đạm"
                : "For vegetarians, it is possible to find a meat-free or even vegan version of com tam."
            }
            className="comtam-figure__img"
            loading="lazy"
          />
          <figcaption className="comtam-figure__caption">
            {isVi
              ? "Với những người ăn chay, hoàn toàn có thể tìm thấy phiên bản cơm tấm không thịt hoặc thuần chay vô cùng hấp dẫn."
              : "For vegetarians, it is possible to find a meat-free or even vegan version of com tam."}
          </figcaption>
        </figure>

        {/* ── Section: The eating culture of com tam (Screenshots 4 & 5) ── */}
        <h2 id="the-eating-culture-of-com-tam" className="comtam-section-title">
          {isVi ? "Văn hóa thưởng thức cơm tấm" : "The eating culture of com tam"}
        </h2>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Thành thật mà nói, không hề quá lời khi nhận xét các quán <em>cơm tấm</em> ở Sài Gòn phổ biến chẳng kém gì các{" "}
              <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="comtam-intext-link">
                quán cà phê
              </Link>
              . Tìm một quán <em>cơm tấm</em> vô cùng dễ dàng, bất kể bạn đang ở đâu hay vào lúc nào: chỉ cần nhìn thấy làn khói nướng sườn thơm phức bốc lên từ vỉa hè phía xa — đó chắc chắn là dấu hiệu của một quán ngon. Dưới đây là những nét thú vị về <em>cơm tấm</em> và văn hóa thưởng thức của người Việt:
            </>
          ) : (
            <>
              Honestly, it&apos;s not an exaggeration to say that <em>com tam</em> food stalls are as prevalent as{" "}
              <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="comtam-intext-link">
                coffee shops
              </Link>{" "}
              in Saigon. Finding a <em>com tam</em> restaurant is easy, no matter where or when you are: just look for a distant, aromatic puff of smoke from the chargrilled pork chops on the sidestreets – that&apos;s a sign of a good place. Here are some interesting facts about <em>com tam</em> and its eating culture among Vietnamese people:
            </>
          )}
        </p>

        {/* Exact Numbered List 1 to 8 matching Screenshot 5 */}
        <ol className="comtam-numbered-list">
          <li>
            {isVi
              ? "Người Việt thường cố gắng tránh hoặc đứng xa luồng khói bốc ra từ lò nướng sườn, bởi mùi thơm nồng nàn của thịt ướp và than hoa bám dính cực kỳ dai dẳng vào quần áo, lấn át cả những loại nước hoa bền mùi nhất."
              : "Vietnamese people often try to avoid or at least stay away from the smoke released from the grilling oven, as the smell of marinated meat and charcoal is so intense that it sticks to our clothing and lingers in the air for a long time, overpowering even the longest-lasting perfume."}
          </li>
          <li>
            {isVi
              ? "Việc ăn cơm tấm bằng muỗng và nĩa là điều hiển nhiên và thông thường, không hề có sự bất lịch sự nào (như đã giải thích trong nguồn gốc lịch sử)."
              : "It is common sense to eat com tam with a spoon and fork, with no offense (as explained in its origin)."}
          </li>
          <li>
            {isVi
              ? "Thông thường khi bạn gọi đĩa cơm tấm sườn bì chả đầy đủ, quán sẽ dọn kèm sườn nướng, bì và chả trứng. Tuy nhiên bạn có thể tùy chỉnh khẩu vị như xin thêm mỡ hành hoặc đồ chua. Trứng ốp la thường được gọi thêm với mức giá chỉ từ 5.000 – 7.000 VNĐ ($0.2 – $0.3), trong khi chén canh thanh ngọt luôn được phục vụ miễn phí."
              : "Typically, when you order a full combo com tam (also called suon – bi – cha), it comes with grilled pork chops, shredded pork skin, and steamed egg meatloaf. However, you can adjust the ingredients to your preference by asking for extra scallion oil or pickles, for example. A sunny-side-up egg usually comes by request, with an extra charge of 5,000 – 7,000 VND ($0.2 – $0.3), while a small bowl of soup is offered for free."}
          </li>
          <li>
            {isVi
              ? "Cơm tấm rất được ưa chuộng cho bữa sáng và bữa trưa. Nếu bạn thèm cơm tấm cho bữa tối, hãy tìm biển hiệu “cơm tấm đêm”. Những quán này mở cửa rất khuya, quá nửa đêm, giúp bạn nạp năng lượng sau ca làm thêm muộn hay buổi dạo phố đêm."
              : "Com tam is favored for breakfast and lunch. If you crave it for dinner, look for a sign reading “cơm tấm đêm,” meaning com tam at night. These food stalls typically open late, past midnight, so you can satisfy your hunger after working overtime or a night out."}
          </li>
          <li>
            {isVi
              ? "Để tận dụng cơm tấm hấp nóng, các quán cơm tấm thường chuyển đổi thành cơm bình dân vào giờ trưa. Bên cạnh các món cơm tấm cơ bản, quán phục vụ phong phú các món mặn gia đình với mức giá rất mềm và khẩu phần no bụng."
              : "To take advantage of steamed rice, com tam restaurants often transform into com binh dan, a local home-style eatery, during lunchtime. Besides the regular ingredients for com tam, these places offer a variety of home-cooked dishes, served at affordable prices and in generous portions. This is a fun and fast way to experience authentic local cuisine in Vietnam."}
          </li>
          <li>
            {isVi
              ? "Thức ăn tại các quán cơm tấm hay cơm bình dân được sắp xếp gọn gàng trong các khay inox đặt trong tủ kính lớn để khách dễ quan sát. Khi gọi món, bạn chỉ cần chỉ tay vào món mình thích."
              : "The food at a com tam or com binh dan eatery is displayed in trays and showcased in a large glass cabinet for customers to see. To order, simply point to your desired dish from the selection."}
          </li>
          <li>
            {isVi
              ? "Trong chương trình MasterChef mùa 3 (Mỹ), món cơm tấm sườn bì chả truyền thống đã đóng vai trò quyết định giúp đầu bếp khiếm thị gốc Việt tài năng Christine Hà giành chiến thắng ngôi vị quán quân danh giá."
              : "In Season 3 of MasterChef, the creation of com tam played a key role in helping the blind but talented Vietnamese chef, Christine Ha, win the coveted title."}
          </li>
          <li>
            {isVi
              ? "Giá cơm tấm có thể chênh lệch khá nhiều tùy thuộc vào chất lượng món ăn kèm và danh tiếng của quán. Một đĩa cơm tấm bình dân thường có giá từ 25.000 – 30.000 VNĐ ($1 – $1.25). Tại các nhà hàng sang trọng hơn, mức giá bắt đầu từ 50.000 VNĐ và có thể lên tới hơn 100.000 VNĐ ($4.5) nếu gọi thêm sườn cây đặc biệt."
              : "Com tam prices can vary greatly depending on the quality of the side dishes and the reputation of the eatery. Typically, basic com tam costs between 25,000 VND to 30,000 VND ($1 to $1.25). However, at a higher-end restaurant, prices can start at 50,000 VND and go higher, especially if you order a signature dish or additional side dishes, reaching over 100,000 VND ($4.5). Be sure to check the prices before placing your order."}
          </li>
        </ol>

        {/* Sharp Image 4: Culture and Glass Display (Matching Screenshot 5) */}
        <figure className="comtam-figure">
          <img
            src="/guide/hcmc/the-eating-culture-of-com-tam.jpg"
            alt={
              isVi
                ? "Tủ kính đồ ăn phong phú tại quán cơm tấm"
                : "The food at a com tam eatery is displayed in trays and showcased in a large glass cabinet for customers to see."
            }
            className="comtam-figure__img"
            loading="lazy"
          />
          <figcaption className="comtam-figure__caption">
            {isVi
              ? "Thức ăn tại các quán cơm tấm được bày biện sạch sẽ trong các khay kính lớn để khách dễ dàng lựa chọn."
              : "The food at a com tam eatery is displayed in trays and showcased in a large glass cabinet for customers to see. To order, simply point to your desired dish from the selection."}
          </figcaption>
        </figure>

        {/* Affiliate Box for Food Tour */}
        <div style={{ margin: "36px 0" }}>
          <AffiliateDealBox
            deal={HCMC_MEKONG_AFFILIATE_DEALS.saigonStreetFoodTour}
            lang={lang}
            slug="com-tam"
          />
        </div>

        {/* ── Section: Where to eat com tam? ── */}
        <h2 id="where-to-eat-com-tam" className="comtam-section-title">
          {isVi ? "Địa chỉ quán cơm tấm ngon?" : "Where to eat com tam?"}
        </h2>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Cơm tấm là niềm tự hào của người Sài Gòn, hội tụ tinh thần ẩm thực đường phố Việt Nam với hương vị đậm đà khó quên. Hãy thêm ngay cơm tấm vào danh sách nhất định phải thử khi bạn đến Việt Nam:
            </>
          ) : (
            <>
              Com tam is a dish that people in Saigon take pride in. It embodies the quintessential street food spirit of Vietnamese cuisine by delivering an explosion of flavors. Make sure to add com tam to your must-try list when visiting Vietnam, and we guarantee you won&apos;t regret it:
            </>
          )}
        </p>

        {/* City Eateries */}
        <h3 className="comtam-subhead">
          {isVi ? "TP. Hồ Chí Minh (Sài Gòn)" : "Ho Chi Minh City"}
        </h3>
        <div className="comtam-eateries-grid">
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Cơm Tấm Bụi Sài Gòn</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 100 Thạch Thị Thanh, Quận 1
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 50,000 – 65,000 VND ($2.0 – $2.6)
            </div>
          </div>
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Cơm Tấm Mộc</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 85 Lý Tự Trọng, Quận 1
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 45,000 – 89,000 VND
            </div>
          </div>
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Cơm Tấm Chị Hằng</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 28 Đỗ Quang Đẩu, Quận 1
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 82,000 VND
            </div>
          </div>
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Quán Chay 103 (Cơm Tấm Chay)</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 103 Nguyễn Thái Bình, Quận 1
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 60,000 VND
            </div>
          </div>
        </div>

        <h3 className="comtam-subhead">
          {isVi ? "Long Xuyên (An Giang)" : "Long Xuyen (Mekong Delta)"}
        </h3>
        <div className="comtam-eateries-grid">
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Cơm Tấm Tùng</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 32 Phan Đình Phùng, P. Mỹ Long, Long Xuyên
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 35,000 – 50,000 VND
            </div>
          </div>
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Quán Cây Điệp</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 67 Lý Tự Trọng, P. Mỹ Long, Long Xuyên
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 35,000 – 50,000 VND
            </div>
          </div>
        </div>

        <h3 className="comtam-subhead">
          {isVi ? "Hà Nội & Đà Nẵng" : "Hanoi & Da Nang"}
        </h3>
        <div className="comtam-eateries-grid">
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Cơm Tấm Sà Bì Chưởng (Hà Nội)</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 86 Nguyễn Văn Tuyết, Đống Đa, Hà Nội
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 65,000 – 85,000 VND
            </div>
          </div>
          <div className="comtam-eatery-card">
            <h4 className="comtam-eatery-name">Cơm Tấm Ngon (Đà Nẵng)</h4>
            <div className="comtam-eatery-meta">
              <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
              <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong> 85 Hà Huy Tập, Q. Thanh Khê, Đà Nẵng
            </div>
            <div className="comtam-eatery-meta">
              <strong>{isVi ? "Giá:" : "Price:"}</strong> 35,000 VND
            </div>
          </div>
        </div>
      </main>

      {/* Floating TOC quick button */}
      <button
        type="button"
        className="comtam-floating-toc-btn"
        onClick={scrollToToc}
        title={isVi ? "Xem mục lục" : "Table of contents"}
        aria-label="Table of contents"
      >
        <List size={20} />
      </button>

      {/* ── 4. Public Footer ── */}
      <PublicFooter />

      {/* ── 5. AI Chatbot Widget ── */}
      <ProvinceChatbot />
    </div>
  );
}
