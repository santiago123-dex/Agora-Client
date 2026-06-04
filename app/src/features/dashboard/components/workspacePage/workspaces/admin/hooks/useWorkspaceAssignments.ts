import useSWR from "swr";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import type { WorkspaceAdminTask } from "../../../data/workspace";
import { assignmentToAdminTask } from "../utils/assignment-mappers";

export function useWorkspaceAssignments(workspaceId: string | number) {
  const { data: rawAssignments = [], error, isLoading, mutate } = useSWR(
    workspaceId ? ["workspace-assignments", workspaceId] : null,
    async ([, id]) => {
      const assignments = await getAssignmentsByWorkspace(id);
      return assignments.map(assignmentToAdminTask);
    },
  );

  return {
    assignmentTasks: rawAssignments,
    assignmentsError: error ? (error instanceof Error ? error.message : "No se pudieron cargar las tareas") : null,
    isLoadingAssignments: isLoading,
    setAssignmentTasks: mutate,
  };
}
