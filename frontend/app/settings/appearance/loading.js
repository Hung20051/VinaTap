import DinoLoader from "@/components/ui/DinoLoader";

export default function AppearanceLoading() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DinoLoader
        fullScreen={false}
        size={200}
        text="Đang tải cài đặt giao diện..."
        subtext="Đang tải chủ đề và ngôn ngữ hiển thị"
      />
    </div>
  );
}
