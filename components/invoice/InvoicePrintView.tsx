"use client";

// ============================================================
// InvoForge — Professional Print/PDF Invoice View
// White background, print-ready, QR code, barcode
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useEffect, useState } from "react";
import { InvoiceData, InvoiceCalculations } from "@/types/invoice";
import { formatCurrency, calcItemTotal } from "@/lib/calculations";
import { formatDate } from "@/lib/invoice-utils";
import { INVOICE_STATUS_CONFIG } from "@/types/invoice";

interface InvoicePrintViewProps {
  invoice: InvoiceData;
  calculations: InvoiceCalculations;
}

// ─── QR Code Data Builder (Clean + Scannable) ────────────────
function buildQRData(invoice: InvoiceData, calcs: InvoiceCalculations): string {
  return [
    `Invoice: ${invoice.metadata.invoiceNumber}`,
    `From: ${invoice.business.name || "InvoForge"}`,
    `GSTIN: ${invoice.business.gstNumber || "N/A"}`,
    `Total: INR ${calcs.grandTotal.toFixed(2)}`,
  ].join(" | ");
}

// ─── Standard Code 39 Barcode Generator (Native SVG) ────────
function InvoiceBarcode({ value }: { value: string }) {
  // Code 39 patterns (9 bits: 0 = narrow, 1 = wide)
  // Indices: 0, 2, 4, 6, 8 are bars; 1, 3, 5, 7 are spaces.
  const CODE39_PATTERNS: Record<string, string> = {
    "0": "000110100", "1": "100100001", "2": "001100001", "3": "101100000",
    "4": "000110001", "5": "100110000", "6": "001110000", "7": "000100101",
    "8": "100100100", "9": "001100100", "A": "100001001", "B": "001001001",
    "C": "101001000", "D": "000011001", "E": "100011000", "F": "001011000",
    "G": "000001101", "H": "100001100", "I": "001001100", "J": "000011100",
    "K": "100000011", "L": "001000011", "M": "101000010", "N": "000010011",
    "O": "100010010", "P": "001010010", "Q": "000000111", "R": "100000110",
    "S": "001000110", "T": "000010110", "U": "110000001", "V": "011000001",
    "W": "111000000", "X": "010010001", "Y": "110010000", "Z": "011010000",
    "-": "010000101", ".": "110000100", " ": "011000100", "*": "010010100",
    "$": "010010000", "/": "010000100", "+": "000101000", "%": "000010100",
  };

  const cleanVal = `*${value.toUpperCase().replace(/[^A-Z0-9-. $/+%/]/g, "")}*`;

  let path = "";
  let x = 0;

  const N_WIDTH = 1.5;
  const W_WIDTH = 3.5;
  const GAP = 1.5;

  for (let i = 0; i < cleanVal.length; i++) {
    const char = cleanVal[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS["*"];

    for (let bitIdx = 0; bitIdx < 9; bitIdx++) {
      const isBar = bitIdx % 2 === 0;
      const isWide = pattern[bitIdx] === "1";
      const width = isWide ? W_WIDTH : N_WIDTH;

      if (isBar) {
        path += `M ${x} 0 L ${x} 40 L ${x + width} 40 L ${x + width} 0 Z `;
      }
      x += width;
    }
    x += GAP;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        width="180"
        height="40"
        viewBox={`0 0 ${x} 40`}
        style={{ display: "block" }}
        role="img"
        aria-label={`Barcode for ${value}`}
      >
        <path d={path} fill="#000000" />
      </svg>
      <p
        style={{
          fontSize: "7px",
          fontFamily: "monospace",
          color: "#1e293b",
          fontWeight: "bold",
          marginTop: "3px",
          letterSpacing: "2px",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ─── QR Code Component ─────────────────────────────────────
function QRCodeDisplay({ data }: { data: string }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(data, {
          width: 100,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "M",
        });
        if (!cancelled) setQrDataUrl(url);
      } catch {
        // QR generation failed silently
      }
    }
    generate();
    return () => {
      cancelled = true;
    };
  }, [data]);

  if (!qrDataUrl) return <div style={{ width: 100, height: 100, background: "#f1f5f9" }} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={qrDataUrl}
      alt="Invoice QR Code"
      width={100}
      height={100}
      style={{ display: "block", borderRadius: "4px" }}
    />
  );
}

// ─── GST Breakdown Table ────────────────────────────────────
function GSTBreakdown({
  subtotal,
  gstRate,
  gstAmount,
  grandTotal,
}: {
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
}) {
  const halfGST = gstAmount / 2;
  const cgstRate = gstRate / 2;

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "8px",
        marginTop: "4px",
      }}
    >
      <thead>
        <tr style={{ background: "#f8fafc" }}>
          {["HSN/SAC", "Taxable Value", `CGST @${cgstRate}%`, `SGST @${cgstRate}%`, "Total Tax", "Invoice Value"].map(
            (h) => (
              <th
                key={h}
                style={{
                  padding: "4px 6px",
                  textAlign: "right",
                  fontWeight: "700",
                  color: "#374151",
                  border: "1px solid #e2e8f0",
                  fontSize: "7px",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", color: "#64748b" }}>
            —
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", color: "#1e293b" }}>
            {formatCurrency(subtotal)}
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", color: "#1e293b" }}>
            {formatCurrency(halfGST)}
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", color: "#1e293b" }}>
            {formatCurrency(halfGST)}
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "600", color: "#1e293b" }}>
            {formatCurrency(gstAmount)}
          </td>
          <td
            style={{
              padding: "4px 6px",
              border: "1px solid #e2e8f0",
              textAlign: "right",
              fontWeight: "700",
              color: "#1e293b",
            }}
          >
            {formatCurrency(grandTotal)}
          </td>
        </tr>
        <tr style={{ background: "#f8fafc", fontWeight: "700" }}>
          <td
            style={{
              padding: "4px 6px",
              border: "1px solid #e2e8f0",
              textAlign: "right",
              color: "#374151",
              fontSize: "7px",
            }}
          >
            TOTAL
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#1e293b" }}>
            {formatCurrency(subtotal)}
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#1e293b" }}>
            {formatCurrency(halfGST)}
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#1e293b" }}>
            {formatCurrency(halfGST)}
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#4f46e5" }}>
            {formatCurrency(gstAmount)}
          </td>
          <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: "800", color: "#1e293b" }}>
            {formatCurrency(grandTotal)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ─── Amount In Words ────────────────────────────────────────
function amountToWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convert(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
    if (n < 100000) return convert(Math.floor(n / 1000)) + "Thousand " + convert(n % 1000);
    if (n < 10000000) return convert(Math.floor(n / 100000)) + "Lakh " + convert(n % 100000);
    return convert(Math.floor(n / 10000000)) + "Crore " + convert(n % 10000000);
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = convert(rupees).trim() + " Rupees";
  if (paise > 0) result += " and " + convert(paise).trim() + " Paise";
  return result + " Only";
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
export function InvoicePrintView({ invoice, calculations }: InvoicePrintViewProps) {
  const qrData = buildQRData(invoice, calculations);
  const statusConfig = INVOICE_STATUS_CONFIG[invoice.metadata.status];
  const validItems = invoice.items.filter((i) => i.name.trim());

  return (
    <div
      id="print-invoice"
      className="light"
      style={{
        width: "794px", // A4 at 96dpi
        minHeight: "1123px",
        background: "#ffffff",
        color: "#1e293b",
        fontFamily: "'Inter', Arial, sans-serif",
        fontSize: "11px",
        lineHeight: "1.4",
        padding: "0",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ── TOP ACCENT ── */}
      <div
        style={{
          height: "5px",
          background: "#4f46e5",
        }}
      />

      {/* ── HEADER ── */}
      <div
        style={{
          padding: "24px 32px 20px",
          borderBottom: "2px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "#f8fafc",
        }}
      >
        {/* Left: Business info */}
        <div style={{ flex: 1 }}>
          {/* Logo + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            {invoice.business.logoBase64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.business.logoBase64}
                alt="Logo"
                style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "8px" }}
              />
            ) : (
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "18px",
                }}
              >
                {(invoice.business.name || "I").charAt(0)}
              </div>
            )}
            <div>
              <p style={{ fontSize: "16px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                {invoice.business.name || "Your Business"}
              </p>
              {invoice.business.gstNumber && (
                <p style={{ fontSize: "9px", color: "#6366f1", fontFamily: "monospace", margin: "2px 0 0", fontWeight: "600" }}>
                  GSTIN: {invoice.business.gstNumber}
                </p>
              )}
            </div>
          </div>
          <div style={{ fontSize: "9px", color: "#64748b", lineHeight: "1.7" }}>
            {invoice.business.email && <p style={{ margin: 0 }}>✉ {invoice.business.email}</p>}
            {invoice.business.phone && <p style={{ margin: 0 }}>☎ {invoice.business.phone}</p>}
            {invoice.business.address && (
              <p style={{ margin: 0, maxWidth: "260px" }}>⊙ {invoice.business.address}</p>
            )}
          </div>
        </div>

        {/* Right: TAX INVOICE + metadata */}
        <div style={{ textAlign: "right", minWidth: "220px" }}>
          <p
            style={{
              fontSize: "22px",
              fontWeight: "900",
              color: "#4f46e5",
              letterSpacing: "-0.03em",
              margin: "0 0 4px",
            }}
          >
            TAX INVOICE
          </p>
          {/* Status */}
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "9px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
              background:
                invoice.metadata.status === "paid"
                  ? "#d1fae5"
                  : invoice.metadata.status === "pending"
                  ? "#fef3c7"
                  : "#f1f5f9",
              color:
                invoice.metadata.status === "paid"
                  ? "#065f46"
                  : invoice.metadata.status === "pending"
                  ? "#92400e"
                  : "#475569",
              border: `1px solid ${
                invoice.metadata.status === "paid"
                  ? "#a7f3d0"
                  : invoice.metadata.status === "pending"
                  ? "#fde68a"
                  : "#cbd5e1"
              }`,
            }}
          >
            ● {statusConfig.label}
          </span>
          <table style={{ marginLeft: "auto", fontSize: "9px", borderCollapse: "collapse" }}>
            <tbody>
              <MetaRow label="Invoice No." value={invoice.metadata.invoiceNumber} mono />
              <MetaRow label="Invoice Date" value={formatDate(invoice.metadata.invoiceDate)} />
              <MetaRow label="Due Date" value={formatDate(invoice.metadata.dueDate)} />
            </tbody>
          </table>
        </div>
      </div>

      {/* ── BILL TO / SHIP TO ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ padding: "14px 32px", borderRight: "1px solid #e2e8f0" }}>
          <p
            style={{
              fontSize: "8px",
              fontWeight: "800",
              color: "#4f46e5",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: "0 0 6px",
            }}
          >
            Bill To
          </p>
          <p style={{ fontWeight: "700", fontSize: "12px", color: "#1e293b", margin: "0 0 2px" }}>
            {invoice.client.name || "—"}
          </p>
          {invoice.client.company && (
            <p style={{ color: "#64748b", margin: "0 0 2px", fontSize: "10px" }}>
              {invoice.client.company}
            </p>
          )}
          {invoice.client.email && (
            <p style={{ color: "#64748b", margin: "0 0 2px", fontSize: "9px" }}>
              {invoice.client.email}
            </p>
          )}
          {invoice.client.address && (
            <p style={{ color: "#64748b", margin: 0, fontSize: "9px", lineHeight: "1.5" }}>
              {invoice.client.address}
            </p>
          )}
        </div>
        <div style={{ padding: "14px 32px", background: "#fafbff" }}>
          <p
            style={{
              fontSize: "8px",
              fontWeight: "800",
              color: "#4f46e5",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: "0 0 6px",
            }}
          >
            Payment Summary
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
            <span style={{ fontSize: "9px", color: "#64748b" }}>Subtotal (excl. GST)</span>
            <span style={{ fontSize: "9px", fontWeight: "600" }}>{formatCurrency(calculations.subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
            <span style={{ fontSize: "9px", color: "#64748b" }}>GST @ {invoice.gstRate}%</span>
            <span style={{ fontSize: "9px", fontWeight: "600" }}>{formatCurrency(calculations.gstAmount)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 8px",
              background: "#4f46e5",
              borderRadius: "6px",
              marginTop: "4px",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: "700", color: "white" }}>TOTAL DUE</span>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "white" }}>
              {formatCurrency(calculations.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* ── ITEMS TABLE ── */}
      <div style={{ padding: "0 32px", marginTop: "16px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
          <thead>
            <tr
              style={{
                background: "#4f46e5",
                color: "white",
              }}
            >
              {["#", "Service / Product", "Qty", "Unit Price", "Disc.", "Taxable", "GST", "Total"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 8px",
                      textAlign: h === "#" || h === "Qty" ? "center" : "right",
                      fontWeight: "700",
                      fontSize: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      ...(h === "Service / Product" ? { textAlign: "left" } : {}),
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {validItems.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontStyle: "italic" }}
                >
                  No items
                </td>
              </tr>
            ) : (
              validItems.map((item, idx) => {
                const lineTotal = calcItemTotal(item);
                const lineGST = (lineTotal * invoice.gstRate) / 100;
                const lineGrandTotal = lineTotal + lineGST;
                return (
                  <tr
                    key={item.id}
                    style={{
                      background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <td style={{ padding: "8px", textAlign: "center", color: "#94a3b8", fontWeight: "600" }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#1e293b", margin: 0, fontSize: "10px" }}>
                        {item.name}
                      </p>
                      {item.description && (
                        <p style={{ color: "#94a3b8", margin: "1px 0 0", fontSize: "8px" }}>
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center", color: "#475569" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right", color: "#475569" }}>
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right", color: "#94a3b8" }}>—</td>
                    <td style={{ padding: "8px", textAlign: "right", color: "#475569" }}>
                      {formatCurrency(lineTotal)}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right", color: "#6366f1" }}>
                      {formatCurrency(lineGST)}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right", fontWeight: "700", color: "#1e293b" }}>
                      {formatCurrency(lineGrandTotal)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── TOTALS + QR + BARCODE ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          padding: "16px 32px",
          marginTop: "8px",
          borderTop: "2px solid #e2e8f0",
        }}
      >
        {/* Left: QR + Barcode */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <p
              style={{
                fontSize: "8px",
                fontWeight: "700",
                color: "#6366f1",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 6px",
              }}
            >
              Scan for Invoice Details
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <QRCodeDisplay data={qrData} />
              <div style={{ paddingBottom: "4px" }}>
                <InvoiceBarcode value={invoice.metadata.invoiceNumber} />
              </div>
            </div>
          </div>

          {/* Amount in words */}
          <div
            style={{
              padding: "8px 10px",
              background: "#f0f4ff",
              borderRadius: "6px",
              border: "1px solid #c7d2fe",
              maxWidth: "280px",
            }}
          >
            <p style={{ fontSize: "8px", fontWeight: "700", color: "#4f46e5", margin: "0 0 3px", textTransform: "uppercase" }}>
              Amount in Words
            </p>
            <p style={{ fontSize: "9px", color: "#1e293b", margin: 0, fontStyle: "italic", lineHeight: "1.4" }}>
              {amountToWords(calculations.grandTotal)}
            </p>
          </div>
        </div>

        {/* Right: Totals */}
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
            <tbody>
              <TotalRow label="Subtotal (excl. GST)" value={formatCurrency(calculations.subtotal)} />
              <TotalRow
                label={`CGST @ ${invoice.gstRate / 2}%`}
                value={formatCurrency(calculations.gstAmount / 2)}
              />
              <TotalRow
                label={`SGST @ ${invoice.gstRate / 2}%`}
                value={formatCurrency(calculations.gstAmount / 2)}
              />
              <TotalRow
                label={`Total GST (${invoice.gstRate}%)`}
                value={formatCurrency(calculations.gstAmount)}
                accent
              />
              <tr>
                <td colSpan={2}>
                  <div
                    style={{
                      height: "1px",
                      background: "#e2e8f0",
                      margin: "6px 0",
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "10px 12px",
                    fontWeight: "700",
                    fontSize: "11px",
                    background: "#4f46e5",
                    color: "white",
                    borderRadius: "6px 0 0 6px",
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontWeight: "800",
                    fontSize: "13px",
                    background: "#4f46e5",
                    color: "white",
                    textAlign: "right",
                    borderRadius: "0 6px 6px 0",
                  }}
                >
                  {formatCurrency(calculations.grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GST BREAKDOWN TABLE ── */}
      {calculations.subtotal > 0 && (
        <div style={{ padding: "0 32px 16px" }}>
          <p
            style={{
              fontSize: "8px",
              fontWeight: "700",
              color: "#4f46e5",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 4px",
            }}
          >
            GST Calculation Breakdown
          </p>
          <GSTBreakdown
            subtotal={calculations.subtotal}
            gstRate={invoice.gstRate}
            gstAmount={calculations.gstAmount}
            grandTotal={calculations.grandTotal}
          />
        </div>
      )}

      {/* ── NOTES ── */}
      {invoice.notes && (
        <div
          style={{
            padding: "12px 32px",
            borderTop: "1px solid #e2e8f0",
            background: "#fafbff",
          }}
        >
          <p
            style={{
              fontSize: "8px",
              fontWeight: "700",
              color: "#4f46e5",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 4px",
            }}
          >
            Notes &amp; Terms
          </p>
          <p style={{ fontSize: "9px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
            {invoice.notes}
          </p>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div
        style={{
          padding: "12px 32px",
          borderTop: "2px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8fafc",
        }}
      >
        <div>
          <p style={{ fontSize: "8px", color: "#94a3b8", margin: 0 }}>
            Generated by{" "}
            <strong style={{ color: "#4f46e5" }}>InvoForge</strong> —
            Professional GST Invoice Generator
          </p>
          <p style={{ fontSize: "8px", color: "#94a3b8", margin: "1px 0 0" }}>
            Developer: Ritwik Das · ritwikdas100@gmail.com
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "8px", color: "#94a3b8", margin: 0 }}>
            This is a computer-generated invoice.
          </p>
          <p style={{ fontSize: "8px", color: "#94a3b8", margin: "1px 0 0" }}>
            No signature required.
          </p>
        </div>
      </div>

      {/* ── BOTTOM ACCENT ── */}
      <div
        style={{
          height: "4px",
          background: "#4f46e5",
        }}
      />
    </div>
  );
}

// ─── Helper components ───────────────────────────────────────

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "2px 8px 2px 0",
          color: "#94a3b8",
          fontSize: "9px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "2px 0",
          color: "#1e293b",
          fontWeight: "700",
          fontSize: "9px",
          fontFamily: mono ? "monospace" : "inherit",
          textAlign: "right",
        }}
      >
        {value}
      </td>
    </tr>
  );
}

function TotalRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "4px 8px 4px 0",
          color: accent ? "#4f46e5" : "#64748b",
          fontSize: "9px",
          fontWeight: accent ? "700" : "400",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "4px 0",
          color: accent ? "#4f46e5" : "#1e293b",
          fontWeight: accent ? "700" : "600",
          fontSize: accent ? "10px" : "9px",
          textAlign: "right",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        {value}
      </td>
    </tr>
  );
}
