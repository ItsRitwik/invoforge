"use client";

// ============================================================
// InvoForge — Footer Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { Zap, Globe, ExternalLink, Heart } from "lucide-react";

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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(8,11,20,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        marginTop: "auto",
      }}
    >
      {/* Main Footer */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 1.5rem",
        }}
      >
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={14} fill="white" color="white" />
              </div>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #f0f4ff, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                InvoForge
              </span>
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                lineHeight: "1.6",
                maxWidth: "220px",
              }}
            >
              Professional GST-compliant invoice generator for freelancers and small businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "0.75rem",
              }}
            >
              Product
            </p>
            <div className="flex flex-col gap-2">
              <FooterLink href="#invoice-section">Create Invoice</FooterLink>
              <FooterLink href="#preview-section">Live Preview</FooterLink>
              <FooterLink href="#saved-section">Invoice History</FooterLink>
            </div>
          </div>

          {/* Developer */}
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "0.75rem",
              }}
            >
              Developer
            </p>
            <div className="flex flex-col gap-2">
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--text-muted)" }}>Name: </span>
                <strong style={{ color: "var(--text-primary)" }}>Ritwik Das</strong>
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--text-muted)" }}>Email: </span>
                <a
                  href="mailto:ritwikdas100@gmail.com"
                  style={{ color: "var(--indigo-400)", textDecoration: "none" }}
                  className="hover:underline"
                >
                  ritwikdas100@gmail.com
                </a>
              </p>
              <div className="flex gap-3 mt-1">
                <a
                  href="https://github.com/ItsRitwik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 btn btn-ghost btn-sm"
                  style={{ padding: "0.25rem 0", fontSize: "0.75rem", color: "var(--text-secondary)" }}
                  aria-label="Ritwik Das on GitHub"
                >
                  <GitHubIcon size={13} />
                  GitHub
                </a>
                <a
                  href="https://www.ritwik.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 btn btn-ghost btn-sm"
                  style={{ padding: "0.25rem 0", fontSize: "0.75rem", color: "var(--text-secondary)" }}
                  aria-label="Ritwik Das Portfolio"
                >
                  <Globe size={13} />
                  Portfolio
                </a>
              </div>
            </div>
          </div>

          {/* Digital Heroes */}
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "0.75rem",
              }}
            >
              Built For
            </p>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              id="digital-heroes-footer-btn"
              className="inline-flex items-center gap-2 btn btn-primary btn-sm"
              style={{ width: "auto" }}
              aria-label="Built for Digital Heroes - Visit Digital Heroes Co website"
            >
              <Zap size={13} />
              Built for Digital Heroes
              <ExternalLink size={11} style={{ opacity: 0.7 }} />
            </a>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: "0.75rem",
                lineHeight: "1.5",
              }}
            >
              Created as part of the Digital Heroes Custom Software Developer Trial.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          © {year} InvoForge. Built with{" "}
          <Heart
            size={11}
            style={{
              display: "inline",
              color: "#ef4444",
              verticalAlign: "middle",
            }}
            fill="#ef4444"
          />{" "}
          by{" "}
          <a
            href="https://www.ritwik.online"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--indigo-400)", textDecoration: "none", fontWeight: "600" }}
          >
            Ritwik Das
          </a>
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Developer:{" "}
          <strong style={{ color: "var(--text-secondary)" }}>Ritwik Das</strong>{" "}
          · Email:{" "}
          <a
            href="mailto:ritwikdas100@gmail.com"
            style={{ color: "var(--indigo-400)", textDecoration: "none" }}
          >
            ritwikdas100@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        fontSize: "0.8125rem",
        color: "var(--text-secondary)",
        textDecoration: "none",
        transition: "color 0.15s ease",
      }}
      className="hover:text-indigo-400"
    >
      {children}
    </a>
  );
}
