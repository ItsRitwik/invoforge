"use client";

// ============================================================
// InvoForge — Main Page (v2: Fixed PDF + Print + GST Calc)
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useState } from "react";
import {
  Download,
  Printer,
  Save,
  RotateCcw,
  Zap,
  FileText,
  Receipt,
  IndianRupee,
  Package,
  ArrowRight,
  Sparkles,
  ExternalLink,
  History,
  Calculator,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { InvoicePrintView } from "@/components/invoice/InvoicePrintView";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SavedInvoices } from "@/components/dashboard/SavedInvoices";
import { ToastContainer } from "@/components/shared/ToastContainer";
import { CopyButton } from "@/components/shared/CopyButton";
import { GSTCalculator } from "@/components/tools/GSTCalculator";
import { useInvoice } from "@/hooks/useInvoice";
import { useSavedInvoices } from "@/hooks/useSavedInvoices";
import { useToast } from "@/hooks/useToast";
import { buildInvoiceSummary } from "@/lib/invoice-utils";
import { generatePDF, printInvoice } from "@/lib/pdf-generator";
import { InvoiceData } from "@/types/invoice";
import { cn } from "@/lib/utils";

type AppTab = "invoice" | "calculator";
type MobileTab = "form" | "preview";

export default function Home() {
  const {
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
  } = useInvoice();

  const { savedInvoices, saveInvoice, deleteInvoice } = useSavedInvoices();
  const { toasts, removeToast, success, error, info } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [appTab, setAppTab] = useState<AppTab>("invoice");
  const [mobileTab, setMobileTab] = useState<MobileTab>("form");

  // ─── Load saved invoice ─────────────────────────────────────
  function handleLoadInvoice(data: InvoiceData) {
    setInvoice(data);
    success("Invoice Loaded", `Invoice ${data.metadata.invoiceNumber} loaded successfully.`);
    setAppTab("invoice");
    setMobileTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Save invoice ───────────────────────────────────────────
  function handleSaveInvoice() {
    if (!invoice.client.name?.trim()) {
      error("Missing Client Name", "Please add a client name before saving.");
      return;
    }
    saveInvoice(invoice, calculations);
    success("Invoice Saved", `${invoice.metadata.invoiceNumber} saved to history.`);
  }

  // ─── Generate PDF ───────────────────────────────────────────
  async function handleDownloadPDF() {
    if (!invoice.client.name?.trim()) {
      error("Missing Client Name", "Please add a client name before downloading.");
      return;
    }
    if (!invoice.items.some((i) => i.name.trim())) {
      error("No Items", "Please add at least one item to the invoice.");
      return;
    }
    setIsGeneratingPDF(true);
    info("Generating PDF", "Please wait while we prepare your invoice...");
    try {
      await generatePDF(invoice);
      success(
        "PDF Downloaded ✓",
        `${invoice.metadata.invoiceNumber} saved to your downloads folder.`
      );
    } catch (e) {
      error("PDF Error", "Failed to generate PDF. Please try again.");
      console.error(e);
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  // ─── Print ──────────────────────────────────────────────────
  function handlePrint() {
    if (!invoice.client.name?.trim()) {
      error("Missing Client Name", "Please add a client name before printing.");
      return;
    }
    info("Opening Print Dialog", "Your invoice is ready to print.");
    setTimeout(() => printInvoice(), 300);
  }

  // ─── Reset ──────────────────────────────────────────────────
  function handleReset() {
    if (window.confirm("Reset the invoice? All current data will be lost.")) {
      resetInvoice();
      info("Invoice Reset", "A fresh invoice has been created.");
    }
  }

  const invoiceSummaryText = buildInvoiceSummary(invoice, calculations);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ── Off-screen Print View (always rendered, never visible to user) ── */}
      <div
        id="print-invoice-wrapper"
        className="light"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: "794px",
          zIndex: -1,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <InvoicePrintView invoice={invoice} calculations={calculations} />
      </div>

      <Navbar />

      <main style={{ flex: 1 }}>
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "3.5rem 1.5rem 3rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-60px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "600px",
              height: "300px",
              background:
                "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative" }}>
            <div
              className="inline-flex items-center gap-2 mb-5"
              style={{
                padding: "0.375rem 1rem",
                borderRadius: "9999px",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "var(--indigo-400)",
              }}
            >
              <Sparkles size={12} />
              Free · No Account Required · GST Compliant
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: "800",
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
                color: "var(--text-primary)",
              }}
            >
              Professional{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                GST Invoice
              </span>{" "}
              Generator
            </h1>

            <p
              style={{
                fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
                color: "var(--text-secondary)",
                lineHeight: "1.65",
                maxWidth: "540px",
                margin: "0 auto 2rem",
              }}
            >
              Generate GST-compliant invoices, calculate taxes automatically, and export professional PDFs instantly. Includes standalone GST calculator.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3" style={{ marginBottom: "1.5rem" }}>
              <a href="#app-section" className="btn btn-primary btn-lg">
                <FileText size={17} />
                Create Invoice
                <ArrowRight size={15} style={{ marginLeft: "2px" }} />
              </a>
              <button
                onClick={handleDownloadPDF}
                className="btn btn-secondary btn-lg"
                disabled={isGeneratingPDF}
                id="hero-download-btn"
              >
                <Download size={17} />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </button>
              <button
                onClick={() => setAppTab("calculator")}
                className="btn btn-secondary btn-lg"
                id="hero-calculator-btn"
              >
                <Calculator size={17} />
                GST Calculator
              </button>
            </div>

            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              id="digital-heroes-hero-btn"
              className="inline-flex items-center gap-2 btn btn-sm"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "var(--indigo-400)",
              }}
              aria-label="Built for Digital Heroes - Visit Digital Heroes Co"
            >
              <Zap size={12} fill="currentColor" />
              Built for Digital Heroes
              <ExternalLink size={11} style={{ opacity: 0.6 }} />
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            STATS
        ═══════════════════════════════════════════════════════ */}
        <section
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1.5rem 0" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard label="Total Items" value={calculations.itemCount} icon={Package} accentColor="var(--indigo-500)" />
            <StatsCard label="Subtotal" value={calculations.subtotal} icon={Receipt} isCurrency accentColor="#8b5cf6" />
            <StatsCard label={`GST (${invoice.gstRate}%)`} value={calculations.gstAmount} icon={IndianRupee} isCurrency accentColor="#f59e0b" />
            <StatsCard label="Grand Total" value={calculations.grandTotal} icon={IndianRupee} isCurrency accentColor="#10b981" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            APP TAB SWITCHER
        ═══════════════════════════════════════════════════════ */}
        <section
          id="app-section"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.5rem 1.5rem 0" }}
        >
          {/* Main Tab Bar */}
          <div
            className="card-glass flex items-center gap-1 mb-4"
            style={{ padding: "0.375rem", display: "inline-flex" }}
          >
            <button
              onClick={() => setAppTab("invoice")}
              className={cn("btn btn-sm gap-2", appTab === "invoice" ? "btn-primary" : "btn-ghost")}
              aria-pressed={appTab === "invoice"}
            >
              <FileText size={14} />
              Invoice Generator
            </button>
            <button
              onClick={() => setAppTab("calculator")}
              className={cn("btn btn-sm gap-2", appTab === "calculator" ? "btn-primary" : "btn-ghost")}
              aria-pressed={appTab === "calculator"}
            >
              <Calculator size={14} />
              GST Calculator
            </button>
          </div>

          {/* ── INVOICE GENERATOR TAB ── */}
          {appTab === "invoice" && (
            <div className="animate-fade-in">
              {/* Action Bar */}
              <div
                className="card-glass flex flex-wrap items-center gap-3 mb-4"
                style={{ padding: "0.875rem 1.25rem" }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block" style={{ color: "var(--text-muted)" }}>
                    Quick Actions
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="btn btn-primary btn-sm"
                    id="action-download-pdf"
                    aria-label="Download invoice as PDF"
                  >
                    <Download size={14} />
                    {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn btn-secondary btn-sm"
                    id="action-print"
                    aria-label="Print invoice"
                  >
                    <Printer size={14} />
                    Print Invoice
                  </button>
                  <button
                    onClick={handleSaveInvoice}
                    className="btn btn-secondary btn-sm"
                    id="action-save"
                    aria-label="Save invoice to history"
                  >
                    <Save size={14} />
                    Save
                  </button>
                  <CopyButton
                    text={invoiceSummaryText}
                    label="Copy Summary"
                    onCopied={() => success("Copied!", "Invoice summary copied to clipboard.")}
                    id="action-copy"
                  />
                  <button
                    onClick={handleReset}
                    className="btn btn-ghost btn-sm"
                    id="action-reset"
                    aria-label="Reset invoice form"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Mobile Tab Switcher (form vs preview) */}
              <div
                className="lg:hidden flex mb-4 rounded-xl overflow-hidden border"
                style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}
                role="tablist"
              >
                <button
                  onClick={() => setMobileTab("form")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
                  style={{
                    background: mobileTab === "form" ? "var(--bg-elevated)" : "transparent",
                    color: mobileTab === "form" ? "var(--text-primary)" : "var(--text-muted)",
                    borderRight: "1px solid var(--border-subtle)",
                  }}
                  role="tab"
                  aria-selected={mobileTab === "form"}
                >
                  <FileText size={14} />
                  Invoice Form
                </button>
                <button
                  onClick={() => setMobileTab("preview")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
                  style={{
                    background: mobileTab === "preview" ? "var(--bg-elevated)" : "transparent",
                    color: mobileTab === "preview" ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                  role="tab"
                  aria-selected={mobileTab === "preview"}
                >
                  <Receipt size={14} />
                  Preview
                </button>
              </div>

              {/* Three-column layout */}
              <div className="flex gap-5" style={{ alignItems: "flex-start" }}>
                {/* LEFT: Form */}
                <div
                  id="invoice-section"
                  className={`flex-1 min-w-0 ${mobileTab !== "form" ? "hidden lg:block" : ""}`}
                  style={{ maxWidth: "580px" }}
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                      Invoice Details
                    </h2>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Fill in the form — changes update the preview instantly
                    </p>
                  </div>
                  <InvoiceForm
                    invoice={invoice}
                    onUpdateBusiness={updateBusiness}
                    onUpdateClient={updateClient}
                    onUpdateMetadata={updateMetadata}
                    onUpdateGSTRate={updateGSTRate}
                    onUpdateNotes={updateNotes}
                    onUpdateStatus={updateStatus}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                    onUpdateItem={updateItem}
                  />
                </div>

                {/* CENTER: Preview */}
                <div
                  id="preview-section"
                  className={`flex-1 min-w-0 ${mobileTab !== "preview" ? "hidden lg:block" : ""}`}
                  style={{ maxWidth: "600px" }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                        Live Preview
                      </h2>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        Updates in real time as you type
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className="btn btn-primary btn-sm"
                      aria-label="Download PDF"
                    >
                      <Download size={13} />
                      PDF
                    </button>
                  </div>
                  <InvoicePreview invoice={invoice} calculations={calculations} />
                </div>

                {/* RIGHT: Sidebar */}
                <div
                  id="saved-section"
                  className="hidden xl:block flex-shrink-0"
                  style={{ width: "280px" }}
                >
                  <div className="card-glass" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                    <div className="section-header" style={{ marginBottom: "1rem" }}>
                      <History size={15} className="section-icon" />
                      <span className="section-title" style={{ fontSize: "0.8rem" }}>Recent Invoices</span>
                      <span
                        className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(99,102,241,0.12)", color: "var(--indigo-400)" }}
                      >
                        {savedInvoices.length}/5
                      </span>
                    </div>
                    <SavedInvoices invoices={savedInvoices} onLoad={handleLoadInvoice} onDelete={deleteInvoice} />
                  </div>

                  <div className="card-glass" style={{ padding: "1.25rem" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                      Quick Tips
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Form auto-saves to browser",
                        "Upload your company logo",
                        "PDF includes QR code & barcode",
                        "Print shows white invoice only",
                        "Copy summary to clipboard",
                        "Switch to GST Calculator tab",
                      ].map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                          <span
                            style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--indigo-500)", marginTop: "5px", flexShrink: 0 }}
                            aria-hidden
                          />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mobile: Saved Invoices */}
              <div className="xl:hidden mt-6">
                <div className="card-glass" style={{ padding: "1.25rem" }}>
                  <div className="section-header" style={{ marginBottom: "1rem" }}>
                    <History size={15} className="section-icon" />
                    <span className="section-title" style={{ fontSize: "0.8rem" }}>Recent Invoices</span>
                    <span
                      className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: "rgba(99,102,241,0.12)", color: "var(--indigo-400)" }}
                    >
                      {savedInvoices.length}/5
                    </span>
                  </div>
                  <SavedInvoices invoices={savedInvoices} onLoad={handleLoadInvoice} onDelete={deleteInvoice} />
                </div>
              </div>
            </div>
          )}

          {/* ── GST CALCULATOR TAB ── */}
          {appTab === "calculator" && (
            <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  GST Calculator
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Calculate GST for any amount instantly — supports exclusive/inclusive modes, CGST+SGST and IGST breakdown.
                </p>
              </div>
              <GSTCalculator />
            </div>
          )}
        </section>

        {/* Spacing */}
        <div style={{ height: "3rem" }} />
      </main>

      <Footer />
    </div>
  );
}
