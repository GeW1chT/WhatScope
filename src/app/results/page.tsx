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
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Yükleniyor...
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              WhatsScope Analiz Sonuçları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {analysis?.participants.join(' ve ')} arasındaki {analysis?.totalMessages} mesaj analiz edildi.
          </p>
        </header>
        
        <div className="flex justify-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center px-4 py-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Ana Sayfaya Dön
          </button>
        </div>
        
        {analysis && <AnalysisResults analysis={analysis} />}
        
        <SiteFooter />
      </div>
    </div>
  );
};

export default ResultsPage;