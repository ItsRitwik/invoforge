"use client";

// ============================================================
// InvoForge — LogoUpload Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  onRemove: () => void;
}

export function LogoUpload({ value, onChange, onRemove }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  function handleFile(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, SVG).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (value) {
    return (
      <div className="relative inline-block group">
        <div
          className="w-20 h-20 rounded-xl overflow-hidden border-2 flex items-center justify-center"
          style={{ borderColor: "var(--border-strong)", background: "var(--bg-elevated)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Business logo"
            className="w-full h-full object-contain"
          />
        </div>
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "var(--error)", color: "white" }}
          aria-label="Remove logo"
        >
          <X size={10} />
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs w-full text-center transition-colors"
          style={{ color: "var(--indigo-400)" }}
        >
          Change
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          aria-label="Change company logo"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "w-full rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all",
          isDragging && "scale-[1.02]"
        )}
        style={{
          borderColor: isDragging ? "var(--indigo-500)" : "var(--border-default)",
          background: isDragging ? "rgba(99,102,241,0.05)" : "var(--bg-input)",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload company logo"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <div
          className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: "rgba(99,102,241,0.1)" }}
        >
          <ImageIcon size={20} style={{ color: "var(--indigo-400)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Upload Logo
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          PNG, JPG, SVG · Max 2MB
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Upload size={12} style={{ color: "var(--indigo-400)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--indigo-400)" }}>
            Click or drag &amp; drop
          </span>
        </div>
      </div>
      {error && (
        <p className="text-xs mt-2" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        aria-label="Upload company logo"
      />
    </div>
  );
}
