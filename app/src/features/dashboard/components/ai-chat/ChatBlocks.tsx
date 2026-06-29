import {
  Info,
  TriangleAlert,
  CircleX,
  BookOpen,
  CheckCheck,
  Clock,
  TrendingUp,
  ListChecks,
  GraduationCap,
  FileText,
  User,
} from "lucide-react";
import type { AiBlock } from "@/app/src/lib/api/ai";

const ROLE_COLORS: Record<string, string> = {
  administrador:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  estudiante:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  profesor:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  invitado:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const STATUS_COLORS: Record<string, string> = {
  abierto:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  cerrado:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  pendiente:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  vencido: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  activo:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  inactivo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  calificado:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  "por calificar":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

const NAMES = ["nombre", "name", "estudiante", "alumno", "miembro", "usuario"];

function nameToColor(name: string): string {
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 50%, 45%)`;
}

function getInitials(name: string): string {
  const cleaned = name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ name, src, size = 24 }: { name: string; src?: string | null; size?: number }) {
  const initials = getInitials(name);
  const hue =
    [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        title={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: `hsl(${hue}, 55%, 50%)`,
      }}
      title={name}
    >
      {initials}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const key = role.toLowerCase().trim();
  const colorClass = ROLE_COLORS[key] ?? ROLE_COLORS.administrador;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight ${colorClass}`}
    >
      {key === "administrador" || key === "admin" ? (
        <User size={10} />
      ) : key === "estudiante" ? (
        <GraduationCap size={10} />
      ) : null}
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().trim();
  const colorClass = STATUS_COLORS[key] ?? STATUS_COLORS.abierto;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${colorClass}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function ScoreChip({ score, maxScore }: { score: string; maxScore?: string }) {
  const num = parseFloat(score);
  const max = maxScore ? parseFloat(maxScore) : 100;
  if (isNaN(num)) return <span>{score}</span>;
  const pct = max > 0 ? (num / max) * 100 : 0;
  const color =
    pct >= 90
      ? "text-emerald-600 dark:text-emerald-400"
      : pct >= 70
        ? "text-emerald-500 dark:text-emerald-400"
        : pct >= 60
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400";
  return (
    <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${color}`}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor:
            pct >= 90
              ? "#10b981"
              : pct >= 70
                ? "#22c55e"
                : pct >= 60
                  ? "#eab308"
                  : "#ef4444",
        }}
      />
      {num}
      {maxScore ? `/ ${maxScore}` : ""}
    </span>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
      style={{ backgroundColor: color.toLowerCase() }}
    />
  );
}

function isNameColumn(header: string): boolean {
  const h = header.toLowerCase().trim();
  return NAMES.some((n) => h === n || h.includes(n));
}

function isRoleColumn(header: string): boolean {
  const h = header.toLowerCase().trim();
  return h === "rol" || h === "role" || h.includes("rol");
}

function isStatusColumn(header: string): boolean {
  const h = header.toLowerCase().trim();
  return h === "estado" || h === "status";
}

function isScoreColumn(header: string): boolean {
  const h = header.toLowerCase().trim();
  return (
    h.includes("puntaje") ||
    h.includes("score") ||
    h.includes("nota") ||
    h.includes("calif") ||
    h === "promedio"
  );
}

function isColorColumn(header: string): boolean {
  const h = header.toLowerCase().trim();
  return h === "color" || h === "accentcolor";
}

function isAvatarUrlColumn(header: string): boolean {
  const h = header.toLowerCase().replace(/[\s_-]/g, "");
  return h === "avatarurl" || h === "avatar" || h === "foto";
}

type CellEnrichments = {
  avatars?: Record<string, string>;
  accentColors?: Record<string, string>;
};

function getCellRenderer(header: string, enrichments?: CellEnrichments) {
  if (isColorColumn(header)) {
    const ColorDotRenderer = (value: string) => <ColorDot color={value} />;
    return ColorDotRenderer;
  }
  if (isRoleColumn(header)) {
    const RoleBadgeRenderer = (value: string) => <RoleBadge role={value} />;
    return RoleBadgeRenderer;
  }
  if (isStatusColumn(header)) {
    const StatusBadgeRenderer = (value: string) => <StatusBadge status={value} />;
    return StatusBadgeRenderer;
  }
  if (isScoreColumn(header)) {
    const ScoreChipRenderer = (value: string) => <ScoreChip score={value} />;
    return ScoreChipRenderer;
  }
  if (isAvatarUrlColumn(header)) {
    const AvatarRenderer = (value: string) => (
      <UserAvatar name={value || "avatar"} src={value || null} size={26} />
    );
    return AvatarRenderer;
  }
  if (isNameColumn(header)) {
    const NameRenderer = (value: string) => {
      const key = value.toLowerCase().trim();
      const avatarSrc = enrichments?.avatars?.[key];
      const color = enrichments?.accentColors?.[key] || nameToColor(value);
      if (avatarSrc) {
        return (
          <span className="inline-flex items-center gap-1.5">
            <UserAvatar name={value} src={avatarSrc} size={22} />
            <span className="font-medium">{value}</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium">{value}</span>
        </span>
      );
    };
    return NameRenderer;
  }
  return null;
}

// ─── Stat ────────────────────────────────────────────────

const STAT_ICONS: Record<string, { icon: React.ReactNode; bg: string }> = {
  tareas: {
    icon: <BookOpen size={16} />,
    bg: "from-blue-500/10 to-blue-500/5",
  },
  tarea: {
    icon: <BookOpen size={16} />,
    bg: "from-blue-500/10 to-blue-500/5",
  },
  calificadas: {
    icon: <CheckCheck size={16} />,
    bg: "from-emerald-500/10 to-emerald-500/5",
  },
  "por calificar": {
    icon: <Clock size={16} />,
    bg: "from-amber-500/10 to-amber-500/5",
  },
  pendientes: {
    icon: <Clock size={16} />,
    bg: "from-amber-500/10 to-amber-500/5",
  },
  promedio: {
    icon: <TrendingUp size={16} />,
    bg: "from-violet-500/10 to-violet-500/5",
  },
  entregas: {
    icon: <FileText size={16} />,
    bg: "from-cyan-500/10 to-cyan-500/5",
  },
  miembros: {
    icon: <User size={16} />,
    bg: "from-rose-500/10 to-rose-500/5",
  },
  espacios: {
    icon: <ListChecks size={16} />,
    bg: "from-indigo-500/10 to-indigo-500/5",
  },
  estudiantes: {
    icon: <GraduationCap size={16} />,
    bg: "from-emerald-500/10 to-emerald-500/5",
  },
};

function StatBlock({ block }: { block: AiBlock }) {
  const label = block.label as string;
  const value = block.value as string;
  const delta = block.delta as string | undefined;
  const key = label.toLowerCase().trim();
  const matched = Object.entries(STAT_ICONS).find(([k]) =>
    key.includes(k),
  );
  const { icon, bg } = matched?.[1] ?? {
    icon: <TrendingUp size={16} />,
    bg: "from-slate-500/10 to-slate-500/5",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br ${bg} px-4 py-3 dark:border-[#253245] dark:bg-[#0a1424]`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 text-[#275D79] shadow-sm dark:bg-[#1a2740] dark:text-[#3a7fa0]">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-[#275D79] dark:text-[#3a7fa0]">
          {value}
        </p>
      </div>
      {delta != null && (
        <span
          className={`self-start rounded-full px-2 py-0.5 text-xs font-medium ${
            Number(delta) >= 0
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {Number(delta) >= 0 ? "+" : ""}
          {delta}
        </span>
      )}
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────

function TableBlock({ block }: { block: AiBlock }) {
  const headers = (block.columns ?? block.headers ?? []) as string[];
  const rows = (block.rows ?? []) as string[][];
  const enrichments = block._enrichments as CellEnrichments | undefined;
  if (!headers.length) return null;

  const cellRenderers = headers.map((h) => getCellRenderer(h, enrichments));
  const nonColorHeaders = headers.filter(
    (h) => !isColorColumn(h) && !isAvatarUrlColumn(h),
  );
  const visibleColIndices = headers
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => !isColorColumn(h) && !isAvatarUrlColumn(h))
    .map(({ i }) => i);
  const nameIndex = headers.findIndex((h) => isNameColumn(h));

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#253245]">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-[#0a1424]">
            {nonColorHeaders.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const rowName = nameIndex >= 0 ? row[nameIndex]?.toLowerCase().trim() : "";
            const accentColor = enrichments?.accentColors?.[rowName];
            return (
              <tr
                key={ri}
                className="border-t border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-[#253245] dark:hover:bg-[#0a1220]/50"
                style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : undefined}
              >
                {visibleColIndices.map((ci) => {
                  const renderer = cellRenderers[ci];
                  const cell = row[ci];
                  return (
                    <td
                      key={ci}
                      className="px-3 py-2 text-slate-600 dark:text-slate-400"
                    >
                      {renderer ? renderer(cell) : cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────

function CardBlock({ block }: { block: AiBlock }) {
  const fields = (block.fields ?? []) as {
    label: string;
    value: string;
  }[];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-[#253245] dark:bg-[#0a1424]">
      {block.title ? (
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-[#275D79] dark:bg-[#3a7fa0]" />
          {block.title}
        </p>
      ) : null}
      <div className="space-y-1">
        {fields.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-[#0f1a2e]"
          >
            <span className="text-slate-500 dark:text-slate-400">
              {f.label}
            </span>
            <span className="ml-2 truncate font-medium text-slate-800 dark:text-slate-200">
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart ───────────────────────────────────────────────

function BarChartComponent({
  labels,
  values,
  title,
}: {
  labels: string[];
  values: number[];
  title?: string;
}) {
  const max = Math.max(...values, 1);

  return (
    <>
      {title ? (
        <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </p>
      ) : null}
      <div className="flex items-end gap-2" style={{ height: 96 }}>
        {labels.map((label, i) => {
          const h = (values[i] / max) * 100;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium tabular-nums text-slate-600 dark:text-slate-400">
                {values[i]}
              </span>
              <div
                className="w-full rounded-t bg-[#275D79] transition-all duration-300 hover:opacity-80 dark:bg-[#3a7fa0]"
                style={{ height: `${Math.max(h, 4)}%` }}
              />
              <span
                className="truncate text-[10px] text-slate-500 dark:text-slate-400"
                style={{ maxWidth: 48 }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function DonutChartComponent({
  labels,
  values,
  title,
  size = 120,
}: {
  labels: string[];
  values: number[];
  title?: string;
  size?: number;
}) {
  const rawTotal = values.reduce((a, b) => a + b, 0);
  const total = Math.max(rawTotal, 1);
  const center = size / 2;
  const radius = center * 0.7;
  const strokeWidth = center * 0.25;
  const innerRadius = radius - strokeWidth;

  const CHART_COLORS = [
    "#275D79",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
    "#f97316",
    "#ec4899",
  ];

  const paths: {
    d: string;
    fill: string;
    label: string;
    value: number;
    percent: number;
  }[] = [];

  let cumulative = 0;
  for (let i = 0; i < labels.length; i++) {
    const value = values[i] ?? 0;
    const startAngle = (cumulative / total) * 360 - 90;
    cumulative += value;
    const endAngle = (cumulative / total) * 360 - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const color = CHART_COLORS[i % CHART_COLORS.length];

    paths.push({
      d: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${center + innerRadius * Math.cos(endRad)} ${center + innerRadius * Math.sin(endRad)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${center + innerRadius * Math.cos(startRad)} ${center + innerRadius * Math.sin(startRad)} Z`,
      fill: color,
      label: labels[i],
      value,
      percent: Math.round((value / total) * 100),
    });
  }

  return (
    <>
      {title ? (
        <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </p>
      ) : null}
      <div className="flex items-center gap-4">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="shrink-0"
        >
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill={p.fill} className="transition-all duration-500" />
          ))}
          <text
            x={center}
            y={center - 3}
            textAnchor="middle"
            className="fill-slate-950 dark:fill-slate-100 text-sm font-bold"
            fontSize="14"
          >
            {rawTotal}
          </text>
          <text
            x={center}
            y={center + 8}
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400 text-[8px]"
            fontSize="8"
          >
            total
          </text>
        </svg>
        <div className="space-y-1.5">
          {paths.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: p.fill }}
              />
              <span className="text-slate-600 dark:text-slate-400">
                {p.label}
              </span>
              <span className="ml-auto font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {p.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function LineChartComponent({
  labels,
  values,
  title,
}: {
  labels: string[];
  values: number[];
  title?: string;
}) {
  const width = 240;
  const height = 80;
  const padding = 4;
  const max = Math.max(...values, 1);

  if (labels.length < 2) {
    return <BarChartComponent labels={labels} values={values} title={title} />;
  }

  const points = labels.map((_, i) => {
    const x = padding + (i / Math.max(labels.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - ((values[i] / max) * (height - 2 * padding));
    return `${x},${y}`;
  });

  return (
    <>
      {title ? (
        <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </p>
      ) : null}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#275D79"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dark:stroke-[#3a7fa0]"
        />
        {points.map((p, i) => {
          const [cx, cy] = p.split(",");
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="2.5"
              fill="#275D79"
              className="dark:fill-[#3a7fa0]"
            />
          );
        })}
        {labels.map((label, i) => {
          const x =
            padding +
            (i / Math.max(labels.length - 1, 1)) * (width - 2 * padding);
          return (
            <text
              key={i}
              x={x}
              y={height - 1}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[8px]"
              fontSize="8"
            >
              {label.length > 6 ? label.slice(0, 6) + "…" : label}
            </text>
          );
        })}
      </svg>
    </>
  );
}

function ChartBlock({ block }: { block: AiBlock }) {
  const chartType = (block.chart_type ?? "bar") as string;
  const labels = (block.labels ?? []) as string[];
  const values = (block.values ?? []) as number[];
  const title = block.title as string | undefined;

  if (!labels.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-[#253245] dark:bg-[#0a1424]">
      {chartType === "pie" && labels.length > 1 ? (
        <DonutChartComponent
          labels={labels}
          values={values}
          title={title}
        />
      ) : chartType === "line" ? (
        <LineChartComponent
          labels={labels}
          values={values}
          title={title}
        />
      ) : (
        <BarChartComponent
          labels={labels}
          values={values}
          title={title}
        />
      )}
    </div>
  );
}

// ─── Alert ───────────────────────────────────────────────

function AlertBlock({ block }: { block: AiBlock }) {
  const severity = (block.severity ?? "info") as string;
  const message = (block.message ?? block.content ?? "") as string;
  const colors: Record<string, string> = {
    info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
    error:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  };
  const iconMap: Record<string, React.ReactNode> = {
    info: <Info size={14} className="shrink-0 mt-0.5" />,
    warning: <TriangleAlert size={14} className="shrink-0 mt-0.5" />,
    error: <CircleX size={14} className="shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs ${colors[severity] ?? colors.info}`}
    >
      <span className="shrink-0 mt-0.5">
        {iconMap[severity] ?? iconMap.info}
      </span>
      <span>{message}</span>
    </div>
  );
}

// ─── Text ────────────────────────────────────────────────

function TextBlock({ block }: { block: AiBlock }) {
  return (
    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
      {block.content}
    </p>
  );
}

// ─── Exports ─────────────────────────────────────────────

export default function ChatBlocks({
  blocks,
  message,
}: {
  blocks: AiBlock[];
  message?: string;
}) {
  if (!blocks?.length) return null;

  return (
    <div className="mt-3 space-y-2 border-t border-slate-200 pt-2 dark:border-[#253245]">
      {blocks.map((block, i) => {
        if (
          block.type === "text" &&
          message &&
          block.content === message
        )
          return null;
        switch (block.type) {
          case "stat":
            return <StatBlock key={i} block={block} />;
          case "table":
            return <TableBlock key={i} block={block} />;
          case "card":
            return <CardBlock key={i} block={block} />;
          case "chart":
            return <ChartBlock key={i} block={block} />;
          case "alert":
            return <AlertBlock key={i} block={block} />;
          case "text":
            return <TextBlock key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
