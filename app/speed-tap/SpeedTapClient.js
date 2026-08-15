'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { useNfcSupport } from '../lib/use-nfc-support';
import styles from './page.module.css';

const DURATIONS = [30, 60, 90];
const SCORE_PER_TAP = 10;
const SCORE_PER_UNIQUE = 50;
const LS_KEY = 'webnfc_speedtap_scores';

function loadScores() {
    try {
        const parsed = JSON.parse(localStorage.getItem(LS_KEY));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/* ── Leaderboard store ──
 * The high-score list lives in localStorage, which can only be read on the
 * client. Exposing it as an external store keeps hydration clean and means
 * saving a score immediately refreshes the leaderboard everywhere it's shown.
 */
const EMPTY_SCORES = [];
let scoresCache = null;
const scoreListeners = new Set();

const subscribeScores = (listener) => {
    scoreListeners.add(listener);
    return () => scoreListeners.delete(listener);
};

// Cached so repeated reads return the same reference, as the store contract requires.
const getScoresSnapshot = () => {
    if (scoresCache === null) scoresCache = loadScores();
    return scoresCache;
};

const getScoresServerSnapshot = () => EMPTY_SCORES;

function saveScore(entry) {
    const next = [...getScoresSnapshot(), entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    scoresCache = next;
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
        // Storage full or blocked — the score still shows for this session.
    }
    for (const listener of scoreListeners) listener();
}

export default function SpeedTapClient() {
    const [phase, setPhase] = useState('setup'); // setup | playing | results
    const [duration, setDuration] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const [totalTaps, setTotalTaps] = useState(0);
    const [uniqueTags, setUniqueTags] = useState(new Set());
    const [lastTag, setLastTag] = useState(null);
    const [flash, setFlash] = useState(false);
    const scores = useSyncExternalStore(subscribeScores, getScoresSnapshot, getScoresServerSnapshot);
    const support = useNfcSupport();
    // Keeps the original tri-state: null while unknown, then true/false.
    const nfcSupported = support === 'unknown' ? null : support === 'supported';
    const [nfcError, setNfcError] = useState(null);

    const timerRef = useRef(null);
    const abortRef = useRef(null);
    const tapsRef = useRef(0);
    const uniqueRef = useRef(new Set());

    const endGame = useCallback(() => {
        clearInterval(timerRef.current);
        if (abortRef.current) abortRef.current.abort();

        const finalTaps = tapsRef.current;
        const finalUnique = uniqueRef.current.size;
        const score = finalTaps * SCORE_PER_TAP + finalUnique * SCORE_PER_UNIQUE;

        saveScore({
            score,
            taps: finalTaps,
            unique: finalUnique,
            duration,
            date: new Date().toLocaleDateString(),
        });

        setTotalTaps(finalTaps);
        setUniqueTags(new Set(uniqueRef.current));
        setScores(loadScores());
        setPhase('results');
    }, [duration]);

    const startGame = useCallback(async () => {
        if (!nfcSupported) {
            setNfcError('Web NFC is not available on this browser. Please use Chrome on Android.');
            return;
        }

        tapsRef.current = 0;
        uniqueRef.current = new Set();
        setTotalTaps(0);
        setUniqueTags(new Set());
        setLastTag(null);
        setTimeLeft(duration);
        setPhase('playing');
        setNfcError(null);

        // Start timer
        let remaining = duration;
        timerRef.current = setInterval(() => {
            remaining -= 1;
            setTimeLeft(remaining);
            if (remaining <= 0) {
                endGame();
            }
        }, 1000);

        // Start NFC scanning
        try {
            abortRef.current = new AbortController();
            const ndef = new window.NDEFReader();
            await ndef.scan({ signal: abortRef.current.signal });

            ndef.addEventListener('reading', ({ serialNumber }) => {
                tapsRef.current += 1;
                uniqueRef.current.add(serialNumber);
                setTotalTaps(tapsRef.current);
                setUniqueTags(new Set(uniqueRef.current));
                setLastTag(serialNumber);

                // Flash effect
                setFlash(true);
                setTimeout(() => setFlash(false), 200);
            });
        } catch (err) {
            clearInterval(timerRef.current);
            setNfcError(`NFC error: ${err.message}`);
            setPhase('setup');
        }
    }, [nfcSupported, duration, endGame]);

    const handleReset = useCallback(() => {
        clearInterval(timerRef.current);
        if (abortRef.current) abortRef.current.abort();
        setPhase('setup');
        setTimeLeft(duration);
    }, [duration]);

    const finalTaps = totalTaps;
    const finalUnique = uniqueTags.size;
    const finalScore = finalTaps * SCORE_PER_TAP + finalUnique * SCORE_PER_UNIQUE;

    const timerPercent = timeLeft / duration;
    const timerColor = timeLeft > duration * 0.5 ? '#22c55e' : timeLeft > duration * 0.2 ? '#f59e0b' : '#ef4444';
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference * (1 - timerPercent);

    return (
        <div className={styles.game}>
            {/* ── SETUP ── */}
            {phase === 'setup' && (
                <div className={styles.setupScreen}>
                    <span className={styles.bigIcon}>⚡</span>
                    <h1 className={styles.gameTitle}>Speed Tap</h1>
                    <p className={styles.gameSubtitle}>
                        Tap as many different NFC tags as possible before the timer runs out.
                        Each unique tag is worth more points!
                    </p>

                    {nfcSupported === false && (
                        <div className={styles.errorNote}>
                            ⚠️ Web NFC requires Chrome on Android (version 89+). This game won&apos;t work on this device.
                        </div>
                    )}

                    {nfcError && <div className={styles.errorNote}>{nfcError}</div>}

                    <div className={styles.durationSelector}>
                        <p className={styles.durationLabel}>Choose time limit:</p>
                        <div className={styles.durationBtns}>
                            {DURATIONS.map(d => (
                                <button
                                    key={d}
                                    className={`${styles.durationBtn} ${duration === d ? styles.durationBtnActive : ''}`}
                                    onClick={() => setDuration(d)}
                                >
                                    {d}s
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.scoringInfo}>
                        <h3>Scoring</h3>
                        <div className={styles.scoringRow}>
                            <span>Each tap</span>
                            <strong>+{SCORE_PER_TAP} pts</strong>
                        </div>
                        <div className={styles.scoringRow}>
                            <span>Each unique tag</span>
                            <strong>+{SCORE_PER_UNIQUE} pts bonus</strong>
                        </div>
                        <p className={styles.scoringHint}>
                            Tap the same tag multiple times to rack up taps, but scanning new tags earns you the big unique bonus.
                        </p>
                    </div>

                    <button
                        className={`${styles.startBtn} ${nfcSupported === false ? styles.startBtnDisabled : ''}`}
                        onClick={startGame}
                        disabled={nfcSupported === false}
                    >
                        {nfcSupported === null ? 'Checking NFC…' : nfcSupported ? '⚡ Start Game' : 'NFC Not Available'}
                    </button>

                    {scores.length > 0 && (
                        <div className={styles.leaderboard}>
                            <h3>🏆 Your Best Scores</h3>
                            <div className={styles.scoreList}>
                                {scores.slice(0, 5).map((s, i) => (
                                    <div key={i} className={styles.scoreRow}>
                                        <span className={styles.scoreRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                                        <span className={styles.scoreVal}>{s.score} pts</span>
                                        <span className={styles.scoreMeta}>{s.taps} taps · {s.unique} unique · {s.duration}s · {s.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── PLAYING ── */}
            {phase === 'playing' && (
                <div className={`${styles.playingScreen} ${flash ? styles.flashScreen : ''}`}>
                    {/* Circular timer */}
                    <div className={styles.timerRing}>
                        <svg viewBox="0 0 120 120" className={styles.timerSvg}>
                            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--card-border)" strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r="54"
                                fill="none"
                                stroke={timerColor}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                transform="rotate(-90 60 60)"
                                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                            />
                        </svg>
                        <div className={styles.timerInner}>
                            <span className={styles.timerValue} style={{ color: timerColor }}>{timeLeft}</span>
                            <span className={styles.timerLabel}>sec</span>
                        </div>
                    </div>

                    {/* Live stats */}
                    <div className={styles.liveStats}>
                        <div className={styles.liveStat}>
                            <strong>{finalTaps}</strong>
                            <span>Total Taps</span>
                        </div>
                        <div className={styles.liveStatDivider} />
                        <div className={styles.liveStat}>
                            <strong>{finalUnique}</strong>
                            <span>Unique Tags</span>
                        </div>
                        <div className={styles.liveStatDivider} />
                        <div className={styles.liveStat}>
                            <strong>{finalScore}</strong>
                            <span>Score</span>
                        </div>
                    </div>

                    {lastTag && (
                        <div className={styles.lastTagBadge}>
                            Last tag: <code>{lastTag.slice(-12)}</code>
                        </div>
                    )}

                    <p className={styles.tapInstruction}>
                        📡 Hold tags to the back of your phone
                    </p>

                    <button className={styles.stopBtn} onClick={endGame}>
                        Stop Early
                    </button>
                </div>
            )}

            {/* ── RESULTS ── */}
            {phase === 'results' && (
                <div className={styles.resultsScreen}>
                    <div className={styles.resultsHeader}>
                        <span className={styles.resultsIcon}>🏆</span>
                        <h2 className={styles.resultsTitle}>Time&apos;s Up!</h2>
                    </div>

                    <div className={styles.finalScore}>
                        <span className={styles.finalScoreNum}>{finalScore}</span>
                        <span className={styles.finalScoreLabel}>points</span>
                    </div>

                    <div className={styles.resultStats}>
                        <div className={styles.resultStat}>
                            <strong>{finalTaps}</strong>
                            <span>Total taps</span>
                        </div>
                        <div className={styles.resultStat}>
                            <strong>{finalUnique}</strong>
                            <span>Unique tags</span>
                        </div>
                        <div className={styles.resultStat}>
                            <strong>{finalTaps * SCORE_PER_TAP}</strong>
                            <span>Tap points</span>
                        </div>
                        <div className={styles.resultStat}>
                            <strong>+{finalUnique * SCORE_PER_UNIQUE}</strong>
                            <span>Unique bonus</span>
                        </div>
                    </div>

                    {scores.length > 0 && scores[0].score === finalScore && (
                        <div className={styles.newHighScore}>🎉 New personal best!</div>
                    )}

                    {scores.length > 0 && (
                        <div className={styles.leaderboard}>
                            <h3>🏆 All-Time Best</h3>
                            <div className={styles.scoreList}>
                                {scores.slice(0, 5).map((s, i) => (
                                    <div key={i} className={`${styles.scoreRow} ${s.score === finalScore && s.date === new Date().toLocaleDateString() ? styles.scoreRowHighlight : ''}`}>
                                        <span className={styles.scoreRank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                                        <span className={styles.scoreVal}>{s.score} pts</span>
                                        <span className={styles.scoreMeta}>{s.taps} taps · {s.unique} unique · {s.duration}s</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.resultActions}>
                        <button className={styles.playAgainBtn} onClick={() => { setPhase('setup'); setTimeLeft(duration); }}>
                            ↻ Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
