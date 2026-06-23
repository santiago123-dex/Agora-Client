import { Sun, Moon } from "lucide-react";

type Props = {
  theme: string;
  onChange: (value: string) => void;
};

const themes = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
];

export default function ThemeCard({ theme, onChange }: Props) {
  const handleChange = (value: string) => {
    localStorage.setItem("theme:v1", value);
    onChange(value);
  };
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#253245] dark:bg-[#141f33]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
          <Moon size={15} className="hidden dark:block" />
          <Sun size={15} className="dark:hidden" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Apariencia</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tema visual</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {themes.map((t) => {
          const Icon = t.icon;
          const selected = theme === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => handleChange(t.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition ${
                selected
                  ? "border-[#275D79] bg-[#275D79]/5 text-[#275D79] dark:bg-[#275D79]/20"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
