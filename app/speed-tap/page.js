import { Suspense, Fragment } from 'react';
import Link from 'next/link';
import SpeedTapClient from './SpeedTapClient';

export const metadata = {
    title: 'Speed Tap — NFC Tag Scanning Challenge | NfcTool',
    description: 'Tap as many different NFC tags as you can before the timer runs out! Track your high score and compete with friends in this fast-paced NFC challenge.',
    keywords: ['NFC Speed Tap', 'NFC tag game', 'NFC challenge', 'NFC scanner game', 'Web NFC speed game'],
    alternates: { canonical: 'https://nfctool.org/speed-tap' },
    openGraph: {
        title: 'Speed Tap — NFC Tag Scanning Challenge | NfcTool',
        description: 'How many NFC tags can you tap in 60 seconds? Track your high score and challenge friends.',
        url: 'https://nfctool.org/speed-tap',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NFC Speed Tap Game' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Speed Tap — NFC Tag Scanning Challenge | NfcTool',
        description: 'How many NFC tags can you tap in 60 seconds? Free, browser-based NFC game.',
        images: ['https://nfctool.org/og-logo.png'],
    },
};

export default function SpeedTapPage() {
    const gameSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'NFC Speed Tap',
        applicationCategory: 'Game',
        operatingSystem: 'Web',
        browserRequirements: 'Chrome on Android (version 89+). Web NFC API required.',
        description: 'A fast-paced browser-based challenge game where players race against the clock to tap unique NFC tags.',
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
                <SpeedTapClient />
            </Suspense>
        </Fragment>
    );
}
