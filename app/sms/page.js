import SmsToolClient from './sms-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free SMS QR Code Generator & NFC Writer | NfcTool',
    description: 'Generate an SMS QR code with a pre-filled phone number and message. Scan to open the SMS app with everything filled in. Also write to NFC tags. Free.',
    keywords: [
        'SMS QR code generator', 'SMS QR with pre-filled message', 'generate SMS QR code',
        'create SMS QR code', 'NFC SMS QR code', 'Free SMS QR code generator',
        'SMS link generator', 'NFC SMS writer', 'SMS to NFC tag',
        'send SMS with QR code', 'QR code for text message', 'NfcTool',
        'SMS NFC tag writer', 'pre-filled SMS QR', 'WebNFC SMS',
    ],
    openGraph: {
        title: 'Free SMS QR Code Generator & NFC Writer | NfcTool',
        description: 'Create an SMS QR code with a pre-filled number and message. Scan to send — no typing. Also writes to NFC tags.',
        url: 'https://nfctool.org/sms',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'SMS QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free SMS QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate an SMS QR code with a pre-filled number and message. Free, no sign-up.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/sms' },
};

export default function SmsPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SMS QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate SMS QR codes with pre-filled messages and write them to NFC tags.',
        featureList: ['Generate SMS QR codes', 'Pre-filled message support', 'Write SMS links to NFC tags', 'Customize QR colors'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    return (
        <Fragment>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
            <div className="toolPageWrapper">
                <header className="toolPageHero">
                    <h1>SMS QR Code Generator</h1>
                    <p>Create a QR code that opens the SMS app with a pre-filled phone number and message. Customers scan, message opens — just hit send.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">Pre-filled number &amp; message</span>
                        <span className="toolBadge">Works on any phone</span>
                        <span className="toolBadge">QR + NFC</span>
                    </div>
                </header>

                <SmsToolClient />

                <section className="toolHowTo">
                    <h2>How to Create an SMS QR Code</h2>
                    <p>Set up a one-tap SMS shortcut in three steps.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Enter Phone &amp; Message</h3><p>Fill in the destination phone number (with country code) and an optional pre-filled message.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>QR Generates Instantly</h3><p>The QR code updates as you type. No button click needed.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Share It</h3><p>Download as PNG to print, or write to an NFC tag so people tap to SMS.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Common Uses</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>📦 Delivery</strong>QR on a package — scan to text the delivery address question.</div>
                        <div className="toolUseCase"><strong>🏪 Feedback</strong>Put the QR at checkout — customers scan to send a review or feedback.</div>
                        <div className="toolUseCase"><strong>🎁 Promotions</strong>&ldquo;Text DEAL to 98765&rdquo; — encode it as a QR on your flyer.</div>
                        <div className="toolUseCase"><strong>🆘 Emergency</strong>NFC tag on a bag with a pre-filled SOS message to a contact.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
