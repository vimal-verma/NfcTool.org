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
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const toolPaths = useMemo(() => tools.map(t => t.href), []);

    const [isToolsNavVisible, setIsToolsNavVisible] = useState(toolPaths.includes(pathname));

    useEffect(() => {
        document.body.style.overflow = isNavOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isNavOpen]);

    useEffect(() => {
        setIsToolsNavVisible(toolPaths.includes(pathname));
    }, [pathname, toolPaths]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <header className={styles.header}>
                {isNavOpen && (
                    <div
                        className={styles.overlay}
                        onClick={() => setIsNavOpen(false)}
                    />
                )}
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.logo}>
                        NfcTool
                    </Link>

                    <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
                        <Link href="/" onClick={() => setIsNavOpen(false)} className={pathname === '/' ? styles.activeLink : ''}>Home</Link>
                        <button onClick={() => { setIsToolsNavVisible(prev => !prev); setIsNavOpen(false); }} className={`${styles.navButton} ${isToolsNavVisible ? styles.activeLink : ''}`}>
                            Our Tools <span className={`${styles.chevron} ${isToolsNavVisible ? styles.chevronOpen : ''}`}>▾</span>
                        </button>
                        <Link href="/games" onClick={() => setIsNavOpen(false)} className={pathname.startsWith('/games') || pathname === '/shufflehunt' ? styles.activeLink : ''}>🎮 Games</Link>
                        <Link href="/blog" onClick={() => setIsNavOpen(false)} className={pathname.startsWith('/blog') ? styles.activeLink : ''}>Blog</Link>
                        <Link href="/documentation" onClick={() => setIsNavOpen(false)} className={pathname.startsWith('/documentation') ? styles.activeLink : ''}>Documentation</Link>
                    </nav>

                    <div className={styles.headerActions}>
                        <div className={styles.themeToggler}>
                            <button onClick={() => toggleTheme('light')} className={mounted && theme === 'light' ? styles.activeTheme : ''} aria-label="Light theme">
                                ☀️
                            </button>
                            <button onClick={() => toggleTheme('dark')} className={mounted && theme === 'dark' ? styles.activeTheme : ''} aria-label="Dark theme">
                                🌙
                            </button>
                        </div>
                        <button
                            className={`${styles.hamburger} ${isNavOpen ? styles.hamburgerOpen : ''}`}
                            onClick={() => setIsNavOpen(!isNavOpen)}
                            aria-label="Toggle navigation"
                            aria-expanded={isNavOpen}
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