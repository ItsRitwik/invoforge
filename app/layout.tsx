// ============================================================
// InvoForge — Root Layout
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invoforge-kappa.vercel.app"),
  title: "InvoForge | Professional GST Invoice Generator",
  description:
    "Generate GST-compliant invoices, calculate taxes automatically and export professional PDF invoices instantly. Free tool for freelancers, agencies, and small businesses.",
  keywords: [
    "GST invoice generator",
    "invoice generator India",
    "GST calculator",
    "free invoice maker",
    "professional invoice",
    "PDF invoice",
    "InvoForge",
    "Ritwik Das",
    "tags",
  ],
  authors: [{ name: "Ritwik Das", url: "https://www.ritwik.online" }],
  creator: "Ritwik Das",
  publisher: "Ritwik Das",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://invoforge-kappa.vercel.app",
    siteName: "InvoForge",
    title: "InvoForge | Professional GST Invoice Generator",
    description:
      "Generate GST-compliant invoices, calculate taxes automatically and export professional PDF invoices instantly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InvoForge — Professional GST Invoice Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoForge | Professional GST Invoice Generator",
    description:
      "Generate GST-compliant invoices, calculate taxes automatically and export professional PDF invoices instantly.",
    images: ["/og-image.png"],
    creator: "@ItsRitwik",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('invoforge_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var dark = stored ? stored === 'dark' : true;
                  if (!dark) document.documentElement.classList.add('light');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg-base)",
          color: "var(--text-primary)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
