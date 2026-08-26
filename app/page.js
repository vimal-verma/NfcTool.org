import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getLatestPosts } from "./lib/posts";
import JsonLd from "./components/JsonLd";

export const metadata = {
  title: "NfcTool | Learn, Build, and Use Web NFC Technology",
  description:
    "Your ultimate resource for Web NFC. Explore our free online tools to read and write NFC tags, generate vCards, and learn everything about Near Field Communication.",
  keywords: [
    "Web NFC",
    "NFC tag reader",
    "NFC tag writer",
    "vCard generator",
    "NFC tools",
    "WebNFC API",
    "Near Field Communication",
    "NFC tutorials",
  ],
  openGraph: {
    title: "NfcTool | Learn, Build, and Use Web NFC Technology",
    description:
      "The ultimate resource for learning and using Web NFC technology directly in your browser.",
    url: "https://nfctool.org",
    siteName: "NfcTool",
    images: [
      {
        url: "https://nfctool.org/og-logo.png",
        width: 1200,
        height: 630,
        alt: "NfcTool — Learn, Build, and Use Web NFC Technology",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NfcTool | Learn, Build, and Use Web NFC Technology",
    description:
      "The ultimate resource for learning and using Web NFC technology directly in your browser.",
    images: ["https://nfctool.org/og-logo.png"],
  },
  alternates: {
    canonical: "https://nfctool.org",
  },
};

const allTools = [
  { name: "Read NFC", icon: "📖", href: "/read-nfc", desc: "Scan any NFC tag" },
  { name: "Write NFC", icon: "✍️", href: "/write-nfc", desc: "Program tags instantly" },
  { name: "Advanced NFC", icon: "⚡", href: "/nfc-tool", desc: "Clone, erase & lock" },
  { name: "vCard", icon: "📇", href: "/vcard", desc: "Digital business card" },
  { name: "UPI QR", icon: "💳", href: "/upi", desc: "Tap-to-pay QR code" },
  { name: "URL QR", icon: "🔗", href: "/url", desc: "Link to any website" },
  { name: "WiFi QR", icon: "📶", href: "/wifi", desc: "Share WiFi instantly" },
  { name: "Email QR", icon: "✉️", href: "/email", desc: "Pre-filled email" },
  { name: "SMS QR", icon: "💬", href: "/sms", desc: "Send a text message" },
  { name: "Call QR", icon: "📞", href: "/call", desc: "Dial a number" },
  { name: "Event QR", icon: "📅", href: "/event", desc: "Add to calendar" },
  { name: "Location QR", icon: "📍", href: "/location", desc: "Share a place" },
  { name: "QR Tools", icon: "🔳", href: "/qr", desc: "All QR generators" },
];

const faqs = [
  {
    question: "What is Web NFC?",
    answer:
      "Web NFC is a browser API that allows web applications to read from and write to NFC (Near Field Communication) tags. This means you can interact with physical NFC tags directly from a website, without needing a native mobile app.",
  },
  {
    question: "Which browsers support Web NFC?",
    answer:
      "Currently, Web NFC is supported by Chrome on Android (version 89 or newer). It is not available on iOS (iPhone/iPad) or desktop browsers like Safari, Firefox, or Edge. Make sure your Android device supports NFC and that NFC is enabled in system settings.",
  },
  {
    question: "What can I do with your NFC tools?",
    answer:
      "Our free tools allow you to read the contents of any standard NFC tag, write data like text or URLs, create and write digital contact cards (vCards), generate UPI payment QR codes and NFC tags, and share WiFi credentials via QR or NFC.",
  },
  {
    question: "Is it free to use your tools?",
    answer:
      "Yes, all our Web NFC tools—the reader, writer, vCard generator, UPI QR generator, and all QR code tools—are completely free to use directly in your browser. No sign-up, no account, and no installation required.",
  },
  {
    question: "What types of NFC tags are compatible?",
    answer:
      "Our tools work with standard NDEF-formatted NFC tags. Most commonly available tags like NTAG213, NTAG215, and NTAG216 are fully compatible. The tool will indicate the estimated tag type and capacity after scanning.",
  },
  {
    question: "Can I use these tools without an NFC tag?",
    answer:
      "Yes! All our QR code generators (URL, WiFi, vCard, UPI, Email, SMS, and more) work on any device without NFC hardware. You can generate, customize, and download QR codes even on a desktop browser.",
  },
  {
    question: "Is my data safe when using these tools?",
    answer:
      "All processing happens directly in your browser. We do not send your NFC tag data, vCard details, or payment information to any server. Your data never leaves your device.",
  },
];

export default function Home() {
  const latestPosts = getLatestPosts(3);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NfcTool",
    url: "https://nfctool.org",
    logo: "https://nfctool.org/logo.png",
    sameAs: ["https://github.com/vimal-verma/webnfc"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@nfctool.org",
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NfcTool",
    alternateName: "NfcTool.org",
    url: "https://nfctool.org",
    description:
      "Free browser-based NFC tools to read, write, and manage NFC tags, plus QR code generators for vCards, WiFi, UPI, and more.",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "NfcTool",
      url: "https://nfctool.org",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const toolsListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NfcTool — Free NFC & QR Tools",
    description: "A collection of free browser-based NFC and QR code tools.",
    numberOfItems: allTools.length,
    itemListElement: allTools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `https://nfctool.org${tool.href}`,
    })),
  };

  return (
    <div className={styles.main}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={`${styles.heroBadgeDot} pulseDot`}></span>
            Works on Chrome for Android · No install needed
          </div>
          <h1 className={styles.title}>
            Read &amp; Write NFC Tags
            <br />
            Directly in Your Browser
          </h1>
          <p className={styles.subtitle}>
            The free, open-source toolkit for Web NFC. Scan tags, write contact
            cards, generate QR codes, and learn everything about Near Field
            Communication — no app required.
          </p>
          <div className={styles.ctaContainer}>
            <Link href="/nfc-tool" className={styles.primary}>
              Open NFC Tool
            </Link>
            <Link href="/documentation" className={styles.secondary}>
              Read the Docs
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>13+</strong>
              <span>Free Tools</span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <strong>100%</strong>
              <span>Browser-based</span>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <strong className={styles.heroStatZero}>✓</strong>
              <span>No Sign-up</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Tools at a Glance ── */}
      <section className={styles.allToolsSection}>
        <h2 className={styles.sectionTitle}>All Tools at a Glance</h2>
        <p className={styles.sectionSubtitle}>
          13 free tools — NFC readers, writers, and QR generators for every use case.
        </p>
        <div className={styles.allToolsGrid}>
          {allTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.toolItem}>
              <span className={styles.toolItemIcon}>{tool.icon}</span>
              <span className={styles.toolItemName}>{tool.name}</span>
              <span className={styles.toolItemDesc}>{tool.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className={styles.whyChooseUsSection}>
        <h2 className={styles.sectionTitle}>Powerful NFC Tools, Free for Everyone</h2>
        <p className={styles.sectionSubtitle}>
          Unlock the potential of NFC with our suite of browser-based utilities.
        </p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📖</div>
            <h3>NFC Reader</h3>
            <p>
              Instantly scan and inspect the data on any NFC tag, including
              vCards, URLs, and text records, right from your browser.
            </p>
            <Link href="/read-nfc" className={styles.secondary}>
              Read a Tag
            </Link>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✍️</div>
            <h3>NFC Writer</h3>
            <p>
              Program your NFC tags with custom data. Write URLs, plain text, or
              create a digital contact card with a few simple clicks.
            </p>
            <Link href="/write-nfc" className={styles.secondary}>
              Write a Tag
            </Link>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📇</div>
            <h3>vCard Generator</h3>
            <p>
              Create a professional digital business card (.vcf), generate a
              shareable link, and download a QR code for free.
            </p>
            <Link href="/vcard" className={styles.secondary}>
              Create a vCard
            </Link>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💳</div>
            <h3>UPI QR Generator</h3>
            <p>
              Generate a UPI QR code for easy payments and even write the
              payment link directly to an NFC tag for tap-to-pay functionality.
            </p>
            <Link href="/upi" className={styles.secondary}>
              Create UPI QR
            </Link>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔳</div>
            <h3>QR Tools</h3>
            <p>
              Explore our comprehensive collection of QR code generators for
              WiFi, Email, SMS, Calls, Events, and Locations.
            </p>
            <Link href="/qr" className={styles.secondary}>
              View QR Tools
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest Posts ── */}
      <section className={styles.latestPostsSection}>
        <h2 className={styles.sectionTitle}>Latest from the Blog</h2>
        <p className={styles.sectionSubtitle}>
          Stay updated with the latest in NFC technology and networking tips.
        </p>
        <div className={styles.postsGrid}>
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={styles.postCard}
            >
              <div className={styles.postImage}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.postContent}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.postMeta}>
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className={styles.readMore}>Read more →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/blog" className={styles.secondary}>
          View All Posts
        </Link>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>
          Get started in three simple steps — no installation needed.
        </p>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3>Open a Tool</h3>
            <p>
              Choose the NFC Reader, Writer, or any QR generator from the tools
              menu. Everything runs in your browser — nothing to install.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3>Enter Your Data</h3>
            <p>
              Type a URL, paste contact info, enter WiFi credentials — or just
              tap to scan an existing NFC tag and see what&apos;s on it.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3>Tap or Download</h3>
            <p>
              Hold your phone near an NFC tag to write instantly, or download
              your QR code as a PNG to share anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{faq.question}</summary>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={toolsListSchema} />
    </div>
  );
}
