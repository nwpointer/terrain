import React, { useState, useEffect } from 'react'
import pixels from 'image-pixels'
import { scaleLinear } from 'd3-scale'
import { DrawHeightfield } from './DrawHeightfield'

export function splitArray(array, part) {
  var tmp = []
  for (var i = 0; i < array.length; i += part) {
    tmp.push(array.slice(i, i + part))
  }
  return tmp
}

export function Heightfield(props) {
  const [heights, setHeights] = useState()

  useEffect(() => {
    // setHeights(
    //   generateHeightmap({
    //     width: 1000,
    //     height: 1000,
    //     number: 100,
    //     scale: 1,
    //   })
    // )
    ;(async function () {
      const { data, width, height } = await pixels(props.src)
      // console.log(data, width, height)
      var y = scaleLinear().domain([0, 255]).range([0, 20])
      const r = []
      for (var i = 0; i < width * height * 4; i += 4) {
        r.push(y(data[i]))
      }
      const matrix = splitArray(r, width)

      setHeights(matrix)
    })()
  }, [])

  if (heights) return <DrawHeightfield heights={heights} {...props} />
  return null
}
