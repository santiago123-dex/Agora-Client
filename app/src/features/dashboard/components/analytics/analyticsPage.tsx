"use client";

import useSWR from "swr";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import { getSubmissionsByAssignment } from "@/app/src/lib/api/submissions";
import { getWorkspaceMemberCount } from "@/app/src/lib/api/workspaces";

async function fetchAnalytics() {
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
        getWorkspaceMemberCount(ws.id).catch(() => ({ count: 0 })),
      ]);

      const submissionCounts = await Promise.all(
        assignments.map((a) =>
          getSubmissionsByAssignment(a.id)
            .then((s) => s.length)
            .catch(() => 0),
        ),
      );

      const totalSubmissions = submissionCounts.reduce((a, b) => a + b, 0);
      const gradedCount = assignments.filter((a) => a.isExpired || a.status === "CERRADO").length;

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
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useSWR("analytics", fetchAnalytics);

  if (isLoading) {
    return (
      <section className="px-4 py-6 pb-10 sm:px-7">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-950">Analíticas</h1>
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
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
        <p className="text-sm text-red-600">Error al cargar analíticas</p>
      </section>
    );
  }

  const stats = [
    { label: "Espacios totales", value: data.totalWorkspaces },
    { label: "Espacios creados", value: data.totalAdmin },
    { label: "Donde participo", value: data.totalMember },
    { label: "Tareas totales", value: data.workspaceData.reduce((a, b) => a + b.assignments, 0) },
    { label: "Entregas recibidas", value: data.workspaceData.reduce((a, b) => a + b.submissions, 0) },
    { label: "Miembros totales", value: data.workspaceData.reduce((a, b) => a + b.members, 0) },
  ];

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Analíticas</h1>
          <p className="mt-1 text-sm text-slate-500">Resumen general de tu actividad</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
            >
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-slate-950">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">Desglose por espacio</h2>
          <div className="mt-4 space-y-3">
            {data.workspaceData.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
                No tienes espacios como creador todavía.
              </p>
            ) : (
              data.workspaceData.map((ws) => {
                const maxVal = Math.max(ws.assignments, ws.submissions, ws.members, 1);
                return (
                  <div
                    key={ws.id}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: ws.accentColor }}
                      />
                      <h3 className="text-sm font-semibold text-slate-900">{ws.name}</h3>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {([
                        { label: "Tareas", value: ws.assignments },
                        { label: "Entregas", value: ws.submissions },
                        { label: "Miembros", value: ws.members },
                      ] as const).map((bar) => (
                        <div key={bar.label}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">{bar.label}</span>
                            <span className="font-semibold text-slate-800">{bar.value}</span>
                          </div>
                          <div className="mt-1 h-2 rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.max((bar.value / maxVal) * 100, 4)}%`,
                                backgroundColor: ws.accentColor,
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
