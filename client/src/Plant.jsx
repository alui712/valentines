import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Mystbloom palette: pastel pinks, purples, cyans, greens, yellows
const PLANT_COLORS = [
  '#ffb3d9', '#ffcce0', '#ff9ecd', '#ff6b9d',
  '#d4b8ff', '#c9a8ff', '#b399ff', '#a68bff',
  '#a8e6e6', '#b3f0f0', '#8dd9d9', '#7ec8c8',
  '#a8e6a1', '#98d4a8', '#88c898', '#7eb87e',
  '#fff4b8', '#ffeaa7', '#ffe08d', '#ffd970',
]

// Elastic ease-out: overshoots then settles
function elasticOut(t) {
  if (t === 0) return 0
  if (t === 1) return 1
  const p = 0.3
  const s = p / 4
  return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1
}

export function Plant({ position, type, stemColor, foliageColor, sizeScale = 1 }) {
  const groupRef = useRef()
  const startTime = useRef(null)

  useFrame((state) => {
    if (!groupRef.current) return
    if (startTime.current === null) startTime.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startTime.current
    const duration = 0.6
    const t = Math.min(elapsed / duration, 1)
    const scale = elasticOut(t) * sizeScale
    groupRef.current.scale.setScalar(scale)
  })

  return (
    <group ref={groupRef} position={position} scale={0}>
      {type === 'tree' ? (
        <LowPolyTree stemColor={stemColor} foliageColor={foliageColor} />
      ) : (
        <LowPolyFlower stemColor={stemColor} foliageColor={foliageColor} />
      )}
    </group>
  )
}

function LowPolyTree({ stemColor, foliageColor }) {
  const stemGeom = useMemo(() => new THREE.CylinderGeometry(0.06, 0.1, 0.5, 6), [])
  const leafGeom = useMemo(() => new THREE.ConeGeometry(0.4, 0.8, 6), [])

  return (
    <group>
      <mesh geometry={stemGeom} position={[0, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={stemColor} />
      </mesh>
      <mesh geometry={leafGeom} position={[0, 0.7, 0]} castShadow>
        <meshStandardMaterial color={foliageColor} />
      </mesh>
      <mesh geometry={leafGeom} position={[0.08, 0.9, 0.05]} scale={[0.6, 0.6, 0.6]} castShadow>
        <meshStandardMaterial color={foliageColor} />
      </mesh>
    </group>
  )
}

function LowPolyFlower({ stemColor, foliageColor }) {
  const stemGeom = useMemo(() => new THREE.CylinderGeometry(0.03, 0.05, 0.5, 6), [])
  const petalGeom = useMemo(() => new THREE.SphereGeometry(0.2, 8, 6), [])
  const centerGeom = useMemo(() => new THREE.SphereGeometry(0.1, 8, 6), [])

  return (
    <group>
      <mesh geometry={stemGeom} position={[0, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={stemColor} />
      </mesh>
      <mesh geometry={petalGeom} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color={foliageColor} />
      </mesh>
      <mesh geometry={centerGeom} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color="#fff4b8" />
      </mesh>
    </group>
  )
}

export function createPlantData(position) {
  const type = Math.random() < 0.5 ? 'tree' : 'flower'
  const colorPool = [...PLANT_COLORS]
  const stemColor = colorPool[Math.floor(Math.random() * colorPool.length)]
  let foliageColor = colorPool[Math.floor(Math.random() * colorPool.length)]
  while (foliageColor === stemColor && colorPool.length > 1) {
    foliageColor = colorPool[Math.floor(Math.random() * colorPool.length)]
  }
  const sizeScale = 0.7 + Math.random() * 0.6
  return {
    id: Math.random(),
    position: [...position],
    type,
    stemColor,
    foliageColor,
    sizeScale,
  }
}
