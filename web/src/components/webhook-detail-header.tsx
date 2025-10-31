import { Badge } from './badge'

interface WebhookDetailHeaderProps {
  method: string
  pathname: string
  ip: string
  createdAt: Date
}

export function WebhookDetailHeader({
  createdAt,
  ip,
  method,
  pathname,
}: WebhookDetailHeaderProps) {
  return (
    <div className="space-y-4 border-b border-zinc-700 p-6">
      <div className="flex items-center gap-3">
        <Badge>{method}</Badge>

        <span className="text-lg font-medium text-zinc-300">{pathname}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1  text-sm text-zinc-400">
          <span>From IP</span>
          <span className="underline underline-offset-4">{ip}</span>
        </div>

        <span className="w-px h-4 bg-zinc-700" />

        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>at</span>
          <span>{createdAt.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  )
}
