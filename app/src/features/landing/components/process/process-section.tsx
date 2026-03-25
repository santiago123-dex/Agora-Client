const steps = [
    {
        number: "01",
        title: "Asigna Tareas",
        description: "Registrate y crea tu primer espacio de trabajo. Invita a tus estudiantes con un codigo unico.",
    },
    {
        number: "02",
        title: "Crear tu Espacio",
        description: "Crea tareas con instrucciones claras, adjunta materiales y establece fechas de entrega.",
    },
    {
        number: "03",
        title: "Califica con IA",
        description: "Recibe las entregas y usa nuestra IA para obtener sugerencias de calificacion instantaneas.",
    },
];

export default function ProcessSection() {
    return (
        <section id="guia" className="bg-[#EBF3F6] pt-20 border-t-2 border-[#eaeaea]">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mx-auto mb-4 max-w-3xl text-center">
                    <h2 className="text-4xl font-semibold">
                        Comienza en 3 simples pasos
                    </h2>
                    <p className="mt-3 text-gray-500">
                        Configurar tu primer espacio de trabajo toma menos de 5 minutos.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="flex h-full flex-col items-center px-2 py-10 text-center"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#275D79]">
                                <span className="text-xl font-semibold text-white">{step.number}</span>
                            </div>
                            <div className="mt-5 flex flex-1 flex-col">
                                <h2 className="text-lg font-semibold text-slate-950">
                                    {step.title}
                                </h2>
                                <p className="mt-3 font-medium leading-7 text-gray-500">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
