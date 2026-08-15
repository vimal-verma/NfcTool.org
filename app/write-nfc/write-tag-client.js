'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';

function VCardForm({ vCardData, setVCardData }) {
    return (
        <div className={styles.formGrid}>
            <div className={styles.formGroup}>
                <label htmlFor="vcard-name">Full Name *</label>
                <input id="vcard-name" type="text" value={vCardData.name} onChange={(e) => setVCardData({ ...vCardData, name: e.target.value })} placeholder="e.g., John Doe" required />
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
        </div>
    );
}

export default function WriteTagClient() {
    const [log, setLog] = useState([]);
    const [recordType, setRecordType] = useState('text');
    const [textData, setTextData] = useState('');
    const [urlData, setUrlData] = useState('');
    const [vCardData, setVCardData] = useState({
        name: '', phone: '', email: '', website: '', organization: '', title: ''
    });

    const addToLog = useCallback((message, type = 'info') => {
        const formattedMessage = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setLog(prev => [`<span class="${styles[type]}">[${new Date().toLocaleTimeString()}] ${formattedMessage}</span>`, ...prev]);
    }, []);

    const isWriteDisabled = () => {
        switch (recordType) {
            case 'text': return !textData;
            case 'url': return !urlData;
            case 'vcard': return !vCardData.name;
            default: return true;
        }
    };

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

    const handleWrite = async () => {
        if (!('NDEFReader' in window)) {
            addToLog('Web NFC is not supported on this browser. Please use Chrome on Android.', 'error');
            return;
        }

        try {
            const ndef = new window.NDEFReader();

            let record;
            let payloadSize = 0;
            const encoder = new TextEncoder();

            switch (recordType) {
                case 'text':
                    record = { recordType: 'text', data: encoder.encode(textData) };
                    break;
                case 'url':
                    record = { recordType: 'url', data: urlData };
                    // Rough estimation for URL payload size (1 byte for prefix + URL string)
                    payloadSize = 1 + new TextEncoder().encode(urlData).length;
                    break;
                case 'vcard': {
                    const vCardString = [
                        'BEGIN:VCARD', 'VERSION:3.0', `FN:${vCardData.name}`,
                        vCardData.organization ? `ORG:${vCardData.organization}` : null,
                        vCardData.title ? `TITLE:${vCardData.title}` : null,
                        vCardData.phone ? `TEL;TYPE=CELL:${vCardData.phone}` : null,
                        vCardData.email ? `EMAIL:${vCardData.email}` : null,
                        vCardData.website ? `URL:${vCardData.website}` : null,
                        'END:VCARD'
                    ].filter(Boolean).join('\n');
                    record = { recordType: 'mime', mediaType: 'text/vcard', data: encoder.encode(vCardString) };
                    payloadSize = record.data.byteLength;
                    break;
                }
                default:
                    addToLog('Invalid record type selected.', 'error');
                    return;
            }

            const dataSize = payloadSize || record.data.byteLength;
            const tagSuggestion = getTagSuggestion(dataSize);
            addToLog(`Data size: ${dataSize} bytes. ${tagSuggestion}`);
            addToLog('Ready to write. Bring your NFC tag close to your device.');

            await ndef.write({ records: [record] });
            addToLog(`✅ Successfully wrote ${recordType} record to the tag.`, 'success');

        } catch (error) {
            console.error('NFC Write Error:', error);
            addToLog(`Write failed: ${error.message}`, 'error');
        }
    };

    const renderForm = () => {
        switch (recordType) {
            case 'text':
                return (
                    <div className={styles.formGroup}>
                        <label htmlFor="text-data">Text Content</label>
                        <textarea id="text-data" value={textData} onChange={(e) => setTextData(e.target.value)} placeholder="Enter the text you want to write..." rows="5" />
                    </div>
                );
            case 'url':
                return (
                    <div className={styles.formGroup}>
                        <label htmlFor="url-data">URL</label>
                        <input id="url-data" type="url" value={urlData} onChange={(e) => setUrlData(e.target.value)} placeholder="e.g., https://nfctool.org" />
                    </div>
                );
            case 'vcard':
                return <VCardForm vCardData={vCardData} setVCardData={setVCardData} />;
            default:
                return null;
        }
    };

    const tabHints = {
        text: 'Writes a plain text string. Good for instructions, notes, or simple messages.',
        url: 'Writes a URL record. When scanned, the phone opens the link automatically.',
        vcard: 'Writes a contact card (vCard). When scanned, the phone offers to save the contact.',
    };

    return (
        <div className={styles.toolContainer}>
            <div className={styles.writerForm}>
                <div className={styles.tabs}>
                    <button className={recordType === 'text' ? styles.active : ''} onClick={() => setRecordType('text')}>📝 Text</button>
                    <button className={recordType === 'url' ? styles.active : ''} onClick={() => setRecordType('url')}>🔗 URL</button>
                    <button className={recordType === 'vcard' ? styles.active : ''} onClick={() => setRecordType('vcard')}>📇 Contact Card</button>
                </div>
                <p className={styles.tabHint}>{tabHints[recordType]}</p>
                <div className={styles.formContent}>
                    {renderForm()}
                </div>
                <button onClick={handleWrite} disabled={isWriteDisabled()} className={styles.actionButton}>
                    ✍️ Write to NFC Tag
                </button>
                {isWriteDisabled() && (
                    <p className={styles.writeHint}>
                        {recordType === 'vcard' ? 'Full Name is required to write a contact card.' : 'Fill in the field above to enable writing.'}
                    </p>
                )}
            </div>

            <div className={styles.logContainer}>
                <div className={styles.logHeader}>
                    <h3>Write Log</h3>
                    <button onClick={() => setLog([])} className={styles.clearLogButton} disabled={log.length === 0}>
                        Clear
                    </button>
                </div>
                {log.length === 0 ? (
                    <p style={{color:'var(--text-secondary)',fontSize:'0.85rem',padding:'0.25rem 0'}}>Fill in the form and press Write. The log will appear here.</p>
                ) : (
                    <div className={styles.log} dangerouslySetInnerHTML={{ __html: log.join('<br />') }} aria-live="polite" />
                )}
            </div>
        </div>
    );
}