'use client';

import { useState } from 'react';
import { ChatAnalysis, RelationshipAnalysis as RelAnalysis } from '@/types/chat';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RelationshipAnalysisProps {
  analysis: ChatAnalysis & { relationshipAnalysis?: RelAnalysis };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#8884D8'];

const RelationshipAnalysis = ({ analysis }: RelationshipAnalysisProps) => {
  const [activeTab, setActiveTab] = useState('relationship');
  
  // Check if relationship analysis exists
  if (!analysis.relationshipAnalysis) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          İlişki analizi mevcut değil.
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bu sohbet için ilişki analizi yapılamadı.
        </p>
      </div>
    );
  }
  
  const { relationshipAnalysis } = analysis;
  const participants = analysis.participants;
  
  // Transform data for charts
  const romanticScoreData = participants.map(participant => ({
    name: participant,
    score: relationshipAnalysis.romanticAnalysis.romanticWordCounts[participant] || 0,
    hearts: relationshipAnalysis.romanticAnalysis.heartEmojisCount[participant] || 0,
  }));
  
  const humorScoreData = participants.map(participant => ({
    name: participant,
    funny: relationshipAnalysis.humorAnalysis.funnyWordCounts[participant] || 0,
    laughs: relationshipAnalysis.humorAnalysis.laughEmojiCounts[participant] || 0,
  }));
  
  const sleepPatternData = participants.map(participant => ({
    name: participant,
    nightOwl: relationshipAnalysis.timingAnalysis.nightOwlScore[participant] || 0,
    earlyBird: relationshipAnalysis.timingAnalysis.earlyBirdScore[participant] || 0,
  }));
  
  const talkativeData = participants.map(participant => ({
    name: participant,
    messageLength: Math.round(relationshipAnalysis.talkativenessAnalysis.averageMessageLength[participant] || 0),
  }));
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Eğlenceli İlişki Analizi 
          <span className="inline-block ml-2 bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            Yeni!
          </span>
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Bu analiz, sohbetinizden çıkarılan eğlenceli ve komik istatistikleri gösterir. Ciddi olmayan ve tamamen eğlence amaçlı üretilmiştir.
        </p>
        
        <Tabs defaultValue="relationship" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="relationship">İlişki Tarzınız</TabsTrigger>
            <TabsTrigger value="funny-stats">Komik İstatistikler</TabsTrigger>
            <TabsTrigger value="compatibility">Uyum Skorları</TabsTrigger>
            <TabsTrigger value="fun-titles">Eğlenceli Unvanlar</TabsTrigger>
            <TabsTrigger value="fun-conclusions">Sonuçlar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="relationship" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Who is more romantic? */}
              <Card>
                <CardHeader>
                  <CardTitle>Kim Daha Romantik? ❤️</CardTitle>
                  <CardDescription>
                    Kalp emojisi ve romantik kelime kullanımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      En Romantik Kişi: {relationshipAnalysis.romanticAnalysis.mostRomanticPerson}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {relationshipAnalysis.romanticAnalysis.romanticScore} romantik ifade ve emoji kullanımı
                    </p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={romanticScoreData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <RechartsTooltip />
                        <Bar dataKey="score" name="Romantik Kelimeler" fill="#FF6B8B" />
                        <Bar dataKey="hearts" name="Kalp Emojileri" fill="#FF1493" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Who is funnier? */}
              <Card>
                <CardHeader>
                  <CardTitle>Kim Daha Komik? 😂</CardTitle>
                  <CardDescription>
                    Gülme emojisi, "haha", "lol" kullanımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      En Komik Kişi: {relationshipAnalysis.humorAnalysis.funniestPerson}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {relationshipAnalysis.humorAnalysis.humorScore} komik ifade ve emoji kullanımı
                    </p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={humorScoreData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <RechartsTooltip />
                        <Bar dataKey="funny" name="Komik İfadeler" fill="#4CAF50" />
                        <Bar dataKey="laughs" name="Gülme Emojileri" fill="#8BC34A" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* İlave tab içerikleri */}
          <TabsContent value="funny-stats" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>En Çok Kullanılan Bahane</CardTitle>
                  <CardDescription>"Trafikte", "toplantıda", "uyuyordum"</CardDescription>
                </CardHeader>
                <CardContent>
                  {participants.map(participant => (
                    <div key={participant} className="mb-4">
                      <h4 className="font-semibold">{participant}</h4>
                      <p>Favori Bahane: {relationshipAnalysis.funnyStats.favoriteExcuse[participant]}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Yemek Obsesyonu 🍕</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold">Yemek Aşığı: {relationshipAnalysis.funnyStats.foodLover}</h4>
                  <p>Yemekle ilgili {relationshipAnalysis.funnyStats.foodObsession[relationshipAnalysis.funnyStats.foodLover]} mesaj</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Diğer tab'lar... */}
        </Tabs>
      </div>
    </div>
  );
};

export default RelationshipAnalysis;