import { useLoader } from '@react-three/fiber'
import { DoubleSide, TextureLoader } from 'three'

export function Skybox({ fog }) {
  const colors = useLoader(
    TextureLoader,
    '/uploads_files_812442_HdriFree/DayInTheClouds4k.png'
  )
  return (
    <mesh rotation={[0, Math.PI / 2, 0]}>
      <sphereBufferGeometry args={[900, 300, 300]} />
      <meshBasicMaterial fog={fog} map={colors} side={DoubleSide} />
    </mesh>
  )
}
