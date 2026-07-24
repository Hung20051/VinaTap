// Next.js App Router hiển thị file này NGAY LẬP TỨC khi bắt đầu điều hướng
// sang /forgot-password, trong lúc chờ JS của page.js được tải/parse xong —
// tức là che luôn khoảng trễ mà trước đó lộ ra nền trắng mặc định của
// body (--bg-page trong globals.css).
export default function ForgotPasswordLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        backgroundImage: "url('/auth-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="spinner" />
    </div>
  );
}
