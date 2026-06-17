"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { RoundedBox, Text, Float } from "@react-three/drei"
import type { Group, Mesh } from "three"
import { MathUtils } from "three"
import AquariumFallback from "@/components/aquarium-fallback"

type TicketData = {
  id: number
  number: string
  position: [number, number, number]
  rotation: [number, number, number]
  speed: number
  drift: number
  color: string
}

function FloatingTicket({ data, isWinner }: { data: TicketData; isWinner: boolean }) {
  const ref = useRef<Group>(null)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    if (isWinner) {
      // winner rises to the center and gently spins under the spotlight
      ref.current.position.x = MathUtils.lerp(ref.current.position.x, 0, 0.05)
      ref.current.position.y = MathUtils.lerp(ref.current.position.y, 0.2 + Math.sin(t * 1.2) * 0.1, 0.05)
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, 2.5, 0.05)
      ref.current.rotation.y += 0.02
      ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, 0, 0.05)
      const s = MathUtils.lerp(ref.current.scale.x, 1.8, 0.05)
      ref.current.scale.set(s, s, s)
      return
    }
    // gentle vertical bob + horizontal drift, like floating in water
    ref.current.position.y = data.position[1] + Math.sin(t * data.speed + offset) * 0.35
    ref.current.position.x = data.position[0] + Math.sin(t * data.drift + offset) * 0.25
    ref.current.rotation.z = data.rotation[2] + Math.sin(t * 0.4 + offset) * 0.12
    ref.current.rotation.y = data.rotation[1] + Math.cos(t * 0.3 + offset) * 0.18
  })

  return (
    <group ref={ref} position={data.position} rotation={data.rotation}>
      <RoundedBox args={[1.4, 0.85, 0.06]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color={isWinner ? "#fbbf24" : data.color}
          metalness={0.2}
          roughness={0.25}
          transparent
          opacity={isWinner ? 1 : 0.9}
          clearcoat={1}
          clearcoatRoughness={0.15}
          emissive={isWinner ? "#f59e0b" : "#000000"}
          emissiveIntensity={isWinner ? 0.6 : 0}
        />
      </RoundedBox>
      <Text
        position={[0, 0.12, 0.05]}
        fontSize={0.16}
        color={isWinner ? "#3b1d00" : "#fff5f5"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {isWinner ? "GANHADOR" : "BILHETE"}
      </Text>
      <Text
        position={[0, -0.14, 0.05]}
        fontSize={0.3}
        color={isWinner ? "#1a1100" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {data.number}
      </Text>
    </group>
  )
}

function Bubbles() {
  const ref = useRef<Group>(null)
  const bubbles = useMemo(
    () =>
      Array.from({ length: 22 }).map(() => ({
        x: MathUtils.randFloatSpread(10),
        y: MathUtils.randFloat(-4, 4),
        z: MathUtils.randFloat(-2, 2),
        scale: MathUtils.randFloat(0.02, 0.09),
        speed: MathUtils.randFloat(0.3, 0.9),
      })),
    [],
  )

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.children.forEach((child, i) => {
      child.position.y += bubbles[i].speed * delta
      if (child.position.y > 4) child.position.y = -4
    })
  })

  return (
    <group ref={ref}>
      {bubbles.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} scale={b.scale}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#bfe3ff"
            transparent
            opacity={0.35}
            emissive="#9ec9ff"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function TankGlass() {
  const ref = useRef<Mesh>(null)
  return (
    <mesh ref={ref}>
      <boxGeometry args={[11, 8.5, 5]} />
      <meshStandardMaterial
        color="#9ec9ff"
        metalness={0}
        roughness={0.1}
        transparent
        opacity={0.07}
        side={2}
      />
    </mesh>
  )
}

function Scene({ tickets, winner }: { tickets: TicketData[]; winner: string | null }) {
  return (
    <>
      <ambientLight intensity={winner ? 0.3 : 0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffd9d0" />
      <pointLight position={[-6, -4, 4]} intensity={1.5} color="#3b82f6" />
      <pointLight position={[6, 4, -4]} intensity={1.2} color="#ef4444" />
      {winner && (
        <spotLight
          position={[0, 6, 6]}
          angle={0.5}
          penumbra={0.5}
          intensity={4}
          color="#fde68a"
          target-position={[0, 0, 2.5]}
        />
      )}

      <TankGlass />
      <Bubbles />

      {tickets.map((t) => {
        const isWinner = winner === t.number
        return (
          <Float
            key={t.id}
            speed={isWinner ? 0 : 1.5}
            rotationIntensity={isWinner ? 0 : 0.4}
            floatIntensity={isWinner ? 0 : 0.6}
          >
            <FloatingTicket data={t} isWinner={isWinner} />
          </Float>
        )
      })}
    </>
  )
}

export default function TicketAquarium({
  ticketNumbers,
  winner = null,
}: {
  ticketNumbers: string[]
  winner?: string | null
}) {
  const tickets = useMemo<TicketData[]>(() => {
    const palette = ["#dc2626", "#ef4444", "#b91c1c", "#1f2937", "#e11d48"]
    const list = [...ticketNumbers]
    // make sure the winner is part of the floating tickets
    if (winner && !list.includes(winner)) list.unshift(winner)
    return list.slice(0, 24).map((number, i) => ({
      id: i,
      number,
      position: [
        MathUtils.randFloatSpread(8),
        MathUtils.randFloatSpread(6),
        MathUtils.randFloatSpread(3),
      ],
      rotation: [
        MathUtils.randFloatSpread(0.4),
        MathUtils.randFloatSpread(1),
        MathUtils.randFloatSpread(0.6),
      ],
      speed: MathUtils.randFloat(0.4, 0.9),
      drift: MathUtils.randFloat(0.2, 0.5),
      color: palette[i % palette.length],
    }))
  }, [ticketNumbers, winner])

  // Detect WebGL support; fall back to a 2D CSS aquarium if unavailable or lost
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
      if (!gl) setUseFallback(true)
    } catch {
      setUseFallback(true)
    }
  }, [])

  if (useFallback) {
    return <AquariumFallback ticketNumbers={ticketNumbers} winner={winner} />
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
      }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        const canvas = gl.domElement
        canvas.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault()
            setUseFallback(true)
          },
          false,
        )
      }}
    >
      <Scene tickets={tickets} winner={winner} />
    </Canvas>
  )
}
