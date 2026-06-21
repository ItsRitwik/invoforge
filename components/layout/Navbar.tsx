"use client";

// ============================================================
// InvoForge — Navbar Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { Zap, Menu, X, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(8,11,20,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="InvoForge Home"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
              transition: "transform 0.2s ease",
            }}
            className="group-hover:scale-110"
          >
            <Zap size={16} fill="white" color="white" />
          </div>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #f0f4ff, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            InvoForge
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          className="hidden md:flex items-center gap-1"
          style={{ flex: 1, justifyContent: "center" }}
        >
          <NavLink href="#invoice-section">Create Invoice</NavLink>
          <NavLink href="#preview-section">Preview</NavLink>
          <NavLink href="#saved-section">History</NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Built for Digital Heroes */}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 btn btn-sm"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "var(--indigo-400)",
              fontSize: "0.75rem",
            }}
            id="digital-heroes-nav-btn"
            aria-label="Built for Digital Heroes - Visit Digital Heroes Co"
          >
            <Zap size={11} />
            Built for Digital Heroes
            <ExternalLink size={10} style={{ opacity: 0.6 }} />
          </a>

          <a
            href="https://github.com/ItsRitwik/invoforge"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-icon"
            aria-label="View source on GitHub"
            title="GitHub Repository"
          >
            <GitHubIcon size={16} />
          </a>

          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            className="md:hidden btn btn-ghost btn-icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "1rem 1.5rem",
            background: "rgba(8,11,20,0.95)",
          }}
        >
          <div className="flex flex-col gap-1">
            <MobileNavLink href="#invoice-section" onClick={() => setMobileOpen(false)}>
              Create Invoice
            </MobileNavLink>
            <MobileNavLink href="#preview-section" onClick={() => setMobileOpen(false)}>
              Preview
            </MobileNavLink>
            <MobileNavLink href="#saved-section" onClick={() => setMobileOpen(false)}>
              History
            </MobileNavLink>
            <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
              <a
                href="https://digitalheroesco.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm w-full"
                id="digital-heroes-mobile-btn"
                onClick={() => setMobileOpen(false)}
              >
                <Zap size={12} />
                Built for Digital Heroes
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="btn btn-ghost btn-sm"
      style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}
    >
      {children}
    </a>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="btn btn-ghost"
      style={{
        justifyContent: "flex-start",
        fontSize: "0.875rem",
        color: "var(--text-secondary)",
        width: "100%",
      }}
    >
      {children}
    </a>
  );
}
