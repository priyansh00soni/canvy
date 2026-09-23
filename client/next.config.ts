import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // konva's package ships a node build that optionally requires the
  // "canvas" native module. We never run Konva on the server (the stage is
  // loaded with ssr:false), so this only needs to be kept out of the
  // server webpack trace rather than actually installed.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('canvas')
    }
    return config
  },
}

export default nextConfig
