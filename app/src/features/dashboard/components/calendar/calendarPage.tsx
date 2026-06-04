"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";
import Link from "next/link";
import { getMyWorkspaces } from "@/app/src/lib/api/workspaces";
import { getAssignmentsByWorkspace } from "@/app/src/lib/api/assignments";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  workspaceId: string;
  workspaceName: string;
  workspaceColor: string;
  isExpired: boolean;
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

async function fetchCalendarEvents() {
  const raw = await getMyWorkspaces();
  const adminWorkspaces = raw.filter((w) => w.role === "ADMIN");

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

  return allEvents;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const { data: events = [], isLoading } = useSWR("calendar-events", fetchCalendarEvents);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startPad = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ day: number; events: CalendarEvent[]; isToday: boolean }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startPad; i++) {
      days.push({ day: 0, events: [], isToday: false });
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
      });
    }

    return days;
  }, [currentMonth, currentYear, events]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-950">Calendario</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <span className="min-w-36 text-center text-base font-semibold text-slate-900">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>

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
                className={`min-h-24 border-b border-r border-slate-100 px-1.5 py-2 ${
                  day.day === 0 ? "bg-slate-50" : ""
                }`}
              >
                {day.day > 0 ? (
                  <>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        day.isToday
                          ? "bg-[#275D79] font-bold text-white"
                          : "text-slate-700"
                      }`}
                    >
                      {day.day}
                    </span>
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

        {selectedEvent ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}
          >
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedEvent.workspaceColor }}
                />
                <span className="text-xs font-medium text-slate-500">
                  {selectedEvent.workspaceName}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {selectedEvent.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
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
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
