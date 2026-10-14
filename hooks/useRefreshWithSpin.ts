'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function useRefreshWithSpin() {
  const router = useRouter()
  const [spinning, startTransition] = useTransition()

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh()
    })
  }, [router])

  return { spinning, refresh }
}
