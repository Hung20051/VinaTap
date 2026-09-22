import Image from "next/image";
import Link from "next/link";

export default function Logo({
  className = "navbar__logo",
  size = 28,
  showText = true,
  style,
  onClick,
  href = "/",
}) {
  const width = Math.round(size * 1.38);
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={onClick}
      suppressHydrationWarning
    >
      <Image
        src="/logo.png"
        alt="VinaTap"
        width={width}
        height={size}
        priority
        style={{
          width: "auto",
          height: `${size}px`,
          maxHeight: `${size}px`,
          objectFit: "contain",
          flexShrink: 0,
          display: "block",
        }}
      />
      {showText && <span>VinaTap</span>}
    </Link>
  );
}
