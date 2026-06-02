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

import { bffFetch } from "./bff-client";

export function sendChatMessage(message: string, workspaceId?: string, sessionId?: string) {
  return bffFetch<ChatResponse>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      workspace_id: workspaceId,
      session_id: sessionId,
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
  return bffFetch<SuggestGradesResponse>("/api/ai/suggest-grades", {
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
  return bffFetch<ApproveSuggestionResponse>("/api/ai/approve-suggestion", {
    method: "POST",
    body: JSON.stringify({ suggestion_id: suggestionId }),
  });
}
