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
                    Çift Uyumu Analizi
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
          
          <TabsContent value="fun-conclusions" className="mt-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                Eğlenceli Sonuçlar & Tavsiyeler
              </h3>
              
              <div className="space-y-6 mt-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                    İletişim Tarzınız
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {relationshipAnalysis.romanticAnalysis.romanticScore > 50 ? 
                      'Sohbetinizde romantik ifadeler çok sık kullanılıyor. Birbirinize olan sevginizi göstermekten çekinmiyorsunuz!' : 
                      'Sohbetinizde duygusal ifadelerden çok pratik iletişim tercih ediliyor. İşinizi halletmeye odaklı bir tarzınız var.'}
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Eğlence Faktörü
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {relationshipAnalysis.humorAnalysis.humorScore > 40 ? 
                      'Sohbetinizde bol miktarda gülme ve espri var! Birbirinizi güldürmeyi seviyorsunuz.' : 
                      'Sohbetiniz daha çok ciddi konular üzerinde yoğunlaşıyor. Biraz daha espri ve emoji katmayı düşünebilirsiniz!'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                    İlginç Bulgular
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    <li>
                      En sık kullandığınız bahane: "{relationshipAnalysis.funnyStats.favoriteExcuse[participants[0]]}"
                    </li>
                    <li>
                      Sohbetinizde {analysis.emojiStats.totalEmojis} emoji kullanmışsınız.
                    </li>
                    <li>
                      En uzun sessizlik süreniz: {Math.round(analysis.longestSilence?.duration || 0)} saat.
                    </li>
                    <li>
                      En aktif saatiniz: {analysis.timeStats.mostActiveHour}:00
                    </li>
                  </ul>
                </div>
                
                {participants.length === 2 && (
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-2">
                      WhatsApp Uyum Yorumu
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {relationshipAnalysis.compatibilityScores.overallCompatibility > 70 ? 
                        `${participants[0]} ve ${participants[1]}, WhatsApp'ta harika bir ikili olduğunuzu biliyor muydunuz? İletişim tarzınız birbirinizle çok uyumlu!` : 
                        relationshipAnalysis.compatibilityScores.overallCompatibility > 50 ? 
                        `${participants[0]} ve ${participants[1]} arasındaki sohbetler genelde dengeli ve uyumlu. Farklılıklarınız iletişiminizi zenginleştiriyor.` :
                        `${participants[0]} ve ${participants[1]}, tamamen farklı iletişim tarzlarına sahipsiniz! Bu farklılıklar iletişiminizi bazen zorlaştırsa da ilginç kılıyor.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RelationshipAnalysis;