import { useState, useEffect } from 'react'
import pixels from 'image-pixels'
import { scaleLinear } from 'd3-scale'
import { splitArray } from './Heightfield'

export default function useHeights(src, scale = 20, offset = 0) {
  const [heights, setHeights] = useState()

  useEffect(() => {
    ;(async function () {
      const { data, width, height } = await pixels(src)

      var y = scaleLinear().domain([0, 255]).range([offset, scale])
      const r = []
      for (var i = 0; i < width * height * 4; i += 4) r.push(y(data[i]))
      const matrix = splitArray(r, width)

      setHeights(matrix)
    })()
  }, [])

  return heights
}
