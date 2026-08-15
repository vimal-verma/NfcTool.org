'use client';

import Link from 'next/link';
import { useNfcSupport } from '../lib/use-nfc-support';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

/**
 * Tells the visitor up front whether Web NFC will work here, instead of letting
 * them press a button and get an error. Renders the same generic text on the
 * server and while hydrating (so it stays useful without JS), then refines it
 * once we can actually feature-detect.
 */
export default function BrowserSupportNotice() {
    const support = useNfcSupport();

    if (support === 'supported') {
        return (
            <div className="toolCompatNote isOk" role="status">
                <CheckIcon />
                <span>
                    <strong>Your browser supports Web NFC.</strong> You&apos;re ready to go —
                    just make sure NFC is turned on in your phone&apos;s settings.
                </span>
            </div>
        );
    }

    if (support === 'ios') {
        return (
            <div className="toolCompatNote" role="status">
                <InfoIcon />
                <span>
                    <strong>iPhone and iPad can&apos;t use Web NFC.</strong> Apple doesn&apos;t
                    support it in any iOS browser, so tag scanning won&apos;t work here.
                    Our <Link href="/qr" className="toolCompatNoteLink">QR code tools</Link> work
                    perfectly on this device.
                </span>
            </div>
        );
    }

    if (support === 'android-other') {
        return (
            <div className="toolCompatNote" role="status">
                <InfoIcon />
                <span>
                    <strong>This Android browser doesn&apos;t support Web NFC.</strong> Open
                    this page in <strong>Chrome for Android</strong> (v89+) to scan tags, or
                    use our <Link href="/qr" className="toolCompatNoteLink">QR code tools</Link> instead.
                </span>
            </div>
        );
    }

    if (support === 'desktop') {
        return (
            <div className="toolCompatNote" role="status">
                <InfoIcon />
                <span>
                    <strong>NFC needs a phone.</strong> Open this page on Chrome for Android
                    to read and write tags. On desktop you can still use every
                    one of our <Link href="/qr" className="toolCompatNoteLink">QR code tools</Link>.
                </span>
            </div>
        );
    }

    // Server render + first paint: the same guidance the page has always shown.
    return (
        <div className="toolCompatNote">
            <InfoIcon />
            <span>
                <strong>Browser requirement:</strong> Web NFC works only in{' '}
                <strong>Chrome on Android</strong> (v89+). Enable NFC in your phone&apos;s
                settings before scanning.
            </span>
        </div>
    );
}
