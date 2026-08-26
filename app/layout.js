import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "../app/components/Header";
import Footer from "../app/components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import ServiceWorkerRegistrar from "./components/ServiceWorkerRegistrar";
import ScrollToTop from "./components/ScrollToTop";
import Script from "next/script";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata = {
  metadataBase: new URL('https://nfctool.org'),
  title: {
    default: 'NfcTool | Free Web NFC & QR Tools',
    template: '%s | NfcTool',
  },
  description: "Free browser-based NFC tools to read, write, and manage NFC tags — plus QR generators for vCards, WiFi, UPI, and more. No app, no sign-up.",
  applicationName: 'NfcTool',
  manifest: '/manifest.json',
  keywords: ['Web NFC', 'NFC tools', 'NFC tag reader', 'NFC tag writer', 'vCard generator', 'NFC business cards', 'WebNFC API', 'NFC tutorials'],
  openGraph: {
    title: 'NfcTool | Free Web NFC & QR Tools',
    description: 'Free browser-based NFC tools to read, write, and manage NFC tags — plus QR generators for vCards, WiFi, UPI, and more.',
    url: 'https://nfctool.org',
    siteName: 'NfcTool',
    locale: 'en_US',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NfcTool — Free Web NFC & QR Tools' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NfcTool | Free Web NFC & QR Tools',
    description: 'Free browser-based NFC tools to read, write, and manage NFC tags — plus QR generators for vCards, WiFi, UPI, and more.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  other: {
    'google-adsense-account': 'ca-pub-4417247577413599',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'light dark',
};

// Applies the saved/OS theme before first paint so there is no flash of the
// wrong theme. Must stay in sync with ThemeContext.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skipLink">Skip to main content</a>
          <Header />
          <main id="main-content" className="main-content">{children}</main>
          <Footer />
          <ScrollToTop />
          <ServiceWorkerRegistrar />
        </ThemeProvider>
        <Script
          id="adsbygoogle"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4417247577413599"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
