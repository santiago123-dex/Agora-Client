import { BookOpen, FileSpreadsheet, BrainCircuit, Users, ChartColumn, CircleCheck } from "lucide-react";

const features = [
    {
        title: "Espacios de Trabajo",
        description: "Crea y organiza tus clases en espacios dedicados. Cada curso con su propio ambiente personalizado.",
        icon: <BookOpen size={24} />,
    },
    {
        title: "Gestión de Tareas",
        description: "Asigna tareas con fechas limite, adjunta recursos y recibe entregas de forma organizada.",
        icon: <FileSpreadsheet size={24} />,
    },
    {
        title: "Calificación con IA",
        description: "Nuestra IA analiza las entregas y sugiere calificaciones con retroalimentacion detallada.",
        icon: <BrainCircuit size={24} />,
    },
    {
        title: "Gestión de Estudiantes",
        description: "Visualiza el progreso de cada estudiante, estadisticas y rendimiento academico.",
        icon: <Users size={24} />,
    },
    {
        title: "Analiticas Detalladas",
        description: "Metricas y reportes que te ayudan a entender el desempeño de tu clase.",
        icon: <ChartColumn size={24} />,
    },
    {
        title: "Facil de Usar",
        description: "Interfaz intuitiva que no requiere capacitacion. Comienza a usar en minutos.",
        icon: <CircleCheck size={24} />,
    },
];

export default function FeatureSection() {
    return (
        <section id="funciones" className="py-20 border-t-2 border-[#e2dcd3]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="serif text-4xl tracking-tight">Todo lo que necesitas para ense&ntilde;ar mejor</h2>
                    <p className="mt-3 text-xl text-gray-400">Herramientas dise&ntilde;adas espec&iacute;ficamente para optimizar tu tiempo y mejorar la experiencia de aprendizaje.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {features.map((item, index) => (
                    <div
                        key={index}
                        className="group relative animate-card-in rounded-2xl border border-[#e2dcd3] bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#275D79]/10"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#275D79]/0 via-transparent to-[#275D79]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-15 pointer-events-none" />
                        <div className="mb-3 flex h-12 w-12 bg-[#f5f0ea] items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:bg-[#275D79] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#275D79]/25">
                            {item.icon}
                        </div>
                        <div className="mb-2 font-bold text-[17px] group-hover:text-[#275D79] transition-colors duration-300">
                            {item.title}
                        </div>
                        <div className="text-gray-500 font-medium">
                            {item.description}
                        </div>
                    </div>
                    ))}
                </div>
        </div>
        </section>
    )
}
