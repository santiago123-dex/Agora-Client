import type { ApiError } from "./client";
import { GATEWAY_URL } from "./config";

export type MediaFileResponse = {
  id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  media_category: string;
  status: string;
  width?: number | null;
  height?: number | null;
  duration_seconds?: number | null;
};

export type UploadResponse = {
  media: MediaFileResponse;
  signed_url: string | null;
};

export function getMediaFileUrl(mediaId: string) {
  return `/api/media/${mediaId}/file`;
}

export async function getMedia(mediaId: string): Promise<MediaFileResponse> {
  const res = await fetch(`/api/media/${mediaId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al obtener metadata" }));
    throw Object.assign(new Error(err.message), { status: res.status }) as ApiError & { status: number };
  }
  return res.json();
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/media/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al subir archivo" }));
    throw Object.assign(new Error(err.message), { status: res.status }) as ApiError & { status: number };
  }
  return res.json();
}

export async function deleteMedia(mediaId: string): Promise<void> {
  const res = await fetch(`/api/media/${mediaId}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al eliminar archivo" }));
    throw Object.assign(new Error(err.message), { status: res.status }) as ApiError & { status: number };
  }
}
