import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type { SubmissionResponse } from "@/app/src/lib/api/submissions";

type Props = {
  params: Promise<{ assignmentId: string }>;
};

type CurrentUserResponse = {
  id: string;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { assignmentId } = await params;

    const user = await serverApiFetch<CurrentUserResponse>("/users/get-user", {
      method: "GET",
    });

    const submissions = await serverApiFetch<SubmissionResponse[]>(
      `/workspaces/submission/assignment/${assignmentId}`,
      { method: "GET" },
    );

    const mySubmission = submissions.find(
      (s) => String(s.userId) === String(user.id),
    );

    return NextResponse.json(mySubmission ?? null);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo obtener la entrega",
      },
      { status: 400 },
    );
  }
}
