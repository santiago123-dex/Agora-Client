
export type WorkspaceCard = {
  id: string;
  title: string;
  secondaryLabel: string;
  roleLabel: "admin" | "member";
  accentColor: string;
  statusLabel?: string;
  statusVariant?: "pending" | "done";
};


export const adminWorkspaces: WorkspaceCard[] = [
  {
    id: "workspace-1",
    title: "Matematicas Avanzadas",
    secondaryLabel: "32 miembros",
    roleLabel: "admin",
    accentColor: "#0E6174",
    statusLabel: "8 por calificar",
    statusVariant: "pending",
  },
  {
    id: "workspace-2",
    title: "Fisica I",
    secondaryLabel: "28 miembros",
    roleLabel: "admin",
    accentColor: "#359677",
    statusLabel: "5 por calificar",
    statusVariant: "pending",
  },
  {
    id: "workspace-3",
    title: "Lengua Castellana",
    secondaryLabel: "16 miembros",
    roleLabel: "admin",
    accentColor: "#56AEB1",
    statusLabel: "16 por calificar",
    statusVariant: "pending",
  },
  {
    id: "workspace-4",
    title: "Grupo 4B",
    secondaryLabel: "20 miembros",
    roleLabel: "admin",
    accentColor: "#8A56B6",
    statusLabel: "Todo listo",
    statusVariant: "done",
  },
  {
    id: "workspace-5",
    title: "Ficha 3144622",
    secondaryLabel: "10 miembros",
    roleLabel: "admin",
    accentColor: "#FFA63A",
    statusLabel: "Todo listo",
    statusVariant: "done",
  },
];

export const memberWorkspaces: WorkspaceCard[] = [
  {
    id: "joined-workspace-1",
    title: "Quimica Organica",
    secondaryLabel: "Prof. Garcia",
    roleLabel: "member",
    accentColor: "#C44F4C",
  },
  {
    id: "joined-workspace-2",
    title: "Programacion Web",
    secondaryLabel: "Prof. Rodriguez",
    roleLabel: "member",
    accentColor: "#DC8738",
  },
  {
    id: "joined-workspace-3",
    title: "Historia Universal",
    secondaryLabel: "Prof. Martinez",
    roleLabel: "member",
    accentColor: "#5877D8",
  },
];