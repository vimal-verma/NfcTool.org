import { Suspense, Fragment } from 'react';
import FormatNfcClient from './format-nfc-client';
import BrowserSupportNotice from '../components/BrowserSupportNotice';
import styles from './page.module.css';

export const metadata = {
  title: 'Format NFC Tag Online | Initialize NDEF in Browser | NfcTool',
  description: 'Format unformatted or corrupted NFC tags for NDEF messaging directly in Chrome on Android. Free, fast, and easy. No app download needed.',
  keywords: ['Format NFC', 'NFC NDEF format', 'Reformat NFC tag', 'Web NFC format', 'Initialize NFC tag', 'repair NFC tag'],
  openGraph: {
    title: 'Format NFC Tag Online | Initialize NDEF in Browser | NfcTool',
    description: 'Initialize and format NFC tags for NDEF messaging directly in Chrome on Android.',
    url: 'https://nfctool.org/format-nfc',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Format NFC Tag — NfcTool' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Format NFC Tag Online | Initialize NDEF in Browser | NfcTool',
    description: 'Format unformatted NFC tags for standard NDEF messaging directly in Chrome on Android.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  alternates: {
    canonical: 'https://nfctool.org/format-nfc',
  },
};

export default function FormatNfcPage() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Online NFC Tag Formatter',
    applicationCategory: 'Utilities',
    operatingSystem: 'Web',
    browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
    description: 'A free online tool to format unformatted NFC tags into standard NDEF format directly in your browser.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'NfcTool' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
      { '@type': 'ListItem', position: 2, name: 'Format NFC', item: 'https://nfctool.org/format-nfc' }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does formatting an NFC tag do?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Formatting initializes the NFC tag with an empty standard NDEF (NFC Data Exchange Format) record structure, restoring corrupted payloads and preparing blank tags for reading and writing.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I format locked or read-only NFC tags?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. If an NFC tag has had its hardware lock bits irreversibly set to permanent read-only, it cannot be reformatted or overwritten.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which NFC chip types can be formatted online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This tool supports standard NDEF Type 2 chips (such as NTAG213, NTAG215, NTAG216) as well as Type 4 and Type 5 compliant NFC tags using Chrome on Android.'
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
          <h1>Format NFC Tag</h1>
          <p>
            Prepare and initialize NFC tags for NDEF data storage, fixing incompatible payloads or initializing factory-blank tags.
          </p>
          <div className="toolBadges">
            <span className="toolBadge">Free</span>
            <span className="toolBadge">NDEF Initialization</span>
            <span className="toolBadge">Fixes Tag Read Errors</span>
            <span className="toolBadge nfcBadge">⚡ Chrome for Android only</span>
          </div>
        </header>

        <BrowserSupportNotice />

        <div className={styles.container} style={{ width: '100%', maxWidth: '720px' }}>
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading formatter…</div>}>
            <FormatNfcClient />
          </Suspense>
        </div>

        <section className="toolHowTo">
          <h2>How to Format an NFC Tag</h2>
          <p>Three simple steps to re-initialize your tag.</p>
          <div className="toolStepsGrid">
            <div className="toolStep">
              <div className="toolStepNum">1</div>
              <div>
                <h3>Connect Phone</h3>
                <p>Open Chrome on Android with NFC turned on in your phone settings.</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">2</div>
              <div>
                <h3>Tap &quot;Format Tag&quot;</h3>
                <p>Press the button and tap your tag against the back of your phone.</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">3</div>
              <div>
                <h3>NDEF Ready</h3>
                <p>The tag is formatted with a standard NDEF structure, ready to write URLs, vCards, or text.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="toolUseCases">
          <h2>When Should You Format?</h2>
          <div className="toolUseCaseGrid">
            <div className="toolUseCase">
              <strong>🏭 Brand New Tags</strong>
              Some factory-produced tags arrive without an NDEF record structure. Formatting creates it.
            </div>
            <div className="toolUseCase">
              <strong>⚠️ Corrupted Payloads</strong>
              If a previous write was interrupted or produced an unreadable tag, formatting restores NDEF compliance.
            </div>
            <div className="toolUseCase">
              <strong>🔄 Preparing for Reuse</strong>
              Resetting tag structure before handing it off for a new campaign or digital business card.
            </div>
            <div className="toolUseCase">
              <strong>✅ Tag Types Supported</strong>
              Fully compatible with Type 2 (NTAG213, NTAG215, NTAG216) and Type 4/5 NFC tags.
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
