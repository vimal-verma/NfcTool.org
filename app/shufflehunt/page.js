import ShuffleHuntGame from './shuffle-hunt';
import { Fragment } from 'react';

export const metadata = {
    title: 'NFC Shuffle Hunt — Browser NFC Memory Game | NfcTool',
    description: 'A fun memory and sequence game using NFC tags. Register cards, shuffle them, and find them in the correct order using your Android phone.',
    keywords: [
        'NFC game',
        'Shuffle Hunt',
        'NFC memory game',
        'Web NFC game',
        'browser NFC game',
        'NFC tag game',
        'interactive NFC',
        'NfcTool'
    ],
    alternates: {
        canonical: 'https://nfctool.org/shufflehunt',
    },
    openGraph: {
        title: 'NFC Shuffle Hunt — Browser NFC Memory Game | NfcTool',
        description: 'A fun memory and sequence game using NFC tags. Register cards, shuffle them, and find them in the correct order.',
        url: 'https://nfctool.org/shufflehunt',
        siteName: 'NfcTool',
        images: [{ url: '/og-logo.png', width: 1200, height: 630, alt: 'NFC Shuffle Hunt Game' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NFC Shuffle Hunt — Browser NFC Memory Game | NfcTool',
        description: 'A fun memory and sequence game using NFC tags. Play directly in Chrome on Android.',
        images: ['/og-logo.png'],
    },
};

export default function ShuffleHuntPage() {
    const gameSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'NFC Shuffle Hunt',
        applicationCategory: 'Game',
        operatingSystem: 'Web',
        browserRequirements: 'Requires a browser with WebNFC support (e.g., Chrome on Android).',
        description: 'A browser-based game where players register NFC tags, shuffle them, and attempt to scan them in the correct sequence.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        publisher: {
            '@type': 'Organization',
            name: 'NfcTool'
        }
    };

    return (
        <Fragment>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
            />
            <ShuffleHuntGame />
        </Fragment>
    );
}