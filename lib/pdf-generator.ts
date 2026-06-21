// ============================================================
// InvoForge — PDF Generator (Fixed v3)
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { InvoiceData } from "@/types/invoice";

/**
 * Downloads a professional PDF of the invoice.
 * Clones #print-invoice, renders it visibly off-screen,
 * captures with html2canvas, wraps in jsPDF, downloads via blob URL.
 */
export async function generatePDF(invoiceData: InvoiceData): Promise<void> {
  const source = document.getElementById("print-invoice");
  if (!source) throw new Error("#print-invoice element not found in DOM.");

  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  // ── Clone the invoice into a visible fixed container ──────
  const container = document.createElement("div");
  container.style.cssText = [
    "position:fixed",
    "top:0",
    "left:-9999px",            // off-screen so user doesn't see it
    "width:794px",
    "background:#ffffff",
    "z-index:-9999",           // behind everything
    "opacity:1",               // MUST be 1 so html2canvas renders it
    "pointer-events:none",
    "overflow:visible",
  ].join(";");

  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.cssText = "";   // strip any leftover positioning
  container.appendChild(clone);
  document.body.appendChild(container);

  // Wait for QR code / async images to settle
  await new Promise((r) => setTimeout(r, 600));

  try {
    const totalHeight = container.scrollHeight;

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 794,
      height: totalHeight,
      windowWidth: 794,
      windowHeight: totalHeight,
      x: 0,
      y: 0,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    const A4_W_MM = 210;
    const A4_H_MM = 297;
    const imgH_MM = (canvas.height / canvas.width) * A4_W_MM;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    if (imgH_MM <= A4_H_MM) {
      // Single page
      pdf.addImage(imgData, "JPEG", 0, 0, A4_W_MM, imgH_MM);
    } else {
      // Multi-page: slice canvas per A4 page
      const pageHeightPx = (A4_H_MM * canvas.width) / A4_W_MM;
      let remaining = canvas.height;
      let offsetPx = 0;
      let pageIdx = 0;

      while (remaining > 0) {
        const sliceH = Math.min(pageHeightPx, remaining);
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = sliceH;
        const ctx = slice.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, sliceH);
        ctx.drawImage(canvas, 0, -offsetPx);

        const sliceImg = slice.toDataURL("image/jpeg", 0.92);
        const sliceH_MM = (sliceH / canvas.width) * A4_W_MM;
        if (pageIdx > 0) pdf.addPage();
        pdf.addImage(sliceImg, "JPEG", 0, 0, A4_W_MM, sliceH_MM);

        offsetPx += sliceH;
        remaining -= sliceH;
        pageIdx++;
      }
    }

    // ── Download with proper filename via Data URI (bypasses IDM UUID renaming) ──
    const safeClient = (invoiceData.client.name || "Invoice")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 25);
    const safeNum = invoiceData.metadata.invoiceNumber.replace(/[^a-zA-Z0-9-]/g, "_");
    const fileName = `InvoForge_${safeNum}_${safeClient}.pdf`;

    try {
      const dataUri = pdf.output("datauristring");
      const link = document.createElement("a");
      link.href = dataUri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.warn("[InvoForge] Data URI download failed, falling back to pdf.save()", e);
      pdf.save(fileName);
    }

  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Prints only the invoice by opening a dedicated print window.
 * Completely isolated from the main page — only invoice HTML is printed.
 */
export function printInvoice(): void {
  const source = document.getElementById("print-invoice");
  if (!source) {
    alert("Invoice not ready. Please fill in some details first.");
    return;
  }

  const invoiceHTML = source.outerHTML;

  const printWin = window.open("", "_blank", "width=900,height=1200,scrollbars=yes");
  if (!printWin) {
    alert("Please allow pop-ups for this site to enable printing.");
    return;
  }

  printWin.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice — InvoForge</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; background: #fff; font-family: 'Inter', Arial, sans-serif; }
    body { padding: 0; }
    #print-invoice { width: 794px; max-width: 100%; }
    @page { size: A4 portrait; margin: 0; }
    @media print {
      html, body { width: 210mm; }
      #print-invoice { width: 210mm; page-break-inside: avoid; }
    }
    .no-print { display: none !important; }
  </style>
</head>
<body>
  ${invoiceHTML}
  <script>
    window.onload = function () {
      // Give images time to load (QR code etc.)
      setTimeout(function () {
        window.print();
        window.onafterprint = function () { window.close(); };
      }, 400);
    };
  </script>
</body>
</html>`);

  printWin.document.close();
}
