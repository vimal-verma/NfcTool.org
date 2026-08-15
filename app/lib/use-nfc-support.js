'use client';

import { useSyncExternalStore } from 'react';

/**
 * Web NFC support is a fixed property of the browser, but it can only be read on
 * the client. `useSyncExternalStore` is the right primitive for that: React uses
 * the server snapshot while hydrating, then re-reads on the client — no
 * hydration mismatch and no setState-in-an-effect.
 *
 * Snapshots are plain strings so referential equality holds between reads.
 *
 * 'unknown'       — server render / hydration, before we can feature-detect
 * 'supported'     — Web NFC is available
 * 'ios'           — iPhone/iPad; Apple ships no Web NFC in any iOS browser
 * 'android-other' — Android, but not a browser that supports Web NFC
 * 'desktop'       — no NFC hardware story at all
 */

// Support never changes for the life of the page, so there is nothing to
// subscribe to; React only needs a valid unsubscribe function.
const subscribe = () => () => {};

const getServerSnapshot = () => 'unknown';

const getSnapshot = () => {
    if (typeof window === 'undefined') return 'unknown';
    if ('NDEFReader' in window) return 'supported';

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) return 'ios';
    if (/Android/.test(ua)) return 'android-other';
    return 'desktop';
};

export function useNfcSupport() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Optimistic boolean for gating controls: treats the pre-hydration 'unknown'
 * state as supported, so visitors on Chrome for Android — the people these
 * tools are built for — never see a flash of a disabled button.
 */
export function useNfcLikelySupported() {
    const support = useNfcSupport();
    return support === 'supported' || support === 'unknown';
}
