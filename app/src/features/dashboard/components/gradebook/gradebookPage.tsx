"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import { getSubmissionsByAssignment } from "@/app/src/lib/api/submissions";
import { getWorkspaceMembers } from "@/app/src/lib/api/workspaces";
import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
import type { SubmissionResponse } from "@/app/src/lib/api/submissions";
import { ChevronDown } from "lucide-react";

async function fetchGradebook(workspaceId: string) {
  const [members, assignments] = await Promise.all([
    getWorkspaceMembers(workspaceId).catch<WorkspaceMemberDetailsResponse[]>(() => []),
    getAssignmentsByWorkspace(workspaceId).catch(() => []),
  ]);

  const submissionsByAssignment = await Promise.all(
    assignments.map(async (a) => {
      const subs = await getSubmissionsByAssignment(a.id).catch<SubmissionResponse[]>(() => []);
      return { assignmentId: String(a.id), submissions: subs };
    }),
  );

  const membersById = new Map(members.map((m) => [String(m.userId), m]));

  const submissionMap = new Map<string, Map<string, SubmissionResponse>>();
  for (const { assignmentId, submissions } of submissionsByAssignment) {
    const byUser = new Map<string, SubmissionResponse>();
    for (const sub of submissions) {
      byUser.set(String(sub.userId), sub);
    }
    submissionMap.set(assignmentId, byUser);
  }

  return { members, assignments, membersById, submissionMap };
}

function getGrade(submission?: SubmissionResponse): number | null {
  if (!submission?.result) return null;
  const r = submission.result as Record<string, unknown>;
  const teacher = r.teacher as Record<string, unknown> | undefined;
  const ai = r.ai as Record<string, unknown> | undefined;
  const score = teacher?.score ?? ai?.score ?? r.grade ?? r.score;
  return typeof score === "number" ? score : null;
}

export default function GradebookPage() {
  const { data: workspaces } = useSWR("my-workspaces", () => getMyWorkspaces());
  const adminWorkspaces = (workspaces ?? []).filter((w) => w.role === "ADMIN");
  const [selectedWsId, setSelectedWsId] = useState("");

  const { data, isLoading, error } = useSWR(
    selectedWsId ? ["gradebook", selectedWsId] : null,
    ([, id]) => fetchGradebook(id),
  );

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Gradebook</h1>
            <p className="mt-1 text-sm text-slate-500">
              Notas de estudiantes por tarea
            </p>
          </div>

          <div className="relative">
            <select
              value={selectedWsId}
              onChange={(e) => setSelectedWsId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-[#275D79] sm:w-64"
            >
              <option value="">Seleccionar espacio</option>
              {adminWorkspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {!selectedWsId ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <p className="text-sm text-slate-500">
              Seleccioná un espacio para ver las notas.
            </p>
          </div>
        ) : isLoading ? (
          <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-64 rounded bg-slate-100" />
          </div>
        ) : error || !data ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Error al cargar el gradebook
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estudiante
                  </th>
                  {data.assignments.map((a) => (
                    <th
                      key={a.id}
                      className="px-3 py-3 text-xs font-semibold text-slate-500"
                    >
                      <Link
                        href={`/dashboard/workspace/${selectedWsId}?from=dashboard`}
                        className="hover:text-[#275D79]"
                      >
                        {a.name.length > 15 ? `${a.name.slice(0, 15)}…` : a.name}
                      </Link>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={data.assignments.length + 2}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      No hay miembros en este espacio.
                    </td>
                  </tr>
                ) : (
                  data.members.map((member) => {
                    const grades = data.assignments.map((a) => {
                      const subs = data.submissionMap.get(String(a.id));
                      const sub = subs?.get(String(member.userId));
                      return getGrade(sub);
                    });
                    const validGrades = grades.filter((g): g is number => g !== null);
                    const avg =
                      validGrades.length > 0
                        ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length
                        : null;

                    return (
                      <tr key={member.id} className="hover:bg-slate-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-900 hover:bg-slate-50">
                          {member.fullName ||
                            `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim()}
                        </td>
                        {grades.map((g, i) => (
                          <td key={i} className="px-3 py-3 text-slate-700">
                            {g !== null ? (
                              <span
                                className={`font-semibold tabular-nums ${
                                  g >= 60 ? "text-emerald-600" : "text-red-500"
                                }`}
                              >
                                {g}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        ))}
                        <td className="px-3 py-3 text-center font-bold tabular-nums text-slate-900">
                          {avg !== null ? `${Math.round(avg)}` : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {data.members.length > 0 ? (
                <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                  <tr>
                    <td className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                      Promedio
                    </td>
                    {data.assignments.map((a) => {
                      const grades = data.members
                        .map((m) => {
                          const subs = data.submissionMap.get(String(a.id));
                          const sub = subs?.get(String(m.userId));
                          return getGrade(sub);
                        })
                        .filter((g): g is number => g !== null);
                      const avg =
                        grades.length > 0
                          ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length)
                          : null;

                      return (
                        <td key={a.id} className="px-3 py-3 font-bold tabular-nums text-slate-800">
                          {avg !== null ? avg : "—"}
                        </td>
                      );
                    })}
                    <td />
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
