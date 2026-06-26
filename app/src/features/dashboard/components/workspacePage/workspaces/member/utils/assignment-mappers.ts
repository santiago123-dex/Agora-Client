import type { AssignmentResponse } from "@/app/src/lib/api/assignments";
import type { SubmissionResponse } from "@/app/src/lib/api/submissions";
import type { WorkspaceMemberTask } from "../../../data/workspace";
import { getAssignmentPoints } from "../../admin/utils/assignment-mappers";

function formatDueDate(dueDate: string) {
  return new Date(dueDate).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getSubmissionScore(submission?: SubmissionResponse) {
  const result = submission?.result;

  if (!result) return undefined;

  const directScore = result.grade ?? result.score ?? result.points;
  if (typeof directScore === "number") return directScore;

  const teacher = result.teacher;
  if (teacher && typeof teacher === "object") {
    const score = (teacher as Record<string, unknown>).score;
    if (typeof score === "number") return score;
  }

  return undefined;
}

// Va a retonar un WorkspaceMemberTask
export function assignmentToMemberTask(
  assignment: AssignmentResponse,
  submission?: SubmissionResponse,
): WorkspaceMemberTask {
  const isClosed = assignment.status === "CERRADO";
  const score = getSubmissionScore(submission);
  const wasSubmitted = Boolean(submission);

  if (typeof score === "number") {
    const maxScore = getAssignmentPoints(assignment);
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : score;
    return {
      id: String(assignment.id),
      title: assignment.name,
      description: assignment.description,
      dueLabel: formatDueDate(assignment.dueDate),
      points: getAssignmentPoints(assignment),
      taskState: "graded",
      gradeLabel: `${score}/${maxScore} (${pct}%)`,
      actionLabel: undefined,
    };
  }

  if (wasSubmitted) {
    return {
      id: String(assignment.id),
      title: assignment.name,
      description: assignment.description,
      dueLabel: formatDueDate(assignment.dueDate),
      points: getAssignmentPoints(assignment),
      taskState: "submitted",
      gradeLabel: "Entregada",
      actionLabel: undefined,
    };
  }

  return {
    id: String(assignment.id),
    title: assignment.name,
    description: assignment.description,
    dueLabel: formatDueDate(assignment.dueDate),
    points: getAssignmentPoints(assignment),
    taskState: isClosed ? "graded" : "pending_submission",
    gradeLabel: isClosed ? "Pendiente" : undefined,
    actionLabel: isClosed ? undefined : "Entregar tarea",
  };
}
