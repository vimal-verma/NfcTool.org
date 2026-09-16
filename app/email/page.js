import EmailToolClient from './email-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free Email QR Code Generator & NFC Writer | NfcTool',
    description: 'Generate a QR code that opens an email with a pre-filled address, subject, and body. Scan to send — no typing. Also writes to NFC tags. Free.',
    keywords: [
        'Email QR code generator', 'Email QR with subject and body',
        'generate Email QR code', 'create email QR code', 'NFC Email QR code',
        'Free Email QR code generator', 'pre-filled email QR', 'NFC Email writer',
        'Email to NFC tag', 'QR code for email', 'send Email with QR code',
        'mailto QR code', 'NfcTool', 'email link QR', 'WebNFC Email',
    ],
    openGraph: {
        title: 'Free Email QR Code Generator & NFC Writer | NfcTool',
        description: 'Create an email QR code with pre-filled address, subject & body. Scan to open in mail app. Also writes to NFC tags.',
        url: 'https://nfctool.org/email',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Email QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Email QR Code Generator & NFC Writer | NfcTool',
        description: 'Create an email QR code with pre-filled address, subject, and body. Free, no sign-up.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/email' },
};

export default function EmailPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Email QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate email QR codes with pre-filled mailto links.',
        featureList: ['Generate email QR codes', 'Pre-filled subject and body', 'Write email links to NFC tags', 'Customize QR colors'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
            { '@type': 'ListItem', position: 2, name: 'Email QR Code Generator', item: 'https://nfctool.org/email' }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'How does an email QR code work?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'When scanned with any smartphone camera, the QR code triggers a mailto link that opens the user\'s default mail client with your pre-defined recipient address, subject line, and body message automatically filled in.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can I write an email draft link to an NFC tag?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Using Chrome on an Android device with NFC support, you can write the mailto URI directly to an NFC chip so tapping opens the email app immediately.'
                }
            },
            {
                '@type': 'Question',
                name: 'Do users need any special app to scan the email QR code?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No. The standard camera app on modern iOS and Android devices natively recognizes mailto QR codes and prompts to open the email app.'
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
                    <h1>Email QR Code Generator</h1>
                    <p>Generate a QR code that pre-fills an email draft — address, subject, and body already written. Scan and hit Send. No typing, no errors.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">Pre-filled address, subject &amp; body</span>
                        <span className="toolBadge">Works with all mail apps</span>
                        <span className="toolBadge">QR + NFC</span>
                    </div>
                </header>

                <EmailToolClient />

                <section className="toolHowTo">
                    <h2>How to Create an Email QR Code</h2>
                    <p>Set up a one-tap email shortcut in three steps.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Fill Email Details</h3><p>Enter the email address. Optionally add a subject and body to pre-fill the message for the user.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>QR Generates Instantly</h3><p>Preview your QR code live as you type. Customise the colors and logo if needed.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Download or Write to NFC</h3><p>Save as PNG for print, or write the mailto link to an NFC tag via Chrome on Android.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Common Uses</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>📋 Feedback Forms</strong>QR on tables or receipts — scan to send feedback to your inbox.</div>
                        <div className="toolUseCase"><strong>📁 Support Desk</strong>Put the QR near your product — customers scan to email support.</div>
                        <div className="toolUseCase"><strong>🏢 Events</strong>Networking badge QR — scan to send an intro email instantly.</div>
                        <div className="toolUseCase"><strong>🏷️ NFC Tags</strong>Tap a tag near a form or display to open a pre-filled inquiry email.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
