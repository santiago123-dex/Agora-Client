
type BaseWorkspace = {
  id: string;
  title: string;
  secondaryLabel: string;
  accentColor: string;
  roleLabel: "admin" | "member";
  description?: string;
}

export type WorkspaceAdminTask = {
  id: string;
  title: string;
  description: string;
  dueLabel: string;
  points: number;
  doneCount: number;
  gradedCount: number;
  totalCount: number;
  gradeButtonLabel?: string;
  taskState: "pending_grade" | "graded" | "upcoming";
};

export type WorkspaceAdminMember = {
  id: string;
  name: string;
  email: string;
};

export type AdminWorkspace = BaseWorkspace & {
  roleLabel: "admin";
  statusLabel?: string;
  statusVariant?: "pending" | "done";
  inviteCode?: string;
  adminStats?: {
    members: number;
    tasks: number;
    toGrade: number;
    completedLabel: string;
  }
  activitiesToGrade?: WorkspaceAdminTask[];
  activitiesGraded?: WorkspaceAdminTask[];
  adminMembers?: WorkspaceAdminMember[];
}

export type WorkspaceMemberTask = {
  id: string;
  title: string;
  description: string;
  dueLabel: string;
  points: number;
  taskState: "graded" | "pending_submission" | "submitted";
  gradeLabel?: string;      // ej: "95%"
  feedback?: string;        // ej: "Excelente trabajo..."
  actionLabel?: string;     // ej: "Entregar tarea"
};

export type MemberWorkspace = BaseWorkspace & {
  roleLabel: "member";
  statusLabel?: string;
  statusVariant?: "pending" | "done";
  inviteCode?: string;
  memberStats?: {
    members: number;
    tasks: number;
    toGrade: number;
    completedLabel: string;
  }
  memberTask?: WorkspaceMemberTask[];
}
