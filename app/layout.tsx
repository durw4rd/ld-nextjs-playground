import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { LaunchDarklyProvider } from "@/components/LaunchDarklyProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LaunchDarkly Showcase",
  description: "Interactive demo and testing environment for LaunchDarkly feature flags",
  generator: 'v0.dev + Cursor'
}

// You'll need to replace this with your actual LaunchDarkly client-side ID
const LAUNCHDARKLY_CLIENT_SIDE_ID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID

// Check if observability plugins should be enabled
const ENABLE_OBSERVABILITY = process.env.NEXT_PUBLIC_ENABLE_OBSERVABILITY === 'true'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          CSP is only required when using LaunchDarkly observability plugins.
          This allows the plugins to:
          - Connect to LaunchDarkly observability servers
          - Create web workers for session replay
          
          Set NEXT_PUBLIC_ENABLE_OBSERVABILITY=true to enable observability features.
        */}
        {ENABLE_OBSERVABILITY && (
          <meta
            httpEquiv="Content-Security-Policy"
            content="connect-src 'self' https://*.launchdarkly.com https://pub.observability.app.launchdarkly.com https://otel.observability.app.launchdarkly.com; worker-src data: blob:;"
          />
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <LaunchDarklyProvider 
          clientSideID={LAUNCHDARKLY_CLIENT_SIDE_ID || ""}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </LaunchDarklyProvider>
      </body>
    </html>
  )
}
