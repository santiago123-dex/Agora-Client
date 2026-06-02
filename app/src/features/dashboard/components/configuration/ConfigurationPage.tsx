"use client";

import { useUserConfig } from "./hooks/useUserConfig";
import PersonalInfoCard from "./components/PersonalInfoCard";
import AiAgentCard from "./components/AiAgentCard";
import NotificationsCard from "./components/NotificationsCard";
import ThemeCard from "./components/ThemeCard";

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
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando configuración...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8] px-4 py-6 dark:bg-[#0b1120] sm:px-7">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Configuración</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Administra tu perfil y preferencias
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            Cambios guardados correctamente
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="space-y-6"
        >
          <PersonalInfoCard
            firstName={form.firstName}
            lastName={form.lastName}
            email={form.email}
            onChange={updateField}
          />

          <AiAgentCard
            agenticMode={form.config.agenticMode}
            retroStyle={form.config.retroStyle}
            exigencyLevel={form.config.exigencyLevel}
            weeklyReport={form.config.weeklyReport}
            onChange={updateConfig}
            onSelect={updateConfig}
          />

          <NotificationsCard
            newSubmission={form.config.newSubmission}
            newGrading={form.config.newGrading}
            submissionAlert={form.config.submissionAlert}
            sendEmailNotification={form.config.sendEmailNotification}
            onChange={updateConfig}
          />

          <ThemeCard
            theme={form.config.theme}
            onChange={(v) => updateConfig("theme", v)}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#275D79] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
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
