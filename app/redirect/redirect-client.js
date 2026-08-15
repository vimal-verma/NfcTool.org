'use client';

import { useSearchParams, redirect } from 'next/navigation';
import styles from './redirect.module.css';

// Only ever follow plain web links. Blocks `javascript:`, `data:` and other
// schemes that a malicious tag could otherwise smuggle through this page.
function safeUrl(value) {
    if (typeof value !== 'string' || !value) return null;
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
    } catch {
        return null;
    }
}

export default function RedirectClient() {
    const searchParams = useSearchParams();
    const single = searchParams.get('url');

    if (single) {
        const target = safeUrl(single);
        if (target) {
            // Throws a REDIRECT error, which Next.js handles.
            redirect(target);
        }
        return (
            <div className={styles.linksContainer}>
                <h1 className={styles.title}>This link can&apos;t be opened</h1>
                <p className={styles.error}>
                    The tag contains a link that isn&apos;t a standard web address, so we
                    didn&apos;t open it for your safety.
                </p>
            </div>
        );
    }

    const encodedUrls = searchParams.get('urls');
    let decoded = [];

    if (encodedUrls) {
        try {
            const parsed = JSON.parse(atob(encodedUrls));
            if (Array.isArray(parsed)) decoded = parsed;
        } catch {
            return (
                <div className={styles.linksContainer}>
                    <h1 className={styles.title}>We couldn&apos;t read this tag</h1>
                    <p className={styles.error}>
                        The link data in this tag is incomplete or damaged. Try scanning the
                        tag again with our <a href="/read-nfc" className={styles.link}>NFC Reader</a>.
                    </p>
                </div>
            );
        }
    }

    const urls = decoded.map(safeUrl).filter(Boolean);

    if (urls.length === 0) {
        return (
            <div className={styles.linksContainer}>
                <h1 className={styles.title}>Nothing to open</h1>
                <p className={styles.error}>
                    This page opens links stored on an NFC tag, but no valid links were
                    found. Scan a tag with our <a href="/read-nfc" className={styles.link}>NFC Reader</a> to
                    see what&apos;s on it.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.linksContainer}>
            <h1 className={styles.title}>Choose a link to open</h1>
            <ul className={styles.linkList}>
                {urls.map((url, index) => (
                    <li key={`${url}-${index}`} className={styles.linkItem}>
                        <a href={url} target="_blank" rel="noopener noreferrer nofollow" className={styles.link}>
                            {url}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
