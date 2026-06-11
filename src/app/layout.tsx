import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { BunutanProvider } from "@/context/BunutanProvider";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bunutan",
  description: "Draw names, reveal the magic. A playful secret santa / bunutan app.",
};

export const viewport: Viewport = {
  themeColor: "#ff6b6b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className="min-h-dvh antialiased">
        <BunutanProvider>{children}</BunutanProvider>
      </body>
    </html>
  );
}
