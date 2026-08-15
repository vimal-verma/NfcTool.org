import WIFIToolClient from './wifi-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free WiFi QR Code Generator & NFC Writer | NfcTool',
    description: 'Instantly generate a WiFi QR code to share your network credentials. Scan to connect — no typing required. Also write directly to an NFC tag. Free, no sign-up.',
    keywords: [
        'WiFi QR code generator', 'WiFi QR generator', 'WiFi QR code',
        'generate WiFi QR code', 'share WiFi password QR', 'WiFi network QR code',
        'NFC WiFi setup', 'NFC WiFi writer', 'WiFi to NFC tag',
        'connect to WiFi with QR code', 'Free WiFi QR code generator', 'NfcTool',
        'WiFi NFC tag writer', 'custom WiFi QR code', 'WebNFC WiFi',
    ],
    openGraph: {
        title: 'Free WiFi QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a WiFi QR code to share network credentials. Scan to connect instantly — or write to an NFC tag.',
        url: 'https://nfctool.org/wifi',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'WiFi QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free WiFi QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a WiFi QR code — share your network in one scan. Free, no sign-up.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/wifi' },
};

export default function WIFIPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'WiFi QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate WiFi QR codes and write WiFi credentials to NFC tags.',
        featureList: ['Generate WiFi QR codes', 'Write WiFi data to NFC tags', 'Customize QR colors', 'Add logo to QR code'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    return (
        <Fragment>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
            <div className="toolPageWrapper">
                <header className="toolPageHero">
                    <h1>WiFi QR Code Generator</h1>
                    <p>Enter your WiFi network name and password to generate a QR code. Anyone who scans it connects automatically — no typing the password.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">No sign-up</span>
                        <span className="toolBadge">WPA2 · WPA3 · WEP · Open</span>
                        <span className="toolBadge">QR + NFC</span>
                    </div>
                </header>

                <WIFIToolClient />

                <section className="toolHowTo">
                    <h2>How to Create a WiFi QR Code</h2>
                    <p>Share your WiFi in seconds — works on any device.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Enter Network Details</h3><p>Fill in your WiFi SSID (network name), password, and security type (WPA2 is most common).</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>QR Code Appears Instantly</h3><p>Your QR code is generated in real-time as you type. No button to press.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Download, Print or Tap</h3><p>Download as PNG to print and display. On Chrome for Android, also write to an NFC tag for tap-to-connect.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Perfect For</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>🏠 Home</strong>Put a QR code on your fridge so guests connect without asking for the password.</div>
                        <div className="toolUseCase"><strong>☕ Cafés &amp; Shops</strong>Print and display your guest WiFi QR code at the counter.</div>
                        <div className="toolUseCase"><strong>🏢 Offices</strong>Put the QR code in meeting rooms so visitors connect instantly.</div>
                        <div className="toolUseCase"><strong>📶 NFC Tags</strong>Write to a tag at your front door — guests tap to connect automatically.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
