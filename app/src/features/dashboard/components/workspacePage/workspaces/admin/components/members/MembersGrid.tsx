import type { WorkspaceMemberDetailsResponse } from "@/app/src/lib/api/workspaces";
import MembersCard from "./MembersCard";

type Props = {
  members: WorkspaceMemberDetailsResponse[];
  isLoading?: boolean;
  error?: string | null;
};

export default function MembersGrid({ members, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        Cargando miembros...
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {members.length === 0 ? (
        <li className="px-4 py-12 text-center text-sm text-slate-500">
          No hay miembros en este espacio.
        </li>
      ) : (
        members.map((member) => (
          <MembersCard key={member.id} member={member} />
        ))
      )}
    </div>
  );
}