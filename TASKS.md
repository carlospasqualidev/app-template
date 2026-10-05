# TASKS

Estado da orquestração dos templates. Sem ticket no ProdHub: ids `TPL-N` locais, numerados em conjunto com o server-template e o frontend-template. Modelo em `D:\Development\ada-software-house\skills\TASKS.md`.

Rodada 5, "guardrails de teste e docs" (2026-10-02). Pedido do dono: trazer o ajuste de um colega (tópicos 2 e 3): banco de integração local e temporário com trava de host; DoD, guardrails e CLAUDE.md enxuto.

| id | titulo | status (TODO/DOING/DONE/BLOCKED) | agente | resumo 1 linha |
|---|---|---|---|---|
| TPL-29 | App / Docs / Definition of Done, guardrails e CLAUDE.md enxuto | DONE | reviewer | 2 revisões, 2 correções; CLAUDE.md 997 → 403, docs/ com DoD, guardrails, conventions, testing-guide; tarefa = card, entrega = ticket; docs/ no .prettierignore; check 53/53; commit e469bbb |

Rodada 6, "testes mais rápidos" (2026-10-05). Pedido do dono: reduzir o tempo de teste dos projetos feitos destes templates (e2e fora do loop por tarefa, testes relacionados, unit sem banco, reviewer sem reexecutar, Vitest ajustado, medição antes/depois).

| id | titulo | status (TODO/DOING/DONE/BLOCKED) | agente | resumo 1 linha |
|---|---|---|---|---|
| TPL-32 | App / Testes / Testes relacionados no loop por tarefa | DONE | reviewer | 3 revisões, 2 correções; test:related = jest --onlyChanged, padrão do loop no DoD (pega consumidores: text → 11 suítes, badge → 1); 0 testes ou "No tests found" não é verde (pós-commit --findRelatedTests, config/setup → npm test, só docs → 0/0 (só docs)); npm test ~18 s; check 53/53; commit 76a82e4 |
