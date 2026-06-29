"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Loader2,
  Send,
  Trash2,
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  GripVertical,
} from "lucide-react";
import {
  createAssignment,
  type AssignmentStatus,
} from "@/app/src/lib/api/assignments";
import { uploadFile } from "@/app/src/lib/api/media";
import type { WorkspaceAdminTask } from "../../../data/workspace";
import { assignmentToAdminTask } from "../utils/assignment-mappers";

type RubricFormItem = {
  id: string;
  name: string;
  weight: string;
  description: string;
};

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (task: WorkspaceAdminTask) => void;
  workspaceId: string | number;
};

function createEmptyRubric(): RubricFormItem {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    name: "",
    weight: "",
    description: "",
  };
}

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-[3px] focus:ring-[#275D79]/10 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:bg-[#0f1a2e]";

export default function CreateTaskModal({
  isOpen,
  onClose,
  onCreated,
  workspaceId,
}: CreateTaskModalProps) {
  const [errorCreateTask, setErrorCreateTask] = useState<string | null>(null);
  const [isSubmittingCreateTask, setIsSubmittingCreateTask] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<AssignmentStatus>("PUBLICADO");
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);
  const [maxFileSizeMb, setMaxFileSizeMb] = useState("50");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rubrics, setRubrics] = useState<RubricFormItem[]>(() => [
    createEmptyRubric(),
    createEmptyRubric(),
  ]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [closing, setClosing] = useState(false);
  const [removingRubrics, setRemovingRubrics] = useState<Set<string>>(new Set());
  const [animatingIn, setAnimatingIn] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      requestAnimationFrame(() => setAnimatingIn(true));
    }
  }, [isOpen]);

  const totalWeight = rubrics.reduce((sum, r) => {
    const w = parseFloat(r.weight);
    return sum + (Number.isFinite(w) ? w : 0);
  }, 0);

  const weightError =
    rubrics.filter((r) => r.name.trim()).length > 0 && totalWeight > 100
      ? `Los pesos suman ${totalWeight}%, máximo 100%`
      : null;

  const weightWarning =
    !weightError &&
    rubrics.filter((r) => r.name.trim()).length > 0 &&
    totalWeight < 100
      ? `Los pesos suman ${totalWeight}% (recomendado: 100%)`
      : null;

  const resetCreateTaskForm = () => {
    setName("");
    setDescription("");
    setDueDate("");
    setStatus("PUBLICADO");
    setAllowLateSubmissions(true);
    setMaxFileSizeMb("50");
    setSelectedFiles([]);
    setRubrics([createEmptyRubric(), createEmptyRubric()]);
    setErrorCreateTask(null);
  };

  const triggerClose = () => {
    if (isSubmittingCreateTask) return;
    setClosing(true);
    setAnimatingIn(false);
    setTimeout(() => {
      onClose();
      resetCreateTaskForm();
    }, 200);
  };

  const handleEsc = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") triggerClose();
  };

  const addRubric = () => {
    setRubrics((currentRubrics) => [...currentRubrics, createEmptyRubric()]);
  };

  const removeRubric = (rubricId: string) => {
    if (rubrics.length === 1) return;
    setRemovingRubrics((prev) => new Set(prev).add(rubricId));
    setTimeout(() => {
      setRubrics((currentRubrics) =>
        currentRubrics.filter((item) => item.id !== rubricId)
      );
      setRemovingRubrics((prev) => {
        const next = new Set(prev);
        next.delete(rubricId);
        return next;
      });
    }, 200);
  };

  const updateRubric = (
    rubricId: string,
    field: keyof Omit<RubricFormItem, "id">,
    value: string
  ) => {
    setRubrics((currentRubrics) =>
      currentRubrics.map((item) =>
        item.id === rubricId ? { ...item, [field]: value } : item
      )
    );
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingCreateTask(true);
    setErrorCreateTask(null);

    try {
      const cleanRubrics = rubrics
        .map((item) => ({
          name: item.name.trim(),
          weight: Number(item.weight),
          description: item.description.trim(),
        }))
        .filter((item) => item.name || item.weight || item.description);

      if (!name.trim()) {
        throw new Error("El nombre de la tarea es obligatorio");
      }

      if (!dueDate) {
        throw new Error("La fecha de finalización es obligatoria");
      }

      if (cleanRubrics.length === 0) {
        throw new Error("Debes crear al menos una rúbrica");
      }

      if (cleanRubrics.some((item) => !item.name || item.weight <= 0)) {
        throw new Error("Cada rúbrica debe tener nombre y un peso mayor a 0");
      }

      if (totalWeight > 100) {
        throw new Error(
          `La suma de los pesos de las rúbricas no puede superar 100% (actual: ${totalWeight}%)`
        );
      }

      let attachments: Array<{ name: string; size: number; type: string; mediaId: string }> = [];
      if (selectedFiles.length > 0) {
        attachments = await Promise.all(
          selectedFiles.map(async (file) => {
            const result = await uploadFile(file);
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              mediaId: result.media.id,
            };
          }),
        );
      }

      const assignment = await createAssignment({
        workspaceId: Number(workspaceId),
        name: name.trim(),
        description: description.trim(),
        dueDate: new Date(dueDate).toISOString(),
        status,
        rubric: {
          criteria: cleanRubrics,
          totalWeight,
        },
        settings: {
          allowLateSubmissions,
          maxFileSizeMb: Number(maxFileSizeMb),
          attachments,
        },
      });

      onCreated(assignmentToAdminTask(assignment));
      triggerClose();
    } catch (error) {
      setErrorCreateTask(
        error instanceof Error ? error.message : "No se pudo crear la tarea"
      );
    } finally {
      setIsSubmittingCreateTask(false);
    }
  };

  if (!isOpen) return null;

  const weightPercent = Math.min(totalWeight, 100);
  const weightColor =
    totalWeight === 100
      ? "bg-emerald-500"
      : totalWeight > 100
        ? "bg-red-500"
        : "bg-amber-500";

  return createPortal(
    <div
      ref={overlayRef}
      onKeyDown={handleEsc}
      tabIndex={-1}
      className={`fixed inset-0 z-[9999] flex min-h-screen items-center justify-center px-4 py-6 transition-all duration-300 ${
        animatingIn
          ? "bg-black/50 backdrop-blur-sm"
          : "bg-transparent backdrop-blur-none"
      }`}
    >
      <button
        type="button"
        aria-label="Cerrar formulario"
        className="absolute inset-0"
        onClick={triggerClose}
      />

      <form
        onSubmit={handleCreateTask}
        className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl shadow-black/10 transition-all duration-300 sm:p-7 dark:bg-[#0f1a2e] dark:shadow-black/30 ${
          animatingIn
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={triggerClose}
            disabled={isSubmittingCreateTask}
            className="absolute left-0 rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-[#1a2740] dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Crear tarea
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Completá los campos para crear una nueva tarea
            </p>
          </div>
        </div>

        {/* Form sections */}
        <div className="space-y-6">
          {/* Basic info section */}
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-[#253245]">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Información general
            </h3>

            <div className="space-y-4">
              <div className="group">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nombre de la tarea
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej: Introducción a Python"
                  required
                  minLength={3}
                  maxLength={100}
                  className={`mt-1.5 ${INPUT_CLASS}`}
                />
              </div>

              <div className="group">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder="Describí el objetivo y alcance de la tarea"
                  maxLength={500}
                  className={`mt-1.5 h-24 resize-none ${INPUT_CLASS}`}
                />
              </div>

              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Fecha de finalización
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    required
                    className={`mt-1.5 ${INPUT_CLASS} max-w-60`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <div className="relative inline-flex h-6 w-11 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={allowLateSubmissions}
                      onChange={(event) =>
                        setAllowLateSubmissions(event.target.checked)
                      }
                      className="peer sr-only"
                      id="late-toggle"
                    />
                    <label htmlFor="late-toggle" className="absolute inset-0 cursor-pointer">
                      <span className="block h-6 w-11 rounded-full bg-slate-300 transition-colors duration-200 peer-checked:bg-[#275D79] dark:bg-slate-600" />
                      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 peer-checked:translate-x-5" />
                    </label>
                  </div>
                  <label htmlFor="late-toggle" className="cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                    Entregas fuera de tiempo
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Files section */}
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-[#253245]">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Archivos adjuntos
            </h3>

            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-[#275D79] bg-[#275D79]/5 scale-[1.02]"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-[#0a1424]"
              }`}
            >
              <div className={`rounded-xl p-3 transition-colors ${
                isDragOver ? "bg-[#275D79]/10" : "bg-slate-100 dark:bg-[#0a1424]"
              }`}>
                <Upload className={`h-6 w-6 transition-colors ${
                  isDragOver ? "text-[#275D79]" : "text-slate-400"
                }`} aria-hidden />
              </div>
              <span className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                {isDragOver ? "Soltá los archivos aquí" : "Arrastrá archivos o hacé clic"}
              </span>
              <span className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                PDF, imágenes, documentos — cualquier formato
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(event) =>
                  setSelectedFiles(Array.from(event.target.files ?? []))
                }
              />
            </label>

            {selectedFiles.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {selectedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 transition-all dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-400"
                  >
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="shrink-0 text-slate-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="shrink-0 rounded-md p-1 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={maxFileSizeMb}
                  onChange={(event) => setMaxFileSizeMb(event.target.value)}
                  min={1}
                  className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm outline-none transition-all focus:border-[#275D79] focus:ring-[3px] focus:ring-[#275D79]/10 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">MB por archivo</span>
              </div>
            </div>
          </div>

          {/* Status section */}
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-[#253245]">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Estado de publicación
            </h3>

            <div className="flex gap-2">
              {(["PUBLICADO", "BORRADOR"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    status === opt
                      ? "bg-[#275D79] text-white shadow-sm"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-400 dark:hover:bg-[#1a2740]"
                  }`}
                >
                  {opt === "PUBLICADO" ? "Publicado" : "Borrador"}
                </button>
              ))}
            </div>
          </div>

          {/* Rubrics section */}
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-[#253245]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Rúbricas de calificación
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Definí los criterios para la calificación con IA
                </p>
              </div>

              {rubrics.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${weightColor}`}
                      style={{ width: `${weightPercent}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium tabular-nums ${
                    totalWeight === 100
                      ? "text-emerald-600 dark:text-emerald-400"
                      : totalWeight > 100
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-600 dark:text-amber-400"
                  }`}>
                    {totalWeight}%
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={addRubric}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:border-[#275D79] hover:text-[#275D79] hover:bg-[#275D79]/5 dark:border-slate-600 dark:text-slate-400 dark:hover:border-[#275D79] dark:hover:text-[#275D79]"
            >
              <Plus className="h-4 w-4" />
              Agregar criterio
            </button>

            <div className="space-y-3">
              {rubrics.map((rubricItem, index) => (
                <div
                  key={rubricItem.id}
                  className={`rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 dark:border-[#253245] dark:bg-[#0a1424]/50 ${
                    removingRubrics.has(rubricItem.id)
                      ? "scale-95 opacity-0"
                      : ""
                  }`}
                  style={{
                    animation: rubrics.length > 2
                      ? `rubricFadeIn 0.3s ease-out ${index * 0.05}s both`
                      : undefined,
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Criterio {index + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRubric(rubricItem.id)}
                      disabled={rubrics.length === 1}
                      className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">Nombre</label>
                      <input
                        type="text"
                        value={rubricItem.name}
                        onChange={(event) =>
                          updateRubric(rubricItem.id, "name", event.target.value)
                        }
                        placeholder="Ej: Calidad del código"
                        className={`mt-1 ${INPUT_CLASS} py-2.5`}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Peso %
                      </label>
                      <input
                        type="number"
                        value={rubricItem.weight}
                        onChange={(event) =>
                          updateRubric(rubricItem.id, "weight", event.target.value)
                        }
                        min={0}
                        max={100}
                        placeholder="0"
                        className={`mt-1 ${INPUT_CLASS} py-2.5 text-center`}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      Descripción <span className="text-slate-400">(opcional)</span>
                    </label>
                    <textarea
                      value={rubricItem.description}
                      onChange={(event) =>
                        updateRubric(rubricItem.id, "description", event.target.value)
                      }
                      rows={2}
                      placeholder="Descripción para que la IA entienda mejor el criterio"
                      className={`mt-1 resize-none ${INPUT_CLASS} py-2.5 text-xs`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {weightError && (
              <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {weightError}
              </p>
            )}
            {weightWarning && (
              <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {weightWarning}
              </p>
            )}
          </div>

          {/* Error message */}
          {errorCreateTask && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm dark:border-red-800 dark:bg-red-950/60 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorCreateTask}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={triggerClose}
              disabled={isSubmittingCreateTask}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-[#1a2740]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmittingCreateTask}
              className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1f4a61] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
            >
              {isSubmittingCreateTask ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {selectedFiles.length > 0 ? "Subiendo archivos..." : "Creando..."}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Crear Tarea
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style jsx global>{`
        @keyframes rubricFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
