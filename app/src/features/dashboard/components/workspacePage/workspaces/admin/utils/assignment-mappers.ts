import type { AssignmentResponse } from "@/app/src/lib/api/assignments";
import type { WorkspaceAdminTask } from "../../../data/workspace";

export function getAssignmentPoints(assignment: AssignmentResponse) {
  const rubric = assignment.rubric;

  if (typeof rubric?.totalWeight === "number") {
    return rubric.totalWeight;
  }

  if (typeof rubric?.points === "number") {
    return rubric.points;
  }
  // verifica que sea un objeto y que dentro de criterion este el valor de "weight"
  if (Array.isArray(rubric?.criteria)) {
    return rubric.criteria.reduce((total, criterion) => {
      if (
        criterion &&
        typeof criterion === "object" &&
        "weight" in criterion &&
        typeof criterion.weight === "number"
      ) {
        return total + criterion.weight;
      }

      return total;
    }, 0);
  }

  return 100;
}

export function assignmentToAdminTask(
  assignment: AssignmentResponse
): WorkspaceAdminTask {
  return {
    id: String(assignment.id),
    title: assignment.name,
    description: assignment.description,
    dueLabel: new Date(assignment.dueDate).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    points: getAssignmentPoints(assignment),
    doneCount: 0,
    totalCount: 0,
    taskState:
      assignment.status === "CERRADO"
        ? "graded"
        : assignment.isExpired
          ? "pending_grade"
          : "upcoming",
  };
}
