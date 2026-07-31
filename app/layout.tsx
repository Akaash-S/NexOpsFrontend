import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AppStateProvider } from '@/lib/hooks/use-app-state'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://nexops-frontend.vercel.app'),
  title: 'NexOps — Incident Correlation Engine',
  description: "What caused this incident, and how do we know? NexOps reads your deploys and alerts, ranks the likely cause, and shows its reasoning — so you're not guessing at 2 a.m.",
  generator: 'v0.app',
  openGraph: {
    title: 'NexOps — Incident Correlation Engine',
    description: "What caused this incident, and how do we know? NexOps reads your deploys and alerts, ranks the likely cause, and shows its reasoning — so you're not guessing at 2 a.m.",
    url: 'https://nexops-frontend.vercel.app',
    siteName: 'NexOps',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'NexOps Incident Correlation Engine',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="build-version" content={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || "63e1ae3"} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var handleChunkError = function(source) {
                  console.warn("ChunkLoadError detected via " + source + ". Reloading page...");
                  try {
                    var lastReload = sessionStorage.getItem('chunk_load_reload');
                    var now = Date.now();
                    if (!lastReload || (now - parseInt(lastReload, 10)) > 10000) {
                      sessionStorage.setItem('chunk_load_reload', now.toString());
                      window.location.reload();
                    } else {
                      console.error("Repeated ChunkLoadError within 10s. Aborting auto-reload.");
                    }
                  } catch (err) {
                    window.location.reload();
                  }
                };

                window.addEventListener('error', function(e) {
                  var target = e.target;
                  if (target && target.tagName === 'SCRIPT') {
                    var src = target.src || '';
                    if (src.indexOf('/_next/') > -1) {
                      handleChunkError('script error');
                    }
                  }
                }, true);

                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e.reason;
                  if (reason) {
                    var isChunkError = reason.name === 'ChunkLoadError' || 
                                       (reason.message && (
                                         reason.message.indexOf('chunk') > -1 ||
                                         reason.message.indexOf('Loading chunk') > -1 ||
                                         reason.message.indexOf('Failed to load chunk') > -1
                                       ));
                    if (isChunkError) {
                      handleChunkError('unhandled rejection');
                    }
                  }
                });
              })();
            `
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geist.className} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppStateProvider>
            <AppShell>
              {children}
            </AppShell>
          </AppStateProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
