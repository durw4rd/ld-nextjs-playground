# LaunchDarkly Next.js Playground

Interactive demo and testing environment for LaunchDarkly feature flags.

## Development

### Quick Start

```bash
npm install
npm run dev
```

### Development Scripts

- `npm run dev` - Start development server
- `npm run dev:clean` - Clear all caches and restart development server
- `npm run dev:hard` - Force clear caches and restart (alternative to dev:clean)
- `npm run type-check` - Run TypeScript type checking
- `npm run build` - Build for production
- `npm run start` - Start production server

### Troubleshooting Development Issues

If you're experiencing issues with changes not showing up:

1. **Clear all caches:**
   ```bash
   npm run dev:clean
   ```

2. **Force restart with cache clearing:**
   ```bash
   npm run dev:hard
   ```

3. **Check for TypeScript errors:**
   ```bash
   npm run type-check
   ```

4. **Manual cache clearing:**
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   npm run dev
   ```

### Configuration

The app is configured for optimal development experience with:
- Cache clearing on development restarts
- TypeScript strict checking
- Hot reloading enabled
- Development-specific optimizations

## Features

- Real-time LaunchDarkly connection monitoring
- Feature flag demonstration and testing
- Streaming connection status detection
- Comprehensive observability panel
- Traffic simulation tools 