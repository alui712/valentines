import { useState, useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playRocketLaunchSound, playFireworkExplodeSound } from './fireworkSound'

const FIREWORK_COLORS = ['#ff6b9d', '#ffd700', '#00d4ff']
const PARTICLE_COUNT = 40
const ROCKET_SPEED = 15
const GRAVITY = -8

function FireworkParticles({ position, color, onComplete }) {
  const meshRef = useRef()
  const particlesRef = useRef([])
  const velocitiesRef = useRef([])
  const startTimeRef = useRef(null)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = []
    const spread = 4
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.5
      const speed = 3 + Math.random() * 6
      const vx = Math.sin(phi) * Math.cos(theta) * speed
      const vy = Math.cos(phi) * speed
      const vz = Math.sin(phi) * Math.sin(theta) * speed
      velocities.push({ x: vx, y: vy, z: vz })
      positions[i * 3] = (Math.random() - 0.5) * 0.5
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
    }
    meshRef.current.geometry.attributes.position.array = positions
    meshRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current = meshRef.current.geometry.attributes.position.array
    velocitiesRef.current = velocities
    startTimeRef.current = null
    hasCompletedRef.current = false
  }, [position])

  useFrame((state, delta) => {
    if (!meshRef.current || !velocitiesRef.current.length) return
    if (!startTimeRef.current) startTimeRef.current = state.clock.elapsedTime

    const t = state.clock.elapsedTime - startTimeRef.current
    if (t > 2 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete?.()
      return
    }
    if (t > 2) return

    const positions = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = velocitiesRef.current[i]
      positions[i * 3] += v.x * delta
      positions[i * 3 + 1] += (v.y + GRAVITY * t * 0.5) * delta
      positions[i * 3 + 2] += v.z * delta
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={new Float32Array(PARTICLE_COUNT * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color={color}
        transparent
        opacity={0.95}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}

function Rocket({ id, startPos, targetY, color, onExplode }) {
  const groupRef = useRef()
  const hasExploded = useRef(false)

  useFrame((state, delta) => {
    if (!groupRef.current || hasExploded.current) return
    const pos = groupRef.current.position
    if (pos.y >= targetY) {
      hasExploded.current = true
      onExplode(new THREE.Vector3(pos.x, pos.y, pos.z), color)
    } else {
      pos.y += ROCKET_SPEED * delta
    }
  })

  return (
    <group ref={groupRef} position={[startPos.x, startPos.y, startPos.z]}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.05, 0.2, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function Fireworks({ dayTime }) {
  const [rockets, setRockets] = useState([])
  const [explosions, setExplosions] = useState([])
  const nextLaunchRef = useRef(0)
  const clockRef = useRef(0)
  const explodedIdsRef = useRef(new Set())

  useFrame((state) => {
    if (dayTime < 0.8) return
    clockRef.current = state.clock.elapsedTime
    if (clockRef.current >= nextLaunchRef.current) {
      const x = (Math.random() - 0.5) * 40
      const z = (Math.random() - 0.5) * 30
      const targetY = 8 + Math.random() * 12
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
      playRocketLaunchSound()
      setRockets((prev) => [
        ...prev,
        {
          id: Math.random(),
          start: new THREE.Vector3(x, -5, z),
          targetY,
          color,
        },
      ])
      nextLaunchRef.current = clockRef.current + 1 + Math.random()
    }
  })

  const handleExplode = useCallback((rocketId, position, color) => {
    if (explodedIdsRef.current.has(rocketId)) return
    explodedIdsRef.current.add(rocketId)
    playFireworkExplodeSound()
    const pos = [position.x, position.y, position.z]
    setExplosions((prev) => [
      ...prev,
      { id: Math.random(), position: pos, color },
    ])
    setRockets((prev) => prev.filter((r) => r.id !== rocketId))
  }, [])

  const removeExplosion = useCallback((explosionId) => {
    setExplosions((prev) => prev.filter((e) => e.id !== explosionId))
  }, [])

  return (
    <>
      {rockets.map((r) => (
        <Rocket
          key={r.id}
          id={r.id}
          startPos={r.start}
          targetY={r.targetY}
          color={r.color}
          onExplode={(pos, col) => handleExplode(r.id, pos, col)}
        />
      ))}
      {explosions.map((e) => (
        <group key={e.id} position={e.position}>
          <FireworkParticles
            color={e.color}
            onComplete={() => removeExplosion(e.id)}
          />
        </group>
      ))}
    </>
  )
}
