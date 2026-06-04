"use client";

import dynamic from "next/dynamic";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import type { AssignmentResponse } from "@/app/src/lib/api/assignments";
import { getSubmissionsByAssignment } from "@/app/src/lib/api/submissions";
import type { SubmissionResponse } from "@/app/src/lib/api/submissions";
import { getWorkspaceMembers } from "@/app/src/lib/api/workspaces";
import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
import { suggestGrades, approveSuggestion } from "@/app/src/lib/api/ai";
import type { GradeResult, CriterionOverride } from "@/app/src/lib/api/ai";
import AssignmentHeader from "./components/AssignmentHeader";
import AssignmentStats from "./components/AssignmentStats";
import AiSummaryPanel from "./components/AiSummaryPanel";
import SubmissionList from "./components/SubmissionList";
import { buildRows, getMemberName, getStoredAiAnalysis, getStoredGrade } from "./helpers";

const SubmissionReviewPanel = dynamic(
  () => import("./components/SubmissionReviewPanel"),
  { ssr: false },
);

const EditAssignmentModal = dynamic(
  () => import("./components/EditAssignmentModal"),
  { ssr: false },
);

type Props = {
  workspaceId: string;
  taskId: string;
};

type LocalGrade = {
  grade?: number;
  feedback?: string;
};

const loadingState = (
  <div className="p-7 text-sm text-slate-500">
    Cargando detalle de tarea...
  </div>
);

const noMembersState = (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
    No hay miembros en este espacio para calificar.
  </div>
);

export default function AssignmentAdminDetail({ workspaceId, taskId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backFrom = from === "dashboard" ? "dashboard" : "workspace";

  const { data: rawAssignments = [], error: assignmentsLoadError, mutate: mutateAssignments } = useSWR(
    ["assignments", workspaceId],
    ([, id]) => getAssignmentsByWorkspace(id) as Promise<AssignmentResponse[]>,
  );

  const { data: members = [], error: membersLoadError, isLoading: isLoadingMembers } = useSWR(
    ["members", workspaceId],
    ([, id]) => getWorkspaceMembers(id) as Promise<WorkspaceMemberDetailsResponse[]>,
  );

  const { data: submissions = [], error: submissionsLoadError, isLoading: isLoadingSubmissions, mutate: mutateSubmissions } = useSWR(
    ["submissions", taskId],
    ([, id]) => getSubmissionsByAssignment(id) as Promise<SubmissionResponse[]>,
  );

  const assignment = useMemo(() => {
    if (!rawAssignments) return undefined;
    return rawAssignments.find(
      (item) => String(item.id) === String(taskId),
    ) ?? null;
  }, [rawAssignments, taskId]);

  const isLoading = isLoadingMembers || isLoadingSubmissions;

  const error = useMemo(() => {
    if (assignment === null) return "No se encontró la tarea seleccionada.";
    return (assignmentsLoadError ?? membersLoadError ?? submissionsLoadError)?.message ?? null;
  }, [assignment, assignmentsLoadError, membersLoadError, submissionsLoadError]);

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [localGrades, setLocalGrades] = useState<Record<string, LocalGrade>>(
    {},
  );
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [analyzingUserId, setAnalyzingUserId] = useState<string | null>(null);
  const [analyzingAll, setAnalyzingAll] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<
    Record<string, GradeResult>
  >({});
  const [currentSuggestionId, setCurrentSuggestionId] = useState<
    string | null
  >(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  // ── Overrides (correcciones manuales del profesor sobre criterios de la IA) ──
  //
  // overrides es un diccionario key = "${submissionId}:${criterionId}"
  // porque necesitamos identificar de forma única cada override cuando
  // el profesor cambia de estudiante en la lista (cada submission tiene
  // sus propios criterios, y el mismo criterion_id puede aparecer en
  // submissions distintos).
  const [overrides, setOverrides] = useState<Record<string, CriterionOverride>>({});

  // handleOverrideChange: recibe una edición individual del profesor y la persiste
  // en el estado. Si el profesor edita solo el score, teacher_feedback mantiene
  // el valor existente (o se vacía si no había override previo).
  // Si edita solo el feedback, teacher_score mantiene el valor existente (o el original).
  const handleOverrideChange = useCallback(
    (submissionId: string, criterionId: string, originalScore: number, field: "teacher_score" | "teacher_feedback", value: string) => {
      const key = `${submissionId}:${criterionId}`;
      setOverrides((prev) => {
        const existing = prev[key];
        return {
          ...prev,
          [key]: {
            submission_id: Number(submissionId),
            criterion_id: criterionId,
            original_score: originalScore,
            teacher_score: field === "teacher_score" ? Number(value) : (existing?.teacher_score ?? originalScore),
            teacher_feedback: field === "teacher_feedback" ? value : (existing?.teacher_feedback ?? ""),
          },
        };
      });
    },
    [],
  );

  const runAiAnalysis = useCallback(
    async (options?: { userId?: string }) => {
      setAiError(null);
      setOverrides({});
      if (options?.userId) {
        setAnalyzingUserId(options.userId);
      } else {
        setAnalyzingAll(true);
      }

      try {
        const result = await suggestGrades(workspaceId, taskId);
        setCurrentSuggestionId(result.suggestion_id);

        const bySubmission: Record<string, GradeResult> = {};
        for (const r of result.results) {
          bySubmission[r.submission_id] = r;
        }
        setAiSuggestions((prev) => ({ ...prev, ...bySubmission }));
      } catch (err) {
        setAiError(
          err instanceof Error
            ? err.message
            : "Error al analizar con IA",
        );
      } finally {
        setAnalyzingUserId(null);
        setAnalyzingAll(false);
      }
    },
    [workspaceId, taskId],
  );

  // handleApproveAll: persiste TODAS las sugerencias de IA (con o sin overrides).
  // Si el profesor modificó criterios individualmente, se envían como overrides
  // y el backend las aplica antes de persistir las calificaciones.
  // Si no hay overrides, se aprueban las sugerencias tal cual (comportamiento original).
  const handleApproveAll = async () => {
    if (!currentSuggestionId) return;
    setApproving(true);
    setAiError(null);

    try {
      const overrideList = Object.values(overrides);
      await approveSuggestion(currentSuggestionId, overrideList.length > 0 ? overrideList : undefined);
      setCurrentSuggestionId(null);
      setAiSuggestions({});
      setOverrides({});
      await mutateSubmissions();
    } catch (err) {
      setAiError(
        err instanceof Error
          ? err.message
          : "Error al aprobar las sugerencias",
      );
    } finally {
      setApproving(false);
    }
  };

  const hasProcessedStoredRef = useRef(false);

  useEffect(() => {
    if (hasProcessedStoredRef.current || submissions.length === 0) return;
    hasProcessedStoredRef.current = true;

    const storedSuggestions: Record<string, GradeResult> = {};
    for (const sub of submissions) {
      const stored = getStoredAiAnalysis(sub);
      if (stored) {
        storedSuggestions[String(sub.id)] = {
          submission_id: String(sub.id),
          total_score: stored.total_score,
          max_score: stored.total_score,
          feedback_summary: stored.feedback_summary,
          grading_model: "IA",
          evaluated_at: stored.evaluated_at,
          criteria_results: stored.criteria_results.map((c) => ({
            ...c,
            max_score: c.score,
            matched_level: "",
          })),
        };
      }
    }
    if (Object.keys(storedSuggestions).length > 0) {
      setAiSuggestions(storedSuggestions);
    }
  }, [submissions]);

  useEffect(() => {
    if (members.length > 0 && selectedUserId === undefined) {
      setSelectedUserId(String(members[0].userId ?? ""));
    }
  }, [members, selectedUserId]);

  const rows = useMemo(() => {
    if (!assignment) return [];
    return buildRows(members, submissions, assignment.dueDate, localGrades);
  }, [assignment, members, submissions, localGrades]);

  const selectedRow =
    rows.find((row) => String(row.member.userId) === selectedUserId) ?? rows[0];

  const handleExportCsv = useCallback(() => {
    const headers = ["Estudiante", "Email", "Estado", "Nota", "Feedback", "Fecha entrega"];
    const csvRows = [headers.join(",")];

    for (const row of rows) {
      const name = getMemberName(row.member);
      const email = "";
      const status = row.status === "pending" ? "Sin entrega" : row.status === "graded" ? "Calificado" : row.status === "late" ? "Tarde" : "Entregado";
      const grade = row.localGrade ?? getStoredGrade(row.submission) ?? "";
      const feedback = row.feedback ?? "";
      const date = row.submission ? new Date(row.submission.createdAt).toLocaleDateString("es-CO") : "";
      const csvRow = [
        `"${name}"`,
        `"${email}"`,
        `"${status}"`,
        grade,
        `"${(feedback ?? "").replace(/"/g, '""')}"`,
        `"${date}"`,
      ].join(",");
      csvRows.push(csvRow);
    }

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assignment?.name ?? "tarea"}_notas.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, assignment]);

  const aiGradedCount = useMemo(() => {
    const submissionsById = new Map(
      submissions.map((sub) => [String(sub.id), sub]),
    );
    const gradedUserIds = new Set<string>();
    for (const suggestion of Object.values(aiSuggestions)) {
      const sub = submissionsById.get(suggestion.submission_id);
      if (sub) gradedUserIds.add(String(sub.userId));
    }
    return rows.filter(
      (row) => Boolean(row.submission) && gradedUserIds.has(String(row.member.userId)),
    ).length;
  }, [aiSuggestions, submissions, rows]);

  const stats = useMemo(() => {
    let submitted = 0;
    let pending = 0;
    let graded = 0;
    let late = 0;
    for (const row of rows) {
      if (row.submission) submitted++;
      if (row.status === "pending") pending++;
      if (row.status === "graded") graded++;
      if (row.status === "late") late++;
    }
    return { submitted, pending, graded, late };
  }, [rows]);

  const handleAnalyze = () => {
    if (!selectedRow?.submission) return;
    runAiAnalysis({ userId: String(selectedRow.member.userId) });
  };

  const handleAcceptSuggestion = () => {
    if (!selectedRow?.submission) return;
    const suggestion =
      aiSuggestions[String(selectedRow.submission.id)];
    if (!suggestion) return;

    const local = localGrades[String(selectedRow.member.userId)] ?? {};
    setGradeInput(String(suggestion.total_score));
    setFeedbackInput(
      suggestion.feedback_summary || local.feedback || "",
    );
  };

  // selectedOverrides: filtra el estado global de overrides para mostrar solo
  // los que corresponden al submission del estudiante seleccionado actualmente.
  // Se pasa al SubmissionReviewPanel para que pinte los inputs editables.
  // Es un useMemo para no recalcular en cada render (solo cuando cambia selectedRow
  // o el estado global de overrides).
  const selectedOverrides = useMemo(() => {
    if (!selectedRow?.submission) return {};
    const subId = String(selectedRow.submission.id);
    const result: Record<string, { teacher_score: number; teacher_feedback: string }> = {};
    for (const [key, ov] of Object.entries(overrides)) {
      if (key.startsWith(`${subId}:`)) {
        result[ov.criterion_id] = { teacher_score: ov.teacher_score, teacher_feedback: ov.teacher_feedback };
      }
    }
    return result;
  }, [selectedRow, overrides]);

  // handleSubmissionOverrideChange: puente entre el SubmissionReviewPanel y el estado.
  // El panel llama a esta función con (criterionId, field, value).
  // Esta función busca el submission_id actual, la sugerencia IA correspondiente,
  // y el criterion original para obtener el original_score, y luego delega
  // a handleOverrideChange con todos los datos completos.
  const handleSubmissionOverrideChange = useCallback(
    (criterionId: string, field: "teacher_score" | "teacher_feedback", value: string) => {
      if (!selectedRow?.submission) return;
      const suggestion = aiSuggestions[String(selectedRow.submission.id)];
      if (!suggestion) return;
      const criterion = suggestion.criteria_results.find((c) => c.criterion_id === criterionId);
      if (!criterion) return;
      handleOverrideChange(String(selectedRow.submission.id), criterionId, criterion.score, field, value);
    },
    [selectedRow, aiSuggestions, handleOverrideChange],
  );

  const handleSaveGrade = async () => {
    if (!selectedRow) return;

    const grade = Number(gradeInput);
    if (Number.isNaN(grade)) return;

    setLocalGrades((current) => ({
      ...current,
      [String(selectedRow.member.userId)]: {
        grade,
        feedback: feedbackInput,
      },
    }));
  };

  const handleGradeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGradeInput(event.target.value);
  };

  const handleFeedbackChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackInput(event.target.value);
  };

  if (isLoading) {
    return loadingState;
  }

  if (error || !assignment) {
    return (
      <div className="p-7 text-sm text-red-600">
        {error ?? "Tarea no encontrada"}
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8] px-4 py-6 sm:px-7">
      <div className="mx-auto max-w-6xl space-y-6">
        <AssignmentHeader
          assignment={assignment}
          workspaceId={workspaceId}
          from={backFrom}
          onEdit={() => setIsEditModalOpen(true)}
        />

        <AssignmentStats
          submitted={stats.submitted}
          pending={stats.pending}
          graded={stats.graded}
          late={stats.late}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar CSV
          </button>
        </div>

        <AiSummaryPanel
          analyzed={aiGradedCount}
          total={stats.submitted}
          isLoading={analyzingAll}
          hasSuggestion={Boolean(currentSuggestionId)}
          onAnalyzeAll={() => runAiAnalysis()}
          onApproveAll={handleApproveAll}
          approving={approving}
        />

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <SubmissionList
            rows={rows}
            selectedUserId={
              selectedRow ? String(selectedRow.member.userId) : undefined
            }
            onSelect={(userId) => {
              setSelectedUserId(userId);
              const local = localGrades[userId] ?? {};
              setGradeInput(typeof local.grade === "number" ? String(local.grade) : "");
              setFeedbackInput(local.feedback ?? "");
            }}
          />

          {selectedRow ? (
            <SubmissionReviewPanel
              row={selectedRow}
              aiSuggestion={
                selectedRow.submission
                  ? aiSuggestions[String(selectedRow.submission.id)]
                  : undefined
              }
              isAnalyzing={
                analyzingUserId === String(selectedRow.member.userId)
              }
              grade={gradeInput}
              feedback={feedbackInput}
              overrides={selectedOverrides}
              onOverrideChange={handleSubmissionOverrideChange}
              onAnalyze={handleAnalyze}
              onAcceptSuggestion={handleAcceptSuggestion}
              onGradeChange={handleGradeChange}
              onFeedbackChange={handleFeedbackChange}
              onSave={handleSaveGrade}
            />
          ) : (
            noMembersState
          )}
        </div>

        <EditAssignmentModal
          assignment={assignment}
          isOpen={isEditModalOpen}
          workspaceId={workspaceId}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={() => mutateAssignments()}
          onDeleted={() =>
            router.push(`/dashboard/workspace/${workspaceId}?from=${backFrom}`)
          }
        />
      </div>
    </section>
  );
}
