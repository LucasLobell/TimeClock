import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "a",
  description: "a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
    <body className="bg-[#1a1a1a] vsc-initialized">
      {children}
    </body>
    </html>
  );
}
