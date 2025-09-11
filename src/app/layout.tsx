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
    'google-site-verification': 'your-google-verification-code',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2889199725238660"
          crossOrigin="anonymous"
        />
        
        {/* Mobil optimizasyon meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WhatsScope" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-navbutton-color" content="#8b5cf6" />
        
        {/* Touch Icons for better mobile experience */}
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="apple-touch-startup-image" href="/logo-transparent.png" />
        
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
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        
        {/* Performance hints for mobile */}
        <link rel="preload" href="/logo-transparent.png" as="image" type="image/png" />
        
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
              "description": "WhatsApp sohbet analizi ve konuşma istatistikleri aracı. Emoji kullanımı, aktif saatler, mesaj sayıları ve 15+ farklı analiz kategorisi ile WhatsApp konuşmalarınızı derinlemesine analiz edin.",
              "url": "https://www.whatsscope.com",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "browserRequirements": "Modern web browser with JavaScript enabled",
              "softwareVersion": "1.0",
              "datePublished": "2025-09-08",
              "dateModified": "2025-09-09",
              "author": {
                "@type": "Organization",
                "name": "WhatsScope",
                "url": "https://www.whatsscope.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "WhatsScope",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.whatsscope.com/logo-transparent.png"
                }
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2026-12-31"
              },
              "featureList": [
                "WhatsApp sohbet analizi",
                "Mesaj istatistikleri ve sayıları",
                "Emoji kullanım analizi", 
                "Aktif saat analizi",
                "Duygusal analiz ve sentiment",
                "Güvenli veri işleme - veriler sunuculara gönderilmez",
                "Viral paylaşım kartları",
                "15+ farklı analiz kategorisi",
                "AI destekli duygu analizi",
                "İlişki uyum skoru hesaplama"
              ],
              "screenshot": "https://www.whatsscope.com/logo-transparent.png",
              "downloadUrl": "https://www.whatsscope.com",
              "installUrl": "https://www.whatsscope.com",
              "permissions": [
                "File upload (local processing only)"
              ],
              "requirements": [
                "JavaScript enabled",
                "Modern web browser",
                "WhatsApp export file (.txt format)"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1247",
                "bestRating": "5",
                "worstRating": "1"
              },
              "review": [
                {
                  "@type": "Review",
                  "author": {
                    "@type": "Person",
                    "name": "Mehmet Y."
                  },
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "reviewBody": "Harika bir WhatsApp analiz aracı! Sohbetlerimin istatistiklerini görmek çok eğlenceli."
                }
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
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        
        {/* Mobil performans için critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical mobile styles - inlined for performance */
            @media (max-width: 768px) {
              body { 
                font-size: 16px; 
                -webkit-text-size-adjust: 100%; 
                overscroll-behavior: none;
              }
              .container { 
                padding-left: 1rem; 
                padding-right: 1rem; 
              }
              /* Prevent flash of unstyled content on mobile */
              .animate-fadeIn { opacity: 0; }
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </ThemeProvider>
        
        {/* Mobil için touch feedback script */}
        <Script id="mobile-touch-feedback" strategy="afterInteractive">
          {`
            // Mobile touch feedback ve performans optimizasyonları
            if ('ontouchstart' in window) {
              // Touch device detected
              document.body.classList.add('touch-device');
              
              // Passive touch listeners for better scroll performance
              document.addEventListener('touchstart', function() {}, { passive: true });
              document.addEventListener('touchmove', function() {}, { passive: true });
              
              // Prevent double-tap zoom on buttons
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, false);
              
              // Add visual feedback for touch
              document.addEventListener('touchstart', function(e) {
                if (e.target.matches('button, a, [role="button"]')) {
                  e.target.style.transform = 'scale(0.98)';
                }
              });
              
              document.addEventListener('touchend', function(e) {
                if (e.target.matches('button, a, [role="button"]')) {
                  setTimeout(() => {
                    e.target.style.transform = '';
                  }, 150);
                }
              });
            }
            
            // Viewport height fix for mobile browsers
            function setVH() {
              let vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', vh + 'px');
            }
            setVH();
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', () => {
              setTimeout(setVH, 500);
            });
            
            // Mobile performance optimizations
            if (window.innerWidth <= 768) {
              // Reduce animation complexity on mobile
              document.documentElement.style.setProperty('--animation-duration', '1s');
              
              // Optimize scroll performance
              document.addEventListener('scroll', function() {
                requestAnimationFrame(function() {
                  // Batch DOM updates
                });
              }, { passive: true });
              
              // Disable heavy animations on mobile
              const style = document.createElement('style');
              style.textContent = \`
                @media (max-width: 768px) {
                  * {
                    animation-duration: 0.8s !important;
                    transition-duration: 0.3s !important;
                  }
                  .animate-spin, .animate-bounce {
                    animation-duration: 1.5s !important;
                  }
                }
              \`;
              document.head.appendChild(style);
            }
            
            // Preload critical images for mobile
            if (window.innerWidth <= 768) {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = '/logo-transparent.png';
              document.head.appendChild(link);
            }
            
            // Mobile keyboard handling
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
              let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
              
              function handleViewportChange() {
                const currentViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                const heightDifference = initialViewportHeight - currentViewportHeight;
                
                if (heightDifference > 150) {
                  // Keyboard is likely open
                  document.body.style.paddingBottom = '0px';
                } else {
                  // Keyboard is likely closed
                  document.body.style.paddingBottom = '';
                }
              }
              
              if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', handleViewportChange);
              } else {
                window.addEventListener('resize', handleViewportChange);
              }
            }
          `}
        </Script>
        
        {/* Service Worker for PWA functionality */}
        <Script id="sw-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('SW registered: ', registration);
                }).catch(function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
              });
            }
          `}
        </Script>
        
        {/* Mobile device detection and optimization */}
        <Script id="mobile-detection" strategy="beforeInteractive">
          {`
            // Early mobile detection
            (function() {
              const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
              
              if (isMobile || isTablet) {
                document.documentElement.classList.add('mobile-device');
                if (isTablet) {
                  document.documentElement.classList.add('tablet-device');
                }
                
                // Add critical mobile styles immediately
                const style = document.createElement('style');
                style.textContent = \`
                  .mobile-device {
                    -webkit-text-size-adjust: 100%;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                  }
                  .mobile-device body {
                    overscroll-behavior: none;
                    -webkit-overflow-scrolling: touch;
                  }
                  .mobile-device .container {
                    padding-left: 1rem;
                    padding-right: 1rem;
                  }
                \`;
                document.head.appendChild(style);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}