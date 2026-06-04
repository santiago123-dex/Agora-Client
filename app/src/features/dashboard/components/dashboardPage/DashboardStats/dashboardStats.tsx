"use client";

import useSWR from "swr";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "@/app/src/features/dashboard/components/workspacePage/data/workspace-api";

export default function DashboardStats() {
  const { data: workspaces, isLoading } = useSWR(
    "dashboard-stats",
    async () => {
      const response = await getMyWorkspaces();
      return response.map(workspaceToCard);
    },
  );

  const total = workspaces?.length ?? 0;
  const adminCount = workspaces?.filter((w) => w.roleLabel === "admin").length ?? 0;
  const memberCount = workspaces?.filter((w) => w.roleLabel === "member").length ?? 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm"
          >
            <div className="mb-2 h-3 w-16 rounded bg-slate-200" />
            <div className="h-7 w-10 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Mis espacios", value: total, color: "text-[#275D79]" },
    { label: "Creé", value: adminCount, color: "text-emerald-600" },
    { label: "Participo", value: memberCount, color: "text-amber-600" },
    { label: "Total miembros", value: "—", color: "text-slate-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
        >
          <p className="text-xs font-medium text-slate-500">{stat.label}</p>
          <p className={`mt-1.5 text-2xl font-bold tabular-nums ${stat.color}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
