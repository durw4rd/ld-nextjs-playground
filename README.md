# LaunchDarkly Showcase

An interactive demo and testing environment for LaunchDarkly feature flags built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Feature Flag Management** - Create, toggle, and monitor feature flags
- 📊 **Real-time Metrics** - Live analytics and performance insights
- 🎯 **Traffic Simulation** - Simulate user traffic and flag evaluations
- 👁️ **Observability Panel** - Monitor system health and performance
- 🌙 **Dark Mode Support** - Built-in theme switching
- 📱 **Responsive Design** - Mobile-first approach

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ld-nextjs-playground
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ld-nextjs-playground/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (server component)
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── home-page-client.tsx
│   ├── app-header.tsx
│   ├── stats-overview.tsx
│   ├── feature-flag-controls.tsx
│   ├── metrics-dashboard.tsx
│   └── error-boundary.tsx
├── hooks/                 # Custom React hooks
│   └── use-mobile.tsx
├── lib/                   # Utility functions
│   └── utils.ts
└── public/                # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 