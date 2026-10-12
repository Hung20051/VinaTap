import { Suspense } from "react";
import GuideDetailPage from "./[slug]/page";

export default function GuideIndexPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#00c2cb", fontWeight: 700 }}>Đang tải cẩm nang VinaTap...</div>
        </div>
      }
    >
      <GuideDetailPage />
    </Suspense>
  );
}
