# CLAUDE.md

Guia para o Claude trabalhar neste app mobile. Este arquivo é a fonte de verdade para convenções e comportamento esperado.

> Este é um **template de aplicativo** reutilizável entre projetos, partindo praticamente do zero. Não assuma uma biblioteca de componentes pronta: o que não existir ainda, você cria seguindo as convenções abaixo. Mantenha tudo genérico e reaproveitável — nada de regra de negócio de um cliente específico vazando para a base do template.

---

## Stack

React Native + Expo (SDK 56, New Architecture) + TypeScript • Expo Router (file-based) + TanStack Query • Zustand • React Hook Form + Zod • Unistyles + rn-primitives (componentes próprios) • Axios • toast (`sonner-native`) • Jest + React Native Testing Library + Maestro (E2E) • ESLint (`eslint-config-expo`) + Prettier + Husky + lint-staged.

Estilo via **Unistyles** (`StyleSheet` nativo com tema/variantes), nunca `className`/Tailwind. Acessibilidade e comportamento dos componentes via **rn-primitives**. O app roda em **development build** (EAS ou `expo run:android`), **não** em Expo Go — Unistyles tem código nativo.

Autenticação por **token** guardado em `expo-secure-store` (nunca em `AsyncStorage`), enviado via header `Authorization`.

---

## Comportamento esperado

Aja como engenheiro sênior responsável por qualidade e manutenibilidade de longo prazo.

Antes de escrever código:

- Leia o código existente ao redor do arquivo que você vai mexer.
- Identifique padrões, arquitetura e convenções já adotadas.
- Prefira consistência com o código atual a introduzir padrões novos.
- Avalie efeitos colaterais e impacto em outras partes do sistema.

Prioridade ao decidir: **correctness → readability → maintainability → consistency → performance** (performance só quando relevante).

Evite complexidade desnecessária, over-engineering e soluções que desviem da arquitetura atual.

### Estratégia de decisão (quando há múltiplas soluções)

1. A solução correta mais simples
2. A mais legível
3. A mais consistente com o codebase
4. Razoável em performance e escalabilidade

Se uma mudança ameaça introduzir instabilidade, inconsistência ou complexidade desnecessária, prefira a versão mais simples e segura.

### Inspirações de design e organização

Para decisões de UX, layout ou organização de tela, siga esta ordem:

1. **Procure primeiro no próprio projeto.** Antes de inventar, varra `src/screens/` e `src/components/` atrás de algo equivalente já criado. Replique pasta, abstração e cadência visual que já existem. Padronização interna **sempre** vence preferência individual — uma tela nova deve parecer parte do sistema, não um experimento isolado.
2. **Quando não houver referência interna, inspire-se em sistemas mobile consolidados** e nas diretrizes de plataforma (Material Design 3 no Android, Human Interface Guidelines no iOS) e em apps de referência (Linear, Things, Stripe, Notion mobile). Use-os para preencher lacunas — _como_ organizam navegação por abas, _onde_ colocam a ação primária (FAB, header, bottom bar), _como_ tratam listas longas e pull-to-refresh. Adapte para os padrões deste projeto; não traga estrutura paralela de fora quando já existe um padrão interno.
3. **Se a decisão vai virar padrão para outras telas, documente.** Quando você introduz uma convenção que se repetirá, registre brevemente em `CLAUDE.md` para que a próxima sessão (humana ou Claude) já chegue alinhada.

Resumo: **consistência interna > inspiração externa > improvisar do zero.**

---

## Linguagem de código

- Todo código-fonte em **inglês**.
- `camelCase` para variáveis, funções e arquivos `.ts`/`.tsx`.
- Arquivos de rota do Expo Router seguem a convenção da lib (`_layout.tsx`, `+not-found.tsx`, `[id].tsx`, grupos `(auth)`).
- Nomes claros e que revelem intenção. Sem abreviações desnecessárias.
  - Prefira: `calculateInventoryBalance`, `createUserSession`, `validatePhoneNumber`
  - Evite: `data`, `info`, `handleThing`, `processStuff`
- Código auto-documentado é melhor que comentário. Não escreva comentário que apenas reafirma o que o código já diz.

---

## TypeScript

- **Evite `any`.** Use tipos explícitos ou genéricos.
- Use `interface` para shapes de objeto que podem ser estendidos; `type` para uniões, interseções e aliases.
- Inferência só quando o tipo é óbvio pela atribuição.
- Marque return type explicitamente em funções públicas/exportadas quando ajudar.
- Use `unknown` quando o tipo é genuinamente desconhecido — restrinja antes de usar.
- Mantenha o `tsconfig` em `strict`. Não relaxe flags para "fazer compilar".

---

## Qualidade de código

- Implementações simples e explícitas.
- Sem abstrações prematuras. Três linhas parecidas é melhor que uma abstração precoce.
- Funções e componentes pequenos, com responsabilidade única.
- Composição > herança complexa.
- Remova código redundante/não-usado **apenas dentro do escopo da mudança atual**.
- Sem error handling, fallbacks ou validação para cenários que não podem acontecer. Confie em código interno e garantias do framework. Valide apenas em fronteiras (input do usuário, respostas de API).

### Refatoração

- Não quebre comportamento existente.
- Refatoração incremental e segura > grandes rewrites.
- Mantenha interfaces, APIs e contratos quando possível.
- Limite o escopo da refatoração ao que se relaciona com a tarefa atual.

---

## JSX e markup (`View`/`Text`) — menos é mais

Você tende a empilhar `<View>` e estilos a mais. **Pare**. Cada elemento e cada estilo precisa pagar pelo seu lugar. JSX limpo é fundamental — quem lê depois (humano ou Claude) entende a intenção pelo formato, não escava entre wrappers.

### Antes de adicionar uma `<View>`, pergunte

1. Existe pra layout real (flex/spacing/posição)? Mantenha.
2. Existe pra agrupar um nó acessível (`accessible`, `accessibilityRole`)? Mantenha com o papel certo.
3. Existe só pra agrupar JSX? Troque por **Fragment** (`<>...</>`).
4. Existe só pra aplicar um estilo num filho? Passe o estilo pro filho direto.

Se a resposta não é #1 ou #2, a `View` não deveria estar lá. Lembre que **React Native não tem HTML semântico** (`section`, `header`, etc.) — a semântica vem de `accessibilityRole`, não de uma tag.

### Regras

- **Reuse componentes que você já criou** em vez de recriar a mesma estrutura com `View` e estilos soltos. Se um padrão aparece em duas telas, promova a um componente reutilizável.
- **Não empilhe wrappers de layout**: um `View` com `flex` geralmente basta. `<View flex><View flex>` é code smell.
- **Sem estilo redundante**: nada de repetir `flexDirection: 'column'` (default do RN), largura/altura que o flex já resolve, ou cor de texto que já é o default do tema.
- **Prefira tokens do tema a número mágico.** Espaçamentos, cores, tipografia e **raio/curvatura** vêm do tema do Unistyles (`theme.gap(n)`, `theme.colors.*`, `theme.radius.*`), não de valores cravados no componente. Valor solto descalibra o ritmo visual entre telas.
  - ❌ `padding: 13` · `marginTop: 7` · `color: '#6b7280'`
  - ✓ `padding: theme.gap(2)` · `marginTop: theme.gap(1)` · `color: theme.colors.textMuted`
- **Prefira estilo no elemento certo**, não num wrapper criado pra isso. Se precisa de margem num botão, ajuste o `gap` do pai ou o estilo do próprio botão.
- **Texto sempre dentro de `<Text>`.** String solta dentro de `<View>` quebra no RN.
- **Não comente o que o JSX já diz.** Componente bem nomeado dispensa `{/* Header */}` em cima de `<Header />`.

### Exemplo

❌ Excesso de wrappers e estilos redundantes:

```tsx
<View style={{ flexDirection: "column", gap: 16 }}>
  <View>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 18, color: "#111" }}>Resumo</Text>
    </View>
    <View style={{ marginTop: 8 }}>
      <Text style={{ fontSize: 14, color: "#6b7280" }}>Visão do dia.</Text>
    </View>
  </View>
  <View>
    <Button onPress={save}>Salvar</Button>
  </View>
</View>
```

✓ Enxuto e legível:

```tsx
<View style={styles.section}>
  <Text style={styles.title}>Resumo</Text>
  <Text style={styles.muted}>Visão do dia.</Text>
  <Button onPress={save}>Salvar</Button>
</View>;

const styles = StyleSheet.create((theme) => ({
  section: { gap: theme.gap(2) },
  title: { ...theme.typography.h3 },
  muted: { color: theme.colors.textMuted },
}));
```

---

## Error handling

- Trate erros de forma explícita e previsível. Sem falhas silenciosas.
- `try/catch` em operações que podem lançar (rede, I/O, parsing, APIs nativas).
- Log com nível apropriado: `warn` para esperado/recuperável, `error` para falha inesperada.
- **Nunca** exponha stack trace ou detalhes técnicos ao usuário final — use toast/mensagens amigáveis em pt-BR.
- A camada de rede (interceptors do cliente HTTP) exibe os toasts de erro genéricos. Não duplique no chamador a menos que o caso exija tratamento específico.
- Sem `catch` vazio que engole erro.
- **Erros de render** em rotas protegidas são capturados pelo `ErrorBoundary` da rota (ver Rotas) — não pelo `try/catch`.

---

## Segurança

- Valide todo input do usuário com Zod no formulário **antes** de enviar à API.
- Nunca confie em dado vindo do servidor sem tipá-lo — defina o shape esperado.
- Não logue dados sensíveis (senhas, tokens, dados pessoais) — nem em `console.log` durante desenvolvimento.
- **Não armazene tokens/segredos em `AsyncStorage`** (não criptografado). Use `expo-secure-store` para token de sessão, refresh token e qualquer credencial. `AsyncStorage`/`MMKV` só para dado não-sensível (preferências, cache de UI).

### Object injection — nunca indexe objeto/array com variável

Indexar `obj[key]` / `arr[i]` quando a chave é uma **variável** (e não um literal) é risco real: se a chave vier (direta ou indiretamente) de input do usuário, pode resolver para `__proto__` / `constructor` / `prototype` e abrir caminho para _prototype pollution_, ou ler/escrever uma propriedade que você não pretendia expor. (Com `eslint-plugin-security` configurado, isso vira o aviso **"Variable Assigned to Object Injection Sink"** — não silencie, refatore.)

**Regra dura: objeto indexado por variável dinâmica é proibido.** Só é aceitável quando a chave é um **literal conhecido em tempo de compilação**.

Como evitar, por caso de uso:

- **Mapa de lookup (label/variante por chave de union)** — em vez de `Record` indexado por variável, use um `Map` (`.get()` não é sink) ou um `switch`:

  ❌ Inseguro:

  ```ts
  const ROLE_VARIANT: Record<UserRole, Variant> = {
    admin: "default",
    member: "secondary",
  };
  const variant = ROLE_VARIANT[role];
  ```

  ✓ `Map` com `.get()`:

  ```ts
  const roleVariant = new Map<UserRole, Variant>([
    ["admin", "default"],
    ["member", "secondary"],
  ]);
  const variant = roleVariant.get(role);
  ```

  ✓ ou `switch` (bom quando há lógica além do lookup):

  ```ts
  function roleVariant(role: UserRole): Variant {
    switch (role) {
      case "admin":
        return "default";
      case "member":
        return "secondary";
    }
  }
  ```

- **Chave vinda de input do usuário** (params de rota, deep link, body): nunca indexe direto. Valide com `z.enum([...])` para garantir que a chave é uma das esperadas **antes** de qualquer acesso, e então use `Map`/`switch`.
- **Iteração por índice numérico**: prefira `for...of`, `.map`, `.find`, `.at(i)` — o callback do `.map((item, i) => ...)` já entrega o `item` sem você indexar o array. Só caia em `arr[i]` quando `i` for literal.

Resumo: lookup por chave → `Map`/`switch`; iteração → métodos de array; chave de fonte externa → Zod antes de tudo.

### LGPD e dados pessoais (PII)

Produto pt-BR opera sob a LGPD. Considere PII e **proibido logar** em qualquer canal (console, Sentry/breadcrumb, analytics, params de deep link/rota, body de erro exibido ao usuário, payload de toast):

- **Identificadores pessoais**: nome completo, CPF, CNPJ (de pessoa física), RG, CNH, passaporte, título de eleitor, PIS.
- **Contato**: e-mail, telefone, endereço, CEP.
- **Credenciais e sessão**: senha (em qualquer forma — texto puro, hash, parcial), token de API, código 2FA, perguntas de recuperação.
- **Financeiro**: número de cartão (mesmo mascarado), CVV, dados bancários, conta, chave PIX.
- **Sensíveis (art. 5º, II)**: dados de saúde, biometria, origem racial, religião, opinião política, orientação sexual.

Regras práticas:

- **Erros de API**: a camada de rede já exibe mensagem amigável — não relogue o objeto de erro cru no `console.error` de produção. Em dev, OK, desde que o `.env.local` não vá pro repo.
- **Params de deep link/rota nunca levam PII** (aparecem em logs, histórico de navegação, analytics de tela). Use ID opaco na rota (`/users/abc123`), nunca CPF; dado sensível vai no body de uma chamada autenticada.
- **Toast/erro ao usuário não ecoa o input**: `"Falha ao salvar."` em vez de `"Falha ao salvar o usuário ${nome} (CPF ${cpf})."`.
- **Form com PII** (cadastro, perfil): garanta que `defaultValues` de exemplo não foram commitados com dado real.
- **Mocks e fixtures**: dados de exemplo são fictícios — não cole CPF/e-mail real "porque é só pra testar".

---

## Performance

- **Code-splitting por rota é automático** no Expo Router (rotas são lazy por padrão em produção). Não tente reimplementar.
- TanStack Query: configure `staleTime` em queries que não precisam refazer a cada navegação. Não use `useEffect` + `fetch`.
- **Listas longas usam `@shopify/flash-list`**, nunca `FlatList`/`ScrollView` com `.map` para coleções grandes. Mantenha o `renderItem` estável (`useCallback`). (FlashList v2 dispensa `estimatedItemSize`.) Dentro de uma tela, use `Screen scrollable={false}` e deixe o `FlashList` (flex:1) ser o scroller. Ref.: [`src/screens/posts`](src/screens/posts).
- **Não passe objeto/função inline** como prop para item de lista memoizado — recria a referência todo render e mata a memoização.
- Memoize (`useMemo`/`useCallback`/`React.memo`) apenas com benefício mensurável — não por reflexo.
- Animações em `react-native-reanimated` (roda na UI thread).
- Imagens via `expo-image` (cache e performance melhores que `Image` do core) para qualquer imagem remota recorrente.

---

## Testes

- Jest (preset `jest-expo`) + React Native Testing Library (RNTL), e Maestro para E2E.
- **Comandos**: `npm test` (Jest), `npm run typecheck` (`tsc --noEmit`), `npm run lint`, `npm run format` (Prettier), `npm run check` (lint + typecheck + test — rode antes de empurrar). O `pre-commit` (Husky + lint-staged) roda ESLint+Prettier nos arquivos staged; o `pre-push` roda typecheck + test.
- Testes unitários/integração vivem em `src/tests/`, organizados em pastas — uma por componente/módulo, com `<name>.test.ts(x)` dentro.
- Setup global em `src/tests/setup.ts` — importa o **mock do Unistyles** (`react-native-unistyles/mocks`) + a config de temas (`unistyles.ts`) e registra mocks manuais de **`react-native-reanimated`** e **`react-native-safe-area-context`** (sem runtime nativo no Jest). Sem isso os componentes não renderizam. O `jest.config.js` estende o `transformIgnorePatterns` do `jest-expo` para transpilar `@rn-primitives` (publicado como JSX não compilado) — necessário para testar componentes montados sobre rn-primitives (ex.: `Checkbox`).
- **`src/tests/` é excluído do `tsc --noEmit`** (o `setup.ts` importa o mock do Unistyles, cujo source arrasta tipos web e quebra a checagem). Os testes rodam via Jest/Babel — o gate de tipos cobre o app, o Jest cobre os testes.
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
- Fluxos de ponta a ponta (login, navegação principal, checkout) ficam em **Maestro** (`.maestro/*.yaml`), não em teste de unidade. Rodam no app real (dev build + emulador/device) via `npm run test:e2e` (precisa do CLI do Maestro, instalado fora do npm — ver [`.maestro/README.md`](.maestro/README.md)). Os fluxos miram por **texto visível / label de acessibilidade** (placeholder de input, rótulo de aba, título de tela) — o mesmo caminho do leitor de tela; ao mudar textos da UI, atualize os specs. Fluxos prontos: `login`, `navigation`, `logout`, `deletePost`.

### Rode o Maestro ao concluir a tarefa (obrigatório)

**Ao concluir qualquer tarefa que toque a UI — tela nova, componente novo, mudança de fluxo, ou qualquer alteração visível ao usuário — rode os fluxos E2E do Maestro** (`npm run test:e2e`), além dos testes unitários (`npm run check`). Uma tarefa **não está pronta** sem o app exercitado ponta a ponta no device/emulador.

- Se a tarefa introduz um fluxo relevante novo (criar, editar, excluir, navegar para uma área nova), **adicione um fluxo `.maestro/<nome>.yaml`** cobrindo-o. Se muda textos/labels da UI, **atualize os specs** que miram por eles (o Maestro casa por texto/label de acessibilidade).
- **Pré-requisito**: dev build instalado + Metro rodando. Se a tarefa mexeu em dependência/módulo nativo, **reconstrua antes** (`npx expo run:android`) — rodar contra um build defasado trava o app na splash e o E2E falha por engano (não é regressão real).
- Reporte o resultado dos fluxos junto com o do `npm run check`. Falhou? Investigue a causa (regressão real vs. seletor desatualizado vs. build/Metro) antes de dar a tarefa por concluída. Gotchas e seletores em [`.maestro/README.md`](.maestro/README.md).

### Como escrever testes (práticas)

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

---

## Git e commits

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`.
- Um commit, uma mudança lógica.
- Mensagens em inglês, modo imperativo: `add user session validation` (não `added`/`adding`).
- PRs pequenos e revisáveis. Se não dá para revisar em 30 min, está grande demais.
- Husky + lint-staged rodam ESLint e Prettier no `pre-commit`. O `pre-push` roda typecheck + test. Não pule hooks (`--no-verify`) — se um teste/typecheck quebra, conserte; não bypasse.
- Antes de empurrar manualmente, rode lint + typecheck + test localmente.
- **Não comite `android/` e `ios/`** se o projeto usa prebuild (CNG) — são gerados. Comite só se você adotou o fluxo bare com mudança nativa manual.

---

## Texto de interface (UI)

Todo texto exposto ao usuário em **português brasileiro (pt-BR)**.

- Gramática e acentuação corretas.
- Linguagem clara, objetiva e profissional.
- Evite jargão técnico para usuários operacionais.
  - Correto: `Falha ao salvar o registro. Tente novamente.`
  - Evite: `Unexpected persistence layer failure.`

### Acentuação e codificação (evitar mojibake)

**Sempre acentue corretamente.** Texto pt-BR sem acento é erro, não estilo — `usuario`, `nao`, `acao`, `informacoes` viram bug visível para o usuário final. Mesmo em rascunho, mantenha `usuário`, `não`, `ação`, `informações`.

- **Salve arquivos em UTF-8 sem BOM.** Strings literais (`'Não foi possível salvar.'`), comentários, labels, mensagens de erro de schema Zod, tudo em UTF-8 correto.
- **Mojibake é zero-tolerância.** Se você ver `não`, `Ã§`, `Ã©`, `â€"`, `?` no lugar de letra acentuada, ou caracteres invertidos `Â`, `Ã`, isso é arquivo lido como Latin-1/CP1252 e escrito como UTF-8 (ou vice-versa). Conserte o arquivo (re-salve em UTF-8) — **não "corrija" o texto trocando por versão sem acento.**
- **No PowerShell (Windows), nunca redirecione texto pt-BR com `>` ou `Out-File` sem `-Encoding utf8`** — o default vira UTF-16 LE com BOM e quebra o build/leitura. Para escrever texto com acento via shell, use as ferramentas de edição de arquivo, não `echo "..." > arquivo`.
- **Caracteres comuns que precisam aparecer corretos**: `á é í ó ú â ê ô ã õ à ç` (minúsculas) e suas maiúsculas. Aspas tipográficas e travessão (`—`) também são UTF-8 — preserve.
- **Lista mínima de palavras que aparecem direto no produto e precisam estar acentuadas**: ação, não, número, código, válido/inválido, próximo/anterior, página, último, índice, descrição, padrão, série, área, é/está, mês, três, após, até, já, só.
- **Atalhos automáticos do editor** (autocorreção, configuração regional do shell) são fonte recorrente de regressão. Se você notar um arquivo onde acento sumiu silenciosamente, re-salve em UTF-8 antes de continuar editando.

❌ `<Empty title="Nenhum usuario encontrado" />`
✓ `<Empty title="Nenhum usuário encontrado" />`

❌ `z.string().min(1, 'Campo obrigatorio.')`
✓ `z.string().min(1, 'Campo obrigatório.')`

---

## Acessibilidade (a11y)

rn-primitives dá a base de a11y — papéis, estados e gestos. As regressões comuns vêm de **remover/ignorar** o que ele entrega, ou de construir interativo com `View` crua. As regras abaixo são o mínimo para uma tela nova não degradar.

- **Toda input precisa de label associada** (`accessibilityLabel` ou label visível ligada ao campo). **Não use `placeholder` como label** — placeholder some quando o usuário começa a digitar e o leitor de tela não o trata como rótulo.
- **Elemento interativo é `Pressable`/botão, nunca `View` com `onPress`.** `View` clicável não tem `accessibilityRole="button"`, não é anunciada como botão e não responde a tecnologias assistivas. Use `Pressable` com `accessibilityRole`.
- **Botão-ícone exige `accessibilityLabel` em pt-BR**: ex. um botão de fechar com só um ícone precisa de `accessibilityLabel="Fechar"`. Sem isso, o leitor de tela anuncia "botão" sem dizer o quê.
- **Imagens informativas precisam de `accessibilityLabel`** (curto, pt-BR). Imagem puramente decorativa: `accessible={false}`.
- **Contraste mínimo de 4.5:1** para texto sobre fundo (WCAG AA). Os tokens do tema (`textForeground` sobre `background`, `textMuted` sobre `card`) já passam — desvio só com motivo claro.
- **Estado comunicado via `accessibilityState`** (`{ disabled, selected, checked, busy }`), não só visualmente.
- **Foco em modal/drawer**: marque o container modal com `accessibilityViewIsModal` (iOS) e mande o foco do leitor para o título/primeiro campo com `AccessibilityInfo.setAccessibilityFocus`. Em confirmação destrutiva, o foco inicial **não** fica no botão de confirmar (evita confirmação acidental).
- **Toasts**: anuncie via `AccessibilityInfo.announceForAccessibility` ou `accessibilityLiveRegion="polite"` (Android) para que o leitor leia a mensagem.
- **Esconder do leitor de tela**: use `accessibilityElementsHidden` (iOS) + `importantForAccessibility="no-hide-descendants"` (Android), ou `accessible={false}`. Para esconder de todos, não renderize.
- **Animação respeita redução de movimento**: cheque `AccessibilityInfo.isReduceMotionEnabled()` ou use `useReducedMotion()` do Reanimated e reduza/elimine a animação quando ativo.
- **Alvo de toque mínimo de 44×44 pt.** Use `hitSlop` quando o visual for menor.

---

## Adaptação a tamanhos de tela e orientação

**Não esconda conteúdo por não caber.** Quando algo não cabe na largura, a solução é **scroll** (vertical na tela, horizontal num container específico) ou **reflow** — não suprimir informação.

- **Respeite a safe area** (`react-native-safe-area-context`) para não ficar sob notch, status bar ou home indicator. Não chumbe `paddingTop` mágico.
- **Conteúdo que pode estourar a altura vai em `ScrollView`/`FlashList`.** Formulário longo precisa rolar e respeitar o teclado (`KeyboardAvoidingView` / `keyboardShouldPersistTaps`).
- **Conteúdo largo**: container com `ScrollView horizontal` em vez de cortar partes.
- **Tablet e landscape**: use os **breakpoints do Unistyles** (`xs:0, sm, md, lg, xl`) para adaptar layout, não condicional manual com `Dimensions`.

---

## Loading e estados intermediários

**Não substitua a tela por um spinner gigante nem por um skeleton genérico.** Quando algo está carregando, monte a **estrutura final da tela primeiro** e troque **apenas o dado que muda** por skeleton. Cabeçalhos, rótulos, ações, abas, navegação — tudo que não muda entre vazio e preenchido continua **visível e interativo**.

### Por quê

Spinner gigante centralizado no lugar do conteúdo atrasa a percepção do que a tela é, esconde a navegação contextual e provoca _layout shift_ quando o conteúdo aparece. Skeleton localizado onde o dado entra deixa o usuário entender a tela antes dos dados, mantém a UI interativa ao redor e reserva o espaço final (sem salto visual).

### Padrões corretos

- **Lista (`FlashList`) carregando:** header, filtros e ações **continuam visíveis**; só as linhas viram skeleton.
- **Atualizações parciais:** evite refetchar listas inteiras quando só um item muda. Atualize apenas aquele item (via `queryClient.setQueryData`, `useMutation` com `onMutate`/optimistic update) em vez de rebuscar tudo. Mantém a UI responsiva e evita flicker.
- **Skeleton granular:** coloque no lugar **exato** do dado, dentro do card real — não no card inteiro.
- **Botão com loading:** spinner pequeno inline **dentro do botão** que disparou a ação, não spinner de tela.

Regra adicional: skeletons em arquivos próprios, não inline no arquivo de tela. Co-localize com o componente que ele simula (ex. real no template: `src/screens/posts/postListSkeleton.tsx`) ou em uma pasta de componentes reutilizáveis. O skeleton deve reproduzir o layout real (mesmas margens, espaçamentos, ordem visual) para minimizar salto quando o conteúdo carregar.

### Anti-padrões a evitar

- ❌ `<View style={center}><ActivityIndicator size="large" /></View>` no lugar do conteúdo de uma tela inteira.
- ❌ Envolver tela ou card inteiro num skeleton genérico de tela cheia.
- ❌ Skeletonizar rótulos fixos ("Nome", "E-mail", "Status") — eles nunca mudam.
- ❌ Modal/Drawer que abre e mostra spinner gigante até o form aparecer. Renderize o form com skeleton nos campos.

### Exceções legítimas

Indicador grande de tela cheia **só** quando ainda não existe shell pra mostrar — ex.: a tela de validação de sessão durante o boot, antes de qualquer rota protegida renderizar. O fallback de carregamento de rota do Expo Router deve ser **discreto** — uma barra fina ou nada visível, não spinner gigante.

---

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

---

## Convenções do projeto

### Imports

- Use o alias `@/` para imports internos de `src/` (ex.: `@/components/button`, `@/lib/toast`). Configure em `tsconfig.json` e no `babel.config.js`.
- Não use caminhos relativos longos (`../../../`) — troque por `@/`.

### Rotas (Expo Router — file-based)

- Cada rota é um arquivo em `app/`. **O arquivo de rota é fino**: importa o componente da tela de `src/screens/<feature>/` e cuida só de params/options. Lógica e UI moram em `src/screens/`, não em `app/`.
- **Rotas protegidas ficam no grupo `(app)/`**, cujo `_layout.tsx` envolve a validação de sessão + layout. Login/signup ficam no grupo `(auth)/`.
- **Toda rota (ou layout) protegida exporta um `ErrorBoundary`** — sem isso, um erro lançado no render derruba o app num fallback genérico. Aponte para o `ErrorFallback` (`@/components/errorFallback`): mensagem amigável em pt-BR + botão "Tentar novamente" que dispara o `retry` recebido via `ErrorBoundaryProps` do Expo Router. Ref.: o `ErrorBoundary` exportado em `src/app/(app)/_layout.tsx`.
- Navegação programática via `useRouter()` (`router.push`, `router.replace`, `router.back`). Links declarativos via `Link` do Expo Router. Para links externos (`http`, `mailto:`, `tel:`), abra via `Linking` (do `react-native`) — ou adicione `expo-web-browser` se quiser um browser in-app —, não via roteamento interno.

Esqueleto de uma tela:

```tsx
// app/(app)/minha-tela.tsx  — arquivo de rota, fino
import { MinhaTela } from "@/screens/minha-tela";

export default function MinhaTelaRoute() {
  return <MinhaTela />;
}
```

```tsx
// src/screens/minha-tela/index.tsx  — implementação
export function MinhaTela() { ... }
```

### Organização de telas

`src/screens/<feature>/index.tsx` deve ficar **enxuto** — apenas o shell da tela: orquestração de abas, layout principal, navegação e chamadas a hooks/serviços. Quando a tela cresce com várias seções lógicas (abas, blocos extensos, dialogs, formulários grandes), separe cada bloco em seu próprio arquivo. Não empilhe várias seções num único arquivo gigante.

✓ Uma seção por arquivo:

```
src/screens/users/userDetails/
├── index.tsx              # shell, monta as abas
├── overviewTab.tsx
├── activityTab.tsx
└── permissionsTab.tsx
```

Cada arquivo exporta apenas o seu componente público. Helpers privados (constantes, sub-componentes de uma única seção, type guards locais) ficam **dentro do arquivo onde são usados**. Utilitários compartilhados entre lista e detalhe vivem ao lado da feature (`src/screens/<feature>/<util>.ts`).

**Não embrulhe a tela inteira num wrapper de spacing/padding.** Toda tela usa o componente **`Screen`** (`@/components/screen`) como raiz (exceção: as telas de auth usam o `AuthLayout` full-bleed — ver Sessão e autenticação) — ele já aplica safe area, padding horizontal, `gap` padrão entre os filhos, scroll e a folga inferior que limpa a tab bar flutuante do grupo `(app)`. Adicionar uma `View` com `gap`/`padding` na raiz da tela é redundante e descalibra o ritmo visual entre telas. Só introduza um wrapper próprio quando precisar de comportamento de layout real que o `Screen` não cobre.

**Props do `Screen`:**

- `title` / `description` — quando `title` é passado, o `Screen` renderiza o cabeçalho (título `h1` + descrição `p2` muted). Sem `title`, a tela é só o corpo.
- `headerActions` — nós à direita do título (ex.: botão de ação).
- `showBackButton` (default `false`) + `onBack` — mostra a seta de voltar na linha do título; `onBack` default é `router.back()`.
- `scrollable` (default `true`) — `ScrollView` com `keyboardShouldPersistTaps="handled"`. Passe `false` quando a tela tem o próprio scroller (ex.: `FlashList` ocupando `flex: 1`); nesse caso o scroller interno cuida da sua folga inferior.
- `edges` (default `["top", "left", "right"]`) e `showsVerticalScrollIndicator` (default `false`).

```tsx
// tela simples com cabeçalho
<Screen title="Perfil" description="Gerencie sua conta.">
  <ProfileForm />
</Screen>

// tela de detalhe com voltar e ação no header
<Screen title="Usuário" showBackButton headerActions={<EditButton />}>
  <UserDetails />
</Screen>
```

O arquivo de rota continua fino (delega para `src/screens/<feature>/`); é o componente da tela que renderiza o `Screen`.

### HTTP

- Use a instância **`api`** de [`src/services/api`](src/services/api) — ela já trata `baseURL`, injeção do token e os toasts via interceptors. **Não crie axios avulso.** O `api` expõe `get/post/put/delete` genéricos que já devolvem `response.data` tipado (`api.get<User[]>('/users')`).
- Para server state: TanStack Query (`useQuery` / `useMutation`) com o `queryClient` de [`src/lib/queryClient.ts`](src/lib/queryClient.ts). Não use `useEffect` + `fetch`.

#### Anatomia do cliente (`src/services/api/`)

Portado do template web, adaptado para RN. **Preserve esta estrutura:**

- **`api.ts`** — a instância axios + interceptors. Um interceptor de **request** injeta o token do `expo-secure-store` no header `Authorization` (no web era cookie HTTP-only; no RN o token vai explícito). O interceptor de **response** chama `thenHandler`/`catchHandler`.
- **`errorHandlers.ts`** — `catchHandler` exibe o toast de erro (mensagem da API → `Erro <status>` → "Erro de comunicação"); `thenHandler` exibe toast de sucesso quando a resposta traz `data.message`. Ambos via `@/lib/toast`. `sendErrorMessage` reporta a `EXPO_PUBLIC_ERROR_LOG_URL` fora do dev (nunca lança).
- **`types.ts`** — shapes parciais de request/response dos interceptors + o type guard `hasResponseMessage`.
- **`sessionUserRef.ts`** — referência mutável do usuário logado (quebra o ciclo de imports entre `errorHandlers` e o store de sessão); o store mantém sincronizado.
- **`index.ts`** — `export { api }`.

O token vive em [`src/services/session/sessionToken.ts`](src/services/session/sessionToken.ts) (`get/set/clear` sobre `expo-secure-store`).

#### Variáveis de ambiente (`src/lib/env.ts`)

- Envs expostas ao app usam o prefixo **`EXPO_PUBLIC_`** e são **validadas com Zod na primeira importação** — falta uma? o app falha rápido com mensagem clara em vez de quebrar em runtime.
- Ao adicionar uma env, declare no schema de `env.ts` **e** em [`.env.example`](.env.example). Nunca leia `process.env` direto na tela — importe `env`.
- `.env`/`.env.local` **não vão pro repo** (contêm URLs/segredos por ambiente).

#### Onde vivem as chamadas de API — `services/<módulo>/`

**Toda função que fala com o backend vive em `src/services/<módulo>/` — nunca co-localizada na tela (`src/screens/...`) nem dentro de `services/api/`.** Cada módulo (ex.: `services/users/`, `services/session/`) agrupa os **schemas Zod** e as **chamadas** (`api.get/post/...`) daquele domínio; a tela consome via TanStack Query e **não** chama `api.*` direto.

- **`services/api/`** é só o **cliente** (instância + interceptors + tipos de transporte). Não coloque chamada de domínio aqui.
- **`services/<módulo>/`**: as chamadas + seus schemas. Mantenha o schema Zod **junto** do fetch que o usa, derivando o tipo com `z.infer<typeof schema>` (fonte de verdade do shape ao lado do parser). Atualize quando o contrato mudar; importe em hooks, telas e testes.

❌ `src/screens/users/userListApi.ts` (chamada dentro de `screens/`)
❌ `src/services/api/users/userListApi.ts` (domínio dentro de `services/api/`)
✓ `src/services/users/userListApi.ts` (no módulo, importada pela tela)

#### Convenção de `queryKey`

`queryKey` é a identidade do dado no cache — determina o que é deduplicado, invalidado e o que sobrevive a uma navegação. Sem convenção firme, uma tela invalida `['users']`, outra `['user-list']`, e nada bate.

**Use array hierárquico, do mais genérico ao mais específico:**

```ts
["users"]; // lista
["users", { page: 1, search: "maria" }]; // lista paginada/filtrada
["users", userId]; // detalhe
["users", userId, "permissions"]; // sub-recurso do detalhe
```

Primeiro elemento = **recurso**; segundo = **identificador** (ou objeto de filtros); seguintes = **sub-recursos**. Filtros vão como objeto (`{ page, search }`), nunca concatenados em string — TanStack Query compara estruturalmente.

**Factory por feature** em `src/screens/<feature>/queryKeys.ts` (ou no serviço):

```ts
export const userKeys = {
  all: ["users"] as const,
  list: (filters: UserFilters) => [...userKeys.all, filters] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
  permissions: (id: string) => [...userKeys.detail(id), "permissions"] as const,
};
```

**Invalidação: invalide o prefixo certo, não o mundo.**

```ts
queryClient.invalidateQueries({ queryKey: userKeys.permissions(id) }); // cirúrgico
queryClient.invalidateQueries({ queryKey: userKeys.all }); // domínio inteiro
```

**Nunca chame `invalidateQueries()` sem args** — invalida o cache inteiro e derruba todas as telas montadas.

**`setQueryData` vs `invalidateQueries`**: se você já tem a resposta da API em mãos (POST que retorna o registro criado), use `setQueryData(userKeys.detail(id), data)` para popular o cache sem ida ao servidor. `invalidate` é para forçar refetch quando não temos o dado novo.

#### Toda tela usa TanStack Query

Qualquer dado vindo do servidor entra via **TanStack Query** — sem exceção. Não há `useEffect` + `fetch`, não há `useState` espelhando resposta de API, não há `axios` chamado direto no `onPress`. O cache compartilhado, deduplicação, retry e refetch só funcionam se **todo mundo** usar a biblioteca.

**Técnicas que toda tela deve aplicar quando se aplicarem:**

1. **`staleTime` consciente, não default.** Default é `0` (qualquer remontagem refetcha). Listagem que muda pouco → `60_000`+; dado volátil → `0`.
2. **`staleTime` ≠ `gcTime`.** `staleTime` decide quando o dado é velho; `gcTime` (default 5 min) decide quando sai do cache sem consumidor. Dado consultado várias vezes na sessão → aumente `gcTime`.
3. **`placeholderData: keepPreviousData` para paginação/filtro sem flicker.** Mantém os dados anteriores enquanto a nova página carrega.
4. **`enabled` para queries dependentes.** `enabled: !!id` quando a query depende de um `id` que pode estar indefinido.
5. **Prefetch no `loader`/em foco.** Para tela rápida sem skeleton, prefetch o dado em paralelo ao chunk com `queryClient.prefetchQuery(...)`.
6. **Mutations expõem estado, não inventam.** Use `isPending`/`error`/`isSuccess` — não crie `useState('loading')` paralelo.
7. **Invalide na hora certa** (`onSuccess`/`onSettled`).
8. **Refetch em foco no RN**: o `focusManager` (via `AppState`, em `@/hooks/useReactQueryFocus`, chamado no layout raiz) e o `onlineManager` (via `NetInfo`, em `@/lib/queryClient`) já estão ligados no boot. O default é `refetchOnWindowFocus: false`; habilite por query quando o dado vale revalidar ao voltar pro app. Tela de referência do padrão completo (query + `queryKeys` + `FlashList` + skeleton + estados): [`src/screens/posts`](src/screens/posts).
9. **Deduplicação é automática.** Mesma `queryKey` ao mesmo tempo = uma requisição. Extraia hooks (`useUserDetail(id)`) e reuse à vontade.
10. **`useInfiniteQuery` para "carregar mais"/scroll infinito** (combina com `FlashList` + `onEndReached`). Não recrie com `useState([...itens])`.

**Anti-padrões a evitar:**

- ❌ `useState` + `useEffect(() => fetch(...))` — substitua por `useQuery`.
- ❌ `useQuery` dentro de `useEffect`/condicional — sempre top-level; use `enabled`.
- ❌ Mesma `queryKey` em telas com filtros diferentes — vira a mesma entrada de cache.
- ❌ `invalidateQueries()` sem args.
- ❌ Espelhar `data` em `useState` local — duplica fonte de verdade.
- ❌ Chamar `api.get` no `onPress` para "atualizar" — invalide a queryKey, o `useQuery` refetcha sozinho.

**Optimistic updates** — quando a mutação é simples (toggle, delete, edit de campo único) e o servidor raramente recusa, antecipe o resultado no cache:

```tsx
const mutation = useMutation({
  mutationFn: api.toggleFollow,
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: KEY });
    const previous = queryClient.getQueryData(KEY);
    queryClient.setQueryData(KEY, (prev) => !prev);
    return { previous };
  },
  onError: (_err, _vars, ctx) => {
    queryClient.setQueryData(KEY, ctx?.previous);
    toast.error("Falha ao atualizar.");
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
});
```

Use só onde a latência percebida vale o risco de inconsistência momentânea — para fluxos críticos (pagamento, perfil), prefira o pattern padrão com loading visível.

### Sessão e autenticação

A casca de auth já existe; o **backend concreto é plugável** (por padrão roda em modo fake).

- **Store**: `useSessionStore` (`@/stores/sessionStore`, Zustand) guarda `user` + `status` (`idle`/`validating`/`authenticated`/`unauthenticated`) + `isAuthenticating`, e expõe `validate`/`signIn`/`signUp`/`signOut`. Ele mantém o `sessionUserRef` (usado pelo log de erros) sincronizado.
- **Serviço**: `@/services/session/sessionService` — hoje em **modo fake** (aceita qualquer credencial, persiste no secure-store), com a **implementação real comentada** no fim do arquivo. Para plugar o backend: siga as instruções no topo do arquivo e apague `fakeSession.ts`.
- **Token**: `@/services/session/sessionToken` (`get/set/clear` sobre `expo-secure-store`) — nunca em `AsyncStorage`. O interceptor do `api` injeta no header `Authorization`.
- **Gate**: o **root `_layout.tsx`** chama `validate()` no boot e, enquanto `idle`/`validating`, mostra `SessionBoot` (indicador de tela cheia — a exceção legítima da regra de loading) no lugar do `Stack`. Validar no root (e não no `(app)`) faz o navegador de rotas montar já num estado definido, sem swap de layout que quebra a tab bar. Resolvida a sessão, o `_layout.tsx` do grupo `(app)`: `unauthenticated` → `<Redirect href="/login" />`; autenticado → renderiza as tabs (`TabBar`).
- **Grupos**: `(auth)` (público: login/signup) e `(app)` (protegido). O root `_layout.tsx` monta os providers (Query, GestureHandler, SafeArea) + o gate de sessão + `Stack` + `Toaster` + `SystemBarsBackground`.
- **ErrorBoundary**: o `_layout.tsx` do `(app)` exporta `ErrorBoundary` (usa o `ErrorFallback` global) — toda rota protegida herda o fallback amigável + "Tentar novamente".
- **Visual (splash + auth)**: o boot mostra o `SessionBoot` como **splash** (`BrandLogo` sobre `AuroraBackground`). Login e signup **não usam `Screen`** — usam o `AuthLayout` (`src/screens/auth/authLayout.tsx`): `AuroraBackground` (brilhos degradê na cor da marca, genéricos, via `expo-linear-gradient`) + cabeçalho + **painel de vidro** (tokens `glassSurface`/`glassBorder`). O rodapé "tem conta? / criar conta" é o `AuthFooter` compartilhado. É a exceção full-bleed à regra "toda tela usa `Screen`". Textos/labels são os que os fluxos Maestro miram — ao mexer, atualize os specs.

### Estado global

- Zustand para client state global compartilhado, em `src/stores/` (ex.: `sessionStore`). Para persistir preferência não-sensível, use o middleware `persist` do Zustand com `MMKV` (`react-native-mmkv` — módulo nativo, **não vem instalado**; adicione quando precisar e reconstrua o dev build).
- TanStack Query para server state — não duplique resposta de API no Zustand.
- Estado local de tela: `useState` normal.

### Formulários

- **Tudo que é de formulário vive em `@/components/form`** — hook, primitivos e campos compostos no mesmo módulo, exportados por um barrel único. Importe sempre de `@/components/form`, não de subcaminhos.
- Todo formulário nasce do hook único **`useZodForm`** (`@/components/form`): React Hook Form já com o resolver do Zod e `mode: "onChange"`. Os tipos derivam do schema (`z.input`/`z.output`) — não declare interface paralela.
- Os campos compostos são `TextField`, `TextareaField`, `PasswordField`, `SelectField`, `MultiSelectField`, `CheckboxField`, `SwitchField`, `RadioGroupField`, `DateField`. Cada um associa label ↔ controle ↔ erro (via o `Field` interno) e aceita dois modos, discriminados por union (`'control' in props`):
  - **controlled (dentro do RHF):** `control={form.control}` + `name` (tipado por `FieldPath` do schema). Usa `Controller` por baixo.
  - **standalone (fora do RHF):** `value` + `onChange`/`onChangeText` + `error`.
- Os campos são **genéricos sobre o tipo do formulário** (`<TForm extends FieldValues>`), então `name` tem autocomplete e checagem contra o schema. Nunca use `Control<any>`.
- Os **primitivos** (`Input`, `Textarea`, `PasswordInput`, `Label`, `Field`, `Select`, `MultiSelect`, `Checkbox`, `Switch`, `RadioGroup`, `DatePicker`) também moram em `@/components/form` e são standalone (`value`/`onChange`) — use fora de formulário; dentro de um form, prefira os campos compostos.
- Botão de submit é o `Button` (`@/components/button`) com `loading={form.formState.isSubmitting}`.

```tsx
const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "Mínimo de 8 caracteres."),
});

const form = useZodForm(schema, { defaultValues: { email: "", password: "" } });
const onSubmit = form.handleSubmit((values) => signIn(values));

<TextField control={form.control} name="email" label="E-mail" />
<PasswordField control={form.control} name="password" label="Senha" />
<Button onPress={onSubmit} loading={form.formState.isSubmitting}>Entrar</Button>;
```

#### Cobertura obrigatória com Zod

**Todo formulário precisa ter cada campo coberto por um schema Zod — sem exceção.** A validação acontece **antes** do submit e antes de qualquer chamada à API. Nada de validação ad-hoc dentro do `onSubmit` ou em `useState`.

- **Um schema por formulário** com `z.object({ ... })`, regra apropriada em cada campo. Campo que existe no form existe no schema.
- **Mensagens de erro em pt-BR** dentro do próprio schema. Erros do Zod chegam direto nos `errors` dos campos.
- **Tipos derivam do schema**: `type FormData = z.infer<typeof schema>`. Não declare `interface` paralela ao schema.
- **Validações com dependência entre campos** vão em `.refine()` / `.superRefine()`, não em `useEffect`.
- **Transformações** (máscaras de CPF/telefone, parse de data) ficam no schema via `.transform()` ou nos utilitários de data.
- **Resposta da API que vira valor inicial** (modo edição) também passa por um schema (`.parse()`) antes de ir pro `defaultValues`.

✓ Tudo no schema, o form bloqueia o submit sozinho:

```ts
const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "Mínimo de 8 caracteres."),
});
type FormData = z.infer<typeof schema>;
```

### Notificações

- `sonner-native`. O `<Toaster />` fica montado no root layout (`src/app/_layout.tsx`), dentro de `GestureHandlerRootView` + `SafeAreaProvider`.
- **Sempre dispare toast por `@/lib/toast`, nunca importe de `sonner-native` direto.** O wrapper garante o anúncio ao leitor de tela (`AccessibilityInfo.announceForAccessibility`) — regra de a11y que o `sonner-native` cru não cobre.
- API: `toast.success`, `toast.error`, `toast.info`, `toast.warning` (`(message, options?)`) e `toast.dismiss(id?)`. `options` é o mesmo do `sonner-native` (`description`, `duration`, `action`, etc.).
- **Mensagens em pt-BR**, curtas e sem PII (o toast não ecoa o input do usuário — ver Segurança).
- A camada de rede já dispara os toasts de erro genéricos via interceptors — **não duplique no caller** a menos que o caso exija tratamento específico.

```ts
import { toast } from "@/lib/toast";

toast.success("Registro salvo.");
toast.error("Falha ao salvar. Tente novamente.");
toast.info("Sincronização em andamento.", {
  description: "Isso pode levar alguns segundos.",
});
```

### Componentes (`components/`)

Não usamos biblioteca de UI. O padrão é **componentes próprios dentro do projeto**, construídos sobre **rn-primitives** (comportamento/a11y) e estilizados com **Unistyles** (`StyleSheet` + variantes).

- **Camada única.** Como você é dono do componente desde o primitivo até o estilo, o componente já é a abstração — não há split entre "primitivo cru" e "wrapper".
- Estilo sempre via Unistyles (`StyleSheet.create((theme) => ({...}))` + `variants`). Combine estilos com array (`style={[styles.base, styles.active]}`), não com merge de classes.
- Variantes de componente (tamanho, tom, estado) usam o sistema de **variants** do Unistyles, não props que montam estilo na mão.
- Antes de criar um componente novo, **varra `components/` atrás de equivalente**. Se já existe, use; se falta, crie. Uma tela nova deve compor a partir do que existe, não reinventar `View` + estilo solto para algo já resolvido.

**Padrão para criar um componente:**

- Pasta `components/<nome>/<nome>.tsx`, export nomeado, interface prefixada com `I`.
- Importe o primitivo do rn-primitives como `XPrimitive` (ex.: `Root as DialogPrimitive`) para evitar shadowing.
- API minimalista: props essenciais obrigatórias, extras opcionais.
- **Teste cobrindo o contrato público** (estados, props obrigatórias, handlers).
- Para componentes de formulário ou "abre/fecha", espelhe o padrão controlled/uncontrolled via discriminated union. Discrimine via `'prop' in props` — nunca via `prop !== undefined`. Quando uma variante declarar `prop?: never`, encapsule num **type guard** com type predicate:

```ts
function isControlled<T, N>(props: FieldProps<T, N>): props is ControlledFieldProps<T, N> {
  return 'control' in props;
}

export function Field(props: FieldProps<...>) {
  if (isControlled(props)) return <ControlledField {...props} />;
  return <FieldBase {...props} />;
}
```

**`Modal` (bottom sheet).** Qualquer conteúdo sobreposto — formulário, detalhe, confirmação — usa o `Modal` (`@/components/modal`), uma sheet ancorada na base que sobe com animação (Reanimated, respeitando redução de movimento), tem overlay que fecha ao toque, sobe acima do teclado e respeita a safe area. É controlado (`visible` + `onClose`), nunca auto-gerido.

- Props: `visible`, `onClose`, `title?` (renderiza o cabeçalho com `h3` + botão fechar), `children`, `maxHeight?`. O corpo já rola (`ScrollView` com `keyboardShouldPersistTaps`).
- Fecha por: toque no overlay, botão X do header, ou voltar do Android (`onRequestClose`) — todos chamam `onClose`.
- A11y já embutida: `accessibilityViewIsModal`, foco do leitor de tela enviado à sheet ao abrir, overlay escondido do leitor, botão fechar com `accessibilityLabel="Fechar"`.
- Não é montado sobre rn-primitives — é uma sheet animada sobre o `Modal` nativo do RN. Coloque as ações (confirmar/cancelar) dentro de `children`.

```tsx
const [visible, setVisible] = useState(false);

<Modal visible={visible} onClose={() => setVisible(false)} title="Editar perfil">
  <ProfileForm onSaved={() => setVisible(false)} />
</Modal>;
```

**Abstrações prontas para compor telas**: `Card` (`@/components/card`, superfície padrão; variante `glass` = superfície translúcida via tokens `glassSurface`/`glassBorder`, para uso **sobre a `AuroraBackground`** — não sobre fundo liso, onde o vidro perde contraste), `Empty` (`@/components/empty`, estado vazio com ícone/título/descrição/ação), `Skeleton` (`@/components/skeleton`), `ConfirmDialog` (`@/components/confirmDialog`), `Badge` (`@/components/badge`, rótulo de status com variantes `default`/`secondary`/`success`/`warning`/`destructive`/`outline`), `Avatar` (`@/components/avatar`, imagem via `expo-image` com fallback de iniciais por `@/lib/getInitials`), `AuroraBackground` (`@/components/auroraBackground`, fundo decorativo com brilhos degradê na cor da marca via `expo-linear-gradient` — genérico e adaptativo) e `BrandLogo` (`@/components/brandLogo`, wordmark da marca). Reuse-as em vez de recriar `View` + estilo solto.

**Confirmações de ação** (delete, publicar, arquivar): use o **`ConfirmDialog`** (`@/components/confirmDialog`) — ele fica aberto enquanto o `onConfirm` resolve (botão com loading), fecha em sucesso e permanece aberto se a promise lançar (o erro propaga pra camada de rede, que já mostra o toast). Ref. de uso (com `useMutation` + optimistic update): [`src/screens/posts`](src/screens/posts).

**Confirmação dupla para ações críticas** (bloquear usuário, apagar dado sensível, reverter cobrança): passe `requireText="APAGAR"` ao `ConfirmDialog` — ele exige digitar a palavra num campo que só habilita o botão final quando o texto bate. Use só em ações irreversíveis/alto impacto.

### Tipografia

Todo texto do app passa pelo componente **`Text`** (`@/components/text`) — nunca use o `Text` cru do `react-native` numa tela e **nunca** aplique `fontSize`/`fontWeight`/`lineHeight` soltos num estilo. A escala é inspirada na tipografia da web (adaptada do shadcn/ui) e segue a convenção **`h1`, `h2`, `h3`** (títulos) e **`p1`, `p2`, `p3`** (corpo, do maior ao menor).

A escala vive em **um único lugar**, os tokens `theme.typography.*` em `unistyles.ts` (fonte de verdade de tamanho, peso e `letterSpacing`). O componente só mapeia esses tokens para as **variants** do Unistyles — para recalibrar a tipografia do app inteiro, mude o token, não o componente nem a tela.

| Variant | Uso                                        | Base (shadcn)                     |
| ------- | ------------------------------------------ | --------------------------------- |
| `h1`    | Título principal da tela (um por tela)     | `text-4xl` extrabold, tracking-tight |
| `h2`    | Título de seção                            | `text-3xl` semibold, tracking-tight  |
| `h3`    | Subtítulo / título de card                 | `text-2xl` semibold, tracking-tight  |
| `p1`    | Corpo em destaque / texto de abertura      | `text-lg`                         |
| `p2`    | Corpo padrão (**default**)                  | `text-base`, leading confortável  |
| `p3`    | Texto de apoio, legenda, metadado          | `text-sm`                         |

**Props:**

- `variant` — uma das seis acima. **Default `p2`.**
- `color` — `"default"` (`textForeground`), `"muted"` (`textMuted`) ou `"brand"`. Default `"default"`. Não crave cor de texto em estilo de tela; use esta prop.
- `weight` — `"regular" | "medium" | "semibold" | "bold"`. **Opcional.** Quando omitido, mantém o peso natural da `variant` (títulos já vêm em bold/semibold). Passe só para ajustar o peso do corpo — ênfase inline, rótulo de formulário, título de item de lista. É o substituto de `fontWeight` solto (que é proibido).
- `align` — `"auto" | "left" | "center" | "right"`. Default `"auto"`.
- Aceita todas as props de `Text` do RN (`numberOfLines`, `onPress`, `accessibilityLabel`, etc.) e `style` para ajustes pontuais de layout (margem/flex) — **não** para redefinir a escala.

Variants `h*` já recebem `accessibilityRole="header"` automaticamente (o leitor de tela anuncia como cabeçalho). Não precisa passar à mão.

```tsx
import { Text } from "@/components/text";

<Text variant="h1">Início</Text>
<Text variant="h3">Resumo do dia</Text>
<Text>Parágrafo padrão — variant p2 é o default.</Text>
<Text variant="p3" color="muted">
  Atualizado há 2 minutos
</Text>
<Text variant="p3" weight="medium">E-mail</Text>
```

**Regras:**

- ❌ `import { Text } from "react-native"` numa tela → ✓ `import { Text } from "@/components/text"`.
- ❌ `<Text style={{ fontSize: 18, fontWeight: "600" }}>` → ✓ `<Text variant="h3">`.
- ❌ `<Text style={{ fontWeight: "600" }}>` para negritar o corpo → ✓ `<Text weight="semibold">`.
- ❌ `color: theme.colors.textMuted` no estilo → ✓ `<Text color="muted">`.
- Faltou um nível na escala? Ajuste os tokens em `unistyles.ts` e mapeie no componente — não invente tamanho solto na tela.

### Cor da marca e tema

A cor primária do sistema vive em **um único token** no tema do Unistyles (`unistyles.ts`), com versão para light e dark:

```ts
// tokens compartilhados entre os temas (gap + raio + escala de tipografia)
const sharedTokens = {
  gap: (value: number) => value * 8,
  // Escala de raio inspirada no shadcn (--radius base = `lg` 10px).
  radius: { sm: 6, md: 8, lg: 10, xl: 14, xxl: 20, full: 9999 },
  opacity: { disabled: 0.5 }, // opacidades de estado (fonte única)
  typography: {
    /* h1, h2, h3, p1, p2, p3 — ver a seção "Tipografia" */
  },
};

const lightBrand = "#7D00B8";
const lightTheme = {
  colors: {
    brand: lightBrand,
    brandForeground: "#FFFFFF",
    brandSubtle: "#EFE2FA", // fundo tênue tonado pela marca (ex.: item selecionado)
    background: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E5E7EB",
    textForeground: "#11181C",
    textMuted: "#6B7280",
    primary: lightBrand, // alias da marca — referencia a const, não duplica o valor
  },
  ...sharedTokens,
};

const darkBrand = "#A855F7"; // mesma marca, tonada p/ dark
const darkTheme = {
  colors: {
    brand: darkBrand,
    brandForeground: "#FFFFFF",
    brandSubtle: "#2B1D3A",
    background: "#11181C",
    card: "#1C2127", // mais claro que background → elevação
    border: "#2A2F36",
    textForeground: "#ECEDEE",
    textMuted: "#9CA3AF",
    primary: darkBrand,
  },
  ...sharedTokens,
};
```

`primary` e demais usos da marca são **aliases** de `brand` — não duplicar o valor. Para trocar a marca num novo projeto, mude apenas `brand` (light + dark). Se houver gráficos, mantenha o ramp de cores harmonizado com o hue da marca.

Além da marca, o tema traz `border` (traços/divisórias e contorno de card) e `brandSubtle` (fundo tênue tonado pela marca — ex.: estado selecionado). O snippet acima é resumido; o tema real (`unistyles.ts`) também tem tokens **semânticos**, cada um com seu `*Foreground`: `secondary` (superfície/botão neutro), `destructive` (ação perigosa), `success` e `warning` (status) — consumidos por `Button` e `Badge`. Ao criar um token novo, adicione-o **nas duas variantes** (light + dark). `gap`, `radius`, `opacity` e `typography` são compartilhados entre os temas via `sharedTokens` — só as cores mudam entre light e dark. Estado desabilitado usa `theme.opacity.disabled` (nunca `opacity: 0.5` solto). Constante de a11y (alvo de toque 44pt / alturas de controle) fica literal de propósito — **não** deve escalar com o tema, senão um ajuste na base quebraria a acessibilidade.

**Curvatura (`theme.radius.*`)**: escala inspirada no shadcn (`--radius` base = `lg` 10px), fonte única de raio do app — `sm 6` (checkbox/skeleton), `md 8` (botões, inputs, badge, controles), `lg 10` (base), `xl 14` (cards/superfícies), `xxl 20` (bottom sheet), `full` (círculos e pílulas: radio, avatar, dia do calendário, indicador da tab bar). **Nunca crave `borderRadius` solto nem repita valor** — use o token; se faltar um degrau, ajuste a escala em `unistyles.ts` (nas duas variantes via `sharedTokens`), não invente número na tela. Círculos genuínos (largura = altura) podem usar `borderRadius: size / 2` quando o tamanho é dinâmico (ex.: `Avatar`).

**Dark mode em superfícies "card-like"**: use `colors.card` (mais claro que `background` no dark, dando elevação) e remova sombra no dark (sombra não rende em fundo escuro).

O tema é **sempre automático**: `adaptiveThemes: true` segue o tema do sistema (temas precisam se chamar `light` e `dark`). **Não há seletor de tema no app** — não use `initialTheme`, `setTheme` nem `setAdaptiveThemes`; deixe o Unistyles seguir o sistema. (Isso também evita o bug de repaint pela metade que o `setTheme` manual causava numa tela já aberta.)

### Sempre projete para claro E escuro (obrigatório)

**Todo componente e toda tela nascem suportando os dois temas — não é opcional nem "depois".** O app segue o tema do sistema, então cada superfície precisa ficar correta e legível nos dois. Regressão comum: construir e olhar só no tema do seu device (normalmente escuro) e o claro sair quebrado.

Regras práticas:

- **Cor só via token do tema** (`theme.colors.*`) — nunca hex/rgba cravado num componente ou tela. Se um tom novo é necessário, adicione o token em `unistyles.ts` **nas duas variantes** (light + dark), como fizemos com `success`/`warning`. Cor literal só é aceitável para overlay neutro que não pertence ao tema (ex.: `rgba(0,0,0,0.6)` do overlay de modal).
- **Verifique nos dois temas antes de considerar pronto.** Mude o tema do sistema (Configurações do Android/iOS) e confira contraste, elevação e bordas em light e dark. Contraste mínimo 4.5:1 (ver Acessibilidade).
- **Elevação no dark vem de `card` mais claro que `background`**, não de sombra (sombra não rende em fundo escuro) — remova/reduza sombra no dark.
- **Estilize sempre de forma idiomática** (`StyleSheet.create((theme) => ({ ... }))` com `theme.colors.*`), inclusive o fundo (`backgroundColor: theme.colors.background`). Com o tema seguindo o sistema, a troca é rara e acompanha o ciclo de vida do app (você sai para as Configurações e volta), então aplica correto — sem necessidade de qualquer truque de repaint.
