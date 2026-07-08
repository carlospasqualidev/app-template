/**
 * Shape parcial das respostas/erros do axios consumidos pelos interceptors.
 * Mantemos `data` como `unknown` para evitar mentir ao consumidor — quem usa
 * faz o narrow defensivo antes de acessar `message`.
 */
export interface ICatchHandler {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export interface IThenHandler {
  data?: unknown;
}

/** Type guard: a resposta carrega `data.message: string`? */
export function hasResponseMessage(
  value: unknown,
): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as { message: unknown }).message === "string"
  );
}
