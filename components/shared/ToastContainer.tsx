"use client";

// ============================================================
// InvoForge — Toast Notification System
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { ToastMessage } from "@/types/invoice";
import { cn } from "@/lib/utils";

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const TOAST_ICONS = {
  success: <CheckCircle2 size={16} />,
  error: <XCircle size={16} />,
  info: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
};

const TOAST_STYLES = {
  success: "border-emerald-500/40 bg-emerald-900/20 text-emerald-300",
  error: "border-red-500/40 bg-red-900/20 text-red-300",
  info: "border-indigo-500/40 bg-indigo-900/20 text-indigo-300",
  warning: "border-amber-500/40 bg-amber-900/20 text-amber-300",
};

const ICON_STYLES = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-indigo-400",
  warning: "text-amber-400",
};

function Toast({ toast, onRemove }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  function handleRemove() {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl",
        "min-w-[300px] max-w-[400px] animate-toast-in",
        TOAST_STYLES[toast.type],
        exiting && "opacity-0 translate-x-full transition-all duration-300"
      )}
      role="alert"
      aria-live="polite"
    >
      <span className={cn("mt-0.5 flex-shrink-0", ICON_STYLES[toast.type])}>
        {TOAST_ICONS[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        {toast.description && (
          <p
            className="text-xs mt-0.5 opacity-80 leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
