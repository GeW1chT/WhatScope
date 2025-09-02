'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gizlilik Politikası
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Bu Gizlilik Politikası, web sitemizi ("site") ziyaret eden ve kullanan kişilerin gizliliğini korumak amacıyla hazırlanmıştır. 
                Sitemiz, WhatsApp sohbet dosyalarınızı (TXT formatında) analiz etmenize olanak tanır. Bu hizmetin temel prensibi, 
                kullanıcı gizliliğini en üst düzeyde tutmaktır.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Veri Toplama ve İşleme
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sitemiz, kişisel verilerinizi toplamaz, saklamaz veya işlemez. Sizin tarafınızdan yüklenen WhatsApp sohbet dosyası, 
                herhangi bir sunucuya yüklenmez veya gönderilmez. Tüm analiz süreci, tamamen sizin kendi web tarayıcınızın içinde, 
                cihazınızın yerel belleğinde (RAM) gerçekleşir. Bu sayede:
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
                Gizliliğiniz Kesinlikle Korunur
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sohbet verileriniz hiçbir zaman bizim kontrolümüze geçmez ve sunucularımızda saklanmaz.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">
                Anında Silinme
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Analiz tamamlandıktan ve sonuçlar size sunulduktan hemen sonra, dosyanın içeriği tarayıcı belleğinizden silinir.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Toplanan Bilgiler
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Web sitemiz, hizmetin işleyişi için zorunlu olan anonim verileri toplayabilir. Bu veriler, site trafiğini analiz etmek 
                ve kullanıcı deneyimini iyileştirmek amacıyla kullanılır. Bu tür veriler, doğrudan sizi tanımlayan kişisel bilgiler 
                (ad, telefon numarası vb.) içermez.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Üçüncü Taraf Bağlantıları
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sitemiz, başka web sitelerine veya hizmetlere bağlantılar içerebilir. Bu sitelerin gizlilik politikalarından 
                veya içeriklerinden sorumlu değiliz. Başka bir siteye geçiş yaptığınızda, o sitenin kendi gizlilik politikasını 
                okumanızı öneririz.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                Gizlilik Politikası Güncellemeleri
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Bu Gizlilik Politikası, ihtiyaç duyulması halinde güncellenebilir. Politikada yapılan değişiklikler bu sayfada 
                yayımlandığında geçerli olur.
              </p>

              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">
                  Herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle iletişime geçin:{' '}
                  <Link href="mailto:ergunberat2005@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    ergunberat2005@gmail.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}