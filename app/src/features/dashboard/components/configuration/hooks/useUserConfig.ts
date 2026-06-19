import { useEffect, useState, useCallback } from "react";
import { getCurrentUser, updateUser } from "@/app/src/lib/api/users";
import type { UserResponse, UserProfile } from "@/app/src/lib/api/users";
import type { ConfigFormData } from "../types";
import { useUser } from "@/app/src/lib/contexts/UserContext";

// Transforma la respuesta del backend para usarlo en el front
function toFormData(user: UserResponse): ConfigFormData {
  const c = user.profile?.config ?? {};
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    avatarUrl: user.profile?.avatarUrl,
    config: {
      agenticMode: c.agenticMode ?? false,
      retroStyle: c.retroStyle ?? "detailed",
      exigencyLevel: c.exigencyLevel ?? "moderated",
      weeklyReport: c.weeklyReport ?? false,
      newSubmission: c.newSubmission ?? true,
      newGrading: c.newGrading ?? true,
      submissionAlert: c.submissionAlert ?? true,
      sendEmailNotification: c.sendEmailNotification ?? false,
      theme: c.theme ?? "light",
    },
  };
}

function toPayload(form: ConfigFormData, currentProfile: UserProfile | null | undefined): {
  firstName: string;
  lastName: string;
  email: string;
  profile: UserProfile;
} {
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    profile: {
      ...(currentProfile ?? {}),
      avatarUrl: form.avatarUrl ?? undefined,
      config: form.config,
    },
  };
}

export function useUserConfig() {
  const { refreshUser } = useUser();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [form, setForm] = useState<ConfigFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    getCurrentUser()
      .then((data) => {
        if (!active) return;
        setUser(data);
        setForm(toFormData(data));
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Error al cargar usuario");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);


  
  const updateField = useCallback(<K extends keyof ConfigFormData>(
    key: K,
    // ejemplo: ConfigFormData["firstName"] eso significa que va a devolver un string porque ese es el tipo del firstname
    value: ConfigFormData[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const updateConfig = useCallback(<K extends keyof ConfigFormData["config"]>(
    key: K,
    value: ConfigFormData["config"][K],
  ) => {
    setForm((prev) =>
      prev ? { ...prev, config: { ...prev.config, [key]: value } } : prev,
    );
  }, []);

  const save = useCallback(async () => {
    if (!form || !user) return;
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = toPayload(form, user.profile);
      const updated = await updateUser(payload);
      setUser(updated);
      setForm(toFormData(updated));
      setSuccess(true);
      refreshUser();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  }, [form, user, refreshUser]);

  return {
    user,
    form,
    isLoading,
    isSaving,
    error,
    success,
    updateField,
    updateConfig,
    save,
  };
}
