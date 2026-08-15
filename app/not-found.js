import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
    title: 'Page not found',
    description: 'That page doesn’t exist. Browse our free NFC and QR tools instead.',
    robots: { index: false, follow: true },
};

const suggestions = [
    { href: '/read-nfc', icon: '📖', label: 'Read an NFC tag' },
    { href: '/write-nfc', icon: '✍️', label: 'Write an NFC tag' },
    { href: '/vcard', icon: '📇', label: 'vCard generator' },
    { href: '/qr', icon: '🔳', label: 'QR code tools' },
    { href: '/documentation', icon: '📚', label: 'Documentation' },
    { href: '/blog', icon: '📝', label: 'Blog' },
];

export default function NotFound() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.subtitle}>We couldn&apos;t find that page.</p>
            <p className={styles.description}>
                The link may be outdated or mistyped. Here are the places people
                usually head to next.
            </p>

            <div className={styles.suggestions}>
                {suggestions.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.suggestion}>
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </div>

            <Link href="/" className={styles.homeButton}>
                Go to homepage
            </Link>
        </div>
    );
}
