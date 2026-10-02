# Guardrails

O que nenhum agente faz sem aval explícito da pessoa dona do repositório. Vale em qualquer tarefa, inclusive para "ficar verde" ou "destravar" uma verificação. As regras de segurança de código (validação com Zod, tokens no `expo-secure-store`, object injection, LGPD e PII) estão na seção [Segurança](../CLAUDE.md#segurança) do `CLAUDE.md` e não se repetem aqui; o que torna uma tarefa e uma entrega prontas está em [`definition-of-done.md`](definition-of-done.md).

## Sem aval, não se faz

- **Push** de qualquer branch.
- **Abrir merge request / pull request.**
- **Editar `.claude/settings.json`** (permissões e hooks do agente).
- **Commitar `.env`/`.env.local`, segredo, keystore ou credencial do EAS.** O `.gitignore` cobre `.env`, `.env*.local`, `*.jks`, `*.p8`, `*.p12`, `*.key`, `*.pem` e `*.mobileprovision`; não force a inclusão. As credenciais do EAS (`credentials.json`, JSON de service account do Google Play ou do Firebase) **não** estão cobertas pelo `.gitignore` e nunca se commitam.
- **Apontar o app de teste para uma API remota.** No Jest, serviço externo como o cliente HTTP é mockado ([`testing-guide.md`](testing-guide.md)), e os fluxos Maestro rodam em modo fake de sessão, sem backend ([`.maestro/README.md`](../.maestro/README.md)); trocar isso por um backend real é decisão da pessoa.
- **Desligar teste, lint ou regra para ficar verde**: apagar ou enfraquecer teste, `eslint-disable` (inclusive o aviso de object injection), relaxar o `tsconfig`, pular hooks com `--no-verify`.
- **Deixar `it.skip`/`it.only`** (ou `describe.skip`/`only`, `test.skip`/`only`, `xit`, `fit`) no código.
- **`expo prebuild --clean`, ou mexer em `android/`/`ios/` gerados** sem necessidade. As pastas nativas são geradas (CNG) e não vão para o repo (ver Git e commits no `CLAUDE.md`).

## Quando o aval falta

Pare naquele ponto, entregue o que não depende dele e reporte o que precisa de aval, com o motivo em uma linha.
