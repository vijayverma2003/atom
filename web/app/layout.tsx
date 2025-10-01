import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import ToastProvider from "./_components/ToastProvider";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

const site = {
  name: "ATOM",
  description: "Share images with people all over the world",
  defaultOg: "/default-og.png",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} – Share & discover images`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["image sharing", "photos", "photography", "wallpapers"],
  applicationName: site.name,
  category: "social",
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.domain,
    title: `${site.name} — Share & discover images`,
    description:
      "Share, discover, and discuss stunning images. Follow creators, build collections, and join a vibrant photo community.",
    images: [{ url: site.defaultOg, width: 1200, height: 630, alt: site.name }],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};
