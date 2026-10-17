import type { Metadata } from "next";
import { Mitr, Sarabun } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./components/providers/theme.provider";
import { AuthSessionProvider } from "./components/providers/session.provider";
import { TopNavbar } from "./components/top-navbar";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
});

const mitr = Mitr({
  variable: "--font-mitr",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("title"), description: t("description") };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${sarabun.variable} ${mitr.variable}`}>
      <body>
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
          <filter id="stamp-ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.4" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="8" result="blotch" />
            <feColorMatrix in="blotch" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.85" result="pressure" />
            <feComposite in="rough" in2="pressure" operator="in" />
          </filter>
        </svg>
        <ThemeProvider>
          <AuthSessionProvider>
            <NextIntlClientProvider>
              <TopNavbar />
              {children}
              <ToastContainer />
            </NextIntlClientProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
