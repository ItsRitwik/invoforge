"use client";

// ============================================================
// InvoForge — SavedInvoices Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { History, Trash2, FileText, ExternalLink } from "lucide-react";
import { SavedInvoice, InvoiceData } from "@/types/invoice";
import { StatusBadge } from "@/components/invoice/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/calculations";
import { formatDate } from "@/lib/invoice-utils";

interface SavedInvoicesProps {
  invoices: SavedInvoice[];
  onLoad: (data: InvoiceData) => void;
  onDelete: (id: string) => void;
}

export function SavedInvoices({
  invoices,
  onLoad,
  onDelete,
}: SavedInvoicesProps) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No saved invoices"
        description="Your last 5 saved invoices will appear here. Create and save an invoice to get started."
      />
    );
  }

  return (
    <div className="space-y-2">
      {invoices.map((inv, index) => (
        <div
          key={inv.id}
          className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer group transition-all"
          style={{
            background: "var(--bg-input)",
            borderColor: "var(--border-subtle)",
            animationDelay: `${index * 50}ms`,
          }}
          onClick={() => onLoad(inv.data)}
          role="button"
          tabIndex={0}
          aria-label={`Load invoice ${inv.invoiceNumber}`}
          onKeyDown={(e) => e.key === "Enter" && onLoad(inv.data)}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(99,102,241,0.1)" }}
          >
            <FileText size={14} style={{ color: "var(--indigo-400)" }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: "var(--indigo-400)" }}
              >
                {inv.invoiceNumber}
              </span>
              <StatusBadge status={inv.status} size="sm" />
            </div>
            <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {inv.clientName || "No client"}{inv.clientCompany ? ` · ${inv.clientCompany}` : ""}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {formatDate(inv.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
              {formatCurrency(inv.grandTotal)}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLoad(inv.data);
                }}
                className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                style={{ background: "rgba(99,102,241,0.1)", color: "var(--indigo-400)" }}
                title="Load invoice"
                aria-label="Load this invoice"
              >
                <ExternalLink size={11} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(inv.id);
                }}
                className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                style={{ background: "var(--error-bg)", color: "var(--error)" }}
                title="Delete invoice"
                aria-label="Delete this invoice"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
