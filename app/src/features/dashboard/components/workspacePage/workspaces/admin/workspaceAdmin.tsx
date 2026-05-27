"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Copy, FileText, Pencil, Trash2, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSubmissionsByAssignment } from "@/app/src/lib/api/submissions";
import { deleteWorkspace, updateWorkspace } from "@/app/src/lib/api/workspaces";
import type { AdminWorkspace, WorkspaceAdminTask } from "../../data/workspace";
import CreateTaskModal from "./components/CreateTaskModal";
import TaskGrid from "./components/TaskGrid";
import { useWorkspaceAssignments } from "./hooks/useWorkspaceAssignments";
import MembersGrid from "./components/members/MembersGrid";
import { useWorkspaceMembers } from "./hooks/useWorkspaceMembers";

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
  const [submissionCounts, setSubmissionCounts] = useState<Record<string, number>>(
    {},
  );

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadSubmissionCounts() {
      if (assignmentTasks.length === 0) {
        setSubmissionCounts({});
        return;
      }

      const counts = await Promise.all(
        assignmentTasks.map(async (task) => {
          try {
            const submissions = await getSubmissionsByAssignment(task.id);
            return [task.id, submissions.length] as const;
          } catch {
            return [task.id, task.doneCount] as const;
          }
        }),
      );

      if (isActive) {
        setSubmissionCounts(Object.fromEntries(counts));
      }
    }

    loadSubmissionCounts();

    return () => {
      isActive = false;
    };
  }, [assignmentTasks]);

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
    setAssignmentTasks((currentTasks) => [task, ...currentTasks]);
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
    <section className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-slate-50 to-slate-100/80 px-4 py-5 pb-12 sm:px-7 sm:py-6">
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
              onClick={() => setOpenModalCreateTask(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#275D79] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,93,121,0.28)] transition hover:bg-[#1f4a61] sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Nueva Tarea
            </button>
          ) : null}
        </div>

        {tab === "tareas" ? (
          <div className="mt-8 space-y-10">
            {isLoadingAssignments ? (
              <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                Cargando tareas guardadas...
              </p>
            ) : null}

            {assignmentsError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {assignmentsError}
              </p>
            ) : null}

            <div>
              <h2 className="text-lg font-bold text-slate-900">
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
              <h2 className="text-lg font-bold text-slate-900">
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

      {isMounted && isDeleteModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-black/40 px-4 py-6">
              <button
                type="button"
                aria-label="Cerrar"
                className="absolute inset-0"
                onClick={closeDeleteModal}
              />

              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-workspace-title"
                className="relative flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" aria-hidden />
                </div>

                <h2
                  id="delete-workspace-title"
                  className="mt-4 text-center text-xl font-semibold text-slate-900"
                >
                  ¿Eliminar este espacio?
                </h2>

                <p className="mt-2 text-center text-sm text-slate-600">
                  Vas a eliminar{" "}
                  <span className="font-semibold text-slate-900">
                    {editedWorkspace.title}
                  </span>
                  . Se borrarán miembros, tareas y entregas. Esta acción no se
                  puede deshacer.
                </p>

                {deleteError ? (
                  <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {deleteError}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={isDeleting}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
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
            </div>,
            document.body,
          )
        : null}

      {isMounted && isEditing
        ? createPortal(
            <div className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-black/40 px-4 py-6">
              <form
                onSubmit={handleEditWorkspace}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-4 text-slate-900 shadow-2xl sm:p-6"
              >
                <div className="relative mb-4 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="absolute left-0 rounded-full p-2 hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-6 w-6 text-black" />
                  </button>

                  <h2 className="text-center text-xl font-semibold">
                    Editar espacio
                  </h2>
                </div>

                <div className="rounded-xl border border-gray-300 p-4">
                  <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
                    <div
                      className="h-16 w-full"
                      style={{ backgroundColor: editColor }}
                    />

                    <div className="px-3 py-2">
                      <h3 className="text-lg font-semibold">
                        {editTitle || "Nombre del espacio"}
                      </h3>

                      <p className="text-sm text-slate-600">
                        {editDescription ||
                          "Descripción del espacio de trabajo"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">
                      Nombre del espacio
                    </label>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      placeholder="Nombre del espacio"
                      required
                      minLength={3}
                      className="w-full rounded-lg border border-gray-300 bg-[#eee] px-3 py-2 focus:outline-none"
                    />

                    <label className="mt-2 text-sm font-medium text-slate-700">
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
                      className="h-24 w-full rounded-lg border border-gray-300 bg-[#eee] px-3 py-2 outline-none"
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditColor(color)}
                        className={`h-8 w-8 rounded-md border-2 ${
                          editColor === color
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {editError ? (
                    <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {editError}
                    </p>
                  ) : null}

                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="rounded-lg bg-[#275D79] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4a61]"
                    >
                      {isSavingEdit ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </div>
              </form>
            </div>,
            document.body,
          )
        : null}

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
