import { GroupDetail } from "@/features/groups/components/GroupDetail";

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const { id } = await params;
  return <GroupDetail id={id} />;
}
