/**
 * Cute "wheee" sound for crab clicks - procedurally generated.
 */

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

export function playCrabWheeeSound() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const now = ctx.currentTime
    const duration = 0.35

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.linearRampToValueAtTime(880, now + duration * 0.3)
    osc.frequency.linearRampToValueAtTime(1100, now + duration)
    osc.start(now)
    osc.stop(now + duration)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.08, now + duration * 0.5)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
  } catch (_) {}
}
