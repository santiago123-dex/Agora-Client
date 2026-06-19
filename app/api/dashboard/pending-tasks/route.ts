import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export type PendingTaskItem = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  urgent: boolean;
};

export async function GET() {
  try {
    const memberships = await serverApiFetch<any[]>("/workspaces/member/user");
    if (!memberships?.length) {
      return NextResponse.json({ tasks: [] });
    }

    const userId = String(memberships[0].userId);
    const workspaceIds = [...new Set<number>(memberships.map((m) => m.workspaceId))];

    const workspaces = await serverApiFetch<any[]>("/workspaces/getAllWorkspaces").catch(() => [] as any[]);
    const workspaceNames = new Map(workspaces.map((w) => [w.id, w.name]));

    const submissions = await serverApiFetch<any[]>(`/workspaces/submission/user/${userId}`).catch(() => [] as any[]);
    const submittedIds = new Set(submissions.map((s) => s.assignmentId));

    const results = await Promise.all(
      workspaceIds.map((wsId) =>
        serverApiFetch<any[]>(`/workspaces/assignments/workspace/${wsId}`).catch(() => [] as any[]),
      ),
    );

    const now = new Date();
    const tasks: PendingTaskItem[] = [];

    for (const assignments of results) {
      for (const a of assignments) {
        const membership = memberships.find((m: any) => m.workspaceId === a.workspaceId);
        const isStudent = membership && String(membership.role) === "MEMBER";

        if (!isStudent || submittedIds.has(a.id)) continue;

        const dueDate = a.dueDate ? new Date(a.dueDate) : null;
        if (!dueDate || dueDate <= now) continue;

        const msLeft = dueDate.getTime() - now.getTime();
        tasks.push({
          id: String(a.id),
          title: a.name,
          subject: workspaceNames.get(a.workspaceId) || `Workspace #${a.workspaceId}`,
          dueDate: formatShort(dueDate),
          urgent: msLeft <= 3 * 24 * 60 * 60 * 1000,
        });
      }
    }

    tasks.sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[Pending Tasks]", error);
    return NextResponse.json({ tasks: [] });
  }
}

function formatShort(d: Date): string {
  const m = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d.getDate()} ${m[d.getMonth()]}`;
}

function parseDate(s: string): number {
  const map: Record<string, number> = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
  const p = s.split(" ");
  if (p.length === 2) {
    const day = parseInt(p[0], 10);
    const month = map[p[1]?.toLowerCase()];
    if (!isNaN(day) && month !== undefined) return new Date(2026, month, day).getTime();
  }
  return Infinity;
}
