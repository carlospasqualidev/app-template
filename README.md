# App Template

Template de aplicativo **React Native + Expo** (SDK 56, New Architecture) reutilizável entre projetos, partindo do zero — sem biblioteca de UI, com componentes próprios.

> A fonte de verdade de convenções e comportamento é o [`CLAUDE.md`](CLAUDE.md). Leia-o antes de contribuir.

## Stack

- **Expo Router** (rotas file-based) + **TanStack Query** (server state)
- **Zustand** (client state global) • **React Hook Form + Zod** (formulários)
- **Unistyles** (estilo com tema/variantes, claro + escuro automático) + **rn-primitives** (a11y)
- **Axios** (cliente HTTP com interceptors) • **sonner-native** (toast)
- **Jest + React Native Testing Library** (unit/integração) • **Maestro** (E2E)
- ESLint (`eslint-config-expo` + `eslint-plugin-security`) + Prettier + Husky + lint-staged

O app roda em **development build** (não em Expo Go — Unistyles tem código nativo).

## Começando

```bash
npm install
cp .env.example .env      # preencha EXPO_PUBLIC_API_URL
npx expo run:android      # gera e instala o dev build (uma vez)
npx expo start            # inicia o Metro
```

A sessão vem em **modo fake** (aceita qualquer credencial) — veja como plugar o backend em `src/services/session/sessionService.ts`.

## Scripts

| Comando             | O que faz                                        |
| ------------------- | ------------------------------------------------ |
| `npm run go`        | Inicia o Metro (`expo start`)                    |
| `npm run dev`       | Gera e roda o dev build Android                  |
| `npm run lint`      | ESLint                                           |
| `npm run typecheck` | `tsc --noEmit`                                   |
| `npm test`          | Jest                                             |
| `npm run check`     | lint + typecheck + test (rode antes de empurrar) |
| `npm run test:e2e`  | Maestro (precisa do CLI — ver `.maestro/README`) |
| `npm run format`    | Prettier                                         |

O `pre-commit` roda ESLint + Prettier nos arquivos staged; o `pre-push` roda typecheck + test.

## Estrutura

```
src/
├── app/         # Expo Router — rotas finas ((auth) público, (app) protegido)
├── components/  # componentes próprios (rn-primitives + Unistyles); form/ agrupa o kit
├── hooks/       # hooks reutilizáveis
├── lib/         # utilidades puras (env, queryClient, toast)
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

Detalhes completos (a11y, LGPD/PII, performance, object injection, etc.) no [`CLAUDE.md`](CLAUDE.md).

## Builds (EAS)

Perfis em [`eas.json`](eas.json): `development` (dev client), `preview` (interno) e `production`. Para E2E 100% estável, rode o Maestro contra um build `preview`/`release` (não sobre o Metro).
