import { Bot, CheckCircle, Loader2, Sparkles } from "lucide-react";

type Props = {
  analyzed: number;
  total: number;
  isLoading: boolean;
  hasSuggestion: boolean;
  approving: boolean;
  onAnalyzeAll: () => void;
  onApproveAll: () => void;
};

export default function AiSummaryPanel({
  analyzed,
  total,
  isLoading,
  hasSuggestion,
  approving,
  onAnalyzeAll,
  onApproveAll,
}: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#B8CED8] bg-[#EEF5F7] p-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#253245] dark:bg-[#0a1424]">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8E7EC] text-[#275D79] dark:bg-[#1a2740] dark:text-[#3a7fa0]">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-950 dark:text-slate-100">
            Calificación con IA
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {analyzed} de {total} entregas analizadas
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasSuggestion && !approving ? (
          <button
            type="button"
            onClick={onApproveAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            <CheckCircle className="h-4 w-4" />
            Aceptar todas
          </button>
        ) : null}
        <button
          type="button"
          onClick={onAnalyzeAll}
          disabled={isLoading || total === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#275D79] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : approving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isLoading
            ? "Analizando..."
            : approving
              ? "Aprobando..."
              : `Analizar todas (${Math.max(total - analyzed, 0)})`}
        </button>
      </div>
    </section>
  );
}