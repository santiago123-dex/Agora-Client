"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, FileText, ListChecks, Pencil, Plus, Trash2, Users } from "lucide-react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { getSubmissionsByAssignment } from "@/app/src/lib/api/submissions";
import { deleteWorkspace, updateWorkspace } from "@/app/src/lib/api/workspaces";
import ModalWrapper from "@/app/src/components/ui/ModalWrapper";
import type { AdminWorkspace, WorkspaceAdminTask } from "../../data/workspace";
import TaskGrid from "./components/TaskGrid";
import { useWorkspaceAssignments } from "./hooks/useWorkspaceAssignments";
import MembersGrid from "./components/members/MembersGrid";
import { useWorkspaceMembers } from "./hooks/useWorkspaceMembers";

const CreateTaskModal = dynamic(
  () => import("./components/CreateTaskModal"),
  { ssr: false },
);

type Props = {
  workspace: AdminWorkspace;
};

const colors = [
  "#EAB308",
  "#84CC16",
  "#10B981",
  "#DC2626",
  "#2563EB",
  "#0EA5E9",
  "#A21CAF",
  "#EC4899",
];

export default function WorkspaceAdmin({ workspace }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const backHref = from === "dashboard" ? "/dashboard" : "/dashboard/workspace";
  const backLabel =
    from === "dashboard" ? "Volver al dashboard" : "Volver a los workspaces";

  const [tab, setTab] = useState<"tareas" | "miembros">("tareas");
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [editedWorkspace, setEditedWorkspace] = useState({
    title: workspace.title,
    description: workspace.description ?? "",
    accentColor: workspace.accentColor,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState(workspace.title);
  const [editDescription, setEditDescription] = useState(
    workspace.description ?? "",
  );
  const [editColor, setEditColor] = useState(workspace.accentColor);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);

  // primero ejecuta el useWorkspaceAssignment para traer los datos del los estados donde vienen las tareas
  const {
    assignmentTasks,
    assignmentsError,
    isLoadingAssignments,
    setAssignmentTasks,
  } = useWorkspaceAssignments(workspace.id);

  const { members, isLoadingMembers, membersError } = useWorkspaceMembers(
    workspace.id,
  );

  const totalTasks = assignmentTasks.length;

  const taskIds = assignmentTasks.map((t) => t.id).sort().join(",");
  const { data: submissionCounts = {} } = useSWR(
    taskIds ? ["submission-counts", workspace.id, taskIds] : null,
    async ([, , idsStr]) => {
      if (!idsStr) return {};
      const ids = idsStr.split(",").filter(Boolean);
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const submissions = await getSubmissionsByAssignment(id);
            return [id, submissions.length] as [string, number];
          } catch {
            return [id, 0] as [string, number];
          }
        }),
      );
      return Object.fromEntries(entries);
    },
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openEditModal = () => {
    setEditTitle(editedWorkspace.title);
    setEditDescription(editedWorkspace.description);
    setEditColor(editedWorkspace.accentColor);
    setEditError(null);
    setIsEditing(true);
  };

  const handleEditWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingEdit(true);
    setEditError(null);

    try {
      await updateWorkspace(workspace.id, {
        name: editTitle.trim(),
        description: editDescription.trim(),
        accentColor: editColor,
      });

      setEditedWorkspace({
        title: editTitle.trim(),
        description: editDescription.trim(),
        accentColor: editColor,
      });

      setIsEditing(false);
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el workspace",
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setDeleteError(null);
  };

  const confirmDeleteWorkspace = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteWorkspace(workspace.id);
      setIsDeleteModalOpen(false);
      router.push(backHref);
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el espacio",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // funciona para manejar que pasa DESPUES de crear una tarea
  const handleTaskCreated = (task: WorkspaceAdminTask) => {
    setAssignmentTasks((currentTasks) => [task, ...(currentTasks ?? [])]);
    setOpenModalCreateTask(false);
    router.refresh();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const isGradedOrExpired = (task: WorkspaceAdminTask) =>
    task.taskState === "graded" || task.taskState === "pending_grade";

  // Eliminar tareas repetidas usando el id
  const getUniqueTasks = (tasks: WorkspaceAdminTask[]) =>
    Array.from(new Map(tasks.map((task) => [task.id, task])).values());

  const stats = workspace.adminStats;
  const totalMembers = members.length || stats?.members || 0;
  const assignmentTasksWithCounts = assignmentTasks.map((task) => ({
    ...task,
    doneCount: submissionCounts[task.id] ?? task.doneCount,
    totalCount: totalMembers,
  }));

  // Tareas normales, Tareas por calificar, y tareas calificadas
  const allTasks = getUniqueTasks([
    ...assignmentTasksWithCounts,
    ...(workspace.activitiesToGrade ?? []),
    ...(workspace.activitiesGraded ?? []),
  ]);

  // tareas que no esten calificadas ni vencidas osea que esten pendiente por calificar
  const toGrade = allTasks.filter((task) => !isGradedOrExpired(task));
  // Tareas calificadas o vencidas
  const graded = allTasks.filter(isGradedOrExpired);

  const code = workspace.inviteCode ?? "—";

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-slate-50 to-slate-100/80 px-4 py-5 pb-12 sm:px-7 sm:py-6 dark:from-[#0b1120] dark:to-[#0b1120]">
      <div className="mx-auto w-full max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/30 text-white shadow-[0_20px_50px_rgba(37,93,121,0.35)]"
          style={{ background: editedWorkspace.accentColor }}
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
                <button
                  type="button"
                  onClick={openDeleteModal}
                  aria-label="Eliminar espacio"
                  className="rounded-lg border border-red-300/50 bg-red-500/20 p-2 text-white transition hover:bg-red-500/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={openEditModal}
                  aria-label="Editar espacio"
                  className="rounded-lg border border-white/20 bg-white/10 p-2 text-white/95 backdrop-blur-sm transition hover:bg-white/20"
                >
                  <Pencil className="h-4 w-4" />
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
                    <span                     className="absolute -bottom-8 right-0 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow dark:bg-[#0f1a2e] dark:text-slate-200">
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
                {editedWorkspace.title}
              </h1>
              <p className="mt-2 max-w-3xl text-base text-white/90 sm:text-lg">
                {editedWorkspace.description}
              </p>

              {stats ? (
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      [
                        "Miembros",
                        isLoadingMembers ? "..." : String(totalMembers),
                      ],
                      ["Tareas", String(assignmentTasks.length || stats.tasks)],
                      ["Por calificar", String(stats.toGrade)],
                      ["Completadas", stats.completedLabel],
                    ] as const
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/25 bg-white/12 px-4 py-3 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                    >
                      <p className="text-xs font-medium text-white/75">
                        {label}
                      </p>
                      <p className="mt-1 text-xl font-semibold tabular-nums">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-full rounded-2xl border border-slate-200/80 bg-white/95 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:w-auto dark:border-[#253245] dark:bg-[#0f1a2e]">
            <button
              type="button"
              onClick={() => setTab("tareas")}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition sm:flex-none ${
                tab === "tareas"
                  ? "bg-[#275D79] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Users className="h-4 w-4" aria-hidden />
              Miembros
            </button>
          </div>

          {tab === "tareas" ? (
            <button
              type="button"
              onClick={() => setOpenModalCreateTask(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#275D79] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,93,121,0.28)] transition hover:bg-[#1f4a61] sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Nueva Tarea
            </button>
          ) : null}
        </div>

        {tab === "tareas" ? (
          <div className="mt-8 space-y-10">
            {isLoadingAssignments ? (
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-full min-h-60 animate-pulse flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]"
                  >
                    <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-4 space-y-2">
                      <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="mt-4 h-9 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            ) : null}

            {assignmentsError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {assignmentsError}
              </p>
            ) : null}

            <div>
              <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                <ListChecks className="h-5 w-5 text-amber-500" aria-hidden />
                Actividades por calificar
              </h2>
              <TaskGrid
                tasks={toGrade}
                workspaceId={workspace.id}
                from={from}
                emptyMessage="No hay actividades pendientes de calificar."
              />
            </div>

            <div>
              <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                <ListChecks className="h-5 w-5 text-emerald-500" aria-hidden />
                Actividades calificadas
              </h2>
              <TaskGrid
                tasks={graded}
                from={from}
                workspaceId={workspace.id}
                emptyMessage="No hay actividades calificadas aún."
              />
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <MembersGrid
              members={members}
              isLoading={isLoadingMembers}
              error={membersError}
            />
          </div>
        )}
      </div>

      <ModalWrapper open={isMounted && isDeleteModalOpen} onClose={closeDeleteModal}>
        <div className="flex flex-col items-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Trash2 className="h-6 w-6 text-red-600" aria-hidden />
          </div>

          <h2 className="mt-4 text-center text-xl font-semibold text-slate-900 dark:text-slate-100">
            ¿Eliminar este espacio?
          </h2>

          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Vas a eliminar{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {editedWorkspace.title}
            </span>
            . Se borrarán miembros, tareas y entregas. Esta acción no se
            puede deshacer.
          </p>

          {deleteError ? (
            <p className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {deleteError}
            </p>
          ) : null}

          <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={isDeleting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-[#1a2740]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDeleteWorkspace}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar espacio"}
            </button>
          </div>
        </div>
      </ModalWrapper>

      <ModalWrapper open={isMounted && isEditing} onClose={() => setIsEditing(false)} className="max-w-2xl" title="Editar espacio">
        <form onSubmit={handleEditWorkspace}>
          <div className="rounded-3xl border border-slate-300 px-5 py-5 sm:px-7 dark:border-[#253245]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#253245] dark:bg-[#0a1424]">
              <div
                className="h-16 w-full"
                style={{ backgroundColor: editColor }}
              />

              <div className="px-3 py-2">
                <h3 className="text-lg font-semibold dark:text-slate-100">
                  {editTitle || "Nombre del espacio"}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {editDescription ||
                    "Descripción del espacio de trabajo"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Nombre del espacio
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  placeholder="Nombre del espacio"
                  required
                  minLength={3}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Descripción
                </label>

                <textarea
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                  rows={4}
                  placeholder="Escribe la descripción para tu espacio de trabajo"
                  required
                  className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                />
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                Color del espacio
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditColor(color)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition hover:scale-110 ${
                      editColor === color
                        ? "border-slate-600 ring-2 ring-slate-600/25"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {editColor === color ? (
                      <Check className="h-4 w-4 text-white drop-shadow-sm" />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {editError ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {editError}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-[#253245]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-[#1a2740]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSavingEdit}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#275D79] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Pencil className="h-4 w-4" aria-hidden />
                {isSavingEdit ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </ModalWrapper>

      {isMounted ? (
        <CreateTaskModal
          isOpen={openModalCreateTask}
          onClose={() => setOpenModalCreateTask(false)}
          onCreated={handleTaskCreated}
          workspaceId={workspace.id}
        />
      ) : null}
    </section>
  );
}
