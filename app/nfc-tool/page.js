import Link from 'next/link';
import styles from './page.module.css';
import NfcClientTool from './nfc-client-tool';
import { Fragment } from 'react';

export const metadata = {
  title: 'Advanced NFC Tool — Read, Write, Clone, Erase & Lock | NfcTool',
  description: 'All-in-one Web NFC tool to read, write, clone, erase, format, and lock NFC tags directly from your browser. Supports text, URL, and vCard records. No installation needed.',
  keywords: [
    'advanced NFC tool', 'NFC tag reader writer', 'clone NFC tag',
    'erase NFC tag', 'lock NFC tag', 'Web NFC browser tool',
    'NDEF tag tool', 'NFC tag manager', 'NfcTool',
  ],
  openGraph: {
    title: 'Advanced NFC Tool — Read, Write, Clone, Erase & Lock | NfcTool',
    description: 'All-in-one Web NFC tool for reading, writing, cloning, erasing, formatting, and locking NFC tags directly in your browser.',
    url: 'https://nfctool.org/nfc-tool',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Advanced NFC Tool — NfcTool' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced NFC Tool — Read, Write, Clone, Erase & Lock | NfcTool',
    description: 'All-in-one NFC tool: read, write, clone, erase, format, lock — right in your browser.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  alternates: {
    canonical: 'https://nfctool.org/nfc-tool',
  },
};

export default function NfcToolPage() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Advanced NFC Web Tool',
    applicationCategory: 'Utilities',
    operatingSystem: 'Web',
    browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
    description: 'An all-in-one Web NFC tool to read, write, clone, erase, format, and lock NFC tags directly from your browser.',
    featureList: ['Read NFC tags', 'Write NFC tags', 'Clone NFC tags', 'Erase NFC tags', 'Format NFC tags', 'Lock NFC tags'],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'NfcTool' }
  };

  return (
    <Fragment>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <div className="toolPageWrapper">
        <header className="toolPageHero">
          <h1>Advanced NFC Tool</h1>
          <p>The complete NFC toolkit — read, write, clone, erase, format, and permanently lock any NFC tag, all from your phone&apos;s browser.</p>
          <div className="toolBadges">
            <span className="toolBadge">Read · Write · Clone · Erase · Lock</span>
            <span className="toolBadge">Text · URL · vCard</span>
            <span className="toolBadge nfcBadge">⚡ Chrome for Android only</span>
          </div>
        </header>

        <div className="toolCompatNote">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><strong>Requires Chrome on Android (v89+)</strong> with NFC enabled. For simpler read/write, try the <Link href="/read-nfc" style={{color:'inherit',textDecoration:'underline'}}>NFC Reader</Link> or <Link href="/write-nfc" style={{color:'inherit',textDecoration:'underline'}}>NFC Writer</Link>.</span>
        </div>

        <div className={styles.container} style={{width:'100%'}}>
          <NfcClientTool />
        </div>

        <section className="toolHowTo">
          <h2>Tool Operations Guide</h2>
          <p>Each panel handles a different NFC operation.</p>
          <div className="toolStepsGrid">
            <div className="toolStep">
              <div className="toolStepNum">📖</div>
              <div><h3>Read</h3><p>Scan a tag to see all its records — serial number, size, type, writability, and content.</p></div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">✏️</div>
              <div><h3>Write</h3><p>Write text, a URL, or a vCard contact to a blank or writable tag.</p></div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">🔄</div>
              <div><h3>Clone</h3><p>Read a source tag, then write the same NDEF data to a new blank tag. Note: the UID cannot be cloned.</p></div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">🗑️</div>
              <div><h3>Erase</h3><p>Wipe all NDEF records from a tag. The tag remains writable and can be reprogrammed.</p></div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">⚙️</div>
              <div><h3>Format</h3><p>Prepare a new tag for NDEF use. Use on factory-blank tags that don&apos;t have NDEF yet.</p></div>
            </div>
            <div className="toolStep">
              <div className="toolStepNum">🔒</div>
              <div><h3>Lock</h3><p><strong>Permanent &amp; irreversible.</strong> Makes the tag permanently read-only. Cannot be undone.</p></div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
