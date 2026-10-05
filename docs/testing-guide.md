# Guia de testes

Guia de referência movido do `CLAUDE.md`: leia antes de escrever ou mudar teste Jest/RNTL ou fluxo Maestro. O que torna a tarefa e a entrega prontas (comandos do loop, fechamento com `npm run check` e Maestro, placar) está em [`definition-of-done.md`](definition-of-done.md).

## Ferramentas, comandos e organização

- Jest (preset `jest-expo`) + React Native Testing Library (RNTL), e Maestro para E2E.
- **Comandos**: `npm test` (Jest), `npm run test:related` (só os testes afetados pelas mudanças não commitadas), `npm run typecheck` (`tsc --noEmit`), `npm run lint`, `npm run format` (Prettier), `npm run check` (lint + typecheck + test — rode antes de empurrar). O `pre-commit` (Husky + lint-staged) roda ESLint+Prettier nos arquivos staged; o `pre-push` roda typecheck + test.
- **Testes relacionados no loop por tarefa**: `npm run test:related` (`jest --onlyChanged`) é o padrão do loop (ver [`definition-of-done.md`](definition-of-done.md)). Ele pega os arquivos alterados e não commitados (incluindo os novos, não rastreados) pelo git e segue o grafo de imports do Jest: inclui os testes de quem importa o arquivo alterado, direta ou indiretamente. Mexer em `src/components/badge` roda só o teste do `Badge`; mexer em `src/components/text`, que quase todo componente importa, roda também os testes de `Button`, `Avatar`, `Modal`, `Field` e outros consumidores. Sem mudança não commitada, não roda nada e sai com exit 0 e "No tests found": isso não vale como placar nem como verde; depois do commit, use `npx jest --findRelatedTests <arquivos>`. Para iterar num teste só, `npx jest <caminho>` ou `npx jest -t "<nome do teste>"` continuam valendo. Alterar config (`jest.config.js`, `src/tests/setup.ts`, `package.json`) não dispara a suite toda: nesse caso rode `npm test`.
- Testes unitários/integração vivem em `src/tests/`, organizados em pastas — uma por componente/módulo, com `<name>.test.ts(x)` dentro.
- Setup global em `src/tests/setup.ts` — importa o **mock do Unistyles** (`react-native-unistyles/mocks`) + a config de temas (`unistyles.ts`) e registra mocks manuais de **`react-native-reanimated`** e **`react-native-safe-area-context`** (sem runtime nativo no Jest). Sem isso os componentes não renderizam. O `jest.config.js` estende o `transformIgnorePatterns` do `jest-expo` para transpilar `@rn-primitives` (publicado como JSX não compilado) — necessário para testar componentes montados sobre rn-primitives (ex.: `Checkbox`).
- **`src/tests/` é excluído do `tsc --noEmit`** (o `setup.ts` importa o mock do Unistyles, cujo source arrasta tipos web e quebra a checagem). Os testes rodam via Jest/Babel — o gate de tipos cobre o app, o Jest cobre os testes.
- **Run frio é o caso a proteger:** o `jest.config.js` fixa `testTimeout: 30_000` e `maxWorkers: "50%"`. Com cache de transformação vazio (CI, primeira execução, `--clearCache`) cada worker transpila a árvore do `react-native`/`jest-expo` do zero, e os 5s default do Jest estouram por **inanição de CPU** — um teste de ~100ms chegou a falhar no `pre-push` por isso. Metade dos cores contende menos que os `cores - 1` do default (medição de 2026-10-05, com outras suites rodando na mesma máquina: primeira execução ≈102 s, as seguintes ≈16–23 s). Se um teste estourar os 30s, aí é hang de verdade (promise não resolvida, fake timer sem `advanceTimers`) — investigue o teste, não o timeout.
- O componente/módulo é importado via alias `@/...`, nunca por caminho relativo. Para testar o `useZodForm`, importe de `@/components/form/useZodForm` (não do barrel `@/components/form`, que arrasta ícones e outros módulos pesados pro ambiente de teste).

```
src/tests/
├── setup.ts
├── components/<component>/<name>.test.tsx
├── hooks/<hook>/<hook>.test.tsx
├── lib/<grupo>/<arquivo>.test.ts
└── services/<servico>/<arquivo>.test.ts
```

- Escreva teste para lógica não-trivial: utilidades puras, hooks com lógica, regras de negócio, edge cases.
- Teste o caminho de falha, não só o happy path.
- Testes legíveis — eles documentam o comportamento esperado.
- Componente reutilizável recebe teste cobrindo o contrato público (props obrigatórias, estados, handlers). Ao mudar a API dele, atualize o teste junto, não depois.
- Fluxos de ponta a ponta (login, navegação principal, checkout) ficam em **Maestro** (`.maestro/*.yaml`), não em teste de unidade. Rodam no app real (dev build + emulador/device) via `npm run test:e2e` (precisa do CLI do Maestro, instalado fora do npm — ver [`.maestro/README.md`](../.maestro/README.md)). Os fluxos miram por **texto visível / label de acessibilidade** (placeholder de input, rótulo de aba, título de tela) — o mesmo caminho do leitor de tela; ao mudar textos da UI, atualize os specs. Fluxos prontos: `login`, `navigation`, `logout`, `deletePost`.

## Como escrever testes (práticas)

Três regras pegam 90% da qualidade de teste:

**1. Use `userEvent`, não `fireEvent`.** `userEvent` (RNTL) simula a sequência real de gestos e dispara handlers que o `fireEvent` pula. Importe de `@testing-library/react-native` e use `userEvent.setup()`.

```ts
const user = userEvent.setup();
await user.type(screen.getByLabelText("E-mail"), "foo@bar.com");
await user.press(screen.getByRole("button", { name: "Entrar" }));
```

**2. Prefira `getByRole` / `getByLabelText` a `getByTestId`.** Role + nome acessível é como o usuário (e o leitor de tela) encontra o elemento — se o teste passa por role, a acessibilidade do componente também passou. No RN o nome vem de `accessibilityLabel` ou do texto. `testID` é fallback para casos sem role natural.

```ts
✓ screen.getByRole('button', { name: 'Salvar' });
✓ screen.getByLabelText('E-mail');
✗ screen.getByTestId('save-button');     // só se não houver role/label
```

Ordem de prioridade: `getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByDisplayValue` → `getByText` → `getByTestId`.

**3. `findBy*` para async, não `await waitFor(() => getBy*)`.** `findBy*` já é `waitFor` + `getBy` — mais curto, mais legível, mensagem de erro melhor.

```ts
✓ await screen.findByText('Registro salvo.');
✗ await waitFor(() => expect(screen.getByText('Registro salvo.')).toBeOnTheScreen());
```

Use `waitFor` apenas para asserções que não são "elemento apareceu" (ex.: `expect(mock).toHaveBeenCalledWith(...)`).

**Outras práticas:**

- **`queryBy*` para asserção negativa** (`expect(queryByText('...')).not.toBeOnTheScreen()`). Nunca use `getBy*` esperando ausência — ele lança.
- **Não mocke o que você está testando.** Mocke serviços externos (cliente HTTP, toast, módulos nativos), não o próprio componente.
- **Wrapper de teste centralizado**: `QueryClientProvider` (e navegação, quando necessário) vêm de um helper em `src/tests/` para não repetir setup. O tema do Unistyles é global (configurado no boot) e não precisa de provider.
- **Factories de dados** (`makeUser({ name: 'Maria' })`) co-localizadas no teste ou em `src/tests/factories/` — evita literais gigantes inline.
- **Limpe estado entre testes**: `afterEach(() => queryClient.clear())` quando o teste compartilha cliente.
