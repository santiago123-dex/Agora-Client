"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, UserRound } from "lucide-react";
import { createWorkspace, joinWorkspace } from "@/app/src/lib/api/workspaces";

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

const currentAccount = {
  name: "Santiago Fajardo Morales",
  email: "santiago@gmail.com",
};

export default function DashboardHeader() {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalJoin, setOpenModalJoin] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [nombre, setNombre] = useState("");
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refreshDashboard = () => {
    window.location.reload();
  };

  const handleCreateWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    //previene recargar de pagina
    event.preventDefault();
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  const handleJoinWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await joinWorkspace(joinCode.trim());
      setJoinCode("");
      setOpenModalJoin(false);
      refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo unir al workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full px-4 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold sm:text-3xl">Bienvenido de vuelta</h2>
          <p className="text-gray-500">Aqui tienes un resumen de tu actividad</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setOpenModalJoin(true)}
            className="inline-flex items-center gap-2 rounded-md border border-[#d1d1d1] px-4 py-2 font-medium transition hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></svg>
            Unirse
          </button>
          <button
            onClick={() => setOpenModalCreate(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#275D79] bg-[#275D79] px-4 py-2 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            Crear Espacio
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      ) : null}

      {openModalJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
          <form
            onSubmit={handleJoinWorkspace}
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-4 shadow-lg sm:p-6"
          >
            <div className="relative mb-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setOpenModalJoin(false)}
                className="absolute left-0 rounded-full p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-6 w-6 text-black" />
              </button>
              <h2 className="text-center text-xl font-medium">Unirse a un espacio</h2>
            </div>

            <div className="mt-4 flex w-full flex-col items-center justify-center">
              <div className="w-full rounded-md bg-[#eee] p-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="flex flex-col items-start justify-center p-2 sm:p-4">
                    <div className="text-lg font-medium">
                      <h2>Ingresa el codigo del espacio</h2>
                    </div>
                    <div className="mb-1 mt-1 w-full">
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                        placeholder="HUYS1190"
                        className="mt-2 w-full rounded-lg border border-[#d0d0d0] px-3 py-2 text-center focus:outline-none"
                        required
                      />
                    </div>
                    <div className="mt-3 flex w-full justify-start">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded border border-[#275D79] bg-[#275D79] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:justify-start"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        {isSubmitting ? "Uniendo..." : "Unirse al espacio"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 sm:p-4">
                    <div className="mb-3 w-full">
                      <h2 className="text-center text-[20px] font-semibold text-[#1c1c1c]">Cuenta actual</h2>
                    </div>

                    <div className="flex w-full flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#10C78B]">
                        <UserRound className="h-7 w-7 text-[#4b4b4b]" strokeWidth={2.2} />
                      </div>

                      <div className="flex flex-col justify-center">
                        <h3 className="text-[18px] font-semibold leading-6 text-[#1c1c1c]">
                          {currentAccount.name}
                        </h3>
                        <p className="mt-1 text-[14px] text-[#c4c4c4]">{currentAccount.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-4 w-full rounded-xl bg-[#dddddd] px-4 py-3 text-[16px] font-semibold text-[#1c1c1c] transition-colors hover:bg-[#d3d3d3]"
                    >
                      Cambiar de cuenta
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full">
                <p className="max-w-3xl text-[14px] text-[#838383]">
                  Para ingresar a un espacio de trabajo debes pedir el código del espacio a tu profesor.
                  El código no debe tener simbolos ni espacios.
                </p>
              </div>
            </div>
          </form>
        </div>
      )}

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
                  <h3 className="text-lg font-semibold">{nombre || "Nombre del espacio"}</h3>
                  <p className="mb-2">{description || "Descripción del espacio de trabajo"}</p>
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
                    className={`h-8 w-8 rounded-md border-2 ${selectedColor === color ? "border-blue-500" : "border-transparent"}`}
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
    </section>
  );
}
