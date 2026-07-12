import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Genesis',
  description: 'Deterministic economy and industry simulation',
};

/** Root layout for the Next.js browser shell. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
