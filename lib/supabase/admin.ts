import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null = null

export function createSupabaseAdminClient() {
  if (adminClient) return adminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量（Supabase 服务端管理客户端无法创建）。')
  }

  adminClient = createClient(url, key)
  return adminClient
}
