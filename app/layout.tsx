import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
