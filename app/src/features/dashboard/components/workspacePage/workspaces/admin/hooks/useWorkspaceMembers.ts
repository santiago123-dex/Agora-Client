import useSWR from "swr";
import {
  getWorkspaceMembers,
  type WorkspaceMemberDetailsResponse,
} from "@/app/src/lib/api/workspaces";

export function useWorkspaceMembers(workspaceId: string | number) {
  const { data: members = [], error, isLoading, mutate } = useSWR(
    workspaceId ? ["workspace-members", workspaceId] : null,
    ([, id]) => getWorkspaceMembers(id),
  );

  return {
    members,
    isLoadingMembers: isLoading,
    membersError: error ? (error instanceof Error ? error.message : "No se pudieron cargar los miembros") : null,
    setMembers: mutate,
  };
}