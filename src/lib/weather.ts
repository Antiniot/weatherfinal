import type {
  CurrentConditions,
  DailyForecastDay,
  HourlyForecastPoint,
  LocationMatch,
  MeasurementSystem,
  WeatherData,
  WeatherMeta,
} from '../types/weather'

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const UNIT_MAP: Record<
  MeasurementSystem,
  { temp: string; wind: string; precip: string; api: Record<string, string> }
> = {
  metric: {
    temp: '°C',
    wind: 'km/h',
    precip: 'mm',
    api: {
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
    },
  },
  imperial: {
    temp: '°F',
    wind: 'mph',
    precip: 'in',
    api: {
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
      precipitation_unit: 'inch',
    },
  },
}

const WEATHER_LOOKUP: { codes: number[]; label: string; icon: string }[] = [
  { codes: [0], label: 'Clear sky', icon: 'icon-sunny' },
  { codes: [1, 2], label: 'Partly cloudy', icon: 'icon-partly-cloudy' },
  { codes: [3], label: 'Overcast', icon: 'icon-overcast' },
  { codes: [45, 48], label: 'Foggy', icon: 'icon-fog' },
  { codes: [51, 53, 55, 56, 57], label: 'Drizzle', icon: 'icon-drizzle' },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: 'Rain showers', icon: 'icon-rain' },
  { codes: [71, 73, 75, 77, 85, 86], label: 'Snowfall', icon: 'icon-snow' },
  { codes: [95, 96, 99], label: 'Thunderstorm', icon: 'icon-storm' },
]

const getWeatherMeta = (code: number): WeatherMeta => {
  const match =
    WEATHER_LOOKUP.find((entry) => entry.codes.includes(code)) ??
    { label: 'Cloudy', icon: 'icon-overcast' }
  return { code, label: match.label, icon: `/assets/images/${match.icon}.webp` }
}

export const geocodeLocation = async (query: string): Promise<LocationMatch[]> => {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`${GEOCODE_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Unable to reach geocoding service')
  }

  const payload = await response.json()
  if (!payload.results) {
    return []
  }

  return payload.results.map((result: any) => ({
    id: String(result.id ?? `${result.latitude},${result.longitude}`),
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  }))
}

const formatDayLabel = (date: string, index: number): string => {
  const formatter = new Intl.DateTimeFormat('en', { weekday: 'short' })
  const label = formatter.format(new Date(date))
  return index === 0 ? 'Today' : label
}

const formatHourLabel = (timestamp: string): string => {
  const formatter = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
  })
  return formatter.format(new Date(timestamp))
}

export const fetchWeatherForecast = async (
  location: LocationMatch,
  units: MeasurementSystem,
): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      'temperature_2m,apparent_temperature,is_day,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
    hourly: 'temperature_2m,apparent_temperature,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '7',
    ...UNIT_MAP[units].api,
  })

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Unable to fetch weather data')
  }

  const data = await response.json()
  const current = mapCurrentConditions(data)
  const daily = mapDailyForecast(data)
  const { groupedHourly, dayOrder } = mapHourlyForecast(data)

  return {
    location,
    current,
    daily,
    hourlyByDay: groupedHourly,
    dayOrder,
    units: {
      temperature: UNIT_MAP[units].temp,
      wind: UNIT_MAP[units].wind,
      precipitation: UNIT_MAP[units].precip,
    },
    updatedAt: new Date().toISOString(),
  }
}

const mapCurrentConditions = (data: any): CurrentConditions => {
  const current = data.current
  const meta = getWeatherMeta(current.weather_code)
  return {
    ...meta,
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation ?? 0,
    isDay: Boolean(current.is_day),
    observationTime: current.time,
  }
}

const mapDailyForecast = (data: any): DailyForecastDay[] => {
  const { daily } = data
  return daily.time.slice(0, 7).map((date: string, index: number) => {
    const meta = getWeatherMeta(daily.weather_code[index])
    return {
      ...meta,
      date,
      dayLabel: formatDayLabel(date, index),
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
    }
  })
}

const mapHourlyForecast = (data: any): {
  groupedHourly: Record<string, HourlyForecastPoint[]>
  dayOrder: string[]
} => {
  const { hourly } = data
  const grouped: Record<string, HourlyForecastPoint[]> = {}

  hourly.time.forEach((timestamp: string, index: number) => {
    const dayKey = timestamp.split('T')[0]
    const meta = getWeatherMeta(hourly.weather_code[index])
    const point: HourlyForecastPoint = {
      ...meta,
      time: timestamp,
      hourLabel: formatHourLabel(timestamp),
      temperature: hourly.temperature_2m[index],
      apparentTemperature: hourly.apparent_temperature[index],
      precipitationProbability: hourly.precipitation_probability?.[index] ?? 0,
    }
    if (!grouped[dayKey]) {
      grouped[dayKey] = []
    }
    grouped[dayKey].push(point)
  })

  const order = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  return {
    groupedHourly: grouped,
    dayOrder: order.slice(0, 7),
  }
}

