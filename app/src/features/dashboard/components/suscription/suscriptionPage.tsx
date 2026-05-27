const plans = [
  {
    id: "free",
    title: "Free Plan",
    price: 0,
    currency: "USD",
    period: "/mes",
    characteristics: [
      "Administrar espacios de trabajo propios",
      "Participar en otros espacios de trabajo",
      "Adjuntar archivos (20 MB máx)",
      "Acceso general a las funciones de la plataforma (sin IA)",
    ],
  },
  {
    id: "premium",
    title: "Premium Plan",
    price: 20,
    currency: "USD",
    period: "/mes",
    characteristics: [
      "Acceso a IA para análisis de entregas",
      "Permite establecer rúbricas personalizadas en cada actividad para calificar con IA",
      "Calificación y retroalimentación de trabajos usando IA",
      "Acceso completo a las funcionalidades de Agora",
      "Adjuntar archivos (50 MB máx)",
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise Plan",
    price: 100,
    currency: "USD",
    period: "/mes",
    characteristics: [
      "Acceso a nuevos modelos para el análisis de entregas",
      "Permite establecer rúbricas personalizadas en cada actividad para calificar con IA",
      "Calificación y retroalimentación usando diferentes modelos de IA",
      "Acceso completo a las funcionalidades de Agora",
      "Adjuntar archivos (100 MB máx)",
      "Posibilidad de unir hasta 6 cuentas al plan",
    ],
  },
] as const;

export default function SuscriptionPage() {
  return (
    <section className="px-4 py-6 sm:px-7">
      <div className="space-y-2 flex flex-col items-center mt-10 mb-10">
        <h2 className="text-2xl font-semibold text-slate-900">Actualiza tu suscripción</h2>
        <p className="text-sm text-slate-600">Elige el plan que mejor se adapte a tus necesidades.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => {
          const isMiddle = index === 1;

          return (
            <article
              key={plan.id}
              className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isMiddle
                ? "border-black bg-black text-white hover:opacity-90"
                : "border-slate-200 bg-white text-slate-900 hover:border-black hover:opacity-90"
                }`}
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{plan.title}</h3>
                <p className={`text-3xl font-bold ${isMiddle ? "text-white" : "text-[#275D79]"}`}>
                  {plan.currency} {plan.price}
                  <span className={`${isMiddle ? "text-white/70" : "text-slate-500"} text-sm font-medium`}>
                    {plan.period}
                  </span>
                </p>
              </div>

              <ul className={`mt-4 space-y-2 text-sm ${isMiddle ? "text-white/80" : "text-slate-600"}`}>
                {plan.characteristics.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${isMiddle ? "bg-white" : "bg-[#275D79]"
                        }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}

      </div>
    </section>
  );
}
