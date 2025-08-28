import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/main.scss";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Drone Command Platform",
  description: "Redefining Drone Command & Control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
