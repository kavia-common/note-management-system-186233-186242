# Ocean Notes (Frontend)

A modern, minimalist note-taking React app using the "Ocean Professional" style (blue and amber accents), with a header, sidebar, and editor layout. Includes a mockable API client and autosave.

## Quick Start

1. Install dependencies
   ```
   npm install
   ```

2. Run in development
   ```
   npm start
   ```

3. Open the app at http://localhost:3000

## Features

- Header with brand, search, and theme toggle (light/dark)
- Sidebar with note list and New Note action
- Note editor with title and content, debounced autosave, and delete
- Client-side search filter
- Toast notifications and delete confirmation modal
- Mock mode for API-free development

## Environment Variables

Provide environment variables via `.env` (do not commit secrets). The app recognizes:

- `REACT_APP_API_BASE`: Base URL for backend API (e.g., https://api.example.com)
- `REACT_APP_BACKEND_URL`: Alternative base URL (used if API_BASE absent)
- `REACT_APP_FEATURE_FLAGS`: JSON string for features, e.g.:
  - `{"mockNotes": true, "mockLatencyMs": 250}` to enable in-memory notes and simulate latency
- Other container-provided envs (not used directly here but reserved):
  - REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV,
    REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS,
    REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL,
    REACT_APP_HEALTHCHECK_PATH, REACT_APP_EXPERIMENTS_ENABLED

When both `REACT_APP_API_BASE` and `REACT_APP_BACKEND_URL` are absent and `mockNotes` is false, network calls will fail. Use mock mode during development if the backend is not available.

Example `.env`:
```
REACT_APP_FEATURE_FLAGS={"mockNotes":true,"mockLatencyMs":200}
# REACT_APP_API_BASE=https://api.your-backend.tld
```

## Keyboard Shortcuts

- Ctrl/Cmd+N: New note
- Ctrl/Cmd+S: Save (debounced autosave triggers)
- Delete: Delete selected note (prompts confirmation)

## Scripts

- `npm start` – Start dev server
- `npm test` – Run tests
- `npm run build` – Production build

## Styling

- Theme variables in `src/styles/theme.css`
- Layout styles in `src/App.css`
- Light/Dark theme toggled via document `data-theme` attribute

## Accessibility

- Semantic labels on controls
- Focus-visible ring for keyboard users
- ARIA attributes on lists, options, and modal dialog
