import type { Metadata } from 'next';
import Script from 'next/script';
import { ApplicationShell } from '@/presentation/shell/ApplicationShell';
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
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script id="pg-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('pg-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();`}
        </Script>
      </head>
      <body>
        <ApplicationShell>{children}</ApplicationShell>
      </body>
    </html>
  );
}
