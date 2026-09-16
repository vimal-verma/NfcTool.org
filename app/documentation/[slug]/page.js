import { notFound } from 'next/navigation';
import Link from 'next/link';
import hljs from 'highlight.js';
import '../syntax.css';
import styles from './page.module.css';
import CodeBlock from '../CodeBlock';
import { sections, navItems } from '../nav-items';
import JsonLd from '../../components/JsonLd';

async function getSectionContent(slug) {
    try {
        const guide = await import(`../guides/${slug}.json`);
        return guide.default;
    } catch (error) {
        return null;
    }
}

export async function generateStaticParams() {
    return navItems.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const section = await getSectionContent(slug);
    const title = section?.title || sections[slug] || "Documentation";
    const description = section?.description || `Learn about ${title.toLowerCase()} with the Web NFC API on NfcTool.org.`;
    const rawImage = section?.image || '/og-logo.png';
    const imageUrl = rawImage.startsWith('http') ? rawImage : `https://nfctool.org${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;

    let keywords = ["Web NFC", "NFC", "NFC tutorial", "WebNFC API", "NFC guide", title];
    if (section?.keywords) {
        const extraKeywords = Array.isArray(section.keywords)
            ? section.keywords
            : section.keywords.split(',').map(k => k.trim());
        keywords = [...keywords, ...extraKeywords];
    }

    return {
        title: `${title} | NfcTool.org`,
        description: description,
        keywords: keywords,
        alternates: {
            canonical: `https://nfctool.org/documentation/${slug}`,
        },
        openGraph: {
            title: `${title} | NfcTool.org`,
            description: description,
            url: `https://nfctool.org/documentation/${slug}`,
            siteName: 'NfcTool.org',
            type: 'article',
            publishedTime: section?.date,
            authors: section?.author ? [section.author] : ['NfcTool Team'],
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | NfcTool.org`,
            description: description,
            images: [imageUrl],
        },
    };
}

export default async function DocumentationContent({ params }) {
    // Await params to resolve the promise-like object in newer Next.js versions
    const { slug } = await params;
    const section = await getSectionContent(slug);

    const currentIndex = navItems.findIndex(item => item.slug === slug);

    const prevSection = currentIndex > 0 ? {
        slug: navItems[currentIndex - 1].slug,
        title: navItems[currentIndex - 1].title
    } : null;

    const nextSection = currentIndex < navItems.length - 1 ? {
        slug: navItems[currentIndex + 1].slug,
        title: navItems[currentIndex + 1].title
    } : null;

    if (!section) {
        notFound();
    }

    // Apply syntax highlighting to code blocks on the server
    const highlightedContent = section.content.replace(
        /<pre><code class="language-(js|jsx)">([\s\S]*?)<\/code><\/pre>/g,
        (match, lang, code) => {
            const highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;
            return `<pre><code class="language-${lang} hljs">${highlightedCode}</code></pre>`;
        },
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': section.title,
        'description': section.description,
        'url': `https://nfctool.org/documentation/${slug}`,
        'author': {
            '@type': 'Organization',
            'name': 'NfcTool.org',
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'NfcTool.org',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://nfctool.org/logo.png'
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://nfctool.org/documentation/${slug}`
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
            { '@type': 'ListItem', position: 2, name: 'Documentation', item: 'https://nfctool.org/documentation' },
            { '@type': 'ListItem', position: 3, name: sections[slug], item: `https://nfctool.org/documentation/${slug}` },
        ],
    };

    return (
        <div className={styles.documentationContainer}>
            <article className={styles.guide}>
                <h1 className={styles.guideTitle}>{sections[slug]}</h1>
                <CodeBlock>
                    <div
                        className={styles.guideContent}
                        dangerouslySetInnerHTML={{ __html: highlightedContent }}
                    />
                </CodeBlock>
                <a
                    href={`https://github.com/vimal-verma/webnfc.org/edit/main/app/documentation/guides/${slug}.json`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.editLink}>✏️ Edit this page on GitHub</a>
                <JsonLd data={jsonLd} />
                <JsonLd data={breadcrumbSchema} />
                <div className={styles.pagination}>
                    {prevSection && (
                        <Link href={`/documentation/${prevSection.slug}`} className={styles.prevLink}>
                            &larr; {prevSection.title}
                        </Link>
                    )}
                    {nextSection && (
                        <Link href={`/documentation/${nextSection.slug}`} className={styles.nextLink}>
                            {nextSection.title} &rarr;
                        </Link>
                    )}
                </div>
            </article>
        </div>
    );
}