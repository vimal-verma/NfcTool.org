import UrlToolClient from './url-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free URL QR Code Generator & NFC Writer | NfcTool',
    description: 'Generate a QR code for any website URL — or add multiple URLs in one QR. Write the link directly to an NFC tag. Free, instant, no sign-up.',
    keywords: [
        'URL QR code generator', 'URL QR generator', 'website QR code',
        'generate URL QR code', 'create URL QR code', 'NFC URL QR code',
        'Free URL QR code generator', 'URL NFC writer', 'WebNFC URL',
        'URL to NFC tag', 'NFC URL tag writer', 'QR code for website',
        'open website with QR code', 'multi-URL QR code', 'NfcTool',
    ],
    openGraph: {
        title: 'Free URL QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a QR code for one or more website URLs. Download as PNG or write to an NFC tag. Free, no sign-up.',
        url: 'https://nfctool.org/url',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'URL QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free URL QR Code Generator & NFC Writer | NfcTool',
        description: 'Create a QR code for any website URL — or stack multiple URLs in one QR.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/url' },
};

export default function UrlPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'URL QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate URL QR codes and write them directly to NFC tags.',
        featureList: ['Generate URL QR codes', 'Multi-URL QR support', 'Write URL links to NFC tags', 'Customize QR colors', 'Add logo to QR code'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
            { '@type': 'ListItem', position: 2, name: 'URL QR Code Generator', item: 'https://nfctool.org/url' }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'How do I create a URL QR code?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Simply enter or paste your website link (e.g., https://yourwebsite.com). The QR code is generated instantly in real time. You can customize colors, add logos, and download it as PNG.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can I write a website link to an NFC tag using this tool?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! On Chrome for Android, tap the "Write to NFC" button and bring your NFC tag near the back of your phone to write the URL directly into an NDEF URI record.'
                }
            },
            {
                '@type': 'Question',
                name: 'Do URL QR codes expire?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No, static URL QR codes never expire. As long as your destination website URL remains active, the QR code will continue to work indefinitely.'
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
                    <h1>URL QR Code Generator</h1>
                    <p>Turn any website link into a scannable QR code. Add up to multiple URLs in a single QR — ideal for sharing your social profiles, portfolio, or shop links in one tap.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">Single &amp; multi-URL</span>
                        <span className="toolBadge">Custom colors &amp; logo</span>
                        <span className="toolBadge">QR + NFC</span>
                    </div>
                </header>

                <UrlToolClient />

                <section className="toolHowTo">
                    <h2>How to Create a URL QR Code</h2>
                    <p>Paste a link and your QR code is ready instantly.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Enter Your URL</h3><p>Paste any website link starting with <code>https://</code>. Add more URLs with the &ldquo;+ Add another URL&rdquo; button.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>Customize (Optional)</h3><p>Change QR code colors, add your logo, or choose a stylish background from the Advanced Editor.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Download or Write</h3><p>Download as PNG, copy the link, or write to an NFC tag on Chrome for Android.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Common Uses</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>🌐 Website</strong>QR code for your homepage, app, or landing page.</div>
                        <div className="toolUseCase"><strong>📱 Social Links</strong>Link all your social profiles in one multi-URL QR.</div>
                        <div className="toolUseCase"><strong>📄 Resume / Portfolio</strong>Add a QR on your CV — recruiters scan to view online.</div>
                        <div className="toolUseCase"><strong>🏷️ NFC Tags</strong>Write the URL to a tag on a product, poster, or business card.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
