import type { WorkspaceAdminTask } from "../../../data/workspace";
import TaskCard from "./TaskCard";

type TaskGridProps = {
  emptyMessage: string;
  tasks: WorkspaceAdminTask[];
  workspaceId?: string | number;
  from?: string | null;
};

export default function TaskGrid({ emptyMessage, tasks, workspaceId, from }: TaskGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {tasks.length === 0 ? (
        <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} workspaceId={workspaceId} from={from} />
        ))
      )}
    </div>
  );
}
