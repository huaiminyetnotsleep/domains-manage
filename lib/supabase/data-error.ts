import { isSupabaseConfigured } from '@/lib/supabase/config'

/**
 * Supabase 数据加载错误：统一标识错误来源并保留底层原始报错，
 * 让页面上能直接看出「是 Supabase 出了问题」以及具体原因。
 */
export class SupabaseDataError extends Error {
  readonly source = 'Supabase'
  readonly resource: string
  readonly detail: string

  constructor(resource: string, detail: string, options?: { cause?: unknown }) {
    super(`[Supabase] ${resource}加载失败：${detail}`, options)
    this.name = 'SupabaseDataError'
    this.resource = resource
    this.detail = detail
  }
}

export function isSupabaseDataError(error: unknown): error is SupabaseDataError {
  if (error instanceof SupabaseDataError) return true
  return typeof error === 'object' && error !== null && (error as { name?: unknown }).name === 'SupabaseDataError'
}

function toDetail(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return String(error)
}

/**
 * 把底层错误包装成带来源标识的 SupabaseDataError；
 * 原始报错完整保留在 detail 中，同时落到服务端日志便于排查。
 */
export function toSupabaseDataError(resource: string, error: unknown): SupabaseDataError {
  console.error(`[Supabase] ${resource}加载失败`, error)
  if (isSupabaseDataError(error)) return error
  return new SupabaseDataError(resource, toDetail(error), { cause: error })
}

/**
 * Supabase 未配置时的统一入口：
 * 生产环境直接抛错（线上不允许悄悄回退 mock 数据），开发环境返回 false 保留 mock 演示模式。
 */
export function requireSupabaseConfigured(): boolean {
  if (isSupabaseConfigured()) return true

  if (process.env.NODE_ENV === 'production') {
    throw new SupabaseDataError(
      '环境变量',
      'Supabase 未配置：缺少 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY。请在部署平台配置环境变量后重新部署（NEXT_PUBLIC_* 在构建时内联，必须重新部署才能生效）。',
    )
  }

  return false
}
