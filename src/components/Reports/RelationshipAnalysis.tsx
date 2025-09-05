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

// Function to calculate personality score based on traits
const calculatePersonalityScore = (analysis: ChatAnalysis, participant: string, personalityType: string) => {
  const participantStats = analysis.messageStats.find(stat => stat.sender === participant);
  const messageCount = participantStats?.count || 0;
  const avgLength = participantStats?.averageLength || 0;
  const emojiCount = analysis.emojiStats.emojiCountsByUser[participant] 
    ? Object.values(analysis.emojiStats.emojiCountsByUser[participant]).reduce((sum, count) => sum + count, 0)
    : 0;
  
  // Calculate scores based on personality type characteristics
  let score = 50; // Base score
  
  if (personalityType.includes('Edebiyat') || personalityType.includes('Roman')) {
    score += Math.min(avgLength / 10, 30); // Bonus for long messages
  }
  if (personalityType.includes('Emoji')) {
    score += Math.min(emojiCount / 5, 25); // Bonus for emoji usage
  }
  if (personalityType.includes('Hızlı') || personalityType.includes('Telegram')) {
    score += Math.min(messageCount / 20, 20); // Bonus for message frequency
  }
  if (personalityType.includes('Gece')) {
    score += 15; // Night owl bonus
  }
  if (personalityType.includes('Sabah')) {
    score += 15; // Morning person bonus
  }
  
  return Math.min(Math.round(score), 100);
};

// Function to get personality statistics
const getPersonalityStats = (analysis: ChatAnalysis, participant: string, personalityType: string) => {
  const participantStats = analysis.messageStats.find(stat => stat.sender === participant);
  const messageCount = participantStats?.count || 0;
  const avgLength = participantStats?.averageLength || 0;
  const emojiCount = analysis.emojiStats.emojiCountsByUser[participant] 
    ? Object.values(analysis.emojiStats.emojiCountsByUser[participant]).reduce((sum, count) => sum + count, 0)
    : 0;
  
  const totalMessages = analysis.messageStats.reduce((sum, stat) => sum + stat.count, 0);
  const activityRate = totalMessages > 0 ? Math.round((messageCount / totalMessages) * 100) : 0;
  const emojiRate = messageCount > 0 ? Math.round((emojiCount / messageCount) * 100) / 100 : 0;
  
  return {
    score: calculatePersonalityScore(analysis, participant, personalityType),
    activityRate,
    emojiRate,
    avgLength: Math.round(avgLength),
    messageCount,
    emojiCount,
    specialStats: getSpecialStats(personalityType, {
      messageCount,
      avgLength,
      emojiCount,
      activityRate,
      emojiRate
    })
  };
};

// Function to get special statistics based on personality type
const getSpecialStats = (personalityType: string, stats: any) => {
  const specialStats = [];
  
  if (personalityType.includes('Edebiyat') || personalityType.includes('Roman')) {
    specialStats.push({
      label: 'Kelime Ustası Seviyesi',
      value: Math.min(Math.round(stats.avgLength / 20), 5),
      maxValue: 5,
      icon: '📚',
      description: 'Uzun mesaj yazma yeteneği'
    });
  }
  
  if (personalityType.includes('Emoji')) {
    specialStats.push({
      label: 'Emoji Sanatçısı Puanı',
      value: Math.min(Math.round(stats.emojiRate * 10), 10),
      maxValue: 10,
      icon: '🎨',
      description: 'Emoji kullanım yaratıcılığı'
    });
  }
  
  if (personalityType.includes('Hızlı') || personalityType.includes('Telegram')) {
    specialStats.push({
      label: 'Hız Rekoru',
      value: Math.min(Math.round(stats.messageCount / 50), 10),
      maxValue: 10,
      icon: '⚡',
      description: 'Mesaj gönderme hızı'
    });
  }
  
  if (personalityType.includes('Sohbet') || personalityType.includes('Konuşkan')) {
    specialStats.push({
      label: 'Sosyallik Endeksi',
      value: Math.min(Math.round(stats.activityRate / 10), 10),
      maxValue: 10,
      icon: '💬',
      description: 'Sohbet katılım oranı'
    });
  }
  
  // Add a creativity score for all personality types
  const creativityScore = Math.round((stats.emojiRate * 3 + stats.avgLength / 50 + stats.activityRate / 20) / 3);
  specialStats.push({
    label: 'Yaratıcılık Puanı',
    value: Math.min(creativityScore, 10),
    maxValue: 10,
    icon: '🌟',
    description: 'Genel yaratıcılık seviyesi'
  });
  
  return specialStats;
};

// Function to get personality description and traits
const getPersonalityDescription = (personalityType: string) => {
  const descriptions: Record<string, { description: string; traits: string[]; funFact: string }> = {
    "📚 Edebiyat Profesörü": {
      description: "Mesajlarınız adeta bir roman! Her cümle özenle kurulmuş, her kelime yerli yerinde.",
      traits: ["Detaylı anlatım ustası", "Kelime hazinesi zengin", "Düşünceli yaklaşım"],
      funFact: "Tek mesajınız bir blog yazısı olabilir!"
    },
    "⚡ Telegram Makinesi": {
      description: "Hız sizin işiniz! Kısa, net ve sürekli mesaj gönderiyorsunuz.",
      traits: ["Hızlı iletişim", "Pratik yaklaşım", "Sürekli aktif"],
      funFact: "Saniyede 3 mesaj atma rekorunuz var!"
    },
    "🎨 Emoji Sanatçısı": {
      description: "Emojiler sizin diliniz! Her duyguyu emoji ile mükemmel ifade ediyorsunuz.",
      traits: ["Yaratıcı ifade", "Görsel iletişim", "Duygusal zeka"],
      funFact: "Emoji kullanımında olimpiyat şampiyonu olabilirsiniz!"
    },
    "😍 Emoji Aşığı": {
      description: "Emojisiz mesaj göndermek sizin için imkansız! Her cümleyi emojilerle süslüyorsunuz.",
      traits: ["Renkli iletişim", "Pozitif enerji", "Eğlenceli yaklaşım"],
      funFact: "Mesajlarınız bir emoji festivali!"
    },
    "🦉 Gece Vampiri": {
      description: "Gece saatleri sizin zamanınız! En aktif olduğunuz saatler gece yarısından sonra.",
      traits: ["Gece aktifliği", "Sessiz saatlerde sohbet", "Farklı ritim"],
      funFact: "Gece 3'te mesaj atmakta dünya rekortmeni!"
    },
    "🌅 Sabah Şarkıcısı": {
      description: "Güne mesajlarınızla başlıyorsunuz! Sabah saatleri sizin için altın değerinde.",
      traits: ["Erken kalkan", "Pozitif başlangıç", "Düzenli yaşam"],
      funFact: "Güneş doğmadan mesaj atmaya başlıyorsunuz!"
    },
    "📖 Roman Yazarı": {
      description: "Uzun mesajlar sizin uzmanlığınız! Her mesajınız bir hikaye anlatıyor.",
      traits: ["Detaylı anlatım", "Kapsamlı düşünce", "Sabırlı yazım"],
      funFact: "Mesajlarınız kitap haline getirilebilir!"
    },
    "📝 Hikaye Anlatıcısı": {
      description: "Her mesajınızda bir hikaye var! Olayları çok güzel anlatıyorsunuz.",
      traits: ["Anlatım yeteneği", "Detay odaklı", "İlgi çekici"],
      funFact: "Sıradan olayları bile heyecanlı hale getiriyorsunuz!"
    },
    "💨 Hızlı Atış Uzmanı": {
      description: "Kısa ve etkili! Mesajlarınız hızlı ama çok net.",
      traits: ["Hızlı düşünce", "Etkili iletişim", "Zaman tasarrufu"],
      funFact: "Kelime ekonomisinde uzman!"
    },
    "⚡ Kısa ve Öz": {
      description: "Az kelimeyle çok şey anlatıyorsunuz. Minimalist iletişimin ustası!",
      traits: ["Özlü ifade", "Net mesajlar", "Pratik yaklaşım"],
      funFact: "3 kelimeyle roman anlatabilirsiniz!"
    },
    "☀️ Öğleden Sonra Aktifi": {
      description: "Öğleden sonra enerjiniz doruğa çıkıyor! Bu saatlerde en aktifsiniz.",
      traits: ["Öğleden sonra enerjisi", "Düzenli ritim", "Verimli saatler"],
      funFact: "Öğle yemeğinden sonra sohbet moduna geçiyorsunuz!"
    },
    "🌆 Akşam Sohbetçisi": {
      description: "Akşam saatleri sizin için sohbet zamanı! En keyifli mesajlarınız akşam atılıyor.",
      traits: ["Akşam aktifliği", "Rahat sohbet", "Günü değerlendirme"],
      funFact: "Akşam çayı eşliğinde en güzel sohbetleri yapıyorsunuz!"
    },
    "🎭 Emoji Koleksiyoncusu": {
      description: "Emoji çeşitliliğinde uzman! Her duruma uygun emoji buluyorsunuz.",
      traits: ["Geniş emoji repertuarı", "Yaratıcı kullanım", "Görsel zenginlik"],
      funFact: "Emoji sözlüğü yazsanız bestseller olur!"
    },
    "😊 Emoji Severr": {
      description: "Emojiler mesajlarınızın vazgeçilmezi! Her duyguyu emoji ile destekliyorsunuz.",
      traits: ["Duygusal ifade", "Renkli mesajlar", "Pozitif enerji"],
      funFact: "Emojisiz mesaj göndermek sizin için işkence!"
    },
    "💬 Sohbet Canavarı": {
      description: "Sohbet etmek sizin için nefes almak gibi! Sürekli mesajlaşıyorsunuz.",
      traits: ["Yoğun iletişim", "Sosyal enerji", "Sürekli aktiflik"],
      funFact: "Günde 500+ mesaj atmak sizin için normal!"
    },
    "🗣️ Konuşkan Tip": {
      description: "Konuşmayı seviyorsunuz! Her konuda söyleyecek sözünüz var.",
      traits: ["Aktif katılım", "Fikir paylaşımı", "Sosyal etkileşim"],
      funFact: "Sessizlik sizin için en büyük düşman!"
    },
    "📄 Detaycı Anlatıcı": {
      description: "Detayları kaçırmıyorsunuz! Her şeyi eksiksiz anlatıyorsunuz.",
      traits: ["Detay odaklı", "Kapsamlı bilgi", "Titiz yaklaşım"],
      funFact: "Bir olayı anlatırken hiçbir detayı atlamıyorsunuz!"
    },
    "💭 Düşünceli Yazıcı": {
      description: "Mesajlarınız düşünceli ve anlamlı. Her kelimeyi özenle seçiyorsunuz.",
      traits: ["Düşünceli yaklaşım", "Anlamlı mesajlar", "Özenli yazım"],
      funFact: "Mesajlarınız felsefe kitabından alıntı gibi!"
    },
    "🎯 Hedef Odaklı": {
      description: "Mesajlarınız net ve hedefe yönelik. Boş laf etmiyorsunuz.",
      traits: ["Odaklanmış iletişim", "Verimli mesajlar", "Sonuç odaklı"],
      funFact: "Her mesajınızın bir amacı var!"
    },
    "🌟 Pozitif Enerji": {
      description: "Mesajlarınızdan pozitif enerji yayılıyor! Herkesi mutlu ediyorsunuz.",
      traits: ["Pozitif yaklaşım", "Motivasyon kaynağı", "İyimser bakış"],
      funFact: "Mesajlarınız vitamin hapı etkisi yaratıyor!"
    },
    "🎪 Eğlence Merkezi": {
      description: "Sohbetin eğlenceli yanı sizsiniz! Her mesajınızda bir neşe var.",
      traits: ["Eğlenceli içerik", "Mizah anlayışı", "Keyifli sohbet"],
      funFact: "Sohbeti canlandırmakta uzman!"
    },
    "🧠 Analitik Düşünür": {
      description: "Her şeyi analiz ediyorsunuz! Mesajlarınız mantıklı ve düşünceli.",
      traits: ["Analitik yaklaşım", "Mantıklı düşünce", "Derinlemesine analiz"],
      funFact: "Basit bir konuyu bile bilimsel analiz ediyorsunuz!"
    },
    "🎨 Yaratıcı Ruh": {
      description: "Yaratıcılığınız mesajlarınıza yansıyor! Farklı ve özgün yaklaşımlarınız var.",
      traits: ["Yaratıcı ifade", "Özgün yaklaşım", "Sanatsal ruh"],
      funFact: "Mesajlarınız sanat eseri gibi!"
    },
    "🔥 Ateşli Sohbetçi": {
      description: "Enerjiniz çok yüksek! Mesajlarınızdan ateş saçılıyor.",
      traits: ["Yüksek enerji", "Tutkulu iletişim", "Dinamik yaklaşım"],
      funFact: "Mesajlarınız adrenalin pompası!"
    },
    "🌊 Sakin Deniz": {
      description: "Sakin ve huzurlu iletişim tarzınız var. Mesajlarınız dinlendirici.",
      traits: ["Sakin yaklaşım", "Huzurlu enerji", "Dengeli iletişim"],
      funFact: "Mesajlarınız meditasyon etkisi yaratıyor!"
    },
    "⭐ Yıldız Oyuncu": {
      description: "Sohbetin yıldızısınız! Her mesajınız dikkat çekiyor.",
      traits: ["Dikkat çekici", "Karizmatik", "Etkileyici"],
      funFact: "Mesajlarınız Oscar'a layık!"
    },
    "🎵 Ritim Tutucu": {
      description: "Mesajlarınızda bir ritim var! Düzenli ve uyumlu iletişim.",
      traits: ["Ritmik iletişim", "Düzenli mesajlar", "Uyumlu yaklaşım"],
      funFact: "Mesajlarınızdan müzik çıkıyor!"
    },
    "🌈 Rengarenk Kişilik": {
      description: "Çok yönlü kişiliğiniz mesajlarınıza yansıyor! Her rengi var.",
      traits: ["Çok yönlü", "Renkli kişilik", "Çeşitli yaklaşım"],
      funFact: "Kişiliğiniz gökkuşağı gibi renkli!"
    },
    "💫 Gizemli Karakter": {
      description: "Gizemli ve ilginç bir iletişim tarzınız var. Sizi çözmek zor!",
      traits: ["Gizemli yaklaşım", "İlginç kişilik", "Beklenmedik"],
      funFact: "Mesajlarınız bulmaca gibi!"
    }
  };
  
  return descriptions[personalityType] || {
    description: "Eşsiz bir iletişim tarzınız var!",
    traits: ["Özgün yaklaşım", "Farklı bakış açısı", "Kendine özgü stil"],
    funFact: "Sizi tanımlamak için yeni kelimeler icat etmek gerekiyor!"
  };
};

// Function to generate komik insights based on analysis data
const generateKomikInsights = (analysis: ChatAnalysis, relationshipAnalysis: RelAnalysis) => {
  const insights = [];
  
  // Fast responder insight
  const fastestResponder = relationshipAnalysis.funnyTitles?.patienceTestTitle;
  if (fastestResponder && fastestResponder !== 'Bilinmiyor') {
    insights.push(`3 dakikada cevap veriyorsunuz - Flash'tan hızlısınız!`);
  }
  
  // Night owl insight
  const nightBomber = relationshipAnalysis.funnyTitles?.nightBomberTitle;
  if (nightBomber && nightBomber !== 'Bilinmiyor') {
    insights.push(`Gece 2'de mesaj atma konusunda olimpiyat şampiyonu olabilirsiniz`);
  }
  
  // Emoji usage insight
  const emojiArtist = relationshipAnalysis.funnyTitles?.emojiArtistTitle;
  if (emojiArtist && emojiArtist !== 'Bilinmiyor') {
    insights.push(`Bu kadar emoji kullanımıyla kendi dilinizi yaratmışsınız`);
  }
  
  // Longest message insight
  const shakespeare = relationshipAnalysis.funnyTitles?.shakespeareTitle;
  if (shakespeare && shakespeare !== 'Bilinmiyor') {
    const avgLength = relationshipAnalysis.talkativenessAnalysis.averageMessageLength[shakespeare];
    if (avgLength > 200) {
      insights.push(`Mesajlarınızda Nobel Edebiyat Ödülü adayı olabilecek uzunlukta metinler var`);
    }
  }
  
  // Food obsession insight
  const foodLover = relationshipAnalysis.funnyStats.foodLover;
  const foodCount = relationshipAnalysis.funnyStats.foodObsession[foodLover] || 0;
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
    userFunnyScore = Math.round((relationshipAnalysis.humorAnalysis.humorScore || 0) / 10); // Normalize to 0-100
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
                    {personalityTypes.map((person, index) => {
                      const personalityInfo = getPersonalityDescription(person.type);
                      const personalityStats = getPersonalityStats(analysis, person.name, person.type);
                      const participantStats = analysis.messageStats.find(stat => stat.sender === person.name);
                      const emojiCount = analysis.emojiStats.emojiCountsByUser[person.name] 
                        ? Object.values(analysis.emojiStats.emojiCountsByUser[person.name]).reduce((sum, count) => sum + count, 0)
                        : 0;
                      
                      return (
                        <Card key={person.name} className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group">
                          <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-500">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mr-3">
                                  {person.type.split(' ')[0]}
                                </div>
                                <div>
                                  <CardTitle className="text-xl">{person.name}</CardTitle>
                                  <CardDescription className="text-indigo-100 font-medium">
                                    {person.type}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-2xl font-bold">#{index + 1}</div>
                                 <div className="text-sm opacity-90">Skor: {personalityStats.score}/100</div>
                               </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="mb-4">
                              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                {personalityInfo.description}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
                                <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  İstatistikler
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Mesaj Sayısı:</span>
                                    <span className="font-medium">{participantStats?.count || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Ort. Uzunluk:</span>
                                    <span className="font-medium">{Math.round(participantStats?.averageLength || 0)} karakter</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Emoji Kullanımı:</span>
                                    <span className="font-medium">{emojiCount} adet</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl">
                                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                  </svg>
                                  Özellikler
                                </h5>
                                <div className="space-y-1">
                                  {personalityInfo.traits.map((trait, traitIndex) => (
                                    <div key={traitIndex} className="flex items-center text-sm">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                      <span className="text-gray-700 dark:text-gray-300">{trait}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {personalityStats.specialStats.length > 0 && (
                               <div className="mb-4">
                                 <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center">
                                   <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                   </svg>
                                   Özel Yetenekler
                                 </h5>
                                 <div className="grid grid-cols-1 gap-3">
                                   {personalityStats.specialStats.map((stat, statIndex) => (
                                     <div key={statIndex} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg">
                                       <div className="flex items-center justify-between mb-2">
                                         <div className="flex items-center">
                                           <span className="text-lg mr-2">{stat.icon}</span>
                                           <span className="font-medium text-sm">{stat.label}</span>
                                         </div>
                                         <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                           {stat.value}/{stat.maxValue}
                                         </span>
                                       </div>
                                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1 overflow-hidden">
                                          <div 
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out group-hover:from-purple-400 group-hover:to-pink-400 relative" 
                                            style={{ width: `${(stat.value / stat.maxValue) * 100}%` }}
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                          </div>
                                        </div>
                                       <p className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</p>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             
                             <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl">
                               <div className="flex items-center mb-2">
                                 <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                 </svg>
                                 <h5 className="font-semibold text-yellow-700 dark:text-yellow-300">Eğlenceli Gerçek</h5>
                               </div>
                               <p className="text-gray-700 dark:text-gray-300 italic">
                                 💡 {personalityInfo.funFact}
                               </p>
                             </div>
                          </CardContent>
                        </Card>
                      );
                    })}
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
               
               <Card className="overflow-hidden border-0 shadow-lg">
                 <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                   <div className="flex items-center">
                     <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                     </svg>
                     <CardTitle>Görüldü Dedektifi 🕵️</CardTitle>
                   </div>
                   <CardDescription className="text-amber-100">
                     Mesajı görüp en geç cevap veren
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="p-6">
                   <div className="flex items-center mb-4">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 flex items-center justify-center mr-4">
                       <svg className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                         {relationshipAnalysis.funnyTitles?.seenDetectiveTitle || 'Bilinmiyor'}
                       </h3>
                       <div className="mt-1 flex items-center">
                         <svg className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Sabır testi uzmanı
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-xl">
                     <p className="text-gray-700 dark:text-gray-300">
                       <span className="font-medium">Sabır abidesi!</span> Mesajları görüyor ama cevap vermekte acele etmiyor. Düşünce dolu yaklaşım!
                     </p>
                   </div>
                 </CardContent>
               </Card>
               
               <Card className="overflow-hidden border-0 shadow-lg">
                 <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                   <div className="flex items-center">
                     <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                     </svg>
                     <CardTitle>Caps Lock Kralı 📢</CardTitle>
                   </div>
                   <CardDescription className="text-red-100">
                     En çok büyük harf kullanan
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="p-6">
                   <div className="flex items-center mb-4">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 flex items-center justify-center mr-4">
                       <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                       </svg>
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                         {relationshipAnalysis.funnyTitles?.capsLockKingTitle || 'Bilinmiyor'}
                       </h3>
                       <div className="mt-1 flex items-center">
                         <svg className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Sesli konuşuyor
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl">
                     <p className="text-gray-700 dark:text-gray-300">
                       <span className="font-medium">Ses tonu yüksek!</span> Büyük harflerle yazarak duygularını güçlü bir şekilde ifade ediyor!
                     </p>
                   </div>
                 </CardContent>
               </Card>
               
               <Card className="overflow-hidden border-0 shadow-lg">
                 <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                   <div className="flex items-center">
                     <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <CardTitle>Soru Makinesi ❓</CardTitle>
                   </div>
                   <CardDescription className="text-emerald-100">
                     En çok soru işareti kullanan
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="p-6">
                   <div className="flex items-center mb-4">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center mr-4">
                       <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                         {relationshipAnalysis.funnyTitles?.questionMachineTitle || 'Bilinmiyor'}
                       </h3>
                       <div className="mt-1 flex items-center">
                         <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Meraklı ruh
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl">
                     <p className="text-gray-700 dark:text-gray-300">
                       <span className="font-medium">Merak canavarı!</span> Her konuda soru soruyor ve detayları öğrenmek istiyor. Bilgi avcısı!
                     </p>
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
                        {seasonalContent.mostUsedWords.length > 0 ? (
                          seasonalContent.mostUsedWords.map(([word, count], index) => (
                            <li key={word} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <span className="font-medium">#{index + 1} {word}</span>
                              <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-sm">
                                {count} kez
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-500">
                            Bu yıl için yeterli veri bulunamadı
                          </li>
                        )}
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
                          En yoğun saat: {analysis.timeStats.mostActiveHour !== undefined ? `${analysis.timeStats.mostActiveHour}:00 (${analysis.timeStats.byHour[analysis.timeStats.mostActiveHour] || 0} mesaj)` : 'Bilinmiyor'}
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
                      En Romantik Kişi: {relationshipAnalysis.romanticAnalysis.mostRomanticPerson || 'Bilinmiyor'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
                      En Komik Kişi: {relationshipAnalysis.humorAnalysis.funniestPerson || 'Bilinmiyor'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
                      <p>Favori Bahane: {relationshipAnalysis.funnyStats.favoriteExcuse?.[participant] || 'Bilinmiyor'}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Yemek Obsessionu 🍕</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold">Yemek Aşığı: {relationshipAnalysis.funnyStats.foodLover || 'Bilinmiyor'}</h4>
                  <p>Yemekle ilgili {relationshipAnalysis.funnyStats.foodObsession?.[relationshipAnalysis.funnyStats.foodLover] || 0} mesaj</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Selfie Kralı/Kraliçesi 📸</CardTitle>
                  <CardDescription>Fotoğraf paylaşım istatistikleri</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold">{relationshipAnalysis.funnyStats.selfieTaker || 'Bilinmiyor'}</h4>
                  <p>Toplam {relationshipAnalysis.funnyStats.photoShareCount?.[relationshipAnalysis.funnyStats.selfieTaker] || 0} fotoğraf paylaşımı</p>
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
                      <p>Emoji Kişiliği: {relationshipAnalysis.funnyStats.emojiPersonality?.[participant] || 'Bilinmiyor'}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geç Cevap Şampiyonu ⏰</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold">{relationshipAnalysis.funnyStats.slowResponder?.person || 'Bilinmiyor'}</h4>
                  <p>Ortalama {relationshipAnalysis.funnyStats.slowResponder?.averageTime ? Math.round(relationshipAnalysis.funnyStats.slowResponder.averageTime) : 0} dakika içinde cevap veriyor</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="compatibility" className="mt-4">
            {participants.length === 2 && relationshipAnalysis.compatibilityScores ? (
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
                        Genel Uyum Skoru: {Math.round(relationshipAnalysis.compatibilityScores.overallCompatibility || 0)}%
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
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.comedyCompatibility || 0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.comedyCompatibility || 0}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Zaman Uyumu</span>
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.timeCompatibility || 0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.timeCompatibility || 0}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>İletişim Uyumu</span>
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.communicationCompatibility || 0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.communicationCompatibility || 0}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Emoji Uyumu</span>
                            <span className="font-semibold">{Math.round(relationshipAnalysis.compatibilityScores.emojiCompatibility || 0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${relationshipAnalysis.compatibilityScores.emojiCompatibility || 0}%` }}></div>
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
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <CardTitle>Emoji Sanatçısı 🎨</CardTitle>
                  </div>
                  <CardDescription className="text-pink-100">
                    En çeşitli emoji kullanan
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center mr-4">
                      <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.emojiArtistTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Emoji dünyasının kralı/kraliçesi
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Emoji ustası!</span> Sohbette en yaratıcı emoji kullanımına sahip. Kendini ifade etmek için emoji dünyasını kullanıyor!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <CardTitle>WhatsApp'ın Shakespeare'i 📜</CardTitle>
                  </div>
                  <CardDescription className="text-indigo-100">
                    En uzun mesajları yazan kişi
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center mr-4">
                      <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.shakespeareTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Ortalama {relationshipAnalysis.talkativenessAnalysis.averageMessageLength?.[relationshipAnalysis.funnyTitles?.shakespeareTitle || ''] ? Math.round(relationshipAnalysis.talkativenessAnalysis.averageMessageLength[relationshipAnalysis.funnyTitles?.shakespeareTitle || '']) : 0} karakter
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Edebiyat dehası!</span> {relationshipAnalysis.talkativenessAnalysis.longestMessage ? `En uzun mesajı ${relationshipAnalysis.talkativenessAnalysis.longestMessage.length} karakter uzunluğunda!` : 'Uzun ve detaylı mesajlarıyla tanınıyor.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <CardTitle>Sabır Testi ⏰</CardTitle>
                  </div>
                  <CardDescription className="text-green-100">
                    En hızlı cevap veren
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 flex items-center justify-center mr-4">
                      <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.patienceTestTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Şimşek hızında yanıt
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Hız ustası!</span> Mesajlarınıza hemen yanıt alabilirsiniz. Beklemek yok!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <CardTitle>Gece Mesaj Bombardımanı 🌙</CardTitle>
                  </div>
                  <CardDescription className="text-blue-100">
                    Gece 12'den sonra en aktif olan
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center mr-4">
                      <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.nightBomberTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Gece mesaj kralı
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Gece kuşu!</span> Gece geç saatlerde aktif olup mesaj gönderiyor. Uyku onun için sadece bir seçenek!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <CardTitle>Klavye Ninja ⚡</CardTitle>
                  </div>
                  <CardDescription className="text-orange-100">
                    En hızlı yazan kişi
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 flex items-center justify-center mr-4">
                      <svg className="h-8 w-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.keyboardNinjaTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-orange-500 dark:text-orange-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Şimşek hızında yazıyor
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Hız canavarı!</span> Klavyeyi adeta büyülüyor. Mesajları saniyeler içinde yazıp gönderiyor!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <CardTitle>Monolog Ustası 🎭</CardTitle>
                  </div>
                  <CardDescription className="text-violet-100">
                    Arka arkaya en çok mesaj atan
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center mr-4">
                      <svg className="h-8 w-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.monologMasterTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-violet-500 dark:text-violet-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Konuşma makinesi
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Sohbet kralı!</span> Arka arkaya mesaj göndermede uzman. Düşüncelerini hiç durduramıyor!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  <div className="flex items-center">
                    <Eye className="h-6 w-6 mr-2" />
                    <CardTitle>Görüldü Dedektifi 🕵️</CardTitle>
                  </div>
                  <CardDescription className="text-red-100">
                    En geç cevap veren
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 flex items-center justify-center mr-4">
                      <Eye className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.seenDetectiveTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Mesajları görüp geç cevaplıyor
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Dedektif gibi inceliyor!</span> Mesajları görüyor ama cevap vermekte acele etmiyor. Stratejik yaklaşım!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <div className="flex items-center">
                    <Type className="h-6 w-6 mr-2" />
                    <CardTitle>Caps Lock Kralı 👑</CardTitle>
                  </div>
                  <CardDescription className="text-yellow-100">
                    En çok büyük harf kullanan
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 flex items-center justify-center mr-4">
                      <Type className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.capsLockKingTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          BÜYÜK HARFLERLE YAZMAYI SEVİYOR
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Caps Lock tuşunun efendisi!</span> Mesajlarında büyük harfleri sıkça kullanıyor. Vurgu yapmayı seviyor!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <div className="flex items-center">
                    <HelpCircle className="h-6 w-6 mr-2" />
                    <CardTitle>Soru Makinesi ❓</CardTitle>
                  </div>
                  <CardDescription className="text-emerald-100">
                    En çok soru soran
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center mr-4">
                      <HelpCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {relationshipAnalysis.funnyTitles?.questionMachineTitle || 'Bilinmiyor'}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Sürekli soru soruyor
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Merak etmeyi seviyor!</span> Sürekli sorular soruyor ve her şeyi öğrenmek istiyor. Bilgi avcısı!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <CardTitle>En Romantik Çiftler 🏆</CardTitle>
                  </div>
                  <CardDescription className="text-pink-100">
                    Bu ay WhatsApp'ta en romantik çiftler
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {leaderboardData.romanticCouples.map((couple, index) => (
                      <div 
                        key={couple.name} 
                        className={`flex items-center p-4 ${couple.name.includes('(Siz)') 
                          ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-l-4 border-pink-500' 
                          : ''}`}
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md">
                          {index + 1}
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{couple.name}</h4>
                          <div className="flex items-center mt-1">
                            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">{couple.city}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30">
                            <svg className="h-4 w-4 text-pink-600 dark:text-pink-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-pink-700 dark:text-pink-300 font-medium">
                              %{couple.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 m-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">Nasıl Çalışır?</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bu liste, kullanıcıların romantik uyum skorlarına göre oluşturulmuş eğlenceli bir sıralamadır. 
                      Sizin skorunuz analiz sonuçlarınıza göre belirlenir ve uygunsa listeye eklenir.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <CardTitle>En Komik Kişiler 😂</CardTitle>
                  </div>
                  <CardDescription className="text-yellow-100">
                    Bu ay WhatsApp'ta en komik kullanıcılar
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {leaderboardData.funnyPeople.map((person, index) => (
                      <div 
                        key={person.name} 
                        className={`flex items-center p-4 ${person.name.includes('(Siz)') 
                          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-l-4 border-yellow-500' 
                          : ''}`}
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold shadow-md">
                          {index + 1}
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{person.name}</h4>
                          <div className="flex items-center mt-1">
                            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">{person.city}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30">
                            <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                              %{person.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 m-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">Nasıl Çalışır?</h4>
                    </div>
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