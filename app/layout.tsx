import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ufitgo.ng'),
  title: {
    default: 'UfitGo — Discover & Compare Hajj & Umrah Packages',
    template: '%s | UfitGo'
  },
  description: 'UfitGo is a travel-tech marketplace where you can discover, compare and book Hajj and Umrah packages from verified travel operators. Explore options and choose with confidence.',
  keywords: ['Hajj', 'Umrah', 'Pilgrimage', 'Travel packages', 'Hajj agency Nigeria', 'Umrah deals', 'Islamic travel', 'Book Umrah online', 'UfitGo'],
  authors: [{ name: 'UfitGo' }],
  creator: 'UfitGo',
  generator: 'Powered by Betaday Losgistics',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://ufitgo.ng',
    title: 'UfitGo — Discover & Compare Hajj & Umrah Packages',
    description: 'Discover, compare, and book the best Hajj and Umrah packages from verified travel operators on UfitGo.',
    siteName: 'UfitGo',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: 'UfitGo - Hajj and Umrah Packages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UfitGo — Discover & Compare Hajj & Umrah Packages',
    description: 'Discover, compare, and book the best Hajj and Umrah packages from verified travel operators.',
    creator: '@UfitGo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f5ef',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${inter.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
