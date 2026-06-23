"use client";

import useSWR from "swr";
import { getWorkspaceById, getWorkspaceInvitationCode, getWorkspaceMemberCount } from "@/app/src/lib/api/workspaces";
import { workspaceToCard } from "../../data/workspace-api";
import WorkspaceAdmin from "../admin/workspaceAdmin";
import WorkspaceMember from "../member/workspaceMember";
import { AdminWorkspace, MemberWorkspace } from "../../data/workspace";

type WorkspaceDetailsProps = {
  workspaceId: string;
};

export default function WorkspaceDetails({ workspaceId }: WorkspaceDetailsProps) {
  const { data: workspace, error, isLoading } = useSWR(
    workspaceId ? ["workspace", workspaceId] : null,
    async ([, id]) => {
      const [response, invitation] = await Promise.all([
        getWorkspaceById(id),
        getWorkspaceInvitationCode(id),
      ]);
      const card = workspaceToCard({
        ...response,
        data: {
          ...(response.data ?? {}),
          code: invitation.code,
        },
      });

      const { count } = await getWorkspaceMemberCount(id, "MEMBER").catch(() => ({ count: 0 }));

      if (card.roleLabel === "admin") {
        (card as AdminWorkspace).adminStats = {
          ...(card as AdminWorkspace).adminStats!,
          members: count,
        };
      } else {
        (card as MemberWorkspace).memberStats = {
          ...(card as MemberWorkspace).memberStats!,
          members: count,
        };
      }

      return card;
    },
  );

  if (isLoading) {
    return <div className="p-7 text-sm text-slate-500">Cargando workspace...</div>;
  }

  if (error) {
    return <div className="p-7 text-sm text-red-600">{error instanceof Error ? error.message : "Error al cargar el workspace"}</div>;
  }

  if (!workspace) {
    return <div className="p-7 text-sm text-slate-500">Workspace no encontrado</div>;
  }

  if (workspace.roleLabel === "admin") {
    return <WorkspaceAdmin workspace={workspace} />;
  }

  return <WorkspaceMember workspace={workspace} />;
}
