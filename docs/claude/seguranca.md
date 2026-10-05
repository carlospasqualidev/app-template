# Segurança: object injection e LGPD

Parte do [`CLAUDE.md`](../../CLAUDE.md), movida de lá sem reescrita: o texto é o mesmo e os títulos mantêm o nível de origem; o núcleo guarda a versão curta de cada regra. Os caminhos citados são relativos à raiz do repositório. Leia quando a tarefa indexa objeto ou array por chave que não é literal, encontra o aviso `security/detect-object-injection`, loga erro de API ou trata dado pessoal (log, toast, params de rota/deep link, `defaultValues`, mock, fixture). A versão curta das duas regras continua no núcleo, seção Segurança.

## Segurança

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

- **Erros de API**: a camada de rede já exibe mensagem amigável — não relogue o objeto de erro cru no `console.error`, nem em dev (pode trazer PII). O `.env.local` não vai pro repo.
- **Params de deep link/rota nunca levam PII** (aparecem em logs, histórico de navegação, analytics de tela). Use ID opaco na rota (`/users/abc123`), nunca CPF; dado sensível vai no body de uma chamada autenticada.
- **Toast/erro ao usuário não ecoa o input**: `"Falha ao salvar."` em vez de `"Falha ao salvar o usuário ${nome} (CPF ${cpf})."`.
- **Form com PII** (cadastro, perfil): garanta que `defaultValues` de exemplo não foram commitados com dado real.
- **Mocks e fixtures**: dados de exemplo são fictícios — não cole CPF/e-mail real "porque é só pra testar".
