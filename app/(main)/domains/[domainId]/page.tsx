import { notFound } from 'next/navigation'

import { DomainDetailsPage } from '@/components/domains/DomainDetailsPage'
import { DataBoundary } from '@/components/common/DataSourceError'
import { buildAccountLookup, getAllAccounts } from '@/lib/data/accounts'
import { getDomainById } from '@/lib/data/domains'
import { getNotificationRuleSettings } from '@/lib/data/settings'
import { getAllSites } from '@/lib/data/sites'

export default async function DomainDetailPage({ params }: { params: Promise<{ domainId: string }> }) {
  const { domainId } = await params

  const load = async () => {
    const domain = await getDomainById(domainId)

    if (!domain) {
      notFound()
    }

    const [sites, accounts, rules] = await Promise.all([
      getAllSites(),
      getAllAccounts(),
      getNotificationRuleSettings(),
    ])

    return { domain, sites, accounts, expiryDays: rules.expiryDays }
  }

  return (
    <DataBoundary load={load}>
      {({ domain, sites, accounts, expiryDays }) => (
        <DomainDetailsPage domain={domain} linkSites={sites} accountLookup={buildAccountLookup(accounts)} expiryDays={expiryDays} />
      )}
    </DataBoundary>
  )
}
