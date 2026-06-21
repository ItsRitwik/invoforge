"use client";

// ============================================================
// InvoForge — InvoiceForm Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useState } from "react";
import {
  Building2,
  User,
  FileText,
  Percent,
  StickyNote,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { InvoiceData, GSTRate, InvoiceStatus } from "@/types/invoice";
import { GST_RATES } from "@/lib/constants";
import { InvoiceItems } from "./InvoiceItems";
import { StatusSelector } from "./StatusBadge";
import { LogoUpload } from "@/components/shared/LogoUpload";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  invoice: InvoiceData;
  onUpdateBusiness: (updates: Partial<InvoiceData["business"]>) => void;
  onUpdateClient: (updates: Partial<InvoiceData["client"]>) => void;
  onUpdateMetadata: (updates: Partial<InvoiceData["metadata"]>) => void;
  onUpdateGSTRate: (rate: GSTRate) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateStatus: (status: InvoiceStatus) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<InvoiceData["items"][0]>) => void;
}

// ─── Collapsible Section ────────────────────────────────────

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="card-glass overflow-hidden"
      style={{ marginBottom: "1rem" }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(99,102,241,0.1)" }}
        >
          <Icon size={14} style={{ color: "var(--indigo-400)" }} />
        </div>
        <span className="text-sm font-bold uppercase tracking-wider flex-1" style={{ color: "var(--text-primary)" }}>
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} style={{ color: "var(--text-muted)" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 animate-fade-in">
          <div className="divider" style={{ margin: "0 0 1.25rem" }} />
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Field Grid ─────────────────────────────────────────────

function FieldGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 md:grid-cols-2",
        cols === 3 && "grid-cols-1 md:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required && (
          <span style={{ color: "var(--error)" }} aria-hidden> *</span>
        )}
      </label>
      {children}
    </div>
  );
}

// ─── Main Form ──────────────────────────────────────────────

export function InvoiceForm({
  invoice,
  onUpdateBusiness,
  onUpdateClient,
  onUpdateMetadata,
  onUpdateGSTRate,
  onUpdateNotes,
  onUpdateStatus,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: InvoiceFormProps) {
  return (
    <div>
      {/* ── Business Information ── */}
      <Section title="Business Information" icon={Building2}>
        <div className="flex flex-col md:flex-row gap-5 mb-5">
          <div className="flex-shrink-0">
            <label className="label mb-3">Company Logo</label>
            <LogoUpload
              value={invoice.business.logoBase64}
              onChange={(base64) => onUpdateBusiness({ logoBase64: base64 })}
              onRemove={() => onUpdateBusiness({ logoBase64: "" })}
            />
          </div>
          <div className="flex-1 space-y-4">
            <FieldGrid cols={2}>
              <Field label="Business Name" required>
                <input
                  type="text"
                  value={invoice.business.name}
                  onChange={(e) => onUpdateBusiness({ name: e.target.value })}
                  placeholder="VRF Labs"
                  className="input-field"
                  aria-label="Business name"
                  id="business-name"
                />
              </Field>
              <Field label="GST Number" required>
                <input
                  type="text"
                  value={invoice.business.gstNumber}
                  onChange={(e) =>
                    onUpdateBusiness({ gstNumber: e.target.value.toUpperCase() })
                  }
                  placeholder="22AAAAA0000A1Z5"
                  className="input-field font-mono"
                  aria-label="GST number"
                  id="business-gst"
                  maxLength={15}
                />
              </Field>
            </FieldGrid>
            <FieldGrid cols={2}>
              <Field label="Email">
                <input
                  type="email"
                  value={invoice.business.email}
                  onChange={(e) => onUpdateBusiness({ email: e.target.value })}
                  placeholder="hello@vrflabs.com"
                  className="input-field"
                  aria-label="Business email"
                  id="business-email"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={invoice.business.phone}
                  onChange={(e) => onUpdateBusiness({ phone: e.target.value })}
                  placeholder="+91 00000 00000"
                  className="input-field"
                  aria-label="Business phone"
                  id="business-phone"
                />
              </Field>
            </FieldGrid>
          </div>
        </div>
        <Field label="Business Address">
          <textarea
            value={invoice.business.address}
            onChange={(e) => onUpdateBusiness({ address: e.target.value })}
            placeholder="123, Tech Street, Bengaluru, Karnataka - 560001"
            className="input-field resize-none"
            rows={2}
            aria-label="Business address"
            id="business-address"
          />
        </Field>
      </Section>

      {/* ── Client Information ── */}
      <Section title="Client Information" icon={User}>
        <FieldGrid cols={2}>
          <Field label="Client Name" required>
            <input
              type="text"
              value={invoice.client.name}
              onChange={(e) => onUpdateClient({ name: e.target.value })}
              placeholder="John Doe"
              className="input-field"
              aria-label="Client name"
              id="client-name"
            />
          </Field>
          <Field label="Company">
            <input
              type="text"
              value={invoice.client.company}
              onChange={(e) => onUpdateClient({ company: e.target.value })}
              placeholder="Acme Corp"
              className="input-field"
              aria-label="Client company"
              id="client-company"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={invoice.client.email}
              onChange={(e) => onUpdateClient({ email: e.target.value })}
              placeholder="john@acme.com"
              className="input-field"
              aria-label="Client email"
              id="client-email"
            />
          </Field>
        </FieldGrid>
        <div className="mt-4">
          <Field label="Client Address">
            <textarea
              value={invoice.client.address}
              onChange={(e) => onUpdateClient({ address: e.target.value })}
              placeholder="456, Business Park, Mumbai, Maharashtra - 400001"
              className="input-field resize-none"
              rows={2}
              aria-label="Client address"
              id="client-address"
            />
          </Field>
        </div>
      </Section>

      {/* ── Invoice Details ── */}
      <Section title="Invoice Details" icon={FileText}>
        <FieldGrid cols={3}>
          <Field label="Invoice Number" required>
            <input
              type="text"
              value={invoice.metadata.invoiceNumber}
              onChange={(e) =>
                onUpdateMetadata({ invoiceNumber: e.target.value.toUpperCase() })
              }
              placeholder="INV-2025-001"
              className="input-field font-mono"
              aria-label="Invoice number"
              id="invoice-number"
            />
          </Field>
          <Field label="Invoice Date" required>
            <input
              type="date"
              value={invoice.metadata.invoiceDate}
              onChange={(e) =>
                onUpdateMetadata({ invoiceDate: e.target.value })
              }
              className="input-field"
              aria-label="Invoice date"
              id="invoice-date"
            />
          </Field>
          <Field label="Due Date">
            <input
              type="date"
              value={invoice.metadata.dueDate}
              onChange={(e) =>
                onUpdateMetadata({ dueDate: e.target.value })
              }
              className="input-field"
              aria-label="Due date"
              id="invoice-due-date"
            />
          </Field>
        </FieldGrid>
        <div className="mt-5">
          <label className="label">Invoice Status</label>
          <StatusSelector
            value={invoice.metadata.status}
            onChange={onUpdateStatus}
          />
        </div>
      </Section>

      {/* ── GST Rate ── */}
      <Section title="Tax Settings" icon={Percent}>
        <Field label="GST Rate">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select GST rate">
            {GST_RATES.map((rate) => (
              <button
                key={rate}
                onClick={() => onUpdateGSTRate(rate)}
                className={cn("btn btn-sm transition-all", {
                  "btn-primary": invoice.gstRate === rate,
                  "btn-secondary": invoice.gstRate !== rate,
                })}
                aria-pressed={invoice.gstRate === rate}
                aria-label={`Set GST rate to ${rate}%`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* ── Line Items ── */}
      <div className="card-glass px-5 py-5 mb-4">
        <InvoiceItems
          items={invoice.items}
          onAdd={onAddItem}
          onRemove={onRemoveItem}
          onUpdate={onUpdateItem}
        />
      </div>

      {/* ── Notes ── */}
      <Section title="Notes & Terms" icon={StickyNote} defaultOpen={false}>
        <Field label="Additional Notes">
          <textarea
            value={invoice.notes || ""}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Payment terms, bank details, thank you message, or any special instructions..."
            className="input-field resize-none"
            rows={4}
            aria-label="Invoice notes"
            id="invoice-notes"
          />
        </Field>
      </Section>
    </div>
  );
}
