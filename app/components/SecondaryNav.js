'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SecondaryNav.module.css';
import { tools } from '../lib/tool-list';

export default function SecondaryNav() {
    const pathname = usePathname();

    return (
        <nav id="tools-nav" aria-label="Tools" className={styles.secondaryNav}>
            <div className={styles.scrollContainer}>
                {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className={`${styles.navLink} ${pathname === tool.href ? styles.active : ''}`} aria-current={pathname === tool.href ? 'page' : undefined}>
                        {tool.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}