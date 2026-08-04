import {
  SkeletonHeader,
  SkeletonOptionsGrid,
} from "../../../components/PageSkeleton";

export default function AppearanceLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonOptionsGrid count={2} />
    </>
  );
}
