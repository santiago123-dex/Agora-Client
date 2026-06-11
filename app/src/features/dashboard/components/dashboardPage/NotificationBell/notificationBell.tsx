"use client";

import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { getNotifications } from "@/app/src/lib/api/notifications";
import type { NotificationData } from "@/app/src/lib/api/notifications";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useSWR("notification-bell", getNotifications, {
    refreshInterval: 30000,
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#dadada] bg-white text-[#275D79] hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        aria-label="Notificaciones"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100">
              Notificaciones
            </h3>
          </div>

          {notifications.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              <Bell className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              No tienes notificaciones por ahora.
            </div>
          ) : (
            <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
              {notifications.map((n: NotificationData) => (
                <button
                  key={n.id}
                  type="button"
                  className={`flex w-full gap-3 px-5 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    !n.read ? "bg-[#E9F2F5] dark:bg-slate-800/50" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {n.description}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                  </div>
                  {!n.read ? (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#275D79]" />
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
