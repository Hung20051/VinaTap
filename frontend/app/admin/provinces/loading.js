import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "@/components/ui/PageSkeleton";

export default function ProvincesLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={4} />
      <SkeletonTable rows={6} />
    </>
  );
}
