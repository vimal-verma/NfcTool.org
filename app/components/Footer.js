'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import Toast from './Toast';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setToastMessage(data.message);
        if (response.ok) setEmail('');
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
                        <Link href="/vcard">vCard Generator</Link>
                        <Link href="/upi">UPI QR Generator</Link>
                        <Link href="/qr">QR Tools</Link>
                        <Link href="/read-nfc">Read NFC Tag</Link>
                        <Link href="/write-nfc">Write NFC Tag</Link>
                        <Link href="/nfc-tool">Advanced NFC Tool</Link>
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
                        <input type="email" placeholder="Enter your email" aria-label="Email address for newsletter" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            <p className={styles.copyright}>&copy; {new Date().getFullYear()} NfcTool. All rights reserved.</p>
        </footer>
    );
}