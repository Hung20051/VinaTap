import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "@/components/ui/PageSkeleton";

export default function SystemSettingsLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={2} />
      <SkeletonTable rows={4} />
    </>
  );
}
