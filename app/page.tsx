"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Calendar, PartyPopper, ShieldCheck, Ticket, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import SoldCounter from "@/components/sold-counter"
import PurchaseDialog from "@/components/purchase-dialog"

const TicketAquarium = dynamic(() => import("@/components/ticket-aquarium"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
      Carregando aquário...
    </div>
  ),
})

const TOTAL = 5000
const INITIAL_SOLD = 3187

function randomNumbers(count: number) {
  const set = new Set<string>()
  while (set.size < count) {
    set.add(String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0"))
  }
  return Array.from(set)
}

export default function Home() {
  const [open, setOpen] = useState(false)
  const [sold, setSold] = useState(INITIAL_SOLD)
  const [myTickets, setMyTickets] = useState<string[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [drawing, setDrawing] = useState(false)

  // tickets shown floating in the aquarium (mix of community + yours)
  const floatingNumbers = useMemo(() => {
    const base = randomNumbers(20)
    return [...myTickets, ...base].slice(0, 24)
  }, [myTickets])

  function handleConfirm(quantity: number) {
    const newOnes = randomNumbers(quantity)
    setMyTickets((prev) => [...newOnes, ...prev])
    setSold((s) => Math.min(s + quantity, TOTAL))
  }

  function handleDraw() {
    if (drawing) return
    setWinner(null)
    setDrawing(true)
    // suspense before the winning ticket floats up
    setTimeout(() => {
      const pick = floatingNumbers[Math.floor(Math.random() * floatingNumbers.length)]
      setWinner(pick)
      setDrawing(false)
    }, 2200)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* ambient glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%), radial-gradient(50% 50% at 100% 100%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight">
          <Ticket className="h-5 w-5 text-primary" />
          RIFA<span className="text-primary">CRF</span>
        </div>
        <Button onClick={() => setOpen(true)} className="font-semibold">
          Comprar bilhete
        </Button>
      </header>

      {/* Hero: moto showcase */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-10 pt-6 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Sorteio ao vivo pela Loteria Federal
          </span>

          <h1 className="text-balance font-sans text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Concorra a uma{" "}
            <span className="text-primary text-glow">Honda CRF</span> zero km
          </h1>

          <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Garanta seus bilhetes, acompanhe cada um deles flutuando no nosso
            aquário 3D e veja em tempo real quanto falta para o grande sorteio.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className="text-base font-semibold"
            >
              Quero meus bilhetes
            </Button>
            <span className="font-mono text-sm text-muted-foreground">
              a partir de <span className="text-foreground">R$ 25,00</span>{" "}
              /bilhete
            </span>
          </div>

          <div className="flex flex-wrap gap-5 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Pagamento seguro
            </span>
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" /> Prêmio garantido
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" /> Sorteio 30/06
            </span>
          </div>
        </div>

        {/* Moto prize card */}
        <div className="glass relative flex h-[360px] items-center justify-center overflow-hidden rounded-[2rem] sm:h-[440px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 60%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 75%)",
            }}
          />
          <Image
            src="/crf-moto.png"
            alt="Honda CRF vermelha, prêmio da rifa"
            width={1024}
            height={1024}
            priority
            className="relative h-auto w-[88%] animate-float-slow drop-shadow-2xl"
          />
          <div className="glass-strong absolute left-4 top-4 rounded-2xl px-4 py-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Prêmio
            </p>
            <p className="font-mono text-lg font-bold text-foreground">
              Honda CRF
            </p>
          </div>
        </div>
      </section>

      {/* Aquarium section — where tickets float and the draw happens */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              O aquário dos bilhetes
            </h2>
            <p className="mt-1 max-w-xl text-pretty text-muted-foreground">
              Cada bilhete vendido flutua aqui dentro. No dia do sorteio, um
              deles sobe iluminado e leva a moto para casa.
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleDraw}
            disabled={drawing}
            className="font-semibold"
          >
            <PartyPopper className="mr-2 h-5 w-5" />
            {drawing ? "Sorteando..." : "Simular sorteio"}
          </Button>
        </div>

        {/* The aquarium tank — large and fully visible */}
        <div className="glass relative h-[460px] w-full overflow-hidden rounded-[2rem] sm:h-[560px]">
          <TicketAquarium ticketNumbers={floatingNumbers} winner={winner} />

          {/* live count badge */}
          <div className="glass-strong absolute right-4 top-4 rounded-2xl px-4 py-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              No aquário
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {sold.toLocaleString("pt-BR")} bilhetes
            </p>
          </div>

          {/* drawing overlay */}
          {drawing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
              <p className="animate-pulse font-mono text-2xl font-bold text-primary text-glow">
                Sorteando o ganhador...
              </p>
            </div>
          )}

          {/* winner banner */}
          {winner && !drawing && (
            <div className="glass-strong absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-7 w-7 text-accent" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Bilhete sorteado
                  </p>
                  <p className="font-mono text-2xl font-bold text-foreground">
                    {winner}
                  </p>
                </div>
              </div>
              {myTickets.includes(winner) ? (
                <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                  É o seu bilhete!
                </span>
              ) : (
                <Button variant="secondary" onClick={handleDraw} className="font-semibold">
                  Sortear de novo
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Counter + your tickets */}
      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SoldCounter sold={sold} total={TOTAL} />
        </div>
        <div className="glass rounded-3xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Ticket className="h-5 w-5 text-primary" /> Seus bilhetes
          </h2>
          {myTickets.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Você ainda não tem bilhetes. Compre agora e eles aparecerão
              flutuando no aquário acima.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {myTickets.map((n) => (
                <span
                  key={n}
                  className="rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold text-primary"
                >
                  {n}
                </span>
              ))}
            </div>
          )}
          <Button
            onClick={() => setOpen(true)}
            variant="secondary"
            className="mt-5 w-full font-semibold"
          >
            Adicionar mais
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-8 text-center text-sm text-muted-foreground">
          Rifa beneficente fictícia para demonstração. Imagens ilustrativas.
        </div>
      </footer>

      <PurchaseDialog open={open} onOpenChange={setOpen} onConfirm={handleConfirm} />
    </main>
  )
}
