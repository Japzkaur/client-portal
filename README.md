# Client Inquiry Portal (Port 80)

Client-facing project intake and ticket status tracking web application.

- **Port**: 80 (configurable via `PORT` or `vite.config.ts`)
- **Backend API**: `http://localhost:5000/api`

## Features
- Enterprise inquiry form with instant random ticket generator (`TKT-YYYY-XXXX`).
- Real-time milestone tracker with progress stages.
- Inquiry specifications review & communication timeline.
- Clean day/night mode.
- Zero admin code or links on the page.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run development server on port 80:
```bash
# Note: On Linux/macOS, binding to port 80 may require sudo:
npm run dev
# or: sudo npm run dev
```

3. Build for production:
```bash
npm run build
npm run preview
```

## Connecting to Backend API
By default, the client talks to `http://localhost:5000/api`. To change this, create a `.env` file:
```env
VITE_API_URL=http://your-backend-host:5000/api
```
