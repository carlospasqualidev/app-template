import { AccessibilityInfo } from "react-native";
import { toast as sonnerToast } from "sonner-native";

type ToastOptions = Parameters<typeof sonnerToast.success>[1];

function announce(message: string, options?: ToastOptions): void {
  const description =
    options && typeof options.description === "string"
      ? options.description
      : undefined;

  AccessibilityInfo.announceForAccessibility(
    description ? `${message}. ${description}` : message,
  );
}

/**
 * Wrapper do sonner-native. Use sempre este `toast` (nunca importe de
 * `sonner-native` direto) para garantir o anúncio ao leitor de tela.
 */
export const toast = {
  success(message: string, options?: ToastOptions) {
    announce(message, options);
    return sonnerToast.success(message, options);
  },
  error(message: string, options?: ToastOptions) {
    announce(message, options);
    return sonnerToast.error(message, options);
  },
  info(message: string, options?: ToastOptions) {
    announce(message, options);
    return sonnerToast.info(message, options);
  },
  warning(message: string, options?: ToastOptions) {
    announce(message, options);
    return sonnerToast.warning(message, options);
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
};
