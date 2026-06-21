"use client";

// ============================================================
// InvoForge — useInvoice Hook (Core State)
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useCallback, useMemo } from "react";
import {
  InvoiceData,
  InvoiceItem,
  GSTRate,
  InvoiceStatus,
  BusinessInfo,
  ClientInfo,
  InvoiceMetadata,
} from "@/types/invoice";
import { calcInvoiceTotals } from "@/lib/calculations";
import { createBlankItem, createDefaultInvoice } from "@/lib/invoice-utils";
import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

export function useInvoice() {
  const [invoice, setInvoice] = useLocalStorage<InvoiceData>(
    LOCAL_STORAGE_KEYS.INVOICE_FORM,
    createDefaultInvoice()
  );

  // ─── Calculations (memoized) ────────────────────────────────
  const calculations = useMemo(
    () => calcInvoiceTotals(invoice.items, invoice.gstRate),
    [invoice.items, invoice.gstRate]
  );

  // ─── Business Info ──────────────────────────────────────────
  const updateBusiness = useCallback(
    (updates: Partial<BusinessInfo>) => {
      setInvoice((prev) => ({
        ...prev,
        business: { ...prev.business, ...updates },
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  // ─── Client Info ───────────────────────────────────────────
  const updateClient = useCallback(
    (updates: Partial<ClientInfo>) => {
      setInvoice((prev) => ({
        ...prev,
        client: { ...prev.client, ...updates },
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  // ─── Metadata ──────────────────────────────────────────────
  const updateMetadata = useCallback(
    (updates: Partial<InvoiceMetadata>) => {
      setInvoice((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, ...updates },
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  // ─── GST Rate ──────────────────────────────────────────────
  const updateGSTRate = useCallback(
    (rate: GSTRate) => {
      setInvoice((prev) => ({
        ...prev,
        gstRate: rate,
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  // ─── Notes ─────────────────────────────────────────────────
  const updateNotes = useCallback(
    (notes: string) => {
      setInvoice((prev) => ({
        ...prev,
        notes,
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  // ─── Status ────────────────────────────────────────────────
  const updateStatus = useCallback(
    (status: InvoiceStatus) => {
      setInvoice((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, status },
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  // ─── Items ─────────────────────────────────────────────────
  const addItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, createBlankItem()],
      updatedAt: new Date().toISOString(),
    }));
  }, [setInvoice]);

  const removeItem = useCallback(
    (id: string) => {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<InvoiceItem>) => {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
        updatedAt: new Date().toISOString(),
      }));
    },
    [setInvoice]
  );

  // ─── Reset ─────────────────────────────────────────────────
  const resetInvoice = useCallback(() => {
    setInvoice(createDefaultInvoice());
  }, [setInvoice]);

  return {
    invoice,
    setInvoice,
    calculations,
    updateBusiness,
    updateClient,
    updateMetadata,
    updateGSTRate,
    updateNotes,
    updateStatus,
    addItem,
    removeItem,
    updateItem,
    resetInvoice,
  };
}
