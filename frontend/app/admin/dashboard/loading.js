import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonList,
} from "../../../components/PageSkeleton";

export default function DashboardLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={4} />
      <SkeletonList rows={5} />
    </>
  );
}
