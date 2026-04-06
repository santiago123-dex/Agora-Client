const recentActivity = [
  {
    type: "submission" as const,
    title: "Maria Garcia entrego Tarea 3: Integrales",
    context: "Matematicas Avanzadas",
    time: "hace 5 min",
  },
  {
    type: "grade" as const,
    title: "Derivadas Parciales calificada con 92%",
    context: "Fisica I",
    time: "hace 15 min",
  },
  {
    type: "join" as const,
    title: "Carlos Lopez se unio al espacio",
    context: "Matematicas Avanzadas",
    time: "hace 2 horas",
  },
];

export default function RecentActivityPanel() {
  return (
    <section className="rounded-[22px] border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-5">
      <div className="mb-4 space-y-1">
        <h3 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-slate-950">
          Actividad Reciente
        </h3>
        <p className="text-sm text-slate-500">Ultimas novedades</p>
      </div>

      <div className="space-y-3">
        {recentActivity.map((item) => (
          <article key={`${item.title}-${item.time}`} className="flex items-start gap-3 py-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDECF1] text-[#275D79]">
              {item.type === "join" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m8 11 3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              ) : item.type === "grade" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 20V10" />
                  <path d="m18 20-6-6-6 6" />
                  <path d="M12 4v2" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M8 13h8" />
                  <path d="M8 17h5" />
                </svg>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <h4 className="text-[0.95rem] font-medium leading-5 text-slate-950">
                {item.title}
              </h4>
              <p className="text-sm text-slate-500">
                {item.context} - {item.time}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
