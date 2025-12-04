import type { CurrentConditions, WeatherData } from '../types/weather'

interface WeatherHighlightsProps {
  current: CurrentConditions
  units: WeatherData['units']
}

export function WeatherHighlights({ current, units }: WeatherHighlightsProps) {
  const highlights = [
    {
      label: 'Feels like',
      value: `${Math.round(current.apparentTemperature)}°`,
      
    },
    {
      label: 'Humidity',
      value: `${current.humidity}%`,
      
    },
    {
      label: 'Wind',
      value: `${Math.round(current.windSpeed)} ${units.wind}`,
      
    },
    {
      label: 'Precipitation',
      value: `${current.precipitation.toFixed(1)} ${units.precipitation}`,
      
    },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-300">
        TODAY&apos;S OVERVIEW
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {highlights.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl bg-[#111538] p-4 text-neutral-0 shadow-[0_10px_30px_rgba(4,6,26,0.45)] ring-1 ring-[#1d2148]"
          >
            <p className="text-xs text-neutral-300">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-0">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

