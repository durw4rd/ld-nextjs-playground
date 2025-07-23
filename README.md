# LaunchDarkly Showcase

An interactive demo and testing environment for LaunchDarkly feature flags built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Real LaunchDarkly Integration** - Actual feature flags powered by LaunchDarkly SDK
- 📊 **Feature Flag Management** - Create, toggle, and monitor feature flags
- 👤 **User Identification** - Identify users to see different flag variations
- 📈 **Real-time Metrics** - Live analytics and performance insights
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
- **Feature Flags**: LaunchDarkly React Web SDK
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- LaunchDarkly account (free tier available)

### LaunchDarkly Setup

1. **Create a LaunchDarkly Account**
   - Sign up at [launchdarkly.com](https://launchdarkly.com)
   - Create a new project

2. **Get Your Client-Side ID**
   - Go to your LaunchDarkly project settings
   - Copy the client-side ID from the SDK keys section

3. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local and add your LaunchDarkly client-side ID
   NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID=your-actual-client-side-id
   ```

4. **Create Feature Flags**
   - In your LaunchDarkly dashboard, create some feature flags
   - Example flags: `new-checkout-flow`, `premium-features`, `dark-mode`
   - Set targeting rules to see different variations

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

3. Configure LaunchDarkly (see setup above)

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Implementation Details

### LaunchDarkly Integration

This project uses the official LaunchDarkly React Web SDK with the `asyncWithLDProvider` pattern:

```typescript
// components/LaunchDarklyProvider.tsx
const provider = await asyncWithLDProvider({
  clientSideID,
  context: {
    kind: "user",
    key: "anonymous-user",
    name: "Anonymous User"
  },
  options: {
    bootstrap: 'localStorage',
    sendEvents: true,
    evaluationReasons: true
  }
})
```

### Available Hooks

The SDK provides these hooks for easy integration:

- `useFlags()` - Access all feature flags
- `useLDClient()` - Access the LaunchDarkly client
- `useLDClientError()` - Handle client errors

### User Context Management

```typescript
const ldClient = useLDClient()

// Identify a user
ldClient.identify({
  kind: "user",
  key: "user-123",
  name: "John Doe",
  email: "john@example.com"
})

// Track events
ldClient.track("button_clicked", { button: "checkout" })
```

## Usage

### LaunchDarkly Demo Tab
- **User Identification**: Change user context to see different flag variations
- **Feature Flags**: View real-time flag values for the current user
- **Event Tracking**: Track custom events to measure feature flag impact

### Feature Flags Tab
- **Mock Flags**: Simulate feature flag management (for demo purposes)
- **Flag Creation**: Create and toggle mock feature flags
- **Targeting Rules**: Configure different targeting strategies

### Metrics Tab
- **Real-time Analytics**: Monitor flag evaluations and conversions
- **Performance Insights**: Track latency and error rates
- **Flag Performance**: View conversion rates by feature flag

## Project Structure

```
ld-nextjs-playground/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with LaunchDarkly provider
│   ├── page.tsx           # Home page (server component)
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── LaunchDarklyProvider.tsx  # LaunchDarkly SDK provider
│   ├── LaunchDarklyDemo.tsx      # LaunchDarkly demo component
│   ├── HomePageClient.tsx
│   ├── AppHeader.tsx
│   ├── StatsOverview.tsx
│   ├── FeatureFlagControls.tsx
│   ├── MetricsDashboard.tsx
│   └── ErrorBoundary.tsx
├── hooks/                 # Custom React hooks
│   ├── useMobile.tsx
│   └── useToast.ts
├── lib/                   # Utility functions
│   └── utils.ts
└── public/                # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## LaunchDarkly Features Demonstrated

- ✅ **Official SDK Integration** - Using `asyncWithLDProvider`
- ✅ **User Context Management** - Identify and switch users
- ✅ **Real-time Flag Evaluation** - Live flag updates
- ✅ **Custom Event Tracking** - Track user interactions
- ✅ **Flag Variation Display** - Show current flag values
- ✅ **Error Handling & Loading States** - Graceful error handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 