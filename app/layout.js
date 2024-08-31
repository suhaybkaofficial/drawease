import { Inter } from "next/font/google";
import "./globals.css";
import { DrawingsProvider } from "@/contexts/DrawingsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DrawEase - Create and Share Your Drawings",
  description: "DrawEase is a web application that allows users to create, save, and share digital drawings with ease.",
  keywords: "drawing, digital art, online canvas, creativity",
  openGraph: {
    title: "DrawEase - Create and Share Your Drawings",
    description: "Create, save, and share digital drawings with ease using DrawEase.",
    url: "https://draweaseapp.com",
    siteName: "DrawEase",
    images: [
      {
        url: "https://draweaseapp.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DrawEase - Create and Share Your Drawings",
    description: "Create, save, and share digital drawings with ease using DrawEase.",
    images: ["https://draweaseapp.com/twitter-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <DrawingsProvider>
        <body className={inter.className}>{children}</body>
      </DrawingsProvider>
    </html>
  );
}
