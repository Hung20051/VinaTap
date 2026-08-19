import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "@/components/ui/PageSkeleton";

export default function AnalyticsLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={4} />
      <SkeletonTable rows={4} />
    </>
  );
}
