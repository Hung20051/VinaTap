import DinoLoader from "@/components/ui/DinoLoader";

export default function RootLoading() {
  return (
    <DinoLoader
      text="Đang tải dữ liệu VinaTap..."
      subtext="Vui lòng chờ trong giây lát"
      size={280}
      fullScreen={true}
    />
  );
}
