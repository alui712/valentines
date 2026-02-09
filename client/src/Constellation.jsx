import { useState, useCallback, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'

const CEILING_Y = 41.5
const HEART_SCALE = 1.45
const HEART_CENTER_X = 0
const HEART_CENTER_Z = -8
const HEART_Z_OFFSET = -0.2

// Heart flattened onto ceiling (XZ plane at y=CEILING_Y)
function heartParam(t) {
  const hx = 16 * Math.pow(Math.sin(t), 3)
  const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  return [
    hx * HEART_SCALE + HEART_CENTER_X,
    CEILING_Y - 0.02,
    hy * HEART_SCALE + HEART_CENTER_Z + HEART_Z_OFFSET,
  ]
}

// 12 points with one at top (t=0) and one at bottom (t=PI) - no overlaps
const HEART_POINTS = (() => {
  const pts = []
  const tValues = [
    0, Math.PI / 6, (2 * Math.PI) / 6, (3 * Math.PI) / 6, (4 * Math.PI) / 6, (5 * Math.PI) / 6,
    Math.PI, // bottom center - single point
    (7 * Math.PI) / 6, (8 * Math.PI) / 6, (9 * Math.PI) / 6, (10 * Math.PI) / 6, (11 * Math.PI) / 6,
  ]
  for (const t of tValues) {
    pts.push(new THREE.Vector3(...heartParam(t)))
  }
  return pts
})()

// Click order starts from bottom of heart (index 6), then goes around
const CLICK_ORDER = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]

const GLOW_COLOR = '#ff6b9d'
const STAR_BASE_SIZE = 0.72
const STAR_HOVER_SCALE = 1.2

function BackgroundStar({ x, y, z, size, speed, phase }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current?.material) return
    const twinkle = 0.4 + 0.5 * Math.sin(state.clock.elapsedTime * speed + phase)
    ref.current.material.opacity = twinkle
  })
  return (
    <mesh ref={ref} position={[x, y, z]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color="#fffef5" transparent opacity={0.8} />
    </mesh>
  )
}

const BACKGROUND_STARS = (() => {
  const stars = []
  for (let i = 0; i < 280; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 70,
      y: CEILING_Y + (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 70,
      size: 0.03 + Math.random() * 0.1,
      speed: 1.5 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
    })
  }
  return stars
})()

function Star({ position, onClick, isActivated, index, allGlow, isNext, onPointerOver, onPointerOut }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const scale = hovered ? STAR_HOVER_SCALE : (isNext ? 1.2 : 1)

  useFrame((state) => {
    if (!meshRef.current?.material) return
    const twinkle = 0.7 + 0.3 * Math.sin(state.clock.elapsedTime * 3 + index)
    meshRef.current.material.opacity = twinkle
  })

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    onPointerOver?.()
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    onPointerOut?.()
  }

  const handleClick = (e) => {
    e.stopPropagation()
    onClick?.()
  }

  const HIT_RADIUS = STAR_BASE_SIZE * 3.2
  return (
    <group position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={meshRef}>
        <circleGeometry args={[STAR_BASE_SIZE, 32]} />
        <meshBasicMaterial
          color={allGlow ? GLOW_COLOR : (isActivated ? GLOW_COLOR : '#fff8dc')}
          transparent
          opacity={allGlow ? 1 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <circleGeometry args={[HIT_RADIUS, 16]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {(isActivated || allGlow) && (
        <mesh>
          <circleGeometry args={[STAR_BASE_SIZE * (allGlow ? 1.6 : 1.3), 24]} />
          <meshBasicMaterial
            color={GLOW_COLOR}
            transparent
            opacity={allGlow ? 0.5 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

export function Constellation({ onComplete }) {
  const [clickedOrder, setClickedOrder] = useState([])
  const allConnected = clickedOrder.length >= HEART_POINTS.length
  const groupRef = useRef()
  const completeCalledRef = useRef(false)

  useEffect(() => {
    if (allConnected && !completeCalledRef.current) {
      completeCalledRef.current = true
      onComplete?.()
    }
  }, [allConnected, onComplete])

  const handleStarClick = useCallback((index) => {
    setClickedOrder((prev) => {
      const nextExpected = CLICK_ORDER[prev.length]
      if (prev.includes(index)) return prev
      if (index !== nextExpected) return prev
      return [...prev, index]
    })
  }, [])

  const lineSegments = []
  for (let i = 0; i < clickedOrder.length - 1; i++) {
    lineSegments.push([HEART_POINTS[clickedOrder[i]], HEART_POINTS[clickedOrder[i + 1]]])
  }

  const firstStarPos = HEART_POINTS[CLICK_ORDER[0]]
  const arrowOffset = { x: 0, y: -2, z: 4 }

  return (
    <group ref={groupRef}>
      {/* Arrow pointing down to first star (bottom of heart) - hide once user has started */}
      {!allConnected && clickedOrder.length === 0 && (
        <Html
          position={[
            firstStarPos.x + arrowOffset.x,
            firstStarPos.y + arrowOffset.y,
            firstStarPos.z + arrowOffset.z,
          ]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              color: '#ff6b9d',
              textShadow: '0 0 12px rgba(255, 107, 157, 0.9)',
              transform: 'rotate(180deg)',
              animation: 'arrowBounce 1.2s ease-in-out infinite',
            }}
          >
            ↑
          </div>
        </Html>
      )}
      {/* Black ceiling panel - matches box top (70x70), seals the scene */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, CEILING_Y, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshBasicMaterial color="#050510" side={THREE.DoubleSide} />
      </mesh>
      {/* Twinkling background stars */}
      {BACKGROUND_STARS.map((s, i) => (
        <BackgroundStar key={i} {...s} />
      ))}
      {lineSegments.map(([start, end], i) => (
        <Line
          key={i}
          points={[start, end]}
          color={GLOW_COLOR}
          lineWidth={allConnected ? 4 : 3}
        />
      ))}
      {HEART_POINTS.map((pos, i) => (
        <Star
          key={i}
          position={pos}
          index={i}
          isActivated={clickedOrder.includes(i)}
          allGlow={allConnected}
          isNext={!allConnected && CLICK_ORDER[clickedOrder.length] === i}
          onClick={() => handleStarClick(i)}
        />
      ))}
      {allConnected && (
        <Html position={[HEART_CENTER_X, CEILING_Y - 0.5, HEART_CENTER_Z]} center>
          <div className="constellation-message">
            H + A
          </div>
        </Html>
      )}
    </group>
  )
}
