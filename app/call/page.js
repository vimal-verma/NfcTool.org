import CallToolClient from './call-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free Phone Call QR Code Generator & NFC Writer | NfcTool',
    description: 'Generate a QR code that dials a phone number instantly when scanned. Download as PNG or write to an NFC tag. Free, no sign-up required.',
    keywords: [
        'Call QR code generator', 'phone number QR code', 'dial QR code',
        'generate Call QR code', 'create call QR code', 'NFC call QR code',
        'Free Call QR code generator', 'call link QR', 'NFC call writer',
        'WebNFC call', 'call to NFC tag', 'NFC dial tag',
        'QR code to call phone', 'NfcTool', 'click to call QR',
    ],
    openGraph: {
        title: 'Free Phone Call QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a QR code that dials a number on scan. Download or write to NFC. Free, no sign-up.',
        url: 'https://nfctool.org/call',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Phone Call QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Phone Call QR Code Generator & NFC Writer | NfcTool',
        description: 'Create a call QR code — scan to dial instantly. Free, no sign-up.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/call' },
};

export default function CallPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Call QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate call QR codes that dial a phone number when scanned.',
        featureList: ['Generate call QR codes', 'Write call links to NFC tags', 'Customize QR colors', 'Add logo to QR code'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
            { '@type': 'ListItem', position: 2, name: 'Call QR Code Generator', item: 'https://nfctool.org/call' }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'How does a call QR code work?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A call QR code encodes a standard tel: link. When a phone scans it, the device immediately opens the phone dialer with the encoded number pre-filled.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can I write a phone number to an NFC tag for tap-to-call?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! On Chrome for Android, click "Write to NFC" and tap your tag. The tag will encode a tel: URI that initiates a phone call when tapped.'
                }
            },
            {
                '@type': 'Question',
                name: 'Do call QR codes require internet access to scan?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No internet access is required to scan or dial a call QR code. The phone dialer handles the tel: scheme entirely offline.'
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
                    <h1>Phone Call QR Code Generator</h1>
                    <p>Create a QR code that opens the dialler with your phone number pre-filled. Scan and call — one tap, no searching for contacts.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">No sign-up</span>
                        <span className="toolBadge">Works on any phone</span>
                        <span className="toolBadge">QR + NFC</span>
                    </div>
                </header>

                <CallToolClient />

                <section className="toolHowTo">
                    <h2>How to Create a Call QR Code</h2>
                    <p>Done in under a minute.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Enter Phone Number</h3><p>Type the full number with country code (e.g. <code>+91 98765 43210</code>).</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>QR Appears Instantly</h3><p>Your QR code is ready as soon as you type. Customize colors if you like.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Share or Write to NFC</h3><p>Download to print, or write to an NFC sticker for tap-to-call on your desk or product.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Common Uses</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>🏥 Clinics</strong>QR on reception desk — scan to call the appointment line.</div>
                        <div className="toolUseCase"><strong>🚗 Service Centers</strong>Put a call QR on service vehicles so customers reach you instantly.</div>
                        <div className="toolUseCase"><strong>📇 Business Cards</strong>Add a call QR — no need to save the number first.</div>
                        <div className="toolUseCase"><strong>🏷️ NFC Stickers</strong>Tap an NFC tag on your desk to dial customer support.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
