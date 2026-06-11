import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export type ActivityType = "submission" | "grade" | "join";

export type RecentActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  context: string;
  time: string;
};

const mockActivities: RecentActivityItem[] = [
  { id: "1", type: "submission", title: "María García entregó Tarea 3: Integrales", context: "Matemáticas Avanzadas", time: "hace 5 min" },
  { id: "2", type: "grade", title: "Derivadas Parciales calificada con 92%", context: "Física I", time: "hace 15 min" },
  { id: "3", type: "join", title: "Carlos López se unió al espacio", context: "Matemáticas Avanzadas", time: "hace 2 horas" },
  { id: "4", type: "grade", title: "TP N°3 calificado con 88%", context: "Programación Web", time: "hace 3 horas" },
];

export async function GET() {
  try {
    const data = await serverApiFetch<{ activities: RecentActivityItem[] }>(
      "/dashboard/recent-activity",
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ activities: mockActivities });
  }
}
