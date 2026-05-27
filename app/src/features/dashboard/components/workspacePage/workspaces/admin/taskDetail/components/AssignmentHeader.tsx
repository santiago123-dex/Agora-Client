import Link from "next/link";
import { ArrowLeft, CalendarDays, Pencil } from "lucide-react";
import type { AssignmentResponse } from "@/app/src/lib/api/assignments";
import { formatTaskDate } from "../helpers";
import { getAssignmentPoints } from "../../utils/assignment-mappers";

type Props = {
  assignment: AssignmentResponse;
  workspaceId: string | number;
  from?: "dashboard" | "workspace";
  onEdit: () => void;
};

export default function AssignmentHeader({ assignment, workspaceId, onEdit, from = "workspace" }: Props) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        <Link
          href={`/dashboard/workspace/${workspaceId}?from=${from}`}
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
          aria-label="Volver al workspace"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {assignment.name}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            {assignment.description || "Sin descripción."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Vence: {formatTaskDate(assignment.dueDate)}
            </span>
            <span>Puntuación máxima: {getAssignmentPoints(assignment)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#275D79] hover:text-[#275D79]"
        aria-label="Editar tarea"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </header>
  );
}
