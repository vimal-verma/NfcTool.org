'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './upi.module.css';
import { downloadQRCode } from '../utils/qr-downloader';
import AdvancedQrEditor from '../components/AdvancedQrEditor';
import { useNfcLikelySupported } from '../lib/use-nfc-support';

const availableBackgrounds = Array.from(
    { length: 4 },
    (_, i) => `/backgrounds/qr-code/${i + 1}.png`
);

export default function UpiToolClient() {
    const [upiId, setUpiId] = useState('');
    const [payeeName, setPayeeName] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [log, setLog] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isQrEditorExpanded, setIsQrEditorExpanded] = useState(false);
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [qrBgColor, setQrBgColor] = useState('#ffffff');
    const [qrLogo, setQrLogo] = useState(null);
    const [qrLogoSize, setQrLogoSize] = useState(40);
    const [stylishBg, setStylishBg] = useState(null);
    const [stylishText, setStylishText] = useState('Scan to Pay');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');
    const isNfcSupported = useNfcLikelySupported();
    const qrCodeRef = useRef(null);

    // Load state from localStorage on component mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('upiToolData');
            if (savedData) {
                const data = JSON.parse(savedData);
                setUpiId(data.upiId || '');
                setPayeeName(data.payeeName || '');
                setAmount(data.amount || '');
                setNote(data.note || '');
                setQrFgColor(data.qrFgColor || '#000000');
                setQrBgColor(data.qrBgColor || '#ffffff');
                setQrLogo(data.qrLogo || null);
                setQrLogoSize(data.qrLogoSize || 40);
                setStylishText(data.stylishText || 'Scan to Pay');
                setStylishTextColor(data.stylishTextColor || '#000000');
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    // Save state to localStorage on change
    useEffect(() => {
        try {
            const dataToSave = {
                upiId, payeeName, amount, note,
                qrFgColor, qrBgColor, qrLogo, qrLogoSize,
                stylishText, stylishTextColor
            };
            localStorage.setItem('upiToolData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [upiId, payeeName, amount, note, qrFgColor, qrBgColor, qrLogo, qrLogoSize, stylishText, stylishTextColor]);

    const addToLog = useCallback((message, type = 'info') => {
        const formattedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formattedMessage}</span>`, ...prev]);
    }, []);

    const upiUrl = useMemo(() => {
        if (!upiId || !payeeName) return '';
        const url = new URL('upi://pay');
        url.searchParams.set('pa', upiId); // Payee VPA
        url.searchParams.set('pn', payeeName); // Payee Name
        if (amount) url.searchParams.set('am', amount); // Amount
        if (note) url.searchParams.set('tn', note); // Transaction Note
        url.searchParams.set('cu', 'INR'); // Currency
        return url.toString();
    }, [upiId, payeeName, amount, note]);

    const handleWriteNfc = async () => {
        if (!upiUrl) {
            addToLog('Please fill in UPI ID and Payee Name first.', 'error');
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
                records: [{ recordType: "url", data: upiUrl }]
            });

            addToLog(`✅ Successfully wrote UPI link to NFC tag!`, 'success');
            addToLog(`URL Written: ${upiUrl}`, 'info');

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
        const base = payeeName.replace(/\s+/g, '_') || 'upi';
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
        if (!upiUrl) return;
        navigator.clipboard.writeText(upiUrl).then(() => {
            addToLog('✅ UPI link copied to clipboard!', 'success');
        }, () => {
            addToLog('Failed to copy UPI link.', 'error');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>UPI QR &amp; NFC Writer</h1>
                <p>Generate a instant UPI payment QR code and program tap-to-pay NFC tags.</p>
            </div>

            <div className={styles.toolLayout}>
                {/* Input Form */}
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="upiId">UPI ID (VPA) *</label>
                        <input
                            id="upiId"
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            aria-required="true"
                            placeholder="e.g. merchant@upi or 9876543210@paytm"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="payeeName">Payee Name *</label>
                        <input
                            id="payeeName"
                            type="text"
                            value={payeeName}
                            onChange={(e) => setPayeeName(e.target.value)}
                            aria-required="true"
                            placeholder="e.g. John Doe or Store Name"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="amount">Amount (INR, Optional)</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 500"
                        />
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            {['50', '100', '200', '500', '1000'].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset)}
                                    style={{
                                        padding: '0.25rem 0.6rem',
                                        fontSize: '0.8rem',
                                        borderRadius: '999px',
                                        border: '1px solid var(--card-border)',
                                        background: amount === preset ? 'var(--primary-accent)' : 'var(--card-background)',
                                        color: amount === preset ? '#ffffff' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    ₹{preset}
                                </button>
                            ))}
                            {amount && (
                                <button
                                    type="button"
                                    onClick={() => setAmount('')}
                                    style={{
                                        padding: '0.25rem 0.6rem',
                                        fontSize: '0.8rem',
                                        borderRadius: '999px',
                                        border: '1px solid var(--card-border)',
                                        background: 'transparent',
                                        color: 'var(--color-danger)',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Clear Amount
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="note">Transaction Note (Optional)</label>
                        <input
                            id="note"
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Order #1234 or Coffee"
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
                        defaultStylishText="Scan to Pay"
                        onDownloadStylish={() => handleDownloadQR(true)}
                        downloadDisabled={!upiUrl}
                        addToLog={addToLog}
                    />
                </div>

                {/* QR Code and Actions */}
                <div className={styles.output}>
                    <div className={styles.qrContainer} ref={qrCodeRef}>
                        {upiUrl ? (
                            <QRCodeCanvas
                                value={upiUrl}
                                size={256}
                                includeMargin={true}
                                level="H"
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
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>💳</span>
                                <p>Fill in UPI ID &amp; Payee Name to generate instant payment QR Code</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleWriteNfc}
                            disabled={isWriting || !upiUrl || !isNfcSupported}
                            className={styles.actionButton}
                            title={!isNfcSupported ? 'Web NFC requires Chrome on Android' : undefined}
                        >
                            {!isNfcSupported ? '🚫 NFC Unavailable Here' : isWriting ? 'Writing to Tag…' : '📡 Write to NFC Tag'}
                        </button>
                        <button
                            onClick={() => handleDownloadQR(false)}
                            disabled={!upiUrl}
                            className={styles.downloadButton}
                        >
                            📥 Download QR
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={!upiUrl}
                            className={styles.copyButton}
                        >
                            📋 Copy UPI Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Output */}
            <div className={styles.logContainer}>
                <p className={styles.privacyNote}>
                    🔒 All information is processed locally in your browser. Nothing is sent to external servers. Always verify generated payment links before sharing.
                </p>
                <div className={styles.logHeader}>
                    <h3>Log Console</h3>
                    <button onClick={() => setLog([])} className={styles.clearLogButton} disabled={log.length === 0}>
                        Clear Log
                    </button>
                </div>
                <div className={styles.log} dangerouslySetInnerHTML={{ __html: log.join('<br />') }} aria-live="polite" />
            </div>
        </div>
    );
}