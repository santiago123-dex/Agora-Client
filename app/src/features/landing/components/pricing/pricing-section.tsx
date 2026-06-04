import Link from "next/link";

const plans = [
    {
        name: "Gratuito",
        price: "$0",
        period: "/mes",
        description: "Perfecto para probar la plataforma.",
        features: [
            "1 espacio de trabajo",
            "5 tareas por mes",
            "Calificación con IA básica",
            "Hasta 30 estudiantes",
        ],
        cta: "Comenzar Gratis",
        href: "/auth/register",
        popular: false,
    },
    {
        name: "Pro",
        price: "$9",
        period: "/mes",
        description: "Para profesores que quieren llevar su clase al siguiente nivel.",
        features: [
            "Espacios de trabajo ilimitados",
            "Tareas ilimitadas",
            "Calificación con IA avanzada",
            "Exportación de datos",
            "Estudiantes ilimitados",
            "Soporte prioritario",
        ],
        cta: "Empezar Pro",
        href: "/auth/register",
        popular: true,
    },
    {
        name: "Institucional",
        price: "A medida",
        period: "",
        description: "Para instituciones educativas y equipos.",
        features: [
            "Todo lo de Pro",
            "SSO / SAML",
            "API dedicada",
            "Onboarding personalizado",
            "SLA de uptime",
            "Facturación unificada",
        ],
        cta: "Contactar",
        href: "#contacto",
        popular: false,
    },
];

export default function PricingSection() {
    return (
        <section id="precios" className="bg-white py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="text-4xl font-semibold text-slate-950">
                        Planes para cada necesidad
                    </h2>
                    <p className="mt-3 text-xl text-gray-400">
                        Empezá gratis, escalá cuando lo necesites.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                                plan.popular
                                    ? "border-[#275D79] bg-white shadow-xl shadow-[#275D79]/10"
                                    : "border-neutral-200 bg-white shadow-sm hover:shadow-md"
                            }`}
                        >
                            {plan.popular ? (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#275D79] px-4 py-1 text-xs font-semibold text-white">
                                    Más popular
                                </span>
                            ) : null}

                            <h3 className="text-lg font-semibold text-slate-950">
                                {plan.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {plan.description}
                            </p>

                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-950">
                                    {plan.price}
                                </span>
                                {plan.period ? (
                                    <span className="text-sm text-gray-400">
                                        {plan.period}
                                    </span>
                                ) : null}
                            </div>

                            <ul className="mt-8 flex-1 space-y-3">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 text-sm text-slate-600"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#275D79"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mt-0.5 shrink-0"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                                    plan.popular
                                        ? "bg-[#275D79] text-white shadow-lg shadow-[#275D79]/20 hover:bg-[#1f4a61]"
                                        : "border border-slate-300 text-slate-950 hover:bg-slate-50"
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
