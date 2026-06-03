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
  title: "Anshome | Tìm kiếm nhà đất",
  description:
    "Cổng thông tin bất động sản với tìm kiếm nhà đất, tin đăng, dự án và tin tức thị trường.",
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
