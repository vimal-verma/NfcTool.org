import { Suspense, Fragment } from 'react';
import LockNfcClient from './lock-nfc-client';
import BrowserSupportNotice from '../components/BrowserSupportNotice';
import styles from './page.module.css';

export const metadata = {
  title: 'Lock NFC Tag Permanently | Free Online Web NFC Tool | NfcTool',
  description: 'Make your NFC tag permanently read-only using Web NFC. Prevent data tampering or accidental modification. Chrome on Android only.',
  keywords: ['Lock NFC', 'Read-only NFC tag', 'Permanent lock NFC', 'Web NFC makeReadOnly', 'Protect NFC tag', 'write protect NFC'],
  openGraph: {
    title: 'Lock NFC Tag Permanently | Free Online Web NFC Tool | NfcTool',
    description: 'Permanently lock your NFC tag records to prevent editing or overwriting.',
    url: 'https://nfctool.org/lock-nfc',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Lock NFC Tag — NfcTool' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lock NFC Tag Permanently | Free Online Web NFC Tool | NfcTool',
    description: 'Make your NFC tag permanently read-only using Web NFC in Chrome on Android. Free tool.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  alternates: {
    canonical: 'https://nfctool.org/lock-nfc',
  },
};

export default function LockNfcPage() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Online NFC Tag Locker',
    applicationCategory: 'Utilities',
    operatingSystem: 'Web',
    browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
    description: 'A free online Web NFC tool to permanently lock NFC tags to read-only status.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'NfcTool' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
      { '@type': 'ListItem', position: 2, name: 'NFC Tools', item: 'https://nfctool.org/nfc-tool' },
      { '@type': 'ListItem', position: 3, name: 'Lock NFC Tag', item: 'https://nfctool.org/lock-nfc' }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is locking an NFC tag permanent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, permanently and irreversibly. Web NFC burns the hardware OTP (one-time programmable) lock bits on the tag chip. No app or tool can undo this.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can people still read a locked NFC tag?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Read access is completely unaffected. Phones and NFC readers can continue scanning the tag indefinitely, but the data can never be modified.'
        }
      },
      {
        '@type': 'Question',
        name: 'What tags can be locked with this tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard NFC Forum Type 2 tags such as NTAG213, NTAG215, and NTAG216.'
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
          <h1>Lock NFC Tag</h1>
          <p>
            Make your NFC tag permanently read-only to safeguard public links, payment tags, or smart posters against accidental changes or tampering.
          </p>
          <div className="toolBadges">
            <span className="toolBadge">Free</span>
            <span className="toolBadge">Permanent Read-Only</span>
            <span className="toolBadge">Hardware Locked</span>
            <span className="toolBadge nfcBadge">⚡ Chrome for Android only</span>
          </div>
        </header>

        <BrowserSupportNotice />

        <div className={styles.container} style={{ width: '100%', maxWidth: '720px' }}>
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading locker…</div>}>
            <LockNfcClient />
          </Suspense>
        </div>

        <section className="toolHowTo">
          <h2>How to Lock an NFC Tag</h2>
          <p>Carefully follow these steps — locking cannot be undone.</p>
          <div className="toolStepsGrid">
            <div className="toolStep">
              <div className="toolStepNum">1</div>
              <div>
                <h3>Verify Payload First</h3>
                <p>Read your tag with the NFC Reader to be 100% certain the data (URL, vCard) is completely correct.</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">2</div>
              <div>
                <h3>Tap &quot;Lock Tag Permanently&quot;</h3>
                <p>Confirm the warning prompt and hold the tag steady against the back of your phone.</p>
              </div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">3</div>
              <div>
                <h3>Permanently Protected</h3>
                <p>Hardware lock bits are burned. The tag is now read-only for lifetime and cannot be overwritten.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="toolUseCases">
          <h2>Important Locking Notes</h2>
          <div className="toolUseCaseGrid">
            <div className="toolUseCase">
              <strong>⚠️ IRREVERSIBLE ACTION</strong>
              Locking sets the tag OTP (one-time programmable) lock bits. It cannot be unlocked by any software or device.
            </div>
            <div className="toolUseCase">
              <strong>🏢 Best For Public Tags</strong>
              Ideal for tags placed in public areas, exhibition posters, storefront menus, or marketing displays.
            </div>
            <div className="toolUseCase">
              <strong>💳 Payment &amp; Contact Tags</strong>
              Prevents malicious actors from reprogramming your desk business card or donation payment tag.
            </div>
            <div className="toolUseCase">
              <strong>🏷️ Tag Support</strong>
              Supports standard NTAG213, NTAG215, and NTAG216 tags via `NDEFReader.makeReadOnly()`.
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
