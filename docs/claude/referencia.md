# Referência: estrutura de pastas

Parte do [`CLAUDE.md`](../../CLAUDE.md), movida de lá sem reescrita: o texto é o mesmo e os títulos mantêm o nível de origem; o núcleo guarda a versão curta de cada regra. Os caminhos citados são relativos à raiz do repositório. Leia quando precisar saber onde fica cada pasta de `src/` ou onde criar um arquivo novo.

## Estrutura de pastas

```
src/
├── app/                 # Expo Router — rotas (arquivos finos que só orquestram)
│   ├── _layout.tsx      # raiz: providers + gate de sessão (validate/SessionBoot) + Stack + Toaster
│   ├── (auth)/          # grupo público — _layout (Stack), login, signup
│   └── (app)/           # grupo protegido — _layout (redirect + tabs + ErrorBoundary), telas
├── components/          # componentes próprios (Unistyles; rn-primitives só no checkbox); form/ agrupa o kit
├── hooks/               # hooks reutilizáveis
├── lib/                 # utilidades puras (env, queryClient, toast, getInitials)
├── screens/             # implementação das telas; uma pasta por feature (auth/, showcase/…)
├── services/            # acesso a dados — api/ (cliente) e <módulo>/ (chamadas + session)
├── stores/              # stores Zustand de client state global (sessão…)
└── types/               # tipos de domínio compartilhados
assets/                  # imagens e estáticos (alias @/assets/*), fora de src/
unistyles.ts             # config do Unistyles (temas, breakpoints, settings)
index.ts                 # entrypoint (importa expo-router/entry + unistyles)
```
