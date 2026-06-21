// ============================================================
// InvoForge — TypeScript Interfaces
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

export type GSTRate = 0 | 5 | 12 | 18 | 28;

export type InvoiceStatus = "draft" | "pending" | "paid";

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface BusinessInfo {
  name: string;
  gstNumber: string;
  email: string;
  phone: string;
  address: string;
  logoBase64?: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  address: string;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface InvoiceData {
  id: string;
  business: BusinessInfo;
  client: ClientInfo;
  metadata: InvoiceMetadata;
  items: InvoiceItem[];
  gstRate: GSTRate;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceCalculations {
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  itemCount: number;
}

export interface SavedInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  grandTotal: number;
  status: InvoiceStatus;
  createdAt: string;
  data: InvoiceData;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}

export const GST_RATES: GSTRate[] = [0, 5, 12, 18, 28];

export const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; color: string; bgColor: string }
> = {
  draft: {
    label: "Draft",
    color: "text-slate-400",
    bgColor: "bg-slate-800/60 border-slate-600/50",
  },
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bgColor: "bg-amber-900/30 border-amber-600/50",
  },
  paid: {
    label: "Paid",
    color: "text-emerald-400",
    bgColor: "bg-emerald-900/30 border-emerald-600/50",
  },
};
