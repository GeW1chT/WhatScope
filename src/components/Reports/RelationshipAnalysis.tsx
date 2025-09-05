'use client';

import { useState } from 'react';
import { ChatAnalysis, RelationshipAnalysis as RelAnalysis } from '@/types/chat';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import RadarChart from '@/components/Charts/RadarChart';
import TreemapChart from '@/components/Charts/TreemapChart';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Eye, Type, HelpCircle } from 'lucide-react';

interface RelationshipAnalysisProps {
  analysis: ChatAnalysis & { relationshipAnalysis?: RelAnalysis };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#8884D8'];

// Function to determine personality type based on analysis data
const determinePersonalityType = (analysis: ChatAnalysis, participant: string) => {
  // Get participant's message stats
  const participantStats = analysis.messageStats.find(stat => stat.sender === participant);
  const avgMessageLength = participantStats?.averageLength || 0;
  const messageCount = participantStats?.count || 0;
  
  // Get emoji usage for participant
  const emojiCount = analysis.emojiStats.emojiCountsByUser[participant] 
    ? Object.values(analysis.emojiStats.emojiCountsByUser[participant]).reduce((sum, count) => sum + count, 0)
    : 0;
  
  // Get time stats for participant
  const messagesByHour = analysis.timeStats.byHour || {};
  let nightMessages = 0;
  let morningMessages = 0;
  let afternoonMessages = 0;
  let eveningMessages = 0;
  
  for (const [hour, count] of Object.entries(messagesByHour)) {
    const hourNum = parseInt(hour);
    if (hourNum >= 23 || hourNum <= 5) {
      nightMessages += count;
    } else if (hourNum >= 6 && hourNum <= 11) {
      morningMessages += count;
    } else if (hourNum >= 12 && hourNum <= 17) {
      afternoonMessages += count;
    } else if (hourNum >= 18 && hourNum <= 22) {
      eveningMessages += count;
    }
  }
  
  // Calculate ratios and special characteristics
  const emojiRatio = messageCount > 0 ? emojiCount / messageCount : 0;
  const totalMessages = nightMessages + morningMessages + afternoonMessages + eveningMessages;
  
  // Advanced personality detection with more variety
  
  // Ultra specific types first
  if (avgMessageLength > 500) {
    return "📚 Edebiyat Profesörü";
  }
  
  if (avgMessageLength < 10 && messageCount > 100) {
    return "⚡ Telegram Makinesi";
  }
  
  if (emojiRatio > 2) {
    return "🎨 Emoji Sanatçısı";
  }
  
  if (emojiRatio > 1) {
    return "😍 Emoji Aşığı";
  }
  
  if (nightMessages > totalMessages * 0.6) {
    return "🦉 Gece Vampiri";
  }
  
  if (morningMessages > totalMessages * 0.5) {
    return "🌅 Sabah Şarkıcısı";
  }
  
  if (avgMessageLength > 300) {
    return "📖 Roman Yazarı";
  }
  
  if (avgMessageLength > 150) {
    return "📝 Hikaye Anlatıcısı";
  }
  
  if (avgMessageLength < 30 && messageCount > 50) {
    return "💨 Hızlı Atış Uzmanı";
  }
  
  if (avgMessageLength < 20) {
    return "⚡ Kısa ve Öz";
  }
  
  if (afternoonMessages > totalMessages * 0.4) {
    return "☀️ Öğleden Sonra Aktifi";
  }
  
  if (eveningMessages > totalMessages * 0.4) {
    return "🌆 Akşam Sohbetçisi";
  }
  
  if (emojiCount > 100) {
    return "🎭 Emoji Koleksiyoncusu";
  }
  
  if (emojiCount > 50) {
    return "😊 Emoji Severr";
  }
  
  if (messageCount > 200) {
    return "💬 Sohbet Canavarı";
  }
  
  if (messageCount > 100) {
    return "🗣️ Konuşkan Tip";
  }
  
  if (avgMessageLength > 100) {
    return "📄 Detaycı Anlatıcı";
  }
  
  if (avgMessageLength > 50) {
    return "💭 Düşünceli Yazıcı";
  }
  
  // More creative types
  const randomTypes = [
    "🎯 Hedef Odaklı",
    "🌟 Pozitif Enerji",
    "🎪 Eğlence Merkezi",
    "🧠 Analitik Düşünür",
    "🎨 Yaratıcı Ruh",
    "🔥 Ateşli Sohbetçi",
    "🌊 Sakin Deniz",
    "⭐ Yıldız Oyuncu",
    "🎵 Ritim Tutucu",
    "🌈 Rengarenk Kişilik"
  ];
  
  // Use message count to determine which random type to assign
  const typeIndex = messageCount % randomTypes.length;
  return randomTypes[typeIndex] || "💫 Gizemli Karakter";
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        className="backdrop-blur-md bg-black/80 p-4 rounded-xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className="font-medium text-white">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-blue-300">
            {item.name}: {item.value}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

const RelationshipAnalysis = ({ analysis }: RelationshipAnalysisProps) => {
  const [activeTab, setActiveTab] = useState('relationship');
  
  // Check if relationship analysis exists
  if (!analysis.relationshipAnalysis) {
    return (
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white">
            İlişki Analizi Mevcut Değil
          </h3>
        </div>
        <p className="text-white/70">
          Bu sohbet için ilişki analizi yapılamadı.
        </p>
      </motion.div>
    );
  }
  
  const { relationshipAnalysis } = analysis;
  const participants = analysis.participants;
  
  // Determine personality types for each participant
  const personalityTypes = participants.map(participant => ({
    name: participant,
    type: determinePersonalityType(analysis, participant)
  }));
  
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
  
  return (
    <div className="space-y-8">
      {/* Main Header */}
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">💕</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">
              Eğlenceli İlişki Analizi
              <span className="inline-block ml-3 bg-pink-500/20 text-pink-300 text-xs font-medium px-3 py-1 rounded-full border border-pink-400/30">
                Yeni!
              </span>
            </h3>
            <p className="text-white/70 mt-1">
              Sohbetinizden çıkarılan eğlenceli ve komik istatistikler. Ciddi olmayan ve tamamen eğlence amaçlı üretilmiştir.
            </p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/20 pb-4">
          <button
            onClick={() => setActiveTab('personality')}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === 'personality'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Sohbet Kişiliğiniz
          </button>
          
          <button
            onClick={() => setActiveTab('seasonal')}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === 'seasonal'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Trend İçerikler
          </button>
          
          <button
            onClick={() => setActiveTab('relationship')}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === 'relationship'
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            İlişki Tarzınız
          </button>
          
          <button
            onClick={() => setActiveTab('funny-stats')}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === 'funny-stats'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Komik İstatistikler
          </button>
          
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === 'compatibility'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Uyum Skorları
          </button>
          
          <button
            onClick={() => setActiveTab('fun-titles')}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeTab === 'fun-titles'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Eğlenceli Unvanlar
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'relationship' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Who is more romantic? */}
            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">❤️</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Kim Daha Romantik?</h4>
                  <p className="text-white/60 text-sm">Kalp emojisi ve romantik kelime kullanımı</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h5 className="font-semibold text-pink-300 mb-2">
                  En Romantik Kişi: {relationshipAnalysis.romanticAnalysis.mostRomanticPerson || 'Bilinmiyor'}
                </h5>
                <p className="text-sm text-white/60">
                  {relationshipAnalysis.romanticAnalysis.romanticScore || 0} romantik ifade ve emoji kullanımı
                </p>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={romanticScoreData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" name="Romantik Kelimeler" fill="#FF6B8B" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="hearts" name="Kalp Emojileri" fill="#FF1493" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            {/* Who is funnier? */}
            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">😂</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Kim Daha Komik?</h4>
                  <p className="text-white/60 text-sm">Gülme emojisi, "haha", "lol" kullanımı</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h5 className="font-semibold text-yellow-300 mb-2">
                  En Komik Kişi: {relationshipAnalysis.humorAnalysis.funniestPerson || 'Bilinmiyor'}
                </h5>
                <p className="text-sm text-white/60">
                  {relationshipAnalysis.humorAnalysis.humorScore || 0} komik ifade ve emoji kullanımı
                </p>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={humorScoreData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="funny" name="Komik İfadeler" fill="#4CAF50" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="laughs" name="Gülme Emojileri" fill="#8BC34A" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'personality' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {personalityTypes.map((person, index) => (
              <motion.div 
                key={person.name}
                className="backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-3xl">{person.type.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{person.name}</h4>
                    <p className="text-lg text-purple-300 font-medium">{person.type}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    className="backdrop-blur-sm bg-blue-500/10 border border-blue-400/20 rounded-xl p-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <span className="text-blue-300 font-medium">Mesaj Sayısı</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {analysis.messageStats.find(stat => stat.sender === person.name)?.count || 0}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="backdrop-blur-sm bg-green-500/10 border border-green-400/20 rounded-xl p-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-2">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <span className="text-green-300 font-medium">Ort. Uzunluk</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(analysis.messageStats.find(stat => stat.sender === person.name)?.averageLength || 0)}
                    </p>
                    <p className="text-sm text-white/60">karakter</p>
                  </motion.div>
                  
                  <motion.div 
                    className="backdrop-blur-sm bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-2">
                        <span className="text-lg">😊</span>
                      </div>
                      <span className="text-yellow-300 font-medium">Emoji</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {analysis.emojiStats.emojiCountsByUser[person.name] 
                        ? Object.values(analysis.emojiStats.emojiCountsByUser[person.name]).reduce((sum, count) => sum + count, 0)
                        : 0}
                    </p>
                    <p className="text-sm text-white/60">adet</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'fun-titles' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Emoji Artist */}
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Emoji Sanatçısı</h4>
                  <p className="text-purple-300 text-sm">En çeşitli emoji kullanan</p>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="text-lg font-bold text-white mb-2">
                  {relationshipAnalysis.funnyTitles?.emojiArtistTitle || 'Bilinmiyor'}
                </h5>
                <p className="text-white/70">
                  Emoji ustası! Sohbette en yaratıcı emoji kullanımına sahip.
                </p>
              </div>
            </motion.div>
            
            {/* Shakespeare */}
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-400/20 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">📜</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">WhatsApp'ın Shakespeare'i</h4>
                  <p className="text-blue-300 text-sm">En uzun mesajları yazan</p>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="text-lg font-bold text-white mb-2">
                  {relationshipAnalysis.funnyTitles?.shakespeareTitle || 'Bilinmiyor'}
                </h5>
                <p className="text-white/70">
                  Edebiyat dehası! Uzun ve detaylı mesajlarıyla tanınıyor.
                </p>
              </div>
            </motion.div>
            
            {/* Night Bomber */}
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🌙</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Gece Mesaj Bombardımanı</h4>
                  <p className="text-cyan-300 text-sm">Gece 12'den sonra en aktif olan</p>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="text-lg font-bold text-white mb-2">
                  {relationshipAnalysis.funnyTitles?.nightBomberTitle || 'Bilinmiyor'}
                </h5>
                <p className="text-white/70">
                  Gece kuşu! Gece geç saatlerde aktif olup mesaj gönderiyor.
                </p>
              </div>
            </motion.div>
            
            {/* Fast Responder */}
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Sabır Testi</h4>
                  <p className="text-green-300 text-sm">En hızlı cevap veren</p>
                </div>
              </div>
              
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="text-lg font-bold text-white mb-2">
                  {relationshipAnalysis.funnyTitles?.patienceTestTitle || 'Bilinmiyor'}
                </h5>
                <p className="text-white/70">
                  Hız ustası! Mesajlarınıza hemen yanıt alabilirsiniz.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'compatibility' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {participants.length === 2 && relationshipAnalysis.compatibilityScores ? (
              <div className="space-y-8">
                <motion.div 
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-2xl">💕</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white">Çift Uyum Analizi</h4>
                  </div>
                  <p className="text-white/70 mb-8">
                    Bu bölüm, {participants[0]} ve {participants[1]} arasındaki WhatsApp iletişim uyumunu analiz eder.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div 
                      className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-400/20 rounded-2xl p-6"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h5 className="text-xl font-bold text-indigo-300 mb-4">
                        Genel Uyum Skoru: {Math.round(relationshipAnalysis.compatibilityScores.overallCompatibility || 0)}%
                      </h5>
                      <p className="text-white/70">
                        {relationshipAnalysis.compatibilityScores.overallCompatibility > 80 ? 
                          'Mükemmel bir uyumunuz var! İletişim tarzınız harika şekilde uyuşuyor.' :
                          relationshipAnalysis.compatibilityScores.overallCompatibility > 60 ?
                          'İyi bir uyumunuz var. Birbirinizi tamamlıyorsunuz.' :
                          relationshipAnalysis.compatibilityScores.overallCompatibility > 40 ?
                          'Orta düzeyde bir uyumunuz var. Farklı iletişim tarzlarınız var.' :
                          'Farklı iletişim tarzlarınız var, bu da sohbetlerinizi ilginç kılıyor!'}
                      </p>
                    </motion.div>
                    
                    <div className="space-y-6">
                      <h5 className="text-xl font-bold text-white">Detaylı Uyum Skorları</h5>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/90">Komedi Uyumu</span>
                          <span className="font-bold text-purple-300">{Math.round(relationshipAnalysis.compatibilityScores.comedyCompatibility || 0)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${relationshipAnalysis.compatibilityScores.comedyCompatibility || 0}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/90">Zaman Uyumu</span>
                          <span className="font-bold text-blue-300">{Math.round(relationshipAnalysis.compatibilityScores.timeCompatibility || 0)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${relationshipAnalysis.compatibilityScores.timeCompatibility || 0}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/90">İletişim Uyumu</span>
                          <span className="font-bold text-green-300">{Math.round(relationshipAnalysis.compatibilityScores.communicationCompatibility || 0)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${relationshipAnalysis.compatibilityScores.communicationCompatibility || 0}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/90">Emoji Uyumu</span>
                          <span className="font-bold text-pink-300">{Math.round(relationshipAnalysis.compatibilityScores.emojiCompatibility || 0)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-pink-500 to-red-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${relationshipAnalysis.compatibilityScores.emojiCompatibility || 0}%` }}
                            transition={{ duration: 1, delay: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">
                  Uyum analizi için iki kişilik bir sohbet gerekli
                </h4>
                <p className="text-white/70">
                  Bu özellik yalnızca iki kişi arasındaki sohbetler için geçerlidir. Sohbetinizde {participants.length} kişi bulunuyor.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'funny-stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">🍕</span>
                </div>
                <h4 className="text-xl font-bold text-white">Yemek Obsessionu</h4>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="font-bold text-yellow-300 mb-2">
                  Yemek Aşığı: {relationshipAnalysis.funnyStats.foodLover || 'Bilinmiyor'}
                </h5>
                <p className="text-white/70">
                  Yemekle ilgili {relationshipAnalysis.funnyStats.foodObsession?.[relationshipAnalysis.funnyStats.foodLover] || 0} mesaj
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">📸</span>
                </div>
                <h4 className="text-xl font-bold text-white">Selfie Kralı/Kraliçesi</h4>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="font-bold text-pink-300 mb-2">
                  {relationshipAnalysis.funnyStats.selfieTaker || 'Bilinmiyor'}
                </h5>
                <p className="text-white/70">
                  Toplam {relationshipAnalysis.funnyStats.photoShareCount?.[relationshipAnalysis.funnyStats.selfieTaker] || 0} fotoğraf paylaşımı
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">⏰</span>
                </div>
                <h4 className="text-xl font-bold text-white">Geç Cevap Şampiyonu</h4>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <h5 className="font-bold text-red-300 mb-2">
                  {relationshipAnalysis.funnyStats.slowResponder?.person || 'Bilinmiyor'}
                </h5>
                <p className="text-white/70">
                  Ortalama {relationshipAnalysis.funnyStats.slowResponder?.averageTime ? Math.round(relationshipAnalysis.funnyStats.slowResponder.averageTime) : 0} dakika içinde cevap veriyor
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">🎭</span>
                </div>
                <h4 className="text-xl font-bold text-white">Emoji Kişiliği</h4>
              </div>
              <div className="space-y-4">
                {participants.map(participant => (
                  <div key={participant} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                    <h5 className="font-bold text-cyan-300 mb-1">{participant}</h5>
                    <p className="text-white/70 text-sm">
                      Emoji Kişiliği: {relationshipAnalysis.funnyStats.emojiPersonality?.[participant] || 'Bilinmiyor'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'seasonal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">📈</span>
                </div>
                <h4 className="text-xl font-bold text-white">2024 Trend İçerikleri</h4>
              </div>
              
              <div className="space-y-4">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                  <h5 className="font-bold text-green-300 mb-3">En Çok Kullanılan Kelimeler (2024)</h5>
                  <div className="space-y-2">
                    {/* Örnek trending kelimeler */}
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <span className="font-medium text-white">#1 tamam</span>
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-sm">
                        45 kez
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <span className="font-medium text-white">#2 haha</span>
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-sm">
                        32 kez
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <span className="font-medium text-white">#3 naber</span>
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-sm">
                        28 kez
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="backdrop-blur-sm bg-gradient-to-r from-pink-500/10 to-red-600/10 border border-pink-400/20 rounded-xl p-4">
                  <h5 className="font-bold text-pink-300 mb-2">Romantik İstatistikler</h5>
                  <p className="text-white">
                    Bu yıl <span className="font-bold text-pink-400">24</span> kez "aşkım" demişsiniz
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-lg">📱</span>
                </div>
                <h4 className="text-xl font-bold text-white">Nostalji & Insight'lar</h4>
              </div>
              
              <div className="space-y-4">
                <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-400/20 rounded-xl p-4">
                  <h5 className="font-bold text-blue-300 mb-3">Zaman Yolculuğu</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-white/90">
                      <svg className="h-4 w-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      İlk mesajınız: {analysis.firstMessage ? format(new Date(analysis.firstMessage.timestamp), 'dd MMMM yyyy', { locale: tr }) : 'Bilinmiyor'}
                    </div>
                    <div className="flex items-center text-white/90">
                      <svg className="h-4 w-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Toplam sohbet süresi: {analysis.dateRange ? `${Math.ceil((new Date(analysis.dateRange.end).getTime() - new Date(analysis.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} gün` : 'Bilinmiyor'}
                    </div>
                  </div>
                </div>
                
                <div className="backdrop-blur-sm bg-gradient-to-r from-yellow-500/10 to-orange-600/10 border border-yellow-400/20 rounded-xl p-4">
                  <h5 className="font-bold text-yellow-300 mb-3">En Yoğun Anlar</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-white/90">
                      <svg className="h-4 w-4 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      En yoğun gün: {analysis.timeStats.mostActiveDate ? format(new Date(analysis.timeStats.mostActiveDate), 'dd MMMM yyyy', { locale: tr }) : 'Bilinmiyor'}
                    </div>
                    <div className="flex items-center text-white/90">
                      <svg className="h-4 w-4 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      En yoğun saat: {analysis.timeStats.mostActiveHour !== undefined ? `${analysis.timeStats.mostActiveHour}:00` : 'Bilinmiyor'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RelationshipAnalysis;