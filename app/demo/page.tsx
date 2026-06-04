import DemoDashboardPage from "@/app/src/features/dashboard/components/demo/demoDashboardPage";
import DemoWorkspacesPage from "@/app/src/features/dashboard/components/demo/demoWorkspacesPage";
import StepBadge from "@/app/src/features/dashboard/components/demo/stepBadge";

type StepID = "1" | "2" | "3" | "4" | "5";

const totalSteps = 5;

function Step1Dashboard() {
    return <DemoDashboardPage />;
}

function Step2Workspaces() {
    return <DemoWorkspacesPage />;
}

function Step3Tasks() {
    const assignments = [
        { name: "Ejercicios de Integrales", submissions: 28, total: 32, due: "15 jun", status: "Abierta" },
        { name: "Ensayo: El Quijote", submissions: 22, total: 31, due: "22 jun", status: "Abierta" },
        { name: "Laboratorio: Péndulo", submissions: 18, total: 22, due: "10 jun", status: "Calificando" },
        { name: "TP: Revolución Francesa", submissions: 24, total: 28, due: "18 jun", status: "Abierta" },
    ];

    return (
        <div className="p-6">
            <StepBadge step={3} total={totalSteps} />
            <div className="mb-1">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Matemáticas Avanzadas</h1>
                    <span className="rounded-full bg-[#275D79]/10 px-2.5 py-0.5 text-xs font-medium text-[#275D79]">Activo</span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Gestioná las tareas del espacio. Cada tarea muestra entregas, estado y fecha límite.
                </p>
            </div>

            <div className="mt-5 space-y-3">
                {assignments.map((a) => (
                    <div key={a.name} className="relative rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-[#275D79]/30 dark:border-slate-700 dark:bg-[#141f33]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{a.name}</p>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    {a.submissions} de {a.total} entregas · Vence {a.due}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{Math.round((a.submissions / a.total) * 100)}%</p>
                                    <p className="text-[10px] text-slate-400">entregado</p>
                                </div>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    a.status === "Abierta"
                                        ? "bg-[#275D79]/10 text-[#275D79]"
                                        : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                }`}>
                                    {a.status}
                                </span>
                            </div>
                        </div>
                        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                            <div className="h-full rounded-full bg-[#275D79]" style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Step4Grading() {
    const submissions = [
        { name: "López, M.", grade: "85", time: "2.3s", feedback: "Resuelve correctamente pero omite simplificación.", status: "IA" },
        { name: "García, S.", grade: "—", time: "—", feedback: "", status: "Pendiente" },
        { name: "Pérez, J.", grade: "92", time: "1.8s", feedback: "Desarrollo completo y claro.", status: "IA" },
        { name: "Rodríguez, A.", grade: "78", time: "2.1s", feedback: "Bien encaminado, revisar paso 3.", status: "IA" },
        { name: "Fernández, M.", grade: "—", time: "—", feedback: "", status: "Entregado" },
    ];

    return (
        <div className="p-6">
            <StepBadge step={4} total={totalSteps} />
            <div className="mb-1">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Ejercicios de Integrales</h1>
                    <span className="rounded-full bg-[#275D79]/10 px-2.5 py-0.5 text-xs font-medium text-[#275D79]">28 entregas</span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    La IA califica automáticamente las entregas y sugiere notas con retroalimentación.
                </p>
            </div>

            <div className="mt-5 space-y-2">
                {submissions.map((s) => (
                    <div key={s.name} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#141f33]">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f8fb] text-xs font-semibold text-slate-600 dark:bg-[#0d1a2e] dark:text-slate-300">
                                {s.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-950 dark:text-slate-100">{s.name}</p>
                                {s.status === "IA" ? (
                                    <p className="truncate text-xs text-[#275D79]">{s.feedback}</p>
                                ) : (
                                    <p className="text-xs text-slate-400">{s.status}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            {s.status === "IA" ? (
                                <>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#275D79]">{s.grade}</p>
                                        <p className="text-[10px] text-slate-400">en {s.time}</p>
                                    </div>
                                    <span className="rounded-full bg-[#275D79]/10 px-2 py-0.5 text-[10px] font-medium text-[#275D79]">IA</span>
                                </>
                            ) : (
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    s.status === "Pendiente"
                                        ? "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                        : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                }`}>
                                    {s.status}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center">
                <div className="rounded-lg border border-[#275D79]/20 bg-[#f3f8fb] px-5 py-3 text-sm text-slate-700 dark:border-[#275D79]/30 dark:bg-[#0d1a2e] dark:text-slate-300">
                    <span className="font-semibold text-[#275D79]">✦</span> La IA calificó 3 entregas automáticamente. Solo revisás y aprobás.
                </div>
            </div>
        </div>
    );
}

function Step5Features() {
    return (
        <div className="p-6">
            <StepBadge step={5} total={totalSteps} />
            <div className="mb-1">
                <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Más herramientas</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Agora tiene todo lo que necesitás para gestionar tus clases.
                </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-700 dark:bg-[#141f33]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f8fb] dark:bg-[#0d1a2e]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-slate-100">Analíticas</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Gráficos de rendimiento, entregas por día, evolución por estudiante.</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-700 dark:bg-[#141f33]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f8fb] dark:bg-[#0d1a2e]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M16 2v4" />
                        </svg>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-slate-100">Calendario</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Vista mensual con fechas de entrega, eventos y feriados.</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-700 dark:bg-[#141f33]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f8fb] dark:bg-[#0d1a2e]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                        </svg>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-slate-100">Gradebook</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Notas, promedios y exportación de datos en un solo lugar.</p>
                </div>
            </div>

            <div className="mt-7 rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-[#141f33]">
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                    ¿Lista para transformar tu forma de enseñar?
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Creá tu cuenta gratis en menos de 2 minutos.
                </p>
            </div>
        </div>
    );
}

const stepComponents: Record<StepID, () => React.ReactNode> = {
    "1": Step1Dashboard,
    "2": Step2Workspaces,
    "3": Step3Tasks,
    "4": Step4Grading,
    "5": Step5Features,
};

export default async function DemoPage({
    searchParams,
}: {
    searchParams: Promise<{ step?: string }>;
}) {
    const { step } = await searchParams;
    const activeStep = (step ?? "1") as StepID;
    const Component = stepComponents[activeStep] ?? Step1Dashboard;

    return <Component />;
}
