"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "onboarding:v1";

const steps = [
    {
        title: "Bienvenido a Agora",
        description:
            "Agilizá tu trabajo: creá espacios de trabajo, asigná tareas y deja que la IA te ayude con las correcciones.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            </svg>
        ),
    },
    {
        title: "Creá tu primer espacio",
        description:
            "Hacé clic en \"Mis Espacios\" y creá un curso. Cada espacio tiene sus propias tareas, estudiantes y configuraciones.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
            </svg>
        ),
    },
    {
        title: "Usá el asistente IA",
        description:
            "El botón de IA en la esquina superior derecha te permite hacer preguntas, generar tareas y calificar entregas automáticamente.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
            </svg>
        ),
    },
];

export default function FirstTimeModal() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const seen = localStorage.getItem(STORAGE_KEY);
        if (seen !== "done") {
            setOpen(true);
        }
    }, []);

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, "done");
        setOpen(false);
    };

    if (!open) return null;

    const current = steps[step];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#141f33]">
                <div className="flex justify-center text-[#275D79]">{current.icon}</div>

                <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
                        {current.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {current.description}
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-1.5">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-colors ${i === step ? "bg-[#275D79]" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        />
                    ))}
                </div>

                <div className="mt-6 flex gap-3">
                    {step < steps.length - 1 ? (
                        <>
                            <button
                                type="button"
                                onClick={dismiss}
                                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Omitir
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep((s) => s + 1)}
                                className="flex-1 rounded-xl bg-[#275D79] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61]"
                            >
                                Siguiente
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={dismiss}
                            className="w-full rounded-xl bg-[#275D79] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61]"
                        >
                            ¡Empezar!
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
