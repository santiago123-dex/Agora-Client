import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export type PendingTaskItem = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  urgent: boolean;
};

const mockTasks: PendingTaskItem[] = [
  { id: "1", title: "Proyecto Final React", subject: "Programación Web", dueDate: "29 jun", urgent: true },
  { id: "2", title: "Reporte de Laboratorio", subject: "Química Orgánica", dueDate: "2 jul", urgent: false },
  { id: "3", title: "Ejercicios Capítulo 5", subject: "Álgebra Lineal", dueDate: "5 jul", urgent: false },
  { id: "4", title: "Ensayo de Literatura", subject: "Literatura Hispanoamericana", dueDate: "3 jul", urgent: true },
];

export async function GET() {
  try {
    const data = await serverApiFetch<{ tasks: PendingTaskItem[] }>(
      "/dashboard/pending-tasks",
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ tasks: mockTasks });
  }
}
