import { useEffect, useState } from 'react'
import { SearchForm } from './components/SearchForm'
import { UnitsMenu } from './components/UnitsMenu'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { WeatherHighlights } from './components/WeatherHighlights'
import { DailyForecast } from './components/DailyForecast'
import { HourlyForecast } from './components/HourlyForecast'
import { SkeletonState } from './components/SkeletonState'
import { fetchWeatherForecast, geocodeLocation } from './lib/weather'
import type { LocationMatch, MeasurementSystem, WeatherData } from './types/weather'

type SearchStatus = 'idle' | 'loading' | 'error' | 'no-results'

const DEFAULT_LOCATION: LocationMatch = {
  id: '5391959',
  name: 'San Francisco',
  admin1: 'California',
  country: 'United States',
  latitude: 37.7749,
  longitude: -122.4194,
  timezone: 'America/Los_Angeles',
}

function App() {
  // Load saved location from localStorage or use default
  const loadSavedLocation = (): LocationMatch => {
    try {
      const saved = localStorage.getItem('selectedLocation')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load saved location:', error)
    }
    return DEFAULT_LOCATION
  }

  const loadSavedSearchTerm = (): string => {
    try {
      const saved = localStorage.getItem('searchTerm')
      if (saved) {
        return saved
      }
    } catch (error) {
      console.error('Failed to load saved search term:', error)
    }
    return `${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}`
  }

  const savedLocation = loadSavedLocation()
  const savedSearchTerm = loadSavedSearchTerm()

  const [searchTerm, setSearchTerm] = useState(savedSearchTerm)
  const [searchResults, setSearchResults] = useState<LocationMatch[]>([])
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [searchError, setSearchError] = useState<string | null>(null)

  const [selectedLocation, setSelectedLocation] =
    useState<LocationMatch>(savedLocation)
  const [units, setUnits] = useState<MeasurementSystem>('metric')

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherStatus, setWeatherStatus] =
    useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const handleLocationSelection = (location: LocationMatch) => {
    // Create a new object to ensure React detects the state change
    const newLocation: LocationMatch = {
      id: location.id,
      name: location.name,
      country: location.country,
      admin1: location.admin1,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
    }
    
    // Update location state - this will trigger the useEffect to fetch weather
    setSelectedLocation(newLocation)
    const locationString = `${newLocation.name}${newLocation.country ? `, ${newLocation.country}` : ''}`
    setSearchTerm(locationString)
    setSearchStatus('idle')
    setSearchResults([]) // Clear search results after selection
    
    // Save to localStorage for persistence across page reloads
    try {
      localStorage.setItem('selectedLocation', JSON.stringify(newLocation))
      localStorage.setItem('searchTerm', locationString)
    } catch (error) {
      console.error('Failed to save location to localStorage:', error)
    }
  }

  const handleSearch = async () => {
    const query = searchTerm.trim()
    if (!query) {
      setSearchStatus('no-results')
      setSearchResults([])
      setWeatherData(null)
      setWeatherStatus('idle')
      return
    }

    setSearchStatus('loading')
    setSearchError(null)
    try {
      const results = await geocodeLocation(query)
      if (results.length === 0) {
        setSearchResults([])
        setSearchStatus('no-results')
        setWeatherData(null)
        setWeatherStatus('idle') // Reset weather status to hide previous data
        return
      }
      setSearchResults(results)
      setSearchStatus('idle')
      // Don't automatically select - let user choose from dropdown
    } catch (error) {
      setSearchStatus('error')
      setSearchError(error instanceof Error ? error.message : 'Unknown error')
      setWeatherData(null)
      setWeatherStatus('idle')
    }
  }

  useEffect(() => {
    let isActive = true
    let intervalId: number | null = null
    
    const fetchWeather = async (isAutoRefresh = false) => {
      if (!selectedLocation) return
      
      // Only show loading state on initial load, not on auto-refresh
      if (!isAutoRefresh) {
        setWeatherStatus('loading')
      }
      setWeatherError(null)
      
      try {
        const data = await fetchWeatherForecast(selectedLocation, units)
        if (!isActive) return
        setWeatherData(data)
        // Only reset selected day on initial load, preserve it during auto-refresh
        if (!isAutoRefresh) {
          setSelectedDay(data.dayOrder[0] ?? null)
        } else {
          // During auto-refresh, preserve the current selected day if it still exists
          setSelectedDay((prevDay) => {
            if (prevDay && data.dayOrder.includes(prevDay)) {
              return prevDay
            }
            return data.dayOrder[0] ?? null
          })
        }
        setWeatherStatus('ready')
      } catch (error) {
        if (!isActive) return
        // Only show error state on initial load, not on auto-refresh
        if (!isAutoRefresh) {
          setWeatherStatus('error')
          setWeatherError(
            error instanceof Error ? error.message : 'Unable to load forecast',
          )
        }
      }
    }
    
    // Initial fetch
    fetchWeather()
    
    // Set up auto-refresh every 1 second (1000 ms)
    intervalId = setInterval(() => {
      if (isActive && selectedLocation) {
        fetchWeather(true)
      }
    }, 1000) // 1 second
    
    return () => {
      isActive = false
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [selectedLocation, units])

  // Auto-reload entire page every 1 minute
  useEffect(() => {
    const reloadInterval = setInterval(() => {
      window.location.reload()
    }, 60000) // 1 minute (60000 ms)

    return () => {
      clearInterval(reloadInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#050723] bg-gradient-to-b from-[#070A2C] via-[#050723] to-[#050723] py-6 text-neutral-0 sm:py-12">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:gap-8 md:gap-10 md:px-8">
        <nav className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/assets/images/logo.svg" alt="Weather Now" className="h-6 w-auto sm:h-8" />
          </div>
          <UnitsMenu value={units} onChange={setUnits} />
        </nav>

        <section className="text-center space-y-0">
  <h1 className="font-display text-4xl font-semibold leading-tight text-neutral-0 sm:text-5xl mb-10">
    How&apos;s the sky looking today?
  </h1>

  <div className="mx-auto w-full max-w-lg">
    <SearchForm
      value={searchTerm}
      onChange={setSearchTerm}
      onSubmit={handleSearch}
      isSearching={searchStatus === 'loading'}
      status={searchStatus}
      error={searchError}
      results={searchResults}
      onSelectResult={(location) => {
        handleLocationSelection(location)
        setSearchResults([])
      }}
      statusChip={searchStatus === 'loading' ? 'Search in progress' : null}
    />
  </div>
          {searchStatus === 'no-results' && (
            <div className="flex items-center justify-center pt-2">
              <p className="text-lg font-medium text-neutral-0">
                No search result found!
              </p>
            </div>
          )}
        </section>

        {weatherStatus === 'error' && searchStatus !== 'no-results' && (
          <div className="rounded-3xl bg-red-500/10 p-6 text-red-100 ring-1 ring-red-500/40">
            <p className="font-semibold">We couldn&apos;t load the forecast.</p>
            <p className="text-sm">{weatherError}</p>
            <button
              type="button"
              onClick={() => handleLocationSelection(selectedLocation)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/50 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/10"
            >
              <img
                src="/assets/images/icon-retry.svg"
                alt=""
                className="size-4"
                aria-hidden
              />
              Try again
            </button>
          </div>
        )}

        {weatherStatus === 'loading' && searchStatus !== 'no-results' && <SkeletonState />}

        {weatherStatus === 'ready' && weatherData && searchStatus !== 'no-results' && (
          <section className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,3.6fr)_minmax(0,1.4fr)] lg:gap-6">
            <div className="flex w-full flex-col gap-6">
              <CurrentWeatherCard
                location={weatherData.location}
                current={weatherData.current}
                units={weatherData.units}
              />
              <WeatherHighlights current={weatherData.current} units={weatherData.units} />
              <DailyForecast
                days={weatherData.daily}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
            </div>
            <div className="w-full lg:max-w-sm lg:justify-self-start">
              <HourlyForecast
                dayOrder={weatherData.dayOrder}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                hourlyByDay={weatherData.hourlyByDay}
                units={weatherData.units}
              />
            </div>
          </section>
        )}

       
      </main>
    </div>
  )
}

export default App
