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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
