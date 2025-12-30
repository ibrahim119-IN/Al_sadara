/**
 * Audio Processor for Live API
 * Handles audio capture, processing, and playback
 */

type AudioContextType = AudioContext | (typeof window extends { webkitAudioContext: new () => infer T } ? T : AudioContext)

/**
 * Audio processor for capturing and processing microphone input
 */
export class AudioProcessor {
  private audioContext: AudioContextType | null = null
  private mediaStream: MediaStream | null = null
  private sourceNode: MediaStreamAudioSourceNode | null = null
  private processorNode: ScriptProcessorNode | null = null
  private isRecording = false

  private onAudioData: ((data: ArrayBuffer) => void) | null = null

  constructor() {
    // Bind methods
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.processAudio = this.processAudio.bind(this)
  }

  /**
   * Start audio capture
   */
  async start(onAudioData: (data: ArrayBuffer) => void): Promise<boolean> {
    if (this.isRecording) return true

    try {
      // Get microphone stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Create audio context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioContext = new AudioContextClass({ sampleRate: 16000 })

      // Create source from media stream
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream)

      // Create processor node (buffer size 4096 samples)
      this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1)

      this.onAudioData = onAudioData

      // Process audio data
      this.processorNode.onaudioprocess = this.processAudio

      // Connect nodes
      this.sourceNode.connect(this.processorNode)
      this.processorNode.connect(this.audioContext.destination)

      this.isRecording = true
      return true
    } catch (error) {
      console.error('Failed to start audio capture:', error)
      this.cleanup()
      return false
    }
  }

  /**
   * Process audio buffer and convert to PCM
   */
  private processAudio(event: AudioProcessingEvent): void {
    if (!this.isRecording || !this.onAudioData) return

    const inputData = event.inputBuffer.getChannelData(0)

    // Convert Float32Array to Int16Array (PCM 16-bit)
    const pcmData = new Int16Array(inputData.length)
    for (let i = 0; i < inputData.length; i++) {
      // Clamp and convert to 16-bit
      const sample = Math.max(-1, Math.min(1, inputData[i]))
      pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
    }

    // Send PCM data
    this.onAudioData(pcmData.buffer)
  }

  /**
   * Stop audio capture
   */
  stop(): void {
    this.isRecording = false
    this.cleanup()
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.processorNode) {
      this.processorNode.disconnect()
      this.processorNode = null
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect()
      this.sourceNode = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    this.onAudioData = null
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording
  }
}

/**
 * Audio player for playing back audio from Live API
 */
export class AudioPlayer {
  private audioContext: AudioContextType | null = null
  private gainNode: GainNode | null = null
  private audioQueue: AudioBuffer[] = []
  private isPlaying = false
  private currentSource: AudioBufferSourceNode | null = null

  constructor() {
    this.playNext = this.playNext.bind(this)
  }

  /**
   * Initialize audio player
   */
  async initialize(): Promise<boolean> {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioContext = new AudioContextClass({ sampleRate: 24000 }) // Gemini outputs at 24kHz

      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)

      return true
    } catch (error) {
      console.error('Failed to initialize audio player:', error)
      return false
    }
  }

  /**
   * Play audio data from ArrayBuffer (PCM 16-bit)
   */
  async playAudio(data: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      await this.initialize()
    }

    if (!this.audioContext) return

    try {
      // Convert PCM 16-bit to Float32
      const int16Data = new Int16Array(data)
      const float32Data = new Float32Array(int16Data.length)

      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 0x8000
      }

      // Create audio buffer
      const audioBuffer = this.audioContext.createBuffer(
        1,
        float32Data.length,
        24000 // Sample rate
      )

      audioBuffer.getChannelData(0).set(float32Data)

      // Add to queue
      this.audioQueue.push(audioBuffer)

      // Start playing if not already
      if (!this.isPlaying) {
        this.playNext()
      }
    } catch (error) {
      console.error('Failed to play audio:', error)
    }
  }

  /**
   * Play next audio buffer in queue
   */
  private playNext(): void {
    if (this.audioQueue.length === 0 || !this.audioContext || !this.gainNode) {
      this.isPlaying = false
      return
    }

    this.isPlaying = true
    const buffer = this.audioQueue.shift()!

    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(this.gainNode)

    source.onended = () => {
      this.currentSource = null
      this.playNext()
    }

    this.currentSource = source
    source.start()
  }

  /**
   * Stop playback and clear queue
   */
  stop(): void {
    if (this.currentSource) {
      this.currentSource.stop()
      this.currentSource = null
    }
    this.audioQueue = []
    this.isPlaying = false
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.gainNode = null
  }
}

/**
 * Create audio processor and player instances
 */
export function createAudioHandlers() {
  return {
    processor: new AudioProcessor(),
    player: new AudioPlayer(),
  }
}
