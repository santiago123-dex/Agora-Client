"use client";

import { Bell } from "lucide-react";
import useSWR from "swr";
import { getNotifications } from "@/app/src/lib/api/notifications";

export default function NotificationsPage() {
  const { data, error, isLoading } = useSWR("notifications", getNotifications);

  const notifications = data?.notifications ?? [];

  return (
    <section className="animate-page-in px-4 py-6 pb-10 sm:px-7">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
            Notificaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Historial de notificaciones
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#253245] dark:bg-[#141f33]">
          {isLoading ? (
            <div className="divide-y divide-slate-100 dark:divide-[#253245]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-700/50" />
                    <div className="h-3 w-1/4 animate-pulse rounded bg-slate-100 dark:bg-slate-700/50" />
                  </div>
                  <div className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-600" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center px-5 py-12 text-center">
              <Bell className="mb-3 h-10 w-10 text-red-300" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Error al cargar
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                {error instanceof Error
                  ? error.message
                  : "No se pudieron cargar las notificaciones. Intentalo de nuevo más tarde."}
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <Bell className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-500" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hay notificaciones
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Aquí aparecerán las notificaciones sobre entregas, calificaciones y
                actividad en tus espacios.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-[#253245]">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-4 px-5 py-4 ${
                    !n.read
                      ? "bg-[#E9F2F5] dark:bg-slate-800/40"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {n.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {n.time}
                    </p>
                  </div>
                  {!n.read ? (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#275D79]" />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
