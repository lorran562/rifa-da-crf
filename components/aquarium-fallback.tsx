"use client"

import { useMemo } from "react"

type FallbackTicket = {
  number: string
  left: number
  top: number
  delay: number
  duration: number
  size: number
  isWinner: boolean
}

export default function AquariumFallback({
  ticketNumbers,
  winner = null,
}: {
  ticketNumbers: string[]
  winner?: string | null
}) {
  const tickets = useMemo<FallbackTicket[]>(() => {
    const list = [...ticketNumbers]
    if (winner && !list.includes(winner)) list.unshift(winner)
    return list.slice(0, 18).map((number, i) => ({
      number,
      left: 6 + ((i * 37) % 84),
      top: 8 + ((i * 53) % 74),
      delay: (i % 6) * -0.9,
      duration: 5 + (i % 4),
      size: i % 3 === 0 ? 1.1 : 0.92,
      isWinner: number === winner,
    }))
  }, [ticketNumbers, winner])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* water gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 40%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklch, #1e3a8a 30%, transparent), transparent 60%)",
        }}
      />
      {/* rising bubbles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={`b-${i}`}
          className="absolute rounded-full bg-sky-200/30"
          style={{
            left: `${(i * 41) % 96}%`,
            bottom: "-10%",
            width: `${4 + (i % 4) * 3}px`,
            height: `${4 + (i % 4) * 3}px`,
            animation: `aq-rise ${6 + (i % 5)}s linear ${(i % 6) * -1.2}s infinite`,
          }}
        />
      ))}

      {tickets.map((t) => (
        <div
          key={t.number}
          className="absolute"
          style={{
            left: `${t.left}%`,
            top: `${t.top}%`,
            animation: `aq-float ${t.duration}s ease-in-out ${t.delay}s infinite`,
            zIndex: t.isWinner ? 20 : 1,
          }}
        >
          <div
            className={
              t.isWinner
                ? "flex flex-col items-center justify-center rounded-xl border px-4 py-2 shadow-lg"
                : "flex flex-col items-center justify-center rounded-xl border px-3 py-1.5"
            }
            style={
              t.isWinner
                ? {
                    transform: "scale(1.35)",
                    background: "#fbbf24",
                    borderColor: "#f59e0b",
                    color: "#1a1100",
                    boxShadow: "0 0 32px #fbbf24aa",
                  }
                : {
                    transform: `scale(${t.size})`,
                    background: "color-mix(in oklch, var(--primary) 22%, transparent)",
                    borderColor: "color-mix(in oklch, var(--primary) 45%, transparent)",
                    backdropFilter: "blur(4px)",
                  }
            }
          >
            <span className="text-[9px] font-medium uppercase tracking-widest opacity-80">
              {t.isWinner ? "Ganhador" : "Bilhete"}
            </span>
            <span className="font-mono text-base font-bold">{t.number}</span>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes aq-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-16px);
          }
        }
        @keyframes aq-rise {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-560px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
