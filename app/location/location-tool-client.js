'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './location.module.css';
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
    (_, i) => `/backgrounds/qr-code/location${i + 1}.png`
);

export default function LocationToolClient() {
    const [mode, setMode] = useState('coords'); // 'coords' or 'digipin'
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [digipin, setDigipin] = useState('');
    const [log, setLog] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const abortControllerRef = useRef(null);
    const isNfcSupported = useNfcLikelySupported();

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
    const [stylishText, setStylishText] = useState('Scan for Location');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');
    const qrCodeRef = useRef(null);

    // Load state from localStorage on component mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('locationToolData');
            if (savedData) {
                const data = JSON.parse(savedData);
                setMode(data.mode || 'coords');
                setLatitude(data.latitude || '');
                setLongitude(data.longitude || '');
                setDigipin(data.digipin || '');
                setQrFgColor(data.qrFgColor || '#000000');
                setQrBgColor(data.qrBgColor || '#ffffff');
                setQrLogo(data.qrLogo || null);
                setQrLogoSize(data.qrLogoSize || 40);
                setStylishText(data.stylishText || 'Scan for Location');
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
                mode, latitude, longitude, digipin,
                qrFgColor, qrBgColor, qrLogo, qrLogoSize,
                stylishText, stylishTextColor
            };
            localStorage.setItem('locationToolData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [mode, latitude, longitude, digipin, qrFgColor, qrBgColor, qrLogo, qrLogoSize, stylishText, stylishTextColor]);

    const addToLog = useCallback((message, type = 'info') => {
        const formattedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formattedMessage}</span>`, ...prev]);
    }, []);

    const qrData = useMemo(() => {
        if (mode === 'coords') {
            const lat = latitude.trim();
            const lng = longitude.trim();
            if (!lat || !lng) return '';
            return `geo:${lat},${lng}`;
        }
        if (mode === 'digipin') {
            const pin = digipin.trim();
            if (!pin) return '';
            // Using a community-driven resolver as official portal lacks direct linking
            return `https://digi-pin.in/?pin=${encodeURIComponent(pin)}`;
        }
        return '';
    }, [mode, latitude, longitude, digipin]);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            addToLog('Geolocation is not supported by your browser.', 'error');
            return;
        }

        addToLog('Fetching current location...', 'info');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toFixed(6));
                setLongitude(position.coords.longitude.toFixed(6));
                addToLog(`✅ Location found: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`, 'success');
            },
            (error) => {
                addToLog(`Error fetching location: ${error.message}`, 'error');
            }
        );
    };

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
        if (!qrData) {
            addToLog('Please fill in the required fields first.', 'error');
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
                records: [{ recordType: "url", data: qrData }]
            }, { signal: controller.signal });

            addToLog(`✅ Successfully wrote link to NFC tag!`, 'success');
            addToLog(`Data Written: ${qrData}`, 'info');

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
        const filenameBase = mode === 'coords'
            ? `location_${latitude}_${longitude}_nfctool.org_qr.png`
            : `digipin_${digipin}_nfctool.org_qr.png`;
        const filename = isStylish ? `stylish_${filenameBase}` : filenameBase;
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
        if (!qrData) return;
        navigator.clipboard.writeText(qrData).then(() => {
            addToLog(`✅ ${mode === 'coords' ? 'Geo link' : 'DigiPin link'} copied to clipboard!`, 'success');
        }, () => {
            addToLog(`Failed to copy ${mode === 'coords' ? 'Geo link' : 'DigiPin link'}.`, 'error');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.toolLayout}>
                {/* Input Form */}
                <div className={styles.form}>
                    <div className={styles.modeSwitcher}>
                        <button
                            className={`${styles.modeButton} ${mode === 'coords' ? styles.modeButtonActive : ''}`}
                            onClick={() => setMode('coords')}
                        >
                            Coordinates
                        </button>
                        <button
                            className={`${styles.modeButton} ${mode === 'digipin' ? styles.modeButtonActive : ''}`}
                            onClick={() => setMode('digipin')}
                        >
                            DigiPin (India)
                        </button>
                    </div>

                    {mode === 'coords' && (
                        <>
                            <div className={styles.inputGroup}>
                                <label htmlFor="latitude">Latitude *</label>
                                <input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    aria-required="true"
                                    placeholder="e.g. 37.7749"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="longitude">Longitude *</label>
                                <input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    aria-required="true"
                                    placeholder="e.g. -122.4194"
                                    required
                                />
                            </div>
                            <button
                                onClick={handleGetCurrentLocation}
                                className={styles.copyButton}
                                style={{ marginTop: '-1rem' }}
                            >
                                📍 Use Current Location
                            </button>
                        </>
                    )}

                    {mode === 'digipin' && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="digipin">DigiPin *</label>
                            <input
                                id="digipin"
                                type="text"
                                value={digipin}
                                onChange={(e) => setDigipin(e.target.value.toUpperCase())}
                                aria-required="true"
                                placeholder="e.g. ABC-12X-Y34Z"
                                maxLength="12"
                                required
                            />
                        </div>
                    )}

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
                        defaultStylishText="Scan for Location"
                        onDownloadStylish={() => handleDownloadQR(true)}
                        downloadDisabled={!qrData}
                        addToLog={addToLog}
                    />
                </div>

                {/* QR Code and Actions */}
                <div className={styles.output}>
                    <div className={styles.qrContainer} ref={qrCodeRef}>
                        {qrData ? (
                            <QRCodeCanvas
                                value={qrData}
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
                            disabled={isWriting || !qrData || !isNfcSupported}
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
                            disabled={!qrData}
                            className={styles.downloadButton}
                        >
                            Download QR
                        </button>
                        <button
                            onClick={handleCopyLink}
                            disabled={!qrData}
                            className={styles.copyButton}
                        >
                            Copy {mode === 'coords' ? 'Geo Link' : 'DigiPin Link'}
                        </button>
                        <button
                            onClick={() => window.open(qrData, '_self')}
                            disabled={!qrData}
                            className={styles.copyButton}
                        >
                            Open {mode === 'coords' ? 'Geo Link' : 'DigiPin Link'}
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