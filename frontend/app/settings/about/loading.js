import DinoLoader from "@/components/ui/DinoLoader";

export default function AboutLoading() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DinoLoader
        fullScreen={false}
        size={200}
        text="Đang tải thông tin VinaTap..."
        subtext="Đang lấy phiên bản và thông tin dự án"
      />
    </div>
  );
}
