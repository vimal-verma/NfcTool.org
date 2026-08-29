'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './page.module.css';

export default function EraseNfcClient() {
    const [log, setLog] = useState([]);
    const [isSupported, setIsSupported] = useState(true);
    const [isErasing, setIsErasing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !('NDEFReader' in window)) {
            setIsSupported(false);
        }
    }, []);

    const addToLog = useCallback((message, type = 'info') => {
        const formatted = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formatted}</span>`, ...prev]);
    }, []);

    const handleConfirmErase = async () => {
        setShowModal(false);
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC API is not supported on this browser.', 'error');
            return;
        }

        try {
            const ndef = new window.NDEFReader();
            setIsErasing(true);
            addToLog('Ready to erase. Bring your NFC tag near your device.', 'info');
            await ndef.write("");
            addToLog('✅ Tag erased successfully! All NDEF records have been wiped.', 'success');
        } catch (error) {
            addToLog(`Erase failed: ${error.message}`, 'error');
        } finally {
            setIsErasing(false);
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
                <button
                    onClick={() => setShowModal(true)}
                    disabled={isErasing || !isSupported}
                    className={styles.dangerButton}
                >
                    {!isSupported ? '🚫 Web NFC Unsupported' : isErasing ? '📡 Waiting for Tag...' : '🗑️ Erase NFC Tag'}
                </button>
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
