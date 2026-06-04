"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react";
import type { AssignmentResponse, AssignmentStatus } from "@/app/src/lib/api/assignments";
import { deleteAssignment, updateAssignment } from "@/app/src/lib/api/assignments";

type RubricFormItem = {
  id: string;
  name: string;
  weight: string;
  description: string;
};

type Props = {
  assignment: AssignmentResponse;
  isOpen: boolean;
  workspaceId: string | number;
  onClose: () => void;
  onUpdated: (assignment: AssignmentResponse) => void;
  onDeleted: () => void;
};

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now());
}

// se usa para agregar nueva rubrica, o cuando no hay rubricas
function createEmptyRubric(): RubricFormItem {
  return {
    id: createId(),
    name: "",
    weight: "",
    description: "",
  };
}

function toDatetimeLocal(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const timezoneOffset = parsed.getTimezoneOffset() * 60_000;
  return new Date(parsed.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

// extrae rubricas guardadas 
function getInitialRubrics(assignment: AssignmentResponse): RubricFormItem[] {
  const criteria = assignment.rubric?.criteria;

  // si no existen rubricas muestra una vacia
  if (!Array.isArray(criteria) || criteria.length === 0) {
    return [createEmptyRubric()];
  }

  return criteria.map((criterion) => {
    const item = criterion as Record<string, unknown>;

    return {
      id: createId(),
      name: typeof item.name === "string" ? item.name : "",
      weight: typeof item.weight === "number" ? String(item.weight) : "",
      description:
        typeof item.description === "string" ? item.description : "",
    };
  });
}

// extrae los archivos guardados
function getInitialAttachmentNames(assignment: AssignmentResponse) {
  const attachmentNames = assignment.settings?.attachmentNames;
  return Array.isArray(attachmentNames)
    ? attachmentNames.filter((item): item is string => typeof item === "string")
    : [];
}

// extrae el tamaño guardado
function getInitialMaxFileSize(assignment: AssignmentResponse) {
  const maxFileSizeMb = assignment.settings?.maxFileSizeMb;
  return typeof maxFileSizeMb === "number" ? String(maxFileSizeMb) : "50";
}

function getInitialAllowLate(assignment: AssignmentResponse) {
  const allowLateSubmissions = assignment.settings?.allowLateSubmissions;
  return typeof allowLateSubmissions === "boolean" ? allowLateSubmissions : true;
}

export default function  EditAssignmentModal({
  assignment,
  isOpen,
  workspaceId,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
  const [name, setName] = useState(assignment.name);
  const [description, setDescription] = useState(assignment.description ?? "");
  const [dueDate, setDueDate] = useState(() => toDatetimeLocal(assignment.dueDate));
  const [status, setStatus] = useState<AssignmentStatus>(assignment.status);
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(
    () => getInitialAllowLate(assignment),
  );
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(
    () => getInitialMaxFileSize(assignment),
  );
  const [attachmentNames, setAttachmentNames] = useState<string[]>(
    () => getInitialAttachmentNames(assignment),
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rubrics, setRubrics] = useState<RubricFormItem[]>(
    () => getInitialRubrics(assignment),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setName(assignment.name);
    setDescription(assignment.description ?? "");
    setDueDate(toDatetimeLocal(assignment.dueDate));
    setStatus(assignment.status);
    setAllowLateSubmissions(getInitialAllowLate(assignment));
    setMaxFileSizeMb(getInitialMaxFileSize(assignment));
    setAttachmentNames(getInitialAttachmentNames(assignment));
    setSelectedFiles([]);
    setRubrics(getInitialRubrics(assignment));
    setError(null);
  }, [assignment, isOpen]);

  const addRubric = () => {
    setRubrics((current) => [...current, createEmptyRubric()]);
  };

  const removeRubric = (rubricId: string) => {
    setRubrics((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== rubricId),
    );
  };

  const updateRubric = (
    rubricId: string,
    field: keyof Omit<RubricFormItem, "id">,
    value: string,
  ) => {
    setRubrics((current) =>
      current.map((item) =>
        item.id === rubricId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeAttachmentName = (fileName: string) => {
    setAttachmentNames((current) => current.filter((item) => item !== fileName));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const cleanRubrics = rubrics
        .map((item) => ({
          name: item.name.trim(),
          weight: Number(item.weight),
          description: item.description.trim(),
        }))
        .filter((item) => item.name || item.weight || item.description);

      const totalWeight = cleanRubrics.reduce(
        (total, item) => total + (Number.isFinite(item.weight) ? item.weight : 0),
        0,
      );

      if (!name.trim()) throw new Error("El nombre de la tarea es obligatorio");
      if (!dueDate) throw new Error("La fecha de finalización es obligatoria");
      if (cleanRubrics.length === 0) throw new Error("Debes crear al menos una rúbrica");
      if (cleanRubrics.some((item) => !item.name || item.weight <= 0)) {
        throw new Error("Cada rúbrica debe tener nombre y un peso mayor a 0");
      }
      if (totalWeight > 100) {
        throw new Error("La suma de los pesos de las rúbricas no puede superar 100%");
      }

      const updated = await updateAssignment(assignment.id, {
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
          attachmentNames: [
            ...attachmentNames,
            ...selectedFiles.map((file) => file.name),
          ],
        },
      });

      onUpdated(updated);
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo actualizar la tarea",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = () => {
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteAssignment(assignment.id);
      setIsDeleteModalOpen(false);
      onDeleted();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No se pudo eliminar la tarea",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-black/35 px-4 py-6">
      <button
        type="button"
        aria-label="Cerrar edición"
        className="absolute inset-0"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 text-slate-900 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mb-5 flex items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving || isDeleting}
            className="absolute left-0 rounded-full p-2 text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <ArrowLeft className="h-6 w-6" aria-hidden />
          </button>

          <h2 className="text-center text-xl font-bold text-slate-950">
            Editar Tarea
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-300 px-5 py-5 sm:px-7">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-800">
                Nombre de la tarea
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={3}
                maxLength={100}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm outline-none transition focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                maxLength={500}
                className="mt-2 h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm outline-none transition focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 sm:max-w-56"
              />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={allowLateSubmissions}
                  onChange={(event) => setAllowLateSubmissions(event.target.checked)}
                  className="h-4 w-4 accent-[#275D79]"
                />
                Habilitar entregas fuera de tiempo
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                Adjunta los archivos necesarios
              </p>

              {[...attachmentNames, ...selectedFiles.map((file) => file.name)].length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachmentNames.map((fileName) => (
                    <button
                      key={fileName}
                      type="button"
                      onClick={() => removeAttachmentName(fileName)}
                      className="rounded-md bg-slate-200 px-2.5 py-1 text-xs text-slate-700 transition hover:bg-slate-300"
                    >
                      {fileName} ×
                    </button>
                  ))}
                  {selectedFiles.map((file) => (
                    <span
                      key={`${file.name}-${file.size}`}
                      className="rounded-md bg-slate-200 px-2.5 py-1 text-xs text-slate-700"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              ) : null}

              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-sky-300 px-4 py-4 text-center transition hover:bg-sky-50">
                <Upload className="h-7 w-7 text-slate-400" aria-hidden />
                <span className="mt-1 text-sm text-slate-500">
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
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <label className="text-sm font-medium text-slate-800">
                  Tamaño límite para un archivo (opcional)
                </label>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
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
                  className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15"
                />
                <span className="text-sm text-slate-500">mb</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="max-w-lg text-base font-medium leading-snug text-slate-950">
                Establece rúbricas personalizadas para la calificación con
                Inteligencia Artificial
              </p>

              <button
                type="button"
                onClick={addRubric}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#275D79] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1f4a61]"
              >
                <span className="text-base leading-none">+</span>
                Crear nueva rúbrica
              </button>
            </div>

            <div className="space-y-6">
              {rubrics.map((rubricItem) => (
                <div
                  key={rubricItem.id}
                  className="grid gap-3 border-b border-slate-200 pb-6 sm:grid-cols-[2rem_1fr]"
                >
                  <button
                    type="button"
                    onClick={() => removeRubric(rubricItem.id)}
                    disabled={rubrics.length === 1}
                    aria-label="Eliminar rúbrica"
                    className="mt-8 flex h-8 w-8 items-center justify-center rounded-md text-[#275D79] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>

                  <div className="grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                      <label className="text-sm text-slate-800">
                        Nombre
                        <input
                          type="text"
                          value={rubricItem.name}
                          onChange={(event) =>
                            updateRubric(rubricItem.id, "name", event.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15"
                        />
                      </label>

                      <label className="text-sm text-slate-800">
                        Peso (importancia)
                        <input
                          type="number"
                          value={rubricItem.weight}
                          onChange={(event) =>
                            updateRubric(rubricItem.id, "weight", event.target.value)
                          }
                          min={0}
                          max={100}
                          placeholder="0% - 100%"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15"
                        />
                      </label>
                    </div>

                    <label className="text-sm text-slate-800">
                      Descripción de la rúbrica (opcional)
                      <textarea
                        value={rubricItem.description}
                        onChange={(event) =>
                          updateRubric(rubricItem.id, "description", event.target.value)
                        }
                        rows={3}
                        className="mt-1 w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <label className="block text-sm font-medium text-slate-800">
              Estado
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as AssignmentStatus)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15"
              >
                <option value="PUBLICADO">Publicado</option>
                <option value="BORRADOR">Borrador</option>
                <option value="CERRADO">Cerrado</option>
              </select>
            </label>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={openDeleteModal}
                disabled={isSaving || isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                {isDeleting ? "Eliminando..." : "Eliminar Tarea"}
              </button>
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#275D79] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden />
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-10000 flex min-h-screen items-center justify-center bg-black/45 px-4 py-6">
          <button
            type="button"
            aria-label="Cerrar confirmación"
            className="absolute inset-0"
            onClick={closeDeleteModal}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-assignment-title"
            className="relative flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" aria-hidden />
            </div>

            <h2
              id="delete-assignment-title"
              className="mt-4 text-center text-xl font-semibold text-slate-900"
            >
              ¿Eliminar esta tarea?
            </h2>

            <p className="mt-2 text-center text-sm text-slate-600">
              Vas a eliminar{" "}
              <span className="font-semibold text-slate-900">{assignment.name}</span>.
              Se borrarán sus entregas asociadas. Esta acción no se puede deshacer.
            </p>

            {error ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar tarea"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
