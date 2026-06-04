import Link from "next/link";

import DashboardHeader from "./DashboardHeader/dashboardHeader";
import DashboardStats from "./DashboardStats/dashboardStats";
import CreatedWorkspaceSection from "./WorkspaceSection/CreatedWorkspaceSection/createdWorkspaceSection";
import JoinedWorkspaceSection from "./WorkspaceSection/JoinedWorkspaceSection/joinedWorkspaceSection";
import PendingTasksPanel from "./DashboardSidebardPanels/PendingTasksPanel/pendingTasksPanel";
import RecentActivityPanel from "./DashboardSidebardPanels/RecentActivityPanel/recentActivityPanel";

type DashboardSectionHeaderProps = {
  title: string;
  href: string;
};

function DashboardSectionHeader({
  title,
  href,
}: DashboardSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-slate-950">
        {title}
      </h3>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-[#275D79]"
      >
        Ver todos
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />

      <section className="px-4 pb-10 sm:px-7">
        <div className="mb-8">
          <DashboardStats />
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_20rem] xl:gap-10 [@media(min-width:1450px)]:grid-cols-[minmax(0,1.7fr)_30rem] [@media(min-width:1450px)]:gap-8">
          <div className="space-y-10">
            <section className="space-y-5">
              <DashboardSectionHeader
                title="Mis Espacios de Trabajo"
                href="/dashboard/workspace"
              />
              <CreatedWorkspaceSection />
            </section>

            <section className="space-y-5">
              <DashboardSectionHeader
                title="Espacios donde participo"
                href="/dashboard/workspace"
              />
              <JoinedWorkspaceSection />
            </section>
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
