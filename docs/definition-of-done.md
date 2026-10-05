# Definition of Done

Fonte única do que torna uma tarefa e uma entrega prontas neste app. Termos: _tarefa_ é o card, a unidade de trabalho; _entrega_ é o ticket inteiro, com todas as suas tarefas. O _loop por tarefa_ roda a cada mudança e a cada rodada de correção; o _fechamento_ roda uma vez por entrega, depois da última tarefa, não por tarefa nem por rodada de correção. O que nunca se faz sem aval está em [`guardrails.md`](guardrails.md); como escrever os testes, em [`testing-guide.md`](testing-guide.md).

## Loop por tarefa

Escopado no que a mudança tocou. Tudo verde antes de passar adiante; erro que não dá para corrigir no escopo vira pendência reportada, não "pronto".

1. **Typecheck**: `npm run typecheck` (`tsc --noEmit`, cobre o app inteiro; `src/tests/` fica fora do `tsc` e é coberto pelo Jest).
2. **Lint** dos arquivos tocados: `npx eslint <arquivos ou pastas>` (ex.: `npx eslint src/components/button`). O `npm run lint` (`expo lint`) roda o projeto todo.
3. **Testes Jest da área tocada**: `npm run test:related` é o padrão: roda só os testes afetados pelas mudanças não commitadas e inclui os testes de quem importa o arquivo alterado. 0 testes ou "No tests found" não é verde: depois do commit, use `npx jest --findRelatedTests <arquivos>`; mudança em `jest.config.js`, `src/tests/setup.ts` ou `package.json` exige `npm test`; em mudança sem código (só documentação), reporte `test:related 0/0 (só docs)`. Alternativas para iterar: `npx jest <caminho>` filtra por arquivo ou pasta de teste (ex.: `npx jest src/tests/components/button`), `npx jest -t "<nome do teste>"` filtra por nome, e `npx jest --findRelatedTests <arquivos>` pega os afetados por arquivos já commitados. Lógica não-trivial e componente reutilizável alterados ganham ou atualizam teste junto (ver [`testing-guide.md`](testing-guide.md)).
4. **Documentação acompanha a mudança** (abaixo).

### Documentação acompanha a mudança

**SEMPRE** que você mexer em algo que impacte o **funcionamento** ou a
**usabilidade** do app (fluxo novo, mudança de comportamento, campo novo, regra,
correção visível ao usuário), **atualize a documentação correspondente no mesmo
PR**. Documentação divergente do código é pior que documentação inexistente.

- **Doc de usuário (quando o projeto tiver uma superfície de docs):** escreva em
  **linguagem de negócio** — o que a tela faz, como usar, o que pode/não pode,
  **erros possíveis**. Nunca jargão de código, número de card/demanda ou caminho
  de arquivo. Espelhe a estrutura das páginas existentes. Se houver nota de
  versão/changelog voltado ao usuário, registre lá a mudança visível (com módulo
  e impacto).
- **Convenção que vai se repetir → registre onde manda a seção [Onde registrar convenção nova](../CLAUDE.md#onde-registrar-convenção-nova) do `CLAUDE.md`.** Ao introduzir um
  padrão novo (organização de pasta, componente compartilhado, regra de UX),
  documente-o lá para a próxima sessão (humana ou Claude) já chegar alinhada.
- Só é dispensável quando a mudança **não afeta o uso** (refactor interno, teste,
  tooling).

## Fechamento

Uma vez por entrega, depois da última tarefa; não por tarefa nem por rodada de correção. Bloqueia o "pronto": `npm run check` com falha, fluxo Maestro falhando sem a causa investigada, teste pulado ou focado (`it.skip`/`only`) deixado no código, e fluxo relevante novo sem `.maestro/<nome>.yaml`.

1. **`npm run check` completo** (lint + typecheck + test) verde.
2. **Fluxos Maestro no device/emulador** quando a entrega toca a UI (abaixo).

### Rode o Maestro ao fechar a entrega (obrigatório)

**Ao fechar qualquer entrega que toque a UI — tela nova, componente novo, mudança de fluxo, ou qualquer alteração visível ao usuário — rode os fluxos E2E do Maestro** (`npm run test:e2e`), além dos testes unitários (`npm run check`). Uma entrega **não está pronta** sem o app exercitado ponta a ponta no device/emulador.

- Se a tarefa introduz um fluxo relevante novo (criar, editar, excluir, navegar para uma área nova), **adicione um fluxo `.maestro/<nome>.yaml`** cobrindo-o. Se muda textos/labels da UI, **atualize os specs** que miram por eles (o Maestro casa por texto/label de acessibilidade).
- **Pré-requisito**: dev build instalado + Metro rodando. Se a entrega mexeu em dependência/módulo nativo, **reconstrua antes** (`npx expo run:android`) — rodar contra um build defasado trava o app na splash e o E2E falha por engano (não é regressão real).
- Reporte o resultado dos fluxos junto com o do `npm run check`. Falhou? Investigue a causa (regressão real vs. seletor desatualizado vs. build/Metro) antes de dar a entrega por concluída. Gotchas e seletores em [`.maestro/README.md`](../.maestro/README.md).

## Como reportar

Placar medido, não estimado, no formato curto:

- `check N/N` — testes Jest passando sobre o total da linha `Tests:` do `npm run check`, com lint e typecheck verdes (ex.: `check 120/120`).
- `maestro X/X` — fluxos passando sobre fluxos rodados, com o device/emulador e o build usados; ou `maestro não rodou` com o motivo (ex.: entrega só de documentação).
- No loop, dizer qual filtro rodou (`npm run test:related`, `npx jest <caminho>`, `npx eslint <arquivos>`) e o placar N/N da linha `Tests:` dele, inclusive do `npm run test:related` (ex.: `test:related 32/32`); um `0/0` ou "No tests found" aparece no relatório e não conta como verde (só documentação: `test:related 0/0 (só docs)`).
- O que foi verificado à mão (tela aberta no dev build, temas claro e escuro), em uma linha.
- Falha que ficou: o erro em uma linha, como pendência.
