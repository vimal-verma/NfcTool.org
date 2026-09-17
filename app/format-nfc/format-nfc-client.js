'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './page.module.css';
import {
    abortActiveNfcPush,
    registerActiveNfcController,
    releaseActiveNfcController,
    formatNfcError
} from '../utils/nfc-writer';

export default function FormatNfcClient() {
    const [log, setLog] = useState([]);
    const [isSupported, setIsSupported] = useState(true);
    const [isFormatting, setIsFormatting] = useState(false);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && !('NDEFReader' in window)) {
            setIsSupported(false);
        }
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortActiveNfcPush();
        };
    }, []);

    const addToLog = useCallback((message, type = 'info') => {
        const formatted = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formatted}</span>`, ...prev]);
    }, []);

    const handleCancelFormat = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        abortActiveNfcPush();
        setIsFormatting(false);
        addToLog('Format operation cancelled by user.', 'info');
    };

    const handleFormat = async () => {
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC API is not supported in this browser.', 'error');
            return;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsFormatting(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog('📡 Ready to format. Bring your NFC tag close to your device.', 'info');
            await ndef.write("", { signal: controller.signal });
            addToLog('✅ Tag formatted successfully! Ready for NDEF data operations.', 'success');
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(parsed.message, parsed.type);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsFormatting(false);
                releaseActiveNfcController(controller);
            }
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
                <div className={styles.buttonGroup}>
                    <button
                        onClick={handleFormat}
                        disabled={isFormatting || !isSupported}
                        className={`${styles.actionButton} ${isFormatting ? styles.waitingButton : ''}`}
                    >
                        {!isSupported ? '🚫 Web NFC Unsupported' : isFormatting ? '📡 Waiting for Tag... Tap Now' : '🛠️ Format NFC Tag'}
                    </button>
                    {isFormatting && (
                        <button
                            type="button"
                            onClick={handleCancelFormat}
                            className={styles.cancelButton}
                        >
                            ✕ Cancel
                        </button>
                    )}
                </div>
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
