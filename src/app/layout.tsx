import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eidryon Dashboards",
  description: "Advanced operational dashboards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <main className="bg-gray-900 text-gray-100 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
