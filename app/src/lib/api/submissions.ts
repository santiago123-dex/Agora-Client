export type SubmissionFilePayload = {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  mediaId?: string;
};

export type CreateSubmissionPayload = {
  assignmentId: number;
  content?: Record<string, unknown>;
  files?: {
    attachments: SubmissionFilePayload[];
  };
};

export type SubmissionResponse = {
  id: number;
  assignmentId: number;
  userId: string;
  createdAt: string;
  content: Record<string, unknown> | null;
  files: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
};

import { bffFetch } from "./bff-client";

export function getSubmissionsByAssignment(assignmentId: string | number) {
  return bffFetch<SubmissionResponse[]>(
    `/api/workspaces/submissions?assignmentId=${assignmentId}`,
  );
}


export function getMySubmissionsByWorkspace(workspaceId: string | number) {
  return bffFetch<SubmissionResponse[]>(
    `/api/workspaces/submissions?workspaceId=${workspaceId}`,
  );
}

export function createSubmission(payload: CreateSubmissionPayload) {
  return bffFetch<SubmissionResponse>("/api/workspaces/submissions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMySubmissionByAssignment(assignmentId: string | number) {
  return bffFetch<SubmissionResponse | null>(
    `/api/workspaces/submissions/${assignmentId}/my-submission`,
  );
}

export function deleteSubmission(submissionId: string | number) {
  return bffFetch<null>(`/api/workspaces/submissions/${submissionId}`, {
    method: "DELETE",
  });
}
