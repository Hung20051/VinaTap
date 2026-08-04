import {
  SkeletonHeader,
  SkeletonFilters,
  SkeletonTable,
} from "../../../components/PageSkeleton";

export default function RevenueLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonFilters count={2} />
      <SkeletonTable rows={6} />
    </>
  );
}
