import type { AssignmentResponse } from "@/app/src/lib/api/assignments";
import type { SubmissionResponse } from "@/app/src/lib/api/submissions";
import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";

export type SubmissionStatus = "submitted" | "pending" | "graded" | "late";

export type MemberSubmissionRow = {
  member: WorkspaceMemberDetailsResponse;
  submission?: SubmissionResponse;
  status: SubmissionStatus;
  localGrade?: number;
  feedback?: string;
};

export type AssignmentDetailData = {
  assignment: AssignmentResponse;
  members: WorkspaceMemberDetailsResponse[];
  submissions: SubmissionResponse[];
};
