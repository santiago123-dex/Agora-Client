"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Layers, Pen, Users, UserPlus } from "lucide-react";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "@/app/src/features/dashboard/components/workspacePage/data/workspace-api";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    const start = performance.now();
    const duration = 600;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value]);

  return <>{display}</>;
}

const cards = [
  {
    label: "Mis espacios",
    icon: Layers,
    bg: "bg-[#275D79]/10",
    iconColor: "text-[#275D79]",
    valueColor: "text-[#275D79]",
    getValue: (total: number) => total,
  },
  {
    label: "Creé",
    icon: Pen,
    bg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-600",
    getValue: (_total: number, admin: number) => admin,
  },
  {
    label: "Participo",
    icon: UserPlus,
    bg: "bg-amber-100",
    iconColor: "text-amber-600",
    valueColor: "text-amber-600",
    getValue: (_total: number, _admin: number, member: number) => member,
  },
  {
    label: "Total miembros",
    icon: Users,
    bg: "bg-slate-100",
    iconColor: "text-slate-600",
    valueColor: "text-slate-600",
    getValue: () => "—",
  },
] as const;

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
            className="animate-pulse rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
          >
            <div className="mb-3 h-8 w-8 rounded-lg bg-slate-200" />
            <div className="mb-2 h-3 w-16 rounded bg-slate-200" />
            <div className="h-7 w-10 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(total, adminCount, memberCount);

        return (
          <div
            key={card.label}
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#275D79]/5"
          >
            <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${card.bg} ${card.iconColor}`}>
              <Icon size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${card.valueColor}`}>
              {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
