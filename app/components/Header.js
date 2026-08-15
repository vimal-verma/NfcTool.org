'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import styles from './Header.module.css';
import SecondaryNav from './SecondaryNav';
import { tools } from '../lib/tool-list';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const pathname = usePathname();
    const toolPaths = useMemo(() => tools.map(t => t.href), []);

    const [isToolsNavVisible, setIsToolsNavVisible] = useState(toolPaths.includes(pathname));

    useEffect(() => {
        document.body.style.overflow = isNavOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isNavOpen]);

    // Escape closes the mobile drawer — expected of any modal-ish overlay.
    useEffect(() => {
        if (!isNavOpen) return;
        const onKeyDown = (e) => { if (e.key === 'Escape') setIsNavOpen(false); };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isNavOpen]);

    useEffect(() => {
        setIsToolsNavVisible(toolPaths.includes(pathname));
    }, [pathname, toolPaths]);

    return (
        <>
            <header className={styles.header}>
                {isNavOpen && (
                    <div
                        className={styles.overlay}
                        onClick={() => setIsNavOpen(false)}
                        aria-hidden="true"
                    />
                )}
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.logo} aria-label="NfcTool — home">
                        NfcTool
                    </Link>

                    <nav
                        id="primary-navigation"
                        aria-label="Main navigation"
                        className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}
                    >
                        <Link href="/" onClick={() => setIsNavOpen(false)} className={pathname === '/' ? styles.activeLink : ''} aria-current={pathname === '/' ? 'page' : undefined}>Home</Link>
                        <button
                            onClick={() => { setIsToolsNavVisible(prev => !prev); setIsNavOpen(false); }}
                            className={`${styles.navButton} ${isToolsNavVisible ? styles.activeLink : ''}`}
                            aria-expanded={isToolsNavVisible}
                            aria-controls="tools-nav"
                        >
                            Our Tools <span className={`${styles.chevron} ${isToolsNavVisible ? styles.chevronOpen : ''}`} aria-hidden="true">▾</span>
                        </button>
                        <Link href="/games" onClick={() => setIsNavOpen(false)} className={pathname.startsWith('/games') || pathname === '/shufflehunt' ? styles.activeLink : ''}>🎮 Games</Link>
                        <Link href="/blog" onClick={() => setIsNavOpen(false)} className={pathname.startsWith('/blog') ? styles.activeLink : ''}>Blog</Link>
                        <Link href="/documentation" onClick={() => setIsNavOpen(false)} className={pathname.startsWith('/documentation') ? styles.activeLink : ''}>Documentation</Link>
                    </nav>

                    <div className={styles.headerActions}>
                        <div className={styles.themeToggler} role="group" aria-label="Colour theme">
                            <button
                                onClick={() => toggleTheme('light')}
                                className={theme === 'light' ? styles.activeTheme : ''}
                                aria-label="Light theme"
                                aria-pressed={theme === 'light'}
                            >
                                <span aria-hidden="true">☀️</span>
                            </button>
                            <button
                                onClick={() => toggleTheme('dark')}
                                className={theme === 'dark' ? styles.activeTheme : ''}
                                aria-label="Dark theme"
                                aria-pressed={theme === 'dark'}
                            >
                                <span aria-hidden="true">🌙</span>
                            </button>
                        </div>
                        <button
                            className={`${styles.hamburger} ${isNavOpen ? styles.hamburgerOpen : ''}`}
                            onClick={() => setIsNavOpen(!isNavOpen)}
                            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isNavOpen}
                            aria-controls="primary-navigation"
                        >
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </header>
            {isToolsNavVisible && <SecondaryNav />}
        </>
    );
}