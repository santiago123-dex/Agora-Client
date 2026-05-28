import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
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
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <article className="relative flex h-full min-h-35 flex-col rounded-[1.35rem] border border-[#94B8C4] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#275D79] hover:shadow-[0_14px_30px_rgba(39,93,121,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/*Si exite avatarUrl y el string no esta vacio muestra el avatar, si no muestra las iniciales*/}
          {showAvatar ? (
            <img
              src={member.avatarUrl || undefined}
              alt={name}
              className="h-9 w-9 rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/80 text-sm font-semibold text-slate-700">
              {initials}
            </span>
          )}
          <div>
            <p className="font-medium text-slate-900">{name}</p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M12 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
          </svg>
        </button>
      </div>

      {openMenu && (
        <div className="absolute right-0 top-10 z-10 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            Eliminar miembro
          </button>
        </div>
      )}

      <hr className="mt-4 mb-4 text-[#d3d3d3]"/>

      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {member.role}
      </span>
    </article>
  );
}
