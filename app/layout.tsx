
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHAURYA VISUALS | Creative Studio",
  description:
    "Premium Video Editing, Reels, YouTube Videos and Creative Visual Services.",
  keywords: [
    "Shaurya Visuals",
    "Video Editing",
    "Creative Studio",
    "Reels Editing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
