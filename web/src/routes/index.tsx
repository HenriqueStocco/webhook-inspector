import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-2 p-8 text-center">
        <h3 className="text-lg font-semibold text-zinc-200">
          No webhook selected
        </h3>
        <p className="text-sm text-zinc-400 max-w-md">
          Select a webhook from the list to view its details
        </p>
      </div>
    </div>
  )
}
