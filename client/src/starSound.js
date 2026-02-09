/**
 * Ringing bell sound for constellation star clicks - procedurally generated.
 * Uses multiple inharmonic partials for a metallic bell character.
 */

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

export function playStarDingSound(step = 0, totalSteps = 12) {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const now = ctx.currentTime
    const duration = 0.6
    // Pitch rises from C5 (523 Hz) to C6 (1046 Hz) across all stars
    const startFreq = 523.25
    const semitoneRatio = Math.pow(2, 1 / 12)
    const baseFreq = startFreq * Math.pow(semitoneRatio, step)

    // Bell-like inharmonic partials (frequency ratios typical of a small bell)
    const partials = [
      { freq: baseFreq, amp: 0.4, decay: 0.15 },
      { freq: baseFreq * 2.5, amp: 0.25, decay: 0.25 },
      { freq: baseFreq * 5.5, amp: 0.15, decay: 0.1 },
      { freq: baseFreq * 8.2, amp: 0.08, decay: 0.08 },
    ]

    partials.forEach(({ freq, amp, decay }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.start(now)
      osc.stop(now + duration)
      gain.gain.setValueAtTime(amp * 0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + decay)
    })
  } catch (_) {}
}
