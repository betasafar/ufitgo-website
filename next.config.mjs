/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/wallet',
        destination: '/bookings',
        permanent: true,
      },
      {
        source: '/wallet/:path*',
        destination: '/bookings',
        permanent: true,
      },
      {
        source: '/transactions',
        destination: '/bookings',
        permanent: true,
      },
      {
        source: '/exchange/:path*',
        destination: '/bookings',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
