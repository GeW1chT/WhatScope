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
import RelationshipAnalysis from '@/components/Reports/RelationshipAnalysis';
import EmotionalEvolution from '@/components/Reports/EmotionalEvolution';

interface AnalysisResultsProps {
  analysis: ChatAnalysis;
}

const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'emojis' | 'time' | 'sentiment' | 'emotionEvolution' | 'communication' | 'premium' | 'relationship'>('overview');
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const tabs = [
    { 
      id: 'overview', 
      label: 'Genel Bakış', 
      icon: '📊',
      gradient: 'from-cyan-400 to-blue-500'
    },
    { 
      id: 'time', 
      label: 'Zaman Analizi', 
      icon: '⏰',
      gradient: 'from-purple-400 to-pink-500'
    },
    { 
      id: 'emojis', 
      label: 'Emoji Analizi', 
      icon: '😊',
      gradient: 'from-yellow-400 to-orange-500'
    },
    { 
      id: 'sentiment', 
      label: 'Duygusal Analiz', 
      icon: '💭',
      gradient: 'from-green-400 to-emerald-500'
    },
    { 
      id: 'emotionEvolution', 
      label: 'Duygusal Evrim', 
      icon: '📈',
      gradient: 'from-pink-400 to-rose-500',
      isNew: true
    },
    { 
      id: 'communication', 
      label: 'İletişim Dinamikleri', 
      icon: '💬',
      gradient: 'from-indigo-400 to-purple-500'
    },
    { 
      id: 'relationship', 
      label: 'Eğlenceli İlişki Analizi', 
      icon: '💕',
      gradient: 'from-red-400 to-pink-500',
      isNew: true
    },
    { 
      id: 'premium', 
      label: 'Premium Özellikler', 
      icon: '✨',
      gradient: 'from-amber-400 to-yellow-500'
    }
  ];
  
  return (
    <div className="space-y-8 p-6">
      {/* Revolutionary Tab Navigation */}
      <div className="sticky top-4 z-20 mb-8">
        <div className="backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-3xl p-2 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group relative px-3 py-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'backdrop-blur-md bg-white/20 border border-white/30 shadow-lg'
                    : 'hover:bg-white/10 hover:backdrop-blur-sm'
                }`}
              >
                {/* Active Tab Glow Effect */}
                {activeTab === tab.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-20 rounded-2xl blur-sm`}></div>
                )}
                
                <div className="relative flex flex-col items-center space-y-2">
                  {/* Tab Icon with Animation */}
                  <div className={`text-2xl transition-transform duration-300 ${
                    activeTab === tab.id ? 'scale-110 animate-bounce' : 'group-hover:scale-105'
                  }`}>
                    {tab.icon}
                  </div>
                  
                  {/* Tab Label */}
                  <div className={`text-xs font-medium text-center leading-tight ${
                    activeTab === tab.id 
                      ? 'text-white' 
                      : 'text-white/70 group-hover:text-white'
                  }`}>
                    {tab.label}
                  </div>
                  
                  {/* New Badge */}
                  {tab.isNew && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
                        YENİ!
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content Area with Advanced Glassmorphism */}
      <div 
        id="results-content" 
        ref={resultsRef}
        className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Content Header with Active Tab Info */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${
              tabs.find(t => t.id === activeTab)?.gradient || 'from-cyan-400 to-blue-500'
            } p-0.5`}>
              <div className="w-full h-full rounded-2xl backdrop-blur-md bg-black/20 flex items-center justify-center text-2xl">
                {tabs.find(t => t.id === activeTab)?.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-white/70">
                {activeTab === 'overview' && 'Sohbetinizin genel istatistiklerini keşfedin'}
                {activeTab === 'time' && 'Zamansal aktivite desenlerinizi analiz edin'}
                {activeTab === 'emojis' && 'Emoji kullanım alışkanlıklarınızı görün'}
                {activeTab === 'sentiment' && 'Mesajlarınızın duygusal tonunu keşfedin'}
                {activeTab === 'emotionEvolution' && 'Duygusal değişiminizi zamanla takip edin'}
                {activeTab === 'communication' && 'İletişim stilinizi derinlemesine inceleyin'}
                {activeTab === 'relationship' && 'Eğlenceli ilişki dinamiklerinizi keşfedin'}
                {activeTab === 'premium' && 'Gelişmiş analiz özelliklerini keşfedin'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content with Smooth Transitions */}
        <div className="p-6">
          <div className="transition-all duration-500 ease-in-out">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <BasicStats analysis={analysis} />
                <MessageChart messageStats={analysis.messageStats} />
              </div>
            )}
            
            {activeTab === 'time' && (
              <div className="space-y-8 animate-fadeIn">
                <TimelineChart analysis={analysis} />
              </div>
            )}
            
            {activeTab === 'emojis' && (
              <div className="animate-fadeIn">
                <EmojiAnalysis analysis={analysis} />
              </div>
            )}
            
            {activeTab === 'sentiment' && (
              <div className="animate-fadeIn">
                <SentimentAnalysis analysis={analysis} />
              </div>
            )}
            
            {activeTab === 'emotionEvolution' && (
              <div className="animate-fadeIn">
                <EmotionalEvolution analysis={analysis} />
              </div>
            )}
            
            {activeTab === 'communication' && (
              <div className="animate-fadeIn">
                <CommunicationDynamics analysis={analysis} />
              </div>
            )}
            
            {activeTab === 'premium' && (
              <div className="animate-fadeIn">
                <PremiumFeatures analysis={analysis} />
              </div>
            )}
            
            {activeTab === 'relationship' && (
              <div className="animate-fadeIn">
                <RelationshipAnalysis analysis={analysis} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Ultra Modern Share Component */}
      <div className="backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        <ShareResults analysis={analysis} activeTab={activeTab} resultsContentRef={resultsRef} />
      </div>
      
      {/* Modern Footer */}
      <div className="text-center mt-16">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-white/60 text-sm leading-relaxed">
            Bu analiz, yüklenen WhatsApp sohbet dosyasına dayanmaktadır. Tüm veriler yerel olarak işlenir ve hiçbir veri sunuculara gönderilmez.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-white/80 font-medium">
              WhatsScope © 2025 - Türkiye'nin En Gelişmiş Analiz Platformu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;