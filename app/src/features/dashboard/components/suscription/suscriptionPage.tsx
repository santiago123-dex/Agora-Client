"use client";

import { useCallback, useState } from "react";
import { Loader, Check } from "lucide-react";
import useSWR from "swr";
import { createCheckoutSession, getProducts } from "@/app/src/lib/api/payment";
import type { StripeProduct } from "@/app/src/lib/api/payment";

const freePlan = {
  id: "free",
  name: "Free Plan",
  price: 0,
  currency: "USD",
  period: "/mes",
  features: [
    "Administrar espacios de trabajo propios",
    "Participar en otros espacios de trabajo",
    "Adjuntar archivos (20 MB máx)",
    "Acceso general a las funciones de la plataforma (sin IA)",
  ],
};

function parseFeatures(description: string | null): string[] {
  if (!description) return [];
  return description
    .split(";")
    .map((f) => f.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

type DisplayPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
};

export default function SuscriptionPage() {
  const { data: products = [], error, isLoading } = useSWR(
    "products",
    () => getProducts(),
  );
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleSelectPlan = useCallback(async (productId: string) => {
    setProcessingId(productId);

    try {
      const origin = window.location.origin;
      const successUrl = `${origin}/dashboard/suscription?success=true`;
      const cancelUrl = `${origin}/dashboard/suscription?canceled=true`;

      const { url } = await createCheckoutSession(productId, successUrl, cancelUrl);

      if (!url) {
        throw new Error("Error al crear la sesión de pago");
      }

      window.location.href = url;
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Error al iniciar el pago");
      setProcessingId(null);
    }
  }, []);

  const paidPlans: DisplayPlan[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.defaultPriceObject ? p.defaultPriceObject.unitAmount / 100 : 0,
    currency: p.defaultPriceObject?.currency?.toUpperCase() ?? "USD",
    period: p.defaultPriceObject?.recurring?.interval === "year" ? "/año" : "/mes",
    features: parseFeatures(p.description),
  }));

  const allPlans: DisplayPlan[] = [freePlan, ...paidPlans];

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8] px-4 py-6 dark:bg-[#0b1120] sm:px-7">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader className="h-4 w-4 animate-spin" />
          Cargando planes...
        </div>
      </section>
    );
  }

  const displayError = fetchError ?? (error instanceof Error ? error.message : null);
  const isPaymentError = fetchError !== null;

  if (displayError) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8] px-4 py-6 dark:bg-[#0b1120] sm:px-7">
        <div className="max-w-md text-center">
          <p className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
            {isPaymentError ? "Error al iniciar el pago" : "No se pudieron cargar los planes"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{displayError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8] px-4 py-6 dark:bg-[#0b1120] sm:px-7">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 mt-10 flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Actualiza tu suscripción
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Elegí el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {allPlans.map((plan) => {
            const isRecommended = plan.price > 0;

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isRecommended
                    ? "border-[#275D79] bg-white dark:border-[#3a7fa0] dark:bg-[#141f33]"
                    : "border-slate-200 bg-white dark:border-[#253245] dark:bg-[#141f33]"
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#275D79] px-3 py-1 text-xs font-semibold text-white dark:bg-[#3a7fa0]">
                    Recomendado
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {plan.name}
                  </h3>
                  <p className="mt-2">
                    <span className="text-3xl font-bold text-[#275D79] dark:text-[#3a7fa0]">
                      {plan.currency} {plan.price}
                    </span>
                    <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {plan.period}
                    </span>
                  </p>
                </div>

                <ul className="flex-1 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#275D79] dark:text-[#3a7fa0]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.price > 0 && (
                  <button
                    type="button"
                    disabled={processingId === plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#275D79] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3a7fa0] dark:hover:bg-[#2d6a8a]"
                  >
                    {processingId === plan.id ? (
                      <span className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        Redirigiendo al pago...
                      </span>
                    ) : (
                      "Seleccionar Plan"
                    )}
                  </button>
                )}
              </article>
            );
          })}
        </div>

        {paidPlans.length === 0 && !isLoading && (
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No hay planes de pago disponibles en este momento.
          </p>
        )}
      </div>
    </section>
  );
}
