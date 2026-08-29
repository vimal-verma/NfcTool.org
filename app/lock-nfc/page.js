import LockNfcClient from './lock-nfc-client';
import styles from './page.module.css';

export const metadata = {
  title: 'Lock NFC Tag Permanently | Free Online Web NFC Tool',
  description: 'Make your NFC tag read-only permanently using Web NFC. Prevent data tampering or accidental modification.',
  keywords: ['Lock NFC', 'Read-only NFC tag', 'Permanent lock NFC', 'Web NFC makeReadOnly', 'Protect NFC tag'],
  openGraph: {
    title: 'Lock NFC Tag Permanently | Free Online Web NFC Tool',
    description: 'Permanently lock your NFC tag records to prevent editing or overwriting.',
    url: 'https://nfctool.org/lock-nfc',
    siteName: 'NfcTool',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nfctool.org/lock-nfc',
  },
};

export default function LockNfcPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Lock NFC Tag</h1>
        <p className={styles.subtitle}>
          Make your NFC tag permanently read-only to safeguard business cards, payment tags, or links from future modification.
        </p>
      </header>
      <LockNfcClient />
    </div>
  );
}
