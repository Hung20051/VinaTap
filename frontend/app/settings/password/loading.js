import { SkeletonHeader, SkeletonForm } from "../../../components/PageSkeleton";

export default function PasswordLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonForm fields={3} />
    </>
  );
}
