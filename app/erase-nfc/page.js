import { Suspense, Fragment } from 'react';
import EraseNfcClient from './erase-nfc-client';
import BrowserSupportNotice from '../components/BrowserSupportNotice';
import styles from './page.module.css';

export const metadata = {
  title: 'Erase NFC Tag Online | Wipe NFC Data in Browser | NfcTool',
  description: 'Wipe and clear NDEF records from any rewritable NFC tag directly in Chrome on Android. Free, fast, and secure. No app download needed.',
  keywords: ['Erase NFC', 'Clear NFC tag', 'Wipe NFC tag', 'Web NFC erase', 'NFC data eraser', 'reset NFC tag'],
  openGraph: {
    title: 'Erase NFC Tag Online | Wipe NFC Data in Browser | NfcTool',
    description: 'Safely clear data records from your NFC tag directly in Chrome for Android.',
    url: 'https://nfctool.org/erase-nfc',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Erase NFC Tag — NfcTool' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Erase NFC Tag Online | Wipe NFC Data in Browser | NfcTool',
    description: 'Safely clear data records from your NFC tag directly in Chrome for Android. Free & no app required.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  alternates: {
    canonical: 'https://nfctool.org/erase-nfc',
  },
};

export default function EraseNfcPage() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Online NFC Tag Eraser',
    applicationCategory: 'Utilities',
    operatingSystem: 'Web',
    browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
    description: 'A free online Web NFC tool to wipe existing NDEF records from any writable NFC tag.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'NfcTool' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
      { '@type': 'ListItem', position: 2, name: 'NFC Tools', item: 'https://nfctool.org/nfc-tool' },
      { '@type': 'ListItem', position: 3, name: 'Erase NFC Tag', item: 'https://nfctool.org/erase-nfc' }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can an erased NFC tag be reprogrammed with new data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Erasing simply clears the existing NDEF payload, leaving the tag clean, blank, and fully rewritable.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can permanently locked NFC tags be erased?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Once a tag has been made read-only with makeReadOnly(), the hardware lock bits prevent erasing or modifying the data.'
        }
      },
      {
        '@type': 'Question',
        name: 'What browser is required to erase NFC tags?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Chrome for Android (version 89 or newer) with NFC enabled in your device system settings.'
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
          <h1>Erase NFC Tag</h1>
          <p>
            Wipe existing NDEF records from any writable NFC tag to return it to a clean, blank state ready for new data.
          </p>
          <div className="toolBadges">
            <span className="toolBadge">Free</span>
            <span className="toolBadge">Wipes NDEF payload</span>
            <span className="toolBadge">Keeps tag rewritable</span>
            <span className="toolBadge nfcBadge">⚡ Chrome for Android only</span>
          </div>
        </header>

        <BrowserSupportNotice />

        <div className={styles.container} style={{ width: '100%', maxWidth: '720px' }}>
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading eraser…</div>}>
            <EraseNfcClient />
          </Suspense>
        </div>

        <section className="toolHowTo">
          <h2>How to Erase an NFC Tag</h2>
          <p>Clean your NFC tag in seconds.</p>
          <div className="toolStepsGrid">
            <div className="toolStep">
              <div className="toolStepNum">1</div>
              <div>
                <h3>Prepare the Tag</h3>
                <p>Ensure the tag is unlocked and rewritable (locked or read-only tags cannot be erased).</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">2</div>
              <div>
                <h3>Tap &quot;Erase Tag&quot;</h3>
                <p>Click the button and bring the back of your phone within 4 cm of the NFC tag.</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">3</div>
              <div>
                <h3>Confirmed Blank</h3>
                <p>The tool writes an empty NDEF record, removing all previous URLs, contact cards, or text.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="toolUseCases">
          <h2>Frequently Asked Questions</h2>
          <div className="toolUseCaseGrid">
            <div className="toolUseCase">
              <strong>🔄 Can I reuse the tag?</strong>
              Yes! Erasing simply clears the payload. The tag remains writable and ready for new programming.
            </div>
            <div className="toolUseCase">
              <strong>🔒 Can locked tags be erased?</strong>
              No. Once an NFC tag is permanently locked with `makeReadOnly()`, it can never be rewritten or cleared.
            </div>
            <div className="toolUseCase">
              <strong>🧹 What data is deleted?</strong>
              All NDEF records (text, URLs, vCards, WiFi) are completely cleared.
            </div>
            <div className="toolUseCase">
              <strong>📱 Device requirement</strong>
              Requires an Android device with NFC enabled running Chrome v89 or newer.
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
