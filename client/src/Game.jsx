import { Canvas, useThree } from '@react-three/fiber'
import { PointerLockControls, Grid, Html } from '@react-three/drei'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Target } from './Target'
import { Tracer } from './Tracer'
import { HeartExplosion } from './HeartExplosion'
import { MegaHeart } from './MegaHeart'
import { Plant, createPlantData } from './Plant'
import { Constellation } from './Constellation'
import { BeachAndOcean } from './BeachAndOcean'
import { DaySky, NightSky } from './SkyEnvironment'
import { Crab } from './Crab'
import { LightingController } from './LightingController'
import { Fireworks } from './Fireworks'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { playShotSound } from './shotSound'

const FALLBACK_BG_COLOR = new THREE.Color(0.1, 0.05, 0.15)

const LOVE_FOG_COLOR = '#200020'
const LOVE_FOG_DENSITY = 0.018

function SceneFog({ timeOfDay }) {
  const { scene } = useThree()
  useEffect(() => {
    const isNight = timeOfDay > 0.85
    const fogColor = isNight ? new THREE.Color(0x0a0a1a) : new THREE.Color(LOVE_FOG_COLOR)
    scene.fog = new THREE.FogExp2(fogColor, LOVE_FOG_DENSITY)
    return () => { scene.fog = null }
  }, [scene, timeOfDay])
  return null
}

function SceneBackground({ timeOfDay }) {
  const { scene } = useThree()
  useEffect(() => {
    const dayColor = new THREE.Color(0x87CEEB)
    const nightColor = new THREE.Color(0x050508)
    const t = Math.max(0, Math.min(1, (timeOfDay - 0.82) / 0.1))
    scene.background = dayColor.clone().lerp(nightColor, t)
  }, [scene, timeOfDay])
  return null
}

function createGrassTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#2d5a27'
  ctx.fillRect(0, 0, size, size)
  const greens = ['#3d7a37', '#4a8f42', '#5ba352', '#1e4620', '#2e6b2e', '#356b35']
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)]
    const x = Math.random() * size
    const y = Math.random() * size
    const w = 4 + Math.random() * 12
    const h = 4 + Math.random() * 12
    ctx.fillRect(x, y, w, h)
  }
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)]
    ctx.globalAlpha = 0.3 + Math.random() * 0.4
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2)
    ctx.globalAlpha = 1
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 6)
  return tex
}

function GrassFloor() {
  const tex = useMemo(() => createGrassTexture(), [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -8.5]} receiveShadow>
      <planeGeometry args={[70, 53]} />
      <meshStandardMaterial map={tex} color="#3d7a37" />
    </mesh>
  )
}

function FloorPlane({ onPlantSpawn }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, -8.5]}
      onClick={(e) => {
        e.stopPropagation()
        onPlantSpawn(e.point.toArray())
      }}
    >
      <planeGeometry args={[70, 53]} />
      <meshBasicMaterial transparent opacity={0.0001} depthWrite={false} />
    </mesh>
  )
}

function SkyWithSides({ timeOfDay }) {
  const [sideTexture, setSideTexture] = useState(null)
  const texRef = useRef(null)
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      '/images/background.png',
      (tex) => {
        texRef.current = tex
        setSideTexture(tex)
      },
      undefined,
      () => setSideTexture(null)
    )
    return () => {
      texRef.current?.dispose()
      setSideTexture(null)
    }
  }, [])

  return (
    <>
      <DaySky sideTexture={sideTexture} />
      <NightSky timeOfDay={timeOfDay} />
    </>
  )
}

// Randomly pick cookie or target for each new target
const TARGET_IMAGE_CANDIDATES = [
  '/images/target.png',
  '/images/cookie.png',
]

const MAX_TARGET_SCALE = 2

const MEGA_HEART_POSITION = [0, 3, -12]

export default function Game({ score = 0, onScoreUpdate, onWin, timeOfDay = 0.5, startScreenActive = false, winScreenActive = false, score10MessageActive = false, score20MessageActive = false, score30MessageActive = false, score40MessageActive = false, score50MessageActive = false, score60MessageActive = false, score70MessageActive = false, score80MessageActive = false, score90MessageActive = false }) {
  const [targets, setTargets] = useState([])
  const [tracers, setTracers] = useState([])
  const [explosions, setExplosions] = useState([])
  const [validImages, setValidImages] = useState(['/images/target.png', '/images/cookie.png'])
  const [targetScale, setTargetScale] = useState(MAX_TARGET_SCALE)
  const [showMegaHeart, setShowMegaHeart] = useState(false)
  const [plants, setPlants] = useState([])

  useEffect(() => {
    Promise.all(
      TARGET_IMAGE_CANDIDATES.map((url) =>
        fetch(url)
          .then((r) => (r.ok ? url : null))
          .catch(() => null)
      )
    ).then((results) => {
      setValidImages(results.filter(Boolean))
    })
  }, [])

  const spawnTarget = () => {
    const x = (Math.random() - 0.5) * 20 
    const y = Math.random() * 6 + 0.5     
    const z = -6 - Math.random() * 14    

    const images = validImages.length > 0 ? validImages : ['/images/target.png', '/images/cookie.png']
    const image = images[Math.floor(Math.random() * images.length)]

    const newTarget = {
      id: Math.random(), 
      position: [x, y, z],
      image,
    }

    setTargets((prev) => [...prev, newTarget])
  }

  const scoreMessageActive = score10MessageActive || score20MessageActive || score30MessageActive || score40MessageActive || score50MessageActive || score60MessageActive || score70MessageActive || score80MessageActive || score90MessageActive
  useEffect(() => {
    if (!startScreenActive && !scoreMessageActive) {
      spawnTarget(); spawnTarget(); spawnTarget()
    } else {
      setTargets([])
    }
  }, [startScreenActive, scoreMessageActive])

  const removeTracer = useCallback((tracerId) => {
    setTracers((prev) => prev.filter((t) => t.id !== tracerId))
  }, [])

  const removeExplosion = useCallback((explosionId) => {
    setExplosions((prev) => prev.filter((e) => e.id !== explosionId))
  }, [])

  const addExplosion = useCallback((position) => {
    const explosionId = Math.random()
    setExplosions((prev) => [...prev, {
      id: explosionId,
      position,
      onComplete: () => removeExplosion(explosionId),
    }])
  }, [removeExplosion])

  const addTracer = useCallback((hitData) => {
    const tracerId = Math.random()
    setTracers((prev) => [...prev, {
      id: tracerId,
      start: hitData.cameraPosition,
      end: hitData.point,
      color: '#ff6b9d',
      onComplete: () => removeTracer(tracerId),
    }])
  }, [removeTracer])

  const handleHit = (id, hitData, position) => {
    try {
      if (position) addExplosion(position)
      if (hitData?.point && hitData?.cameraPosition) {
        try { playShotSound() } catch (_) {}
        addTracer(hitData)
      }
      onScoreUpdate()
      if (score === 99) {
        setShowMegaHeart(true)
        setTargets([])
      } else if (score === 9 || score === 19 || score === 29 || score === 39 || score === 49 || score === 59 || score === 69 || score === 79 || score === 89) {
        setTargets((prev) => prev.filter((t) => t.id !== id))
      } else {
        setTargets((prev) => prev.filter((t) => t.id !== id))
        spawnTarget()
      }
    } catch (err) {
      console.error('handleHit error:', err)
      setTargets((prev) => prev.filter((t) => t.id !== id))
      if (score !== 99 && score !== 9 && score !== 19 && score !== 29 && score !== 39 && score !== 49 && score !== 59 && score !== 69 && score !== 79 && score !== 89) spawnTarget()
    }
  }

  const handleMegaHeartHit = useCallback((hitData) => {
    try { playShotSound() } catch (_) {}
    if (hitData?.point && hitData?.cameraPosition) addTracer(hitData)
  }, [addTracer])

  const handleFloorClick = useCallback((point) => {
    setPlants((prev) => [...prev, createPlantData(point)])
  }, [])

  const isNight = timeOfDay > 0.85

  return (
    <Canvas camera={{ fov: 75, position: [0, 2, 5] }} shadows>
      <SkyWithSides timeOfDay={timeOfDay} />
      <BeachAndOcean timeOfDay={timeOfDay} />
      <SceneFog timeOfDay={timeOfDay} />
      <SceneBackground timeOfDay={timeOfDay} />
      <LightingController timeOfDay={timeOfDay} />
      <GrassFloor />
      {!startScreenActive && <FloorPlane onPlantSpawn={handleFloorClick} />}
      {!startScreenActive && !winScreenActive && <PointerLockControls />}
      {explosions.map((exp) => (
        <HeartExplosion
          key={exp.id}
          position={exp.position}
          onComplete={exp.onComplete}
        />
      ))}
      {tracers.map((tracer) => (
        <Tracer
          key={tracer.id}
          start={tracer.start}
          end={tracer.end}
          color={tracer.color}
          duration={200}
          onComplete={tracer.onComplete}
        />
      ))}
      {!startScreenActive && !scoreMessageActive && targets.map((target) => (
        <Target
          key={target.id}
          position={target.position}
          onHit={(hitData) => handleHit(target.id, hitData, target.position)}
          image={target.image}
          scale={targetScale}
        />
      ))}
      {!startScreenActive && isNight && <Constellation />}
      {!startScreenActive && (
        <>
          {[
            [8, -2, 22],
            [-6, -2, 25],
            [12, -2, 28],
            [-10, -2, 20],
            [0, -2, 30],
            [15, -2, 24],
            [-12, -2, 27],
          ].map((pos, i) => (
            <Crab key={i} position={pos} speed={0.8 + (i % 3) * 0.2} />
          ))}
        </>
      )}
      {plants.map((plant) => (
        <Plant
          key={plant.id}
          position={plant.position}
          type={plant.type}
          stemColor={plant.stemColor}
          foliageColor={plant.foliageColor}
          sizeScale={plant.sizeScale}
        />
      ))}
      <Fireworks dayTime={timeOfDay} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={1.5} luminanceSmoothing={0.4} />
      </EffectComposer>
      {!startScreenActive && !scoreMessageActive && showMegaHeart && (
        <>
          <Html position={[0, 6, -12]} center style={{ pointerEvents: 'none' }}>
            <div style={{
              color: '#ffb3d9',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textShadow: '0 0 12px rgba(255, 107, 157, 0.8)',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}>
              Quick, tap the heart!
            </div>
          </Html>
          <MegaHeart
            position={MEGA_HEART_POSITION}
            onHit={handleMegaHeartHit}
            onBreak={() => {
              addExplosion(MEGA_HEART_POSITION)
              setShowMegaHeart(false)
              onWin?.()
            }}
          />
        </>
      )}
    </Canvas>
  )
}