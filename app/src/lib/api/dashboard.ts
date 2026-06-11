import type { PendingTaskItem } from "@/app/api/dashboard/pending-tasks/route";
import type { RecentActivityItem } from "@/app/api/dashboard/recent-activity/route";
import { bffFetch } from "./bff-client";

export type { PendingTaskItem } from "@/app/api/dashboard/pending-tasks/route";
export type { RecentActivityItem, ActivityType } from "@/app/api/dashboard/recent-activity/route";

export async function getPendingTasks(): Promise<{ tasks: PendingTaskItem[] }> {
  return bffFetch<{ tasks: PendingTaskItem[] }>("/api/dashboard/pending-tasks");
}

export async function getRecentActivity(): Promise<{ activities: RecentActivityItem[] }> {
  return bffFetch<{ activities: RecentActivityItem[] }>("/api/dashboard/recent-activity");
}
