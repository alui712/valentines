import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Tracer - A thin laser beam from camera to hit point.
 * Uses a very thin cylinder so it looks like a line, not a blob.
 */
export function Tracer({ start, end, color = '#ff6b9d', duration = 200, onComplete }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const startTime = useRef(Date.now())
  const completedRef = useRef(false)

  const { midpoint, quaternion, length } = useMemo(() => {
    if (!Array.isArray(start) || !Array.isArray(end) || start.length < 3 || end.length < 3) {
      return { midpoint: new THREE.Vector3(), quaternion: new THREE.Quaternion(), length: 0 }
    }
    const s = new THREE.Vector3(start[0], start[1], start[2])
    const e = new THREE.Vector3(end[0], end[1], end[2])
    const dir = new THREE.Vector3().subVectors(e, s)
    const len = dir.length()
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
    const q = new THREE.Quaternion()
    if (len > 0.001) {
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    }
    return { midpoint: mid, quaternion: q, length: len }
  }, [start, end])

  useFrame(() => {
    if (!meshRef.current) return
    const elapsed = Date.now() - startTime.current
    const progress = elapsed / duration

    if (progress >= 1) {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
      return
    }

    const fadeStart = 0.5
    let opacity = 1
    if (progress > fadeStart) {
      opacity = 1 - (progress - fadeStart) / (1 - fadeStart)
    }
    meshRef.current.material.opacity = opacity * 0.5
    if (glowRef.current) glowRef.current.material.opacity = opacity * 0.12
  })

  if (length < 0.001) return null

  return (
    <group position={midpoint} quaternion={quaternion}>
      {/* Outer glow - subtle */}
      <mesh ref={glowRef} renderOrder={1}>
        <cylinderGeometry args={[0.006, 0.006, length, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* Core beam - thin and subtle */}
      <mesh ref={meshRef} renderOrder={2}>
        <cylinderGeometry args={[0.002, 0.002, length, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
