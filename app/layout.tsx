import type { Metadata } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-inter",
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const metadataBase = new URL(
  deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase,
  applicationName: "Грань",
  title: {
    default: "Грань — барбершоп в Екатеринбурге",
    template: "%s | Грань",
  },
  description:
    "Мужская стрижка, борода, детская стрижка. Фиксированная цена, запись без звонков, ответ за 15 минут. Екатеринбург, ул. Малышева, 51.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Грань",
    title: "Грань — барбершоп в Екатеринбурге",
    description:
      "Стрижка без лишней суеты: фиксированная цена, запись без звонков и быстрое подтверждение.",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Грань — барбершоп с записью без лишней суеты",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Грань — барбершоп в Екатеринбурге",
    description:
      "Стрижка без лишней суеты: фиксированная цена и запись без звонков.",
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${robotoCondensed.variable} scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
