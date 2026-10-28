import { AlertTriangle, Database } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { isSupabaseDataError, type SupabaseDataError } from '@/lib/supabase/data-error'

/**
 * 数据加载边界：SupabaseDataError 渲染为页面内的错误面板（生产环境也能看到来源与详情），
 * 其他异常原样抛出，继续走全局 error boundary。
 */
export async function DataBoundary<T>({ load, children }: { load: () => Promise<T>; children: (data: T) => ReactNode }) {
  const outcome = await load()
    .then((data) => ({ ok: true as const, data }))
    .catch((error: unknown) => {
      if (!isSupabaseDataError(error)) throw error
      return { ok: false as const, data: null as T, error }
    })

  if (!outcome.ok) {
    return <DataSourceError resource={outcome.error.resource} detail={outcome.error.detail} />
  }

  return <>{children(outcome.data)}</>
}

type DataSourceErrorProps = {
  resource: string
  detail: string
  source?: string
}

/**
 * 数据源加载失败面板：直接渲染在页面内容区（不走 error boundary），
 * 这样生产环境也能看到错误来源与完整报错，不会被 Next.js 的错误信息脱敏吞掉。
 */
export function DataSourceError({ resource, detail, source = 'Supabase' }: DataSourceErrorProps) {
  const hints = diagnoseHints(detail)

  return (
    <Card className="border-destructive/30">
      <CardContent className="space-y-4 py-8">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3.5 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1">
            <div className="text-base font-semibold tracking-tight text-foreground">{resource}加载失败</div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              页面数据来自外部数据源，当前无法读取。数据本身不会丢失，修复数据源后刷新页面即可恢复。
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Database className="size-3.5" />
            错误来源：{source}
          </div>
        </div>

        <div className="mx-auto max-w-xl space-y-3">
          <div>
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">详细报错信息</div>
            <pre className="overflow-x-auto rounded-xl border bg-muted/30 px-3.5 py-2.5 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap break-all">
              {detail || '未知错误'}
            </pre>
          </div>
          {hints.length > 0 ? (
            <div className="space-y-1.5 rounded-xl border border-border bg-muted/20 px-3.5 py-3 text-left">
              <div className="text-xs font-medium text-muted-foreground">可能的原因</div>
              <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                {hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground">完整错误堆栈已记录在服务端日志中，可对照部署平台的函数日志进一步排查。</p>
        </div>
      </CardContent>
    </Card>
  )
}

function diagnoseHints(detail: string): string[] {
  const hints: string[] = []

  if (detail.includes('fetch failed') || detail.includes('ENOTFOUND') || detail.includes('ECONNREFUSED') || detail.includes('timed out')) {
    hints.push('无法连接 Supabase：检查项目是否被暂停（免费版闲置一周会自动暂停）、Supabase URL 是否正确、网络是否可达。')
  }
  if (detail.includes('SUPABASE_SERVICE_ROLE_KEY') || detail.includes('管理员环境变量')) {
    hints.push('缺少 SUPABASE_SERVICE_ROLE_KEY：在部署平台配置服务角色密钥后重新部署。')
  }
  if (detail.includes('Supabase 未配置') || detail.includes('NEXT_PUBLIC_SUPABASE')) {
    hints.push('NEXT_PUBLIC_* 环境变量在构建时内联，修改后必须重新部署才能生效。')
  }
  if (/Invalid API key|JWT|401|403|Unauthorized|Forbidden/i.test(detail)) {
    hints.push('密钥无效或不匹配：核对部署平台配置的 anon key / service role key 是否属于当前 Supabase 项目。')
  }
  if (/does not exist|relation|column|schema/i.test(detail)) {
    hints.push('数据库表或字段不存在：确认已在 Supabase 执行 supabase/migrations 目录下的全部迁移。')
  }

  return hints
}
