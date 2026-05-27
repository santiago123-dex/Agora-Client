import Link from "next/link";
import { Calendar, CheckCircle2, Clock, Send } from "lucide-react";
import type { WorkspaceAdminTask } from "../../../data/workspace";

function TaskIcon({ task }: { task: WorkspaceAdminTask }) {
  if (task.taskState === "graded") {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden />
      </span>
    );
  }

  if (task.taskState === "upcoming") {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
        <Calendar className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>
    );
  }

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
      <Clock className="h-5 w-5" strokeWidth={2} aria-hidden />
    </span>
  );
}

export default function TaskCard({
  task,
  workspaceId,
  from,
}: {
  task: WorkspaceAdminTask;
  workspaceId?: string | number;
  from?: string | null;
}) {
  const pendingToGrade = Math.max(task.totalCount - task.doneCount, 0);
  const actionLabel =
    task.gradeButtonLabel ??
    (task.taskState === "graded"
      ? "Calificada"
      : `${pendingToGrade} por calificar`);

  // ruta de tareas devuelta    
  const taskHref = `/dashboard/workspace/${workspaceId}/tasks/${task.id}?from=${
    from === "dashboard" ? "dashboard" : "workspace"
  }`;

  return (
    <article className="flex h-full min-h-60 flex-col rounded-[1.35rem] border border-[#94B8C4] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#275D79] hover:shadow-[0_14px_30px_rgba(39,93,121,0.12)]">
      <div className="flex flex-1 flex-col">
        <TaskIcon task={task} />

        <div className="mt-4">
          <h3 className="line-clamp-1 text-base font-bold text-slate-950">
            {task.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-600">
            {task.description}
          </p>
        </div>

        <div className="mt-1 border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Calendar className="h-4 w-4 text-slate-500" aria-hidden />
                {task.dueLabel}
              </span>
              <span className="whitespace-nowrap">{task.points} pts</span>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-900">
              <Send className="h-4 w-4 text-slate-500" aria-hidden />
              {task.doneCount}/{task.totalCount}
            </span>
          </div>
        </div>
      </div>

      {workspaceId ? (
        <Link
          href={taskHref}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#E9F0F3] px-3 py-2 text-sm font-semibold text-[#275D79] transition hover:bg-[#D8E7EC]"
        >
          <Clock className="h-4 w-4" aria-hidden />
          {actionLabel}
        </Link>
      ) : (
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#E9F0F3] px-3 py-2 text-sm font-semibold text-[#275D79] transition hover:bg-[#D8E7EC]"
        >
          <Clock className="h-4 w-4" aria-hidden />
          {actionLabel}
        </button>
      )}
    </article>
  );
}
