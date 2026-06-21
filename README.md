# InvoForge

<div align="center">

![InvoForge Banner](public/og-image.png)

**Generate Professional GST-Compliant Invoices in Seconds**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built for Digital Heroes](https://img.shields.io/badge/Built%20for-Digital%20Heroes-6366f1)](https://digitalheroesco.com)

[Live Demo](https://invoforge.vercel.app) · [GitHub](https://github.com/ItsRitwik/invoforge) · [Portfolio](https://www.ritwik.online)

</div>

---

## 🧾 Overview

**InvoForge** is a production-ready, free GST Invoice Generator built for freelancers, agencies, developers, and small businesses in India. It provides a beautiful, professional interface for generating GST-compliant invoices, calculating taxes automatically, and exporting print-ready PDFs — all in seconds, with no account required.

Built with startup-quality UI/UX inspired by Linear, Stripe, Vercel, and Resend.

---

## 🚨 Problem Statement

As a software developer, freelancer, and digital product creator, I repeatedly needed a fast, professional, free invoice generator. Most existing tools are:

- 💸 **Paid** — behind paywalls or freemium limits
- 🐌 **Slow** — require account creation and email verification
- 😵 **Cluttered** — overwhelming dashboards for a simple task
- ❌ **Not GST-compliant** — missing Indian tax rate support

**InvoForge** solves all of this with a single, beautiful page that works instantly.

---

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| 🧾 Business Info | Name, GST number, email, phone, address |
| 👤 Client Info | Name, company, email, address |
| 📋 Invoice Metadata | Auto-generated number, date, due date |
| 📦 Line Items | Unlimited items with quantity × unit price |
| 🧮 GST Calculation | 0%, 5%, 12%, 18%, 28% with auto calculation |
| 👁 Live Preview | Real-time invoice preview as you type |
| 📄 PDF Download | Professional jsPDF-generated PDF |
| 🖨 Print | Browser print dialog integration |

### Extended Features
| Feature | Description |
|---------|-------------|
| 🖼 Logo Upload | Drag-and-drop company logo with preview |
| 🏷 Status Badge | Draft / Pending / Paid status tracking |
| 💾 Auto-Save | Form data persisted in localStorage |
| 📚 Invoice History | Last 5 invoices saved and re-loadable |
| 📋 Copy Summary | One-click plain-text invoice summary |
| 🌙 Dark/Light Mode | Theme preference persisted across sessions |
| 📊 Stats Cards | Live subtotal, GST, total, item count |
| 📱 Responsive | Fully mobile-responsive with tab switcher |
| ♿ Accessible | ARIA labels, keyboard navigation, focus rings |
| 🔔 Toast Notifications | Success/error/info feedback throughout |

---

## 📸 Screenshots

> *Screenshots section — add screenshots here after deployment*

| Screen | Description |
|--------|-------------|
| `screenshots/hero.png` | Hero section with CTA |
| `screenshots/form.png` | Invoice form |
| `screenshots/preview.png` | Live preview |
| `screenshots/pdf.png` | Generated PDF |
| `screenshots/dark.png` | Dark mode |
| `screenshots/mobile.png` | Mobile view |

---

## 🛠 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | [Next.js](https://nextjs.org) | 15+ |
| Language | [TypeScript](https://typescriptlang.org) | 5+ |
| Styling | [Tailwind CSS](https://tailwindcss.com) | v4 |
| Icons | [Lucide React](https://lucide.dev) | Latest |
| Forms | [React Hook Form](https://react-hook-form.com) | Latest |
| Validation | [Zod](https://zod.dev) | Latest |
| PDF | [jsPDF](https://github.com/parallax/jsPDF) | Latest |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) | Google Fonts |

> **All technologies are free and open source.** No paid APIs, no premium subscriptions.

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ItsRitwik/invoforge.git
cd invoforge

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

That's it. No environment variables. No API keys. No database setup.

---

## ☁️ Deployment on Vercel

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ItsRitwik/invoforge)

### Option 2: Manual Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "feat: initial InvoForge release"
   git branch -M main
   git remote add origin https://github.com/ItsRitwik/invoforge.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click **"New Project"**
   - Select the `invoforge` repository
   - Click **"Deploy"** — no environment variables needed
   - Your app will be live at `https://invoforge.vercel.app` (or your custom domain)

3. **Verify Deployment**
   - ✅ Invoice form loads correctly
   - ✅ Real-time preview updates
   - ✅ PDF download works
   - ✅ Dark/light mode toggles
   - ✅ Data persists on page refresh

---

## 📁 Project Structure

```
invoforge/
├── app/
│   ├── layout.tsx           # Root layout with SEO metadata
│   ├── page.tsx             # Main application page
│   └── globals.css          # Complete design system
├── components/
│   ├── dashboard/
│   │   ├── StatsCard.tsx    # Statistics display cards
│   │   └── SavedInvoices.tsx # Invoice history panel
│   ├── invoice/
│   │   ├── InvoiceForm.tsx  # Full invoice creation form
│   │   ├── InvoiceItems.tsx # Dynamic line items table
│   │   ├── InvoicePreview.tsx # Real-time preview
│   │   └── StatusBadge.tsx  # Draft/Pending/Paid badges
│   ├── layout/
│   │   ├── Navbar.tsx       # Sticky navigation
│   │   └── Footer.tsx       # Footer with developer info
│   └── shared/
│       ├── CopyButton.tsx   # Clipboard copy button
│       ├── EmptyState.tsx   # Empty state component
│       ├── LogoUpload.tsx   # Drag-and-drop logo upload
│       ├── ThemeToggle.tsx  # Dark/Light theme switcher
│       └── ToastContainer.tsx # Notification system
├── hooks/
│   ├── useInvoice.ts        # Core invoice state management
│   ├── useLocalStorage.ts   # Type-safe localStorage hook
│   ├── useSavedInvoices.ts  # Invoice history CRUD
│   └── useToast.ts          # Toast notification system
├── lib/
│   ├── calculations.ts      # GST math & currency formatting
│   ├── constants.ts         # App configuration & defaults
│   ├── invoice-utils.ts     # Utilities & text generation
│   ├── pdf-generator.ts     # jsPDF invoice generation
│   └── utils.ts             # cn() class merger
├── types/
│   └── invoice.ts           # All TypeScript interfaces
└── public/
    └── og-image.png         # Open Graph image
```

---

## 🔮 Future Enhancements

- [ ] Multiple currency support (USD, EUR, GBP)
- [ ] Invoice templates (modern, minimal, classic)
- [ ] Email invoice directly from browser (EmailJS)
- [ ] QR code for payment (UPI deep link)
- [ ] Recurring invoice templates
- [ ] Client address book
- [ ] Invoice analytics dashboard (Recharts)
- [ ] Export to Excel/CSV
- [ ] PWA support (offline usage)
- [ ] Supabase backend for cloud storage

---

## 👨‍💻 Developer

**Ritwik Das**

- 📧 Email: [ritwikdas100@gmail.com](mailto:ritwikdas100@gmail.com)
- 🐙 GitHub: [ItsRitwik](https://github.com/ItsRitwik)
- 🌐 Portfolio: [ritwik.online](https://www.ritwik.online)

---

## 🦸 Built for Digital Heroes

This project was created as part of the **Digital Heroes Custom Software Developer Trial**.

[![Built for Digital Heroes](https://img.shields.io/badge/Built%20for-Digital%20Heroes-6366f1?style=for-the-badge)](https://digitalheroesco.com)

---

## 📄 License

MIT License — free to use, modify, and distribute.

```
Copyright (c) 2025 Ritwik Das
```
