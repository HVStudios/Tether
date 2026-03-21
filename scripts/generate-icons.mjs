import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dir, '..', 'public')

function makeSvg(size) {
  const r = size * 0.25          // corner radius
  const barH = size * 0.125     // T bar height
  const barY = size * 0.265     // T bar top
  const barX = size * 0.218     // T bar left/right margin
  const stemW = size * 0.125    // T stem width
  const stemX = (size - stemW) / 2
  const stemBottom = size * 0.735

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#c026d3"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <rect width="${size}" height="${size / 2}" rx="${r}" fill="url(#shine)"/>
  <rect x="${barX}" y="${barY}" width="${size - barX * 2}" height="${barH}" rx="${barH / 2}" fill="white"/>
  <rect x="${stemX}" y="${barY}" width="${stemW}" height="${stemBottom - barY}" rx="${stemW / 2}" fill="white"/>
</svg>`
}

async function generate(size, filename) {
  const svg = Buffer.from(makeSvg(size))
  await sharp(svg).png().toFile(join(publicDir, filename))
  console.log(`✓ ${filename} (${size}×${size})`)
}

await generate(192, 'pwa-192.png')
await generate(512, 'pwa-512.png')
await generate(180, 'apple-touch-icon.png')
await generate(32,  'favicon-32.png')
console.log('Done.')
