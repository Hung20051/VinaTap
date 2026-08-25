import DinoLoader from "@/components/ui/DinoLoader";

export default function SupportLoading() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DinoLoader
        fullScreen={false}
        size={200}
        text="Đang tải kênh hỗ trợ VinaTap..."
        subtext="Đang lấy thông tin Hotline & Email CSKH"
      />
    </div>
  );
}
