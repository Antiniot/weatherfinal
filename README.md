# Weather App (React · TypeScript · Tailwind)

Fully responsive implementation of the Frontend Mentor weather dashboard. It fetches realtime and forecast data from the free [Open-Meteo](https://open-meteo.com/) APIs, supports both metric and imperial units, and mirrors the provided designs for desktop and mobile.

## Features

- Location lookup with live suggestions powered by Open-Meteo Geocoding
- Current conditions card with contextual iconography and feel-like metrics
- Additional highlights (humidity, wind, precipitation, etc.)
- 7-day forecast selector + detailed hourly breakdown for any day
- Unit toggle (Metric °C/kmh and Imperial °F/mph)
- Responsive layout, accessible states, and animated loading/error feedback

## Tech Stack

- [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for fast dev/build tooling
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Fetch API for all network calls (no backend required)

## Getting Started

```bash
cd app
npm install
npm run dev
```

The dev server will print a local URL (default `http://localhost:5173`). For a production build run `npm run build` and preview with `npm run preview`.

## Configuration

No API keys are required. All endpoints are public, so the project works out-of-the-box. If you want to change the default landing city, edit `DEFAULT_LOCATION` inside `src/App.tsx`.

## Project Structure

- `src/components` – stateless UI building blocks (search, cards, toggles)
- `src/lib/weather.ts` – API helpers + data shaping utilities
- `src/types` – shared TypeScript shapes
- `public/assets` – design assets (icons, backgrounds, fonts)

## Credits

- Challenge & design: [Frontend Mentor](https://www.frontendmentor.io/)
- Weather data: [Open-Meteo](https://open-meteo.com/)
