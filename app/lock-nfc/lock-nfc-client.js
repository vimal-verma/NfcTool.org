'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './page.module.css';
import {
    abortActiveNfcPush,
    registerActiveNfcController,
    releaseActiveNfcController,
    formatNfcError
} from '../utils/nfc-writer';

export default function LockNfcClient() {
    const [log, setLog] = useState([]);
    const [isSupported, setIsSupported] = useState(true);
    const [isLocking, setIsLocking] = useState(false);
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

    const handleCancelLock = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        abortActiveNfcPush();
        setIsLocking(false);
        addToLog('Lock operation cancelled by user.', 'info');
    };

    const handleConfirmLock = async () => {
        setShowModal(false);
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC API is not supported on this browser.', 'error');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsLocking(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog('Ready to lock tag. Hold your tag close to your device...', 'info');
            await ndef.makeReadOnly({ signal: controller.signal });
            addToLog('🔒 Tag locked successfully! It is now permanently read-only.', 'success');
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(`Lock failed: ${parsed.message}`, parsed.type);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsLocking(false);
                releaseActiveNfcController(controller);
            }
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
                <div className={styles.buttonGroup}>
                    {isLocking ? (
                        <>
                            <button className={styles.waitingButton} type="button">
                                <span>📡</span> Waiting for Tag to Lock...
                            </button>
                            <button
                                onClick={handleCancelLock}
                                className={styles.cancelActionBtn}
                                type="button"
                                aria-label="Cancel locking"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={!isSupported}
                            className={styles.lockButton}
                        >
                            {!isSupported ? '🚫 Web NFC Unsupported' : '🔒 Lock NFC Tag'}
                        </button>
                    )}
                </div>
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
