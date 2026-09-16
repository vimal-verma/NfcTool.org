'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SecondaryNav.module.css';
import { tools } from '../lib/tool-list';

export default function SecondaryNav() {
    const pathname = usePathname();
    const activeRef = useRef(null);

    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [pathname]);

    return (
        <nav id="tools-nav" aria-label="Tool suite navigation" className={styles.secondaryNav}>
            <div className={styles.scrollContainer}>
                {tools.map((tool) => {
                    const normPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
                    const normHref = tool.href.toLowerCase().replace(/\/$/, '');
                    const isActive = normPath === normHref || (normHref !== '' && normPath.startsWith(normHref + '/'));

                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            ref={isActive ? activeRef : null}
                            className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {tool.icon && <span className={styles.toolIcon} aria-hidden="true">{tool.icon}</span>}
                            <span>{tool.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}