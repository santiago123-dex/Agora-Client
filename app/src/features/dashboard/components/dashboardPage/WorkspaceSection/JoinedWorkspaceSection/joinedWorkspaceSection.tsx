"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "../../../workspacePage/data/workspace-api";
import type { MemberWorkspace } from "../../../workspacePage/data/workspace";

export default function JoinedWorkspaceSection() {
  const [workspaces, setWorkspaces] = useState<MemberWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyWorkspaces()
      .then((response) => {
        const memberWorkspaces = response
          .map(workspaceToCard)
          .filter((workspace): workspace is MemberWorkspace => workspace.roleLabel === "member")
          .slice(0, 2);

        setWorkspaces(memberWorkspaces);
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : "No se pudieron cargar los espacios");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="h-16 bg-slate-200" />
            <div className="space-y-2 px-4 py-4">
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 py-10 text-center text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (workspaces.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
        Aún no participas en otros espacios.
      </p>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {workspaces.map((workspace) => (
        <Link href={`/dashboard/workspace/${workspace.id}?from=dashboard`} key={workspace.id}>
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
              className="flex h-16 items-end px-3 pb-3"
              style={{ backgroundColor: workspace.accentColor }}
            >
              <span className="rounded-md bg-white/18 px-2 py-1 text-[0.68rem] font-medium text-white backdrop-blur-sm">
                {workspace.roleLabel}
              </span>
            </div>

            <div className="space-y-1 px-4 py-4 [@media(min-width:1450px)]:py-7">
              <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                {workspace.title}
              </h4>
              <p className="text-sm text-slate-500">{workspace.secondaryLabel}</p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
