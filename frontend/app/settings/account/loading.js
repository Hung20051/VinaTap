import {
  SkeletonHeader,
  SkeletonAvatarForm,
} from "../../../components/PageSkeleton";

export default function AccountLoading() {
  return (
    <>
      <SkeletonHeader />
      <SkeletonAvatarForm fields={3} />
    </>
  );
}
