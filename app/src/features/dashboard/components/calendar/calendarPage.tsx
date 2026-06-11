"use client";

import { useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import useSWR from "swr";
import Link from "next/link";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";
import ModalWrapper from "@/app/src/components/ui/ModalWrapper";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  workspaceId: string;
  workspaceName: string;
  workspaceColor: string;
  isExpired: boolean;
};

type WorkspaceMeta = {
  id: string;
  name: string;
  accentColor: string;
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

async function fetchCalendarEvents() {
  const raw = await getMyWorkspaces();
  const adminWorkspaces = raw.filter((w) => w.role === "ADMIN");

  const workspacesMeta: WorkspaceMeta[] = adminWorkspaces.map((ws) => ({
    id: String(ws.id),
    name: ws.name,
    accentColor: typeof ws.data?.accentColor === "string" ? ws.data.accentColor : "#275D79",
  }));

  const allEvents: CalendarEvent[] = [];

  for (const ws of adminWorkspaces) {
    const assignments = await getAssignmentsByWorkspace(String(ws.id)).catch(() => []);
    const accentColor = typeof ws.data?.accentColor === "string" ? ws.data.accentColor : "#275D79";

    for (const a of assignments) {
      allEvents.push({
        id: String(a.id),
        title: a.name,
        date: new Date(a.dueDate),
        workspaceId: String(ws.id),
        workspaceName: ws.name,
        workspaceColor: accentColor,
        isExpired: a.isExpired,
      });
    }
  }

  return { events: allEvents, workspaces: workspacesMeta };
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<"month" | "week">("month");

  const { data, isLoading } = useSWR("calendar-events", fetchCalendarEvents);
  const events = data?.events ?? [];
  const workspaces = data?.workspaces ?? [];

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startPad = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ day: number; events: CalendarEvent[]; isToday: boolean; date: Date }> = [];

    for (let i = 0; i < startPad; i++) {
      const padDate = new Date(currentYear, currentMonth, -startPad + i + 1);
      days.push({ day: 0, events: [], isToday: false, date: padDate });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dayEvents = events.filter((e) => {
        const ed = new Date(e.date);
        return ed.getFullYear() === currentYear && ed.getMonth() === currentMonth && ed.getDate() === d;
      });
      days.push({
        day: d,
        events: dayEvents,
        isToday: date.getTime() === today.getTime(),
        date,
      });
    }

    return days;
  }, [currentMonth, currentYear, events, today]);

  const weekDays = useMemo(() => {
    const todayDay = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - todayDay);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dayEvents = events.filter((e) => {
        const ed = new Date(e.date);
        return ed.getFullYear() === date.getFullYear()
          && ed.getMonth() === date.getMonth()
          && ed.getDate() === date.getDate();
      });
      return {
        day: date.getDate(),
        events: dayEvents,
        isToday: date.getTime() === today.getTime(),
        date,
        dayName: DAYS[i],
      };
    });
  }, [events, today]);

  const prev = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const next = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const totalEvents = events.length;

  if (isLoading) {
    return (
      <section className="px-4 py-6 pb-10 sm:px-7">
        <h1 className="mb-6 text-2xl font-bold text-slate-950">Calendario</h1>
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-96 rounded bg-slate-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 pb-10 sm:px-7">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Calendario</h1>
            <p className="mt-1 text-sm text-slate-500">{totalEvents} tareas con fecha asignada</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setView("month")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "month"
                    ? "bg-[#275D79] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Mes
              </button>
              <button
                type="button"
                onClick={() => setView("week")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "week"
                    ? "bg-[#275D79] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Semana
              </button>
            </div>

            <button
              type="button"
              onClick={goToToday}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <CalendarDays size={14} />
              Hoy
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>
              <span className="min-w-36 text-center text-base font-semibold text-slate-900">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button
                type="button"
                onClick={next}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {workspaces.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="text-slate-400 font-medium">Workspaces:</span>
            {workspaces.map((ws) => (
              <span key={ws.id} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ws.accentColor }}
                />
                <span className="text-slate-600">{ws.name}</span>
              </span>
            ))}
          </div>
        )}

        {view === "month" ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {DAYS.map((d) => (
                <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-slate-500">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`relative min-h-24 border-b border-r border-slate-100 px-1.5 py-2 ${
                    day.day === 0 ? "bg-slate-50" : ""
                  }`}
                >
                  {day.day > 0 ? (
                    <>
                      <div className="relative inline-flex">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                            day.isToday
                              ? "bg-[#275D79] font-bold text-white"
                              : "text-slate-700"
                          }`}
                        >
                          {day.day}
                        </span>
                        {day.isToday && day.events.length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white leading-none">
                            {day.events.length}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {day.events.slice(0, 3).map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className="block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium leading-tight text-white transition hover:opacity-80"
                            style={{ backgroundColor: event.workspaceColor }}
                          >
                            {event.title}
                          </button>
                        ))}
                        {day.events.length > 3 ? (
                          <span className="px-1 text-[10px] text-slate-400">
                            +{day.events.length - 3} más
                          </span>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-7">
              {weekDays.map((wd, idx) => (
                <div key={idx} className="border-b border-r border-slate-100 last:border-r-0">
                  <div className={`px-2 py-2 text-center ${wd.isToday ? "bg-[#275D79]/5" : ""}`}>
                    <p className="text-xs text-slate-500">{wd.dayName}</p>
                    <span
                      className={`inline-flex mt-0.5 h-7 w-7 items-center justify-center rounded-full text-sm ${
                        wd.isToday
                          ? "bg-[#275D79] font-bold text-white"
                          : "text-slate-700"
                      }`}
                    >
                      {wd.day}
                    </span>
                  </div>
                  <div className="space-y-1 px-1.5 pb-2 min-h-[200px]">
                    {wd.events.length === 0 ? (
                      <p className="px-1 py-4 text-center text-[10px] text-slate-300">Sin tareas</p>
                    ) : (
                      wd.events.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className="block w-full truncate rounded px-1.5 py-1 text-left text-[10px] font-medium leading-tight text-white transition hover:opacity-80"
                          style={{ backgroundColor: event.workspaceColor }}
                        >
                          {event.title}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ModalWrapper
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        >
          {selectedEvent && (
            <>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedEvent.workspaceColor }}
                />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {selectedEvent.workspaceName}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {selectedEvent.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {selectedEvent.date.toLocaleDateString("es-CO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/dashboard/workspace/${selectedEvent.workspaceId}?from=dashboard`}
                  className="rounded-lg bg-[#275D79] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4a61]"
                  onClick={() => setSelectedEvent(null)}
                >
                  Ir al espacio
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-[#253245] dark:text-slate-400 dark:hover:bg-[#1a2740]"
                >
                  Cerrar
                </button>
              </div>
            </>
          )}
        </ModalWrapper>
      </div>
    </section>
  );
}
