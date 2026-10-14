import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const ROW_COUNT = 8
const PAGINATION_COUNT = 7

export default function JobRunsLoading() {
  return (
    <div className="flex h-[calc(100dvh-3.5rem-2rem)] flex-col gap-6 md:h-[calc(100dvh-3.5rem-3rem)]">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index} className="gap-2 p-4">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-10" />
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Skeleton className="h-8 w-[9.5rem] rounded-md" />
          <Skeleton className="h-8 w-[9.5rem] rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>

      {/* Desktop: Table */}
      <div className="hidden min-h-0 flex-1 md:flex md:flex-col">
        <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
          <div className="min-h-0 flex-1 [&>[data-slot=table-container]]:h-full [&>[data-slot=table-container]]:min-h-0 [&>[data-slot=table-container]]:overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 z-30 bg-card hover:bg-card">
                  <TableHead className="min-w-[156px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[160px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[140px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[96px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[280px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[260px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: ROW_COUNT }, (_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-14 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-52" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-44" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="shrink-0 border-t px-6 py-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {Array.from({ length: PAGINATION_COUNT }, (_, index) => (
                  <Skeleton key={index} className="size-9" />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile: Cards */}
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
          <div className="min-h-0 flex-1 overflow-auto p-3">
            <div className="space-y-3">
              {Array.from({ length: ROW_COUNT }, (_, index) => (
                <div key={index} className="rounded-lg border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full max-w-[18rem]" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 border-t px-4 py-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
