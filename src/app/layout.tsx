import type { Metadata } from "next";
import { Monoton, Sora } from "next/font/google";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
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
  title: "Lanting Ko — Product Designer",
  description:
    "Lan-Ting is a product designer who shapes how things are structured, function, and look.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${monoton.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "history.scrollRestoration='manual';window.scrollTo(0,0);",
          }}
        />
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  );
}
