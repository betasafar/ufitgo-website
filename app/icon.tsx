import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          viewBox="-4 -3 40 40"
          width="32"
          height="32"
          fill="none"
        >
          {/* Bold Crescent Moon */}
          <path 
            d="M27 21 A 14 14 0 1 1 11 5 A 11 11 0 1 0 27 21 Z" 
            fill="#dcb232" 
          />
          {/* Massive Medina Dome */}
          <path 
            d="M10 29 V 17 C 10 9, 18 7, 18 2 C 18 7, 26 9, 26 17 V 29 Z" 
            fill="#115e59" 
          />
          {/* Dome Base */}
          <rect x="8" y="29" width="20" height="3" fill="#115e59" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
