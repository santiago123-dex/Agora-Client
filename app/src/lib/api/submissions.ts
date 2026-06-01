export type SubmissionFilePayload = {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
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

async function localFetch<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Ocurrió un error en la petición");
  }

  return data as T;
}

export function getSubmissionsByAssignment(assignmentId: string | number) {
  return localFetch<SubmissionResponse[]>(
    `/api/workspaces/submissions?assignmentId=${assignmentId}`,
  );
}


export function getMySubmissionsByWorkspace(workspaceId: string | number) {
  return localFetch<SubmissionResponse[]>(
    `/api/workspaces/submissions?workspaceId=${workspaceId}`,
  );
}

export function createSubmission(payload: CreateSubmissionPayload) {
  return localFetch<SubmissionResponse>("/api/workspaces/submissions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMySubmissionByAssignment(assignmentId: string | number) {
  return localFetch<SubmissionResponse | null>(
    `/api/workspaces/submissions/${assignmentId}/my-submission`,
  );
}

export function deleteSubmission(submissionId: string | number) {
  return localFetch<null>(`/api/workspaces/submissions/${submissionId}`, {
    method: "DELETE",
  });
}
