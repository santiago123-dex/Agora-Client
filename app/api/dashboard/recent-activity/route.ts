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

export async function GET() {
  try {
    const memberships = await serverApiFetch<any[]>("/workspaces/member/user");
    if (!memberships?.length) {
      return NextResponse.json({ activities: [] });
    }

    const userId = String(memberships[0].userId);
    const workspaceIds = [...new Set<number>(memberships.map((m) => m.workspaceId))];

    const workspaces = await serverApiFetch<any[]>("/workspaces/getAllWorkspaces").catch(() => [] as any[]);
    const workspaceNames = new Map(workspaces.map((w) => [w.id, w.name]));

    const allAssignments: any[] = [];
    for (const wsId of workspaceIds) {
      const list = await serverApiFetch<any[]>(`/workspaces/assignments/workspace/${wsId}`).catch(() => [] as any[]);
      allAssignments.push(...list);
    }
    const assignmentNames = new Map(allAssignments.map((a) => [a.id, a.name]));
    const assignmentWsMap = new Map(allAssignments.map((a) => [a.id, a.workspaceId]));

    const submissions = await serverApiFetch<any[]>(`/workspaces/submission/user/${userId}`).catch(() => [] as any[]);
    const sorted = [...submissions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const now = Date.now();
    const activities: RecentActivityItem[] = [];

    for (const s of sorted.slice(0, 20)) {
      const wsId = assignmentWsMap.get(s.assignmentId);
      const wsName = workspaceNames.get(wsId) || "";
      const aName = assignmentNames.get(s.assignmentId) || "";
      const grade = s.result?.totalScore;

      if (grade != null) {
        activities.push({
          id: `g-${s.id}`,
          type: "grade",
          title: `${aName} — ${grade} pts`,
          context: wsName,
          time: timeAgo(s.createdAt, now),
        });
      } else {
        activities.push({
          id: `s-${s.id}`,
          type: "submission",
          title: `Entregaste ${aName}`,
          context: wsName,
          time: timeAgo(s.createdAt, now),
        });
      }
    }

    return NextResponse.json({ activities: activities.slice(0, 10) });
  } catch (error) {
    console.error("[Recent Activity]", error);
    return NextResponse.json({ activities: [] });
  }
}

function timeAgo(iso: string, now: number): string {
  const diff = now - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `hace ${days} día${days > 1 ? "s" : ""}`;
  return `hace ${Math.floor(days / 7)} sem`;
}
