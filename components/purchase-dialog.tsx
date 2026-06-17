"use client"

import { useState } from "react"
import { Check, Minus, Plus, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const PRICE = 25
const PACKAGES = [5, 10, 25, 50]

export default function PurchaseDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (quantity: number) => void
}) {
  const [quantity, setQuantity] = useState(5)
  const [done, setDone] = useState(false)

  const total = quantity * PRICE

  function handleConfirm() {
    setDone(true)
    onConfirm(quantity)
    setTimeout(() => {
      setDone(false)
      onOpenChange(false)
    }, 1400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border sm:max-w-md">
        {done ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl">Bilhetes garantidos!</DialogTitle>
            <DialogDescription className="text-base">
              Seus {quantity} bilhetes já estão flutuando no aquário. Boa sorte!
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Ticket className="h-6 w-6 text-primary" />
                Comprar bilhetes
              </DialogTitle>
              <DialogDescription>
                Cada bilhete custa R$ {PRICE},00. Escolha quantos você quer.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-4 gap-2 py-2">
              {PACKAGES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQuantity(p)}
                  className={`rounded-xl border px-2 py-3 text-center font-semibold transition-colors ${
                    quantity === p
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-secondary/40 text-foreground hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-16 text-center font-mono text-4xl font-bold tabular-nums">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                size="lg"
                className="w-full text-base font-semibold"
                onClick={handleConfirm}
              >
                Pagar R$ {total.toLocaleString("pt-BR")},00
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demonstração — nenhum pagamento real será cobrado.
              </p>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
