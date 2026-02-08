import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const HEART_SCALE = 2.5
const CLICKS_TO_BREAK = 10

function createHeartGeometry() {
  const shape = new THREE.Shape()
  const cx = 0.5, cy = 0.95
  shape.moveTo(cx, cy - 0.45)
  shape.bezierCurveTo(cx, cy - 0.45, cx - 0.1, cy - 0.95, cx - 0.5, cy - 0.95)
  shape.bezierCurveTo(cx - 1.1, cy - 0.95, cx - 1.1, cy - 0.25, cx - 1.1, cy - 0.25)
  shape.bezierCurveTo(cx - 1.1, cy + 0.15, cx - 0.85, cy + 0.59, cx, cy + 0.95)
  shape.bezierCurveTo(cx + 0.85, cy + 0.59, cx + 1.1, cy + 0.15, cx + 1.1, cy - 0.25)
  shape.bezierCurveTo(cx + 1.1, cy - 0.25, cx + 1.1, cy - 0.95, cx + 0.5, cy - 0.95)
  shape.bezierCurveTo(cx + 0.1, cy - 0.95, cx, cy - 0.45, cx, cy - 0.45)
  return new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 })
}

const HEART_CENTER = [0.5, 0.95, 0]

function createCrackPoints(index) {
  const [cx, cy] = HEART_CENTER
  const cracks = [
    [[cx, cy, 0], [cx + 0.35, cy - 0.2, 0], [cx + 0.5, cy - 0.4, 0]],
    [[cx, cy, 0], [cx - 0.3, cy + 0.25, 0], [cx - 0.5, cy + 0.5, 0]],
    [[cx, cy, 0], [cx + 0.2, cy + 0.4, 0], [cx + 0.35, cy + 0.65, 0]],
    [[cx, cy, 0], [cx - 0.4, cy - 0.1, 0], [cx - 0.55, cy - 0.35, 0]],
    [[cx, cy, 0], [cx + 0.4, cy + 0.15, 0], [cx + 0.6, cy + 0.25, 0]],
    [[cx, cy, 0], [cx - 0.25, cy + 0.35, 0], [cx - 0.4, cy + 0.6, 0]],
    [[cx, cy, 0], [cx - 0.35, cy - 0.25, 0], [cx - 0.5, cy - 0.5, 0]],
    [[cx, cy, 0], [cx + 0.25, cy - 0.35, 0], [cx + 0.45, cy - 0.6, 0]],
    [[cx, cy, 0], [cx - 0.2, cy - 0.4, 0], [cx - 0.35, cy - 0.65, 0]],
    [[cx, cy, 0], [cx + 0.3, cy + 0.2, 0], [cx + 0.55, cy + 0.4, 0]],
  ]
  return cracks[index % cracks.length].map(p => new THREE.Vector3(...p))
}

export function MegaHeart({ position, onBreak, onHit }) {
  const meshRef = useRef()
  const [hits, setHits] = useState(0)
  const [breaking, setBreaking] = useState(false)

  const heartGeometry = useMemo(createHeartGeometry, [])
  useEffect(() => () => heartGeometry.dispose(), [heartGeometry])

  const crackGeometries = useMemo(() => {
    return Array.from({ length: CLICKS_TO_BREAK }, (_, i) => {
      const points = createCrackPoints(i)
      return new THREE.BufferGeometry().setFromPoints(points)
    })
  }, [])

  useEffect(() => {
    return () => crackGeometries.forEach(g => g.dispose())
  }, [crackGeometries])

  const handleClick = (e) => {
    e.stopPropagation()
    if (breaking) return
    const next = hits + 1
    setHits(next)
    const hitData = {
      point: e.point?.toArray?.() ?? [0, 0, 0],
      cameraPosition: e.camera?.position?.toArray?.() ?? [0, 2, 5],
    }
    onHit?.(hitData)
    if (next >= CLICKS_TO_BREAK) {
      setBreaking(true)
      queueMicrotask(() => onBreak?.())
    }
  }

  const damageLevel = hits / CLICKS_TO_BREAK
  const crackOpacity = 0.4 + damageLevel * 0.5
  const heartColor = new THREE.Color().lerpColors(
    new THREE.Color('#ff6b9d'),
    new THREE.Color('#8b0000'),
    damageLevel * 0.5
  )

  return (
    <group position={position} rotation={[Math.PI, 0, 0]}>
      <mesh
        ref={meshRef}
        geometry={heartGeometry}
        scale={HEART_SCALE}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={heartColor}
          emissive="#ff1493"
          emissiveIntensity={0.4 - damageLevel * 0.2}
          transparent
          side={THREE.DoubleSide}
          roughness={0.3 + damageLevel * 0.4}
          metalness={0.1}
        />
      </mesh>
      {Array.from({ length: hits }, (_, i) => (
        <line key={i} geometry={crackGeometries[i]} scale={HEART_SCALE} position={[0, 0, 0.18]}>
          <lineBasicMaterial
            color="#2d0a0a"
            transparent
            opacity={crackOpacity}
          />
        </line>
      ))}
    </group>
  )
}
