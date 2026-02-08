import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 25
const DURATION = 800
const BASE_SPEED = 1.2

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
  return new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false })
}

export function HeartExplosion({ position, duration = DURATION, onComplete }) {
  const groupRef = useRef()
  const startTime = useRef(Date.now())
  const completedRef = useRef(false)

  const heartGeometry = useMemo(createHeartGeometry, [])
  useEffect(() => () => heartGeometry.dispose(), [heartGeometry])

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.3) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(BASE_SPEED * (0.6 + Math.random() * 0.8)),
    }))
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const elapsed = Date.now() - startTime.current
    const progress = elapsed / duration

    if (progress >= 1) {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
      return
    }

    const children = groupRef.current.children
    particles.forEach((p, i) => {
      if (!children[i]) return
      const mesh = children[i]
      mesh.position.x += p.velocity.x * 0.016
      mesh.position.y += p.velocity.y * 0.016
      mesh.position.z += p.velocity.z * 0.016
      const scale = 1 - progress
      mesh.scale.setScalar(0.08 * scale)
      if (mesh.material) {
        mesh.material.opacity = 1 - progress
      }
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {particles.map((_, i) => (
        <mesh key={i} scale={0.08} geometry={heartGeometry}>
          <meshBasicMaterial
            color="#ff6b9d"
            transparent
            opacity={1}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
