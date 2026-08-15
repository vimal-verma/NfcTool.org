import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import JsonLd from '../components/JsonLd';

export const metadata = {
  title: 'About NfcTool | Our Mission & Story',
  description: 'Learn about NfcTool.org — a free, open-source project on a mission to make Web NFC technology accessible to developers and enthusiasts worldwide.',
  keywords: ['About NfcTool', 'Web NFC project', 'NFC open source', 'NfcTool mission', 'Vimal Kumar', 'NFC developer tools'],
  openGraph: {
    title: 'About NfcTool | Our Mission & Story',
    description: 'Learn about NfcTool.org — a free, open-source project on a mission to make Web NFC technology accessible to developers and enthusiasts worldwide.',
    url: 'https://nfctool.org/about',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'About NfcTool' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About NfcTool | Our Mission & Story',
    description: 'Learn about NfcTool.org — a free, open-source project on a mission to make Web NFC technology accessible.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  alternates: {
    canonical: 'https://nfctool.org/about',
  },
};

const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About NfcTool',
    description: 'Learn about NfcTool.org — a free, open-source project on a mission to make Web NFC technology accessible to developers and enthusiasts worldwide.',
    url: 'https://nfctool.org/about',
    publisher: {
        '@type': 'Organization',
        name: 'NfcTool',
        url: 'https://nfctool.org',
        logo: 'https://nfctool.org/logo.png',
        sameAs: ['https://github.com/vimal-verma/webnfc'],
    },
};

export default function AboutPage() {
    const teamMembers = [
        { name: 'Vimal Kumar', title: 'Developer', image: '/logo.png' },
    ];
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>About NfcTool.org</h1>
                <p className={styles.subtitle}>
                    On a mission to make Web NFC technology accessible and easy to use for developers and enthusiasts worldwide.
                </p>
            </section>

            <section className={styles.storySection}>
                <div className={styles.storyContent}>
                    <h2>Our Story</h2>
                    <p>
                        NfcTool.org was born from a fascination with the power of Near Field Communication and a desire to bring its capabilities to the open web. The project started as a personal endeavor to explore the Web NFC API and build practical, open-source tools that anyone could use.
                    </p>
                    <p>
                        Today, NfcTool.org serves as a resource for learning about Web NFC, offering free tools like an NFC reader/writer, a vCard generator, and guides for developers. Our goal is to foster a community around this technology and encourage innovation by making it more approachable.
                    </p>
                </div>
                <div className={styles.storyImage}>
                    <Image
                        src="/logo.png"
                        alt="Team working on NFC cards"
                        width={500}
                        height={400}
                        className={styles.image}
                    />
                </div>
            </section>

            <section className={styles.missionSection}>
                <h2 className={styles.sectionTitle}>What is Web NFC?</h2>
                <p className={styles.sectionSubtitle}>Bridging the gap between the web and the physical world.</p>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🌐</div>
                        <h3>Browser-Native API</h3>
                        <p>Web NFC is a modern browser API that allows web applications to read from and write to NFC tags directly, without needing a native mobile app.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>👆</div>
                        <h3>Simple & Secure</h3>
                        <p>Interactions are initiated by a simple, intentional tap, making it a secure and user-friendly way to exchange information with physical objects.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>💡</div>
                        <h3>Endless Possibilities</h3>
                        <p>From digital business cards and interactive posters to inventory management, Web NFC opens up a world of creative applications for the open web.</p>
                    </div>
                </div>
            </section>

            <section className={styles.teamSection}>
                <h2 className={styles.sectionTitle}>Meet the Team</h2>
                <p className={styles.sectionSubtitle}>The minds behind the magic.</p>
                <div className={styles.teamGrid}>
                    {teamMembers.map((member, index) => (
                        <div key={index} className={styles.teamMemberCard}>
                            <div className={styles.teamMemberImage}>
                                <Image
                                    src={member.image}
                                    alt={`Portrait of ${member.name}`}
                                    width={150}
                                    height={150}
                                    className={styles.image}
                                />
                            </div>
                            <h3 className={styles.teamMemberName}>{member.name}</h3>
                            <p className={styles.teamMemberTitle}>{member.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.ctaSection}>
                <h2>Ready to Explore Web NFC?</h2>
                <p>Check out our free tools or dive into the documentation to start your journey.</p>
                <Link href="/nfc-tool" className={styles.ctaButton}>
                    Explore Tools
                </Link>
                <Link href="https://github.com/vimal-verma/webnfc.org" target="_blank" rel="noopener noreferrer" className={styles.ctaButtonSecondary}>
                    Contribute on GitHub
                </Link>
            </section>
            <JsonLd data={aboutSchema} />
        </div>
    );
}