import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import AuthProvider from "./_components/AuthProvider";
import ToastProvider from "./_components/ToastProvider";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATOM",
  description: "Share images with people all over the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>
        <ToastProvider>
          <AuthProvider>{children} </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
