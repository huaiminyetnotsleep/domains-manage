import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const STAT_COUNT = 4
const RISK_COUNT = 5
const CHART_COUNT = 2

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[7.5rem]" />
          <Skeleton className="h-9 w-[7.5rem]" />
          <Skeleton className="h-9 w-[7.5rem]" />
        </div>
        <Skeleton className="size-9 rounded-md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: STAT_COUNT }, (_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            {Array.from({ length: RISK_COUNT }, (_, index) => (
              <div key={index} className="rounded-2xl border p-4 space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: CHART_COUNT }, (_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
