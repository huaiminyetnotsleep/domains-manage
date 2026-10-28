import { notFound } from 'next/navigation'

import { AccountDetailsPage } from '@/components/accounts/AccountDetailsPage'
import { DataBoundary } from '@/components/common/DataSourceError'
import { getAccountById, getAllAccounts } from '@/lib/data/accounts'
import { getActiveSites } from '@/lib/data/sites'
import { isEmail } from '@/schemas/accountSchemas'

export default async function AccountDetailsRoute({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params

  const load = async () => {
    const [account, sites, allAccounts] = await Promise.all([
      getAccountById(accountId),
      getActiveSites(),
      getAllAccounts(),
    ])

    if (!account) {
      notFound()
    }

    return { account, sites, allAccounts }
  }

  return (
    <DataBoundary load={load}>
      {({ account, sites, allAccounts }) => (
        <AccountDetailsPage
          account={account}
          sites={sites}
          emailIdentifiers={allAccounts.filter((a) => isEmail(a.identifier)).map((a) => a.identifier)}
        />
      )}
    </DataBoundary>
  )
}
