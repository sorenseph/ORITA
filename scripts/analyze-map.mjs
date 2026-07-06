import fs from 'fs'
const svg = fs.readFileSync('images/map-mexico.svg', 'utf8')
const coords = []
for (const m of svg.matchAll(/cx="([\d.]+)" cy="([\d.]+)"/g)) coords.push([+m[1], +m[2]])
for (const m of svg.matchAll(/M([\d.]+),([\d.]+)c1\.44/g)) coords.push([+m[1], +m[2]])
let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0
for (const [x, y] of coords) {
  minX = Math.min(minX, x); minY = Math.min(minY, y)
  maxX = Math.max(maxX, x); maxY = Math.max(maxY, y)
}
const pct = (x, y) => ({ x: +(((x - minX) / (maxX - minX)) * 100).toFixed(1), y: +(((y - minY) / (maxY - minY)) * 100).toFixed(1) })
console.log('bbox', { minX, minY, maxX, maxY, count: coords.length })
const pts = {
  gdl: [175, 195], bcs: [95, 115], oax: [230, 285], canc: [440, 240],
  pvr: [155, 165], teq: [165, 225], north: [175, 75], pac: [45, 185], gulf: [355, 200],
}
for (const [k, [x, y]] of Object.entries(pts)) console.log(k, pct(x, y))
