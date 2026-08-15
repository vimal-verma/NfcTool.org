import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'Free QR Code Generators & NFC Writers | NfcTool',
    description: 'Explore our comprehensive collection of free tools to generate QR codes and write to NFC tags for URLs, WiFi, vCards, UPI, and more.',
    keywords: ['QR Code Generator', 'NFC Writer', 'Free QR Tools', 'NfcTool QR', 'WiFi QR', 'vCard QR', 'UPI QR', 'URL QR', 'Email QR', 'SMS QR', 'Call QR', 'Event QR', 'Location QR'],
    openGraph: {
        title: 'Free QR Code Generators & NFC Writers | NfcTool',
        description: 'Explore our comprehensive collection of free tools to generate QR codes and write to NFC tags for URLs, WiFi, vCards, UPI, and more.',
        url: 'https://nfctool.org/qr',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Free QR Code Generators — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free QR Code Generators & NFC Writers | NfcTool',
        description: 'Explore our comprehensive collection of free tools to generate QR codes and write to NFC tags.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: {
        canonical: 'https://nfctool.org/qr',
    },
};

const tools = [
    {
        title: 'URL / Website',
        description: 'Generate a QR code to open a website and write the URL directly to an NFC tag.',
        icon: '🔗',
        href: '/url',
    },
    {
        title: 'WiFi Network',
        description: 'Create a QR code to share WiFi credentials and write connection details to an NFC tag.',
        icon: '📶',
        href: '/wifi',
    },
    {
        title: 'vCard / Contact',
        description: 'Design a digital business card, generate a QR code, and write contact info to an NFC tag.',
        icon: '📇',
        href: '/vcard',
    },
    {
        title: 'UPI Payment',
        description: 'Generate a UPI payment QR code with amount and note, and write it to an NFC tag.',
        icon: '💳',
        href: '/upi',
    },
    {
        title: 'Email',
        description: 'Create a QR code to send a pre-filled email and write the mailto link to an NFC tag.',
        icon: '✉️',
        href: '/email',
    },
    {
        title: 'SMS / Text',
        description: 'Generate a QR code to send a text message and write the SMS link to an NFC tag.',
        icon: '💬',
        href: '/sms',
    },
    {
        title: 'Phone Call',
        description: 'Create a QR code to dial a phone number and write the call link to an NFC tag.',
        icon: '📞',
        href: '/call',
    },
    {
        title: 'Calendar Event',
        description: 'Generate a QR code for a calendar event and write vEvent data to an NFC tag.',
        icon: '📅',
        href: '/event',
    },
    {
        title: 'Location',
        description: 'Share coordinates or DigiPin via QR code and write the location to an NFC tag.',
        icon: '📍',
        href: '/location',
    },
    {
        title: 'Biodata Maker',
        description: 'Create professional biodata for marriage or jobs and share it easily.',
        icon: '📝',
        href: 'https://biodatamaker.org/en/biodata-maker',
    },
    {
        title: 'Invitation Maker',
        description: 'Create professional invitations for events and share them easily.',
        icon: '📝',
        href: 'https://biodatamaker.org/en/invitation-maker',
    },
    {
        title: 'Digital Card Maker',
        description: 'Create professional digital cards for various purposes and share them easily.',
        icon: '📝',
        href: 'https://biodatamaker.org/en/digital-card',
    },
];

export default function QrToolsPage() {
    return (
        <>
            <div className={styles.container}>
                <header className={styles.hero}>
                    <h1 className={styles.title}>QR Code Generators & NFC Writers</h1>
                    <p className={styles.subtitle}>
                        Choose a tool below to generate a custom QR code and write the data to an NFC tag directly from your browser.
                    </p>
                </header>

                <div className={styles.grid}>
                    {tools.map((tool) => {
                        const isExternal = tool.href.startsWith('http');
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className={styles.card}
                                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            >
                                <div className={styles.icon}>{tool.icon}</div>
                                <h2 className={styles.cardTitle}>{tool.title}</h2>
                                <p className={styles.cardDescription}>{tool.description}</p>
                                {isExternal && <span className={styles.externalBadge}>↗ External</span>}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}