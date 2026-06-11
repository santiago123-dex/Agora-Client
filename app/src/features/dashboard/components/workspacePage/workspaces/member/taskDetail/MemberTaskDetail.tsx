"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Clock, FileText, Paperclip, Send, Upload, X } from "lucide-react";
import { getAssignmentById, type AssignmentResponse } from "@/app/src/lib/api/assignments";
import { getMySubmissionByAssignment, createSubmission, deleteSubmission, type SubmissionResponse, type CreateSubmissionPayload } from "@/app/src/lib/api/submissions";

type Props = {
  workspaceId: string;
  taskId: string;
};

function formatDueDate(dueDate: string) {
  return new Date(dueDate).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MemberTaskDetail({ workspaceId, taskId }: Props) {
  const router = useRouter();
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deliveryText, setDeliveryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [assignmentData, submissionData] = await Promise.all([
          getAssignmentById(taskId),
          getMySubmissionByAssignment(taskId).catch(() => null),
        ]);

        if (!active) return;
        setAssignment(assignmentData);
        setSubmission(submissionData);

        if (submissionData?.content?.text) {
          setDeliveryText(submissionData.content.text as string);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar la tarea");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [taskId]);

  const hasContent = deliveryText.trim().length > 0;
  const isSubmitted = Boolean(submission);
  const isGraded = Boolean(submission?.result);
  const isExpiredOrClosed = assignment?.isExpired || assignment?.status === "CERRADO";

  const handleSubmit = async () => {
    if (!assignment || !hasContent || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: CreateSubmissionPayload = {
        assignmentId: Number(assignment.id),
        content: { text: deliveryText.trim() },
        files: {
          attachments: selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        },
      };

      const result = await createSubmission(payload);
      setSubmission(result);
      setSelectedFiles([]);
      setShowCancelConfirm(false);
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo enviar la entrega");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!submission || isCancelling) return;

    setIsCancelling(true);
    try {
      await deleteSubmission(submission.id);
      setSubmission(null);
      setDeliveryText("");
      setSelectedFiles([]);
      setShowCancelConfirm(false);
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo cancelar la entrega");
    } finally {
      setIsCancelling(false);
    }
  };

  const rubricCriteria = assignment?.rubric?.criteria as Array<{ name: string; weight: number; description?: string }> | undefined;
  const settings = assignment?.settings as Record<string, unknown> | undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8]">
        <p className="text-sm text-slate-500">Cargando tarea...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8]">
        <p className="text-sm text-red-600">{error ?? "Tarea no encontrada"}</p>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8] px-4 py-6 sm:px-7">
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/workspace/${workspaceId}?from=workspace`)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al workspace
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{assignment.name}</h1>
            <p className="mt-2 text-base leading-relaxed text-slate-600">{assignment.description}</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDueDate(assignment.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {isExpiredOrClosed ? "Vencida" : "Abierta"}
            </span>
          </div>

          {rubricCriteria && rubricCriteria.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800">Rúbrica de evaluación</h3>
              <div className="mt-2 space-y-2">
                {rubricCriteria.map((criterion, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">{criterion.name}</span>
                      <span className="text-sm font-semibold text-[#275D79]">{criterion.weight}%</span>
                    </div>
                    {criterion.description ? (
                      <p className="mt-0.5 text-xs text-slate-500">{criterion.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {settings ? (
            <div className="mt-4 text-xs text-slate-400">
              {settings.allowLateSubmissions ? "Entregas fuera de tiempo: permitidas" : "Entregas fuera de tiempo: no permitidas"}
              {settings.maxFileSizeMb ? ` · Tamaño máximo: ${settings.maxFileSizeMb} MB` : null}
            </div>
          ) : null}
        </div>

        {isGraded && submission?.result ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-800">Calificación</h2>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {(() => {
                const r = submission.result as Record<string, unknown>;
                const teacher = r.teacher as Record<string, unknown> | undefined;
                const ai = r.ai as Record<string, unknown> | undefined;
                const score = teacher?.score ?? ai?.score ?? r.grade ?? r.score;
                return typeof score === "number" ? `${score}%` : "—";
              })()}
            </p>
            {(() => {
              const r = submission.result as Record<string, unknown>;
              const teacher = r.teacher as Record<string, unknown> | undefined;
              const feedback = teacher?.feedback as string | undefined;
              return feedback ? (
                <p className="mt-2 text-sm text-emerald-700">{feedback}</p>
              ) : null;
            })()}
          </div>
        ) : isSubmitted && !showCancelConfirm ? (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-800">Tu entrega</h2>
                <p className="mt-1 text-sm text-blue-600">
                  Entregada el {submission?.createdAt ? new Date(submission.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1 text-sm font-medium text-blue-700">
                <Check className="h-4 w-4" />
                Entregada
              </span>
            </div>

            {submission?.content?.text ? (
              <div className="mt-4 rounded-xl border border-blue-100 bg-white px-4 py-3">
                <p className="whitespace-pre-wrap text-sm text-slate-700">{submission.content.text as string}</p>
              </div>
            ) : null}

            {submission?.files?.attachments && Array.isArray(submission.files.attachments) && (submission.files.attachments as Array<{ name: string; size: number }>).length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-medium text-blue-600">Archivos adjuntos</p>
                <div className="mt-1 space-y-1">
                  {(submission.files.attachments as Array<{ name: string; size: number }>).map((file) => (
                    <div key={file.name} className="flex items-center gap-2 text-xs text-slate-600">
                      <Paperclip className="h-3 w-3" />
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => { setDeliveryText(submission?.content?.text as string ?? ""); setShowCancelConfirm(true); }}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
              >
                Re-enviar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                {isCancelling ? "Cancelando..." : "Cancelar entrega"}
              </button>
            </div>

            {submitError ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
            ) : null}
          </div>
        ) : null}

        {!isSubmitted || showCancelConfirm ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              {isGraded || isExpiredOrClosed ? "Tarea cerrada" : showCancelConfirm ? "Re-enviar tarea" : "Entregar tarea"}
            </h2>

            {isGraded || isExpiredOrClosed ? (
              <p className="mt-2 text-sm text-slate-500">
                {isGraded ? "Esta tarea ya ha sido calificada y no acepta más entregas." : "Esta tarea ya ha vencido y no acepta más entregas."}
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-slate-500">{showCancelConfirm ? "Modifica tu respuesta y vuelve a enviar." : "Escribe tu respuesta para esta tarea."}</p>

                  <div className="mt-4 space-y-4">
                    <textarea
                      value={deliveryText}
                      onChange={(e) => setDeliveryText(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Escribe tu respuesta aquí..."
                      rows={6}
                      className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-4 focus:ring-[#275D79]/10"
                    />

                    <div>
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-sky-300 px-4 py-3 text-sm text-slate-500 transition hover:bg-sky-50">
                        <Upload className="h-5 w-5" />
                        Adjuntar archivos
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                        />
                      </label>
                      {selectedFiles.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {selectedFiles.map((file) => (
                            <li key={`${file.name}-${file.size}`} className="flex items-center gap-2 text-xs text-slate-500">
                              <Paperclip className="h-3 w-3" />
                              {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!hasContent || isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(39,93,121,0.24)] transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:bg-[#7ba2b4] disabled:shadow-none"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Enviando..." : "Enviar entrega"}
                    </button>
                    {showCancelConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Mantener entrega actual
                      </button>
                    ) : null}
                  </div>
                </div>

                {submitError ? (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
