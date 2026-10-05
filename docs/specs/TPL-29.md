# TPL-29: App / Docs / Definition of Done, guardrails e CLAUDE.md enxuto

Plataforma: mobile | Repositório: D:\Development\personal-projects\templates\app-template | Branch: main (sem RM)
Fontes: ajuste de um colega em outro projeto (`docs/definition-of-done.md` e `docs/guardrails.md` como fonte única do "pronto" e do escopo loop/fechamento; `CLAUDE.md` subdividido em `docs/conventions.md`, `docs/testing-guide.md`); levantamento de 2026-10-02. Cards irmãos: TPL-27 (server) e TPL-28 (frontend) — a estrutura de `definition-of-done.md` e `guardrails.md` deve ser a mesma nos três (seções: *Loop por tarefa*, *Fechamento*, *Como reportar*).

## Objetivo

Um agente ou pessoa sabe, num lugar só, o que torna uma tarefa pronta e o que nunca se faz; o `CLAUDE.md` deixa de ter 997 linhas e passa a apontar para guias lidos sob demanda.

## Situação atual (âncoras)

- `CLAUDE.md` com 997 linhas; `AGENTS.md` com 3 (aponta a doc do Expo v56). Não existe `docs/`.
- "Pronto" espalhado: `:55` (doc acompanha a mudança), `:304-310` (`npm run check` e fluxos Maestro `npm run test:e2e` no device).
- Blocos grandes: Testes `:279-352`, Convenções `:480-997` (HTTP `:575-692`, Formulários `:711-792`, Tema `:916-997`). JSX `:117-179` e Segurança `:192-266` são regras gerais e ficam. Datas `:793-802` é curta: vai junto com Convenções.
- Maestro roda em modo fake de sessão, sem backend (`.maestro/README.md:3`).

## Critério de pronto

- [ ] **`docs/definition-of-done.md`** com *Loop por tarefa* (typecheck, lint, testes Jest dos arquivos tocados com comando exato, doc acompanhando), *Fechamento* (uma vez por entrega, não por correção: `npm run check` completo e fluxos Maestro no device/emulador, placares N/N; o que bloqueia) e *Como reportar*. As regras saem do `CLAUDE.md`; lá fica uma linha apontando.
- [ ] **`docs/guardrails.md`**: o que nenhum agente faz sem aval — push, abrir MR, editar `.claude/settings.json`, commitar `.env`/segredo/keystore, apontar o app de teste para API remota, desligar teste/lint/regra para ficar verde, `it.skip`/`only` deixado no código, `expo prebuild --clean` ou mexer em `android/`/`ios/` gerados sem necessidade. Remete às regras de segurança do `CLAUDE.md` sem duplicar.
- [ ] **`docs/conventions.md`** recebe Convenções; **`docs/testing-guide.md`** recebe Testes. Texto movido, não reescrito: nenhuma regra se perde, exceto ajuste de títulos e referências cruzadas.
- [ ] O `CLAUDE.md` mantém o que vale para toda tarefa (stack, comportamento, linguagem, TypeScript, JSX, qualidade, error handling, segurança, git, estrutura) e ganha "Guias de referência": tabela *arquivo → quando ler*. Sem `@import`. Meta: ≤ ~450 linhas; reportar antes e depois.
- [ ] `AGENTS.md`, `README.md`, `.maestro/README.md` e referências a seções movidas apontam para o lugar novo.
- [ ] `npm run check` verde, N/N. Maestro não é obrigatório neste card (só documentação).

## Fora do escopo

- Mudar o conteúdo das regras. Fixar `TZ`.
- Commitar `TASKS.md` ou `docs/specs/`.
