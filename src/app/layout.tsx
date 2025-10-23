import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/ClientLayout'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Assignment 1 – Tabs Builder',
  description: 'Frontend-only assignment with dynamic tabs and HTML generator',
}


const themeScript = `
(function() {
  try {
    var theme = (document.cookie.match(/(?:^|; )a1_theme=([^;]+)/)||[])[1];
    theme = theme ? decodeURIComponent(theme) : '';
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
