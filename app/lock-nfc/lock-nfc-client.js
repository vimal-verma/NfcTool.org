'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './page.module.css';

export default function LockNfcClient() {
    const [log, setLog] = useState([]);
    const [isSupported, setIsSupported] = useState(true);
    const [isLocking, setIsLocking] = useState(false);
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

    const handleConfirmLock = async () => {
        setShowModal(false);
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC API is not supported on this browser.', 'error');
            return;
        }

        try {
            const ndef = new window.NDEFReader();
            setIsLocking(true);
            addToLog('Ready to lock tag. Hold your tag close to your device.', 'info');
            await ndef.makeReadOnly();
            addToLog('🔒 Tag locked successfully! It is now permanently read-only.', 'success');
        } catch (error) {
            addToLog(`Lock failed: ${error.message}`, 'error');
        } finally {
            setIsLocking(false);
        }
    };

    return (
        <div className={styles.toolContainer}>
            <div className={styles.actionCard}>
                <div className={styles.cardIcon}>🔒</div>
                <h3 className={styles.cardTitle}>Make Tag Read-Only</h3>
                <p className={styles.cardDesc}>
                    <strong style={{color:'#f87171'}}>Warning:</strong> Locking an NFC tag is permanent and irreversible. Once locked, no user or software can edit, update, or erase the tag ever again.
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={isLocking || !isSupported}
                    className={styles.lockButton}
                >
                    {!isSupported ? '🚫 Web NFC Unsupported' : isLocking ? '📡 Waiting for Tag...' : '🔒 Lock NFC Tag'}
                </button>
            </div>

            {/* Warning Confirmation Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>🚨</div>
                        <h3>Permanent Lock Warning</h3>
                        <p>
                            Are you 100% sure you want to permanently lock this NFC tag? This action <strong>CANNOT BE REVERSED</strong>.
                        </p>
                        <div className={styles.modalActions}>
                            <button onClick={handleConfirmLock} className={styles.confirmButton}>
                                Yes, Permanently Lock
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
                        <h3>Lock Console Output</h3>
                    </div>
                    <button onClick={() => setLog([])} className={styles.clearLogButton} disabled={log.length === 0}>
                        Clear
                    </button>
                </div>
                {log.length === 0 ? (
                    <div className={styles.log}>
                        <span style={{color:'#64748b', fontStyle:'italic'}}>Lock console ready. Click Lock NFC Tag to proceed...</span>
                    </div>
                ) : (
                    <div className={styles.log} dangerouslySetInnerHTML={{ __html: log.join('<br />') }} aria-live="polite" />
                )}
            </div>
        </div>
    );
}
