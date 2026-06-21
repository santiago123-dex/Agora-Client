"use client";

import { Save, Printer } from "lucide-react";
import type { GenerateClassResponse, PlanData } from "@/app/src/lib/api/ai";

type Props = {
  plan: GenerateClassResponse;
  onSave: (title: string, prompt: string, planData: PlanData) => void;
  prompt: string;
};

export default function ClassPlanCard({ plan, onSave, prompt }: Props) {
  const data = plan.plan_data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="serif text-2xl text-slate-950 dark:text-slate-100">
          {plan.title}
        </h3>
        <div className="flex shrink-0 gap-2">
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
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {data.objective}
          </p>
        </Section>

        <Section title="Temas">
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {data.topics.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
        </Section>

        <Section title="Actividades">
          <div className="space-y-3">
            {data.activities.map((activity, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-[#1e293b] dark:bg-[#0a1424]"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                    {activity.name}
                  </span>
                  <span className="text-xs font-medium text-[#275D79] dark:text-[#7BB8D4]">
                    {activity.duration}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Rúbrica de Evaluación">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
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
                    <td className="px-3 py-2 font-medium text-slate-950 dark:text-slate-100">
                      {item.criterion}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                      {item.excellent}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                      {item.good}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                      {item.fair}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                      {item.poor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Evaluación">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-[#1e293b] dark:bg-[#0a1424]">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Método: {data.evaluation.method}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {data.evaluation.criteria}
            </p>
          </div>
        </Section>
      </div>

      <style jsx>{`
        @media print {
          button { display: none !important; }
        }
      `}</style>
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
