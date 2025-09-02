import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WhatsScope - WhatsApp Sohbet Analizi",
  description: "WhatsApp sohbetlerinizi derinlemesine analiz eden, eğlenceli ve paylaşılabilir istatistikler sunan platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
