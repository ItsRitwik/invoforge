# Project: InvoForge — Portfolio Content

---

## Project Name
InvoForge — Professional GST Invoice Generator

---

## Short Description
A free, production-quality GST Invoice Generator built for Indian freelancers, agencies, and small businesses. Create professional PDF invoices with automatic tax calculations in seconds.

---

## Problem Solved
As a freelance developer and digital creator, I repeatedly struggled with finding a tool that was simultaneously fast, professional, free, and GST-compliant. Most tools are either paywalled, cluttered, or require account creation for what is fundamentally a simple task. InvoForge solves this by delivering a beautiful, fully client-side invoice generator that works instantly with zero setup.

---

## Key Features

- **Real-Time Invoice Preview** — Live preview updates as you fill in the form
- **GST Calculations** — Supports 0%, 5%, 12%, 18%, and 28% rates with auto-calculation
- **PDF Export** — Professional, print-ready PDF generated entirely in the browser using jsPDF
- **Company Logo Upload** — Drag-and-drop logo with base64 storage
- **Invoice Status Tracking** — Draft, Pending, Paid badge system
- **Invoice History** — Last 5 invoices saved to localStorage and re-loadable
- **Copy Invoice Summary** — One-click clipboard copy of plain-text invoice
- **Auto-Save** — Form data persisted across browser sessions
- **Dark/Light Mode** — Theme toggle with localStorage persistence
- **Mobile Responsive** — Tab-switching layout for small screens
- **Toast Notifications** — Contextual feedback for every user action
- **Accessibility** — Full ARIA labeling, keyboard navigation, focus management

---

## Technologies Used

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | App Router, SSR, metadata API |
| TypeScript | Type-safe interfaces throughout |
| Tailwind CSS v4 | Utility-first CSS with custom design tokens |
| jsPDF | Client-side PDF generation |
| React Hook Form | Form state management |
| Zod | Schema validation |
| Lucide React | Icon library |
| next-themes | Theme persistence |
| Inter (Google Fonts) | Premium typography |

---

## Challenges Solved

### 1. Tailwind v4 Migration
Next.js 15 defaults to Tailwind CSS v4, which uses a CSS-based configuration (`@theme` directive) instead of `tailwind.config.ts`. This required reimplementing all design tokens as CSS custom properties while maintaining full Tailwind utility compatibility.

### 2. Theme Flash Prevention
Dark/light mode switching with localStorage causes a "flash of wrong theme" on initial load. Solved by injecting a tiny inline script in `<head>` that reads localStorage before first paint and applies the correct class synchronously.

### 3. Client-Side PDF Generation
Generating a visually rich PDF entirely in the browser without a backend required using jsPDF's drawing API with manual layout calculations. The result is a dark-themed, professionally branded PDF with proper font sizing, alignment, and GST breakdown.

### 4. Hydration Safety
localStorage is not available during SSR. The `useLocalStorage` hook was built with a `isHydrated` flag to prevent React hydration mismatches by returning initial values server-side and only reading localStorage after mount.

### 5. Real-Time Performance
All calculations (subtotal, GST, grand total) are memoized with `useMemo` to prevent unnecessary recalculations on unrelated state changes. The invoice state is managed with granular update functions to minimize re-renders.

---

## Development Highlights

- **Zero External APIs** — Fully client-side, no backend, no database required
- **LocalStorage Architecture** — Custom type-safe hook with hydration protection
- **Component Architecture** — 15+ reusable components with clean separation of concerns
- **Design System** — Complete CSS variable-based design system with dark/light mode support
- **Accessibility First** — ARIA labels, roles, keyboard navigation on every interactive element
- **Production SEO** — Open Graph, Twitter Cards, structured metadata, semantic HTML

---

## Live Demo
🔗 https://invoforge.vercel.app

---

## GitHub Repository
🐙 https://github.com/ItsRitwik/invoforge

---

## Portfolio Summary

> InvoForge is a real-world GST invoice generator that demonstrates my ability to design and build production-quality SaaS tools from scratch. The project covers full-stack engineering thinking (even in a client-only context), UI/UX design, accessibility, performance optimization, and deployment readiness — all without a paid API or backend service.

**Tags:** Next.js · TypeScript · Tailwind CSS · jsPDF · GST · Invoice Generator · SaaS · Free Tool · India
