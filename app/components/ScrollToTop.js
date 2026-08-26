'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 320);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollUp}
            aria-label="Scroll to top"
            className={`scrollToTop${visible ? ' visible' : ''}`}
        >
            ↑
        </button>
    );
}
