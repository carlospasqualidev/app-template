# TPL-32: App / Testes / Testes relacionados no loop por tarefa

Plataforma: mobile | Repositório: D:\Development\personal-projects\templates\app-template | Branch: main (sem RM)
Fontes: levantamento de 2026-10-05 sobre a lentidão dos testes em projetos feitos destes templates. Irmãos: TPL-30 (server) e TPL-31 (frontend) criam o mesmo script `test:related` e o mesmo passo no DoD; TPL-33 muda o reviewer global. Nome do script e redação do passo no DoD devem ser iguais nos três templates (padrão: `npm run test:related`, "inclui os testes de quem importa o arquivo alterado"; filtro por caminho como alternativa para iterar).

## Objetivo

O agente tem um comando único para rodar só os testes afetados pela mudança no app, e o DoD aponta para ele.

## Situação atual (âncoras)

- `jest.config.js`: `preset: jest-expo`, `testTimeout` 30 s, `maxWorkers: "50%"` (:17-18). 18 arquivos, 53 testes (16 de componente em `src/tests/components`).
- `docs/definition-of-done.md:7,11`: loop com `npx jest <caminho>` / `-t`. Fechamento `:35-42`: `npm run check` + Maestro quando a UI muda.
- `docs/testing-guide.md:12`: execução fria ≈70 s → ≈15 s depois do `maxWorkers`.
- Nenhum script de testes relacionados.

## Critério de pronto

- [ ] **Medição antes**: tempo de parede de `npm test` e de um arquivo filtrado. Anotar no handoff.
- [ ] **`npm run test:related`** = `jest --onlyChanged` (testes afetados pelas mudanças não commitadas, pelo grafo de dependências). Funciona no PowerShell e no Git Bash. Confirmar que, ao mexer num componente de `src/components`, ele roda o teste do componente e os de quem o importa.
- [ ] **DoD, loop por tarefa**: o passo de testes passa a ter `npm run test:related` como padrão, com a mesma frase dos irmãos; `npx jest <caminho>` / `-t` e `npx jest --findRelatedTests <arquivos>` ficam como alternativa. `docs/testing-guide.md` explica. Conferir `CLAUDE.md`, `AGENTS.md` e `README.md` por instruções conflitantes.
- [ ] **Medição depois** e suite verde (53/53, nenhum `skip`); `npm run check` verde, reportado N/N.

## Fora do escopo

- Mudar a config do Jest além do script, o Maestro, o hook de pre-push ou o typecheck.
- Commitar `TASKS.md` ou `docs/specs/`.
