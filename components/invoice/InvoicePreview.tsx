"use client";

// ============================================================
// InvoForge — InvoicePreview Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { InvoiceData, InvoiceCalculations } from "@/types/invoice";
import { formatCurrency, calcItemTotal } from "@/lib/calculations";
import { formatDate } from "@/lib/invoice-utils";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileText } from "lucide-react";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  calculations: InvoiceCalculations;
}

export function InvoicePreview({ invoice, calculations }: InvoicePreviewProps) {
  const hasClientName = Boolean(invoice.client.name?.trim());
  const hasItems = invoice.items.length > 0 && invoice.items.some((i) => i.name.trim());

  if (!hasClientName && !hasItems) {
    return (
      <EmptyState
        icon={FileText}
        title="Preview will appear here"
        description="Fill in the invoice details on the left to see a live preview of your professional invoice."
      />
    );
  }

  return (
    <div
      id="invoice-preview"
      className="font-sans text-sm"
      style={{
        background: "#0d1117",
        color: "#f0f4ff",
        borderRadius: "0.875rem",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Top Accent Bar ── */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
          padding: "1.75rem 2rem",
          borderBottom: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: Brand + Business */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {invoice.business.logoBase64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={invoice.business.logoBase64}
                  alt={`${invoice.business.name} logo`}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: "1px solid rgba(99,102,241,0.3)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "white",
                  }}
                >
                  {(invoice.business.name || "I").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "#f0f4ff",
                    margin: 0,
                  }}
                >
                  {invoice.business.name || "Your Business"}
                </p>
                {invoice.business.gstNumber && (
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "#818cf8",
                      fontFamily: "monospace",
                      margin: "1px 0 0",
                    }}
                  >
                    GST: {invoice.business.gstNumber}
                  </p>
                )}
              </div>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: "1.6" }}>
              {invoice.business.email && <p>{invoice.business.email}</p>}
              {invoice.business.phone && <p>{invoice.business.phone}</p>}
              {invoice.business.address && (
                <p style={{ maxWidth: "200px" }}>{invoice.business.address}</p>
              )}
            </div>
          </div>

          {/* Right: INVOICE title + metadata */}
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                letterSpacing: "-0.03em",
                color: "#f0f4ff",
                margin: "0 0 0.5rem",
              }}
            >
              INVOICE
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
              <StatusBadge status={invoice.metadata.status} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.8" }}>
              <p>
                <span style={{ color: "#64748b" }}>No: </span>
                <span style={{ fontFamily: "monospace", fontWeight: "600", color: "#818cf8" }}>
                  {invoice.metadata.invoiceNumber}
                </span>
              </p>
              {invoice.metadata.invoiceDate && (
                <p>
                  <span style={{ color: "#64748b" }}>Date: </span>
                  {formatDate(invoice.metadata.invoiceDate)}
                </p>
              )}
              {invoice.metadata.dueDate && (
                <p>
                  <span style={{ color: "#64748b" }}>Due: </span>
                  {formatDate(invoice.metadata.dueDate)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bill To ── */}
      <div
        style={{
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(99,102,241,0.1)",
          background: "#111827",
        }}
      >
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: "700",
            color: "#6366f1",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
          }}
        >
          Bill To
        </p>
        {hasClientName ? (
          <div style={{ fontSize: "0.8125rem", lineHeight: "1.7" }}>
            <p style={{ fontWeight: "700", color: "#f0f4ff", fontSize: "0.9375rem" }}>
              {invoice.client.name}
            </p>
            {invoice.client.company && (
              <p style={{ color: "#94a3b8" }}>{invoice.client.company}</p>
            )}
            {invoice.client.email && (
              <p style={{ color: "#64748b" }}>{invoice.client.email}</p>
            )}
            {invoice.client.address && (
              <p style={{ color: "#64748b", maxWidth: "260px" }}>
                {invoice.client.address}
              </p>
            )}
          </div>
        ) : (
          <p style={{ color: "#475569", fontSize: "0.8125rem", fontStyle: "italic" }}>
            Client information will appear here
          </p>
        )}
      </div>

      {/* ── Items Table ── */}
      <div style={{ padding: "1.25rem 2rem 0" }}>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 60px 110px 110px",
            gap: "0.5rem",
            padding: "0.625rem 0.875rem",
            borderRadius: "0.5rem",
            background: "rgba(99,102,241,0.08)",
            marginBottom: "0.375rem",
            fontSize: "0.6875rem",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#6366f1",
          }}
        >
          <span>Description</span>
          <span style={{ textAlign: "center" }}>Qty</span>
          <span style={{ textAlign: "right" }}>Unit Price</span>
          <span style={{ textAlign: "right" }}>Amount</span>
        </div>

        {/* Item Rows */}
        {invoice.items
          .filter((item) => item.name.trim())
          .map((item, index) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 110px 110px",
                gap: "0.5rem",
                padding: "0.75rem 0.875rem",
                borderRadius: "0.5rem",
                background: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(99,102,241,0.06)",
              }}
            >
              <div>
                <p style={{ fontWeight: "600", color: "#f0f4ff", fontSize: "0.8125rem" }}>
                  {item.name}
                </p>
                {item.description && (
                  <p style={{ fontSize: "0.6875rem", color: "#64748b", marginTop: "2px" }}>
                    {item.description}
                  </p>
                )}
              </div>
              <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8125rem" }}>
                {item.quantity}
              </div>
              <div style={{ textAlign: "right", color: "#94a3b8", fontSize: "0.8125rem" }}>
                {formatCurrency(item.unitPrice)}
              </div>
              <div
                style={{ textAlign: "right", fontWeight: "600", color: "#f0f4ff", fontSize: "0.8125rem" }}
              >
                {formatCurrency(calcItemTotal(item))}
              </div>
            </div>
          ))}

        {invoice.items.filter((i) => i.name.trim()).length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#475569",
              fontSize: "0.8125rem",
              fontStyle: "italic",
            }}
          >
            Add items to see them here
          </div>
        )}
      </div>

      {/* ── Totals ── */}
      <div
        style={{
          padding: "1.25rem 2rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ width: "260px" }}>
          <TotalRow label="Subtotal" value={formatCurrency(calculations.subtotal)} />
          <TotalRow
            label={`GST (${invoice.gstRate}%)`}
            value={formatCurrency(calculations.gstAmount)}
          />
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)",
              margin: "0.75rem 0",
            }}
          />
          <GrandTotalRow value={formatCurrency(calculations.grandTotal)} />
        </div>
      </div>

      {/* ── Notes ── */}
      {invoice.notes && (
        <div
          style={{
            padding: "1rem 2rem",
            borderTop: "1px solid rgba(99,102,241,0.1)",
            background: "rgba(99,102,241,0.03)",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: "700",
              color: "#6366f1",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.375rem",
            }}
          >
            Notes
          </p>
          <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: "1.6" }}>
            {invoice.notes}
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <div
        style={{
          padding: "0.875rem 2rem",
          borderTop: "1px solid rgba(99,102,241,0.1)",
          background: "#0d1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <p style={{ fontSize: "0.6875rem", color: "#334155" }}>
          Generated by{" "}
          <span style={{ color: "#6366f1", fontWeight: "600" }}>InvoForge</span>
        </p>
        <p style={{ fontSize: "0.6875rem", color: "#334155" }}>
          Developer: Ritwik Das · ritwikdas100@gmail.com
        </p>
      </div>

      {/* ── Bottom Accent ── */}
      <div
        style={{
          height: "2px",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
        }}
      />
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.3125rem 0",
        fontSize: "0.8125rem",
      }}
    >
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

function GrandTotalRow({ value }: { value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.625rem 0.875rem",
        borderRadius: "0.5rem",
        background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: "700",
          color: "#818cf8",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Grand Total
      </span>
      <span
        style={{
          fontSize: "1.0625rem",
          fontWeight: "800",
          color: "#f0f4ff",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}
