'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './wifi.module.css';
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
    (_, i) => `/backgrounds/qr-code/wifi${i + 1}.png`
);

export default function WIFIToolClient() {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [encryption, setEncryption] = useState('WPA');
    const [hidden, setHidden] = useState(false);
    const [log, setLog] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const abortControllerRef = useRef(null);

    // Abort pending write on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortActiveNfcPush();
        };
    }, []);
    const [isQrEditorExpanded, setIsQrEditorExpanded] = useState(false);
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [qrBgColor, setQrBgColor] = useState('#ffffff');
    const [qrLogo, setQrLogo] = useState(null);
    const [qrLogoSize, setQrLogoSize] = useState(40);
    const [stylishBg, setStylishBg] = useState(null);
    const [stylishText, setStylishText] = useState('Scan to Connect');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');
    const isNfcSupported = useNfcLikelySupported();
    const qrCodeRef = useRef(null);

    // Load state from localStorage on component mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('wifiToolData');
            if (savedData) {
                const data = JSON.parse(savedData);
                setSsid(data.ssid || '');
                setPassword(data.password || '');
                setEncryption(data.encryption || 'WPA');
                setHidden(data.hidden || false);
                setQrFgColor(data.qrFgColor || '#000000');
                setQrBgColor(data.qrBgColor || '#ffffff');
                setQrLogo(data.qrLogo || null);
                setQrLogoSize(data.qrLogoSize || 40);
                setStylishText(data.stylishText || 'Scan to Connect');
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
                ssid, password, encryption, hidden,
                qrFgColor, qrBgColor, qrLogo, qrLogoSize,
                stylishText, stylishTextColor
            };
            localStorage.setItem('wifiToolData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [ssid, password, encryption, hidden, qrFgColor, qrBgColor, qrLogo, qrLogoSize, stylishText, stylishTextColor]);

    const addToLog = useCallback((message, type = 'info') => {
        const formattedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formattedMessage}</span>`, ...prev]);
    }, []);

    const wifiString = useMemo(() => {
        if (!ssid) return '';
        const escape = (str) => str.replace(/([\\;,"])/g, '\\$1');
        return `WIFI:S:${escape(ssid)};T:${encryption};P:${escape(password)};H:${hidden};;`;
    }, [ssid, password, encryption, hidden]);

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
        if (!wifiString) {
            addToLog('Please fill in the Network Name (SSID) first.', 'error');
            return;
        }

        if (!('NDEFReader' in window)) {
            addToLog('Web NFC is not supported on this browser. Please use Chrome on Android.', 'error');
            return;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsWriting(true);

        try {
            const ndef = new window.NDEFReader();
            addToLog('📡 Ready to write! Bring your NFC tag close to your phone or device.', 'info');

            await ndef.write({
                records: [{ recordType: "text", data: wifiString }]
            }, { signal: controller.signal });

            addToLog(`✅ Successfully wrote WiFi details to NFC tag!`, 'success');
            addToLog(`Data Written: ${wifiString}`, 'info');

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
        const base = `wifi_${ssid.replace(/\s+/g, '_') || 'network'}`;
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
        if (!wifiString) return;
        navigator.clipboard.writeText(wifiString).then(() => {
            addToLog('✅ WiFi string copied to clipboard!', 'success');
        }, () => {
            addToLog('Failed to copy WiFi string.', 'error');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.toolLayout}>
                {/* Input Form */}
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="ssid">Network Name (SSID) *</label>
                        <input
                            id="ssid"
                            type="text"
                            value={ssid}
                            onChange={(e) => setSsid(e.target.value)}
                            aria-required="true"
                            placeholder="e.g. Home_WiFi_5G"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">WiFi Password</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter WiFi Password"
                                disabled={encryption === 'nopass'}
                                style={{ width: '100%', paddingRight: '2.5rem' }}
                            />
                            {encryption !== 'nopass' && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        color: 'var(--text-secondary)'
                                    }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? '👁️' : '🙈'}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="encryption">Encryption Type</label>
                        <select id="encryption" value={encryption} onChange={(e) => setEncryption(e.target.value)}>
                            <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                            <option value="WEP">WEP (Legacy)</option>
                            <option value="nopass">Open Network (No Password)</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={hidden}
                                onChange={(e) => setHidden(e.target.checked)}
                            />
                            Hidden Network (SSID is not broadcast)
                        </label>
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
                        defaultStylishText="Scan to Connect"
                        onDownloadStylish={() => handleDownloadQR(true)}
                        downloadDisabled={!wifiString}
                        addToLog={addToLog}
                    />
                </div>

                {/* QR Code and Actions */}
                <div className={styles.output}>
                    <div className={styles.qrContainer} ref={qrCodeRef}>
                        {wifiString ? (
                            <QRCodeCanvas
                                value={wifiString}
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
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>📶</span>
                                <p>Fill in Network Name (SSID) to generate WiFi QR &amp; NFC string</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleWriteNfc}
                            disabled={isWriting || !wifiString || !isNfcSupported}
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
                            disabled={!wifiString}
                            className={styles.downloadButton}
                        >
                            📥 Download QR
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={!wifiString}
                            className={styles.copyButton}
                        >
                            📋 Copy WiFi Code
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Output */}
            <div className={styles.logContainer}>
                <p className={styles.privacyNote}>
                    🔒 WiFi passwords are kept entirely private in your browser memory. Nothing is sent over the network.
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