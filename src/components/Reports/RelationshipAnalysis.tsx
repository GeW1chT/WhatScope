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
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface RelationshipAnalysisProps {
  analysis: ChatAnalysis & { relationshipAnalysis?: RelAnalysis };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#8884D8'];

// Function to determine personality type based on analysis data
const determinePersonalityType = (analysis: ChatAnalysis, participant: string) => {
  // Get participant's message stats
  const participantStats = analysis.messageStats.find(stat => stat.sender === participant);
  const avgMessageLength = participantStats?.averageLength || 0;
  
  // Get emoji usage for participant
  const emojiCount = analysis.emojiStats.emojiCountsByUser[participant] 
    ? Object.values(analysis.emojiStats.emojiCountsByUser[participant]).reduce((sum, count) => sum + count, 0)
    : 0;
  
  // Get time stats for participant
  const messagesByHour = analysis.timeStats.byHour || {};
  let nightMessages = 0;
  let morningMessages = 0;
  
  for (const [hour, count] of Object.entries(messagesByHour)) {
    const hourNum = parseInt(hour);
    if (hourNum >= 22 || hourNum <= 5) {
      nightMessages += count;
    }
    if (hourNum >= 6 && hourNum <= 10) {
      morningMessages += count;
    }
  }
  
  // Determine personality type based on criteria
  if (emojiCount > 50) {
    return "Emoji Kraliçesi";
  }
  
  if (avgMessageLength > 200) {
    return "Roman Yazarı";
  }
  
  // For "Hızlı Atış", we'll check if they send many short messages
  // This is a simplified check - in a real implementation, we'd need more data
  if (avgMessageLength < 50 && participantStats && participantStats.count > 50) {
    return "Hızlı Atış";
  }
  
  if (nightMessages > morningMessages) {
    return "Gece Kuşu";
  }
  
  if (morningMessages > nightMessages) {
    return "Sabah İnsanı";
  }
  
  // Default personality type
  return "Dengeli İletişimci";
};

// Function to generate komik insights based on analysis data
const generateKomikInsights = (analysis: ChatAnalysis, relationshipAnalysis: RelAnalysis) => {
  const insights = [];
  
  // Fast responder insight
  const fastestResponder = relationshipAnalysis.funnyTitles.patienceTestTitle;
  if (fastestResponder) {
    insights.push(`3 dakikada cevap veriyorsunuz - Flash'tan hızlısınız!`);
  }
  
  // Night owl insight
  const nightBomber = relationshipAnalysis.funnyTitles.nightBomberTitle;
  if (nightBomber) {
    insights.push(`Gece 2'de mesaj atma konusunda olimpiyat şampiyonu olabilirsiniz`);
  }
  
  // Emoji usage insight
  const emojiArtist = relationshipAnalysis.funnyTitles.emojiArtistTitle;
  if (emojiArtist) {
    insights.push(`Bu kadar emoji kullanımıyla kendi dilinizi yaratmışsınız`);
  }
  
  // Longest message insight
  const shakespeare = relationshipAnalysis.funnyTitles.shakespeareTitle;
  if (shakespeare) {
    const avgLength = relationshipAnalysis.talkativenessAnalysis.averageMessageLength[shakespeare];
    if (avgLength > 200) {
      insights.push(`Mesajlarınızda Nobel Edebiyat Ödülü adayı olabilecek uzunlukta metinler var`);
    }
  }
  
  // Food obsession insight
  const foodLover = relationshipAnalysis.funnyStats.foodLover;
  const foodCount = relationshipAnalysis.funnyStats.foodObsession[foodLover];
  if (foodCount > 20) {
    insights.push(`Yemek konusunda ciddi bir obsesifsiniz - Gordon Ramsay bile kıskanabilir`);
  }
  
  return insights;
};

// Function to generate seasonal/trending content
const generateSeasonalContent = (analysis: ChatAnalysis) => {
  const content = [];
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Find romantic words usage
  let asikmCount = 0;
  analysis.messages.forEach(message => {
    if (message.content.toLowerCase().includes('aşkım')) {
      asikmCount++;
    }
  });
  
  // Find New Year's Eve messages
  let newYearEveCount = 0;
  analysis.messages.forEach(message => {
    const date = new Date(message.timestamp);
    if (date.getMonth() === 11 && date.getDate() === 31) {
      newYearEveCount++;
    }
  });
  
  // Most used words in current year
  const wordFrequency: Record<string, number> = {};
  analysis.messages.forEach(message => {
    const date = new Date(message.timestamp);
    if (date.getFullYear() === currentYear) {
      const words = message.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) { // Only count words longer than 3 characters
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
      });
    }
  });
  
  // Get top 5 words
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return {
    mostUsedWords: sortedWords,
    asikmCount,
    newYearEveCount
  };
};

// Function to generate fake leaderboard data
const generateFakeLeaderboard = (analysis: ChatAnalysis, relationshipAnalysis: RelAnalysis) => {
  // Generate fake romantic couples leaderboard
  const fakeRomanticCouples = [
    { name: "İstanbul'dan anonim çift", score: 94, city: "İstanbul" },
    { name: "Ankara'dan sevgili ikilisi", score: 87, city: "Ankara" },
    { name: "İzmir'den romantik ikili", score: 82, city: "İzmir" },
    { name: "Bursa'dan aşık ikili", score: 78, city: "Bursa" },
    { name: "Antalya'dan tutkulu çift", score: 75, city: "Antalya" }
  ];
  
  // Generate fake funny people leaderboard
  const fakeFunnyPeople = [
    { name: "Ankara'dan anonim kullanıcı", score: 89, city: "Ankara" },
    { name: "İstanbul'dan espri ustası", score: 85, city: "İstanbul" },
    { name: "İzmir'den komik arkadaş", score: 81, city: "İzmir" },
    { name: "Adana'dan fıkra anlatan", score: 77, city: "Adana" },
    { name: "Trabzon'dan espri kralı", score: 73, city: "Trabzon" }
  ];
  
  // Find user's position in the romantic leaderboard
  let userRomanticScore = 0;
  if (relationshipAnalysis.compatibilityScores) {
    userRomanticScore = Math.round(relationshipAnalysis.compatibilityScores.overallCompatibility);
  }
  
  // Find user's position in the funny leaderboard
  let userFunnyScore = 0;
  if (relationshipAnalysis.humorAnalysis) {
    userFunnyScore = Math.round(relationshipAnalysis.humorAnalysis.humorScore / 10); // Normalize to 0-100
  }
  
  // Add user to the leaderboard if they have a high enough score
  if (userRomanticScore > 70) {
    fakeRomanticCouples.push({
      name: `${analysis.participants.join(' & ')} (Siz)`,
      score: userRomanticScore,
      city: "Sizin Şehriniz"
    });
    
    // Sort by score
    fakeRomanticCouples.sort((a, b) => b.score - a.score);
  }
  
  if (userFunnyScore > 70) {
    fakeFunnyPeople.push({
      name: `${analysis.participants[0]} (Siz)`,
      score: userFunnyScore,
      city: "Sizin Şehriniz"
    });
    
    // Sort by score
    fakeFunnyPeople.sort((a, b) => b.score - a.score);
  }
  
  return {
    romanticCouples: fakeRomanticCouples,
    funnyPeople: fakeFunnyPeople
  };
};

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
  
  // Determine personality types for each participant
  const personalityTypes = participants.map(participant => ({
    name: participant,
    type: determinePersonalityType(analysis, participant)
  }));
  
  // Generate komik insights
  const komikInsights = generateKomikInsights(analysis, relationshipAnalysis);
  
  // Generate seasonal content
  const seasonalContent = generateSeasonalContent(analysis);
  
  // Generate fake leaderboard
  const leaderboardData = generateFakeLeaderboard(analysis, relationshipAnalysis);
  
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
          <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-6">
            <TabsTrigger value="personality">Sohbet Kişiliğiniz</TabsTrigger>
            <TabsTrigger value="seasonal">Trend İçerikler</TabsTrigger>
            <TabsTrigger value="relationship">İlişki Tarzınız</TabsTrigger>
            <TabsTrigger value="funny-stats">Komik İstatistikler</TabsTrigger>
            <TabsTrigger value="compatibility">Uyum Skorları</TabsTrigger>
            <TabsTrigger value="fun-titles">Eğlenceli Unvanlar</TabsTrigger>
            <TabsTrigger value="leaderboard">Fake Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personality" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sohbet Kişilik Türünüz 🎭</CardTitle>
                  <CardDescription>
                    Sizin için belirlediğimiz WhatsApp kişilik türü
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {personalityTypes.map((person, index) => (
                      <div key={person.name} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-lg">{person.name}</h3>
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {person.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Kişilik Türleri</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li><span className="font-medium">Emoji Kraliçesi:</span> Çok emoji kullanan kullanıcı</li>
                      <li><span className="font-medium">Roman Yazarı:</span> Uzun mesajlar gönderen kullanıcı</li>
                      <li><span className="font-medium">Hızlı Atış:</span> Kısa ama sık mesaj gönderen kullanıcı</li>
                      <li><span className="font-medium">Gece Kuşu:</span> Geç saatlerde aktif olan kullanıcı</li>
                      <li><span className="font-medium">Sabah İnsanı:</span> Erken saatlerde mesaj gönderen kullanıcı</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Kişilik Detayları</CardTitle>
                  <CardDescription>
                    Her bir kullanıcı için analiz detayları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {participants.map(participant => {
                      const personalityType = personalityTypes.find(p => p.name === participant)?.type || "Bilinmiyor";
                      const participantStats = analysis.messageStats.find(stat => stat.sender === participant);
                      const avgMessageLength = participantStats?.averageLength || 0;
                      
                      const emojiCount = analysis.emojiStats.emojiCountsByUser[participant] 
                        ? Object.values(analysis.emojiStats.emojiCountsByUser[participant]).reduce((sum, count) => sum + count, 0)
                        : 0;
                      
                      return (
                        <div key={participant} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <h4 className="font-semibold">{participant}</h4>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>Mesaj Sayısı: {participantStats?.count || 0}</p>
                            <p>Ort. Mesaj Uzunluğu: {Math.round(avgMessageLength)} karakter</p>
                            <p>Emoji Sayısı: {emojiCount}</p>
                            <p className="mt-1 font-medium text-indigo-600 dark:text-indigo-400">
                              Kişilik Türü: {personalityType}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="seasonal" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>2024 Trend İçerikleri 📈</CardTitle>
                  <CardDescription>
                    Bu yılın en çok kullanılan kelimeleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">En Çok Kullanılan Kelimeler (2024)</h4>
                      <ul className="space-y-2">
                        {seasonalContent.mostUsedWords.map(([word, count], index) => (
                          <li key={word} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="font-medium">#{index + 1} {word}</span>
                            <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-sm">
                              {count} kez
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Romantik İstatistikler</h4>
                      <p className="text-lg">
                        Bu yıl <span className="font-bold text-pink-600">{seasonalContent.asikmCount}</span> kez "aşkım" demişsiniz
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Yılbaşı Gecesi</h4>
                      <p>
                        Yılbaşı gecesi <span className="font-bold">{seasonalContent.newYearEveCount}</span> mesaj göndermişsiniz
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Nostalji & Insight'lar 😄</CardTitle>
                  <CardDescription>
                    Sohbetinizin dönüm noktaları ve eğlenceli yorumlar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Zaman Yolculuğu
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          İlk mesajınız: {analysis.firstMessage ? format(new Date(analysis.firstMessage.timestamp), 'dd MMMM yyyy', { locale: tr }) : 'Bilinmiyor'}
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          En uzun suskunluk: {analysis.longestSilence ? `${Math.round(analysis.longestSilence.duration)} saat` : 'Bilinmiyor'}
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Toplam sohbet süresi: {analysis.dateRange ? `${Math.ceil((new Date(analysis.dateRange.end).getTime() - new Date(analysis.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} gün` : 'Bilinmiyor'}
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dönümler & Değişimler
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          En yoğun mesajlaşma günü: {analysis.timeStats.mostActiveDate ? format(new Date(analysis.timeStats.mostActiveDate), 'dd MMMM yyyy', { locale: tr }) : 'Bilinmiyor'}
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          En yoğun saat: {analysis.timeStats.mostActiveHour}:00 ({analysis.timeStats.byHour[analysis.timeStats.mostActiveHour] || 0} mesaj)
                        </li>
                      </ul>
                    </div>
                    
                    {komikInsights.length > 0 ? (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Komik Insight'lar
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {komikInsights.map((insight, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">
                          Analiz sonuçlarınıza özel komik insight bulunamadı. Daha fazla mesaj atmayı deneyin!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
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

              <Card>
                <CardHeader>
                  <CardTitle>Selfie Kralı/Kraliçesi 📸</CardTitle>
                  <CardDescription>Fotoğraf paylaşım istatistikleri</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold">{relationshipAnalysis.funnyStats.selfieTaker}</h4>
                  <p>Toplam {relationshipAnalysis.funnyStats.photoShareCount[relationshipAnalysis.funnyStats.selfieTaker]} fotoğraf paylaşımı</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emoji Kişiliği</CardTitle>
                  <CardDescription>En çok kullandığınız emojiler ne anlatıyor?</CardDescription>
                </CardHeader>
                <CardContent>
                  {participants.map(participant => (
                    <div key={participant} className="mb-4">
                      <h4 className="font-semibold">{participant}</h4>
                      <p>Emoji Kişiliği: {relationshipAnalysis.funnyStats.emojiPersonality[participant]}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geç Cevap Şampiyonu ⏰</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold">{relationshipAnalysis.funnyStats.slowResponder.person}</h4>
                  <p>Ortalama {Math.round(relationshipAnalysis.funnyStats.slowResponder.averageTime)} dakika içinde cevap veriyor</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="compatibility" className="mt-4">
            {participants.length === 2 ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    Çift Uyum Analizi
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bu bölüm, {participants[0]} ve {participants[1]} arasındaki WhatsApp iletişim uyumunu analiz eder.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                        Genel Uyum Skoru: {Math.round(relationshipAnalysis.compatibilityScores.overallCompatibility)}%
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {relationshipAnalysis.compatibilityScores.overallCompatibility > 80 ? 
                          'Mükemmel bir uyumunuz var! İletişim tarzınız harika şekilde uyuşuyor.' :
                          relationshipAnalysis.compatibilityScores.overallCompatibility > 60 ?
                          'İyi bir uyumunuz var. Birbirinizi tamamlıyorsunuz.' :
                          relationshipAnalysis.compatibilityScores.overallCompatibility > 40 ?
                          'Orta düzeyde bir uyumunuz var. Farklı iletişim tarzlarınız var.' :
                          'Farklı iletişim tarzlarınız var, bu da sohbetlerinizi ilginç kılıyor!'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Detaylı Uyum Skorları</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Komedi Uyumu</span>
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.comedyCompatibility)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.comedyCompatibility}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Zaman Uyumu</span>
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.timeCompatibility)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.timeCompatibility}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>İletişim Uyumu</span>
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.communicationCompatibility)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.communicationCompatibility}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Emoji Uyumu</span>
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.emojiCompatibility)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.emojiCompatibility}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Uyum analizi için iki kişilik bir sohbet gerekli
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Bu özellik yalnızca iki kişi arasındaki sohbetler için geçerlidir. Sohbetinizde {participants.length} kişi bulunuyor.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="fun-titles" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp’ın Shakespeare’i 📜</CardTitle>
                  <CardDescription>En uzun mesajları yazan kişi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                      {relationshipAnalysis.funnyTitles.shakespeareTitle}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Ortalama {Math.round(relationshipAnalysis.talkativenessAnalysis.averageMessageLength[relationshipAnalysis.funnyTitles.shakespeareTitle])} karakterlik mesajlar yazıyor. 
                      En uzun mesajı {relationshipAnalysis.talkativenessAnalysis.longestMessage.length} karakter uzunluğunda!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Emoji Sanatçısı 🎨</CardTitle>
                  <CardDescription>En çeşitli emoji kullanan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {relationshipAnalysis.funnyTitles.emojiArtistTitle}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Sohbette en yaratıcı emoji kullanımına sahip. Kendini ifade etmek için emoji dünyasını kullanıyor!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sabır Testi ⏰</CardTitle>
                  <CardDescription>En hızlı cevap veren</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                      {relationshipAnalysis.funnyTitles.patienceTestTitle}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Şimşek hızında cevap veriyor! Mesajlarınıza hemen yanıt alabilirsiniz.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gece Mesaj Bombardımanı 🌙</CardTitle>
                  <CardDescription>Gece 12'den sonra en aktif olan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {relationshipAnalysis.funnyTitles.nightBomberTitle}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Gece kuşu! Gece geç saatlerde aktif olup mesaj gönderiyor.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>_fake_ En Romantik Çiftler 🏆</CardTitle>
                  <CardDescription>
                    Bu ay WhatsApp'ta en romantik çiftler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboardData.romanticCouples.map((couple, index) => (
                      <div 
                        key={couple.name} 
                        className={`flex items-center p-3 rounded-lg ${
                          couple.name.includes('(Siz)') 
                            ? 'bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-500' 
                            : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium">{couple.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{couple.city}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded-full text-sm font-medium">
                            %{couple.score} uyum
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Nasıl Çalışır?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bu liste, kullanıcıların romantik uyum skorlarına göre oluşturulmuş eğlenceli bir sıralamadır. 
                      Sizin skorunuz analiz sonuçlarınıza göre belirlenir ve uygunsa listeye eklenir.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>_fake_ En Komik Kişiler 😂</CardTitle>
                  <CardDescription>
                    Bu ay WhatsApp'ta en komik kullanıcılar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboardData.funnyPeople.map((person, index) => (
                      <div 
                        key={person.name} 
                        className={`flex items-center p-3 rounded-lg ${
                          person.name.includes('(Siz)') 
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500' 
                            : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium">{person.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{person.city}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-sm font-medium">
                            %{person.score} komiklik
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Nasıl Çalışır?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bu liste, kullanıcıların komiklik skorlarına göre oluşturulmuş eğlenceli bir sıralamadır. 
                      Sizin skorunuz analiz sonuçlarınıza göre belirlenir ve uygunsa listeye eklenir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RelationshipAnalysis;