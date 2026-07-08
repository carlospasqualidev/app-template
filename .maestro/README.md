# E2E (Maestro)

Fluxos de ponta a ponta que exercitam o app real (modo fake de sessão, sem backend).

## Pré-requisitos

1. **Java JDK 11+** e **adb** (Android SDK) no PATH.
2. **Maestro CLI** instalado (não é npm):
   - macOS/Linux/WSL: `curl -fsSL "https://get.maestro.mobile.dev" | bash`
   - **Windows (sem WSL)**: baixe o `maestro.zip` do release (https://github.com/mobile-dev-inc/maestro/releases/latest), extraia em `C:\maestro` e adicione `C:\maestro\bin` ao PATH (`setx PATH "$env:PATH;C:\maestro\bin"`). Abra um novo terminal. Requer Java. (Windows nativo pode ser instável — o WSL é o caminho oficialmente suportado.)
2. **Emulador Android** (ou device) com o **dev build** instalado e rodando:
   `npx expo run:android` (uma vez), depois `npx expo start`.

## Rodar

```bash
maestro test .maestro           # todos os fluxos
maestro test .maestro/login.yaml
maestro studio                  # inspecionar/gravar fluxos interativamente
```

Ou via npm: `npm run test:e2e`.

## Fluxos

- `login.yaml` — autentica (qualquer e-mail válido + senha) e confere que entrou no app.
- `navigation.yaml` — reusa o login e alterna entre as abas Componentes / Feed / Perfil.
- `logout.yaml` — reusa o login, sai pelo Perfil e confere o retorno à tela de login.
- `deletePost.yaml` — no Feed, abre o `ConfirmDialog` de um post, testa cancelar e confirmar (sem assertar remoção permanente — o backend fake restaura o item no refetch).

## Seletores (aprendizados deste projeto)

Os fluxos miram por **texto visível / label de acessibilidade** (placeholders dos inputs, rótulos de aba, títulos de tela) — o mesmo caminho do leitor de tela. Ao mudar textos da UI, atualize os specs.

- **Maestro faz match COMPLETO do texto (regex ancorado)**, não "contém". Para casar uma descrição parcial (ex.: título "Feed" com descrição "Lista com TanStack Query + FlashList + skeleton."), use `.*`: `visible: "Lista com TanStack Query.*"`.
- **Título de tela ≠ rótulo do botão.** Se o título e o CTA tiverem o mesmo texto (ex.: tela "Entrar" + botão "Entrar"), o `tapOn` acerta o título (topo) e não o botão. Por isso o login usa título "Bem-vindo" e botão "Entrar".
- **Prompt de salvar senha (autofill / Samsung Pass)** cobre a tab bar após digitar a senha. O `login.yaml` fecha o diálogo condicionalmente (`when: visible: "Cancelar"`). Alternativa: desligar o autofill no device antes de rodar (`adb shell settings put secure autofill_service null`).
- Use `extendedWaitUntil` (não `assertVisible` seco) após transições/boot para tolerar o tempo do dev build (bundle frio do Metro).

## iOS

O `appId` aqui é o package Android (`com.adalovelace.dev.apptemplate`). Para iOS, defina `ios.bundleIdentifier` no `app.json` e ajuste o `appId` dos fluxos (ou mantenha por plataforma).
