import { useLoader } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { useKeyboardMouseInput } from './util/useKeyboardMouseInput'

import { thirdPerson } from './util/thirdPerson'
import { Player } from './util/Player'

import Terrain from './Terrain/index.jsx'
import WorldCreatorTerrain from './Terrain/worldCreator'
import { Skybox } from './Skybox'

import world from '../../../public/maps/CustomTerrainShape/_bridge.json'

export default function Movement() {
  return (
    <Suspense fallback={null}>
      <Player
        useInput={useKeyboardMouseInput}
        useCamera={thirdPerson}
        color='blue'
        position={[0, 0, 0]}
        speed={10}
        height={3}
        world={world}
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
      {/* <fog attach='fog' args={['white', 0, 50]} /> */}
      {/* <Heightfield
        src='/highlands/heightmap-y.jpg'
        elementSize={(scale * 1) / 100}
        position={[-scale / 2, 0, scale / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      /> */}
      <Skybox />

      {/* <Terrain /> */}
      <WorldCreatorTerrain world={world} smart={false} />

      {/* <Plane
        receiveShadow
        rotation-x={-Math.PI / 2}
        position={[0, -0.5, 0]}
        args={[25.6, 16, 10, 10]}
        userData={{ terrain: true }}
      >
        <meshStandardMaterial map={texture} />
      </Plane> */}
    </>
  )
}
