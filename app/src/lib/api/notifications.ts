import { bffFetch } from "./bff-client";

export type NotificationData = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export type NotificationsResponse = {
  notifications: NotificationData[];
};

export async function getNotifications(): Promise<NotificationsResponse> {
  return bffFetch<NotificationsResponse>("/api/notifications");
}

export async function createNotification(title: string, description: string): Promise<void> {
  await bffFetch<{ notification: NotificationData }>("/api/notifications", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

export function notifyGrade(workspaceName: string, assignmentName: string, studentName: string) {
  return createNotification(
    "Calificación registrada",
    `${studentName} fue calificado en "${assignmentName}" — ${workspaceName}`,
  );
}

export function notifySubmission(workspaceName: string, assignmentName: string, studentName: string) {
  return createNotification(
    "Entrega recibida",
    `${studentName} entregó "${assignmentName}" — ${workspaceName}`,
  );
}

export function notifyJoin(workspaceName: string, userName: string) {
  return createNotification(
    "Nuevo miembro",
    `${userName} se unió a "${workspaceName}"`,
  );
}

export function notifyWorkspaceCreated(workspaceName: string) {
  return createNotification(
    "Espacio creado",
    `"${workspaceName}" fue creado exitosamente`,
  );
}

export async function markAsRead(ids: string[]): Promise<void> {
  await bffFetch("/api/notifications", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });
}
