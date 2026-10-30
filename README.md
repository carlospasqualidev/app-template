# App Template

Template de aplicativo **React Native + Expo** (SDK 56, New Architecture) reutilizável entre projetos, partindo do zero — sem biblioteca de UI, com componentes próprios.

> A fonte de verdade de convenções e comportamento é o [`CLAUDE.md`](CLAUDE.md), com os guias de referência em [`docs/`](docs/): [Definition of Done](docs/definition-of-done.md), [guardrails](docs/guardrails.md), [convenções](docs/conventions.md) e [testes](docs/testing-guide.md). Leia-o antes de contribuir.

## Stack

- **Expo Router** (rotas file-based) + **TanStack Query** (server state)
- **Zustand** (client state global) • **React Hook Form + Zod** (formulários)
- **Unistyles** (estilo com tema/variantes, claro + escuro automático) + a11y nos próprios componentes (props `accessibility*` do RN; **rn-primitives** só no checkbox)
- **Axios** (cliente HTTP com interceptors) • **sonner-native** (toast)
- **Jest + React Native Testing Library** (unit/integração) • **Maestro** (E2E)
- ESLint (`eslint-config-expo` + `eslint-plugin-security`) + Prettier + Husky + lint-staged

O app roda em **development build** (não em Expo Go — Unistyles tem código nativo).

## Começando

```bash
pnpm install
cp .env.example .env      # preencha EXPO_PUBLIC_API_URL
pnpm exec expo run:android      # gera e instala o dev build (uma vez)
pnpm exec expo start            # inicia o Metro
```

A sessão vem em **modo fake** (aceita qualquer credencial) — veja como plugar o backend em `src/services/session/sessionService.ts`.

## Scripts

| Comando                | O que faz                                                 |
| ---------------------- | --------------------------------------------------------- |
| `pnpm run go`           | Inicia o Metro (`expo start`)                             |
| `pnpm run dev`          | Gera e roda o dev build Android                           |
| `pnpm run lint`         | ESLint                                                    |
| `pnpm run typecheck`    | `tsc --noEmit`                                            |
| `pnpm test`             | Jest                                                      |
| `pnpm run test:related` | Jest só nos testes afetados pelas mudanças não commitadas |
| `pnpm run check`        | lint + typecheck + test (rode antes de empurrar)          |
| `pnpm run test:e2e`     | Maestro (precisa do CLI — ver `.maestro/README`)          |
| `pnpm run format`       | Prettier                                                  |

O `pre-commit` roda ESLint + Prettier nos arquivos staged; o `pre-push` roda typecheck + test.

## Estrutura

```
src/
├── app/         # Expo Router — rotas finas ((auth) público, (app) protegido)
├── components/  # componentes próprios (Unistyles; rn-primitives só no checkbox); form/ agrupa o kit
├── hooks/       # hooks reutilizáveis
├── lib/         # utilidades puras (env, queryClient, toast, getInitials)
├── screens/     # implementação das telas (uma pasta por feature)
├── services/    # api/ (cliente) + <módulo>/ (chamadas + schemas Zod)
├── stores/      # Zustand (sessão)
└── types/       # tipos de domínio
unistyles.ts     # tema (cores, tipografia, breakpoints)
```

## Convenções essenciais

- **Estilo só via Unistyles** (`StyleSheet` + `theme.colors.*`/`theme.gap(n)`) — nunca hex/px cravado.
- **Texto sempre pelo `@/components/text`**; toda tela usa `@/components/screen` como raiz.
- **Dados do servidor sempre via TanStack Query**; chamadas de API vivem em `src/services/<módulo>/`.
- **Formulários sempre com `useZodForm` + campos de `@/components/form`**, validados por Zod.
- **Token de sessão em `expo-secure-store`** (nunca `AsyncStorage`).
- **UI em pt-BR**, código em inglês. Suporte a **claro e escuro** é obrigatório em todo componente/tela.

Regras gerais no [`CLAUDE.md`](CLAUDE.md), com a versão curta de a11y, LGPD/PII e object injection; o detalhe está em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md) (a11y) e [`docs/claude/seguranca.md`](docs/claude/seguranca.md) (LGPD/PII, object injection); rotas, HTTP, formulários, componentes e tema em [`docs/conventions.md`](docs/conventions.md); testes em [`docs/testing-guide.md`](docs/testing-guide.md).

## Builds (EAS)

Perfis em [`eas.json`](eas.json): `development` (dev client), `preview` (interno) e `production`. Para E2E 100% estável, rode o Maestro contra um build `preview`/`release` (não sobre o Metro).
