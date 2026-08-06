import {
  SkeletonHeader,
  SkeletonFilters,
  SkeletonKpiGrid,
} from "../../../components/PageSkeleton";

// Đổi từ SkeletonCentered (lúc trang còn là AdminComingSoon) sang dạng
// lưới — trang giờ đã có nội dung thật (lưới sticker theo category).
export default function StickersLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonFilters count={2} />
      <SkeletonKpiGrid count={8} />
    </>
  );
}
