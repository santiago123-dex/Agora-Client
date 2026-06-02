type Props = {
  firstName: string;
  lastName: string;
  email: string;
  onChange: (field: "firstName" | "lastName" | "email", value: string) => void;
};

export default function PersonalInfoCard({ firstName, lastName, email, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Información Personal</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tu nombre y correo electrónico</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Nombre</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Apellido</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
          />
        </label>
      </div>
    </section>
  );
}
