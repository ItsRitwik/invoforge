"use client";

// ============================================================
// InvoForge — StatusBadge Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: InvoiceStatus;
  size?: "sm" | "md";
}

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    dotColor: "#94a3b8",
    className: "badge badge-draft",
  },
  pending: {
    label: "Pending",
    dotColor: "#f59e0b",
    className: "badge badge-pending",
  },
  paid: {
    label: "Paid",
    dotColor: "#10b981",
    className: "badge badge-paid",
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(config.className, size === "sm" && "text-[0.6rem] px-2 py-0.5")}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: config.dotColor }}
        aria-hidden
      />
      {config.label}
    </span>
  );
}

interface StatusSelectorProps {
  value: InvoiceStatus;
  onChange: (status: InvoiceStatus) => void;
}

const STATUSES: InvoiceStatus[] = ["draft", "pending", "paid"];

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Invoice status">
      {STATUSES.map((status) => {
        const config = STATUS_CONFIG[status];
        const isSelected = value === status;
        return (
          <button
            key={status}
            onClick={() => onChange(status)}
            className={cn("badge cursor-pointer transition-all", config.className)}
            style={{
              opacity: isSelected ? 1 : 0.45,
              transform: isSelected ? "scale(1.05)" : "scale(1)",
              boxShadow: isSelected ? `0 0 12px ${config.dotColor}40` : "none",
            }}
            aria-pressed={isSelected}
            aria-label={`Set status to ${config.label}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: config.dotColor }}
              aria-hidden
            />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
