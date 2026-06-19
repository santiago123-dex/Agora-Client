"use client";

import { Loader2, Save } from "lucide-react";
import { useUserConfig } from "./hooks/useUserConfig";
import PersonalInfoCard from "./components/PersonalInfoCard";
import AiAgentCard from "./components/AiAgentCard";
import NotificationsCard from "./components/NotificationsCard";

export default function ConfigurationPage() {
  const {
    form,
    isLoading,
    isSaving,
    error,
    success,
    updateField,
    updateConfig,
    save,
  } = useUserConfig();

  if (isLoading || !form) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8] dark:bg-[#0b1120]">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          Cargando configuración...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8] px-4 py-6 dark:bg-[#0b1120] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Configuración</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Administra tu perfil y preferencias
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            Cambios guardados correctamente
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="space-y-5"
        >
          <PersonalInfoCard
            firstName={form.firstName}
            lastName={form.lastName}
            email={form.email}
            avatarUrl={form.avatarUrl}
            onChange={updateField}
            onAvatarChange={(url) => updateField("avatarUrl", url)}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <NotificationsCard
              newSubmission={form.config.newSubmission}
              newGrading={form.config.newGrading}
              submissionAlert={form.config.submissionAlert}
              sendEmailNotification={form.config.sendEmailNotification}
              onChange={updateConfig}
            />

            <AiAgentCard
              agenticMode={form.config.agenticMode}
              retroStyle={form.config.retroStyle}
              exigencyLevel={form.config.exigencyLevel}
              weeklyReport={form.config.weeklyReport}
              onChange={updateConfig}
              onSelect={updateConfig}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#275D79] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
