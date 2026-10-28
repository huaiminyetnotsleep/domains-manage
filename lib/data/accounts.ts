import { unstable_cache } from 'next/cache'

import { mapAccount, normalizeAccountIdentifier, normalizeAccountSites } from '@/lib/mappers/account'
import { mockAccounts } from '@/lib/mock/accounts'
import { mockSites } from '@/lib/mock/sites'
import { isEmail } from '@/schemas/accountSchemas'
import { requireSupabaseConfigured, toSupabaseDataError } from '@/lib/supabase/data-error'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { formatISO } from 'date-fns'
import type { Account, AccountFormValues, AccountListQuery, AccountRow, PaginatedAccounts, SiteEntry } from '@/types/account'

export type AccountLookup = {
  nonEmailAccountIds: Set<string>
  accountEmailsById: Map<string, string>
  accountIdentifierById: Map<string, string>
}

export function buildAccountLookup(accounts: Account[]): AccountLookup {
  const nonEmailAccountIds = new Set<string>()
  const accountEmailsById = new Map<string, string>()
  const accountIdentifierById = new Map<string, string>()

  for (const a of accounts) {
    accountIdentifierById.set(a.id, a.identifier)
    if (!isEmail(a.identifier)) {
      nonEmailAccountIds.add(a.id)
      if (a.email) accountEmailsById.set(a.id, a.email)
    }
  }

  return { nonEmailAccountIds, accountEmailsById, accountIdentifierById }
}

export function resolveAccountDisplay(accountId: string | null, lookup: AccountLookup) {
  if (!accountId) return { name: '未设置', highlight: false, tooltip: undefined }
  const { nonEmailAccountIds, accountEmailsById, accountIdentifierById } = lookup
  const name = accountIdentifierById.get(accountId) ?? '未知账号'
  const highlight = nonEmailAccountIds.has(accountId)
  const email = accountEmailsById.get(accountId)
  const tooltip = email ? `绑定邮箱：${email}` : undefined
  return { name, highlight, tooltip }
}

export async function getActiveAccounts() {
  if (!requireSupabaseConfigured()) {
    return mockAccounts.filter((account) => account.isActive)
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('is_active', true)
      .order('identifier', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => mapAccount(row as AccountRow))
  } catch (error) {
    throw toSupabaseDataError('账号列表', error)
  }
}

// 账号全量数据用于筛选下拉和详情页，走 tag 缓存；账号增删改时通过 revalidateTag('accounts') 失效
const getAllAccountsCached = unstable_cache(
  async () => {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('identifier', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => mapAccount(row as AccountRow))
  },
  ['all-accounts'],
  { tags: ['accounts'], revalidate: 300 },
)

export async function getAllAccounts() {
  if (!requireSupabaseConfigured()) {
    return mockAccounts
  }

  try {
    return await getAllAccountsCached()
  } catch (error) {
    throw toSupabaseDataError('账号列表', error)
  }
}

export async function getAccountsByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))]
  if (uniqueIds.length === 0) {
    return []
  }

  if (!requireSupabaseConfigured()) {
    return mockAccounts.filter((account) => uniqueIds.includes(account.id))
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .in('id', uniqueIds)

    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => mapAccount(row as AccountRow))
  } catch (error) {
    throw toSupabaseDataError('账号列表', error)
  }
}

export async function getAccounts(query: AccountListQuery): Promise<PaginatedAccounts> {
  if (!requireSupabaseConfigured()) {
    return paginateAccounts(filterMockAccounts(query), query)
  }

  try {
    const supabase = createSupabaseAdminClient()
    let builder = supabase
      .from('accounts')
      .select('*', { count: 'exact' })
      .order('identifier', { ascending: true })

    const keyword = query.keyword.trim().toLowerCase()

    if (keyword) {
      builder = builder.or(`identifier.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    }

    if (query.emailProvider !== 'all') {
      builder = builder.eq('email_provider', query.emailProvider)
    }

    if (query.site !== 'all') {
      builder = builder.contains('sites', [{ site: query.site }])
    }

    if (query.isActive !== 'all') {
      builder = builder.eq('is_active', query.isActive)
    }

    const from = (query.page - 1) * query.pageSize
    const to = from + query.pageSize - 1

    const { data, error, count } = await builder.range(from, to)
    if (error) throw new Error(error.message)

    const items = (data ?? []).map((row) => mapAccount(row as AccountRow))
    const total = count ?? 0

    return {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    }
  } catch (error) {
    throw toSupabaseDataError('账号列表', error)
  }
}

export async function getAccountById(id: string): Promise<Account | null> {
  if (!requireSupabaseConfigured()) {
    return mockAccounts.find((account) => account.id === id) ?? null
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) return null

    return mapAccount(data as AccountRow)
  } catch (error) {
    throw toSupabaseDataError('账号详情', error)
  }
}

export async function createAccount(values: AccountFormValues) {
  const supabase = createSupabaseAdminClient()
  const identifier = normalizeAccountIdentifier(values.identifier)

  await assertUniqueIdentifier(supabase, identifier)

  const { data, error } = await supabase
    .from('accounts')
    .insert({
      identifier,
      email: values.email.trim(),
      email_provider: values.emailProvider,
      email_provider_detail: values.emailProviderDetail.trim(),
      sites: values.sites,
      password_hint: values.passwordHint.trim(),
      vault_location: values.vaultLocation.trim(),
      description: values.description.trim(),
      is_active: values.isActive,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return mapAccount(data as AccountRow)
}

export async function updateAccount(id: string, values: AccountFormValues) {
  const supabase = createSupabaseAdminClient()
  const identifier = normalizeAccountIdentifier(values.identifier)

  await assertUniqueIdentifier(supabase, identifier, id)

  const { error } = await supabase
    .from('accounts')
    .update({
      identifier,
      email: values.email.trim(),
      email_provider: values.emailProvider,
      email_provider_detail: values.emailProviderDetail.trim(),
      sites: values.sites,
      password_hint: values.passwordHint.trim(),
      vault_location: values.vaultLocation.trim(),
      description: values.description.trim(),
      is_active: values.isActive,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteAccount(id: string) {
  const supabase = createSupabaseAdminClient()
  const { count, error: countError } = await supabase
    .from('domains')
    .select('*', { count: 'exact', head: true })
    .or(`registrar_account_id.eq.${id},dns_account_id.eq.${id}`)

  if (countError) throw new Error(countError.message)
  if ((count ?? 0) > 0) throw new Error('该账号已被域名使用，请先停用或解除关联后再删除')

  const { error } = await supabase.from('accounts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function toggleAccountActive(id: string, isActive: boolean) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('accounts')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function updateAccountSites(id: string, sites: SiteEntry[]) {
  const supabase = createSupabaseAdminClient()
  await updateAccountSitesWithClient(supabase, id, sites)
}

export async function ensureAccountSiteRelations(relations: { accountId: string; siteId: string }[]) {
  const validRelations = relations.filter((relation) => relation.accountId.length > 0 && relation.siteId.length > 0)
  if (validRelations.length === 0) return

  const supabase = createSupabaseAdminClient()
  const accountIds = [...new Set(validRelations.map((relation) => relation.accountId))]
  const siteIds = [...new Set(validRelations.map((relation) => relation.siteId))]
  const [accountsResult, sitesResult] = await Promise.all([
    supabase.from('accounts').select('id, sites').in('id', accountIds),
    supabase.from('sites').select('id, name').in('id', siteIds),
  ])

  if (accountsResult.error) throw new Error(accountsResult.error.message)
  if (sitesResult.error) throw new Error(sitesResult.error.message)

  const accountsById = new Map((accountsResult.data ?? []).map((row) => [
    row.id,
    normalizeAccountSites(row.sites),
  ]))
  const siteNamesById = new Map((sitesResult.data ?? []).map((site) => [site.id, site.name]))
  const siteIdsByAccountId = new Map<string, Set<string>>()

  for (const relation of validRelations) {
    const ids = siteIdsByAccountId.get(relation.accountId) ?? new Set<string>()
    ids.add(relation.siteId)
    siteIdsByAccountId.set(relation.accountId, ids)
  }

  await Promise.all([...siteIdsByAccountId].map(async ([accountId, relatedSiteIds]) => {
    const sites = accountsById.get(accountId)
    if (!sites) return

    const nextSites = mergeAccountSites(sites, relatedSiteIds, siteNamesById)
    if (nextSites === sites) return
    await updateAccountSitesWithClient(supabase, accountId, nextSites)
  }))
}

function mergeAccountSites(existingSites: SiteEntry[], siteIds: Iterable<string>, siteNamesById: Map<string, string>) {
  let nextSites = existingSites
  let changed = false

  for (const siteId of siteIds) {
    const siteName = siteNamesById.get(siteId)
    const matches = nextSites
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => entry.site === siteId || (siteName !== undefined && entry.site === siteName))

    if (matches.length === 1 && matches[0].entry.site === siteId) {
      continue
    }

    if (matches.length === 0) {
      nextSites = [...nextSites, { site: siteId, note: '', isActive: true }]
      changed = true
      continue
    }

    const prioritizedMatches = [...matches].sort((left, right) => {
      const leftPriority = left.entry.site === siteId ? 0 : 1
      const rightPriority = right.entry.site === siteId ? 0 : 1
      return leftPriority - rightPriority || left.index - right.index
    })
    const firstMatch = prioritizedMatches[0]
    const mergedEntry: SiteEntry = {
      site: siteId,
      note: prioritizedMatches.find(({ entry }) => entry.note.length > 0)?.entry.note ?? '',
      isActive: !prioritizedMatches.some(({ entry }) => entry.isActive === false),
    }

    nextSites = nextSites.flatMap((entry, index) => {
      if (index === firstMatch.index) {
        return [mergedEntry]
      }

      return prioritizedMatches.some((match) => match.index === index) ? [] : [entry]
    })
    changed = true
  }

  return changed ? nextSites : existingSites
}

export type UsedSite = {
  id: string
  name: string
}

// 已用站点列表依赖 accounts.sites 和 sites 表名，两个 tag 任一变更都失效
const getUsedSitesCached = unstable_cache(
  async (): Promise<UsedSite[]> => {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('accounts')
      .select('sites')

    if (error) throw new Error(error.message)

    const siteIds = [...new Set((data ?? []).flatMap((row) => normalizeAccountSites(row.sites).map((entry) => entry.site)))].sort()

    if (siteIds.length === 0) return []

    const sitesResult = await supabase
      .from('sites')
      .select('id, name')
      .in('id', siteIds)

    if (sitesResult.error) throw new Error(sitesResult.error.message)

    const siteNamesById = new Map((sitesResult.data ?? []).map((site) => [site.id, site.name]))
    return siteIds.map((id) => ({ id, name: siteNamesById.get(id) ?? id }))
  },
  ['used-sites'],
  { tags: ['accounts', 'sites'], revalidate: 300 },
)

export async function getUsedSites(): Promise<UsedSite[]> {
  const extract = (accounts: Account[]) => {
    const siteNamesById = new Map(mockSites.map((site) => [site.id, site.name]))
    return [...new Set(accounts.flatMap((a) => a.sites.map((e) => e.site)))].sort().map((id) => ({ id, name: siteNamesById.get(id) ?? id }))
  }

  if (!requireSupabaseConfigured()) {
    return extract(mockAccounts)
  }

  try {
    return await getUsedSitesCached()
  } catch (error) {
    throw toSupabaseDataError('已用站点', error)
  }
}

async function updateAccountSitesWithClient(supabase: ReturnType<typeof createSupabaseAdminClient>, id: string, sites: SiteEntry[]) {
  const { error } = await supabase
    .from('accounts')
    .update({ sites, updated_at: formatISO(new Date()) })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

async function assertUniqueIdentifier(supabase: ReturnType<typeof createSupabaseAdminClient>, identifier: string, excludeId?: string) {
  let builder = supabase
    .from('accounts')
    .select('id')
    .eq('identifier', identifier)
    .limit(1)

  if (excludeId) {
    builder = builder.neq('id', excludeId)
  }

  const { data, error } = await builder
  if (error) throw new Error(error.message)
  if (data && data.length > 0) throw new Error('该账号标识已存在')
}

function filterMockAccounts(query: AccountListQuery): Account[] {
  const keyword = query.keyword.trim().toLowerCase()

  return mockAccounts.filter((account) => {
    const matchesKeyword = !keyword || [account.identifier, account.description].some((value) => value.toLowerCase().includes(keyword))
    const matchesProvider = query.emailProvider === 'all' || account.emailProvider === query.emailProvider
    const matchesSite = query.site === 'all' || account.sites.some((e) => e.site === query.site)
    const matchesActive = query.isActive === 'all' || account.isActive === query.isActive
    return matchesKeyword && matchesProvider && matchesSite && matchesActive
  })
}

function paginateAccounts(accounts: Account[], query: AccountListQuery): PaginatedAccounts {
  const total = accounts.length
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize))
  const currentPage = Math.min(query.page, totalPages)
  const from = (currentPage - 1) * query.pageSize
  const items = accounts.slice(from, from + query.pageSize)

  return {
    items,
    total,
    page: currentPage,
    pageSize: query.pageSize,
    totalPages,
  }
}
