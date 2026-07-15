"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader with subtle diagonal light streaks drifting across near-black dark mode + fine film noise
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      // Pseudo-random noise helper
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main(void) {
        vec2 st = gl_FragCoord.xy / resolution.xy;
        
        // Diagonal coordinates for drifting streaks
        float angle = 0.65; // ~37 degree diagonal tilt
        vec2 rotSt = vec2(
          st.x * cos(angle) - st.y * sin(angle),
          st.x * sin(angle) + st.y * cos(angle)
        );

        float t = time * 0.08;

        // Soft drifting diagonal light streaks
        float streak1 = sin(rotSt.x * 6.0 + t) * 0.5 + 0.5;
        float streak2 = cos(rotSt.x * 12.0 - t * 0.7) * 0.5 + 0.5;
        float combinedStreaks = pow(streak1 * streak2, 2.5) * 0.18;

        // Dark base background color matching OKLch deep slate (#090b0f)
        vec3 baseColor = vec3(0.035, 0.043, 0.06);
        // Accent streak light color (subtle cornflower blue glow)
        vec3 streakColor = vec3(0.39, 0.58, 0.93) * combinedStreaks;

        // Combine base and streak ambient glow
        vec3 color = baseColor + streakColor;

        // Subtle film grain noise
        float grain = (random(st + vec2(time * 0.01)) - 0.5) * 0.035;
        color += vec3(grain);

        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    container.appendChild(renderer.domElement)

    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none opacity-80"
      style={{
        background: "transparent",
        overflow: "hidden",
      }}
    />
  )
}
