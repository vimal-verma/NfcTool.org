import { Suspense, Fragment } from 'react';
import WriteTagClient from './write-tag-client';
import BrowserSupportNotice from '../components/BrowserSupportNotice';
import styles from './page.module.css';

export const metadata = {
    title: 'Write to NFC Tag Online | Free Web NFC Writer | NfcTool',
    description: 'Use our free online tool to write text, URLs, or contact cards (vCards) to any NFC tag directly in your browser. No app installation required.',
    keywords: [
        'NFC tag writer online', 'write NFC tag', 'free NFC writer',
        'Web NFC writer', 'write vCard to NFC', 'write URL to NFC',
        'program NFC tag', 'NFC tag encoder', 'WebNFC',
    ],
    openGraph: {
        title: 'Write to NFC Tag Online | Free Web NFC Writer | NfcTool',
        description: 'Write text, URLs, or vCards to any NFC tag with a single tap — directly in your browser. No app required.',
        url: 'https://nfctool.org/write-nfc',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NFC Tag Writer — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Write to NFC Tag Online | Free Web NFC Writer | NfcTool',
        description: 'Write text, URLs, or vCards to any NFC tag in your browser. Free, no app needed.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: {
        canonical: 'https://nfctool.org/write-nfc',
    },
};

export default function WriteTagPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Online NFC Tag Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
        description: 'A free online tool to write text, URLs, and vCards to NFC tags directly in your browser.',
        featureList: ['Write text to NFC tags', 'Write URLs to NFC tags', 'Write vCard contacts to NFC tags', 'Automatic tag size suggestion'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
            { '@type': 'ListItem', position: 2, name: 'NFC Tools', item: 'https://nfctool.org/nfc-tool' },
            { '@type': 'ListItem', position: 3, name: 'Write NFC Tag', item: 'https://nfctool.org/write-nfc' }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What can I write to an NFC tag online?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You can write website URLs, social profiles, plain text, and digital vCard contact cards directly from your Android browser.'
                }
            },
            {
                '@type': 'Question',
                name: 'What NFC tag size do I need?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'For URLs and short text (under 130 bytes), standard NTAG213 tags (144 bytes) work great. For full vCard contact cards with photos or address info, NTAG215 (504 bytes) or NTAG216 (888 bytes) is recommended.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can I overwrite an NFC tag later?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, as long as the tag has not been permanently locked using makeReadOnly(), you can rewrite it as many times as you like.'
                }
            }
        ]
    };

    return (
        <Fragment>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="toolPageWrapper">
                <header className="toolPageHero">
                    <h1>Online NFC Tag Writer</h1>
                    <p>Choose a data type, enter your content, and tap your NFC tag to write — instantly, from any Chrome for Android browser.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">Text · URL · vCard</span>
                        <span className="toolBadge">Blank tag required</span>
                        <span className="toolBadge nfcBadge">⚡ Chrome for Android only</span>
                    </div>
                </header>

                <BrowserSupportNotice />

                <p className="toolHint">
                    <strong>Tip:</strong> use a blank or rewritable NDEF tag — NTAG213, NTAG215,
                    or NTAG216 all work well.
                </p>

                <div className={styles.toolContainer} style={{width:'100%', padding:'0 1rem'}}>
                    <Suspense fallback={<div style={{padding:'2rem',textAlign:'center',color:'var(--text-secondary)'}}>Loading writer…</div>}>
                        <WriteTagClient />
                    </Suspense>
                </div>

                <section className="toolHowTo">
                    <h2>How to Write to an NFC Tag</h2>
                    <p>Program a blank NFC tag in three simple steps.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div>
                                <h3>Choose a Type</h3>
                                <p>Select <em>Text</em>, <em>URL</em>, or <em>Contact Card (vCard)</em> and fill in your data.</p>
                            </div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div>
                                <h3>Tap &ldquo;Write to NFC Tag&rdquo;</h3>
                                <p>Press the write button, then hold your phone&apos;s back to the NFC tag when prompted.</p>
                            </div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div>
                                <h3>Done &mdash; Tag is Programmed</h3>
                                <p>The log confirms success. Your tag now stores the data and can be read by any NFC-enabled phone.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>What Can You Write?</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>📝 Plain Text</strong>Write any message — instructions, notes, or product info.</div>
                        <div className="toolUseCase"><strong>🔗 URL / Link</strong>Tap to open a website, app link, or payment page instantly.</div>
                        <div className="toolUseCase"><strong>📇 vCard Contact</strong>Share your name, phone, email, and company. Saves directly to contacts.</div>
                        <div className="toolUseCase"><strong>💡 Tag Size Guide</strong>NTAG213 (144B) for URLs · NTAG215 (504B) for vCards · NTAG216 (888B) for large data.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
