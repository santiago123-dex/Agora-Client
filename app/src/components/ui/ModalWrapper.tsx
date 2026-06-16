"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalWrapperProps = {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function ModalWrapper({
  open,
  onClose,
  children,
  className = "",
  title,
}: ModalWrapperProps) {
  if (typeof window === "undefined" || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#141f33] ${className}`}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#253245] dark:hover:text-slate-300"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        )}
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
