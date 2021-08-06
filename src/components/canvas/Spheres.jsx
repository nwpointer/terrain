import React, { useMemo } from 'react'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'

export function Spheres({ rows, columns, spread }) {
  const number = rows * columns
  const [ref] = useSphere((index) => ({
    mass: 1,
    position: [
      ((index % columns) - (columns - 1) / 2) * spread + 50,
      2.0 + 50,
      (Math.floor(index / columns) - (rows - 1) / 2) * spread - 31,
    ],
    args: 0.2,
  }))
  const colors = useMemo(() => {
    const array = new Float32Array(number * 3)
    const color = new THREE.Color()
    for (let i = 0; i < number; i++)
      color
        .set('blue')
        .convertSRGBToLinear()
        .toArray(array, i * 3)
    return array
  }, [number])

  return (
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      args={[null, null, number]}
    >
      <sphereBufferGeometry args={[0.2, 16, 16]}>
        <instancedBufferAttribute
          attachObject={['attributes', 'color']}
          args={[colors, 3]}
        />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}
