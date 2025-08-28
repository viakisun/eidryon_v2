import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, icon, children }) => {
  return (
    <div className="page-layout">
      <header className="page-layout__header">
        <h1 className="page-layout__title">
          {icon}
          <span>{title}</span>
        </h1>
        <div className="page-layout__actions">
          <Link href="/" className="btn btn--secondary" style={{ padding: '8px 16px', textTransform: 'none' }}>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="page-layout__main">
        {children}
      </main>
    </div>
  );
};
