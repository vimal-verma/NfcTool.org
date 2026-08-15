const fs = require('fs/promises');
const path = require('path');
const React = require('react');
const { ImageResponse } = require('@vercel/og');

const blogPreviewsDir = path.join(process.cwd(), 'public', 'previews', 'blog');
const publicDir = path.join(process.cwd(), 'public');
const postsDir = path.join(process.cwd(), 'app', 'blog', 'posts');

/**
 * Reads an image file from the public directory and returns it as a data URI.
 */
async function getImageDataUri(src) {
    if (!src) return null;
    const imagePath = path.join(publicDir, src);
    try {
        const fileData = await fs.readFile(imagePath);
        const mimeType = `image/${path.extname(src).slice(1)}`;
        const base64 = Buffer.from(fileData).toString('base64');
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.warn(`⚠️  Could not find image file: ${src}.`);
        return null;
    }
}

const BlogPostCard = ({ title, backgroundImage }) => {
    const cardStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        textAlign: 'center',
        color: '#ffffff',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
    };

    const titleStyle = {
        fontSize: '4.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
    };

    const brandingContainerStyle = {
        position: 'absolute',
        bottom: '30px',
        right: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
    };

    const mainBrandingStyle = {
        fontSize: '1.75rem',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.8)',
        margin: 0,
    };

    const subBrandingStyle = {
        fontSize: '1.1rem',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.7)',
        margin: '4px 0 0 0',
    };

    return React.createElement('div', { style: cardStyle }, [
        React.createElement('h1', { key: 'title', style: titleStyle }, title),
        React.createElement('div', { key: 'branding-container', style: brandingContainerStyle }, [
            React.createElement('p', { key: 'main-branding', style: mainBrandingStyle }, 'NfcTool.org'),
            React.createElement('p', { key: 'sub-branding', style: subBrandingStyle }, 'Learn, Build, and Use Web NFC')
        ])
    ]
    );
};

async function generateBlogPreview(post, backgroundImageData) {
    console.log(`   Generating preview for "${post.title}"...`);

    const image = new ImageResponse(
        React.createElement(BlogPostCard, { title: post.title, backgroundImage: backgroundImageData }),
        {
            width: 1200,
            height: 630,
        }
    );

    const buffer = await image.arrayBuffer();
    const fileName = `${post.slug}.png`;
    const outputPath = path.join(blogPreviewsDir, fileName);

    await fs.writeFile(outputPath, Buffer.from(buffer));
    console.log(`   ✅ Saved to ${path.relative(process.cwd(), outputPath)}`);
}

async function getAllPosts() {
    const filenames = await fs.readdir(postsDir);
    const posts = [];
    for (const filename of filenames) {
        if (path.extname(filename) === '.json') {
            const filePath = path.join(postsDir, filename);
            const fileContents = await fs.readFile(filePath, 'utf8');
            posts.push(JSON.parse(fileContents));
        }
    }
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function main() {
    try {
        console.log('🚀 Starting blog preview image generation...');
        await fs.mkdir(blogPreviewsDir, { recursive: true });

        const backgroundImageData = await getImageDataUri('/backgrounds/13.png');
        if (!backgroundImageData) {
            console.error('❌ Could not load background image. Aborting.');
            process.exit(1);
        }

        const posts = await getAllPosts();

        for (const post of posts) {
            try {
                await generateBlogPreview(post, backgroundImageData);
            } catch (error) {
                console.error(`\n❌ Error processing post "${post.title}":`, error.message);
            }
        }

        console.log('\n🎉 All blog preview images generated successfully!');

    } catch (error) {
        console.error('\n❌ Error generating blog preview images:', error);
        process.exit(1);
    }
}

main();