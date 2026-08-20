import Image from "next/image";
import Link from "next/link";

export default function Logo({
  className = "navbar__logo",
  size = 26,
  showText = true,
  style,
  onClick,
  href = "/",
}) {
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
        width={size}
        height={size}
        priority
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "contain",
          flexShrink: 0,
          display: "block",
        }}
      />
      {showText && <span>VinaTap</span>}
    </Link>
  );
}
