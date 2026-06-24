import type { Metadata } from "next";
import { Monoton, Sora } from "next/font/google";
import { AppProviders } from "@/app/providers";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locale";
import { ZH_TW_FONT_STYLESHEET } from "@/lib/i18n/fonts";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600"],
});

const monoton = Monoton({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Lanting Ko · Product Designer",
  description:
    "Lanting is a product designer focused on structure, function, and visual craft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={ZH_TW_FONT_STYLESHEET} rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});if(l==="zh-TW")document.documentElement.lang="zh-Hant";}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${sora.variable} ${monoton.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "history.scrollRestoration='manual';window.scrollTo(0,0);",
          }}
        />
        <AppProviders>
          <ScrollToTopOnLoad />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
