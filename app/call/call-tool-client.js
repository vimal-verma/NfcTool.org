'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './call.module.css';
import { downloadQRCode } from '../utils/qr-downloader';
import AdvancedQrEditor from '../components/AdvancedQrEditor';

const availableBackgrounds = Array.from(
    { length: 1 },
    (_, i) => `/backgrounds/qr-code/call${i + 1}.png`
);

export default function CallToolClient() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [log, setLog] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isQrEditorExpanded, setIsQrEditorExpanded] = useState(false);
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [qrBgColor, setQrBgColor] = useState('#ffffff');
    const [qrLogo, setQrLogo] = useState(null);
    const [qrLogoSize, setQrLogoSize] = useState(40);
    const [stylishBg, setStylishBg] = useState(null);
    const [stylishText, setStylishText] = useState('Scan to Call');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');
    const qrCodeRef = useRef(null);

    // Load state from localStorage on component mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('callToolData');
            if (savedData) {
                const data = JSON.parse(savedData);
                setPhoneNumber(data.phoneNumber || '');
                setQrFgColor(data.qrFgColor || '#000000');
                setQrBgColor(data.qrBgColor || '#ffffff');
                setQrLogo(data.qrLogo || null);
                setQrLogoSize(data.qrLogoSize || 40);
                setStylishText(data.stylishText || 'Scan to Call');
                setStylishTextColor(data.stylishTextColor || '#000000');
                // Not loading stylishBg from localStorage to avoid storing large data URLs unnecessarily on every change.
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    // Save state to localStorage on change
    useEffect(() => {
        try {
            const dataToSave = {
                phoneNumber,
                qrFgColor, qrBgColor, qrLogo, qrLogoSize,
                stylishText, stylishTextColor
            };
            localStorage.setItem('callToolData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [phoneNumber, qrFgColor, qrBgColor, qrLogo, qrLogoSize, stylishText, stylishTextColor]);

    const addToLog = useCallback((message, type = 'info') => {
        const formattedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formattedMessage}</span>`, ...prev]);
    }, []);

    const callUrl = useMemo(() => {
        if (!phoneNumber) return '';
        return `tel:${phoneNumber}`;
    }, [phoneNumber]);

    const handleWriteNfc = async () => {
        if (!callUrl) {
            addToLog('Please fill in the Phone Number first.', 'error');
            return;
        }

        if (!('NDEFReader' in window)) {
            addToLog('Web NFC is not supported on this browser. Please use Chrome on Android.', 'error');
            return;
        }

        try {
            const ndef = new window.NDEFReader();
            setIsWriting(true);
            addToLog('Scan started. Bring a tag close to your device to write.', 'info');

            await ndef.write({
                records: [{ recordType: "url", data: process.env.NEXT_PUBLIC_FRONTEND_URL + '/redirect?url=' + callUrl }]
            });

            addToLog(`✅ Successfully wrote Call link to NFC tag!`, 'success');
            addToLog(`URL Written: ${callUrl}`, 'info');

        } catch (error) {
            if (error.name === 'NotAllowedError') {
                addToLog('Write operation cancelled by user.', 'error');
            } else {
                addToLog(`Error: ${error.message}`, 'error');
            }
        } finally {
            setIsWriting(false);
        }
    };

    const handleDownloadQR = (isStylish = false) => {
        const base = phoneNumber || 'call';
        const filename = isStylish ? `${base}_stylish_nfctool.org_qr.png` : `${base}_nfctool.org_qr.png`;
        downloadQRCode({
            qrCodeRef,
            filename,
            isStylish,
            qrBgColor,
            stylishText,
            stylishTextColor,
            stylishBg,
            addToLog
        });
    };

    const handleCopyLink = () => {
        if (!callUrl) return;
        navigator.clipboard.writeText(callUrl).then(() => {
            addToLog('✅ Call link copied to clipboard!', 'success');
        }, () => {
            addToLog('Failed to copy Call link.', 'error');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Call QR & NFC Writer</h1>
                <p>Generate a Call QR code and write it to an NFC tag.</p>
            </div>

            <div className={styles.toolLayout}>
                {/* Input Form */}
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="phoneNumber">Phone Number *</label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            aria-required="true"
                            placeholder="+1234567890"
                            required
                        />
                    </div>

                    <AdvancedQrEditor
                        isExpanded={isQrEditorExpanded}
                        setIsExpanded={setIsQrEditorExpanded}
                        qrFgColor={qrFgColor} setQrFgColor={setQrFgColor}
                        qrBgColor={qrBgColor} setQrBgColor={setQrBgColor}
                        qrLogo={qrLogo} setQrLogo={setQrLogo}
                        qrLogoSize={qrLogoSize} setQrLogoSize={setQrLogoSize}
                        stylishBg={stylishBg} setStylishBg={setStylishBg}
                        stylishText={stylishText} setStylishText={setStylishText}
                        stylishTextColor={stylishTextColor} setStylishTextColor={setStylishTextColor}
                        availableBackgrounds={availableBackgrounds}
                        defaultStylishText="Scan to Call"
                        onDownloadStylish={() => handleDownloadQR(true)}
                        downloadDisabled={!callUrl}
                        addToLog={addToLog}
                    />
                </div>

                {/* QR Code and Actions */}
                <div className={styles.output}>
                    <div className={styles.qrContainer} ref={qrCodeRef}>
                        {callUrl ? (
                            <QRCodeCanvas
                                value={callUrl}
                                size={256}
                                includeMargin={true}
                                level="H" // High error correction for logo
                                bgColor={qrBgColor}
                                fgColor={qrFgColor}
                                imageSettings={qrLogo ? {
                                    src: qrLogo,
                                    height: qrLogoSize,
                                    width: qrLogoSize,
                                    excavate: true,
                                } : undefined}
                            />
                        ) : (
                            <div className={styles.qrPlaceholder}>
                                <p>Fill in required fields to generate QR Code</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleWriteNfc}
                            disabled={isWriting || !callUrl}
                            className={styles.actionButton}
                        >
                            {isWriting ? 'Writing...' : 'Write to NFC Tag'}
                        </button>
                        <button
                            onClick={() => handleDownloadQR(false)}
                            disabled={!callUrl}
                            className={styles.downloadButton}
                        >
                            Download QR
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={!callUrl}
                            className={styles.copyButton}
                        >
                            Copy Call Link
                        </button>
                        <button
                            onClick={() => window.open(callUrl, '_self')}
                            disabled={!callUrl}
                            className={styles.copyButton}
                        >
                            Open Call Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Output */}
            <div className={styles.logContainer}>
                <p className={styles.privacyNote}>
                    🔒 All information is stored locally in your browser. Nothing is shared with our servers. Always verify generated QR codes and links before sharing.
                </p>
                <div className={styles.logHeader}>
                    <h3>Log</h3>
                    <button onClick={() => setLog([])} className={styles.clearLogButton} disabled={log.length === 0}>
                        Clear
                    </button>
                </div>
                <div className={styles.log} dangerouslySetInnerHTML={{ __html: log.join('<br />') }} aria-live="polite" />
            </div>
        </div>
    );
}