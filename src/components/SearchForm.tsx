import type { FormEvent } from 'react'
import type { LocationMatch } from '../types/weather'

type SearchStatus = 'idle' | 'loading' | 'error' | 'no-results'

interface SearchFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSearching: boolean
  status: SearchStatus
  error?: string | null
  results: LocationMatch[]
  onSelectResult: (location: LocationMatch) => void
  statusChip?: string | null
}

const statusCopy: Record<SearchStatus, string> = {
  idle: '',
  loading: 'Searching locations…',
  error: 'Something went wrong. Please try again.',
  'no-results': '',
}

export function SearchForm({
  value,
  onChange,
  onSubmit,
  isSearching,
  status,
  error,
  results,
  onSelectResult,
  statusChip,
}: SearchFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  const helperText = error ?? statusCopy[status]

  return (
    <div className="relative space-y-3">
      <form onSubmit={handleSubmit} aria-label="Search for a city">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex flex-1">
            <div className="flex w-full items-center gap-2 rounded-2xl bg-[#0E123D] px-4 py-2.5 text-neutral-0 shadow-[0_15px_35px_rgba(5,7,35,0.45)] ring-1 ring-[#1c2158] transition focus-within:ring-2 focus-within:ring-blue-400">
              <img
                src="/assets/images/icon-search.svg"
                alt=""
                className="size-4 flex-shrink-0 opacity-70"
                aria-hidden
              />
              <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search for a place..."
                className="w-full bg-transparent text-base font-medium text-neutral-0 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-3 rounded-3xl border border-[#1f2350] bg-[#111538] p-3 text-neutral-0 shadow-[0_20px_50px_rgba(5,7,35,0.6)]">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-300">
                  Search results
                </p>
                <ul role="listbox" className="space-y-1">
                  {results.map((location) => (
                    <li key={location.id}>
                      <button
                        type="button"
                        onClick={() => onSelectResult(location)}
                        className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition hover:bg-[#1a1f4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        <span className="text-sm font-medium">
                          {location.name}
                          {location.admin1 ? `, ${location.admin1}` : ''}
                        </span>
                        <span className="text-xs text-neutral-300">{location.country}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-neutral-0 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-5"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <span className="size-3 animate-spin rounded-full border-2 border-neutral-0/40 border-l-neutral-0" />
                Searching
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {statusChip && (
        <div className="inline-flex items-center gap-2 rounded-2xl bg-[#161948] px-4 py-2 text-sm text-neutral-0 shadow-lg ring-1 ring-[#1f2350] md:absolute md:left-6 md:top-full md:z-10 md:mt-3">
          <span className="size-2 rounded-full bg-blue-400" />
          {statusChip}
        </div>
      )}

      {helperText && status !== 'loading' && status !== 'no-results' && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#161948] px-4 py-2 text-sm text-neutral-200">
          <img
            src={
              status === 'error'
                ? '/assets/images/icon-error.svg'
                : '/assets/images/icon-checkmark.svg'
            }
            alt=""
            className="size-4 opacity-80"
            aria-hidden
          />
          <span>{helperText}</span>
        </div>
      )}
    </div>
  )
}

