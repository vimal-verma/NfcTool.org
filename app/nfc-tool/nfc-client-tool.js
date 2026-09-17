'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './page.module.css';
import {
    abortActiveNfcPush,
    registerActiveNfcController,
    releaseActiveNfcController,
    formatNfcError
} from '../utils/nfc-writer';

export default function NfcClientTool() {
    const [readLog, setReadLog] = useState([]);
    const [writeLog, setWriteLog] = useState([]);
    const [writeData, setWriteData] = useState('');
    const recordTypeDetails = {
        text: {
            placeholder: 'Enter any text',
            instruction: 'Writes a plain text record to the tag.',
        },
        url: {
            placeholder: 'https://example.com',
            instruction: 'Writes a URL. Make sure to include the protocol (e.g., https://).',
        },
        vcard: {
            instruction: 'Writes a contact card (vCard) to the tag. Fill in the details below.',
        },
    };
    const faqs = [
        {
            question: 'Which browsers and devices are supported?',
            answer: 'Web NFC is a new technology currently supported by Chrome on Android devices. It is not available on iOS (iPhone/iPad) or on desktop browsers like Chrome for Windows/Mac, Firefox, or Safari.',
        },
        {
            question: 'Why can\'t I clone the ID of a tag?',
            answer: 'The unique ID (UID) of an NFC tag is a read-only hardware identifier burned into the chip by the manufacturer. The Web NFC API, like most high-level APIs, does not allow changing this ID. Our "Clone" feature copies the NDEF data message from one tag to another, not the UID.',
        },
        {
            question: 'What is the difference between Erase and Format?',
            answer: '<strong>Erase:</strong> This removes the NDEF message (the data) from a tag, making it blank but keeping it formatted. You can write new data to it right away. <br/><strong>Format:</strong> This prepares a new or non-NDEF tag to be able to store NDEF data. It also erases any existing data in the process.',
        },
        {
            question: 'Is it safe to use the "Lock Tag" feature?',
            answer: 'Locking a tag is a permanent action. Once a tag is locked, it becomes read-only forever and cannot be erased, reformatted, or have its data changed. Use this feature with caution and only when you are certain the data on the tag should never be altered.',
        },
        {
            question: 'Why does the "Read Tag" scan stop after one tag?',
            answer: 'To provide a stable user experience and prevent accidental re-scans, the read operation is designed to stop after the first successful scan. You can simply press the "Start Scan" button again to read another tag.',
        },
    ];
    const [vCardData, setVCardData] = useState({ name: '', phone: '', email: '' });
    const [isScanning, setIsScanning] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [cloneLog, setCloneLog] = useState([]);
    const [clonedMessage, setClonedMessage] = useState(null);
    const [isCloning, setIsCloning] = useState(false);
    const [isCloneWriting, setIsCloneWriting] = useState(false);
    const [eraseLog, setEraseLog] = useState([]);
    const [isErasing, setIsErasing] = useState(false);
    const [showEraseConfirmation, setShowEraseConfirmation] = useState(false);
    const [formatLog, setFormatLog] = useState([]);
    const [isFormatting, setIsFormatting] = useState(false);
    const [lockLog, setLockLog] = useState([]);
    const [isLocking, setIsLocking] = useState(false);
    const [showLockConfirmation, setShowLockConfirmation] = useState(false);
    const [recordType, setRecordType] = useState('text');
    const activeControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (activeControllerRef.current) {
                activeControllerRef.current.abort();
            }
            abortActiveNfcPush();
        };
    }, []);

    const addToLog = useCallback((setter, message) => {
        setter(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
    }, []);

    const handleCancelOperation = (operationName, stateSetter, logSetter) => {
        if (activeControllerRef.current) {
            activeControllerRef.current.abort();
            activeControllerRef.current = null;
        }
        abortActiveNfcPush();
        stateSetter(false);
        addToLog(logSetter, `${operationName} operation cancelled by user.`);
    };

    const handleRead = async () => {
        if (!('NDEFReader' in window)) {
            addToLog(setReadLog, 'Web NFC is not supported on this browser.');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        activeControllerRef.current = controller;
        setIsScanning(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog(setReadLog, 'NFC scan started. Bring an NFC tag close to your device...');

            await ndef.scan({ signal: controller.signal });

            ndef.addEventListener('reading', ({ message, serialNumber }) => {
                addToLog(setReadLog, `Tag detected! Serial Number: ${serialNumber}`);
                for (const record of message.records) {
                    addToLog(setReadLog, `> Record Type: ${record.recordType}`);
                    addToLog(setReadLog, `> Media Type: ${record.mediaType || 'N/A'}`);
                    addToLog(setReadLog, `> Record ID: ${record.id || 'N/A'}`);

                    switch (record.recordType) {
                        case 'text': {
                            const textDecoder = new TextDecoder(record.encoding);
                            addToLog(setReadLog, `> Content: ${textDecoder.decode(record.data)}`);
                            break;
                        }
                        case 'url': {
                            const textDecoder = new TextDecoder();
                            addToLog(setReadLog, `> URL: ${textDecoder.decode(record.data)}`);
                            break;
                        }
                        case 'mime':
                            if (record.mediaType === 'text/vcard') {
                                const vcardText = new TextDecoder().decode(record.data);
                                addToLog(setReadLog, `> vCard Content:`);
                                vcardText.split('\n').forEach(line => {
                                    if (line.trim()) addToLog(setReadLog, `  ${line.trim()}`);
                                });
                            } else {
                                addToLog(setReadLog, `> MIME Data: ${record.data ? new TextDecoder().decode(record.data) : 'No data'}`);
                            }
                            break;
                        default:
                            addToLog(setReadLog, `> Data: ${record.data ? new TextDecoder().decode(record.data) : 'No data'}`);
                    }
                }
                setIsScanning(false);
                if (activeControllerRef.current === controller) activeControllerRef.current = null;
            });

            ndef.addEventListener('readingerror', () => {
                addToLog(setReadLog, 'Error reading NFC tag.');
                setIsScanning(false);
            });

        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(setReadLog, `Error: ${parsed.message}`);
            setIsScanning(false);
        }
    };

    const handleWrite = async () => {
        if (!('NDEFReader' in window)) {
            addToLog(setWriteLog, 'Web NFC is not supported on this browser.');
            return;
        }

        if (!writeData && recordType !== 'vcard') {
            addToLog(setWriteLog, 'Please enter data to write.');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        activeControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsWriting(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog(setWriteLog, 'Ready to write. Bring a tag close to your device...');

            let record;
            if (recordType === 'url') {
                const normalized = /^https?:\/\//i.test(writeData.trim()) ? writeData.trim() : `https://${writeData.trim()}`;
                record = { recordType: 'url', data: normalized };
            } else if (recordType === 'vcard') {
                if (!vCardData.name.trim()) {
                    addToLog(setWriteLog, 'Please enter at least a name for the vCard.');
                    setIsWriting(false);
                    return;
                }
                const vCardString = `BEGIN:VCARD\nVERSION:3.0\nFN:${vCardData.name.trim()}\nTEL;TYPE=CELL:${vCardData.phone.trim()}\nEMAIL:${vCardData.email.trim()}\nEND:VCARD`;
                record = { recordType: 'mime', mediaType: 'text/vcard', data: vCardString };
            } else {
                record = { recordType: 'text', data: writeData };
            }

            if (!record) return;

            await ndef.write({
                records: [record]
            }, { signal: controller.signal });

            if (recordType === 'vcard') {
                addToLog(setWriteLog, `✅ Successfully wrote vCard for "${vCardData.name}" to the tag.`);
                setVCardData({ name: '', phone: '', email: '' });
            } else {
                addToLog(setWriteLog, `✅ Successfully wrote [${recordType}] "${writeData}" to the tag.`);
            }
            setWriteData('');
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(setWriteLog, `Write failed: ${parsed.message}`);
        } finally {
            if (activeControllerRef.current === controller) {
                setIsWriting(false);
                releaseActiveNfcController(controller);
            }
        }
    };

    const handleCloneRead = async () => {
        if (!('NDEFReader' in window)) {
            addToLog(setCloneLog, 'Web NFC is not supported on this browser.');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        activeControllerRef.current = controller;
        setIsCloning(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog(setCloneLog, 'CLONE (Step 1): Scan the source tag to copy its data.');
            await ndef.scan({ signal: controller.signal });

            ndef.addEventListener('reading', ({ message }) => {
                setClonedMessage(message);
                addToLog(setCloneLog, `✅ Source tag read successfully. ${message.records.length} record(s) copied.`);
                addToLog(setCloneLog, 'Ready for CLONE (Step 2).');
                setIsCloning(false);
                if (activeControllerRef.current === controller) activeControllerRef.current = null;
            });

            ndef.addEventListener('readingerror', () => {
                addToLog(setCloneLog, 'Error reading the source tag.');
                setIsCloning(false);
            });
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(setCloneLog, `Error: ${parsed.message}`);
            setIsCloning(false);
        }
    };

    const handleCloneWrite = async () => {
        if (!clonedMessage) {
            addToLog(setCloneLog, 'No data to clone. Please read a source tag first.');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        activeControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsCloneWriting(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog(setCloneLog, 'CLONE (Step 2): Bring the new tag close to write the copied data...');
            await ndef.write(clonedMessage, { signal: controller.signal });
            addToLog(setCloneLog, '✅ New tag written successfully!');
            setClonedMessage(null);
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(setCloneLog, `Write failed: ${parsed.message}`);
        } finally {
            if (activeControllerRef.current === controller) {
                setIsCloneWriting(false);
                releaseActiveNfcController(controller);
            }
        }
    };

    const handleErase = async () => {
        setShowEraseConfirmation(false);
        if (!('NDEFReader' in window)) {
            addToLog(setEraseLog, 'Web NFC is not supported on this browser.');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        activeControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsErasing(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog(setEraseLog, 'Ready to erase. Bring a tag close to your device...');
            await ndef.write("", { signal: controller.signal });
            addToLog(setEraseLog, '✅ Tag erased successfully.');
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(setEraseLog, `Erase failed: ${parsed.message}`);
        } finally {
            if (activeControllerRef.current === controller) {
                setIsErasing(false);
                releaseActiveNfcController(controller);
            }
        }
    };

    const handleFormat = async () => {
        if (!('NDEFReader' in window)) {
            addToLog(setFormatLog, 'Web NFC is not supported on this browser.');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        activeControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsFormatting(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog(setFormatLog, 'Ready to format. Bring a tag close to your device...');
            await ndef.write("", { signal: controller.signal });
            addToLog(setFormatLog, '✅ Tag formatted successfully.');
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(setFormatLog, `Format failed: ${parsed.message}`);
        } finally {
            if (activeControllerRef.current === controller) {
                setIsFormatting(false);
                releaseActiveNfcController(controller);
            }
        }
    };

    const handleLock = async () => {
        setShowLockConfirmation(false);
        if (!('NDEFReader' in window)) {
            addToLog(setLockLog, 'Web NFC is not supported on this browser.');
            return;
        }

        abortActiveNfcPush();
        const controller = new AbortController();
        activeControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsLocking(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog(setLockLog, 'Ready to lock. Bring a tag close to your device...');
            await ndef.makeReadOnly({ signal: controller.signal });
            addToLog(setLockLog, '✅ Tag locked successfully. It is now permanently read-only.');
        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(setLockLog, `Lock failed: ${parsed.message}`);
        } finally {
            if (activeControllerRef.current === controller) {
                setIsLocking(false);
                releaseActiveNfcController(controller);
            }
        }
    };

    const getCloneStatus = () => {
        if (isCloning) {
            return {
                className: styles.cloningStep1,
                message: 'Waiting for source tag... Hold it near your device.'
            };
        }
        if (clonedMessage) {
            return {
                className: styles.cloningStep2,
                message: 'Data copied! Now hold the new tag near your device to write.'
            };
        }
        return { className: '', message: 'Copy the data from one NFC tag to another.' };
    };

    const cloneStatus = getCloneStatus();

    return (
        <>
            <div className={styles.toolGrid}>
                {/* Read Tag */}
                <div className={`${styles.toolSection} ${isScanning ? styles.scanning : ''}`}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>📡</div>
                            <h3 className={styles.sectionTitle}>Read Tag</h3>
                        </div>
                        <p className={styles.sectionDescription}>Scan any NDEF formatted NFC tag to read text, URLs, contacts, or MIME data.</p>
                        {isScanning ? (
                            <div className={styles.buttonGroup}>
                                <button className={styles.waitingButton} type="button">
                                    <span>📡</span> Scanning Tag...
                                </button>
                                <button
                                    onClick={() => handleCancelOperation('Scan', setIsScanning, setReadLog)}
                                    className={styles.cancelActionBtn}
                                    type="button"
                                    aria-label="Cancel scan"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleRead} className={styles.actionButton}>
                                📡 Start Scan
                            </button>
                        )}
                    </div>
                    <div className={styles.logContainer}>
                        <div className={styles.logHeader}>
                            <div className={styles.logTitleWrapper}>
                                <div className={styles.logDots}>
                                    <span className={`${styles.logDot} ${styles.red}`}></span>
                                    <span className={`${styles.logDot} ${styles.yellow}`}></span>
                                    <span className={`${styles.logDot} ${styles.green}`}></span>
                                </div>
                                <h3>Read Console</h3>
                            </div>
                            <button onClick={() => setReadLog([])} className={styles.clearLogButton} disabled={readLog.length === 0}>
                                Clear
                            </button>
                        </div>
                        <div className={styles.log}>
                            {readLog.length === 0 ? <p className={styles.emptyLogMessage}>No activity logged yet.</p> : readLog.map((entry, i) => <p key={i}>{entry}</p>)}
                        </div>
                    </div>
                </div>

                {/* Write Tag */}
                <div className={styles.toolSection}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>✍️</div>
                            <h3 className={styles.sectionTitle}>Write Tag</h3>
                        </div>
                        <div className={styles.writeInputGroup}>
                            <select
                                value={recordType}
                                onChange={(e) => setRecordType(e.target.value)}
                                className={styles.recordTypeSelect}
                            >
                                <option value="text">📝 Text Record</option>
                                <option value="url">🔗 URL Link</option>
                                <option value="vcard">📇 Contact (vCard)</option>
                            </select>
                            {recordType !== 'vcard' && (
                                <input
                                    type="text"
                                    value={writeData}
                                    onChange={(e) => setWriteData(e.target.value)}
                                    placeholder={recordTypeDetails[recordType].placeholder}
                                    className={styles.writeInput}
                                />
                            )}
                        </div>
                        {recordType === 'vcard' && (
                            <div className={styles.vcardForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="vcard-name">Full Name *</label>
                                    <input id="vcard-name" type="text" value={vCardData.name} onChange={(e) => setVCardData({ ...vCardData, name: e.target.value })} placeholder="John Doe" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="vcard-phone">Phone Number</label>
                                    <input id="vcard-phone" type="tel" value={vCardData.phone} onChange={(e) => setVCardData({ ...vCardData, phone: e.target.value })} placeholder="+1 234 567 890" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="vcard-email">Email Address</label>
                                    <input id="vcard-email" type="email" value={vCardData.email} onChange={(e) => setVCardData({ ...vCardData, email: e.target.value })} placeholder="john@example.com" />
                                </div>
                            </div>
                        )}
                        <p className={styles.instructionText}>
                            {recordTypeDetails[recordType].instruction}
                        </p>
                        {isWriting ? (
                            <div className={styles.buttonGroup}>
                                <button className={styles.waitingButton} type="button">
                                    <span>📡</span> Waiting for Tag to Write...
                                </button>
                                <button
                                    onClick={() => handleCancelOperation('Write', setIsWriting, setWriteLog)}
                                    className={styles.cancelActionBtn}
                                    type="button"
                                    aria-label="Cancel write"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleWrite} className={`${styles.actionButton} ${styles.writeButton}`} disabled={recordType === 'vcard' && !vCardData.name}>
                                ✍️ Write to Tag
                            </button>
                        )}
                    </div>
                    <div className={styles.logContainer}>
                        <div className={styles.logHeader}>
                            <div className={styles.logTitleWrapper}>
                                <div className={styles.logDots}>
                                    <span className={`${styles.logDot} ${styles.red}`}></span>
                                    <span className={`${styles.logDot} ${styles.yellow}`}></span>
                                    <span className={`${styles.logDot} ${styles.green}`}></span>
                                </div>
                                <h3>Write Console</h3>
                            </div>
                            <button onClick={() => setWriteLog([])} className={styles.clearLogButton} disabled={writeLog.length === 0}>
                                Clear
                            </button>
                        </div>
                        <div className={styles.log}>
                            {writeLog.length === 0 ? <p className={styles.emptyLogMessage}>No activity logged yet.</p> : writeLog.map((entry, i) => <p key={i}>{entry}</p>)}
                        </div>
                    </div>
                </div>

                {/* Clone Tag */}
                <div className={`${styles.toolSection} ${cloneStatus.className}`}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>📋</div>
                            <h3 className={styles.sectionTitle}>Clone Tag</h3>
                        </div>
                        <p className={styles.cloneStatusMessage}>{cloneStatus.message}</p>
                        <div className={styles.cloneSteps}>
                            {isCloning ? (
                                <div className={styles.buttonGroup}>
                                    <button className={styles.waitingButton} type="button">
                                        <span>📡</span> Scanning Source...
                                    </button>
                                    <button
                                        onClick={() => handleCancelOperation('Clone scan', setIsCloning, setCloneLog)}
                                        className={styles.cancelActionBtn}
                                        type="button"
                                        aria-label="Cancel clone scan"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handleCloneRead} disabled={clonedMessage} className={styles.actionButton}>
                                    Step 1: Read Source Tag
                                </button>
                            )}
                            {isCloneWriting ? (
                                <div className={styles.buttonGroup}>
                                    <button className={styles.waitingButton} type="button">
                                        <span>📡</span> Writing Target...
                                    </button>
                                    <button
                                        onClick={() => handleCancelOperation('Clone write', setIsCloneWriting, setCloneLog)}
                                        className={styles.cancelActionBtn}
                                        type="button"
                                        aria-label="Cancel clone write"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handleCloneWrite} disabled={!clonedMessage} className={styles.actionButton}>
                                    Step 2: Write to Target Tag
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => { setClonedMessage(null); setCloneLog([]); setIsCloning(false); setIsCloneWriting(false); }}
                            className={styles.resetCloneButton}
                            disabled={!clonedMessage && cloneLog.length === 0 && !isCloning && !isCloneWriting}
                        >
                            Reset Clone Process
                        </button>
                    </div>
                    <div className={styles.logContainer}>
                        <div className={styles.logHeader}>
                            <div className={styles.logTitleWrapper}>
                                <div className={styles.logDots}>
                                    <span className={`${styles.logDot} ${styles.red}`}></span>
                                    <span className={`${styles.logDot} ${styles.yellow}`}></span>
                                    <span className={`${styles.logDot} ${styles.green}`}></span>
                                </div>
                                <h3>Clone Console</h3>
                            </div>
                            <button onClick={() => setCloneLog([])} className={styles.clearLogButton} disabled={cloneLog.length === 0}>
                                Clear
                            </button>
                        </div>
                        <div className={styles.log}>
                            {cloneLog.length === 0 ? <p className={styles.emptyLogMessage}>No activity logged yet.</p> : cloneLog.map((entry, i) => <p key={i}>{entry}</p>)}
                        </div>
                    </div>
                </div>

                {/* Erase Tag */}
                <div className={styles.toolSection}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>🧹</div>
                            <h3 className={styles.sectionTitle}>Erase Tag</h3>
                        </div>
                        <p className={styles.sectionDescription}>Removes all NDEF payload records from your tag, restoring it to a clean blank state.</p>
                        {isErasing ? (
                            <div className={styles.buttonGroup}>
                                <button className={`${styles.waitingButton} ${styles.waitingButtonDanger}`} type="button">
                                    <span>📡</span> Waiting for Tag to Erase...
                                </button>
                                <button
                                    onClick={() => handleCancelOperation('Erase', setIsErasing, setEraseLog)}
                                    className={styles.cancelActionBtn}
                                    type="button"
                                    aria-label="Cancel erase"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setShowEraseConfirmation(true)} className={`${styles.actionButton} ${styles.eraseButton}`}>
                                🧹 Erase NFC Tag
                            </button>
                        )}
                    </div>
                    <div className={styles.logContainer}>
                        <div className={styles.logHeader}>
                            <div className={styles.logTitleWrapper}>
                                <div className={styles.logDots}>
                                    <span className={`${styles.logDot} ${styles.red}`}></span>
                                    <span className={`${styles.logDot} ${styles.yellow}`}></span>
                                    <span className={`${styles.logDot} ${styles.green}`}></span>
                                </div>
                                <h3>Erase Console</h3>
                            </div>
                            <button onClick={() => setEraseLog([])} className={styles.clearLogButton} disabled={eraseLog.length === 0}>
                                Clear
                            </button>
                        </div>
                        <div className={styles.log}>
                            {eraseLog.length === 0 ? <p className={styles.emptyLogMessage}>No activity logged yet.</p> : eraseLog.map((entry, i) => <p key={i}>{entry}</p>)}
                        </div>
                    </div>
                </div>

                {/* Format Tag */}
                <div className={styles.toolSection}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>⚙️</div>
                            <h3 className={styles.sectionTitle}>Format Tag</h3>
                        </div>
                        <p className={styles.sectionDescription}>Formats a fresh or non-NDEF uninitialized tag so it can be written to using NDEF standard.</p>
                        {isFormatting ? (
                            <div className={styles.buttonGroup}>
                                <button className={styles.waitingButton} type="button">
                                    <span>📡</span> Waiting for Tag to Format...
                                </button>
                                <button
                                    onClick={() => handleCancelOperation('Format', setIsFormatting, setFormatLog)}
                                    className={styles.cancelActionBtn}
                                    type="button"
                                    aria-label="Cancel format"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleFormat} className={`${styles.actionButton} ${styles.formatButton}`}>
                                ⚙️ Format Tag to NDEF
                            </button>
                        )}
                    </div>
                    <div className={styles.logContainer}>
                        <div className={styles.logHeader}>
                            <div className={styles.logTitleWrapper}>
                                <div className={styles.logDots}>
                                    <span className={`${styles.logDot} ${styles.red}`}></span>
                                    <span className={`${styles.logDot} ${styles.yellow}`}></span>
                                    <span className={`${styles.logDot} ${styles.green}`}></span>
                                </div>
                                <h3>Format Console</h3>
                            </div>
                            <button onClick={() => setFormatLog([])} className={styles.clearLogButton} disabled={formatLog.length === 0}>
                                Clear
                            </button>
                        </div>
                        <div className={styles.log}>
                            {formatLog.length === 0 ? <p className={styles.emptyLogMessage}>No activity logged yet.</p> : formatLog.map((entry, i) => <p key={i}>{entry}</p>)}
                        </div>
                    </div>
                </div>

                {/* Lock Tag */}
                <div className={styles.toolSection}>
                    <div>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>🔒</div>
                            <h3 className={styles.sectionTitle}>Lock Tag</h3>
                        </div>
                        <p className={styles.sectionDescription}>
                            <strong>Warning:</strong> Permanently locks the NFC tag. It will become read-only forever and cannot be modified again.
                        </p>
                        {isLocking ? (
                            <div className={styles.buttonGroup}>
                                <button className={`${styles.waitingButton} ${styles.waitingButtonWarning}`} type="button">
                                    <span>📡</span> Waiting for Tag to Lock...
                                </button>
                                <button
                                    onClick={() => handleCancelOperation('Lock', setIsLocking, setLockLog)}
                                    className={styles.cancelActionBtn}
                                    type="button"
                                    aria-label="Cancel lock"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setShowLockConfirmation(true)} className={`${styles.actionButton} ${styles.lockButton}`}>
                                🔒 Lock Tag (Read-Only)
                            </button>
                        )}
                    </div>
                    <div className={styles.logContainer}>
                        <div className={styles.logHeader}>
                            <div className={styles.logTitleWrapper}>
                                <div className={styles.logDots}>
                                    <span className={`${styles.logDot} ${styles.red}`}></span>
                                    <span className={`${styles.logDot} ${styles.yellow}`}></span>
                                    <span className={`${styles.logDot} ${styles.green}`}></span>
                                </div>
                                <h3>Lock Console</h3>
                            </div>
                            <button onClick={() => setLockLog([])} className={styles.clearLogButton} disabled={lockLog.length === 0}>
                                Clear
                            </button>
                        </div>
                        <div className={styles.log}>
                            {lockLog.length === 0 ? <p className={styles.emptyLogMessage}>No activity logged yet.</p> : lockLog.map((entry, i) => <p key={i}>{entry}</p>)}
                        </div>
                    </div>
                </div>
            </div>
            {showEraseConfirmation && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h3>Confirm Erase</h3>
                        <p>Are you sure you want to permanently erase the data on this NFC tag? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleErase} className={`${styles.modalButton} ${styles.confirmModalButton} ${styles.confirmButton}`}>
                                Yes, Erase Tag
                            </button>
                            <button onClick={() => setShowEraseConfirmation(false)} className={`${styles.modalButton} ${styles.cancelModalButton}`}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showLockConfirmation && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h3>Confirm Lock</h3>
                        <p>Are you sure you want to make this tag <strong>permanently</strong> read-only? You will not be able to write to it, erase it, or format it again.</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleLock} className={`${styles.modalButton} ${styles.confirmModalButton} ${styles.confirmButton}`}>
                                Yes, Lock Tag
                            </button>
                            <button onClick={() => setShowLockConfirmation(false)} className={`${styles.modalButton} ${styles.cancelModalButton}`}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <section className={styles.faqSection}>
                <h3 className={styles.sectionTitle}>Frequently Asked Questions</h3>
                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <details key={index} className={styles.faqItem}>
                            <summary className={styles.faqQuestion}>{faq.question}</summary>
                            <p
                                className={styles.faqAnswer}
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                        </details>
                    ))}
                </div>
            </section>
        </>
    );
}