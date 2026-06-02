import { bffFetch } from "./bff-client";

export type UserConfig = {
  theme?: string;
  newSubmission?: boolean;
  newGrading?: boolean;
  submissionAlert?: boolean;
  sendEmailNotification?: boolean;
  agenticMode?: boolean;
  retroStyle?: string;
  exigencyLevel?: string;
  weeklyReport?: boolean;
};

export type UserProfile = {
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  educativeInstitution?: string;
  config?: UserConfig;
};

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  profile?: UserProfile | null;
  createdAt?: string;
};

export function getCurrentUser() {
  return bffFetch<UserResponse>("/api/auth/me");
}

export function updateUser(payload: {
  firstName: string;
  lastName: string;
  email: string;
  profile?: UserProfile | null;
}) {
  return bffFetch<UserResponse>("/api/users/update-user", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
