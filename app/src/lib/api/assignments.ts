import { clearSessionCookies } from "@/app/src/lib/auth/session-client";

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

async function localFetch<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      await clearSessionCookies().catch(() => null);
      window.location.href = "/auth/login";
    }

    throw new Error(data?.message ?? "Ocurrió un error en la petición");
  }

  return data as T;
}

export function createAssignment(payload: CreateAssignmentPayload) {
  return localFetch<AssignmentResponse>("/api/workspaces/assignments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAssignmentsByWorkspace(workspaceId: string | number) {
  return localFetch<AssignmentResponse[]>(
    `/api/workspaces/assignments?workspaceId=${workspaceId}`
  );
}

export function getAssignmentById(assignmentId: string | number) {
  return localFetch<AssignmentResponse>(
    `/api/workspaces/assignments/${assignmentId}`,
  );
}

export function updateAssignment(
  assignmentId: string | number,
  payload: CreateAssignmentPayload
) {
  return localFetch<AssignmentResponse>(
    `/api/workspaces/assignments/${assignmentId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export function deleteAssignment(assignmentId: string | number) {
  return localFetch<void>(`/api/workspaces/assignments/${assignmentId}`, {
    method: "DELETE",
  });
}