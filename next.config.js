const path = require('path')
const fs = require('fs')

let prodEnv = {}
try {
  const dotenv = require('dotenv')
  const envProdPath = path.resolve(__dirname, '.env.production')
  if (fs.existsSync(envProdPath)) {
    prodEnv = dotenv.parse(fs.readFileSync(envProdPath, 'utf8'))
  }
} catch (e) {
  // Ignore if dotenv or .env.production is unavailable
}

const cleanEnvVal = (val) => {
  if (!val) return ''
  const trimmed = String(val).trim().replace(/^["']+|["']+$/g, '')
  return trimmed === '>' ? '' : trimmed
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  env: {
    NEXT_PUBLIC_DISCORD_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_DISCORD_LINK ?? process.env.NEXT_PUBLIC_DISCORD_LINK),
    NEXT_PUBLIC_GOODLE_DRIVE_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_GOODLE_DRIVE_LINK ?? process.env.NEXT_PUBLIC_GOODLE_DRIVE_LINK),
    NEXT_PUBLIC_MEDIAFIRE_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_MEDIAFIRE_LINK ?? process.env.NEXT_PUBLIC_MEDIAFIRE_LINK),
    NEXT_PUBLIC_MEGA_LINK: cleanEnvVal(prodEnv.NEXT_PUBLIC_MEGA_LINK ?? process.env.NEXT_PUBLIC_MEGA_LINK),
  },
}

module.exports = nextConfig



