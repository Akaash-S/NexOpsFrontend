'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageContent, PageHeader } from '@/components/layout'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    // Seamlessly redirect /profile to the unified Account & Settings hub
    router.replace('/settings?tab=account')
  }, [router])

  return (
    <PageContent>
      <PageHeader
        title="Redirecting to Account & Settings..."
        description="Consolidating your profile and system preferences into a single unified settings hub"
      />
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Navigating to Settings & Account hub...</p>
      </div>
    </PageContent>
  )
}
