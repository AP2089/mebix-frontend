import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StoreProvider } from "@/components/providers/StoreProvider";

import "./tailwind.css";
import "./globals.scss";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    title: {
      default: t("titleDefault"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/icon", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${manrope.variable} flex min-h-screen flex-col font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
