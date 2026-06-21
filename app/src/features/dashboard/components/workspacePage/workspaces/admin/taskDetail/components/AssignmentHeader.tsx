import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye, Paperclip, Pencil } from "lucide-react";
import type { AssignmentResponse } from "@/app/src/lib/api/assignments";
import { formatTaskDate } from "../helpers";
import { getAssignmentPoints } from "../../utils/assignment-mappers";
import { getMediaFileUrl } from "@/app/src/lib/api/media";
import DocumentPreviewModal, { type PreviewFile } from "@/app/src/components/ui/DocumentPreviewModal";

type Props = {
  assignment: AssignmentResponse;
  workspaceId: string | number;
  from?: "dashboard" | "workspace";
  onEdit: () => void;
};

export default function AssignmentHeader({ assignment, workspaceId, onEdit, from = "workspace" }: Props) {
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const attachments = (assignment.settings?.attachments as Array<{ name: string; mediaId: string; type?: string }> | undefined) ?? [];

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        <Link
          href={`/dashboard/workspace/${workspaceId}?from=${from}`}
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:hover:bg-[#1a2740]"
          aria-label="Volver al workspace"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="serif text-2xl tracking-tight text-slate-950 dark:text-slate-100">
            {assignment.name}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {assignment.description || "Sin descripción."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Vence: {formatTaskDate(assignment.dueDate)}
            </span>
            <span>Puntuación máxima: {getAssignmentPoints(assignment)}</span>
          </div>

          {attachments.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {attachments.map((file) => (
                <div key={file.mediaId} className="inline-flex items-center gap-1">
                  <a
                    href={getMediaFileUrl(file.mediaId)}
                    download={file.name}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-[#275D79] hover:text-[#275D79] dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-300 dark:hover:border-[#3a7fa0] dark:hover:text-[#3a7fa0]"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    {file.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewFiles([{
                        name: file.name,
                        mediaId: file.mediaId,
                        mimeType: file.type ?? "application/octet-stream",
                      }]);
                      setPreviewIndex(0);
                      setPreviewOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-[#275D79] transition hover:bg-[#EEF5F7] dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-[#3a7fa0] dark:hover:bg-[#1a2740]"
                    title="Vista previa"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#275D79] hover:text-[#275D79] dark:border-[#253245] dark:bg-[#0f1a2e] dark:text-slate-300 dark:hover:border-[#3a7fa0] dark:hover:text-[#3a7fa0]"
        aria-label="Editar tarea"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <DocumentPreviewModal
        files={previewFiles}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        initialIndex={previewIndex}
      />
    </header>
  );
}
