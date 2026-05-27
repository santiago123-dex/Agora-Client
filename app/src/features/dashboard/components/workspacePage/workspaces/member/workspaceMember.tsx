"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Copy,
  FileText,
} from "lucide-react";

import type { MemberWorkspace } from "../../data/workspace";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useWorkspaceMemberAssignments } from "./hooks/useWorkspaceMemberAssignments";

type Props = {
  workspace: MemberWorkspace;
}

export default function WorkspaceMember({ workspace }: Props) {

  const [copied, setCopied] = useState(false);

  const stats = workspace.memberStats;
  const code = workspace.inviteCode ?? "-";
  const {
    memberTasks,
    isLoadingMemberTasks,
    memberTasksError,
  } = useWorkspaceMemberAssignments(workspace.id, workspace.memberTask ?? []);
  const tasks = memberTasks;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const backHref =
    from === "dashboard" ? "/dashboard" : "/dashboard/workspace";

  const backLabel =
    from === "dashboard"
      ? "Volver al dashboard"
      : "Volver a los workspaces";


  return (
    <section className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-slate-50 to-slate-100/80 px-4 py-5 pb-12 sm:px-7 sm:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/30 text-white shadow-lg "
          style={{ background: workspace.accentColor }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_45%)]" />
          <div className="relative z-10">
            <div className="flex flex-col gap-4 border-b border-white/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <Link
                href={backHref}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/95 backdrop-blur-sm transition hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                {backLabel}
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/15 px-3 py-1.5 pl-4 text-sm font-medium backdrop-blur-sm">
                  <span className="break-all">Código: {code}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    aria-label="Copiar código"
                    className="rounded-md p-1.5 text-white/90 hover:bg-white/20"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {copied ? (
                    <span className="absolute -bottom-8 right-0 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow">
                      Copiado
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-8">
              <span className="inline-block rounded-full border border-white/25 bg-white/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                Creador
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {workspace.title}
              </h1>
              <p className="mt-2 max-w-3xl text-base text-white/90 sm:text-lg">
                {workspace.description}
              </p>

              {stats ? (
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      ["Miembros", String(stats.members)],
                      ["Tareas", String(tasks.length || stats.tasks)],
                      ["Por calificar", String(stats.toGrade)],
                      ["Completadas", stats.completedLabel],
                    ] as const
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/25 bg-white/12 px-4 py-3 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                    >
                      <p className="text-xs font-medium text-white/75">{label}</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-6 inline-flex w-full rounded-2xl border border-slate-200/80 bg-white/95 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:w-auto">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition sm:flex-none"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Tareas
          </button>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-6xl">
        {isLoadingMemberTasks ? (
          <p className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
            Cargando tareas guardadas...
          </p>
        ) : null}

        {memberTasksError ? (
          <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {memberTasksError}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
          {tasks.length === 0 ? (
            <p className="col-span-full w-full rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
              No hay tareas en el momento
            </p>
          ) : (
            tasks.map((task) => (
              <article
                key={task.id}
                className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#c0c0c0] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
              >
                <div className="p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                    <Clock className="h-5 w-5" aria-hidden />
                  </span>

                  <h3 className="mt-3 text-base font-semibold text-slate-900">
                    {task.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {task.description}
                  </p>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" aria-hidden />
                        {task.dueLabel}
                      </span>
                      <span>{task.points} pts</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-5 pb-5">
                  <Link
                    href={`/dashboard/workspace/${workspace.id}/tasks/${task.id}?from=member`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      task.actionLabel
                        ? "bg-[#1f5a73] text-white shadow-[0_10px_20px_rgba(31,90,115,0.25)] hover:bg-[#184a5f]"
                        : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {task.actionLabel ? (
                      <FileText className="h-4 w-4" aria-hidden />
                    ) : (
                      <Check className="h-4 w-4" aria-hidden />
                    )}
                    {task.actionLabel ?? task.gradeLabel ?? "Ver detalle"}
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
