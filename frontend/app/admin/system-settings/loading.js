import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "../../../components/PageSkeleton";

export default function SystemSettingsLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={2} />
      <SkeletonTable rows={4} />
    </>
  );
}
