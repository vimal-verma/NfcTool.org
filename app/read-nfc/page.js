import { Suspense, Fragment } from 'react';
import ReadNfcClient from './read-nfc-client';
import BrowserSupportNotice from '../components/BrowserSupportNotice';
import styles from './page.module.css';

export const metadata = {
    title: 'Read NFC Tag Online | Free Web NFC Reader | NfcTool',
    description: 'Use our free online tool to read data from any NFC tag directly in your browser. Supports text, URLs, contact cards (vCards), WiFi credentials, and more. No app required.',
    keywords: [
        'NFC tag reader online', 'read NFC tag', 'free NFC reader',
        'Web NFC reader', 'scan NFC tag', 'read vCard from NFC',
        'NFC tag scanner', 'NFC contact card reader', 'WebNFC',
    ],
    openGraph: {
        title: 'Read NFC Tag Online | Free Web NFC Reader | NfcTool',
        description: 'Use our free online tool to read data from any NFC tag directly in your browser. Supports text, URLs, contact cards (vCards), WiFi credentials, and more.',
        url: 'https://nfctool.org/read-nfc',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NFC Tag Reader — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Read NFC Tag Online | Free Web NFC Reader | NfcTool',
        description: 'Instantly read any NFC tag in your browser — text, URL, vCard, WiFi. No app required.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: {
        canonical: 'https://nfctool.org/read-nfc',
    },
};

export default function ReadNfcPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Online NFC Tag Reader',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
        description: 'A free online tool to read data from any NFC tag directly in your browser — supports text, URL, vCard, and WiFi records.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
            { '@type': 'ListItem', position: 2, name: 'NFC Tools', item: 'https://nfctool.org/nfc-tool' },
            { '@type': 'ListItem', position: 3, name: 'Read NFC Tag', item: 'https://nfctool.org/read-nfc' }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'How do I scan an NFC tag with my phone browser?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Open this page in Chrome for Android (v89+), ensure NFC is enabled in phone settings, click Start Scan, and hold the tag near the back of your phone.'
                }
            },
            {
                '@type': 'Question',
                name: 'Which NFC tags are compatible with this online reader?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'All standard NFC Forum Type 2 tags (such as NTAG213, NTAG215, NTAG216), Type 4, and Type 5 tags containing standard NDEF records.'
                }
            },
            {
                '@type': 'Question',
                name: 'Does Web NFC work on iPhone or iPad?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Currently, Apple does not support the Web NFC API in iOS browsers. You can use an Android device with Chrome or use our QR code tools on iPhone.'
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
                    <h1>Online NFC Tag Reader</h1>
                    <p>Tap any NFC tag to instantly read its contents — text, URLs, contact cards, or WiFi credentials — right in your browser. No app needed.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">No sign-up</span>
                        <span className="toolBadge">Supports vCard, URL, Text, WiFi</span>
                        <span className="toolBadge nfcBadge">⚡ Chrome for Android only</span>
                    </div>
                </header>

                <BrowserSupportNotice />

                <div className={styles.toolContainer} style={{maxWidth: '700px', width: '100%', padding: '0 1rem'}}>
                    <Suspense fallback={<div style={{padding:'2rem',textAlign:'center',color:'var(--text-secondary)'}}>Loading scanner…</div>}>
                        <ReadNfcClient />
                    </Suspense>
                </div>

                <section className="toolHowTo">
                    <h2>How to Read an NFC Tag</h2>
                    <p>Three steps, no installation needed.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div>
                                <h3>Open on Android Chrome</h3>
                                <p>Open this page on Chrome for Android and make sure NFC is enabled in your phone&apos;s settings.</p>
                            </div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div>
                                <h3>Tap &ldquo;Start Scan&rdquo;</h3>
                                <p>Press the button and hold the back of your phone near the NFC tag (usually within 4 cm).</p>
                            </div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div>
                                <h3>View &amp; Save</h3>
                                <p>The tag contents appear instantly. Copy the data, save vCards as .vcf, or open URLs directly.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>What Can You Read?</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>🔗 URLs &amp; Links</strong>Opens the website or app link stored on the tag.</div>
                        <div className="toolUseCase"><strong>📇 vCard Contacts</strong>Reads name, phone, email, and company. Save as .vcf to your contacts.</div>
                        <div className="toolUseCase"><strong>📝 Plain Text</strong>Reads any custom text message written to the tag.</div>
                        <div className="toolUseCase"><strong>📶 WiFi Credentials</strong>Extracts SSID and password. Copy and connect manually.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
