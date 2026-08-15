'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './url.module.css';
import { downloadQRCode } from '../utils/qr-downloader';
import AdvancedQrEditor from '../components/AdvancedQrEditor';

const availableBackgrounds = Array.from(
    { length: 1 },
    (_, i) => `/backgrounds/qr-code/url${i + 1}.png`
);

export default function UrlToolClient() {
    const [urls, setUrls] = useState(['']);
    const [log, setLog] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isQrEditorExpanded, setIsQrEditorExpanded] = useState(false);
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [qrBgColor, setQrBgColor] = useState('#ffffff');
    const [qrLogo, setQrLogo] = useState(null);
    const [qrLogoSize, setQrLogoSize] = useState(40);
    const [stylishBg, setStylishBg] = useState(null);
    const [stylishText, setStylishText] = useState('Scan to Visit');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');
    const qrCodeRef = useRef(null);

    const handleUrlChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const addUrlInput = () => {
        setUrls([...urls, '']);
    };

    const removeUrlInput = (index) => {
        if (urls.length > 1) {
            const newUrls = urls.filter((_, i) => i !== index);
            setUrls(newUrls);
        }
    };

    // Load state from localStorage on component mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('urlToolData');
            if (savedData) {
                const data = JSON.parse(savedData);
                setUrls(data.urls && data.urls.length > 0 ? data.urls : ['']);
                setQrFgColor(data.qrFgColor || '#000000');
                setQrBgColor(data.qrBgColor || '#ffffff');
                setQrLogo(data.qrLogo || null);
                setQrLogoSize(data.qrLogoSize || 40);
                setStylishText(data.stylishText || 'Scan to Visit');
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
                urls,
                qrFgColor, qrBgColor, qrLogo, qrLogoSize,
                stylishText, stylishTextColor
            };
            localStorage.setItem('urlToolData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [urls, qrFgColor, qrBgColor, qrLogo, qrLogoSize, stylishText, stylishTextColor]);

    const addToLog = useCallback((message, type = 'info') => {
        const formattedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formattedMessage}</span>`, ...prev]);
    }, []);

    const redirectUrl = useMemo(() => {
        const validUrls = urls.map(u => u.trim()).filter(u => u !== '' && u.startsWith('http'));
        if (validUrls.length === 0) return '';
        if (validUrls.length === 1) return validUrls[0];

        const encodedUrls = btoa(JSON.stringify(validUrls));
        return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/redirect?urls=${encodedUrls}`;
    }, [urls]);

    const handleWriteNfc = async () => {
        if (!redirectUrl) {
            addToLog('Please fill in at least one valid Website URL.', 'error');
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
                records: [{ recordType: "url", data: redirectUrl }]
            });

            addToLog(`✅ Successfully wrote URL to NFC tag!`, 'success');
            addToLog(`URL Written: ${redirectUrl}`, 'info');

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
        const filename = isStylish ? 'url_stylish_nfctool.org_qr.png' : 'url_nfctool.org_qr.png';
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
        if (!redirectUrl) return;
        navigator.clipboard.writeText(redirectUrl).then(() => {
            addToLog('✅ URL copied to clipboard!', 'success');
        }, () => {
            addToLog('Failed to copy URL.', 'error');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>URL QR & NFC Writer</h1>
                <p>Generate a QR code for one or more websites and write it to an NFC tag.</p>
            </div>

            <div className={styles.toolLayout}>
                {/* Input Form */}
                <div className={styles.form}>
                    {urls.map((url, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <label htmlFor={`url-${index}`}>Website URL {index + 1} *</label>
                            <div className={styles.urlInputWrapper}>
                                <input
                                    id={`url-${index}`}
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleUrlChange(index, e.target.value)}
                                    aria-required="true"
                                    placeholder="https://example.com"
                                    required
                                />
                                {urls.length > 1 && (
                                    <button onClick={() => removeUrlInput(index)} className={styles.removeUrlButton} aria-label={`Remove URL ${index + 1}`}>-</button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button onClick={addUrlInput} className={styles.addUrlButton}>+ Add another URL</button>

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
                        defaultStylishText="Scan to Visit"
                        onDownloadStylish={() => handleDownloadQR(true)}
                        downloadDisabled={!redirectUrl}
                        addToLog={addToLog}
                    />
                </div>

                {/* QR Code and Actions */}
                <div className={styles.output}>
                    <div className={styles.qrContainer} ref={qrCodeRef}>
                        {redirectUrl ? (
                            <QRCodeCanvas
                                value={redirectUrl}
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
                                <p>Fill in at least one URL to generate QR Code</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleWriteNfc}
                            disabled={isWriting || !redirectUrl}
                            className={styles.actionButton}
                        >
                            {isWriting ? 'Writing...' : 'Write to NFC Tag'}
                        </button>
                        <button
                            onClick={() => handleDownloadQR(false)}
                            disabled={!redirectUrl}
                            className={styles.downloadButton}
                        >
                            Download QR
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={!redirectUrl}
                            className={styles.copyButton}
                        >
                            Copy URL
                        </button>
                        <button
                            onClick={() => window.open(redirectUrl, '_blank')}
                            disabled={!redirectUrl}
                            className={styles.copyButton}
                        >
                            Open URL
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