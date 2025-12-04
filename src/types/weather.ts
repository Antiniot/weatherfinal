export type MeasurementSystem = 'metric' | 'imperial'

export interface LocationMatch {
  id: string
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
  timezone?: string
}

export interface WeatherMeta {
  code: number
  label: string
  icon: string
}

export interface CurrentConditions extends WeatherMeta {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  precipitation: number
  isDay: boolean
  observationTime: string
}

export interface DailyForecastDay extends WeatherMeta {
  date: string
  dayLabel: string
  max: number
  min: number
}

export interface HourlyForecastPoint extends WeatherMeta {
  time: string
  hourLabel: string
  temperature: number
  apparentTemperature: number
  precipitationProbability: number
}

export interface WeatherData {
  location: LocationMatch
  current: CurrentConditions
  daily: DailyForecastDay[]
  hourlyByDay: Record<string, HourlyForecastPoint[]>
  dayOrder: string[]
  units: {
    temperature: string
    wind: string
    precipitation: string
  }
  updatedAt: string
}

