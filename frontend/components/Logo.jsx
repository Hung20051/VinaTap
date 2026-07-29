import Image from "next/image";
import Link from "next/link";
export default function Logo({
  className = "navbar__logo",
  size = 28,
  showText = true,
  style,
  onClick,
}) {
  return (
    <Link href="/" className={className} style={style} onClick={onClick}>
      <Image
        src="/logo.png"
        alt="VinaTap"
        width={size}
        height={size}
        priority
        style={{ objectFit: "contain", flexShrink: 0 }}
      />
      {showText && <span>VinaTap</span>}
    </Link>
  );
}
