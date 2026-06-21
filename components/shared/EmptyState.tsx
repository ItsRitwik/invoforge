"use client";

// ============================================================
// InvoForge — EmptyState Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <Icon size={24} style={{ color: "var(--indigo-400)" }} />
      </div>
      <h3
        className="text-sm font-semibold mb-1.5"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p className="text-xs max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary btn-sm mt-4"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
