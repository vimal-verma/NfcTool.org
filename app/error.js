'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function Error({ error, reset }) {
    return (
        <div className={styles.container}>
            <h1 className={styles.subtitle}>Something went wrong</h1>
            <p className={styles.description}>
                This page hit an unexpected error. Nothing you entered was sent
                anywhere — everything stays in your browser. Try again, and if it
                keeps happening, let us know.
            </p>
            {error?.digest && (
                <p className={styles.description} style={{ fontSize: '0.8rem' }}>
                    Reference: <code>{error.digest}</code>
                </p>
            )}
            <div className={styles.suggestions} style={{ maxWidth: '420px' }}>
                <button type="button" onClick={reset} className={styles.suggestion}>
                    <span aria-hidden="true">🔄</span>
                    Try again
                </button>
                <Link href="/contact" className={styles.suggestion}>
                    <span aria-hidden="true">✉️</span>
                    Report the problem
                </Link>
            </div>
            <Link href="/" className={styles.homeButton}>
                Go to homepage
            </Link>
        </div>
    );
}
