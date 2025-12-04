import type { DailyForecastDay, WeatherData } from '../types/weather'

interface DailyForecastProps {
  days: DailyForecastDay[]
  units: WeatherData['units']
  selectedDay: string | null
  onSelectDay: (day: string) => void
}

export function DailyForecast({ days, units, selectedDay, onSelectDay }: DailyForecastProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Daily forecast
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 md:grid-cols-7 md:gap-3">
        {days.map((day) => {
          const isActive = selectedDay === day.date
          const shortDayLabel = day.dayLabel.slice(0, 3)

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay(day.date)}
              className={`flex flex-col justify-between rounded-2xl px-3 py-3 text-center transition ${
                isActive
                  ? 'bg-blue-500 text-neutral-900'
                  : 'bg-[#0F1337] text-neutral-0 ring-1 ring-[#1d2148]'
              }`}
            >
              {/* Top: day label */}
              <p className="text-xs font-medium text-neutral-300">
                {shortDayLabel}
              </p>

              {/* Middle: icon */}
              <img
                src={day.icon}
                alt={day.label}
                className="mx-auto my-3 h-8 w-8"
                loading="lazy"
              />

              {/* Bottom: temps – smaller, same color, left/right */}
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-300">
                  {Math.round(day.max)}°
                </span>
                <span className="text-[11px] font-medium text-neutral-300">
                  {Math.round(day.min)}°
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
