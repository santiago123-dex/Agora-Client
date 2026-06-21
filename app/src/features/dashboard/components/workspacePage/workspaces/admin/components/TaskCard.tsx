import Link from "next/link";
import { Calendar, CheckCircle2, Clock, Send } from "lucide-react";
import type { WorkspaceAdminTask } from "../../../data/workspace";

function TaskIcon({ task }: { task: WorkspaceAdminTask }) {
  if (task.taskState === "graded") {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden />
      </span>
    );
  }

  if (task.taskState === "upcoming") {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
        <Calendar className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>
    );
  }

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
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
    <article className="flex h-full min-h-60 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#275D79] hover:shadow-lg dark:border-[#253245] dark:bg-[#0f1a2e]">
      <div className="flex flex-1 flex-col">
        <TaskIcon task={task} />

        <div className="mt-4">
          <h3 className="line-clamp-1 text-base font-bold text-slate-950 dark:text-slate-100">
            {task.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {task.description}
          </p>
        </div>

        <div className="mt-1 border-t border-slate-200 pt-3 dark:border-[#253245]">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden />
                {task.dueLabel}
              </span>
              <span className="whitespace-nowrap">{task.points} pts</span>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-900 dark:text-slate-100">
              <Send className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden />
              {task.doneCount}/{task.totalCount}
            </span>
          </div>
        </div>
      </div>

      {workspaceId ? (
        <Link
          href={taskHref}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-[#1a2740] dark:text-slate-300 dark:hover:bg-[#253245]"
        >
          <Clock className="h-4 w-4" aria-hidden />
          {actionLabel}
        </Link>
      ) : (
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-[#1a2740] dark:text-slate-300 dark:hover:bg-[#253245]"
        >
          <Clock className="h-4 w-4" aria-hidden />
          {actionLabel}
        </button>
      )}
    </article>
  );
}
