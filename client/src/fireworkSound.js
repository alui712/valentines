/**
 * Procedurally generated firework sounds - no audio files needed.
 * Launch: realistic rocket whistle with burn/fizz
 * Explode: deep boom with low-pass filtered noise burst
 */

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

export function playRocketLaunchSound() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const now = ctx.currentTime
    const duration = 0.35

    // Main whistle - sine wave rising in pitch (realistic firework scream)
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08)
    osc.frequency.exponentialRampToValueAtTime(2400, now + duration)
    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    oscGain.gain.setValueAtTime(0.2, now)
    oscGain.gain.exponentialRampToValueAtTime(0.08, now + 0.05)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    osc.start(now)
    osc.stop(now + duration)

    // Crackling burn - band-pass filtered noise
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 2000
    noiseFilter.Q.value = 2
    const noiseGain = ctx.createGain()
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseGain.gain.setValueAtTime(0.06, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    noise.start(now)
  } catch (_) {}
}

export function playFireworkExplodeSound() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const now = ctx.currentTime
    const duration = 0.6

    // Deep sub-bass thump - the "boom" body
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(80, now)
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08)
    subOsc.frequency.setValueAtTime(35, now + 0.15)
    subOsc.frequency.exponentialRampToValueAtTime(20, now + duration)
    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subGain.gain.setValueAtTime(0, now)
    subGain.gain.linearRampToValueAtTime(0.5, now + 0.002)
    subGain.gain.exponentialRampToValueAtTime(0.15, now + 0.05)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    subOsc.start(now)
    subOsc.stop(now + duration)

    // Low-pass filtered noise burst - the crackle and rumble
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 8) * (1 - t / duration)
      data[i] = (Math.random() * 2 - 1) * env
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.setValueAtTime(800, now)
    lowpass.frequency.exponentialRampToValueAtTime(200, now + 0.1)
    lowpass.frequency.exponentialRampToValueAtTime(80, now + duration)
    lowpass.Q.value = 0.5
    const noiseGain = ctx.createGain()
    noise.connect(lowpass)
    lowpass.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseGain.gain.setValueAtTime(0.4, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    noise.start(now)

    // Sharp attack "crack" - brief mid-range burst
    const crackBufferSize = ctx.sampleRate * 0.03
    const crackBuffer = ctx.createBuffer(1, crackBufferSize, ctx.sampleRate)
    const crackData = crackBuffer.getChannelData(0)
    for (let i = 0; i < crackBufferSize; i++) {
      crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (crackBufferSize * 0.2))
    }
    const crack = ctx.createBufferSource()
    crack.buffer = crackBuffer
    const crackFilter = ctx.createBiquadFilter()
    crackFilter.type = 'bandpass'
    crackFilter.frequency.value = 1200
    crackFilter.Q.value = 1
    const crackGain = ctx.createGain()
    crack.connect(crackFilter)
    crackFilter.connect(crackGain)
    crackGain.connect(ctx.destination)
    crackGain.gain.setValueAtTime(0.25, now)
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
    crack.start(now)
  } catch (_) {}
}
