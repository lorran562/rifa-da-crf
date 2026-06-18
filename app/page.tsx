"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Ticket, ShieldCheck, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CONFIG = {
  premio: "Honda CRF",
  total: 400,
  preco: 50,
  whatsapp: "5569999999999", // 55 + DDD + numero
  pixKey: "sua-chave-pix@exemplo.com",
  pixNome: "Seu Nome Completo",
  dataSorteio: "30/08/2026",
  instagram: "@shieldweb",
}

// numeros ja vendidos (mock deterministico — trocar por Supabase depois)
const SOLD: Set<number> = (() => {
  const s = new Set<number>()
  let seed = 7
  while (s.size < 78) {
    seed = (seed * 9301 + 49297) % 233280
    s.add(1 + Math.floor((seed / 233280) * CONFIG.total))
  }
  return s
})()

const pad = (n: number) => String(n).padStart(3, "0")
const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function Home() {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [nome, setNome] = useState("")
  const [tel, setTel] = useState("")
  const [copied, setCopied] = useState(false)

  const numbers = useMemo(
    () => Array.from({ length: CONFIG.total }, (_, i) => i + 1),
    []
  )

  const soldCount = SOLD.size
  const pct = Math.round((soldCount / CONFIG.total) * 100)
  const chosen = [...selected].sort((a, b) => a - b)
  const total = chosen.length * CONFIG.preco

  function toggle(n: number) {
    if (SOLD.has(n)) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  function addRandom(qty: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      const free = numbers.filter((n) => !SOLD.has(n) && !next.has(n))
      for (let i = 0; i < qty && free.length; i++) {
        const idx = Math.floor(Math.random() * free.length)
        next.add(free.splice(idx, 1)[0])
      }
      return next
    })
  }

  const waText = encodeURIComponent(
    `Ola! Quero participar da Rifa da ${CONFIG.premio}.\n\n` +
      `Numeros: ${chosen.length ? chosen.map(pad).join(", ") : "(nenhum)"}\n` +
      `Quantidade: ${chosen.length}\n` +
      `Total: ${brl(total)}` +
      (nome ? `\nNome: ${nome}` : "") +
      (tel ? `\nWhatsApp: ${tel}` : "")
  )
  const waLink = `https://wa.me/${CONFIG.whatsapp}?text=${waText}`

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(CONFIG.pixKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  function scrollToNumbers() {
    document.getElementById("numeros")?.scrollIntoView({ behavior: "smooth" })
  }

  function goReserve() {
    if (!chosen.length) {
      scrollToNumbers()
      return
    }
    window.open(waLink, "_blank")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2 font-mono text-lg font-bold">
          <Ticket className="h-5 w-5 text-primary" />
          RIFA <span className="text-primary">CRF</span>
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          {CONFIG.total - soldCount} de {CONFIG.total} livres
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-8 px-5 pb-12 pt-4 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" /> Sorteio pela Loteria Federal
          </span>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Concorra a uma <span className="text-primary">{CONFIG.premio}</span>
          </h1>
          <p className="max-w-md text-pretty text-lg text-muted-foreground">
            {CONFIG.total} números, {brl(CONFIG.preco)} cada. Escolha os seus,
            garanta no PIX e fique de olho no sorteio.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={scrollToNumbers} className="text-base font-semibold">
              Escolher meus números
            </Button>
            <span className="font-mono text-sm text-muted-foreground">
              {brl(CONFIG.preco)} <span className="text-foreground">/número</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-5 pt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-accent" /> Prêmio garantido</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Pagamento no PIX</span>
          </div>
        </div>

        <div className="glass relative flex h-[320px] items-center justify-center overflow-hidden rounded-3xl sm:h-[400px]">
          <Image
            src="/crf-moto.png"
            alt="Honda CRF, prêmio da rifa"
            width={1024}
            height={1024}
            priority
            className="relative h-auto w-[88%] animate-float-slow drop-shadow-2xl"
          />
          <div className="glass-strong absolute left-4 top-4 rounded-2xl px-4 py-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Prêmio</p>
            <p className="font-mono text-lg font-bold">{CONFIG.premio}</p>
          </div>
        </div>
      </section>

      {/* Progresso */}
      <section className="mx-auto max-w-5xl px-5 pb-10">
        <div className="glass rounded-2xl p-6">
          <div className="mb-3 flex items-end justify-between gap-4">
            <p className="font-mono text-2xl font-bold">
              {soldCount} <span className="text-muted-foreground">/ {CONFIG.total}</span>{" "}
              <span className="font-sans text-sm font-medium text-muted-foreground">vendidos</span>
            </p>
            <p className="font-mono text-xl font-bold text-accent">{pct}%</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      {/* Numeros */}
      <section id="numeros" className="mx-auto max-w-5xl px-5 pb-12">
        <h2 className="text-3xl font-bold tracking-tight">Escolha seus números</h2>
        <p className="mt-1 text-muted-foreground">Toque pra selecionar. Os vendidos ficam riscados.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => addRandom(1)}>+1 número</Button>
          <Button variant="secondary" onClick={() => addRandom(5)}>+5 surpresinha</Button>
          <Button variant="secondary" onClick={() => addRandom(10)}>+10 surpresinha</Button>
          <Button variant="ghost" onClick={() => setSelected(new Set())}>Limpar</Button>
        </div>

        <div
          className="mt-5 grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(3rem, 1fr))" }}
        >
          {numbers.map((n) => {
            const isSold = SOLD.has(n)
            const isSel = selected.has(n)
            return (
              <button
                key={n}
                onClick={() => toggle(n)}
                disabled={isSold}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg border font-mono text-sm transition active:scale-90",
                  isSold && "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-50",
                  !isSold && !isSel && "border-border bg-card/50 hover:border-primary",
                  isSel && "border-primary bg-primary font-bold text-primary-foreground"
                )}
              >
                {pad(n)}
              </button>
            )
          })}
        </div>
      </section>

      {/* Resumo */}
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold">Seu pedido</h3>
          <div className="mt-3 flex min-h-9 flex-wrap gap-2">
            {chosen.length ? (
              chosen.map((n) => (
                <span key={n} className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold text-primary">
                  {pad(n)}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Nenhum número selecionado ainda.</span>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="rounded-lg border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary"
            />
            <input
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="Seu WhatsApp (DDD + número)"
              inputMode="tel"
              className="rounded-lg border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary"
            />
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              {chosen.length} número(s) × {brl(CONFIG.preco)}
            </span>
            <span className="font-mono text-3xl font-bold">{brl(total)}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="lg" onClick={goReserve} className="flex-1 text-base font-semibold">
              Reservar e pagar no WhatsApp
            </Button>
            <Button size="lg" variant="secondary" onClick={copyPix} className="font-semibold">
              {copied ? "Chave copiada!" : "Copiar chave PIX"}
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Faça o PIX de <b className="text-foreground">{brl(total)}</b> para{" "}
            <span className="font-mono text-foreground">{CONFIG.pixKey}</span> ({CONFIG.pixNome}). Depois mande o
            comprovante no WhatsApp com seus números — eles só são confirmados após o pagamento.
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="mb-5 text-3xl font-bold tracking-tight">Como funciona</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["01", "Escolha", "Selecione seus números na grade."],
            ["02", "Pague no PIX", "Faça o PIX e envie o comprovante no WhatsApp."],
            ["03", "Concorra", "No sorteio é só torcer. Resultado pela Loteria Federal."],
          ].map(([num, titulo, desc]) => (
            <div key={num} className="glass rounded-2xl p-5">
              <p className="font-mono text-sm font-bold text-accent">{num}</p>
              <p className="mt-2 text-base font-bold uppercase">{titulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-8 text-center text-sm text-muted-foreground">
          Sorteio previsto para {CONFIG.dataSorteio}. Proibida a participação de menores de 18 anos. {CONFIG.instagram}
        </div>
      </footer>
    </main>
  )
}
