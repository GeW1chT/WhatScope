'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import AnalysisResults from '@/components/AnalysisResults';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SiteFooter from '@/components/ui/SiteFooter';
import Image from 'next/image';

const ResultsPage = () => {
  const router = useRouter();
  const { analysis } = useAnalysisContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have analysis results
    if (analysis) {
      setIsLoading(false);
    } else {
      // Try to load from localStorage
      try {
        const savedAnalysis = localStorage.getItem('whatsscope-analysis');
        if (savedAnalysis) {
          setIsLoading(false);
        } else {
          // No analysis data, redirect to home
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading analysis from localStorage:', error);
        router.push('/');
      }
    }
  }, [analysis, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen overflow-hidden relative">
        {/* Ultra Modern Loading Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/80 to-indigo-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#8b5cf6_0%,_transparent_50%)] opacity-20 animate-pulse"></div>
          
          {/* Loading Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Spinning Ring */}
              <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Center Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400/50 to-cyan-400/50 rounded-full animate-bounce"></div>
              </div>
              
              {/* Loading Text */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <p className="text-white/80 text-xl font-medium animate-pulse">
                  Analiz Yükleniyor...
                </p>
              </div>
            </div>
          </div>
          
          {/* Floating Particles */}
          <div className="particles absolute inset-0">
            <div className="particle absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{top: '20%', left: '15%', animationDelay: '0s'}}></div>
            <div className="particle absolute w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{top: '80%', left: '85%', animationDelay: '2s'}}></div>
            <div className="particle absolute w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{top: '60%', left: '10%', animationDelay: '4s'}}></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Revolutionary Results Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/90 to-purple-900">
        {/* Animated Mesh Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_#3b82f6_0%,_transparent_25%),_radial-gradient(circle_at_75%_75%,_#8b5cf6_0%,_transparent_25%)] opacity-10 animate-pulse"></div>
        
        {/* Success Celebration Particles */}
        <div className="particles absolute inset-0">
          <div className="particle absolute w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{top: '10%', left: '20%', animationDelay: '0s'}}></div>
          <div className="particle absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{top: '30%', left: '80%', animationDelay: '1s'}}></div>
          <div className="particle absolute w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{top: '70%', left: '15%', animationDelay: '2s'}}></div>
          <div className="particle absolute w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{top: '80%', left: '90%', animationDelay: '3s'}}></div>
        </div>

        {/* Floating Success Rings */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 border-2 border-green-400/20 rounded-full animate-spin"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 border-2 border-purple-400/20 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Floating Theme Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Ultra Modern Header */}
          <header className="text-center mb-12">
            {/* Success Badge */}
            <div className="inline-flex items-center backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-full px-6 py-3 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-green-300 font-medium">Analiz Tamamlandı</span>
            </div>

            <div className="relative mb-8">
              <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text mb-4">
                WhatsScope Sonuçları
              </h1>
              
              {/* Animated Underline */}
              <div className="flex justify-center">
                <div className="w-40 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-lg"></div>
            </div>
            
            {/* Analysis Summary Card */}
            <div className="backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-6 text-white">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-cyan-400/30">
                    <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8V8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text">
                      {analysis?.participants.join(' ♡ ') || 'Katılımcılar'}
                    </div>
                    <div className="text-white/70">Analiz Edildi</div>
                  </div>
                </div>
                
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden sm:block"></div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-purple-400/30">
                    <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text">
                      {analysis?.totalMessages?.toLocaleString('tr-TR') || '0'}
                    </div>
                    <div className="text-white/70">Toplam Mesaj</div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Modern Back Button */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => router.push('/')}
              className="group relative backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center text-white group-hover:text-cyan-300 transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-lg">Ana Sayfaya Dön</span>
              </div>
            </button>
          </div>
          
          {/* Analysis Results Component */}
          {analysis && (
            <div className="backdrop-blur-md bg-gradient-to-b from-white/5 to-white/2 border border-white/10 rounded-3xl p-1 shadow-2xl">
              <AnalysisResults analysis={analysis} />
            </div>
          )}
          
          <div className="mt-16">
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;