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
      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex h-full min-h-35 animate-pulse flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-200" />
              <div className="h-4 w-28 rounded bg-slate-200" />
            </div>
            <div className="mt-auto h-5 w-16 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
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