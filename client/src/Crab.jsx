import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { playCrabWheeeSound } from './crabSound'

const CRAB_COLOR = '#e85d04'
const CRAB_DARK = '#d00000'
const CRAB_SCALE = 3

export function Crab({ position = [0, 0, 0], speed = 1, onInteract }) {
  const [showHeart, setShowHeart] = useState(false)
  const [pos, setPos] = useState(() => [...position])
  const [rotationY, setRotationY] = useState(0)
  const jumpPhaseRef = useRef(0)
  const jumpStartRef = useRef(null)
  const phaseRef = useRef(Math.random() * Math.PI * 2)
  const [bx, by, bz] = position

  const handleClick = (e) => {
    e.stopPropagation()
    if (jumpPhaseRef.current > 0) return
    playCrabWheeeSound()
    onInteract?.()
    jumpPhaseRef.current = 0.001
    jumpStartRef.current = { x: pos[0], z: pos[2], rot: rotationY }
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 1500)
  }

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const t = state.clock.elapsedTime
    const phase = phaseRef.current

    if (jumpPhaseRef.current > 0) {
      const jumpDuration = 1.2
      const nextPhase = Math.min(jumpPhaseRef.current + d / jumpDuration, 1)
      jumpPhaseRef.current = nextPhase
      const jumpT = nextPhase

      if (jumpStartRef.current) {
        const { x, z, rot } = jumpStartRef.current
        const height = 4 * Math.sin(jumpT * Math.PI)
        setPos([x, by + height, z])
        setRotationY(rot + jumpT * Math.PI * 2)
      }

      if (nextPhase >= 1) {
        jumpPhaseRef.current = 0
        jumpStartRef.current = null
      }
      return
    }

    const scuttle = Math.sin(t * 2 * speed + phase) * (3 / CRAB_SCALE)
    const bounce = Math.abs(Math.sin(t * 4 * speed + phase)) * 0.08
    setPos([bx + scuttle, by + bounce, bz])
    setRotationY(scuttle > 0 ? 0 : Math.PI)
  })

  return (
    <group position={pos} rotation={[0, rotationY, 0]} scale={CRAB_SCALE}>
      <group
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
        castShadow
      >
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.35]} />
          <meshStandardMaterial color={CRAB_COLOR} />
        </mesh>
        <mesh position={[-0.35, 0.25, -0.12]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.2, 0.08, 0.15]} />
          <meshStandardMaterial color={CRAB_COLOR} />
        </mesh>
        <mesh position={[-0.35, 0.25, 0.12]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.2, 0.08, 0.15]} />
          <meshStandardMaterial color={CRAB_COLOR} />
        </mesh>
        <mesh position={[-0.48, 0.22, -0.12]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={CRAB_DARK} />
        </mesh>
        <mesh position={[-0.48, 0.22, 0.12]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={CRAB_DARK} />
        </mesh>
        <mesh position={[0.2, 0.35, -0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.08, 6]} />
          <meshStandardMaterial color={CRAB_COLOR} />
        </mesh>
        <mesh position={[0.2, 0.35, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.08, 6]} />
          <meshStandardMaterial color={CRAB_COLOR} />
        </mesh>
        <mesh position={[0.25, 0.38, -0.1]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.25, 0.38, 0.1]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {[[-0.15, -0.2], [-0.05, -0.22], [0.05, -0.2], [0.15, -0.18]].map(([zx, zz], i) => (
          <group key={i}>
            <mesh position={[zx, 0.08, zz]} rotation={[0.5, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
              <meshStandardMaterial color={CRAB_COLOR} />
            </mesh>
            <mesh position={[zx, 0.08, -zz]} rotation={[0.5, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
              <meshStandardMaterial color={CRAB_COLOR} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      {showHeart && (
        <Html position={[0, 1.2, 0]} center>
          <span style={{ fontSize: '1.5rem', animation: 'crabHeartFloat 1.5s ease-out forwards' }}>❤️</span>
        </Html>
      )}
    </group>
  )
}
