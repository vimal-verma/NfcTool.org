import Link from 'next/link';
import styles from './[slug]/page.module.css';
import { navItems } from './nav-items';

export const metadata = {
    title: 'Documentation & Guides | NfcTool.org',
    description: 'Your official resource for learning how to use the Web NFC API and our powerful online tools.',
    keywords: ['Web NFC documentation', 'WebNFC guides', 'NFC tutorials', 'Web NFC API', 'NFC examples', 'NFC how-to', 'NFC tag writing guide', 'NFC for developers'],
    alternates: {
        canonical: 'https://nfctool.org/documentation',
    },
    openGraph: {
        title: 'Documentation & Guides | NfcTool.org',
        description: 'Your official resource for learning how to use the Web NFC API and our powerful online tools.',
        url: 'https://nfctool.org/documentation',
        siteName: 'NfcTool.org',
        images: [
            {
                url: 'https://nfctool.org/og-logo.png',
                width: 1200,
                height: 630,
                alt: 'NfcTool Documentation',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Documentation & Guides | NfcTool.org',
        description: 'Your official resource for learning how to use the Web NFC API and our powerful online tools.',
        images: ['https://nfctool.org/og-logo.png'],
    },
};

const guideIcons = {
    'introduction': '📖',
    'browser-support': '🌐',
    'read-nfc': '📡',
    'write-text-record': '📝',
    'write-url-record': '🔗',
    'write-vcard-record': '📇',
    'write-upi-record': '💳',
    'lock-nfc': '🔒',
    'clone-and-format': '🔄',
    'react-hook-web-nfc': '⚛️',
    'smart-posters': '🪧',
    'nfc-security-best-practices': '🛡️',
    'nfc-tag-types': '🏷️',
    'nfc-vs-rfid': '📶',
    'troubleshooting': '🔧',
    'history-of-nfc': '📜',
    'nfc-use-cases': '💡',
};

const guideDescriptions = {
    'introduction': 'Learn what the Web NFC API is and how it works in the browser.',
    'browser-support': 'See which browsers and devices support Web NFC today.',
    'read-nfc': 'Scan an NFC tag and decode its records with JavaScript.',
    'write-text-record': 'Write a plain text string to an NFC tag from the web.',
    'write-url-record': 'Encode a URL on an NFC tag so tapping opens a link.',
    'write-vcard-record': 'Store a contact card (vCard) on an NFC tag.',
    'write-upi-record': 'Embed a UPI payment link on an NFC tag.',
    'lock-nfc': 'Make an NFC tag permanently read-only.',
    'clone-and-format': 'Copy tag content or wipe a tag back to factory defaults.',
    'react-hook-web-nfc': 'Build a reusable useNFC React hook for your app.',
    'smart-posters': 'Create multi-record smart poster tags with NFC.',
    'nfc-security-best-practices': 'Protect users from malicious tags and data tampering.',
    'nfc-tag-types': 'NTAG213, NTAG215, NTAG216, MIFARE and more explained.',
    'nfc-vs-rfid': 'Understand how NFC differs from traditional RFID.',
    'troubleshooting': 'Fix common Web NFC permission and scanning errors.',
    'history-of-nfc': 'From Sony & Philips to smartphones — the origin story.',
    'nfc-use-cases': 'Real-world applications: payments, access, marketing, and more.',
};

export default function DocumentationPage() {
    return (
        <div className={styles.documentationContainer}>
            <header className={styles.hero}>
                <h1 className={styles.title}>Documentation & Guides</h1>
                <p className={styles.subtitle}>
                    Your official resource for learning how to use the Web NFC API and our powerful online tools.
                </p>
                <Link href="/documentation/introduction" className={styles.introLink}>
                    Start with the Introduction →
                </Link>
            </header>
            <div className={styles.guidesGrid}>
                {navItems.filter(item => item.slug !== 'introduction').map(item => (
                    <Link href={`/documentation/${item.slug}`} key={item.slug} className={styles.guideCard}>
                        <span className={styles.guideIcon}>{guideIcons[item.slug] || '📄'}</span>
                        <div>
                            <h3 className={styles.guideCardTitle}>{item.title}</h3>
                            {guideDescriptions[item.slug] && (
                                <p className={styles.guideCardDesc}>{guideDescriptions[item.slug]}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}