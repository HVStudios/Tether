// TODO: re-run this once node is on PATH to regenerate the PWA icons
// for the v3 atmospheric design. The committed PNGs in /public are
// still the old violet "T" — the in-browser favicon.svg is updated,
// but installed PWAs and iOS home-screen shortcuts pull from the PNGs.
// Run: `npm run icons` (or `node scripts/generate-icons.mjs`).

import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dir, '..', 'public')

// Tether v3 — atmospheric. "Golden" sky (sky #9) with the
// sun-over-horizon mark, matching the favicon and the in-app Mark.
const SKY_TOP = '#ee9a64'
const SKY_BOTTOM = '#f6c08a'
const INK = '#1f2433'

function makeSvg(size, { maskable = false } = {}) {
  // Maskable PWA icons need ~20% safe padding so the artwork survives
  // platform-specific masking (round, squircle, etc.).
  const inset = maskable ? size * 0.1 : 0
  const innerSize = size - inset * 2
  const radius = maskable ? innerSize * 0.22 : innerSize * 0.28
  const sunR = innerSize * 0.22
  const sunCx = inset + innerSize * 0.5
  const sunCy = inset + innerSize * 0.45

  const horizonY = inset + innerSize * 0.68
  // Slight upward curve on the horizon — matches the SVG mark in-app.
  const horizonPath = `
    M ${inset - 4} ${horizonY + innerSize * 0.04}
    Q ${inset + innerSize * 0.5} ${horizonY - innerSize * 0.05}
      ${inset + innerSize + 4} ${horizonY + innerSize * 0.04}
    L ${inset + innerSize + 4} ${inset + innerSize}
    L ${inset - 4} ${inset + innerSize} Z
  `.trim()

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${SKY_TOP}"/>
      <stop offset="100%" stop-color="${SKY_BOTTOM}"/>
    </linearGradient>
    <clipPath id="clip">
      <rect x="${inset}" y="${inset}" width="${innerSize}" height="${innerSize}" rx="${radius}"/>
    </clipPath>
  </defs>
  ${maskable ? `<rect width="${size}" height="${size}" fill="${SKY_TOP}"/>` : ''}
  <g clip-path="url(#clip)">
    <rect x="${inset}" y="${inset}" width="${innerSize}" height="${innerSize}" rx="${radius}" fill="url(#bg)"/>
    <path d="${horizonPath}" fill="${INK}" opacity="0.18"/>
    <circle cx="${sunCx}" cy="${sunCy}" r="${sunR}" fill="#ffffff" opacity="0.88"/>
  </g>
</svg>`
}

async function generate(size, filename, opts = {}) {
  const svg = Buffer.from(makeSvg(size, opts))
  await sharp(svg).png().toFile(join(publicDir, filename))
  console.log(`✓ ${filename} (${size}×${size})${opts.maskable ? ' · maskable' : ''}`)
}

await generate(192, 'pwa-192.png')
await generate(512, 'pwa-512.png', { maskable: true })
await generate(180, 'apple-touch-icon.png')
await generate(32,  'favicon-32.png')
console.log('Done.')
