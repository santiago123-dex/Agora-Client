import { ApiError } from "./client";

export type AiBlock = {
  type: string;
  content?: string;
  title?: string;
  description?: string;
  headers?: string[];
  rows?: string[][];
  [key: string]: unknown;
};

export type ChatResponse = {
  session_id: string;
  message: string;
  blocks: AiBlock[];
  actions_triggered: string[];
  error: string | null;
};

async function localFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      data?.message ?? "Ocurrió un error en la petición",
      response.status,
      data,
    );
  }

  return response.json() as Promise<T>;
}

export function sendChatMessage(message: string, workspaceId?: string) {
  return localFetch<ChatResponse>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      workspace_id: workspaceId,
    }),
  });
}

export type CriterionResult = {
  criterion_id: string;
  criterion_name: string;
  score: number;
  max_score: number;
  feedback: string;
  matched_level: string;
};

export type GradeResult = {
  submission_id: string;
  total_score: number;
  max_score: number;
  feedback_summary: string;
  grading_model: string;
  evaluated_at: string;
  criteria_results: CriterionResult[];
};

export type SuggestGradesResponse = {
  suggestion_id: string;
  results: GradeResult[];
  stats: {
    average_score: number;
    max_score: number;
    graded_submissions: number;
  };
};

export function suggestGrades(workspaceId: string, assignmentId: string) {
  return localFetch<SuggestGradesResponse>("/api/ai/suggest-grades", {
    method: "POST",
    body: JSON.stringify({
      workspace_id: workspaceId,
      assignment_id: assignmentId,
    }),
  });
}

export type ApproveSuggestionResponse = {
  suggestion_id: string;
  results: {
    submission_id: string;
    total_score: number;
    max_score: number;
    feedback_summary: string;
    grading_model: string;
    evaluated_at: string;
  }[];
};

export function approveSuggestion(suggestionId: string) {
  return localFetch<ApproveSuggestionResponse>("/api/ai/approve-suggestion", {
    method: "POST",
    body: JSON.stringify({ suggestion_id: suggestionId }),
  });
}
