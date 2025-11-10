# Recipe Hub Frontend (Vue + Vite)

Modern Vue 3 frontend to browse, search, and manage recipes with an Ocean Professional theme.

## Features
- Recipe grid with search and filters (cuisine, difficulty, time, tags)
- Detail page with metadata
- Create/Edit forms with validation
- Client-side mock mode with seamless fallback when backend is unavailable
- Pinia state management and Vue Router
- Accessible controls, keyboard-friendly
- Runs on port 3000

## Environment Variables
The app reads configuration from Vite env variables (VITE_*). Create a `.env` file based on `.env.example`.

- VITE_API_BASE: Base URL to backend (e.g., https://api.example.com)
- VITE_BACKEND_URL: Fallback base URL if VITE_API_BASE not set
- VITE_FEATURE_FLAGS: Comma separated flags. Use `mock` to force mock mode.
- VITE_PORT: Preferred port (the dev server is configured to run at 3000)

See `.env.example` for the full list used in this container.

## Development

```bash
npm install
npm run dev
```

The dev server is configured to run at http://localhost:3000 (strictPort).

## Build

```bash
npm run build
npm run preview
```

## Notes
- When no API base is provided or the backend is unreachable, the UI enters mock mode and uses in-memory data.
- API placeholders used:
  - GET /recipes
  - GET /recipes/:id
  - POST /recipes
  - PUT /recipes/:id
  - DELETE /recipes/:id

## License
MIT
