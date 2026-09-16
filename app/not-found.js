import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
    title: 'Page Not Found (404) | NfcTool',
    description: 'The requested page does not exist. Explore our free NFC tools, QR code generators, games, and guides.',
    robots: { index: false, follow: true },
};

const nfcTools = [
    { href: '/read-nfc', icon: '📖', label: 'Read NFC Tag' },
    { href: '/write-nfc', icon: '✍️', label: 'Write NFC Tag' },
    { href: '/clone-nfc', icon: '📋', label: 'Clone NFC Tag' },
    { href: '/nfc-tool', icon: '⚡', label: 'Advanced Suite' },
];

const qrTools = [
    { href: '/vcard', icon: '📇', label: 'vCard Generator' },
    { href: '/wifi', icon: '📶', label: 'WiFi QR Code' },
    { href: '/upi', icon: '💳', label: 'UPI Payment QR' },
    { href: '/qr', icon: '🔳', label: 'All QR Tools' },
];

const resources = [
    { href: '/games', icon: '🎮', label: 'NFC Games' },
    { href: '/documentation', icon: '📚', label: 'Documentation' },
    { href: '/blog', icon: '📝', label: 'Guides & Blog' },
    { href: '/contact', icon: '✉️', label: 'Support' },
];

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.radarWrapper}>
                <div className={styles.radarPulseRing}></div>
                <div className={styles.radarPulseRing}></div>
                <div className={styles.radarPulseRing}></div>
                <div className={styles.radarCenterIcon}>📡</div>
            </div>

            <div className={styles.badge}>
                <span className={styles.badgeDot}></span>
                Error 404 · Page Not Found
            </div>

            <h1 className={styles.title}>404</h1>
            <p className={styles.subtitle}>Signal Lost: Tag or Page Not Found</p>
            <p className={styles.description}>
                The link you followed may be broken or mistyped. Choose an NFC tool, QR generator, or guide below to get back on track.
            </p>

            <div className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                    <span>📡 Popular NFC Tools</span>
                </div>
                <div className={styles.suggestions}>
                    {nfcTools.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.suggestion}>
                            <span className={styles.suggestionIcon} aria-hidden="true">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.categoryHeader}>
                    <span>🔳 Popular QR Tools</span>
                </div>
                <div className={styles.suggestions}>
                    {qrTools.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.suggestion}>
                            <span className={styles.suggestionIcon} aria-hidden="true">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.categoryHeader}>
                    <span>📚 Games &amp; Knowledge</span>
                </div>
                <div className={styles.suggestions}>
                    {resources.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.suggestion}>
                            <span className={styles.suggestionIcon} aria-hidden="true">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <Link href="/" className={styles.homeButton}>
                    ← Go to Homepage
                </Link>
                <Link href="/qr" className={styles.secondaryButton}>
                    Browse All Tools →
                </Link>
            </div>
        </div>
    );
}
