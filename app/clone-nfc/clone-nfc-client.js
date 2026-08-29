'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './page.module.css';

export default function CloneNfcClient() {
    const [log, setLog] = useState([]);
    const [isSupported, setIsSupported] = useState(true);
    const [step, setStep] = useState(1); // 1 = Read Source, 2 = Write Target
    const [isScanning, setIsScanning] = useState(false);
    const [clonedMessage, setClonedMessage] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && !('NDEFReader' in window)) {
            setIsSupported(false);
        }
    }, []);

    const addToLog = useCallback((message, type = 'info') => {
        const formatted = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formatted}</span>`, ...prev]);
    }, []);

    const handleReadSource = async () => {
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC API is not supported in this browser.', 'error');
            return;
        }

        try {
            const ndef = new window.NDEFReader();
            setIsScanning(true);
            addToLog('STEP 1: Scanning source tag. Hold the original NFC tag near your device.', 'info');
            await ndef.scan();

            ndef.addEventListener('reading', ({ message }) => {
                setClonedMessage(message);
                addToLog(`✅ Source tag read successfully! Captured ${message.records.length} NDEF record(s).`, 'success');
                addToLog('Proceeding to STEP 2: Write to Target Tag.', 'info');
                setIsScanning(false);
                setStep(2);
            });

            ndef.addEventListener('readingerror', () => {
                addToLog('Error reading source tag. Please try again.', 'error');
                setIsScanning(false);
            });
        } catch (error) {
            addToLog(`Read error: ${error.message}`, 'error');
            setIsScanning(false);
        }
    };

    const handleWriteTarget = async () => {
        if (!clonedMessage) {
            addToLog('No copied data found. Please read a source tag first.', 'warning');
            return;
        }

        try {
            const ndef = new window.NDEFReader();
            addToLog('STEP 2: Ready to write. Bring the destination NFC tag near your device.', 'info');
            await ndef.write(clonedMessage);
            addToLog('🎉 Target tag cloned successfully! Data written identical to source tag.', 'success');
        } catch (error) {
            addToLog(`Write failed: ${error.message}`, 'error');
        }
    };

    const resetCloneProcess = () => {
        setStep(1);
        setClonedMessage(null);
        setIsScanning(false);
        addToLog('Clone workflow reset. Ready to read a new source tag.', 'info');
    };

    return (
        <div className={styles.toolContainer}>
            <div className={styles.cloneCard}>
                <div className={styles.stepProgress}>
                    <div className={`${styles.stepBadge} ${step === 1 ? styles.activeStep : styles.completedStep}`}>
                        <span>1</span> Read Source Tag
                    </div>
                    <div className={styles.stepConnector}></div>
                    <div className={`${styles.stepBadge} ${step === 2 ? styles.activeStep : ''}`}>
                        <span>2</span> Write Target Tag
                    </div>
                </div>

                {step === 1 && (
                    <div className={styles.stepContent}>
                        <div className={styles.stepIcon}>📋</div>
                        <h3 className={styles.stepTitle}>Step 1: Scan Original NFC Tag</h3>
                        <p className={styles.stepDesc}>
                            Tap the button below and hold the original NFC tag against your device to copy its NDEF message.
                        </p>
                        <button
                            onClick={handleReadSource}
                            disabled={isScanning || !isSupported}
                            className={styles.actionButton}
                        >
                            {!isSupported ? '🚫 Web NFC Unsupported' : isScanning ? '📡 Scanning Source Tag...' : '📡 Read Source Tag'}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <div className={styles.stepIcon}>✨</div>
                        <h3 className={styles.stepTitle}>Step 2: Write to Destination Tag</h3>
                        <p className={styles.stepDesc}>
                            Source data captured ({clonedMessage?.records.length || 0} records). Place your blank destination NFC tag near your device.
                        </p>
                        <div className={styles.buttonGroup}>
                            <button
                                onClick={handleWriteTarget}
                                disabled={!isSupported}
                                className={styles.actionButton}
                            >
                                ✍️ Write Cloned Data
                            </button>
                            <button onClick={resetCloneProcess} className={styles.secondaryButton}>
                                🔄 Start Over
                            </button>
                        </div>
                    </div>
                )}
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
                        <h3>Clone Console Output</h3>
                    </div>
                    <button onClick={() => setLog([])} className={styles.clearLogButton} disabled={log.length === 0}>
                        Clear
                    </button>
                </div>
                {log.length === 0 ? (
                    <div className={styles.log}>
                        <span style={{color:'#64748b', fontStyle:'italic'}}>Clone console active. Click Step 1 to begin...</span>
                    </div>
                ) : (
                    <div className={styles.log} dangerouslySetInnerHTML={{ __html: log.join('<br />') }} aria-live="polite" />
                )}
            </div>
        </div>
    );
}
