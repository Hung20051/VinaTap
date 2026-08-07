import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "../../../components/PageSkeleton";

export default function NfcCardsLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={3} />
      <SkeletonTable rows={8} />
    </>
  );
}
