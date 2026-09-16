import { Suspense, Fragment } from 'react';
import Link from 'next/link';
import TruthOrDareClient from './TruthOrDareClient';

export const metadata = {
    title: 'Truth or Dare — NFC Party Game | NfcTool',
    description: 'Play Truth or Dare with NFC tags! Tap a card to reveal a random challenge. Works with or without NFC — perfect for parties and groups.',
    keywords: ['NFC Truth or Dare', 'NFC party game', 'Truth or Dare browser', 'NFC card game', 'Web NFC game'],
    alternates: { canonical: 'https://nfctool.org/truth-or-dare' },
    openGraph: {
        title: 'Truth or Dare — NFC Party Game | NfcTool',
        description: 'Play Truth or Dare with NFC tags. Tap a card to reveal a random challenge for any group size.',
        url: 'https://nfctool.org/truth-or-dare',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NFC Truth or Dare Game' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Truth or Dare — NFC Party Game | NfcTool',
        description: 'Play Truth or Dare with NFC tags. Tap a card to reveal a challenge. Free, browser-based.',
        images: ['https://nfctool.org/og-logo.png'],
    },
};

export default function TruthOrDarePage() {
    const gameSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'NFC Truth or Dare',
        applicationCategory: 'Game',
        operatingSystem: 'Web',
        description: 'A browser-based party game where tapping an NFC tag or clicking reveals a random Truth or Dare challenge.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    return (
        <Fragment>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
            />
            <div style={{ padding: '0.75rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                <Link href="/games" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    ← Back to Games
                </Link>
            </div>
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading game…</div>}>
                <TruthOrDareClient />
            </Suspense>
        </Fragment>
    );
}
