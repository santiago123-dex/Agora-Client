"use client";

import { createContext, useContext } from "react";

export type CurrentUser = {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  username?: string;
  profileUnavailable?: boolean;
  theme?: string;
  profile?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type UserContextValue = {
  user: CurrentUser | null;
  isLoadingUser: boolean;
  refreshUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextValue>({
  user: null,
  isLoadingUser: true,
  refreshUser: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}
