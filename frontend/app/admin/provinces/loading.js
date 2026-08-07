import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "../../../components/PageSkeleton";

export default function ProvincesLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={4} />
      <SkeletonTable rows={6} />
    </>
  );
}
