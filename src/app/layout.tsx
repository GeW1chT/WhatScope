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
  title: "WhatsApp Sohbet Analizi | Konuşma İstatistikleri | Mesaj Analizi | WhatsScope",
  description: "WhatsApp sohbet analizi, konuşma istatistikleri ve mesaj analizi. Emoji kullanımı, aktif saatler, mesaj sayıları. Güvenli ve ücretsiz WhatsApp analiz aracı. Türkiye'nin en gelişmiş WhatsApp sohbet analiz platformu.",
  keywords: [
    'whatsapp sohbet analizi',
    'whatsapp konuşma istatistikleri', 
    'whatsapp mesaj analizi',
    'whatsapp chat analizi',
    'whatsapp mesaj istatistikleri',
    'whatsapp analiz',
    'sohbet istatistikleri',
    'mesaj analizi',
    'emoji analizi',
    'whatsapp chat analyzer',
    'sohbet analiz',
    'mesaj sayısı hesaplama',
    'whatsapp verileri analiz',
    'konuşma analizi',
    'whatsapp export analiz'
  ],
  authors: [{ name: 'WhatsScope' }],
  creator: 'WhatsScope',
  publisher: 'WhatsScope',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.whatsscope.com',
  },
  openGraph: {
    title: 'WhatsApp Sohbet Analizi | Konuşma İstatistikleri | WhatsScope',
    description: 'WhatsApp sohbet analizi, konuşma istatistikleri ve mesaj analizi. Emoji kullanımı, aktif saatler, mesaj sayıları. Güvenli ve ücretsiz WhatsApp analiz aracı.',
    url: 'https://www.whatsscope.com',
    siteName: 'WhatsScope',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: 'https://www.whatsscope.com/logo-transparent.png',
        width: 1200,
        height: 630,
        alt: 'WhatsScope - WhatsApp Sohbet Analizi',
        type: 'image/png',
      },
      {
        url: 'https://www.whatsscope.com/logo-transparent.png',
        width: 400,
        height: 400,
        alt: 'WhatsScope Logo',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@whatsscope',
    creator: '@whatsscope',
    title: 'WhatsApp Sohbet Analizi | Konuşma İstatistikleri | WhatsScope',
    description: 'WhatsApp sohbet analizi, konuşma istatistikleri ve mesaj analizi. Güvenli ve ücretsiz.',
    images: [
      {
        url: 'https://www.whatsscope.com/logo-transparent.png',
        alt: 'WhatsScope - WhatsApp Sohbet Analizi',
      }
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/logo-transparent.png', sizes: '152x152' },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'technology',
  classification: 'WhatsApp Analysis Tool',
  other: {
    'google-site-verification': 'your-google-verification-code', // Google Search Console doğrulama kodu ekle
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
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* SEO Meta Tags */}
        <meta name="language" content="Turkish" />
        <meta name="geo.region" content="TR" />
        <meta name="geo.country" content="Turkey" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload Critical Resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WhatsScope",
              "url": "https://www.whatsscope.com",
              "logo": "https://www.whatsscope.com/logo-transparent.png",
              "description": "WhatsApp sohbet analizi ve konuşma istatistikleri platformu",
              "foundingDate": "2025",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Turkish"
              },
              "sameAs": [
                "https://twitter.com/whatsscope",
                "https://instagram.com/whatsscope"
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "WhatsScope",
              "url": "https://www.whatsscope.com",
              "description": "WhatsApp sohbet analizi, konuşma istatistikleri ve mesaj analizi aracı",
              "inLanguage": "tr-TR",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.whatsscope.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "WhatsScope",
              "description": "WhatsApp sohbet analizi ve konuşma istatistikleri aracı",
              "url": "https://www.whatsscope.com",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "browserRequirements": "Modern web browser with JavaScript enabled",
              "softwareVersion": "1.0",
              "datePublished": "2025-09-08",
              "author": {
                "@type": "Organization",
                "name": "WhatsScope"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "WhatsApp sohbet analizi",
                "Mesaj istatistikleri",
                "Emoji analizi", 
                "Aktif saat analizi",
                "Duygusal analiz",
                "Güvenli veri işleme"
              ]
            })
          }}
        />
        
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
        
        {/* Google Search Console Verification - Replace with your actual code */}
        <meta name="google-site-verification" content="your-google-verification-code" />
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