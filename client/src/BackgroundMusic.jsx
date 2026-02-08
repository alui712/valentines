import { useRef, useImperativeHandle, forwardRef } from 'react'

// Put your music file at client/public/sounds/music.mp3
// Download free music from pixabay.com/music or mixkit.co/free-stock-music
const MUSIC_URL = '/sounds/music.mp3'

/**
 * Plays background music via HTML5 Audio. Call start() from a user click handler.
 */
export const BackgroundMusic = forwardRef(function BackgroundMusic(_, ref) {
  const audioRef = useRef(null)

  useImperativeHandle(ref, () => ({
    start: () => {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = 0.2
      audio.loop = true
      audio.play().catch(() => {})
    },
    setVolume: (level) => {
      const audio = audioRef.current
      if (audio) audio.volume = Math.max(0, Math.min(1, level / 100))
    },
    reset: () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    },
    fadeVolume: (targetLevel, durationMs) => {
      const audio = audioRef.current
      if (!audio) return
      const start = performance.now()
      const startVol = audio.volume
      const targetVol = Math.max(0, Math.min(1, targetLevel / 100))
      const animate = (now) => {
        const elapsed = now - start
        const t = Math.min(1, elapsed / durationMs)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        audio.volume = startVol + (targetVol - startVol) * eased
        if (t < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    },
  }))

  return <audio ref={audioRef} src={MUSIC_URL} preload="auto" />
})
