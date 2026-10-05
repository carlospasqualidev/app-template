# Convenções do projeto

Guia de referência movido do `CLAUDE.md`: leia antes de criar ou mexer em rota, tela, chamada de API, formulário, data, toast, componente, tipografia ou tema. As regras gerais (stack, TypeScript, JSX, segurança, acessibilidade, loading, git, estrutura) continuam no [`CLAUDE.md`](../CLAUDE.md), em versão curta quando o detalhe foi para [`docs/claude/ui-telas.md`](claude/ui-telas.md) (JSX, acessibilidade, loading), [`docs/claude/seguranca.md`](claude/seguranca.md) (object injection, LGPD) ou [`docs/claude/referencia.md`](claude/referencia.md) (estrutura).

## Imports

- Use o alias `@/` para imports internos de `src/` (ex.: `@/components/button`, `@/lib/toast`). Configure em `tsconfig.json` e no `babel.config.js`.
- Não use caminhos relativos longos (`../../../`) — troque por `@/`.

## Rotas (Expo Router — file-based)

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

## Organização de telas

`src/screens/<feature>/index.tsx` deve ficar **enxuto** — apenas o shell da tela: orquestração de abas, layout principal, navegação e chamadas a hooks/serviços. Quando a tela cresce com várias seções lógicas (abas, blocos extensos, dialogs, formulários grandes), separe cada bloco em seu próprio arquivo. Não empilhe várias seções num único arquivo gigante.

✓ Uma seção por arquivo:

```
src/screens/users/userDetails/
├── index.tsx              # shell, monta as abas
├── overviewTab.tsx
├── activityTab.tsx
└── permissionsTab.tsx
```

Cada arquivo exporta apenas o seu componente público. Helpers privados (constantes, sub-componentes de uma única seção, type guards locais) ficam **dentro do arquivo onde são usados**. Utilitários compartilhados entre sub-telas vão em `src/screens/<feature>/utils/` (ver "Uma pasta por sub-tela da feature" abaixo).

**Não embrulhe a tela inteira num wrapper de spacing/padding.** Toda tela usa o componente **`Screen`** (`@/components/screen`) como raiz (exceção: as telas de auth usam o `AuthLayout` full-bleed — ver Sessão e autenticação) — ele já aplica safe area, padding horizontal, `gap` padrão entre os filhos, scroll e a folga inferior que limpa a tab bar flutuante do grupo `(app)`. Adicionar uma `View` com `gap`/`padding` na raiz da tela é redundante e descalibra o ritmo visual entre telas. Só introduza um wrapper próprio quando precisar de comportamento de layout real que o `Screen` não cobre.

**Props do `Screen`:**

- `title` / `description` — quando `title` é passado, o `Screen` renderiza o cabeçalho (título `h2` + descrição `p2` muted). Sem `title`, a tela é só o corpo.
- `headerActions` — nós à direita do título (ex.: botão de ação).
- `showBackButton` (default `false`) + `onBack` — mostra a seta de voltar na linha do título; `onBack` default é `router.back()`.
- `scrollable` (default `true`) — `ScrollView` com `keyboardShouldPersistTaps="handled"`. Passe `false` quando a tela tem o próprio scroller (ex.: `FlashList` ocupando `flex: 1`); nesse caso o scroller interno cuida da sua folga inferior.
- `showsVerticalScrollIndicator` (default `false`).

O `Screen` aplica a safe area (topo/base) via **insets do Unistyles** (`rt.insets`/`rt.statusBar`, síncronos no 1º frame), não via `SafeAreaView` do `safe-area-context` — este último aplica o padding só **depois** de medir e causava um flash de conteúdo colado na status bar no primeiro frame. O `background` cobre a tela toda (edge-to-edge) e só o conteúdo respeita as bordas.

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

### Uma pasta por sub-tela da feature

Quando a feature tem telas distintas (listagem, detalhe — e às vezes criar/editar dedicados), **cada sub-tela ganha sua própria pasta** com o `index.tsx` daquela tela + **os componentes que só existem nela**. Regra dura:

- **Componente/utilitário exclusivo de uma sub-tela → dentro da pasta daquela sub-tela.** Um modal/skeleton/item de lista que só aparece no detalhe mora em `details/`; o que só aparece na listagem, em `list/`.
- **Compartilhado entre sub-telas → numa pasta `utils/` da feature — nunca solto na raiz.** Campos de formulário reaproveitados por criar **e** editar, `queryKeys.ts`, constantes e helpers ficam em `src/screens/<feature>/utils/`.
- Nunca deixe um componente exclusivo de uma tela "solto" na raiz da feature — se só uma tela usa, ele pertence à pasta dela; se mais de uma usa, vai para `utils/`.

```
src/screens/users/
├── utils/                     # comuns/compartilhados (nunca soltos na raiz)
│   ├── userFormFields.tsx     # reaproveitado por criar + editar
│   └── queryKeys.ts
├── list/
│   ├── index.tsx              # tela de listagem
│   └── userListSkeleton.tsx
└── details/
    ├── index.tsx              # tela de detalhe
    └── userDetailSkeleton.tsx
```

Os arquivos de rota do Expo Router continuam finos, cada um delegando para a pasta da sua sub-tela (`src/app/(app)/users/index.tsx` → `list/`; `src/app/(app)/users/[id].tsx` → `details/`). Chamadas de API continuam fora de `screens/`, em `services/<módulo>/` (ver HTTP).

## HTTP

- Use a instância **`api`** de [`src/services/api`](../src/services/api) — ela já trata `baseURL`, injeção do token e os toasts via interceptors. **Não crie axios avulso.** O `api` expõe `get/post/put/delete` genéricos que já devolvem `response.data` tipado (`api.get<User[]>('/users')`).
- Para server state: TanStack Query (`useQuery` / `useMutation`) com o `queryClient` de [`src/lib/queryClient.ts`](../src/lib/queryClient.ts). Não use `useEffect` + `fetch`.

### Anatomia do cliente (`src/services/api/`)

Portado do template web, adaptado para RN. **Preserve esta estrutura:**

- **`api.ts`** — a instância axios + interceptors. Um interceptor de **request** injeta o token do `expo-secure-store` no header `Authorization` (no web era cookie HTTP-only; no RN o token vai explícito). O interceptor de **response** chama `thenHandler`/`catchHandler`.
- **`errorHandlers.ts`** — `catchHandler` exibe o toast de erro (mensagem da API → `Erro <status>` → "Erro de comunicação"); `thenHandler` exibe toast de sucesso quando a resposta traz `data.message`. Ambos via `@/lib/toast`. `sendErrorMessage` reporta a `EXPO_PUBLIC_ERROR_LOG_URL` fora do dev (nunca lança).
- **`types.ts`** — shapes parciais de request/response dos interceptors + o type guard `hasResponseMessage`.
- **`sessionUserRef.ts`** — referência mutável do usuário logado (quebra o ciclo de imports entre `errorHandlers` e o store de sessão); o store mantém sincronizado.
- **`index.ts`** — `export { api }`.

O token vive em [`src/services/session/sessionToken.ts`](../src/services/session/sessionToken.ts) (`get/set/clear` sobre `expo-secure-store`).

### Variáveis de ambiente (`src/lib/env.ts`)

- Envs expostas ao app usam o prefixo **`EXPO_PUBLIC_`** e são **validadas com Zod na primeira importação** — falta uma? o app falha rápido com mensagem clara em vez de quebrar em runtime.
- Ao adicionar uma env, declare no schema de `env.ts` **e** em [`.env.example`](../.env.example). Nunca leia `process.env` direto na tela — importe `env`.
- `.env`/`.env.local` **não vão pro repo** (contêm URLs/segredos por ambiente).

### Onde vivem as chamadas de API — `services/<módulo>/`

**Toda função que fala com o backend vive em `src/services/<módulo>/` — nunca co-localizada na tela (`src/screens/...`) nem dentro de `services/api/`.** Cada módulo (ex.: `services/users/`, `services/session/`) agrupa os **schemas Zod** e as **chamadas** (`api.get/post/...`) daquele domínio; a tela consome via TanStack Query e **não** chama `api.*` direto.

- **`services/api/`** é só o **cliente** (instância + interceptors + tipos de transporte). Não coloque chamada de domínio aqui.
- **`services/<módulo>/`**: as chamadas + seus schemas. Mantenha o schema Zod **junto** do fetch que o usa, derivando o tipo com `z.infer<typeof schema>` (fonte de verdade do shape ao lado do parser). Atualize quando o contrato mudar; importe em hooks, telas e testes.

❌ `src/screens/users/userListApi.ts` (chamada dentro de `screens/`)
❌ `src/services/api/users/userListApi.ts` (domínio dentro de `services/api/`)
✓ `src/services/users/userListApi.ts` (no módulo, importada pela tela)

### Convenção de `queryKey`

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

### Toda tela usa TanStack Query

Qualquer dado vindo do servidor entra via **TanStack Query** — sem exceção. Não há `useEffect` + `fetch`, não há `useState` espelhando resposta de API, não há `axios` chamado direto no `onPress`. O cache compartilhado, deduplicação, retry e refetch só funcionam se **todo mundo** usar a biblioteca.

**Técnicas que toda tela deve aplicar quando se aplicarem:**

1. **`staleTime` consciente, não default.** Default é `0` (qualquer remontagem refetcha). Listagem que muda pouco → `60_000`+; dado volátil → `0`.
2. **`staleTime` ≠ `gcTime`.** `staleTime` decide quando o dado é velho; `gcTime` (default 5 min) decide quando sai do cache sem consumidor. Dado consultado várias vezes na sessão → aumente `gcTime`.
3. **`placeholderData: keepPreviousData` para paginação/filtro sem flicker.** Mantém os dados anteriores enquanto a nova página carrega.
4. **`enabled` para queries dependentes.** `enabled: !!id` quando a query depende de um `id` que pode estar indefinido.
5. **Prefetch no `loader`/em foco.** Para tela rápida sem skeleton, prefetch o dado em paralelo ao chunk com `queryClient.prefetchQuery(...)`.
6. **Mutations expõem estado, não inventam.** Use `isPending`/`error`/`isSuccess` — não crie `useState('loading')` paralelo.
7. **Invalide na hora certa** (`onSuccess`/`onSettled`).
8. **Refetch em foco no RN**: o `focusManager` (via `AppState`, em `@/hooks/useReactQueryFocus`, chamado no layout raiz) e o `onlineManager` (via `NetInfo`, em `@/lib/queryClient`) já estão ligados no boot. O default é `refetchOnWindowFocus: false`; habilite por query quando o dado vale revalidar ao voltar pro app. Tela de referência do padrão completo (query + `queryKeys` + `FlashList` + skeleton + estados): [`src/screens/posts`](../src/screens/posts).
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

## Sessão e autenticação

A casca de auth já existe; o **backend concreto é plugável** (por padrão roda em modo fake).

- **Store**: `useSessionStore` (`@/stores/sessionStore`, Zustand) guarda `user` + `status` (`idle`/`validating`/`authenticated`/`unauthenticated`) + `isAuthenticating`, e expõe `validate`/`signIn`/`signUp`/`signOut`. Ele mantém o `sessionUserRef` (usado pelo log de erros) sincronizado.
- **Serviço**: `@/services/session/sessionService` — hoje em **modo fake** (aceita qualquer credencial, persiste no secure-store), com a **implementação real comentada** no fim do arquivo. Para plugar o backend: siga as instruções no topo do arquivo e apague `fakeSession.ts`.
- **Token**: `@/services/session/sessionToken` (`get/set/clear` sobre `expo-secure-store`) — nunca em `AsyncStorage`. O interceptor do `api` injeta no header `Authorization`.
- **Gate**: o **root `_layout.tsx`** chama `validate()` no boot e, enquanto `idle`/`validating`, mostra `SessionBoot` (indicador de tela cheia — a exceção legítima da regra de loading) no lugar do `Stack`. Validar no root (e não no `(app)`) faz o navegador de rotas montar já num estado definido, sem swap de layout que quebra a tab bar. Resolvida a sessão, o `_layout.tsx` do grupo `(app)`: `unauthenticated` → `<Redirect href="/login" />`; autenticado → renderiza as tabs (`TabBar`).
- **Grupos**: `(auth)` (público: login/signup) e `(app)` (protegido). O root `_layout.tsx` monta os providers (Query, GestureHandler, SafeArea) + o gate de sessão + `Stack` + `Toaster` + `SystemBarsBackground`.
- **ErrorBoundary**: o `_layout.tsx` do `(app)` exporta `ErrorBoundary` (usa o `ErrorFallback` global) — toda rota protegida herda o fallback amigável + "Tentar novamente".
- **Visual (splash + auth)**: o boot mostra o `SessionBoot` como **splash** (`BrandLogo` sobre `AuroraBackground`). Login e signup **não usam `Screen`** — usam o `AuthLayout` (`src/screens/auth/authLayout.tsx`): `AuroraBackground` (brilhos degradê na cor da marca, genéricos, via `expo-linear-gradient`) + cabeçalho + **painel de vidro** (tokens `glassSurface`/`glassBorder`). O rodapé "tem conta? / criar conta" é o `AuthFooter` compartilhado. É a exceção full-bleed à regra "toda tela usa `Screen`". Textos/labels são os que os fluxos Maestro miram — ao mexer, atualize os specs.

## Estado global

- Zustand para client state global compartilhado, em `src/stores/` (ex.: `sessionStore`). Para persistir preferência não-sensível, use o middleware `persist` do Zustand com `MMKV` (`react-native-mmkv` — módulo nativo, **não vem instalado**; adicione quando precisar e reconstrua o dev build).
- TanStack Query para server state — não duplique resposta de API no Zustand.
- Estado local de tela: `useState` normal.

## Formulários

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

### Cobertura obrigatória com Zod

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

### Nenhum input sem placeholder (regra dura)

**Todo campo de entrada tem um `placeholder` que orienta o que digitar/selecionar — sem exceção.** Vale para `TextField`, `TextareaField`, `PasswordField`, `SelectField`, `MultiSelectField`, `DateField` e qualquer campo mascarado/pesquisável que você criar. Um campo sem placeholder (só o rótulo e a caixa vazia) deixa o usuário sem pista do formato/ação esperados.

- O placeholder **complementa** o rótulo, **nunca o substitui** (o `label` continua obrigatório — ver a11y "Toda input precisa de label" no [`CLAUDE.md`](../CLAUDE.md#acessibilidade-a11y)).
- **Texto/número/máscara:** exemplo do formato/conteúdo esperado ("Digite o código", "seu@email.com").
- **Select/MultiSelect/campo pesquisável:** ação de escolha ("Selecione", "Selecione o cliente", "Todos" em filtro multi). Os primitivos já trazem `"Selecione"` e `"DD/MM/AAAA"` como default — não troque por algo mais vago.
- **Únicas exceções** (não têm placeholder por natureza): `SwitchField`, `CheckboxField`, `RadioGroupField` e campos read-only de exibição.

### Máscara de quantidade e valor (pt-BR) — obrigatória (preenchimento E exibição)

**Todo campo de quantidade (com casas decimais), valor monetário ou número com decimais usa formato pt-BR (milhar `.` e decimal `,`) — sem exceção.** Vale para **entrada** (formulários) e **exibição** (listas, detalhes, resumos). Número decimal cru na tela (`1500` onde deveria ser `1.500,00`) é bug de produto.

- **Exibição:** formate com `toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })`, ou reaproveite o valor **já formatado** quando o backend o entrega pronto. Não jogue número cru dentro de um `Text`.
- **Entrada:** o campo mascara **na digitação** (os dígitos preenchem da direita: `150000` → `1.500,00`) e guarda um **`number`** no formulário, não a string mascarada. `keyboardType="numeric"` sozinho não formata nada. Ainda não há campo numérico no template — ao precisar do primeiro, crie um `NumberField` em `@/components/form` seguindo o padrão dos outros campos (union controlled/standalone), em vez de mascarar à mão dentro da tela.
- **Schema:** o campo é `z.number(...)` (o campo entrega número); vazio → `undefined` → o `z.number` acusa "obrigatório". Não use `z.coerce.number()` sobre string mascarada.

### Erro de campo não desloca componentes vizinhos

Quando um campo exibe mensagem de erro, o `Field` cresce **para baixo** (a mensagem entra abaixo do controle). Numa linha com outros elementos (botão ao lado, campo irmão), isso **não pode empurrar/deslocar os vizinhos**.

- **Linha com campos usa `alignItems: "flex-start"`** — nunca `"flex-end"`/`"center"` numa linha onde algum campo pode exibir erro. `flex-end`/`center` ancoram pelo rodapé/meio, que "desce" quando o erro aparece, arrastando os irmãos junto.
- **Botão/adorno ao lado de um campo**: alinhe-o ao **controle**, não ao rodapé do campo (que cresce com o erro) — com o label acima, desça o botão pela altura do label em vez de centralizar a linha.

### Field-arrays grandes: assinaturas ESCOPADAS (nunca `useWatch` no array inteiro)

**Em formulário com `useFieldArray` (lista de linhas, ainda mais se aninhado), NUNCA use `useWatch({ name: "arrayInteiro" })` no componente pai.** Isso assina TODAS as mudanças de QUALQUER campo de QUALQUER linha; digitar uma tecla dispara re-render do pai e, em cascata, de **todas** as linhas — o formulário "trava independente de onde se mexe" (num device isso aparece mais cedo e pior que na web).

- **A lista/estrutura vem do `useFieldArray`** (`fields`) — ele re-renderiza só em mudança **estrutural** (append/remove/move/replace), não a cada tecla. Se o pai precisa de `replace` e um filho precisa de `fields`, pegue ambos do mesmo `useFieldArray` e **passe `fields` como prop** (evite dois `useFieldArray` no mesmo `name`).
- **Cada linha é um COMPONENTE próprio** (`<Row index={i} />`) que assina só o **seu** estado com ``useWatch({ name: `arr.${i}.campo` })``. Digitar numa linha re-renderiza no máximo aquela linha.
- **Dados estáticos da linha** (nome, unidade, grupo) saem do `fields[i]`, não de `useWatch`.
- **Agregados** (ex.: "selecionar todos") assinam só a projeção necessária: ``useWatch({ name: fields.map((_, i) => `arr.${i}.flag`) })`` — não o array inteiro.
- **Efeito que reage à MUDANÇA de um campo compara com o valor ANTERIOR (ref), nunca um guard "montou".** Sob **StrictMode** o efeito roda 2× no mount e o guard de mount dispara na 2ª passada — sujando o form (`shouldDirty`) e **sobrescrevendo valores carregados**. Use `const prevRef = useRef(campo); useEffect(() => { if (prevRef.current === campo) return; prevRef.current = campo; ... }, [campo])`.
- **Memoize a linha (`React.memo`) com callbacks ESTÁVEIS** — handlers recebem o índice por parâmetro e são `useCallback` estáveis; `options` memoizadas. Sem isso o `React.memo` não segura (props com identidade nova a cada render) — é a mesma regra de "não passe objeto/função inline" da seção [Performance](../CLAUDE.md#performance) do `CLAUDE.md`.
- **Regras de hooks:** todos os `useWatch` da linha vêm ANTES de qualquer `return` condicional.

## Datas

**A natureza do valor decide o tratamento de fuso — e ela é explícita, nunca adivinhada pelo formato da string.**

- **Dia de calendário** — representa um _dia_, sem hora útil (nascimento, vencimento, competência). Grave/exiba **sem fuso** (UTC), pra não "andar" ±1 dia na virada da meia-noite.
- **Instante** — um _momento_ no tempo (`createdAt`, agendamento com hora). Grave/exiba respeitando o **fuso local** do device.
- A mesma decisão que rege a **gravação** rege a **exibição**. Misturar (salvar como dia de calendário e exibir como instante) faz o dia pular ±1 — é o bug clássico de data.
- **Exibição em pt-BR** (`dd/MM/yyyy`), **persistência e query em ISO** (`YYYY-MM-DD` ou ISO completo). Não mande formato local pra API nem jogue ISO cru na tela.
- **Centralize num utilitário** (`src/lib/date/`) e reaproveite — não espalhe parsing/formatação (nem `date-fns` importado direto) pelas telas. Formato local recebido onde se espera ISO deve **falhar alto**, não virar `Invalid Date` silencioso.

## Notificações

- `sonner-native`. O `<Toaster />` fica montado no root layout (`src/app/_layout.tsx`), dentro de `GestureHandlerRootView` + `SafeAreaProvider`.
- **Sempre dispare toast por `@/lib/toast`, nunca importe de `sonner-native` direto.** O wrapper garante o anúncio ao leitor de tela (`AccessibilityInfo.announceForAccessibility`) — regra de a11y que o `sonner-native` cru não cobre.
- API: `toast.success`, `toast.error`, `toast.info`, `toast.warning` (`(message, options?)`) e `toast.dismiss(id?)`. `options` é o mesmo do `sonner-native` (`description`, `duration`, `action`, etc.).
- **Mensagens em pt-BR**, curtas e sem PII (o toast não ecoa o input do usuário — ver [Segurança](../CLAUDE.md#segurança) no `CLAUDE.md`).
- A camada de rede já dispara os toasts de erro genéricos via interceptors — **não duplique no caller** a menos que o caso exija tratamento específico.

```ts
import { toast } from "@/lib/toast";

toast.success("Registro salvo.");
toast.error("Falha ao salvar. Tente novamente.");
toast.info("Sincronização em andamento.", {
  description: "Isso pode levar alguns segundos.",
});
```

## Componentes (`components/`)

Não usamos biblioteca de UI. O padrão é **componentes próprios dentro do projeto**, que cuidam do próprio comportamento e da a11y (props `accessibility*` do RN; **rn-primitives** só no checkbox) e são estilizados com **Unistyles** (`StyleSheet` + variantes).

- **Camada única.** Como você é dono do componente desde o primitivo até o estilo, o componente já é a abstração — não há split entre "primitivo cru" e "wrapper".
- Estilo sempre via Unistyles (`StyleSheet.create((theme) => ({...}))` + `variants`). Combine estilos com array (`style={[styles.base, styles.active]}`), não com merge de classes.
- Variantes de componente (tamanho, tom, estado) usam o sistema de **variants** do Unistyles, não props que montam estilo na mão.
- Antes de criar um componente novo, **varra `components/` atrás de equivalente**. Se já existe, use; se falta, crie. Uma tela nova deve compor a partir do que existe, não reinventar `View` + estilo solto para algo já resolvido.

**Padrão para criar um componente:**

- Pasta `components/<nome>/<nome>.tsx`, export nomeado, interface prefixada com `I`.
- Se o componente usar um primitivo do rn-primitives (hoje só o checkbox, com `import * as CheckboxPrimitive from "@rn-primitives/checkbox"`), importe-o como `XPrimitive` para evitar shadowing.
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

**Confirmações de ação** (delete, publicar, arquivar): use o **`ConfirmDialog`** (`@/components/confirmDialog`) — ele fica aberto enquanto o `onConfirm` resolve (botão com loading), fecha em sucesso e permanece aberto se a promise lançar (o erro propaga pra camada de rede, que já mostra o toast). Ref. de uso (com `useMutation` + optimistic update): [`src/screens/posts`](../src/screens/posts).

**Confirmação dupla para ações críticas** (bloquear usuário, apagar dado sensível, reverter cobrança): passe `requireText="APAGAR"` ao `ConfirmDialog` — ele exige digitar a palavra num campo que só habilita o botão final quando o texto bate. Use só em ações irreversíveis/alto impacto.

## Tipografia

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
- **Hierarquia: subtítulo NUNCA maior que o título do container (regra dura).** Dentro de um `Modal`, `Card` ou seção, o **título do container é o maior heading**; todo heading de subseção no corpo é **visualmente menor** que ele — nunca maior. Subtítulo maior inverte a hierarquia e "grita" mais que o título (ex.: um bloco interno em `h1`/`h2` dentro de um modal cujo título é `h3`). Se a subseção parece maior que o título, **reduza a variante da subseção** — não aumente o título. Vale em qualquer nível: sub-subtítulo < subtítulo < título.

## Cor da marca e tema

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

## Tags e badges — cor semântica vem do tema (regra dura)

Toda tag/pílula (`Badge`, `@/components/badge`) tira a cor de uma **variante semântica**, e a cor de cada variante vive **só** nos tokens do tema (`unistyles.ts`, definidos em light **e** dark). Nunca escreva cor solta na tela (`backgroundColor: "#dcfce7"`, `color: "#b91c1c"`) nem use `variant="default"` (cor cheia da marca) como tag de status.

Mapa de significado (use a variante, não invente cor):

- **`success`** — positivo / ativo / concluído.
- **`warning`** — atenção / pendência.
- **`destructive`** — erro / negativo / destrutivo.
- **`secondary`** e **`outline`** — **neutro**: rótulos e **totalizadores** (contadores/somatórios como "5 registros"). Totalizador **não tem status** → não recebe cor semântica (nada de arco-íris ciclando `success`/`warning`).

Mapa de status→variante que se repete numa tela vive num `Map<string, BadgeVariant>` (sem object-injection — ver [Segurança](../CLAUDE.md#segurança) no `CLAUDE.md`). Ao precisar de um tom novo, **adicione o token no tema (light + dark) e uma variante no `Badge`** — nunca cor solta na tela. O mesmo vale para qualquer outro componente que comunique status.

## Sempre projete para claro E escuro (obrigatório)

**Todo componente e toda tela nascem suportando os dois temas — não é opcional nem "depois".** O app segue o tema do sistema, então cada superfície precisa ficar correta e legível nos dois. Regressão comum: construir e olhar só no tema do seu device (normalmente escuro) e o claro sair quebrado.

Regras práticas:

- **Cor só via token do tema** (`theme.colors.*`) — nunca hex/rgba cravado num componente ou tela. Se um tom novo é necessário, adicione o token em `unistyles.ts` **nas duas variantes** (light + dark), como fizemos com `success`/`warning`. Cor literal só é aceitável para overlay neutro que não pertence ao tema (ex.: `rgba(0,0,0,0.6)` do overlay de modal).
- **Verifique nos dois temas antes de considerar pronto.** Mude o tema do sistema (Configurações do Android/iOS) e confira contraste, elevação e bordas em light e dark. Contraste mínimo 4.5:1 (ver [Acessibilidade](../CLAUDE.md#acessibilidade-a11y) no `CLAUDE.md`).
- **Elevação no dark vem de `card` mais claro que `background`**, não de sombra (sombra não rende em fundo escuro) — remova/reduza sombra no dark.
- **Estilize sempre de forma idiomática** (`StyleSheet.create((theme) => ({ ... }))` com `theme.colors.*`), inclusive o fundo (`backgroundColor: theme.colors.background`). Com o tema seguindo o sistema, a troca é rara e acompanha o ciclo de vida do app (você sai para as Configurações e volta), então aplica correto — sem necessidade de qualquer truque de repaint.
