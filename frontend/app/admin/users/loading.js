import {
  SkeletonHeader,
  SkeletonFilters,
  SkeletonTable,
} from "../../../components/PageSkeleton";

export default function UsersLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonFilters count={3} />
      <SkeletonTable rows={6} />
    </>
  );
}
