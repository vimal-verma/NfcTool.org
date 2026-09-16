import LocationToolClient from './location-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free Location QR Code Generator & NFC Writer | NfcTool',
    description: 'Generate a location QR code using GPS coordinates or DigiPin. Scan to open in Google Maps or any map app. Write to NFC tags. Free, no sign-up.',
    keywords: [
        'Location QR code generator', 'Geo QR generator', 'GPS QR code',
        'Google Maps QR code', 'DigiPin QR code', 'India digital address QR',
        'generate Location QR code', 'NFC Location QR code',
        'Free Location QR code generator', 'Geo URI QR', 'NFC Location writer',
        'Location to NFC tag', 'QR code for coordinates', 'DigiPin NFC',
        'share location with QR code', 'NfcTool', 'maps QR code',
    ],
    openGraph: {
        title: 'Free Location QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a QR code for GPS coordinates or DigiPin. Scan to open in Maps. Write to NFC for tap-to-navigate.',
        url: 'https://nfctool.org/location',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Location QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Location QR Code Generator & NFC Writer | NfcTool',
        description: 'Create a location QR code — scan to navigate. Supports GPS coordinates and DigiPin.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/location' },
};

export default function LocationPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Location & DigiPin QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate location QR codes using Geo URIs or DigiPin, and write them to NFC tags.',
        featureList: ['Generate Geo URI QR codes', 'DigiPin QR support', 'Write location to NFC tags', 'Google Maps compatible', 'Customize QR colors'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
            { '@type': 'ListItem', position: 2, name: 'Location QR Code Generator', item: 'https://nfctool.org/location' }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What map applications open with a Geo QR code?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'When scanned, geo: URIs automatically open in Google Maps, Apple Maps, or whichever default navigation application is installed on the device.'
                }
            },
            {
                '@type': 'Question',
                name: 'What is DigiPin support?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'DigiPin is India\'s digital address system that provides a precise alphanumeric code for any location. Our tool converts your DigiPin directly into coordinates and a scannable navigation QR code.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can I write coordinates to an NFC tag for tap-to-navigate?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! On Chrome for Android, clicking "Write to NFC" writes a standard Geo URI directly to an NFC tag so anyone can tap it and instantly start navigation.'
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
                    <h1>Location QR Code Generator</h1>
                    <p>Turn GPS coordinates into a scannable QR code that opens directly in Google Maps or any navigation app. Also supports India&apos;s DigiPin address system.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">GPS Coordinates</span>
                        <span className="toolBadge">DigiPin support</span>
                        <span className="toolBadge">QR + NFC</span>
                    </div>
                </header>

                <LocationToolClient />

                <section className="toolHowTo">
                    <h2>How to Create a Location QR Code</h2>
                    <p>Share your exact location — no address needed.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Enter Coordinates or DigiPin</h3><p>Type latitude/longitude or your DigiPin (India&apos;s digital address). Find your coordinates from Google Maps.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>QR Code is Ready</h3><p>The Geo URI QR generates instantly. Scanning opens the location in Google Maps or the default map app.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Download or Write to NFC</h3><p>Save as PNG to share or print. Or write to an NFC tag for tap-to-navigate directions.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Common Uses</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>📍 Venues &amp; Shops</strong>QR on your website or card — customers scan to get directions.</div>
                        <div className="toolUseCase"><strong>🏕️ Remote Spots</strong>Mark a campsite, trail entrance, or meetup point that doesn&apos;t have an address.</div>
                        <div className="toolUseCase"><strong>🚚 Delivery</strong>Encode exact drop-off coordinates for deliveries to large campuses.</div>
                        <div className="toolUseCase"><strong>🏷️ NFC Signage</strong>Tap an NFC sticker at a venue entrance — phone opens navigation instantly.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
