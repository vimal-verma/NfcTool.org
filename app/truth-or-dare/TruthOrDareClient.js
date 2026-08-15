'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNfcSupport } from '../lib/use-nfc-support';
import styles from './page.module.css';

const TRUTHS = [
    "What's the most embarrassing song you secretly love?",
    "What was your most embarrassing moment in school?",
    "Have you ever blamed something on someone else that was actually your fault?",
    "What's the strangest dream you've ever had?",
    "What's your biggest pet peeve about the people in this room?",
    "What are you most secretly afraid of?",
    "What's the worst present you've ever received — and who gave it?",
    "What's the most childish thing you still enjoy doing?",
    "Have you ever eaten food off the floor?",
    "What's a habit you have that others would find strange?",
    "What was the last thing you searched for on your phone?",
    "Have you ever pretended to be sick to get out of something?",
    "What's your guiltiest pleasure TV show or movie?",
    "Have you ever sent a message to the wrong person?",
    "What's the weirdest food combination you secretly enjoy?",
    "Have you ever fallen asleep during a movie or an important meeting?",
    "What would you do with €1,000 in just 24 hours?",
    "Who in this room would you call at 3 AM in an emergency?",
    "What app on your phone do you use the most, and why?",
    "What's the last small lie you told?",
    "What's your most irrational fear?",
    "What's something you've done that you're still embarrassed about?",
    "Have you ever lied about reading a book or watching a movie everyone was talking about?",
    "What's one thing you would change about yourself if you could?",
    "What's the most ridiculous thing you've ever done to impress someone?",
];

const DARES = [
    "Do your best impression of someone in the room for 30 seconds.",
    "Speak in an accent for the next 2 rounds.",
    "Sing the first verse of a song chosen by the group.",
    "Do 15 jumping jacks right now.",
    "Text someone 'I have a confession…' and show everyone their reply.",
    "Describe yourself in only 3 words. No pausing allowed.",
    "Hold a plank position for 30 seconds.",
    "Say the alphabet backwards as fast as you can.",
    "Do your best robot dance for 20 seconds.",
    "Make up a 30-second commercial for a random object in the room.",
    "Speak only in questions for the next 2 rounds.",
    "Say 'She sells seashells by the seashore' 3 times fast.",
    "Call a family member and tell them you love them.",
    "Draw a portrait of the person next to you — eyes closed.",
    "Do 10 push-ups right now.",
    "Tell a joke. If no one laughs, tell another one.",
    "Talk like a pirate for the next 2 rounds.",
    "Do an impression of your favourite movie character.",
    "Hop on one foot for 30 seconds without stopping.",
    "Stare into someone's eyes for 30 seconds without laughing.",
    "Pretend to be a news reporter and describe what's happening in the room.",
    "Let the person to your right choose your phone wallpaper for the rest of the night.",
    "Walk around the room like a model on a runway.",
    "Act out a scene from your favourite movie — everyone has to guess the movie.",
    "Make up a short rap about the person sitting to your left.",
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function TruthOrDareClient() {
    const [phase, setPhase] = useState('setup'); // setup | waiting | revealed
    const [mode, setMode] = useState('mix'); // truth | dare | mix
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [promptType, setPromptType] = useState(null); // 'truth' | 'dare'
    const [round, setRound] = useState(0);
    const support = useNfcSupport();
    // Keeps the original tri-state: null while unknown, then true/false.
    const nfcSupported = support === 'unknown' ? null : support === 'supported';
    const [isFlipped, setIsFlipped] = useState(false);
    const [lastTag, setLastTag] = useState(null);

    const truthDeckRef = useRef([]);
    const dareDeckRef = useRef([]);
    const ndefRef = useRef(null);
    const abortRef = useRef(null);

    useEffect(() => {
        return () => { if (abortRef.current) abortRef.current.abort(); };
    }, []);

    const refillDecks = useCallback(() => {
        truthDeckRef.current = shuffleArray(TRUTHS);
        dareDeckRef.current = shuffleArray(DARES);
    }, []);

    const drawPrompt = useCallback((forceType) => {
        if (truthDeckRef.current.length === 0 || dareDeckRef.current.length === 0) {
            refillDecks();
        }

        let type = forceType;
        if (!type) {
            if (mode === 'truth') type = 'truth';
            else if (mode === 'dare') type = 'dare';
            else type = Math.random() < 0.5 ? 'truth' : 'dare';
        }

        let prompt;
        if (type === 'truth') {
            if (truthDeckRef.current.length === 0) truthDeckRef.current = shuffleArray(TRUTHS);
            prompt = truthDeckRef.current.pop();
        } else {
            if (dareDeckRef.current.length === 0) dareDeckRef.current = shuffleArray(DARES);
            prompt = dareDeckRef.current.pop();
        }

        return { prompt, type };
    }, [mode, refillDecks]);

    const reveal = useCallback((tagId) => {
        const { prompt, type } = drawPrompt();
        setCurrentPrompt(prompt);
        setPromptType(type);
        setLastTag(tagId || null);
        setIsFlipped(false);
        setPhase('revealed');
        // Trigger the flip after a tick so CSS transition fires
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsFlipped(true));
        });
        setRound(r => r + 1);
    }, [drawPrompt]);

    const startNfc = useCallback(async () => {
        if (!nfcSupported) return;
        try {
            if (abortRef.current) abortRef.current.abort();
            abortRef.current = new AbortController();
            const ndef = new window.NDEFReader();
            ndefRef.current = ndef;
            await ndef.scan({ signal: abortRef.current.signal });
            ndef.addEventListener('reading', ({ serialNumber }) => {
                reveal(serialNumber);
            });
        } catch {
            // NFC not available or permission denied — fall back to button
        }
    }, [nfcSupported, reveal]);

    const handleStart = useCallback(() => {
        refillDecks();
        setRound(0);
        setPhase('waiting');
        if (nfcSupported) startNfc();
    }, [nfcSupported, startNfc, refillDecks]);

    const handleNext = useCallback(() => {
        setPhase('waiting');
        setCurrentPrompt(null);
        setIsFlipped(false);
    }, []);

    const handleReset = useCallback(() => {
        if (abortRef.current) abortRef.current.abort();
        setPhase('setup');
        setRound(0);
        setCurrentPrompt(null);
    }, []);

    return (
        <div className={styles.game}>
            {/* ── SETUP ── */}
            {phase === 'setup' && (
                <div className={styles.setupScreen}>
                    <div className={styles.setupHeader}>
                        <span className={styles.bigIcon}>🎯</span>
                        <h1 className={styles.gameTitle}>Truth or Dare</h1>
                        <p className={styles.gameSubtitle}>
                            Tap an NFC card to get a challenge — or press the button if you don&apos;t have one.
                            Perfect for groups of 2–10 players.
                        </p>
                    </div>

                    <div className={styles.modeSelector}>
                        <p className={styles.modeLabel}>Select mode:</p>
                        <div className={styles.modeBtns}>
                            {[
                                { id: 'truth', label: '💬 Truth only' },
                                { id: 'dare', label: '🔥 Dare only' },
                                { id: 'mix', label: '🎲 Mixed' },
                            ].map(m => (
                                <button
                                    key={m.id}
                                    className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
                                    onClick={() => setMode(m.id)}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {nfcSupported === false && (
                        <div className={styles.compatNote}>
                            ℹ️ Web NFC not available — you can still play using the &quot;Reveal&quot; button.
                        </div>
                    )}

                    <div className={styles.howToPlay}>
                        <h3>How to Play</h3>
                        <ol className={styles.howList}>
                            <li>Each player holds an NFC card (or any NFC tag).</li>
                            <li>Press <strong>Start</strong> and pass the phone around.</li>
                            <li>When it&apos;s your turn, tap your card to the phone — or press <strong>Reveal</strong>.</li>
                            <li>Complete your challenge, then pass to the next player.</li>
                        </ol>
                    </div>

                    <button className={styles.startBtn} onClick={handleStart}>
                        Start Game →
                    </button>
                </div>
            )}

            {/* ── WAITING ── */}
            {phase === 'waiting' && (
                <div className={styles.waitingScreen}>
                    <div className={styles.roundBadge}>Round {round + 1}</div>
                    <div className={styles.cardPlaceholder}>
                        <div className={styles.cardBack}>
                            <span>🎴</span>
                            <p>{nfcSupported ? 'Tap your NFC card' : 'Press Reveal'}</p>
                        </div>
                    </div>
                    <button className={styles.revealBtn} onClick={() => reveal(null)}>
                        🎲 Reveal Challenge
                    </button>
                    <button className={styles.resetLink} onClick={handleReset}>
                        ← Back to setup
                    </button>
                </div>
            )}

            {/* ── REVEALED ── */}
            {phase === 'revealed' && (
                <div className={styles.revealScreen}>
                    <div className={styles.roundBadge}>Round {round}</div>

                    <div className={`${styles.promptCard} ${isFlipped ? styles.promptCardFlipped : ''}`}>
                        <div className={styles.promptCardInner}>
                            <div className={styles.promptCardFront}>
                                <span className={styles.cardFrontIcon}>🎴</span>
                            </div>
                            <div className={`${styles.promptCardBack} ${promptType === 'truth' ? styles.promptCardTruth : styles.promptCardDare}`}>
                                <div className={styles.promptTypeBadge}>
                                    {promptType === 'truth' ? '💬 TRUTH' : '🔥 DARE'}
                                </div>
                                <p className={styles.promptText}>{currentPrompt}</p>
                                {lastTag && (
                                    <p className={styles.tagHint}>Tag: {lastTag.slice(-8)}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.revealActions}>
                        <button className={styles.nextBtn} onClick={handleNext}>
                            ✓ Done — Next Player
                        </button>
                        <button
                            className={styles.skipBtn}
                            onClick={() => { const { prompt, type } = drawPrompt(); setCurrentPrompt(prompt); setPromptType(type); }}
                        >
                            ↻ Skip
                        </button>
                    </div>
                    <button className={styles.resetLink} onClick={handleReset}>
                        ← Restart game
                    </button>
                </div>
            )}
        </div>
    );
}
