'use client'

import { Canvas } from '@react-three/fiber'
import { Effects } from '@react-three/drei'
import { Particles } from './gl/Particles'
import { VignetteShader } from './gl/shaders/vignetteShader'
import { useEffect, useRef, useState } from 'react'

interface WaveBackgroundProps {
  // Animation parameters
  speed?: number
  noiseScale?: number
  noiseIntensity?: number
  timeScale?: number

  // Visual parameters
  pointSize?: number
  opacity?: number
  planeScale?: number

  // Camera parameters
  focus?: number
  aperture?: number

  // Vignette parameters
  vignetteDarkness?: number
  vignetteOffset?: number

  // Interaction
  introspect?: boolean

  // Size
  size?: number

  // Background color
  backgroundColor?: string

  // Class name for styling
  className?: string
}

export function WaveBackground({
  // Polymer-optimized defaults
  speed = 0.5,
  noiseScale = 0.5,
  noiseIntensity = 0.65,
  timeScale = 1,
  pointSize = 6,
  opacity = 0.8,
  planeScale = 10,
  focus = 3.8,
  aperture = 1.79,
  vignetteDarkness = 1.5,
  vignetteOffset = 0.4,
  introspect = false,
  size = 512,
  backgroundColor = '#0a0a1a', // Dark blue background
  className = '',
}: WaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Pause animation when out of viewport for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '100px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ willChange: 'transform', contain: 'layout' }}
    >
      <Canvas
        camera={{
          position: [1.26, 2.66, -1.82],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: backgroundColor,
        }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        frameloop={isVisible ? 'always' : 'demand'}
      >
        <color attach="background" args={[backgroundColor]} />
        <Particles
          speed={speed}
          aperture={aperture}
          focus={focus}
          size={size}
          noiseScale={noiseScale}
          noiseIntensity={noiseIntensity}
          timeScale={timeScale}
          pointSize={pointSize}
          opacity={opacity}
          planeScale={planeScale}
          introspect={introspect}
        />
        <Effects>
          <shaderPass
            args={[VignetteShader]}
            uniforms-darkness-value={vignetteDarkness}
            uniforms-offset-value={vignetteOffset}
          />
        </Effects>
      </Canvas>
    </div>
  )
}

// Export a simpler version without vignette for performance
export function WaveBackgroundSimple({
  speed = 0.5,
  noiseScale = 0.5,
  noiseIntensity = 0.65,
  timeScale = 1,
  pointSize = 6,
  opacity = 0.8,
  planeScale = 10,
  focus = 3.8,
  aperture = 1.79,
  introspect = false,
  size = 256, // Lower resolution for performance
  backgroundColor = '#0a0a1a',
  className = '',
}: Omit<WaveBackgroundProps, 'vignetteDarkness' | 'vignetteOffset'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Pause animation when out of viewport for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '100px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ willChange: 'transform', contain: 'layout' }}
    >
      <Canvas
        camera={{
          position: [1.26, 2.66, -1.82],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: backgroundColor,
        }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        frameloop={isVisible ? 'always' : 'demand'}
      >
        <color attach="background" args={[backgroundColor]} />
        <Particles
          speed={speed}
          aperture={aperture}
          focus={focus}
          size={size}
          noiseScale={noiseScale}
          noiseIntensity={noiseIntensity}
          timeScale={timeScale}
          pointSize={pointSize}
          opacity={opacity}
          planeScale={planeScale}
          introspect={introspect}
        />
      </Canvas>
    </div>
  )
}
