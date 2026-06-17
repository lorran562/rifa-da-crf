"use client"

import { useEffect, useRef, useState } from "react"

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

export default function SoldCounter({
  sold,
  total,
}: {
  sold: number
  total: number
}) {
  const animatedSold = useCountUp(sold)
  const percent = Math.min((sold / total) * 100, 100)

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Bilhetes vendidos
          </p>
          <p className="mt-1 font-mono text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
            {animatedSold.toLocaleString("pt-BR")}
            <span className="text-2xl text-muted-foreground sm:text-3xl">
              {" "}
              / {total.toLocaleString("pt-BR")}
            </span>
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-3xl font-bold text-primary text-glow sm:text-4xl">
            {percent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div
        className="mt-5 h-3 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso de vendas da rifa"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
          style={{
            width: `${percent}%`,
            boxShadow: "0 0 20px var(--primary)",
          }}
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Faltam{" "}
        <span className="font-semibold text-foreground">
          {(total - sold).toLocaleString("pt-BR")}
        </span>{" "}
        bilhetes para o sorteio acontecer.
      </p>
    </div>
  )
}
