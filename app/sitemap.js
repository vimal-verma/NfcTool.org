import { getAllPosts } from './lib/posts';
import { navItems } from './documentation/nav-items';

const documentationSlugs = navItems.map(item => item.slug);

export default function sitemap() {
    const posts = getAllPosts();
    const baseUrl = 'https://nfctool.org';
    const lastModified = new Date().toISOString(); // Or a static date of last deployment

    const staticRoutes = [
        { url: `${baseUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/upi`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/vcard`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/qr`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/read-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/write-nfc`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
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
        { url: `${baseUrl}/games/truth-or-dare`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/games/speed-tap`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/shufflehunt`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
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