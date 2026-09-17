'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import PhonePreview from './PhonePreview';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { downloadQRCode } from '../utils/qr-downloader';
import AdvancedQrEditor from '../components/AdvancedQrEditor';
import {
    abortActiveNfcPush,
    registerActiveNfcController,
    releaseActiveNfcController,
    formatNfcError
} from '../utils/nfc-writer';

const initialVCardState = {
    name: '', phone: '', email: '', website: '', organization: '',
    title: '', street: '', city: '', state: '', zip: '', country: '',
    linkedin: '', twitter: '', instagram: '', notes: '',
};

const availableBackgrounds = Array.from(
    { length: 1 },
    (_, i) => `/backgrounds/qr-code/vcard${i + 1}.png`
);

export default function VCardClientTool() {
    const [log, setLog] = useState([]);
    const searchParams = useSearchParams();
    const qrCodeRef = useRef(null);

    const [vCardData, setVCardData] = useState(initialVCardState);
    const [vCardSize, setVCardSize] = useState(0);
    const [tagSuggestionMessage, setTagSuggestionMessage] = useState('');
    const [templates, setTemplates] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [origin, setOrigin] = useState('');
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.origin) {
            setOrigin(window.location.origin);
        }
    }, []);

    // Cleanup active pending write on component unmount
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
    const [stylishText, setStylishText] = useState('Scan to Save Contact');
    const [stylishTextColor, setStylishTextColor] = useState('#000000');

    useEffect(() => {
        // Load templates from localStorage on mount
        try {
            const savedTemplates = localStorage.getItem('vCardTemplates');
            if (savedTemplates) {
                setTemplates(JSON.parse(savedTemplates));
            }
        } catch (error) {
            console.error("Failed to load templates from localStorage", error);
        }

        // 1. Try loading from URL parameters first
        const dataFromUrl = {};
        let hasDataInUrl = false;
        for (const [key, value] of searchParams.entries()) {
            if (key in vCardData) {
                dataFromUrl[key] = value;
                hasDataInUrl = true;
            }
        }

        if (hasDataInUrl) {
            setVCardData(prev => ({ ...prev, ...dataFromUrl }));
            addToLog('✅ Contact data loaded from URL.');
        } else {
            // 2. If no data in URL, try loading from localStorage
            try {
                const savedData = localStorage.getItem('vCardToolData');
                if (savedData) {
                    const data = { ...initialVCardState, ...JSON.parse(savedData) };
                    setVCardData(data);
                    addToLog('✅ Contact data loaded from previous session.');
                }
            } catch (error) {
                console.error("Failed to load vCard data from localStorage", error);
                addToLog('Could not load data from previous session.', 'error');
            }
        }

        try {
            const savedQrData = localStorage.getItem('vCardQrEditorData');
            if (savedQrData) {
                const data = JSON.parse(savedQrData);
                setQrFgColor(data.qrFgColor || '#000000');
                setQrBgColor(data.qrBgColor || '#ffffff');
                setQrLogo(data.qrLogo || null);
                setQrLogoSize(data.qrLogoSize || 40);
                setStylishText(data.stylishText || 'Scan to Save Contact');
                setStylishTextColor(data.stylishTextColor || '#000000');
            }
        } catch (error) {
            console.error("Failed to load QR editor data from localStorage", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on initial load

    // Save state to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('vCardToolData', JSON.stringify(vCardData));
        } catch (error) {
            console.error("Failed to save vCard data to localStorage", error);
        }
    }, [vCardData]);

    // Save templates to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('vCardTemplates', JSON.stringify(templates));
        } catch (error) {
            console.error("Failed to save templates to localStorage", error);
        }
    }, [templates]);

    useEffect(() => {
        try {
            const dataToSave = {
                qrFgColor, qrBgColor, qrLogo, qrLogoSize,
                stylishText, stylishTextColor
            };
            localStorage.setItem('vCardQrEditorData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save QR editor data to localStorage", error);
        }
    }, [qrFgColor, qrBgColor, qrLogo, qrLogoSize, stylishText, stylishTextColor]);

    const vCardString = useMemo(() => [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${vCardData.name}`,
        vCardData.organization ? `ORG:${vCardData.organization}` : null,
        vCardData.title ? `TITLE:${vCardData.title}` : null,
        vCardData.phone ? `TEL;TYPE=CELL:${vCardData.phone}` : null,
        vCardData.email ? `EMAIL:${vCardData.email}` : null,
        vCardData.website ? `URL;type=pref:${vCardData.website}` : null,
        (vCardData.street || vCardData.city || vCardData.state || vCardData.zip || vCardData.country)
            ? `ADR;TYPE=WORK:;;${vCardData.street};${vCardData.city};${vCardData.state};${vCardData.zip};${vCardData.country}`
            : null,
        vCardData.linkedin ? `URL;type=linkedin:https://linkedin.com/in/${vCardData.linkedin}` : null,
        vCardData.twitter ? `URL;type=twitter:https://twitter.com/${vCardData.twitter}` : null,
        vCardData.instagram ? `URL;type=instagram:https://instagram.com/${vCardData.instagram}` : null,
        vCardData.notes ? `NOTE:${vCardData.notes}` : null,
        'END:VCARD'
    ].filter(Boolean).join('\n'),
        [vCardData]
    );

    // Calculate vCard size and tag suggestion whenever vCardString changes
    useEffect(() => {
        const encoder = new TextEncoder();
        const size = encoder.encode(vCardString).byteLength;
        setVCardSize(size);
        setTagSuggestionMessage(getTagSuggestion(size));
    }, [vCardString]);
    const addToLog = useCallback((message, type = 'info') => {
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${message}</span>`, ...prev]);
    }, []);

    const getTagSuggestion = (size) => {
        if (size <= 144) {
            return 'NTAG213 is suitable.';
        }
        if (size <= 504) {
            return 'NTAG215 is recommended.';
        }
        if (size <= 888) {
            return 'NTAG216 is recommended.';
        }
        return 'You need a tag with a larger capacity.';
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

    const handleWriteVCard = async () => {
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC is not supported on this browser. Please use Chrome on Android.', 'error');
            return;
        }

        if (!vCardData.name) {
            addToLog('Please enter at least a name to create a vCard.', 'error');
            return;
        }

        // Abort any existing pending write and register new controller
        const controller = new AbortController();
        abortControllerRef.current = controller;
        registerActiveNfcController(controller);
        setIsWriting(true);

        try {
            const ndef = new window.NDEFReader();

            const encoder = new TextEncoder();
            const record = { recordType: 'mime', mediaType: 'text/vcard', data: encoder.encode(vCardString) };

            // Use the already calculated vCardSize and tagSuggestionMessage
            addToLog(`Data size: ${vCardSize} bytes. ${tagSuggestionMessage}`);
            addToLog('📡 Ready to write! Bring your NFC tag close to your phone or device.', 'info');

            await ndef.write({
                records: [record]
            }, { signal: controller.signal });

            addToLog(`✅ Successfully wrote vCard for "${vCardData.name}" to the tag!`, 'success');

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
        const base = vCardData.name.replace(/\s+/g, '_') || 'vcard';
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

    const handleSaveVCard = () => {
        if (!vCardData.name) {
            addToLog('Please enter at least a name to save a vCard.', 'error');
            return;
        }

        const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const fileName = `${vCardData.name.replace(/\s+/g, '_') || 'contact'}.vcf`;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addToLog('✅ vCard file (.vcf) downloaded.', 'success');
    };

    const shareUrl = useMemo(() => {
        const params = new URLSearchParams();
        Object.entries(vCardData).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });
        const base = origin || (typeof window !== 'undefined' && window.location.origin ? window.location.origin : '') || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://nfctool.org';
        return `${base}/vcard?${params.toString()}`;
    }, [vCardData, origin]);

    const handleCopyToClipboard = () => {
        const fullUrl = shareUrl.startsWith('http://') || shareUrl.startsWith('https://')
            ? shareUrl
            : `${(typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://nfctool.org'}${shareUrl.startsWith('/') ? '' : '/'}${shareUrl}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            addToLog(`✅ Share link copied to clipboard: ${fullUrl}`, 'success');
        }, () => {
            addToLog('Failed to copy share link.', 'error');
        });
    };

    const handleClearForm = useCallback(() => {
        if (window.confirm('Are you sure you want to clear the form? This will also remove your auto-saved data.')) {
            setVCardData(initialVCardState);
            localStorage.removeItem('vCardToolData');
            addToLog('Form has been cleared.');
        }
    }, [addToLog]);

    const handleSaveTemplate = () => {
        const name = prompt("Enter a name for this template:", vCardData.name || "New Template");
        if (!name) return;

        const existingIndex = templates.findIndex(t => t.name === name);
        if (existingIndex > -1) {
            if (!confirm(`A template named "${name}" already exists. Do you want to overwrite it?`)) {
                return;
            }
            const updatedTemplates = [...templates];
            updatedTemplates[existingIndex] = { name, data: vCardData };
            setTemplates(updatedTemplates);
            addToLog(`✅ Template "${name}" updated.`, 'success');
        } else {
            setTemplates([...templates, { name, data: vCardData }]);
            addToLog(`✅ Template "${name}" saved.`, 'success');
        }
        setSelectedTemplate(name);
    };

    const handleLoadTemplate = () => {
        if (!selectedTemplate) return;
        const template = templates.find(t => t.name === selectedTemplate);
        if (template) {
            setVCardData(template.data);
            addToLog(`✅ Template "${selectedTemplate}" loaded.`, 'success');
        }
    };

    const handleDeleteTemplate = () => {
        if (!selectedTemplate) return;
        if (confirm(`Are you sure you want to delete the template "${selectedTemplate}"?`)) {
            const updatedTemplates = templates.filter(t => t.name !== selectedTemplate);
            setTemplates(updatedTemplates);
            setSelectedTemplate('');
            addToLog(`🗑️ Template "${selectedTemplate}" deleted.`, 'info');
        }
    };

    return (
        <div className={styles.toolContainer}>
            <div className={styles.mainContent}>
                <div className={styles.vcardForm}>
                    <div className={styles.formGrid}>
                        {/* Personal Info */}
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-name">Full Name *</label>
                            <input id="vcard-name" type="text" value={vCardData.name} onChange={(e) => setVCardData({ ...vCardData, name: e.target.value })} placeholder="e.g., John Doe" required aria-required="true" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-phone">Phone Number</label>
                            <input id="vcard-phone" type="tel" value={vCardData.phone} onChange={(e) => setVCardData({ ...vCardData, phone: e.target.value })} placeholder="e.g., +1-202-555-0125" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-email">Email Address</label>
                            <input id="vcard-email" type="email" value={vCardData.email} onChange={(e) => setVCardData({ ...vCardData, email: e.target.value })} placeholder="e.g., john.doe@example.com" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-website">Website</label>
                            <input id="vcard-website" type="url" value={vCardData.website} onChange={(e) => setVCardData({ ...vCardData, website: e.target.value })} placeholder="e.g., https://www.example.com" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-organization">Company / Organization</label>
                            <input id="vcard-organization" type="text" value={vCardData.organization} onChange={(e) => setVCardData({ ...vCardData, organization: e.target.value })} placeholder="e.g., Example Inc." />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-title">Job Title</label>
                            <input id="vcard-title" type="text" value={vCardData.title} onChange={(e) => setVCardData({ ...vCardData, title: e.target.value })} placeholder="e.g., Marketing Director" />
                        </div>

                        {/* Address */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label htmlFor="vcard-street">Street Address</label>
                            <input id="vcard-street" type="text" value={vCardData.street} onChange={(e) => setVCardData({ ...vCardData, street: e.target.value })} placeholder="e.g., 123 Main St" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-city">City</label>
                            <input id="vcard-city" type="text" value={vCardData.city} onChange={(e) => setVCardData({ ...vCardData, city: e.target.value })} placeholder="e.g., Anytown" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-state">State / Province</label>
                            <input id="vcard-state" type="text" value={vCardData.state} onChange={(e) => setVCardData({ ...vCardData, state: e.target.value })} placeholder="e.g., CA" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-zip">ZIP / Postal Code</label>
                            <input id="vcard-zip" type="text" value={vCardData.zip} onChange={(e) => setVCardData({ ...vCardData, zip: e.target.value })} placeholder="e.g., 90210" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-country">Country</label>
                            <input id="vcard-country" type="text" value={vCardData.country} onChange={(e) => setVCardData({ ...vCardData, country: e.target.value })} placeholder="e.g., USA" />
                        </div>

                        {/* Social Media */}
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-linkedin">LinkedIn Username</label>
                            <input id="vcard-linkedin" type="text" value={vCardData.linkedin} onChange={(e) => setVCardData({ ...vCardData, linkedin: e.target.value })} placeholder="e.g., johndoe" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-twitter">Twitter (X) Username</label>
                            <input id="vcard-twitter" type="text" value={vCardData.twitter} onChange={(e) => setVCardData({ ...vCardData, twitter: e.target.value })} placeholder="e.g., johndoe" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="vcard-instagram">Instagram Username</label>
                            <input id="vcard-instagram" type="text" value={vCardData.instagram} onChange={(e) => setVCardData({ ...vCardData, instagram: e.target.value })} placeholder="e.g., johndoe" />
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label htmlFor="vcard-notes">Notes</label>
                            <textarea id="vcard-notes" value={vCardData.notes} onChange={(e) => setVCardData({ ...vCardData, notes: e.target.value })} placeholder="e.g., Met at the 2025 Tech Conference" rows="3" />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button onClick={handleSaveTemplate} disabled={!vCardData.name} className={styles.saveTemplateButton}>Save as Template</button>
                        <button onClick={handleClearForm} className={styles.clearFormButton}>Clear Form</button>
                    </div>
                    <div className={styles.templateContainer}>
                        <h4>Templates</h4>
                        <div className={styles.templateControls}>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className={styles.templateSelect}
                                aria-label="Select a template"
                            >
                                <option value="">-- Select a Template --</option>
                                {templates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                            </select>
                            <div className={styles.templateButtons}>
                                <button onClick={handleLoadTemplate} disabled={!selectedTemplate}>Load</button>
                                <button onClick={handleDeleteTemplate} disabled={!selectedTemplate} className={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                        <p className={styles.privacyNote}>
                            🔒 All information is stored locally in your browser. Nothing is shared with our servers.
                        </p>

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
                            defaultStylishText="Scan to Save Contact"
                            onDownloadStylish={() => handleDownloadQR(true)}
                            downloadDisabled={!vCardData.name}
                            addToLog={addToLog}
                        />
                    </div>
                </div>
                <div className={styles.sidebar}>
                    <div className={styles.qrCodeContainer}>
                        <h4>Your QR Code</h4>
                        <p>Scan this to instantly save the contact.</p>
                        <div className={styles.qrCodeWrapper} ref={qrCodeRef}>
                            <QRCodeCanvas
                                value={vCardString}
                                size={256}
                                bgColor={qrBgColor}
                                fgColor={qrFgColor}
                                level={"H"}
                                includeMargin={true}
                                imageSettings={qrLogo ? {
                                    src: qrLogo,
                                    height: qrLogoSize,
                                    width: qrLogoSize,
                                    excavate: true,
                                } : undefined}
                            />
                        </div>
                        {vCardData.name && ( // Only show size if there's actual data
                            <div className={styles.vcardSizeInfo}>
                                <p>vCard Size: <strong>{vCardSize} bytes</strong></p>
                                <p>Tag Suggestion: <em>{tagSuggestionMessage}</em></p>
                            </div>
                        )}
                        <div className={styles.downloadButtonsContainer}>
                            <button onClick={() => handleDownloadQR(false)} className={styles.downloadButton} disabled={!vCardData.name}>
                                Download QR
                            </button>
                            <button onClick={handleSaveVCard} className={`${styles.downloadButton} ${styles.vcfButton}`} disabled={!vCardData.name}>
                                Download .vcf
                            </button>
                        </div>
                        <div className={styles.shareSection}>
                            <p>Or share it directly:</p>
                            <div className={styles.socialShareButtons}>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out my digital business card!')}`} target="_blank" rel="noopener noreferrer" className={`${styles.socialButton} ${styles.twitterButton}`} aria-label="Share on Twitter">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                </a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className={`${styles.socialButton} ${styles.facebookButton}`} aria-label="Share on Facebook">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zM13.6 19.14v-7.1h2.37l.35-2.75h-2.72V7.52c0-.8.22-1.34 1.36-1.34h1.45V3.78c-.25-.03-.83-.08-1.57-.08-1.55 0-2.62.95-2.62 2.7v2.03h-2.63v2.75h2.63v7.1h3.2z"></path></svg>
                                </a>
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out my digital business card: ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className={`${styles.socialButton} ${styles.whatsappButton}`} aria-label="Share on WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.42 1.29 4.89L2 22l5.25-1.38c1.41.78 2.99 1.21 4.66 1.21h.12c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.28-.14-1.65-.81-1.9-.91-.26-.1-.45-.14-.64.14-.19.28-.72.91-.88 1.1-.16.19-.32.21-.59.07-.28-.14-1.17-.43-2.23-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.1-.24-.56-.48-.48-.64-.49-.16-.01-.35-.01-.54-.01s-.45.07-.68.35c-.24.28-.92 1.01-1.12 2.46-.21 1.45.5 2.86.57 3.07.07.21 1.87 2.99 4.53 4.22 2.66 1.23 2.66.82 3.14.77.48-.05 1.65-.68 1.88-1.33.24-.65.24-1.21.16-1.33-.07-.12-.26-.2-.54-.34z"></path></svg>
                                </a>
                                <button onClick={handleCopyToClipboard} className={`${styles.socialButton} ${styles.copyButton}`} aria-label="Copy share link">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleWriteVCard}
                            className={`${styles.actionButton} ${isWriting ? styles.waitingButton : ''}`}
                            disabled={!vCardData.name || isWriting}
                        >
                            {isWriting ? '📡 Waiting for Tag... Tap Device' : '✍️ Write to NFC Tag'}
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
                    </div>
                    <div className={styles.phonePreviewContainer}>
                        <PhonePreview vCardData={vCardData} />
                    </div>
                </div>
            </div>
            <div className={styles.logContainer}>
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