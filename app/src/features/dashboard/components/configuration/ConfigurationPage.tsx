"use client";

import { Loader2, Save } from "lucide-react";
import { useUserConfig } from "./hooks/useUserConfig";
import PersonalInfoCard from "./components/PersonalInfoCard";
import AiAgentCard from "./components/AiAgentCard";
import NotificationsCard from "./components/NotificationsCard";
import { useState } from "react";

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
  // Generic para decir que tipo de dato estamos guardado
  const [activeTab, setActiveTab] = useState<"perfil" | "configuration">(
    "perfil",
  );

  if (isLoading || !form) {
    return (
      <section className="px-4 py-6 pb-10 sm:px-7">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="serif text-xl text-slate-900 dark:text-slate-100">
              Configuración
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Cargando...
            </p>
          </div>
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="serif text-xl text-slate-900 dark:text-slate-100">
            Configuración
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Administra tu perfil y preferencias
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            Cambios guardados correctamente
          </div>
        )}

        <div className="inline-flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-[#1a2639]">
          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "perfil"
                ? "bg-white text-slate-900 shadow-sm dark:bg-[#0f1a2e] dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Perfil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("configuration")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "configuration"
                ? "bg-white text-slate-900 shadow-sm dark:bg-[#0f1a2e] dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Configuración
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="space-y-5"
        >
          {activeTab == "perfil" && (
            <PersonalInfoCard
              firstName={form.firstName}
              lastName={form.lastName}
              email={form.email}
              avatarUrl={form.avatarUrl}
              onChange={updateField}
              onAvatarChange={(url) => updateField("avatarUrl", url)}
            />
          )}

          {activeTab == "configuration" && (
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
          )}

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
    </section>
  );
}
