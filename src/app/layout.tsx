import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIChatbot from "@/components/AIChatbot"; // Import Chatbot
import CartSidebar from "@/components/CartSidebar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUXE | Premium E-Commerce",
  description: "Redefine your style with LUXE.",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <AIChatbot />
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
