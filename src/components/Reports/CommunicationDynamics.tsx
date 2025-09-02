'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChatAnalysis } from '@/types/chat';
import { CHART_COLORS } from '@/lib/constants';

interface CommunicationDynamicsProps {
  analysis: ChatAnalysis;
}

const CommunicationDynamics = ({ analysis }: CommunicationDynamicsProps) => {
  const [activeTab, setActiveTab] = useState<'initiations' | 'responseTimes' | 'flow'>('initiations');
  
  if (!analysis.communicationDynamics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          İletişim Dinamikleri
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          İletişim dinamikleri analizi verisi bulunamadı.
        </p>
      </div>
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        İletişim Dinamikleri
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('initiations')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'initiations'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Konuşma Başlatmalar
        </button>
        
        <button
          onClick={() => setActiveTab('responseTimes')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'responseTimes'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Yanıtlama Süreleri
        </button>
        
        <button
          onClick={() => setActiveTab('flow')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'flow'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Etkileşim Akışı
        </button>
      </div>
      
      {/* Conversation Initiations Tab */}
      {activeTab === 'initiations' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">En Aktif Konuşma Başlatan</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {communicationDynamics.mostActiveConversator}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Yanıtlama Süresi</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {communicationDynamics.avgResponseTime.toFixed(1)} dakika
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Konuşma Başlatma</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {Object.values(communicationDynamics.conversationInitiations).reduce((sum, count) => sum + count, 0)}
              </p>
            </div>
          </div>
          
          <div className="h-64">
            {initiationsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={initiationsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip
                    formatter={(value) => [value, 'Konuşma Başlatma']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar dataKey="value" name="Konuşma Başlatma">
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
                <p className="text-gray-500 dark:text-gray-400">
                  Konuşma başlatma verisi bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Response Times Tab */}
      {activeTab === 'responseTimes' && (
        <div>
          <div className="h-80">
            {responseTimesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={responseTimesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
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
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar dataKey="average" name="Ortalama" fill={CHART_COLORS.primary[0]} />
                  <Bar dataKey="median" name="Medyan" fill={CHART_COLORS.primary[1]} />
                  <Bar dataKey="fastest" name="En Hızlı" fill={CHART_COLORS.primary[2]} />
                  <Bar dataKey="slowest" name="En Yavaş" fill={CHART_COLORS.primary[3]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  Yanıtlama süresi verisi bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Interaction Flow Tab */}
      {activeTab === 'flow' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-64">
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
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    Etkileşim akışı verisi bulunamadı.
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                Etkileşim Özeti
              </h4>
              
              <div className="space-y-3">
                {Object.entries(communicationDynamics.interactionFlow).map(([user, interactions]) => {
                  const totalInteractions = Object.values(interactions).reduce((sum, count) => sum + count, 0);
                  
                  return (
                    <div key={user} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{user}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {totalInteractions} etkileşim
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
              Detaylı Etkileşim Akışı
            </h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kimden
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kime
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Etkileşim Sayısı
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {flowData.length > 0 ? (
                    flowData.map((flow, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {flow.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {flow.to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {flow.value}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Etkileşim akışı verisi bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationDynamics;