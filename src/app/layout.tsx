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
        <div className="flex h-screen bg-gray-900 text-gray-100">
          <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700">
            <h1 className="text-2xl font-bold mb-6 text-green-400">
              <Link href="/">Eidryon</Link>
            </h1>
            <nav>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href} className="mb-2">
                    <Link
                      href={link.href}
                      className="block p-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
