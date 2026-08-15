import { Suspense, Fragment } from 'react';
import VCardClientTool from './vcard-client-tool';
import styles from './page.module.css';

export const metadata = {
    title: 'Free vCard Generator with QR Code & Shareable Link | NfcTool',
    description: 'Create a professional digital business card with our free vCard generator. Instantly generate a shareable link and a downloadable QR code for your contact details. You can also write your vCard directly to an NFC tag. No sign-up required.',
    keywords: [
        'vCard generator',
        'free vCard generator',
        'digital business card',
        'vCard QR code',
        'NFC vCard',
        'NFC business card',
        'vCard share link',
        'create vCard online',
        'vCard NFC writer',
        '.vcf file generator',
    ],
    openGraph: {
        title: 'Free vCard Generator with QR Code & Shareable Link | NfcTool',
        description: 'Instantly create and share your digital business card. Generate a vCard, QR code, and a shareable link for free.',
        url: 'https://nfctool.org/vcard',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-vcard-tool.png', width: 1200, height: 630, alt: 'vCard Generator with QR Code — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free vCard Generator with QR Code & Shareable Link | NfcTool',
        description: 'Create a digital business card, get a QR code and shareable link — free, no sign-up.',
        images: ['https://nfctool.org/og-vcard-tool.png'],
    },
    alternates: {
        canonical: 'https://nfctool.org/vcard',
    },
};

export default function VCardPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Free vCard Generator',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to create vCards (.vcf files), generate shareable links and QR codes, and write contact details to NFC tags.',
        featureList: [
            'Create vCard (.vcf) files',
            'Generate shareable URL for vCard',
            'Generate QR code for vCard',
            'Write vCard to NFC tag',
            'Download vCard as .vcf file',
            'Download QR code as PNG'
        ],
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR'
        },
        publisher: {
            '@type': 'Organization',
            name: 'NfcTool'
        }
    };

    return (
        <Fragment>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
            />
            <div className={styles.container}>
                <header className={styles.hero}>
                    <h1 className={styles.title}>Free Digital Business Card & vCard Generator</h1>
                    <p className={styles.subtitle}>
                        Create your vCard, generate a shareable link and QR code, or write directly to an NFC tag. Instantly share your contact information with anyone.
                    </p>
                </header>
                <Suspense fallback={<div>Loading...</div>}>
                    <VCardClientTool />
                </Suspense>
            </div>
        </Fragment>
    );
}