import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pizza Maps - Property Search & Local Intelligence",
  description: "Lightweight address search tool for US properties with local intelligence, satellite views, and climate data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
