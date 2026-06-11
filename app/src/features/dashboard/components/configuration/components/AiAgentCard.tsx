import { Bot, Sparkles, FileText, Gauge } from "lucide-react";

type Props = {
  agenticMode: boolean;
  retroStyle: string;
  exigencyLevel: string;
  weeklyReport: boolean;
  onChange: (field: "agenticMode" | "weeklyReport", value: boolean) => void;
  onSelect: (field: "retroStyle" | "exigencyLevel", value: string) => void;
};

const retroOptions = [
  { value: "brief", label: "Breve" },
  { value: "detailed", label: "Detallado" },
  { value: "full", label: "Completo" },
];

const exigencyOptions = [
  { value: "flexible", label: "Flexible" },
  { value: "moderated", label: "Moderado" },
  { value: "strict", label: "Estricto" },
];

const previews: Record<string, string> = {
  brief: "Tu código funciona correctamente. La estructura es clara. Sugiero agregar validación de errores.",
  detailed: "Buen trabajo con la separación de responsabilidades en capas. La función `handleSubmit` procesa correctamente el formulario. Considera añadir tipos más estrictos en los parámetros para mejorar la maintainabilidad. En la línea 42, la validación del email podría beneficiarse de una expresión regular más robusta.",
  full: "## Resumen\nCódigo funcional con buena organización.\n\n## Fortalezas\n- Separación clara de responsabilidades\n- Manejo correcto de estados de carga y error\n\n## Áreas de mejora\n1. **Tipado**: Los parámetros de `handleSubmit` deberían ser explícitos\n2. **Validación**: Mejorar regex de email en línea 42\n3. **Tests**: Faltan casos borde para entradas vacías\n\n## Puntaje sugerido: 85/100",
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        enabled ? "bg-[#275D79] dark:bg-[#3a7fa0]" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform dark:bg-slate-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AiAgentCard({ agenticMode, retroStyle, exigencyLevel, weeklyReport, onChange, onSelect }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#253245] dark:bg-[#141f33]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <Bot size={20} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Agente IA</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configura cómo la IA califica y retroalimenta</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Calificación automática con IA</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Evalúa entregas y sugiere calificaciones</p>
          </div>
          <Toggle enabled={agenticMode} onChange={(v) => onChange("agenticMode", v)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <FileText size={14} />
              Estilo de retroalimentación
            </span>
            <select
              value={retroStyle}
              onChange={(e) => onSelect("retroStyle", e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
            >
              {retroOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Gauge size={14} />
              Nivel de exigencia
            </span>
            <select
              value={exigencyLevel}
              onChange={(e) => onSelect("exigencyLevel", e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
            >
              {exigencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>

        {agenticMode && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Sparkles size={14} />
              Vista previa de retroalimentación
            </div>
            <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {previews[retroStyle] ?? previews.detailed}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/40">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Informe semanal automático</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Recibe un resumen de rendimiento cada semana</p>
          </div>
          <Toggle enabled={weeklyReport} onChange={(v) => onChange("weeklyReport", v)} />
        </div>
      </div>
    </section>
  );
}
