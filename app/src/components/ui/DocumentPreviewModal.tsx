"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileIcon,
  FileText,
  ImageIcon,
  Loader2,
  Music,
  Video,
} from "lucide-react";
import ModalWrapper from "./ModalWrapper";
import { getMediaFileUrl } from "@/app/src/lib/api/media";

export type PreviewFile = {
  name: string;
  mediaId: string;
  mimeType: string;
};

type Props = {
  files: PreviewFile[];
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
};

function getFileCategory(mimeType: string) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/json"
  )
    return "text";
  return "other";
}

function FileIconByType({ mimeType, className }: { mimeType: string; className?: string }) {
  const category = getFileCategory(mimeType);
  const props = { className };
  switch (category) {
    case "image": return <ImageIcon {...props} />;
    case "audio": return <Music {...props} />;
    case "video": return <Video {...props} />;
    case "pdf": return <FileText {...props} />;
    default: return <FileIcon {...props} />;
  }
}

function TextPreview({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setText(null);
    setLoading(true);
    setError(false);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then(setText)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-400">
        No se pudo cargar el contenido
      </div>
    );
  }

  return (
    <pre className="whitespace-pre-wrap break-words p-4 text-sm text-slate-700 font-mono">
      {text}
    </pre>
  );
}

function PreviewContent({ file }: { file: PreviewFile }) {
  const url = getMediaFileUrl(file.mediaId);
  const category = getFileCategory(file.mimeType);

  switch (category) {
    case "image":
      return (
        <div className="flex items-center justify-center h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={file.name}
            className="max-h-[70vh] max-w-full rounded-lg object-contain"
          />
        </div>
      );

    case "audio":
      return (
        <div className="flex items-center justify-center h-full p-8">
          <audio controls className="w-full max-w-md">
            <source src={url} type={file.mimeType} />
          </audio>
        </div>
      );

    case "video":
      return (
        <div className="flex items-center justify-center h-full p-4">
          <video controls className="max-h-[70vh] max-w-full rounded-lg">
            <source src={url} type={file.mimeType} />
          </video>
        </div>
      );

    case "pdf":
      return (
        <div className="h-[70vh] w-full">
          <iframe
            src={url}
            className="h-full w-full rounded-lg border-0"
            title={file.name}
          />
        </div>
      );

    case "text":
      return (
        <div className="h-[70vh] w-full overflow-auto">
          <TextPreview url={url} />
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-slate-500">
          <FileIconByType mimeType={file.mimeType} className="h-16 w-16" />
          <p className="text-sm">Vista previa no disponible para este tipo de archivo</p>
          <a
            href={url}
            download={file.name}
            className="inline-flex items-center gap-2 rounded-lg bg-[#275D79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a61]"
          >
            <Download className="h-4 w-4" />
            Descargar {file.name}
          </a>
        </div>
      );
  }
}

export default function DocumentPreviewModal({
  files,
  open,
  onClose,
  initialIndex = 0,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selectedFile = files[selectedIndex];

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex, open]);

  if (files.length === 0) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Vista previa de archivos"
      className="!max-w-4xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        {files.length > 1 && (
          <aside className="w-full shrink-0 sm:w-48">
            <ul className="flex gap-2 overflow-x-auto sm:flex-col sm:gap-1">
              {files.map((file, index) => (
                <li key={file.mediaId}>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition ${
                      index === selectedIndex
                        ? "bg-[#275D79] text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileIconByType
                      mimeType={file.mimeType}
                      className="h-4 w-4 shrink-0"
                    />
                    <span className="truncate">{file.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="flex min-h-64 flex-1 flex-col">
          {selectedFile ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <p className="truncate text-sm font-medium text-slate-700">
                  {selectedFile.name}
                </p>
                <a
                  href={getMediaFileUrl(selectedFile.mediaId)}
                  download={selectedFile.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Descargar
                </a>
              </div>
              <div className="flex-1 overflow-auto rounded-xl border border-slate-200 bg-slate-50">
                <PreviewContent file={selectedFile} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-slate-400">
              Selecciona un archivo para previsualizar
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
