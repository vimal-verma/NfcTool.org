import { Suspense, Fragment } from 'react';
import CloneNfcClient from './clone-nfc-client';
import BrowserSupportNotice from '../components/BrowserSupportNotice';
import styles from './page.module.css';

export const metadata = {
  title: 'Clone NFC Tag Online | Free Web NFC Tag Duplicator | NfcTool',
  description: 'Copy and duplicate NFC tag NDEF records from one tag to another directly in your Chrome browser on Android. Free, fast, and secure. No app required.',
  keywords: ['Clone NFC', 'Copy NFC tag', 'NFC tag duplicator', 'Web NFC clone', 'NFC NDEF copier', 'duplicate NFC card'],
  openGraph: {
    title: 'Clone NFC Tag Online | Free Web NFC Tag Duplicator | NfcTool',
    description: 'Copy NDEF data from one NFC tag and duplicate it onto another tag directly in your browser.',
    url: 'https://nfctool.org/clone-nfc',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Clone NFC Tag — NfcTool' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clone NFC Tag Online | Free Web NFC Tag Duplicator | NfcTool',
    description: 'Copy NDEF data from one NFC tag and write it to another in your browser. Free & no app required.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  alternates: {
    canonical: 'https://nfctool.org/clone-nfc',
  },
};

export default function CloneNfcPage() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Online NFC Tag Cloner',
    applicationCategory: 'Utilities',
    operatingSystem: 'Web',
    browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
    description: 'A free browser-based Web NFC tool to duplicate NDEF records from a source tag to a blank or writable target NFC tag.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'NfcTool' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
      { '@type': 'ListItem', position: 2, name: 'NFC Tools', item: 'https://nfctool.org/nfc-tool' },
      { '@type': 'ListItem', position: 3, name: 'Clone NFC Tag', item: 'https://nfctool.org/clone-nfc' }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does NFC cloning work online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The tool reads all NDEF records from the source tag into browser memory, then writes those exact records onto the target tag when brought into range.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can the NFC tag serial number (UID) be cloned?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Factory hardware UIDs are permanently set during manufacturing and cannot be modified or cloned using the Web NFC API.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of NFC tags can I clone to?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Any writable NFC Forum tag with sufficient capacity for the source payload (e.g., NTAG213, NTAG215, NTAG216).'
        }
      }
    ]
  };

  return (
    <Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="toolPageWrapper">
        <header className="toolPageHero">
          <h1>Clone NFC Tag</h1>
          <p>
            Easily duplicate NDEF records from a source tag to a new target tag in two simple steps. Directly in your browser.
          </p>
          <div className="toolBadges">
            <span className="toolBadge">Free</span>
            <span className="toolBadge">NDEF Duplication</span>
            <span className="toolBadge">Two-step workflow</span>
            <span className="toolBadge nfcBadge">⚡ Chrome for Android only</span>
          </div>
        </header>

        <BrowserSupportNotice />

        <div className={styles.container} style={{ width: '100%', maxWidth: '720px' }}>
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading cloner…</div>}>
            <CloneNfcClient />
          </Suspense>
        </div>

        <section className="toolHowTo">
          <h2>How to Clone an NFC Tag</h2>
          <p>Duplicate your tag payload in two simple steps.</p>
          <div className="toolStepsGrid">
            <div className="toolStep">
              <div className="toolStepNum">1</div>
              <div>
                <h3>Scan Source Tag</h3>
                <p>Tap &quot;Read Source Tag&quot; and hold the original NFC tag near your phone to capture its NDEF records.</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">2</div>
              <div>
                <h3>Hold Target Tag</h3>
                <p>Switch to your blank or rewritable target tag and tap &quot;Write to Target Tag&quot;.</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">3</div>
              <div>
                <h3>Ready to Use</h3>
                <p>The new tag will now carry the identical NDEF payload (URLs, contact info, text, etc.).</p>
              </div>
            </div>
          </div>
        </section>

        <section className="toolUseCases">
          <h2>Important Cloning Notes</h2>
          <div className="toolUseCaseGrid">
            <div className="toolUseCase">
              <strong>📋 NDEF Records Only</strong>
              Clones data payloads (URLs, vCards, text). Works with standard NTAG series tags.
            </div>
            <div className="toolUseCase">
              <strong>🔒 Hardware UID Limitation</strong>
              Factory hardware UIDs (serial numbers) are hardwired at manufacturing and cannot be cloned via Web NFC.
            </div>
            <div className="toolUseCase">
              <strong>🏷️ Tag Capacity</strong>
              Ensure the target tag has sufficient memory capacity (e.g., NTAG215 or NTAG216 for large vCards).
            </div>
            <div className="toolUseCase">
              <strong>🛡️ Safe &amp; Private</strong>
              All tag scanning and writing occurs locally in your browser memory without uploading to any server.
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
