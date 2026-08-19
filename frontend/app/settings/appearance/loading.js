import {
  SkeletonHeader,
  SkeletonOptionsGrid,
} from "@/components/ui/PageSkeleton";

export default function AppearanceLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonOptionsGrid count={2} />
    </>
  );
}
