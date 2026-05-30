import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to NexOps</h1>
        <p className="text-muted-foreground mb-8">Redirecting to dashboard...</p>
        <Link href="/dashboard" className="text-primary hover:underline">
          Click here if not redirected automatically
        </Link>
        <script>{`window.location.href = '/dashboard'`}</script>
      </div>
    </div>
  )
}
