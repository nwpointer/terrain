import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Preload,
  Box,
  Plane,
  softShadows,
} from '@react-three/drei'
import { A11yUserPreferences } from '@react-three/a11y'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'

const LControl = () => {
  const dom = useStore((state) => state.dom)
  const control = useRef(null)

  useEffect(() => {
    if (control) {
      dom.current.style['touch-action'] = 'none'
    }
  }, [dom, control])
  return <OrbitControls ref={control} domElement={dom.current} />
}
const LCanvas = ({ children }) => {
  const dom = useStore((state) => state.dom)

  return (
    <Canvas
      gl={
        {
          // physicallyCorrectLights: true,
          // toneMappingExposure: Math.pow(0.7, 5.0),
        }
      }
      onCreated={(state) => state.events.connect(dom.current)}
      shadows
      camera={{ position: [0, 200, 5], fov: 50, far: 3000 }}
    >
      <LControl />
      {/* <ambientLight intensity={0.1} /> */}
      {/* <directionalLight intensity={0.4} castShadow position={[2.5, 8, 5]} /> */}
      <A11yUserPreferences>
        <Preload all />
        {children}
      </A11yUserPreferences>
    </Canvas>
  )
}

export default LCanvas
