"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Layers, Pen, Users, UserPlus } from "lucide-react";
import { getMyWorkspaces, getWorkspaceMemberCount } from "@/app/src/lib/api/workspaces";
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
    bg: "bg-[#275D79]/10 dark:bg-[#275D79]/20",
    iconColor: "text-[#275D79] dark:text-[#275D79]",
    valueColor: "text-[#275D79] dark:text-[#275D79]",
    getValue: (total: number) => total,
  },
  {
    label: "Creé",
    icon: Pen,
    bg: "bg-[#275D79]/10 dark:bg-[#275D79]/20",
    iconColor: "text-[#275D79] dark:text-[#275D79]",
    valueColor: "text-[#275D79] dark:text-[#275D79]",
    getValue: (_total: number, admin: number) => admin,
  },
  {
    label: "Participo",
    icon: UserPlus,
    bg: "bg-[#275D79]/10 dark:bg-[#275D79]/20",
    iconColor: "text-[#275D79] dark:text-[#275D79]",
    valueColor: "text-[#275D79] dark:text-[#275D79]",
    getValue: (_total: number, _admin: number, member: number) => member,
  },
  {
    label: "Total miembros",
    icon: Users,
    bg: "bg-[#275D79]/10 dark:bg-[#275D79]/20",
    iconColor: "text-[#275D79] dark:text-[#275D79]",
    valueColor: "text-[#275D79] dark:text-[#275D79]",
    getValue: (_total: number, _admin: number, _member: number, totalMembers: number) => totalMembers,
  },
] as const;

export default function DashboardStats() {
  const { data, isLoading } = useSWR(
    "dashboard-stats",
    async () => {
      const response = await getMyWorkspaces();
      const cards = response.map(workspaceToCard);
      const memberCounts = await Promise.all(
        cards.map((w) =>
          getWorkspaceMemberCount(w.id).then((r) => r.count).catch(() => 0),
        ),
      );
      return { cards, totalMembers: memberCounts.reduce((a, b) => a + b, 0) };
    },
  );

  const workspaces = data?.cards ?? [];
  const totalMembers = data?.totalMembers ?? 0;
  const total = workspaces.length;
  const adminCount = workspaces.filter((w) => w.roleLabel === "admin").length;
  const memberCount = workspaces.filter((w) => w.roleLabel === "member").length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]"
          >
            <div className="mb-3 h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="mb-2 h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-7 w-10 rounded bg-slate-100 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(total, adminCount, memberCount, totalMembers);

        return (
          <div
            key={card.label}
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#275D79]/5 dark:border-[#253245] dark:bg-[#0f1a2e] dark:hover:shadow-[#275D79]/10"
          >
            <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${card.bg} ${card.iconColor}`}>
              <Icon size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${card.valueColor}`}>
              {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
