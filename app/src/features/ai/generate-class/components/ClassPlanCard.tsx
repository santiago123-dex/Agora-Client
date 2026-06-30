"use client";

import { Save, Printer } from "lucide-react";
import type { GenerateClassResponse, PlanData } from "@/app/src/lib/api/ai";

type Props = {
  plan: GenerateClassResponse;
  onSave: (title: string, prompt: string, planData: PlanData) => void;
  prompt: string;
};

export default function ClassPlanCard({ plan, onSave, prompt }: Props) {
  if (!plan.plan_data) return null;
  const data = plan.plan_data;

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6 dark:border-[#253245] dark:bg-[#0f1a2e]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h3 className="serif min-w-0 text-xl break-words text-slate-950 sm:text-2xl dark:text-slate-100">
          {plan.title}
        </h3>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSave(plan.title, prompt, data)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#275D79] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1f4a61]"
          >
            <Save size={14} />
            Guardar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-[#253245] dark:bg-[#1a2740] dark:text-slate-300 dark:hover:bg-[#253245]"
          >
            <Printer size={14} />
            PDF
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Objetivo">
          <p className="break-words text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {data.objective}
          </p>
        </Section>

        <Section title="Temas">
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {data.topics.map((topic, i) => (
              <li key={i} className="break-words">{topic}</li>
            ))}
          </ul>
        </Section>

        {data.topic_details && data.topic_details.length > 0 && (
          <Section title="Contenido para el docente">
            <div className="space-y-4">
              {data.topic_details.map((td, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-[#1e293b] dark:bg-[#0a1424] sm:p-4"
                >
                  <h4 className="mb-2 break-words text-base font-semibold text-slate-950 dark:text-slate-100">
                    {td.name}
                  </h4>
                  <p className="mb-3 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {td.explanation}
                  </p>
                  {td.key_points.length > 0 && (
                    <div className="mb-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#275D79] dark:text-[#7BB8D4]">
                        Puntos clave
                      </p>
                      <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
                        {td.key_points.map((kp, j) => (
                          <li key={j} className="break-words">{kp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {td.examples.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#275D79] dark:text-[#7BB8D4]">
                        Ejemplos
                      </p>
                      <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
                        {td.examples.map((ex, j) => (
                          <li key={j} className="break-words">{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Actividades">
          <div className="space-y-3">
            {data.activities.map((activity, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-[#1e293b] dark:bg-[#0a1424] sm:p-4"
              >
                <div className="mb-1 flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="break-words text-sm font-semibold text-slate-950 dark:text-slate-100">
                    {activity.name}
                  </span>
                  <span className="text-xs font-medium text-[#275D79] dark:text-[#7BB8D4]">
                    {activity.duration}
                  </span>
                </div>
                <p className="break-words text-sm text-slate-600 dark:text-slate-400">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Rúbrica de Evaluación">
          <div className="space-y-3 sm:hidden">
            {data.rubric.map((item, i) => (
              <article
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-[#1e293b] dark:bg-[#0a1424]"
              >
                <h5 className="break-words text-sm font-semibold text-slate-950 dark:text-slate-100">
                  {item.criterion}
                </h5>
                <dl className="mt-3 space-y-2 text-sm">
                  <RubricLevel label="Excelente" value={item.excellent} />
                  <RubricLevel label="Bueno" value={item.good} />
                  <RubricLevel label="Suficiente" value={item.fair} />
                  <RubricLevel label="Insuficiente" value={item.poor} />
                </dl>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 dark:border-[#253245] dark:text-slate-400">
                  <th className="px-3 py-2">Criterio</th>
                  <th className="px-3 py-2">Excelente</th>
                  <th className="px-3 py-2">Bueno</th>
                  <th className="px-3 py-2">Suficiente</th>
                  <th className="px-3 py-2">Insuficiente</th>
                </tr>
              </thead>
              <tbody>
                {data.rubric.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 dark:border-[#1e293b]"
                  >
                    <td className="break-words px-3 py-2 text-sm font-medium text-slate-950 dark:text-slate-100">
                      {item.criterion}
                    </td>
                    <td className="break-words px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                      {item.excellent}
                    </td>
                    <td className="break-words px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                      {item.good}
                    </td>
                    <td className="break-words px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                      {item.fair}
                    </td>
                    <td className="break-words px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                      {item.poor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {data.evaluation && (
          <Section title="Evaluación">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-[#1e293b] dark:bg-[#0a1424]">
              <p className="break-words text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Método: {data.evaluation.method}
              </p>
              <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-400">
                {data.evaluation.criteria}
              </p>
            </div>
          </Section>
        )}
      </div>

      <style jsx>{`
        @media print {
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function RubricLevel({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#275D79] dark:text-[#7BB8D4]">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-slate-600 dark:text-slate-400">
        {value}
      </dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h4>
      {children}
    </div>
  );
}
