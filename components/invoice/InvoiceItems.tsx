"use client";

// ============================================================
// InvoForge — InvoiceItems Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { Plus, Trash2, Package } from "lucide-react";
import { InvoiceItem } from "@/types/invoice";
import { calcItemTotal, formatCurrency } from "@/lib/calculations";
import { EmptyState } from "@/components/shared/EmptyState";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<InvoiceItem>) => void;
}

export function InvoiceItems({
  items,
  onAdd,
  onRemove,
  onUpdate,
}: InvoiceItemsProps) {
  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <Package size={16} className="section-icon" />
        <span className="section-title">Line Items</span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{
            background: "rgba(99,102,241,0.12)",
            color: "var(--indigo-400)",
          }}
        >
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Table Header (desktop) */}
      {items.length > 0 && (
        <div
          className="hidden md:grid mb-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider"
          style={{
            gridTemplateColumns: "1fr 80px 120px 100px 36px",
            gap: "0.75rem",
            background: "rgba(99,102,241,0.06)",
            color: "var(--text-muted)",
          }}
        >
          <span>Service / Product</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Unit Price (₹)</span>
          <span className="text-right">Amount</span>
          <span></span>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No items yet"
            description="Add your first service or product to this invoice."
            action={{ label: "Add First Item", onClick: onAdd }}
          />
        ) : (
          items.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              index={index}
              onRemove={() => onRemove(item.id)}
              onUpdate={(updates) => onUpdate(item.id, updates)}
              canRemove={items.length > 1}
            />
          ))
        )}
      </div>

      {/* Add Item Button */}
      {items.length > 0 && (
        <button
          onClick={onAdd}
          className="btn btn-ghost w-full mt-3 border-dashed"
          style={{ borderColor: "var(--border-default)", borderWidth: "1px" }}
          aria-label="Add new line item"
        >
          <Plus size={14} style={{ color: "var(--indigo-400)" }} />
          <span style={{ color: "var(--text-secondary)" }}>Add Item</span>
        </button>
      )}
    </div>
  );
}

// ─── Individual Row ─────────────────────────────────────────

interface ItemRowProps {
  item: InvoiceItem;
  index: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<InvoiceItem>) => void;
  canRemove: boolean;
}

function ItemRow({ item, index, onRemove, onUpdate, canRemove }: ItemRowProps) {
  const total = calcItemTotal(item);

  return (
    <div
      className="animate-fade-in rounded-xl border p-3"
      style={{
        background: "var(--bg-input)",
        borderColor: "var(--border-subtle)",
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Desktop Layout */}
      <div
        className="hidden md:grid items-center gap-3"
        style={{ gridTemplateColumns: "1fr 80px 120px 100px 36px" }}
      >
        {/* Name + Description */}
        <div className="space-y-1.5">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Service or product name"
            className="input-field text-sm"
            aria-label={`Item ${index + 1} name`}
          />
          <input
            type="text"
            value={item.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Description (optional)"
            className="input-field text-xs"
            style={{ padding: "0.375rem 0.75rem" }}
            aria-label={`Item ${index + 1} description`}
          />
        </div>

        {/* Quantity */}
        <input
          type="number"
          value={item.quantity}
          min={1}
          onChange={(e) =>
            onUpdate({ quantity: Math.max(1, parseInt(e.target.value) || 1) })
          }
          className="input-field text-center text-sm"
          aria-label={`Item ${index + 1} quantity`}
        />

        {/* Unit Price */}
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none select-none"
            style={{ color: "var(--text-muted)" }}
          >
            ₹
          </span>
          <input
            type="number"
            value={item.unitPrice}
            min={0}
            step={0.01}
            onChange={(e) =>
              onUpdate({ unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })
            }
            className="input-field text-right text-sm"
            style={{ paddingLeft: "1.5rem" }}
            aria-label={`Item ${index + 1} unit price`}
          />
        </div>

        {/* Total */}
        <div
          className="text-right text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {formatCurrency(total)}
        </div>

        {/* Remove */}
        <button
          onClick={onRemove}
          disabled={!canRemove}
          className="btn btn-danger btn-icon disabled:opacity-20"
          aria-label={`Remove item ${index + 1}`}
          title="Remove item"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--indigo-400)" }}
          >
            Item {index + 1}
          </span>
          <button
            onClick={onRemove}
            disabled={!canRemove}
            className="btn btn-danger btn-icon disabled:opacity-20"
            style={{ width: "1.75rem", height: "1.75rem" }}
            aria-label={`Remove item ${index + 1}`}
          >
            <Trash2 size={11} />
          </button>
        </div>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Service or product name"
          className="input-field text-sm"
          aria-label={`Item ${index + 1} name`}
        />
        <input
          type="text"
          value={item.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Description (optional)"
          className="input-field text-xs"
          aria-label={`Item ${index + 1} description`}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Qty</label>
            <input
              type="number"
              value={item.quantity}
              min={1}
              onChange={(e) =>
                onUpdate({ quantity: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="input-field text-sm"
              aria-label={`Item ${index + 1} quantity`}
            />
          </div>
          <div>
            <label className="label">Unit Price (₹)</label>
            <input
              type="number"
              value={item.unitPrice}
              min={0}
              step={0.01}
              onChange={(e) =>
                onUpdate({ unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })
              }
              className="input-field text-sm"
              aria-label={`Item ${index + 1} unit price`}
            />
          </div>
        </div>
        <div
          className="text-right text-sm font-bold"
          style={{ color: "var(--indigo-400)" }}
        >
          Total: {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
}
