"use client";

import useSWR from "swr";
import { Check, ArrowUp, UserPlus, Clock, Bell } from "lucide-react";
import { getRecentActivity } from "@/app/src/lib/api/dashboard";
import type { ActivityType } from "@/app/src/lib/api/dashboard";

const activityConfig: Record<ActivityType, { icon: React.ReactNode; bg: string; color: string; dot: string }> = {
  submission: {
    icon: <Check size={16} />,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  grade: {
    icon: <ArrowUp size={16} />,
    bg: "bg-blue-100",
    color: "text-blue-600",
    dot: "bg-blue-500",
  },
  join: {
    icon: <UserPlus size={16} />,
    bg: "bg-amber-100",
    color: "text-amber-600",
    dot: "bg-amber-500",
  },
};

export default function RecentActivityPanel() {
  const { data, error, isLoading } = useSWR("recent-activity", getRecentActivity);

  const activities = data?.activities ?? [];

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-300" />
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-4 space-y-2">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 py-1">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-300" />
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-950">Actividad Reciente</h3>
              <p className="mt-0.5 text-sm text-slate-500">No disponible</p>
            </div>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Clock size={15} />
            </span>
          </div>
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error instanceof Error ? error.message : "Error al cargar actividad"}
          </p>
        </div>
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-300" />
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-950">Actividad Reciente</h3>
              <p className="mt-0.5 text-sm text-slate-500">Sin novedades</p>
            </div>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <Bell size={15} />
            </span>
          </div>
          <div className="flex flex-col items-center py-6 text-center">
            <p className="text-sm text-slate-500">No hay actividad reciente.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-300" />
      <div className="px-5 py-5 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-950">Actividad Reciente</h3>
          <p className="mt-0.5 text-sm text-slate-500">Últimas novedades</p>
        </div>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <Clock size={15} />
        </span>
      </div>

      <div className="space-y-1">
        {activities.map((item, i) => {
          const cfg = activityConfig[item.type];
          const isLast = i === activities.length - 1;

          return (
            <div key={item.id} className="group relative flex gap-4 px-1 py-2 transition-all hover:bg-slate-50/60 rounded-xl">
              <div className="flex flex-col items-center">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.bg} ${cfg.color} transition-transform group-hover:scale-110`}>
                  {cfg.icon}
                </div>
                {!isLast && (
                  <div className="mt-1 h-full w-px bg-slate-200" />
                )}
              </div>

              <div className="min-w-0 flex-1 pb-4">
                <h4 className="text-sm font-medium leading-5 text-slate-900 transition-colors group-hover:text-[#275D79]">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.context}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">{item.time}</p>
              </div>

              {i === 0 && (
                <span className={`absolute right-2 top-3 h-2 w-2 rounded-full ${cfg.dot}`} />
              )}
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
