import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anshome UI | Tim kiem nha dat",
  description:
    "Mau giao dien cong thong tin bat dong san voi thanh tim kiem, tin dang, du an va tin tuc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${manrope.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
