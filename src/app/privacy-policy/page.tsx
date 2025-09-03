'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Ultra Modern Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/90 to-purple-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_#3b82f6_0%,_transparent_25%),_radial-gradient(circle_at_70%_80%,_#8b5cf6_0%,_transparent_25%)] opacity-20 animate-pulse"></div>
        
        {/* Simple Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)'
          }}></div>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Floating Navigation */}
          <div className="fixed top-6 left-6 z-40">
            <Link 
              href="/"
              className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6 text-white group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>

          {/* Main Content Card */}
          <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="relative px-8 py-12 sm:p-16">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-full blur-2xl"></div>
              
              <div className="text-center relative">
                {/* Privacy Shield Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl mb-6 shadow-2xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-400 bg-clip-text mb-4">
                  Gizlilik Politikası
                </h1>
                
                <div className="flex items-center justify-center space-x-2 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                </div>
                
                <div className="w-40 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mt-4"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-8 pb-12 sm:px-16">
              {/* Trust Badge */}
              <div className="backdrop-blur-sm bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-6 mb-10">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-300 mb-1">%100 Gizlilik Garantisi</h3>
                    <p className="text-white/80">Verileriniz hiçbir zaman sunucularımıza gönderilmez. Tümü tarayıcınızda işlenir.</p>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-10">
                {/* Introduction */}
                <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
                  <p className="text-lg text-white/90 leading-relaxed">
                    Bu Gizlilik Politikası, web sitemizi ziyaret eden ve kullanan kişilerin gizliliğini korumak amacıyla hazırlanmıştır. 
                    WhatsScope, WhatsApp sohbet dosyalarınızı tamamen güvenli bir şekilde analiz eder. 
                    <span className="text-transparent bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text font-semibold"> 
                      Temel prensibimiz: Kullanıcı gizliliği her şeyin üzerindedir.
                    </span>
                  </p>
                </section>

                {/* Data Processing */}
                <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Veri Toplama ve İşleme</h2>
                  </div>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">
                    WhatsScope, kişisel verilerinizi toplamaz, saklamaz veya sunucularımıza göndermez. 
                    Yüklediğiniz WhatsApp sohbet dosyası tamamen tarayıcınızın içinde analiz edilir.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="backdrop-blur-sm bg-green-500/10 border border-green-400/20 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        Kesinlikle Korunur
                      </h3>
                      <p className="text-white/70">
                        Sohbet verileriniz hiçbir zaman bizim kontrolümüze geçmez ve sunucularımızda saklanmaz.
                      </p>
                    </div>
                    
                    <div className="backdrop-blur-sm bg-red-500/10 border border-red-400/20 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                        Anında Silinme
                      </h3>
                      <p className="text-white/70">
                        Analiz tamamlandıktan sonra dosya içeriği tarayıcı belleğinizden otomatik silinir.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Collected Information */}
                <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Toplanan Bilgiler</h2>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed">
                    Web sitemiz, hizmetin işleyişi için zorunlu olan anonim verileri toplayabilir. 
                    Bu veriler site trafiğini analiz etmek ve kullanıcı deneyimini iyileştirmek amacıyla kullanılır. 
                    <span className="text-yellow-300 font-medium">Doğrudan sizi tanımlayan kişisel bilgiler içermez.</span>
                  </p>
                </section>

                {/* Third Party Links */}
                <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Üçüncü Taraf Bağlantıları</h2>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed">
                    Sitemiz başka web sitelerine bağlantılar içerebilir. Bu sitelerin gizlilik politikalarından sorumlu değiliz. 
                    Başka bir siteye geçiş yaptığınızda, o sitenin gizlilik politikasını okumanızı öneririz.
                  </p>
                </section>

                {/* Updates */}
                <section className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Politika Güncellemeleri</h2>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed">
                    Bu Gizlilik Politikası ihtiyaç duyulması halinde güncellenebilir. 
                    Güncellemeler bu sayfada yayımlandığında geçerli olur.
                  </p>
                </section>
              </div>

              {/* Contact Section */}
              <div className="mt-12 backdrop-blur-sm bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 rounded-2xl p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">Sorularınız mı var?</h3>
                    <p className="text-white/80 mb-3">
                      Herhangi bir sorunuz veya endişeniz varsa bizimle iletişime geçin:
                    </p>
                    <Link 
                      href="mailto:ergunberat2005@gmail.com" 
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 font-medium"
                    >
                      ergunberat2005@gmail.com
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}