# TPL-32: handoff

## Alteracoes

- `package.json`: script `test:related` = `jest --onlyChanged`. Nenhuma outra mudanca de config do Jest.
- `docs/definition-of-done.md`: passo 3 do loop por tarefa passa a ter `npm run test:related` como padrao ("inclui os testes de quem importa o arquivo alterado"); `npx jest <caminho>`, `-t` e `npx jest --findRelatedTests <arquivos>` como alternativa. "Como reportar" cita o filtro novo.
- `docs/testing-guide.md`: comando listado e paragrafo explicando o grafo, os limites (sem mudanca nao commitada nao roda nada; depois do commit usar `--findRelatedTests`; mudanca em config/setup nao dispara a suite, rodar `npm test`).
- `README.md`: linha do script na tabela. `CLAUDE.md` e `AGENTS.md` sem instrucao conflitante (so apontam para o DoD e o guia).

## Prova de que pega consumidores

- Linha temporaria em `src/components/text/text.tsx`: `--listTests` e a execucao rodaram 11 suites / 32 testes (text, button, avatar, badge, card, confirmDialog, empty, field, modal, screen, textField). Arquivo restaurado, sha1 identico ao original.
- Linha temporaria em `src/components/badge/badge.tsx`: so `badge.test.tsx` (1 suite / 2 testes). Restaurado, sha1 identico.
- Teste novo nao rastreado e detectado; mudanca so em `src/tests/setup.ts` nao seleciona suites (documentado). Sem mudanca de codigo: "No tests found related to files changed since last commit.", exit 0.
- Rodado no Git Bash e no PowerShell (`npm run test:related`, exit 0 nos dois).

## Medicao (tempo de parede, maquina com outras suites em paralelo)

| Comando | Antes | Depois |
| --- | --- | --- |
| `npm test` (18 suites / 53 testes) | 102 s (1a, cache frio), 23 s, 16 s | 18 s, 19 s |
| `npx jest src/tests/components/button` | 2,5 s, 2,6 s | 5,8 s (contencao) |
| `npm run test:related`, mudanca em `badge` | n/a | 7,2 s, 6,1 s |
| `npm run test:related`, mudanca em `text` | n/a | 13 s, 16 s (Bash), 15 s (PowerShell) |
| `npm run test:related`, sem mudanca | n/a | 5 s |

## Observacoes

- `--onlyChanged` tem custo fixo de ~3-5 s (git + mapa de dependencias). Ganho real quando a mudanca e folha (badge: ~6 s contra ~17 s da suite); em componente-base como `text` o ganho e pequeno, porque mais da metade da suite depende dele.
- `npm run check` verde: 53/53, lint com 1 warning preexistente em `src/services/api/api.ts` (`import/no-named-as-default-member`), fora do escopo.
- Rodadas de correcao: (1) DoD passo 3 e testing-guide avisam que 0 testes / "No tests found" nao e verde, "Como reportar" pede N/N do `test:related`, numeros do run frio/quente trocados pela medicao de 2026-10-05; (2) DoD passo 3 e "Como reportar" pedem `test:related 0/0 (só docs)` em mudanca so de documentacao.
- Ambiente: nenhuma variavel ou config do Expo alterada. Maestro nao se aplica (sem mudanca de UI).
