import { useEffect, useRef, useState } from 'react'
import type { MeasurementSystem } from '../types/weather'

interface UnitsMenuProps {
  value: MeasurementSystem
  onChange: (value: MeasurementSystem) => void
}

const OPTIONS: Array<{
  label: string
  value: MeasurementSystem
  temperature: string
  wind: string
  precipitation: string
}> = [
  {
    label: 'Switch to Imperial',
    value: 'imperial',
    temperature: 'Fahrenheit (°F)',
    wind: 'mph',
    precipitation: 'Inches (in)',
  },
  {
    label: 'Switch to Metric',
    value: 'metric',
    temperature: 'Celsius (°C)',
    wind: 'km/h',
    precipitation: 'Millimeters (mm)',
  },
]

export function UnitsMenu({ value, onChange }: UnitsMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeOption = OPTIONS.find((option) => option.value === value) ?? OPTIONS[1]
  const inactiveOption = OPTIONS.find((option) => option.value !== value)!

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-[#202450] bg-[#0D1133] px-4 py-2 text-sm font-semibold text-neutral-0 shadow-[0_10px_30px_rgba(5,7,35,0.45)] transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <img src="/assets/images/icon-units.svg" alt="" className="size-4" aria-hidden />
        Units
        <img
          src="/assets/images/icon-dropdown.svg"
          alt=""
          aria-hidden
          className={`size-3 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-3 w-72 rounded-3xl border border-[#202450] bg-[#0D1133] p-4 text-neutral-0 shadow-[0_20px_50px_rgba(5,7,35,0.6)]">
          <div className="space-y-4 text-sm">
            <button
              type="button"
              onClick={() => {
                onChange(inactiveOption.value)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-[#202450] px-3 py-2 text-left font-semibold transition hover:border-blue-500"
            >
              {inactiveOption.label}
              <img src="/assets/images/icon-dropdown.svg" alt="" className="size-3 rotate-90" />
            </button>

            <div className="space-y-3">
              <UnitsSection
                title="Temperature"
                activeLabel={activeOption.temperature}
                inactiveLabel={inactiveOption.temperature}
                onSelectActive={() => {
                  onChange(activeOption.value)
                  setOpen(false)
                }}
                onSelectInactive={() => {
                  onChange(inactiveOption.value)
                  setOpen(false)
                }}
              />
              <UnitsSection
                title="Wind Speed"
                activeLabel={activeOption.wind}
                inactiveLabel={inactiveOption.wind}
                onSelectActive={() => {
                  onChange(activeOption.value)
                  setOpen(false)
                }}
                onSelectInactive={() => {
                  onChange(inactiveOption.value)
                  setOpen(false)
                }}
              />
              <UnitsSection
                title="Precipitation"
                activeLabel={activeOption.precipitation}
                inactiveLabel={inactiveOption.precipitation}
                onSelectActive={() => {
                  onChange(activeOption.value)
                  setOpen(false)
                }}
                onSelectInactive={() => {
                  onChange(inactiveOption.value)
                  setOpen(false)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface UnitsSectionProps {
  title: string
  activeLabel: string
  inactiveLabel: string
  onSelectActive: () => void
  onSelectInactive: () => void
}

function UnitsSection({
  title,
  activeLabel,
  inactiveLabel,
  onSelectActive,
  onSelectInactive,
}: UnitsSectionProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-neutral-300">{title}</p>
      <div className="space-y-2 rounded-2xl bg-[#111538] p-2">
        <MenuRow label={activeLabel} isActive onClick={onSelectActive} />
        <MenuRow label={inactiveLabel} isActive={false} onClick={onSelectInactive} />
      </div>
    </div>
  )
}

function MenuRow({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
        isActive ? 'bg-[#1A1F4A] text-neutral-0' : 'text-neutral-400 hover:bg-[#1a1f4a]/60'
      }`}
    >
      {label}
      {isActive && <img src="/assets/images/icon-checkmark.svg" alt="" className="size-4" />}
    </button>
  )
}

