"use client";

import { FormEvent, useState } from "react";
import { LogIn, Plus, Loader2, Check, Copy, UserPlus, X } from "lucide-react";
import { createWorkspace, joinWorkspace } from "@/app/src/lib/api/workspaces";
import ModalWrapper from "@/app/src/components/ui/ModalWrapper";
import { useRouter } from "next/navigation";

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

export default function DashboardHeader() {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalJoin, setOpenModalJoin] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [nombre, setNombre] = useState("");
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const refreshDashboard = () => {
    window.location.reload();
  };

  const handleCreateWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingCreate(true);
    setMessage(null);

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
      refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear el workspace");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleJoinWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingJoin(true);
    setMessage(null);

    try {
      await joinWorkspace(joinCode.trim());
      setJoinCode("");
      setOpenModalJoin(false);
      refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo unir al workspace");
    } finally {
      setIsSubmittingJoin(false);
    }
  };

  return (
    <section className="w-full px-4 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold sm:text-3xl">Bienvenido de vuelta</h2>
          <p className="text-slate-500">Aqui tienes un resumen de tu actividad</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setOpenModalJoin(true); setMessage(null); setJoinCode(""); }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <LogIn size={16} />
            Unirse
          </button>
          <button
            onClick={() => { setOpenModalCreate(true); setMessage(null); setNombre(""); setDescription(""); setSelectedColor(colors[0]); }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4a61]"
          >
            <Plus size={16} />
            Crear Espacio
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      ) : null}

      {/* Join modal */}
      <ModalWrapper
        open={openModalJoin}
        onClose={() => { setOpenModalJoin(false); setMessage(null); }}
      >
        <form onSubmit={handleJoinWorkspace}>
          <div className="flex flex-col items-center gap-4 rounded-xl bg-slate-50 px-4 py-8 dark:bg-[#0a1424]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#275D79]/10 text-[#275D79]">
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
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm tracking-[0.15em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                autoFocus
                required
              />
            </div>
          </div>

          {joinCode.length >= 6 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <Check size={14} />
              Código válido. Presioná &quot;Unirse&quot; para continuar.
            </div>
          )}

          {message && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {message}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setOpenModalJoin(false); setMessage(null); }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-[#1a2740]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmittingJoin || joinCode.length < 4}
              className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingJoin ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {isSubmittingJoin ? "Uniendo..." : "Unirse"}
            </button>
          </div>
        </form>
      </ModalWrapper>

      {/* Create modal */}
      <ModalWrapper
        open={openModalCreate}
        onClose={() => { setOpenModalCreate(false); setMessage(null); }}
      >
        <form onSubmit={handleCreateWorkspace}>
          {/* Preview */}
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#253245]">
            <div className="h-14 w-full" style={{ backgroundColor: selectedColor }} />
            <div className="px-4 py-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {nombre || "Nombre del espacio"}
              </h3>
              <p className="line-clamp-1 text-sm text-slate-500">
                {description || "Descripción del espacio de trabajo"}
              </p>
            </div>
          </div>

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
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
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
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
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
                      selectedColor === color ? "ring-2 ring-[#275D79] ring-offset-2 dark:ring-offset-[#141f33]" : ""
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
              onClick={() => { setOpenModalCreate(false); setMessage(null); }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-[#1a2740]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmittingCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingCreate ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {isSubmittingCreate ? "Creando..." : "Crear Espacio"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </section>
  );
}
