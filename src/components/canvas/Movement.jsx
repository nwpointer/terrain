import useStore from '@/helpers/store'
import { useLoader } from '@react-three/fiber'
import { Plane, useEdgeSplit } from '@react-three/drei'
import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { useKeyboardMouseInput } from './util/useKeyboardMouseInput'
import { useGamePadInput } from './util/useGamePadInput'
import { Vector3 } from 'three'
import { ThirdPerson } from './util/thirdPerson'
import { Player } from './util/Player'

export default function Movement() {
  return (
    <Suspense fallback={null}>
      {/* <Player
        useInput={useGamePadInput}
        useCamera={thirdPerson}
        speed={5}
        color='red'
        position={[2, 0, 0]}
      /> */}
      <Player
        useInput={useKeyboardMouseInput}
        useCamera={thirdPerson}
        color='blue'
        position={[0, 0, 0]}
        speed={5}
      />
      <Scene />
    </Suspense>
  )
}

function Scene() {
  const texture = useLoader(
    THREE.TextureLoader,
    '/img/wp3571870-wallpaper-blue-grid.jpg'
  )

  return (
    <>
      <ambientLight intensity={1.5} />
      <fog attach='fog' args={['white', 0, 40]} />
      <Plane
        receiveShadow
        rotation-x={-Math.PI / 2}
        position={[0, -0.5, 0]}
        args={[25.6, 16, 10, 10]}
      >
        <meshStandardMaterial map={texture} />
      </Plane>
    </>
  )
}
