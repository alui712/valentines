import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'

const VIDEO_ID = '5kOCOdnLKwg'

/**
 * Plays YouTube video as background music. Hidden player, loops until browser closes.
 * Call start() from a user click handler (browser autoplay policy).
 */
export const BackgroundMusic = forwardRef(function BackgroundMusic(_, ref) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const initRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || initRef.current) return

    const createPlayer = () => {
      if (!window.YT?.Player || !containerRef.current) return
      initRef.current = true
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
      window.onYouTubeIframeAPIReady = createPlayer
    }

    return () => {
      if (playerRef.current?.destroy) playerRef.current.destroy()
      initRef.current = false
    }
  }, [])

  useImperativeHandle(ref, () => ({
    start: () => {
      const tryPlay = (attempt = 0) => {
        const player = playerRef.current
        if (player?.playVideo) {
          player.setVolume?.(20)
          player.playVideo()
        } else if (attempt < 20) {
          setTimeout(() => tryPlay(attempt + 1), 300)
        }
      }
      tryPlay()
    },
    setVolume: (level) => {
      const player = playerRef.current
      if (player?.setVolume) {
        player.setVolume(Math.round(Math.max(0, Math.min(100, level))))
      }
    },
    reset: () => {
      const player = playerRef.current
      if (player?.pauseVideo) player.pauseVideo()
      if (player?.seekTo) player.seekTo(0, true)
    },
    fadeVolume: (targetLevel, durationMs) => {
      const player = playerRef.current
      if (!player?.setVolume) return
      const start = performance.now()
      const getCurrentVolume = () => {
        const v = player.getVolume?.()
        return typeof v === 'number' ? v : 20
      }
      const startLevel = getCurrentVolume()
      const animate = (now) => {
        const elapsed = now - start
        const t = Math.min(1, elapsed / durationMs)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const level = startLevel + (targetLevel - startLevel) * eased
        player.setVolume(Math.round(Math.max(0, Math.min(100, level))))
        if (t < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    },
  }))

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: -1,
      }}
    />
  )
})
