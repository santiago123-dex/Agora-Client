"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleX,
  Clock,
  Copy,
  FileText,
  Paperclip,
  Send,
  Upload,
  X,
} from "lucide-react";

import type { MemberWorkspace, WorkspaceMemberTask } from "../../data/workspace";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
  workspace: MemberWorkspace;
}

export default function WorkspaceMember({ workspace }: Props) {

  const [copied, setCopied] = useState(false);
  const [submit, setSubmit] = useState(false);
  //guarda los datos de la tarea que el usuario hizo click
  const [selectedTask, setSelectedTask] = useState<WorkspaceMemberTask | null>(null);
  //Guarda lo que se escribe en el textarea del modal 
  const [deliveryText, setDeliveryText] = useState("");
  //Guarda los archivos seleccionados por el usuario, empieza vacio
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  //Referencia al input de archivos
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stats = workspace.memberStats;
  const code = workspace.inviteCode ?? "-";
  const tasks = workspace.memberTask ?? [];

  //Verificamos si el usuario agrego texto o archivo para habilitar el boton de enviar
  const hasDeliveryContent =
    deliveryText.trim().length > 0 || attachedFiles.length > 0;

  // UseMemo se usa para guardar un calculo
  //Se ejecuta cada que attachedFiles cambia, osea si se agrega un nuevo archivo o se elimina uno
  const attachedFilesLabel = useMemo(
    () =>
      attachedFiles.map((file) => ({
        name: file.name,
        size:
          //compara para usar el condicional
          file.size >= 1024 * 1024
          //si es mayor a 1MB, pasa por aca
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.max(1, Math.round(file.size / 1024))} KB`,
      })),
    [attachedFiles]
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const resetSubmitModal = () => {
    setSubmit(false);
    setSelectedTask(null);
    setDeliveryText("");
    setAttachedFiles([]);
  };

  // Cada que cambie el input de archivos, se ejecuta esta funcion
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //Convierte el input en un array, event.target.files es un FileList que trae los archivos seleccionados
    const files = Array.from(event.target.files ?? []);
    //Si no hay archivos, no hace nada
    if (files.length === 0) return;


    //Agrega los archivos al estado
    //el prev es el estado anterior de attachedFiles
    setAttachedFiles((prev) => {
      //Crea un set con los archivos existentes, para evitar duplicados
      const existing = new Set(prev.map((file) => `${file.name}-${file.size}`));
      //Filtra los archivos que no existen
      const nextFiles = files.filter(
        (file) => !existing.has(`${file.name}-${file.size}`)
      );
      return [...prev, ...nextFiles];
    });

    //Limpia el input
    event.target.value = "";
  };

  // Elimina un archivo del estado
  const removeFile = (fileName: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  //Obtiene los parametros de la busqueda, para saber desde donde viene el usuario
  const searchParams = useSearchParams();
  //Obtiene el parametro "from" 
  const from = searchParams.get("from");

  //Define la ruta a la que se debe volver
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
        <div className="mt-6 inline-flex w-full rounded-2xl border border-slate-200/80 bg-white/95 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:w-auto">
          <button
            type="button"
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition sm:flex-none`}
          >
            <FileText className="h-4 w-4" aria-hidden />
            Tareas
          </button>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-6xl">
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

                {task.actionLabel ? (
                  <div className="mt-auto px-5 pb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTask(task);
                        setSubmit(true);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f5a73] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(31,90,115,0.25)] transition hover:bg-[#184a5f]"
                    >
                      <Upload className="h-4 w-4" aria-hidden />
                      {task.actionLabel}
                    </button>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </div>
      {submit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-[2px]"
          onClick={resetSubmitModal}
        >
          <div
            className="w-full max-w-[570px] rounded-[26px] border border-[#d7d7d7] bg-white px-5 py-5 shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:px-6 sm:py-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="pr-4">
                <h2 className="text-[1.65rem] font-semibold leading-tight text-[#171717]">
                  Entregar: {selectedTask?.title ?? "tarea"}
                </h2>
                <p className="mt-1 text-base text-[#9a9a9a]">
                  Escribe tu respuesta o sube tus archivos para esta tarea.
                </p>
              </div>
              <button
                type="button"
                onClick={resetSubmitModal}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="sr-only">Respuesta de la entrega</span>
                <textarea
                  value={deliveryText}
                  onChange={(event) => setDeliveryText(event.target.value)}
                  placeholder="Escribe tu respuesta aqui"
                  className="min-h-[114px] w-full resize-none rounded-2xl border border-[#cdcdcd] px-5 py-4 text-base text-slate-700 outline-none transition placeholder:text-[#a0a0a0] focus:border-[#275D79] focus:ring-4 focus:ring-[#275D79]/10"
                />
              </label>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {/*Cuando le demos click en el boton se va a ejecutar el input oculto*/}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[84px] w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d4d4d4] px-4 py-6 text-center text-lg text-[#939393] transition hover:border-[#275D79]/40 hover:bg-slate-50"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Upload className="h-5 w-5" />
                </span>
                <span className="text-base sm:text-[1.05rem]">
                  Arrastra archivos aqui o haz clic para subir
                </span>
              </button>

              {attachedFilesLabel.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Paperclip className="h-4 w-4" />
                    Archivos seleccionados
                  </div>
                  <div className="mt-3 space-y-2">
                    {attachedFilesLabel.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">{file.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.name)}
                          className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
                          aria-label={`Quitar ${file.name}`}
                        >
                          <CircleX className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetSubmitModal}
                className="inline-flex min-w-[126px] items-center justify-center rounded-xl border border-[#d0d0d0] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!hasDeliveryContent}
                className="inline-flex min-w-[148px] items-center justify-center gap-2 rounded-xl bg-[#275D79] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(39,93,121,0.24)] transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:bg-[#7ba2b4] disabled:shadow-none"
              >
                {hasDeliveryContent ? (
                  <Send className="h-4 w-4" aria-hidden />
                ) : (
                  <Check className="h-4 w-4" aria-hidden />
                )}
                Enviar entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
