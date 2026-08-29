import EraseNfcClient from './erase-nfc-client';
import styles from './page.module.css';

export const metadata = {
  title: 'Erase NFC Tag | Free Online Web NFC Tool',
  description: 'Wipe and clear NDEF records from any re-writable NFC tag directly in your browser. Fast, free, and secure.',
  keywords: ['Erase NFC', 'Clear NFC tag', 'Wipe NFC tag', 'Web NFC erase', 'NFC data eraser'],
  openGraph: {
    title: 'Erase NFC Tag | Free Online Web NFC Tool',
    description: 'Safely clear data records from your NFC tag directly in Chrome for Android.',
    url: 'https://nfctool.org/erase-nfc',
    siteName: 'NfcTool',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nfctool.org/erase-nfc',
  },
};

export default function EraseNfcPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Erase NFC Tag</h1>
        <p className={styles.subtitle}>
          Wipe existing NDEF records from any writable NFC tag to return it to a clean, blank state.
        </p>
      </header>
      <EraseNfcClient />
    </div>
  );
}
