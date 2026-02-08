import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WHITE = new THREE.Color('#ffffff')
const BOB_SPEED = 1.2
const BOB_AMOUNT = 0.04
const ROTATE_SPEED = 0.4

function GlowOrbTarget({
  position,
  onHit,
  meshRef,
  clicked,
  handleClick,
  float,
  scale = 1,
  texture = null,
}) {
  useFrame((state) => {
    if (!meshRef.current || clicked) return
    if (float) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * BOB_SPEED) * BOB_AMOUNT * 0.016
    }
    meshRef.current.rotation.y += ROTATE_SPEED * 0.016
  })

  if (clicked) return null

  if (texture) {
    return (
      <mesh ref={meshRef} position={position} scale={scale} onClick={handleClick}>
        <boxGeometry args={[1, 1, 0.08]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          color={WHITE}
          emissive={WHITE}
          emissiveIntensity={0.8}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef} position={position} scale={scale} onClick={handleClick}>
      <boxGeometry args={[1, 1, 0.08]} />
      <meshStandardMaterial
        color="#ff69b4"
        emissive="#ff69b4"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function ImageTarget({ position, onHit, image, meshRef, clicked, handleClick, float, scale = 1 }) {
  const [texture, setTexture] = useState(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    if (!image) return
    let tex = null
    const loader = new THREE.TextureLoader()
    loader.load(
      image,
      (t) => {
        tex = t
        setTexture(t)
      },
      undefined,
      () => setLoadFailed(true)
    )
    return () => {
      tex?.dispose()
    }
  }, [image])

  if (loadFailed) {
    return (
      <GlowOrbTarget
        position={position}
        onHit={onHit}
        meshRef={meshRef}
        clicked={clicked}
        handleClick={handleClick}
        float={float}
        scale={scale}
        texture={null}
      />
    )
  }

  return (
    <GlowOrbTarget
      position={position}
      onHit={onHit}
      meshRef={meshRef}
      clicked={clicked}
      handleClick={handleClick}
      float={float}
      scale={scale}
      texture={texture}
    />
  )
}

export function Target({ position, onHit, image, scale = 1 }) {
  const meshRef = useRef()
  const [clicked, setClicked] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    setClicked(true)
    const hitData = {
      point: e.point.toArray(),
      cameraPosition: e.camera.position.toArray(),
    }
    queueMicrotask(() => onHit(hitData))
  }

  if (image) {
    return (
      <ImageTarget
        position={position}
        onHit={onHit}
        image={image}
        meshRef={meshRef}
        clicked={clicked}
        handleClick={handleClick}
        float={true}
        scale={scale}
      />
    )
  }

  return (
    <GlowOrbTarget
      position={position}
      onHit={onHit}
      meshRef={meshRef}
      clicked={clicked}
      handleClick={handleClick}
      float={true}
      scale={scale}
      texture={null}
    />
  )
}
