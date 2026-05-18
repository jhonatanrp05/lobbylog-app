# LobbyLog — Frontend

Web application for LobbyLog, a package delivery management system for residential complexes. Built with React, TypeScript, and HeroUI v3.

The backend API repository is available at [lobbylog-api](https://github.com/jhonatanrp05/lobbylog-api).

## Tech Stack

- React 19 + TypeScript
- Vite
- HeroUI v3 (component library)
- Tailwind CSS
- React Router v7

## Features by Role

**Admin**
- View all registered packages across the building
- Create and delete user accounts (receptionist and resident)
- Full visibility over the system

**Receptionist**
- Log incoming packages with photo and assign them to a resident
- Mark packages as delivered once the resident picks them up
- View all packages they have logged

**Resident**
- View their own incoming packages
- Confirm reception once a package is marked as delivered

## Requirements

- Node.js v18+
- pnpm
- LobbyLog API running locally (see backend README)

## Local Setup

1. Clone the repository

```bash
git clone https://github.com/jhonatanrp05/lobbylog-app.git
cd lobbylog-app
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file in the root:

```bash
cp .env.example .env
```

Then fill in the values:

```
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> Cloudinary is used for package photo uploads. Create a free account at [cloudinary.com](https://cloudinary.com) and set up an unsigned upload preset.

4. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Demo Credentials

Run `pnpm seed` in the API project first to populate the database.

| Name           | Email              | Password | Role         |
| -------------- | ------------------ | -------- | ------------ |
| Admin User     | admin@lobbylog.com | admin123 | Admin        |
| Carlos Portero | recep@lobbylog.com | recep123 | Receptionist |
| María García   | maria@lobbylog.com | res1pass | Resident     |
| Juan Pérez     | juan@lobbylog.com  | res2pass | Resident     |

## Project Structure

```
src/
├── components/        # Shared UI components (PackageCard, StatusChip, icons)
├── context/           # React contexts (AuthContext, ThemeContext)
├── layouts/           # App shell with navigation
├── lib/               # Shared types and utilities
├── pages/
│   ├── packages/
│   │   ├── all-packages/   # Admin view — all packages
│   │   ├── my-logged/      # Receptionist view — packages they logged
│   │   └── my-packages/    # Resident view — their own packages
│   └── users/              # Admin view — user management
└── services/
    └── api.ts         # All API calls in one place
```
