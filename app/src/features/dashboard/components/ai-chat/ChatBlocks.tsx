import type { AiBlock } from "@/app/src/lib/api/ai";

function StatBlock({ block }: { block: AiBlock }) {
  const label = block.label as string;
  const value = block.value as string;
  const delta = block.delta as string | undefined;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-[#253245] dark:bg-[#0a1424]">
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-[#275D79] dark:text-[#3a7fa0]">{value}</p>
      </div>
      {delta != null && (
        <span className={`self-start rounded-full px-2 py-0.5 text-xs font-medium ${Number(delta) >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>
          {Number(delta) >= 0 ? "+" : ""}{delta}
        </span>
      )}
    </div>
  );
}

function TableBlock({ block }: { block: AiBlock }) {
  const headers = (block.columns ?? block.headers ?? []) as string[];
  const rows = (block.rows ?? []) as string[][];
  if (!headers.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#253245]">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-[#0a1424]">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-t border-slate-100 dark:border-[#253245]">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-slate-600 dark:text-slate-400">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardBlock({ block }: { block: AiBlock }) {
  const fields = (block.fields ?? []) as { label: string; value: string }[];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-[#253245] dark:bg-[#0a1424]">
      {block.title ? (
        <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">{block.title}</p>
      ) : null}
      <div className="space-y-1">
        {fields.map((f, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">{f.label}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartBlock({ block }: { block: AiBlock }) {
  const labels = (block.labels ?? []) as string[];
  const values = (block.values ?? []) as number[];
  const max = Math.max(...values, 1);

  if (!labels.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-[#253245] dark:bg-[#0a1424]">
      {block.title ? (
        <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">{block.title}</p>
      ) : null}
      <div className="flex items-end gap-2" style={{ height: 80 }}>
        {labels.map((label, i) => {
          const h = (values[i] / max) * 100;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{values[i]}</span>
              <div
                className="w-full rounded-t bg-[#275D79] transition-all dark:bg-[#3a7fa0]"
                style={{ height: `${Math.max(h, 4)}%` }}
              />
              <span className="truncate text-[10px] text-slate-500 dark:text-slate-400" style={{ maxWidth: 40 }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlertBlock({ block }: { block: AiBlock }) {
  const severity = (block.severity ?? "info") as string;
  const message = (block.message ?? block.content ?? "") as string;
  const colors: Record<string, string> = {
    info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
    warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
    error: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  };
  const icons: Record<string, string> = {
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs ${colors[severity] ?? colors.info}`}>
      <span>{icons[severity] ?? icons.info}</span>
      <span>{message}</span>
    </div>
  );
}

function TextBlock({ block }: { block: AiBlock }) {
  return (
    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
      {block.content}
    </p>
  );
}

export default function ChatBlocks({ blocks, message }: { blocks: AiBlock[]; message?: string }) {
  if (!blocks?.length) return null;

  return (
    <div className="mt-3 space-y-2 border-t border-slate-200 pt-2 dark:border-[#253245]">
      {blocks.map((block, i) => {
        if (block.type === "text" && message && block.content === message) return null;
        switch (block.type) {
          case "stat": return <StatBlock key={i} block={block} />;
          case "table": return <TableBlock key={i} block={block} />;
          case "card": return <CardBlock key={i} block={block} />;
          case "chart": return <ChartBlock key={i} block={block} />;
          case "alert": return <AlertBlock key={i} block={block} />;
          case "text": return <TextBlock key={i} block={block} />;
          default: return null;
        }
      })}
    </div>
  );
}
