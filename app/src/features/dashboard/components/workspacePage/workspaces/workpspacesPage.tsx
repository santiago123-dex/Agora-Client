"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  createWorkspace,
  getMyWorkspaces,
  joinWorkspace,
} from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "../data/workspace-api";
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

type WorkspaceCard = AdminWorkspace | MemberWorkspace;

export default function WorkspacesPage() {
  const [showCreatedWorkspaces, setShowCreatedWorkspaces] = useState(true);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [nombre, setNombre] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyWorkspaces();
      setWorkspaces(response.map(workspaceToCard));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "No se pudieron cargar los workspaces"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

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
      await loadWorkspaces();
      setShowCreatedWorkspaces(true);
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
      await loadWorkspaces();
      setShowCreatedWorkspaces(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo unir al workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  const workspacesToDisplay = useMemo(
    () =>
      workspaces.filter((workspace) =>
        showCreatedWorkspaces
          ? workspace.roleLabel === "admin"
          : workspace.roleLabel === "member"
      ),
    [showCreatedWorkspaces, workspaces]
  );

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="space-y-6">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={
                showCreatedWorkspaces ? "Mis espacios" : "Espacios donde soy miembro"
              }
              aria-pressed={showCreatedWorkspaces}
              onClick={() => setShowCreatedWorkspaces((prev) => !prev)}
              className={`relative flex h-6 w-11 items-center rounded-full px-1 shadow-sm transition-colors ${
                showCreatedWorkspaces
                  ? "justify-start bg-[#0E6174]"
                  : "justify-end bg-slate-300"
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {showCreatedWorkspaces ? "Mis espacios" : "Espacios donde soy miembro"}
            </span>
          </div>

          <button
            onClick={() => setOpenModalCreate(true)}
            type="button"
            className="inline-flex w-fit items-center gap-2 self-start rounded-md bg-[#275D79] px-4 py-2 text-sm font-medium text-white shadow-sm md:self-auto"
          >
            <span className="text-base leading-none">+</span>
            Crear Espacio
          </button>

          {openModalCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
              <form
                onSubmit={handleCreateWorkspace}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-4 shadow-lg sm:p-6"
              >
                <div className="relative mb-4 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setOpenModalCreate(false)}
                    className="absolute left-0 rounded-full p-2 hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-6 w-6 text-black" />
                  </button>
                  <h2 className="text-center text-xl font-medium">Crear espacio</h2>
                </div>
                <div className="rounded-xl border border-gray-400 p-4">
                  <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
                    <div className="h-16 w-full" style={{ backgroundColor: selectedColor }} />
                    <div className="px-3 py-2">
                      <h3 className="text-lg font-semibold">
                        {nombre || "Nombre del espacio"}
                      </h3>
                      <p className="mb-2">
                        {description || "Descripción del espacio de trabajo"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <label>Nombre del espacio</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(event) => setNombre(event.target.value)}
                      placeholder="Nombre del espacio"
                      required
                      minLength={3}
                      className="w-full rounded-lg border border-gray-300 bg-[#eee] px-3 py-2 focus:outline-none"
                    />
                    <label>Descripción</label>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={4}
                      placeholder="Escribe la descripcion para tu espacio de trabajo"
                      required
                      className="h-20 w-full rounded-lg border border-gray-300 bg-[#eee] px-3 py-2 outline-none"
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-md border-2 ${
                          selectedColor === color ? "border-blue-500" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    El código de invitación se generará automáticamente al crear el espacio.
                  </p>

                  <div className="mt-4 flex justify-start gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded border border-[#275D79] bg-[#275D79] px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                      {isSubmitting ? "Creando..." : "Crear Espacio"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {!showCreatedWorkspaces ? (
          <form
            onSubmit={handleJoinWorkspace}
            className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-4 sm:flex-row sm:items-end"
          >
            <label className="flex-1 text-sm font-medium text-slate-700">
              Código de invitación
              <input
                type="text"
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                placeholder="Ej: HJK302P7"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#275D79]"
                required
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#275D79] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Uniendo..." : "Unirse"}
            </button>
          </form>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-2">
          {isLoading ? (
            <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
              Cargando workspaces...
            </p>
          ) : workspacesToDisplay.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
              No tienes workspaces en esta sección.
            </p>
          ) : (
            workspacesToDisplay.map((workspace) => (
              <Link
                href={`/dashboard/workspace/${workspace.id}?from=workspace`}
                key={workspace.id}
              >
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div
                    className="flex min-h-17 items-end justify-between gap-3 px-3 pb-3"
                    style={{ backgroundColor: workspace.accentColor }}
                  >
                    <span className="rounded-sm bg-white/18 px-2 py-0.5 text-[0.62rem] font-medium text-white backdrop-blur-sm">
                      {workspace.roleLabel}
                    </span>

                    {workspace.statusLabel ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[0.62rem] font-medium ${
                          workspace.statusVariant === "done"
                            ? "bg-white text-[#1A936F]"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        {workspace.statusVariant === "done" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m20 6-11 11-5-5" />
                          </svg>
                        ) : null}
                        {workspace.statusLabel}
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>

                  <div className="space-y-1 px-4 py-4 [@media(min-width:1450px)]:py-7">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">
                      {workspace.title}
                    </h3>
                    <p className="text-sm text-slate-500">{workspace.secondaryLabel}</p>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
