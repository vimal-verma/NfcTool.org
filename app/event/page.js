import EventToolClient from './event-tool-client';
import { Fragment } from 'react';

export const metadata = {
    title: 'Free Event QR Code Generator & NFC Writer | NfcTool',
    description: 'Generate a calendar event QR code (vEvent / iCal format). Scan to add the event to any calendar app. Also write to NFC tags. Free, no sign-up.',
    keywords: [
        'Event QR code generator', 'Calendar QR generator', 'vEvent QR code', 'iCal QR code',
        'generate Event QR code', 'create calendar QR code', 'NFC Event QR code',
        'Free Event QR code generator', 'Calendar link QR', 'NFC Event writer',
        'Event to NFC tag', 'QR code for calendar event', 'share event with QR code',
        'add event QR code', 'NfcTool', 'event NFC tag writer', 'WebNFC Event',
    ],
    openGraph: {
        title: 'Free Event QR Code Generator & NFC Writer | NfcTool',
        description: 'Generate a vEvent QR code — scan to add to calendar. Works with Google, Apple, and Outlook. Also writes to NFC.',
        url: 'https://nfctool.org/event',
        siteName: 'NfcTool',
        images: [{ url: 'https://nfctool.org/og-logo.png', width: 1200, height: 630, alt: 'Event QR Code Generator — NfcTool' }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Event QR Code Generator & NFC Writer | NfcTool',
        description: 'Create a calendar event QR code — scan to add to Google Calendar, iCal, or Outlook.',
        images: ['https://nfctool.org/og-logo.png'],
    },
    alternates: { canonical: 'https://nfctool.org/event' },
};

export default function EventPage() {
    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Event QR Code Generator & NFC Writer',
        applicationCategory: 'Utilities',
        operatingSystem: 'Web',
        description: 'A free online tool to generate calendar event QR codes (vEvent) and write them to NFC tags.',
        featureList: ['Generate vEvent QR codes', 'Write event data to NFC tags', 'Compatible with Google Calendar, iCal, Outlook', 'Customize QR colors'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@type': 'Organization', name: 'NfcTool' }
    };

    return (
        <Fragment>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
            <div className="toolPageWrapper">
                <header className="toolPageHero">
                    <h1>Calendar Event QR Code Generator</h1>
                    <p>Create a QR code for any event in vEvent (iCal) format. Attendees scan to add the event to Google Calendar, Apple Calendar, or Outlook automatically.</p>
                    <div className="toolBadges">
                        <span className="toolBadge">Free</span>
                        <span className="toolBadge">vEvent / iCal format</span>
                        <span className="toolBadge">Google · Apple · Outlook</span>
                        <span className="toolBadge">QR + NFC</span>
                    </div>
                </header>

                <EventToolClient />

                <section className="toolHowTo">
                    <h2>How to Create an Event QR Code</h2>
                    <p>Let attendees add your event with one scan.</p>
                    <div className="toolStepsGrid">
                        <div className="toolStep">
                            <div className="toolStepNum">1</div>
                            <div><h3>Enter Event Details</h3><p>Add the event title, start and end date/time, location, and an optional description.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">2</div>
                            <div><h3>QR Code is Ready</h3><p>The vEvent QR updates as you type. Compatible with all major calendar apps.</p></div>
                        </div>
                        <div className="toolStep">
                            <div className="toolStepNum">3</div>
                            <div><h3>Share or Print</h3><p>Download as PNG for invitations, posters, or flyers. Or write to NFC for tap-to-add at the venue.</p></div>
                        </div>
                    </div>
                </section>

                <section className="toolUseCases">
                    <h2>Common Uses</h2>
                    <div className="toolUseCaseGrid">
                        <div className="toolUseCase"><strong>🎉 Parties &amp; Weddings</strong>Add to invitations — guests scan to save the date.</div>
                        <div className="toolUseCase"><strong>🎤 Conferences</strong>Session QR codes on the schedule — tap to add to calendar.</div>
                        <div className="toolUseCase"><strong>🏫 Classes &amp; Workshops</strong>Print on handouts so students add recurring sessions.</div>
                        <div className="toolUseCase"><strong>🏷️ NFC Venue Tags</strong>Tap at the entrance — event is added to your calendar instantly.</div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
