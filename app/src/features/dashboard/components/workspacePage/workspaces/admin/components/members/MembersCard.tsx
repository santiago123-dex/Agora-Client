import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

type Props = {
  member: WorkspaceMemberDetailsResponse;
};

export default function MembersCard({ member }: Props) {
  const [imageError, setImageError] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  //Si exite avatarUrl y no el string no esta vacio muestra el avatar
  const showAvatar =
    member.avatarUrl && member.avatarUrl.trim() !== "" && !imageError;

  const name = `${member.firstName}`.trim();
  const initials = (member.fullName ?? "")
    .split(" ")
    .flatMap((part) => (part ? [part[0]?.toUpperCase()] : []))
    .join("")
    .slice(0, 2) || "U";


  return (
    <article className="relative flex h-full min-h-35 flex-col rounded-2xl border border-[#94B8C4] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#275D79] hover:shadow-[0_14px_30px_rgba(39,93,121,0.12)] dark:border-[#253245] dark:bg-[#0f1a2e] dark:hover:border-[#3a7fa0]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {showAvatar ? (
            <img
              src={member.avatarUrl || undefined}
              alt={name}
              className="h-9 w-9 rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/80 text-sm font-semibold text-slate-700 dark:bg-[#1a2740] dark:text-slate-300">
              {initials}
            </span>
          )}
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{name}</p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#1a2740] dark:hover:text-slate-300"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <EllipsisVertical className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {openMenu && (
        <div className="absolute right-0 top-10 z-10 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-[#253245] dark:bg-[#0f1a2e]">
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Eliminar miembro
          </button>
        </div>
      )}

      <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-[#253245] dark:bg-[#1a2740] dark:text-slate-300">
        {member.role}
      </span>
    </article>
  );
}
