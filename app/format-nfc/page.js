import FormatNfcClient from './format-nfc-client';
import styles from './page.module.css';

export const metadata = {
  title: 'Format NFC Tag | Free Online Web NFC Tool',
  description: 'Format unformatted or corrupted NFC tags for NDEF messaging directly in your Android browser. Free, fast, and easy.',
  keywords: ['Format NFC', 'NFC NDEF format', 'Reformat NFC tag', 'Web NFC format', 'Initialize NFC tag'],
  openGraph: {
    title: 'Format NFC Tag | Free Online Web NFC Tool',
    description: 'Initialize and format NFC tags for NDEF messaging directly in Chrome on Android.',
    url: 'https://nfctool.org/format-nfc',
    siteName: 'NfcTool',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nfctool.org/format-nfc',
  },
};

export default function FormatNfcPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Format NFC Tag</h1>
        <p className={styles.subtitle}>
          Prepare and initialize NFC tags for NDEF data storage, wiping existing formatting errors or incompatible payloads.
        </p>
      </header>
      <FormatNfcClient />
    </div>
  );
}
