"use client";

import Image from "next/image";
import FileUpload from "@/components/FileUpload";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SiteFooter from "@/components/ui/SiteFooter";
import Link from "next/link";
import { useState, useEffect } from "react";

// Fake statistics that increase over time
const useIncreasingStats = () => {
  const [stats, setStats] = useState({
    chatsAnalyzed: 127429,
    couplesMatched: 45847,
    funnyMessages: 3294847
  });

  useEffect(() => {
    const intervals = [
      setInterval(() => {
        setStats(prev => ({
          ...prev,
          chatsAnalyzed: prev.chatsAnalyzed + Math.floor(Math.random() * 3)
        }));
      }, 3000),
      setInterval(() => {
        setStats(prev => ({
          ...prev,
          couplesMatched: prev.couplesMatched + Math.floor(Math.random() * 2)
        }));
      }, 4000),
      setInterval(() => {
        setStats(prev => ({
          ...prev,
          funnyMessages: prev.funnyMessages + Math.floor(Math.random() * 5)
        }));
      }, 2000)
    ];

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  return stats;
};

export default function Home() {
  const stats = useIncreasingStats();

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Revolutionary Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/80 to-indigo-900">
        {/* Floating Mesh Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_#8b5cf6_0%,_transparent_25%),_radial-gradient(circle_at_75%_75%,_#3b82f6_0%,_transparent_25%)] opacity-20 animate-pulse"></div>
        
        {/* Animated Particles */}
        <div className="particles absolute inset-0">
          <div className="particle absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{top: '10%', left: '10%', animationDelay: '0s'}}></div>
          <div className="particle absolute w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{top: '20%', left: '80%', animationDelay: '2s'}}></div>
          <div className="particle absolute w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{top: '70%', left: '20%', animationDelay: '4s'}}></div>
          <div className="particle absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{top: '60%', left: '90%', animationDelay: '6s'}}></div>
        </div>

        {/* Aurora Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16 max-w-6xl">
        {/* Ultra Modern Header */}
        <header className="text-center mb-8 sm:mb-20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="relative">
                <h1 className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  WhatsScope
                </h1>
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-lg"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/privacy-policy" 
                className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                Gizlilik Politikası
              </Link>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Hero Message with Glass Effect */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl">
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              <span className="text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text font-semibold">
                Türkiye'nin En Gelişmiş WhatsApp Analiz Platformu
              </span>
              <br />
              Sohbetlerinizi derinlemesine analiz eden, viral paylaşım özellikli platform.
            </p>
          </div>
        </header>
        
        {/* Next-Gen Live Stats with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1">
            {/* Animated Icon */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-spin"></div>
            
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text mb-2 animate-pulse">
              {stats.chatsAnalyzed.toLocaleString('tr-TR')}
            </div>
            <div className="text-white/80 text-lg font-medium">
              sohbet analiz edildi
            </div>
            
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1">
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-bounce"></div>
            
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text mb-2 animate-pulse">
              {stats.couplesMatched.toLocaleString('tr-TR')}
            </div>
            <div className="text-white/80 text-lg font-medium">
              çift uyumu keşfedildi
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1">
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text mb-2 animate-pulse">
              {stats.funnyMessages.toLocaleString('tr-TR')}
            </div>
            <div className="text-white/80 text-lg font-medium">
              komik mesaj bulundu
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Revolutionary Feature Cards */}
          <div className="space-y-6">
            <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl mr-4 backdrop-blur-sm border border-cyan-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Işık Hızında Analiz</h2>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed">
                WhatsApp dosyanızı yükleyin, AI destekli sistemimiz 3 saniyede 50.000+ mesajı analiz etsin. Tüm veriler güvenli şekilde tarayıcınızda işlenir.
              </p>
            </div>
            
            <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl mr-4 backdrop-blur-sm border border-purple-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Viral İstatistikler</h2>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed">
                15+ kategori analiz, eğlenceli karşılaştırmalar, sosyal medya için hazır kartlar. Arkadaşlarınızı challenge edin!
              </p>
            </div>
            
            <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-2xl mr-4 backdrop-blur-sm border border-emerald-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">AI Duygusal Analiz</h2>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Yapay zeka ile duygu analizi, ilişki uyum skoru, kişilik profili. Sohbetinizin gizli yönlerini keşfedin.
              </p>
            </div>
          </div>
          
          {/* Ultra Modern Upload Section */}
          <div className="relative">
            <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-10 rounded-3xl shadow-2xl">
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full animate-pulse"></div>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text mb-2">
                  Sohbetinizi Yükleyin
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <FileUpload />
              
              {/* Modern Tutorial Section */}
              <div className="mt-10 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse"></div>
                  Nasıl WhatsApp Export Alınır?
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-white/80">
                  <li>WhatsApp'ta sohbeti açın</li>
                  <li>⋮ menüsü → "Sohbeti Dışa Aktar"</li>
                  <li>"Medya olmadan" seçin</li>
                  <li>.txt dosyasını buraya sürükleyin</li>
                </ol>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/sample-chat.txt" 
                    download="ornek-whatsapp-sohbet.txt"
                    className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all duration-300 hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Örnek Dosya İndir
                  </a>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-400/20 rounded-xl">
                  <p className="text-sm text-emerald-200">
                    <span className="font-semibold text-emerald-300">💡 Pro Tip:</span> İlk kez mi kullanıyorsun? Örnek dosyayı indir ve tüm özellikleri keşfet!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SiteFooter />
      </div>
    </div>
  );
}