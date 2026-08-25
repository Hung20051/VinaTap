import DinoLoader from "@/components/ui/DinoLoader";

export default function PasswordLoading() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DinoLoader
        fullScreen={false}
        size={200}
        text="Đang tải mục bảo mật & mật khẩu..."
        subtext="Đang kết nối phiên đăng nhập an toàn"
      />
    </div>
  );
}
