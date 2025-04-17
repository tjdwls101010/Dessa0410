let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: '*.notion.so',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/notion',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src https://www.notion.so https://*.notion.so https://1c30ffd9516c801087baf57dd51e5cca.notion.site;",
          },
        ],
      },
      {
        source: '/ppt',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self';",
          },
        ],
      },
      {
        source: '/ppt_final',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self';",
          },
        ],
      },
    ]
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
