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
  title: 'NexOps - Engineering Intelligence Platform',
  description: 'Engineering intelligence platform to understand what changed, what is impacted, what is unhealthy, why failures occurred, and what actions should be taken next.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
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
