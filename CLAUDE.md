# CLAUDE.md

Guia para o Claude trabalhar neste app mobile. Este arquivo traz as regras gerais e o comportamento esperado, válidos para toda tarefa; as convenções por assunto, o Definition of Done e os guardrails ficam nos guias de `docs/` (ver Guias de referência).

> Este é um **template de aplicativo** reutilizável entre projetos. Ele já traz um kit de componentes próprios em `src/components/` (lista em [`docs/conventions.md`](docs/conventions.md#componentes-components)): reuse o que existe; o que não existir ainda, você cria seguindo as regras abaixo e os Guias de referência. Mantenha tudo genérico e reaproveitável — nada de regra de negócio de um cliente específico vazando para a base do template.

---

## Stack

React Native + Expo (SDK 56, New Architecture) + TypeScript • Expo Router (file-based) + TanStack Query • Zustand • React Hook Form + Zod • Unistyles (componentes próprios; `@rn-primitives/checkbox` só no checkbox) • Axios • toast (`sonner-native`) • Jest + React Native Testing Library + Maestro (E2E) • ESLint (`eslint-config-expo`) + Prettier + Husky + lint-staged.

Estilo via **Unistyles** (`StyleSheet` nativo com tema/variantes), nunca `className`/Tailwind. Acessibilidade e comportamento ficam nos próprios componentes (props `accessibility*` do RN); **rn-primitives** entra só no checkbox, e o `Modal` é uma sheet sobre o `Modal` nativo. O app roda em **development build** (EAS ou `expo run:android`), **não** em Expo Go — Unistyles tem código nativo.

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
2. **Sem referência interna, inspiração externa:** diretrizes de plataforma e apps mobile de referência, adaptados aos padrões deste projeto — detalhe em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md), seção Inspirações de design e organização.
3. **Se a decisão vai virar padrão para outras telas, documente.** Quando você introduz uma convenção que se repetirá, registre brevemente onde manda a seção [Onde registrar convenção nova](#onde-registrar-convenção-nova) para que a próxima sessão (humana ou Claude) já chegue alinhada.

Resumo: **consistência interna > inspiração externa > improvisar do zero.**

---

## Onde registrar convenção nova

- Convenção de uma área vai para o `docs/claude/<área>.md` dela: UI, telas, a11y, loading e texto em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md); object injection e PII em [`docs/claude/seguranca.md`](docs/claude/seguranca.md); estrutura de pastas em [`docs/claude/referencia.md`](docs/claude/referencia.md). Convenção de um assunto que já tem guia em `docs/` (ex.: rota, API, formulário, data, toast, componente, tema, teste) vai para esse guia (ver Guias de referência).
- Neste `CLAUDE.md` só entra regra que vale para quase toda tarefa, em versão curta que termina apontando o arquivo de área do detalhe. Regra de segurança ou de dado pessoal nunca fica só na área.
- Área nova ganha arquivo novo em `docs/claude/`, com o cabeçalho dos outros, e uma linha na tabela de Guias de referência e no índice do fim deste arquivo.

---

## Guias de referência

O que torna uma tarefa e uma entrega prontas (loop por tarefa, fechamento, como reportar) está em [`docs/definition-of-done.md`](docs/definition-of-done.md); o que nunca se faz sem aval, em [`docs/guardrails.md`](docs/guardrails.md). Os guias abaixo são lidos sob demanda, quando a tarefa toca o assunto.

| Arquivo | Quando ler |
| --- | --- |
| [`docs/definition-of-done.md`](docs/definition-of-done.md) | Antes de dar uma tarefa ou a entrega por pronta; ao reportar o placar |
| [`docs/guardrails.md`](docs/guardrails.md) | Antes de push, MR, commit, mexer em config, `android/`/`ios/` ou desligar verificação |
| [`docs/testing-guide.md`](docs/testing-guide.md) | Antes de escrever ou mudar teste Jest/RNTL ou fluxo Maestro |
| [`docs/conventions.md#imports`](docs/conventions.md#imports) | Ao importar de `src/` |
| [`docs/conventions.md#rotas-expo-router--file-based`](docs/conventions.md#rotas-expo-router--file-based) e [`#organização-de-telas`](docs/conventions.md#organização-de-telas) | Antes de criar rota ou tela, ou reorganizar uma feature |
| [`docs/conventions.md#http`](docs/conventions.md#http) | Antes de chamar API, criar `queryKey`, query/mutation ou env |
| [`docs/conventions.md#sessão-e-autenticação`](docs/conventions.md#sessão-e-autenticação) e [`#estado-global`](docs/conventions.md#estado-global) | Ao mexer em sessão, token, gate de auth ou store Zustand |
| [`docs/conventions.md#formulários`](docs/conventions.md#formulários) | Antes de criar ou mudar formulário ou campo |
| [`docs/conventions.md#datas`](docs/conventions.md#datas) | Ao gravar, exibir ou converter data |
| [`docs/conventions.md#notificações`](docs/conventions.md#notificações) | Ao disparar toast |
| [`docs/conventions.md#componentes-components`](docs/conventions.md#componentes-components) | Antes de criar componente, modal ou confirmação |
| [`docs/conventions.md#tipografia`](docs/conventions.md#tipografia) | Ao renderizar texto |
| [`docs/conventions.md#cor-da-marca-e-tema`](docs/conventions.md#cor-da-marca-e-tema) e seguintes | Ao usar cor, raio, badge ou tema claro/escuro |
| [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md) | Ao criar ou mudar tela, componente, estado de carregamento, layout responsivo, texto de interface ou a11y de componente novo (exemplo de JSX, acentuação, foco de modal, toast, skeleton) |
| [`docs/claude/seguranca.md`](docs/claude/seguranca.md) | Ao indexar objeto/array por chave que não é literal, ao ver o aviso `security/detect-object-injection`, ao logar erro de API ou ao tratar dado pessoal (log, toast, params de rota/deep link, `defaultValues`, mock, fixture) |
| [`docs/claude/referencia.md`](docs/claude/referencia.md) | Ao procurar onde fica uma pasta de `src/` ou onde criar um arquivo novo |

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

Uma `<View>` só fica se faz layout real (flex/spacing/posição) ou agrupa um nó acessível com o papel certo; senão, Fragment ou estilo direto no filho. Reuse componente, sem wrapper empilhado nem estilo redundante, tokens do tema (`theme.gap(n)`, `theme.colors.*`, `theme.radius.*`) em vez de número mágico, texto sempre dentro de `<Text>` — detalhe em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md).

---

## Error handling

- Trate erros de forma explícita e previsível. Sem falhas silenciosas.
- `try/catch` em operações que podem lançar (rede, I/O, parsing, APIs nativas).
- Log com nível apropriado: `warn` para esperado/recuperável, `error` para falha inesperada.
- **Nunca** exponha stack trace ou detalhes técnicos ao usuário final — use toast/mensagens amigáveis em pt-BR.
- A camada de rede (interceptors do cliente HTTP) exibe os toasts de erro genéricos. Não duplique no chamador a menos que o caso exija tratamento específico.
- Sem `catch` vazio que engole erro.
- **Erros de render** em rotas protegidas são capturados pelo `ErrorBoundary` da rota (ver [Rotas](docs/conventions.md#rotas-expo-router--file-based)) — não pelo `try/catch`.

---

## Segurança

- Valide todo input do usuário com Zod no formulário **antes** de enviar à API.
- Nunca confie em dado vindo do servidor sem tipá-lo — defina o shape esperado.
- Não logue dados sensíveis (senhas, tokens, dados pessoais) — nem em `console.log` durante desenvolvimento.
- **Não armazene tokens/segredos em `AsyncStorage`** (não criptografado). Use `expo-secure-store` para token de sessão, refresh token e qualquer credencial. `AsyncStorage`/`MMKV` só para dado não-sensível (preferências, cache de UI).
- **Object injection:** nunca indexe objeto/array com chave que não seja literal conhecido em tempo de compilação, nem silencie `security/detect-object-injection`; lookup por chave vai em `Map.get()` ou `switch`, iteração em `for...of`/`.map`/`.find`/`.at(i)`, e chave de input externo (params de rota, deep link, body) passa por `z.enum([...])` antes de qualquer acesso — detalhe em [`docs/claude/seguranca.md`](docs/claude/seguranca.md).
- **LGPD e PII:** identificadores pessoais, contato, credenciais e sessão, dado financeiro e dado sensível nunca vão a log (console, Sentry/breadcrumb, analytics), params de rota/deep link, body de erro exibido nem toast; a rota leva ID opaco, o toast não ecoa o input, e `defaultValues`, mocks e fixtures usam dado fictício. Erro de API: a camada de rede já exibe a mensagem amigável, e o objeto de erro cru não é relogado no `console.error`, nem em dev; o `.env.local` não vai pro repo — detalhe em [`docs/claude/seguranca.md`](docs/claude/seguranca.md).

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
- **Nunca exponha referência interna ao usuário**: número de card/demanda, hash/código de merge, nome de branch, jargão de implementação. Não entra em label, placeholder, mensagem, toast nem em texto vindo do backend renderizado na tela. Se aparecer numa descrição/label (inclusive dado de mock/seed), é bug — corrija na origem.

### Dado derivado, rótulos e mensagens vêm do backend

**Regra de negócio não vive no cliente.** Cálculos, validações de estado, rótulos pt-BR e mensagens derivadas de regra vêm **prontos do backend**; a tela só renderiza. Se você se pegar reimplementando uma regra no app (recomputar totais, decidir um estado, traduzir um enum, montar uma mensagem derivada), pare: o backend deveria estar entregando pronto. Isso mantém uma única fonte de verdade e evita que duas telas — ou o app e a web do mesmo produto — divirjam ao reimplementar a mesma regra.

### Acentuação e codificação (evitar mojibake)

Sempre acentue o texto pt-BR; arquivos em UTF-8 sem BOM; mojibake é zero-tolerância e se conserta re-salvando o arquivo em UTF-8, nunca trocando por versão sem acento; no PowerShell, nada de `>` ou `Out-File` sem `-Encoding utf8` com texto pt-BR (use as ferramentas de edição) — detalhe em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md).

---

## Acessibilidade (a11y)

Toda input com label associada (`placeholder` não é label); interativo é `Pressable` com `accessibilityRole`, nunca `View` com `onPress`; botão-ícone e imagem informativa com `accessibilityLabel` em pt-BR; contraste mínimo de 4.5:1; estado via `accessibilityState`; alvo de toque mínimo de 44×44 pt. Foco em modal, toast, esconder do leitor de tela e redução de movimento também têm regra — detalhe em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md).

---

## Adaptação a tamanhos de tela e orientação

Não esconda conteúdo por não caber: scroll ou reflow. Respeite a safe area, ponha conteúdo alto em `ScrollView`/`FlashList` respeitando o teclado e adapte tablet e landscape pelos breakpoints do Unistyles, não por `Dimensions` — detalhe em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md).

---

## Loading e estados intermediários

**Não substitua a tela por um spinner gigante nem por um skeleton genérico.** Quando algo está carregando, monte a **estrutura final da tela primeiro** e troque **apenas o dado que muda** por skeleton. Cabeçalhos, rótulos, ações, abas, navegação — tudo que não muda entre vazio e preenchido continua **visível e interativo**.

Botão com loading usa spinner inline; skeleton fica em arquivo próprio, no lugar exato do dado e reproduzindo o layout real; indicador de tela cheia só quando ainda não há shell, como na validação de sessão no boot — detalhe em [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md).

---

## Estrutura de pastas

Rotas finas em `src/app/` (grupos `(auth)` e `(app)`), telas em `src/screens/<feature>/`, componentes próprios em `src/components/`, acesso a dados em `src/services/`, stores Zustand em `src/stores/`; `unistyles.ts` e `index.ts` na raiz — detalhe em [`docs/claude/referencia.md`](docs/claude/referencia.md).

---

## Onde está o resto: índice por seção antiga

As regras de área saíram deste arquivo para `docs/claude/`, sem reescrita. Citação antiga por nome de seção se resolve aqui; quando o título continua neste arquivo com a versão curta, o texto integral está no arquivo indicado.

- [`docs/claude/ui-telas.md`](docs/claude/ui-telas.md) — seções antigas: Inspirações de design e organização (texto integral do item 2; aqui ficam os itens 1 e 3 e a versão curta do 2); Antes de adicionar uma `<View>`, pergunte; Regras; Exemplo; Acentuação e codificação (evitar mojibake) (o título fica aqui, com a versão curta); Acessibilidade (a11y) (idem); Adaptação a tamanhos de tela e orientação (idem); Loading e estados intermediários (ficam aqui o parágrafo de abertura e a versão curta); Por quê; Padrões corretos; Anti-padrões a evitar; Exceções legítimas.
- [`docs/claude/seguranca.md`](docs/claude/seguranca.md) — seções antigas: Object injection — nunca indexe objeto/array com variável; LGPD e dados pessoais (PII). Os bullets gerais de Segurança e as versões curtas das duas regras ficam aqui.
- [`docs/claude/referencia.md`](docs/claude/referencia.md) — seções antigas: Estrutura de pastas (o título fica aqui, com a versão curta).
- Ficam neste arquivo, inteiras: CLAUDE.md; Stack; Comportamento esperado; Estratégia de decisão (quando há múltiplas soluções); Guias de referência; Linguagem de código; TypeScript; Qualidade de código; Refatoração; Error handling; Performance; Git e commits; Dado derivado, rótulos e mensagens vêm do backend.
- Ficam neste arquivo, em parte: Inspirações de design e organização (itens 1 e 3 e a versão curta do 2); JSX e markup (`View`/`Text`) — menos é mais (abertura e versão curta; as subseções foram para a área); Segurança (bullets gerais e versões curtas; as subseções foram para a área); Texto de interface (UI) (o corpo fica; a subseção Acentuação fica só com a versão curta); Acentuação, Acessibilidade (a11y), Adaptação, Loading e Estrutura de pastas (título e versão curta, como listado acima).
