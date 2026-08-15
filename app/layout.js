import "./globals.css";
import Header from "../app/components/Header";
import Footer from "../app/components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import ServiceWorkerRegistrar from "./components/ServiceWorkerRegistrar";
import Script from "next/script";


export const metadata = {
  metadataBase: new URL('https://nfctool.org'),
  title: {
    default: 'NfcTool | NFC Tools & Guide',
    template: '%s | NfcTool',
  },
  description: "Leading Web NFC tools and resources to read, write, and manage NFC tags directly from your browser.",
  manifest: '/manifest.json',
  keywords: ['Web NFC', 'NFC tools', 'NFC tag reader', 'NFC tag writer', 'vCard generator', 'NFC business cards', 'WebNFC API', 'NFC tutorials'],
  openGraph: {
    title: 'NfcTool | NFC Tools & Guide',
    description: 'Leading Web NFC tools and resources to read, write, and manage NFC tags directly from your browser.',
    url: 'https://nfctool.org',
    siteName: 'NfcTool',
    images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'NfcTool — NFC Tools & Guide' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NfcTool | NFC Tools & Guide',
    description: 'Leading Web NFC tools and resources to read, write, and manage NFC tags directly from your browser.',
    images: ['https://nfctool.org/og-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/globe-white.jpg',
  },
  other: {
    'google-adsense-account': 'ca-pub-4417247577413599',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4417247577413599"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skipLink">Skip to main content</a>
          <Header />
          <main id="main-content" className="main-content">{children}</main>
          <Footer />
          <ServiceWorkerRegistrar />
        </ThemeProvider>
      </body>
    </html>
  );
}
