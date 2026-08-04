import { Link, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] text-white px-4">
      <div className="max-w-xl w-full rounded-2xl border border-white/10 bg-[#1b1b1f] p-8 text-center shadow-xl">
        <h1 className="text-3xl font-semibold mb-3">Something went wrong</h1>
        <p className="text-sm text-[#bfc0c7] mb-6">
          An unexpected error occurred while loading this page.
        </p>
        <pre className="text-xs text-[#c7c8cd] bg-[#111214] p-4 rounded-lg overflow-x-auto mb-6">
          {String(error?.statusText || error?.message || 'Unknown error')}
        </pre>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-[#5865f2] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4752c4] transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
