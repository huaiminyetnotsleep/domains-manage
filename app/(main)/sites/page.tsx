import { SitesPageClient } from '@/components/sites/SitesPageClient'
import { DataBoundary } from '@/components/common/DataSourceError'
import { getSites, getFavoriteSites } from '@/lib/data/sites'

export default function SitesPage() {
  const load = async () => {
    const [result, favorites] = await Promise.all([
      getSites({
        keyword: '',
        category: 'all',
        isActive: 'all',
        page: 1,
        pageSize: 100,
      }),
      getFavoriteSites(),
    ])

    return { result, favorites }
  }

  return (
    <DataBoundary load={load}>
      {({ result, favorites }) => (
        <SitesPageClient initialSites={result.items} total={result.total} initialFavorites={favorites} />
      )}
    </DataBoundary>
  )
}
