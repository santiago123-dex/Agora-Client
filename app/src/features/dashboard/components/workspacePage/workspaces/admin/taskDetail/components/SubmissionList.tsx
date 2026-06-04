import { ChevronRight } from "lucide-react";
import type { MemberSubmissionRow } from "../types";
import { formatTaskDate, getInitials, getMemberName, getStoredGrade } from "../helpers";

type Props = {
  rows: MemberSubmissionRow[];
  selectedUserId?: string;
  onSelect: (userId: string) => void;
};

const statusDot = {
  submitted: "bg-amber-400",
  pending: "bg-slate-300",
  graded: "bg-emerald-500",
  late: "bg-rose-400",
};

export default function SubmissionList({ rows, selectedUserId, onSelect }: Props) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-950">Entregas</h2>
      </div>

      <div className="divide-y divide-slate-100 [content-visibility:auto] [contain-intrinsic-size:60px]">
        {rows.map((row) => {
          const name = getMemberName(row.member);
          const grade = row.localGrade ?? getStoredGrade(row.submission);
          const isSelected = String(row.member.userId) === selectedUserId;

          return (
            <button
              key={row.member.id}
              type="button"
              onClick={() => onSelect(String(row.member.userId))}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                isSelected ? "bg-[#E9F2F5]" : "hover:bg-slate-50"
              }`}
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D8E7EC] text-xs font-bold text-[#275D79]">
                {getInitials(name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {name}
                </span>
                <span className="block text-xs text-slate-500">
                  {row.submission ? formatTaskDate(row.submission.createdAt) : "Sin entrega"}
                </span>
              </span>

              {row.status === "late" ? (
                <span className="rounded-md bg-rose-100 px-2 py-1 text-[0.65rem] font-semibold text-rose-600">
                  Tarde
                </span>
              ) : typeof grade === "number" ? (
                <span className="text-xs font-bold text-emerald-600">{grade}</span>
              ) : (
                <span className={`h-2 w-2 rounded-full ${statusDot[row.status]}`} />
              )}
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
