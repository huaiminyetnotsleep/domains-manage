'use client'

import { Activity, CalendarClock, CircleAlert, Globe, Server, ServerCog, ServerOff, Tags, User, UserCheck, UserX, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

import { Card, CardContent } from '@/components/ui/card'

type DomainStatistics = {
  total: number
  expiring: number
  expired: number
  newThisWeek: number
}

type AccountStatistics = {
  total: number
  active: number
  inactive: number
  newThisWeek: number
}

const domainItems = [
  { key: 'total', label: '总域名数', valueClassName: 'text-foreground', iconClassName: 'text-foreground', toneClassName: 'bg-muted/70 text-foreground border-border/80', icon: Globe },
  { key: 'expiring', label: '即将到期', valueClassName: 'text-warning-foreground dark:text-warning', iconClassName: 'text-warning-foreground dark:text-warning', toneClassName: 'bg-warning-muted text-warning-foreground border-warning/25 dark:text-warning', icon: CalendarClock },
  { key: 'expired', label: '已过期', valueClassName: 'text-destructive', iconClassName: 'text-destructive', toneClassName: 'bg-destructive/10 text-destructive border-destructive/20', icon: CircleAlert },
  { key: 'newThisWeek', label: '本周新增', valueClassName: 'text-foreground', iconClassName: 'text-accent-brand', toneClassName: 'bg-accent-brand-muted text-accent-brand border-accent-brand/25', icon: Activity },
] as const

const accountItems = [
  { key: 'total', label: '总账户数', valueClassName: 'text-foreground', iconClassName: 'text-foreground', toneClassName: 'bg-muted/70 text-foreground border-border/80', icon: User },
  { key: 'active', label: '启用账户', valueClassName: 'text-success dark:text-success', iconClassName: 'text-success dark:text-success', toneClassName: 'bg-success-muted text-success border-success/25 dark:text-success', icon: UserCheck },
  { key: 'inactive', label: '停用账户', valueClassName: 'text-muted-foreground', iconClassName: 'text-muted-foreground', toneClassName: 'bg-muted/60 text-muted-foreground border-border/60', icon: UserX },
  { key: 'newThisWeek', label: '本周新增', valueClassName: 'text-foreground', iconClassName: 'text-accent-brand', toneClassName: 'bg-accent-brand-muted text-accent-brand border-accent-brand/25', icon: UserPlus },
] as const

export function DomainStatsCards({ statistics }: { statistics: DomainStatistics }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      {domainItems.map((item, index) => {
        const Icon = item.icon

        return (
          <motion.div key={item.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-muted-foreground text-sm font-medium">{item.label}</div>
                    <div className={`mt-3 text-2xl font-semibold tracking-tight md:text-3xl ${item.valueClassName}`}>{statistics[item.key]}</div>
                  </div>
                  <div className={`${item.toneClassName} flex h-11 w-11 items-center justify-center rounded-2xl border shadow-xs`}>
                    <Icon size={20} className={item.iconClassName} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export function AccountStatsCards({ statistics }: { statistics: AccountStatistics }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      {accountItems.map((item, index) => {
        const Icon = item.icon

        return (
          <motion.div key={item.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-muted-foreground text-sm font-medium">{item.label}</div>
                    <div className={`mt-3 text-2xl font-semibold tracking-tight md:text-3xl ${item.valueClassName}`}>{statistics[item.key]}</div>
                  </div>
                  <div className={`${item.toneClassName} flex h-11 w-11 items-center justify-center rounded-2xl border shadow-xs`}>
                    <Icon size={20} className={item.iconClassName} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

type SiteStatistics = {
  total: number
  active: number
  inactive: number
  categories: number
}

const siteItems = [
  { key: 'total', label: '总站点数', valueClassName: 'text-foreground', iconClassName: 'text-foreground', toneClassName: 'bg-muted/70 text-foreground border-border/80', icon: Server },
  { key: 'active', label: '启用站点', valueClassName: 'text-success dark:text-success', iconClassName: 'text-success dark:text-success', toneClassName: 'bg-success-muted text-success border-success/25 dark:text-success', icon: ServerCog },
  { key: 'inactive', label: '停用站点', valueClassName: 'text-muted-foreground', iconClassName: 'text-muted-foreground', toneClassName: 'bg-muted/60 text-muted-foreground border-border/60', icon: ServerOff },
  { key: 'categories', label: '站点分类', valueClassName: 'text-accent-brand', iconClassName: 'text-accent-brand', toneClassName: 'bg-accent-brand-muted text-accent-brand border-accent-brand/25', icon: Tags },
] as const

export function SiteStatsCards({ statistics }: { statistics: SiteStatistics }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      {siteItems.map((item, index) => {
        const Icon = item.icon

        return (
          <motion.div key={item.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-muted-foreground text-sm font-medium">{item.label}</div>
                    <div className={`mt-3 text-2xl font-semibold tracking-tight md:text-3xl ${item.valueClassName}`}>{statistics[item.key]}</div>
                  </div>
                  <div className={`${item.toneClassName} flex h-11 w-11 items-center justify-center rounded-2xl border shadow-xs`}>
                    <Icon size={20} className={item.iconClassName} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// 兼容旧版导出
type StatsCardsProps = {
  statistics: DomainStatistics
  accountStatistics?: AccountStatistics
}

export function StatsCards({ statistics, accountStatistics }: StatsCardsProps) {
  return (
    <div className="space-y-4">
      <DomainStatsCards statistics={statistics} />
      {accountStatistics && <AccountStatsCards statistics={accountStatistics} />}
    </div>
  )
}
