import { z } from "zod";

/**
 * Schema das variáveis de ambiente expostas ao app (prefixo `EXPO_PUBLIC_`, que
 * o Expo injeta no bundle).
 *
 * A validação roda na primeira vez que o `env` é importado (ao usar o `api`): se
 * algo estiver ausente ou malformado, o app falha rápido com uma mensagem clara
 * em vez de quebrar silenciosamente em runtime.
 *
 * Ao adicionar uma nova env, declare-a aqui e em `.env.example`.
 */
const envSchema = z.object({
  /** URL base da API. Ex.: http://localhost:8080/api */
  EXPO_PUBLIC_API_URL: z.url(),
  /** Nome do projeto, usado em logs de erro. */
  EXPO_PUBLIC_PROJECT_NAME: z.string().min(1).default("App"),
  /** Ambiente lógico do projeto (ex.: Sandbox, Production). */
  EXPO_PUBLIC_PROJECT_ENVIRONMENT: z.string().optional(),
  /** Lado da aplicação (ex.: Client, Backoffice). */
  EXPO_PUBLIC_PROJECT_SIDE: z.string().optional(),
  /** Endpoint opcional para reporte de erros em produção. */
  EXPO_PUBLIC_ERROR_LOG_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.url().optional(),
  ),
});

// O Expo substitui `process.env.EXPO_PUBLIC_*` estaticamente no bundle — leia
// cada variável por nome literal, nunca por índice dinâmico.
const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_PROJECT_NAME: process.env.EXPO_PUBLIC_PROJECT_NAME,
  EXPO_PUBLIC_PROJECT_ENVIRONMENT: process.env.EXPO_PUBLIC_PROJECT_ENVIRONMENT,
  EXPO_PUBLIC_PROJECT_SIDE: process.env.EXPO_PUBLIC_PROJECT_SIDE,
  EXPO_PUBLIC_ERROR_LOG_URL: process.env.EXPO_PUBLIC_ERROR_LOG_URL,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");

  console.error(`Variáveis de ambiente inválidas:\n${details}`);
  throw new Error(
    "Variáveis de ambiente inválidas. Verifique seu arquivo .env (use .env.example como base).",
  );
}

export const env = parsed.data;
