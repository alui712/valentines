import * as THREE from 'three'

const UMBRELLA_COLOR = '#ff6b9d'
const POLE_COLOR = '#8b4513'
const CHAIR_FRAME = '#2c1810'
const CHAIR_STRIPE = '#ffb3d9'

export function BeachUmbrella({ position = [0, 0, 0], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Pole */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 2.4, 8]} />
        <meshStandardMaterial color={POLE_COLOR} />
      </mesh>
      {/* Umbrella canopy - cone */}
      <mesh position={[0, 2.6, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1, 0.8, 8]} />
        <meshStandardMaterial color={UMBRELLA_COLOR} />
      </mesh>
      {/* Pole tip */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={UMBRELLA_COLOR} />
      </mesh>
      {/* Beach chair - simple low-poly */}
      <group position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.1, 1.4, 0.5]} />
          <meshStandardMaterial color={CHAIR_FRAME} />
        </mesh>
        <mesh position={[0, 0.5, 0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.08, 1.1, 0.03]} />
          <meshStandardMaterial color={CHAIR_STRIPE} />
        </mesh>
        <mesh position={[-0.25, -0.35, 0.15]}>
          <boxGeometry args={[0.06, 0.5, 0.06]} />
          <meshStandardMaterial color={CHAIR_FRAME} />
        </mesh>
        <mesh position={[0.25, -0.35, 0.15]}>
          <boxGeometry args={[0.06, 0.5, 0.06]} />
          <meshStandardMaterial color={CHAIR_FRAME} />
        </mesh>
      </group>
    </group>
  )
}
