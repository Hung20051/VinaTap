import {
  SkeletonHeader,
  SkeletonTextLines,
} from "../../../components/PageSkeleton";

export default function AboutLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonTextLines lines={5} />
    </>
  );
}
