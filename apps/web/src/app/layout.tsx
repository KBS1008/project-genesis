import type { Metadata } from 'next';
import Script from 'next/script';
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
        <Script id="pg-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('pg-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
