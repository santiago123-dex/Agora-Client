import AssignmentAdminDetail from "@/app/src/features/dashboard/components/workspacePage/workspaces/admin/taskDetail/AssignmentAdminDetail";

type Props = {
  params: Promise<{
    workspaceId: string;
    taskId: string;
  }>;
};

export default async function AssignmentAdminDetailPage({ params }: Props) {
  const { workspaceId, taskId } = await params;

  return <AssignmentAdminDetail workspaceId={workspaceId} taskId={taskId} />;
}
