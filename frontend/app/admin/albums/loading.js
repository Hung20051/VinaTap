import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "../../../components/PageSkeleton";

export default function AlbumsLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={3} />
      <SkeletonTable rows={5} />
    </>
  );
}
