/**
 * Shared NFC Push and Abort Controller Manager
 * 
 * In W3C Web NFC, Chrome allows only ONE active pending push (ndef.write)
 * operation at a time. If ndef.write() is called while another push is pending,
 * Chrome aborts the previous push and throws:
 * "OperationError: A push() operation is cancelled by a new push()".
 * 
 * This manager provides:
 * 1. Global tracking to abort any pending push before starting a new one.
 * 2. Error classification for aborts and superseded pushes.
 * 3. User-friendly error messaging instead of alarming red errors.
 */

let globalActiveNfcController = null;

/**
 * Abort any currently pending NFC push operation across the application.
 */
export function abortActiveNfcPush() {
    if (globalActiveNfcController) {
        try {
            globalActiveNfcController.abort();
        } catch (e) {
            // Ignore abort errors
        }
        globalActiveNfcController = null;
    }
}

/**
 * Register a new active controller and abort any previous one.
 * @param {AbortController} controller 
 */
export function registerActiveNfcController(controller) {
    abortActiveNfcPush();
    globalActiveNfcController = controller;
}

/**
 * Release controller if it matches the current global active one.
 * @param {AbortController} controller 
 */
export function releaseActiveNfcController(controller) {
    if (globalActiveNfcController === controller) {
        globalActiveNfcController = null;
    }
}

/**
 * Check if the error was due to a user cancellation or push replacement.
 * @param {Error|DOMException} error 
 * @returns {boolean}
 */
export function isPushCancelledError(error) {
    if (!error) return false;
    if (error.name === 'AbortError') return true;
    const msg = (error.message || '').toLowerCase();
    return (
        msg.includes('cancelled by a new push') ||
        msg.includes('operation is cancelled') ||
        msg.includes('push() operation is cancelled') ||
        msg.includes('the operation was aborted')
    );
}

/**
 * Parse an NFC error into a user-friendly log entry with status type.
 * @param {Error|DOMException} error 
 * @returns {{ message: string, type: 'info' | 'warning' | 'error' }}
 */
export function formatNfcError(error) {
    if (!error) {
        return { message: 'Unknown error occurred.', type: 'error' };
    }

    if (error.name === 'AbortError') {
        return { message: 'Write operation cancelled.', type: 'info' };
    }

    const msg = error.message || '';
    if (
        msg.includes('cancelled by a new push') ||
        msg.includes('push() operation is cancelled')
    ) {
        return {
            message: 'A previous pending write was replaced by a new write request. Waiting for tag...',
            type: 'info'
        };
    }

    if (error.name === 'NotAllowedError') {
        return {
            message: 'NFC permission was denied or cancelled by user.',
            type: 'warning'
        };
    }

    if (error.name === 'NotSupportedError') {
        return {
            message: 'Web NFC is not supported on this device or browser.',
            type: 'error'
        };
    }

    return {
        message: `Write failed: ${msg || error.name || 'Unknown error'}`,
        type: 'error'
    };
}
