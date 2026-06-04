import StepBadge from "./stepBadge";

const totalSteps = 5;

const workspaces = [
  { id: 1, name: "Matemáticas Avanzadas", emoji: "📖", students: 32, tasks: 12, progress: 78, status: "Activo", color: "#EAB308" },
  { id: 2, name: "Laboratorio de Física", emoji: "🔬", students: 22, tasks: 8, progress: 65, status: "Activo", color: "#2563EB" },
  { id: 3, name: "Literatura", emoji: "📝", students: 31, tasks: 5, progress: 91, status: "Activo", color: "#84CC16" },
  { id: 4, name: "Historia Universal", emoji: "🌍", students: 28, tasks: 10, progress: 72, status: "Pausado", color: "#10B981" },
];

export default function DemoWorkspacesPage() {
  return (
    <div className="p-6">
      <StepBadge step={2} total={totalSteps} />
      <div className="mb-1">
        <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Mis Espacios</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Cada curso tiene su propio espacio con tareas, estudiantes y configuraciones independientes.</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {workspaces.map((ws, i) => (
          <div key={ws.name} className={`relative rounded-xl border p-4 transition-all hover:shadow-md ${
            i === 0
              ? "border-[#275D79] bg-white shadow-sm dark:border-[#3a7fa0] dark:bg-[#141f33]"
              : "border-neutral-200 bg-white dark:border-slate-700 dark:bg-[#141f33]"
          }`}>
            {i === 0 && (
              <div className="pointer-events-none absolute -right-2 -top-2 z-10">
                <div className="rounded-full bg-[#275D79] px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">Seleccionado</div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f8fb] text-lg dark:bg-[#0d1a2e]">{ws.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{ws.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{ws.students} estudiantes · {ws.tasks} tareas</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                ws.status === "Activo"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              }`}>{ws.status}</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
              <div className="h-full rounded-full bg-[#275D79]" style={{ width: `${ws.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <div className="rounded-lg border border-[#275D79]/20 bg-[#f3f8fb] px-5 py-3 text-sm text-slate-700 dark:border-[#275D79]/30 dark:bg-[#0d1a2e] dark:text-slate-300">
          <span className="font-semibold text-[#275D79]">✦</span> Creá espacios ilimitados. Cada uno tiene su propio código para estudiantes.
        </div>
      </div>
    </div>
  );
}
