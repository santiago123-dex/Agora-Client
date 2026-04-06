import { title } from "process";

export default function FeatureSection() {

    const features = [
        {
            tittle: "Espacios de Trabajo",
            description: "Crea y organiza tus clases en espacios dedicados. Cada curso con su propio ambiente personalizado.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-icon lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>,
        },
        {
            tittle: "Gestión de Tareas",
            description: "Asigna tareas con fechas limite, adjunta recursos y recibe entregas de forma organizada.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-spreadsheet-icon lucide-file-spreadsheet"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>,
        },
        {
            tittle: "Calificación con IA",
            description: "Nuestra IA analiza las entregas y sugiere calificaciones con retroalimentacion detallada.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-cog-icon lucide-brain-cog"><path d="m10.852 14.772-.383.923"/><path d="m10.852 9.228-.383-.923"/><path d="m13.148 14.772.382.924"/><path d="m13.531 8.305-.383.923"/><path d="m14.772 10.852.923-.383"/><path d="m14.772 13.148.923.383"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771"/><path d="M17.998 5.125a4 4 0 0 1 2.525 5.771"/><path d="M19.505 10.294a4 4 0 0 1-1.5 7.706"/><path d="M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516"/><path d="M4.5 10.291A4 4 0 0 0 6 18"/><path d="M6.002 5.125a3 3 0 0 0 .4 1.375"/><path d="m9.228 10.852-.923-.383"/><path d="m9.228 13.148-.923.383"/><circle cx="12" cy="12" r="3"/></svg>,
        },
        {
            tittle: "Gestión de Estudiantes",
            description: "Visualiza el progreso de cada estudiante, estadisticas y rendimiento academico.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>,
        },
        {
            tittle: "Analiticas Detalladas",
            description: "Metricas y reportes que te ayudan a entender el desempeño de tu clase.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-icon lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
        },
        {
            tittle: "Facil de Usar",
            description: "Interfaz intuitiva que no requiere capacitacion. Comienza a usar en minutos.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#275D79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
        },
    ];

    return (
        <section id="funciones" className="mt-10 py-20 border-t-2 border-[#eaeaea]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="text-4xl font-semibold">Todo lo que necesitas par enseñar mejor</h2>
                    <p className="mt-3 text-xl text-gray-400">Herramientas disenadas especificamente para optimizar tu tiempo y mejorar la experiencia de aprendizaje.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {features.map((item, index) =>(
                    <div key = { index } className = "rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" >
                        <div className="mb-3 flex h-12 w-12 bg-slate-100 items-center justify-center rounded-xl text-xl">
                            {item.icon}
                        </div>
                        <div className="mb-2 font-bold text-[17px]">
                            {item.tittle}
                        </div>
                        <div className="text-gray-500 font-medium">
                            {item.description}
                        </div>
                    </div>
                    ))}
                </div>
        </div>
        </section >
    )
}
