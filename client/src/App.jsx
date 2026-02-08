import { useState, useRef, useEffect } from 'react'
import Game from './Game'
import { BackgroundMusic } from './BackgroundMusic'

const NO_BUTTON_FLEE_THRESHOLD = 100
const NO_BUTTON_PUSH_STRENGTH = 12
const NO_BUTTON_EDGE_MARGIN = 20

function App() {
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [winScreen, setWinScreen] = useState(false)
  const [winPhase, setWinPhase] = useState('message')
  const [showStartScreen, setShowStartScreen] = useState(true)
  const [showAdventureScreen, setShowAdventureScreen] = useState(false)
  const [showScore10Message, setShowScore10Message] = useState(false)
  const [score10Fading, setScore10Fading] = useState(false)
  const hasShownScore10Ref = useRef(false)
  const [showScore20Message, setShowScore20Message] = useState(false)
  const [score20Fading, setScore20Fading] = useState(false)
  const hasShownScore20Ref = useRef(false)
  const [showScore30Message, setShowScore30Message] = useState(false)
  const [score30Fading, setScore30Fading] = useState(false)
  const hasShownScore30Ref = useRef(false)
  const [showScore40Message, setShowScore40Message] = useState(false)
  const [score40Fading, setScore40Fading] = useState(false)
  const hasShownScore40Ref = useRef(false)
  const [showScore50Message, setShowScore50Message] = useState(false)
  const [score50Fading, setScore50Fading] = useState(false)
  const hasShownScore50Ref = useRef(false)
  const [showScore60Message, setShowScore60Message] = useState(false)
  const [score60Fading, setScore60Fading] = useState(false)
  const hasShownScore60Ref = useRef(false)
  const [showScore70Message, setShowScore70Message] = useState(false)
  const [score70Fading, setScore70Fading] = useState(false)
  const hasShownScore70Ref = useRef(false)
  const [showScore80Message, setShowScore80Message] = useState(false)
  const [score80Fading, setScore80Fading] = useState(false)
  const hasShownScore80Ref = useRef(false)
  const [showScore90Message, setShowScore90Message] = useState(false)
  const [score90Fading, setScore90Fading] = useState(false)
  const hasShownScore90Ref = useRef(false)
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 })
  const [replayKey, setReplayKey] = useState(0)
  const noButtonRef = useRef(null)
  const musicRef = useRef()
  const [timeOfDay, setTimeOfDay] = useState(0.5)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setTimeOfDay((t) => Math.max(0, t - 0.05))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setTimeOfDay((t) => Math.min(1, t + 0.05))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (score === 10 && !hasShownScore10Ref.current) {
      hasShownScore10Ref.current = true
      setShowScore10Message(true)
      setScore10Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 20 && !hasShownScore20Ref.current) {
      hasShownScore20Ref.current = true
      setShowScore20Message(true)
      setScore20Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 30 && !hasShownScore30Ref.current) {
      hasShownScore30Ref.current = true
      setShowScore30Message(true)
      setScore30Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 40 && !hasShownScore40Ref.current) {
      hasShownScore40Ref.current = true
      setShowScore40Message(true)
      setScore40Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 50 && !hasShownScore50Ref.current) {
      hasShownScore50Ref.current = true
      setShowScore50Message(true)
      setScore50Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 60 && !hasShownScore60Ref.current) {
      hasShownScore60Ref.current = true
      setShowScore60Message(true)
      setScore60Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 70 && !hasShownScore70Ref.current) {
      hasShownScore70Ref.current = true
      setShowScore70Message(true)
      setScore70Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 80 && !hasShownScore80Ref.current) {
      hasShownScore80Ref.current = true
      setShowScore80Message(true)
      setScore80Fading(false)
    }
  }, [score])

  useEffect(() => {
    if (score === 90 && !hasShownScore90Ref.current) {
      hasShownScore90Ref.current = true
      setShowScore90Message(true)
      setScore90Fading(false)
    }
  }, [score])

  useEffect(() => {
    if ((showScore10Message || showScore20Message || showScore30Message || showScore40Message || showScore50Message || showScore60Message || showScore70Message || showScore80Message || showScore90Message) && !score10Fading && !score20Fading && !score30Fading && !score40Fading && !score50Fading && !score60Fading && !score70Fading && !score80Fading && !score90Fading) {
      musicRef.current?.fadeVolume?.(10, 800)
    }
  }, [showScore10Message, showScore20Message, showScore30Message, showScore40Message, showScore50Message, showScore60Message, showScore70Message, showScore80Message, showScore90Message, score10Fading, score20Fading, score30Fading, score40Fading, score50Fading, score60Fading, score70Fading, score80Fading, score90Fading])

  useEffect(() => {
    if (score10Fading || score20Fading || score30Fading || score40Fading || score50Fading || score60Fading || score70Fading || score80Fading || score90Fading) {
      musicRef.current?.fadeVolume?.(20, 600)
    }
  }, [score10Fading, score20Fading, score30Fading, score40Fading, score50Fading, score60Fading, score70Fading, score80Fading, score90Fading])

  useEffect(() => {
    if (!showScore10Message || score10Fading) return
    const fadeTimer = setTimeout(() => setScore10Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore10Message, score10Fading])

  useEffect(() => {
    if (!score10Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore10Message(false)
      setScore10Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score10Fading])

  useEffect(() => {
    if (!showScore20Message || score20Fading) return
    const fadeTimer = setTimeout(() => setScore20Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore20Message, score20Fading])

  useEffect(() => {
    if (!score20Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore20Message(false)
      setScore20Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score20Fading])

  useEffect(() => {
    if (!showScore30Message || score30Fading) return
    const fadeTimer = setTimeout(() => setScore30Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore30Message, score30Fading])

  useEffect(() => {
    if (!score30Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore30Message(false)
      setScore30Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score30Fading])

  useEffect(() => {
    if (!showScore40Message || score40Fading) return
    const fadeTimer = setTimeout(() => setScore40Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore40Message, score40Fading])

  useEffect(() => {
    if (!score40Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore40Message(false)
      setScore40Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score40Fading])

  useEffect(() => {
    if (!showScore50Message || score50Fading) return
    const fadeTimer = setTimeout(() => setScore50Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore50Message, score50Fading])

  useEffect(() => {
    if (!score50Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore50Message(false)
      setScore50Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score50Fading])

  useEffect(() => {
    if (!showScore60Message || score60Fading) return
    const fadeTimer = setTimeout(() => setScore60Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore60Message, score60Fading])

  useEffect(() => {
    if (!score60Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore60Message(false)
      setScore60Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score60Fading])

  useEffect(() => {
    if (!showScore70Message || score70Fading) return
    const fadeTimer = setTimeout(() => setScore70Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore70Message, score70Fading])

  useEffect(() => {
    if (!score70Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore70Message(false)
      setScore70Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score70Fading])

  useEffect(() => {
    if (!showScore80Message || score80Fading) return
    const fadeTimer = setTimeout(() => setScore80Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore80Message, score80Fading])

  useEffect(() => {
    if (!score80Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore80Message(false)
      setScore80Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score80Fading])

  useEffect(() => {
    if (!showScore90Message || score90Fading) return
    const fadeTimer = setTimeout(() => setScore90Fading(true), 7000)
    return () => clearTimeout(fadeTimer)
  }, [showScore90Message, score90Fading])

  useEffect(() => {
    if (winScreen && winPhase === 'message') {
      const t = setTimeout(() => setWinPhase('leaderboard'), 5000)
      return () => clearTimeout(t)
    }
  }, [winScreen, winPhase])

  useEffect(() => {
    if (winScreen) {
      document.exitPointerLock?.()
    }
  }, [winScreen])

  useEffect(() => {
    if (!score90Fading) return
    const hideTimer = setTimeout(() => {
      setShowScore90Message(false)
      setScore90Fading(false)
    }, 600)
    return () => clearTimeout(hideTimer)
  }, [score90Fading])

  const handleNoButtonMouseMove = (e) => {
    const btn = noButtonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const mx = e.clientX
    const my = e.clientY
    const dx = cx - mx
    const dy = cy - my
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < NO_BUTTON_FLEE_THRESHOLD && dist > 0) {
      const push = NO_BUTTON_PUSH_STRENGTH * (1 - dist / NO_BUTTON_FLEE_THRESHOLD)
      const w = window.innerWidth
      const h = window.innerHeight
      const bw = rect.width
      const bh = rect.height
      const margin = NO_BUTTON_EDGE_MARGIN
      setNoButtonOffset((prev) => {
        const baseLeft = rect.left - prev.x
        const baseTop = rect.top - prev.y
        const minOffsetX = margin - baseLeft
        const maxOffsetX = w - bw - margin - baseLeft
        const minOffsetY = margin - baseTop
        const maxOffsetY = h - bh - margin - baseTop
        let nx = prev.x + (dx / dist) * push
        let ny = prev.y + (dy / dist) * push
        nx = Math.max(minOffsetX, Math.min(maxOffsetX, nx))
        ny = Math.max(minOffsetY, Math.min(maxOffsetY, ny))
        return { x: nx, y: ny }
      })
    }
  }

  const handleValentineYes = () => {
    setShowStartScreen(false)
    setShowAdventureScreen(true)
  }

  const handleAdventureStart = () => {
    setShowAdventureScreen(false)
    setIsPlaying(true)
    musicRef.current?.start()
  }

  const handleReplay = () => {
    musicRef.current?.reset?.()
    setWinScreen(false)
    setWinPhase('message')
    setShowStartScreen(true)
    setShowAdventureScreen(false)
    setIsPlaying(false)
    setScore(0)
    hasShownScore10Ref.current = false
    hasShownScore20Ref.current = false
    hasShownScore30Ref.current = false
    hasShownScore40Ref.current = false
    hasShownScore50Ref.current = false
    hasShownScore60Ref.current = false
    hasShownScore70Ref.current = false
    hasShownScore80Ref.current = false
    hasShownScore90Ref.current = false
    setShowScore10Message(false)
    setScore10Fading(false)
    setShowScore20Message(false)
    setScore20Fading(false)
    setShowScore30Message(false)
    setScore30Fading(false)
    setShowScore40Message(false)
    setScore40Fading(false)
    setShowScore50Message(false)
    setScore50Fading(false)
    setShowScore60Message(false)
    setScore60Fading(false)
    setShowScore70Message(false)
    setScore70Fading(false)
    setShowScore80Message(false)
    setScore80Fading(false)
    setShowScore90Message(false)
    setScore90Fading(false)
    setNoButtonOffset({ x: 0, y: 0 })
    setReplayKey((k) => k + 1)
  }

  const handleScoreUpdate = () => {
    setScore((s) => s + 1)
  }

  const handleGameClick = () => {
    if (!showStartScreen && !showAdventureScreen) {
      setIsPlaying(true)
      musicRef.current?.start()
    }
  }

  const overlayActive = showStartScreen || showAdventureScreen || showScore10Message || showScore20Message || showScore30Message || showScore40Message || showScore50Message || showScore60Message || showScore70Message || showScore80Message || showScore90Message

  return (
    <>
      <BackgroundMusic ref={musicRef} />
      <div className="sunset-control">
        <label htmlFor="time-slider">Time of day</label>
        <input
          id="time-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
        />
        <span className="sunset-label">
          {timeOfDay < 0.25 ? 'Morning' : timeOfDay < 0.55 ? 'Noon' : timeOfDay < 0.85 ? 'Sunset' : 'Night'}
        </span>
      </div>
      <div className="ui-layer">
        <div className="left-panel">
          <section className="left-panel-section">
            <h3 className="left-panel-heading">To Do</h3>
            <ul className="todo-list">
              <li>Make a garden with the floor</li>
              <li>Interact with a crab</li>
              <li>Experience the fireworks at night</li>
              <li>Connect the stars in the sky at night</li>
              <li>Reach a score of 100</li>
            </ul>
          </section>
          <section className="left-panel-section">
            <h3 className="left-panel-heading">Keybinds</h3>
            <ul className="keybinds-list">
              <li>Use arrow keys to change time of day</li>
            </ul>
          </section>
        </div>
        <h1 className="score-display">Score: {score}</h1>
        {!isPlaying && !overlayActive && <p className="controls-hint">Click the screen to start aiming!</p>}
      </div>
      {!overlayActive && <div className="crosshair"></div>}
      <div className="ground-fog" aria-hidden="true" />
      <div className="edge-glow" aria-hidden="true" />
      <div style={{ width: '100vw', height: '100vh' }} onClick={handleGameClick}>
        <Game
          key={replayKey}
          score={score}
          onScoreUpdate={handleScoreUpdate}
          onWin={() => { setWinScreen(true); setWinPhase('message') }}
          timeOfDay={timeOfDay}
          startScreenActive={overlayActive}
          winScreenActive={winScreen}
          score10MessageActive={showScore10Message}
          score20MessageActive={showScore20Message}
          score30MessageActive={showScore30Message}
          score40MessageActive={showScore40Message}
          score50MessageActive={showScore50Message}
          score60MessageActive={showScore60Message}
          score70MessageActive={showScore70Message}
          score80MessageActive={showScore80Message}
          score90MessageActive={showScore90Message}
        />
      </div>
      {showStartScreen && (
        <div
          className="start-screen-overlay"
          onMouseMove={handleNoButtonMouseMove}
        >
          <div className="start-screen-content">
            <img src="/images/start.png" alt="" className="start-screen-photo" />
            <h2 className="start-screen-title">Hey beautiful!!!</h2>
            <p className="start-screen-subtitle">Will you be my valentine??</p>
            <div className="start-screen-buttons">
              <button type="button" className="start-screen-btn" onClick={handleValentineYes}>
                yes
              </button>
              <button
                ref={noButtonRef}
                type="button"
                className="start-screen-btn start-screen-btn-no"
                style={{ transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)` }}
              >
                no
              </button>
            </div>
          </div>
        </div>
      )}
      {showAdventureScreen && (
        <div className="start-screen-overlay">
          <div className="start-screen-content">
            <img src="/images/moshi.png" alt="" className="start-screen-photo" />
            <p className="adventure-screen-text">
              You better. Since you make even the most boring days feel like an adventure, I am going to bring you on an adventure. Good Luck!
            </p>
            <button type="button" className="start-screen-btn" onClick={handleAdventureStart}>
              Let&apos;s go!
            </button>
          </div>
        </div>
      )}
      {showScore10Message && (
        <div className={`score10-overlay ${score10Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_1.png" alt="" className="score10-photo score10-photo-left" />
          <img src="/images/val_2.png" alt="" className="score10-photo score10-photo-right" />
          <p className="score10-text">Making you laugh is the absolute highlight of my day</p>
        </div>
      )}
      {showScore20Message && (
        <div className={`score10-overlay score20-overlay ${score20Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_9.png" alt="" className="score20-photo-top" />
          <img src="/images/val_3.png" alt="" className="score10-photo score10-photo-left" />
          <img src="/images/val_4.png" alt="" className="score10-photo score10-photo-right" />
          <p className="score10-text">It&apos;s the little things you do that make the biggest difference to me</p>
        </div>
      )}
      {showScore30Message && (
        <div className={`score10-overlay score30-overlay ${score30Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_5.png" alt="" className="score30-photo score30-photo-top" />
          <img src="/images/val_6.png" alt="" className="score30-photo score30-photo-bottom" />
          <img src="/images/val_7.png" alt="" className="score30-photo score30-photo-left" />
          <img src="/images/val_8.png" alt="" className="score30-photo score30-photo-right" />
          <p className="score10-text">You make every date so fun and enjoyable</p>
        </div>
      )}
      {showScore40Message && (
        <div className={`score10-overlay score40-overlay ${score40Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_10.png" alt="" className="score40-photo score40-photo-top" />
          <img src="/images/val_11.png" alt="" className="score40-photo score40-photo-bottom" />
          <img src="/images/val_12.png" alt="" className="score40-photo score40-photo-left" />
          <img src="/images/val_13.png" alt="" className="score40-photo score40-photo-right" />
          <p className="score10-text">I really love how career oriented, goal-driven, and studious you are</p>
        </div>
      )}
      {showScore50Message && (
        <div className={`score10-overlay ${score50Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_14.png" alt="" className="score10-photo score10-photo-left" />
          <img src="/images/val_15.png" alt="" className="score10-photo score10-photo-right" />
          <p className="score10-text">I love how you make even the most ordinary moments feel special</p>
        </div>
      )}
      {showScore60Message && (
        <div className={`score10-overlay score20-overlay ${score60Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_16.png" alt="" className="score10-photo score10-photo-right" />
          <img src="/images/val_17.png" alt="" className="score10-photo score10-photo-left" />
          <p className="score10-text">I love that you challenge me to be a better person just by being yourself.</p>
        </div>
      )}
      {showScore70Message && (
        <div className={`score10-overlay score70-80-overlay ${score70Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_19.png" alt="" className="score70-80-photo score70-80-photo-tl" />
          <img src="/images/val_20.png" alt="" className="score70-80-photo score70-80-photo-tr" />
          <img src="/images/val_21.png" alt="" className="score70-80-photo score70-80-photo-bl" />
          <img src="/images/val_22.png" alt="" className="score70-80-photo score70-80-photo-br" />
          <p className="score10-text score70-80-text">You give the best kisses and hugs, the kind that make everything else disappear</p>
        </div>
      )}
      {showScore80Message && (
        <div className={`score10-overlay score70-80-overlay ${score80Fading ? 'score10-fade-out' : ''}`}>
          <img src="/images/val_23.png" alt="" className="score70-80-photo score70-80-photo-tl" />
          <img src="/images/val_24.png" alt="" className="score70-80-photo score70-80-photo-tr" />
          <img src="/images/val_25.png" alt="" className="score70-80-photo score70-80-photo-bl" />
          <img src="/images/val_26.png" alt="" className="score70-80-photo score70-80-photo-br" />
          <p className="score10-text score70-80-text">I admire how you try your very best to make me happy</p>
        </div>
      )}
      {showScore90Message && (
        <div className={`score10-overlay score90-overlay ${score90Fading ? 'score10-fade-out' : ''}`}>
          <p className="score90-text">You are my best friend and my favorite person, all wrapped in one</p>
          <div className="score90-orbit">
            {[27, 28, 29, 30, 31].map((n, i) => (
              <img key={n} src={`/images/val_${n}.png`} alt="" className="score90-photo" style={{ '--i': i }} />
            ))}
          </div>
        </div>
      )}
      {winScreen && (
        <div className="win-screen">
          {winPhase === 'message' ? (
            <h2 className="win-message">Happy Valentine&apos;s Day, I love you so much</h2>
          ) : (
            <div className="win-leaderboard">
              <p className="win-leaderboard-title">You will always be my number 1</p>
              <ol className="win-leaderboard-list">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <li key={n} className="win-leaderboard-row">
                    <span className="win-leaderboard-rank">{n}</span>
                    <span className="win-leaderboard-name">{n === 1 ? 'mpy' : '—'}</span>
                  </li>
                ))}
              </ol>
              <button type="button" className="start-screen-btn win-replay-btn" onClick={handleReplay}>
                Replay
              </button>
              <p className="win-unlock-hint">Press esc to unlock mouse</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default App