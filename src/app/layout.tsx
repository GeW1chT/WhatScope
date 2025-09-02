import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import { ThemeProvider } from "next-themes";
import Script from 'next/script';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const GA_TRACKING_ID = 'G-OW5EYS7GYM';

export const metadata: Metadata = {
  title: "WhatsScope - WhatsApp Sohbet Analizi | Mesaj İstatistikleri",
  description: "WhatsApp sohbetlerinizi ücretsiz analiz edin. Mesaj sayıları, emoji kullanımı, aktif saatler ve duygusal analiz. Türkiye'nin ilk WhatsApp analiz platformu.",
  keywords: [
    'whatsapp analiz',
    'sohbet istatistikleri', 
    'mesaj analizi',
    'emoji analizi',
    'whatsapp chat analyzer',
    'sohbet analiz',
    'mesaj sayısı hesaplama'
  ],
  openGraph: {
    title: 'WhatsScope - WhatsApp Sohbet Analizi',
    description: 'WhatsApp sohbetlerinizi analiz edin. Mesaj istatistikleri, emoji analizi ve daha fazlası.',
    url: 'https://www.whatsscope.com',
    siteName: 'WhatsScope',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/logo-transparent.png',
        width: 400,
        height: 400,
        alt: 'WhatsScope Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsScope - WhatsApp Sohbet Analizi',
    description: 'WhatsApp sohbetlerinizi analiz edin.',
    images: ['/logo-transparent.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo-transparent.png',
    apple: '/logo-transparent.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}