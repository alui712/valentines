import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/**
 * LightingController - Reacts to timeOfDay (0=Morning, 0.5=Noon, 0.7-0.8=Sunset, 1=Night)
 * Noon: high intensity, white light
 * Sunset: lower intensity, warm orange/pink
 * Night: very low intensity, deep blue
 */
export function LightingController({ timeOfDay }) {
  const ambientRef = useRef()
  const dirRef = useRef()
  const { scene } = useThree()

  useEffect(() => {
    if (!ambientRef.current || !dirRef.current) return

    let ambientIntensity
    let ambientColor
    let dirIntensity
    let dirColor

    if (timeOfDay <= 0.5) {
      // Morning to Noon - bright, white
      const t = timeOfDay * 2
      ambientIntensity = 0.3 + 0.4 * t
      ambientColor = '#ffffff'
      dirIntensity = 0.5 + 1.5 * t
      dirColor = '#fffef8'
    } else if (timeOfDay <= 0.75) {
      // Noon to Sunset - warm orange/pink
      const t = (timeOfDay - 0.5) / 0.25
      ambientIntensity = 0.5 - 0.2 * t
      ambientColor = '#' + [255, Math.round(230 - 30 * t), Math.round(220 - 80 * t)].map((n) => n.toString(16).padStart(2, '0')).join('')
      dirIntensity = 1.5 - 0.8 * t
      dirColor = '#' + [255, Math.round(200 - 50 * t), Math.round(150 - 50 * t)].map((n) => n.toString(16).padStart(2, '0')).join('')
    } else {
      // Sunset to Night - deep blue
      const t = (timeOfDay - 0.75) / 0.25
      ambientIntensity = 0.3 - 0.25 * t
      ambientColor = '#' + [Math.round(150 - 80 * t), Math.round(120 - 50 * t), Math.round(180 - 20 * t)].map((n) => Math.max(0, n).toString(16).padStart(2, '0')).join('')
      dirIntensity = 0.7 - 0.65 * t
      dirColor = '#' + [Math.round(100 - 60 * t), Math.round(80 - 40 * t), 140].map((n) => Math.max(0, n).toString(16).padStart(2, '0')).join('')
    }

    ambientRef.current.intensity = ambientIntensity
    ambientRef.current.color.set(ambientColor)
    dirRef.current.intensity = dirIntensity
    dirRef.current.color.set(dirColor)
  }, [timeOfDay])

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} color="#ffffff" />
      <directionalLight
        ref={dirRef}
        position={[10, 20, 10]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
    </>
  )
}
