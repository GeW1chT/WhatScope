'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { CHART_COLORS } from '@/lib/constants';
import { motion } from 'framer-motion';

interface CommunicationDynamicsProps {
  analysis: ChatAnalysis;
}

const CommunicationDynamics = ({ analysis }: CommunicationDynamicsProps) => {
  const [activeTab, setActiveTab] = useState<'initiations' | 'responseTimes' | 'flow'>('initiations');
  
  if (!analysis.communicationDynamics) {
    return (
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            İletişim Dinamikleri
          </h3>
        </div>
        <p className="text-white/70">
          İletişim dinamikleri analizi verisi bulunamadı.
        </p>
      </motion.div>
    );
  }
  
  const { communicationDynamics } = analysis;
  
  // Prepare data for conversation initiations chart
  const initiationsData = Object.entries(communicationDynamics.conversationInitiations)
    .map(([user, count]) => ({
      name: user,
      value: count
    }))
    .sort((a, b) => b.value - a.value);
  
  // Prepare data for response times chart
  const responseTimesData = Object.entries(communicationDynamics.responseTimes)
    .map(([user, stats]) => ({
      name: user,
      average: stats.average,
      median: stats.median,
      fastest: stats.fastest,
      slowest: stats.slowest
    }));
  
  // Prepare data for interaction flow chart
  const flowData = [];
  for (const [fromUser, toUsers] of Object.entries(communicationDynamics.interactionFlow)) {
    for (const [toUser, count] of Object.entries(toUsers)) {
      if (count > 0) {
        flowData.push({
          from: fromUser,
          to: toUser,
          value: count
        });
      }
    }
  }
  
  // Prepare data for interaction flow pie chart
  const flowSummaryData = Object.entries(communicationDynamics.interactionFlow)
    .map(([user, interactions]) => {
      const totalInteractions = Object.values(interactions).reduce((sum, count) => sum + count, 0);
      return {
        name: user,
        value: totalInteractions
      };
    })
    .sort((a, b) => b.value - a.value);
  
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
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            İletişim Dinamikleri
          </h3>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/20">
          <button
            onClick={() => setActiveTab('initiations')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'initiations'
                ? 'text-white border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Konuşma Başlatmalar
          </button>
          
          <button
            onClick={() => setActiveTab('responseTimes')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'responseTimes'
                ? 'text-white border-b-2 border-green-400 bg-green-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Yanıtlama Süreleri
          </button>
          
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === 'flow'
                ? 'text-white border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Etkileşim Akışı
          </button>
        </div>
        
        {/* Conversation Initiations Tab */}
        {activeTab === 'initiations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-400/20 rounded-2xl p-6"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-blue-300 font-medium">En Aktif Konuşma Başlatan</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {communicationDynamics.mostActiveConversator}
                </p>
              </motion.div>
              
              <motion.div 
                className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-2xl p-6"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-green-300 font-medium">Ortalama Yanıtlama Süresi</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {communicationDynamics.avgResponseTime.toFixed(1)} dakika
                </p>
              </motion.div>
              
              <motion.div 
                className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20 rounded-2xl p-6"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-purple-300 font-medium">Toplam Konuşma Başlatma</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {Object.values(communicationDynamics.conversationInitiations).reduce((sum, count) => sum + count, 0)}
                </p>
              </motion.div>
            </div>
            
            <div className="h-80 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              {initiationsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={initiationsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip
                      formatter={(value) => [value, 'Konuşma Başlatma']}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(12px)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="value" name="Konuşma Başlatma" radius={[4, 4, 0, 0]}>
                      {initiationsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/70">
                    Konuşma başlatma verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Response Times Tab */}
        {activeTab === 'responseTimes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-80 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              {responseTimesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={responseTimesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                      tickFormatter={(value) => `${value.toFixed(0)}dk`}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        const labels: Record<string, string> = {
                          average: 'Ortalama',
                          median: 'Medyan',
                          fastest: 'En Hızlı',
                          slowest: 'En Yavaş'
                        };
                        return [`${parseFloat(value.toString()).toFixed(1)} dakika`, labels[name] || name];
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(12px)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="average" name="Ortalama" fill={CHART_COLORS.primary[0]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="median" name="Medyan" fill={CHART_COLORS.primary[1]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fastest" name="En Hızlı" fill={CHART_COLORS.primary[2]} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="slowest" name="En Yavaş" fill={CHART_COLORS.primary[3]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/70">
                    Yanıtlama süresi verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Interaction Flow Tab */}
        {activeTab === 'flow' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="h-64 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
                {flowSummaryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={flowSummaryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {flowSummaryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, 'Etkileşim']}
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          backdropFilter: 'blur(12px)',
                          borderColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/70">
                      Etkileşim akışı verisi bulunamadı.
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Etkileşim Özeti
                </h4>
                
                <div className="space-y-4">
                  {Object.entries(communicationDynamics.interactionFlow).map(([user, interactions]) => {
                    const totalInteractions = Object.values(interactions).reduce((sum, count) => sum + count, 0);
                    
                    return (
                      <motion.div 
                        key={user} 
                        className="flex items-center justify-between backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-white/90">{user}</span>
                        <span className="font-medium text-white">
                          {totalInteractions} etkileşim
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-xl font-bold text-white mb-4">
                Detaylı Etkileşim Akışı
              </h4>
              
              <div className="overflow-x-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                        Kimden
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                        Kime
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                        Etkileşim Sayısı
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {flowData.length > 0 ? (
                      flowData.map((flow, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {flow.from}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {flow.to}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {flow.value}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-white/70">
                          Etkileşim akışı verisi bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CommunicationDynamics;