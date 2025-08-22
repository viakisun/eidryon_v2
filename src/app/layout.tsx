import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/drone-ops", label: "Drone Ops" },
    { href: "/drone-video", label: "Drone Video" },
    { href: "/live-intelligent-system", label: "Live System" },
    { href: "/mission-ai-planning", label: "AI Planning" },
    { href: "/mission-planning", label: "Mission Planning" },
  ];

  return (
    <html lang="en">
      <body className={geist.className}>
        <main className="bg-gray-900 text-gray-100 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
