import type { SubmissionResponse } from "@/app/src/lib/api/submissions";
import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
import type { MemberSubmissionRow, SubmissionStatus } from "./types";

export function formatTaskDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function getMemberName(member: WorkspaceMemberDetailsResponse) {
  return (
    member.fullName ||
    `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() ||
    "Estudiante sin nombre"
  );
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .flatMap((part) => (part ? [part[0]?.toUpperCase()] : []))
    .join("")
    .slice(0, 2);
}

export function getSubmissionText(submission?: SubmissionResponse) {
  if (!submission) return "Este estudiante todavía no ha enviado respuesta.";

  const content = submission.content;

  if (!content) return "Este estudiante todavía no ha enviado respuesta.";

  const candidates = [
    content.text,
    content.answer,
    content.response,
    content.description,
    content.message,
  ];

  const text = candidates.find((value) => typeof value === "string");

  if (text) return text;

  return JSON.stringify(content, null, 2);
}

export type SubmissionFileView = {
  name: string;
  href?: string;
  mediaId?: string;
  mimeType?: string;
};

function mapSubmissionFile(value: unknown, index: number): SubmissionFileView {
  if (typeof value === "string") {
    return { name: value };
  }

  if (value && typeof value === "object") {
    const file = value as Record<string, unknown>;
    const name = typeof file.name === "string" ? file.name : `archivo_${index + 1}`;
    const hrefCandidates = [file.dataUrl, file.url, file.href];
    const href = hrefCandidates.find((candidate) => typeof candidate === "string");
    const mediaId = typeof file.mediaId === "string" ? file.mediaId : undefined;
    const mimeType = typeof file.type === "string" ? file.type : undefined;

    return {
      name,
      href: typeof href === "string" ? href : undefined,
      mediaId,
      mimeType,
    };
  }

  return { name: `archivo_${index + 1}` };
}

export function getSubmissionFiles(submission?: SubmissionResponse): SubmissionFileView[] {
  if (!submission) return [];

  const files = submission.files;

  if (!files) return [];

  if (Array.isArray(files)) {
    return files.map(mapSubmissionFile).slice(0, 4);
  }

  const attachments = files.attachments;

  if (Array.isArray(attachments)) {
    return attachments.map(mapSubmissionFile).slice(0, 4);
  }

  return Object.values(files).map(mapSubmissionFile).slice(0, 4);
}

export function getStoredGrade(submission?: SubmissionResponse) {
  if (!submission) return undefined;

  const result = submission.result;

  if (!result) return undefined;

  const value = result.grade ?? result.score ?? result.points;
  if (typeof value === "number") return value;

  const ai = result.ai;
  if (ai && typeof ai === "object") {
    const aiScore = (ai as Record<string, unknown>).score;
    if (typeof aiScore === "number") return aiScore;
  }

  return undefined;
}

export function getStoredAiAnalysis(
  submission?: SubmissionResponse,
):
  | {
      total_score: number;
      feedback_summary: string;
      criteria_results: Array<{
        criterion_id: string;
        criterion_name: string;
        score: number;
        feedback: string;
      }>;
      evaluated_at: string;
    }
  | undefined {
  if (!submission) return undefined;

  const result = submission.result;
  if (!result) return undefined;

  const ai = result.ai;
  if (!ai || typeof ai !== "object") return undefined;

  const aiRecord = ai as Record<string, unknown>;
  const score = aiRecord.score;
  if (typeof score !== "number") return undefined;

  const rubricResults = aiRecord.rubricResults;
  const criteria_results = Array.isArray(rubricResults)
    ? rubricResults.map((r: unknown) => {
        const cr = r as Record<string, unknown>;
        return {
          criterion_id: String(cr.criterionId ?? ""),
          criterion_name: String(cr.criterionId ?? ""),
          score: typeof cr.score === "number" ? cr.score : 0,
          feedback: String(cr.feedback ?? ""),
        };
      })
    : [];

  return {
    total_score: score,
    feedback_summary: String(aiRecord.feedback ?? ""),
    criteria_results,
    evaluated_at: String(aiRecord.evaluatedAt ?? ""),
  };
}

export function getSubmissionStatus(
  submission: SubmissionResponse | undefined,
  dueDate: string,
  localGrade?: number,
): SubmissionStatus {
  if (!submission) return "pending";
  if (typeof localGrade === "number" || typeof getStoredGrade(submission) === "number") {
    return "graded";
  }
  if (new Date(submission.createdAt).getTime() > new Date(dueDate).getTime()) {
    return "late";
  }
  return "submitted";
}

export function buildRows(
  members: WorkspaceMemberDetailsResponse[],
  submissions: SubmissionResponse[],
  dueDate: string,
  localGrades: Record<string, { grade?: number; feedback?: string }>,
): MemberSubmissionRow[] {
  if (members.length === 0) return [];

  const submissionsByUserId = new Map(
    submissions.map((submission) => [String(submission.userId), submission]),
  );

  return members.map((member) => {
    const submission = submissionsByUserId.get(String(member.userId));
    const local = localGrades[String(member.userId)] ?? {};

    return {
      member,
      submission,
      status: getSubmissionStatus(submission, dueDate, local.grade),
      localGrade: local.grade,
      feedback: local.feedback,
    };
  });
}
