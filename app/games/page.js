import Link from 'next/link';
import styles from './page.module.css';
import JsonLd from '../components/JsonLd';

export const metadata = {
    title: 'NFC Games — Play Fun Games with Your NFC Tags | NfcTool',
    description: 'Play free browser-based games using NFC tags. Try Shuffle Hunt, Truth or Dare, Speed Tap Challenge, and more — no install needed, runs in Chrome on Android.',
    keywords: ['NFC games', 'NFC tag games', 'Web NFC game', 'browser NFC games', 'ShuffleHunt', 'NFC Truth or Dare', 'NFC Speed Tap', 'NFC party games'],
    alternates: { canonical: 'https://nfctool.org/games' },
    openGraph: {
        title: 'NFC Games — Play Fun Games with Your NFC Tags | NfcTool',
        description: 'Play free browser-based games using NFC tags. Shuffle Hunt, Truth or Dare, Speed Tap and more.',
        url: 'https://nfctool.org/games',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NFC Games — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NFC Games — Play Fun Games with Your NFC Tags | NfcTool',
        description: 'Play free browser-based NFC games. Shuffle Hunt, Truth or Dare, Speed Tap and more.',
        images: ['https://nfctool.org/og-logo.png'],
    },
};

const games = [
    {
        href: '/shufflehunt',
        icon: '🔀',
        title: 'Shuffle Hunt',
        description: 'Register NFC tags, shuffle them face-down, then race to scan them in the correct sequence from memory.',
        players: '1–4 players',
        tags: '2–8 NFC tags',
        difficulty: 'Medium',
        nfcRequired: true,
        status: 'play',
        color: '#6366f1',
    },
    {
        href: '/truth-or-dare',
        icon: '🎯',
        title: 'Truth or Dare',
        description: 'Tap an NFC card to get a random Truth or Dare challenge. Also works without NFC — just press the button to reveal.',
        players: '2–10 players',
        tags: 'Optional NFC tags',
        difficulty: 'Easy',
        nfcRequired: false,
        status: 'play',
        color: '#ec4899',
    },
    {
        href: '/speed-tap',
        icon: '⚡',
        title: 'Speed Tap',
        description: 'Race the clock! Tap as many different NFC tags as you can before time runs out. Compete for your personal best.',
        players: '1 player',
        tags: '3+ NFC tags',
        difficulty: 'Easy',
        nfcRequired: true,
        status: 'play',
        color: '#f59e0b',
    },
    {
        href: null,
        icon: '🧩',
        title: 'NFC Trivia Battle',
        description: 'Register player cards, answer trivia questions by scanning your NFC tag. First to 10 correct answers wins.',
        players: '2–6 players',
        tags: '1 tag per player',
        difficulty: 'Medium',
        nfcRequired: true,
        status: 'soon',
        color: '#10b981',
    },
    {
        href: null,
        icon: '🗺️',
        title: 'Scavenger Hunt',
        description: 'Hide NFC tags with clues around the room. Each tag reveals the next clue. Race to find the final prize!',
        players: '2–8 players',
        tags: '5–15 NFC tags',
        difficulty: 'Hard',
        nfcRequired: true,
        status: 'soon',
        color: '#3b82f6',
    },
    {
        href: null,
        icon: '🔥',
        title: 'Hot or Cold',
        description: 'One player hides an NFC tag. Others scan nearby tags to get warmer/colder hints. Find it first to win!',
        players: '3–8 players',
        tags: '1 hidden + extras',
        difficulty: 'Easy',
        nfcRequired: true,
        status: 'soon',
        color: '#ef4444',
    },
];

const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'NFC Games',
    description: 'A collection of free browser-based games playable with NFC tags.',
    url: 'https://nfctool.org/games',
    publisher: { '@type': 'Organization', name: 'NfcTool', url: 'https://nfctool.org' },
};

export default function GamesPage() {
    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroIcon}>🎮</div>
                <h1 className={styles.title}>NFC Games</h1>
                <p className={styles.subtitle}>
                    Turn your NFC tags into game pieces. Play solo or with friends — all games run directly in Chrome on Android, no app needed.
                </p>
                <div className={styles.heroBadges}>
                    <span className={styles.badge}>🌐 Browser-based</span>
                    <span className={styles.badge}>📱 Chrome on Android</span>
                    <span className={styles.badge}>🆓 Always free</span>
                </div>
            </header>

            <section className={styles.gamesSection}>
                <div className={styles.gamesGrid}>
                    {games.map((game) => (
                        <div key={game.title} className={`${styles.gameCard} ${game.status === 'soon' ? styles.gameCardSoon : ''}`}>
                            <div className={styles.gameCardTop} style={{ background: `linear-gradient(135deg, ${game.color}22, ${game.color}11)`, borderBottom: `2px solid ${game.color}33` }}>
                                <span className={styles.gameIcon}>{game.icon}</span>
                                <div className={styles.gameCardBadge} data-status={game.status}>
                                    {game.status === 'play' ? '▶ Play now' : '🔜 Coming soon'}
                                </div>
                            </div>
                            <div className={styles.gameCardBody}>
                                <h2 className={styles.gameTitle}>{game.title}</h2>
                                <p className={styles.gameDesc}>{game.description}</p>
                                <div className={styles.gameMeta}>
                                    <span className={styles.gameMetaChip}>👥 {game.players}</span>
                                    <span className={styles.gameMetaChip}>🏷️ {game.tags}</span>
                                    <span className={styles.gameMetaChip} data-difficulty={game.difficulty.toLowerCase()}>
                                        {game.difficulty === 'Easy' ? '🟢' : game.difficulty === 'Medium' ? '🟡' : '🔴'} {game.difficulty}
                                    </span>
                                    {game.nfcRequired && (
                                        <span className={`${styles.gameMetaChip} ${styles.nfcChip}`}>📡 NFC required</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.gameCardFooter}>
                                {game.status === 'play' && game.href ? (
                                    <Link href={game.href} className={styles.playButton} style={{ background: game.color }}>
                                        Play {game.title} →
                                    </Link>
                                ) : (
                                    <span className={styles.soonButton}>Coming Soon</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.requirementsSection}>
                <h2>What You Need to Play</h2>
                <div className={styles.requirementsGrid}>
                    <div className={styles.requirementCard}>
                        <div className={styles.requirementIcon}>📱</div>
                        <h3>Android Phone</h3>
                        <p>An Android phone with NFC enabled. Go to Settings → Connections → NFC to turn it on.</p>
                    </div>
                    <div className={styles.requirementCard}>
                        <div className={styles.requirementIcon}>🌐</div>
                        <h3>Chrome Browser</h3>
                        <p>Open Chrome on Android (version 89+). Web NFC is not yet available on iOS or desktop browsers.</p>
                    </div>
                    <div className={styles.requirementCard}>
                        <div className={styles.requirementIcon}>🏷️</div>
                        <h3>NFC Tags</h3>
                        <p>Standard NDEF NFC tags — NTAG213, NTAG215, or NTAG216. You can also use NFC-enabled cards or stickers.</p>
                    </div>
                    <div className={styles.requirementCard}>
                        <div className={styles.requirementIcon}>👥</div>
                        <h3>Friends (optional)</h3>
                        <p>Some games are solo (Speed Tap), others are better with a group (Truth or Dare, Shuffle Hunt).</p>
                    </div>
                </div>
            </section>

            <section className={styles.howSection}>
                <h2>Getting Started in 3 Steps</h2>
                <div className={styles.stepsRow}>
                    <div className={styles.stepItem}>
                        <div className={styles.stepNum}>1</div>
                        <h3>Get NFC Tags</h3>
                        <p>Pick up a pack of NTAG213 stickers — affordable and widely available online. You need 2–8 tags for most games.</p>
                    </div>
                    <div className={styles.stepConnector}>→</div>
                    <div className={styles.stepItem}>
                        <div className={styles.stepNum}>2</div>
                        <h3>Open a Game</h3>
                        <p>Tap any game card above. The game will open in your browser — no login or install required.</p>
                    </div>
                    <div className={styles.stepConnector}>→</div>
                    <div className={styles.stepItem}>
                        <div className={styles.stepNum}>3</div>
                        <h3>Tap & Play</h3>
                        <p>Hold the back of your phone near a tag. The game responds instantly when the tag is detected.</p>
                    </div>
                </div>
            </section>

            <JsonLd data={schema} />
        </div>
    );
}
