import {
  SkeletonHeader,
  SkeletonKpiGrid,
  SkeletonTable,
} from "@/components/ui/PageSkeleton";

export default function NfcCardsLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonKpiGrid count={3} />
      <SkeletonTable rows={8} />
    </>
  );
}
