import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function HeightmapGeometry({ heights, elementSize, ...rest }) {
  const ref = useRef()

  useEffect(() => {
    const dx = elementSize
    const dy = elementSize

    /* Create the vertex data from the heights. */
    const vertices = heights.flatMap((row, i) =>
      row.flatMap((z, j) => [i * dx, j * dy, z])
    )

    /* Create the faces. */
    const indices = []
    for (let i = 0; i < heights.length - 1; i++) {
      for (let j = 0; j < heights[i].length - 1; j++) {
        const stride = heights[i].length
        const index = i * stride + j
        indices.push(index + 1, index + stride, index + stride + 1)
        indices.push(index + stride, index + 1, index)
      }
    }

    ref.current.setIndex(indices)
    ref.current.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    ref.current.computeFaceNormals()
    ref.current.computeVertexNormals()

    ref.current.computeBoundingBox()
    ref.current.computeBoundingSphere()
  }, [heights])

  return <bufferGeometry {...rest} ref={ref} />
}
