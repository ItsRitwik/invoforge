"use client";

// ============================================================
// InvoForge — Standalone GST Calculator
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useState, useCallback } from "react";
import {
  Calculator,
  Copy,
  Check,
  Info,
} from "lucide-react";
import { formatCurrency } from "@/lib/calculations";
import { GST_RATES } from "@/lib/constants";
import { GSTRate } from "@/types/invoice";
import { cn } from "@/lib/utils";

type CalcMode = "exclusive" | "inclusive";
type TaxType = "cgst_sgst" | "igst";

interface GSTResult {
  baseAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGST: number;
  totalInclusive: number;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
}

function calcGST(amount: number, rate: number, mode: CalcMode): GSTResult {
  let base: number;
  let totalInclusive: number;

  if (mode === "exclusive") {
    base = amount;
    totalInclusive = amount + (amount * rate) / 100;
  } else {
    // Inclusive: base = amount / (1 + rate/100)
    base = amount / (1 + rate / 100);
    totalInclusive = amount;
  }

  const totalGST = totalInclusive - base;
  const halfGST = totalGST / 2;

  return {
    baseAmount: parseFloat(base.toFixed(2)),
    cgst: parseFloat(halfGST.toFixed(2)),
    sgst: parseFloat(halfGST.toFixed(2)),
    igst: parseFloat(totalGST.toFixed(2)),
    totalGST: parseFloat(totalGST.toFixed(2)),
    totalInclusive: parseFloat(totalInclusive.toFixed(2)),
    gstRate: rate,
    cgstRate: rate / 2,
    sgstRate: rate / 2,
  };
}

export function GSTCalculator() {
  const [amount, setAmount] = useState<string>("");
  const [gstRate, setGSTRate] = useState<GSTRate>(18);
  const [mode, setMode] = useState<CalcMode>("exclusive");
  const [taxType, setTaxType] = useState<TaxType>("cgst_sgst");
  const [copied, setCopied] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const hasResult = numAmount > 0;
  const result = hasResult ? calcGST(numAmount, gstRate, mode) : null;

  const copyResult = useCallback(async () => {
    if (!result) return;
    const text = [
      `GST CALCULATION`,
      `===============`,
      `Input Amount: ${formatCurrency(numAmount)} (${mode === "exclusive" ? "excl. GST" : "incl. GST"})`,
      `GST Rate: ${result.gstRate}%`,
      ``,
      `Base Amount (excl. GST): ${formatCurrency(result.baseAmount)}`,
      taxType === "cgst_sgst"
        ? `CGST @ ${result.cgstRate}%: ${formatCurrency(result.cgst)}`
        : `IGST @ ${result.gstRate}%: ${formatCurrency(result.igst)}`,
      ...(taxType === "cgst_sgst" ? [`SGST @ ${result.sgstRate}%: ${formatCurrency(result.sgst)}`] : []),
      `Total GST: ${formatCurrency(result.totalGST)}`,
      `Total (incl. GST): ${formatCurrency(result.totalInclusive)}`,
      ``,
      `Calculated by InvoForge — invoforge-kappa.vercel.app`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [result, numAmount, mode, taxType]);

  return (
    <div
      className="card-glass animate-fade-in"
      style={{ padding: "1.75rem", maxWidth: "680px", margin: "0 auto" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--indigo-600), var(--violet-600))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Calculator size={20} color="white" />
        </div>
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)", lineHeight: 1 }}
          >
            GST Calculator
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Calculate GST inclusive &amp; exclusive amounts instantly
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Amount */}
        <div>
          <label className="label">
            Amount (₹){" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" }}>
              — {mode === "exclusive" ? "excl. GST" : "incl. GST"}
            </span>
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                fontSize: "14px",
                pointerEvents: "none",
              }}
            >
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="input-field"
              style={{ paddingLeft: "1.75rem" }}
              min={0}
              step={0.01}
              aria-label="Amount for GST calculation"
              id="gst-calc-amount"
            />
          </div>
        </div>

        {/* GST Rate */}
        <div>
          <label className="label">GST Rate</label>
          <div className="flex gap-2 flex-wrap">
            {GST_RATES.map((rate) => (
              <button
                key={rate}
                onClick={() => setGSTRate(rate)}
                className={cn("btn btn-sm transition-all", {
                  "btn-primary": gstRate === rate,
                  "btn-secondary": gstRate !== rate,
                })}
                aria-pressed={gstRate === rate}
                aria-label={`GST rate ${rate}%`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Exclusive / Inclusive */}
        <div>
          <label className="label">Calculation Mode</label>
          <div
            className="flex rounded-lg overflow-hidden border"
            style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}
          >
            <button
              onClick={() => setMode("exclusive")}
              className="flex-1 px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                background: mode === "exclusive" ? "var(--indigo-600)" : "transparent",
                color: mode === "exclusive" ? "white" : "var(--text-muted)",
                borderRight: "1px solid var(--border-subtle)",
              }}
              aria-pressed={mode === "exclusive"}
            >
              Excl. GST
            </button>
            <button
              onClick={() => setMode("inclusive")}
              className="flex-1 px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                background: mode === "inclusive" ? "var(--indigo-600)" : "transparent",
                color: mode === "inclusive" ? "white" : "var(--text-muted)",
              }}
              aria-pressed={mode === "inclusive"}
            >
              Incl. GST
            </button>
          </div>
          <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {mode === "exclusive"
              ? "GST will be added to your amount"
              : "GST will be extracted from your amount"}
          </p>
        </div>

        {/* CGST+SGST / IGST */}
        <div>
          <label className="label">Tax Type</label>
          <div
            className="flex rounded-lg overflow-hidden border"
            style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}
          >
            <button
              onClick={() => setTaxType("cgst_sgst")}
              className="flex-1 px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                background: taxType === "cgst_sgst" ? "var(--indigo-600)" : "transparent",
                color: taxType === "cgst_sgst" ? "white" : "var(--text-muted)",
                borderRight: "1px solid var(--border-subtle)",
              }}
              aria-pressed={taxType === "cgst_sgst"}
            >
              CGST + SGST
            </button>
            <button
              onClick={() => setTaxType("igst")}
              className="flex-1 px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                background: taxType === "igst" ? "var(--indigo-600)" : "transparent",
                color: taxType === "igst" ? "white" : "var(--text-muted)",
              }}
              aria-pressed={taxType === "igst"}
            >
              IGST
            </button>
          </div>
          <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {taxType === "cgst_sgst" ? "Intrastate (within state)" : "Interstate (cross-state)"}
          </p>
        </div>
      </div>

      {/* Results */}
      {!hasResult ? (
        <div
          className="rounded-xl border flex flex-col items-center justify-center py-10"
          style={{ borderColor: "var(--border-subtle)", background: "var(--bg-input)" }}
        >
          <Calculator size={32} style={{ color: "var(--text-muted)", marginBottom: "8px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Enter an amount above to calculate GST
          </p>
        </div>
      ) : (
        result && (
          <div className="animate-fade-in">
            {/* Big Numbers */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <ResultCard
                label="Base Amount"
                sublabel="(excl. GST)"
                value={formatCurrency(result.baseAmount)}
                color="var(--indigo-400)"
              />
              <ResultCard
                label="Total GST"
                sublabel={`@ ${result.gstRate}%`}
                value={formatCurrency(result.totalGST)}
                color="var(--warning)"
              />
              <ResultCard
                label="Total Amount"
                sublabel="(incl. GST)"
                value={formatCurrency(result.totalInclusive)}
                color="var(--success)"
                highlight
              />
            </div>

            {/* Breakdown Table */}
            <div
              className="rounded-xl overflow-hidden border mb-4"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div
                className="px-4 py-2.5"
                style={{
                  background: "rgba(99,102,241,0.08)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--indigo-400)" }}>
                  Detailed Breakdown
                </p>
              </div>
              <div>
                <BreakdownRow
                  label="Taxable Value (Base)"
                  value={formatCurrency(result.baseAmount)}
                />
                {taxType === "cgst_sgst" ? (
                  <>
                    <BreakdownRow
                      label={`CGST @ ${result.cgstRate}%`}
                      value={formatCurrency(result.cgst)}
                      sub
                    />
                    <BreakdownRow
                      label={`SGST @ ${result.sgstRate}%`}
                      value={formatCurrency(result.sgst)}
                      sub
                    />
                  </>
                ) : (
                  <BreakdownRow
                    label={`IGST @ ${result.gstRate}%`}
                    value={formatCurrency(result.igst)}
                    sub
                  />
                )}
                <BreakdownRow
                  label={`Total GST (${result.gstRate}%)`}
                  value={formatCurrency(result.totalGST)}
                  accent
                />
                <BreakdownRow
                  label="Grand Total (incl. GST)"
                  value={formatCurrency(result.totalInclusive)}
                  bold
                />
              </div>
            </div>

            {/* Info box */}
            <div
              className="rounded-lg flex gap-3 p-3 mb-4"
              style={{
                background: "rgba(99,102,241,0.06)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Info size={14} style={{ color: "var(--indigo-400)", flexShrink: 0, marginTop: "1px" }} />
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                {taxType === "cgst_sgst"
                  ? `Intrastate supply: GST of ${result.gstRate}% is split equally — CGST ${result.cgstRate}% (Central) + SGST ${result.sgstRate}% (State).`
                  : `Interstate supply: Full GST of ${result.gstRate}% is charged as IGST (Integrated GST), collected by Central Government.`}
              </p>
            </div>

            {/* Copy */}
            <button
              onClick={copyResult}
              className="btn btn-secondary w-full"
              aria-label="Copy GST calculation results to clipboard"
            >
              {copied ? (
                <>
                  <Check size={15} style={{ color: "var(--success)" }} />
                  <span style={{ color: "var(--success)" }}>Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy Calculation Results
                </>
              )}
            </button>
          </div>
        )
      )}

      {/* Info footer */}
      <div className="divider" />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
          All calculations are based on GST rates as per Government of India.
        </p>
        <p style={{ fontSize: "0.6875rem", color: "var(--indigo-400)", fontWeight: "600" }}>
          InvoForge · Free GST Tool
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function ResultCard({
  label,
  sublabel,
  value,
  color,
  highlight,
}: {
  label: string;
  sublabel: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{
        background: highlight
          ? `linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))`
          : "var(--bg-input)",
        border: `1px solid ${highlight ? "var(--border-strong)" : "var(--border-subtle)"}`,
      }}
    >
      <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
      <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginBottom: "4px" }}>
        {sublabel}
      </p>
      <p
        style={{
          fontSize: "1rem",
          fontWeight: "800",
          color,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  sub,
  accent,
  bold,
}: {
  label: string;
  value: string;
  sub?: boolean;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        borderBottom: "1px solid var(--border-subtle)",
        background: bold ? "rgba(99,102,241,0.06)" : "transparent",
      }}
    >
      <span
        style={{
          fontSize: "0.8125rem",
          color: accent ? "var(--indigo-400)" : sub ? "var(--text-muted)" : "var(--text-secondary)",
          fontWeight: bold ? "700" : accent ? "600" : "400",
          paddingLeft: sub ? "1rem" : "0",
        }}
      >
        {sub && "└ "}{label}
      </span>
      <span
        style={{
          fontSize: bold ? "0.9375rem" : "0.8125rem",
          fontWeight: bold ? "800" : accent ? "700" : "600",
          color: bold ? "var(--text-primary)" : accent ? "var(--indigo-400)" : "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}
