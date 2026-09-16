'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './HomeToolsFilter.module.css';
import { tools } from '../lib/tool-list';

export default function HomeToolsFilter() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = useMemo(() => {
        return tools.filter((tool) => {
            let matchesCategory = true;
            if (selectedCategory === 'nfc-qr') {
                matchesCategory = tool.category === 'nfc-qr';
            } else if (selectedCategory === 'nfc-hardware') {
                matchesCategory = tool.category === 'nfc-hardware';
            } else if (selectedCategory === 'qr') {
                matchesCategory = tool.hasQr;
            }

            const matchesSearch =
                !searchQuery.trim() ||
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tool.badge && tool.badge.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const hybridCount = useMemo(() => tools.filter(t => t.category === 'nfc-qr').length, []);
    const hardwareCount = useMemo(() => tools.filter(t => t.category === 'nfc-hardware').length, []);
    const qrCount = useMemo(() => tools.filter(t => t.hasQr).length, []);

    return (
        <div className={styles.container}>
            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.tabs} role="tablist" aria-label="Tool Categories">
                    <button
                        role="tab"
                        aria-selected={selectedCategory === 'all'}
                        className={`${styles.tab} ${selectedCategory === 'all' ? styles.activeTab : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        ✨ All Tools <span className={styles.countBadge}>{tools.length}</span>
                    </button>
                    <button
                        role="tab"
                        aria-selected={selectedCategory === 'nfc-qr'}
                        className={`${styles.tab} ${selectedCategory === 'nfc-qr' ? styles.activeTab : ''}`}
                        onClick={() => setSelectedCategory('nfc-qr')}
                    >
                        ⚡ NFC + QR <span className={styles.countBadge}>{hybridCount}</span>
                    </button>
                    <button
                        role="tab"
                        aria-selected={selectedCategory === 'nfc-hardware'}
                        className={`${styles.tab} ${selectedCategory === 'nfc-hardware' ? styles.activeTab : ''}`}
                        onClick={() => setSelectedCategory('nfc-hardware')}
                    >
                        📡 NFC Tag Tools <span className={styles.countBadge}>{hardwareCount}</span>
                    </button>
                    <button
                        role="tab"
                        aria-selected={selectedCategory === 'qr'}
                        className={`${styles.tab} ${selectedCategory === 'qr' ? styles.activeTab : ''}`}
                        onClick={() => setSelectedCategory('qr')}
                    >
                        🔳 All QR <span className={styles.countBadge}>{qrCount}</span>
                    </button>
                </div>

                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon} aria-hidden="true">🔍</span>
                    <input
                        type="search"
                        placeholder="Search NFC or QR tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        aria-label="Filter tools by name"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className={styles.clearSearch}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Tools Grid */}
            <div className={styles.grid}>
                {filteredTools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className={styles.card}>
                        <div className={styles.cardTop}>
                            <div className={styles.iconBox}>{tool.icon}</div>
                            <span className={`${styles.badge} ${
                                tool.category === 'nfc-qr'
                                    ? styles.hybridBadge
                                    : tool.category === 'nfc-hardware'
                                    ? styles.nfcBadge
                                    : styles.qrBadge
                            }`}>
                                {tool.badge || (tool.category === 'nfc-qr' ? 'NFC + QR' : 'NFC')}
                            </span>
                        </div>
                        <div className={styles.cardInfo}>
                            <h3 className={styles.toolName}>
                                {tool.name}
                                <span className={styles.arrow} aria-hidden="true">→</span>
                            </h3>
                            <p className={styles.toolDesc}>{tool.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredTools.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No tools matched &ldquo;{searchQuery}&rdquo;</p>
                    <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className={styles.resetButton}>
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}
