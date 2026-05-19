# TalklyAI — Frontend

> **AI-powered Revenue Intelligence Platform** | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4

TalklyAI is an AI voice assistant and revenue intelligence platform. This repository contains the **frontend** web application — a modern, fully responsive Next.js application that delivers a marketing landing page and an authenticated dashboard experience.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routing](#pages--routing)
- [Components](#components)
- [Styling System](#styling-system)
- [Fonts & Typography](#fonts--typography)
- [Theme System (Dark / Light Mode)](#theme-system-dark--light-mode)
- [Utility Library](#utility-library)
- [Key Dependencies](#key-dependencies)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment & Configuration](#environment--configuration)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org) (strict mode) |
| UI Library | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + custom CSS |
| Animations | [Framer Motion 12](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |
| Particles | [@tsparticles/react](https://particles.js.org) |
| Class Utilities | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) |

---

## Project Structure

```
frontend/
├── public/                     # Static assets (images, fonts, SVGs)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth route group (unauthenticated pages)
│   │   │   └── login/          # Login page
│   │   ├── (root)/             # Protected route group (authenticated pages)
│   │   │   ├── layout.tsx      # Dashboard shell: Sidebar + Topbar
│   │   │   ├── dashboard/      # Main dashboard page
│   │   │   └── lead-intelligence/  # Lead Intelligence module
│   │   │       └── [id]/       # Dynamic lead detail page
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global styles & CSS design tokens
│   │   ├── layout.tsx          # Root layout (fonts, ThemeProvider)
│   │   └── page.tsx            # Landing page (public home)
│   ├── components/
│   │   ├── landing/            # Landing page section components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ValuePropSection.tsx
│   │   │   ├── CapabilitiesSection.tsx
│   │   │   ├── WorkflowSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SectionBadge.tsx
│   │   ├── dashboard/          # Dashboard shell components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── TemplateCard.tsx
│   │   ├── ui/                 # Reusable low-level UI primitives
│   │   │   └── border-beam.tsx
│   │   ├── ThemeProvider.tsx   # next-themes wrapper
│   │   └── sparkles.tsx        # Sparkle / particle animation component
│   └── lib/
│       └── utils.ts            # cn() helper (clsx + tailwind-merge)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS (Tailwind v4 plugin)
├── eslint.config.mjs           # ESLint configuration
└── package.json
```

---

## Pages & Routing

Next.js App Router is used with **route groups** to separate concerns cleanly:

### Public Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Marketing landing page |
| `/login` | `src/app/(auth)/login/page.tsx` | User login page |

### Protected Routes (Dashboard Shell)

All routes inside `(root)/` share the same layout which includes the **Sidebar** and **Topbar**.

| Route | File | Description |
|---|---|---|
| `/dashboard` | `src/app/(root)/dashboard/page.tsx` | Main dashboard overview |
| `/lead-intelligence` | `src/app/(root)/lead-intelligence/page.tsx` | Lead Intelligence table view |
| `/lead-intelligence/[id]` | `src/app/(root)/lead-intelligence/[id]/page.tsx` | Individual lead detail view |

> **Route Groups** (folders wrapped in parentheses like `(root)` and `(auth)`) do **not** affect the URL path. They are purely organizational and allow different layouts to be applied to different segments of the app.

---

## Components

### Landing Page Components (`src/components/landing/`)

These components build up the public marketing page (`/`):

| Component | Purpose |
|---|---|
| `Navbar.tsx` | Sticky top navigation bar with links, dark/light mode toggle, and CTA |
| `HeroSection.tsx` | Full-screen hero with animated glassmorphism card, waitlist form, sparkle effects, and a dashboard preview overlay |
| `ValuePropSection.tsx` | Section highlighting the core value propositions of TalklyAI |
| `CapabilitiesSection.tsx` | AI capabilities grid / feature showcase |
| `WorkflowSection.tsx` | Step-by-step workflow explanation with animated visuals |
| `CTASection.tsx` | Final call-to-action section with a waitlist/signup prompt |
| `Footer.tsx` | Site footer with navigation links, social media, and legal copy |
| `SectionBadge.tsx` | Small reusable badge/chip used as a label above section headings |

### Dashboard Components (`src/components/dashboard/`)

These form the persistent shell around all authenticated pages:

| Component | Purpose |
|---|---|
| `Sidebar.tsx` | Left navigation sidebar with grouped nav links, usage stats (text credits, voice minutes), and an upgrade button. Active route is highlighted based on the current URL path. Responsive — hidden on mobile and toggled via overlay. |
| `Topbar.tsx` | Top header bar, route-aware — renders dynamic breadcrumbs/titles based on the current page. Includes hamburger menu trigger for mobile sidebar. |
| `TemplateCard.tsx` | A reusable card component for displaying AI template items on the dashboard. |

### UI Primitives (`src/components/ui/`)

| Component | Purpose |
|---|---|
| `border-beam.tsx` | Animated glowing border effect used to add a premium feel to cards and containers. |

### Shared Components (`src/components/`)

| Component | Purpose |
|---|---|
| `ThemeProvider.tsx` | Wraps the app with `next-themes` to enable system-aware dark/light mode switching. |
| `sparkles.tsx` | A canvas/particle-based sparkle animation component used in hero sections and decorative areas. |

---

## Styling System

Styling is done with **Tailwind CSS v4** paired with custom CSS defined in `src/app/globals.css`.

### Design Tokens (CSS Variables)

The app uses CSS custom properties for all design tokens. Both light and dark variants are defined:

```css
:root {
  --background, --foreground, --card, --popover,
  --primary, --secondary, --muted, --accent,
  --destructive, --border, --input, --ring,
  --chart-1 ... --chart-5,
  --sidebar, --sidebar-foreground, ...
  --radius: 0.625rem;
}

.dark {
  /* All tokens overridden for dark mode */
}
```

These tokens are exposed to Tailwind via `@theme inline { ... }` in `globals.css`, making them available as Tailwind utility classes (e.g., `bg-background`, `text-foreground`, `border-border`).

### Custom Animations

Three custom CSS animations are defined globally:

| Animation | Class | Description |
|---|---|---|
| Breathing Glow | `.animate-breathing-glow` | Pulsing scale + opacity effect (3s loop) |
| Twinkle | `.animate-twinkle` | Sparkle pop-in with rotation (1.8s loop) |
| Shimmer | *(keyframes only)* | Horizontal shimmer sweep |

### Custom Scrollbar

A styled scrollbar utility class `.custom-scroll-area` is provided. The scrollbar thumb is invisible by default and appears on hover or when the `.scrolling` class is toggled (via JavaScript).

---

## Fonts & Typography

Three Google Fonts are loaded via `next/font/google` in `src/app/layout.tsx` and exposed as CSS variables:

| Variable | Font | Usage |
|---|---|---|
| `--font-sans` | **Inter** | Default body/UI text |
| `--font-poppins` | **Poppins** | Alternative headings / display text |
| `--font-bricolage` | **Bricolage Grotesque** | Hero headings and large display text |

Apply them in Tailwind via `font-sans`, or directly via CSS:

```css
.my-heading {
  font-family: var(--font-bricolage);
}
```

---

## Theme System (Dark / Light Mode)

Theme management is handled by [next-themes](https://github.com/pacocoursey/next-themes).

**Setup:**
- `ThemeProvider` wraps the entire app in `src/app/layout.tsx`
- Configuration: `attribute="class"`, `defaultTheme="system"`, `enableSystem`
- The `dark` class is applied to the `<html>` element to activate dark mode CSS variables
- `suppressHydrationWarning` is set on `<html>` to prevent hydration mismatches

**Usage in components:**

```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
// theme: 'light' | 'dark' | 'system'
// setTheme('dark') — switch to dark mode
```

In Tailwind classes, use the `dark:` prefix:
```tsx
<div className="bg-white dark:bg-[#0D0B14]">...</div>
```

---

## Utility Library

### `cn()` — Class Name Helper (`src/lib/utils.ts`)

A simple utility that merges Tailwind classes safely, resolving conflicts:

```ts
import { cn } from '@/lib/utils';

// Merges classes, resolving Tailwind conflicts
<div className={cn('px-4 py-2', isActive && 'bg-purple-600', className)} />
```

It combines:
- **`clsx`** — conditionally joins class strings
- **`tailwind-merge`** — resolves Tailwind class conflicts (e.g., `p-2 p-4` → `p-4`)

---

## Key Dependencies

### Production

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.6 | React framework with App Router, SSR, and optimizations |
| `react` / `react-dom` | 19.2.4 | UI library |
| `framer-motion` | ^12 | Animations and transitions |
| `next-themes` | ^0.4.6 | Dark/light theme management |
| `lucide-react` | ^1.16.0 | Icon library (SVG-based) |
| `@tsparticles/react` | ^3.0.0 | Interactive particle/sparkle animations |
| `@tsparticles/slim` | ^3.8.1 | Lightweight tsParticles engine bundle |
| `clsx` | ^2.1.1 | Conditional class name joining |
| `tailwind-merge` | ^3.6.0 | Tailwind class conflict resolution |
| `tailwindcss-animate` | ^1.0.7 | Tailwind animation utilities |
| `tw-animate-css` | ^1.4.0 | Additional CSS animation presets |

### Development

| Package | Purpose |
|---|---|
| `typescript` | Static type checking |
| `tailwindcss` v4 | Utility-first CSS framework |
| `@tailwindcss/postcss` | PostCSS integration for Tailwind v4 |
| `eslint` + `eslint-config-next` | Linting with Next.js rules |
| `@types/react`, `@types/node` | TypeScript type definitions |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** (comes with Node.js) or **yarn** / **pnpm** / **bun**

### Installation

1. **Clone the repository** and navigate to the frontend:
   ```bash
   git clone <repo-url>
   cd TalklyAI/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app supports **Hot Module Replacement (HMR)** — any file change will automatically update the browser without a full reload.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Starts the Next.js dev server on `http://localhost:3000` |
| Build | `npm run build` | Creates an optimized production build |
| Start | `npm run start` | Starts the production server (requires `build` first) |
| Lint | `npm run lint` | Runs ESLint across the codebase |

---

## Environment & Configuration

### `next.config.ts`

```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.18.64.183'],
};
```

- **`allowedDevOrigins`**: Whitelists a specific IP for cross-origin dev access. This is useful when developing on a local network and testing from another device (e.g., mobile on the same Wi-Fi). Update this list if your local IP changes.

### `tsconfig.json` — Path Aliases

The `@/` path alias maps to `src/`:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Use it in imports instead of relative paths:
```ts
// ✅ Recommended
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/dashboard/Sidebar';

// ❌ Avoid
import { cn } from '../../lib/utils';
```

### TypeScript Config Highlights

- **`strict: true`** — All strict type checks are enabled
- **`target: ES2017`** — Compatible with modern browsers
- **`moduleResolution: bundler`** — Optimized for Next.js / Vite-style bundlers
- **`incremental: true`** — Uses `tsconfig.tsbuildinfo` to speed up type-checking across builds

---

## Development Guidelines

### Component Conventions

- All interactive components that use hooks (`useState`, `useEffect`, `useRouter`, etc.) must have `'use client';` at the top.
- Server Components (default in App Router) do **not** need this directive.
- Keep components focused: one responsibility per file.

### Adding a New Page

1. Create a folder inside `src/app/` following the Next.js App Router convention.
2. Add a `page.tsx` file (this is the route entry point).
3. To add it to the sidebar, update the `mainNav`, `secondaryNav`, or `bottomNav` arrays in `src/components/dashboard/Sidebar.tsx`.

**Example — adding `/reports`:**
```
src/app/(root)/reports/page.tsx
```
```tsx
// src/app/(root)/reports/page.tsx
export default function ReportsPage() {
  return <div>Reports</div>;
}
```
```ts
// src/components/dashboard/Sidebar.tsx
const mainNav = [
  { name: 'Reports', icon: BarChart2, href: '/reports' },
  // ...
];
```

### Adding a New Component

1. Place reusable UI primitives in `src/components/ui/`.
2. Place page-specific section components under `src/components/landing/` or `src/components/dashboard/`.
3. Use the `cn()` helper from `@/lib/utils` for all dynamic class merging.

### Styling Best Practices

- Prefer Tailwind utility classes over inline styles.
- Use `dark:` variants for all color utilities to support both themes.
- Use the `cn()` helper when combining conditional classes.
- For complex, repeated patterns, define them in `globals.css` using `@layer base` or `@layer utilities`.

---

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy is via [Vercel](https://vercel.com), the team behind Next.js:

1. Push the repository to GitHub / GitLab / Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Set the **Root Directory** to `frontend` (since this is a monorepo).
4. Vercel auto-detects Next.js and configures the build.
5. Click **Deploy** — your app will be live in minutes.

### Manual / Self-Hosted

```bash
# 1. Build the production bundle
npm run build

# 2. Start the production server
npm run start
```

The app listens on port `3000` by default. Use a reverse proxy (e.g., Nginx) to serve it on port 80/443.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) — Full App Router docs, data fetching, and deployment guides.
- [React 19 Docs](https://react.dev) — New React features including Server Components and Actions.
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) — Updated utility classes and configuration.
- [Framer Motion Docs](https://www.framer.com/motion/) — Animation API reference.
- [next-themes](https://github.com/pacocoursey/next-themes) — Theme management for Next.js.
- [Lucide Icons](https://lucide.dev/icons/) — Browse all available icons.
