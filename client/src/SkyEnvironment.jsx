import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BOX_SIZE = 70
const BOX_HEIGHT = 55
const BOX_OFFSET = 14

const NIGHT_FADE_START = 0.82
const NIGHT_FADE_END = 0.92

function createDaySkyTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, size, 0, 0)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(0.4, '#B0E0E6')
  gradient.addColorStop(0.7, '#ADD8E6')
  gradient.addColorStop(1, '#E0F4FF')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 12; i++) {
    const x = Math.random() * size
    const y = Math.random() * size * 0.7
    const w = 60 + Math.random() * 100
    const h = 25 + Math.random() * 40
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, w)
    gradient.addColorStop(0, 'rgba(255,255,255,0.6)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

function TwinklingStar({ x, y, z, size, speed, phase, fadeOpacity = 1 }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current?.material) return
    const twinkle = 0.3 + 0.6 * Math.sin(state.clock.elapsedTime * speed + phase)
    ref.current.material.opacity = twinkle * fadeOpacity
  })
  return (
    <mesh ref={ref} position={[x, y, z]} renderOrder={10}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial color="#fffef5" transparent opacity={0.9} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

const INSET = 2

function NightSkyStars({ wall, fadeOpacity = 1 }) {
  const stars = useMemo(() => {
    const list = []
    const count = 180
    const halfBox = BOX_SIZE / 2
    const halfHeight = BOX_HEIGHT / 2

    for (let i = 0; i < count; i++) {
      let x, y, z
      if (wall === 'left') {
        x = -halfBox + INSET
        y = (Math.random() - 0.5) * BOX_HEIGHT
        z = (Math.random() - 0.5) * BOX_SIZE
      } else if (wall === 'right') {
        x = halfBox - INSET
        y = (Math.random() - 0.5) * BOX_HEIGHT
        z = (Math.random() - 0.5) * BOX_SIZE
      } else if (wall === 'front') {
        x = (Math.random() - 0.5) * BOX_SIZE
        y = (Math.random() - 0.5) * BOX_HEIGHT
        z = halfBox - INSET
      } else if (wall === 'back') {
        x = (Math.random() - 0.5) * BOX_SIZE
        y = (Math.random() - 0.5) * BOX_HEIGHT
        z = -halfBox + INSET
      } else {
        x = (Math.random() - 0.5) * BOX_SIZE
        y = halfHeight - INSET
        z = (Math.random() - 0.5) * BOX_SIZE
      }
      list.push({
        x, y, z,
        size: 0.06 + Math.random() * 0.1,
        speed: 1.2 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return list
  }, [wall])

  return (
    <>
      {stars.map((s, i) => (
        <TwinklingStar key={`${wall}-${i}`} {...s} fadeOpacity={fadeOpacity} />
      ))}
    </>
  )
}

const sideMatProps = (texture) => ({
  map: texture,
  emissiveMap: texture,
  emissive: new THREE.Color(0.5, 0.5, 0.6),
  emissiveIntensity: 0.8,
  side: THREE.BackSide,
})

export function DaySky({ sideTexture }) {
  const cloudsTexture = useMemo(() => createDaySkyTexture(), [])
  const topMatProps = useMemo(() => ({
    map: cloudsTexture,
    side: THREE.BackSide,
    depthWrite: true,
  }), [cloudsTexture])
  const transparentMat = useMemo(() => ({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.BackSide,
  }), [])

  if (!sideTexture) return null

  const sideProps = sideMatProps(sideTexture)
  return (
    <group position={[0, BOX_OFFSET, 0]}>
      <mesh>
        <boxGeometry args={[BOX_SIZE, BOX_HEIGHT, BOX_SIZE]} />
        <meshStandardMaterial attach="material-0" {...sideProps} />
        <meshStandardMaterial attach="material-1" {...sideProps} />
        <meshBasicMaterial attach="material-2" {...topMatProps} />
        <meshStandardMaterial attach="material-3" {...sideProps} />
        <meshStandardMaterial attach="material-4" {...sideProps} />
        <meshStandardMaterial attach="material-5" {...sideProps} />
      </mesh>
    </group>
  )
}

function NightSkyOverlay({ timeOfDay }) {
  const opacity = useMemo(() => {
    if (timeOfDay <= NIGHT_FADE_START) return 0
    if (timeOfDay >= NIGHT_FADE_END) return 1
    return (timeOfDay - NIGHT_FADE_START) / (NIGHT_FADE_END - NIGHT_FADE_START)
  }, [timeOfDay])

  const blackMat = useMemo(() => ({
    color: '#050508',
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  }), [])

  if (opacity < 0.001) return null

  return (
    <group position={[0, BOX_OFFSET, 0]}>
      <mesh renderOrder={0}>
        <boxGeometry args={[BOX_SIZE, BOX_HEIGHT, BOX_SIZE]} />
        <meshBasicMaterial attach="material-0" {...blackMat} opacity={opacity} />
        <meshBasicMaterial attach="material-1" {...blackMat} opacity={opacity} />
        <meshBasicMaterial attach="material-2" {...blackMat} opacity={opacity} />
        <meshBasicMaterial attach="material-3" {...blackMat} opacity={opacity} />
        <meshBasicMaterial attach="material-4" {...blackMat} opacity={opacity} />
        <meshBasicMaterial attach="material-5" {...blackMat} opacity={opacity} />
      </mesh>
      <group renderOrder={2}>
        <NightSkyStars wall="left" fadeOpacity={opacity} />
        <NightSkyStars wall="right" fadeOpacity={opacity} />
        <NightSkyStars wall="front" fadeOpacity={opacity} />
        <NightSkyStars wall="back" fadeOpacity={opacity} />
        <NightSkyStars wall="top" fadeOpacity={opacity} />
      </group>
    </group>
  )
}

export function NightSky({ timeOfDay }) {
  return <NightSkyOverlay timeOfDay={timeOfDay} />
}
