import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Грань — барбершоп в Екатеринбурге | Стрижка без лишней суеты",
  description:
    "Мужская стрижка, борода, детская стрижка. Фиксированная цена, запись без звонков, ответ за 15 минут. Екатеринбург, ул. Малышева, 51.",
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
