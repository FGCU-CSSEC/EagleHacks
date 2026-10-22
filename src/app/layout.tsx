import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/public-sans";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} ${site.year} | FGCU`,
  description: `${site.name} ${site.year}: a ${site.hours}-hour student hackathon at Florida Gulf Coast University, ${site.dates}.`,
  openGraph: {
    title: `${site.name} ${site.year}`,
    description: `${site.hours} hours of building at FGCU, ${site.dates}.`,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
