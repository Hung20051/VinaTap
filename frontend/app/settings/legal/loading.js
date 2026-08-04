import {
  SkeletonHeader,
  SkeletonTabs,
  SkeletonTextLines,
} from "../../../components/PageSkeleton";

export default function LegalLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonTabs count={2} />
      <SkeletonTextLines lines={8} />
    </>
  );
}
