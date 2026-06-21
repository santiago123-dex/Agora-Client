"use client";

import Link from "next/link";
import { PinOff } from "lucide-react";
import useSWR from "swr";
import { getMyWorkspaces, getWorkspaceMemberCount } from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "../workspacePage/data/workspace-api";
import { usePinnedWorkspaces } from "@/app/src/lib/hooks/usePinnedWorkspaces";
import DashboardHeader from "./DashboardHeader/dashboardHeader";
import DashboardStats from "./DashboardStats/dashboardStats";
import PendingTasksPanel from "./DashboardSidebardPanels/PendingTasksPanel/pendingTasksPanel";
import RecentActivityPanel from "./DashboardSidebardPanels/RecentActivityPanel/recentActivityPanel";
import DashboardSectionHeader from "./DashboardSectionHeader";
import type { AdminWorkspace, MemberWorkspace } from "../workspacePage/data/workspace";

type WorkspaceCard = AdminWorkspace | MemberWorkspace;

async function fetchWorkspaces() {
  const response = await getMyWorkspaces();
  const cards = response.map(workspaceToCard);
  return Promise.all(
    cards.map(async (w) => {
      try {
        const { count } = await getWorkspaceMemberCount(w.id);
        if (w.roleLabel === "admin") {
          return { ...w, adminStats: w.adminStats ? { ...w.adminStats, members: count } : undefined };
        }
        return { ...w, memberStats: w.memberStats ? { ...w.memberStats, members: count } : undefined };
      } catch {
        return w;
      }
    }),
  );
}

function Section({ title, cards, togglePin }: {
  title: string;
  cards: WorkspaceCard[];
  togglePin: (id: string) => void;
}) {
  if (cards.length === 0) {
    return (
      <section className="space-y-5">
        <DashboardSectionHeader title={title} href="/dashboard/workspace" />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-8 text-center dark:border-[#253245] dark:bg-[#0f1a2e]">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No tienes espacios fijados en esta sección.
          </p>
          <Link
            href="/dashboard/workspace"
            className="mt-2 inline-flex text-sm font-medium text-[#275D79] hover:text-[#1f4a61] dark:text-[#3a7fa0]"
          >
            Ir a mis espacios
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <DashboardSectionHeader title={title} href="/dashboard/workspace" />
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((workspace) => (
          <div key={workspace.id} className="group relative">
            <Link href={`/dashboard/workspace/${workspace.id}?from=dashboard`}>
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-[#275D79]/10 dark:border-[#253245] dark:bg-[#0f1a2e]">
                <div
                  className="flex h-16 items-end px-3 pb-3"
                  style={{ backgroundColor: workspace.accentColor }}
                >
                  <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
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
    </section>
  );
}

export default function DashboardPage() {
  const { data: allWorkspaces = [], isLoading } = useSWR("dashboard-workspaces", fetchWorkspaces);
  const { pinnedIds, ready, togglePin } = usePinnedWorkspaces();

  const adminPinned = ready
    ? allWorkspaces.filter((w) => pinnedIds.includes(w.id) && w.roleLabel === "admin")
    : [];
  const memberPinned = ready
    ? allWorkspaces.filter((w) => pinnedIds.includes(w.id) && w.roleLabel === "member")
    : [];

  return (
    <>
      <DashboardHeader />

      <section className="px-4 pb-10 sm:px-7">
        <div className="mb-8">
          <DashboardStats />
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_20rem] xl:gap-10 [@media(min-width:1450px)]:grid-cols-[minmax(0,1.7fr)_30rem] [@media(min-width:1450px)]:gap-8">
          <div className="space-y-10">
            <Section
              title="Mis Espacios de Trabajo"
              cards={adminPinned}
              togglePin={togglePin}
            />
            <Section
              title="Espacios donde participo"
              cards={memberPinned}
              togglePin={togglePin}
            />
          </div>

          <aside className="space-y-8 xl:pt-[2.85rem]">
            <PendingTasksPanel />
            <RecentActivityPanel />
          </aside>
        </div>
      </section>
    </>
  );
}
