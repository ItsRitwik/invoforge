// ============================================================
// InvoForge — Constants
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { GSTRate } from "@/types/invoice";

export const APP_NAME = "InvoForge";
export const APP_TAGLINE = "Generate Professional GST-Compliant Invoices in Seconds";
export const APP_URL = "https://invoforge.vercel.app";
export const DEVELOPER_NAME = "Ritwik Das";
export const DEVELOPER_EMAIL = "ritwikdas100@gmail.com";
export const DEVELOPER_GITHUB = "https://github.com/ItsRitwik";
export const DEVELOPER_PORTFOLIO = "https://www.ritwik.online";
export const DIGITAL_HEROES_URL = "https://digitalheroesco.com";

export const GST_RATES: GSTRate[] = [0, 5, 12, 18, 28];

export const DEFAULT_GST_RATE: GSTRate = 18;

export const MAX_SAVED_INVOICES = 5;

export const LOCAL_STORAGE_KEYS = {
  INVOICE_FORM: "invoforge_invoice_form",
  SAVED_INVOICES: "invoforge_saved_invoices",
  THEME: "invoforge_theme",
} as const;

export const DEFAULT_BUSINESS = {
  name: "VRF Labs",
  gstNumber: "22AAAAA0000A1Z5",
  email: "ritwikdas100@gmail.com",
  phone: "+91 00000 00000",
  address: "123, Tech Street, Bengaluru, Karnataka - 560001",
  logoBase64: "",
};

export const DEFAULT_CLIENT = {
  name: "",
  company: "",
  email: "",
  address: "",
};

export const DEFAULT_ITEM = {
  name: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
};

export const INVOICE_NUMBER_PREFIX = "INV";

export const CURRENCY = {
  code: "INR",
  symbol: "₹",
  locale: "en-IN",
};
