import { SkeletonHeader, SkeletonList } from "../../../components/PageSkeleton";

export default function SupportLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonList rows={3} />
    </>
  );
}
