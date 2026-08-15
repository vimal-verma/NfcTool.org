import { MetadataRoute } from 'next';

/**
 * @returns {MetadataRoute.Robots}
 */
export default function robots() {
    const baseUrl = 'https://nfctool.org';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Per-tag utility route with no standalone content to index.
                disallow: ['/redirect'],
            },
            // Allow Google's AI crawler
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            // Allow OpenAI's crawler
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}