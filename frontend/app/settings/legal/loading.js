import DinoLoader from "@/components/ui/DinoLoader";

export default function LegalLoading() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DinoLoader
        fullScreen={false}
        size={200}
        text="Đang tải điều khoản & pháp lý..."
        subtext="Đang tải chính sách bảo mật VinaTap"
      />
    </div>
  );
}
