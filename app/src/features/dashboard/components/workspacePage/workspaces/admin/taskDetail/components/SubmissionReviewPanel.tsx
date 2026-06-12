import { ChangeEvent, useState } from "react";
import {
  Bot,
  CheckCircle,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import type { MemberSubmissionRow } from "../types";
import type { GradeResult } from "@/app/src/lib/api/ai";
import {
  getInitials,
  getMemberName,
  getStoredGrade,
  getStoredAiAnalysis,
  getSubmissionFiles,
  getSubmissionText,
} from "../helpers";
import DocumentPreviewModal, { type PreviewFile } from "@/app/src/components/ui/DocumentPreviewModal";

// Valor corregido por el profesor para un criterio de la rúbrica.
// teacher_score y teacher_feedback reemplazan lo que sugirió la IA originalmente.
// Si un criterio no tiene override, se usa el valor original de la IA.
type CriterionOverrideValue = {
  teacher_score: number;
  teacher_feedback: string;
};

type Props = {
  row: MemberSubmissionRow;
  aiSuggestion?: GradeResult;
  isAnalyzing: boolean;
  grade: string;
  feedback: string;
  // Diccionario de overrides activos para el submission actual (key = criterion_id).
  // Se pasa desde AssignmentAdminDetail, filtrado por submission_id.
  overrides?: Record<string, CriterionOverrideValue>;
  // Callback cuando el profesor edita un score o feedback en los inputs del criterio.
  // El padre (AssignmentAdminDetail) lo recibe y lo guarda en el estado global de overrides.
  onOverrideChange?: (criterionId: string, field: "teacher_score" | "teacher_feedback", value: string) => void;
  onAnalyze: () => void;
  onAcceptSuggestion: () => void;
  onGradeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFeedbackChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
};

const ANALYZE_PROMPT = 'Haz clic en "Analizar" para que la IA evalúe esta entrega.';
const NO_SUBMISSION_TEXT = "No hay entrega para analizar todavía.";

export default function SubmissionReviewPanel({
  row,
  aiSuggestion,
  isAnalyzing,
  grade,
  feedback,
  overrides,
  onOverrideChange,
  onAnalyze,
  onAcceptSuggestion,
  onGradeChange,
  onFeedbackChange,
  onSave,
}: Props) {
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const name = getMemberName(row.member);
  const files = getSubmissionFiles(row.submission);
  const storedGrade = row.localGrade ?? getStoredGrade(row.submission);
  const storedAi = getStoredAiAnalysis(row.submission);
  const canGrade = Boolean(row.submission);
  const hasFreshSuggestion = Boolean(aiSuggestion);
  const hasStoredAi = Boolean(storedAi) && !hasFreshSuggestion;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D8E7EC] text-sm font-bold text-[#275D79]">
          {getInitials(name)}
        </span>
        <div>
          <h2 className="font-bold text-slate-950">{name}</h2>
          <p className="text-xs text-slate-500">{row.member.userId}</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-4">
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
            <FileText className="h-4 w-4" />
            Respuesta del estudiante
          </h3>
          <div
            className={`rounded-xl p-4 text-sm leading-6 ${canGrade ? "bg-[#EEF5F7] text-slate-700" : "bg-slate-100 text-slate-500"}`}
          >
            {getSubmissionText(row.submission)}
          </div>

          {files.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {files.map((file) => (
                <div key={file.name} className="inline-flex items-center gap-1">
                  {file.href || file.mediaId ? (
                    <>
                      <a
                        href={file.href ?? `/api/media/${file.mediaId}/file`}
                        download={file.name}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-[#275D79] hover:text-[#275D79]"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {file.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const id = file.mediaId ?? file.href?.replace("/api/media/", "").replace("/file", "") ?? "";
                          if (id) {
                            setPreviewFiles([{
                              name: file.name,
                              mediaId: id,
                              mimeType: file.mimeType ?? "application/octet-stream",
                            }]);
                            setPreviewIndex(0);
                            setPreviewOpen(true);
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-[#275D79] transition hover:bg-[#EEF5F7]"
                        title="Vista previa"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                      <FileText className="h-3.5 w-3.5" />
                      {file.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-[#B8CED8] bg-[#F8FBFC] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Bot className="h-4 w-4 text-[#275D79]" />
              Análisis de IA
            </h3>
            {hasStoredAi ? (
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 rounded-lg border border-[#B8CED8] bg-white px-3 py-2 text-xs font-semibold text-[#275D79] transition hover:bg-[#EEF5F7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {isAnalyzing ? "Analizando..." : "Analizar otra vez"}
              </button>
            ) : (
              <button
                type="button"
                onClick={onAnalyze}
                disabled={!canGrade || isAnalyzing}
                className="inline-flex items-center gap-2 rounded-lg bg-[#275D79] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {isAnalyzing ? "Analizando..." : "Analizar"}
              </button>
            )}
          </div>

          {hasFreshSuggestion && aiSuggestion ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-[#B8CED8] bg-blue-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#275D79]">
                    Puntaje sugerido: {aiSuggestion.total_score} /{" "}
                    {aiSuggestion.max_score}
                  </span>
                  <span className="text-xs text-slate-500">
                    {aiSuggestion.grading_model}
                  </span>
                </div>
                {/* Cada criterio de la rúbrica es un bloque editable.
                    Si onOverrideChange existe (el padre habilita overrides):
                    - El score se muestra como input numérico
                    - El feedback se muestra como textarea
                    - Si el profesor modificó el valor, el fondo se vuelve ámbar
                    Si no hay overrides habilitados, se muestra como texto estático. */}
                {aiSuggestion.criteria_results.map((c) => {
                  // ov = overrideValue si el profesor ya editó este criterio
                  const ov = overrides?.[c.criterion_id];
                  // Muestra el valor overrideado si existe, sino el original de la IA
                  const displayScore = ov?.teacher_score ?? c.score;
                  const displayFeedback = ov?.teacher_feedback ?? c.feedback;
                  // true si el profesor modificó este criterio (cambia el estilo a ámbar)
                  const isModified = ov != null;

                  return (
                    <div
                      key={c.criterion_id}
                      className={`mb-2 rounded-lg p-3 ${isModified ? "border border-amber-200 bg-amber-50" : "bg-white"}`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          {c.criterion_name}
                        </span>
                        {onOverrideChange ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              step={0.5}
                              value={displayScore}
                              onChange={(e) => onOverrideChange(c.criterion_id, "teacher_score", e.target.value)}
                              className={`w-16 rounded border px-1.5 py-0.5 text-xs text-right outline-none ${
                                isModified
                                  ? "border-amber-300 bg-amber-100 font-semibold text-amber-800"
                                  : "border-slate-200 bg-slate-50 text-slate-700"
                              }`}
                            />
                            <span className="text-xs text-slate-400">/ {c.max_score}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-[#275D79]">
                            {c.score} / {c.max_score}
                          </span>
                        )}
                      </div>
                      {onOverrideChange ? (
                        <textarea
                          value={displayFeedback}
                          onChange={(e) => onOverrideChange(c.criterion_id, "teacher_feedback", e.target.value)}
                          rows={2}
                          className={`mt-1 w-full resize-none rounded px-2 py-1 text-xs leading-5 outline-none ${
                            isModified
                              ? "border border-amber-300 bg-amber-100 text-amber-800"
                              : "border border-transparent bg-transparent text-slate-600 hover:border-slate-200 focus:border-slate-300"
                          }`}
                        />
                      ) : (
                        <p className="text-xs leading-5 text-slate-600">
                          {c.feedback}
                        </p>
                      )}
                      <span className="mt-1 inline-block rounded-md bg-[#D8E7EC] px-2 py-0.5 text-[10px] font-medium text-[#275D79]">
                        {c.matched_level}
                      </span>
                    </div>
                  );
                })}
                <p className="mt-3 text-xs leading-5 text-slate-500 italic">
                  {aiSuggestion.feedback_summary}
                </p>
              </div>
              <button
                type="button"
                onClick={onAcceptSuggestion}
                className="inline-flex items-center gap-2 rounded-lg border border-[#B8CED8] bg-white px-3 py-2 text-xs font-semibold text-[#275D79] transition hover:bg-[#EEF5F7]"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Aceptar sugerencia
              </button>
            </div>
          ) : hasStoredAi && storedAi ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-700">
                    Calificación IA: {storedAi.total_score} puntos
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(storedAi.evaluated_at).toLocaleString("es-CO")}
                  </span>
                </div>
                {storedAi.criteria_results.map((c) => (
                  <div
                    key={c.criterion_id}
                    className="mb-2 rounded-lg bg-white p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {c.criterion_name}
                      </span>
                      <span className="text-xs font-medium text-emerald-600">
                        {c.score} pts
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-slate-600">
                      {c.feedback}
                    </p>
                  </div>
                ))}
                <p className="mt-3 text-xs leading-5 text-slate-500 italic">
                  {storedAi.feedback_summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="min-h-28 rounded-lg bg-white px-4 py-5 text-sm leading-6 text-slate-600">
              {isAnalyzing ? (
                <div className="flex items-center gap-3 text-[#275D79]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analizando entrega con IA...
                </div>
              ) : canGrade ? (
                ANALYZE_PROMPT
              ) : (
                NO_SUBMISSION_TEXT
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
          <Send className="h-4 w-4" />
          Asignar calificación
        </h3>
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-600">
            Puntuación
            <input
              type="number"
              min={0}
              value={grade}
              onChange={onGradeChange}
              placeholder={
                typeof storedGrade === "number" ? String(storedGrade) : "0"
              }
              disabled={!canGrade}
              className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm outline-none focus:border-[#275D79] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Retroalimentación
            <textarea
              value={feedback}
              onChange={onFeedbackChange}
              rows={4}
              disabled={!canGrade}
              placeholder="Escribe comentarios para el estudiante..."
              className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm outline-none focus:border-[#275D79] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <button
            type="button"
            onClick={onSave}
            disabled={!canGrade || grade.trim().length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-[#275D79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Guardar calificación
          </button>
        </div>
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