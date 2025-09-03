'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SiteFooter from '@/components/ui/SiteFooter';
import Image from 'next/image';

const AnalyzePage = () => {
  const router = useRouter();
  const { analysis } = useAnalysisContext();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(75);
  const [countdown, setCountdown] = useState(3);
  const [currentStage, setCurrentStage] = useState(4);

  const analysisStages = [
    { icon: "🔍", title: "Mesajlar Ayrıştırılıyor", desc: "Sohbet dosyanız okunuyor...", color: "from-cyan-400 to-blue-500" },
    { icon: "📊", title: "Temel Analiz", desc: "İstatistikler hesaplanıyor...", color: "from-purple-400 to-pink-500" },
    { icon: "😊", title: "Emoji Analizi", desc: "Duygusal ifadeler kategorize ediliyor...", color: "from-yellow-400 to-orange-500" },
    { icon: "⏰", title: "Zaman Analizi", desc: "Konuşma desenleri belirleniyor...", color: "from-green-400 to-emerald-500" },
    { icon: "🧠", title: "AI Analizi", desc: "Duygusal ton değerlendiriliyor...", color: "from-indigo-400 to-purple-500" },
    { icon: "✨", title: "Sonuçlar Hazırlanıyor", desc: "Her şey tamamlanıyor...", color: "from-pink-400 to-rose-500" }
  ];

  const funFacts = [
    "Ortalama bir kişi günde 67 WhatsApp mesajı gönderiyor",
    "En çok kullanılan emoji dünyada 😂, Türkiye'de ise ❤️",
    "WhatsApp'ta en aktif saatler 20:00-23:00 arasında",
    "Çiftler günde ortalama 127 mesaj alışverişi yapıyor",
    "En uzun WhatsApp sohbeti 847 gün sürmüş",
    "WhatsApp'ta en çok kullanılan kelime 'tamam'"
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    // Cycle through fun facts
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 3000);

    return () => clearInterval(factInterval);
  }, []);

  useEffect(() => {
    // Check if we have analysis data
    if (!analysis) {
      console.log('No analysis data found, redirecting to home...');
      router.push('/');
      return;
    }
    
    console.log('Analysis data found, displaying results...');
    
    // Set initial progress and stage
    setProgress(75);
    setCurrentStage(4);
    
    // Simulate the completion of the analysis
    const timer = setTimeout(() => {
      setCurrentStage(5);
      setProgress(100);
      
      // Start countdown after reaching 100%
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsLoading(false);
            console.log('Countdown complete, redirecting to results...');
            router.push('/results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(countdownInterval);
      };
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [analysis, router]);

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Revolutionary Analysis Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/80 to-indigo-900">
        {/* Animated Neural Network Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_#8b5cf6_2px,_transparent_2px),_radial-gradient(circle_at_75%_75%,_#06b6d4_1px,_transparent_1px)] bg-[length:100px_100px] animate-pulse"></div>
        </div>

        {/* Processing Particles */}
        <div className="particles absolute inset-0">
          <div className="particle absolute w-3 h-3 bg-cyan-400 rounded-full animate-particle-float" style={{top: '15%', left: '20%', animationDelay: '0s'}}></div>
          <div className="particle absolute w-2 h-2 bg-purple-400 rounded-full animate-particle-float" style={{top: '80%', left: '80%', animationDelay: '2s'}}></div>
          <div className="particle absolute w-4 h-4 bg-pink-400 rounded-full animate-particle-float" style={{top: '50%', left: '10%', animationDelay: '4s'}}></div>
          <div className="particle absolute w-1 h-1 bg-yellow-400 rounded-full animate-particle-float" style={{top: '30%', left: '90%', animationDelay: '6s'}}></div>
        </div>

        {/* Data Flow Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
          <div className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-60 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Floating Theme Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-4xl min-h-screen flex items-center justify-center">
          {/* Ultra Modern Analysis Container */}
          <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-10 max-w-3xl w-full">
            {/* Header with Pulsing Icon */}
            <div className="text-center mb-12">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-4xl animate-pulse">
                  🧠
                </div>
                {/* Pulsing Rings */}
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30 animate-pulse-ring"></div>
                <div className="absolute inset-0 rounded-full border-4 border-purple-400/20 animate-pulse-ring" style={{animationDelay: '0.5s'}}></div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text mb-4">
                AI Analizi Devam Ediyor
              </h1>
              
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 mx-auto rounded-full animate-pulse"></div>
            </div>

            {/* Ultra Modern Progress Section */}
            <div className="mb-10">
              {/* Current Stage Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className={`relative p-6 rounded-2xl bg-gradient-to-r ${analysisStages[currentStage].color} bg-opacity-20 backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-2 text-center animate-bounce">
                    {analysisStages[currentStage].icon}
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    {analysisStages[currentStage].title}
                  </h3>
                  <p className="text-white/80 text-center">
                    {analysisStages[currentStage].desc}
                  </p>
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${analysisStages[currentStage].color} opacity-20 rounded-2xl blur-xl`}></div>
                </div>
              </div>

              {/* Advanced Progress Bar */}
              <div className="relative">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Progress Percentage */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white/70 font-medium">İlerleme</span>
                  <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Status Message */}
              <div className="text-center mt-8">
                <p className="text-lg text-white/90 font-medium">
                  {progress < 100 ? analysisStages[currentStage].desc : 
                   `Analiz Tamamlandı! Yönlendiriliyor... ${countdown}`}
                </p>
              </div>
            </div>

            {/* Stage Timeline */}
            <div className="mb-10">
              <div className="flex justify-between items-center">
                {analysisStages.map((stage, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                      index <= currentStage 
                        ? `bg-gradient-to-r ${stage.color} shadow-lg` 
                        : 'bg-white/10 border border-white/20'
                    }`}>
                      {index < currentStage ? '✓' : stage.icon}
                    </div>
                    {index < analysisStages.length - 1 && (
                      <div className={`w-12 h-1 mt-2 rounded-full transition-all duration-500 ${
                        index < currentStage ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-white/10'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Facts Section */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3 animate-pulse"></div>
                WhatsApp'ta Bildiğin Bu Gerçeği?
              </h3>
              <p className="text-white/80 text-center text-lg animate-fadeIn" key={currentFact}>
                {funFacts[currentFact]}
              </p>
            </div>

            {/* Preview Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-sm bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 rounded-2xl p-4 text-center">
                <p className="text-cyan-300 font-medium mb-2">Toplam Mesaj</p>
                <div className="h-8 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-white/60">Hesaplanıyor...</span>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-2xl p-4 text-center">
                <p className="text-purple-300 font-medium mb-2">Katılımcılar</p>
                <div className="h-8 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-white/60">Analiz ediliyor...</span>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-4 text-center">
                <p className="text-green-300 font-medium mb-2">Zaman Aralığı</p>
                <div className="h-8 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-white/60">Hesaplanıyor...</span>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border border-yellow-400/20 rounded-2xl p-4 text-center">
                <p className="text-yellow-300 font-medium mb-2">Emoji Sayısı</p>
                <div className="h-8 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-white/60">Kategorize ediliyor...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pb-16">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;