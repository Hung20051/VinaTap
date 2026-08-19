import { SkeletonHeader, SkeletonList } from "@/components/ui/PageSkeleton";

export default function SupportLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonList rows={3} />
    </>
  );
}
