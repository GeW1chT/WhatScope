import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-20 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>© 2025 WhatsScope - Tüm sohbet verileriniz gizli kalır ve sunucularımıza yüklenmez.</p>
      <div className="mt-2">
        <Link 
          href="/privacy-policy" 
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Gizlilik Politikası
        </Link>
      </div>
    </footer>
  );
}