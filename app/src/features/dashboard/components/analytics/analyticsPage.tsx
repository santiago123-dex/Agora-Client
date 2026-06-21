"use client";

import useSWR from "swr";
import { getMyWorkspaces, getWorkspaceMemberCount } from "@/app/src/lib/api/workspaces";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import { getSubmissionsByAssignment, type SubmissionResponse } from "@/app/src/lib/api/submissions";
import { ChartPie, TrendingUp, Layers } from "lucide-react";

async function fetchAnalytics() {
  try {
    const raw = await getMyWorkspaces();
    const workspaces = raw.map((w) => ({
      id: String(w.id),
      name: w.name,
      role: w.role,
      accentColor: typeof w.data?.accentColor === "string" ? w.data.accentColor : "#275D79",
    }));

    const adminWorkspaces = workspaces.filter((w) => w.role === "ADMIN");

    const workspaceData = await Promise.all(
      adminWorkspaces.map(async (ws) => {
        const [assignments, memberCount] = await Promise.all([
          getAssignmentsByWorkspace(ws.id).catch(() => []),
          getWorkspaceMemberCount(ws.id, "MEMBER").catch(() => ({ count: 0 })),
        ]);

        const submissionsLists = await Promise.all(
          assignments.map((a) =>
            getSubmissionsByAssignment(a.id).catch<SubmissionResponse[]>(() => []),
          ),
        );

        const totalSubmissions = submissionsLists.reduce((a, s) => a + s.length, 0);
        const gradedCount = submissionsLists.filter(
          (subs) => subs.length > 0 && subs.every((s) => s.result !== null),
        ).length;

        return {
          ...ws,
          assignments: assignments.length,
          submissions: totalSubmissions,
          members: memberCount.count,
          graded: gradedCount,
        };
      }),
    );

    return {
      totalWorkspaces: workspaces.length,
      totalAdmin: adminWorkspaces.length,
      totalMember: workspaces.length - adminWorkspaces.length,
      workspaceData,
    };
  } catch (err) {
    throw err instanceof Error ? err : new Error("Error al cargar las analíticas");
  }
}

function DonutChart({
  segments,
  size = 120,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const rawTotal = segments.reduce((a, b) => a + b.value, 0);
  const total = Math.max(rawTotal, 1);
  const center = size / 2;
  const radius = center * 0.7;
  const strokeWidth = center * 0.25;
  const innerRadius = radius - strokeWidth;

  let cumulative = 0;
  const paths = segments.map((s) => {
    const startAngle = (cumulative / total) * 360 - 90;
    cumulative += s.value;
    const endAngle = (cumulative / total) * 360 - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return {
      key: s.label,
      d: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${center + innerRadius * Math.cos(endRad)} ${center + innerRadius * Math.sin(endRad)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${center + innerRadius * Math.cos(startRad)} ${center + innerRadius * Math.sin(startRad)} Z`,
      fill: s.color,
      label: s.label,
      value: s.value,
      percent: Math.round((s.value / total) * 100),
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {paths.map((p) => (
          <path key={p.key} d={p.d} fill={p.fill} className="transition-all duration-500" />
        ))}
        <text x={center} y={center - 4} textAnchor="middle" className="fill-slate-950 dark:fill-slate-100 text-lg font-bold" fontSize="18">
          {rawTotal}
        </text>
        <text x={center} y={center + 10} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[9px]" fontSize="9">
          total
        </text>
      </svg>
      <div className="space-y-2">
        {paths.map((p) => (
          <div key={p.key} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: p.fill }} />
            <span className="text-slate-600 dark:text-slate-400">{p.label}</span>
            <span className="ml-auto font-semibold text-slate-900 dark:text-slate-100">{p.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useSWR("analytics", fetchAnalytics);

  if (isLoading) {
    return (
      <section className="px-4 py-6 pb-10 sm:px-7">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-2 h-3 w-20 rounded bg-slate-200" />
                <div className="h-8 w-12 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="px-4 py-6 pb-10 sm:px-7">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          {error instanceof Error ? error.message : "Error al cargar analíticas"}
        </div>
      </section>
    );
  }

  const totalTasks = data.workspaceData.reduce((a, b) => a + b.assignments, 0);
  const totalSubmissions = data.workspaceData.reduce((a, b) => a + b.submissions, 0);
  const totalMembers = data.workspaceData.reduce((a, b) => a + b.members, 0);
  const totalGraded = data.workspaceData.reduce((a, b) => a + b.graded, 0);
  const completionRate = totalTasks > 0 ? Math.round((totalGraded / totalTasks) * 100) : 0;
  const submissionRate = totalTasks > 0 ? Math.round((totalSubmissions / (totalTasks * Math.max(totalMembers, 1))) * 100) : 0;

  const donutSegments = [
    { label: "Creados", value: data.totalAdmin, color: "#275D79" },
    { label: "Participo", value: data.totalMember, color: "#94a3b8" },
  ];

  const gradedSegments = [
    { label: "Calificadas", value: totalGraded, color: "#10b981" },
    { label: "Pendientes", value: Math.max(totalTasks - totalGraded, 0), color: "#f59e0b" },
  ];

  const statCards = [
    { label: "Espacios totales", value: data.totalWorkspaces },
    { label: "Tareas creadas", value: totalTasks },
    { label: "Entregas", value: totalSubmissions },
    { label: "Completadas", value: `${completionRate}%` },
    { label: "Miembros", value: totalMembers },
    { label: "Entrega promedio", value: `${submissionRate}%` },
  ];

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Analíticas</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Resumen general de tu actividad</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-5 dark:border-[#253245] dark:bg-[#0f1a2e]"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-slate-950 dark:text-slate-100">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#253245] dark:bg-[#0f1a2e]">
            <div className="mb-5 flex items-center gap-2">
              <ChartPie size={18} className="text-[#275D79]" />
              <h2 className="text-sm font-bold text-slate-950 dark:text-slate-100">Distribución de espacios</h2>
            </div>
            <DonutChart segments={donutSegments} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#253245] dark:bg-[#0f1a2e]">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#275D79]" />
              <h2 className="text-sm font-bold text-slate-950 dark:text-slate-100">Estado de tareas</h2>
            </div>
            <DonutChart segments={gradedSegments} size={120} />
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <Layers size={18} className="text-[#275D79]" />
            <h2 className="text-sm font-bold text-slate-950 dark:text-slate-100">Desglose por espacio</h2>
          </div>
          <div className="space-y-3">
            {data.workspaceData.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-400">
                No tienes espacios como creador todavía.
              </p>
            ) : (
              data.workspaceData.map((ws) => {
                const maxVal = Math.max(ws.assignments, ws.submissions, ws.members, 1);
                return (
                  <div
                    key={ws.id}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-[#253245] dark:bg-[#0f1a2e]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: ws.accentColor }}
                      />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ws.name}</h3>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {([
                        { label: "Tareas", value: ws.assignments, color: "#275D79" },
                        { label: "Entregas", value: ws.submissions, color: "#10b981" },
                        { label: "Miembros", value: ws.members, color: "#f59e0b" },
                      ] as const).map((bar) => (
                        <div key={bar.label}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">{bar.label}</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{bar.value}</span>
                          </div>
                          <div className="mt-1.5 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.max((bar.value / maxVal) * 100, 4)}%`,
                                backgroundColor: bar.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
