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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#253245] dark:bg-[#141f33]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
          {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Apariencia</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Personaliza el tema visual</p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        {themes.map((t) => {
          const Icon = t.icon;
          const selected = theme === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => handleChange(t.value)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                selected
                  ? "border-[#275D79] bg-[#275D79]/5 text-[#275D79] dark:bg-[#275D79]/20"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
              }`}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
