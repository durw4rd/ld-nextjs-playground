#!/bin/bash

echo "🧹 Cleaning development caches..."

# Kill any running Next.js processes
pkill -f "next dev" 2>/dev/null || true

# Clear Next.js cache
rm -rf .next

# Clear node_modules cache
rm -rf node_modules/.cache

# Clear TypeScript cache
rm -rf .tsbuildinfo

# Clear any other potential caches
find . -name ".DS_Store" -delete 2>/dev/null || true

echo "✅ Caches cleared!"
echo "🚀 Starting development server..."

# Start the development server
npm run dev 