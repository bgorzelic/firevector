import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Firevector — Wildfire Observation Intelligence',
  description:
    'A wildfire observation and fire behavior calculation tool for Cal OES and the firefighting community.',
  keywords: ['wildfire', 'fire behavior', 'Cal OES', 'NWCG', 'fire observation'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
