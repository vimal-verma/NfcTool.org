import { Suspense } from 'react';
import RedirectClient from './redirect-client';
import styles from './redirect.module.css';

export const metadata = {
    title: 'Opening link',
    description: 'Opens a link stored on an NFC tag.',
    // A per-tag utility route — it has no standalone content worth indexing.
    robots: { index: false, follow: false },
};

export default function RedirectPage() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<p>Opening link…</p>}>
                <RedirectClient />
            </Suspense>
        </div>
    );
}
