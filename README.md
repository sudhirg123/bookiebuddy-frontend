# BookieBuddy.ai Frontend

BookieBuddy.ai is a playful reading companion for kids aged 8–14. It helps young readers collect book reviews, track their reading streak, and explore new stories with a little AI magic. This repository contains the complete Phase 1 Angular frontend built with PrimeNG and mock services backed by localStorage.

## ✨ Feature Highlights
- **Container/Presenter architecture** with Angular signals for predictable state management.
- **Responsive PrimeNG UI** using the Lara Light Purple theme plus custom brand styling.
- **Google authentication flow** (Firebase Authentication) with profile display and protected routes.
- **Local library management** with search, filters, sorting, rich-text reviews, and mock persistence.
- **Google Books assisted adding** thanks to autocomplete suggestions and cached API responses.
- **Statistics dashboard** showcasing genre distribution, reading timeline, and streak tracking.
- **Export/Import helpers** to backup the local library JSON.

## 🧱 Project Structure
```
src/app/
├── app.component.*           # Root shell with header/footer + toast outlet
├── app.config.ts             # Global providers (router, PrimeNG, Firebase, HTTP)
├── app.routes.ts             # Lazy routed feature containers with guard protection
├── core/
│   ├── services/             # Auth, books, Google Books, storage, toast helpers
│   ├── guards/               # authGuard protects feature routes
│   └── interceptors/         # Auth interceptor ready for Phase 2 backend swap
├── features/
│   ├── auth/                 # Login container + presenter
│   ├── books/                # Book list, detail, form, search containers & presenters
│   └── dashboard/            # Stats dashboard container + presenter
├── shared/
│   ├── components/           # Reusable presenters (cards, header, footer, etc.)
│   └── pipes/                # `truncate` and `safeHtml`
├── models/                   # Strongly typed domain models
└── environments/             # Firebase + API configuration (Phase 1 mock)
```

## ⚙️ Prerequisites
- **Node.js 20.19.0 or 22.12.0+** (Angular 20 requirement). Install via [nvm](https://github.com/nvm-sh/nvm) or [nodejs.org](https://nodejs.org/).
- **npm 10+** (ships with the recommended Node versions).

> ℹ️ If you are currently on Node 18 you can still install dependencies with `npm install --legacy-peer-deps`, but the Angular CLI commands will prompt you to upgrade before building.

## 🚀 Getting Started
```bash
# 1. Install dependencies (resolves PrimeNG/Firebase peers)
npm install --legacy-peer-deps

# 2. Start the dev server
npm start
# or
ng serve
```
The app will be available at **http://localhost:4200** and reload automatically on code changes.

## 🔐 Firebase Authentication Setup
1. Create a Firebase project and enable Google Sign-In in **Authentication ➜ Sign-in method**.
2. Copy the web app credentials into `src/app/environments/environment.ts` and `environment.prod.ts`:
   ```ts
   firebase: {
     apiKey: '…',
     authDomain: '…',
     projectId: '…',
     storageBucket: '…',
     messagingSenderId: '…',
     appId: '…'
   }
   ```
3. Optional: Restrict OAuth domains or customise the login screen in Firebase console.

## 📦 Mock Data & Persistence
- `BookDataService` seeds 7 sample titles and persists updates to `localStorage` under the key `bookiebuddy_books`.
- CRUD operations simulate a 300 ms latency, emit PrimeNG toasts, and automatically recompute dashboard stats.
- Use the export/import actions (coming soon to UI) to back up or restore the JSON payload.

## 📊 Libraries & Tooling
- **Angular 20** with standalone components, strict typing, and signals.
- **PrimeNG 17** (`Lara Light Purple` theme), PrimeFlex, and PrimeIcons.
- **Firebase Web SDK + @angular/fire** for Google auth integration.
- **RxJS** for debounced Google Books autocomplete and route signals.

## ✅ Useful Commands
```bash
npm start          # Run the dev server
npm run build      # Production build (requires Node 20.19+)
npm test           # Karma unit tests (extend as features grow)
```

## 🧭 Next Steps & Phase 2 Handoff
- Plug in the FastAPI backend by swapping `BookDataService` with HTTP calls and wiring the `authInterceptor` for JWTs.
- Surface library export/import controls in the UI (service implementation already available).
- Extend presenter test coverage (the architecture is optimised for isolated presenter tests).

Happy building, and enjoy crafting magical reading journeys with BookieBuddy.ai! 📚✨
