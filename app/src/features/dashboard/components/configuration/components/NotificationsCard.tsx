import { Bell } from "lucide-react";

type Props = {
  newSubmission: boolean;
  newGrading: boolean;
  submissionAlert: boolean;
  sendEmailNotification: boolean;
  onChange: (field: "newSubmission" | "newGrading" | "submissionAlert" | "sendEmailNotification", value: boolean) => void;
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        enabled ? "bg-[#275D79] dark:bg-[#3a7fa0]" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform dark:bg-slate-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

const items = [
  { key: "newSubmission" as const, label: "Nueva entrega", desc: "Cuando un estudiante entrega una tarea" },
  { key: "newGrading" as const, label: "Nueva calificación", desc: "Cuando califican tu trabajo" },
  { key: "submissionAlert" as const, label: "Recordatorio de entrega", desc: "Un día antes de la fecha límite" },
  { key: "sendEmailNotification" as const, label: "Notificaciones por correo", desc: "Recibe las notificaciones también por email" },
];

export default function NotificationsCard({ newSubmission, newGrading, submissionAlert, sendEmailNotification, onChange }: Props) {
  const values = { newSubmission, newGrading, submissionAlert, sendEmailNotification };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#253245] dark:bg-[#141f33]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
          <Bell size={15} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notificaciones</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Controla qué notificaciones recibes</p>
        </div>
      </div>

      <div className="mt-4 space-y-0.5">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
            <Toggle enabled={values[item.key]} onChange={(v) => onChange(item.key, v)} />
          </div>
        ))}
      </div>
    </section>
  );
}
