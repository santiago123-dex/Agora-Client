"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import AssignmentAdminDetail from "./workspaces/admin/taskDetail/AssignmentAdminDetail";
import MemberTaskDetail from "./workspaces/member/taskDetail/MemberTaskDetail";

type Props = {
  workspaceId: string;
  taskId: string;
};

export default function TaskDetailWrapper({ workspaceId, taskId }: Props) {
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const fromParam = searchParams.get("from");
    if (fromParam === "member") {
      setIsAdmin(false);
      return;
    }

    getMyWorkspaces()
      .then((workspaces) => {
        const ws = workspaces.find((w) => String(w.id) === workspaceId);
        setIsAdmin(ws?.role === "ADMIN");
      })
      .catch(() => setIsAdmin(false));
  }, [workspaceId, searchParams]);

  if (isAdmin === null) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8]">
        <p className="text-sm text-slate-500">Cargando...</p>
      </div>
    );
  }

  if (isAdmin) {
    return <AssignmentAdminDetail workspaceId={workspaceId} taskId={taskId} />;
  }

  return <MemberTaskDetail workspaceId={workspaceId} taskId={taskId} />;
}
