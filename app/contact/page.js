import styles from './page.module.css';
import ContactFormClient from './ContactFormClient';
import JsonLd from '../components/JsonLd';

const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact NfcTool',
    description: 'Get in touch with the NfcTool team for questions, bug reports, or ideas about NFC technology.',
    url: 'https://nfctool.org/contact',
    publisher: {
        '@type': 'Organization',
        name: 'NfcTool',
        url: 'https://nfctool.org',
        email: 'support@nfctool.org',
        sameAs: ['https://github.com/vimal-verma/webnfc'],
    },
};

export const metadata = {
    title: 'Contact Us | NfcTool',
    description: 'Get in touch with the NfcTool team. Ask questions, report issues, or share your ideas about NFC technology and our tools.',
    keywords: ['contact NfcTool', 'NFC support', 'NfcTool contact', 'NFC help', 'contact NFC team', 'NfcTool feedback'],
    alternates: {
        canonical: 'https://nfctool.org/contact',
    },
    openGraph: {
        title: 'Contact Us | NfcTool',
        description: 'Get in touch with the NfcTool team. Ask questions, report issues, or share your ideas about NFC technology.',
        url: 'https://nfctool.org/contact',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Contact NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us | NfcTool',
        description: 'Get in touch with the NfcTool team. Ask questions, report issues, or share your ideas.',
        images: ['https://nfctool.org/og-logo.png'],
    },
};

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Contact Us</h1>
                <p className={styles.subtitle}>
                    Have a question or want to work with us? Drop us a message and we&apos;ll get back to you.
                </p>
                <ContactFormClient />
            </div>
            <JsonLd data={contactSchema} />
        </div>
    );
}
