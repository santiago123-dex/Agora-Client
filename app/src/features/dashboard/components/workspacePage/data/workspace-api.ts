import type { WorkspaceWithRole } from "@/app/src/lib/api/workspaces";
import type { AdminWorkspace, MemberWorkspace } from "./workspace";

const fallbackColors = [
  "#EAB308",
  "#84CC16",
  "#10B981",
  "#DC2626",
  "#2563EB",
  "#0EA5E9",
  "#A21CAF",
  "#EC4899",
];

function getColor(workspace: WorkspaceWithRole) {
  if (typeof workspace.data?.accentColor === "string") {
    return workspace.data.accentColor;
  }

  return fallbackColors[Math.abs(workspace.id) % fallbackColors.length];
}

function getInviteCode(workspace: WorkspaceWithRole) {
  return typeof workspace.data?.code === "string" ? workspace.data.code : undefined;
}

export function workspaceToCard(
  workspace: WorkspaceWithRole
): AdminWorkspace | MemberWorkspace {
  const roleLabel = workspace.role === "ADMIN" ? "admin" : "member";
  const base = {
    id: String(workspace.id),
    title: workspace.name,
    secondaryLabel: workspace.description,
    accentColor: getColor(workspace),
    roleLabel,
    description: workspace.description,
    inviteCode: getInviteCode(workspace),
  };

  if (roleLabel === "admin") {
    return {
      ...base,
      roleLabel: "admin",
      statusLabel: workspace.status === "ACTIVO" ? "Activo" : workspace.status,
      statusVariant: workspace.status === "ACTIVO" ? "done" : "pending",
      adminStats: {
        members: 0,
        tasks: 0,
        toGrade: 0,
        completedLabel: "0/0",
      },
      activitiesToGrade: [],
      activitiesGraded: [],
      adminMembers: [],
    };
  }

  return {
    ...base,
    roleLabel: "member",
    memberStats: {
      members: 0,
      tasks: 0,
      toGrade: 0,
      completedLabel: "0/0",
    },
    memberTask: [],
  };
}
