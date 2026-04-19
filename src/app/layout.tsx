import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pin Publisher Lite — Publish Original Pins to Pinterest",
  description:
    "A simple, manual tool to connect your Pinterest account and publish your own original Pins to your boards. No automation, no scraping — just your content, your boards, your workflow.",
  keywords: ["Pinterest", "pin publisher", "create pin", "publish pin", "Pinterest tool"],
  openGraph: {
    title: "Pin Publisher Lite",
    description: "Manually publish your original Pins to Pinterest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
