const testimonials = [
    {
        quote: "Agora me ahorra horas de corrección cada semana. La IA entiende el contexto de las respuestas y me da sugerencias muy precisas.",
        name: "María Fernández",
        role: "Profesora de Matemáticas, Colegio San Martín",
        avatar: "MF",
    },
    {
        quote: "Pasé de pasar listas en papel a tener todo digital. Mis estudiantes suben las tareas y yo las corrijo desde cualquier lado.",
        name: "Carlos Gómez",
        role: "Docente de Historia, Universidad Nacional",
        avatar: "CG",
    },
    {
        quote: "Lo que más me gusta es poder ver el progreso de cada estudiante en tiempo real. Las analíticas me ayudan a identificar quién necesita ayuda.",
        name: "Laura Martínez",
        role: "Directora Académica, Instituto Técnico",
        avatar: "LM",
    },
];

export default function TestimonialsSection() {
    return (
        <section id="testimonios" className="bg-[#EBF3F6] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="text-4xl font-semibold text-slate-950">
                        Lo que dicen los educadores
                    </h2>
                    <p className="mt-3 text-xl text-gray-500">
                        Miles de profesores ya confían en Agora para gestionar sus clases.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#275D79"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mb-4 opacity-40"
                            >
                                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                            </svg>

                            <blockquote className="flex-1 text-base leading-7 text-slate-600">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>

                            <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#275D79] text-sm font-semibold text-white">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-950">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
