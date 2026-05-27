import { useEffect, useState } from "react";
import {
  getWorkspaceMembers,
  type WorkspaceMemberDetailsResponse,
} from "@/app/src/lib/api/workspaces";

export function useWorkspaceMembers(workspaceId: string | number) {
  const [members, setMembers] = useState<WorkspaceMemberDetailsResponse[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMembers() {
      setIsLoadingMembers(true);
      setMembersError(null);

      try {
        const data = await getWorkspaceMembers(workspaceId);

        if (isMounted) {
          setMembers(data);
        }
      } catch (error) {
        if (isMounted) {
          setMembersError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los miembros"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingMembers(false);
        }
      }
    }

    loadMembers();

    return () => {
      isMounted = false;
    };
  }, [workspaceId]);

  return {
    members,
    isLoadingMembers,
    membersError,
    setMembers,
  };
}