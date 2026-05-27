"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import type { AssignmentResponse } from "@/app/src/lib/api/assignments";
import { getSubmissionsByAssignment } from "@/app/src/lib/api/submissions";
import type { SubmissionResponse } from "@/app/src/lib/api/submissions";
import { getWorkspaceMembers } from "@/app/src/lib/api/workspaces";
import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
import AssignmentHeader from "./components/AssignmentHeader";
import AssignmentStats from "./components/AssignmentStats";
import AiSummaryPanel from "./components/AiSummaryPanel";
import SubmissionList from "./components/SubmissionList";
import SubmissionReviewPanel from "./components/SubmissionReviewPanel";
import EditAssignmentModal from "./components/EditAssignmentModal";
import { buildRows, getMemberName } from "./helpers";

type Props = {
  workspaceId: string;
  taskId: string;
};

type LocalGrade = {
  grade?: number;
  feedback?: string;
};

export default function AssignmentAdminDetail({ workspaceId, taskId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backFrom = from === "dashboard" ? "dashboard" : "workspace";
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [members, setMembers] = useState<WorkspaceMemberDetailsResponse[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [localGrades, setLocalGrades] = useState<Record<string, LocalGrade>>(
    {},
  );
  const [aiAnalyses, setAiAnalyses] = useState<Record<string, string>>({});
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadDetail() {
      setIsLoading(true);
      setError(null);

      try {
        const assignments = await getAssignmentsByWorkspace(workspaceId);

        if (!isActive) return;

        const currentAssignment = assignments.find(
          (item) => String(item.id) === String(taskId),
        );

        if (!currentAssignment) {
          setError("No se encontró la tarea seleccionada.");
          return;
        }

        setAssignment(currentAssignment);

        const [membersResult, submissionsResult] = await Promise.allSettled([
          getWorkspaceMembers(workspaceId),
          getSubmissionsByAssignment(taskId),
        ]);

        if (!isActive) return;

        const membersResponse =
          membersResult.status === "fulfilled" ? membersResult.value : [];
        const submissionsResponse =
          submissionsResult.status === "fulfilled"
            ? submissionsResult.value
            : [];

        setMembers(membersResponse);
        setSubmissions(submissionsResponse);
        setSelectedUserId(
          (current) => current ?? String(membersResponse[0]?.userId ?? ""),
        );
      } catch (loadError) {
        if (!isActive) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el detalle de la tarea",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      isActive = false;
    };
  }, [workspaceId, taskId]);

  const rows = useMemo(() => {
    if (!assignment) return [];
    return buildRows(members, submissions, assignment.dueDate, localGrades);
  }, [assignment, members, submissions, localGrades]);

  const selectedRow =
    rows.find((row) => String(row.member.userId) === selectedUserId) ?? rows[0];

  useEffect(() => {
    if (!selectedRow) return;

    const local = localGrades[String(selectedRow.member.userId)] ?? {};
    setGradeInput(typeof local.grade === "number" ? String(local.grade) : "");
    setFeedbackInput(local.feedback ?? "");
  }, [selectedRow, localGrades]);

  const stats = useMemo(() => {
    const submitted = rows.filter((row) => Boolean(row.submission)).length;
    const pending = rows.filter((row) => row.status === "pending").length;
    const graded = rows.filter((row) => row.status === "graded").length;
    const late = rows.filter((row) => row.status === "late").length;

    return { submitted, pending, graded, late };
  }, [rows]);

  const handleAnalyze = () => {
    if (!selectedRow) return;

    const memberName = getMemberName(selectedRow.member);
    setAiAnalyses((current) => ({
      ...current,
      [String(selectedRow.member.userId)]:
        `La entrega de ${memberName} responde a la consigna y muestra procedimiento. ` +
        "Revisa precisión, justificación y pasos intermedios antes de asignar la nota final.",
    }));
  };

  const handleSaveGrade = () => {
    if (!selectedRow) return;

    const grade = Number(gradeInput);
    if (Number.isNaN(grade)) return;

    setLocalGrades((current) => ({
      ...current,
      [String(selectedRow.member.userId)]: {
        grade: Math.max(0, Math.min(100, grade)),
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
    return (
      <div className="p-7 text-sm text-slate-500">
        Cargando detalle de tarea...
      </div>
    );
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

        <AiSummaryPanel analyzed={stats.graded} total={stats.submitted} />

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <SubmissionList
            rows={rows}
            selectedUserId={
              selectedRow ? String(selectedRow.member.userId) : undefined
            }
            onSelect={setSelectedUserId}
          />

          {selectedRow ? (
            <SubmissionReviewPanel
              row={selectedRow}
              aiAnalysis={aiAnalyses[String(selectedRow.member.userId)]}
              grade={gradeInput}
              feedback={feedbackInput}
              onAnalyze={handleAnalyze}
              onGradeChange={handleGradeChange}
              onFeedbackChange={handleFeedbackChange}
              onSave={handleSaveGrade}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              No hay miembros en este espacio para calificar.
            </div>
          )}
        </div>

        <EditAssignmentModal
          assignment={assignment}
          isOpen={isEditModalOpen}
          workspaceId={workspaceId}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={(updatedAssignment) => setAssignment(updatedAssignment)}
          onDeleted={() =>
            router.push(`/dashboard/workspace/${workspaceId}?from=${backFrom}`)
          }
        />
      </div>
    </section>
  );
}
