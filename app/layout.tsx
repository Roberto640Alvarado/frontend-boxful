import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import InterceptorProvider from "@/lib/InterceptorProvider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "boxful",
  description: "Plataforma de envíos Boxful",
  icons: {
    icon: "/boxful.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="">
        <InterceptorProvider>
          <AuthProvider>{children}</AuthProvider>
        </InterceptorProvider>
      </body>
    </html>
  );
}