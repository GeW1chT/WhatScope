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

  useEffect(() => {
    // Check if we have analysis data
    if (!analysis) {
      // No analysis data, redirect back to home
      console.log('No analysis data found, redirecting to home...');
      router.push('/');
      return;
    }
    
    console.log('Analysis data found, displaying results...');
    
    // Set initial progress if not starting from beginning
    setProgress(75);
    
    // Simulate the completion of the analysis
    const timer = setTimeout(() => {
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
    return null; // This will be brief before redirect happens
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Sohbetiniz Analiz Ediliyor
              </h1>
            </div>
            
            <div className="relative pt-1 mb-8">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100 dark:bg-indigo-900">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {isLoading ? progress < 100 ? 'Mesajlar işleniyor...' : `Sonuçlar hazırlanıyor... ${countdown}` : 'Analiz tamamlandı!'}
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-col items-center animate-pulse">
                <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {isLoading ? 
                    progress < 20 ? 'Mesajlar ayrıştırılıyor... Bu büyük dosyalar için biraz zaman alabilir.' : 
                    progress < 40 ? 'Temel analiz yapılıyor... Mesaj istatistikleri hesaplanıyor.' :
                    progress < 60 ? 'Emoji analizi yapılıyor... En çok kullanılan emojiler belirleniyor.' :
                    progress < 80 ? 'Zaman analizi yapılıyor... Konuşma desenleri inceleniyor.' :
                    progress < 100 ? 'Duygusal analiz yapılıyor... Mesaj içerikleriniz analiz ediliyor.' :
                    `Sonuçlar hazırlanıyor... ${countdown}` 
                    : 'Analiz tamamlandı!'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Mesaj</p>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Katılımcılar</p>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Zaman Aralığı</p>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Emoji</p>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SiteFooter />
      </div>
    </div>
  );
};

export default AnalyzePage;