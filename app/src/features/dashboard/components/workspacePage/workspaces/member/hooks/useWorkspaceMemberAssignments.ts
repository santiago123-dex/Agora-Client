import { useEffect, useState } from "react";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import { getMySubmissionsByWorkspace } from "@/app/src/lib/api/submissions";
import type { WorkspaceMemberTask } from "../../../data/workspace";
import { assignmentToMemberTask } from "../utils/assignment-mappers";

export function useWorkspaceMemberAssignments(
  workspaceId: string | number,
  initialTasks: WorkspaceMemberTask[] = []
) {
  const [memberTasks, setMemberTasks] = useState<WorkspaceMemberTask[]>(initialTasks);
  const [isLoadingMemberTasks, setIsLoadingMemberTasks] = useState(false);
  const [memberTasksError, setMemberTasksError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAssignments() {
      setIsLoadingMemberTasks(true);
      setMemberTasksError(null);

      try {
        const [assignments, submissions] = await Promise.all([
          getAssignmentsByWorkspace(workspaceId),
          getMySubmissionsByWorkspace(workspaceId),
        ]);

        if (!isActive) return;

        const submissionsByAssignmentId = new Map(
          submissions.map((submission) => [String(submission.assignmentId), submission]),
        );

        setMemberTasks(
          assignments
            .filter((assignment) => assignment.status !== "BORRADOR")
            .map((assignment) =>
              assignmentToMemberTask(
                assignment,
                submissionsByAssignmentId.get(String(assignment.id)),
              ),
            ),
        );
      } catch (error) {
        if (!isActive) return;

        setMemberTasksError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las tareas"
        );
      } finally {
        if (isActive) {
          setIsLoadingMemberTasks(false);
        }
      }
    }

    loadAssignments();

    return () => {
      isActive = false;
    };
  }, [workspaceId]);

  return {
    memberTasks,
    isLoadingMemberTasks,
    memberTasksError,
    setMemberTasks,
  };
}
