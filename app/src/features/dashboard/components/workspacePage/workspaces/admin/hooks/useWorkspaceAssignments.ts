import { useEffect, useState } from "react";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import type { WorkspaceAdminTask } from "../../../data/workspace";
import { assignmentToAdminTask } from "../utils/assignment-mappers";

export function useWorkspaceAssignments(workspaceId: string | number) {
  const [assignmentTasks, setAssignmentTasks] = useState<WorkspaceAdminTask[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAssignments() {
      setIsLoadingAssignments(true);
      setAssignmentsError(null);

      try {
        const assignments = await getAssignmentsByWorkspace(workspaceId);

        if (!isActive) return;

        setAssignmentTasks(assignments.map(assignmentToAdminTask));
      } catch (error) {
        if (!isActive) return;

        setAssignmentsError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las tareas"
        );
      } finally {
        if (isActive) {
          setIsLoadingAssignments(false);
        }
      }
    }

    loadAssignments();

    return () => {
      isActive = false;
    };
  }, [workspaceId]);

  return {
    assignmentTasks,
    assignmentsError,
    isLoadingAssignments,
    setAssignmentTasks,
  };
}
