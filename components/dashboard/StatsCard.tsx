"use client";

// ============================================================
// InvoForge — StatsCard Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  isCurrency?: boolean;
  trend?: string;
  accentColor?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  isCurrency = false,
  trend,
  accentColor = "var(--indigo-500)",
}: StatsCardProps) {
  const displayValue = isCurrency
    ? formatCurrency(typeof value === "number" ? value : parseFloat(String(value)) || 0)
    : value;

  return (
    <div className="stats-card group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
        >
          <Icon size={16} style={{ color: accentColor }} />
        </div>
        {trend && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: "var(--success-bg)",
              color: "var(--success)",
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}
