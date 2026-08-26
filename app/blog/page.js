import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getAllPosts } from '../lib/posts';
import JsonLd from '../components/JsonLd';

export const metadata = {
  title: 'Blog — NFC Insights, Guides & News | NfcTool',
  description: 'Read the latest insights, tips, and stories on modern networking, NFC technology, and business card design from the NfcTool team.',
  keywords: ['NFC blog', 'Web NFC guides', 'NFC technology news', 'NFC tutorials', 'vCard tips', 'QR code insights', 'NFC use cases', 'NfcTool updates'],
  alternates: {
    canonical: 'https://nfctool.org/blog',
  },
  openGraph: {
    title: 'Blog — NFC Insights, Guides & News | NfcTool',
    description: 'Read the latest insights, tips, and stories on modern networking, NFC technology, and business card design from the NfcTool team.',
    url: 'https://nfctool.org/blog',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NfcTool Blog' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — NFC Insights, Guides & News | NfcTool',
    description: 'Read the latest insights, tips, and stories on modern networking, NFC technology, and business card design from the NfcTool team.',
    images: ['https://nfctool.org/og-logo.png'],
  },
};

function getReadingTime(excerpt) {
  const words = (excerpt || '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 40));
}

export default function BlogPage() {
  const blogPosts = getAllPosts();
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'The NfcTool Blog',
    'description': 'Insights, tips, and stories on the future of networking.',
    'publisher': {
      '@type': 'Organization',
      'name': 'NfcTool',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://nfctool.org/logo.png'
      }
    },
    'blogPost': blogPosts.map(post => ({
      '@type': 'BlogPosting',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://nfctool.org/blog/${post.slug}`
      },
      'headline': post.title,
      'image': `https://nfctool.org${post.image}`,
      'datePublished': post.date,
      'author': {
        '@type': 'Person',
        'name': post.author
      },
      'description': post.excerpt
    }))
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroBadge}>{blogPosts.length} articles</div>
        <h1 className={styles.title}>The NfcTool Blog</h1>
        <p className={styles.subtitle}>
          Insights, tips, and stories on NFC technology, digital networking, and the future of contactless communication.
        </p>
      </header>

      <div className={styles.postsGrid}>
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
            <div className={styles.postImageWrapper}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.postImage}
              />
            </div>
            <div className={styles.postContent}>
              {post.tags && post.tags.length > 0 && (
                <div className={styles.postTags}>
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className={styles.postTag}>{tag}</span>
                  ))}
                </div>
              )}
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
              <div className={styles.postMeta}>
                <span className={styles.postAuthor}>By {post.author}</span>
                <span className={styles.postMetaRight}>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className={styles.readingTime}>{getReadingTime(post.excerpt)} min read</span>
                </span>
              </div>
            </div>
            <div className={styles.readMoreBar}>Read article →</div>
          </Link>
        ))}
      </div>
      <JsonLd data={blogSchema} />
    </div>
  );
}