# Telas e interface

Parte do [`CLAUDE.md`](../../CLAUDE.md), movida de lá sem reescrita: o texto é o mesmo e os títulos mantêm o nível de origem; o núcleo guarda a versão curta de cada regra. Os caminhos citados são relativos à raiz do repositório. Leia quando a tarefa cria ou muda tela, componente, estado de carregamento, layout responsivo, texto de interface ou a11y de componente novo.

### Inspirações de design e organização

2. **Quando não houver referência interna, inspire-se em sistemas mobile consolidados** e nas diretrizes de plataforma (Material Design 3 no Android, Human Interface Guidelines no iOS) e em apps de referência (Linear, Things, Stripe, Notion mobile). Use-os para preencher lacunas — _como_ organizam navegação por abas, _onde_ colocam a ação primária (FAB, header, bottom bar), _como_ tratam listas longas e pull-to-refresh. Adapte para os padrões deste projeto; não traga estrutura paralela de fora quando já existe um padrão interno.

## JSX e markup (`View`/`Text`) — menos é mais

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

## Texto de interface (UI)

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

## Acessibilidade (a11y)

rn-primitives dá a base de a11y — papéis, estados e gestos. As regressões comuns vêm de **remover/ignorar** o que ele entrega, ou de construir interativo com `View` crua. As regras abaixo são o mínimo para uma tela nova não degradar.

> Verificar: possivelmente desatualizado — “rn-primitives dá a base de a11y” hoje vale só para o checkbox: só `@rn-primitives/checkbox` está instalado (`package.json:9`) e o `Modal` não usa rn-primitives (`docs/conventions.md:377`); ver `docs/mapa/enxugar-claude-md.md`, desatualizados, item 3.

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

## Adaptação a tamanhos de tela e orientação

**Não esconda conteúdo por não caber.** Quando algo não cabe na largura, a solução é **scroll** (vertical na tela, horizontal num container específico) ou **reflow** — não suprimir informação.

- **Respeite a safe area** (`react-native-safe-area-context`) para não ficar sob notch, status bar ou home indicator. Não chumbe `paddingTop` mágico.
- **Conteúdo que pode estourar a altura vai em `ScrollView`/`FlashList`.** Formulário longo precisa rolar e respeitar o teclado (`KeyboardAvoidingView` / `keyboardShouldPersistTaps`).
- **Conteúdo largo**: container com `ScrollView horizontal` em vez de cortar partes.
- **Tablet e landscape**: use os **breakpoints do Unistyles** (`xs:0, sm, md, lg, xl`) para adaptar layout, não condicional manual com `Dimensions`.

## Loading e estados intermediários

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
