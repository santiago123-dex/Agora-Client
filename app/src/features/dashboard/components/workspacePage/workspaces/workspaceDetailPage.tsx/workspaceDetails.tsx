"use client";

import { useEffect, useState } from "react";
import { getWorkspaceById, getWorkspaceInvitationCode } from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "../../data/workspace-api";
import WorkspaceAdmin from "../admin/workspaceAdmin";
import WorkspaceMember from "../member/workspaceMember";
import { AdminWorkspace, MemberWorkspace } from "../../data/workspace";

type WorkspaceDetailsProps = {
  workspaceId: string;
};

export default function WorkspaceDetails({ workspaceId }: WorkspaceDetailsProps) {
  const [workspace, setWorkspace] = useState<AdminWorkspace | MemberWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspace() {
      setIsLoading(true);
      setError(null);

      try {
        const [response, invitation] = await Promise.all([
          getWorkspaceById(workspaceId),
          getWorkspaceInvitationCode(workspaceId),
        ]);

        setWorkspace(
          workspaceToCard({
            ...response,
            data: {
              ...(response.data ?? {}),
              code: invitation.code,
            },
          })
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "No se pudo cargar el workspace");
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkspace();
  }, [workspaceId]);

  if (isLoading) {
    return <div className="p-7 text-sm text-slate-500">Cargando workspace...</div>;
  }

  if (error) {
    return <div className="p-7 text-sm text-red-600">{error}</div>;
  }

  if (!workspace) {
    return <div className="p-7 text-sm text-slate-500">Workspace no encontrado</div>;
  }

  if (workspace.roleLabel === "admin") {
    return <WorkspaceAdmin workspace={workspace} />;
  }

  return <WorkspaceMember workspace={workspace} />;
}
