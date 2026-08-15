import { Suspense } from 'react';
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
        images: [{ url: '/og-logo.png', width: 1200, height: 630, alt: 'NFC Speed Tap Game' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Speed Tap — NFC Tag Scanning Challenge | NfcTool',
        description: 'How many NFC tags can you tap in 60 seconds? Free, browser-based NFC game.',
        images: ['/og-logo.png'],
    },
};

export default function SpeedTapPage() {
    return (
        <>
            <div style={{ padding: '0.75rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                <Link href="/games" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    ← Back to Games
                </Link>
            </div>
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading game…</div>}>
                <SpeedTapClient />
            </Suspense>
        </>
    );
}
