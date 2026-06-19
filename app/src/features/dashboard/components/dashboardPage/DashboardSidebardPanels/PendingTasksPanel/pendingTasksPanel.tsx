"use client";

import useSWR from "swr";
import { CalendarDays, AlertCircle, Clock, Inbox } from "lucide-react";
import { getPendingTasks } from "@/app/src/lib/api/dashboard";

export default function PendingTasksPanel() {
  const { data, error, isLoading } = useSWR("pending-tasks", getPendingTasks);

  const tasks = data?.tasks ?? [];

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-amber-400 to-amber-300" />
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-4 space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 dark:border-[#253245]">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
                </div>
                <div className="h-3 w-14 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-amber-400 to-amber-300" />
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-slate-100">Tareas por entregar</h3>
              <p className="mt-0.5 text-sm text-slate-500">No disponible</p>
            </div>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
              <Clock size={15} />
            </span>
          </div>
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/60 dark:text-red-400">
            {error instanceof Error ? error.message : "Error al cargar tareas"}
          </p>
        </div>
      </section>
    );
  }

  if (tasks.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-amber-400 to-amber-300" />
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-slate-100">Tareas por entregar</h3>
              <p className="mt-0.5 text-sm text-slate-500">Al día</p>
            </div>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#275D79]/10 text-[#275D79] dark:bg-[#275D79]/20 dark:text-[#275D79]">
              <Inbox size={15} />
            </span>
          </div>
          <div className="flex flex-col items-center py-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No tenés tareas pendientes.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
      <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-amber-400 to-amber-300" />
      <div className="px-5 py-5 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-slate-100">Tareas por entregar</h3>
            <p className="mt-0.5 text-sm text-slate-500">{tasks.length} pendientes</p>
          </div>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#275D79]/10 text-[#275D79] dark:bg-[#275D79]/20 dark:text-[#275D79]">
            <Clock size={15} />
          </span>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <article
              key={task.id}
              className={`group relative overflow-hidden rounded-2xl border px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                task.urgent
                  ? "border-red-200 bg-red-50/50 hover:shadow-red-200 dark:border-red-900/60 dark:bg-red-950/20 dark:hover:shadow-black/40"
                  : "border-slate-200 bg-white hover:shadow-[#275D79]/5 dark:border-[#253245] dark:bg-[#0f1a2e] dark:hover:shadow-black/30"
              }`}
            >
              <div
                className={`absolute left-0 top-0 h-full w-0.5 ${
                  task.urgent ? "bg-red-400 dark:bg-red-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              />

              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {task.urgent && (
                      <AlertCircle size={14} className="shrink-0 text-red-500 dark:text-red-400" />
                    )}
                    <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {task.title}
                    </h4>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{task.subject}</p>
                </div>

                <div
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    task.urgent
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      : "bg-slate-100 text-slate-500 dark:bg-[#1e293b] dark:text-slate-400"
                  }`}
                >
                  <CalendarDays size={12} />
                  {task.dueDate}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
