'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './page.module.css';

export default function FormatNfcClient() {
    const [log, setLog] = useState([]);
    const [isSupported, setIsSupported] = useState(true);
    const [isFormatting, setIsFormatting] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !('NDEFReader' in window)) {
            setIsSupported(false);
        }
    }, []);

    const addToLog = useCallback((message, type = 'info') => {
        const formatted = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formatted}</span>`, ...prev]);
    }, []);

    const handleFormat = async () => {
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC API is not supported in this browser.', 'error');
            return;
        }

        try {
            const ndef = new window.NDEFReader();
            setIsFormatting(true);
            addToLog('Ready to format. Bring your NFC tag close to your device.', 'info');
            await ndef.write("");
            addToLog('✅ Tag formatted successfully! Ready for NDEF data operations.', 'success');
        } catch (error) {
            addToLog(`Format failed: ${error.message}`, 'error');
        } finally {
            setIsFormatting(false);
        }
    };

    return (
        <div className={styles.toolContainer}>
            <div className={styles.actionCard}>
                <div className={styles.cardIcon}>🛠️</div>
                <h3 className={styles.cardTitle}>Format Tag for NDEF</h3>
                <p className={styles.cardDesc}>
                    Formatting resets the memory structure of an NFC tag so it can reliably store Web NDEF data records like URLs, contacts, and text messages.
                </p>
                <button
                    onClick={handleFormat}
                    disabled={isFormatting || !isSupported}
                    className={styles.actionButton}
                >
                    {!isSupported ? '🚫 Web NFC Unsupported' : isFormatting ? '📡 Bring Tag Close...' : '🛠️ Format NFC Tag'}
                </button>
            </div>

            {/* Developer Console */}
            <div className={styles.logContainer}>
                <div className={styles.logHeader}>
                    <div className={styles.logTitleWrapper}>
                        <div className={styles.logDots}>
                            <span className={`${styles.logDot} ${styles.red}`}></span>
                            <span className={`${styles.logDot} ${styles.yellow}`}></span>
                            <span className={`${styles.logDot} ${styles.green}`}></span>
                        </div>
                        <h3>Format Console Output</h3>
                    </div>
                    <button onClick={() => setLog([])} className={styles.clearLogButton} disabled={log.length === 0}>
                        Clear
                    </button>
                </div>
                {log.length === 0 ? (
                    <div className={styles.log}>
                        <span style={{color:'#64748b', fontStyle:'italic'}}>Format console active. Click Format NFC Tag to begin...</span>
                    </div>
                ) : (
                    <div className={styles.log} dangerouslySetInnerHTML={{ __html: log.join('<br />') }} aria-live="polite" />
                )}
            </div>
        </div>
    );
}
