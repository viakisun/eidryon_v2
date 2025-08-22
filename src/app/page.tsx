import Link from "next/link";

export default function Home() {
  const navLinks = [
    { href: "/drone-ops", label: "Drone Ops" },
    { href: "/drone-video", label: "Drone Video" },
    { href: "/live-intelligent-system", label: "Live System" },
    { href: "/mission-ai-planning", label: "AI Planning" },
    { href: "/mission-planning", label: "Mission Planning" },
  ];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Eidryon Dashboards</h1>
        <p className="text-lg text-gray-400 mb-8">
          Select a dashboard from the list below to get started.
        </p>
        <ul className="space-y-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-2xl text-blue-400 hover:text-blue-300 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
