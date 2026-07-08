'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)

    // Auto-reload the page on ChunkLoadError to fetch the latest deployment chunks
    const isChunkError = 
      error.name === 'ChunkLoadError' || 
      /Failed to load chunk/i.test(error.message) ||
      /Loading chunk .* failed/i.test(error.message);
      
    if (isChunkError) {
      console.warn("React boundary: ChunkLoadError detected. Reloading page...")
      try {
        const lastReload = sessionStorage.getItem('chunk_load_reload');
        const now = Date.now();
        if (!lastReload || (now - parseInt(lastReload, 10)) > 10000) {
          sessionStorage.setItem('chunk_load_reload', now.toString());
          window.location.reload();
        } else {
          console.error("Repeated ChunkLoadError within 10s. Aborting auto-reload.");
        }
      } catch (err) {
        window.location.reload();
      }
    }
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden text-center">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-destructive/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-warning/5 blur-[120px] pointer-events-none" />

      <div className="z-10 space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-lg">
            <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">System Render Failure</h1>
          <p className="text-sm text-muted-foreground">
            The platform encountered an unexpected exception while computing dependency graph correlation nodes.
          </p>
          {error.message && (
            <div className="mt-4 p-3 rounded-lg bg-muted border border-border text-left font-mono text-xs text-destructive max-h-[120px] overflow-y-auto">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Button onClick={() => reset()} variant="outline" size="lg" className="font-semibold gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button asChild size="lg" className="font-semibold gap-2">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
