"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Check, Pin, PinOff, Loader2, UserPlus, Copy,
  Layers, Users,
} from "lucide-react";
import useSWR from "swr";
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceMemberCount,
  joinWorkspace,
} from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "../data/workspace-api";
import { usePinnedWorkspaces } from "@/app/src/lib/hooks/usePinnedWorkspaces";
import ModalWrapper from "@/app/src/components/ui/ModalWrapper";
import type { AdminWorkspace, MemberWorkspace } from "../data/workspace";

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

type Tab = "created" | "member";
type WorkspaceCard = AdminWorkspace | MemberWorkspace;

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#253245] dark:bg-[#0f1a2e]">
      <div className="h-14 bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2.5 px-4 py-4">
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-700" />
        <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-700" />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-14 dark:border-[#253245] dark:bg-[#0f1a2e]">
      <Layers size={32} className="text-slate-300 dark:text-slate-600" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

export default function WorkspacesPage() {
  const [tab, setTab] = useState<Tab>("created");
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalJoin, setOpenModalJoin] = useState(false);
  const [nombre, setNombre] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isPinned, togglePin, pinLimitReached } = usePinnedWorkspaces();

  const { data: workspaces = [], error: swrError, isLoading, mutate } = useSWR(
    "my-workspaces",
    async () => {
      const response = await getMyWorkspaces();
      const cards = response.map(workspaceToCard);

      const cardsWithMemberCount = await Promise.all(
        cards.map(async (workspace) => {
          const fallbackCount =
            workspace.roleLabel === "admin"
              ? workspace.adminStats?.members ?? 0
              : workspace.memberStats?.members ?? 0;

          let count = fallbackCount;

          try {
            const response = await getWorkspaceMemberCount(workspace.id);
            count = response.count;
          } catch {
            // Si no se puede cargar el conteo, mantenemos el valor inicial.
          }

          if (workspace.roleLabel === "admin") {
            return {
              ...workspace,
              adminStats: workspace.adminStats
                ? {
                    ...workspace.adminStats,
                    members: count,
                  }
                : undefined,
            };
          }

          return {
            ...workspace,
            memberStats: workspace.memberStats
              ? {
                  ...workspace.memberStats,
                  members: count,
                }
              : undefined,
          };
        }),
      );

      return cardsWithMemberCount;
    },
  );

  const handleCreateWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createWorkspace({
        name: nombre,
        description,
        accentColor: selectedColor,
      });

      setNombre("");
      setDescription("");
      setSelectedColor(colors[0]);
      setOpenModalCreate(false);
      await mutate();
      setTab("created");
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo crear el workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await joinWorkspace(joinCode.trim());
      setJoinCode("");
      await mutate();
      setTab("member");
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo unir al workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  const workspacesToDisplay = useMemo(
    () =>
      workspaces
        .filter((workspace) =>
          tab === "created"
            ? workspace.roleLabel === "admin"
            : workspace.roleLabel === "member"
        )
        .filter((workspace) =>
          searchQuery
            ? workspace.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        ),
    [tab, workspaces, searchQuery]
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: "created", label: "Creados" },
    { key: "member", label: "Donde participo" },
  ];

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="serif text-xl text-slate-900 dark:text-slate-100">Mis Espacios</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Administra y organiza tus espacios de trabajo
          </p>
        </div>

        {error || swrError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error ?? swrError?.message}
          </div>
        ) : null}

        {/* Search + Tabs + Create button */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:ring-[#275D79]/40"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-[#1a2639]">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    tab === t.key
                      ? "bg-white text-slate-900 shadow-sm dark:bg-[#0f1a2e] dark:text-slate-100"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setOpenModalJoin(true); setError(null); setJoinCode(""); }}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <UserPlus size={16} />
                Unirse
              </button>
              <button
                onClick={() => setOpenModalCreate(true)}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4a61]"
              >
                <Plus size={16} />
                Crear
              </button>
            </div>
          </div>
        </div>

        {/* Join modal */}
        <ModalWrapper
          open={openModalJoin}
          onClose={() => { setOpenModalJoin(false); setError(null); }}
        >
          <form onSubmit={handleJoinWorkspace}>
            <div className="flex flex-col items-center gap-4 rounded-xl bg-slate-50 px-4 py-8 dark:bg-[#0a1424]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#275D79]/10 text-[#275D79] dark:bg-[#275D79]/20">
                <UserPlus size={28} />
              </div>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Ingresá el código de invitación que te compartió el administrador del espacio.
              </p>
            </div>

            <div className="mt-6">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Código de invitación
              </label>
              <div className="relative mt-1.5">
                <Copy size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Ej: HJK302P7"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm tracking-[0.15em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:ring-[#275D79]/40"
                  autoFocus
                  required
                />
              </div>
            </div>

            {joinCode.length >= 6 && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <Check size={14} />
                Código válido. Presioná &quot;Unirse&quot; para continuar.
              </div>
            )}

            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpenModalJoin(false);
                  setError(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || joinCode.length < 4}
                className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                {isSubmitting ? "Uniendo..." : "Unirse"}
              </button>
            </div>
          </form>
        </ModalWrapper>

        {/* Workspace grid */}
        <div className="grid gap-5 xl:grid-cols-2">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : workspacesToDisplay.length === 0 ? (
            <EmptyState
              message={
                tab === "created"
                  ? "Aún no has creado espacios de trabajo."
                  : "Aún no participas en otros espacios."
              }
            />
          ) : (
            workspacesToDisplay.map((workspace) => {
              const totalMembers =
                workspace.roleLabel === "admin"
                  ? workspace.adminStats?.members
                  : workspace.memberStats?.members;

              const pinned = isPinned(workspace.id);

              return (
              <div key={workspace.id} className="group relative">
                <Link
                  href={`/dashboard/workspace/${workspace.id}?from=workspace`}
                >
                  <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#275D79]/10 dark:border-[#253245] dark:bg-[#0f1a2e] dark:hover:shadow-[#275D79]/20">
                    <div
                      className="flex min-h-14 items-end justify-between gap-3 px-4 pb-3"
                      style={{ backgroundColor: workspace.accentColor }}
                    >
                      <span className="rounded-md bg-white/18 px-2 py-0.5 text-[0.65rem] font-medium text-white backdrop-blur-sm">
                        {workspace.roleLabel === "admin" ? "creado" : "miembro"}
                      </span>

                      {workspace.statusLabel ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.65rem] font-medium ${
                            workspace.statusVariant === "done"
                              ? "bg-white text-emerald-700"
                              : "bg-white/80 text-slate-700"
                          }`}
                        >
                          {workspace.statusVariant === "done" ? (
                            <Check size={11} />
                          ) : null}
                          {workspace.statusLabel}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-1.5 px-4 py-4">
                      <h3 className="text-base font-semibold text-slate-950 dark:text-slate-100">
                        {workspace.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {workspace.secondaryLabel || "Sin descripción"}
                      </p>
                      <div className="flex items-center gap-3 pt-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <Users size={12} />
                          {totalMembers ?? 0}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
                <button
                  type="button"
                  onClick={() => togglePin(workspace.id)}
                  className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white ${
                    pinned
                      ? "text-[#275D79] opacity-100"
                      : "text-slate-400 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  } dark:bg-slate-700/80 dark:hover:bg-slate-700`}
                  title={pinned ? "Desfijar" : pinLimitReached ? "Máximo 4 fijados" : "Fijar en dashboard"}
                >
                  {pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
              </div>
              );
            })
          )}
        </div>

        {/* Create modal */}
        <ModalWrapper
          open={openModalCreate}
          onClose={() => setOpenModalCreate(false)}
        >
          <form onSubmit={handleCreateWorkspace}>
            {/* Preview */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#253245]">
              <div className="h-14 w-full" style={{ backgroundColor: selectedColor }} />
              <div className="px-4 py-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {nombre || "Nombre del espacio"}
                </h3>
                <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                  {description || "Descripción del espacio de trabajo"}
                </p>
              </div>
            </div>

            {/* Form fields */}
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Nombre</span>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Mi espacio"
                  required
                  minLength={3}
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Descripción</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe el propósito de este espacio"
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Color de identificación</span>
                <div className="mt-1.5 flex flex-wrap gap-2.5">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-8 w-8 rounded-full transition hover:scale-110 ${
                        selectedColor === color ? "ring-2 ring-[#275D79] ring-offset-2 dark:ring-offset-[#0f1a2e]" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-[#0a1424] dark:text-slate-400">
              El código de invitación se generará automáticamente al crear el espacio.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenModalCreate(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {isSubmitting ? "Creando..." : "Crear Espacio"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      </div>
    </section>
  );
}
