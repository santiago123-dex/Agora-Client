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

export type WorkspaceMemberDetailsResponse = {
  id: number;
  workspaceId: number;
  userId: string;
  role: WorkspaceRole;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string | null;
}

import { bffFetch } from "./bff-client";

export function getMyWorkspaces() {
  return bffFetch<WorkspaceWithRole[]>("/api/workspaces");
}

export function getWorkspaceById(id: string | number) {
  return bffFetch<WorkspaceWithRole>(`/api/workspaces/${id}`);
}

export function getWorkspaceInvitationCode(id: string | number) {
  return bffFetch<{ workspaceId: number; code: string }>(
    `/api/workspaces/${id}/invitation-code`
  );
}

export function getWorkspaceMembers(workspaceId: string | number){
  return bffFetch<WorkspaceMemberDetailsResponse[]>(`/api/workspaces/${workspaceId}/members`);
}

export function getWorkspaceMemberCount(workspaceId: string | number) {
  return bffFetch<{ count: number }>(
    `/api/workspaces/${workspaceId}/members/count`
  );
}

export function createWorkspace(payload: CreateWorkspacePayload) {
  return bffFetch<WorkspaceWithRole>("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(async (workspace) => {
    try {
      const [{ toast }, { createNotification }] = await Promise.all([
        import("sonner"),
        import("./notifications"),
      ]);
      toast.success(`"${workspace.name}" creado`);
      await createNotification(
        "Espacio creado",
        `"${workspace.name}" fue creado exitosamente`,
      );
    } catch { /* fire-and-forget */ }
    return workspace;
  });
}

export function updateWorkspace(id:string | number, payload:UpdateWorkspacePayload){
  return bffFetch<WorkspaceWithRole>(`/api/workspaces/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function joinWorkspace(code: string) {
  return bffFetch<WorkspaceWithRole>("/api/workspaces/join", {
    method: "POST",
    body: JSON.stringify({ code }),
  }).then(async (workspace) => {
    try {
      const { createNotification } = await import("./notifications");
      await createNotification(
        "Nuevo miembro",
        `Te uniste a "${workspace.name}"`,
      );
    } catch { /* fire-and-forget */ }
    return workspace;
  });
}

export function deleteWorkspace(id: string | number) {
  return bffFetch<void>(`/api/workspaces/${id}`, {
    method: "DELETE",
  });
}