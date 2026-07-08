import axios from "axios";
import { Platform } from "react-native";

import { env } from "@/lib/env";
import { toast } from "@/lib/toast";
import {
  hasResponseMessage,
  type ICatchHandler,
  type IThenHandler,
} from "@/services/api/types";

import { sessionUserRef } from "./sessionUserRef";

/**
 * Envia o erro para um serviço de log externo, se `EXPO_PUBLIC_ERROR_LOG_URL`
 * estiver configurado. Só dispara fora do dev. Nunca lança — falhas no reporte
 * não devem derrubar o app.
 */
export const sendErrorMessage = async ({ error }: { error: unknown }) => {
  if (__DEV__ || !env.EXPO_PUBLIC_ERROR_LOG_URL) {
    return;
  }

  const errorStack = error instanceof Error ? error.stack : String(error);
  const user = sessionUserRef.get();

  await axios
    .post(env.EXPO_PUBLIC_ERROR_LOG_URL, {
      projectName: env.EXPO_PUBLIC_PROJECT_NAME,
      environment: env.EXPO_PUBLIC_PROJECT_ENVIRONMENT,
      side: env.EXPO_PUBLIC_PROJECT_SIDE,
      errorStack,
      extraInfo: {
        platform: Platform.OS,
        user: user ? JSON.stringify(user) : "",
      },
    })
    .catch(() => undefined);
};

export const catchHandler = (err: ICatchHandler) => {
  const data = err.response?.data;

  if (hasResponseMessage(data)) {
    toast.error(data.message, { id: "errorToastId" });
    return;
  }

  if (err.response?.status) {
    toast.error(`Erro ${err.response.status}`, { id: "errorToastId" });
    return;
  }

  toast.error("Erro de comunicação", { id: "errorToastId" });
};

/**
 * Interceptor de sucesso. Se a resposta carrega `data.message`, exibe um toast
 * de sucesso automaticamente — pensado para confirmações de mutations
 * (criar/atualizar/excluir). Se a sua API anexa `message` em respostas de
 * listagem, ajuste o backend ou troque este interceptor por um opt-in por chamada.
 */
export const thenHandler = (res: IThenHandler) => {
  if (hasResponseMessage(res?.data)) {
    toast.success(res.data.message);
  }
};
