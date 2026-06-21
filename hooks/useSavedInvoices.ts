"use client";

// ============================================================
// InvoForge — useSavedInvoices Hook
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useCallback } from "react";
import { SavedInvoice, InvoiceData, InvoiceCalculations } from "@/types/invoice";
import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS, MAX_SAVED_INVOICES } from "@/lib/constants";
import { generateId } from "@/lib/invoice-utils";

export function useSavedInvoices() {
  const [savedInvoices, setSavedInvoices] = useLocalStorage<SavedInvoice[]>(
    LOCAL_STORAGE_KEYS.SAVED_INVOICES,
    []
  );

  const saveInvoice = useCallback(
    (invoiceData: InvoiceData, calcs: InvoiceCalculations): SavedInvoice => {
      const saved: SavedInvoice = {
        id: generateId(),
        invoiceNumber: invoiceData.metadata.invoiceNumber,
        clientName: invoiceData.client.name,
        clientCompany: invoiceData.client.company,
        grandTotal: calcs.grandTotal,
        status: invoiceData.metadata.status,
        createdAt: new Date().toISOString(),
        data: invoiceData,
      };

      setSavedInvoices((prev) => {
        const updated = [saved, ...prev];
        // Keep only the last MAX_SAVED_INVOICES
        return updated.slice(0, MAX_SAVED_INVOICES);
      });

      return saved;
    },
    [setSavedInvoices]
  );

  const deleteInvoice = useCallback(
    (id: string) => {
      setSavedInvoices((prev) => prev.filter((inv) => inv.id !== id));
    },
    [setSavedInvoices]
  );

  const clearAll = useCallback(() => {
    setSavedInvoices([]);
  }, [setSavedInvoices]);

  return { savedInvoices, saveInvoice, deleteInvoice, clearAll };
}
