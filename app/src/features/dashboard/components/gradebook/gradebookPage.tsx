"use client";

import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import Link from "next/link";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import { getSubmissionsByAssignment } from "@/app/src/lib/api/submissions";
import { getWorkspaceMembers } from "@/app/src/lib/api/workspaces";
import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
import type { SubmissionResponse } from "@/app/src/lib/api/submissions";
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, BookOpen } from "lucide-react";

async function fetchGradebook(workspaceId: string) {
  const [members, assignments] = await Promise.all([
    getWorkspaceMembers(workspaceId, "MEMBER").catch<WorkspaceMemberDetailsResponse[]>(() => []),
    getAssignmentsByWorkspace(workspaceId).catch(() => []),
  ]);

  const submissionsByAssignment = await Promise.all(
    assignments.map(async (a) => {
      const subs = await getSubmissionsByAssignment(a.id).catch<SubmissionResponse[]>(() => []);
      return { assignmentId: String(a.id), submissions: subs };
    }),
  );

  const submissionMap = new Map<string, Map<string, SubmissionResponse>>();
  for (const { assignmentId, submissions } of submissionsByAssignment) {
    const byUser = new Map<string, SubmissionResponse>();
    for (const sub of submissions) {
      byUser.set(String(sub.userId), sub);
    }
    submissionMap.set(assignmentId, byUser);
  }

  return { members, assignments, submissionMap };
}

function getGrade(submission?: SubmissionResponse): number | null {
  if (!submission?.result) return null;
  const r = submission.result as Record<string, unknown>;
  const teacher = r.teacher as Record<string, unknown> | undefined;
  const ai = r.ai as Record<string, unknown> | undefined;
  const score = teacher?.score ?? ai?.score ?? r.grade ?? r.score;
  return typeof score === "number" ? score : null;
}

function getMemberName(m: WorkspaceMemberDetailsResponse): string {
  return m.fullName || `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "Sin nombre";
}

function HistogramBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] font-medium text-slate-500">{value}</span>
      <div className="h-10 w-4 rounded-sm bg-slate-100 relative overflow-hidden">
        <div
          className="absolute bottom-0 w-full rounded-sm transition-all duration-500"
          style={{ height: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function getGradeColor(grade: number): string {
  if (grade >= 90) return "#10b981";
  if (grade >= 70) return "#22c55e";
  if (grade >= 60) return "#eab308";
  return "#ef4444";
}

type SortDir = "asc" | "desc" | null;

export default function GradebookPage() {
  const { data: workspaces } = useSWR("my-workspaces", () => getMyWorkspaces());
  const adminWorkspaces = (workspaces ?? []).filter((w) => w.role === "ADMIN");
  const [selectedWsId, setSelectedWsId] = useState("");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const { data, isLoading, error } = useSWR(
    selectedWsId ? ["gradebook", selectedWsId] : null,
    ([, id]) => fetchGradebook(id),
  );

  const handleSort = useCallback((col: string) => {
    setSortCol((prev) => {
      if (prev !== col) {
        setSortDir("asc");
        return col;
      }
      setSortDir((d) => {
        if (d === "asc") return "desc";
        if (d === "desc") return null;
        return "asc";
      });
      return prev;
    });
  }, []);

  const allGrades = useMemo(() => {
    if (!data) return [];
    return data.assignments.map((a) => {
      const grades = data.members
        .map((m) => getGrade(data.submissionMap.get(String(a.id))?.get(String(m.userId))))
        .filter((g): g is number => g !== null);
      return { assignmentId: String(a.id), grades };
    });
  }, [data]);

  const filteredMembers = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    let members = data.members.filter((m) => getMemberName(m).toLowerCase().includes(q));

    if (sortCol && sortDir) {
      const colIsAvg = sortCol === "__avg__";
      members = [...members].sort((a, b) => {
        if (colIsAvg) {
          const gradesA = data.assignments.map((as) => getGrade(data.submissionMap.get(String(as.id))?.get(String(a.userId)))).filter((g): g is number => g !== null);
          const avgA = gradesA.length > 0 ? gradesA.reduce((x, y) => x + y, 0) / gradesA.length : -1;
          const gradesB = data.assignments.map((as) => getGrade(data.submissionMap.get(String(as.id))?.get(String(b.userId)))).filter((g): g is number => g !== null);
          const avgB = gradesB.length > 0 ? gradesB.reduce((x, y) => x + y, 0) / gradesB.length : -1;
          return sortDir === "asc" ? avgA - avgB : avgB - avgA;
        }

        const gradeA = getGrade(data.submissionMap.get(sortCol)?.get(String(a.userId))) ?? -1;
        const gradeB = getGrade(data.submissionMap.get(sortCol)?.get(String(b.userId))) ?? -1;
        return sortDir === "asc" ? gradeA - gradeB : gradeB - gradeA;
      });
    }

    return members;
  }, [data, search, sortCol, sortDir]);

  const exportCSV = useCallback(() => {
    if (!data) return;
    const header = ["Estudiante", ...data.assignments.map((a) => a.name), "Promedio"];
    const rows = data.members.map((m) => {
      const grades = data.assignments.map((a) => {
        const grade = getGrade(data.submissionMap.get(String(a.id))?.get(String(m.userId)));
        return grade !== null ? String(grade) : "";
      });
      const valid = grades.filter((g) => g !== "").map(Number);
      const avg = valid.length > 0 ? String(Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)) : "";
      return [getMemberName(m), ...grades, avg];
    });

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gradebook-${selectedWsId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, selectedWsId]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={12} className="ml-1 text-slate-300" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="ml-1 text-[#275D79]" />
    ) : (
      <ArrowDown size={12} className="ml-1 text-[#275D79]" />
    );
  };

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="serif text-2xl text-slate-950 dark:text-slate-100">Gradebook</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Notas de estudiantes por tarea</p>
          </div>

          {adminWorkspaces.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {adminWorkspaces.map((ws) => {
                const color = typeof ws.data?.accentColor === "string" ? ws.data.accentColor : "#275D79";
                const isSelected = selectedWsId === String(ws.id);
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => { setSelectedWsId(isSelected ? "" : String(ws.id)); setSearch(""); setSortCol(null); setSortDir(null); }}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-transparent text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-400 dark:hover:border-slate-600"
                    }`}
                    style={isSelected ? { backgroundColor: color } : {}}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: isSelected ? "white" : color }} />
                    {ws.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-400 dark:border-[#253245] dark:bg-[#0f1a2e]">
              <BookOpen size={16} />
              No hay espacios como creador
            </div>
          )}
        </div>

        {!selectedWsId ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-[#253245] dark:bg-[#0f1a2e]">
            <p className="text-sm text-slate-500 dark:text-slate-400">Seleccioná un espacio para ver las notas.</p>
          </div>
        ) : isLoading ? (
          <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#253245] dark:bg-[#0f1a2e]">
            <div className="mb-4 h-10 w-64 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-64 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        ) : error || !data ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            Error al cargar el gradebook
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar estudiante..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-300 dark:hover:bg-[#1a2740]"
              >
                <Download size={16} />
                Exportar CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 dark:border-[#253245] dark:bg-[#0a1220]">
                    <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#0a1220] dark:text-slate-400">
                      Estudiante
                    </th>
                    {data.assignments.map((a) => {
                      const aid = String(a.id);
                      const dist = allGrades.find((g) => g.assignmentId === aid);
                      const maxCount = Math.max(...(dist?.grades ?? []).map((g) => {
                        const ranges = [0, 50, 70, 85];
                        return ranges.filter((r) => g >= r).length;
                      }), 1);
                      const ranges = [
                        { label: "0-49", color: "#ef4444", count: dist?.grades.filter((g) => g < 50).length ?? 0 },
                        { label: "50-69", color: "#eab308", count: dist?.grades.filter((g) => g >= 50 && g < 70).length ?? 0 },
                        { label: "70-89", color: "#22c55e", count: dist?.grades.filter((g) => g >= 70 && g < 90).length ?? 0 },
                        { label: "90-100", color: "#10b981", count: dist?.grades.filter((g) => g >= 90).length ?? 0 },
                      ];

                      return (
                        <th key={a.id} className="px-3 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[100px]">
                          <button
                            type="button"
                            onClick={() => handleSort(aid)}
                            className="inline-flex items-center hover:text-[#275D79]"
                          >
                            {a.name.length > 12 ? `${a.name.slice(0, 12)}…` : a.name}
                            <SortIcon col={aid} />
                          </button>
                          {dist && dist.grades.length > 0 ? (
                            <div className="mt-2 flex items-end justify-center gap-1">
                              {ranges.map((r) => (
                                <HistogramBar key={r.label} value={r.count} max={data.members.length} color={r.color} />
                              ))}
                            </div>
                          ) : null}
                        </th>
                      );
                    })}
                    <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[80px]">
                      <button
                        type="button"
                        onClick={() => handleSort("__avg__")}
                        className="inline-flex items-center justify-center hover:text-[#275D79]"
                      >
                        Promedio
                        <SortIcon col="__avg__" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#253245]">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={data.assignments.length + 2} className="px-4 py-12 text-center text-sm text-slate-500">
                        {search ? "No se encontraron estudiantes con ese nombre." : "No hay miembros en este espacio."}
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => {
                      const grades = data.assignments.map((a) => {
                        const sub = data.submissionMap.get(String(a.id))?.get(String(member.userId));
                        return getGrade(sub);
                      });
                      const validGrades = grades.filter((g): g is number => g !== null);
                      const avg = validGrades.length > 0
                        ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length
                        : null;

                      return (
                          <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1220] transition-colors">
                          <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-900 hover:bg-slate-50 dark:bg-[#0f1a2e] dark:text-slate-100 dark:hover:bg-[#0a1220]">
                            {getMemberName(member)}
                          </td>
                          {grades.map((g, i) => (
                            <td key={i} className="px-3 py-3 text-slate-700 dark:text-slate-300">
                              {g !== null ? (
                                <span
                                  className="inline-flex items-center gap-1 font-semibold tabular-nums"
                                  style={{ color: getGradeColor(g) }}
                                >
                                  <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: getGradeColor(g) }}
                                  />
                                  {g}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                          ))}
                          <td className="px-3 py-3 text-center font-bold tabular-nums text-slate-900 dark:text-slate-100">
                            {avg !== null ? `${Math.round(avg)}` : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {filteredMembers.length > 0 ? (
                  <tfoot className="border-t-2 border-slate-200 bg-slate-50 dark:border-[#253245] dark:bg-[#0a1220]">
                    <tr>
                      <td className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 dark:bg-[#0a1220] dark:text-slate-400">
                        Promedio ({filteredMembers.length} estudiantes)
                      </td>
                      {data.assignments.map((a) => {
                        const grades = data.members
                          .map((m) => getGrade(data.submissionMap.get(String(a.id))?.get(String(m.userId))))
                          .filter((g): g is number => g !== null);
                        const avg = grades.length > 0
                          ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length)
                          : null;

                        return (
                          <td key={a.id} className="px-3 py-3 font-bold tabular-nums text-slate-800 dark:text-slate-200">
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
          </div>
        )}
      </div>
    </section>
  );
}
