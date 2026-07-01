"use client";

import { useEffect, useState } from "react";
import { BookOpen, SquarePen, Monitor } from "lucide-react";
import ModalWrapper from "@/app/src/components/ui/ModalWrapper";

const STORAGE_KEY = "onboarding:v1";

const steps = [
    {
        title: "Bienvenido a Agora",
        description:
            "Agilizá tu trabajo: creá espacios de trabajo, asigná tareas y deja que la IA te ayude con las correcciones.",
        icon: <BookOpen size={32} strokeWidth={1.5} />,
    },
    {
        title: "Creá tu primer espacio",
        description:
            'Hacé clic en "Mis Espacios" y creá un curso. Cada espacio tiene sus propias tareas, estudiantes y configuraciones.',
        icon: <SquarePen size={32} strokeWidth={1.5} />,
    },
    {
        title: "Usá el asistente IA",
        description:
            "El botón de IA en la esquina superior derecha te permite hacer preguntas, generar tareas y calificar entregas automáticamente.",
        icon: <Monitor size={32} strokeWidth={1.5} />,
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
        <ModalWrapper open={open} onClose={dismiss}>
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
                            className="flex-1 rounded-xl border border-slate-300 py-2.5 min-h-11 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            Omitir
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep((s) => s + 1)}
                            className="flex-1 rounded-xl bg-[#275D79] py-2.5 min-h-11 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61]"
                        >
                            Siguiente
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={dismiss}
                        className="w-full rounded-xl bg-[#275D79] py-2.5 min-h-11 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61]"
                    >
                        ¡Empezar!
                    </button>
                )}
            </div>
        </ModalWrapper>
    );
}
