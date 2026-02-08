import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BeachUmbrella } from './BeachUmbrella'

const BOX_SIZE = 70
const BOX_HEIGHT = 55
const SAND_COLOR = '#e8d5b7'

function createInfiniteOceanTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Ocean-to-sky gradient - like standing on a beach looking at the horizon
  const gradient = ctx.createLinearGradient(0, size, 0, 0)
  gradient.addColorStop(0, '#051c2c')      // Deep ocean
  gradient.addColorStop(0.15, '#0a3d5c')
  gradient.addColorStop(0.28, '#15618a')
  gradient.addColorStop(0.38, '#1e7fb3')
  gradient.addColorStop(0.48, '#2a9fd9')
  gradient.addColorStop(0.55, '#4ab8e8')
  gradient.addColorStop(0.62, '#7ecfee')
  gradient.addColorStop(0.68, '#a8e0f0')
  gradient.addColorStop(0.74, '#c8ebf5')
  gradient.addColorStop(0.8, '#b8dff0')
  gradient.addColorStop(0.86, '#87ceeb')
  gradient.addColorStop(0.92, '#6bb8e8')
  gradient.addColorStop(0.96, '#4aa3e0')
  gradient.addColorStop(1, '#2d8cd4')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  // Subtle horizontal bands for distant wave suggestion (very faint)
  ctx.globalAlpha = 0.08
  for (let i = 0; i < 12; i++) {
    const y = size * (0.15 + (i / 12) * 0.5)
    const bandGrad = ctx.createLinearGradient(0, y - 3, 0, y + 3)
    bandGrad.addColorStop(0, 'transparent')
    bandGrad.addColorStop(0.5, 'rgba(255,255,255,0.3)')
    bandGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = bandGrad
    ctx.fillRect(0, y - 4, size, 8)
  }
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

function createSandTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = SAND_COLOR
  ctx.fillRect(0, 0, size, size)
  const grains = ['#d4c4a8', '#f0e6d3', '#c9b896', '#e8d5b7']
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = grains[Math.floor(Math.random() * grains.length)]
    ctx.globalAlpha = 0.3 + Math.random() * 0.5
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2)
    ctx.globalAlpha = 1
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 2)
  return tex
}

function Sun({ timeOfDay }) {
  const ref = useRef()
  // Arc across sky: low at sunrise (0), high at noon (0.5), low at sunset (0.8-1)
  const sunHeight = Math.sin(timeOfDay * Math.PI) * BOX_HEIGHT * 0.5 + BOX_HEIGHT * 0.35
  const sunOpacity = timeOfDay > 0.85 ? Math.max(0, (0.9 - timeOfDay) * 6) : 0.98
  useFrame((state) => {
    if (ref.current?.material && sunOpacity > 0) {
      ref.current.material.opacity = sunOpacity * (0.94 + 0.04 * Math.sin(state.clock.elapsedTime * 0.5))
    }
  })
  return (
    <mesh ref={ref} position={[0, sunHeight, 48]}>
      <sphereGeometry args={[12, 24, 24]} />
      <meshBasicMaterial
        color="#ffdd00"
        transparent
        opacity={sunOpacity}
        toneMapped={false}
      />
    </mesh>
  )
}

export function BeachAndOcean({ timeOfDay = 0.5 }) {
  const oceanTex = useMemo(() => createInfiniteOceanTexture(), [])
  const sandTex = useMemo(() => createSandTexture(), [])
  const isNight = timeOfDay > 0.9
  const oceanOpacity = isNight ? 0.25 : 0.98

  return (
    <group position={[0, 14, 0]}>
      {/* Sand strip - matches box width (70), from z=18 to z=35 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -16, 26.5]}
        receiveShadow
      >
        <planeGeometry args={[BOX_SIZE, 17]} />
        <meshStandardMaterial map={sandTex} color={SAND_COLOR} />
      </mesh>

      {/* Infinite ocean - large plane extends beyond view, feels endless like real horizon */}
      <mesh position={[0, 0, 55]} rotation={[0, 0, 0]}>
        <planeGeometry args={[500, 350]} />
        <meshBasicMaterial
          map={oceanTex}
          side={THREE.DoubleSide}
          transparent
          opacity={oceanOpacity}
          depthWrite={true}
        />
      </mesh>

      {/* Sun - arcs across sky with day cycle, giant yellow sun */}
      {!isNight && <Sun timeOfDay={timeOfDay} />}
      {/* Beach umbrella and chair */}
      <BeachUmbrella position={[-10, -16, 20]} rotation={0.3} />
      <BeachUmbrella position={[12, -16, 28]} rotation={-0.5} />
    </group>
  )
}
