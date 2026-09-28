import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FieldMind — The AI Memory for Every Machine',
  description: 'Persistent industrial maintenance memory platform for physical machines powered by Hindsight AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
