import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LEVI-AUT — Intelligent operations, beautifully controlled',
  description: 'A premium command center for the next generation of autonomous work.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>
}
