import { SkeletonHeader, SkeletonForm } from "@/components/ui/PageSkeleton";

export default function PasswordLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonForm fields={3} />
    </>
  );
}
