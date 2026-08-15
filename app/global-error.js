'use client';

// Catches errors thrown in the root layout itself, where <html>/<body> and the
// normal error boundary aren't available. Kept dependency-free on purpose.
export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body
                style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    margin: 0,
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#111827',
                }}
            >
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
                <p style={{ color: '#6b7280', maxWidth: '420px', marginBottom: '1.5rem' }}>
                    NfcTool couldn&apos;t load. Please reload the page — your data never
                    leaves your device, so nothing was lost.
                </p>
                {error?.digest && (
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                        Reference: {error.digest}
                    </p>
                )}
                <button
                    type="button"
                    onClick={reset}
                    style={{
                        background: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '0.85rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Reload
                </button>
            </body>
        </html>
    );
}
