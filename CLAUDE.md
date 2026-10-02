# CLAUDE.md

Guia para o Claude trabalhar neste app mobile. Este arquivo traz as regras gerais e o comportamento esperado, válidos para toda tarefa; as convenções por assunto, o Definition of Done e os guardrails ficam nos guias de `docs/` (ver Guias de referência).

> Este é um **template de aplicativo** reutilizável entre projetos, partindo praticamente do zero. Não assuma uma biblioteca de componentes pronta: o que não existir ainda, você cria seguindo as regras abaixo e os Guias de referência. Mantenha tudo genérico e reaproveitável — nada de regra de negócio de um cliente específico vazando para a base do template.

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
3. **Se a decisão vai virar padrão para outras telas, documente.** Quando você introduz uma convenção que se repetirá, registre brevemente em `CLAUDE.md` (regra geral) ou no guia de `docs/` do assunto (ver Guias de referência) para que a próxima sessão (humana ou Claude) já chegue alinhada.

Resumo: **consistência interna > inspiração externa > improvisar do zero.**

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
- **Erros de render** em rotas protegidas são capturados pelo `ErrorBoundary` da rota (ver [Rotas](docs/conventions.md#rotas-expo-router--file-based)) — não pelo `try/catch`.

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
