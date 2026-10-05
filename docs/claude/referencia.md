# Referência: estrutura de pastas

Parte do [`CLAUDE.md`](../../CLAUDE.md), movida de lá sem reescrita: o texto é o mesmo e os títulos mantêm o nível de origem; o núcleo guarda a versão curta de cada regra. Os caminhos citados são relativos à raiz do repositório. Leia quando precisar saber onde fica cada pasta de `src/` ou onde criar um arquivo novo.

## Estrutura de pastas

```
src/
├── app/                 # Expo Router — rotas (arquivos finos que só orquestram)
│   ├── _layout.tsx      # raiz: providers + gate de sessão (validate/SessionBoot) + Stack + Toaster
│   ├── (auth)/          # grupo público — _layout (Stack), login, signup
│   └── (app)/           # grupo protegido — _layout (redirect + tabs + ErrorBoundary), telas
├── assets/              # imagens e estáticos
├── components/          # componentes próprios (rn-primitives + Unistyles); form/ agrupa o kit
├── hooks/               # hooks reutilizáveis
├── lib/                 # utilidades puras (env, queryClient, toast)
├── screens/             # implementação das telas; uma pasta por feature (auth/, showcase/…)
├── services/            # acesso a dados — api/ (cliente) e <módulo>/ (chamadas + session)
├── stores/              # stores Zustand de client state global (sessão…)
└── types/               # tipos de domínio compartilhados
unistyles.ts             # config do Unistyles (temas, breakpoints, settings)
index.ts                 # entrypoint (importa expo-router/entry + unistyles)
```

> Verificar: possivelmente desatualizado — a linha `├── assets/` da árvore acima põe os estáticos em `src/assets/`, que não existe; eles estão em `assets/` na raiz, com o alias `@/assets/*` -> `./assets/*` (`tsconfig.json:7`); ver `docs/mapa/enxugar-claude-md.md`, desatualizados, item 1.

> Verificar: possivelmente desatualizado — a linha `├── components/` da árvore acima diz “(rn-primitives + Unistyles)”, mas só `@rn-primitives/checkbox` está instalado (`package.json:9`) e o `Modal` não usa rn-primitives (`docs/conventions.md:377`); ver `docs/mapa/enxugar-claude-md.md`, desatualizados, item 3.

> Verificar: possivelmente desatualizado — a linha `├── lib/` da árvore acima lista “(env, queryClient, toast)”, mas `src/lib/` também tem `getInitials.ts` (usado pelo `Avatar`, `docs/conventions.md:387`); ver `docs/mapa/enxugar-claude-md.md`, desatualizados, item 4.
