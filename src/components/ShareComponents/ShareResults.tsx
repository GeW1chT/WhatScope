'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  
  const shareOnWhatsApp = () => {
    const text = `WhatsScope ile WhatsApp sohbetimi analiz ettim! ${analysis.participants.join(' ve ')} arasındaki ${analysis.totalMessages} mesajda neler konuştuğumuzu keşfettim. Sonuçlara buradan bakabilirsin: ${window.location.href}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  
  const shareOnInstagram = () => {
    // Instagram doesn't allow direct sharing of links in messages
    // We'll prompt the user to copy the link and share it manually
    const text = `WhatsScope ile WhatsApp sohbetimi analiz ettim! ${analysis.participants.join(' ve ')} arasındaki ${analysis.totalMessages} mesajda neler konuştuğumuzu keşfettim. Sonuçlara buradan bakabilirsin: ${window.location.href}`;
    
    // Copy to clipboard and show alert
    navigator.clipboard.writeText(text).then(() => {
      alert('Instagram\'da paylaşmak için bağlantı panoya kopyalandı. Instagram uygulamasını açın ve bir sohbette yapıştırarak paylaşın.');
    });
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
      
      let totalPages = 1; // Manuel sayfa takibi
      
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
      totalPages++; // İkinci sayfa eklendi
      doc.text(encodeTurkishText('Analiz Grafikleri'), 105, 15, { align: 'center' });
      doc.addImage(imgData, 'PNG', 20, 20, imgWidth, Math.min(imgHeight, 250));
      
      // Add footer to all pages
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(encodeTurkishText(`WhatsScope Analiz Raporu - Sayfa ${i}/${totalPages}`), 105, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
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
    <div className="space-y-8">
      {/* Main Header */}
      <motion.div 
        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">
              Sonuçları Paylaş
            </h3>
            <p className="text-white/70 mt-1">
              Analiz sonuçlarınızı farklı platformlarda paylaşın
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <motion.button
            onClick={generateImage}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-indigo-400/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-8 w-8 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">PNG İndir</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={generatePdf}
            disabled={isPdfGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-red-400/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isPdfGenerating ? (
              <>
                <svg className="animate-spin h-8 w-8 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-300 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">PDF İndir</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={shareOnTwitter}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1DA1F2]/20 to-[#0c85d0]/20 hover:from-[#1DA1F2]/30 hover:to-[#0c85d0]/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-blue-400/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span className="text-sm font-medium">Twitter</span>
          </motion.button>
          
          <motion.button
            onClick={shareOnFacebook}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#4267B2]/20 to-[#365899]/20 hover:from-[#4267B2]/30 hover:to-[#365899]/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-blue-400/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium">Facebook</span>
          </motion.button>
          
          <motion.button
            onClick={shareOnLinkedIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0077B5]/20 to-[#00669c]/20 hover:from-[#0077B5]/30 hover:to-[#00669c]/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-blue-400/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="text-sm font-medium">LinkedIn</span>
          </motion.button>
          
          <motion.button
            onClick={shareOnWhatsApp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#25D366]/20 to-[#1da851]/20 hover:from-[#25D366]/30 hover:to-[#1da851]/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-green-400/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-sm font-medium">WhatsApp</span>
          </motion.button>
          
          <motion.button
            onClick={shareOnInstagram}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-r from-[#f9ce34]/20 via-[#ee2a7b]/20 to-[#6228d7]/20 hover:from-[#f9ce34]/30 hover:via-[#ee2a7b]/30 hover:to-[#6228d7]/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-pink-400/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-300 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-sm font-medium">Instagram</span>
          </motion.button>
          
          <motion.button
            onClick={generateShareUrl}
            disabled={isUrlGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 text-white font-medium rounded-2xl backdrop-blur-sm border border-emerald-400/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isUrlGenerating ? (
              <>
                <svg className="animate-spin h-8 w-8 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-300 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-medium">Bağlantı Oluştur</span>
              </>
            )}
          </motion.button>
        </div>
        
        {/* URL Modal */}
        {showUrlModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Paylaşılabilir Bağlantı</h3>
                <button 
                  onClick={closeUrlModal}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-white/70 mb-6">
                Bu bağlantıyı paylaşarak diğer kullanıcıların analiz sonuçlarınızı görmesini sağlayabilirsiniz.
              </p>
              
              <div className="flex mb-6">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-xl backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => copyToClipboard(shareUrl)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-r-xl transition-all duration-300"
                >
                  Kopyala
                </button>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={closeUrlModal}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-300"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShareResults;