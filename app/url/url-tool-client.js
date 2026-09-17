'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './url.module.css';
import { downloadQRCode } from '../utils/qr-downloader';
import AdvancedQrEditor from '../components/AdvancedQrEditor';
import { useNfcLikelySupported } from '../lib/use-nfc-support';
import {
    abortActiveNfcPush,
    registerActiveNfcController,
    releaseActiveNfcController,
    formatNfcError
} from '../utils/nfc-writer';

const availableBackgrounds = Array.from(
    { length: 1 },
    (_, i) => `/backgrounds/qr-code/url${i + 1}.png`
);

export default function UrlToolClient() {
    const [urls, setUrls] = useState(['']);
    const [log, setLog] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [origin, setOrigin] = useState('');
    const [isQrEditorExpanded, setIsQrEditorExpanded] = useState(false);
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [qrBgColor, setQrBgColor] = useState('#ffffff');
    const [qrLogo, setQrLogo] = useState(null);
    const [qrLogoSize, setQrLogoSize] = useState(40);
    const [stylishBg, setStylishBg] = useState(null);
    const [stylishText, setStylishText] = useState('Scan to Visit');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');
    const isNfcSupported = useNfcLikelySupported();
    const abortControllerRef = useRef(null);
    const qrCodeRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.origin) {
            setOrigin(window.location.origin);
        }
    }, []);

    // Abort pending write on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortActiveNfcPush();
        };
    }, []);

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

    const normalizeUrl = (u) => {
        const trimmed = u.trim();
        if (!trimmed) return '';
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return `https://${trimmed}`;
    };

    const redirectUrl = useMemo(() => {
        const validUrls = urls.map(normalizeUrl).filter(Boolean);
        if (validUrls.length === 0) return '';
        if (validUrls.length === 1) return validUrls[0];

        const encodedUrls = btoa(JSON.stringify(validUrls));
        const base = origin || (typeof window !== 'undefined' && window.location.origin ? window.location.origin : '') || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://nfctool.org';
        return `${base}/redirect?urls=${encodedUrls}`;
    }, [urls, origin]);

    const handleCancelWrite = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        abortActiveNfcPush();
        setIsWriting(false);
        addToLog('Write operation cancelled by user.', 'info');
    };

    const handleWriteNfc = async () => {
        if (!redirectUrl) {
            addToLog('Please enter at least one website link or URL.', 'error');
            return;
        }

        if (!('NDEFReader' in window)) {
            addToLog('Web NFC is not supported on this browser. Please use Chrome on Android.', 'error');
            return;
        }

        const targetUrl = redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')
            ? redirectUrl
            : `${(typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://nfctool.org'}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`;

        const controller = new AbortController();
        abortControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsWriting(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog('📡 Ready to write! Bring your NFC tag close to your phone or device.', 'info');

            await ndef.write({
                records: [{ recordType: "url", data: targetUrl }]
            }, { signal: controller.signal });

            addToLog(`✅ Successfully wrote URL to NFC tag!`, 'success');
            addToLog(`URL Written: ${targetUrl}`, 'info');

        } catch (error) {
            const parsed = formatNfcError(error);
            addToLog(parsed.message, parsed.type);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsWriting(false);
                releaseActiveNfcController(controller);
            }
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
        const fullUrl = redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')
            ? redirectUrl
            : `${(typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://nfctool.org'}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            addToLog(`✅ URL copied to clipboard: ${fullUrl}`, 'success');
        }, () => {
            addToLog('Failed to copy URL.', 'error');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.toolLayout}>
                {/* Input Form */}
                <div className={styles.form}>
                    {urls.map((url, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <label htmlFor={`url-${index}`}>Website URL {urls.length > 1 ? index + 1 : ''} *</label>
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
                    <button onClick={addUrlInput} className={styles.addUrlButton}>+ Add another URL (Multi-link)</button>

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
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>🔗</span>
                                <p>Fill in a website URL to generate QR code and program NFC tag</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleWriteNfc}
                            disabled={isWriting || !redirectUrl || !isNfcSupported}
                            className={`${styles.actionButton} ${isWriting ? styles.waitingButton : ''}`}
                            title={!isNfcSupported ? 'Web NFC requires Chrome on Android' : undefined}
                        >
                            {!isNfcSupported ? '🚫 NFC Unavailable Here' : isWriting ? '📡 Waiting for Tag... Tap Device' : '📡 Write to NFC Tag'}
                        </button>
                        {isWriting && (
                            <button
                                type="button"
                                onClick={handleCancelWrite}
                                className={styles.cancelButton}
                            >
                                ✕ Cancel
                            </button>
                        )}
                        <button
                            onClick={() => handleDownloadQR(false)}
                            disabled={!redirectUrl}
                            className={styles.downloadButton}
                        >
                            📥 Download QR
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={!redirectUrl}
                            className={styles.copyButton}
                        >
                            📋 Copy URL
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Output */}
            <div className={styles.logContainer}>
                <p className={styles.privacyNote}>
                    🔒 All processing occurs in your browser. No website URLs are saved to external servers.
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