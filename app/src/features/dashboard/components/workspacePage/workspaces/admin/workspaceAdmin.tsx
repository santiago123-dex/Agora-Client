"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Pencil,
  Send,
  Users,
} from "lucide-react";
import type { WorkspaceAdminTask, AdminWorkspace } from "../../data/workspace";

type Props = {
  workspace: AdminWorkspace;
};

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
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
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

export default function WorkspaceAdmin({ workspace }: Props) {
  const [tab, setTab] = useState<"tareas" | "miembros">("tareas");
  const [copied, setCopied] = useState(false);

  const stats = workspace.adminStats;
  const toGrade = workspace.activitiesToGrade ?? [];
  const graded = workspace.activitiesGraded ?? [];
  const members = workspace.adminMembers ?? [];
  const code = workspace.inviteCode ?? "—";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100/80 px-4 py-5 pb-12 sm:px-7 sm:py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/30 text-white shadow-[0_20px_50px_rgba(37,93,121,0.35)]"
          style={{ background: workspace.accentColor }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_45%)]" />
          <div className="relative z-10">
            <div className="flex flex-col gap-4 border-b border-white/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <Link
                href="/dashboard/workspace"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/95 backdrop-blur-sm transition hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                Volver a los workspaces
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  aria-label="Editar espacio"
                  className="rounded-lg border border-white/20 bg-white/10 p-2 text-white/95 backdrop-blur-sm transition hover:bg-white/20"
                >
                  <Pencil className="h-5 w-5" />
                </button>
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
                      ["Tareas", String(stats.tasks)],
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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-full rounded-2xl border border-slate-200/80 bg-white/95 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:w-auto">
            <button
              type="button"
              onClick={() => setTab("tareas")}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition sm:flex-none ${
                tab === "tareas"
                  ? "bg-[#275D79] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-4 w-4" aria-hidden />
              Tareas
            </button>
            <button
              type="button"
              onClick={() => setTab("miembros")}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition sm:flex-none ${
                tab === "miembros"
                  ? "bg-[#275D79] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="h-4 w-4" aria-hidden />
              Miembros
            </button>
          </div>
          {tab === "tareas" ? (
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#275D79] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,93,121,0.28)] transition hover:bg-[#1f4a61] sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Nueva Tarea
            </button>
          ) : null}
        </div>

        {tab === "tareas" ? (
          <div className="mt-8 space-y-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Actividades por calificar</h2>
              <div className="mt-4 space-y-4">
                {toGrade.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
                    No hay actividades pendientes de calificar.
                  </p>
                ) : (
                  toGrade.map((task) => (
                    <article
                      key={task.id}
                      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
                    >
                      <div className="flex gap-4 p-5">
                        <TaskIcon task={task} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900">{task.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {task.description}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {task.dueLabel}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                              {task.points} pts
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                              <Send className="h-3.5 w-3.5" aria-hidden />
                              {task.doneCount}/{task.totalCount}
                            </span>
                          </div>
                        </div>
                      </div>
                      {task.gradeButtonLabel ? (
                        <button
                          type="button"
                          className="w-full border-t border-slate-100 bg-sky-50 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
                        >
                          {task.gradeButtonLabel}
                        </button>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Actividades calificadas</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {graded.length === 0 ? (
                  <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
                    No hay actividades calificadas aún.
                  </p>
                ) : (
                  graded.map((task) => (
                    <article
                      key={task.id}
                      className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.1)]"
                    >
                      <TaskIcon task={task} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>{task.dueLabel}</span>
                          <span>{task.points} pts</span>
                          <span className="inline-flex items-center gap-1">
                            <Send className="h-3 w-3" aria-hidden />
                            {task.doneCount}/{task.totalCount}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              {members.length === 0 ? (
                <li className="px-4 py-12 text-center text-sm text-slate-500">
                  No hay miembros en el mock de este espacio.
                </li>
              ) : (
                members.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/80 text-sm font-semibold text-slate-700">
                        {m.name.slice(0, 1)}
                      </span>
                      <span className="font-medium text-slate-900">{m.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{m.email}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
