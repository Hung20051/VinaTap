import {
  SkeletonHeader,
  SkeletonTextLines,
} from "@/components/ui/PageSkeleton";

export default function AboutLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonTextLines lines={5} />
    </>
  );
}
