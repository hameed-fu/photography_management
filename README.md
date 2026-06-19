# PhotoStudio

A full-featured wedding photography management application built with **Laravel 13**, **React 19**, and **Inertia.js 3**.

Photographers can create wedding projects, upload and manage images, while admins oversee all users and weddings.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Laravel 13, PHP 8.3, MySQL |
| **Frontend** | React 19, TypeScript 5.7, Tailwind CSS 4 |
| **SPA Framework** | Inertia.js 3 |
| **Auth** | Laravel Fortify (2FA, Passkeys, Email Verification) |
| **UI** | shadcn/ui (Radix UI primitives), Lucide icons |
| **Build** | Vite 8, pnpm |

---

## Features

- **Role-based access** — Admin & Photographer roles
- **Wedding management** — Create, view, and manage wedding projects with event dates
- **Image upload & management** — Upload images per wedding, view gallery, single/batch delete
- **Admin panel** — Manage all users and weddings from a central dashboard
- **Authentication** — Login, registration, email verification, password reset
- **Two-factor authentication** — TOTP-based 2FA with confirmation flow
- **Passkeys (WebAuthn)** — Passwordless login support
- **Dark mode** — Light/dark appearance toggle
- **Server-side rendering** — Inertia SSR enabled for improved SEO and perceived performance

---

## Getting Started

### Prerequisites

- PHP ^8.3
- Composer
- Node.js & pnpm
- MySQL or SQLite

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd photography_management

# Install PHP dependencies
composer install

# Install JavaScript dependencies
pnpm install

# Copy environment file and configure
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Create storage symlink
php artisan storage:link

# Build frontend assets
pnpm build
```

### Development

```bash
# Start all dev servers (PHP, Vite, Queue, Logs)
composer dev
```

Or run individually:

```bash
php artisan serve
pnpm dev
```

### Queue

Image processing uses the queue. Start the worker:

```bash
php artisan queue:work
```

---

## Testing

```bash
# PHP tests
php artisan test

# Lint & type checks
composer lint
pnpm lint
pnpm typecheck
```

---

## Project Structure

```
app/
├── Http/Controllers/    # WeddingController, ImageController, AdminController, etc.
├── Models/              # User, Wedding, Image
├── Policies/            # WeddingPolicy
├── Actions/Fortify/     # Fortify auth actions
└── Middleware/          # AdminMiddleware, HandleAppearance, HandleInertiaRequests

resources/js/
├── pages/               # Inertia page components (admin, photographer, auth, settings)
├── components/          # shadcn/ui + custom components
├── layouts/             # App, auth, settings layouts
├── hooks/               # use-appearance, use-clipboard, etc.
├── lib/                 # Utilities (cn, etc.)
└── types/               # TypeScript definitions

routes/
├── web.php              # Main routes
└── settings.php         # Profile, security, appearance routes
```

---

## Screenshots

> Add screenshots here (e.g., `screenshots/dashboard.png`, `screenshots/wedding-gallery.png`)

---

## License

[MIT](LICENSE)
