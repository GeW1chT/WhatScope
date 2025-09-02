'use client';

import { useState, useRef } from 'react';
import { ChatAnalysis } from '@/types/chat';
import BasicStats from '@/components/Reports/BasicStats';
import EmojiAnalysis from '@/components/Reports/EmojiAnalysis';
import SentimentAnalysis from '@/components/Reports/SentimentAnalysis';
import MessageChart from '@/components/Charts/MessageChart';
import TimelineChart from '@/components/Charts/TimelineChart';
import ShareResults from '@/components/ShareComponents/ShareResults';
import CommunicationDynamics from '@/components/Reports/CommunicationDynamics';
import PremiumFeatures from '@/components/Reports/PremiumFeatures';

interface AnalysisResultsProps {
  analysis: ChatAnalysis;
}

const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'emojis' | 'time' | 'sentiment' | 'communication' | 'premium'>('overview');
  const resultsRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 sticky top-4 z-10">
        <div className="flex flex-wrap md:flex-nowrap justify-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm md:text-base rounded-lg mx-1 transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Genel Bakış
          </button>
          
          <button
            onClick={() => setActiveTab('time')}
            className={`px-4 py-2 text-sm md:text-base rounded-lg mx-1 transition-colors ${
              activeTab === 'time'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Zaman Analizi
          </button>
          
          <button
            onClick={() => setActiveTab('emojis')}
            className={`px-4 py-2 text-sm md:text-base rounded-lg mx-1 transition-colors ${
              activeTab === 'emojis'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Emoji Analizi
          </button>
          
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`px-4 py-2 text-sm md:text-base rounded-lg mx-1 transition-colors ${
              activeTab === 'sentiment'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Duygusal Analiz
          </button>
          
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-4 py-2 text-sm md:text-base rounded-lg mx-1 transition-colors ${
              activeTab === 'communication'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            İletişim Dinamikleri
          </button>
          
          <button
            onClick={() => setActiveTab('premium')}
            className={`px-4 py-2 text-sm md:text-base rounded-lg mx-1 transition-colors ${
              activeTab === 'premium'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Premium Özellikler
          </button>
        </div>
      </div>
      
      <div id="results-content">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <BasicStats analysis={analysis} />
            <MessageChart messageStats={analysis.messageStats} />
          </div>
        )}
        
        {activeTab === 'time' && (
          <div className="space-y-6">
            <TimelineChart analysis={analysis} />
          </div>
        )}
        
        {activeTab === 'emojis' && (
          <EmojiAnalysis analysis={analysis} />
        )}
        
        {activeTab === 'sentiment' && (
          <SentimentAnalysis analysis={analysis} />
        )}
        
        {activeTab === 'communication' && (
          <CommunicationDynamics analysis={analysis} />
        )}
        
        {activeTab === 'premium' && (
          <PremiumFeatures analysis={analysis} />
        )}
      </div>
      
      <ShareResults analysis={analysis} activeTab={activeTab} resultsContentRef={resultsRef} />
      
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-12">
        <p>
          Bu analiz, yüklenen WhatsApp sohbet dosyasına dayanmaktadır. Tüm veriler yerel olarak işlenir ve hiçbir veri sunuculara gönderilmez.
        </p>
        <p className="mt-2">
          WhatsScope &copy; 2025 - Tüm Hakları Saklıdır
        </p>
      </div>
    </div>
  );
};

export default AnalysisResults;