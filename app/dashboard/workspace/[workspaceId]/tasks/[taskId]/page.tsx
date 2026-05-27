import TaskDetailWrapper from "@/app/src/features/dashboard/components/workspacePage/TaskDetailWrapper";

type Props = {
  params: Promise<{
    workspaceId: string;
    taskId: string;
  }>;
};

export default async function TaskDetailPage({ params }: Props) {
  const { workspaceId, taskId } = await params;

  return <TaskDetailWrapper workspaceId={workspaceId} taskId={taskId} />;
}
