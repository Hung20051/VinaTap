import {
  SkeletonHeader,
  SkeletonAvatarForm,
} from "@/components/ui/PageSkeleton";

export default function AccountLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonAvatarForm fields={3} />
    </>
  );
}
