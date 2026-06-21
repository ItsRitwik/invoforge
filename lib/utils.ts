// ============================================================
// InvoForge — Utility: className merger
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
