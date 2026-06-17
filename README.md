# Rifa da CRF

Landing de rifa da Honda CRF feita em **Next.js 16 + React 19 + Tailwind 4 + shadcn/ui**, com um **aquário 3D em Three.js** onde os bilhetes vendidos flutuam e o sorteio acontece.

## Rodar local

Requer Node 18+ e pnpm.

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`.

## Build / Deploy

```bash
pnpm build && pnpm start
```

Deploy na Vercel: importe o repositório (framework **Next.js**, detectado automaticamente). Sem variáveis de ambiente por enquanto.

## Estrutura

- `app/page.tsx` — página principal (hero, aquário, contador, "seus bilhetes").
- `components/ticket-aquarium.tsx` — aquário 3D (react-three-fiber).
- `components/aquarium-fallback.tsx` — fallback 2D quando o WebGL não está disponível.
- `components/purchase-dialog.tsx` — modal de compra de bilhetes.
- `components/sold-counter.tsx` — contador de vendidos / progresso.
- `public/crf-moto.png` — imagem do prêmio.

## Roadmap (o que ainda falta pra rodar de verdade)

- [ ] **Pagamento real**: PIX (copia e cola) + checkout via WhatsApp. Hoje o modal só simula.
- [ ] **Estado real de vendas (Supabase)**: hoje os números são aleatórios e o contador é local. Persistir bilhetes vendidos pra dois compradores não pegarem o mesmo número.
- [ ] **Seleção de número específico** (opcional) além da compra por quantidade.
- [ ] **Painel admin**: confirmar pagamento e travar bilhete.
- [ ] Trocar dados de exemplo (total, valor, data do sorteio) pelos reais.

## Aviso legal

Rifas e sorteios no Brasil podem exigir autorização (SECAP/Ministério da Fazenda) dependendo do formato. Verifique antes de divulgar.
