'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './page.module.css';
import {
    abortActiveNfcPush,
    registerActiveNfcController,
    releaseActiveNfcController,
    formatNfcError
} from '../utils/nfc-writer';

export default function EraseNfcClient() {
    const [log, setLog] = useState([]);
    const [isSupported, setIsSupported] = useState(true);
    const [isErasing, setIsErasing] = useState(false);
    const [showModal, setShowModal] = useState(false);
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

    const handleCancelErase = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        abortActiveNfcPush();
        setIsErasing(false);
        addToLog('Erase operation cancelled by user.', 'info');
    };

    const handleConfirmErase = async () => {
        setShowModal(false);
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC API is not supported on this browser.', 'error');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsErasing(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog('Ready to erase. Bring your NFC tag near your device...', 'info');
            await ndef.write("", { signal: controller.signal });
            addToLog('✅ Tag erased successfully! All NDEF records have been wiped.', 'success');
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(`Erase failed: ${parsed.message}`, parsed.type);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsErasing(false);
                releaseActiveNfcController(controller);
            }
        }
    };

    return (
        <div className={styles.toolContainer}>
            <div className={styles.actionCard}>
                <div className={styles.cardIcon}>🗑️</div>
                <h3 className={styles.cardTitle}>Wipe NFC Data</h3>
                <p className={styles.cardDesc}>
                    Erasing an NFC tag removes all active payload records (URLs, text, vCards). The tag remains writable and ready for new data.
                </p>
                <div className={styles.buttonGroup}>
                    {isErasing ? (
                        <>
                            <button className={styles.waitingButton} type="button">
                                <span>📡</span> Waiting for Tag to Erase...
                            </button>
                            <button
                                onClick={handleCancelErase}
                                className={styles.cancelActionBtn}
                                type="button"
                                aria-label="Cancel tag erase"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={!isSupported}
                            className={styles.dangerButton}
                        >
                            {!isSupported ? '🚫 Web NFC Unsupported' : '🗑️ Erase NFC Tag'}
                        </button>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>⚠️</div>
                        <h3>Confirm Tag Erasure</h3>
                        <p>Are you sure you want to wipe all records from this tag? This action cannot be undone once written.</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleConfirmErase} className={styles.confirmButton}>
                                Yes, Erase Tag
                            </button>
                            <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Developer Console */}
            <div className={styles.logContainer}>
                <div className={styles.logHeader}>
                    <div className={styles.logTitleWrapper}>
                        <div className={styles.logDots}>
                            <span className={`${styles.logDot} ${styles.red}`}></span>
                            <span className={`${styles.logDot} ${styles.yellow}`}></span>
                            <span className={`${styles.logDot} ${styles.green}`}></span>
                        </div>
                        <h3>Erase Console Output</h3>
                    </div>
                    <button onClick={() => setLog([])} className={styles.clearLogButton} disabled={log.length === 0}>
                        Clear
                    </button>
                </div>
                {log.length === 0 ? (
                    <div className={styles.log}>
                        <span style={{color:'#64748b', fontStyle:'italic'}}>Erase console ready. Click Erase NFC Tag to proceed...</span>
                    </div>
                ) : (
                    <div className={styles.log} dangerouslySetInnerHTML={{ __html: log.join('<br />') }} aria-live="polite" />
                )}
            </div>
        </div>
    );
}
