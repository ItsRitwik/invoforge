"use client";

// ============================================================
// InvoForge — CopyButton Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  onCopied?: () => void;
  id?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  className,
  onCopied,
  id,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      id={id}
      onClick={handleCopy}
      className={cn("btn btn-secondary btn-sm", className)}
      aria-label={copied ? "Copied!" : label}
      title={copied ? "Copied to clipboard!" : label}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          transition: "all 0.2s ease",
        }}
      >
        {copied ? (
          <>
            <Check size={14} style={{ color: "var(--success)" }} />
            <span style={{ color: "var(--success)" }}>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>{label}</span>
          </>
        )}
      </span>
    </button>
  );
}
