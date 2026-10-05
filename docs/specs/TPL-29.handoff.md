# TPL-29 — handoff

Card só de documentação: nenhuma tela, componente, hook, store ou fluxo de dados alterado.

- `Integracao com API`: nenhuma.
- `Alteracoes`:
  - `CLAUDE.md` de 997 para 403 linhas. Saíram: "Documentação acompanha a mudança" (`:55-72`) e "Rode o Maestro ao concluir a tarefa" (`:304-310`) para `docs/definition-of-done.md`; Testes (`:281-349`, sem o bloco do Maestro) para `docs/testing-guide.md`; Convenções do projeto (`:482-997`, com HTTP, Formulários, Datas, Tema) para `docs/conventions.md`, com os títulos promovidos um nível (`###` para `##`). Ficou no lugar a seção "Guias de referência" (tabela arquivo → quando ler, sem `@import`).
  - Novos: `docs/definition-of-done.md` (Loop por tarefa / Fechamento / Como reportar) e `docs/guardrails.md` (lista do que não se faz sem aval, remetendo à seção Segurança do `CLAUDE.md`).
  - Referências ajustadas: links relativos dos textos movidos (`../src/...`, `../.env.example`, `../.maestro/README.md`); "ver Segurança/Acessibilidade/Performance/a11y" passaram a linkar o `CLAUDE.md`; "ver Rotas" no `CLAUDE.md` linka `docs/conventions.md`; "registre neste `CLAUDE.md`" virou "no `CLAUDE.md` (regra geral) ou no guia de `docs/` do assunto" (no DoD e no item 3 de Inspirações). `README.md`, `AGENTS.md` e `.maestro/README.md` apontam para os guias.
  - Conferência mecânica: das 423 linhas não vazias removidas do `CLAUDE.md`, 377 reaparecem idênticas em `docs/`, 27 só com o nível de título trocado, e 19 com referência ajustada ou título substituído (cada uma conferida pela reversão do ajuste).
- `Ambiente`: nenhum. Sem mudança de config do Expo, env ou dependência.
- `Observacoes`:
  - Termos fixos (iguais nos três templates): _tarefa_ = o card, unidade de trabalho; _entrega_ = o ticket inteiro. Loop por tarefa a cada mudança e rodada de correção; Fechamento uma vez por entrega, depois da última tarefa. O bloco movido do Maestro foi ajustado a isso ("Ao fechar qualquer entrega que toque a UI", "Uma entrega não está pronta", rebuild e "dar a entrega por concluída").
  - `docs/` entrou no `.prettierignore`, sob o mesmo comentário do `CLAUDE.md` (docs formatados à mão). `.maestro/README.md` já falhava no prettier antes deste card.
  - `docs/guardrails.md`: o `.gitignore` cobre `.env`, `.env*.local`, `*.jks`, `*.p8`, `*.p12`, `*.key`, `*.pem`, `*.mobileprovision`; credenciais do EAS (`credentials.json`, JSON de service account) não estão cobertas e nunca se commitam.

## Verificação

- Rodada 1: `npm run check` verde, check 53/53 (18/18 suites).
- Rodada de correção: `npm run check` verde, check 53/53 (18/18 suites); lint com 1 warning preexistente em `src/services/api/api.ts:9` (não tocado). Maestro não rodou: card só de documentação.
  - Os guias irmãos de TPL-27/28 ainda não existem; a estrutura usada aqui (`# Definition of Done` → `## Loop por tarefa`, `## Fechamento`, `## Como reportar`; `# Guardrails` → `## Sem aval, não se faz`, `## Quando o aval falta`) é a referência para os outros dois.
