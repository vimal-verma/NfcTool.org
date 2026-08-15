import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getAllPosts, getPostBySlug } from '../../lib/posts';
import JsonLd from '../../components/JsonLd';

export function generateStaticParams() {
  const blogPosts = getAllPosts();
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | NfcTool Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://nfctool.org/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://nfctool.org/blog/${slug}`,
      siteName: 'NfcTool',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: `https://nfctool.org${post.image}`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`https://nfctool.org${post.image}`],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // For prev/next navigation, we still need the full sorted list.
  // This is a trade-off for having that feature.
  const sortedPosts = getAllPosts();
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIndex > 0 ? sortedPosts[postIndex - 1] : null;
  const nextPost = postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : null;

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.description,
    'image': `https://nfctool.org${post.image}`,
    'author': {
      '@type': 'Person',
      'name': post.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'NfcTool',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://nfctool.org/logo.png'
      }
    },
    'datePublished': post.date,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nfctool.org' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://nfctool.org/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://nfctool.org/blog/${slug}` },
    ],
  };

  return (
    <div className={styles.container}>
      <Link href="/blog" className={styles.backLink}>← Back to Blog</Link>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span>By {post.author}</span>
            <span>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
        </header>
        <div className={styles.featuredImageWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.featuredImage}
          />
        </div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
        <JsonLd data={jsonLd} />
        <JsonLd data={breadcrumbSchema} />
        {post.tags && post.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <strong>Tags:</strong>
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}
        <a
          href={`https://github.com/vimal-verma/webnfc.org/edit/main/app/blog/posts/${slug}.json`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.editLink}
        >
          ✏️ Edit this page on GitHub</a>
        <footer className={styles.postNavigation}>
          {prevPost && (
            <Link href={`/blog/${prevPost.slug}`} className={styles.prevLink}>
              &larr; Previous Post
              <span className={styles.navTitle}>{prevPost.title}</span>
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className={styles.nextLink}>
              Next Post &rarr;
              <span className={styles.navTitle}>{nextPost.title}</span>
            </Link>
          )}
        </footer>
      </article>
    </div>
  );
}