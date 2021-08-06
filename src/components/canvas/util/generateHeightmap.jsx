/* Generates a 2D array using Worley noise. */
function generateHeightmap({ width, height, number, scale }) {
  const data = []

  const seedPoints = []
  for (let i = 0; i < number; i++) {
    seedPoints.push([Math.random(), Math.random()])
  }

  let max = 0
  for (let i = 0; i < width; i++) {
    const row = []
    for (let j = 0; j < height; j++) {
      let min = Infinity
      seedPoints.forEach((p) => {
        const distance2 = (p[0] - i / width) ** 2 + (p[1] - j / height) ** 2
        if (distance2 < min) {
          min = distance2
        }
      })
      const d = Math.sqrt(min)
      if (d > max) {
        max = d
      }
      row.push(d)
    }
    data.push(row)
  }

  /* Normalize and scale. */
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      data[i][j] *= scale / max
    }
  }
  return data
}
