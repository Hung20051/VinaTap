import {
  SkeletonHeader,
  SkeletonFilters,
  SkeletonTable,
} from "@/components/ui/PageSkeleton";

export default function UsersLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonFilters count={3} />
      <SkeletonTable rows={6} />
    </>
  );
}
