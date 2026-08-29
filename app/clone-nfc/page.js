import CloneNfcClient from './clone-nfc-client';
import styles from './page.module.css';

export const metadata = {
  title: 'Clone NFC Tag | Free Online Web NFC Tool',
  description: 'Copy and duplicate NFC tag NDEF records from one tag to another directly in your Chrome browser on Android. Free, fast, and secure.',
  keywords: ['Clone NFC', 'Copy NFC tag', 'NFC tag duplicator', 'Web NFC clone', 'NFC NDEF copier'],
  openGraph: {
    title: 'Clone NFC Tag | Free Online Web NFC Tool',
    description: 'Copy NDEF data from one NFC tag and write it to another tag directly in your browser.',
    url: 'https://nfctool.org/clone-nfc',
    siteName: 'NfcTool',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nfctool.org/clone-nfc',
  },
};

export default function CloneNfcPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Clone NFC Tag</h1>
        <p className={styles.subtitle}>
          Easily copy NDEF records from a source tag and duplicate them onto a new target tag in two quick steps.
        </p>
      </header>
      <CloneNfcClient />
    </div>
  );
}
