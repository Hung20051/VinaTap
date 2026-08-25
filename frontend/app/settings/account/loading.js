import DinoLoader from "@/components/ui/DinoLoader";

export default function AccountLoading() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DinoLoader
        fullScreen={false}
        size={200}
        text="Đang tải thông tin tài khoản..."
        subtext="Đang đồng bộ ảnh đại diện và hồ sơ"
      />
    </div>
  );
}
