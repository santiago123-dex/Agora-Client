export type AssignmentStatus = "BORRADOR" | "PUBLICADO" | "CERRADO";


export type CreateAssignmentPayload = {
  workspaceId: number;
  name: string;
  description?: string;
  dueDate: string;
  status?: AssignmentStatus;
  rubric?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

export type AssignmentResponse = {
  id: number;
  workspaceId: number;
  name: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  rubric: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  isExpired: boolean;
}

import { bffFetch } from "./bff-client";

export function createAssignment(payload: CreateAssignmentPayload) {
  return bffFetch<AssignmentResponse>("/api/workspaces/assignments", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => {
    import("sonner").then(({ toast }) => toast.success("Tarea creada"));
    return res;
  });
}

export function getAssignmentsByWorkspace(workspaceId: string | number) {
  return bffFetch<AssignmentResponse[]>(
    `/api/workspaces/assignments?workspaceId=${workspaceId}`
  );
}

export function getAssignmentById(assignmentId: string | number) {
  return bffFetch<AssignmentResponse>(
    `/api/workspaces/assignments/${assignmentId}`,
  );
}

export function updateAssignment(assignmentId: string | number, payload: CreateAssignmentPayload) {
  return bffFetch<AssignmentResponse>(
    `/api/workspaces/assignments/${assignmentId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export function deleteAssignment(assignmentId: string | number) {
  return bffFetch<void>(`/api/workspaces/assignments/${assignmentId}`, {
    method: "DELETE",
  });
}