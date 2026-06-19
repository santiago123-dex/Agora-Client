import { CheckCircle2, Clock3, FileText, TimerOff } from "lucide-react";

type Props = {
  submitted: number;
  pending: number;
  graded: number;
  late: number;
};

const statMeta = {
  submitted: {
    label: "Entregas",
    icon: FileText,
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400",
  },
  pending: {
    label: "Pendientes",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  },
  graded: {
    label: "Calificadas",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  late: {
    label: "Tardías",
    icon: TimerOff,
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
  },
};

export default function AssignmentStats({ submitted, pending, graded, late }: Props) {
  const stats = [
    ["submitted", submitted],
    ["pending", pending],
    ["graded", graded],
    ["late", late],
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(([key, value]) => {
        const meta = statMeta[key];
        const Icon = meta.icon;

        return (
          <article
            key={key}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${meta.className}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-bold text-slate-950 dark:text-slate-100">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{meta.label}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
