"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PinOff } from "lucide-react";
import { getMyWorkspaces, getWorkspaceMemberCount } from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "../../../workspacePage/data/workspace-api";
import { usePinnedWorkspaces } from "@/app/src/lib/hooks/usePinnedWorkspaces";
import type { AdminWorkspace, MemberWorkspace } from "../../../workspacePage/data/workspace";

type Role = "admin" | "member";
type WorkspaceCard = AdminWorkspace | MemberWorkspace;

type Props = {
  role: Role;
};

export default function PinnedWorkspacesSection({ role }: Props) {
  const { pinnedIds, ready, togglePin } = usePinnedWorkspaces();
  const [cards, setCards] = useState<WorkspaceCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    const roleIds = pinnedIds; // we filter by role after fetching

    if (roleIds.length === 0) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getMyWorkspaces()
      .then(async (response) => {
        const all = response.map(workspaceToCard);
        const matched = all
          .filter((w) => pinnedIds.includes(w.id))
          .filter((w) => w.roleLabel === role);

        const withCounts = await Promise.all(
          matched.map(async (w) => {
            let count = 0;
            try {
              const res = await getWorkspaceMemberCount(w.id, "MEMBER");
              count = res.count;
            } catch { /* ignore */ }
            if (w.roleLabel === "admin") {
              return { ...w, adminStats: w.adminStats ? { ...w.adminStats, members: count } : undefined };
            }
            return { ...w, memberStats: w.memberStats ? { ...w.memberStats, members: count } : undefined };
          }),
        );

        setCards(withCounts);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Error al cargar espacios");
      })
      .finally(() => setIsLoading(false));
  }, [pinnedIds, ready, role]);

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#253245] dark:bg-[#0f1a2e]">
            <div className="h-16 bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2 px-4 py-4">
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 py-10 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center dark:border-[#253245] dark:bg-[#0f1a2e]">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {role === "admin"
            ? "No tienes espacios creados fijados."
            : "No tienes espacios donde participas fijados."}
        </p>
        <Link
          href="/dashboard/workspace"
          className="mt-2 inline-flex text-sm font-medium text-[#275D79] hover:text-[#1f4a61] dark:text-[#3a7fa0]"
        >
          Ir a mis espacios
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {cards.map((workspace) => (
        <div key={workspace.id} className="group relative">
          <Link href={`/dashboard/workspace/${workspace.id}?from=dashboard`}>
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-[#275D79]/10 dark:border-[#253245] dark:bg-[#0f1a2e]">
              <div
                className="flex h-16 items-end px-3 pb-3"
                style={{ backgroundColor: workspace.accentColor }}
              >
                <span className="rounded-md bg-white/18 px-2 py-1 text-[0.68rem] font-medium text-white backdrop-blur-sm">
                  {workspace.roleLabel === "admin" ? "creado" : "miembro"}
                </span>
              </div>
              <div className="space-y-1 px-4 py-4 [@media(min-width:1450px)]:py-7">
                <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-slate-100">
                  {workspace.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{workspace.secondaryLabel}</p>
              </div>
            </article>
          </Link>
          <button
            type="button"
            onClick={() => togglePin(workspace.id)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-400 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-rose-500 group-hover:opacity-100 dark:bg-slate-700/80 dark:hover:bg-slate-700 dark:hover:text-rose-400"
            title="Desfijar"
          >
            <PinOff size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
