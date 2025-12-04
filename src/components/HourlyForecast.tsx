import { useEffect, useRef, useState } from 'react'
import type { HourlyForecastPoint, WeatherData } from '../types/weather'

interface HourlyForecastProps {
  dayOrder: string[]
  selectedDay: string | null
  onSelectDay: (day: string) => void
  hourlyByDay: Record<string, HourlyForecastPoint[]>
  units: WeatherData['units']
}

export function HourlyForecast({
  dayOrder,
  selectedDay,
  onSelectDay,
  hourlyByDay,
}: HourlyForecastProps) {
  const hours = selectedDay ? hourlyByDay[selectedDay] ?? [] : []
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedLabel = selectedDay
    ? new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date(selectedDay))
    : 'Tuesday'

  return (
    <section className="rounded-[28px] bg-[#111538] p-5 text-neutral-0 shadow-[0_15px_40px_rgba(4,6,26,0.55)] ring-1 ring-[#1d2148] w-full">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-200">
          Hourly forecast
        </h2>

        <div ref={containerRef} className="relative flex-shrink-0 text-sm">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#1b1f47] px-3 py-2 text-neutral-200 ring-1 ring-[#272b58] transition hover:ring-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {selectedLabel}
            <img
              src="/assets/images/icon-dropdown.svg"
              alt=""
              aria-hidden
              className={`size-3 transition ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded-2xl border border-[#1f2350] bg-[#111538] p-1.5 shadow-xl">
              {dayOrder.map((day) => {
                const label = new Intl.DateTimeFormat('en', {
                  weekday: 'long',
                }).format(new Date(day))
                const isActive = selectedDay === day
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      onSelectDay(day)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? 'bg-[#1a1f4a] text-neutral-0'
                        : 'text-neutral-300 hover:bg-[#1a1f4a]/60'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <img
                        src="/assets/images/icon-checkmark.svg"
                        alt=""
                        className="size-4"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      {hours.length === 0 ? (
        <p className="text-sm text-neutral-300">No hourly data available.</p>
      ) : (
        <div
          className="
            h-[500px]
            overflow-y-auto
            pr-1
            space-y-2
            pb-1
            scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#272b58]
          "
        >
          {hours.map((hour) => (
            <article
              key={hour.time}
              className="
                flex items-center justify-between
                rounded-2xl bg-[#15193f]
                px-4
                py-3
                ring-1 ring-[#1d2148]
                min-h-[52px]
              "
            >
              <div className="flex items-center gap-3">
                <img
                  src={hour.icon}
                  alt={hour.label}
                  className="size-8"
                  loading="lazy"
                />
                <div className="text-left">
                  <p className="text-sm text-neutral-0">{hour.hourLabel}</p>
                  <p className="text-xs text-neutral-400">{hour.label}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-neutral-0">
                {Math.round(hour.temperature)}°
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
