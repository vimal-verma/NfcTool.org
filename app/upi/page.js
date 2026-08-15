import UpiToolClient from './upi-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free UPI QR Code Generator & NFC Writer | NfcTool',
    description: 'Instantly generate a UPI QR code for payments with optional fixed amount. Write to an NFC tag for tap-to-pay. Free, no sign-up required.',
    keywords: [
        'UPI QR code generator', 'UPI QR generator', 'UPI QR with fixed amount',
        'fixed amount UPI QR', 'generate UPI QR code', 'UPI payment QR code',
        'NFC UPI QR code', 'Free UPI QR code generator', 'UPI payment link',
        'NFC UPI writer', 'WebNFC UPI', 'UPI QR code for shops',
        'UPI to NFC tag', 'UPI NFC tag writer', 'tap to pay NFC', 'NfcTool',
    ],
    openGraph: {
        title: 'Free UPI QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a UPI payment QR code with optional fixed amount. Write to NFC for tap-to-pay. Free, no sign-up.',
        url: 'https://nfctool.org/upi',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'UPI QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free UPI QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a UPI payment QR code — set a fixed amount, download, or write to NFC.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/upi' },
};

export default function UpiPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'UPI QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate UPI QR codes for payments and write them directly to NFC tags.',
        featureList: ['Generate UPI QR codes', 'Fixed amount UPI QR', 'Write UPI links to NFC tags', 'Customize QR colors', 'Add logo to QR code'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    return (
        <Fragment>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
            <div className="toolPageWrapper">
                <header className="toolPageHero">
                    <h1>UPI QR Code Generator</h1>
                    <p>Generate a UPI payment QR code for your VPA in seconds. Optionally set a fixed amount — perfect for shops, freelancers, and events.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">Fixed amount support</span>
                        <span className="toolBadge">All UPI apps</span>
                        <span className="toolBadge">QR + NFC tap-to-pay</span>
                    </div>
                </header>

                <UpiToolClient />

                <section className="toolHowTo">
                    <h2>How to Generate a UPI QR Code</h2>
                    <p>Ready in under 30 seconds.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Enter Your UPI ID</h3><p>Type your UPI VPA (like <em>yourname@bank</em>) and your display name.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>Set Amount (Optional)</h3><p>Add a fixed amount and note if needed — ideal for shops with a set price.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Download or Write to NFC</h3><p>Download the QR code as PNG, or on Android Chrome write the payment link to an NFC sticker for tap-to-pay.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Who Uses UPI QR Codes?</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>🛍️ Retail Shops</strong>Display at checkout — customers scan and pay the exact amount.</div>
                        <div className="toolUseCase"><strong>🍽️ Restaurants</strong>Print on the bill or table — no change, no waiting.</div>
                        <div className="toolUseCase"><strong>💼 Freelancers</strong>Add to invoices or business cards so clients pay instantly.</div>
                        <div className="toolUseCase"><strong>🎪 Events</strong>NFC tag at entry — tap to pay entry fees or donations.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
