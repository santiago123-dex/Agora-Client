import Link from "next/link";
import StepBadge from "./stepBadge";

const totalSteps = 5;

const stats = [
  { value: "4", label: "Espacios", color: "bg-[#275D79]", detail: "Tus cursos activos" },
  { value: "12", label: "Tareas activas", color: "bg-[#3a8cab]", detail: "Para esta semana" },
  { value: "83%", label: "Rendimiento", color: "bg-emerald-500", detail: "Promedio general" },
  { value: "156", label: "Estudiantes", color: "bg-amber-500", detail: "En todos tus espacios" },
];

const adminWorkspaces = [
  { id: "1", title: "Matemáticas Avanzadas", desc: "Curso de cálculo y álgebra lineal", color: "#EAB308", members: 32, role: "admin" },
  { id: "2", title: "Laboratorio de Física", desc: "Prácticas de laboratorio de física general", color: "#2563EB", members: 22, role: "admin" },
];

const memberWorkspaces = [
  { id: "3", title: "Literatura Hispanoamericana", desc: "Análisis literario contemporáneo", color: "#84CC16", members: 31, role: "miembro" },
  { id: "4", title: "Historia Universal", desc: "Historia moderna y contemporánea", color: "#10B981", members: 28, role: "miembro" },
];

const pendingTasks = [
  { title: "Proyecto Final React", subject: "Programación Web", due: "29 feb" },
  { title: "Reporte de Laboratorio", subject: "Química Orgánica", due: "31 feb" },
  { title: "Ejercicios Capítulo 5", subject: "Programación Web", due: "29 feb" },
];

const recentActivity = [
  { text: "María García entregó Tarea 3: Integrales", meta: "Matemáticas Avanzadas - hace 5 min" },
  { text: "Derivadas Parciales calificada con 92%", meta: "Física I - hace 15 min" },
  { text: "Carlos López se unió al espacio", meta: "Matemáticas Avanzadas - hace 2 horas" },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-slate-950">{title}</h3>
      <Link href="/dashboard/workspace" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-[#275D79]">
        Ver todos
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </Link>
    </div>
  );
}

export default function DemoDashboardPage() {
  return (
    <div className="p-6">
      <StepBadge step={1} total={totalSteps} />
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Bienvenida, Sofía. Este es tu panel principal con un resumen de toda tu actividad.</p>
      </div>

      <div className="mb-8 mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="relative rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-[#141f33]">
            <p className="text-2xl font-bold text-slate-950 dark:text-slate-100">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{s.detail}</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: "85%" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_20rem] xl:gap-10 [@media(min-width:1450px)]:grid-cols-[minmax(0,1.7fr)_30rem] [@media(min-width:1450px)]:gap-8">
        <div className="space-y-10">
          <section className="space-y-5">
            <SectionHeader title="Mis Espacios de Trabajo" />
            <div className="grid gap-5 md:grid-cols-2">
              {adminWorkspaces.map((ws) => (
                <Link key={ws.id} href={`/dashboard/workspace/${ws.id}`}>
                  <article className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-[#141f33]">
                    <div className="flex h-16 items-end px-3 pb-3" style={{ backgroundColor: ws.color }}>
                      <span className="rounded-md bg-white/18 px-2 py-1 text-[0.68rem] font-medium text-white backdrop-blur-sm">{ws.role}</span>
                    </div>
                    <div className="space-y-1 px-4 py-4 [@media(min-width:1450px)]:py-7">
                      <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-slate-100">{ws.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{ws.desc}</p>
                      <p className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">{ws.members} miembros</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader title="Espacios donde participo" />
            <div className="grid gap-5 md:grid-cols-2">
              {memberWorkspaces.map((ws) => (
                <Link key={ws.id} href={`/dashboard/workspace/${ws.id}`}>
                  <article className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-[#141f33]">
                    <div className="flex h-16 items-end px-3 pb-3" style={{ backgroundColor: ws.color }}>
                      <span className="rounded-md bg-white/18 px-2 py-1 text-[0.68rem] font-medium text-white backdrop-blur-sm">{ws.role}</span>
                    </div>
                    <div className="space-y-1 px-4 py-4 [@media(min-width:1450px)]:py-7">
                      <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950 dark:text-slate-100">{ws.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{ws.desc}</p>
                      <p className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">{ws.members} miembros</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8 xl:pt-[2.85rem]">
          <section className="rounded-[22px] border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-[#141f33]">
            <div className="mb-4 space-y-1">
              <h3 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-slate-950 dark:text-slate-100">Tareas por entregar</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">3 tareas pendientes</p>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((t) => (
                <div key={t.title} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#0d1a2e]">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-[0.95rem] font-semibold text-slate-950 dark:text-slate-100">{t.title}</h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.subject}</p>
                  </div>
                  <span className="shrink-0 pt-1 text-xs text-slate-500">{t.due}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-[#141f33]">
            <div className="mb-4 space-y-1">
              <h3 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-slate-950 dark:text-slate-100">Actividad Reciente</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Últimas novedades</p>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a) => (
                <div key={a.text} className="space-y-0.5 py-1">
                  <p className="text-[0.95rem] font-medium leading-5 text-slate-950 dark:text-slate-100">{a.text}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{a.meta}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
