import { User, Mail, Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { uploadFile } from "@/app/src/lib/api/media";

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  onChange: (field: "firstName" | "lastName" | "email", value: string) => void;
  onAvatarChange?: (url: string) => void;
};

export default function PersonalInfoCard({ firstName, lastName, email, avatarUrl, onChange, onAvatarChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAvatarChange) return;
    setUploading(true);
    try {
      const result = await uploadFile(file);
      const url = `/api/media/${result.media.id}/file`;
      onAvatarChange(url);
    } catch {
      /* ignore */
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#253245] dark:bg-[#0f1a2e]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
          <User size={20} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Información Personal</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tu nombre, correo y foto de perfil</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#3f7a99] text-lg font-semibold text-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              (firstName[0]?.toUpperCase() ?? "U") + (lastName[0]?.toUpperCase() ?? "")
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 dark:border-[#253245] dark:bg-[#0f1a2e] dark:hover:bg-[#1a2740]"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          <p>PNG, JPG o WEBP</p>
          <p>Máximo 5 MB</p>
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
          <div className="relative mt-1.5">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => onChange("email", e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0a1424] dark:focus:ring-[#275D79]/40"
            />
          </div>
        </label>
      </div>
    </section>
  );
}
