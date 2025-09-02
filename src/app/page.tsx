import Image from "next/image";
import FileUpload from "@/components/FileUpload";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SiteFooter from "@/components/ui/SiteFooter";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 sm:py-16 max-w-6xl">
        <header className="text-center mb-8 sm:mb-16">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="relative w-[60px] h-[60px] mr-3">
                <Image 
                  src="/logo-transparent.png" 
                  alt="WhatsScope Logo" 
                  fill
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-md"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                WhatsScope
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/privacy-policy" 
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Gizlilik Politikası
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            WhatsApp sohbetlerinizi derinlemesine analiz eden, eğlenceli ve paylaşılabilir istatistikler sunan platform.
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Hızlı ve Kolay Analiz
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                WhatsApp sohbet dışa aktarım dosyanızı yükleyin, gerisini bize bırakın. Tüm verileriniz tamamen gizli ve güvenli bir şekilde, sadece tarayıcınızda işlenir.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                Detaylı İstatistikler
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Mesaj sayıları, aktif saatler, emoji kullanımları, medya paylaşımları ve çok daha fazlasını görselleştirilmiş grafiklerle keşfedin.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
                Duygusal Analiz
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Sohbetlerinizin duygusal tonunu analiz edin. Hangi günlerde daha mutlu, hangi günlerde daha üzgün olduğunuzu keşfedin.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
              Sohbetinizi Yükleyin
            </h2>
            <FileUpload />
            
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <h3 className="font-medium mb-2">Nasıl WhatsApp sohbet dışa aktarım dosyası alınır?</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>WhatsApp'ta analiz etmek istediğiniz sohbeti açın</li>
                <li>Üç nokta menüsüne tıklayın ve "Sohbeti Dışa Aktar" seçeneğini seçin</li>
                <li>"Medya olmadan" seçeneğini seçin</li>
                <li>Oluşturulan .txt dosyasını buraya yükleyin</li>
              </ol>
              <div className="mt-4 text-center">
                <a 
                  href="/sample-chat.txt" 
                  download="ornek-whatsapp-sohbet.txt"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center sm:justify-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Örnek sohbet dosyasını indir
                </a>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-xs text-green-700 dark:text-green-300">
                  <span className="font-semibold">Tip:</span> Gerçek sohbet dosyanızda sorun mu yaşıyorsunuz? Örnek dosyayı indirip deneyin veya arkadaşınızla kısa bir test sohbeti yapıp onu dışa aktarın.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <SiteFooter />
      </div>
    </div>
  );
}