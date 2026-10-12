import Image from "next/image";
import Link from "next/link";

export default function Logo({
  className = "navbar__logo",
  size = 28,
  showText = true,
  style,
  onClick,
  href = "/",
  as,
  noLink = false,
}) {
  const numericSize =
    typeof size === "number"
      ? size
      : size === "small"
      ? 24
      : size === "large"
      ? 40
      : 28;
  const width = Math.round(numericSize * 1.38);

  const inner = (
    <>
      <Image
        src="/logo.png"
        alt="VinaTap"
        width={width}
        height={numericSize}
        priority
        style={{
          width: "auto",
          height: `${numericSize}px`,
          maxHeight: `${numericSize}px`,
          objectFit: "contain",
          flexShrink: 0,
          display: "block",
        }}
      />
      {showText && <span>VinaTap</span>}
    </>
  );

  if (noLink || !href || as === "span" || as === "div") {
    const Tag = as || "span";
    return (
      <Tag className={className} style={style} onClick={onClick}>
        {inner}
      </Tag>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={onClick}
      suppressHydrationWarning
    >
      {inner}
    </Link>
  );
}
