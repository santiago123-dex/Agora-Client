"use client";
import { useState } from "react";
import { adminWorkspaces, memberWorkspaces } from "../data/workspace";
import Link from "next/link";
import { ArrowLeft, Copy } from "lucide-react";

const colors = [
  "#EAB308",
  "#84CC16",
  "#10B981",
  "#DC2626",
  "#2563EB",
  "#0EA5E9",
  "#A21CAF",
  "#EC4899",
]

const invitacionCode = "HJK3-02P7"

export default function WorkspacesPage() {
  const [showCreatedWorkspaces, setShowCreatedWorkspaces] = useState(true);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [nombre, setNombre] = useState("");
  const [selectedColor, setSelectedColor] = useState("#48f");
  const [description, setDescription] = useState("");
  const [copied, SetCopied] = useState(false);

  const handleCopy = async () => {
    try{
      await navigator.clipboard.writeText(invitacionCode);
      SetCopied(true)
      setTimeout(() => SetCopied(false), 2000);
    }catch(error){
      console.log("No se pudo copuar el codigo", error)
    }
  }


  const workspacesToDisplay = showCreatedWorkspaces
    ? adminWorkspaces
    : memberWorkspaces;

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">

            {/*Boton de cambiar de espacio*/}
            <button
              type="button"
              aria-label={showCreatedWorkspaces ? "Mis espacios" : "Espacios donde soy miembro"}
              aria-pressed={showCreatedWorkspaces}
              onClick={() => setShowCreatedWorkspaces((prev) => !prev)}
              className={`relative flex h-6 w-11 items-center rounded-full px-1 shadow-sm transition-colors ${showCreatedWorkspaces ? "justify-start bg-[#0E6174]" : "justify-end bg-slate-300"
                }`}
            >
              <span className="h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {showCreatedWorkspaces ? "Mis espacios" : "Espacios donde soy miembro"}
            </span>
          </div>

          {/*Boton de crear espacio*/}
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
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-4 shadow-lg sm:p-6">
                <div className="mb-4 flex items-center justify-center relative">
                  <button
                    onClick={() => setOpenModalCreate(false)}
                    className="absolute left-0 rounded-full p-2 hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-6 w-6 text-black" />
                  </button>
                  <h2 className="text-xl font-medium text-center ">Crear espacio</h2>
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
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Nombre del espacio"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-[#eee] px-3 py-2 focus:outline-none"
                    />
                    <label>Descripción</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Escribe la descripcion para tu espacio de trabajo"
                      className="h-20 w-full rounded-lg border border-gray-300 bg-[#eee] px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-3 flex-wrap">
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

                  <div className="relative mt-4 rounded-lg border border-gray-300 bg-[#eee] p-3">
                    <button
                      type="button"
                      className="absolute right-3 top-3 rounded-full p-2 hover:bg-gray-100"
                      onClick={handleCopy}
                    >
                      <Copy className="h-5 w-5 text-black" />
                    </button>
                    {copied && (
                      <span className="absolute right-3 top-14 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Código copiado
                      </span>
                    )}
                    <div className="flex w-full flex-col gap-2 pr-10 sm:pr-12">
                      <h3 className="font-semibold">Código de invitación</h3>
                      <input
                        type="text"
                        value={invitacionCode ?? ""}
                        readOnly
                        placeholder="HUYS-1190"
                        className="w-full rounded-lg border border-[#d0d0d0] p-3 focus:outline-none sm:max-w-xs"
                        required
                      />
                      <p className="text-[13px] text-gray-500">Comparte este código para unir usuarios al espacio de trabajo</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-start gap-2">
                    <button className="flex items-center justify-center gap-2 rounded border border-[#275D79] bg-[#275D79] px-3 py-2 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                      Crear Espacio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {workspacesToDisplay.map((workspace) => (
            <Link href={`/dashboard/workspace/${workspace.id}?from=workspace`} key={workspace.id}>
              <article

                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              >
                <div
                  className="flex min-h-17 items-end justify-between gap-3 px-3 pb-3"
                  style={{ backgroundColor: workspace.accentColor }}
                >
                  <span className="rounded-sm bg-white/18 px-2 py-0.5 text-[0.62rem] font-medium text-white backdrop-blur-sm">
                    {workspace.roleLabel}
                  </span>

                  {workspace.statusLabel ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[0.62rem] font-medium ${workspace.statusVariant === "done"
                        ? "bg-white text-[#1A936F]"
                        : "bg-white text-slate-700"
                        }`}
                    >
                      {workspace.statusVariant === "done" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
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
          ))}
        </div>
      </div>
    </section>
  );
}
