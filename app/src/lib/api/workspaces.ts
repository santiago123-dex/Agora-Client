export type WorkspaceStatus = "BORRADOR" | "ACTIVO" | "ARCHIVADO";
export type WorkspaceRole = "ADMIN" | "MEMBER";

export type WorkspaceData = {
  code?: string;
  accentColor?: string;
  [key: string]: unknown;
};

export type WorkspaceResponse = {
  id: number;
  name: string;
  description: string;
  status: WorkspaceStatus;
  message?: string;
  data?: WorkspaceData | null;
};

export type WorkspaceMemberResponse = {
  id: number;
  workspaceId: number;
  userId: string;
  role: WorkspaceRole;
  message?: string;
};

export type WorkspaceWithRole = WorkspaceResponse & {
  role: WorkspaceRole;
  membershipId: number;
  memberUserId: string;
};

export type CreateWorkspacePayload = {
  name: string;
  description: string;
  accentColor: string;
};

export type UpdateWorkspacePayload = {
  name: string;
  description: string;
  accentColor: string;
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
    throw new Error(data?.message ?? "Ocurrió un error en la petición");
  }

  return data as T;
}

export function getMyWorkspaces() {
  return localFetch<WorkspaceWithRole[]>("/api/workspaces");
}

export function getWorkspaceById(id: string | number) {
  return localFetch<WorkspaceWithRole>(`/api/workspaces/${id}`);
}

export function getWorkspaceInvitationCode(id: string | number) {
  return localFetch<{ workspaceId: number; code: string }>(
    `/api/workspaces/${id}/invitation-code`
  );
}

export function createWorkspace(payload: CreateWorkspacePayload) {
  return localFetch<WorkspaceWithRole>("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateWorkspace(id:string | number, payload:UpdateWorkspacePayload){
  return localFetch<WorkspaceWithRole>(`/api/workspaces/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function joinWorkspace(code: string) {
  return localFetch<WorkspaceWithRole>("/api/workspaces/join", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function deleteWorkspace(id: string | number) {
  return localFetch<void>(`/api/workspaces/${id}`, {
    method: "DELETE",
  });
}