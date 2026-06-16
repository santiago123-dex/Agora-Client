import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { changePassword } from "@/app/src/lib/api/users";

export default function PasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleChange = async () => {
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setStatus("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      await changePassword({ currentPassword, newPassword });
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar la contraseña");
      setStatus("error");
    }
  };

  const fields = [
    { label: "Contraseña actual", value: currentPassword, setter: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent((p) => !p) },
    { label: "Nueva contraseña", value: newPassword, setter: setNewPassword, show: showNew, toggle: () => setShowNew((p) => !p) },
    { label: "Confirmar contraseña", value: confirmPassword, setter: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm((p) => !p) },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#253245] dark:bg-[#141f33]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
          <Lock size={20} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Cambiar Contraseña</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Actualiza tu contraseña de acceso</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {fields.map((field) => (
          <label key={field.label} className="block">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{field.label}</span>
            <div className="relative mt-1.5">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={field.show ? "text" : "password"}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                disabled={status === "loading"}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
              />
              <button
                type="button"
                onClick={field.toggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
        ))}

        {status === "success" && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            Contraseña actualizada correctamente
          </div>
        )}

        {status === "error" && error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleChange}
            disabled={!currentPassword || !newPassword || !confirmPassword || status === "loading"}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Lock size={16} />
            )}
            {status === "loading" ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
        </div>
      </div>
    </section>
  );
}
