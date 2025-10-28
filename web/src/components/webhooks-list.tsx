import { Link } from '@tanstack/react-router'
import { IconButton } from './ui/icon-button'
import { Trash2 } from 'lucide-react'
import { Checkbox } from './ui/checkbox'

export function WebhooksList() {
  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox />

        <Link to="/" className="flex flex-1 min-w-0 items-start gap-3">
          <span className="w-12 shrink-0 font-mono text-xs font-semibold text-zinc-300 text-right">
            POST
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs text-zinc-200 leading-tight font-mono">
              /video/status
            </p>

            <p className="text-xs text-zinc-500 font-medium mt-1">
              1 minute ago
            </p>
          </div>
        </Link>
        <IconButton
          icon={<Trash2 className="size-3.5 text-zinc-400" />}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </div>
  )
}
