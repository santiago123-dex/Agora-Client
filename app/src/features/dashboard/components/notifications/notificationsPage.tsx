"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const notifications: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
  }> = [];

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Notificaciones</h1>
          <p className="mt-1 text-sm text-slate-500">Historial de notificaciones</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <Bell className="mb-3 h-10 w-10 text-slate-300" />
              <h3 className="text-base font-semibold text-slate-800">
                No hay notificaciones
              </h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Aquí aparecerán las notificaciones sobre entregas, calificaciones y
                actividad en tus espacios.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-4 px-5 py-4 ${
                    !n.read ? "bg-[#E9F2F5]" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{n.description}</p>
                    <p className="mt-1 text-xs text-slate-400">{n.time}</p>
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
