import { ChangeEvent } from "react";
import {
  Bot,
  CheckCircle,
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

type Props = {
  row: MemberSubmissionRow;
  aiSuggestion?: GradeResult;
  isAnalyzing: boolean;
  grade: string;
  feedback: string;
  onAnalyze: () => void;
  onAcceptSuggestion: () => void;
  onGradeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFeedbackChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
};

export default function SubmissionReviewPanel({
  row,
  aiSuggestion,
  isAnalyzing,
  grade,
  feedback,
  onAnalyze,
  onAcceptSuggestion,
  onGradeChange,
  onFeedbackChange,
  onSave,
}: Props) {
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
              {files.map((file) => {
                const content = (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    {file.name}
                  </>
                );

                return file.href ? (
                  <a
                    key={file.name}
                    href={file.href}
                    download={file.name}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-[#275D79] hover:text-[#275D79]"
                  >
                    {content}
                  </a>
                ) : (
                  <span
                    key={file.name}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    {content}
                  </span>
                );
              })}
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
                {aiSuggestion.criteria_results.map((c) => (
                  <div
                    key={c.criterion_id}
                    className="mb-2 rounded-lg bg-white p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {c.criterion_name}
                      </span>
                      <span className="text-xs font-medium text-[#275D79]">
                        {c.score} / {c.max_score}
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-slate-600">
                      {c.feedback}
                    </p>
                    <span className="mt-1 inline-block rounded-md bg-[#D8E7EC] px-2 py-0.5 text-[10px] font-medium text-[#275D79]">
                      {c.matched_level}
                    </span>
                  </div>
                ))}
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
                'Haz clic en "Analizar" para que la IA evalúe esta entrega.'
              ) : (
                "No hay entrega para analizar todavía."
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
    </section>
  );
}