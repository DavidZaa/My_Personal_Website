import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const telemetry = IBM_Plex_Mono({
  variable: "--font-telemetry",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "David Zhang",
    template: "%s · David Zhang",
  },
  description:
    "David Zhang — CS & Math of Computation at UCLA. Projects, research, writing, and a small corner of space.",
  openGraph: {
    title: "David Zhang",
    description:
      "CS & Math of Computation at UCLA. Projects, research, writing, and a small corner of space.",
    url: siteUrl,
    siteName: "David Zhang",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${telemetry.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Viewport-fixed nebula wash — body-level backgrounds size to the
            body box (one viewport tall here), which printed a visible seam
            mid-page. A fixed layer stays put behind everything instead. */}
        <div aria-hidden className="nebula-bg fixed inset-0 -z-20" />
        {children}
      </body>
    </html>
  );
}
