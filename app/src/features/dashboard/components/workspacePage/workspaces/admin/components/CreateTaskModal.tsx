"use client";

import { FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Loader2, Send, Trash2, Upload } from "lucide-react";
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
  const [gradingScale, setGradingScale] = useState("100");
  const [teacherInstructions, setTeacherInstructions] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rubrics, setRubrics] = useState<RubricFormItem[]>(() => [
    createEmptyRubric(),
    createEmptyRubric(),
  ]);

  const resetCreateTaskForm = () => {
    setName("");
    setDescription("");
    setDueDate("");
    setStatus("PUBLICADO");
    setAllowLateSubmissions(true);
    setMaxFileSizeMb("50");
    setGradingScale("100");
    setTeacherInstructions("");
    setSelectedFiles([]);
    setRubrics([createEmptyRubric(), createEmptyRubric()]);
    setErrorCreateTask(null);
  };

  const closeModal = () => {
    if (isSubmittingCreateTask) return;

    onClose();
    resetCreateTaskForm();
  };

  const addRubric = () => {
    setRubrics((currentRubrics) => [...currentRubrics, createEmptyRubric()]);
  };

  const removeRubric = (rubricId: string) => {
    setRubrics((currentRubrics) =>
      currentRubrics.length === 1
        ? currentRubrics
        : currentRubrics.filter((item) => item.id !== rubricId)
    );
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

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingCreateTask(true);
    setErrorCreateTask(null);

    try {
      // Trae solo las rúbricas, las formatea y elimina las que estén vacías
      const cleanRubrics = rubrics
        .map((item) => ({
          name: item.name.trim(),
          weight: Number(item.weight),
          description: item.description.trim(),
        }))
        .filter((item) => item.name || item.weight || item.description);

      // Suma de los pesos de las rúbricas
      const totalWeight = cleanRubrics.reduce(
        (total, item) => total + (Number.isFinite(item.weight) ? item.weight : 0),
        0
      );

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
        throw new Error("La suma de los pesos de las rúbricas no puede superar 100%");
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
          gradingScale: Number(gradingScale),
          teacherInstructions: teacherInstructions.trim() || undefined,
          attachments,
        },
      });

      onCreated(assignmentToAdminTask(assignment));
      onClose();
      resetCreateTaskForm();
    } catch (error) {
      setErrorCreateTask(
        error instanceof Error ? error.message : "No se pudo crear la tarea"
      );
    } finally {
      setIsSubmittingCreateTask(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Cerrar formulario"
        className="absolute inset-0"
        onClick={closeModal}
      />

      <form
        onSubmit={handleCreateTask}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 text-slate-900 shadow-2xl sm:p-6 dark:bg-[#0f1a2e] dark:text-slate-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mb-5 flex items-center justify-center">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmittingCreateTask}
            className="absolute left-0 rounded-full p-2 text-slate-900 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-[#1a2740]"
          >
            <ArrowLeft className="h-6 w-6" aria-hidden />
          </button>

          <h2 className="text-center text-xl font-bold text-slate-950 dark:text-slate-100">
            Crear tarea
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-300 px-5 py-5 sm:px-7 dark:border-[#253245]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Nombre de la tarea
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tel aviv impressed class"
                required
                minLength={3}
                maxLength={100}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder="Escribe una descripción para tu tarea"
                maxLength={500}
                className="mt-2 h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <label className="sr-only">Fecha de finalización</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 sm:max-w-56 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={allowLateSubmissions}
                  onChange={(event) =>
                    setAllowLateSubmissions(event.target.checked)
                  }
                  className="h-4 w-4 accent-[#275D79]"
                />
                Habilitar entregas fuera de tiempo
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Adjunta los archivos necesarios
              </p>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-sky-300 px-4 py-4 text-center transition hover:bg-sky-50 dark:border-sky-700 dark:hover:bg-sky-950/30">
                <Upload className="h-7 w-7 text-slate-400" aria-hidden />
                <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Arrastra archivos aquí o haz clic para subir
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
              {selectedFiles.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`}>{file.name}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Tamaño límite para un archivo (opcional)
                </label>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Si dejas este campo vacío, el tamaño límite de los archivos será
                  el que permita tu plan.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={maxFileSizeMb}
                  onChange={(event) => setMaxFileSizeMb(event.target.value)}
                  min={1}
                  className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">mb</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="max-w-lg text-base font-medium leading-snug text-slate-950 dark:text-slate-100">
                Establece rúbricas personalizadas para la calificación con
                Inteligencia Artificial
              </p>

              <button
                type="button"
                onClick={addRubric}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1f4a61]"
              >
                <span className="text-base leading-none">+</span>
                Crear nueva rúbrica
              </button>
            </div>

            <div className="space-y-6">
              {rubrics.map((rubricItem) => (
                <div
                  key={rubricItem.id}
                  className="grid gap-3 border-b border-slate-200 pb-6 sm:grid-cols-[2rem_1fr] dark:border-[#253245]"
                >
                  <button
                    type="button"
                    onClick={() => removeRubric(rubricItem.id)}
                    disabled={rubrics.length === 1}
                    aria-label="Eliminar rúbrica"
                    className="mt-8 flex h-8 w-8 items-center justify-center rounded-md text-[#275D79] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#1a2740]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>

                  <div className="grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                      <div>
                        <label className="text-sm text-slate-800 dark:text-slate-200">Nombre</label>
                        <input
                          type="text"
                          value={rubricItem.name}
                          onChange={(event) =>
                            updateRubric(
                              rubricItem.id,
                              "name",
                              event.target.value
                            )
                          }
                          placeholder="Value"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-800 dark:text-slate-200">
                          Peso (importancia)
                        </label>
                        <input
                          type="number"
                          value={rubricItem.weight}
                          onChange={(event) =>
                            updateRubric(
                              rubricItem.id,
                              "weight",
                              event.target.value
                            )
                          }
                          min={0}
                          max={100}
                          placeholder="0% - 100%"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-slate-800 dark:text-slate-200">
                        Descripción de la rúbrica (opcional)
                      </label>
                      <textarea
                        value={rubricItem.description}
                        onChange={(event) =>
                          updateRubric(
                            rubricItem.id,
                            "description",
                            event.target.value
                          )
                        }
                        rows={3}
                        placeholder="Descripción que permite a la Inteligencia Artificial entender mejor lo que se busca con la rúbrica"
                        className="mt-1 w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Escala de calificación
                </label>
                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                  La escala en la que la IA calificará (ej: 0.0 a 5.0 en Colombia)
                </p>
                <select
                  value={gradingScale}
                  onChange={(event) => setGradingScale(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                >
                  <option value="5">0.0 – 5.0</option>
                  <option value="10">0.0 – 10.0</option>
                  <option value="100">0 – 100</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Instrucciones para la IA (opcional)
                </label>
                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                  Instrucciones adicionales que la IA usará al calificar
                </p>
                <textarea
                  value={teacherInstructions}
                  onChange={(event) => setTeacherInstructions(event.target.value)}
                  rows={3}
                  placeholder="Ej: Penalizar con 1.0 si no hay proceso escrito"
                  className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Estado</label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as AssignmentStatus)
                }
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200"
              >
                <option value="PUBLICADO">Publicado</option>
                <option value="BORRADOR">Borrador</option>
              </select>
            </div>

            {errorCreateTask ? (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {errorCreateTask}
              </p>
            ) : null}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmittingCreateTask}
                className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden />
                {isSubmittingCreateTask && selectedFiles.length > 0 ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subiendo archivos...
                  </>
                ) : isSubmittingCreateTask ? "Creando..." : "Crear Tarea"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}
