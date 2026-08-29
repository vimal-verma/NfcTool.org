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
                    <Link href="/" className={styles.logo}>NfcTool</Link>
                    <p>Learn, build, and use Web NFC technology directly in your browser.</p>
                    <br />
                    <a href="https://github.com/vimal-verma/webnfc" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                        <h4>Company</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/documentation">Documentation</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/contact">Contact Us</Link>
                        <Link href="/showcase">Showcase</Link>
                        <Link href="/games">🎮 Games</Link>
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
                        <h4>QR & Communication</h4>
                        <Link href="/call">Phone Call QR</Link>
                        <Link href="/email">Email QR</Link>
                        <Link href="/sms">SMS QR</Link>
                        <Link href="/url">URL QR</Link>
                        <Link href="/location">Location QR</Link>
                        <Link href="/wifi">WiFi QR</Link>
                        <Link href="/event">Event QR</Link>
                    </div>
                </div>
                <div className={styles.newsletter}>
                    <h4>Subscribe to our Newsletter</h4>
                    <p>Get the latest on NFC tech, new products, and exclusive offers.</p>
                    <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter your email"
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
                    <p aria-live="polite" className={styles.srOnly}>{toastMessage}</p>
                </div>
            </div>
            <p className={styles.copyright}>&copy; {new Date().getFullYear()} NfcTool. All rights reserved.</p>
        </footer>
    );
}