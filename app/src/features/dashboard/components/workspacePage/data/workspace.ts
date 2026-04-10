/** Tarea en la vista detalle admin (mock). */
export type WorkspaceAdminTask = {
  id: string;
  title: string;
  description: string;
  dueLabel: string;
  points: number;
  doneCount: number;
  totalCount: number;
  /** Texto del botón ancho en tarjeta “por calificar” */
  gradeButtonLabel?: string;
  taskState: "pending_grade" | "graded" | "upcoming";
};

export type WorkspaceAdminMember = {
  id: string;
  name: string;
  email: string;
};

export type WorkspaceCard = {
  id: string;
  title: string;
  secondaryLabel: string;
  roleLabel: "admin" | "member";
  accentColor: string;
  statusLabel?: string;
  statusVariant?: "pending" | "done";
  inviteCode?: string;
  description?: string;
  adminStats?: {
    members: number;
    tasks: number;
    toGrade: number;
    completedLabel: string;
  };
  activitiesToGrade?: WorkspaceAdminTask[];
  activitiesGraded?: WorkspaceAdminTask[];
  adminMembers?: WorkspaceAdminMember[];
};

export const adminWorkspaces: WorkspaceCard[] = [
  {
    id: "workspace-1",
    title: "Matematicas Avanzadas",
    secondaryLabel: "32 miembros",
    roleLabel: "admin",
    accentColor: "#3B59FF",
    statusLabel: "8 por calificar",
    statusVariant: "pending",
    inviteCode: "MAT-2024",
    description: "Curso de matematicas para ingenieria - Semestre 2024-1",
    adminStats: {
      members: 32,
      tasks: 4,
      toGrade: 26,
      completedLabel: "2/4",
    },
    activitiesToGrade: [
      {
        id: "t1",
        title: "Integrales Definidas",
        description:
          "Resuelve los ejercicios del capitulo 5 usando el teorema fundamental del calculo.",
        dueLabel: "29 feb",
        points: 100,
        doneCount: 24,
        totalCount: 32,
        gradeButtonLabel: "24 por calificar",
        taskState: "pending_grade",
      },
    ],
    activitiesGraded: [
      {
        id: "t2",
        title: "Derivadas Parciales",
        description: "Aplicacion de regla de la cadena en funciones multivariables.",
        dueLabel: "21 feb",
        points: 100,
        doneCount: 30,
        totalCount: 32,
        taskState: "graded",
      },
      {
        id: "t3",
        title: "Limites y Continuidad",
        description: "Analisis de continuidad en funciones de una variable.",
        dueLabel: "14 feb",
        points: 100,
        doneCount: 32,
        totalCount: 32,
        taskState: "graded",
      },
      {
        id: "t4",
        title: "Proyecto Final: Aplicaciones",
        description: "Integracion de conceptos en un problema de ingenieria real.",
        dueLabel: "14 mar",
        points: 200,
        doneCount: 0,
        totalCount: 32,
        taskState: "upcoming",
      },
    ],
    adminMembers: [
      { id: "m1", name: "Ana López", email: "ana@ejemplo.com" },
      { id: "m2", name: "Carlos Ruiz", email: "carlos@ejemplo.com" },
      { id: "m3", name: "María Santos", email: "maria@ejemplo.com" },
    ],
  },
  {
    id: "workspace-2",
    title: "Fisica I",
    secondaryLabel: "28 miembros",
    roleLabel: "admin",
    accentColor: "#359677",
    statusLabel: "5 por calificar",
    statusVariant: "pending",
    inviteCode: "FIS-2024",
    description: "Mecánica clásica y termodinámica básica.",
    adminStats: { members: 28, tasks: 3, toGrade: 5, completedLabel: "1/3" },
    activitiesToGrade: [],
    activitiesGraded: [],
    adminMembers: [],
  },
  {
    id: "workspace-3",
    title: "Lengua Castellana",
    secondaryLabel: "16 miembros",
    roleLabel: "admin",
    accentColor: "#56AEB1",
    statusLabel: "16 por calificar",
    statusVariant: "pending",
    inviteCode: "LEN-2024",
    description: "Literatura y expresión escrita.",
    adminStats: { members: 16, tasks: 6, toGrade: 16, completedLabel: "0/6" },
    activitiesToGrade: [],
    activitiesGraded: [],
    adminMembers: [],
  },
  {
    id: "workspace-4",
    title: "Grupo 4B",
    secondaryLabel: "20 miembros",
    roleLabel: "admin",
    accentColor: "#8A56B6",
    statusLabel: "Todo listo",
    statusVariant: "done",
    inviteCode: "G4B-2024",
    description: "Grupo académico 4B.",
    adminStats: { members: 20, tasks: 2, toGrade: 0, completedLabel: "2/2" },
    activitiesToGrade: [],
    activitiesGraded: [],
    adminMembers: [],
  },
  {
    id: "workspace-5",
    title: "Ficha 3144622",
    secondaryLabel: "10 miembros",
    roleLabel: "admin",
    accentColor: "#FFA63A",
    statusLabel: "Todo listo",
    statusVariant: "done",
    inviteCode: "FCH-3144622",
    description: "Seguimiento de ficha académica.",
    adminStats: { members: 10, tasks: 1, toGrade: 0, completedLabel: "1/1" },
    activitiesToGrade: [],
    activitiesGraded: [],
    adminMembers: [],
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
