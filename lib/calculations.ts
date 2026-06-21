// ============================================================
// InvoForge — GST Calculations Utility
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { InvoiceItem, InvoiceCalculations } from "@/types/invoice";
import { CURRENCY } from "./constants";

/**
 * Format a number as Indian Rupee currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate line item total (quantity × unitPrice)
 */
export function calcItemTotal(item: InvoiceItem): number {
  return Number((item.quantity * item.unitPrice).toFixed(2));
}

/**
 * Calculate all invoice totals from items and GST rate
 */
export function calcInvoiceTotals(
  items: InvoiceItem[],
  gstRate: number
): InvoiceCalculations {
  const subtotal = items.reduce((sum, item) => {
    return sum + calcItemTotal(item);
  }, 0);

  const gstAmount = Number(((subtotal * gstRate) / 100).toFixed(2));
  const grandTotal = Number((subtotal + gstAmount).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    gstAmount,
    grandTotal,
    itemCount: items.length,
  };
}

/**
 * Format a number as a plain decimal string with 2 decimal places
 */
export function formatDecimal(value: number): string {
  return value.toFixed(2);
}

/**
 * Parse a string to a safe number, returns 0 if invalid
 */
export function safeParseFloat(value: string): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/**
 * Parse a string to a safe integer, returns 1 if invalid (for quantity)
 */
export function safeParseInt(value: string, min = 1): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < min ? min : parsed;
}
