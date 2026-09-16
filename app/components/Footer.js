'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import Toast from './Toast';

const SUBSCRIBE_FALLBACK = 'We couldn’t sign you up just now. Email support@nfctool.org and we’ll add you.';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || status === 'sending') return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            setToastMessage(SUBSCRIBE_FALLBACK);
            return;
        }

        setStatus('sending');
        try {
            const response = await fetch(`${apiUrl}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                setToastMessage(data.message || 'You’re subscribed — thanks!');
                setEmail('');
            } else {
                setToastMessage(data.message || SUBSCRIBE_FALLBACK);
            }
        } catch {
            // Offline, blocked, or the endpoint is unreachable.
            setToastMessage(SUBSCRIBE_FALLBACK);
        } finally {
            setStatus('idle');
        }
    };

    return (
        <footer className={styles.footer}>
            <Toast message={toastMessage} onClose={() => setToastMessage('')} />
            <div className={styles.footerContent}>
                <div className={styles.footerBrand}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>📡</span> NfcTool
                    </Link>
                    <p className={styles.brandDesc}>
                        The modern, open-source platform to read, write, and manage NFC tags directly in your browser — plus instant QR generators for digital cards, payments, and WiFi.
                    </p>
                    <div className={styles.githubBadgeWrapper}>
                        <a
                            href="https://github.com/vimal-verma/NfcTool.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.githubBadge}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            <span>Open Source on GitHub</span>
                        </a>
                    </div>
                </div>

                <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                        <h4>Explore</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/documentation">Documentation</Link>
                        <Link href="/blog">Blog &amp; Guides</Link>
                        <Link href="/showcase">Showcase</Link>
                        <Link href="/games">🎮 NFC Games</Link>
                        <Link href="/contact">Contact Support</Link>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>NFC Tools</h4>
                        <Link href="/read-nfc">Read NFC Tag</Link>
                        <Link href="/write-nfc">Write NFC Tag</Link>
                        <Link href="/clone-nfc">Clone NFC Tag</Link>
                        <Link href="/erase-nfc">Erase NFC Tag</Link>
                        <Link href="/format-nfc">Format NFC Tag</Link>
                        <Link href="/lock-nfc">Lock NFC Tag</Link>
                        <Link href="/nfc-tool">Advanced Suite</Link>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>QR &amp; Smart Codes</h4>
                        <Link href="/vcard">vCard Generator</Link>
                        <Link href="/upi">UPI Payment QR</Link>
                        <Link href="/wifi">WiFi QR Code</Link>
                        <Link href="/url">URL QR Code</Link>
                        <Link href="/location">Location QR</Link>
                        <Link href="/event">Event Calendar QR</Link>
                        <Link href="/call">Phone Call QR</Link>
                        <Link href="/email">Email QR</Link>
                        <Link href="/sms">SMS QR</Link>
                        <Link href="/qr">All QR Tools →</Link>
                    </div>
                </div>

                <div className={styles.newsletter}>
                    <h4>Stay in the Loop</h4>
                    <p>Get notified about new NFC capabilities, browser updates, and Web NFC tips.</p>
                    <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Your email address"
                            aria-label="Email address for newsletter"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'sending'}
                            required
                        />
                        <button type="submit" disabled={status === 'sending' || !email}>
                            {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
                        </button>
                    </form>
                    <span className={styles.privacyNote}>🔒 No spam. We respect your privacy.</span>
                    <p aria-live="polite" className={styles.srOnly}>{toastMessage}</p>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p className={styles.copyright}>&copy; {new Date().getFullYear()} NfcTool. All rights reserved. 100% in-browser processing.</p>
                <div className={styles.bottomLinks}>
                    <Link href="/documentation">Docs</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </footer>
    );
}