const pendingTasks = [
  {
    title: "Proyecto Final React",
    subject: "Programacion Web",
    dueDate: "29 feb",
    highlighted: false,
  },
  {
    title: "Reporte de Laboratorio",
    subject: "Quimica Organica",
    dueDate: "31 feb",
    highlighted: false,
  },
  {
    title: "Ejercicios Capitulo 5",
    subject: "Programacion Web",
    dueDate: "29 feb",
    highlighted: true,
  },
];

export default function PendingTasksPanel() {
  return (
    <section className="rounded-[22px] border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-5">
      <div className="mb-4 space-y-1">
        <h3 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-slate-950">
          Tareas por entregar
        </h3>
        <p className="text-sm text-slate-500">3 tareas pendientes</p>
      </div>

      <div className="space-y-3">
        {pendingTasks.map((task) => (
          <article
            key={`${task.title}-${task.dueDate}`}
            className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                {task.highlighted ? (
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-500"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="min-w-0">
                  <h4 className="truncate text-[0.95rem] font-semibold text-slate-950">
                    {task.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">{task.subject}</p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 pt-1 text-xs text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span>{task.dueDate}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
