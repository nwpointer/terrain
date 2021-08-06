import React, { Suspense } from 'react'
import { Debug, Physics, usePlane, useBox } from '@react-three/cannon'
import { BackSide, DoubleSide } from 'three'
import * as CANNON from 'cannon-es'
import { Heightfield } from './terrain/Heightfield'
import { Spheres } from './Spheres'

export default function App() {
  const scale = 10
  return (
    <Physics>
      {/* <Debug> */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 3, 0]} castShadow />
      <Heightfield
        src='/highlands/heightmap-y.jpg'
        elementSize={(scale * 1) / 100}
        position={[-scale / 2, 0, scale / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* <Spheres rows={4} columns={4} spread={4} /> */}
      {/* </Debug> */}
    </Physics>
  )
}
