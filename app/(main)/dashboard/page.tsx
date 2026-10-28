import { DashboardPageClient } from '@/components/dashboard/DashboardPageClient'
import { DataBoundary } from '@/components/common/DataSourceError'
import { getDashboardData } from '@/lib/data/dashboard'

export default function DashboardPage() {
  return (
    <DataBoundary load={() => getDashboardData()}>
      {(data) => (
        <DashboardPageClient
          statistics={data.statistics}
          statusDistribution={data.statusDistribution}
          freePaidDistribution={data.freePaidDistribution}
          registrarDistribution={data.registrarDistribution}
          dnsProviderDistribution={data.dnsProviderDistribution}
          suffixDistribution={data.suffixDistribution}
          expiry30={data.expiry30}
          createdTrend={data.createdTrend}
          upcomingRisk={data.upcomingRisk}
          accountStatistics={data.accountStatistics}
          accountProviderDistribution={data.accountProviderDistribution}
          accountSiteDistribution={data.accountSiteDistribution}
          accountReuseDistribution={data.accountReuseDistribution}
          accountRisks={data.accountRisks}
          siteStatistics={data.siteStatistics}
          siteAccountCountDistribution={data.siteAccountCountDistribution}
        />
      )}
    </DataBoundary>
  )
}
