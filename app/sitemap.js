import { getAllPosts } from './lib/posts';
import { navItems } from './documentation/nav-items';

export const dynamic = 'force-static';

const documentationSlugs = navItems.map(item => item.slug);

export default function sitemap() {
    const posts = getAllPosts();
    const baseUrl = 'https://nfctool.org';
    // Use a static date for static pages to avoid signalling a change on every crawl.
    // Update this when you make meaningful content changes.
    const staticLastModified = '2026-08-01T00:00:00.000Z';
    const lastModified = staticLastModified;

    const staticRoutes = [
        { url: `${baseUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/upi`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/vcard`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/qr`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/read-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/write-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/clone-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/erase-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/format-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/lock-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/call`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/sms`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/email`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/url`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/wifi`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/event`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/location`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/nfc-tool`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/documentation`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
        { url: `${baseUrl}/showcase`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/games`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/truth-or-dare`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/speed-tap`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/shufflehunt`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    ];

    const blogPostRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const documentationRoutes = documentationSlugs.map((slug) => ({
        url: `${baseUrl}/documentation/${slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...blogPostRoutes, ...documentationRoutes];
}