"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Clock, Eye, Paperclip, Send, Upload, X, AlertTriangle, AlertCircle, Award, ListChecks, RotateCcw } from "lucide-react";
import { getAssignmentById, type AssignmentResponse } from "@/app/src/lib/api/assignments";
import { getMySubmissionByAssignment, createSubmission, deleteSubmission, type SubmissionResponse, type CreateSubmissionPayload } from "@/app/src/lib/api/submissions";
import { uploadFile, getMediaFileUrl } from "@/app/src/lib/api/media";
import DocumentPreviewModal, { type PreviewFile } from "@/app/src/components/ui/DocumentPreviewModal";

type RubricCriterionResult = {
  criterionId?: string;
  criterion_name?: string;
  name?: string;
  score: number;
  maxScore?: number;
  feedback?: string;
};

type GradeSource = "teacher" | "ai";

function extractGradeData(result: Record<string, unknown>) {
  const teacher = result.teacher as Record<string, unknown> | undefined;
  const ai = result.ai as Record<string, unknown> | undefined;

  const source: GradeSource = teacher ? "teacher" : "ai";
  const score = (teacher?.score ?? ai?.score ?? result.grade ?? result.score) as number | undefined;
  const feedback = (teacher?.feedback ?? ai?.feedback) as string | undefined;

  const rubricResults = [
    ...(Array.isArray(teacher?.rubricResults) ? teacher.rubricResults : []),
    ...(!teacher && Array.isArray(ai?.rubricResults) ? ai.rubricResults : []),
  ] as RubricCriterionResult[];

  return { score, feedback, rubricResults, source };
}

function useCountdown(dueDate: string) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date();
      const due = new Date(dueDate);
      const diff = due.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Vencida");
        setIsUrgent(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours >= 24) {
        setTimeLeft("");
        setIsUrgent(false);
        return;
      }

      setIsUrgent(true);
      if (hours > 0) {
        setTimeLeft(`Vence en ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`Vence en ${minutes}m`);
      }
    }

    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [dueDate]);

  return { timeLeft, isUrgent };
}

function AnimatedScore({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === undefined || value === null) return;
    let current = 0;
    const duration = 800;
    const steps = 40;
    const increment = value / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{display}%</span>;
}

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
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { timeLeft, isUrgent } = useCountdown(assignment?.dueDate ?? "");

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
      setIsUploadingFiles(true);
      const attachments = await Promise.all(
        selectedFiles.map(async (file) => {
          const result = await uploadFile(file);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            mediaId: result.media.id,
            dataUrl: `/api/media/${result.media.id}/file`,
          };
        }),
      );
      setIsUploadingFiles(false);

      const payload: CreateSubmissionPayload = {
        assignmentId: Number(assignment.id),
        content: { text: deliveryText.trim() },
        files: {
          attachments,
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
      setIsUploadingFiles(false);
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
  const assignmentAttachments = useMemo(() => {
    const raw = settings?.attachments;
    if (!Array.isArray(raw)) return [];
    return raw as Array<{ name: string; mediaId: string; type?: string }>;
  }, [settings]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8] px-4 py-6 sm:px-7 dark:bg-[#0b1120]">
        <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
          <div className="h-10 w-40 rounded-full bg-slate-200 dark:bg-[#253245]" />
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-[#253245] dark:bg-[#0f1a2e]">
            <div className="h-8 w-3/4 rounded-lg bg-slate-200 dark:bg-[#1a2740]" />
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-[#1a2740]" />
            <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-[#1a2740]" />
            <div className="mt-4 flex gap-4">
              <div className="h-4 w-32 rounded bg-slate-100 dark:bg-[#1a2740]" />
              <div className="h-4 w-20 rounded bg-slate-100 dark:bg-[#1a2740]" />
            </div>
          </div>
          <div className="h-40 rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#253245] dark:bg-[#0f1a2e]">
            <div className="h-6 w-32 rounded bg-slate-200 dark:bg-[#1a2740]" />
            <div className="mt-4 h-20 w-full rounded-xl bg-slate-100 dark:bg-[#1a2740]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8] dark:bg-[#0b1120]">
        <p className="text-sm text-red-600 dark:text-red-400">{error ?? "Tarea no encontrada"}</p>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8] px-4 py-6 sm:px-7 dark:bg-[#0b1120]">
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/workspace/${workspaceId}?from=workspace`)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-300 dark:hover:bg-[#1a2740]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al workspace
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-[#253245] dark:bg-[#0f1a2e]">
          <div className="flex flex-col gap-1">
            <h1 className="serif text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">{assignment.name}</h1>
            <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">{assignment.description}</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDueDate(assignment.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {isExpiredOrClosed ? "Vencida" : "Abierta"}
            </span>
            {timeLeft && !isGraded ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold animate-pulse ${
                  isUrgent
                    ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                    : "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {timeLeft}
              </span>
            ) : null}
          </div>

          {rubricCriteria && rubricCriteria.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Rúbrica de evaluación</h3>
              <div className="mt-2 space-y-2">
                {rubricCriteria.map((criterion, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-[#253245] dark:bg-[#0a1424]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{criterion.name}</span>
                      <span className="text-sm font-semibold text-[#275D79] dark:text-[#3a7fa0]">{criterion.weight}%</span>
                    </div>
                    {criterion.description ? (
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{criterion.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {settings ? (
            <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              {settings.allowLateSubmissions ? "Entregas fuera de tiempo: permitidas" : "Entregas fuera de tiempo: no permitidas"}
              {settings.maxFileSizeMb ? ` · Tamaño máximo: ${settings.maxFileSizeMb} MB` : null}
            </div>
          ) : null}

          {assignmentAttachments.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Archivos de la tarea</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {assignmentAttachments.map((file) => (
                  <div key={file.mediaId} className="inline-flex items-center gap-1">
                    <a
                      href={getMediaFileUrl(file.mediaId)}
                      download={file.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-[#275D79] hover:text-[#275D79] dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-300 dark:hover:border-[#3a7fa0] dark:hover:text-[#3a7fa0]"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      {file.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewFiles([{
                          name: file.name,
                          mediaId: file.mediaId,
                          mimeType: file.type ?? "application/octet-stream",
                        }]);
                        setPreviewIndex(0);
                        setPreviewOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-[#275D79] transition hover:bg-[#EEF5F7] dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-[#3a7fa0] dark:hover:bg-[#1a2740]"
                      title="Vista previa"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {isGraded && submission?.result ? (() => {
          const gradeData = extractGradeData(submission.result as Record<string, unknown>);
          const { score, feedback, rubricResults, source } = gradeData;
          const submissionDate = submission.createdAt ? new Date(submission.createdAt) : null;
          const isLate = submissionDate && new Date(assignment.dueDate).getTime() < submissionDate.getTime();

          return (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition-all duration-500 dark:border-emerald-800 dark:bg-emerald-950/30">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">Calificación</h2>
                  {feedback ? (
                    <p className="mt-1 text-sm leading-relaxed text-emerald-700 dark:text-emerald-400">{feedback}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <AnimatedScore key={score} value={score ?? 0} className="text-3xl font-bold text-emerald-700 dark:text-emerald-400" />
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:border-emerald-700 dark:bg-[#0f1a2e] dark:text-emerald-400">
                    <Award className="h-3 w-3" />
                    {source === "teacher" ? "Docente" : "IA"}
                  </span>
                </div>
              </div>

              {isLate ? (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Entregada tarde
                </div>
              ) : null}

              {rubricResults.length > 0 && rubricCriteria && rubricCriteria.length > 0 ? (
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <ListChecks className="mr-1.5 inline h-3.5 w-3.5" />
                    Desglose por criterio
                  </h3>
                  {rubricCriteria.map((criterion) => {
                    const result = rubricResults.find(
                      (r) => r.criterionId === criterion.name || r.criterion_name === criterion.name || r.name === criterion.name,
                    );
                    const criterionScore = result?.score ?? 0;
                    const barColor =
                      criterionScore >= 80 ? "bg-emerald-500" : criterionScore >= 60 ? "bg-amber-500" : "bg-red-500";
                    return (
                      <div key={criterion.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-emerald-800 dark:text-emerald-300">{criterion.name}</span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{criterionScore}%</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                            style={{ width: `${criterionScore}%` }}
                          />
                        </div>
                        {result?.feedback ? (
                          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-500">{result.feedback}</p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Timeline */}
              <div className="mt-6 flex items-start gap-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div className="h-8 w-0.5 bg-emerald-300 dark:bg-emerald-700" />
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div className="h-8 w-0.5 bg-emerald-300 dark:bg-emerald-700" />
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="ml-3 flex flex-col pb-1">
                  <div className="flex h-6 items-center">
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Fecha límite</span>
                    <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-500">{formatDueDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex h-8 items-center">
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Entregada</span>
                    {submission.createdAt ? (
                      <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-500">
                        {new Date(submission.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex h-6 items-center">
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Calificada</span>
                    <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-500">
                      {(() => {
                        const r = submission.result as Record<string, unknown>;
                        const aiRecord = r.ai as Record<string, unknown> | undefined;
                        const evalDate = aiRecord?.evaluatedAt as string | undefined;
                        return evalDate
                          ? new Date(evalDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "Recién";
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })() : isSubmitted && !showCancelConfirm ? (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-all duration-500 dark:border-blue-800 dark:bg-blue-950/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Tu entrega</h2>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  Entregada el {submission?.createdAt ? new Date(submission.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                </p>
                {(() => {
                  const subDate = submission?.createdAt ? new Date(submission.createdAt) : null;
                  const isLate = subDate && new Date(assignment.dueDate).getTime() < subDate.getTime();
                  return isLate ? (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                      <AlertCircle className="h-3 w-3" />
                      Entregada tarde
                    </span>
                  ) : null;
                })()}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-[#0f1a2e] dark:text-blue-400">
                <Check className="h-4 w-4" />
                Entregada
              </span>
            </div>

            {submission?.content?.text ? (
              <div className="mt-4 rounded-xl border border-blue-100 bg-white px-4 py-3 dark:border-blue-800/50 dark:bg-[#0f1a2e]">
                <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{submission.content.text as string}</p>
              </div>
            ) : null}

            {submission?.files?.attachments && Array.isArray(submission.files.attachments) && (submission.files.attachments as Array<Record<string, unknown>>).length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Archivos adjuntos</p>
                <div className="mt-1 space-y-1">
                  {(submission.files.attachments as Array<Record<string, unknown>>).map((file) => {
                    const name = file.name as string;
                    const mediaId = file.mediaId as string | undefined;
                    const dataUrl = file.dataUrl as string | undefined;
                    return (
                      <div key={name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Paperclip className="h-3 w-3" />
                        <span className="truncate">{name}</span>
                        {(mediaId || dataUrl) ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewFiles([{
                                name,
                                mediaId: mediaId ?? dataUrl!.replace("/api/media/", "").replace("/file", ""),
                                mimeType: (file.type as string) ?? "application/octet-stream",
                              }]);
                              setPreviewIndex(0);
                              setPreviewOpen(true);
                            }}
                            className="ml-auto inline-flex items-center gap-1 rounded-md border border-blue-200 px-2 py-0.5 text-[10px] font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                          >
                            <Eye className="h-3 w-3" />
                            Vista previa
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => { setDeliveryText(submission?.content?.text as string ?? ""); setShowCancelConfirm(true); }}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:bg-[#0f1a2e] dark:text-blue-400 dark:hover:bg-blue-950/30"
              >
                <RotateCcw className="h-4 w-4" />
                Re-enviar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-[#0f1a2e] dark:text-red-400 dark:hover:bg-red-950/30"
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-[#253245] dark:bg-[#0f1a2e]">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isGraded || isExpiredOrClosed ? "Tarea cerrada" : showCancelConfirm ? "Re-enviar tarea" : "Entregar tarea"}
            </h2>

            {isGraded || isExpiredOrClosed ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {isGraded ? "Esta tarea ya ha sido calificada y no acepta más entregas." : "Esta tarea ya ha vencido y no acepta más entregas."}
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{showCancelConfirm ? "Modifica tu respuesta y vuelve a enviar." : "Escribe tu respuesta para esta tarea."}</p>

                  <div className="mt-4 space-y-4">
                    <textarea
                      value={deliveryText}
                      onChange={(e) => setDeliveryText(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Escribe tu respuesta aquí..."
                      rows={6}
                      className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-4 focus:ring-[#275D79]/10 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0]"
                    />

                    <div>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          setSelectedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files ?? [])]);
                        }}
                        onClick={() => document.getElementById("file-upload-input")?.click()}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 text-sm transition-all duration-200 ${
                          isDragOver
                            ? "border-[#275D79] bg-[#EEF5F7] scale-[1.02] dark:border-[#3a7fa0] dark:bg-[#1a2740]"
                            : "border-sky-300 text-slate-500 hover:bg-sky-50 dark:border-sky-700 dark:text-slate-400 dark:hover:bg-sky-950/30"
                        }`}
                      >
                        <Upload className="h-5 w-5" />
                        <span className="font-medium">{isDragOver ? "Suelta los archivos aquí" : "Arrastra archivos o haz clic para adjuntar"}</span>
                        <input
                          id="file-upload-input"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
                        />
                      </div>
                      {selectedFiles.length > 0 ? (
                        <div className="mt-3 space-y-1.5">
                          {selectedFiles.map((file) => {
                            const ext = file.name.split(".").pop()?.toUpperCase() ?? "?";
                            const typeLabels: Record<string, string> = { PDF: "PDF", PNG: "IMG", JPG: "IMG", JPEG: "IMG", DOC: "DOC", DOCX: "DOC", ZIP: "ZIP", MP4: "VID", MOV: "VID" };
                            const badge = typeLabels[ext] ?? ext.slice(0, 3);
                            return (
                              <div key={`${file.name}-${file.size}-${file.lastModified}`} className="group flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs dark:border-[#253245] dark:bg-[#0a1424]">
                                <span className="inline-flex h-5 w-8 items-center justify-center rounded-md bg-slate-200 text-[9px] font-bold text-slate-600 dark:bg-[#1a2740] dark:text-slate-400">
                                  {badge}
                                </span>
                                <span className="flex-1 truncate text-slate-700 dark:text-slate-300">{file.name}</span>
                                <span className="shrink-0 text-slate-400 dark:text-slate-500">{(file.size / 1024).toFixed(0)} KB</span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setSelectedFiles((prev) => prev.filter((f) => f !== file)); }}
                                  className="shrink-0 rounded-md p-1 text-slate-400 opacity-0 transition hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!hasContent || isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#275D79] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1f4a61] active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-[#7ba2b4] disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isUploadingFiles ? "Subiendo archivos..." : isSubmitting ? "Enviando..." : "Enviar entrega"}
                    </button>
                    {showCancelConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-400 dark:hover:bg-[#1a2740]"
                      >
                        Mantener entrega actual
                      </button>
                    ) : null}
                  </div>
                </div>

                {submitError ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">{submitError}</p>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>

      <DocumentPreviewModal
        files={previewFiles}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        initialIndex={previewIndex}
      />
    </section>
  );
}
