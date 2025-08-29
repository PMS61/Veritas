import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { MobileProvider } from "@/components/mobile-provider";
import { MobileNavigation } from "@/components/mobile-navigation";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Veritas - Eye that discerns the truth",
  description:
    "Professional information verification and misinformation detection platform",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",        // ✅ main favicon
    shortcut: "/logo.png",    // ✅ fallback for some browsers
    apple: "/logo.png",       // ✅ iOS home screen
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${manrope.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        {/* ✅ Manual fallback link to force favicon */}
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className="font-sans">
        <ThemeProvider defaultTheme="dark" storageKey="veritas-theme">
          <MobileProvider>
            <AuthProvider>
              {children}
              <MobileNavigation />
            </AuthProvider>
          </MobileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
