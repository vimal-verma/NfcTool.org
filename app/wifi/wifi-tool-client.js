'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './wifi.module.css';
import { downloadQRCode } from '../utils/qr-downloader';
import AdvancedQrEditor from '../components/AdvancedQrEditor';

const availableBackgrounds = Array.from(
    { length: 1 },
    (_, i) => `/backgrounds/qr-code/wifi${i + 1}.png`
);

export default function WIFIToolClient() {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');
    const [hidden, setHidden] = useState(false);
    const [log, setLog] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isQrEditorExpanded, setIsQrEditorExpanded] = useState(false);
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [qrBgColor, setQrBgColor] = useState('#ffffff');
    const [qrLogo, setQrLogo] = useState(null);
    const [qrLogoSize, setQrLogoSize] = useState(40);
    const [stylishBg, setStylishBg] = useState(null);
    const [stylishText, setStylishText] = useState('Scan to Connect');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');
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

    const handleWriteNfc = async () => {
        if (!wifiString) {
            addToLog('Please fill in the SSID (Network Name) first.', 'error');
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
                records: [{ recordType: "text", data: wifiString }]
            });

            addToLog(`✅ Successfully wrote WiFi details to NFC tag!`, 'success');
            addToLog(`Data Written: ${wifiString}`, 'info');

        } catch (error) {
            if (error.name === 'NotAllowedError') {
                addToLog('Write operation cancelled by user.', 'error');
            } else {
                addToLog(`Error: ${error.message}` + 'Refresh the page and try again.', 'error');
            }
        } finally {
            setIsWriting(false);
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
            <div className={styles.header}>
                <h1>WiFi QR & NFC Writer</h1>
                <p>Generate a WiFi QR code to easily share your network.</p>
            </div>

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
                            placeholder="MyWiFiNetwork"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your WiFi Password"
                            disabled={encryption === 'nopass'}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="encryption">Encryption</label>
                        <select id="encryption" value={encryption} onChange={(e) => setEncryption(e.target.value)}>
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">No Encryption</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={hidden}
                                onChange={(e) => setHidden(e.target.checked)}
                            />
                            Hidden Network
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
                            disabled={isWriting || !wifiString}
                            className={styles.actionButton}
                        >
                            {isWriting ? 'Writing...' : 'Write to NFC Tag'}
                        </button>
                        <button
                            onClick={() => handleDownloadQR(false)}
                            disabled={!wifiString}
                            className={styles.downloadButton}
                        >
                            Download QR
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={!wifiString}
                            className={styles.copyButton}
                        >
                            Copy WiFi String
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