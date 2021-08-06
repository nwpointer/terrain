import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Debug,
  Physics,
  useSphere,
  usePlane,
  useBox,
} from '@react-three/cannon'

function ScalableBall() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: 1,
    position: [0, 10, 0],
  }))

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color='blue' transparent opacity={0.5} />
    </mesh>
  )
}

function ScalableBox(params) {
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: params.type || 'Static',
    args: params.args || [1, 1, 1],
    position: params.position || [0, 5, 0],
  }))

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <boxBufferGeometry args={params.args} />
      <meshBasicMaterial color='blue' transparent opacity={0.5} />
    </mesh>
  )
}

function Plane(props) {
  const [ref] = usePlane(() => ({
    type: 'Static',
    args: [20, 20],
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }))
  return (
    <mesh receiveShadow ref={ref}>
      <planeBufferGeometry />
      <shadowMaterial color='#171717' />
    </mesh>
  )
}

export default function App() {
  return (
    <Physics>
      <Debug scale={1}>
        <ScalableBox type='Dynamic' position={[0, 10, 0]} />
        <ScalableBall />
        <ScalableBox position={[0, -10, 0]} args={[10, 0.1, 10]} />
      </Debug>
    </Physics>
  )
}

// import { Physics, usePlane, useBox, Debug } from '@react-three/cannon'
// import { DoubleSide } from 'three'

// export default function Test() {
//   return (
//     <Physics>
//       <Debug scale={1}>
//         <Cube />
//         <Plane position={[0, -1, 0]} />
//       </Debug>
//     </Physics>
//   )
// }

// function Plane(props) {
//   const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
//   return (
//     <mesh ref={ref}>
//       <planeBufferGeometry />
//       <meshBasicMaterial color='grey' side={DoubleSide} />
//     </mesh>
//   )
// }

// function Cube(props) {
//   const [ref] = useBox(() => ({ mass: 1, ...props }))
//   return (
//     <mesh ref={ref}>
//       <boxBufferGeometry />
//       <meshBasicMaterial color='grey' />
//     </mesh>
//   )
// }
