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
  Clock,
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

  return (
    <div className="comtam-article-page">
      {/* ── 1. Header with MegaMenu & AI companion ── */}
      <PublicHeader />

      {/* ── 2. Full-bleed Hero Banner (Matching Screenshot 2) ── */}
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

      {/* ── 3. Main Article Content Container (Matching Screenshots 2, 3, 4, 5) ── */}
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

        {/* Pill CTA Button (Matching Screenshots 2 & 3) */}
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

        {/* ── Section: What is com tam? (Screenshot 3) ── */}
        <h2 id="what-is-com-tam" className="comtam-section-title">
          {isVi ? "Cơm tấm là gì?" : "What is com tam?"}
        </h2>

        {/* Table of Contents floating widget (Screenshot 3) */}
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

        {/* Introductory text (Screenshot 3) */}
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

        {/* Origin section (Screenshots 3 & 4) */}
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
              Vào thập niên 1930, chính quyền thuộc địa Pháp triển khai kế hoạch biến Sài Gòn thành một trong những thương cảng bận rộn nhất thế giới. Để xây dựng các đại công trình cảng biển và cơ sở hạ tầng, hàng ngàn phu phen lao động được tuyển dụng. Lúc bấy giờ, một người phụ nữ tên Má Hai mở quán bán cơm hấp thịt kho và trứng. Dù đồ ăn chất lượng, Má Hai thường nhận được lời than phiền từ phu bến tàu vì giá cơm quá cao so với tiền công ít ỏi. Điều đó thôi thúc bà tìm cách giảm giá bán cho nhóm khách hàng bình dân này. Bà nảy ra sáng kiến dùng gạo tấm vỡ nấu cùng lá dứa trong xửng hấp. Ban đầu, bà dọn kèm những món bình dân: mỡ hành xanh mướt, tóp mỡ giòn rụm và nước mắm chua ngọt sánh đậm tỏi ớt. Giá rẻ bất ngờ cùng hương vị cuốn hút khiến quán đông nghịt, từ kỹ sư Pháp tới phu bến tàu. Để tri ân khách ủng hộ, bà tặng kèm <em>bì</em> heo thái chỉ. Sau đó, bà sáng chế thêm <em>chả trứng</em> hấp từ thịt xay, nấm mèo và trứng để phục vụ nhu cầu phong phú của thực khách.
            </>
          ) : (
            <>
              In the 1930s, the French colonies had a mission to make Saigon one of the world&apos;s busiest harbors. To accomplish this, they hired a large number of workers and builders to construct large-scale projects. During this time, a lady named Ma Hai was selling steamed rice with caramelized pork and eggs. Although her food was of good quality, she often received complaints about the high price, which was too expensive for blue-collar workers. This bothered her since these manual workers were her target customers. She then came up with the idea of using broken rice grains instead of whole grains to lower the price. Ma Hai cooked broken rice with pandan leaves and heated it in a steam pot. At first, she used cheap and simple ingredients such as scallion oil, crunchy deep-fried pork fat, and a thick sweet and spicy fish sauce mixed with minced garlic and chili. The affordable price and creative rice combination attracted even more customers, from French engineers to poor manual workers. As a gesture of appreciation for her customers&apos; support, she added <em>bi</em>, shredded pork skin, as a complimentary topping. Later on, to meet the demand of a wider range of customers, she created <em>cha</em>, a steamed combination of egg, minced pork, and other vegetable ingredients.
            </>
          )}
        </p>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Tiếng lành đồn xa đến tai các giới chức Pháp, họ yêu cầu thêm miếng sườn cốt lết nướng than hoa tương tự như món bít-tết phương Tây. Đó chính là cách miếng sườn nướng xuất hiện trên đĩa cơm tấm. Điều này cũng lý giải vì sao người Việt ăn cơm tấm bằng muỗng và nĩa thay vì bằng đũa. Kể từ đó, mỗi khi nhắc tới cơm tấm, điều đầu tiên hiện lên trong tâm trí thực khách luôn là bộ ba huyền thoại <em>&ldquo;sườn – bì – chả&rdquo;</em>.
            </>
          ) : (
            <>
              The reputation of <em>com tam</em> finally reached the French authorities, who requested pork chops that resembled the Western-style steak. This is how the last topping, chargrilled pork chop, was added to the dish. This also explains why we now eat <em>com tam</em> with a spoon and fork, rather than with chopsticks. Since then, whenever <em>com tam</em> is mentioned, the first thing that comes to mind is the combo <em>&ldquo;suon – bi – cha&rdquo;</em>, which is com tam topped with chargrilled pork chops, shredded pork skin, and steamed egg meatloaf.
            </>
          )}
        </p>

        {/* Sharp Image 1 (Matching Screenshot 4 & 5) */}
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

        {/* ── Section: Com tam ingredients ── */}
        <h2 id="com-tam-ingredients" className="comtam-section-title">
          {isVi ? "Nguyên liệu cơm tấm" : "Com tam ingredients"}
        </h2>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Tuy là món ăn đường phố bình dân chiều lòng mọi thực khách từ hương vị đến giá cả, việc chuẩn bị trọn bộ các món ăn kèm cho một đĩa cơm tấm lại đòi hỏi sự kỳ công đáng kinh ngạc. Dù có vô số biến tấu, một đĩa cơm tấm kinh điển không thể thiếu những thành phần cốt lõi:
            </>
          ) : (
            <>
              Although com tam is a popular dish that appeals to the general public both in taste and price, assembling all its toppings requires a lot of preparation. Despite countless variations of this dish, a typical com tam plate must have its iconic elements, including:
            </>
          )}
        </p>

        <ul className="comtam-bullets">
          <li>
            <strong>{isVi ? "Cơm tấm (gạo tấm vỡ):" : "Com tam (broken rice):"}</strong>{" "}
            {isVi
              ? "Linh hồn của món ăn. Đầu bếp vo rửa nhẹ nhàng để khử sạch mùi cám cũ, sau đó nấu cùng chút muối và lá dứa. Hạt cơm tấm sau khi hấp mềm xốp, khô ráo, không bết dính và luôn được ủ nóng hổi trong nồi hấp cả ngày."
              : "This is the primary component of the dish. The chef carefully rinses the fractured grains to eliminate any musty smell and then cooks them with a pinch of salt. The steamed broken rice, after cooking, is soft, dry, and non-sticky, and it is kept warm in a food steamer throughout the day."}
          </li>
          <li>
            <strong>{isVi ? "Sườn (sườn cốt lết nướng than hoa):" : "Suon (chargrilled pork chops):"}</strong>{" "}
            {isVi
              ? "Miếng sườn được tẩm ướp cùng mật ong, nước mắm, hành tỏi và gia vị truyền thống. Sườn phải được nướng trên than hồng đỏ rực để tạo lớp xém vàng óng, đượm khói thơm lừng mà bên trong vẫn mọng nước mềm tan."
              : "The pork chop used for com tam is first marinated with simple local spices and seasonings. A successful piece of pork chop must be grilled over a charcoal fire to develop a golden char with a deeply smoky flavor while still remaining juicy and tender."}
          </li>
          <li>
            <strong>{isVi ? "Bì (bì heo trộn thính gạo):" : "Bi (shredded pork skin):"}</strong>{" "}
            {isVi
              ? "Da heo luộc chín tới, thái sợi mỏng như tơ tằm rồi trộn đều với thính gạo rang vàng thơm phức. Bì mang lại cảm giác giòn sần sật bùi béo khó quên."
              : "Boiled pork skin is thinly sliced into fine threads, cooled, and then mixed with roasted rice powder (or thinh, as it is called in Vietnamese). The pork skin threads have a powdery, crunchy texture and a hint of fermented aroma."}
          </li>
          <li>
            <strong>{isVi ? "Chả (chả trứng hấp):" : "Cha (steamed egg meatloaf):"}</strong>{" "}
            {isVi
              ? "Món chả bùi ngậy được hấp từ thịt nạc xay, trứng, mộc nhĩ, bún tàu và phủ lớp lòng đỏ trứng vàng óng ả trên mặt. Một số quán còn biến tấu thêm thịt cua hoặc trứng muối đặc biệt."
              : "This seemingly ordinary side dish is actually a delicacy. The mince is super soft and moist, with crunchy highlights from the wood-ear mushrooms inside. The top is brushed with a shiny golden egg yolk glaze. Some restaurants add their signature ingredients, such as crab meat and salted egg yolks, to their meatloaf, making it stand out from competitors."}
          </li>
          <li>
            <strong>{isVi ? "Trứng ốp la:" : "Trung op la (sunny-side-up eggs):"}</strong>{" "}
            {isVi
              ? "Trứng chiên lòng đào với viền ngoài giòn tan, lòng đỏ béo ngậy khi dầm chảy quyện vào hạt cơm nóng hổi."
              : "We already had steaming, boiling, and grilling cooking methods, so it's time for something fried. The addition of a fried egg is not only for decoration but also for balancing the elements in the dish."}
          </li>
          <li>
            <strong>{isVi ? "Mỡ hành & tóp mỡ:" : "Mo hanh (scallion oil):"}</strong>{" "}
            {isVi
              ? "Hành lá xắt nhuyễn chần dầu sôi cùng tóp mỡ giòn rụm, rưới lên đĩa cơm bóng bẩy ngát hương."
              : "This garnish is used in many Vietnamese dishes, especially those with grilled meat. More often, scallion oil is mixed with top mo, which are crispy deep-fried pork fat cubes. The shiny green scallion oil not only adds the final touch to the dish but also creates a nice aroma and texture."}
          </li>
          <li>
            <strong>{isVi ? "Đồ chua & rau dưa:" : "Do chua (vegetables and pickles):"}</strong>{" "}
            {isVi
              ? "Dưa leo, cà chua tươi mát ăn kèm đồ chua củ cải trắng và cà rốt ngâm giấm đường giúp cân bằng vị béo."
              : "A plate of com tam is not nutritionally balanced without them. It is always served with sliced fresh cucumbers and tomatoes. To ease the richness of the cooked ingredients, pickled red and white carrots are also added."}
          </li>
          <li>
            <strong>{isVi ? "Nước chấm (nước mắm kẹo tỏi ớt):" : "Nuoc cham (dipping sauce):"}</strong>{" "}
            {isVi
              ? "Nước mắm nấu kẹo sóng sánh tỏi ớt băm nhuyễn — chìa khóa liên kết mọi hương vị trên đĩa cơm."
              : "This is an indispensable accompaniment to com tam, completing its explosive taste. The com tam made for Saigon people must be thick in texture and intense in flavor. Fish sauce is added with water, lime juice, and sugar, and the mixture is complemented with minced chili."}
          </li>
        </ul>

        {/* Sharp Image 2: Ingredients */}
        <figure className="comtam-figure">
          <img
            src="/guide/hcmc/com-tam-ingredients.jpg"
            alt={
              isVi
                ? "Topping phong phú trên đĩa cơm tấm"
                : "Although com tam is a popular dish made to suit the general public in terms of both the taste and the price, the assembly of all the toppings requires a great deal of preparation."
            }
            className="comtam-figure__img"
            loading="lazy"
          />
          <figcaption className="comtam-figure__caption">
            {isVi
              ? "Tuy là món ăn bình dân được đông đảo mọi người yêu thích, việc chuẩn bị tất cả các món ăn kèm cho đĩa cơm tấm đòi hỏi sự công phu rất lớn."
              : "Although com tam is a popular dish made to suit the general public in terms of both the taste and the price, the assembly of all the toppings requires a great deal of preparation."}
          </figcaption>
        </figure>

        {/* ── Section: Types of com tam ── */}
        <h2 id="types-of-com-tam" className="comtam-section-title">
          {isVi ? "Các biến thể cơm tấm" : "Types of com tam"}
        </h2>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Nhờ sự tiện lợi và hấp dẫn, cơm tấm là lựa chọn hoàn hảo cho mọi bữa ăn trong ngày. Nhiều thực khách ghé quán quen hầu như mỗi ngày, thúc đẩy các chủ quán đa dạng hóa thực đơn với sườn non, sườn cây, ba rọi nướng cùng hơn mười món mặn tự chọn kiểu cơm bình dân.
            </>
          ) : (
            <>
              Due to its convenience, com tam is now a popular choice for an easy and tasty meal throughout the day. Local com tam food stalls are always packed with people, regardless of whether it&apos;s breakfast, lunch, or dinner. Many customers visit their favorite place almost every day, which led the cook to diversify the food choices for them by offering various side dishes to alter the standard com tam toppings. This includes using different types of pork such as back ribs instead of rib chops or butterflied chops, and a selection of over ten home-cooked dishes, including stir-fried vegetables, soups, seafood, and vegetarian options.
            </>
          )}
        </p>

        <h3 className="comtam-subhead">
          {isVi ? "Cơm tấm Long Xuyên (Đặc sản miền Tây)" : "Com Tam Long Xuyen (Mekong Delta Specialty)"}
        </h3>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Một phiên bản nổi tiếng nức lòng du khách là <em>cơm tấm Long Xuyên</em> (An Giang). Gạo tấm ở đây được xay nhuyễn hạt mịn hơn. Thịt khìa và trứng vịt kho nước dừa được xắt nhuyễn hình que diêm rải đều khắp mặt đĩa cùng dưa chua rau muống giòn tan, tạo nên món cơm trộn hài hòa, thanh vị và ít ngấy hơn phong cách Sài Gòn.
            </>
          ) : (
            <>
              One notable version of com tam is <em>com tam Long Xuyen</em>, which has gained its own reputation. Long Xuyen is a quiet town in the Mekong Delta and is known for its less greasy and &ldquo;complex&rdquo; version of com tam compared to Saigon. In Long Xuyen, even small rice fragments are used, and the most noticeable difference is that whole eggs are caramelized and braised in coconut water instead of a sunny-side-up egg or steamed egg meatloaf. The braised eggs and grilled pork are chopped into matchstick size when serving, creating a mixable dish similar to a mixed rice dish. Pickled carrots and pickled morning glory are also added.
            </>
          )}
        </p>

        <h3 className="comtam-subhead">
          {isVi ? "Cơm tấm chay thanh tịnh" : "Vegetarian Com Tam"}
        </h3>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Dành cho những người ăn chay, món cơm tấm chay sử dụng sườn lát đậu nành chiên giòn, bì bún tàu thơm thính và chả đậu hũ non nấm mèo mềm mịn, mang lại trải nghiệm ẩm thực trọn vẹn mà thanh đạm.
            </>
          ) : (
            <>
              For vegetarians, it is possible to find a meat-free or even vegan version of com tam. Pork chops and pork skin are replaced with textured soybean slices and glass noodles, and the seasonings are altered to accommodate a vegetarian diet, such as using vegan oyster sauce and fish sauce. However, be mindful when ordering as some places still use eggs in their steamed egg meatloaf. In this case, vegan cha is a great option, using young tofu and tofu skin to replace eggs and meat, ensuring a soft and moist texture not far from the original version.
            </>
          )}
        </p>

        {/* Sharp Image 3: Vegetarian Com Tam */}
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
              ? "Với những người ăn thuần chay, hoàn toàn có thể thưởng thức phiên bản cơm tấm không thịt vô cùng hấp dẫn."
              : "For vegetarians, it is possible to find a meat-free or even vegan version of com tam."}
          </figcaption>
        </figure>

        {/* ── Section: The eating culture of com tam ── */}
        <h2 id="the-eating-culture-of-com-tam" className="comtam-section-title">
          {isVi ? "Văn hóa thưởng thức cơm tấm" : "The eating culture of com tam"}
        </h2>

        <p className="comtam-body-text">
          {isVi ? (
            <>
              Không ngoa khi nói rằng các quán cơm tấm ở Sài Gòn nhiều chẳng kém gì quán cà phê. Bạn có thể dễ dàng tìm thấy một quán cơm tấm ngon chỉ bằng cách lần theo làn khói nướng sườn thơm phức bốc lên bên vệ đường. Dưới đây là những nét văn hóa đặc trưng thú vị:
            </>
          ) : (
            <>
              Honestly, it&apos;s not an exaggeration to say that com tam food stalls are as prevalent as coffee shops in Saigon. Finding a com tam restaurant is easy, no matter where or when you are: just look for a distant, aromatic puff of smoke from the chargrilled pork chops on the sidestreets – that&apos;s a sign of a good place. Here are some interesting facts about com tam and its eating culture among Vietnamese people:
            </>
          )}
        </p>

        <ul className="comtam-bullets">
          <li>
            <strong>{isVi ? "Thưởng thức bằng muỗng & nĩa:" : "Eat with spoon and fork:"}</strong>{" "}
            {isVi
              ? "Cơm tấm luôn được dọn trên đĩa phẳng và thưởng thức bằng muỗng nĩa, thuận tiện để xắn sườn và rưới nước mắm."
              : "It is common sense to eat com tam with a spoon and fork, with no offense (as explained in its origin)."}
          </li>
          <li>
            <strong>{isVi ? "Cơm tấm đêm:" : "Cơm tấm đêm (Night broken rice):"}</strong>{" "}
            {isVi
              ? "Ngoài bữa sáng và trưa, cơm tấm đêm mở cửa tới tận 1–2 giờ sáng phục vụ những người làm ca muộn hoặc đi chơi đêm."
              : "Com tam is favored for breakfast and lunch. If you crave it for dinner, look for a sign reading &ldquo;cơm tấm đêm,&rdquo; meaning com tam at night. These food stalls typically open late, past midnight, so you can satisfy your hunger after working overtime or a night out."}
          </li>
          <li>
            <strong>{isVi ? "Tủ kính cơm bình dân buổi trưa:" : "Glass display cabinet:"}</strong>{" "}
            {isVi
              ? "Đồ ăn được bày biện trong khay kính bắt mắt, khách chỉ việc chỉ tay chọn món yêu thích."
              : "To take advantage of steamed rice, com tam restaurants often transform into com binh dan, a local home-style eatery, during lunchtime with food showcased in large glass cabinets."}
          </li>
          <li>
            <strong>{isVi ? "MasterChef Season 3:" : "MasterChef global spotlight:"}</strong>{" "}
            {isVi
              ? "Đầu bếp khiếm thị gốc Việt tài ba Christine Hà từng chinh phục ban giám khảo quốc tế Gordon Ramsay bằng món cơm tấm sườn bì chả để bước lên ngôi vị quán quân."
              : "In Season 3 of MasterChef, the creation of com tam played a key role in helping the blind but talented Vietnamese chef, Christine Ha, win the coveted title."}
          </li>
        </ul>

        {/* Sharp Image 4: Culture */}
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
              Dưới đây là danh sách các quán cơm tấm nức tiếng được người dân địa phương và du khách đánh giá cao nhất:
            </>
          ) : (
            <>
              Com tam is a dish that people in Saigon take pride in. It embodies the quintessential street food spirit of Vietnamese cuisine by delivering an explosion of flavors. Make sure to add com tam to your must-try list when visiting Vietnam:
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

      {/* ── 4. Public Footer ── */}
      <PublicFooter />

      {/* ── 5. AI Chatbot Widget ── */}
      <ProvinceChatbot />
    </div>
  );
}

