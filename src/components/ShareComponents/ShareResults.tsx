'use client';

import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { ChatAnalysis } from '@/types/chat';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ShareResultsProps {
  analysis: ChatAnalysis;
  activeTab: string;
  resultsContentRef: React.RefObject<HTMLDivElement>;
}

const ShareResults = ({ analysis, activeTab, resultsContentRef }: ShareResultsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isUrlGenerating, setIsUrlGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Helper function to encode Turkish characters for PDF
  const encodeTurkishText = (text: string): string => {
    return text
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C');
  };
  
  // Use a function to safely get the results content element
  const getResultsContentElement = () => {
    const element = document.getElementById('results-content');
    if (!element) {
      console.error('Results content element not found!');
      throw new Error('Sonuç içeriği bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
    }
    return element;
  };
  
  const generateImage = async () => {
    try {
      setIsGenerating(true);
      
      // Get the target element to capture
      const element = getResultsContentElement();
      console.log('Generating image from element:', element);
      
      // Generate image
      const dataUrl = await toPng(element, {
        quality: 0.95,
        backgroundColor: 'white',
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          // Ensure all content is visible
          transform: 'scale(1)',
        }
      });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `whatsscope-${activeTab}-analiz.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Görüntü oluşturma hatası:', error);
      alert('Görüntü oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const shareOnTwitter = () => {
    // Create a tweet with pre-populated text
    const text = `WhatsScope ile WhatsApp sohbetimi analiz ettim! ${analysis.participants.join(' ve ')} arasındaki ${analysis.totalMessages} mesajda neler konuştuğumuzu keşfettim. #WhatsScope #WhatsAppAnaliz`;
    const url = window.location.href;
    
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  
  const shareOnFacebook = () => {
    const url = window.location.href;
    const text = `WhatsScope ile WhatsApp sohbetimi analiz ettim! ${analysis.participants.join(' ve ')} arasındaki ${analysis.totalMessages} mesajda neler konuştuğumuzu keşfettim.`;
    
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
  };
  
  const shareOnLinkedIn = () => {
    const url = window.location.href;
    const title = 'WhatsApp Sohbet Analizim';
    const summary = `WhatsScope ile WhatsApp sohbetimi analiz ettim! ${analysis.participants.join(' ve ')} arasındaki ${analysis.totalMessages} mesajda neler konuştuğumuzu keşfettim.`;
    
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`, '_blank');
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Bağlantı panoya kopyalandı!');
    }).catch(err => {
      console.error('Panoya kopyalama hatası:', err);
      alert('Bağlantı kopyalanamadı. Lütfen manuel olarak kopyalayın.');
    });
  };
  
  const generateShareUrl = async () => {
    try {
      setIsUrlGenerating(true);
      // In a real implementation, this would generate a shareable URL
      // For now, we'll just use the current URL as an example
      const url = `${window.location.origin}/share/${Math.random().toString(36).substring(2, 15)}`;
      setShareUrl(url);
      setShowUrlModal(true);
    } catch (error) {
      console.error('URL oluşturma hatası:', error);
      alert('Paylaşılabilir bağlantı oluşturulurken bir hata oluştu.');
    } finally {
      setIsUrlGenerating(false);
    }
  };
  
  const closeUrlModal = () => {
    setShowUrlModal(false);
    setShareUrl('');
  };

  const generatePdf = async () => {
    try {
      setIsPdfGenerating(true);
      console.log('Starting PDF generation');
      
      // Dynamically import jsPDF modules (for better performance)
      const JsPDF = await import('jspdf').then(module => module.default);
      const autoTable = await import('jspdf-autotable').then(module => module.default);
      const html2canvas = await import('html2canvas').then(module => module.default);
      
      console.log('Modules loaded successfully');
      
      // Create a new PDF document
      const doc = new JsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(encodeTurkishText('WhatsScope Analiz Raporu'), 105, 15, { align: 'center' });
      
      // Add date
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const currentDate = format(new Date(), 'd MMMM yyyy, HH:mm', { locale: tr });
      doc.text(encodeTurkishText(`Oluşturulma Tarihi: ${currentDate}`), 105, 22, { align: 'center' });
      
      // Add summary information
      doc.setFontSize(12);
      doc.text(encodeTurkishText('Sohbet Özeti'), 20, 30);
      
      // Define data for table with encoded Turkish characters
      const tableHead = [[encodeTurkishText('Özellik'), encodeTurkishText('Değer')]];
      const tableBody = [
        [encodeTurkishText('Toplam Mesaj'), analysis.totalMessages.toString()],
        [encodeTurkishText('Katılımcılar'), encodeTurkishText(analysis.participants.join(', '))],
        [encodeTurkishText('Tarih Aralığı'), encodeTurkishText(`${format(analysis.dateRange.start, 'dd.MM.yyyy', { locale: tr })} - ${format(analysis.dateRange.end, 'dd.MM.yyyy', { locale: tr })}`)],
        [encodeTurkishText('En Aktif Gün'), encodeTurkishText(format(new Date(analysis.timeStats.mostActiveDate), 'd MMMM yyyy', { locale: tr }))],
        [encodeTurkishText('Toplam Emoji'), analysis.emojiStats.totalEmojis.toString()],
        [encodeTurkishText('En Sık Kullanılan Emoji'), analysis.emojiStats.mostUsedEmojis[0]?.emoji || '-']
      ];
      
      // Create summary table
      autoTable(doc, {
        startY: 35,
        head: tableHead,
        body: tableBody,
        theme: 'striped',
        headStyles: { 
          fillColor: [79, 70, 229]
        },
      });
      
      // Get the target element to capture for charts
      const element = getResultsContentElement();
      console.log('Capturing element for PDF:', element);
      
      // Capture charts as images
      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        scale: window.devicePixelRatio || 1,
      } as any);
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate aspect ratio to fit within PDF
      const imgWidth = doc.internal.pageSize.getWidth() - 40; // 20mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add charts image
      doc.addPage();
      doc.text(encodeTurkishText('Analiz Grafikleri'), 105, 15, { align: 'center' });
      doc.addImage(imgData, 'PNG', 20, 20, imgWidth, Math.min(imgHeight, 250));
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(encodeTurkishText(`WhatsScope Analiz Raporu - Sayfa ${i}/${pageCount}`), 105, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`whatsscope-${activeTab}-analiz.pdf`);
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsPdfGenerating(false);
    }
  };
  
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
        Sonuçları Paylaş
      </h4>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Görüntü Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Görüntü Olarak İndir</span>
            </>
          )}
        </button>
        
        <button
          onClick={generatePdf}
          disabled={isPdfGenerating}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPdfGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>PDF Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>PDF Olarak İndir</span>
            </>
          )}
        </button>
        
        <button
          onClick={shareOnTwitter}
          className="flex items-center px-4 py-2 bg-[#1DA1F2] hover:bg-[#0c85d0] text-white font-medium rounded-md shadow-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          <span>Twitter</span>
        </button>
        
        <button
          onClick={shareOnFacebook}
          className="flex items-center px-4 py-2 bg-[#4267B2] hover:bg-[#365899] text-white font-medium rounded-md shadow-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </button>
        
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center px-4 py-2 bg-[#0077B5] hover:bg-[#00669c] text-white font-medium rounded-md shadow-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>LinkedIn</span>
        </button>
        
        <button
          onClick={generateShareUrl}
          disabled={isUrlGenerating}
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUrlGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>URL Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Paylaşılabilir Bağlantı</span>
            </>
          )}
        </button>
      </div>
      
      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Paylaşılabilir Bağlantı</h3>
              <button 
                onClick={closeUrlModal}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Bu bağlantıyı paylaşarak diğer kullanıcıların analiz sonuçlarınızı görmesini sağlayabilirsiniz.
            </p>
            
            <div className="flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-r-md transition-colors"
              >
                Kopyala
              </button>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeUrlModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareResults;