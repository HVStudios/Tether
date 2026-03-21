import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dir, '..', 'public')

// Simple violet rounded square SVG with a "T"
function makeSvg(size) {
  const r = size * 0.2
  const pad = size * 0.15
  const fontSize = size * 0.55
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#7c3aed"/>
  <text
    x="50%" y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="system-ui, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="white"
    letter-spacing="-2"
  >T</text>
</svg>`
}

async function generate(size, filename) {
  const svg = Buffer.from(makeSvg(size))
  await sharp(svg).png().toFile(join(publicDir, filename))
  console.log(`✓ ${filename}`)
}

await generate(192, 'pwa-192.png')
await generate(512, 'pwa-512.png')
await generate(180, 'apple-touch-icon.png')
console.log('Icons generated.')
