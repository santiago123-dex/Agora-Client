export type AiBlock = {
  type: string;
  content?: string;
  title?: string;
  description?: string;
  headers?: string[];
  columns?: string[];
  rows?: string[][];
  labels?: string[];
  values?: number[];
  chart_type?: string;
  fields?: { label: string; value: string }[];
  severity?: string;
  message?: string;
  label?: string;
  value?: string | number;
  delta?: string | number;
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

/**
 * Override para un criterio individual de la rúbrica.
 * Cuando el profesor corrige manualmente la nota o feedback que sugirió la IA,
 * se crea un CriterionOverride que se envía al backend al aprobar.
 *
 * Campos:
 * - submission_id: ID de la entrega del estudiante (int32 para el proto/gRPC)
 * - criterion_id:  ID del criterio de la rúbrica que se está overrideando
 * - original_score: Puntaje que asignó originalmente la IA (se guarda para auditoría)
 * - teacher_score:  Puntaje corregido por el profesor
 * - teacher_feedback: Feedback corregido por el profesor
 */
export type CriterionOverride = {
  submission_id: number;
  criterion_id: string;
  original_score: number;
  teacher_score: number;
  teacher_feedback: string;
};

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

/**
 * Aprueba (persiste) las sugerencias de calificación generadas por la IA.
 * El endpoint es POST /api/ai/approve-suggestion → BFF → Gateway → Agent.
 *
 * @param suggestionId - ID del conjunto de sugerencias a aprobar (devuelto por suggestGrades)
 * @param overrides    - Lista opcional de correcciones manuales del profesor sobre criterios individuales.
 *                       Si se envía, el backend aplica los overrides ANTES de persistir.
 *                       Si no se envía o está vacío, se aprueban las sugerencias tal cual.
 */
export function approveSuggestion(suggestionId: string, overrides?: CriterionOverride[]) {
  return bffFetch<ApproveSuggestionResponse>("/api/ai/approve-suggestion", {
    method: "POST",
    body: JSON.stringify({
      suggestion_id: suggestionId,
      ...(overrides?.length ? { overrides } : {}),
    }),
  }).then(async (response) => {
    const { toast } = await import("sonner");
    toast.success("Calificaciones guardadas");
    try {
      const { createNotification } = await import("./notifications");
      const count = response.results?.length ?? 0;
      await createNotification(
        "Calificaciones aprobadas",
        `${count} estudiante${count !== 1 ? "s" : ""} fue${count !== 1 ? "ron" : ""} calificado${count !== 1 ? "s" : ""}`,
      );
    } catch { /* fire-and-forget */ }
    return response;
  });
}

// ── Generate Class ──

export type Activity = {
  name: string;
  duration: string;
  description: string;
};

export type RubricItem = {
  criterion: string;
  excellent: string;
  good: string;
  fair: string;
  poor: string;
};

export type Evaluation = {
  method: string;
  criteria: string;
};

export type TopicDetail = {
  name: string;
  explanation: string;
  key_points: string[];
  examples: string[];
};

export type PlanData = {
  objective: string;
  topics: string[];
  topic_details?: TopicDetail[];
  activities: Activity[];
  rubric: RubricItem[];
  evaluation: Evaluation;
};

export type GenerateClassResponse = {
  id?: string;
  type: "plan" | "chat";
  session_id?: string;
  title: string;
  message?: string;
  plan_data?: PlanData;
};

export type ClassPlanListItem = {
  id: string;
  title: string;
  prompt: string;
  created_at: string;
};

export type ClassPlanDetail = {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  plan_data: PlanData;
  created_at: string;
};

export function generateClassPlan(prompt: string, sessionId?: string) {
  return bffFetch<GenerateClassResponse>("/api/ai/generate-class", {
    method: "POST",
    body: JSON.stringify({ prompt, session_id: sessionId }),
  });
}

export function saveClassPlan(title: string, prompt: string, plan_data: PlanData) {
  return bffFetch<{ plan: ClassPlanDetail }>("/api/ai/generate-class/save", {
    method: "POST",
    body: JSON.stringify({ title, prompt, plan_data }),
  });
}

export function getClassPlanHistory() {
  return bffFetch<{ plans: ClassPlanListItem[] }>("/api/ai/generate-class/history");
}

export function getClassPlan(id: string) {
  return bffFetch<{ plan: ClassPlanDetail }>(`/api/ai/generate-class/${id}`);
}

export function deleteClassPlan(id: string) {
  return bffFetch<{ status: string }>(`/api/ai/generate-class/${id}`, {
    method: "DELETE",
  });
}

export function deleteConversation(sessionId: string) {
  return bffFetch<{ status: string }>(
    `/api/ai/chat/conversations?session_id=${sessionId}`,
    { method: "DELETE" },
  );
}
