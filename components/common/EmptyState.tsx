import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  footer?: ReactNode
  fillHeight?: boolean
  className?: string
}

export function EmptyState({ icon, title, description, action, footer, fillHeight = false, className }: EmptyStateProps) {
  const innerContent = (
    <div className="flex flex-col items-center gap-3.5 py-8 text-center max-w-sm mx-auto">
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-2xl border border-border/80 bg-muted/40 text-muted-foreground shadow-xs">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <div className="text-base font-semibold text-foreground tracking-tight">{title}</div>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  )

  if (!fillHeight && !footer && !className) {
    return (
      <Card>
        <CardContent>
          {innerContent}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(fillHeight && 'flex min-h-0 flex-1 flex-col gap-0 overflow-hidden py-0', className)}>
      <div className={cn('flex flex-col items-center justify-center p-6 text-center', fillHeight && 'flex-1')}>
        {innerContent}
      </div>
      {footer ? (
        <div className="shrink-0 border-t px-6 py-3">
          {footer}
        </div>
      ) : null}
    </Card>
  )
}
