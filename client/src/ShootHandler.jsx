import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ShootHandler - Captures all clicks and spawns tracers from camera to hit point.
 * Works for both target hits and misses (uses a far plane when aiming at sky).
 */
export function ShootHandler({ onShoot }) {
  const { camera, scene, gl } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const pointer = useRef(new THREE.Vector2(0, 0))
  const farPlane = useRef(null)
  const onShootRef = useRef(onShoot)
  onShootRef.current = onShoot

  useEffect(() => {
    // Invisible plane behind the scene to catch "miss" shots (aiming at sky)
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    plane.position.set(0, 0, -80)
    plane.name = 'tracer-far-plane'
    scene.add(plane)
    farPlane.current = plane

    const handleClick = () => {
      // Raycast from center of screen (pointer lock = always center)
      pointer.current.set(0, 0)
      raycaster.current.setFromCamera(pointer.current, camera)

      const meshesToTest = []
      scene.traverse((obj) => {
        if (obj.isMesh && obj.name !== 'tracer-far-plane') {
          meshesToTest.push(obj)
        }
      })
      meshesToTest.push(plane) // Far plane catches "miss" shots (aiming at sky)

      const intersects = raycaster.current.intersectObjects(meshesToTest, true)

      let hitPoint
      if (intersects.length > 0) {
        hitPoint = intersects[0].point
      } else {
        // Fallback: point far ahead
        hitPoint = new THREE.Vector3(0, 0, -1)
          .applyQuaternion(camera.quaternion)
          .multiplyScalar(100)
          .add(camera.position)
      }

      const cameraPos = camera.position.toArray()
      const point = hitPoint.toArray ? hitPoint.toArray() : [hitPoint.x, hitPoint.y, hitPoint.z]

      onShootRef.current({ cameraPosition: cameraPos, point })
    }

    const canvas = gl.domElement
    canvas.addEventListener('mousedown', handleClick)
    return () => {
      canvas.removeEventListener('mousedown', handleClick)
      scene.remove(plane)
      plane.geometry.dispose()
      plane.material.dispose()
    }
  }, [camera, scene, gl])

  return null
}
