import { Bot, Sparkles } from "lucide-react";

type Props = {
  analyzed: number;
  total: number;
};

export default function AiSummaryPanel({ analyzed, total }: Props) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#B8CED8] bg-[#EEF5F7] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8E7EC] text-[#275D79]">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-950">Calificación con IA</h2>
          <p className="text-xs text-slate-500">
            {analyzed} de {total} entregas analizadas
          </p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#275D79] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61]"
      >
        <Sparkles className="h-4 w-4" />
        Analizar todas ({Math.max(total - analyzed, 0)})
      </button>
    </section>
  );
}
