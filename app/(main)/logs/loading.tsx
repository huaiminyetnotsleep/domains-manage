import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const ROW_COUNT = 8
const PAGINATION_COUNT = 7

export default function LogsLoading() {
  return (
    <div className="flex h-[calc(100dvh-3.5rem-2rem)] flex-col gap-6 md:h-[calc(100dvh-3.5rem-3rem)]">
      <Card className="gap-3 py-4">
        <div className="flex flex-col gap-3 px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-10 w-[10rem]" />
            <Skeleton className="h-10 w-[10rem]" />
            <div className="ml-auto">
              <Skeleton className="size-10 rounded-md" />
            </div>
          </div>
        </div>
      </Card>

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
                  <TableHead className="min-w-[96px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[96px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[320px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[112px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[160px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                  <TableHead className="min-w-[140px]">
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
                      <Skeleton className="h-6 w-14 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-64" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
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
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full max-w-[16rem]" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
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
