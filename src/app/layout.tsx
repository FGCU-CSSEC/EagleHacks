import type { Metadata } from "next";
import "@fontsource-variable/archivo/wdth.css";
import { site } from "@/config/site";
import { getPublicSettings } from "@/lib/settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { eventDates } = await getPublicSettings();
  return {
    metadataBase: new URL(site.url),
    title: `${site.name} ${site.year} | FGCU`,
    description: `${site.name} ${site.year}: a ${site.hours}-hour student hackathon at Florida Gulf Coast University, ${eventDates}.`,
    alternates: { canonical: "/" },
    openGraph: {
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${site.name} ${site.year}` }],
      title: `${site.name} ${site.year}`,
      description: `${site.hours} hours of building at FGCU, ${eventDates}.`,
      url: site.url,
      siteName: site.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  };
}

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "EagleHacks 2027",
  description: "A 36-hour student hackathon at Florida Gulf Coast University.",
  startDate: site.startDate,
  endDate: site.endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: `${site.url}/`,
  image: `${site.url}/og-image.png`,
  location: {
    "@type": "Place",
    name: "Florida Gulf Coast University, Academic Building 9",
    address: {
      "@type": "PostalAddress",
      streetAddress: "10501 FGCU Blvd. S.",
      addressLocality: "Fort Myers",
      addressRegion: "FL",
      postalCode: "33965",
      addressCountry: "US",
    },
  },
  organizer: { "@type": "Organization", name: "CSSEC at FGCU", url: `${site.url}/` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
