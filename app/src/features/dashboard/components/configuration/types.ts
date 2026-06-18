import type { UserResponse, UserProfile, UserConfig } from "@/app/src/lib/api/users";

export type { UserResponse, UserProfile, UserConfig };

export type ConfigFormData = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  config: {
    agenticMode: boolean;
    retroStyle: string;
    exigencyLevel: string;
    weeklyReport: boolean;
    newSubmission: boolean;
    newGrading: boolean;
    submissionAlert: boolean;
    sendEmailNotification: boolean;
    theme: string;
  };
};
